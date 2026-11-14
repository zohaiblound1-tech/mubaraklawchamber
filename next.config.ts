import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Hide the floating Next.js development badge so it never covers page content.
  devIndicators: false,
  // PGlite (local-development database fallback) ships WASM and must not be bundled.
  serverExternalPackages: ['@electric-sql/pglite'],
};

export default nextConfig;
