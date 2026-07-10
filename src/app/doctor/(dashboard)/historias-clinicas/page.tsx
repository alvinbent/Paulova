import { ModulePage, WorkflowCard } from "@/components/doctor/ModulePage";
import { clinicalFlow, doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/historias-clinicas")!;

export default function HistoriasClinicasPage() {
  return (
    <ModulePage module={pageModule}>
      <div className="space-y-6">
        <WorkflowCard title="Flujo de nueva historia" icon="flowsheet" items={clinicalFlow} />
        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <p className="paunova-kicker">Aviso obligatorio</p>
          <p className="mt-3 text-sm leading-6 text-[#746b61]">
            Documento generado con apoyo de inteligencia artificial. Requiere
            revision y aprobacion de la Dra Carolina Aguirre antes de su cierre.
          </p>
        </div>
      </div>
    </ModulePage>
  );
}
