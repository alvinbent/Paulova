import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await db.getPatientClinicalRecord(id);
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Error al cargar historia clínica" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.type === "info") {
      const updated = await db.updateClinicalInfo(id, {
        allergies: body.allergies || "",
        skinType: body.skinType || "",
        notes: body.notes || "",
      });
      return NextResponse.json(updated);
    }

    if (body.type === "treatment") {
      if (!body.treatmentName) {
        return NextResponse.json({ error: "Nombre del tratamiento es requerido" }, { status: 400 });
      }

      const updated = await db.addTreatmentApplied(id, {
        treatmentName: body.treatmentName,
        productUsedId: body.productUsedId || undefined,
        productQuantityUsed: body.productQuantityUsed ? Number(body.productQuantityUsed) : undefined,
        details: body.details || "",
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Tipo de operación no soportado" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Error al registrar datos clínicos" }, { status: 500 });
  }
}
