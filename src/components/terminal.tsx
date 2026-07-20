"use client";

import { useState, useCallback } from "react";

interface TerminalProps {
  lines: Line[];
  title?: string;
}

interface Line {
  content?: string;
  prompt?: boolean;
  comment?: boolean;
  output?: string;
}

export function Terminal({ lines, title = "Terminal" }: TerminalProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const text = lines
    .map((l) => {
      const prefix = l.prompt ? "$ " : "";
      const line = (l.content != null) ? prefix + l.content : "";
      if (l.output) return line + (line ? "\n" : "") + l.output;
      return line;
    })
    .join("\n");

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
    } catch {
      // Fallback for HTTP or restricted contexts
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setFailed(false);
      } catch {
        setFailed(true);
        return;
      }
    }
    setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2000);
  }, [text]);

  return (
    <div className="overflow-hidden rounded-lg border border-surface-700 bg-surface-950">
      <div className="flex items-center justify-between border-b border-surface-700 px-4 py-2">
        <span className="text-xs text-surface-500">{title}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300"
          aria-label={copied ? "Copied" : failed ? "Copy failed" : "Copy to clipboard"}
        >
          {failed ? (
            <span className="text-red-400">Failed</span>
          ) : copied ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>
          {lines.map((l, i) => (
            <span key={i} className="block">
              {l.prompt && (
                <span className="text-aegis-500 select-none">$ </span>
              )}
              {l.comment && l.content != null ? (
                <span className="text-surface-600 italic">{l.content}</span>
              ) : l.content != null ? (
                <span>{l.content}</span>
              ) : null}
              {l.output && (
                <span className="block text-surface-400">{l.output}</span>
              )}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
