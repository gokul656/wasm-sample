import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'javascript/auto',
      use: 'file-loader',
    });
    return config;
  },
};

export default nextConfig;
