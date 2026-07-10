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
        lotUsedId: body.lotUsedId || undefined,
        adverseEvent: body.adverseEvent || "",
        consentStatus: body.consentStatus || "No Aplica",
        priceChargedCop: body.priceChargedCop ? Number(body.priceChargedCop) : 0,
      });

      return NextResponse.json(updated);
    }

    if (body.type === "edit-treatment") {
      if (!body.treatmentId) {
        return NextResponse.json({ error: "treatmentId es requerido para editar" }, { status: 400 });
      }
      if (!body.treatmentName) {
        return NextResponse.json({ error: "Nombre del tratamiento es requerido" }, { status: 400 });
      }

      const updated = await db.updateTreatmentApplied(id, body.treatmentId, {
        treatmentName: body.treatmentName,
        productUsedId: body.productUsedId || undefined,
        productQuantityUsed: body.productQuantityUsed ? Number(body.productQuantityUsed) : undefined,
        details: body.details || "",
        lotUsedId: body.lotUsedId || undefined,
        adverseEvent: body.adverseEvent || "",
        consentStatus: body.consentStatus || "No Aplica",
        priceChargedCop: body.priceChargedCop ? Number(body.priceChargedCop) : 0,
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Tipo de operación no soportado" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in clinical-record POST:", error);
    return NextResponse.json({ error: error.message || "Error al registrar datos clínicos" }, { status: 500 });
  }
}
