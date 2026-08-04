import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Magic link" };

export default function MagicLinkPage() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur sm:p-8">
      <div className="mb-6 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Mail className="size-5" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Magic link</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        We&apos;ll email you a one-click sign-in link. No password needed.
      </p>
      <form className="mt-8 space-y-4" action="/verify-email">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required placeholder="you@company.com" />
        </div>
        <Button type="submit" className="w-full">
          Send magic link
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
