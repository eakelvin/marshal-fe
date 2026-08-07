import "server-only";

import type { User } from "@supabase/supabase-js";
import { api } from "@/lib/api/client";
import {
  mapSupabaseUser,
  type ProfileRow,
} from "@/lib/api/user-mapper";
import type { UpdateProfileInput } from "@/lib/api/user-schema";
import { env } from "@/lib/config/env";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function fetchProfileRow(
  supabase: SupabaseServerClient,
  userId: string
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[user-server] profiles select", error);
    return null;
  }

  return (data as ProfileRow | null) ?? null;
}

async function getSupabaseProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const profile = await fetchProfileRow(supabase, data.user.id);
  return mapSupabaseUser(data.user, profile);
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

function splitDisplayName(name: string): {
  first_name: string;
  last_name: string;
} {
  const parts = name.split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] ?? name,
    last_name: parts.slice(1).join(" "),
  };
}

/** Persist account profile fields to public.profiles. */
export async function updateCurrentUser(
  input: UpdateProfileInput
): Promise<UserProfile> {
  if (env.apiProvider !== "supabase") {
    throw new Error("Profile updates require Supabase");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { first_name, last_name } = splitDisplayName(input.name);
  const now = new Date().toISOString();

  const row = {
    id: user.id,
    display_name: input.name,
    first_name,
    last_name,
    occupation: input.occupation,
    domain: input.domain ?? "",
    linkedin: input.linkedin ?? "",
    github: input.github ?? "",
    twitter: input.twitter ?? "",
    birthday: input.birthday ?? null,
    phone: input.phone ?? "",
    address: input.address ?? "",
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    console.error("[user-server] profiles upsert", error);
    throw new Error(error.message);
  }

  // Keep auth display metadata in sync for providers / JWT consumers
  const { error: metaError } = await supabase.auth.updateUser({
    data: {
      full_name: input.name,
      first_name,
      last_name,
    },
  });
  if (metaError) {
    console.warn("[user-server] auth metadata sync", metaError.message);
  }

  const { data: refreshed } = await supabase.auth.getUser();
  const authUser: User = refreshed.user ?? user;

  return mapSupabaseUser(authUser, data as ProfileRow);
}
