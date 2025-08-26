// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Don't fail the production build because of ESLint errors
    ignoreDuringBuilds: true,
  },
  // NOTE: If you ever get stuck on *TypeScript* build errors (not recommended),
  // you can temporarily uncomment this:
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
