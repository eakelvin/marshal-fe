import { api } from "@/lib/api/client";
import { env, useMockData } from "@/lib/config/env";
import { setAccessToken } from "@/lib/api/session";
import type { UserProfile } from "@/types";

type AuthResult = {
  token: string;
  user: UserProfile;
};

/**
 * Email/password sign-in.
 * Mock/supabase: accepts any credentials and stores a fake token.
 * HTTP: POST /v1/auth/login on Node.
 */
export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  if (useMockData()) {
    const result: AuthResult = {
      token: "mock-token",
      user: {
        name: "Alex Chen",
        email: input.email,
        occupation: "Product Designer",
        streak: 12,
        itemsSaved: 247,
        reviewsCompleted: 89,
        followers: 1284,
        following: 312,
        achievements: [],
      },
    };
    setAccessToken(result.token);
    return result;
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
  if (useMockData()) {
    return login({ email: input.email, password: input.password });
  }

  const data = await api<AuthResult>("/v1/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  });
  setAccessToken(data.token);
  return data;
}

export async function requestMagicLink(email: string): Promise<void> {
  if (useMockData()) {
    return;
  }
  await api<{ ok: true }>("/v1/auth/magic-link", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

export async function logout(): Promise<void> {
  setAccessToken(null);
  if (env.apiProvider === "http") {
    try {
      await api("/v1/auth/logout", { method: "POST" });
    } catch {
      // token already cleared locally
    }
  }
}
