import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  async redirects() {
    return [
      // Old "Support" page lives on as The Armory
      { source: "/support", destination: "/armory", permanent: true },
    ];
  },
};

export default nextConfig;
