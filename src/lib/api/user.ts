import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { UpdateProfileInput } from "@/lib/api/user-schema";
import { env } from "@/lib/config/env";
import type { UserProfile } from "@/types";

export type Insight = { id: string; title: string; body: string };
export type WeeklyProgressPoint = { day: string; items: number; reviews: number };

export { getFirstName } from "@/lib/api/user-mapper";
export type { UpdateProfileInput } from "@/lib/api/user-schema";

async function clientApiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  if (typeof window === "undefined") {
    throw new Error(
      `Profile via relative "${path}" is browser-only; use user-server on the server`
    );
  }

  const res = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    credentials: "include",
  });

  let data: T & { message?: string } = {} as T & { message?: string };
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text) as T & { message?: string };
    } catch {
      throw new ApiError(text.slice(0, 200) || "Invalid response", res.status);
    }
  }

  if (!res.ok) {
    throw new ApiError(
      data.message || res.statusText || "Request failed",
      res.status,
      data
    );
  }

  return data;
}

export async function getInsights(): Promise<Insight[]> {
  if (env.apiProvider === "supabase") return [];
  const data = await api<{ insights: Insight[] }>("/v1/me/insights");
  return data.insights;
}

export async function getWeeklyProgress(): Promise<WeeklyProgressPoint[]> {
  if (env.apiProvider === "supabase") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      items: 0,
      reviews: 0,
    }));
  }
  const data = await api<{ progress: WeeklyProgressPoint[] }>("/v1/me/weekly-progress");
  return data.progress;
}

export async function updateProfile(
  input: UpdateProfileInput
): Promise<UserProfile> {
  if (env.apiProvider === "supabase") {
    const data = await clientApiFetch<{ user: UserProfile }>("/api/v1/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    return data.user;
  }

  const data = await api<{ user: UserProfile }>("/v1/me", {
    method: "PATCH",
    body: input,
  });
  return data.user;
}
