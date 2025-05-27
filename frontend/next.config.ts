import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // 정적 사이트로 빌드 가능하게 추가
};

export default nextConfig;
