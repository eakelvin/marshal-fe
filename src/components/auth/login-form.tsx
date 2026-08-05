"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { GoogleIcon } from "@/components/shared/google-icon";
import { PasswordInput } from "@/components/auth/password-input";
import { ApiError, login, signInWithGoogle } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    authError === "auth" ? "Authentication failed. Please try again." : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      router.replace(next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle(next.startsWith("/") ? next : "/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in to continue learning with Marshal.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full h-9 gap-2" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner className="size-4" />
              Signing in
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          disabled={googleLoading}
          onClick={handleGoogle}
        >
          {googleLoading ? <Spinner className="size-4" /> : <GoogleIcon />}
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" render={<Link href="/magic-link" />}>
          Continue with magic link
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
