import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { env, useProductFixtures } from "@/lib/config/env";
import { knowledgeItems } from "@/lib/data/mock";
import type { KnowledgeItem } from "@/types";

export async function listKnowledgeItems(): Promise<KnowledgeItem[]> {
  if (useProductFixtures()) return knowledgeItems;
  if (env.apiProvider === "supabase") return [];
  const data = await api<{ items: KnowledgeItem[] }>("/v1/items");
  return data.items;
}

export async function getKnowledgeItem(id: string): Promise<KnowledgeItem | null> {
  if (useProductFixtures()) {
    return knowledgeItems.find((item) => item.id === id) ?? null;
  }
  if (env.apiProvider === "supabase") return null;
  try {
    const data = await api<{ item: KnowledgeItem }>(`/v1/items/${id}`);
    return data.item;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function createKnowledgeItem(input: {
  url: string;
  collectionIds?: string[];
}): Promise<KnowledgeItem> {
  if (useProductFixtures()) {
    return {
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
  }
  if (env.apiProvider === "supabase") {
    throw new ApiError("Saving knowledge is not wired yet", 501);
  }
  const data = await api<{ item: KnowledgeItem }>("/v1/items", {
    method: "POST",
    body: input,
  });
  return data.item;
}
