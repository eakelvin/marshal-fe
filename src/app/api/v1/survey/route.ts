import { NextResponse } from "next/server";
import { parseSurveyAnswers } from "@/lib/api/survey-schema";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const answers = parseSurveyAnswers(json);
  if (!answers) {
    return NextResponse.json(
      { message: "Invalid survey answers" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("surveys").insert({
    save_where: answers.saveWhere,
    after_save: answers.afterSave,
    revisit: answers.revisit,
    frustration: answers.frustration,
    would_pay: answers.wouldPay,
  });

  if (error) {
    console.error("[survey] insert failed", error);
    return NextResponse.json(
      { message: "Could not save survey" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    survey: {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...answers,
    },
  });
}
