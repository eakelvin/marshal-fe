import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KnowledgeCard } from "@/components/shared/knowledge-card";
import {
  collections,
  currentUser,
  insights,
  knowledgeItems,
  weeklyProgress,
} from "@/lib/data/mock";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const recent = knowledgeItems.slice(0, 4);
  const today = knowledgeItems.filter((k) => k.processed).slice(0, 3);
  const recommended = [knowledgeItems[2], knowledgeItems[4], knowledgeItems[6]];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Good afternoon</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your second brain has {currentUser.itemsSaved} items ready. Keep the streak alive.
          </p>
        </div>
        <Button className="gap-1.5 shrink-0" render={<Link href="/save" />}>
          <Plus className="size-3.5" />
          Quick Save
        </Button>
      </section>

      {/* Stats row */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Learning streak",
            value: `${currentUser.streak} days`,
            icon: Flame,
            hint: "Personal best",
          },
          {
            label: "This week",
            value: "24 saves",
            icon: TrendingUp,
            hint: "+18% vs last week",
          },
          {
            label: "Reviews done",
            value: String(currentUser.reviewsCompleted),
            icon: Sparkles,
            hint: "12 due today",
          },
          {
            label: "Collections",
            value: String(collections.length),
            icon: Sparkles,
            hint: "2 AI-curated",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/80 bg-card/50 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <stat.icon className="size-3.5 text-primary" aria-hidden />
            </div>
            <p className="mt-2 text-xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Today's Learning */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-tight">Today&apos;s Learning</h2>
            <Button variant="ghost" size="sm" render={<Link href="/review" />}>
              Start review
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </Button>
          </div>
          <div className="space-y-3">
            {today.map((item) => (
              <KnowledgeCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Weekly + Streak side */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-medium tracking-tight">Weekly Progress</h2>
          <div className="rounded-xl border border-border/80 bg-card/50 p-4">
            <WeeklyChart data={weeklyProgress} />
          </div>

          <h2 className="text-sm font-medium tracking-tight pt-2">AI Insights</h2>
          <div className="space-y-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-xl border border-border/80 bg-card/50 p-4"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm font-medium leading-snug">{insight.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {insight.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recently Saved */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-tight">Recently Saved</h2>
          <Button variant="ghost" size="sm" render={<Link href="/library" />}>
            View library
            <ArrowRight className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {recent.map((item) => (
            <KnowledgeCard key={item.id} item={item} compact />
          ))}
        </div>
      </section>

      {/* Recommended + Collections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-sm font-medium tracking-tight">Recommended Knowledge</h2>
          <div className="space-y-3">
            {recommended.map((item) => (
              <KnowledgeCard key={item.id} item={item} compact />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-tight">Collections</h2>
            <Button variant="ghost" size="sm" render={<Link href="/collections" />}>
              See all
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {collections.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.id}`}
                className="group rounded-xl border border-border/80 bg-card/50 p-4 transition-all hover:border-primary/30 focus-ring"
              >
                <div
                  className={`mb-3 h-16 rounded-lg bg-gradient-to-br ${c.coverColor}`}
                />
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {c.name}
                  </p>
                  {c.visibility === "ai" && (
                    <Badge variant="secondary" className="text-[10px]">
                      AI
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.itemCount} items
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
