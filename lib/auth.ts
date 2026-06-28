import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getPool } from "@/lib/db";
import { getAuthBaseUrl } from "@/lib/site";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const authBaseUrl = getAuthBaseUrl();

export const auth = betterAuth({
  appName: "Build Pa'l Norte",
  baseURL: authBaseUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: getPool(),
  trustedOrigins: [authBaseUrl],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
