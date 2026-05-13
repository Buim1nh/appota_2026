import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // Parent dirs may contain another package-lock.json; pin Turbopack root to this app.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
