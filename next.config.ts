import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise l'accès depuis le réseau local (iPhone via IP) en dev.
  // Sans ça, Next.js 16 bloque les bundles JS React → page non hydratée
  // (textes opacity:0, boutons sans handlers).
  allowedDevOrigins: ['192.168.1.69'],
};

export default nextConfig;
