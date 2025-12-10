import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutes = [
  "/dashboard",
  "/plants",
  "/identify",
  "/ai",
  "/health",
  "/analytics",
  "/history",
  "/profile",
];
const authRoutes = ["/login", "/signup"];
const publicRoutes = ["/", "/onboarding"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If not a protected or auth route, allow access
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  try {
    // Use Better Auth to check session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // Redirect to dashboard if accessing auth routes with active session
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy auth error:", error);

    // On error with protected routes, redirect to login
    if (isProtectedRoute) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
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
