import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const list = await db.getPatients();
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Error al cargar pacientes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: "Nombre y Teléfono son requeridos" }, { status: 400 });
    }
    const newPatient = await db.createPatient({
      name: body.name,
      phone: body.phone,
      email: body.email || "",
      birthday: body.birthday || "",
      notes: body.notes || "",
    });
    return NextResponse.json(newPatient);
  } catch {
    return NextResponse.json({ error: "Error al registrar paciente" }, { status: 500 });
  }
}
