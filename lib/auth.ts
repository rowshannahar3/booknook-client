import dns from "node:dns";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";

// Some networks refuse the SRV lookup that mongodb+srv:// needs.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(",").map((s) => s.trim()));
}

// Reuse one MongoClient across hot reloads in development.
const globalForMongo = globalThis as unknown as { _booknookMongo?: MongoClient };
const client =
  globalForMongo._booknookMongo ??
  new MongoClient(process.env.MONGODB_URI ?? "mongodb://localhost:27017");
if (process.env.NODE_ENV !== "production") globalForMongo._booknookMongo = client;

const db = client.db(process.env.MONGODB_DB ?? "booknook_dev");
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  database: mongodbAdapter(db),
  trustedOrigins: [baseURL],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, // assignment: after registering, send the user to Login
  },
    account: {
    // If someone registered with email/password first and later uses Google with the same email,
    // link the Google login to the existing account. Google verifies email ownership.
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      // Accounts made with email + password are not email-verified (the assignment skips verification),
      // so the default rule would still block linking.
      requireLocalEmailVerified: false,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  hooks: {
    // Server-side copy of the password rules (never trust the browser alone).
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const password = String((ctx.body as { password?: string })?.password ?? "");
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must include an uppercase and a lowercase letter.",
        });
      }
    }),
  },
  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "15m",
        // "sub" is the user id by default; add the fields the API needs.
        definePayload: ({ user }) => ({
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        }),
      },
    }),
    nextCookies(), // keep last
  ],
});