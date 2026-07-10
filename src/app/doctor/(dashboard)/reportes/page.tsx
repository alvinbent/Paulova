import Link from "next/link";
import IconoDoctor from "@/components/doctor/IconoDoctor";
import { PaginaModulo } from "@/components/doctor/PaginaModulo";
import { db } from "@/lib/db";
import { doctorModules } from "@/lib/doctor-system";

export const revalidate = 0;

const pageModule = doctorModules.find((item) => item.href === "/doctor/reportes")!;

export default async function ReportesPage() {
  const [patients, appointments, inventory, clinicalRecords] = await Promise.all([
    db.getPatients(),
    db.getAppointments(),
    db.getInventory(),
    db.getClinicalRecords(),
  ]);

  const todayStr = new Date().toISOString().split("T")[0];
  const appointmentsToday = appointments.filter((appointment) => appointment.date === todayStr);
  const completedAppointments = appointments.filter((appointment) =>
    appointment.status.toLowerCase().includes("complet"),
  );
  const lowStock = inventory.filter((item) => item.units <= item.minUnits);
  const treatments = clinicalRecords.flatMap((record) => record.treatmentsApplied ?? []);

  const cards = [
    {
      label: "Pacientes activos",
      value: patients.length,
      detail: "Expedientes disponibles para seguimiento clínico.",
      icon: "group",
    },
    {
      label: "Citas de hoy",
      value: appointmentsToday.length,
      detail: "Agenda clínica del día en curso.",
      icon: "calendar_today",
    },
    {
      label: "Tratamientos registrados",
      value: treatments.length,
      detail: "Procedimientos documentados en historias clínicas.",
      icon: "science",
    },
    {
      label: "Alertas de stock",
      value: lowStock.length,
      detail: "Productos o insumos por debajo del mínimo.",
      icon: "warning",
    },
  ];

  const segments = [
    {
      title: "Agenda",
      value: `${completedAppointments.length}/${appointments.length || 1}`,
      label: "citas completadas",
      href: "/doctor/agenda",
      icon: "calendar_today",
    },
    {
      title: "Pacientes",
      value: String(patients.length),
      label: "expedientes activos",
      href: "/doctor/pacientes",
      icon: "patient_list",
    },
    {
      title: "Inventario",
      value: String(lowStock.length),
      label: "alertas pendientes",
      href: "/doctor/inventario",
      icon: "inventory_2",
    },
  ];

  return (
    <PaginaModulo module={pageModule}>
      <section className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-[1.6rem] bg-[#fffdf8]/80 p-5 ring-1 ring-[#b99862]/14"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b8a76]">
                  {card.label}
                </p>
                <p className="mt-3 font-mono text-4xl font-semibold text-[#5f4f42]">
                  {card.value}
                </p>
              </div>
              <span className="rounded-2xl bg-[#b99862]/12 p-3 text-[#b99862]">
                <IconoDoctor name={card.icon} className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#746b61]">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[2rem] bg-[#5f4f42] p-5 text-[#fffdf8]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d9c4a5]">
          Segmentos
        </p>
        <div className="mt-4 grid gap-3">
          {segments.map((segment) => (
            <Link
              key={segment.title}
              href={segment.href}
              className="group flex items-center justify-between rounded-[1.2rem] bg-white/8 p-4 hover:bg-white/12"
            >
              <span className="flex items-center gap-3">
                <IconoDoctor
                  name={segment.icon}
                  className="h-5 w-5 text-[#d9c4a5] transition-transform group-hover:translate-x-0.5"
                />
                <span>
                  <span className="block text-sm font-semibold">{segment.title}</span>
                  <span className="text-xs text-[#e8ded4]/75">{segment.label}</span>
                </span>
              </span>
              <span className="font-mono text-2xl font-semibold">{segment.value}</span>
            </Link>
          ))}
        </div>
      </section>
    </PaginaModulo>
  );
}
