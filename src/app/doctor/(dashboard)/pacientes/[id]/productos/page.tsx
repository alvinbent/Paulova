import { PatientSectionPage } from "@/components/doctor/PatientSectionPage";

export default async function ProductosPacientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PatientSectionPage
      patientId={id}
      title="Productos aplicados"
      eyebrow="Lotes por paciente"
      icon="science"
      items={[
        "Nombre, marca, principio activo y presentacion",
        "Lote, fecha de vencimiento y cantidad utilizada",
        "Zona de aplicacion y observaciones",
        "Movimiento sincronizado con inventario global",
      ]}
    />
  );
}
