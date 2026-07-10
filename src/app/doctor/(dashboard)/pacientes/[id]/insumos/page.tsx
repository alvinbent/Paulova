import { PaginaSeccionPaciente } from "@/components/doctor/PaginaSeccionPaciente";

export default async function InsumosPacientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PaginaSeccionPaciente
      patientId={id}
      title="Insumos utilizados"
      eyebrow="Consumo clinico"
      icon="vaccines"
      items={[
        "Jeringas, agujas, gasas, guantes y antisepticos",
        "Cantidad, unidad, fecha y consulta asociada",
        "Usuario que registro la salida",
        "Observaciones y movimiento de inventario",
      ]}
    />
  );
}
