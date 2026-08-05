import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { setAccessToken } from "@/lib/api/session";
import { env } from "@/lib/config/env";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types";
import type { User } from "@supabase/supabase-js";

export type AuthResult = {
  token: string;
  user: UserProfile;
  /** True when email confirmation is required before a session exists */
  needsEmailConfirmation?: boolean;
};

function mapUser(user: User, emailFallback?: string): UserProfile {
  const meta = user.user_metadata ?? {};
  const first = meta.first_name as string | undefined;
  const last = meta.last_name as string | undefined;
  const full =
    (meta.full_name as string | undefined) ||
    (meta.name as string | undefined) ||
    [first, last].filter(Boolean).join(" ") ||
    user.email?.split("@")[0] ||
    "User";

  return {
    name: full,
    email: user.email ?? emailFallback ?? "",
    occupation: (meta.occupation as string | undefined) ?? "",
    streak: 0,
    itemsSaved: 0,
    reviewsCompleted: 0,
    followers: 0,
    following: 0,
    achievements: [],
  };
}

function siteOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function mockResult(email: string): AuthResult {
  return {
    token: "mock-token",
    user: {
      name: "Alex Chen",
      email,
      occupation: "Product Designer",
      streak: 12,
      itemsSaved: 247,
      reviewsCompleted: 89,
      followers: 1284,
      following: 312,
      achievements: [],
    },
  };
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  if (env.apiProvider === "mock") {
    const result = mockResult(input.email);
    setAccessToken(result.token);
    return result;
  }

  if (env.apiProvider === "supabase") {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error) throw new ApiError(error.message, 400);
    if (!data.session || !data.user) {
      throw new ApiError("Sign in failed", 400);
    }
    setAccessToken(data.session.access_token);
    return {
      token: data.session.access_token,
      user: mapUser(data.user, input.email),
    };
  }

  const data = await api<AuthResult>("/v1/auth/login", {
    method: "POST",
    body: input,
    auth: false,
  });
  setAccessToken(data.token);
  return data;
}

export async function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  if (env.apiProvider === "mock") {
    return login({ email: input.email, password: input.password });
  }

  if (env.apiProvider === "supabase") {
    const supabase = createClient();
    const fullName = `${input.firstName} ${input.lastName}`.trim();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
          full_name: fullName,
        },
        emailRedirectTo: `${siteOrigin()}/auth/callback?next=/onboarding`,
      },
    });
    if (error) throw new ApiError(error.message, 400);

    if (!data.session) {
      return {
        token: "",
        user: {
          name: fullName || input.email.split("@")[0],
          email: input.email,
          occupation: "",
          streak: 0,
          itemsSaved: 0,
          reviewsCompleted: 0,
          followers: 0,
          following: 0,
          achievements: [],
        },
        needsEmailConfirmation: true,
      };
    }

    setAccessToken(data.session.access_token);
    return {
      token: data.session.access_token,
      user: mapUser(data.user!, input.email),
    };
  }

  const data = await api<AuthResult>("/v1/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  });
  setAccessToken(data.token);
  return data;
}

export async function signInWithGoogle(next = "/dashboard"): Promise<void> {
  if (env.apiProvider === "mock") {
    window.location.href = next;
    return;
  }

  if (env.apiProvider === "supabase") {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) throw new ApiError(error.message, 400);
    return;
  }

  throw new ApiError("Google sign-in is not configured for this provider", 501);
}

export async function requestMagicLink(email: string): Promise<void> {
  if (env.apiProvider === "mock") {
    return;
  }

  if (env.apiProvider === "supabase") {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteOrigin()}/auth/callback?next=/dashboard`,
      },
    });
    if (error) throw new ApiError(error.message, 400);
    return;
  }

  await api<{ ok: true }>("/v1/auth/magic-link", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (env.apiProvider === "mock") {
    return;
  }

  if (env.apiProvider === "supabase") {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteOrigin()}/auth/callback?next=/reset-password`,
    });
    if (error) throw new ApiError(error.message, 400);
    return;
  }

  await api("/v1/auth/forgot-password", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

export async function updatePassword(password: string): Promise<void> {
  if (env.apiProvider === "mock") {
    return;
  }

  if (env.apiProvider === "supabase") {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new ApiError(error.message, 400);
    return;
  }

  await api("/v1/auth/reset-password", {
    method: "POST",
    body: { password },
  });
}

export async function logout(): Promise<void> {
  setAccessToken(null);

  if (env.apiProvider === "supabase") {
    // Clear browser client session, then hit the server route so SSR cookies die too.
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "global" });
    } catch {
      // continue — server route is the source of truth for cookies
    }
    await fetch("/auth/signout", { method: "POST", credentials: "include" });
    return;
  }

  if (env.apiProvider === "http") {
    try {
      await api("/v1/auth/logout", { method: "POST" });
    } catch {
      // token already cleared locally
    }
  }
}

export async function getAuthUser(): Promise<UserProfile | null> {
  if (env.apiProvider === "mock") {
    return mockResult("alex@marshal.ai").user;
  }

  if (env.apiProvider === "supabase") {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return mapUser(data.user);
  }

  try {
    const data = await api<{ user: UserProfile }>("/v1/me");
    return data.user;
  } catch {
    return null;
  }
}
