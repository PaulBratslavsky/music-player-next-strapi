import type { NextConfig } from "next";

const strapiUrl = new URL(process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
