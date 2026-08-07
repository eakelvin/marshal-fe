import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { setAccessToken } from "@/lib/api/session";
import { mapSupabaseUser } from "@/lib/api/user-mapper";
import { env } from "@/lib/config/env";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types";

export type AuthResult = {
  token: string;
  user: UserProfile;
  needsEmailConfirmation?: boolean;
};

function siteOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function requireLiveAuth() {
  if (env.apiProvider === "mock") {
    throw new ApiError(
      "Auth requires NEXT_PUBLIC_API_PROVIDER=supabase",
      503
    );
  }
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  requireLiveAuth();

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
      user: mapSupabaseUser(data.user, null, input.email),
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
  requireLiveAuth();

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
        emailRedirectTo: `${siteOrigin()}/auth/callback?next=/dashboard`,
      },
    });
    if (error) throw new ApiError(error.message, 400);

    if (!data.session) {
      return {
        token: "",
        user: {
          name: fullName || input.email.split("@")[0],
          firstName: input.firstName,
          lastName: input.lastName,
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
      user: mapSupabaseUser(data.user!, null, input.email),
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
  requireLiveAuth();

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
  requireLiveAuth();

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
  requireLiveAuth();

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

export async function updatePassword(
  password: string,
  options?: { currentPassword?: string }
): Promise<void> {
  requireLiveAuth();

  if (env.apiProvider === "supabase") {
    const supabase = createClient();

    if (options?.currentPassword) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        throw new ApiError("Not authenticated", 401);
      }

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: options.currentPassword,
      });
      if (verifyError) {
        throw new ApiError("Current password is incorrect", 400);
      }
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new ApiError(error.message, 400);
    return;
  }

  await api("/v1/auth/reset-password", {
    method: "POST",
    body: {
      password,
      ...(options?.currentPassword
        ? { currentPassword: options.currentPassword }
        : {}),
    },
  });
}

export async function logout(): Promise<void> {
  setAccessToken(null);

  if (env.apiProvider === "supabase") {
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "global" });
    } catch {
      // server route clears cookies
    }
    await fetch("/auth/signout", { method: "POST", credentials: "include" });
    return;
  }

  if (env.apiProvider === "http") {
    try {
      await api("/v1/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
  }
}

export async function getAuthUser(): Promise<UserProfile | null> {
  if (env.apiProvider === "supabase") {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return mapSupabaseUser(data.user);
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
