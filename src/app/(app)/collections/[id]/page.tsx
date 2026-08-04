import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KnowledgeCard } from "@/components/shared/knowledge-card";
import { collections, knowledgeItems } from "@/lib/data/mock";

export function generateStaticParams() {
  return collections.map((c) => ({ id: c.id }));
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = collections.find((c) => c.id === id);
  if (!collection) notFound();

  const items = knowledgeItems.filter((k) =>
    k.collectionIds.includes(collection.id)
  );

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" render={<Link href="/collections" />}>
        <ArrowLeft className="size-3.5" />
        Collections
      </Button>

      <div className={`rounded-2xl bg-gradient-to-br ${collection.coverColor} p-6 sm:p-8 border border-border/40`}>
        <Badge variant="secondary" className="capitalize text-[10px]">
          {collection.visibility}
        </Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{collection.name}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
          {collection.description}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          {collection.itemCount} items  |  Updated {collection.updatedAt}
          {collection.curator ? `  |  by ${collection.curator}` : ""}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <KnowledgeCard key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No items in this collection yet.
        </p>
      )}
    </div>
  );
}
