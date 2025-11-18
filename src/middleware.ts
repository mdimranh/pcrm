import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/core/db";

const publicRoutes = [
  "/auth/*",
  "/api/auth/*",
];

function matchesRoute(path: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (path === route) return true;
    if (route.endsWith("/*") && path.startsWith(route.slice(0, -2))) return true;
    return false;
  });
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isAuthPage = matchesRoute(pathname, ["/auth/*"]);
  const isPublicNonAuth = matchesRoute(pathname, ["/about"]);
  const isApi = matchesRoute(pathname, ["/api/*"]);
  if (isPublicNonAuth || isApi) return NextResponse.next();

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const sessionToken = request.cookies.get("session_token")?.value ?? (refreshToken ? refreshToken.split(".")[0] : undefined);
  const isProd = process.env.NODE_ENV === "production";

  let sessionValid = false;
  if (sessionToken) {
    try {
      const session = await db.session.findUnique({ where: { token: sessionToken } });
      sessionValid = !!session && session.expiresAt > new Date();
    } catch {
      sessionValid = false;
    }
  }

  const isAuthenticated = !!accessToken || sessionValid;

  if (isAuthPage) {
    if (isAuthenticated) {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  if (sessionValid && !accessToken) {
    const res = NextResponse.next();
    res.cookies.set("access_token", sessionToken!, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 15 * 60,
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
