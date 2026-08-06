"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Plus, Bookmark } from "lucide-react";
import { KnowledgeCard } from "@/components/shared/knowledge-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listKnowledgeItems } from "@/lib/api";
import { sourceLabels } from "@/lib/data/mock";
import type { KnowledgeItem, KnowledgeSource } from "@/types";
import { cn } from "@/lib/utils";

const allSources = Object.keys(sourceLabels) as KnowledgeSource[];

export default function LibraryPage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<KnowledgeSource | "all">("all");

  useEffect(() => {
    let cancelled = false;
    listKnowledgeItems()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load your library");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSource = source === "all" || item.source === source;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.summary.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q);
      return matchSource && matchQuery;
    });
  }, [items, query, source]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Loading your knowledge…"
              : `${items.length} knowledge item${items.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex gap-2 sm:max-w-md w-full">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter library..."
            className="flex-1"
            aria-label="Filter library"
          />
          <Button size="sm" className="gap-1.5 shrink-0" render={<Link href="/save" />}>
            <Plus className="size-3.5" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-3.5 text-muted-foreground" aria-hidden />
        <Button
          size="xs"
          variant={source === "all" ? "default" : "outline"}
          onClick={() => setSource("all")}
        >
          All
        </Button>
        {allSources.map((s) => (
          <Button
            key={s}
            size="xs"
            variant={source === s ? "default" : "outline"}
            onClick={() => setSource(s)}
            className={cn("capitalize")}
          >
            {sourceLabels[s]}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="py-12 text-center text-sm text-destructive">{error}</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={items.length === 0 ? "Nothing saved yet" : "No matches"}
          description={
            items.length === 0
              ? "Paste a URL on Save to start your library."
              : "Try a different filter or search."
          }
          action={
            items.length === 0 ? (
              <Button size="sm" render={<Link href="/save" />}>
                Save a link
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((item) => (
            <KnowledgeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
