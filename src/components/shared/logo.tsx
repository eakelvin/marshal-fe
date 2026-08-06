import Link from "next/link";
import { cn } from "@/lib/utils";

/** Marshal mark — three linked nodes (curated knowledge graph). */
function MarshalMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M7.5 9.25 L12 15.25 L16.5 9.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle cx="7.5" cy="8.75" r="2.35" fill="currentColor" />
      <circle cx="16.5" cy="8.75" r="2.35" fill="currentColor" opacity="0.9" />
      <circle cx="12" cy="16.5" r="2.35" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  href = "/",
}: {
  className?: string;
  showWordmark?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 focus-ring rounded-lg",
        className
      )}
      aria-label="Marshal home"
    >
      <span className="relative flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25">
        <MarshalMark className="size-4" />
      </span>
      {showWordmark && (
        <span className="font-[family-name:var(--font-display)] text-[17px] font-normal tracking-tight text-foreground">
          Marshal
        </span>
      )}
    </Link>
  );
}
