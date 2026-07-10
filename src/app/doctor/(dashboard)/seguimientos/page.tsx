import { PaginaModulo, TarjetaFlujo } from "@/components/doctor/PaginaModulo";
import { doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/seguimientos")!;

export default function SeguimientosPage() {
  return (
    <PaginaModulo module={pageModule}>
      <TarjetaFlujo
        title="Controles configurables"
        icon="event_repeat"
        items={[
          "Control a 24 horas",
          "Control a 7, 15 o 30 dias",
          "Repeticion sugerida en meses segun criterio medico",
          "Seguimiento por WhatsApp o manual en fase posterior",
        ]}
      />
    </PaginaModulo>
  );
}
