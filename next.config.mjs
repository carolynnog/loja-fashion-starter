/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ypliiqwswgryydwucadu.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**",
      },
    ],
  },
};
export default nextConfig;

