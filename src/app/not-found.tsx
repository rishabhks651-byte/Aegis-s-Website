import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-32 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-800">
        <span className="text-2xl font-bold text-surface-500">404</span>
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">Page not found</h1>
      <p className="mt-2 text-surface-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/docs" className="btn-secondary">
          Documentation
        </Link>
        <Link href="/getting-started" className="btn-secondary">
          Getting Started
        </Link>
        <Link href="/usage" className="btn-secondary">
          CLI Usage
        </Link>
      </div>
      <p className="mt-12 text-xs text-surface-600">
        {siteConfig.name} v{siteConfig.version}
      </p>
    </div>
  );
}
