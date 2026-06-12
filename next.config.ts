import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "@remotion/cli",
  ],
  allowedDevOrigins: [
    "*.cursor.app",
    "*.cursor.com",
    "*.cursor.sh",
    "*.github.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
  ],
};

export default nextConfig;
