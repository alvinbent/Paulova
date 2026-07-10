import FlujoConsultaClinica from "@/components/doctor/FlujoConsultaClinica";

export default async function NuevaConsultaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <FlujoConsultaClinica patientId={id} />;
}
