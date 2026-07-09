import { NextResponse } from "next/server";

export async function GET() {
  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const response = NextResponse.redirect(new URL("/doctor/dashboard", redirectUrl));
  
  // Auto-authenticate during initial design phase
  response.cookies.set({
    name: "paunova_session",
    value: "authenticated",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  return response;
}
