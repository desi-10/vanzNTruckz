import NextAuth from "next-auth";
import authConfig from "./auth.config";
// import { NextResponse } from "next/server";
import { auth } from "./auth";
const { auth: middleware } = NextAuth(authConfig);

export default middleware(async (req) => {
  const session = await auth();
  const nextUrl = req.nextUrl;

  console.log("Next URL:", nextUrl);
  console.log("Session:", session);

  // if (
  //   nextUrl.pathname.startsWith("/dashboard") &&
  //   session?.user.role !== "ADMIN"
  // ) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // if (session?.user.role === "ADMIN" && nextUrl.pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
