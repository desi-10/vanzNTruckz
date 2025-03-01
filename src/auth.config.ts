import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

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
