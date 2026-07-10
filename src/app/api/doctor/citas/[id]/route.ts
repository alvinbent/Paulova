import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "El estado es requerido" }, { status: 400 });
    }

    const updated = await db.updateAppointmentStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error al actualizar cita" }, { status: 500 });
  }
}
