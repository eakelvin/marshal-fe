import "server-only";

import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import {
  guessSourceFromUrl,
  titleFromUrl,
} from "@/lib/api/knowledge-schema";
import type { KnowledgeSource } from "@/types";

const FETCH_TIMEOUT_MS = 15_000;
const MAX_HTML_BYTES = 2_000_000;
const MAX_CONTENT_CHARS = 80_000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; MarshalBot/0.1; +https://marshal.app)";

export type CollectedContent = {
  title: string;
  author: string;
  description: string;
  contentText: string;
  image?: string;
  readingTime: number;
  source: KnowledgeSource;
};

/**
 * Collector agent: fetch URL server-side and extract title / author / text.
 * Does not call an LLM — that's Phase C (Summarizer).
 */
export async function collectFromUrl(
  url: string,
  preferredSource?: KnowledgeSource
): Promise<CollectedContent> {
  assertSafeUrl(url);
  const source = preferredSource ?? guessSourceFromUrl(url);

  if (source === "youtube") {
    return collectYouTube(url, source);
  }

  return collectHtmlPage(url, source);
}

function assertSafeUrl(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http(s) URLs can be collected");
  }

  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
    host === "0.0.0.0" ||
    host === "169.254.169.254" ||
    host.startsWith("metadata.")
  ) {
    throw new Error("That URL cannot be collected");
  }
}

async function collectYouTube(
  url: string,
  source: KnowledgeSource
): Promise<CollectedContent> {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(oembedUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { Accept: "application/json", "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    // Fall back to HTML scrape of the watch page
    return collectHtmlPage(url, source);
  }

  const data = (await res.json()) as {
    title?: string;
    author_name?: string;
    thumbnail_url?: string;
  };

  const title = data.title?.trim() || titleFromUrl(url);
  const author = data.author_name?.trim() || "";
  const description = author ? `YouTube video by ${author}` : "YouTube video";
  const contentText = [title, description, url].filter(Boolean).join("\n\n");

  return {
    title,
    author,
    description,
    contentText,
    image: data.thumbnail_url,
    readingTime: 1,
    source,
  };
}

async function collectHtmlPage(
  url: string,
  source: KnowledgeSource
): Promise<CollectedContent> {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "User-Agent": USER_AGENT,
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`Could not fetch page (${res.status})`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (
    contentType &&
    !contentType.includes("html") &&
    !contentType.includes("xml") &&
    !contentType.includes("text/plain")
  ) {
    throw new Error("URL did not return HTML content");
  }

  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_HTML_BYTES) {
    throw new Error("Page is too large to collect");
  }

  const html = new TextDecoder("utf-8").decode(buf);
  const { document } = parseHTML(html);

  const meta = extractMeta(document, url);
  let articleTitle = "";
  let articleText = "";
  let articleByline = "";

  try {
    const reader = new Readability(document as unknown as Document, {
      charThreshold: 100,
    });
    const article = reader.parse();
    if (article) {
      articleTitle = article.title?.trim() || "";
      articleByline = article.byline?.trim() || "";
      articleText = htmlToPlainText(article.textContent || article.content || "");
    }
  } catch (error) {
    console.warn("[collector] Readability failed", error);
  }

  if (!articleText) {
    articleText = extractFallbackText(document);
  }

  const title =
    articleTitle ||
    meta.title ||
    meta.ogTitle ||
    titleFromUrl(url);

  const author =
    articleByline ||
    meta.author ||
    meta.ogAuthor ||
    "";

  const description =
    meta.description ||
    meta.ogDescription ||
    truncate(articleText, 280);

  const contentText = truncate(
    articleText || description || title,
    MAX_CONTENT_CHARS
  );

  if (!contentText.trim()) {
    throw new Error("Could not extract content from the page");
  }

  return {
    title: truncate(title, 300),
    author: truncate(author, 200),
    description: truncate(description, 500),
    contentText,
    image: meta.ogImage || meta.twitterImage,
    readingTime: estimateReadingTime(contentText),
    source,
  };
}

function extractMeta(
  document: {
    querySelector: (sel: string) => { getAttribute: (n: string) => string | null; textContent?: string | null } | null;
  },
  pageUrl: string
) {
  const content = (sel: string) =>
    document.querySelector(sel)?.getAttribute("content")?.trim() || "";

  const titleEl = document.querySelector("title");
  const title = titleEl?.textContent?.trim() || "";

  let ogImage = content('meta[property="og:image"]');
  if (ogImage) {
    try {
      ogImage = new URL(ogImage, pageUrl).toString();
    } catch {
      ogImage = "";
    }
  }

  let twitterImage = content('meta[name="twitter:image"]');
  if (twitterImage) {
    try {
      twitterImage = new URL(twitterImage, pageUrl).toString();
    } catch {
      twitterImage = "";
    }
  }

  return {
    title,
    description:
      content('meta[name="description"]') ||
      content('meta[property="og:description"]'),
    ogTitle: content('meta[property="og:title"]'),
    ogDescription: content('meta[property="og:description"]'),
    ogAuthor:
      content('meta[property="article:author"]') ||
      content('meta[name="author"]'),
    author: content('meta[name="author"]'),
    ogImage: ogImage || undefined,
    twitterImage: twitterImage || undefined,
  };
}

function extractFallbackText(document: {
  body?: { textContent?: string | null } | null;
  querySelector: (sel: string) => { textContent?: string | null } | null;
}): string {
  const main =
    document.querySelector("article")?.textContent ||
    document.querySelector("main")?.textContent ||
    document.body?.textContent ||
    "";
  return htmlToPlainText(main);
}

function htmlToPlainText(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}
