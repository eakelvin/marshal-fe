import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseConfig, env } from "@/lib/config/env";

export function createClient() {
  assertSupabaseConfig();
  return createBrowserClient(env.supabaseUrl, env.supabasePublishableKey);
}
