"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ApiError, createKnowledgeItem } from "@/lib/api";
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
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [source, setSource] = useState<KnowledgeSource>("article");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!url.trim()) {
      toast.error("Paste a URL to save");
      return;
    }
    if (saving) return;

    setSaving(true);
    try {
      const item = await createKnowledgeItem({
        url: url.trim(),
        source,
        notes: notes.trim() || undefined,
      });
      toast.success("Saved to your library", {
        description: "Collecting the page and building your summary…",
      });
      setUrl("");
      setNotes("");
      router.push(`/library/${item.id}`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "Sign in to save links"
          : err instanceof ApiError && err.status === 400
            ? err.message
            : "Could not save this URL. Try again.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Save knowledge</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Drop a link. We store it, collect the page, and draft an AI summary.
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/50 p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <div className="relative">
            <Link2
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="pl-9 h-10"
              disabled={saving}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") void save();
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
                disabled={saving}
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
            disabled={saving}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" className="gap-1.5" type="button" disabled>
            <Upload className="size-3.5" />
            Upload document
          </Button>
          <Button
            onClick={() => void save()}
            disabled={saving}
            className="gap-1.5 min-w-32"
          >
            {saving ? (
              <>
                <Spinner className="size-3.5" />
                Saving
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

      {saving && (
        <div
          className="rounded-xl border border-primary/30 bg-primary/5 p-4"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-medium flex items-center gap-2">
            <Spinner className="size-4 text-primary" />
            Saving to your library
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Collector and Summarizer will run in the background.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-dashed border-border/80 p-5">
        <p className="text-sm font-medium">Keyboard tip</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Press{" "}
          <Badge variant="outline" className="mx-1 text-[10px]">
            Cmd+S
          </Badge>{" "}
          anywhere to jump here, then{" "}
          <Badge variant="outline" className="mx-1 text-[10px]">
            Cmd+Enter
          </Badge>{" "}
          to save.
        </p>
      </div>
    </div>
  );
}
