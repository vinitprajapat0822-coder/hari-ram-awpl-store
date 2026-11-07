/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages project-site deployment (https://<owner>.github.io/<repo>/).
  // Keep dynamic product routes available to the Playwright dev server.
  // Production and GitHub Pages builds remain fully static exports.
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  trailingSlash: true,
  basePath: "/hari-ram-awpl-store",
  // basePath prefixes Next.js assets; no separate CDN prefix is required.
  assetPrefix: undefined,
  images: {
    // GitHub Pages serves static files; remote AWPL images are rendered directly.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "awpl-kycdocs.s3.ap-south-1.amazonaws.com",
        pathname: "/upload1/product/**",
      },
      {
        protocol: "https",
        hostname: "www.asclepiuswellness.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "asclepiuswellness.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
