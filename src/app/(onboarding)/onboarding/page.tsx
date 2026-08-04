"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const interests = [
  "AI & ML",
  "Product Design",
  "Engineering",
  "Research",
  "Startups",
  "Psychology",
  "Science",
  "Writing",
  "Business",
  "Philosophy",
];

const sources = [
  "Articles",
  "YouTube",
  "Research papers",
  "GitHub",
  "Podcasts",
  "X / Twitter",
  "Newsletters",
  "Books",
];

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState("");
  const [topics, setTopics] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [level, setLevel] = useState("Intermediate");

  const steps = [
    "Profile",
    "Interests",
    "Goals",
    "Topics",
    "Sources",
    "Level",
  ];

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    item: string
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else router.push("/dashboard");
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="relative min-h-dvh flex flex-col">
      <div className="pointer-events-none absolute inset-0 gradient-mesh opacity-40" aria-hidden />
      <header className="relative z-10 flex items-center justify-between px-4 py-4 lg:px-8">
        <Logo href="/dashboard" />
        <p className="text-xs text-muted-foreground">
          Step {step + 1} of {steps.length}
        </p>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-10">
        <div className="w-full max-w-lg">
          <Progress value={progress} className="h-1 mb-8" aria-label="Onboarding progress" />

          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur sm:p-8">
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Who are you?</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    We&apos;ll personalize your AI coach around you.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Chen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Product Designer"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Your interests</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Select a few topics Marshal should prioritize.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggle(selectedInterests, setSelectedInterests, item)
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition-colors focus-ring",
                        selectedInterests.includes(item)
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {selectedInterests.includes(item) && (
                        <Check className="mr-1 inline size-3" aria-hidden />
                      )}
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Learning goals</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    What do you want to get better at this quarter?
                  </p>
                </div>
                <Textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Master RAG systems and ship calmer product interfaces..."
                  rows={5}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Favorite topics</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Comma-separated themes for deeper curation.
                  </p>
                </div>
                <Textarea
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="transformers, design systems, knowledge graphs..."
                  rows={4}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Preferred sources</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Where do you usually find valuable knowledge?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sources.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggle(selectedSources, setSelectedSources, item)
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition-colors focus-ring",
                        selectedSources.includes(item)
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Experience level</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Helps agents tune difficulty and recommendations.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {levels.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-ring",
                        level === l
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={back}
                disabled={step === 0}
                className="gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                Back
              </Button>
              <Button onClick={next} className="gap-1.5">
                {step === steps.length - 1 ? "Enter Marshal" : "Continue"}
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-1.5" role="tablist" aria-label="Steps">
            {steps.map((s, i) => (
              <button
                key={s}
                type="button"
                aria-label={s}
                aria-current={i === step ? "step" : undefined}
                onClick={() => setStep(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all focus-ring",
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
