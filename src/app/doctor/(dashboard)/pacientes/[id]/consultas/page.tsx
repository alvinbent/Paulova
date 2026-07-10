import { PatientSectionPage } from "@/components/doctor/PatientSectionPage";

export default async function ConsultasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PatientSectionPage
      patientId={id}
      title="Consultas"
      eyebrow="Linea de tiempo clinica"
      icon="history"
      items={[
        "Fecha, hora, tipo de consulta y motivo",
        "Profesional responsable y estado del documento",
        "Productos, insumos, recomendaciones y proximo control",
        "Estados: borrador, transcripcion pendiente, revision, finalizada y firmada",
      ]}
    />
  );
}
