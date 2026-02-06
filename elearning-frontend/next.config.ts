import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://eeumyjyjraoloqfsuywl.supabase.co/**")],
  },
};

export default nextConfig;
