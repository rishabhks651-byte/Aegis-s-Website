export const siteConfig = {
  name: "Aegis",
  description: "Policy enforcement for AI agents and automated systems",
  tagline: "The policy enforcement layer for AI agents and automated software",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/rishabhks651-byte/Aegis",
  version: "0.1.0",
  status: "Alpha — under active development",
  license: "MIT",
  docs: {
    gettingStarted: "/getting-started",
    installation: "/installation",
    usage: "/usage",
    policies: "/policies",
    security: "/security",
    about: "/about",
  },
};

export const docNav = [
  { title: "Getting Started", href: "/getting-started" },
  { title: "Installation", href: "/installation" },
  { title: "CLI Usage", href: "/usage" },
  { title: "Policies", href: "/policies" },
  { title: "Security Model", href: "/security" },
  { title: "About", href: "/about" },
];

export interface DocNavItem {
  title: string;
  href: string;
}

export function getPrevNext(currentHref: string): { prev: DocNavItem | null; next: DocNavItem | null } {
  const idx = docNav.findIndex((n) => n.href === currentHref);
  return {
    prev: idx > 0 ? docNav[idx - 1] : null,
    next: idx < docNav.length - 1 ? docNav[idx + 1] : null,
  };
}
