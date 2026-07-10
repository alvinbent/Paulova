import { db } from "@/lib/db";
import CrmClient from "@/components/doctor/CrmClient";

export const revalidate = 0;

export default async function DoctorPacientes() {
  const patients = await db.getPatients();

  return <CrmClient initialPatients={patients} />;
}
