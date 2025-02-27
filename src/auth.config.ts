import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          console.log("Response:", res);

          if (!res.ok) {
            throw new Error("Failed to log in");
          }

          const user = await res.json();
          console.log("User:", user);

          return user.data;
        } catch (error) {
          console.error("Error logging in:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
