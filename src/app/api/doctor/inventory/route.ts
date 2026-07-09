import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const list = await db.getInventory();
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Error al cargar inventario" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || body.units === undefined) {
      return NextResponse.json({ error: "Faltan ID o unidades" }, { status: 400 });
    }

    const updated = await db.updateInventoryStock(body.id, Number(body.units));
    if (!updated) {
      return NextResponse.json({ error: "Insumo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error al actualizar inventario" }, { status: 500 });
  }
}
