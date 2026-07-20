"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { getPrevNext } from "@/lib/site";
import { Terminal } from "@/components/terminal";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocNav } from "@/components/doc-nav";

const sections = [
  {
    id: "authentication",
    title: "Authentication",
    desc: "Aegis uses bcrypt password hashing and SHA-256 session tokens. Users must authenticate before running any command.",
    commands: [
      {
        title: "Create a user",
        usage: "aegis user create <username>",
        args: "username — 3-32 chars, letters/digits/underscore/hyphen",
        note: "Prompts for password interactively. Requires a minimum of 8 characters.",
        terminal: {
          lines: [
            { content: "aegis user create alice", prompt: true },
            { output: "  Password: ********" },
            { output: "  Confirm:   ********" },
            { output: "  User 'alice' created successfully (id=usr_abc123)" },
          ],
        },
      },
      {
        title: "Log in",
        usage: "aegis login <username>",
        note: "Creates a session token valid for 24 hours. The token is stored locally.",
        terminal: {
          lines: [
            { content: "aegis login alice", prompt: true },
            { output: "  Password: ********" },
            { output: "  Logged in as 'alice'" },
          ],
        },
      },
      {
        title: "Log out",
        usage: "aegis logout",
        terminal: {
          lines: [
            { content: "aegis logout", prompt: true },
            { output: "  Logged out" },
          ],
        },
      },
      {
        title: "Check identity",
        usage: "aegis whoami",
        terminal: {
          lines: [
            { content: "aegis whoami", prompt: true },
            { output: "  Authenticated as 'alice' (id=usr_abc123)" },
          ],
        },
      },
      {
        title: "View permissions",
        usage: "aegis auth permissions",
        terminal: {
          lines: [
            { content: "aegis auth permissions", prompt: true },
            { output: "  User:       'alice' (id=usr_abc123)" },
            { output: "  Role:       USER" },
            { output: "  Permissions:" },
            { output: "    (none)" },
          ],
        },
      },
    ],
  },
  {
    id: "users",
    title: "User Management",
    desc: "Users can be created and assigned roles. Role management requires the ADMIN role.",
    commands: [
      {
        title: "Set user role",
        usage: "aegis user role set <username> <role>",
        args: "role — USER, PAYMENT_VERIFIER, or ADMIN",
        note: "Requires the user.manage permission (ADMIN role).",
        terminal: {
          lines: [
            { content: "aegis user role set bob ADMIN", prompt: true },
            { output: "  User 'bob' role set to ADMIN" },
          ],
        },
      },
    ],
  },
  {
    id: "agents",
    title: "Agents",
    desc: "Agents represent AI agents or automated services. Each agent has a unique ID and belongs to a single user.",
    commands: [
      {
        title: "Create an agent",
        usage: "aegis agent create <name>",
        args: "name — 1-64 chars, letters/digits/dot/underscore/hyphen",
        note: "Agent limits are enforced by the user's subscription plan.",
        terminal: {
          lines: [
            { content: "aegis agent create research-bot", prompt: true },
            { output: "  Agent 'research-bot' created (id=agt_def456)" },
          ],
        },
      },
      {
        title: "List agents",
        usage: "aegis agent list",
        terminal: {
          lines: [
            { content: "aegis agent list", prompt: true },
            { output: "  agt_def456  research-bot                  2026-07-20  active" },
          ],
        },
      },
      {
        title: "Show agent details",
        usage: "aegis agent show <agent-id>",
        terminal: {
          lines: [
            { content: "aegis agent show agt_def456", prompt: true },
            { output: "  ID:        agt_def456" },
            { output: "  Name:      research-bot" },
            { output: "  Created:   2026-07-20T10:30:00+00:00" },
            { output: "  Status:    active" },
          ],
        },
      },
      {
        title: "Revoke an agent",
        usage: "aegis agent revoke <agent-id>",
        note: "Revoked agents cannot be re-activated. Create a new agent to replace it.",
        terminal: {
          lines: [
            { content: "aegis agent revoke agt_def456", prompt: true },
            { output: "  Agent 'research-bot' revoked." },
          ],
        },
      },
    ],
  },
  {
    id: "policies",
    title: "Policies",
    desc: "Policies are YAML files that define what actions agents are allowed to perform. Rules are evaluated in priority order, and the first match wins.",
    commands: [
      {
        title: "Apply a policy",
        usage: "aegis policy apply <file>",
        args: "file — Path to a YAML policy file",
        terminal: {
          lines: [
            { content: "aegis policy apply allow-read.yaml", prompt: true },
            { output: "  Policy 'allow-read' applied (id=pol_ghi789, 3 rule(s))" },
          ],
        },
      },
      {
        title: "List policies",
        usage: "aegis policy list",
        terminal: {
          lines: [
            { content: "aegis policy list", prompt: true },
            { output: "  pol_ghi789  allow-read                              pri=100  enabled" },
          ],
        },
      },
      {
        title: "Show policy details",
        usage: "aegis policy show <policy-id>",
        terminal: {
          lines: [
            { content: "aegis policy show pol_ghi789", prompt: true },
            { output: "  ID:         pol_ghi789" },
            { output: "  Name:       allow-read" },
            { output: "  Priority:   100" },
            { output: "  Enabled:    True" },
            { output: "  Rules:      3" },
          ],
        },
      },
    ],
  },
  {
    id: "actions",
    title: "Actions",
    desc: "Actions represent agent requests. The action is evaluated against the user's policies and a decision is returned.",
    commands: [
      {
        title: "Evaluate an action",
        usage: "aegis action evaluate <agent-id> <policy-id> <action-file>",
        args: "action-file — Path to a JSON file describing the action",
        note: "The action file must contain an action_type string and optional params object.",
        terminal: {
          lines: [
            { content: "aegis action evaluate agt_def456 pol_ghi789 action.json", prompt: true },
            { output: "  Action ID:      act_jkl012" },
            { output: "  Agent ID:       agt_def456" },
            { output: "  Policy ID:      pol_ghi789" },
            { output: "  Result:         ALLOW" },
            { output: "  Matched Rule:   rule-1" },
            { output: "  Reason:         Matched rule allow-read-log" },
          ],
        },
      },
    ],
  },
  {
    id: "audit",
    title: "Audit",
    desc: "All decisions are recorded in a SHA-256 hash-chained audit log. The chain can be verified for integrity at any time.",
    commands: [
      {
        title: "List audit events",
        usage: "aegis audit list",
        terminal: {
          lines: [
            { content: "aegis audit list", prompt: true },
            { output: "  act_jkl012  ALLOW   fs_read              2026-07-20 10:31:00  research-bot" },
          ],
        },
      },
      {
        title: "Show audit event",
        usage: "aegis audit show <event-id>",
        terminal: {
          lines: [
            { content: "aegis audit show act_jkl012", prompt: true },
            { output: "  Decision ID:    act_jkl012" },
            { output: "  Agent ID:       agt_def456" },
            { output: "  Action Type:    fs_read" },
            { output: "  Result:         ALLOW" },
            { output: "  Evaluated At:   2026-07-20T10:31:00+00:00" },
            { output: "  Reason:         Matched rule allow-read-log" },
          ],
        },
      },
      {
        title: "Verify audit integrity",
        usage: "aegis audit verify",
        note: "Checks every event's hash against its predecessor. Detects tampering, reordering, deletion, or insertion.",
        terminal: {
          lines: [
            { content: "aegis audit verify", prompt: true },
            { output: "  Chain: 152/152 events valid" },
          ],
        },
      },
    ],
  },
  {
    id: "filesystem",
    title: "Filesystem",
    desc: "Filesystem access is controlled by policies and path containment rules. Only allowlisted paths within the configured scope are readable.",
    commands: [
      {
        title: "Read a file",
        usage: "aegis fs read <agent-id> <policy-id> <path>",
        note: "Path traversal attempts are blocked. Directories are rejected.",
        terminal: {
          lines: [
            { content: "aegis fs read agt_def456 pol_ghi789 /var/log/app.log", prompt: true },
            { output: "  [file contents]" },
          ],
        },
      },
    ],
  },
  {
    id: "process",
    title: "Process Execution",
    desc: "Only explicitly allowlisted executables can be launched. Arguments are passed through without shell interpretation.",
    commands: [
      {
        title: "Allowlist an executable",
        usage: "aegis process allowlist add <name> <path>",
        note: "The path must be an absolute path to a valid executable.",
        terminal: {
          lines: [
            { content: "aegis process allowlist add my-tool /usr/local/bin/my-tool", prompt: true },
            { output: "  Allowlisted 'my-tool' -> /usr/local/bin/my-tool" },
          ],
        },
      },
      {
        title: "List allowlisted executables",
        usage: "aegis process allowlist list",
        terminal: {
          lines: [
            { content: "aegis process allowlist list", prompt: true },
            { output: "  my-tool                          /usr/local/bin/my-tool" },
          ],
        },
      },
      {
        title: "Run an allowlisted executable",
        usage: "aegis process run <agent-id> <policy-id> <name> [--timeout N] [--output-limit N] [--cwd DIR] [-- args...]",
        note: "Use -- to separate flags intended for the subprocess.",
        terminal: {
          lines: [
            { content: "aegis process run agt_def456 pol_ghi789 my-tool --timeout 60 -- --help", prompt: true },
            { output: "  Action ID:      act_jkl012" },
            { output: "  Result:         ALLOW" },
            { output: "  Exit Code:      0" },
            { output: "  Execution Ms:   12" },
          ],
        },
      },
    ],
  },
  {
    id: "network",
    title: "Network",
    desc: "HTTP requests are controlled by network allowlists and SSRF protection. Only https/http schemes are supported.",
    commands: [
      {
        title: "Allowlist a network destination",
        usage: "aegis net allowlist add <name> --scheme <scheme> --hostname <hostname> [--port PORT] [--path-prefix PREFIX]",
        note: "SSRF validation blocks requests to loopback, private, and link-local addresses.",
        terminal: {
          lines: [
            { content: "aegis net allowlist add my-api --scheme https --hostname api.example.com --path-prefix /v2/", prompt: true },
            { output: "  Allowlisted 'https'://api.example.com as 'my-api'" },
          ],
        },
      },
      {
        title: "List allowed network destinations",
        usage: "aegis net allowlist list",
        terminal: {
          lines: [
            { content: "aegis net allowlist list", prompt: true },
            { output: "  my-api                          https://api.example.com/v2/" },
          ],
        },
      },
      {
        title: "Make a controlled HTTP request",
        usage: "aegis net request <agent-id> <policy-id> <url> [--method GET|HEAD] [--timeout N] [--max-size N]",
        terminal: {
          lines: [
            { content: "aegis net request agt_def456 pol_ghi789 https://api.example.com/v2/status --method HEAD", prompt: true },
            { output: "  Action ID:      act_jkl012" },
            { output: "  Result:         ALLOW" },
            { output: "  Status Code:    200" },
            { output: "  Elapsed Ms:     145" },
          ],
        },
      },
    ],
  },
  {
    id: "ai-copilot",
    title: "AI Copilot",
    desc: "The AI Copilot provides natural-language explanations, summaries, and policy drafting. It is advisory only and cannot override policy decisions.",
    commands: [
      {
        title: "Explain a decision",
        usage: "aegis ai explain <decision-id>",
        terminal: {
          lines: [
            { content: "aegis ai explain act_jkl012", prompt: true },
            { output: "  [AI-generated explanation of the decision]" },
          ],
        },
      },
      {
        title: "Get an audit summary",
        usage: "aegis ai audit-summary",
        terminal: {
          lines: [
            { content: "aegis ai audit-summary", prompt: true },
            { output: "  [AI-generated summary of recent audit events]" },
          ],
        },
      },
      {
        title: "Review a policy",
        usage: "aegis ai policy-review <policy-id>",
        terminal: {
          lines: [
            { content: "aegis ai policy-review pol_ghi789", prompt: true },
            { output: "  [AI-generated risk analysis of the policy]" },
          ],
        },
      },
      {
        title: "Draft a policy",
        usage: "aegis ai policy-draft <description>",
        note: "Generates a YAML policy from a natural-language description.",
        terminal: {
          lines: [
            { content: "aegis ai policy-draft \"Allow read access to /var/log/app.log between 9am and 5pm\"", prompt: true },
            { output: "  [AI-generated YAML policy]" },
          ],
        },
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Subscriptions",
    desc: "Aegis supports UPI-based payment submission with manual UTR verification by authorized verifiers. Payments move through PENDING to VERIFIED or REJECTED. No third-party payment gateway is used. Subscriptions control feature entitlements.",
    commands: [
      {
        title: "Submit a payment",
        usage: "aegis payment submit --plan <plan-id> --utr <utr>",
        args: "plan-id — pro or enterprise",
        terminal: {
          lines: [
            { content: "aegis payment submit --plan pro --utr UTR123456789", prompt: true },
            { output: "  Payment submitted: pay_mno345" },
            { output: "  Plan:             pro" },
            { output: "  Status:           PENDING" },
            { output: "  UTR:              UTR****6789" },
            { output: "  Your payment is PENDING verification." },
          ],
        },
      },
      {
        title: "Check payment status",
        usage: "aegis payment status <payment-id>",
        terminal: {
          lines: [
            { content: "aegis payment status pay_mno345", prompt: true },
            { output: "  Payment ID:       pay_mno345" },
            { output: "  Plan:             pro" },
            { output: "  Amount:           INR 499.00" },
            { output: "  UTR:              UTR****6789" },
            { output: "  Status:           VERIFIED" },
            { output: "  Verified at:      2026-07-20T11:00:00+00:00" },
          ],
        },
      },
      {
        title: "Verify a payment (admin)",
        usage: "aegis admin payment verify <payment-id>",
        note: "Requires the PAYMENT_VERIFIER or ADMIN role.",
        terminal: {
          lines: [
            { content: "aegis admin payment verify pay_mno345", prompt: true },
            { output: "  Payment VERIFIED: pay_mno345" },
            { output: "  Plan:             pro" },
            { output: "  Status:           VERIFIED" },
            { output: "  Subscription activated." },
          ],
        },
      },
      {
        title: "List available plans",
        usage: "aegis plan list",
        terminal: {
          lines: [
            { content: "aegis plan list", prompt: true },
            { output: "  free             Free Plan            Free" },
            { output: "  pro             Pro Plan             INR 499.00" },
            { output: "  enterprise      Enterprise Plan      INR 2499.00" },
          ],
        },
      },
      {
        title: "List your payments",
        usage: "aegis payment list",
        terminal: {
          lines: [
            { content: "aegis payment list", prompt: true },
            { output: "  pay_mno345                        pro          VERIFIED   2026-07-20T10:30:00" },
          ],
        },
      },
      {
        title: "Reject a payment (admin)",
        usage: "aegis admin payment reject <payment-id> --reason <reason>",
        note: "Requires the PAYMENT_VERIFIER or ADMIN role.",
        terminal: {
          lines: [
            { content: "aegis admin payment reject pay_mno345 --reason \"UTR does not match\"", prompt: true },
            { output: "  Payment REJECTED: pay_mno345" },
            { output: "  Reason:           UTR does not match" },
          ],
        },
      },
      {
        title: "List your entitlements",
        usage: "aegis entitlement list",
        terminal: {
          lines: [
            { content: "aegis entitlement list", prompt: true },
            { output: "  Subscription:  pro (Pro Plan)" },
            { output: "  Status:        ACTIVE" },
          ],
        },
      },
      {
        title: "Check subscription status",
        usage: "aegis subscription status",
        terminal: {
          lines: [
            { content: "aegis subscription status", prompt: true },
            { output: "  Plan:          Pro (pro)" },
            { output: "  Status:        ACTIVE" },
          ],
        },
      },
      {
        title: "Activate subscription (dev only)",
        usage: "aegis subscription activate <plan-id>",
        note: "Development-only command. In production, submit a payment for verification.",
        terminal: {
          lines: [
            { content: "aegis subscription activate pro", prompt: true },
            { output: "  Subscribed to Pro Plan (pro)" },
          ],
        },
      },
    ],
  },
  {
    id: "server",
    title: "API Server",
    desc: "Aegis includes a FastAPI-based REST API server for integration with external tools and dashboards.",
    commands: [
      {
        title: "Start the API server",
        usage: "aegis serve [--host HOST] [--port PORT] [--cors-origins ORIGINS] [--reload]",
        terminal: {
          lines: [
            { content: "aegis serve --host 0.0.0.0 --port 8080", prompt: true },
            { output: "  INFO:     Uvicorn running on http://0.0.0.0:8080" },
          ],
        },
      },
    ],
  },
  {
    id: "database",
    title: "Database & Backup",
    desc: "Aegis supports migrating from NDJSON storage to SQLite/PostgreSQL and creating data backups.",
    commands: [
      {
        title: "Migrate to database",
        usage: "aegis db migrate [--rebuild]",
        terminal: {
          lines: [
            { content: "aegis db migrate", prompt: true },
            { output: "  Migration complete. All records verified." },
          ],
        },
      },
      {
        title: "Create a backup",
        usage: "aegis backup create",
        terminal: {
          lines: [
            { content: "aegis backup create", prompt: true },
            { output: "  Backup created: /home/user/.aegis/backups/aegis_backup_20260720_120000.zip" },
          ],
        },
      },
      {
        title: "List available backups",
        usage: "aegis backup list",
        terminal: {
          lines: [
            { content: "aegis backup list", prompt: true },
            { output: "  aegis_backup_20260720_120000.zip                   12.5 KB  2026-07-20T12:00:00" },
          ],
        },
      },
      {
        title: "Restore from backup",
        usage: "aegis backup restore <backup-path>",
        terminal: {
          lines: [
            { content: "aegis backup restore /home/user/.aegis/backups/aegis_backup_20260720_120000.zip", prompt: true },
            { output: "  Restore complete." },
          ],
        },
      },
    ],
  },
];

// Keyword synonyms for better search matching
const keywords: Record<string, string[]> = {
  auth: ["authentication", "login", "logout", "whoami", "permissions", "session"],
  user: ["users", "account", "role", "admin", "payment_verifier"],
  agent: ["agents", "bot", "service", "identity"],
  policy: ["policies", "rule", "rules", "yaml", "allow", "deny", "permit", "block"],
  action: ["evaluate", "decision", "request"],
  audit: ["log", "logs", "events", "chain", "verify", "integrity", "tamper"],
  fs: ["filesystem", "file", "read", "path"],
  process: ["execution", "execute", "run", "allowlist", "binary", "subprocess"],
  net: ["network", "http", "https", "request", "destination", "ssrf", "url"],
  ai: ["copilot", "explain", "summarize", "draft", "review"],
  payment: ["pay", "upi", "utr", "subscription", "plan", "entitlement", "verify", "reject"],
  backup: ["backup", "restore", "zip", "snapshot"],
  db: ["database", "migrate", "migration", "sql", "sqlite", "postgresql"],
  server: ["serve", "api", "rest", "uvicorn", "fastapi"],
};

export default function UsagePage() {
  const { prev, next } = getPrevNext("/usage");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;

    // Expand query with keyword synonyms
    const terms = [q];
    for (const [key, syns] of Object.entries(keywords)) {
      if (key.includes(q) || q.includes(key)) {
        terms.push(...syns);
      }
      for (const syn of syns) {
        if (syn.includes(q)) {
          terms.push(key);
          break;
        }
      }
    }
    const uniqueTerms = [...new Set(terms)];

    const scored = sections
      .map((sec) => {
        const matched = sec.commands
          .map((cmd) => {
            const searchText = [
              cmd.title,
              cmd.usage,
              sec.title,
              cmd.note || "",
              cmd.args || "",
            ].join(" ").toLowerCase();
            let score = 0;
            // Direct match on title or usage gets highest score
            for (const t of uniqueTerms) {
              if (t.length < 2) continue;
              if (cmd.title.toLowerCase().includes(t)) score += 15;
              else if (cmd.usage.toLowerCase().includes(t)) score += 10;
              else if (sec.title.toLowerCase().includes(t)) score += 5;
              else if ((cmd.note || "").toLowerCase().includes(t)) score += 3;
              else if ((cmd.args || "").toLowerCase().includes(t)) score += 2;
              // Bonus for exact match
              if (cmd.usage.toLowerCase() === t) score += 20;
              if (cmd.title.toLowerCase() === t) score += 20;
            }
            // Partial word match fallback
            if (score === 0) {
              for (const t of uniqueTerms) {
                if (t.length < 2) continue;
                const words = searchText.split(/[\s_/-]+/);
                for (const w of words) {
                  if (w.startsWith(t) || t.startsWith(w)) {
                    score += 1;
                    break;
                  }
                }
              }
            }
            return { cmd, score };
          })
          .filter((m) => m.score > 0);
        matched.sort((a, b) => b.score - a.score);
        return { ...sec, commands: matched.map((m) => m.cmd) };
      })
      .filter((sec) => sec.commands.length > 0);
    return scored;
  }, [query]);

  const hasResults = filtered.length > 0 && filtered.some((s) => s.commands.length > 0);
  const showEmpty = query.trim().length > 0 && !hasResults;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <DocSidebar current="/usage" />
      <div className="min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-white">CLI Usage</h1>
        <p className="mt-4 text-lg text-surface-400 leading-relaxed">
          Complete command reference for the <code className="rounded bg-surface-800 px-1.5 py-0.5 text-sm text-aegis-300">aegis</code> CLI.
        </p>

        <div className="mt-6">
          <div className="relative">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands... (Ctrl+K)"
              className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 transition-colors focus:border-aegis-500 focus:outline-none focus:ring-1 focus:ring-aegis-500"
              aria-label="Search CLI commands"
            />
          </div>
        </div>

        {showEmpty && (
          <div className="mt-12 rounded-lg border border-surface-800 p-8 text-center">
            <p className="text-surface-400">No commands match &ldquo;{query}&rdquo;.</p>
            <p className="mt-1 text-sm text-surface-500">
              Try searching for &ldquo;agent&rdquo;, &ldquo;policy&rdquo;, &ldquo;audit&rdquo;, &ldquo;payment&rdquo;, &ldquo;network&rdquo;, or &ldquo;backup&rdquo;.
            </p>
          </div>
        )}

        <div ref={resultsRef}>
          {filtered.map((section) => (
            <section key={section.id} id={section.id} className="mt-16">
              <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              <p className="mt-2 text-surface-400 leading-relaxed">{section.desc}</p>

              <div className="mt-6 space-y-8">
                {section.commands.map((cmd) => (
                  <article key={cmd.title} className="rounded-lg border border-surface-800 p-5">
                    <h3 className="text-lg font-medium text-white">{cmd.title}</h3>
                    <div className="mt-2">
                      <code className="rounded bg-surface-800 px-2 py-0.5 text-sm text-aegis-300">
                        {cmd.usage}
                      </code>
                    </div>
                    {cmd.args && (
                      <p className="mt-2 text-sm text-surface-500">
                        Arguments: {cmd.args}
                      </p>
                    )}
                    {cmd.note && (
                      <p className="mt-2 text-sm text-surface-500 italic">
                        {cmd.note}
                      </p>
                    )}
                    <div className="mt-3">
                      <Terminal
                        title={`${cmd.title.toLowerCase().replace(/\s+/g, "-")}.sh`}
                        lines={cmd.terminal.lines}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <DocNav prev={prev} next={next} />
      </div>
    </div>
  );
}
