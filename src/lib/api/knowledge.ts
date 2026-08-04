import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { useMockData } from "@/lib/config/env";
import { knowledgeItems } from "@/lib/data/mock";
import type { KnowledgeItem } from "@/types";

/** List knowledge items (library). */
export async function listKnowledgeItems(): Promise<KnowledgeItem[]> {
  if (useMockData()) {
    return knowledgeItems;
  }
  const data = await api<{ items: KnowledgeItem[] }>("/v1/items");
  return data.items;
}

/** Get a single item by id. */
export async function getKnowledgeItem(id: string): Promise<KnowledgeItem | null> {
  if (useMockData()) {
    return knowledgeItems.find((item) => item.id === id) ?? null;
  }
  try {
    const data = await api<{ item: KnowledgeItem }>(`/v1/items/${id}`);
    return data.item;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** Quick-save a URL — agents process async on the backend. */
export async function createKnowledgeItem(input: {
  url: string;
  collectionIds?: string[];
}): Promise<KnowledgeItem> {
  if (useMockData()) {
    const item: KnowledgeItem = {
      id: `k-mock-${Date.now()}`,
      title: input.url,
      url: input.url,
      source: "article",
      author: "Pending",
      summary: "Processing…",
      takeaways: [],
      quotes: [],
      tags: [],
      topics: [],
      difficulty: "intermediate",
      readingTime: 0,
      whyItMatters: "",
      connections: [],
      savedAt: new Date().toISOString(),
      processed: false,
      collectionIds: input.collectionIds ?? [],
    };
    return item;
  }
  const data = await api<{ item: KnowledgeItem }>("/v1/items", {
    method: "POST",
    body: input,
  });
  return data.item;
}
