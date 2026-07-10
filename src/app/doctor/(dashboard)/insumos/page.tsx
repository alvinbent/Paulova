import { ModulePage, WorkflowCard } from "@/components/doctor/ModulePage";
import { doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/insumos")!;

export default function InsumosPage() {
  return (
    <ModulePage module={pageModule}>
      <WorkflowCard
        title="Control esperado"
        icon="vaccines"
        items={[
          "Registrar entrada con proveedor, lote y fecha",
          "Registrar salida asociada a paciente y consulta",
          "Ajustar inventario con motivo auditado",
          "Solicitar compra al llegar a stock minimo",
        ]}
      />
    </ModulePage>
  );
}
