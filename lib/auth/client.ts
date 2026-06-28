import { createAuthClient } from "better-auth/react";
import { getPublicAuthBaseUrl } from "@/lib/site";

export const authClient = createAuthClient({
  baseURL: getPublicAuthBaseUrl(),
});
