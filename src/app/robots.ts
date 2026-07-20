import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  if (!siteUrl) {
    return {
      rules: { userAgent: "*", allow: "/" },
    };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl.replace(/\/+$/, "")}/sitemap.xml`,
  };
}
