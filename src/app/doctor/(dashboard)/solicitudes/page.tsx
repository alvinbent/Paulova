import { PaginaModulo, TarjetaFlujo } from "@/components/doctor/PaginaModulo";
import { doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/solicitudes")!;

export default function SolicitudesPage() {
  return (
    <PaginaModulo module={pageModule}>
      <TarjetaFlujo
        title="Estados de solicitud"
        icon="shopping_cart"
        items={[
          "Borrador",
          "Pendiente de aprobacion",
          "Aprobada y enviada",
          "Confirmada por proveedor",
          "Recibida parcial o recibida",
          "Cancelada con justificacion",
        ]}
      />
    </PaginaModulo>
  );
}
