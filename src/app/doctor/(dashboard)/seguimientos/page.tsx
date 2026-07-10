import { ModulePage, WorkflowCard } from "@/components/doctor/ModulePage";
import { doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/seguimientos")!;

export default function SeguimientosPage() {
  return (
    <ModulePage module={pageModule}>
      <WorkflowCard
        title="Controles configurables"
        icon="event_repeat"
        items={[
          "Control a 24 horas",
          "Control a 7, 15 o 30 dias",
          "Repeticion sugerida en meses segun criterio medico",
          "Seguimiento por WhatsApp o manual en fase posterior",
        ]}
      />
    </ModulePage>
  );
}
