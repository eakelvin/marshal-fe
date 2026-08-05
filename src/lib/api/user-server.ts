import "server-only";

import { api } from "@/lib/api/client";
import { mapSupabaseUser } from "@/lib/api/user-mapper";
import { env } from "@/lib/config/env";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

async function getSupabaseProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return mapSupabaseUser(data.user);
}

/** Authenticated user for server components (dashboard, profile, …). */
export async function getCurrentUser(): Promise<UserProfile> {
  if (env.apiProvider === "supabase") {
    const profile = await getSupabaseProfile();
    if (profile) return profile;
    throw new Error("Not authenticated");
  }

  if (env.apiProvider === "http") {
    const data = await api<{ user: UserProfile }>("/v1/me");
    return data.user;
  }

  throw new Error(
    "User identity requires NEXT_PUBLIC_API_PROVIDER=supabase"
  );
}

/** Session user for marketing chrome; null when logged out. */
export async function getSessionUser(): Promise<UserProfile | null> {
  if (env.apiProvider === "supabase") {
    return getSupabaseProfile();
  }
  if (env.apiProvider === "http") {
    try {
      const data = await api<{ user: UserProfile }>("/v1/me");
      return data.user;
    } catch {
      return null;
    }
  }
  return null;
}
