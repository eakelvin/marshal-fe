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
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/graph", label: "Graph", icon: Network },
  { href: "/collections", label: "Collections", icon: FolderOpen },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/review", label: "Review", icon: Brain },
  { href: "/agents", label: "Agents", icon: FlaskConical },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Mobile" className="flex flex-col gap-0.5 p-3">
      {links.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
