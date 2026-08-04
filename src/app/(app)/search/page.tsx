"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KnowledgeCard } from "@/components/shared/knowledge-card";
import { knowledgeItems, sourceLabels } from "@/lib/data/mock";
import type { KnowledgeSource } from "@/types";

const suggestions = [
  "How does attention relate to RAG?",
  "Calm UI patterns for dense dashboards",
  "Spaced repetition for papers I saved",
  "Show advanced AI systems content",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [semantic, setSemantic] = useState(true);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return knowledgeItems.filter((item) => {
      const matchSource = source === "all" || item.source === source;
      const matchDiff = difficulty === "all" || item.difficulty === difficulty;
      const text =
        `${item.title} ${item.summary} ${item.tags.join(" ")} ${item.topics.join(" ")} ${item.whyItMatters}`.toLowerCase();
      // Simulated semantic: also match related concepts
      const semanticBoost =
        semantic &&
        ((q.includes("attention") && text.includes("rag")) ||
          (q.includes("calm") && text.includes("design")) ||
          (q.includes("remember") && text.includes("repetition")));
      return matchSource && matchDiff && (text.includes(q) || semanticBoost || q.split(" ").some((w) => w.length > 3 && text.includes(w)));
    });
  }, [query, source, difficulty, semantic]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Instant keyword search or natural-language semantic search across your second brain.
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/50 p-4 sm:p-5 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything... e.g. connections between agents and retrieval"
            className="h-11 pl-9 pr-28"
            aria-label="Search knowledge"
            autoFocus
          />
          <Button
            size="sm"
            variant={semantic ? "default" : "outline"}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 gap-1"
            onClick={() => setSemantic((s) => !s)}
            aria-pressed={semantic}
          >
            <Sparkles className="size-3.5" />
            Semantic
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Source</Label>
            <Select value={source} onValueChange={(v) => setSource(v ?? "all")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {(Object.keys(sourceLabels) as KnowledgeSource[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {sourceLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v ?? "all")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Topic</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All topics</SelectItem>
                <SelectItem value="ai">Machine Learning</SelectItem>
                <SelectItem value="design">Design Systems</SelectItem>
                <SelectItem value="learn">Learning Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {!query && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            AI suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-border/80 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-ring"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            {semantic && (
              <Badge variant="secondary" className="text-[10px] gap-1">
                <Sparkles className="size-3" />
                Semantic
              </Badge>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((item) => (
              <KnowledgeCard key={item.id} item={item} />
            ))}
          </div>
          {results.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No matches. Try a broader phrase or toggle semantic search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
