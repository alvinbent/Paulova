import Link from "next/link";
import type { DashboardData } from "./types";

export default function ClinicalAlertsPanel({ data }: { data: DashboardData }) {
  return (
    <section className="col-span-12 rounded-[28px] bg-[#f5e7e3] p-6 text-[#593c28] ring-1 ring-[#e1c4bd] lg:col-span-5">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#986b54]">
            Alertas y tareas
          </p>
          <h3 className="mt-2 font-serif text-3xl font-medium">Prioridad clínica</h3>
        </div>
        <span className="material-symbols-outlined rounded-full bg-[#593c28] p-3 text-[#fffaf4]">
          priority_high
        </span>
      </div>

      <div className="space-y-3">
        <AlertRow title="Historia sin firma" detail="Revisar borrador antes de cerrar documento." href="/doctor/historias-clinicas" />
        <AlertRow title={`${data.lowStockItems.length} insumos críticos`} detail="Validar disponibilidad antes de próximos procedimientos." href="/doctor/inventario" />
        <AlertRow title="Seguimiento post-tratamiento" detail="Responder control de 24 horas por WhatsApp." href="/doctor/seguimientos" />
      </div>
    </section>
  );
}

function AlertRow({ title, detail, href }: { title: string; detail: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 rounded-[22px] bg-[#fffaf4]/72 p-4 transition hover:bg-[#fffaf4]"
    >
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-[#7b6052]">{detail}</span>
      </span>
      <span className="material-symbols-outlined text-base">arrow_forward</span>
    </Link>
  );
}
