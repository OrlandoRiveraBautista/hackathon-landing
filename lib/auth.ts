import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getPool } from "@/lib/db";
import { getAuthBaseUrl } from "@/lib/site";

const authBaseUrl = getAuthBaseUrl();

export const auth = betterAuth({
  appName: "Build Pa'l Norte",
  baseURL: authBaseUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: getPool(),
  trustedOrigins: [authBaseUrl],
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin", "owner"],
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
