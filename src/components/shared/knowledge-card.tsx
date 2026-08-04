import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/shared/source-badge";
import type { KnowledgeItem } from "@/types";
import { cn } from "@/lib/utils";

export function KnowledgeCard({
  item,
  className,
  compact = false,
}: {
  item: KnowledgeItem;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/library/${item.id}`}
      className={cn(
        "group block rounded-xl border border-border/80 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-md hover:shadow-primary/5 focus-ring",
        compact && "p-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <SourceBadge source={item.source} />
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="size-3" aria-hidden />
          {item.readingTime} min
        </span>
      </div>
      <h3
        className={cn(
          "mt-2.5 font-medium leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors",
          compact ? "text-sm line-clamp-2" : "text-[15px] line-clamp-2"
        )}
      >
        {item.title}
      </h3>
      {!compact && (
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {item.summary}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {item.tags.slice(0, compact ? 2 : 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
            {tag}
          </Badge>
        ))}
        {!item.processed && (
          <Badge variant="outline" className="text-[10px] border-warning/40 text-warning">
            Processing
          </Badge>
        )}
        <ArrowUpRight
          className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </div>
    </Link>
  );
}
