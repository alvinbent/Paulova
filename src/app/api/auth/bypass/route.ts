import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/doctor/dashboard", request.url));
  
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
