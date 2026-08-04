# Marshal

Your AI-powered second brain. An AI Knowledge Curator that organizes, summarizes, connects, and resurfaces valuable knowledge—so you continuously learn instead of forgetting what you save.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide Icons
- Recharts
- Motion-ready (motion package installed)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo paths

| Flow | Path |
|------|------|
| Landing | `/` |
| Auth | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/magic-link`, `/verify-email` |
| Onboarding | `/onboarding` |
| Dashboard | `/dashboard` |
| Save | `/save` |
| Library | `/library`, `/library/[id]` |
| Graph | `/graph` |
| Collections | `/collections`, `/collections/[id]` |
| Discover | `/discover` |
| Search | `/search` |
| Review | `/review` |
| Agents | `/agents`, `/agents/[id]` |
| Profile | `/profile` |
| Settings | `/settings` |

## Keyboard shortcuts

- `⌘K` — Command palette
- `⌘S` — Quick save

## Architecture notes

This is a production-quality UI shell with rich mock data. Auth forms navigate through the intended user journey; AI processing on Save is simulated with optimistic UI and agent status feedback.

## Backend switch

Data access goes through `src/lib/api/*` (not pages → Supabase/Node directly).

| Env | Effect |
|-----|--------|
| `NEXT_PUBLIC_API_PROVIDER=mock` | Local mock / no persistence |
| `NEXT_PUBLIC_API_PROVIDER=supabase` | Next `/api/v1/*` routes → Supabase |
| `NEXT_PUBLIC_API_PROVIDER=http` | Calls `NEXT_PUBLIC_API_URL` `/v1/*` (Node later) |

Copy `.env.example` → `.env.local`. For the survey table, run `supabase/migrations/001_surveys.sql` in the Supabase SQL Editor.
