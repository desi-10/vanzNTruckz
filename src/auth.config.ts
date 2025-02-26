import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          const res = await fetch("http://localhost:3000/api/v1/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            throw new Error("Failed to log in");
          }

          const user = await res.json();

          return user.data;
        } catch (error) {
          console.error("Error logging in:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
