"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Inbox, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, requestMagicLink } from "@/lib/api";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await requestMagicLink(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send magic link");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 text-center shadow-xl shadow-primary/5 backdrop-blur sm:p-8">
        <div className="mx-auto mb-6 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Inbox className="size-5" aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          We sent a sign-in link to <span className="text-foreground">{email}</span>.
          Click it to continue.
        </p>
        <Button className="mt-8 w-full" render={<Link href="/login" />}>
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur sm:p-8">
      <div className="mb-6 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Mail className="size-5" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Magic link</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        We&apos;ll email you a one-click sign-in link. No password needed.
      </p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full gap-2" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner className="size-4" />
              Sending
            </>
          ) : (
            "Send magic link"
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Use password instead
        </Link>
      </p>
    </div>
  );
}
