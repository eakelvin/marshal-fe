"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AccountForm } from "@/components/settings/account-form";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { UserProfile } from "@/types";

export function SettingsView({ user }: { user: UserProfile }) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [reviewReminders, setReviewReminders] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theme, notifications, AI preferences, privacy, billing, and account.
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap">
          <TabsTrigger value="account">Account</TabsTrigger>
          {/* <TabsTrigger value="theme">Theme</TabsTrigger> */}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {/* <TabsTrigger value="ai">AI</TabsTrigger> */}
          {/* <TabsTrigger value="apps">Apps</TabsTrigger> */}
          {/* <TabsTrigger value="privacy">Privacy</TabsTrigger> */}
          <TabsTrigger value="billing">Billing</TabsTrigger>
          {/* <TabsTrigger value="api">API Keys</TabsTrigger> */}
        </TabsList>

        <TabsContent value="account" className="mt-6 space-y-4">
          <AccountForm user={user} />
        </TabsContent>

        {/* <TabsContent value="theme" className="mt-6">
          <div className="rounded-xl border border-border/80 bg-card/50 p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Appearance</p>
              <p className="text-xs text-muted-foreground mt-1">
                Dark mode first. Toggle anytime.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </TabsContent> */}

        <TabsContent value="notifications" className="mt-6 space-y-3">
          {[
            {
              label: "Email notifications",
              desc: "Weekly digests and important alerts",
              checked: emailNotifs,
              set: setEmailNotifs,
            },
            {
              label: "Review reminders",
              desc: "Daily and weekly spaced-repetition nudges",
              checked: reviewReminders,
              set: setReviewReminders,
            },
            {
              label: "AI recommendations",
              desc: "When Coach finds a strong next read",
              checked: aiSuggestions,
              set: setAiSuggestions,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-border/80 bg-card/50 p-4 gap-4"
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch
                checked={item.checked}
                onCheckedChange={item.set}
                aria-label={item.label}
              />
            </div>
          ))}
        </TabsContent>

        {/* <TabsContent value="ai" className="mt-6 space-y-4">
          <div className="rounded-xl border border-border/80 bg-card/50 p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals">Learning goals</Label>
              <Textarea
                id="goals"
                defaultValue="Master RAG systems and ship calmer product interfaces."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Coach tone</Label>
              <Input id="tone" defaultValue="Calm, concise, actionable" />
            </div>
            <Button onClick={() => toast.success("AI preferences saved")}>
              Save AI preferences
            </Button>
          </div>
        </TabsContent> */}

        {/* <TabsContent value="apps" className="mt-6 space-y-3">
          {["Notion", "Readwise", "Raindrop", "Obsidian"].map((app) => (
            <div
              key={app}
              className="flex items-center justify-between rounded-xl border border-border/80 bg-card/50 p-4"
            >
              <p className="text-sm font-medium">{app}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.message(`${app} connection coming soon`)}
              >
                Connect
              </Button>
            </div>
          ))}
        </TabsContent> */}

        {/* <TabsContent value="privacy" className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card/50 p-4 gap-4">
            <div>
              <p className="text-sm font-medium">Public profile</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Allow others to follow your public collections
              </p>
            </div>
            <Switch
              checked={publicProfile}
              onCheckedChange={setPublicProfile}
              aria-label="Public profile"
            />
          </div>
          <Button variant="outline" onClick={() => toast.success("Data export started")}>
            Export my data
          </Button>
        </TabsContent> */}

        <TabsContent value="billing" className="mt-6">
          <div className="rounded-xl border border-border/80 bg-card/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current plan</p>
                <p className="text-xs text-muted-foreground mt-0.5">Explorer  |  Free</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              You&apos;re on the free plan. Paid upgrades will show up here when they&apos;re available.
            </p>
            <Button variant="outline" disabled>
              Manage billing
            </Button>
          </div>
        </TabsContent>

        {/* <TabsContent value="api" className="mt-6 space-y-4">
          <div className="rounded-xl border border-border/80 bg-card/50 p-5 space-y-3">
            <p className="text-sm font-medium">Personal API key</p>
            <code className="block rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
              syn_live_****************4f2a
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("New API key generated")}
            >
              Rotate key
            </Button>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
