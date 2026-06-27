import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@leadflow/ui", "@leadflow/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.leadflow.ai" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
