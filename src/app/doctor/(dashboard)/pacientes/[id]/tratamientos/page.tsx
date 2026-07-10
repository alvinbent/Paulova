import { PatientSectionPage } from "@/components/doctor/PatientSectionPage";

export default async function TratamientosPacientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PatientSectionPage
      patientId={id}
      title="Tratamientos"
      eyebrow="Procedimientos esteticos"
      icon="spa"
      items={[
        "Nombre del tratamiento, zona, tecnica y tolerancia",
        "Producto, cantidad, unidad, lote y vencimiento",
        "Eventos durante el procedimiento y recomendaciones",
        "Proxima sesion o control configurable",
      ]}
    />
  );
}
