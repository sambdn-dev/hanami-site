import type { NextConfig } from "next";
import { SHOP_ENABLED } from './src/lib/site-features';

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  // Autorise l'accès depuis le réseau local (iPhone via IP) en dev.
  // Sans ça, Next.js 16 bloque les bundles JS React → page non hydratée
  // (textes opacity:0, boutons sans handlers).
  allowedDevOrigins: ['192.168.1.69'],
  async redirects() {
    return SHOP_ENABLED ? [] : [
      { source: '/boutique/:path*', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
