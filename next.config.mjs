/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'touof82hg9gxohid.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
