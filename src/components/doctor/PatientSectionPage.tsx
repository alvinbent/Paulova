import Link from "next/link";
import { db } from "@/lib/db";

export async function PatientSectionPage({
  patientId,
  title,
  eyebrow,
  icon,
  items,
}: {
  patientId: string;
  title: string;
  eyebrow: string;
  icon: string;
  items: string[];
}) {
  const patient = await db.getPatient(patientId);
  const records = [
    ["Hoy", "Revision pendiente", "Dra Carolina Aguirre", "Borrador"],
    ["Ultima consulta", "Evolucion y seguimiento", "Asistente", "Revision"],
    ["Inventario", "Producto/insumo asociado", "Sistema", "Validar"],
  ];
  const nav = [
    ["Resumen", `/doctor/pacientes/${patientId}`, "patient_list"],
    ["Consultas", `/doctor/pacientes/${patientId}/consultas`, "history"],
    ["Nueva", `/doctor/pacientes/${patientId}/consultas/nueva`, "add_circle"],
    ["Tratamientos", `/doctor/pacientes/${patientId}/tratamientos`, "spa"],
    ["Productos", `/doctor/pacientes/${patientId}/productos`, "science"],
    ["Insumos", `/doctor/pacientes/${patientId}/insumos`, "vaccines"],
    ["Fotos", `/doctor/pacientes/${patientId}/fotografias`, "photo_camera"],
    ["Consent.", `/doctor/pacientes/${patientId}/consentimientos`, "fact_check"],
  ];

  return (
    <div className="space-y-6">
      <section className="paunova-card overflow-hidden rounded-[2rem]">
        <div className="border-b border-[#b99862]/16 p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/doctor/pacientes/${patientId}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#5f4f42] ring-1 ring-[#b99862]/18 transition-all hover:bg-[#b99862]/12"
                aria-label="Volver al expediente"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
              </Link>
              <span className="material-symbols-outlined flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5f4f42] text-3xl text-[#fffdf8]">
                {icon}
              </span>
              <div>
                <p className="paunova-kicker">{eyebrow}</p>
                <h1 className="paunova-title mt-1 text-3xl md:text-4xl">{title}</h1>
                <p className="mt-1 text-sm text-[#746b61]">
                  {patient?.name ?? "Paciente"} - Dra Carolina Aguirre
                </p>
              </div>
            </div>
            <Link
              href={`/doctor/pacientes/${patientId}/consultas/nueva`}
              className="paunova-button-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
            >
              <span className="material-symbols-outlined text-sm">mic</span>
              Nueva consulta
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[15rem_1fr_18rem]">
          <nav className="border-b border-[#b99862]/16 p-4 xl:border-b-0 xl:border-r">
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
              {nav.map(([label, href, navIcon]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-[1rem] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5f4f42] transition-all hover:bg-[#b99862]/10"
                >
                  <span className="material-symbols-outlined text-sm">{navIcon}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <section className="min-w-0 border-b border-[#b99862]/16 p-5 xl:border-b-0 xl:border-r">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="paunova-kicker">Workspace del paciente</p>
                <h2 className="paunova-title mt-1 text-2xl">Actividad y registros</h2>
              </div>
              <button className="paunova-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filtrar
              </button>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-white/70 ring-1 ring-[#b99862]/14">
              <div className="hidden grid-cols-[9rem_1fr_12rem_8rem] border-b border-[#b99862]/12 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76] md:grid">
                <span>Fecha</span>
                <span>Registro</span>
                <span>Responsable</span>
                <span>Estado</span>
              </div>
              {records.map(([date, record, owner, state]) => (
                <article
                  key={`${date}-${record}`}
                  className="grid gap-3 border-b border-[#b99862]/10 px-4 py-4 last:border-b-0 md:grid-cols-[9rem_1fr_12rem_8rem] md:items-center"
                >
                  <span className="font-mono text-xs font-semibold text-[#9b8a76]">
                    {date}
                  </span>
                  <span className="text-sm font-semibold text-[#1d1c19]">{record}</span>
                  <span className="text-sm text-[#746b61]">{owner}</span>
                  <span className="w-fit rounded-full bg-[#fff7e8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a6a22] ring-1 ring-[#e8c78f]/60">
                    {state}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <aside className="p-5">
            <p className="paunova-kicker">Checklist</p>
            <h2 className="paunova-title mt-1 text-2xl">Antes de cerrar</h2>
            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-[1.15rem] bg-white/70 p-3 text-sm leading-5 text-[#5f4f42] ring-1 ring-[#b99862]/14"
                >
                  <span className="material-symbols-outlined mt-0.5 text-base text-[#b99862]">
                    task_alt
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
