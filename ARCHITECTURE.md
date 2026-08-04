# Marshal ù UX & Product Architecture

## Product

**Marshal** is an AI Knowledge Curator ù not a bookmark manager. It curates, organizes, summarizes, connects, and resurfaces knowledge so users continuously learn.

## Design principles

1. Calm intelligence over chrome
2. High density without clutter
3. Keyboard-first, mobile-complete
4. Dark mode first, excellent light mode
5. Optimistic, immediate feedback
6. One job per section

## Brand

| Token | Choice |
|-------|--------|
| Name | Marshal |
| Accent | Indigo / blue (`oklch` primary) |
| Type | Plus Jakarta Sans + Instrument Serif (display) + Geist Mono |
| Radius | Soft (`0.75rem`) |
| Elevation | Soft shadows, glass surfaces |
| Tone | Intelligent, helpful, minimal, professional |

## Information architecture

```
Marketing
  /                 Landing
Auth
  /login            Sign in
  /register         Sign up
  /forgot-password
  /reset-password
  /magic-link
  /verify-email
Onboarding
  /onboarding       6-step personalization
App shell
  /dashboard        Home
  /save             Frictionless capture
  /library          Knowledge library
  /library/[id]     AI workspace (summary, takeaways, connections)
  /graph            Interactive knowledge graph
  /collections      Boards (public/private/shared/AI/pinned)
  /collections/[id]
  /discover         Social + trending discovery
  /search           Instant + semantic search
  /review           Daily/weekly/monthly + spaced repetition
  /agents           Agent fleet
  /agents/[id]      Status, logs, confidence
  /profile          Stats, achievements, history
  /settings         Theme, AI, privacy, billing, API
```

## User journeys

### Visitor ? Learner
Landing ? Sign up ? Onboarding (name, occupation, interests, goals, topics, sources, level) ? Dashboard

### Save ? Understand
Quick Save (Cmd+S) ? paste URL ? agents process ? Library card with AI workspace

### Continuous learning
Dashboard insights ? Daily Review ? Flashcards / Quiz ? Reflection ? streak compounds

### Explore & connect
Discover / Search ? open item ? Graph connections ? Suggested next read

## Sitemap (primary)

```
/ ?? features, how-it-works, agents, pricing, FAQ, CTA
??? Auth cluster
??? Onboarding
??? App
    ??? Dashboard
    ??? Library ? Item detail
    ??? Save
    ??? Graph
    ??? Collections ? Detail
    ??? Discover
    ??? Search
    ??? Review
    ??? Agents ? Detail
    ??? Profile
    ??? Settings
```

## Component hierarchy

```
RootLayout (theme, fonts, toaster)
??? MarketingLayout ? Landing sections
??? AuthLayout ? Auth cards
??? OnboardingPage (multi-step)
??? AppShell
    ??? AppSidebar
    ??? TopNav (search, notifications, save, AI toggle)
    ??? Main {pages}
    ??? AiPanel (Coach)
    ??? BottomNav (mobile)
    ??? CommandPalette (Cmd+K)
```

Reusable: `Logo`, `KnowledgeCard`, `SourceBadge`, `EmptyState`, skeletons, shadcn/ui primitives.

## Dashboard layout

| Viewport | Structure |
|----------|-----------|
| Desktop | Left sidebar ù Top nav ù Main ù Right AI panel |
| Mobile | Bottom nav ù Drawer menu ù FAB-style Save |

## Folder structure

```
src/
  app/
    (marketing)/
    (auth)/
    (onboarding)/
    (app)/
  components/
    ui/           # shadcn
    layout/       # shell, nav, palette, AI panel
    shared/       # brand, cards, theme
    dashboard/    # charts
  lib/data/       # mock domain data
  types/
  hooks/
```

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+K | Command palette |
| Cmd+S | Quick Save |

## Accessibility

WCAG-oriented: focus rings, ARIA labels on icon buttons, semantic landmarks, keyboard graph nodes, live regions for AI processing status, high-contrast indigo on dark/light themes.
