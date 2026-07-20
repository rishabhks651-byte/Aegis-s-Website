import type { Metadata } from "next";
import { siteConfig, getPrevNext } from "@/lib/site";
import { FeatureCard } from "@/components/feature-card";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocNav } from "@/components/doc-nav";

export const metadata: Metadata = {
  title: "About",
  description: "Aegis is a CLI-first policy enforcement layer for AI agents — learn about its philosophy, security-first architecture, honest documentation approach, and open-source vision",
};

const philosophies = [
  {
    title: "CLI-First by Default",
    desc: "Aegis is designed for the command line first. GUIs and dashboards are secondary. Administrators, DevOps engineers, and security teams work in terminals. Aegis meets them there.",
  },
  {
    title: "Security-First Architecture",
    desc: "Default-deny, fail-closed, and defense-in-depth are not buzzwords. They are compile-time and runtime invariants. Every component is designed to be safe by construction, not by convention.",
  },
  {
    title: "Honest Documentation",
    desc: "Aegis documents what it actually does. Tamper-evident, not tamper-proof. Access-controlled, not unhackable. The security model is transparent about its guarantees and its limitations.",
  },
];

export default function AboutPage() {
  const { prev, next } = getPrevNext("/about");
  return (
    <div className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <DocSidebar current="/about" />
      <div className="min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-white">About Aegis</h1>
        <p className="mt-4 text-lg text-surface-400 leading-relaxed">
          Aegis is a CLI-first policy enforcement and governance layer for AI agents and
          automated software. It gives teams a single control plane to define what automated
          systems are allowed to do, audit what they actually do, and detect when something
          goes wrong.
        </p>

        <div className="mt-8 rounded-lg border border-surface-800 bg-surface-900 p-4 text-sm text-surface-500">
          <strong className="text-surface-300">Project status:</strong> {siteConfig.status} &mdash; version {siteConfig.version}, {siteConfig.license} license.
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-white">Why It Exists</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          As AI agents and automation become more capable, they also become more dangerous.
          An agent with filesystem access can read sensitive data. An agent with network access
          can exfiltrate it. An agent with process execution can run arbitrary commands.
        </p>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Traditional access control models assume human operators who can make context-aware
          decisions. AI agents operate at machine speed, at machine scale, and often without
          human oversight. Aegis was created to bridge this gap — providing the same rigour
          as infrastructure security policy, but designed for the unique challenges of
          autonomous and semi-autonomous software agents.
        </p>

        <h2 className="mt-16 text-2xl font-semibold text-white">The Problem It Solves</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Without a policy enforcement layer:
        </p>
        <ul className="mt-4 space-y-2 text-surface-400">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            Agents have ambient authority based on where they run, not what they should be allowed to do.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            There is no audit trail connecting agent identity to specific actions.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            Security policies are scattered across filesystems, network policies, and IAM systems.
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            There is no way to answer: &ldquo;What exactly was this agent allowed to do?&rdquo;
          </li>
        </ul>

        <h2 className="mt-16 text-2xl font-semibold text-white">Philosophy</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {philosophies.map((p) => (
            <FeatureCard key={p.title} title={p.title} description={p.desc} />
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-white">Vision</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Aegis aims to be the standard policy enforcement layer for AI agents — the same way
          that infrastructure policy tools are standard for cloud deployments. Long-term, the
          goal is to support multiple agent frameworks, multiple policy languages, and
          integration with existing identity and access management systems.
        </p>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Aegis is open-source under the {siteConfig.license} license. Contributions, issues, and discussions
          are welcome on GitHub.
        </p>

        <DocNav prev={prev} next={next} />
      </div>
    </div>
  );
}
