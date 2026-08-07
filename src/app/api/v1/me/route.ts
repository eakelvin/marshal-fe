import { NextResponse } from "next/server";
import { parseUpdateProfileInput } from "@/lib/api/user-schema";
import {
  getCurrentUser,
  updateCurrentUser,
} from "@/lib/api/user-server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const profile = await getCurrentUser();
    return NextResponse.json({ user: profile });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load profile";
    console.error("[me GET]", error);
    const status =
      message === "Unauthorized" || message === "Not authenticated"
        ? 401
        : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function PATCH(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const input = parseUpdateProfileInput(json);
  if (!input) {
    return NextResponse.json(
      { message: "Check display name and profile fields (birthday must be YYYY-MM-DD)." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const profile = await updateCurrentUser(input);
    return NextResponse.json({ user: profile });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update profile";
    console.error("[me PATCH]", error);
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}
