const { withPlausibleProxy } = require("next-plausible");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withPlausibleProxy()(withBundleAnalyzer({}));
