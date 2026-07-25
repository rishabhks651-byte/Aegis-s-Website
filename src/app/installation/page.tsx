import type { Metadata } from "next";
import { siteConfig, getPrevNext } from "@/lib/site";
import { Terminal } from "@/components/terminal";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocNav } from "@/components/doc-nav";

export const metadata: Metadata = {
  title: "Installation",
  description: "Install Aegis from the GitHub repository with pip — requirements, clone, install, verify, development setup, and API server",
};

export default function InstallationPage() {
  const { prev, next } = getPrevNext("/installation");
  return (
    <div className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <DocSidebar current="/installation" />
      <div className="min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight text-white">Installation</h1>

        <h2 className="mt-12 text-2xl font-semibold text-white">Requirements</h2>
        <ul className="mt-4 space-y-2 text-surface-400">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            Python 3.10 or later
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            Git
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            Linux, macOS, or Windows
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aegis-500" />
            pip (Python package installer)
          </li>
        </ul>

        <h2 className="mt-12 text-2xl font-semibold text-white">Clone &amp; Install</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Aegis is installed from the GitHub repository. Clone the repo and install with pip:
        </p>
        <div className="mt-4">
          <Terminal
            title="install.sh"
            lines={[
              { content: `git clone https://github.com/rishabhks651-byte/Aegis.git`, prompt: true },
              { content: "cd Aegis", prompt: true },
              { content: "pip install .", prompt: true },
              { output: "  Successfully installed aegis" },
            ]}
          />
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-white">Verify Installation</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Confirm Aegis is installed correctly:
        </p>
        <div className="mt-4">
          <Terminal
            title="verify.sh"
            lines={[
              { content: "aegis --version", prompt: true },
              { output: `  aegis ${siteConfig.version}` },
            ]}
          />
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-white">Development Setup</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          For development work, install the project with optional dev dependencies in editable mode:
        </p>
        <div className="mt-4">
          <Terminal
            title="dev-install.sh"
            lines={[
              { content: `git clone https://github.com/rishabhks651-byte/Aegis.git`, prompt: true },
              { content: "cd Aegis", prompt: true },
              { content: "pip install -e \"[dev,db]\"", prompt: true },
            ]}
          />
        </div>
        <p className="mt-4 text-sm text-surface-500">
          The <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">dev</code> extra includes pytest, pytest-cov, mypy, and ruff.
          The <code className="rounded bg-surface-800 px-1 py-0.5 text-xs">db</code> extra adds SQLAlchemy for database migration support.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-white">API Server</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          Aegis includes a FastAPI-based REST API server. Once the base package is installed,
          start the server with:
        </p>
        <div className="mt-4">
          <Terminal
            title="server.sh"
            lines={[
              { content: "aegis serve --host 127.0.0.1 --port 8000", prompt: true },
              { output: "  INFO:     Uvicorn running on http://127.0.0.1:8000" },
            ]}
          />
        </div>
        <p className="mt-4 text-sm text-surface-500">
          No separate API package is needed — the server is included in the base installation.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-white">Quick Start</h2>
        <p className="mt-4 text-surface-400 leading-relaxed">
          After installation, create a user and log in:
        </p>
        <div className="mt-4">
          <Terminal
            title="quickstart.sh"
            lines={[
              { content: "aegis user create admin", prompt: true },
              { output: "  User 'admin' created successfully (id=usr_...)" },
              { content: "aegis login admin", prompt: true },
              { output: "  Logged in as 'admin'" },
              { content: "aegis whoami", prompt: true },
              { output: "  Authenticated as 'admin' (id=usr_...)" },
            ]}
          />
        </div>

        <div className="mt-12 text-sm text-surface-500 leading-relaxed border-t border-surface-800 pt-8">
          <p>
            Follow the <a href="/getting-started" className="text-aegis-400 hover:text-aegis-300">Getting Started</a> guide for a complete walkthrough
            from installation to your first policy evaluation.
          </p>
        </div>

        <DocNav prev={prev} next={next} />
      </div>
    </div>
  );
}
