import { api } from "@/lib/api/client";
import { env, useProductFixtures } from "@/lib/config/env";
import { insights, weeklyProgress } from "@/lib/data/mock";

export type Insight = { id: string; title: string; body: string };
export type WeeklyProgressPoint = { day: string; items: number; reviews: number };

export { getFirstName } from "@/lib/api/user-mapper";

export async function getInsights(): Promise<Insight[]> {
  if (useProductFixtures()) return insights;
  if (env.apiProvider === "supabase") return [];
  const data = await api<{ insights: Insight[] }>("/v1/me/insights");
  return data.insights;
}

export async function getWeeklyProgress(): Promise<WeeklyProgressPoint[]> {
  if (useProductFixtures()) return weeklyProgress;
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
