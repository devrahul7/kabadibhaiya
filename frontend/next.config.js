/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  // Turbopack alias config (Next.js 16+)
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname),
    },
  },
};
module.exports = nextConfig;
