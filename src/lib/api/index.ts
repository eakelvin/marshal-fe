export { api } from "@/lib/api/client";
export { ApiError } from "@/lib/api/errors";
export { getAccessToken, setAccessToken } from "@/lib/api/session";
export {
  login,
  register,
  requestMagicLink,
  requestPasswordReset,
  updatePassword,
  signInWithGoogle,
  logout,
  getAuthUser,
} from "@/lib/api/auth";
export type { AuthResult } from "@/lib/api/auth";
export {
  listKnowledgeItems,
  getKnowledgeItem,
  createKnowledgeItem,
  deleteKnowledgeItem,
  processKnowledgeItem,
} from "@/lib/api/knowledge";
export { listCollections, getCollection } from "@/lib/api/collections";
export {
  getInsights,
  getWeeklyProgress,
  getFirstName,
} from "@/lib/api/user";
export { submitSurvey } from "@/lib/api/survey";
export type { SurveyAnswers, SurveyRecord } from "@/lib/api/survey-schema";
export { SURVEY_OPTIONS } from "@/lib/api/survey-schema";
