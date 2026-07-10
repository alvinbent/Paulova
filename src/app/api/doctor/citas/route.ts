import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const list = await db.getAppointments();
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Error al cargar citas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.patientId || !body.date || !body.time || !body.treatment) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const patient = await db.getPatient(body.patientId);
    if (!patient) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    const newAppt = await db.createAppointment({
      patientId: body.patientId,
      patientName: patient.name,
      date: body.date,
      time: body.time,
      treatment: body.treatment,
      status: "Programada",
      notes: body.notes || "",
    });

    return NextResponse.json(newAppt);
  } catch {
    return NextResponse.json({ error: "Error al programar cita" }, { status: 500 });
  }
}
