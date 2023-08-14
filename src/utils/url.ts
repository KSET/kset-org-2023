export const getBaseUrl = () => {
  // browser should use relative url
  if (typeof window !== "undefined") {
    return "";
  }
  return getAppUrl();
};

export const getAppUrl = () => {
  // SSR should use vercel url
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.INTERNAL_ADDRESS) {
    return `http://${process.env.INTERNAL_ADDRESS}:${process.env.PORT ?? 3000}`;
  }
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${
      process.env.PORT ?? 3000
    }`;
  }
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
