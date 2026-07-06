import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube thumbnails for the Media Player facade
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
