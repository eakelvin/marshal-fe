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
  avatar?: string;
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
