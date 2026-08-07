import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  Lightbulb,
  Quote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SourceBadge } from "@/components/shared/source-badge";
import { KnowledgeCard } from "@/components/shared/knowledge-card";
import { getKnowledgeItemServer, listKnowledgeItemsServer } from "@/lib/api/knowledge-server";
import { CollectionStatus } from "@/components/library/collection-status";
import { DeleteItemButton } from "@/components/library/delete-item-button";

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getKnowledgeItemServer(id).catch(() => null);
  if (!item) notFound();

  const all = await listKnowledgeItemsServer().catch(() => []);
  const related = all.filter(
    (k) =>
      k.id !== item.id &&
      (item.connections.includes(k.id) || k.id === item.suggestedNext)
  );
  const next = all.find((k) => k.id === item.suggestedNext);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 -ml-2"
        render={<Link href="/library" />}
      >
        <ArrowLeft className="size-3.5" />
        Library
      </Button>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <SourceBadge source={item.source} />
          <span> · </span>
          <span>{item.author || "Pending"}</span>
          {item.readingTime > 0 && (
            <>
              <span> · </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden />
                {item.readingTime} min
              </span>
            </>
          )}
          <Badge variant="secondary" className="capitalize text-[10px]">
            {item.difficulty}
          </Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance leading-tight">
          {item.title}
        </h1>
        {item.notes && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your note: {item.notes}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {item.url !== "#" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              render={
                <a href={item.url} target="_blank" rel="noreferrer" />
              }
            >
              Open original
              <ExternalLink className="size-3.5" />
            </Button>
          )}
          <DeleteItemButton itemId={item.id} itemTitle={item.title} />
        </div>
      </header>

      {!item.processed && <CollectionStatus initialItem={item} />}

      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt=""
          className="w-full max-h-72 object-cover rounded-2xl border border-border/60"
        />
      )}

      <section className="rounded-2xl border border-border/80 bg-card/50 p-6 space-y-3">
        <h2 className="text-sm font-medium text-primary">AI Summary</h2>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          {item.summary ||
            "Your summary will appear here once processing finishes."}
        </p>
      </section>

      {item.takeaways.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Key Takeaways</h2>
          <ul className="space-y-2">
            {item.takeaways.map((t) => (
              <li
                key={t}
                className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm leading-relaxed"
              >
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {item.quotes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Important Quotes</h2>
          {item.quotes.map((q) => (
            <blockquote
              key={q}
              className="rounded-xl border border-border/60 bg-card/40 px-5 py-4"
            >
              <Quote className="size-4 text-primary/50 mb-2" aria-hidden />
              <p className="text-sm italic leading-relaxed text-foreground/90">
                &ldquo;{q}&rdquo;
              </p>
            </blockquote>
          ))}
        </section>
      )}

      {(item.whyItMatters || item.processed) && (
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Lightbulb
              className="size-4 shrink-0 text-primary mt-0.5"
              aria-hidden
            />
            <div>
              <h2 className="text-sm font-medium">Why it matters</h2>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {item.whyItMatters || "—"}
              </p>
            </div>
          </div>
        </section>
      )}

      {(item.tags.length > 0 || item.topics.length > 0) && (
        <div className="flex flex-wrap gap-4">
          {item.tags.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {item.topics.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Related topics</p>
              <div className="flex flex-wrap gap-1.5">
                {item.topics.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      {next && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Suggested next read</h2>
          <Link
            href={`/library/${next.id}`}
            className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-card/50 p-4 transition-colors hover:border-primary/30 focus-ring"
          >
            <div>
              <p className="text-sm font-medium">{next.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {next.summary}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Connections</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <KnowledgeCard key={r.id} item={r} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
