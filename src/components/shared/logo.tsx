import Link from "next/link";
import { cn } from "@/lib/utils";

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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4"
          aria-hidden
        >
          <circle cx="8" cy="8" r="2.5" fill="currentColor" opacity="0.9" />
          <circle cx="16" cy="8" r="2.5" fill="currentColor" opacity="0.7" />
          <circle cx="12" cy="16" r="2.5" fill="currentColor" />
          <path
            d="M9.5 9.5L11 14M14.5 9.5L13 14M10 8.5h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Marshal
        </span>
      )}
    </Link>
  );
}
