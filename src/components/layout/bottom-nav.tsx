"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Brain, Home, Network, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/save", label: "Save", icon: Plus, primary: true },
  { href: "/graph", label: "Graph", icon: Network },
  { href: "/review", label: "Review", icon: Brain },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 backdrop-blur-xl lg:hidden safe-bottom"
    >
      <ul className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          if (tab.primary) {
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 focus-ring rounded-xl"
                  aria-label="Save knowledge"
                >
                  <span className="flex size-10 -mt-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <tab.icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-[10px] font-medium text-primary">
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] focus-ring rounded-lg",
                  active
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <tab.icon className="size-5" aria-hidden />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
