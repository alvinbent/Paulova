import ClinicalConsultationFlow from "@/components/doctor/ClinicalConsultationFlow";

export default async function NuevaConsultaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ClinicalConsultationFlow patientId={id} />;
}
