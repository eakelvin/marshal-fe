import Link from "next/link";
import { Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { agents } from "@/lib/data/mock";
import type { AgentStatus } from "@/types";
import { cn } from "@/lib/utils";

export const metadata = { title: "AI Agents" };

const statusStyles: Record<AgentStatus, string> = {
  idle: "bg-muted text-muted-foreground",
  running: "bg-sky-500/15 text-sky-400",
  success: "bg-emerald-500/15 text-emerald-400",
  error: "bg-destructive/15 text-destructive",
  queued: "bg-amber-500/15 text-amber-400",
};

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Agents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Status, activity, confidence, and logs for every curator in your stack.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="group rounded-2xl border border-border/80 bg-card/50 p-5 transition-all hover:border-primary/30 focus-ring"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-medium tracking-tight group-hover:text-primary transition-colors">
                {agent.name}
              </h2>
              <Badge
                className={cn(
                  "capitalize text-[10px] border-0",
                  statusStyles[agent.status]
                )}
              >
                {agent.status}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {agent.description}
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Confidence</span>
                <span>{Math.round(agent.confidence * 100)}%</span>
              </div>
              <Progress value={agent.confidence * 100} className="h-1.5" />
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" aria-hidden />
                {agent.executionTime}s
              </span>
              <span className="inline-flex items-center gap-1">
                <Activity className="size-3" aria-hidden />
                {agent.lastRun}
              </span>
            </div>

            <div className="mt-4 border-t border-border/60 pt-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                Recent
              </p>
              <ul className="space-y-1">
                {agent.recentActions.slice(0, 2).map((a) => (
                  <li key={a.id} className="text-xs text-muted-foreground truncate">
                    {a.label}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
