import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Domains that are allowed to be used with next/image
    // doesn't work for cjs config , need ESM config
    domains: ["pbs.twimg.com"],
  },
  redirects: async function () {
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

export default withContentCollections(nextConfig);
