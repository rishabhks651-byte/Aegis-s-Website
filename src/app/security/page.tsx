import type { Metadata } from "next";
import { getPrevNext } from "@/lib/site";
import { FeatureCard } from "@/components/feature-card";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocNav } from "@/components/doc-nav";

export const metadata: Metadata = {
  title: "Security Model",
  description: "Aegis security architecture — 14 code-enforced safeguards including default-deny, fail-closed, tamper-evident audit, RBAC, SSRF protection, allowlisting, and known limitations",
};

const safeguards = [
  {
    title: "Default-Deny Policy Evaluation",
    desc: "Every action is denied by default. A policy must explicitly match and allow the action. If no policy matches, the action is denied. If the engine encounters an error, the action is denied. There is no fallback-to-allow path.",
  },
  {
    title: "Ownership Isolation",
    desc: "Every resource (agent, policy, payment) belongs to a single user. Users cannot view, modify, or act on resources that belong to other users. The gateway enforces this at every access point.",
  },
  {
    title: "Role-Based Access Control",
    desc: "Three roles — USER, PAYMENT_VERIFIER, ADMIN — with strictly defined permission sets. Roles cannot escalate privileges. The permission matrix is defined in code and enforced at every privileged operation.",
  },
  {
    title: "Session Security",
    desc: "Sessions use 32-byte cryptographically random tokens. Tokens are hashed with SHA-256 before storage — the raw token is never persisted. Sessions expire after 24 hours by default. Session files use restricted file permissions (0o600) where supported.",
  },
  {
    title: "Password Storage",
    desc: "Passwords are hashed with bcrypt (12 rounds) before storage. Plaintext passwords are never written to disk, logged, or included in error messages. Password comparison uses a constant-time bcrypt verify.",
  },
  {
    title: "SSRF Protection",
    desc: "Network requests are validated against a blocklist of loopback, private (RFC 1918), link-local, multicast, and reserved IP ranges. IPv4 and IPv6 are both covered. Hostnames are resolved before the request and checked against the blocklist. DNS failures default to restricted.",
  },
  {
    title: "Network Allowlisting",
    desc: "Only explicitly allowlisted destinations can receive HTTP requests. Allowlist entries specify scheme, hostname, port, and path prefix. No destination is reachable without an explicit allowlist entry.",
  },
  {
    title: "Process Allowlisting",
    desc: "Only explicitly allowlisted executables can be launched. The allowlist stores absolute paths. No shell is used for execution — arguments are passed directly via subprocess without shell interpretation.",
  },
  {
    title: "Filesystem Path Containment",
    desc: "Path traversal attacks are blocked by canonicalizing the requested path and verifying it is within the allowed scope. Directories are rejected. Symlink escape is prevented where the OS supports it.",
  },
  {
    title: "Tamper-Evident Audit Trail",
    desc: "Every audit event includes the SHA-256 hash of the previous event, forming a hash chain. Any modification, deletion, reordering, or insertion of events breaks the chain. The verify command detects all four tampering scenarios independently.",
  },
  {
    title: "Fail-Closed Error Handling",
    desc: "The gateway wraps all operations. If the policy engine throws an exception, the result is DENY. If the audit store fails to persist, the result is DENY. If storage is corrupted, operations fail closed with an error.",
  },
  {
    title: "Rate Limiting",
    desc: "The API server includes file-backed rate limiting that is thread-safe and cross-worker safe using atomic file replacement. Rate limit violations receive a 429 response without revealing the limit window.",
  },
  {
    title: "Secret Redaction",
    desc: "Sensitive values (UPI transaction references, tokens) are redacted in CLI output, API responses, and log messages. Only the last few characters are shown for verification purposes.",
  },
  {
    title: "CORS & Security Headers",
    desc: "The API server enforces explicit CORS origin allowlists (no wildcard in production). All responses include security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Cache-Control, and Strict-Transport-Security.",
  },
];

const flowSteps = [
  { label: "User / Agent", color: "text-aegis-300" },
  { label: "Authentication", color: "text-surface-300" },
  { label: "Agent Identity", color: "text-surface-300" },
  { label: "Policy Engine", color: "text-aegis-400" },
  { label: "Authorization Decision", color: "text-white font-semibold" },
  { label: "Capability Execution", color: "text-surface-300" },
  { label: "Audit Trail", color: "text-surface-400" },
];

function FlowDiagram({ steps, label }: { steps: { label: string; color: string }[]; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1" role="img" aria-label={label}>
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-col items-center">
          <div className={`rounded-lg border border-surface-700 bg-surface-900 px-5 py-2.5 text-sm ${s.color}`}>
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <svg className="h-4 w-4 text-surface-600 py-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

const paymentFlow = [
  { label: "User", color: "text-aegis-300" },
  { label: "Direct UPI Payment", color: "text-surface-300" },
  { label: "UTR Submission", color: "text-surface-300" },
  { label: "Pending Verification", color: "text-amber-300" },
  { label: "Authorized Verifier", color: "text-aegis-400" },
  { label: "Verified / Rejected", color: "text-white font-semibold" },
  { label: "Subscription Activated", color: "text-surface-300" },
];

export default function SecurityPage() {
  const { prev, next } = getPrevNext("/security");
  return (
    <div className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <DocSidebar current="/security" />
      <div className="min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-white">Security Model</h1>
        <p className="mt-4 text-lg text-surface-400 leading-relaxed">
          Aegis is designed with a defense-in-depth security model. The following safeguards
          are enforced at the code level, not just documented as best practices.
        </p>

        <h2 className="mt-16 text-2xl font-semibold text-white">Architecture</h2>
        <p className="mt-2 text-surface-400 leading-relaxed">
          Every action flows through the same authorization pipeline:
        </p>
        <div className="mt-6 flex justify-center">
          <FlowDiagram steps={flowSteps} label="Aegis authorization flow" />
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-white">Payment Flow</h2>
        <p className="mt-2 text-surface-400 leading-relaxed">
          Payment verification follows a manual UTR verification workflow with RBAC protection:
        </p>
        <div className="mt-6 flex justify-center">
          <FlowDiagram steps={paymentFlow} label="Aegis payment verification flow" />
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-white">Safeguards</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {safeguards.map((s) => (
            <FeatureCard key={s.title} title={s.title} description={s.desc} />
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-amber-900/50 bg-amber-950/20 p-6">
          <h2 className="text-lg font-semibold text-amber-300">Limitations</h2>
          <ul className="mt-3 space-y-2 text-sm text-amber-200/80">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
              The audit log is <strong>tamper-evident</strong>, not tamper-proof. A determined attacker with filesystem access could modify all records and recompute the hash chain.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
              Session tokens are stored in a plaintext file with restricted permissions. Full disk encryption is recommended for production deployments.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
              The default NDJSON storage has no concurrent-write protection. For multi-process deployments, use the SQLite or PostgreSQL backend.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
              SSRF protection relies on DNS resolution at enforcement time. DNS rebinding attacks are a known limitation in DNS-based SSRF controls.
            </li>
          </ul>
        </div>

        <DocNav prev={prev} next={next} />
      </div>
    </div>
  );
}
