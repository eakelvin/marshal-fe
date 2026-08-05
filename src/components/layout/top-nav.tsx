"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Menu,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { notifications } from "@/lib/data/mock";
import { getAuthUser } from "@/lib/api";
import type { UserProfile } from "@/types";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/shared/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAccountMenu } from "@/components/shared/user-account-menu";

export function TopNav({
  onToggleAi,
  aiOpen,
}: {
  onToggleAi?: () => void;
  aiOpen?: boolean;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    let cancelled = false;
    getAuthUser()
      .then((authUser) => {
        if (!cancelled) setUser(authUser);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label="Open menu"
            />
          }
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle>
              <Logo href="/dashboard" />
            </SheetTitle>
          </SheetHeader>
          <MobileNav />
        </SheetContent>
      </Sheet>

      <button
        type="button"
        onClick={() => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true })
          );
        }}
        className="hidden sm:flex h-8 flex-1 max-w-md items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/70 focus-ring"
        aria-label="Open command palette"
      >
        <Search className="size-3.5 shrink-0" aria-hidden />
        <span className="flex-1 text-left truncate">Search knowledge...</span>
        <kbd className="hidden md:inline-flex h-5 items-center rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
          Cmd+K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          aria-label="Search"
          render={<Link href="/search" />}
        >
          <Search className="size-4" />
        </Button>

        <Button
          size="sm"
          className="hidden sm:inline-flex gap-1.5"
          render={<Link href="/save" />}
        >
          <Plus className="size-3.5" />
          Save
        </Button>

        <Button
          variant={aiOpen ? "secondary" : "ghost"}
          size="icon-sm"
          className="hidden md:inline-flex"
          aria-label="Toggle AI assistant"
          aria-pressed={aiOpen}
          onClick={onToggleAi}
        >
          <Sparkles className="size-4" />
        </Button>

        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
                className="relative"
              />
            }
          >
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">{unread} unread</p>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "border-b border-border/60 px-4 py-3 last:border-0",
                    !n.read && "bg-primary/5"
                  )}
                >
                  <p className="text-sm font-medium leading-snug">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {n.body}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <ThemeToggle />

        {!loaded ? (
          <Skeleton className="size-7 rounded-full" />
        ) : user ? (
          <UserAccountMenu user={user} />
        ) : null}
      </div>
    </header>
  );
}
