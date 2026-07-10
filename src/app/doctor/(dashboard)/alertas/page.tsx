import { ModulePage, WorkflowCard } from "@/components/doctor/ModulePage";
import { doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/alertas")!;

export default function AlertasPage() {
  return (
    <ModulePage module={pageModule}>
      <WorkflowCard
        title="Semaforo de prioridad"
        icon="notifications_active"
        items={[
          "Amarillo: cerca del minimo o control proximo",
          "Naranja: stock minimo, historia sin finalizar o solicitud pendiente",
          "Rojo: agotado, vencido, control vencido o riesgo sensible",
          "Toda alerta sensible debe quedar en auditoria",
        ]}
      />
    </ModulePage>
  );
}
