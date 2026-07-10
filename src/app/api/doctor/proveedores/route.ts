import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const list = await db.getProviders();
    return NextResponse.json(list);
  } catch (error: unknown) {
    const message = error instanceof Error && error.message ? error.message : "Error al cargar proveedores";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, nit, contactName, phone, email, city, country, actorType } = body;

    if (!companyName || !nit || !contactName || !phone || !email || !city || !country || !actorType) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const providerId = `prov_${Date.now()}`;
    const newProvider = await db.addProvider({
      id: providerId,
      companyName,
      nit,
      contactName,
      phone,
      email,
      city,
      country,
      actorType
    });

    return NextResponse.json(newProvider);
  } catch (error: unknown) {
    const message = error instanceof Error && error.message ? error.message : "Error al registrar proveedor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
