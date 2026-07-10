import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com', 'images.unsplash.com', 'public.blob.vercel-storage.com'],
  },
};

export default nextConfig;
