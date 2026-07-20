import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CLI Usage",
  description: "Complete Aegis CLI command reference — 36 leaf commands across authentication, agents, policies, audit, filesystem, process, network, AI copilot, payments, server, and database/backup",
};

export default function UsageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
