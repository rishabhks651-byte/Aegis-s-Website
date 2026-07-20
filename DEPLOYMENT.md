# Deployment

## Build Requirements

- **Node.js**: 18.17+ (Next.js 16.2.10 requirement)
- **npm**: 9+ (or pnpm/yarn compatible)

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GITHUB_URL` | URL to the Aegis GitHub repository (e.g. `https://github.com/rishabhks651-byte/Aegis`) |

## Optional Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL for sitemap and robots. No default. Must be set before build for correct absolute URLs in sitemap. |

## Build

```bash
npm install
npm run lint
npm run build
```

Output directory: `out/`

The build produces a fully static export — no Node.js server is required to serve the output.

## Preview the Static Export Locally

```bash
npx serve out -p 3334
```

Or use any static file server. The generated HTML pages use clean URLs (e.g. `/about` serves `about.html`), which `serve` handles automatically.

## Deploy to a Static Hosting Provider

1. Run `npm run build`
2. Upload the `out/` directory to your provider

### Supported Platforms

- **GitHub Pages**: push `out/` to the `gh-pages` branch or use GitHub Actions
- **Cloudflare Pages**: connect your repo, set build command to `npm run build`, output directory to `out`
- **Netlify**: connect your repo, set build command to `npm run build`, publish directory to `out`
- **Any static host**: upload the `out/` directory as-is

## Route Map

| Route | Description |
|---|---|
| `/` | Homepage |
| `/about` | About the project |
| `/docs` | Documentation hub |
| `/getting-started` | 11-step walkthrough |
| `/installation` | Install instructions |
| `/policies` | Policy engine docs |
| `/security` | Security model |
| `/usage` | CLI command reference |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots configuration |
| (any other) | 404 page with navigation |

## Custom Domain

If using a custom domain, set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` before building. Configure DNS (CNAME or A record) according to your hosting provider's instructions.

## HTTPS

HTTPS is provided by the hosting platform:
- **GitHub Pages**: automatic with custom domain
- **Cloudflare Pages**: automatic
- **Netlify**: automatic
- **Self-hosted**: configure a reverse proxy (e.g. Caddy, nginx, or serve with `--ssl-cert`/`--ssl-key`)

The website has not been publicly deployed. The above instructions are for future deployment.
