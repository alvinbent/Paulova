import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const normalizedUsername = typeof username === "string" ? username.trim() : "";
    const configuredUsername = process.env.ADMIN_USERNAME?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const usernameMatches = configuredUsername
      ? normalizedUsername.toLowerCase() === configuredUsername.toLowerCase()
      : normalizedUsername.length > 0;

    if (usernameMatches && password === adminPassword) {
      const response = NextResponse.json({ success: true });

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

    return NextResponse.json(
      { success: false, error: "Usuario o clave incorrectos" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
