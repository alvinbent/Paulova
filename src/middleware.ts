import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /doctor paths except /doctor/login
  if (pathname.startsWith("/doctor") && pathname !== "/doctor/login") {
    const sessionCookie = request.cookies.get("paunova_session");

    if (!sessionCookie || sessionCookie.value !== "authenticated") {
      const loginUrl = new URL("/doctor/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/doctor/:path*"],
};
