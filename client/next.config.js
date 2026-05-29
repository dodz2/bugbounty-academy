/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/bugbounty-academy',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
