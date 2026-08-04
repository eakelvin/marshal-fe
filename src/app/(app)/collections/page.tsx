import type { ComponentType } from "react";
import Link from "next/link";
import { Lock, Pin, Share2, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collections } from "@/lib/data/mock";
import type { CollectionVisibility } from "@/types";

const visibilityIcon: Record<
  CollectionVisibility,
  ComponentType<{ className?: string }>
> = {
  public: Users,
  private: Lock,
  shared: Share2,
  ai: Sparkles,
  pinned: Pin,
};

export const metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Public, private, shared, AI-curated, and pinned boards.
          </p>
        </div>
        <Button size="sm">New collection</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => {
          const Icon = visibilityIcon[c.visibility];
          return (
            <Link
              key={c.id}
              href={`/collections/${c.id}`}
              className="group rounded-2xl border border-border/80 bg-card/50 overflow-hidden transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 focus-ring"
            >
              <div className={`h-28 bg-gradient-to-br ${c.coverColor}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium tracking-tight group-hover:text-primary transition-colors">
                    {c.name}
                  </h2>
                  <Badge variant="outline" className="gap-1 text-[10px] capitalize shrink-0">
                    <Icon className="size-3" aria-hidden />
                    {c.visibility}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {c.itemCount} items  |  Updated {c.updatedAt}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
