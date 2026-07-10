import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const list = await db.getLots();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al cargar lotes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, lotNumber, expiryDate, providerId, costUnitCop, initialQty, physicalLocation } = body;

    if (!productId || !lotNumber || !expiryDate || !providerId || costUnitCop === undefined || initialQty === undefined) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const lotId = `lot_${Date.now()}`;
    const newLot = await db.addLot({
      id: lotId,
      productId,
      lotNumber,
      expiryDate,
      serialNumber: body.serialNumber || "",
      providerId,
      costUnitCop: Number(costUnitCop),
      initialQty: Number(initialQty),
      currentQty: Number(initialQty),
      physicalLocation: physicalLocation || "",
      status: "activo"
    });

    return NextResponse.json(newLot);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al registrar lote" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, expiryDate, serialNumber, providerId, costUnitCop, currentQty, physicalLocation, status } = body;

    if (!id || !expiryDate || !providerId || costUnitCop === undefined || currentQty === undefined || !status) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const updated = await db.updateLotDirect(id, {
      expiryDate,
      serialNumber: serialNumber || "",
      providerId,
      costUnitCop: Number(costUnitCop),
      currentQty: Number(currentQty),
      physicalLocation: physicalLocation || "",
      status
    });

    if (!updated) {
      return NextResponse.json({ error: "Lote no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar lote" }, { status: 500 });
  }
}
