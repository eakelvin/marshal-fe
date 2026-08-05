import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-card/50" />}>
      <LoginForm />
    </Suspense>
  );
}
