import { ModulePage, WorkflowCard } from "@/components/doctor/ModulePage";
import { doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/productos")!;

export default function ProductosPage() {
  return (
    <ModulePage module={pageModule}>
      <WorkflowCard
        title="Campos por producto"
        icon="science"
        items={[
          "Nombre comercial, principio activo, marca y presentacion",
          "Lote, fecha de vencimiento, cantidad disponible y unidad",
          "Proveedor, costo, fecha de compra y estado",
          "Uso por paciente, zona, consulta y observaciones",
        ]}
      />
    </ModulePage>
  );
}
