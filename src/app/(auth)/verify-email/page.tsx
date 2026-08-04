import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 text-center shadow-xl shadow-primary/5 backdrop-blur sm:p-8">
      <div className="mx-auto mb-6 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Inbox className="size-5" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        We sent a verification link to your email. Click it to activate your Marshal account.
      </p>
      <Button className="mt-8 w-full" render={<Link href="/onboarding" />}>
        I&apos;ve verified  -  continue
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">
        Didn&apos;t get it? Check spam or{" "}
        <button type="button" className="text-primary hover:underline">
          resend
        </button>
      </p>
    </div>
  );
}
