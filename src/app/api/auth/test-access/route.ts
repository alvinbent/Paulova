import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, mode: "testing" });

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
