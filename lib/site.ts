const LOCAL = "http://localhost:3000";
const PROD = "https://www.buildpalnorte.com";

function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return LOCAL;
  }
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return PROD;
}

export const getSiteUrl = getBaseUrl;
export const getAuthBaseUrl = getBaseUrl;
export const getPublicAuthBaseUrl = getBaseUrl;
