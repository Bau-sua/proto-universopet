/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Placeholder images used by the demo catalog (https://placehold.co).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;