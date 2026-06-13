import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "export",
  // Override the default webpack configuration
  webpack: (config) => {
    // Handle Node.js protocol imports for browser compatibility
    // Convert node:fs to fs, node:path to path, etc.
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ignore node-specific modules when bundling for the browser
      sharp$: false,
      "onnxruntime-node$": false,
      // Handle Node.js protocol imports
      "node:fs": "fs",
      "node:path": "path", 
      "node:util": "util",
      "node:stream": "stream",
      "node:http": "http",
      "node:https": "https",
      "node:child_process": "child_process",
      "node:diagnostics_channel": "diagnostics_channel",
      "node:worker_threads": "worker_threads",
      "node:inspector": "inspector",
      "node:net": "net",
      "node:tls": "tls",
      "node:os": "os",
      "node:readline": "readline",
      "node:zlib": "zlib",
    };
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "agilworld",
  project: "we-love-photos-v2",

  // An auth token is required for uploading source maps.
  authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
  telemetry: false,
  silent: false, // Can be used to suppress logs
});
