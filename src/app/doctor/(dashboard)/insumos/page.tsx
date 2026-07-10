import { PaginaModulo, TarjetaFlujo } from "@/components/doctor/PaginaModulo";
import { doctorModules } from "@/lib/doctor-system";

const pageModule = doctorModules.find((item) => item.href === "/doctor/insumos")!;

export default function InsumosPage() {
  return (
    <PaginaModulo module={pageModule}>
      <TarjetaFlujo
        title="Control esperado"
        icon="vaccines"
        items={[
          "Registrar entrada con proveedor, lote y fecha",
          "Registrar salida asociada a paciente y consulta",
          "Ajustar inventario con motivo auditado",
          "Solicitar compra al llegar a stock minimo",
        ]}
      />
    </PaginaModulo>
  );
}
