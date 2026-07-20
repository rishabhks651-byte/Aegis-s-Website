import Link from "next/link";
import { siteConfig } from "@/lib/site";

const sections = [
  {
    title: "Product",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/getting-started", label: "Getting Started" },
      { href: "/usage", label: "CLI Usage" },
      { href: "/policies", label: "Policies" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/installation", label: "Installation" },
      { href: "/security", label: "Security" },
      { href: "/about", label: "About" },
      { href: siteConfig.githubUrl, label: "GitHub" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-aegis-600 text-[10px] font-bold text-white">
                A
              </span>
              {siteConfig.name}
            </Link>
            <p className="mt-2 text-sm text-surface-500">
              {siteConfig.description}
            </p>
          </div>
          {sections.map((s) => (
            <div key={s.title}>
              <h3 className="text-sm font-medium text-white">{s.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-surface-500 transition-colors hover:text-surface-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-surface-800 pt-6 text-center text-xs text-surface-600">
          {siteConfig.name} v{siteConfig.version} &middot; {siteConfig.license} License &middot; {siteConfig.status}
        </div>
      </div>
    </footer>
  );
}
