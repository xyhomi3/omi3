/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
};

export default nextConfig;
