import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/guided-question",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
