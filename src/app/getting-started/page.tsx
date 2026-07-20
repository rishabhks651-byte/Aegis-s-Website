import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, getPrevNext } from "@/lib/site";
import { Terminal } from "@/components/terminal";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocNav } from "@/components/doc-nav";

export const metadata: Metadata = {
  title: "Getting Started",
  description: "Install Aegis from source, create a user, register an agent, define a YAML policy, evaluate an action, and inspect the audit log — a complete 11-step walkthrough",
};

const steps = [
  {
    title: "Clone the repository",
    terminal: {
      title: "step-1.sh",
      lines: [
        { content: `git clone ${siteConfig.githubUrl}.git`, prompt: true },
        { content: "cd Aegis", prompt: true },
      ],
    },
  },
  {
    title: "Install Aegis",
    terminal: {
      title: "step-2.sh",
      lines: [
        { content: "pip install -e .", prompt: true },
        { output: "  Successfully installed aegis" },
      ],
    },
  },
  {
    title: "Verify installation",
    terminal: {
      title: "step-3.sh",
      lines: [
        { content: "aegis --version", prompt: true },
        { output: `  aegis ${siteConfig.version}` },
      ],
    },
  },
  {
    title: "Create a user",
    note: "You will be prompted to enter and confirm a password (minimum 8 characters).",
    terminal: {
      title: "step-4.sh",
      lines: [
        { content: "aegis user create admin", prompt: true },
        { output: "  Password: ********" },
        { output: "  Confirm:  ********" },
        { output: "  User 'admin' created successfully (id=usr_abc123)" },
      ],
    },
  },
  {
    title: "Log in",
    note: "Your session token is valid for 24 hours and stored locally in the data directory.",
    terminal: {
      title: "step-5.sh",
      lines: [
        { content: "aegis login admin", prompt: true },
        { output: "  Password: ********" },
        { output: "  Logged in as 'admin'" },
      ],
    },
  },
  {
    title: "Create an agent",
    note: "Agents represent AI agents or automated services. Each agent belongs to your user account.",
    terminal: {
      title: "step-6.sh",
      lines: [
        { content: "aegis agent create my-agent", prompt: true },
        { output: "  Agent 'my-agent' created (id=agt_def456)" },
      ],
    },
  },
  {
    title: "Create a policy file",
    note: "Save this YAML as allow-read.yaml in your working directory.",
    terminal: {
      title: "step-7.sh",
      lines: [
        { content: "cat > allow-read.yaml << 'EOF'", prompt: false },
        { output: "version: \"1.0\"" },
        { output: "name: allow-read" },
        { output: "description: Allow read access to logs" },
        { output: "priority: 100" },
        { output: "rules:" },
        { output: "  - id: allow-read-log" },
        { output: "    effect: ALLOW" },
        { output: "    match:" },
        { output: "      action_type: fs_read" },
        { output: "      params.path: /var/log/app.log" },
        { output: "    comment: Allow reading the application log" },
        { content: "EOF", prompt: false },
      ],
    },
  },
  {
    title: "Apply the policy",
    terminal: {
      title: "step-8.sh",
      lines: [
        { content: "aegis policy apply allow-read.yaml", prompt: true },
        { output: "  Policy 'allow-read' applied (id=pol_ghi789, 1 rule(s))" },
      ],
    },
  },
  {
    title: "Create an action file",
    note: "Save this JSON as action.json in your working directory.",
    terminal: {
      title: "step-9.sh",
      lines: [
        { content: "cat > action.json << 'EOF'", prompt: false },
        { output: "{" },
        { output: "  \"action_type\": \"fs_read\"," },
        { output: "  \"params\": {" },
        { output: "    \"path\": \"/var/log/app.log\"" },
        { output: "  }" },
        { output: "}" },
        { content: "EOF", prompt: false },
      ],
    },
  },
  {
    title: "Evaluate the action",
    note: "The engine evaluates the action against your policy. A matching ALLOW rule grants access.",
    terminal: {
      title: "step-10.sh",
      lines: [
        { content: "aegis action evaluate agt_def456 pol_ghi789 action.json", prompt: true },
        { output: "  Action ID:      act_jkl012" },
        { output: "  Agent ID:       agt_def456" },
        { output: "  Policy ID:      pol_ghi789" },
        { output: "  Result:         ALLOW" },
        { output: "  Matched Rule:   allow-read-log" },
        { output: "  Reason:         Policy 'allow-read' rule 'allow-read-log': Allow reading the application log" },
      ],
    },
  },
  {
    title: "Check the audit log",
    terminal: {
      title: "step-11.sh",
      lines: [
        { content: "aegis audit list", prompt: true },
        { output: "  act_jkl012  ALLOW   fs_read              2026-07-20 10:31:00  my-agent" },
      ],
    },
  },
];

export default function GettingStartedPage() {
  const { prev, next } = getPrevNext("/getting-started");
  return (
    <div className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <DocSidebar current="/getting-started" />
      <div className="min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-white">Getting Started</h1>
        <p className="mt-4 text-lg text-surface-400 leading-relaxed">
          Follow these steps to install Aegis, create your first user, register an agent,
          define a security policy, and evaluate an action.
        </p>

        <div className="mt-12 space-y-10">
          {steps.map((step, i) => (
            <section key={i}>
              <h2 className="flex items-center gap-3 text-xl font-semibold text-white">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aegis-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                {step.title}
              </h2>
              {step.note && (
                <p className="mt-2 text-sm text-surface-500 italic">{step.note}</p>
              )}
              <div className="mt-3">
                <Terminal title={step.terminal.title} lines={step.terminal.lines} />
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 text-sm text-surface-500 leading-relaxed border-t border-surface-800 pt-8">
          <p>
            Next: learn how <Link href="/policies" className="text-aegis-400 hover:text-aegis-300">Policies</Link> work in detail,
            or browse the full <Link href="/usage" className="text-aegis-400 hover:text-aegis-300">CLI reference</Link>.
          </p>
        </div>

        <DocNav prev={prev} next={next} />
      </div>
    </div>
  );
}
