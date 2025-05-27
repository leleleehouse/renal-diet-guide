import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: false, // lightningcss 비활성화 (중요)
  },
};

export default nextConfig;
