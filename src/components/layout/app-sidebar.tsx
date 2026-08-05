"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  Compass,
  FlaskConical,
  FolderOpen,
  Home,
  Network,
  Search,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { collections } from "@/lib/data/mock";

const mainNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/graph", label: "Graph", icon: Network },
  { href: "/collections", label: "Collections", icon: FolderOpen },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/review", label: "Review", icon: Brain },
  { href: "/agents", label: "Agents", icon: FlaskConical },
  { href: "/search", label: "Search", icon: Search },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center px-4">
        <Logo href="/" />
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <nav aria-label="Main" className="space-y-0.5">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-ring",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Separator className="my-4" />
        <div>
          <p className="px-2.5 mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Pinned
          </p>
          <ul className="space-y-0.5">
            {collections
              .filter((c) => c.pinned)
              .map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/collections/${c.id}`}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-colors focus-ring"
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full bg-gradient-to-br",
                        c.coverColor
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{c.name}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground transition-colors focus-ring",
            pathname.startsWith("/settings") &&
            "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          )}
        >
          <Settings className="size-4" aria-hidden />
          Settings
        </Link>
      </div>
    </aside>
  );
}
