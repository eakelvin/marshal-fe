import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Clears the Supabase session cookies server-side. */
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
