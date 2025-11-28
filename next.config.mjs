

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'www.thespruceeats.com',
      },
    ],
  },
  env: {
    API_URL: process.env.API_URL,
  },
  transpilePackages: ['recharts', 'es-toolkit'],
};

export default nextConfig;
