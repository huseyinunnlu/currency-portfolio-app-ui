import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'web-api.forinvestcdn.com',
                pathname: '/definitions/icon/**',
            },
        ],
        dangerouslyAllowSVG: true,
        unoptimized: true
    },
};

export default nextConfig;
