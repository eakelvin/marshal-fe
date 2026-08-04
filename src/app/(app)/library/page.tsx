"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { KnowledgeCard } from "@/components/shared/knowledge-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { knowledgeItems, sourceLabels } from "@/lib/data/mock";
import type { KnowledgeSource } from "@/types";
import { cn } from "@/lib/utils";

const allSources = Object.keys(sourceLabels) as KnowledgeSource[];

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<KnowledgeSource | "all">("all");

  const filtered = useMemo(() => {
    return knowledgeItems.filter((item) => {
      const matchSource = source === "all" || item.source === source;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.summary.toLowerCase().includes(q);
      return matchSource && matchQuery;
    });
  }, [query, source]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {knowledgeItems.length} knowledge items curated by your agents.
          </p>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter library..."
          className="sm:max-w-xs"
          aria-label="Filter library"
        />
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

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((item) => (
          <KnowledgeCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No items match your filters.
        </p>
      )}
    </div>
  );
}
