import { db } from "@/lib/db";
import CrmCliente from "@/components/doctor/CrmCliente";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function DoctorPacientes() {
  const patients = await db.getPatients();

  return <CrmCliente initialPatients={patients} />;
}
