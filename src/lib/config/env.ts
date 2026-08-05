/**
 * Central env config. Switch backends by changing .env — not page code.
 *
 * API_PROVIDER:
 *   supabase → Supabase Auth + Next /api/v1/* (current)
 *   http     → NEXT_PUBLIC_API_URL (Node later)
 *   mock     → product UI fixtures only (auth disabled)
 */
export type ApiProvider = "mock" | "supabase" | "http";

function readProvider(): ApiProvider {
  const value = process.env.NEXT_PUBLIC_API_PROVIDER ?? "supabase";
  if (value === "http" || value === "mock" || value === "supabase") return value;
  console.warn(
    `[env] Unknown NEXT_PUBLIC_API_PROVIDER="${value}", falling back to "supabase"`
  );
  return "supabase";
}

export const env = {
  apiProvider: readProvider(),
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, ""),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "",
} as const;

export function assertHttpConfig() {
  if (env.apiProvider === "http" && !env.apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_PROVIDER=http requires NEXT_PUBLIC_API_URL"
    );
  }
}

export function assertSupabaseConfig() {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error(
      "Supabase requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }
}

/**
 * Unwired product features (library/graph/…) may still use fixtures.
 * Auth/identity never uses this.
 */
export function useProductFixtures() {
  return env.apiProvider === "mock";
}

/** @deprecated use useProductFixtures — kept so older imports don't break mid-refactor */
export function useMockData() {
  return useProductFixtures();
}
