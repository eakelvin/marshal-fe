export type KnowledgeSource =
  | "article"
  | "youtube"
  | "tweet"
  | "paper"
  | "github"
  | "podcast"
  | "blog"
  | "document";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type CollectionVisibility = "public" | "private" | "shared" | "ai" | "pinned";

export type AgentStatus = "idle" | "running" | "success" | "error" | "queued";

export type NotificationType =
  | "review"
  | "recommendation"
  | "collection"
  | "resurfaced"
  | "trending"
  | "system";

export interface KnowledgeItem {
  id: string;
  title: string;
  url: string;
  source: KnowledgeSource;
  author: string;
  summary: string;
  takeaways: string[];
  quotes: string[];
  tags: string[];
  topics: string[];
  difficulty: Difficulty;
  readingTime: number;
  whyItMatters: string;
  connections: string[];
  suggestedNext?: string;
  savedAt: string;
  processed: boolean;
  image?: string;
  collectionIds: string[];
  /** Optional user context captured at save time */
  notes?: string;
  /** Pipeline status for async agents */
  status?: "queued" | "processing" | "collected" | "ready" | "failed";
  /** Short source description (og:description / excerpt) after Collector */
  description?: string;
  /** True once Collector stored page text */
  hasContent?: boolean;
  /** Last Collector error, if any */
  fetchError?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  visibility: CollectionVisibility;
  itemCount: number;
  coverColor: string;
  updatedAt: string;
  pinned?: boolean;
  curator?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  confidence: number;
  lastRun: string;
  executionTime: number;
  recentActions: AgentAction[];
  logs: string[];
}

export interface AgentAction {
  id: string;
  label: string;
  timestamp: string;
  status: AgentStatus;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  occupation: string;
  /** Personal site / portfolio hostname or URL */
  domain?: string;
  /** LinkedIn profile URL or username */
  linkedin?: string;
  /** GitHub profile URL or username */
  github?: string;
  /** X / Twitter profile URL or username */
  twitter?: string;
  /** ISO date YYYY-MM-DD */
  birthday?: string;
  /** Phone number */
  phone?: string;
  /** Mailing / home address */
  address?: string;
  avatar?: string;
  /** True when the account has an email/password identity (not Google-only). */
  hasPasswordAuth?: boolean;
  streak: number;
  itemsSaved: number;
  reviewsCompleted: number;
  followers: number;
  following: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  icon: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "idea" | "topic" | "item";
  x: number;
  y: number;
  size: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
}
