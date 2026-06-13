import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL is read from window.location or configured automatically in Next.js
});
