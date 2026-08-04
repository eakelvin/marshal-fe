import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { KnowledgeSource } from "@/types";
import {
  BookOpen,
  FileText,
  FolderGit2,
  Headphones,
  Newspaper,
  X,
  Video,
  File,
} from "lucide-react";

const config: Record<
  KnowledgeSource,
  { icon: ComponentType<{ className?: string }>; label: string; color: string }
> = {
  article: { icon: Newspaper, label: "Article", color: "text-sky-400" },
  youtube: { icon: Video, label: "YouTube", color: "text-red-400" },
  tweet: { icon: X, label: "X", color: "text-foreground" },
  paper: { icon: FileText, label: "Paper", color: "text-amber-400" },
  github: { icon: FolderGit2, label: "GitHub", color: "text-violet-400" },
  podcast: { icon: Headphones, label: "Podcast", color: "text-emerald-400" },
  blog: { icon: BookOpen, label: "Blog", color: "text-blue-400" },
  document: { icon: File, label: "Document", color: "text-orange-400" },
};

export function SourceBadge({
  source,
  className,
  showLabel = true,
}: {
  source: KnowledgeSource;
  className?: string;
  showLabel?: boolean;
}) {
  const { icon: Icon, label, color } = config[source];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <Icon className={cn("size-3.5", color)} aria-hidden />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
