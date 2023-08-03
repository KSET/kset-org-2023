/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  output: "standalone",

  poweredByHeader: false,

  compress: false,

  images: {
    domains: ["localhost", "kset.org", "www.kset.org"],
  },

  async redirects() {
    return await Promise.resolve([
      {
        source: "/arhiva/dogadaji",
        destination: "/program",
        permanent: false,
      },
      {
        source: "/dogadaj/:slug",
        destination: "/program/:slug",
        permanent: false,
      },
      {
        source: "/arhiva/vijesti",
        destination: "/news",
        permanent: false,
      },
      {
        source: "/vijest/:slug",
        destination: "/news/:slug",
        permanent: false,
      },
      {
        source: "/club",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/club/divisions",
        destination: "/divisions",
        permanent: false,
      },
      {
        source: "/club/multimedia",
        destination: "/multimedia",
        permanent: false,
      },
      {
        source: "/kontakt",
        destination: "/contact",
        permanent: false,
      },
      {
        source: "/gallery/live/:slug",
        destination: "/multimedia/live/:slug",
        permanent: false,
      },
    ]);
  },

  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },

  experimental: {
    typedRoutes: true,
    adjustFontFallbacks: true,
  },
};
export default config;
