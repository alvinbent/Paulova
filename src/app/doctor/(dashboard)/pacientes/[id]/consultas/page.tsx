import { PaginaSeccionPaciente } from "@/components/doctor/PaginaSeccionPaciente";

export default async function ConsultasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PaginaSeccionPaciente
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
