const { createContentlayerPlugin } = require("next-contentlayer-temp");

const nextConfig = {
  reactStrictMode: true,
  images: {
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

module.exports = withContentlayer(nextConfig);
