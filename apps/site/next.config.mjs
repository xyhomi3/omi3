import withNextIntl from 'next-intl/plugin';
/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl()({
  output: process.env.VERCEL ? undefined : 'standalone',

  transpilePackages: ['@omi3/ui', '@omi3/audio', '@omi3/utils'],
});

export default nextConfig;
