import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types";

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** Map a Supabase auth user into our FE profile shape. */
export function mapSupabaseUser(
  user: User,
  emailFallback?: string
): UserProfile {
  const meta = user.user_metadata ?? {};

  // Email signup: first_name / last_name
  // Google: given_name / family_name (or combined name / full_name)
  let firstName =
    str(meta.first_name) || str(meta.given_name) || undefined;
  let lastName =
    str(meta.last_name) || str(meta.family_name) || undefined;

  const fullFromMeta = str(meta.full_name) || str(meta.name) || undefined;

  if ((!firstName || !lastName) && fullFromMeta) {
    const parts = fullFromMeta.split(/\s+/);
    if (!firstName) firstName = parts[0];
    if (!lastName && parts.length > 1) lastName = parts.slice(1).join(" ");
  }

  if (!firstName) {
    firstName = user.email?.split("@")[0] || "there";
  }
  if (!lastName) lastName = "";

  return {
    name: [firstName, lastName].filter(Boolean).join(" "),
    firstName,
    lastName,
    email: user.email ?? emailFallback ?? "",
    occupation: str(meta.occupation) ?? "",
    streak: 0,
    itemsSaved: 0,
    reviewsCompleted: 0,
    followers: 0,
    following: 0,
    achievements: [],
  };
}

export function getFirstName(
  user: Pick<UserProfile, "firstName" | "name">
): string {
  if (user.firstName?.trim()) return user.firstName.trim();
  const fromName = user.name.trim().split(/\s+/)[0];
  return fromName || "there";
}
