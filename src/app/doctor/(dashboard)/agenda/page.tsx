import React from "react";
import { db } from "@/lib/db";
import AgendaClient from "@/components/doctor/AgendaClient";

export const revalidate = 0; // Disable cache to fetch real-time updates

export default async function DoctorAgenda() {
  const appointments = await db.getAppointments();
  const patients = await db.getPatients();

  // Sort appointments chronologically by default
  const sortedAppointments = appointments.sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  );

  const patientOptions = patients.map((p) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <AgendaClient
      initialAppointments={sortedAppointments}
      patients={patientOptions}
    />
  );
}
