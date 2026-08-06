import { after, NextResponse } from "next/server";
import { parseCreateKnowledgeInput } from "@/lib/api/knowledge-schema";
import {
  createKnowledgeItemServer,
  listKnowledgeItemsServer,
  processKnowledgeItemServer,
} from "@/lib/api/knowledge-server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 120;

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const items = await listKnowledgeItemsServer();
    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load items";
    console.error("[items GET]", error);
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const input = parseCreateKnowledgeInput(json);
  if (!input) {
    return NextResponse.json(
      { message: "Enter a valid link (e.g. example.com or https://…)" },
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

    const item = await createKnowledgeItemServer(input);

    // Phase B+C: Collector → Summarizer after the response
    after(async () => {
      try {
        await processKnowledgeItemServer(item.id);
      } catch (error) {
        console.error("[items POST] process", item.id, error);
      }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save item";
    console.error("[items POST]", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
