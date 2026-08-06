"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiError, getKnowledgeItem, processKnowledgeItem } from "@/lib/api";
import type { KnowledgeItem } from "@/types";

function isPending(item: KnowledgeItem) {
  if (item.processed || item.status === "ready") return false;
  if (item.status === "failed") return false;
  return true;
}

function isWorking(item: KnowledgeItem) {
  return isPending(item);
}

function statusLabel(item: KnowledgeItem) {
  if (item.processed || item.status === "ready") return "Ready";
  if (item.status === "failed") return "Processing failed";
  if (item.hasContent || item.status === "collected") return "Summarizing…";
  if (item.status === "processing") return "Collecting…";
  return "Queued";
}

function statusDetail(item: KnowledgeItem) {
  if (item.status === "failed") {
    return (
      item.fetchError ||
      "Something went wrong while processing this link. You can retry."
    );
  }
  if (item.hasContent || item.status === "collected") {
    return "Building your AI summary and takeaways…";
  }
  if (item.status === "processing") {
    return "Fetching the page content…";
  }
  return "Waiting to process…";
}

/**
 * Polls while Collector + Summarizer run; offers retry on failure.
 */
export function CollectionStatus({
  initialItem,
}: {
  initialItem: KnowledgeItem;
}) {
  const router = useRouter();
  const [item, setItem] = useState(initialItem);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  useEffect(() => {
    if (!isPending(item)) return;

    let cancelled = false;
    const tick = async () => {
      try {
        const next = await getKnowledgeItem(item.id);
        if (cancelled || !next) return;
        setItem(next);
        if (!isPending(next)) {
          router.refresh();
        }
      } catch {
        // keep polling; transient errors are fine
      }
    };

    const id = window.setInterval(tick, 2000);
    void tick();
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [item.id, item.hasContent, item.processed, item.status, router]);

  const retry = () => {
    startTransition(async () => {
      try {
        const next = await processKnowledgeItem(item.id);
        setItem(next);
        router.refresh();
        toast.success(
          next.processed ? "Summary ready" : "Processing finished"
        );
      } catch (err) {
        toast.error(
          err instanceof ApiError ? err.message : "Could not re-process this item"
        );
      }
    });
  };

  if (item.processed || item.status === "ready") return null;

  const working = isWorking(item);
  const failed = item.status === "failed";

  return (
    <div
      className="rounded-2xl border border-border/80 bg-muted/20 px-4 py-3 flex flex-wrap items-center gap-3"
      aria-live="polite"
    >
      <Badge
        variant="outline"
        className={
          failed
            ? "text-[10px] border-destructive/40 text-destructive"
            : "text-[10px] border-warning/40 text-warning"
        }
      >
        {working && (
          <Loader2 className="mr-1 size-3 animate-spin" aria-hidden />
        )}
        {statusLabel(item)}
      </Badge>
      <p className="text-sm text-muted-foreground flex-1 min-w-[12rem]">
        {statusDetail(item)}
      </p>
      {failed && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          disabled={pending}
          onClick={retry}
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          Retry
        </Button>
      )}
    </div>
  );
}
