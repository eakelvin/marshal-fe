import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types";

export type ProfileRow = {
  id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  occupation: string;
  domain: string;
  linkedin: string;
  github: string;
  twitter: string;
  birthday: string | null;
  phone: string;
  address: string;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
};

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function namesFromAuth(user: User): {
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
} {
  const meta = user.user_metadata ?? {};

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
    firstName,
    lastName,
    displayName:
      fullFromMeta || [firstName, lastName].filter(Boolean).join(" "),
    avatar: str(meta.avatar_url) || str(meta.picture),
  };
}

/**
 * Map auth user + optional public.profiles row into the FE profile shape.
 * Profile table is source of truth for editable account fields.
 */
export function mapSupabaseUser(
  user: User,
  profile?: ProfileRow | null,
  emailFallback?: string
): UserProfile {
  const fromAuth = namesFromAuth(user);

  const firstName = str(profile?.first_name) || fromAuth.firstName;
  const lastName =
    profile?.last_name !== undefined && profile.last_name !== null
      ? profile.last_name.trim()
      : fromAuth.lastName;
  const displayName =
    str(profile?.display_name) ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    fromAuth.displayName;

  const identities = user.identities ?? [];
  const hasPasswordAuth = identities.some(
    (identity) => identity.provider === "email"
  );

  return {
    name: displayName,
    firstName,
    lastName,
    email: user.email ?? emailFallback ?? "",
    occupation: str(profile?.occupation) ?? "",
    domain: str(profile?.domain),
    linkedin: str(profile?.linkedin),
    github: str(profile?.github),
    twitter: str(profile?.twitter),
    birthday: str(profile?.birthday) ?? undefined,
    phone: str(profile?.phone),
    address: str(profile?.address),
    avatar: str(profile?.avatar_url) || fromAuth.avatar,
    hasPasswordAuth,
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
