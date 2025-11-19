import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,      
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true,   
  },
};

export default nextConfig;
