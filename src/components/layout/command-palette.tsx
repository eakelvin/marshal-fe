"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Brain,
  Compass,
  FlaskConical,
  FolderOpen,
  Home,
  Network,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { knowledgeItems, collections } from "@/lib/data/mock";

const pages = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/save", label: "Save Knowledge", icon: Plus },
  { href: "/graph", label: "Knowledge Graph", icon: Network },
  { href: "/collections", label: "Collections", icon: FolderOpen },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/review", label: "Review", icon: Brain },
  { href: "/agents", label: "AI Agents", icon: FlaskConical },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && !e.shiftKey) {
        if (
          !(e.target instanceof HTMLInputElement) &&
          !(e.target instanceof HTMLTextAreaElement)
        ) {
          e.preventDefault();
          router.push("/save");
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router]);

  // Close on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search knowledge, pages, collections..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => go("/save")}>
            <Plus className="size-4" />
            Quick Save
            <CommandShortcut>Cmd+S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/review")}>
            <Brain className="size-4" />
            Start Daily Review
          </CommandItem>
          <CommandItem onSelect={() => go("/search")}>
            <Sparkles className="size-4" />
            Semantic Search
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Pages">
          {pages.map((p) => (
            <CommandItem key={p.href} onSelect={() => go(p.href)}>
              <p.icon className="size-4" />
              {p.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Knowledge">
          {knowledgeItems.slice(0, 5).map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => go(`/library/${item.id}`)}
              value={item.title}
            >
              <BookOpen className="size-4" />
              <span className="truncate">{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Collections">
          {collections.map((c) => (
            <CommandItem
              key={c.id}
              onSelect={() => go(`/collections/${c.id}`)}
              value={c.name}
            >
              <FolderOpen className="size-4" />
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground flex gap-3">
        <span>
          <kbd className="rounded border border-border bg-muted px-1">Enter</kbd> open
        </span>
        <span>
          <kbd className="rounded border border-border bg-muted px-1">Esc</kbd> close
        </span>
        <Link href="/search" className="ml-auto hover:text-foreground" onClick={() => setOpen(false)}>
          Advanced search
        </Link>
      </div>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  return {
    open: () => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", metaKey: true })
      );
    },
  };
}
