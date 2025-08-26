import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
