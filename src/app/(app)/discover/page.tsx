import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KnowledgeCard } from "@/components/shared/knowledge-card";
import { collections, knowledgeItems } from "@/lib/data/mock";

export const metadata = { title: "Discover" };

const curators = [
  { name: "Maya Patel", role: "AI Researcher", followers: "12.4k" },
  { name: "Jordan Lee", role: "Product Designer", followers: "8.1k" },
  { name: "Sam Okonkwo", role: "Staff Engineer", followers: "6.7k" },
];

const topics = [
  "Knowledge Graphs",
  "RAG Systems",
  "Calm Design",
  "Spaced Repetition",
  "Agentic UI",
  "Learning Science",
];

export default function DiscoverPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Discover</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trending collections, curators, and AI recommendations beyond your library.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="size-3.5 text-primary" aria-hidden />
            Trending Collections
          </h2>
          <Button variant="ghost" size="sm" render={<Link href="/collections" />}>
            Browse all
            <ArrowRight className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections
            .filter((c) => c.visibility === "public" || c.visibility === "ai")
            .map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className="rounded-xl border border-border/80 bg-card/50 p-4 hover:border-primary/30 transition-colors focus-ring"
              >
                <div className={`mb-3 h-14 rounded-lg bg-gradient-to-br ${c.coverColor}`} />
                <p className="text-sm font-medium">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {c.description}
                </p>
              </Link>
            ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Top Curators</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {curators.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/50 p-4"
            >
              <Avatar>
                <AvatarFallback className="bg-primary/15 text-primary text-xs">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.role}  |  {c.followers}
                </p>
              </div>
              <Button size="xs" variant="outline">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Popular Topics</h2>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <Badge key={t} variant="secondary" className="px-3 py-1 text-xs font-normal">
              {t}
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">AI Recommendations</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {knowledgeItems.slice(0, 4).map((item) => (
            <KnowledgeCard key={item.id} item={item} compact />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Newest Knowledge</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {knowledgeItems.slice(4, 8).map((item) => (
            <KnowledgeCard key={item.id} item={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
