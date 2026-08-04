export const SURVEY_OPTIONS = {
  saveWhere: [
    "Browser bookmarks",
    "Read-later apps",
    "Notion / docs",
    "Notes or screenshots",
    "Nowhere systematically",
    "Other",
  ],
  afterSave: [
    "I revisit and learn from it",
    "I organize it later — sometimes",
    "It sits unused",
    "I forget it exists",
    "I share it, then move on",
  ],
  revisit: ["Daily", "Weekly", "Monthly", "Rarely", "Almost never"],
  frustration: [
    "I can't find things later",
    "No time to go back",
    "Everything gets messy",
    "I don't know what's worth revisiting",
    "Tools don't help me actually learn",
  ],
  wouldPay: ["Yes", "Maybe — depends on price", "Not sure", "No"],
} as const;

export type SurveyAnswers = {
  saveWhere: string[];
  afterSave: string;
  revisit: string;
  frustration: string;
  wouldPay: string;
};

export type SurveyRecord = SurveyAnswers & {
  id: string;
  createdAt: string;
};

export function parseSurveyAnswers(input: unknown): SurveyAnswers | null {
  if (!input || typeof input !== "object") return null;
  const body = input as Record<string, unknown>;

  const saveWhere = body.saveWhere;
  if (
    !Array.isArray(saveWhere) ||
    saveWhere.length === 0 ||
    !saveWhere.every(
      (v) =>
        typeof v === "string" &&
        (SURVEY_OPTIONS.saveWhere as readonly string[]).includes(v)
    )
  ) {
    return null;
  }

  const afterSave = body.afterSave;
  const revisit = body.revisit;
  const frustration = body.frustration;
  const wouldPay = body.wouldPay;

  if (
    typeof afterSave !== "string" ||
    !(SURVEY_OPTIONS.afterSave as readonly string[]).includes(afterSave)
  ) {
    return null;
  }
  if (
    typeof revisit !== "string" ||
    !(SURVEY_OPTIONS.revisit as readonly string[]).includes(revisit)
  ) {
    return null;
  }
  if (
    typeof frustration !== "string" ||
    !(SURVEY_OPTIONS.frustration as readonly string[]).includes(frustration)
  ) {
    return null;
  }
  if (
    typeof wouldPay !== "string" ||
    !(SURVEY_OPTIONS.wouldPay as readonly string[]).includes(wouldPay)
  ) {
    return null;
  }

  return {
    saveWhere: [...new Set(saveWhere)],
    afterSave,
    revisit,
    frustration,
    wouldPay,
  };
}
