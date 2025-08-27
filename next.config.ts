// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Don't fail the production build because of ESLint errors
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        // αν ο host είναι kzsyndicate.com (χωρίς www)
        has: [{ type: "host", value: "kzsyndicate.com" }],
        // στείλ' τον στο www με ίδιο path
        destination: "https://www.kzsyndicate.com/:path*",
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;
