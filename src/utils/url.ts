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
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
