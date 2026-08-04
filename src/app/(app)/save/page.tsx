"use client";

import { useState } from "react";
import { Link2, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KnowledgeSource } from "@/types";

const sources: { id: KnowledgeSource; label: string }[] = [
  { id: "article", label: "Article" },
  { id: "youtube", label: "YouTube" },
  { id: "tweet", label: "X / Tweet" },
  { id: "paper", label: "Paper" },
  { id: "github", label: "GitHub" },
  { id: "podcast", label: "Podcast" },
  { id: "blog", label: "Blog" },
  { id: "document", label: "Document" },
];

export default function SavePage() {
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [source, setSource] = useState<KnowledgeSource>("article");
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);

  const save = async () => {
    if (!url.trim()) {
      toast.error("Paste a URL to save");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setProcessing(true);
    toast.success("Saved  -  AI agents are processing");
    await new Promise((r) => setTimeout(r, 1800));
    setProcessing(false);
    toast.success("Summary ready", {
      description: "Open Library to review your new knowledge card.",
    });
    setUrl("");
    setNotes("");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Save knowledge</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Drop a link. Agents collect, summarize, classify, and connect - usually in seconds.
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/50 p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="pl-9 h-10"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") save();
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Source type</Label>
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSource(s.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors focus-ring",
                  source === s.id
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why are you saving this? Any context for your future self..."
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" className="gap-1.5" type="button">
            <Upload className="size-3.5" />
            Upload document
          </Button>
          <Button onClick={save} disabled={saving || processing} className="gap-1.5 min-w-32">
            {saving || processing ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {saving ? "Saving..." : "AI processing..."}
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                Save & process
              </>
            )}
          </Button>
        </div>
      </div>

      {processing && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4" role="status" aria-live="polite">
          <p className="text-sm font-medium flex items-center gap-2">
            <Loader2 className="size-4 animate-spin text-primary" />
            Agents at work
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li>[done] Collector fetched content</li>
            <li className="text-primary">[running] Summarizer extracting takeaways...</li>
            <li>[queued] Classifier queued</li>
            <li>[queued] Graph agent waiting</li>
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-dashed border-border/80 p-5">
        <p className="text-sm font-medium">Keyboard tip</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Press <Badge variant="outline" className="mx-1 text-[10px]">Cmd+S</Badge> anywhere to jump here, then{" "}
          <Badge variant="outline" className="mx-1 text-[10px]">Cmd+Enter</Badge> to save.
        </p>
      </div>
    </div>
  );
}
