/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [],
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
