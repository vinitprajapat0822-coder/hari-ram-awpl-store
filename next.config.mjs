/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
