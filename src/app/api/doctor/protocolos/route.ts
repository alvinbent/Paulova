import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const protocols = await db.getProtocols();
    const items = await db.getProtocolItems();
    return NextResponse.json({ protocols, items });
  } catch (error: unknown) {
    const message = error instanceof Error && error.message ? error.message : "Error al cargar protocolos";
    return NextResponse.json({ error: message }, { status: 500 });
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
  } catch (error: unknown) {
    const message = error instanceof Error && error.message ? error.message : "Error al registrar protocolo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
