import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { CreateKnowledgeInput } from "@/lib/api/knowledge-schema";
import { env, useProductFixtures } from "@/lib/config/env";
import { knowledgeItems } from "@/lib/data/mock";
import type { KnowledgeItem } from "@/types";

/**
 * Client-safe knowledge API (browser → Next /api/v1/items).
 * Server Components / route handlers must use `@/lib/api/knowledge-server`
 * — relative fetch URLs fail in Node.
 */
async function clientApiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  if (typeof window === "undefined") {
    throw new Error(
      `list/get/create knowledge via relative "${path}" is browser-only; use knowledge-server on the server`
    );
  }

  const res = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    credentials: "include",
  });

  let data: T & { message?: string } = {} as T & { message?: string };
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text) as T & { message?: string };
    } catch {
      throw new ApiError(text.slice(0, 200) || "Invalid response", res.status);
    }
  }

  if (!res.ok) {
    throw new ApiError(
      data.message || res.statusText || "Request failed",
      res.status,
      data
    );
  }

  return data;
}

export async function createKnowledgeItem(
  input: CreateKnowledgeInput
): Promise<KnowledgeItem> {
  if (useProductFixtures()) {
    return {
      id: `k-mock-${Date.now()}`,
      title: input.url,
      url: input.url,
      source: input.source ?? "article",
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
      collectionIds: [],
      notes: input.notes,
      status: "queued",
    };
  }

  if (env.apiProvider === "supabase") {
    const data = await clientApiFetch<{ item: KnowledgeItem }>("/api/v1/items", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return data.item;
  }

  const data = await api<{ item: KnowledgeItem }>("/v1/items", {
    method: "POST",
    body: input,
  });
  return data.item;
}

export async function listKnowledgeItems(): Promise<KnowledgeItem[]> {
  if (useProductFixtures()) return knowledgeItems;

  if (env.apiProvider === "supabase") {
    const data = await clientApiFetch<{ items: KnowledgeItem[] }>(
      "/api/v1/items"
    );
    return data.items;
  }

  const data = await api<{ items: KnowledgeItem[] }>("/v1/items");
  return data.items;
}

export async function getKnowledgeItem(
  id: string
): Promise<KnowledgeItem | null> {
  if (useProductFixtures()) {
    return knowledgeItems.find((item) => item.id === id) ?? null;
  }

  if (env.apiProvider === "supabase") {
    try {
      const data = await clientApiFetch<{ item: KnowledgeItem }>(
        `/api/v1/items/${id}`
      );
      return data.item;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  }

  try {
    const data = await api<{ item: KnowledgeItem }>(`/v1/items/${id}`);
    return data.item;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function deleteKnowledgeItem(id: string): Promise<void> {
  if (useProductFixtures()) {
    const idx = knowledgeItems.findIndex((item) => item.id === id);
    if (idx === -1) throw new ApiError("Not found", 404);
    knowledgeItems.splice(idx, 1);
    return;
  }

  if (env.apiProvider === "supabase") {
    await clientApiFetch<Record<string, never>>(`/api/v1/items/${id}`, {
      method: "DELETE",
    });
    return;
  }

  await api(`/v1/items/${id}`, { method: "DELETE" });
}

/** Kick / retry Collector + Summarizer for an item. */
export async function processKnowledgeItem(
  id: string
): Promise<KnowledgeItem> {
  if (useProductFixtures()) {
    const item = knowledgeItems.find((k) => k.id === id);
    if (!item) throw new ApiError("Not found", 404);
    return {
      ...item,
      processed: true,
      status: "ready",
      hasContent: true,
      summary: item.summary || "Mock AI summary for local fixtures.",
    };
  }

  if (env.apiProvider === "supabase") {
    const data = await clientApiFetch<{ item: KnowledgeItem }>(
      `/api/v1/items/${id}/process`,
      { method: "POST" }
    );
    return data.item;
  }

  const data = await api<{ item: KnowledgeItem }>(`/v1/items/${id}/process`, {
    method: "POST",
  });
  return data.item;
}
