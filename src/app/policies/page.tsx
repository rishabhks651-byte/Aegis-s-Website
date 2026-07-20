import type { Metadata } from "next";
import { getPrevNext } from "@/lib/site";
import { Terminal } from "@/components/terminal";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocNav } from "@/components/doc-nav";

export const metadata: Metadata = {
  title: "Policies",
  description: "Aegis YAML policy engine — version, name, priority, rules with ALLOW/DENY effects, match conditions with dot-notation and pattern matching, first-match evaluation semantics, and default-deny",
};

const policyYaml = `version: "1.0"
name: filesystem-access
description: Control read access to application files
priority: 100
rules:
  - id: allow-read-logs
    effect: ALLOW
    match:
      action_type: fs_read
      params.path: /var/log/app.log
    comment: Allow agents to read the application log file

  - id: deny-sensitive
    effect: DENY
    match:
      action_type: fs_read
      params.path: /etc/passwd
    comment: Explicitly block access to password file`;

export default function PoliciesPage() {
  const { prev, next } = getPrevNext("/policies");
  return (
    <div className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <DocSidebar current="/policies" />
      <div className="min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-white">Policies</h1>
        <p className="mt-4 text-lg text-surface-400 leading-relaxed">
          Policies are the core of Aegis — they define what actions agents are allowed to perform.
          A policy is a YAML file containing a version, name, priority, and a list of rules.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-white">Policy Structure</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-surface-700 bg-surface-950">
          <div className="border-b border-surface-700 px-4 py-2">
            <span className="text-xs text-surface-500">policy.yaml</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed"><code>{policyYaml}</code></pre>
        </div>

        <h3 className="mt-8 text-lg font-semibold text-white">Top-Level Fields</h3>
        <div className="mt-4 space-y-4 text-sm text-surface-400">
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">version</code>
            <span className="ml-2">Required. Must be <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">&ldquo;1.0&rdquo;</code>.</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">name</code>
            <span className="ml-2">Required. A human-readable name (1-128 characters).</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">description</code>
            <span className="ml-2">Optional. Free-text description of the policy.</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">priority</code>
            <span className="ml-2">Required. An integer. Higher-priority policies are evaluated first.</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">enabled</code>
            <span className="ml-2">Optional. Boolean (default <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">true</code>). Disabled policies are skipped during evaluation.</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">id</code>
            <span className="ml-2">Optional. A UUID. If omitted, a deterministic content-based ID is generated.</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">rules</code>
            <span className="ml-2">Required. A non-empty list of rule objects (see below).</span>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-white">Rules</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Each rule has an effect (ALLOW or DENY), a match condition, and an optional comment.
          Rules within a policy are evaluated in list order. The first matching rule wins.
        </p>

        <h3 className="mt-8 text-lg font-semibold text-white">Rule Fields</h3>
        <div className="mt-4 space-y-4 text-sm text-surface-400">
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">id</code>
            <span className="ml-2">Optional. A unique identifier for the rule. Auto-generated if omitted.</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">effect</code>
            <span className="ml-2">Required. Either <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">ALLOW</code> or <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">DENY</code>.</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">match</code>
            <span className="ml-2">Required. A non-empty object of conditions (see Match Conditions below).</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">comment</code>
            <span className="ml-2">Optional. Free-text comment explaining the rule.</span>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-white">Match Conditions</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          The match object specifies conditions that must all be satisfied for a rule to apply.
          Conditions use dot-notation keys to reference fields of the action:
        </p>

        <div className="mt-4 space-y-4 text-sm text-surface-400">
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">action_type</code>
            <span className="ml-2">Matches the action type (e.g. <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">fs_read</code>, <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">execute_process</code>, <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">network_request</code>).</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">params.{'{'}field{'}'}</code>
            <span className="ml-2">Matches a field in the action&rsquo;s params object (e.g. <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">params.path</code>, <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">params.executable</code>).</span>
          </div>
          <div>
            <code className="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-aegis-300 font-mono">context.{'{'}field{'}'}</code>
            <span className="ml-2">Matches a field in the action&rsquo;s context object, if present.</span>
          </div>
        </div>

        <h3 className="mt-8 text-lg font-semibold text-white">Pattern Matching</h3>
        <p className="mt-2 text-sm text-surface-400 leading-relaxed">
          Match values support the following patterns:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-surface-400">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">*</code> — Matches any non-null value (wildcard).
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">/var/log/*</code> — Prefix matching. Matches any value starting with the given prefix (e.g. <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">/var/log/app.log</code>).
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">exact-value</code> — Exact string matching.
          </li>
        </ul>

        <h2 className="mt-12 text-2xl font-semibold text-white">Evaluation Flow</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          When an action is evaluated, the policy engine follows this deterministic process:
        </p>
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-center gap-1" role="img" aria-label="Policy evaluation flow: Action enters engine, policies sorted by priority descending, rules evaluated in order, first matching rule determines ALLOW or DENY, result recorded in audit trail">
            {["Action Request", "Sort Policies by Priority", "Evaluate Rules in Order", "First Match?", "ALLOW / DENY Decision", "Audit Event"].map((label, i, arr) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`rounded-lg border border-surface-700 bg-surface-900 px-5 py-2.5 text-sm ${i === 3 ? "text-white font-semibold" : i === 4 ? "text-aegis-400" : "text-surface-300"}`}>
                  {label}
                </div>
                {i < arr.length - 1 && (
                  <svg className="h-4 w-4 text-surface-600 py-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <h3 className="mt-8 text-lg font-semibold text-white">Evaluation Semantics</h3>
        <ul className="mt-4 space-y-2 text-sm text-surface-400">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            Policies are sorted by <strong>priority descending</strong> (highest number first).
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            Within each policy, rules are evaluated in <strong>list order</strong>.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            The <strong>first matching rule wins</strong> — its effect (ALLOW or DENY) becomes the result.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            If <strong>no rule matches</strong> across all enabled policies, the result is <strong>DENY</strong> (default-deny).
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            All <strong>errors</strong> are caught and result in <strong>DENY</strong> (fail-closed).
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            Disabled policies (<code className="rounded bg-surface-800 px-1 py-0.5 text-xs">enabled: false</code>) are skipped entirely.
          </li>
        </ul>

        <h2 className="mt-12 text-2xl font-semibold text-white">Applying a Policy</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Save your policy as a YAML file and apply it with:
        </p>
        <div className="mt-4">
          <Terminal
            title="apply.sh"
            lines={[
              { content: "aegis policy apply policy.yaml", prompt: true },
              { output: "  Policy 'filesystem-access' applied (id=pol_ghi789, 2 rule(s))" },
            ]}
          />
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-white">Listing &amp; Inspecting Policies</h2>
        <div className="mt-4 space-y-4">
          <Terminal
            title="list.sh"
            lines={[
              { content: "aegis policy list", prompt: true },
              { output: "  pol_ghi789  filesystem-access                  pri=100  enabled" },
            ]}
          />
          <Terminal
            title="show.sh"
            lines={[
              { content: "aegis policy show pol_ghi789", prompt: true },
              { output: "  ID:         pol_ghi789" },
              { output: "  Name:       filesystem-access" },
              { output: "  Priority:   100" },
              { output: "  Enabled:    True" },
              { output: "  Rules:      2" },
            ]}
          />
        </div>

        <div className="mt-12 text-sm text-surface-500 leading-relaxed border-t border-surface-800 pt-8">
          <p>
            See <a href="/usage#policies" className="text-aegis-400 hover:text-aegis-300">CLI Usage &rarr; Policies</a> for more policy management commands,
            or the <a href="/security" className="text-aegis-400 hover:text-aegis-300">Security Model</a> for how policies integrate with the authorization pipeline.
          </p>
        </div>

        <DocNav prev={prev} next={next} />
      </div>
    </div>
  );
}
