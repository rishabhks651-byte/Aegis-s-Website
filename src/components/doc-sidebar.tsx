"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { docNav } from "@/lib/site";

interface DocSidebarProps {
  current: string;
}

export function DocSidebar({ current }: DocSidebarProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // Escape closes mobile sidebar
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        ref={toggleRef}
        onClick={toggle}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-aegis-600 px-4 py-2 text-sm font-medium text-white shadow-lg lg:hidden hover:bg-aegis-500 focus-visible:outline-2 focus-visible:outline-aegis-400 focus-visible:outline-offset-2"
        aria-label={open ? "Close documentation navigation" : "Open documentation navigation"}
        aria-expanded={open}
        aria-controls="doc-sidebar-panel"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Docs
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="doc-sidebar-panel"
        ref={panelRef}
        className={`fixed bottom-0 left-0 top-16 z-30 flex w-60 flex-col border-r border-surface-800 bg-surface-950 transition-transform lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Documentation navigation"
      >
        <nav aria-label="Documentation" className="flex-1 overflow-y-auto overscroll-contain p-6">
          <ul className="space-y-1">
            {docNav.map((item) => {
              const active = item.href === current;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-aegis-600/20 text-aegis-300 font-medium"
                        : "text-surface-400 hover:bg-surface-800 hover:text-surface-200"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
