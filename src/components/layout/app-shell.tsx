"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AiPanel } from "@/components/layout/ai-panel";
import { CommandPalette } from "@/components/layout/command-palette";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [aiOpen, setAiOpen] = useState(true);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav aiOpen={aiOpen} onToggleAi={() => setAiOpen((o) => !o)} />
        <div className="flex min-h-0 flex-1">
          <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
          <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
        </div>
      </div>
      <BottomNav />
      <CommandPalette />
    </div>
  );
}
