import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { agents } from "@/lib/data/mock";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = agents.find((a) => a.id === id);
  if (!agent) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" render={<Link href="/agents" />}>
        <ArrowLeft className="size-3.5" />
        Agents
      </Button>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {agent.status}
          </Badge>
          <span className="text-xs text-muted-foreground">Last run {agent.lastRun}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{agent.name}</h1>
        <p className="text-muted-foreground leading-relaxed">{agent.description}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-card/50 p-4">
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className="mt-1 text-xl font-semibold">
            {Math.round(agent.confidence * 100)}%
          </p>
          <Progress value={agent.confidence * 100} className="mt-2 h-1.5" />
        </div>
        <div className="rounded-xl border border-border/80 bg-card/50 p-4">
          <p className="text-xs text-muted-foreground">Execution time</p>
          <p className="mt-1 text-xl font-semibold">{agent.executionTime}s</p>
        </div>
        <div className="rounded-xl border border-border/80 bg-card/50 p-4">
          <p className="text-xs text-muted-foreground">Actions logged</p>
          <p className="mt-1 text-xl font-semibold">{agent.recentActions.length}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Recent actions</h2>
        <ul className="space-y-2">
          {agent.recentActions.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
            >
              <span className="text-sm">{a.label}</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] capitalize", a.status === "running" && "text-sky-400")}
                >
                  {a.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{a.timestamp}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Logs</h2>
        <ScrollArea className="h-48 rounded-xl border border-border/80 bg-background/80">
          <pre className="p-4 font-mono text-xs text-muted-foreground leading-relaxed">
            {agent.logs.map((line, i) => (
              <div key={i}>
                <span className="text-primary/70">[{String(i + 1).padStart(2, "0")}]</span>{" "}
                {line}
              </div>
            ))}
          </pre>
        </ScrollArea>
      </section>
    </div>
  );
}
