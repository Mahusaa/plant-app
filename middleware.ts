import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/plants", "/identify", "/ai", "/health", "/analytics", "/history", "/profile"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get session token from cookies
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // Redirect to login if accessing protected route without session
  // DISABLED: Allow access to protected routes without authentication
  // if (isProtectedRoute && !sessionToken) {
  //   const url = new URL("/login", request.url);
  //   url.searchParams.set("from", pathname);
  //   return NextResponse.redirect(url);
  // }

  // Redirect to dashboard if accessing auth routes with active session
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|onboarding).*)",
  ],
};
