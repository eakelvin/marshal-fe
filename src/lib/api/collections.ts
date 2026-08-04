import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { useMockData } from "@/lib/config/env";
import { collections } from "@/lib/data/mock";
import type { Collection } from "@/types";

export async function listCollections(): Promise<Collection[]> {
  if (useMockData()) {
    return collections;
  }
  const data = await api<{ collections: Collection[] }>("/v1/collections");
  return data.collections;
}

export async function getCollection(id: string): Promise<Collection | null> {
  if (useMockData()) {
    return collections.find((c) => c.id === id) ?? null;
  }
  try {
    const data = await api<{ collection: Collection }>(`/v1/collections/${id}`);
    return data.collection;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
