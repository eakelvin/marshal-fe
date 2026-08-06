import type { Difficulty, KnowledgeItem, KnowledgeSource } from "@/types";

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  "article",
  "youtube",
  "tweet",
  "paper",
  "github",
  "podcast",
  "blog",
  "document",
];

export type KnowledgeStatus =
  | "queued"
  | "processing"
  | "collected"
  | "ready"
  | "failed";

export type CreateKnowledgeInput = {
  url: string;
  source?: KnowledgeSource;
  notes?: string;
};

/** Row shape from public.knowledge_items */
export type KnowledgeItemRow = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  source: string;
  notes: string | null;
  author: string;
  summary: string;
  takeaways: string[] | null;
  quotes: string[] | null;
  tags: string[] | null;
  topics: string[] | null;
  difficulty: string;
  reading_time: number;
  why_it_matters: string;
  connections: string[] | null;
  suggested_next: string | null;
  image: string | null;
  collection_ids: string[] | null;
  processed: boolean;
  status: string;
  content_text: string | null;
  description: string | null;
  fetch_error: string | null;
  created_at: string;
  updated_at: string;
};

export function isKnowledgeSource(value: unknown): value is KnowledgeSource {
  return (
    typeof value === "string" &&
    (KNOWLEDGE_SOURCES as readonly string[]).includes(value)
  );
}

export function parseCreateKnowledgeInput(
  input: unknown
): CreateKnowledgeInput | null {
  if (!input || typeof input !== "object") return null;
  const body = input as Record<string, unknown>;
  const raw = typeof body.url === "string" ? body.url.trim() : "";
  const url = normalizeUrl(raw);
  if (!url) return null;

  const source = isKnowledgeSource(body.source)
    ? body.source
    : guessSourceFromUrl(url);

  const notes =
    typeof body.notes === "string" && body.notes.trim()
      ? body.notes.trim()
      : undefined;

  return { url, source, notes };
}

/** Accept full URLs or bare hosts like example.com / www.example.com. */
export function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  if (!isValidHttpUrl(withProtocol)) return null;

  try {
    const parsed = new URL(withProtocol);
    // Reject scheme-only or host-less strings after normalization
    if (!parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function guessSourceFromUrl(url: string): KnowledgeSource {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
  if (host.includes("github.com")) return "github";
  if (host.includes("twitter.com") || host === "x.com") return "tweet";
  if (host.includes("spotify.com") || host.includes("podcast")) return "podcast";
  if (host.includes("arxiv.org") || host.includes("doi.org")) return "paper";
  return "article";
}

export function titleFromUrl(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.replace(/^www\./, "");
    const slug = pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/[-_]/g, " ");
    if (slug && slug.length > 2) {
      return slug.replace(/\.[a-z0-9]+$/i, "");
    }
    return host;
  } catch {
    return url;
  }
}

function asDifficulty(value: string): Difficulty {
  if (value === "beginner" || value === "advanced") return value;
  return "intermediate";
}

function asSource(value: string): KnowledgeSource {
  return isKnowledgeSource(value) ? value : "article";
}

export function mapKnowledgeRow(row: KnowledgeItemRow): KnowledgeItem {
  const status =
    (row.status as KnowledgeStatus) ||
    (row.processed ? "ready" : "queued");

  const hasContent = Boolean(row.content_text?.trim());
  let summary = row.summary;
  if (!summary) {
    if (row.processed || status === "ready") summary = "";
    else if (status === "failed")
      summary = row.fetch_error
        ? `Processing failed: ${row.fetch_error}`
        : "Processing failed. You can retry from this page.";
    else if (hasContent || status === "collected")
      summary = "Summarizing…";
    else summary = "Collecting content…";
  }

  return {
    id: row.id,
    title: row.title || titleFromUrl(row.url),
    url: row.url,
    source: asSource(row.source),
    author: row.author || (hasContent ? "Unknown" : "Pending"),
    summary,
    takeaways: row.takeaways ?? [],
    quotes: row.quotes ?? [],
    tags: row.tags ?? [],
    topics: row.topics ?? [],
    difficulty: asDifficulty(row.difficulty),
    readingTime: row.reading_time ?? 0,
    whyItMatters: row.why_it_matters ?? "",
    connections: (row.connections ?? []).map(String),
    suggestedNext: row.suggested_next ?? undefined,
    savedAt: row.created_at,
    processed: row.processed,
    image: row.image ?? undefined,
    collectionIds: (row.collection_ids ?? []).map(String),
    notes: row.notes ?? undefined,
    status,
    description: row.description ?? undefined,
    hasContent,
    fetchError: row.fetch_error ?? undefined,
  };
}
