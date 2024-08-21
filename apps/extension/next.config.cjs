import { createContentlayerPlugin } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Domains that are allowed to be used with next/image
    // doesn't work for cjs config , need ESM config
    domains: ["pbs.twimg.com"],
  },
  redirects: function () {
    return [
      {
        source: "/docs",
        destination: "/docs/introduction",
        permanent: true,
      },
      {
        source: "/docs/components",
        destination: "/components",
        permanent: true,
      },
    ];
  },
};

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
});

export default withContentlayer(nextConfig);
