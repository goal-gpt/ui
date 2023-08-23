const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  async rewrites() {
    return [
      {
        source: "/js/script.js",
        destination:
          "https://plausible.io/js/script.outbound-links.tagged-events.js",
      },
      {
        source: "/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
});
