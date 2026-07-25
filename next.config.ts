import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Removed basePath and assetPrefix so the static export is served from the site root
};

export default nextConfig;
