import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { env, useProductFixtures } from "@/lib/config/env";
import { collections } from "@/lib/data/mock";
import type { Collection } from "@/types";

export async function listCollections(): Promise<Collection[]> {
  if (useProductFixtures()) return collections;
  if (env.apiProvider === "supabase") return [];
  const data = await api<{ collections: Collection[] }>("/v1/collections");
  return data.collections;
}

export async function getCollection(id: string): Promise<Collection | null> {
  if (useProductFixtures()) {
    return collections.find((c) => c.id === id) ?? null;
  }
  if (env.apiProvider === "supabase") return null;
  try {
    const data = await api<{ collection: Collection }>(`/v1/collections/${id}`);
    return data.collection;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
