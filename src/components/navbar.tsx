"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/getting-started", label: "Getting Started" },
  { href: "/policies", label: "Policies" },
  { href: "/security", label: "Security" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-aegis-600 text-xs font-bold text-white">
            A
          </span>
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-surface-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              {l.label}
            </Link>
          ))}
          <Link href={siteConfig.githubUrl} className="btn-primary text-xs">
            View on GitHub
          </Link>
        </nav>

        <button
          ref={btnRef}
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-surface-400 md:hidden hover:text-white"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div ref={menuRef} className="border-t border-surface-800 md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={siteConfig.githubUrl}
              className="btn-primary mt-2 justify-center"
            >
              View on GitHub
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
