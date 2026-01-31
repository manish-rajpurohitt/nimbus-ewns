/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  swcMinify: true,
  
  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // Cache images for 24 hours
    domains: [
      "livewebsitesjson.s3.ap-south-1.amazonaws.com",
      "localhost",
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
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true
      }
    ];
  },
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/:all*.(jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
  
  // Enable output file tracing for better performance
  output: 'standalone',
};

module.exports = nextConfig;
