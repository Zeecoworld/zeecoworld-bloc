import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is reverse-proxied at https://zeecomedia.net/blog — see README.md.
  basePath: "/blog",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
