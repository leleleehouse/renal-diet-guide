import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // 정적 사이트로 빌드 가능하게 추가
  experimental: {
    optimizeCss: false, // LightningCSS 사용 안 하도록 설정 (권장)
  },
};

export default nextConfig;
