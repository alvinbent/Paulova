import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const protocols = await db.getProtocols();
    const items = await db.getProtocolItems();
    return NextResponse.json({ protocols, items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al cargar protocolos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, indications, contraindications, recommendedSessions, notes, items } = body;

    if (!name || recommendedSessions === undefined) {
      return NextResponse.json({ error: "Nombre y sesiones recomendadas son requeridos" }, { status: 400 });
    }

    const protocolId = `prot_${Date.now()}`;
    const newProtocol = await db.addProtocol({
      id: protocolId,
      name,
      indications: indications || "",
      contraindications: contraindications || "",
      recommendedSessions: Number(recommendedSessions),
      notes: notes || "",
      active: true
    }, items || []);

    return NextResponse.json(newProtocol);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al registrar protocolo" }, { status: 500 });
  }
}
