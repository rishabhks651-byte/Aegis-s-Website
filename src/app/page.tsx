import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Terminal } from "@/components/terminal";
import { FeatureCard } from "@/components/feature-card";
import { Architecture } from "@/components/architecture";

const principles = [
  {
    title: "Default Deny",
    desc: "Every action is denied unless a policy explicitly allows it. No action slips through without authorization.",
  },
  {
    title: "Explicit Authorization",
    desc: "Policies define precisely what is allowed. There are no implicit grants or ambient authority.",
  },
  {
    title: "Ownership Isolation",
    desc: "Every agent, policy, and resource belongs to a user. Cross-tenant access is impossible.",
  },
  {
    title: "Tamper-Evident Auditing",
    desc: "Every decision is recorded in a SHA-256 hash chain. Any tampering is immediately detectable.",
  },
  {
    title: "Allowlisted Capabilities",
    desc: "Filesystem paths, executables, and network destinations must be explicitly allowlisted before use.",
  },
  {
    title: "Fail-Closed Behavior",
    desc: "If any component fails — engine error, storage failure, audit write failure — the default response is DENY.",
  },
];

const features = [
  { title: "CLI-First Operation", desc: "All features are accessible from the command line. No GUI required." },
  { title: "Agent Registry", desc: "Register, list, and revoke AI agents with unique identities." },
  { title: "Policy Engine", desc: "YAML-based policies with wildcard matching, priority ordering, and rule effects." },
  { title: "Audit Chain", desc: "SHA-256 hash-chained audit log with integrity verification." },
  { title: "Filesystem Controls", desc: "Controlled file reads with path traversal protection." },
  { title: "Process Allowlist", desc: "Only allowlisted executables can be launched. No shell injection." },
  { title: "Network Allowlist", desc: "Allowlisted HTTP(S) destinations only. SSRF protection built in." },
  { title: "AI Copilot", desc: "Explain decisions, review policies, and draft policies using natural language." },
  { title: "RBAC", desc: "Role-based access control with USER, PAYMENT_VERIFIER, and ADMIN roles." },
  { title: "REST API", desc: "FastAPI-based HTTP API for integration with external systems." },
  { title: "Payment Verification", desc: "UPI-based payment submission with manual UTR verification workflow." },
  { title: "Entitlements", desc: "Subscription plans control feature availability across tiers." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-surface-800">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Control what your{" "}
              <span className="gradient-text">AI agents</span> are allowed to do
            </h1>
            <p className="mt-6 text-lg text-surface-400 leading-relaxed">
              Aegis is a CLI-first policy enforcement and governance layer for AI agents
              and automated software. Define what is allowed, audit what happens, and
              stay in control.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/getting-started" className="btn-primary">
                Get Started
              </Link>
              <Link href={siteConfig.githubUrl} className="btn-secondary">
                View on GitHub
              </Link>
            </div>
          </div>

          <div className="mt-16 mx-auto max-w-2xl">
            <Terminal
              title="example.sh"
              lines={[
                { content: "# Create a user, register an agent, and evaluate an action", comment: true, prompt: false },
                { content: "aegis user create alice", prompt: true },
                { output: "  User 'alice' created successfully (id=usr_abc123)" },
                { content: "aegis login alice", prompt: true },
                { output: "  Logged in as 'alice'" },
                { content: "aegis agent create research-bot", prompt: true },
                { output: "  Agent 'research-bot' created (id=agt_def456)" },
                { content: "aegis policy apply allow-read.yaml", prompt: true },
                { output: "  Policy 'allow-read' applied (id=pol_ghi789, 3 rule(s))" },
                { content: "aegis action evaluate agt_def456 pol_ghi789 action.json", prompt: true },
                { output: "  Result: ALLOW" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Why Aegis */}
      <section className="border-b border-surface-800">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="section-title">Why Aegis</h2>
            <p className="section-subtitle">
              AI agents and automation systems increasingly need access to files, processes,
              networks, APIs, and external services. The question is not only{" "}
              <em className="text-surface-300">can</em> an AI do something — the question is{" "}
              <strong className="text-white">should</strong> it be allowed to.
            </p>
            <p className="mt-4 text-surface-400 leading-relaxed">
              Aegis provides a policy-controlled enforcement layer that answers that question
              before any action reaches your systems. Every request is authenticated, authorized
              against a policy, logged to a tamper-evident audit trail, and either allowed or
              denied — with no ambiguity.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="border-b border-surface-800">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="section-title text-center">Core Principles</h2>
          <p className="section-subtitle mx-auto text-center">
            These are architectural guarantees, not marketing claims. Every principle is
            enforced in code.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <FeatureCard key={p.title} title={p.title} description={p.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-b border-surface-800">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="section-title text-center">Architecture</h2>
            <p className="section-subtitle mx-auto text-center">
              Every action flows through the same pipeline: authenticate, identify, evaluate,
              authorize, execute, and audit.
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <Architecture />
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="section-title text-center">Features</h2>
          <p className="section-subtitle mx-auto text-center">
            All capabilities listed here are implemented in the current release (
            {siteConfig.version}).
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} title={f.title} description={f.desc} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
