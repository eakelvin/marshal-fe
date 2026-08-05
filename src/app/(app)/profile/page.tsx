import Link from "next/link";
import {
  Award,
  BookMarked,
  Bookmark,
  Flame,
  FolderOpen,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KnowledgeCard } from "@/components/shared/knowledge-card";
import { EmptyState } from "@/components/shared/empty-state";
import { listCollections } from "@/lib/api/collections";
import { listKnowledgeItems } from "@/lib/api/knowledge";
import { getCurrentUser } from "@/lib/api/user-server";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [user, collections, items] = await Promise.all([
    getCurrentUser(),
    listCollections(),
    listKnowledgeItems(),
  ]);

  const initials =
    [user.firstName, user.lastName]
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || user.email.slice(0, 2).toUpperCase();

  const history = items.slice(0, 4);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary/15 text-primary text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
            <p className="text-sm text-muted-foreground">
              {[user.occupation, user.email].filter(Boolean).join("  |  ")}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5 text-muted-foreground" aria-hidden />
                <strong>{user.followers}</strong>
                <span className="text-muted-foreground">followers</span>
              </span>
              <span>
                <strong>{user.following}</strong>{" "}
                <span className="text-muted-foreground">following</span>
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" render={<Link href="/settings" />}>
          <Settings className="size-3.5" />
          Settings
        </Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Items saved", value: user.itemsSaved, icon: BookMarked },
          { label: "Learning streak", value: `${user.streak} days`, icon: Flame },
          { label: "Reviews completed", value: user.reviewsCompleted, icon: Award },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border/80 bg-card/50 p-4"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <s.icon className="size-3.5 text-primary" aria-hidden />
              {s.label}
            </div>
            <p className="mt-2 text-xl font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Achievements</h2>
        {user.achievements.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No achievements yet"
            description="Keep saving and reviewing to unlock your first badge."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {user.achievements.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-border/80 bg-card/50 p-4"
              >
                <Badge variant="secondary" className="text-[10px]">
                  {a.earnedAt}
                </Badge>
                <p className="mt-2 text-sm font-medium">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Collections</h2>
        {collections.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No collections yet"
            description="Collections will show up here once you create them."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {collections.map((c) => (
              <Button
                key={c.id}
                variant="outline"
                size="sm"
                render={<Link href={`/collections/${c.id}`} />}
              >
                {c.name}
              </Button>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Reading history</h2>
        {history.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Use Quick Save to start building your library."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {history.map((item) => (
              <KnowledgeCard key={item.id} item={item} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
