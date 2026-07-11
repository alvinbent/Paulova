import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PacienteCliente from "@/components/doctor/PacienteCliente";

export const revalidate = 0; // Disable cache to fetch real-time updates
export const dynamic = "force-dynamic";

export default async function DoctorPacientePerfil({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await db.getPatient(id);

  if (!patient) {
    notFound();
    return null;
  }

  const record = await db.getPatientClinicalRecord(id);
  const inventory = await db.getInventory();
  const lots = await db.getLots();
  const protocols = await db.getProtocols();
  const protocolItems = await db.getProtocolItems();

  return (
    <PacienteCliente
      patient={patient}
      record={record}
      inventory={inventory}
      lots={lots}
      protocols={protocols}
      protocolItems={protocolItems}
    />
  );
}
