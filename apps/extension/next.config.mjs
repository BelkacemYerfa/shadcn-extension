import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
