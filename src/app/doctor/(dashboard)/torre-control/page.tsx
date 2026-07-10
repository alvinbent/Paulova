import Link from "next/link";
import { controlMetrics, doctorModules, integrationStates } from "@/lib/doctor-system";

const toneClass = {
  gold: "bg-[#fff7e8] text-[#9a6a22] ring-[#e8c78f]/60",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rose: "bg-[#fff1f1] text-[#9b3f36] ring-[#e6b5ad]/70",
  blue: "bg-[#eef7f5] text-[#277163] ring-[#b9ded7]/70",
};

export default function TorreControlPage() {
  return (
    <div className="space-y-7">
      <section className="paunova-card relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="absolute right-[-4rem] top-[-4rem] h-72 w-72 rounded-full bg-[#9fcac0]/24 blur-3xl" />
        <div className="relative max-w-4xl">
          <p className="paunova-kicker mb-3">Operacion global</p>
          <h1 className="paunova-title text-4xl md:text-5xl">
            Torre de Control Paunova
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#746b61]">
            Vista ejecutiva para entender el dia clinico, los riesgos operativos
            y el estado de las integraciones sin perder foco en la paciente.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {controlMetrics.map((metric) => (
          <article
            key={metric.label}
            className={`rounded-[1.6rem] p-5 ring-1 ${toneClass[metric.tone]}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                  {metric.label}
                </p>
                <p className="mt-4 font-mono text-4xl font-semibold">{metric.value}</p>
                <p className="mt-2 text-xs leading-5 opacity-80">{metric.detail}</p>
              </div>
              <span className="material-symbols-outlined text-3xl">{metric.icon}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 border-b border-[#b99862]/16 pb-5">
            <p className="paunova-kicker">Mapa operativo</p>
            <h2 className="paunova-title mt-1 text-2xl">Modulos activos</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {doctorModules.map((module) => (
              <Link
                href={module.href}
                key={module.href}
                className="group rounded-[1.25rem] bg-white/64 p-4 ring-1 ring-[#b99862]/14 transition-all hover:-translate-y-0.5 hover:bg-[#b99862]/8"
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined rounded-xl bg-[#5f4f42] p-2 text-lg text-[#fffdf8]">
                    {module.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#5f4f42]">{module.title}</p>
                    <p className="mt-1 text-xs leading-5 text-[#746b61]">{module.summary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 border-b border-[#b99862]/16 pb-5">
            <p className="paunova-kicker">Integraciones</p>
            <h2 className="paunova-title mt-1 text-2xl">Estado tecnico</h2>
          </div>
          <div className="space-y-3">
            {integrationStates.map((integration) => (
              <article
                key={integration.name}
                className="rounded-[1.2rem] bg-white/68 p-4 ring-1 ring-[#b99862]/14"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[#5f4f42]">
                    {integration.name}
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-emerald-100">
                    {integration.status}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#746b61]">
                  {integration.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
