import "server-only";

import type { Difficulty } from "@/types";

export type SummarizerInput = {
  url: string;
  title: string;
  author?: string;
  source?: string;
  notes?: string;
  description?: string;
  contentText: string;
};

export type SummarizerResult = {
  summary: string;
  takeaways: string[];
  quotes: string[];
  tags: string[];
  topics: string[];
  difficulty: Difficulty;
  whyItMatters: string;
};

const MAX_CONTENT_FOR_LLM = 12_000;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: {
      type: "STRING",
      description: "2–4 sentence high-signal summary",
    },
    takeaways: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "3–6 concrete takeaways",
    },
    quotes: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "0–3 short verbatim quotes",
    },
    tags: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "3–8 short lowercase tags",
    },
    topics: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "1–4 broader topics",
    },
    difficulty: {
      type: "STRING",
      enum: ["beginner", "intermediate", "advanced"],
    },
    whyItMatters: {
      type: "STRING",
      description: "1–2 sentences on why a learner should care",
    },
  },
  required: [
    "summary",
    "takeaways",
    "quotes",
    "tags",
    "topics",
    "difficulty",
    "whyItMatters",
  ],
} as const;

/**
 * Summarizer / Classifier agent (Phase C).
 * Uses Google Gemini when GEMINI_API_KEY is set; otherwise a lightweight
 * extractive fallback so local/dev still completes.
 */
export async function summarizeContent(
  input: SummarizerInput
): Promise<SummarizerResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (apiKey) {
    return summarizeWithGemini(input, apiKey);
  }

  console.warn(
    "[summarizer] GEMINI_API_KEY missing — using extractive fallback"
  );
  return summarizeExtractive(input);
}

async function summarizeWithGemini(
  input: SummarizerInput,
  apiKey: string
): Promise<SummarizerResult> {
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const content = input.contentText.slice(0, MAX_CONTENT_FOR_LLM);

  const prompt = [
    "You are Marshal's Summarizer agent for a personal knowledge curator.",
    "Given a saved source, return concise, high-signal enrichment.",
    "Do not invent facts not supported by the content.",
    "",
    `URL: ${input.url}`,
    `Title: ${input.title}`,
    input.author ? `Author: ${input.author}` : null,
    input.source ? `Source type: ${input.source}` : null,
    input.notes ? `User notes: ${input.notes}` : null,
    input.description ? `Description: ${input.description}` : null,
    "",
    "Content:",
    content,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const url = new URL(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
  );
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
    signal: AbortSignal.timeout(45_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Gemini API error (${res.status})${text ? `: ${text.slice(0, 240)}` : ""}`
    );
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(`Gemini API error: ${data.error.message}`);
  }

  const raw = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!raw) {
    throw new Error("Gemini returned an empty response");
  }

  return parseSummarizerJson(raw);
}

function parseSummarizerJson(raw: string): SummarizerResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Summarizer returned invalid JSON");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Summarizer returned invalid JSON");
  }

  const body = parsed as Record<string, unknown>;
  const summary =
    typeof body.summary === "string" ? body.summary.trim() : "";
  if (!summary) {
    throw new Error("Summarizer omitted summary");
  }

  return {
    summary,
    takeaways: asStringArray(body.takeaways, 6),
    quotes: asStringArray(body.quotes, 3),
    tags: asStringArray(body.tags, 8).map((t) => t.toLowerCase()),
    topics: asStringArray(body.topics, 4),
    difficulty: asDifficulty(body.difficulty),
    whyItMatters:
      typeof body.whyItMatters === "string"
        ? body.whyItMatters.trim()
        : typeof body.why_it_matters === "string"
          ? body.why_it_matters.trim()
          : "",
  };
}

function asStringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, max);
}

function asDifficulty(value: unknown): Difficulty {
  if (value === "beginner" || value === "advanced") return value;
  return "intermediate";
}

/** Dev / no-key fallback — not a substitute for the LLM path. */
function summarizeExtractive(input: SummarizerInput): SummarizerResult {
  const text = input.contentText.replace(/\s+/g, " ").trim();
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);

  const summary =
    sentences.slice(0, 3).join(" ") ||
    input.description ||
    `${input.title} — saved from ${input.url}`;

  const takeaways = sentences.slice(0, 4).map((s) =>
    s.length > 180 ? `${s.slice(0, 177)}…` : s
  );

  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) ?? [];
  const stop = new Set([
    "that",
    "this",
    "with",
    "from",
    "your",
    "have",
    "will",
    "were",
    "been",
    "they",
    "their",
    "about",
    "which",
    "would",
    "there",
    "what",
    "when",
    "where",
    "into",
    "more",
    "also",
    "than",
    "then",
    "only",
    "other",
    "some",
    "such",
    "these",
    "those",
    "could",
    "should",
    "after",
    "before",
    "because",
    "while",
    "using",
    "used",
    "make",
    "made",
    "like",
    "just",
    "over",
    "very",
    "each",
    "many",
    "much",
    "most",
    "being",
  ]);
  const freq = new Map<string, number>();
  for (const w of words) {
    if (stop.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const tags = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);

  return {
    summary: summary.slice(0, 800),
    takeaways: takeaways.length ? takeaways : [summary.slice(0, 200)],
    quotes: [],
    tags,
    topics: tags.slice(0, 3),
    difficulty: "intermediate",
    whyItMatters: input.notes?.trim()
      ? `You saved this with a note: ${input.notes.trim()}`
      : "Captured for your library — add a Gemini API key for richer AI summaries.",
  };
}
