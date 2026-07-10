import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { doctorModules, integrationStates } from "@/lib/doctor-system";

export const revalidate = 0;

export default async function DoctorDashboard() {
  const patients = await db.getPatients();
  const appointments = await db.getAppointments();
  const inventory = await db.getInventory();

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const nextAppointments = appointments
    .filter((a) => a.date >= todayStr && a.status === "Programada")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 6);
  const lowStockItems = inventory.filter((item) => item.units <= item.minUnits);

  const patientAlerts = [
    {
      id: "w1",
      patientName: "Sofía Rodríguez",
      message:
        "Reporta inflamación leve después del tratamiento de ayer. Requiere seguimiento cercano y respuesta clínica breve.",
      time: "Hace 15 min",
    },
  ];

  const metrics = [
    {
      label: "Pacientes activos",
      value: patients.length,
      href: "/doctor/pacientes",
      icon: "group",
      note: "Expedientes disponibles",
    },
    {
      label: "Citas de hoy",
      value: todayAppointments.length,
      href: "/doctor/agenda",
      icon: "calendar_today",
      note: "Agenda operativa",
    },
    {
      label: "Stock crítico",
      value: lowStockItems.length,
      href: "/doctor/inventario",
      icon: "inventory_2",
      note: "Insumos por revisar",
    },
    {
      label: "Seguimientos",
      value: patientAlerts.length,
      href: "/doctor/dashboard",
      icon: "forum",
      note: "Pacientes con alerta",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="paunova-card relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#b99862]/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="paunova-kicker mb-3">Centro operativo PAUNOVA</p>
            <h1 className="paunova-title text-4xl md:text-5xl">
              Bienvenida, <span className="italic">Dra. Carolina Aguirre</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#746b61]">
              Resumen clínico, agenda, pacientes e inventario en una vista
              diseñada para tomar decisiones rápidas sin perder el tono premium
              de la marca.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Link
              href="/doctor/pacientes"
              className="paunova-button-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>Paciente</span>
            </Link>
            <Link
              href="/doctor/agenda"
              className="paunova-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-base">edit_calendar</span>
              <span>Cita</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="paunova-card group rounded-[1.75rem] p-5 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="paunova-kicker">{metric.label}</p>
                <p className="mt-4 font-mono text-4xl font-semibold tabular-nums text-[#5f4f42]">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs text-[#746b61]">{metric.note}</p>
              </div>
              <span className="material-symbols-outlined rounded-2xl bg-[#b99862]/12 p-3 text-2xl text-[#b99862] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#5f4f42] group-hover:text-[#fffdf8]">
                {metric.icon}
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-[#b99862]/16 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="paunova-kicker">Mapa del sistema</p>
              <h2 className="paunova-title mt-1 text-2xl">
                Modulos de la clinica digital
              </h2>
            </div>
            <Link
              href="/doctor/torre-control"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b99862] transition-colors hover:text-[#5f4f42]"
            >
              Ver torre de control
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {doctorModules.slice(0, 8).map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-[1.25rem] bg-white/64 p-4 ring-1 ring-[#b99862]/14 transition-all hover:-translate-y-0.5 hover:bg-[#b99862]/8"
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined rounded-xl bg-[#5f4f42] p-2 text-lg text-[#fffdf8] transition-all group-hover:bg-[#b99862]">
                    {module.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#5f4f42]">
                      {module.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#746b61]">
                      {module.summary}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 border-b border-[#b99862]/16 pb-5">
            <p className="paunova-kicker">Sincronizacion</p>
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_0.85fr]">
        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-[#b99862]/16 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="paunova-kicker">Agenda prioritaria</p>
              <h2 className="paunova-title mt-1 text-2xl">
                Próximas citas programadas
              </h2>
            </div>
            <Link
              href="/doctor/agenda"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b99862] transition-colors hover:text-[#5f4f42]"
            >
              Ver agenda completa
            </Link>
          </div>

          {nextAppointments.length === 0 ? (
            <div className="paunova-inner rounded-[1.5rem] px-6 py-12 text-center">
              <span className="material-symbols-outlined mx-auto mb-3 block text-4xl text-[#b99862]">
                event_available
              </span>
              <p className="text-sm font-medium text-[#5f4f42]">
                No hay citas programadas en este momento.
              </p>
              <p className="mt-1 text-xs text-[#746b61]">
                La agenda está libre para nuevas valoraciones o controles.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b8a76]">
                    <th className="pb-3">Fecha</th>
                    <th className="pb-3">Paciente</th>
                    <th className="pb-3">Tratamiento</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#b99862]/12 text-sm">
                  {nextAppointments.map((appt) => (
                    <tr key={appt.id} className="transition-colors hover:bg-[#b99862]/6">
                      <td className="py-4">
                        <p className="font-mono text-xs font-semibold tabular-nums text-[#5f4f42]">
                          {appt.date}
                        </p>
                        <p className="mt-1 font-mono text-xs text-[#9b8a76]">
                          {appt.time}
                        </p>
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/doctor/pacientes/${appt.patientId}`}
                          className="font-semibold text-[#1d1c19] transition-colors hover:text-[#b99862]"
                        >
                          {appt.patientName}
                        </Link>
                      </td>
                      <td className="py-4 text-[#746b61]">{appt.treatment}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 ring-1 ring-emerald-100">
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/doctor/pacientes/${appt.patientId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#b99862] transition-colors hover:text-[#5f4f42]"
                        >
                          <span>Expediente</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="paunova-card rounded-[2rem] p-5 md:p-6">
            <div className="mb-5 border-b border-[#b99862]/16 pb-5">
              <p className="paunova-kicker">Seguimiento sensible</p>
              <h2 className="paunova-title mt-1 text-2xl">Alertas de pacientes</h2>
            </div>
            <div className="space-y-4">
              {patientAlerts.map((alert) => (
                <article
                  key={alert.id}
                  className="rounded-[1.35rem] border border-[#c88678]/24 bg-[#fff7f4] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[#1d1c19]">
                      {alert.patientName}
                    </h3>
                    <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b3f36]">
                      {alert.time}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#746b61]">
                    {alert.message}
                  </p>
                  <a
                    href="https://wa.me/573506561869"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#9b3f36] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#87362f] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>Responder</span>
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="paunova-card rounded-[2rem] p-5 md:p-6">
            <div className="mb-5 border-b border-[#b99862]/16 pb-5">
              <p className="paunova-kicker">Inventario</p>
              <h2 className="paunova-title mt-1 text-2xl">Stock crítico</h2>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="paunova-inner rounded-[1.35rem] p-5 text-center">
                <span className="material-symbols-outlined mx-auto mb-2 block text-3xl text-emerald-600">
                  check_circle
                </span>
                <p className="text-xs font-medium text-[#5f4f42]">
                  Todos los insumos están sobre el nivel crítico.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {lowStockItems.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-[1.15rem] bg-[#fff9ee] p-3 ring-1 ring-[#b99862]/16"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1d1c19]">{item.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#9b8a76]">
                        {item.category}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#b99862]/12 px-3 py-1 font-mono text-xs font-semibold text-[#5f4f42]">
                      {item.units}/{item.minUnits} {item.unitName}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
