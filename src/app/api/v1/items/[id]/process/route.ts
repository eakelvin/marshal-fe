import { NextResponse } from "next/server";
import { processKnowledgeItemServer } from "@/lib/api/knowledge-server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 120;

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** Retry / kick Collector + Summarizer for an item the user owns. */
export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const item = await processKnowledgeItemServer(id);
    return NextResponse.json({ item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not process item";
    console.error("[items process]", id, error);
    const status =
      message === "Unauthorized"
        ? 401
        : message === "Item not found"
          ? 404
          : 500;
    return NextResponse.json({ message }, { status });
  }
}
