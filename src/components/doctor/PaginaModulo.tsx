import Link from "next/link";
import type React from "react";
import { DoctorModule } from "@/lib/doctor-system";

const statusCopy: Record<DoctorModule["status"], { label: string; className: string }> = {
  ready: {
    label: "Funcional",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  draft: {
    label: "En construccion",
    className: "bg-[#fff7e8] text-[#9a6a22] ring-[#e8c78f]/60",
  },
  blocked: {
    label: "Bloqueado",
    className: "bg-[#fff1f1] text-[#9b3f36] ring-[#e6b5ad]/70",
  },
  review: {
    label: "Revision",
    className: "bg-[#eef7f5] text-[#277163] ring-[#b9ded7]/70",
  },
};

export function PaginaModulo({
  module,
  children,
  backHref = "/doctor/panel",
}: {
  module: DoctorModule;
  children?: React.ReactNode;
  backHref?: string;
}) {
  const status = statusCopy[module.status];

  return (
    <div className="space-y-7">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b99862] transition-colors hover:text-[#5f4f42]"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Volver</span>
      </Link>

      <section className="paunova-card relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full bg-[#9fcac0]/22 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="paunova-kicker mb-3">{module.eyebrow}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="material-symbols-outlined rounded-2xl bg-[#5f4f42] p-3 text-3xl text-[#fffdf8]">
                {module.icon}
              </span>
              <h1 className="paunova-title text-4xl md:text-5xl">{module.title}</h1>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#746b61]">
              {module.summary}
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 ${status.className}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.label}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <p className="paunova-kicker">Lineamientos</p>
          <h2 className="paunova-title mt-2 text-2xl">Reglas de este modulo</h2>
          <ul className="mt-5 space-y-3">
            {module.checkpoints.map((checkpoint) => (
              <li
                key={checkpoint}
                className="flex gap-3 rounded-[1.2rem] bg-white/60 p-3 text-sm leading-5 text-[#5f4f42] ring-1 ring-[#b99862]/12"
              >
                <span className="material-symbols-outlined mt-0.5 text-base text-[#b99862]">
                  check_circle
                </span>
                <span>{checkpoint}</span>
              </li>
            ))}
          </ul>
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
        <span className="material-symbols-outlined rounded-2xl bg-[#b99862]/12 p-3 text-2xl text-[#b99862]">
          {icon}
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
