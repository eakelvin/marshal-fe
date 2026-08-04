import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { SurveyAnswers, SurveyRecord } from "@/lib/api/survey-schema";
import { env } from "@/lib/config/env";

/**
 * Submit survey answers.
 * - mock: no persistence
 * - supabase: same-origin POST /api/v1/survey → Supabase
 * - http: POST {API_URL}/v1/survey → Node (later)
 */
export async function submitSurvey(
  answers: SurveyAnswers
): Promise<SurveyRecord> {
  if (env.apiProvider === "mock") {
    return {
      id: `survey-mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...answers,
    };
  }

  if (env.apiProvider === "http") {
    const data = await api<{ survey: SurveyRecord }>("/v1/survey", {
      method: "POST",
      body: answers,
      auth: false,
    });
    return data.survey;
  }

  // supabase (default production path for now)
  const res = await fetch("/api/v1/survey", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(answers),
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as { survey?: SurveyRecord; message?: string }) : {};

  if (!res.ok) {
    throw new ApiError(data.message || res.statusText || "Submit failed", res.status, data);
  }

  if (!data.survey) {
    throw new ApiError("Invalid survey response", 500, data);
  }

  return data.survey;
}
