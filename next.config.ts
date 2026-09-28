import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["medapp.dev", "localhost:3000"],
};

export default nextConfig;
