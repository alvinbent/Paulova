import { PatientSectionPage } from "@/components/doctor/PatientSectionPage";

export default async function FotografiasPacientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PatientSectionPage
      patientId={id}
      title="Fotografias clinicas"
      eyebrow="Evolucion visual"
      icon="photo_camera"
      items={[
        "Antes, durante, despues, control y evolucion",
        "Fecha, zona, tratamiento y consulta",
        "Autorizacion clinica separada de uso publicitario",
        "Ninguna imagen pasa automaticamente a marketing",
      ]}
    />
  );
}
