import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://54.254.156.167:8080/:path*", 
      },
    ];
  },
};

export default nextConfig;