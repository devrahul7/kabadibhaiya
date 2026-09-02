/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['localhost'] },
  // proxy API calls during dev
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' }];
  }
};
module.exports = nextConfig;
