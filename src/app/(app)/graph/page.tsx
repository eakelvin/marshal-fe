"use client";

import { useCallback, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { graphEdges, graphNodes } from "@/lib/data/mock";
import { cn } from "@/lib/utils";

export default function GraphPage() {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>("n1");
  const [filter, setFilter] = useState<"all" | "idea" | "topic">("all");
  const drag = useRef<{ x: number; y: number } | null>(null);

  const nodes = graphNodes.filter(
    (n) => filter === "all" || n.type === filter
  );
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges = graphEdges.filter(
    (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  }, [offset]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return;
    setOffset({
      x: e.clientX - drag.current.x,
      y: e.clientY - drag.current.y,
    });
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  const selectedNode = graphNodes.find((n) => n.id === selected);
  const connected = edges
    .filter((e) => e.source === selected || e.target === selected)
    .map((e) => (e.source === selected ? e.target : e.source));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Knowledge Graph</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ideas as nodes. Relationships as edges. Pan, zoom, and explore.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "idea", "topic"] as const).map((f) => (
            <Button
              key={f}
              size="xs"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/30 h-[min(70vh,560px)]">
        <div className="absolute right-3 top-3 z-10 flex gap-1">
          <Button
            size="icon-xs"
            variant="secondary"
            aria-label="Zoom in"
            onClick={() => setScale((s) => Math.min(2, s + 0.15))}
          >
            <Plus className="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant="secondary"
            aria-label="Zoom out"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.15))}
          >
            <Minus className="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant="secondary"
            aria-label="Reset view"
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>

        <div
          className="h-full w-full cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="application"
          aria-label="Interactive knowledge graph"
        >
          <svg className="h-full w-full" viewBox="0 0 800 480">
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.68 0.17 265)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(0.68 0.17 265)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g transform={`translate(${offset.x / scale}, ${offset.y / scale}) scale(${scale})`}>
              {edges.map((e) => {
                const a = graphNodes.find((n) => n.id === e.source)!;
                const b = graphNodes.find((n) => n.id === e.target)!;
                const active =
                  selected && (e.source === selected || e.target === selected);
                return (
                  <line
                    key={e.id}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={active ? "oklch(0.68 0.17 265)" : "oklch(0.5 0.04 265 / 0.35)"}
                    strokeWidth={active ? 2 : 1 + e.strength}
                    strokeOpacity={active ? 0.9 : 0.5}
                  />
                );
              })}
              {nodes.map((n) => {
                const isSelected = selected === n.id;
                const isConnected = connected.includes(n.id);
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x}, ${n.y})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(n.id);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${n.label} ${n.type}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelected(n.id);
                    }}
                  >
                    {(isSelected || isConnected) && (
                      <circle r={n.size + 14} fill="url(#nodeGlow)" />
                    )}
                    <circle
                      r={n.size}
                      className={cn(
                        "transition-all",
                      )}
                      fill={
                        n.type === "topic"
                          ? "oklch(0.55 0.12 200)"
                          : "oklch(0.55 0.18 265)"
                      }
                      stroke={
                        isSelected
                          ? "oklch(0.85 0.1 265)"
                          : "oklch(1 0 0 / 15%)"
                      }
                      strokeWidth={isSelected ? 2.5 : 1}
                      opacity={selected && !isSelected && !isConnected ? 0.35 : 1}
                    />
                    <text
                      y={n.size + 16}
                      textAnchor="middle"
                      className="fill-foreground text-[11px] font-medium"
                      style={{ fill: "oklch(0.9 0.01 265)" }}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-72 rounded-xl border border-border/80 bg-background/90 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize text-[10px]">
                {selectedNode.type}
              </Badge>
              <p className="text-sm font-medium">{selectedNode.label}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Connected to {connected.length} related idea
              {connected.length === 1 ? "" : "s"}. Click nodes to explore the
              graph; drag to pan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
