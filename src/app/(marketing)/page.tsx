import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Network,
  Sparkles,
  Zap,
  Quote,
  Layers,
  RefreshCw,
  Search,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  {
    icon: Sparkles,
    title: "AI that actually curates",
    description:
      "Every save becomes a structured knowledge card - summary, takeaways, quotes, tags, and why it matters.",
  },
  {
    icon: Network,
    title: "Living knowledge graph",
    description:
      "Ideas connect automatically. Zoom, filter, and discover relationships you would never file manually.",
  },
  {
    icon: RefreshCw,
    title: "Spaced resurfacing",
    description:
      "Marshal interrupts forgetting. Daily and weekly reviews bring back what deserves another look.",
  },
  {
    icon: Search,
    title: "Semantic search",
    description:
      "Ask in natural language. Find by meaning, not just keywords - across sources and collections.",
  },
  {
    icon: Layers,
    title: "Intelligent collections",
    description:
      "Public, private, shared, and AI-curated boards that organize themselves around your goals.",
  },
  {
    icon: Brain,
    title: "Learning coach",
    description:
      "Quizzes, flashcards, and reflections that turn passive saving into continuous learning.",
  },
];

const steps = [
  {
    step: "01",
    title: "Save anything",
    description: "Articles, papers, videos, tweets, repos, podcasts - drop a link and keep moving.",
  },
  {
    step: "02",
    title: "AI processes it",
    description: "Collector, Summarizer, and Graph agents extract signal and wire connections.",
  },
  {
    step: "03",
    title: "Learn continuously",
    description: "Review, quiz, and resurface - so knowledge compounds instead of disappearing.",
  },
];

const agentCards = [
  { name: "Collector", blurb: "Ingests and normalizes every source." },
  { name: "Summarizer", blurb: "Distills clarity without losing nuance." },
  { name: "Classifier", blurb: "Tags topics, difficulty, and time." },
  { name: "Graph", blurb: "Maps ideas into living relationships." },
  { name: "Recommend", blurb: "Suggests what to learn next." },
  { name: "Resurface", blurb: "Schedules spaced, gentle nudges." },
  { name: "Coach", blurb: "Guides goals, quizzes, and reflection." },
];

const testimonials = [
  {
    quote:
      "I stopped bookmarking and started remembering. Marshal feels like a calm co-pilot for everything I learn.",
    name: "Priya N.",
    role: "Staff Engineer",
  },
  {
    quote:
      "The knowledge graph alone changed how our design team shares research. Connections we used to lose are now visible.",
    name: "Marcus L.",
    role: "Design Lead",
  },
  {
    quote:
      "Weekly review is the habit I never built myself. Marshal made continuous learning effortless.",
    name: "Elena V.",
    role: "Researcher",
  },
];

const plans = [
  {
    name: "Explorer",
    price: "Free",
    desc: "Start curating your second brain.",
    features: ["100 saves / month", "AI summaries", "Basic graph", "Daily review"],
    cta: "Get started",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Scholar",
    price: "$16",
    period: "/mo",
    desc: "For serious lifelong learners.",
    features: [
      "Unlimited saves",
      "Full agent suite",
      "Semantic search",
      "Shared collections",
      "Spaced repetition + quizzes",
    ],
    cta: "Start free trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$39",
    period: "/seat",
    desc: "Shared intelligence for product teams.",
    features: [
      "Everything in Scholar",
      "Team knowledge graph",
      "Admin controls",
      "SSO & API access",
      "Priority agents",
    ],
    cta: "Contact sales",
    href: "/register",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Is Marshal just another bookmark manager?",
    a: "No. Bookmarks store links. Marshal curates knowledge - summarizing, connecting, tagging, and resurfacing so you actually learn from what you save.",
  },
  {
    q: "What sources can I save?",
    a: "Articles, YouTube, X posts, research papers, GitHub repos, podcasts, blogs, and documents. Drop a URL or upload - agents handle the rest.",
  },
  {
    q: "How does resurfacing work?",
    a: "Our Resurfacing Agent uses spaced-repetition principles to gently bring back items based on difficulty, your goals, and how long since you last engaged.",
  },
  {
    q: "Can I use Marshal with a team?",
    a: "Yes. Shared collections, team graphs, and collaborative reviews are available on Team plans.",
  },
  {
    q: "Is my knowledge private?",
    a: "Private by default. You choose what to share. Enterprise plans include SSO, audit logs, and data residency options.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 gradient-mesh dark:opacity-100 opacity-0" />
        <div className="pointer-events-none absolute inset-0 gradient-mesh-light dark:opacity-0 opacity-100" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 lg:px-6 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-3 py-1 text-xs font-normal"
            >
              <Zap className="size-3 text-primary" aria-hidden />
              AI Knowledge Curator
            </Badge>
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              Marshal
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance">
              Your AI-powered second brain.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed text-balance">
              Curate, organize, summarize, and resurface the knowledge that
              matters - so you continuously learn instead of forgetting what you save.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="h-11 px-6 text-sm" render={<Link href="/register" />}>
                Start curating free
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6 text-sm"
                render={<Link href="/dashboard" />}
              >
                View live demo
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card  |  Dark mode first  |  Keyboard-native
            </p>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                <span className="size-2.5 rounded-full bg-red-400/80" />
                <span className="size-2.5 rounded-full bg-amber-400/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-3 text-xs text-muted-foreground">marshal.ai/dashboard</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                {[
                  { label: "Streak", value: "12 days", icon: Zap },
                  { label: "Saved", value: "247 items", icon: BookOpen },
                  { label: "Connections", value: "89 edges", icon: Network },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border/60 bg-muted/30 p-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <s.icon className="size-3.5 text-primary" />
                      {s.label}
                    </div>
                    <p className="mt-2 text-xl font-semibold tracking-tight">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/60 px-5 py-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Today&apos;s learning
                </p>
                <div className="space-y-2">
                  {[
                    "How Attention Mechanisms Reshaped Modern AI",
                    "Scaling Retrieval-Augmented Generation",
                    "Designing Calm Interfaces for Complex Systems",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 px-3 py-2.5"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span className="text-sm truncate">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Built to help you remember what matters.
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              High information density without clutter. Every surface is designed for speed,
              clarity, and calm intelligence.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border/70 bg-card/40 p-6 transition-colors hover:border-primary/25 hover:bg-card/70"
              >
                <div className="mb-4 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-4" aria-hidden />
                </div>
                <h3 className="font-medium tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border/60 bg-muted/20 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-medium text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Save once. Learn forever.
            </h2>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.step}
                className="relative rounded-2xl border border-border/70 bg-background/60 p-6"
              >
                <span className="font-mono text-xs text-primary">{s.step}</span>
                <h3 className="mt-3 text-lg font-medium tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="border-t border-border/60 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-primary">AI Agents</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                A quiet team working on your knowledge.
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Seven specialized agents handle collection, understanding, connection, and coaching - 
                so the interface stays effortless.
              </p>
            </div>
            <Button variant="outline" render={<Link href="/agents" />}>
              Explore agents
              <ArrowRight className="size-3.5" data-icon="inline-end" />
            </Button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {agentCards.map((a) => (
              <div
                key={a.name}
                className="rounded-xl border border-border/70 bg-card/40 px-4 py-4"
              >
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
                  <p className="text-sm font-medium">{a.name}</p>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {a.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border/60 bg-muted/20 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Loved by people who learn for a living.
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-2xl border border-border/70 bg-background/60 p-6"
              >
                <Quote className="size-4 text-primary/60 mb-3" aria-hidden />
                <p className="text-sm leading-relaxed text-foreground/90">{t.quote}</p>
                <footer className="mt-5">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/60 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-medium text-primary">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple plans for serious learners.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/70 bg-card/40"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-2.5 right-4 text-[10px]">Popular</Badge>
                )}
                <h3 className="font-medium">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                <p className="mt-5">
                  <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 shrink-0 text-primary mt-0.5" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  render={<Link href={plan.href} />}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/60 bg-muted/20 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-4 lg:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight">FAQ</h2>
          <Accordion className="mt-10">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/50 px-6 py-14 gradient-mesh">
            <Shield className="mx-auto size-8 text-primary mb-4" aria-hidden />
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Stop forgetting what you save.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Build a second brain that curates with you - intelligent, calm, and always ready for
              your next insight.
            </p>
            <Button size="lg" className="mt-8 h-11 px-6" render={<Link href="/register" />}>
              Get started free
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:flex-row lg:items-start lg:justify-between lg:px-6">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Your AI-powered second brain. Curate knowledge. Continuously learn.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-sm">
            <div>
              <p className="font-medium mb-3">Product</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><Link href="/dashboard" className="hover:text-foreground">Demo</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-3">Company</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-3">Legal</p>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-4 lg:px-6">
          <p className="text-xs text-muted-foreground">
            (c) {new Date().getFullYear()} Marshal. Built for learners.
          </p>
        </div>
      </footer>
    </>
  );
}
