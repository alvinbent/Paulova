import Link from "next/link";
import type React from "react";
import IconoDoctor from "@/components/doctor/IconoDoctor";
import { DoctorModule, moduleWorkspaces } from "@/lib/doctor-system";

const statusCopy: Record<DoctorModule["status"], { label: string; className: string }> = {
  ready: {
    label: "Funcional",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  draft: {
    label: "En construcción",
    className: "bg-[#fff7e8] text-[#9a6a22] ring-[#e8c78f]/60",
  },
  blocked: {
    label: "Bloqueado",
    className: "bg-[#fff1f1] text-[#9b3f36] ring-[#e6b5ad]/70",
  },
  review: {
    label: "Revisión",
    className: "bg-[#eef7f5] text-[#277163] ring-[#b9ded7]/70",
  },
};

export function PaginaModulo({
  module,
  children,
  backHref = "/doctor/dashboard",
}: {
  module: DoctorModule;
  children?: React.ReactNode;
  backHref?: string;
}) {
  const status = statusCopy[module.status];
  const workspace = moduleWorkspaces[module.href] ?? {
    metrics: [
      { label: "Activos", value: "8", icon: module.icon },
      { label: "Pendientes", value: "3", icon: "schedule" },
      { label: "Críticos", value: "1", icon: "warning" },
    ],
    records: [
      {
        title: module.title,
        subject: "Dra Carolina Aguirre",
        meta: module.summary,
        state: status.label,
      },
    ],
    actions: [
      { label: module.primaryAction, href: module.href, icon: module.icon },
      { label: "Torre de control", href: "/doctor/torre-control", icon: "monitoring" },
      { label: "Alertas", href: "/doctor/alertas", icon: "notifications_active" },
    ],
  };

  return (
    <div className="space-y-6">
      <section className="paunova-card overflow-hidden rounded-[2rem]">
        <div className="border-b border-[#b99862]/16 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={backHref}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#5f4f42] ring-1 ring-[#b99862]/18 hover:bg-[#b99862]/12"
                aria-label="Regresar"
              >
                <IconoDoctor name="arrow_back" className="h-4 w-4" />
              </Link>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5f4f42] text-[#fffdf8]">
                <IconoDoctor name={module.icon} className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="paunova-kicker">{module.eyebrow}</p>
                <h1 className="paunova-title truncate text-3xl md:text-4xl">
                  {module.title}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={backHref}
                className="paunova-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              >
                <IconoDoctor name="arrow_back" className="h-3.5 w-3.5" />
                Regresar
              </Link>
              <Link
                href="/doctor/dashboard"
                className="paunova-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              >
                <IconoDoctor name="close" className="h-3.5 w-3.5" />
                Cerrar
              </Link>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 ${status.className}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {status.label}
              </span>
              <button
                type="button"
                className="paunova-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              >
                <IconoDoctor name="tune" className="h-3.5 w-3.5" />
                Filtros
              </button>
              <button
                type="button"
                className="paunova-button-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              >
                <IconoDoctor name="add" className="h-3.5 w-3.5" />
                {module.primaryAction}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[18rem_1fr_20rem]">
          <aside className="border-b border-[#b99862]/16 p-5 xl:border-b-0 xl:border-r">
            <p className="text-sm leading-6 text-[#746b61]">{module.summary}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-1">
              {workspace.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.2rem] bg-white/70 p-4 ring-1 ring-[#b99862]/14"
                >
                  <IconoDoctor name={metric.icon} className="h-5 w-5 text-[#b99862]" />
                  <p className="mt-3 font-mono text-3xl font-semibold text-[#5f4f42]">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b8a76]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <section className="min-w-0 border-b border-[#b99862]/16 p-5 xl:border-b-0 xl:border-r">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="paunova-kicker">Cola de trabajo</p>
                <h2 className="paunova-title mt-1 text-2xl">Operación del módulo</h2>
              </div>
              <div className="relative w-full md:max-w-xs">
                <IconoDoctor
                  name="search"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b99862]"
                />
                <input
                  className="paunova-input py-3 pl-10 pr-4 text-sm"
                  placeholder="Buscar paciente, lote o estado"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-white/70 ring-1 ring-[#b99862]/14">
              <div className="hidden grid-cols-[1fr_12rem_9rem] gap-4 border-b border-[#b99862]/12 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76] md:grid">
                <span>Actividad</span>
                <span>Responsable</span>
                <span>Estado</span>
              </div>
              {workspace.records.map((item) => (
                <article
                  key={item.title}
                  className="grid gap-3 border-b border-[#b99862]/10 px-4 py-4 last:border-b-0 md:grid-cols-[1fr_12rem_9rem] md:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#1d1c19]">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#746b61]">{item.meta}</p>
                  </div>
                  <p className="text-sm font-medium text-[#5f4f42]">{item.subject}</p>
                  <span className="w-fit rounded-full bg-[#eef7f5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#277163] ring-1 ring-[#b9ded7]/70">
                    {item.state}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <aside className="p-5">
            <p className="paunova-kicker">Panel contextual</p>
            <h2 className="paunova-title mt-1 text-2xl">Decisión rápida</h2>
            <div className="mt-5 space-y-3">
              {workspace.actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex w-full items-center justify-between rounded-[1.15rem] bg-white/70 px-4 py-3 text-left text-sm font-semibold text-[#5f4f42] ring-1 ring-[#b99862]/14 hover:bg-[#b99862]/10"
                >
                  <span className="inline-flex items-center gap-2">
                    <IconoDoctor name={action.icon} className="h-4 w-4 text-[#b99862]" />
                    {action.label}
                  </span>
                  <IconoDoctor name="arrow_forward" className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <div className="mt-5 rounded-[1.35rem] bg-[#fff7e8] p-4 text-[#7b5521] ring-1 ring-[#e8c78f]/60">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                Seguridad clínica
              </p>
              <p className="mt-2 text-xs leading-5">
                La información sensible queda como borrador o pendiente hasta
                aprobación de la doctora. No se automatizan diagnósticos.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <p className="paunova-kicker">Protocolo</p>
          <h2 className="paunova-title mt-2 text-2xl">Reglas operativas</h2>
          <div className="mt-5 grid gap-3">
            {module.checkpoints.map((checkpoint) => (
              <div
                key={checkpoint}
                className="flex gap-3 rounded-[1.2rem] bg-white/60 p-3 text-sm leading-5 text-[#5f4f42] ring-1 ring-[#b99862]/12"
              >
                <IconoDoctor name="check_circle" className="mt-0.5 h-4 w-4 text-[#b99862]" />
                <span>{checkpoint}</span>
              </div>
            ))}
          </div>
        </div>

        <div>{children}</div>
      </section>
    </div>
  );
}

export function TarjetaFlujo({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  return (
    <article className="paunova-card rounded-[2rem] p-5 md:p-6">
      <div className="flex items-center gap-3 border-b border-[#b99862]/16 pb-4">
        <span className="rounded-2xl bg-[#b99862]/12 p-3 text-[#b99862]">
          <IconoDoctor name={icon} className="h-6 w-6" />
        </span>
        <h3 className="paunova-title text-2xl">{title}</h3>
      </div>
      <div className="mt-5 grid gap-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-[1.2rem] bg-[#fffdf8]/70 p-3 ring-1 ring-[#b99862]/12"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5f4f42] font-mono text-xs font-semibold text-[#fffdf8]">
              {index + 1}
            </span>
            <span className="text-sm text-[#5f4f42]">{item}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
