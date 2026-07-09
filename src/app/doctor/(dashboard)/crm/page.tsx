import React from "react";
import { db } from "@/lib/db";
import CrmClient from "@/components/doctor/CrmClient";

export const revalidate = 0; // Disable cache to fetch real-time updates

export default async function DoctorCrm() {
  const patients = await db.getPatients();

  return <CrmClient initialPatients={patients} />;
}
