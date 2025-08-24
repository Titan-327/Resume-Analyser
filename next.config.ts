import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // allow files up to 10 MB
    },
  },
    eslint: {
    // ✅ Ignore ESLint errors during build/deploy
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
