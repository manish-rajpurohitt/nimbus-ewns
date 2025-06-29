/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: [
      "livewebsitesjson.s3.ap-south-1.amazonaws.com",
      "localhost:3001",
      "ewns-albums.s3.ap-south-1.amazonaws.com",
      "placehold.co",
      "cdn-icons-png.flaticon.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true
      }
    ];
  }
});