import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { clientPromise } from "./mongodb";

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    // By default Better Auth requires password length >= 8
  },
  // Set explicit options if needed, but it automatically reads BETTER_AUTH_SECRET
  // and BETTER_AUTH_URL from env.
});
