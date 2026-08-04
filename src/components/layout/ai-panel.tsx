"use client";

import { useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = { role: "assistant" | "user"; content: string };

const starter = [
  "What should I review today?",
  "Summarize my AI Foundations collection",
  "Find connections between Calm UI and agents",
];

const seedMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Hi Alex - I've been watching your learning streak. You're deep into retrieval systems this week. Want a short quiz, a next-read suggestion, or a graph walkthrough?",
  },
];

export function AiPanel({
  open,
  onClose,
  className,
}: {
  open: boolean;
  onClose: () => void;
  className?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [input, setInput] = useState("");

  if (!open) return null;

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      {
        role: "assistant",
        content:
          "Based on your saves, I'd start with Scaling RAG in Production - it connects your attention notes to retrieval practice. I can also queue it into today's review.",
      },
    ]);
    setInput("");
  };

  return (
    <aside
      className={cn(
        "hidden xl:flex w-80 shrink-0 flex-col border-l border-border bg-card/40",
        className
      )}
      aria-label="AI Assistant"
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Sparkles className="size-3.5" aria-hidden />
          </span>
          <span className="text-sm font-medium">Coach</span>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={onClose} aria-label="Close AI panel">
          <X className="size-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl px-3 py-2.5 text-sm leading-relaxed",
                m.role === "assistant"
                  ? "bg-muted/60 text-foreground"
                  : "bg-primary/15 text-foreground ml-6"
              )}
            >
              {m.content}
            </div>
          ))}
        </div>
        {messages.length <= 1 && (
          <div className="mt-4 space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Try asking
            </p>
            {starter.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="block w-full rounded-lg border border-border/80 bg-background/50 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground focus-ring"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="border-t border-border p-3">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your second brain..."
            rows={2}
            className="resize-none pr-10 text-sm"
            aria-label="Message AI coach"
          />
          <Button
            type="submit"
            size="icon-xs"
            className="absolute bottom-2 right-2"
            aria-label="Send message"
          >
            <Send className="size-3.5" />
          </Button>
        </form>
      </div>
    </aside>
  );
}
