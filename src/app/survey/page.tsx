"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, ClipboardList } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: "saveWhere",
    prompt: "Where do you save useful content?",
    hint: "Select all that apply",
    multi: true,
    options: [
      "Browser bookmarks",
      "Read-later apps",
      "Notion / docs",
      "Notes or screenshots",
      "Nowhere systematically",
      "Other",
    ],
  },
  {
    id: "afterSave",
    prompt: "What happens after you save it?",
    hint: "Pick the closest match",
    multi: false,
    options: [
      "I revisit and learn from it",
      "I organize it later — sometimes",
      "It sits unused",
      "I forget it exists",
      "I share it, then move on",
    ],
  },
  {
    id: "revisit",
    prompt: "How often do you revisit saved content?",
    hint: "Be honest",
    multi: false,
    options: ["Daily", "Weekly", "Monthly", "Rarely", "Almost never"],
  },
  {
    id: "frustration",
    prompt: "What frustrates you most?",
    hint: "Pick one",
    multi: false,
    options: [
      "I can't find things later",
      "No time to go back",
      "Everything gets messy",
      "I don't know what's worth revisiting",
      "Tools don't help me actually learn",
    ],
  },
  {
    id: "wouldPay",
    prompt: "Would you pay if your saved knowledge became genuinely useful again?",
    hint: "No commitment — curiosity only",
    multi: false,
    options: ["Yes", "Maybe — depends on price", "Not sure", "No"],
  },
] as const;

type AnswerMap = Record<string, string | string[]>;

export default function SurveyPage() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleMulti = (id: string, option: string) => {
    const current = (answers[id] as string[] | undefined) ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswers((prev) => ({ ...prev, [id]: next }));
  };

  const setSingle = (id: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const complete = questions.every((q) => {
    const value = answers[q.id];
    if (q.multi) return Array.isArray(value) && value.length > 0;
    return typeof value === "string" && value.length > 0;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!complete) return;
    // UI-only for now — wire to an API when ready
    console.info("survey responses", answers);
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-dvh flex flex-col">
      <div className="pointer-events-none absolute inset-0 gradient-mesh opacity-60" aria-hidden />
      <header className="relative z-10 flex items-center justify-between px-4 py-4 lg:px-8">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-start justify-center px-4 py-10 sm:items-center">
        <div className="w-full max-w-lg">
          {submitted ? (
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 text-center shadow-xl shadow-primary/5 backdrop-blur sm:p-8">
              <div className="mx-auto mb-6 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Check className="size-5" aria-hidden />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Thanks</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Your answers help shape Marshal. Takes under a minute — appreciated.
              </p>
              <Button className="mt-8 w-full" render={<Link href="/" />}>
                Back to home
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur sm:p-8"
            >
              <div className="mb-6 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardList className="size-5" aria-hidden />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Quick survey</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Five questions. About 60 seconds. Helps us understand how you save knowledge.
              </p>

              <div className="mt-8 space-y-8">
                {questions.map((q, index) => {
                  const selected = answers[q.id];
                  return (
                    <fieldset key={q.id} className="space-y-3">
                      <legend className="text-sm font-medium leading-snug">
                        <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                        {q.prompt}
                      </legend>
                      <p className="text-xs text-muted-foreground">{q.hint}</p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((option) => {
                          const isSelected = q.multi
                            ? Array.isArray(selected) && selected.includes(option)
                            : selected === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                q.multi
                                  ? toggleMulti(q.id, option)
                                  : setSingle(q.id, option)
                              }
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-left text-sm transition-colors focus-ring",
                                isSelected
                                  ? "border-primary bg-primary/15 text-primary"
                                  : "border-border text-muted-foreground hover:border-primary/40"
                              )}
                            >
                              {isSelected && (
                                <Check className="mr-1 inline size-3" aria-hidden />
                              )}
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </div>

              <Button type="submit" className="mt-8 w-full" disabled={!complete}>
                Submit answers
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Anonymous for now. No account required.
              </p>
            </form>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
