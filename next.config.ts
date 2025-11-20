import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['upload.wikimedia.org'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src/app', 'src/components', 'src/context', 'src/core/auth', 'src/lib', 'src/utils'],
  },
};

export default nextConfig;
