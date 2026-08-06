import { getInsights } from "@/lib/api/user";
import type { WeeklyProgressPoint } from "@/lib/api/user";
import { getCurrentUser } from "@/lib/api/user-server";
import { listCollections } from "@/lib/api/collections";
import { listKnowledgeItemsServer } from "@/lib/api/knowledge-server";
import type { KnowledgeItem } from "@/types";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** Monday 00:00 UTC for the week containing `date`. */
function startOfUtcWeek(date: Date): Date {
  const day = date.getUTCDay(); // 0 = Sun
  const offset = day === 0 ? 6 : day - 1;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - offset)
  );
}

function dayIndexInWeek(savedAt: string, weekStart: Date): number | null {
  const saved = new Date(savedAt);
  if (Number.isNaN(saved.getTime())) return null;
  const diffMs = saved.getTime() - weekStart.getTime();
  const idx = Math.floor(diffMs / 86_400_000);
  if (idx < 0 || idx > 6) return null;
  return idx;
}

/** Build Mon–Sun save counts for the current UTC week (reviews stay 0 until tracked). */
export function buildWeeklyProgress(
  items: KnowledgeItem[],
  now = new Date()
): WeeklyProgressPoint[] {
  const weekStart = startOfUtcWeek(now);
  const counts = WEEK_DAYS.map(() => 0);

  for (const item of items) {
    const idx = dayIndexInWeek(item.savedAt, weekStart);
    if (idx !== null) counts[idx] += 1;
  }

  return WEEK_DAYS.map((day, i) => ({
    day,
    items: counts[i],
    reviews: 0,
  }));
}

function countSavesInWeek(
  items: KnowledgeItem[],
  weekStart: Date
): number {
  let total = 0;
  for (const item of items) {
    if (dayIndexInWeek(item.savedAt, weekStart) !== null) total += 1;
  }
  return total;
}

/** Aggregate payload for the dashboard page. */
export async function getDashboardData() {
  const [user, items, collections, insights] = await Promise.all([
    getCurrentUser(),
    listKnowledgeItemsServer().catch(() => [] as KnowledgeItem[]),
    listCollections(),
    getInsights(),
  ]);

  const now = new Date();
  const thisWeekStart = startOfUtcWeek(now);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setUTCDate(lastWeekStart.getUTCDate() - 7);

  const thisWeekSaves = countSavesInWeek(items, thisWeekStart);
  const lastWeekSaves = countSavesInWeek(items, lastWeekStart);

  let weekHint = "No saves last week";
  if (lastWeekSaves > 0) {
    const delta = Math.round(
      ((thisWeekSaves - lastWeekSaves) / lastWeekSaves) * 100
    );
    weekHint =
      delta === 0
        ? "Same as last week"
        : `${delta > 0 ? "+" : ""}${delta}% vs last week`;
  } else if (thisWeekSaves > 0) {
    weekHint = "First saves this week";
  }

  return {
    user: {
      ...user,
      itemsSaved: items.length,
    },
    recent: items.slice(0, 4),
    today: items.filter((k) => k.processed).slice(0, 3),
    recommended: [items[2], items[4], items[6]].filter(Boolean),
    collections: collections.slice(0, 4),
    collectionCount: collections.length,
    insights,
    weeklyProgress: buildWeeklyProgress(items, now),
    thisWeekSaves,
    weekHint,
  };
}
