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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, minUnits, unitName, brand, presentation, invimaRef } = body;

    if (!id || !name || !category || minUnits === undefined || !unitName) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const newProduct = await db.addProduct({
      id,
      name,
      category,
      minUnits: Number(minUnits),
      unitName,
      brand: brand || "",
      presentation: presentation || "",
      invimaRef: invimaRef || "",
    });

    return NextResponse.json(newProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al registrar producto" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Falta ID del producto" }, { status: 400 });
    }

    if (body.type === "product") {
      const updated = await db.updateProduct(body.id, {
        id: body.id,
        name: body.name,
        category: body.category,
        minUnits: Number(body.minUnits) || 0,
        unitName: body.unitName,
        brand: body.brand || "",
        presentation: body.presentation || "",
        invimaRef: body.invimaRef || "",
      });
      if (!updated) {
        return NextResponse.json({ error: "Insumo no encontrado" }, { status: 404 });
      }
      return NextResponse.json(updated);
    }

    if (body.units === undefined) {
      return NextResponse.json({ error: "Faltan unidades" }, { status: 400 });
    }

    const updated = await db.updateInventoryStock(body.id, Number(body.units));
    if (!updated) {
      return NextResponse.json({ error: "Insumo no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar inventario" }, { status: 500 });
  }
}
