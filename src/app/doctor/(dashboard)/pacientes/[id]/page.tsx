import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PacienteClient from "@/components/doctor/PacienteClient";

export const revalidate = 0; // Disable cache to fetch real-time updates

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

  return (
    <PacienteClient
      patient={patient}
      record={record}
      inventory={inventory}
    />
  );
}
