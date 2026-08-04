import { api } from "@/lib/api/client";
import { useMockData } from "@/lib/config/env";
import { currentUser, insights, weeklyProgress } from "@/lib/data/mock";
import type { UserProfile } from "@/types";

export type Insight = { id: string; title: string; body: string };
export type WeeklyProgressPoint = { day: string; items: number; reviews: number };

export async function getCurrentUser(): Promise<UserProfile> {
  if (useMockData()) {
    return currentUser;
  }
  const data = await api<{ user: UserProfile }>("/v1/me");
  return data.user;
}

export async function getInsights(): Promise<Insight[]> {
  if (useMockData()) {
    return insights;
  }
  const data = await api<{ insights: Insight[] }>("/v1/me/insights");
  return data.insights;
}

export async function getWeeklyProgress(): Promise<WeeklyProgressPoint[]> {
  if (useMockData()) {
    return weeklyProgress;
  }
  const data = await api<{ progress: WeeklyProgressPoint[] }>("/v1/me/weekly-progress");
  return data.progress;
}
