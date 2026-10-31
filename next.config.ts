import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "firebase-admin",
    "google-auth-library",
    "gtoken",
    "teeny-request",
    "google-gax",
    "node-fetch",
    "fetch-blob",
    "@grpc/grpc-js",
    "@google-cloud/firestore-api",
    "agent-base",
    "google-cloud-core",
    "google-auto-auth",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent firebase-admin and its deps from entering the client bundle
      const nodeExternals = config.externals || [];
      config.externals = [
        ...nodeExternals,
        "firebase-admin",
        "google-auth-library",
        "google-gax",
        "gtoken",
        "teeny-request",
        "@grpc/grpc-js",
        "@google-cloud/firestore-api",
        "google-cloud-core",
        "google-auto-auth",
        "agent-base",
        /^node:/,
      ];
      // Block Node.js built-ins from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        url: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  turbopack: {
    root: rootDir,
  },
};

export default nextConfig;
