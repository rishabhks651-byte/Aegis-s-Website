import Link from "next/link";
import type { DocNavItem } from "@/lib/site";

interface DocNavProps {
  prev: DocNavItem | null;
  next: DocNavItem | null;
}

export function DocNav({ prev, next }: DocNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 flex items-center justify-between border-t border-surface-800 pt-8" aria-label="Documentation pages">
      {prev ? (
        <Link
          href={prev.href}
          className="flex items-center gap-2 rounded-lg border border-surface-700 px-4 py-3 text-sm text-surface-400 transition-colors hover:border-surface-600 hover:text-white"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex items-center gap-2 rounded-lg border border-surface-700 px-4 py-3 text-sm text-surface-400 transition-colors hover:border-surface-600 hover:text-white"
        >
          <span className="hidden sm:inline">{next.title}</span>
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
