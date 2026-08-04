"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, ClipboardList } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, submitSurvey } from "@/lib/api";
import { SURVEY_OPTIONS, type SurveyAnswers } from "@/lib/api/survey-schema";
import { cn } from "@/lib/utils";

const questions: (
  | {
    id: "saveWhere";
    prompt: string;
    hint: string;
    multi: true;
    options: readonly string[];
  }
  | {
    id: "afterSave" | "revisit" | "frustration" | "wouldPay";
    prompt: string;
    hint: string;
    multi: false;
    options: readonly string[];
  }
)[] = [
    {
      id: "saveWhere",
      prompt: "Where do you save useful content?",
      hint: "Select all that apply",
      multi: true,
      options: SURVEY_OPTIONS.saveWhere,
    },
    {
      id: "afterSave",
      prompt: "What happens after you save it?",
      hint: "Pick the closest match",
      multi: false,
      options: SURVEY_OPTIONS.afterSave,
    },
    {
      id: "revisit",
      prompt: "How often do you revisit saved content?",
      hint: "Be honest",
      multi: false,
      options: SURVEY_OPTIONS.revisit,
    },
    {
      id: "frustration",
      prompt: "What frustrates you most?",
      hint: "Pick one",
      multi: false,
      options: SURVEY_OPTIONS.frustration,
    },
    {
      id: "wouldPay",
      prompt: "Would you pay if your saved knowledge became genuinely useful again?",
      hint: "No commitment — curiosity only",
      multi: false,
      options: SURVEY_OPTIONS.wouldPay,
    },
  ];

type AnswerMap = Partial<{
  saveWhere: string[];
  afterSave: string;
  revisit: string;
  frustration: string;
  wouldPay: string;
}>;

export default function SurveyPage() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMulti = (option: string) => {
    const current = answers.saveWhere ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswers((prev) => ({ ...prev, saveWhere: next }));
  };

  const setSingle = (
    id: "afterSave" | "revisit" | "frustration" | "wouldPay",
    option: string
  ) => {
    setAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const complete =
    (answers.saveWhere?.length ?? 0) > 0 &&
    !!answers.afterSave &&
    !!answers.revisit &&
    !!answers.frustration &&
    !!answers.wouldPay;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!complete || submitting) return;

    const payload: SurveyAnswers = {
      saveWhere: answers.saveWhere!,
      afterSave: answers.afterSave!,
      revisit: answers.revisit!,
      frustration: answers.frustration!,
      wouldPay: answers.wouldPay!,
    };

    setSubmitting(true);
    setError(null);
    try {
      await submitSurvey(payload);
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
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
              <h1 className="text-2xl font-semibold tracking-tight">Thank You</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Your answers help shape Marshal. We appreciate your time.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                The homepage is a product demo — explore freely.
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
                Five questions. Helps us understand how you save knowledge/data/information.
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
                              onClick={() => {
                                if (q.multi) toggleMulti(option);
                                else setSingle(q.id, option);
                              }}
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

              {error && (
                <p className="mt-4 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="mt-8 w-full gap-2"
                disabled={!complete || submitting}
              >
                {submitting ? (
                  <>
                    <Spinner className="size-4" />
                    Saving
                  </>
                ) : (
                  "Submit answers"
                )}
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
