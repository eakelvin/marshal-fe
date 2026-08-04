/**
 * Central env config. Switch backends by changing .env — not page code.
 *
 * API_PROVIDER:
 *   mock     → in-memory / no persistence
 *   supabase → Next /api/v1/* routes that talk to Supabase
 *   http     → NEXT_PUBLIC_API_URL (Node / Edge Functions later)
 */
export type ApiProvider = "mock" | "supabase" | "http";

function readProvider(): ApiProvider {
  const value = process.env.NEXT_PUBLIC_API_PROVIDER ?? "mock";
  if (value === "http" || value === "mock" || value === "supabase") return value;
  console.warn(
    `[env] Unknown NEXT_PUBLIC_API_PROVIDER="${value}", falling back to "mock"`
  );
  return "mock";
}

export const env = {
  /** mock | supabase | http */
  apiProvider: readProvider(),

  /**
   * Base URL for the product API when PROVIDER=http (no trailing slash).
   * Node example: http://localhost:4000
   */
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, ""),

  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",

  /** Publishable (anon) key — safe for browser / SSR client */
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
 * Domain modules without a real backend yet (dashboard, library, …)
 * keep serving mock data under mock + supabase.
 * Only PROVIDER=http hits NEXT_PUBLIC_API_URL.
 * Survey is the exception — it has its own /api/v1/survey route.
 */
export function useMockData() {
  return env.apiProvider !== "http";
}
