import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server be opened on a prod-like name, e.g. http://sys.emt.localhost:3000.
  // Browsers resolve *.localhost to 127.0.0.1 without any hosts-file changes.
  allowedDevOrigins: ["*.emt.localhost"],
};

export default nextConfig;
