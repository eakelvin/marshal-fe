import { Suspense } from "react";
import { VerifyEmailCard } from "@/components/auth/verify-email-card";

export const metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-card/50" />}>
      <VerifyEmailCard />
    </Suspense>
  );
}
