import { getInsights, getWeeklyProgress } from "@/lib/api/user";
import { getCurrentUser } from "@/lib/api/user-server";
import { listCollections } from "@/lib/api/collections";
import { listKnowledgeItems } from "@/lib/api/knowledge";

/** Aggregate payload for the dashboard page. */
export async function getDashboardData() {
  const [user, items, collections, insights, weekly] = await Promise.all([
    getCurrentUser(),
    listKnowledgeItems(),
    listCollections(),
    getInsights(),
    getWeeklyProgress(),
  ]);

  return {
    user,
    recent: items.slice(0, 4),
    today: items.filter((k) => k.processed).slice(0, 3),
    recommended: [items[2], items[4], items[6]].filter(Boolean),
    collections: collections.slice(0, 4),
    collectionCount: collections.length,
    insights,
    weeklyProgress: weekly,
  };
}
