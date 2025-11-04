import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/not-found",
  "/login",
  "/login/options",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const protectedRoutes = ["/", "/users"];

function matchesRoute(path: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (path === route) return true;

    if (route.endsWith("/*") && path.startsWith(route.slice(0, -2))) {
      return true;
    }
    return false;
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next();

  const routeProtection = {
    public: matchesRoute(pathname, publicRoutes),
    protected: matchesRoute(pathname, protectedRoutes),
  };

  // if (routeProtection.protected) {
  //   response = NextResponse.rewrite(new URL("/auth/signin", request.url));
  // } else if (routeProtection.protected) {
  //   response = NextResponse.rewrite(new URL("/", request.url));
  // }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
