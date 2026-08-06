import { NextResponse } from "next/server";
import { getKnowledgeItemServer } from "@/lib/api/knowledge-server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
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

    const item = await getKnowledgeItemServer(id);
    if (!item) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load item";
    console.error("[items GET id]", error);
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}
