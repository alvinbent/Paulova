import CalendarPanel from "@/components/doctor/dashboard/CalendarPanel";
import ClinicalAlertsPanel from "@/components/doctor/dashboard/ClinicalAlertsPanel";
import DashboardHeader from "@/components/doctor/dashboard/DashboardHeader";
import DashboardHero from "@/components/doctor/dashboard/DashboardHero";
import MetricCard from "@/components/doctor/dashboard/MetricCard";
import NextAppointmentCard from "@/components/doctor/dashboard/NextAppointmentCard";
import PatientSummaryCard from "@/components/doctor/dashboard/PatientSummaryCard";
import RecentActivityPanel from "@/components/doctor/dashboard/RecentActivityPanel";
import TodaySchedule from "@/components/doctor/dashboard/TodaySchedule";
import { db } from "@/lib/db";

export const revalidate = 0;

export default async function DoctorDashboard() {
  const patients = await db.getPatients();
  const appointments = await db.getAppointments();
  const inventory = await db.getInventory();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayAppointments = appointments.filter((appointment) => appointment.date === todayStr);
  const nextAppointments = appointments
    .filter((appointment) => appointment.date >= todayStr && appointment.status === "Programada")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 6);
  const lowStockItems = inventory.filter((item) => item.units <= item.minUnits);
  const monthRevenue = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(18400000);
  const currentDate = today.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const data = {
    patients,
    todayAppointments,
    nextAppointments,
    lowStockItems,
    currentDate,
  };

  const patientHighlights = (todayAppointments.length > 0 ? todayAppointments : nextAppointments).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-7 px-4 py-5 sm:px-6 lg:px-8">
      <DashboardHeader currentDate={currentDate} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-6 xl:grid-cols-12">
        <DashboardHero data={data} />
        <NextAppointmentCard data={data} />

        <MetricCard
          label="Pacientes de hoy"
          value={todayAppointments.length}
          detail="Atención programada y controles activos."
          icon="patients"
          href="/doctor/pacientes"
          tone="gold"
        />
        <MetricCard
          label="Citas pendientes"
          value={nextAppointments.length}
          detail="Agenda próxima con estado programado."
          icon="calendar"
          href="/doctor/agenda"
          tone="rose"
        />
        <MetricCard
          label="Ingresos del mes"
          value={monthRevenue}
          detail="Resumen financiero estimado de cabina."
          icon="money"
          href="/doctor/torre-control"
          tone="taupe"
        />

        <section className="col-span-12 rounded-[28px] bg-[#fffaf4] p-6 ring-1 ring-[#ded2c6] lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a28778]">
            Pacientes de hoy
          </p>
          <h3 className="mt-2 font-serif text-3xl font-medium text-[#2b2520]">
            En cabina
          </h3>
          <div className="mt-6 space-y-3">
            {patientHighlights.length > 0 ? (
              patientHighlights.map((appointment) => (
                <PatientSummaryCard
                  key={appointment.id}
                  name={appointment.patientName}
                  treatment={appointment.treatment}
                  status={appointment.time}
                  href={`/doctor/pacientes/${appointment.patientId}`}
                />
              ))
            ) : (
              <p className="rounded-[22px] bg-[#f8f1ea] p-4 text-sm text-[#71665d]">
                No hay pacientes agendados para hoy.
              </p>
            )}
          </div>
        </section>

        <section className="col-span-12 overflow-hidden rounded-[28px] bg-[#f3e7d8] p-6 text-[#593c28] ring-1 ring-[#dcc6ad] lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
            Citas pendientes
          </p>
          <div className="mt-7 flex items-end justify-between gap-5">
            <div>
              <p className="font-mono text-6xl font-semibold leading-none">{nextAppointments.length}</p>
              <p className="mt-3 text-sm leading-5 opacity-75">Próximas confirmadas</p>
            </div>
            <div className="flex h-28 items-end gap-2">
              {[38, 64, 46, 88, 58, 74].map((height, index) => (
                <span
                  key={index}
                  className="w-5 rounded-full bg-[#593c28]/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="col-span-12 rounded-[28px] bg-[#e7ece5] p-6 text-[#4f604f] ring-1 ring-[#cdd8c9] lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
            Ingresos del mes
          </p>
          <p className="mt-7 font-mono text-4xl font-semibold leading-none">{monthRevenue}</p>
          <svg className="mt-8 h-24 w-full" viewBox="0 0 320 96" role="img" aria-label="Tendencia de ingresos">
            <path
              d="M8 78 C56 28, 92 54, 132 42 C174 28, 196 15, 232 34 C268 52, 288 24, 312 18"
              fill="none"
              stroke="#4f604f"
              strokeLinecap="round"
              strokeWidth="8"
            />
            <path
              d="M8 78 C56 28, 92 54, 132 42 C174 28, 196 15, 232 34 C268 52, 288 24, 312 18 L312 96 L8 96 Z"
              fill="rgba(79,96,79,0.12)"
            />
          </svg>
        </section>

        <TodaySchedule data={data} />
        <CalendarPanel activeDay={today.getDate()} />
        <RecentActivityPanel />
        <ClinicalAlertsPanel data={data} />
      </div>
    </div>
  );
}
