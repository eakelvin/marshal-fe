import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/config/env";
import { updateSession } from "@/lib/supabase/proxy";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/library",
  "/save",
  "/collections",
  "/graph",
  "/discover",
  "/search",
  "/review",
  "/agents",
  "/profile",
  "/settings",
  "/onboarding",
];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/magic-link",
  "/forgot-password",
  "/verify-email",
];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function proxy(request: NextRequest) {
  // Demo / Node modes: don't enforce Supabase sessions yet
  if (env.apiProvider !== "supabase") {
    return NextResponse.next();
  }

  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    return NextResponse.next();
  }

  const { user, supabaseResponse } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (isProtected(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
