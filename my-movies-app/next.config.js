/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora todos los errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora todos los errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['image.tmdb.org'],
    unoptimized: true, // desactiva la optimización de imágenes de Next.js
  },
};

module.exports = nextConfig;
