import "server-only";

import { collectFromUrl } from "@/lib/agents/collector";
import { summarizeContent } from "@/lib/agents/summarizer";
import {
  isKnowledgeSource,
  mapKnowledgeRow,
  parseCreateKnowledgeInput,
  titleFromUrl,
  type CreateKnowledgeInput,
  type KnowledgeItemRow,
} from "@/lib/api/knowledge-schema";
import { createClient } from "@/lib/supabase/server";
import type { KnowledgeItem, KnowledgeSource } from "@/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return { supabase, user };
}

export async function listKnowledgeItemsServer(): Promise<KnowledgeItem[]> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[knowledge-server] list", error);
    throw new Error(error.message);
  }

  return ((data ?? []) as KnowledgeItemRow[]).map(mapKnowledgeRow);
}

export async function getKnowledgeItemServer(
  id: string
): Promise<KnowledgeItem | null> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[knowledge-server] get", error);
    throw new Error(error.message);
  }

  return data ? mapKnowledgeRow(data as KnowledgeItemRow) : null;
}

export async function deleteKnowledgeItemServer(id: string): Promise<void> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("knowledge_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[knowledge-server] delete", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Item not found");
  }
}

export async function createKnowledgeItemServer(
  input: CreateKnowledgeInput
): Promise<KnowledgeItem> {
  const parsed = parseCreateKnowledgeInput(input);
  if (!parsed) {
    throw new Error("Enter a valid link (e.g. example.com or https://…)");
  }

  const { supabase, user } = await requireUser();
  const title = titleFromUrl(parsed.url);

  const { data, error } = await supabase
    .from("knowledge_items")
    .insert({
      user_id: user.id,
      url: parsed.url,
      title,
      source: parsed.source,
      notes: parsed.notes ?? null,
      author: "",
      summary: "",
      processed: false,
      status: "queued",
    })
    .select("*")
    .single();

  if (error) {
    console.error("[knowledge-server] insert", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Insert returned no row");
  }

  return mapKnowledgeRow(data as KnowledgeItemRow);
}

/**
 * Full enrichment pipeline: Collector (B) → Summarizer (C).
 * Skips re-fetch when content_text already exists (retry after summarize fail).
 */
export async function processKnowledgeItemServer(
  id: string
): Promise<KnowledgeItem> {
  const { supabase, user } = await requireUser();

  const { data: existing, error: loadError } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadError) {
    console.error("[knowledge-server] process load", loadError);
    throw new Error(loadError.message);
  }
  if (!existing) {
    throw new Error("Item not found");
  }

  let row = existing as KnowledgeItemRow;

  const { error: markError } = await supabase
    .from("knowledge_items")
    .update({
      status: "processing",
      fetch_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (markError) {
    console.error("[knowledge-server] mark processing", markError);
    throw new Error(markError.message);
  }

  try {
    // ── Phase B: Collector ─────────────────────────────────────
    if (!row.content_text?.trim()) {
      const preferredSource: KnowledgeSource | undefined = isKnowledgeSource(
        row.source
      )
        ? row.source
        : undefined;
      const collected = await collectFromUrl(row.url, preferredSource);

      const { data: collectedRow, error: collectError } = await supabase
        .from("knowledge_items")
        .update({
          title: collected.title,
          author: collected.author,
          source: collected.source,
          description: collected.description,
          content_text: collected.contentText,
          image: collected.image ?? null,
          reading_time: collected.readingTime,
          processed: false,
          status: "collected",
          fetch_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (collectError) {
        console.error("[knowledge-server] collect update", collectError);
        throw new Error(collectError.message);
      }

      row = collectedRow as KnowledgeItemRow;
    }

    // ── Phase C: Summarizer ────────────────────────────────────
    const { error: summarizingError } = await supabase
      .from("knowledge_items")
      .update({
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (summarizingError) {
      console.error("[knowledge-server] mark summarizing", summarizingError);
      throw new Error(summarizingError.message);
    }

    const enrichment = await summarizeContent({
      url: row.url,
      title: row.title,
      author: row.author || undefined,
      source: row.source,
      notes: row.notes ?? undefined,
      description: row.description ?? undefined,
      contentText: row.content_text || row.description || row.title,
    });

    const { data: readyRow, error: readyError } = await supabase
      .from("knowledge_items")
      .update({
        summary: enrichment.summary,
        takeaways: enrichment.takeaways,
        quotes: enrichment.quotes,
        tags: enrichment.tags,
        topics: enrichment.topics,
        difficulty: enrichment.difficulty,
        why_it_matters: enrichment.whyItMatters,
        processed: true,
        status: "ready",
        fetch_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (readyError) {
      console.error("[knowledge-server] summarize update", readyError);
      throw new Error(readyError.message);
    }

    return mapKnowledgeRow(readyRow as KnowledgeItemRow);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Processing failed";

    await supabase
      .from("knowledge_items")
      .update({
        status: "failed",
        fetch_error: message.slice(0, 500),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    console.error("[knowledge-server] process failed", id, message);
    throw new Error(message);
  }
}
