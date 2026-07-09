import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear cookie by setting maxAge to 0
  response.cookies.set({
    name: "paunova_session",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/doctor/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  
  response.cookies.set({
    name: "paunova_session",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}
