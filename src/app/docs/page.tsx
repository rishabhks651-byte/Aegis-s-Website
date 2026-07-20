import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, getPrevNext } from "@/lib/site";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocNav } from "@/components/doc-nav";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Aegis documentation portal — getting started guide, installation instructions, CLI reference, policy engine docs, and security model",
};

const sections = [
  {
    title: "Getting Started",
    desc: "Step-by-step walkthrough from installation to your first policy evaluation.",
    href: "/getting-started",
  },
  {
    title: "Installation",
    desc: "Requirements, clone, pip install, and verification.",
    href: "/installation",
  },
  {
    title: "CLI Usage",
    desc: "Complete command reference for the Aegis CLI.",
    href: "/usage",
  },
  {
    title: "Policies",
    desc: "YAML-based policy engine with rules, matching, priority, and evaluation semantics.",
    href: "/policies",
  },
  {
    title: "Security Model",
    desc: "Architecture, threat model, and security guarantees.",
    href: "/security",
  },
  {
    title: "About",
    desc: "Philosophy, vision, and project status.",
    href: "/about",
  },
];

export default function DocsPage() {
  const { prev, next } = getPrevNext("/docs");
  return (
    <div className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <DocSidebar current="/docs" />
      <div className="min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-white">Documentation</h1>
        <p className="mt-4 text-lg text-surface-400 leading-relaxed">
          Everything you need to install, configure, and use Aegis v{siteConfig.version}.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="card-hover group"
            >
              <h3 className="text-base font-semibold text-white group-hover:text-aegis-300 transition-colors">
                {s.title}
                <span className="ml-1 text-aegis-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  &rarr;
                </span>
              </h3>
              <p className="mt-1 text-sm text-surface-400">{s.desc}</p>
            </Link>
          ))}
        </div>

        <DocNav prev={prev} next={next} />
      </div>
    </div>
  );
}
