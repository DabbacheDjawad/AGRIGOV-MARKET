import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[{
      protocol : "https",
      hostname:"*"
    },
          {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },],
    dangerouslyAllowSVG:true
  }
};

export default nextConfig;
