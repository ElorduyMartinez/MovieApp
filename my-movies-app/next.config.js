const nextConfig = {
  eslint: {
    // Ignora todos los errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora todos los errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;