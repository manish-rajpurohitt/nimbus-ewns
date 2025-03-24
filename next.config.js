/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "livewebsitesjson.s3.ap-south-1.amazonaws.com",
      "localhost",
      "ewns-albums.s3.ap-south-1.amazonaws.com",
      "placehold.co",
      "cdn-icons-png.flaticon.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
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
};

module.exports = nextConfig;
