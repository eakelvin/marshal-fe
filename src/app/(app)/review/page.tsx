"use client";

import { useState } from "react";
import {
  Brain,
  Calendar,
  Check,
  ChevronRight,
  Layers,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { knowledgeItems } from "@/lib/data/mock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const quiz = [
  {
    q: "What does multi-head attention enable?",
    options: [
      "Faster tokenization",
      "Capturing different representation subspaces",
      "Smaller model size",
      "Removing positional encodings",
    ],
    answer: 1,
  },
  {
    q: "Why does hybrid search often beat pure vector search?",
    options: [
      "It uses more GPUs",
      "Better factual recall with keyword signals",
      "It skips reranking",
      "It stores less data",
    ],
    answer: 1,
  },
];

export default function ReviewPage() {
  const resurfaced = knowledgeItems.slice(1, 5);
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [reflection, setReflection] = useState("");

  const cards = resurfaced.map((k) => ({
    front: k.title,
    back: k.takeaways[0] ?? k.summary,
  }));

  const submitQuiz = (idx: number) => {
    setSelected(idx);
    if (idx === quiz[quizIndex].answer) {
      setScore((s) => s + 1);
      toast.success("Correct");
    } else {
      toast.error("Not quite  -  check the takeaways");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily, weekly, and monthly loops - spaced repetition, quizzes, and reflection.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Daily", due: 8, icon: RefreshCw },
          { label: "Weekly", due: 12, icon: Calendar },
          { label: "Monthly", due: 24, icon: Layers },
        ].map((r) => (
          <div
            key={r.label}
            className="rounded-xl border border-border/80 bg-card/50 p-4"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <r.icon className="size-3.5 text-primary" aria-hidden />
              {r.label} review
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{r.due}</p>
            <p className="text-xs text-muted-foreground">items due</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="resurfaced">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="resurfaced">Resurfaced</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">AI Quiz</TabsTrigger>
          <TabsTrigger value="reflect">Reflection</TabsTrigger>
        </TabsList>

        <TabsContent value="resurfaced" className="mt-4 space-y-3">
          <Progress value={35} className="h-1.5" aria-label="Review progress" />
          <p className="text-xs text-muted-foreground">3 of 8 reviewed today</p>
          {resurfaced.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border/80 bg-card/50 p-4"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-medium text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {item.summary}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0 capitalize">
                {item.difficulty}
              </Badge>
              <Button size="icon-sm" variant="ghost" aria-label="Mark reviewed">
                <Check className="size-4" />
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="flashcards" className="mt-4">
          <div className="mx-auto max-w-lg">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className={cn(
                "relative w-full min-h-56 rounded-2xl border border-border/80 p-8 text-left transition-all focus-ring",
                flipped ? "bg-primary/10 border-primary/30" : "bg-card/50"
              )}
              aria-label={flipped ? "Show front" : "Show back"}
            >
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
                {flipped ? "Takeaway" : "Prompt"}  |  {flashIndex + 1}/{cards.length}
              </p>
              <p className="text-lg font-medium leading-snug tracking-tight">
                {flipped ? cards[flashIndex].back : cards[flashIndex].front}
              </p>
              <p className="mt-6 text-xs text-muted-foreground">Click to flip</p>
            </button>
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={flashIndex === 0}
                onClick={() => {
                  setFlashIndex((i) => i - 1);
                  setFlipped(false);
                }}
              >
                Previous
              </Button>
              <Button
                size="sm"
                disabled={flashIndex >= cards.length - 1}
                onClick={() => {
                  setFlashIndex((i) => i + 1);
                  setFlipped(false);
                }}
                className="gap-1"
              >
                Next
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <div className="mx-auto max-w-lg rounded-2xl border border-border/80 bg-card/50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Brain className="size-3.5 text-primary" />
              Question {quizIndex + 1} of {quiz.length}  |  Score {score}
            </div>
            <p className="text-base font-medium leading-snug">{quiz[quizIndex].q}</p>
            <div className="space-y-2">
              {quiz[quizIndex].options.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  disabled={selected !== null}
                  onClick={() => submitQuiz(idx)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-ring",
                    selected === idx && idx === quiz[quizIndex].answer && "border-emerald-500/50 bg-emerald-500/10",
                    selected === idx && idx !== quiz[quizIndex].answer && "border-destructive/50 bg-destructive/10",
                    selected === null && "border-border hover:border-primary/40"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selected !== null && quizIndex < quiz.length - 1 && (
              <Button
                className="w-full"
                onClick={() => {
                  setQuizIndex((i) => i + 1);
                  setSelected(null);
                }}
              >
                Next question
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reflect" className="mt-4">
          <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-border/80 bg-card/50 p-6">
            <h2 className="font-medium">Weekly reflection</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              What insight from this week do you want to carry forward - and what will you practice next?
            </p>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={5}
              placeholder="Write freely. Autosaves as you type..."
            />
            <Button
              onClick={() => toast.success("Reflection saved")}
              disabled={!reflection.trim()}
            >
              Save reflection
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
