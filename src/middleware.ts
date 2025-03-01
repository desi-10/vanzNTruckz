import NextAuth from "next-auth";
import authConfig from "./auth.config";
// import { NextResponse } from "next/server";
import { auth } from "./auth";
import { NextResponse } from "next/server";
const { auth: middleware } = NextAuth(authConfig);

// Allowed Roles
const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"];

export default middleware(async (req) => {
  const session = await auth();
  const nextUrl = req.nextUrl;

  if (
    session?.user &&
    ["/login", "/forgot-password", "/reset-password"].includes(nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    nextUrl.pathname.startsWith("/dashboard") &&
    !ALLOWED_ROLES.includes(session?.user?.role as string)
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    ALLOWED_ROLES.includes(session?.user?.role as string) &&
    nextUrl.pathname === "/"
  ) {
    return NextResponse.redirect(new URL("/dashboard/orders", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
