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
      "placehold.co",
      "ewns_albums.s3.ap-south-1.amazonaws.com",
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
