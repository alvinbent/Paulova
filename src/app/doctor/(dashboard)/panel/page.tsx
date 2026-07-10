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
import IconoDoctor from "@/components/doctor/IconoDoctor";

export const revalidate = 0;

export default async function DoctorDashboard() {
  const patients = await db.getPatients();
  const appointments = await db.getAppointments();
  const inventory = await db.getInventory();
  const lots = await db.getLots();
  const clinicalRecords = await db.getClinicalRecords();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayAppointments = appointments.filter((appointment) => appointment.date === todayStr);
  const nextAppointments = appointments
    .filter((appointment) => appointment.date >= todayStr && appointment.status === "Programada")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 6);
  const lowExistenciaItems = inventory.filter((item) => item.units <= item.minUnits);

  // Expiring lots alerts (Vencen en <= 90 días o bloqueados)
  const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  const expiringLots = lots.filter((lot) => {
    if (lot.status === "bloqueo") return true;
    if (lot.currentQty === 0 || lot.status === "agotado") return false;
    const expiry = new Date(lot.expiryDate);
    return expiry <= ninetyDaysFromNow;
  });

  // Calculate profitability and margins
  const allTreatments = clinicalRecords.flatMap((r) => r.treatmentsApplied || []);
  const treatmentsWithMargin = allTreatments.map((t) => {
    let cost = 0;
    if (t.lotUsedId && t.productQuantityUsed) {
      const lot = lots.find((l) => l.id === t.lotUsedId);
      if (lot) {
        cost = lot.costUnitCop * t.productQuantityUsed;
      }
    }
    const price = t.priceChargedCop || 0;
    const profit = price - cost;
    const marginPercent = price > 0 ? (profit / price) * 100 : 0;
    return { ...t, cost, profit, marginPercent };
  }).filter((t) => t.priceChargedCop !== undefined && t.priceChargedCop > 0);

  const totalRevenue = treatmentsWithMargin.reduce((sum, t) => sum + (t.priceChargedCop || 0), 0);
  const totalCost = treatmentsWithMargin.reduce((sum, t) => sum + t.cost, 0);

  const monthRevenue = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(totalRevenue || 18400000);

  const currentDate = today.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const data = {
    patients,
    todayAppointments,
    nextAppointments,
    lowStockItems: lowExistenciaItems,
    lowExistenciaItems,
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
          detail={`Utilidad real: $${(totalRevenue - totalCost).toLocaleString()} COP`}
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

        <TodaySchedule data={data} />
        <CalendarPanel activeDay={today.getDate()} />
        <RecentActivityPanel />
        <ClinicalAlertsPanel data={data} />

        {/* Trazabilidad INVIMA y Alertas de Lote */}
        <section className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-[28px] bg-[#fffaf4] p-6 ring-1 ring-[#ded2c6]">
            <div className="mb-5 border-b border-[#b99862]/18 pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600 font-bold">Trazabilidad INVIMA</p>
              <h3 className="mt-1 font-serif text-2xl font-medium text-[#2b2520]">Lotes y Vencimientos</h3>
            </div>

            {expiringLots.length === 0 ? (
              <div className="rounded-[22px] bg-emerald-50/50 p-5 text-center border border-emerald-100">
                <IconoDoctor name="check_circle" className="h-4 w-4" />
                <p className="text-xs font-semibold text-emerald-700">
                  Todos los lotes se encuentran activos y vigentes.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {expiringLots.slice(0, 5).map((lot) => {
                  const prod = inventory.find((p) => p.id === lot.productId);
                  const isBlocked = lot.status === "bloqueo";
                  
                  const expiry = new Date(lot.expiryDate);
                  const daysDiff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
                  
                  let label = `Vence en ${daysDiff} días`;
                  let badgeCss = "bg-amber-50 text-amber-700 border border-amber-200";
                  
                  if (isBlocked) {
                    label = "Bloqueado";
                    badgeCss = "bg-red-100 text-red-800 border border-red-200";
                  } else if (daysDiff <= 0) {
                    label = "Vencido";
                    badgeCss = "bg-red-50 text-red-700 border border-red-200 animate-pulse";
                  } else if (daysDiff <= 30) {
                    label = `Urgente: ${daysDiff}d`;
                    badgeCss = "bg-red-50 text-red-600 border border-red-100 font-bold";
                  }

                  return (
                    <li
                      key={lot.id}
                      className="flex items-center justify-between gap-3 rounded-[22px] bg-white p-4 ring-1 ring-[#b99862]/16"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#1d1c19]">
                          {prod ? prod.name : lot.productId}
                        </p>
                        <p className="mt-1 font-mono text-[9px] text-[#9b8a76]">
                          Lote: {lot.lotNumber} | Existencia: {lot.currentQty}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold ${badgeCss}`}>
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-[28px] bg-[#fffaf4] p-6 ring-1 ring-[#ded2c6]">
            <div className="mb-5 border-b border-[#b99862]/18 pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a28778]">Existencia crítica</p>
              <h3 className="mt-1 font-serif text-2xl font-medium text-[#2b2520]">Insumos por reponer</h3>
            </div>

            {lowExistenciaItems.length === 0 ? (
              <div className="rounded-[22px] bg-emerald-50/50 p-5 text-center border border-emerald-100">
                <IconoDoctor name="check_circle" className="h-4 w-4" />
                <p className="text-xs font-semibold text-emerald-700">
                  Todos los insumos están sobre el nivel crítico.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {lowExistenciaItems.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-[22px] bg-white p-4 ring-1 ring-[#b99862]/16"
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
        </section>

        {/* Análisis financiero y margen bruto */}
        <section className="col-span-12 rounded-[28px] bg-[#fffaf4] p-6 ring-1 ring-[#ded2c6]">
          <div className="mb-5 border-b border-[#b99862]/18 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a28778]">Análisis financiero</p>
            <h3 className="mt-1 font-serif text-2xl font-medium text-[#2b2520]">Rentabilidad por procedimiento aplicado</h3>
          </div>

          {treatmentsWithMargin.length === 0 ? (
            <div className="rounded-[22px] bg-[#f8f1ea] px-6 py-10 text-center">
              <IconoDoctor name="payments" className="h-4 w-4" />
              <p className="text-xs text-gray-500 font-medium">No hay registros financieros de tratamientos con cobro aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-semibold uppercase tracking-wider text-[#9b8a76] border-b border-[#b99862]/16 pb-2">
                    <th className="py-2">Procedimiento</th>
                    <th className="py-2">Fecha</th>
                    <th className="py-2 text-right">Precio cobrado</th>
                    <th className="py-2 text-right">Costo de insumos</th>
                    <th className="py-2 text-right">Utilidad bruta</th>
                    <th className="py-2 text-right">Margen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#b99862]/12">
                  {treatmentsWithMargin.slice(0, 8).map((t) => (
                    <tr key={t.id} className="hover:bg-[#b99862]/6 transition-all">
                      <td className="py-3 font-semibold text-[#1d1c19]">{t.treatmentName}</td>
                      <td className="py-3 font-mono text-gray-500">{t.date}</td>
                      <td className="py-3 text-right font-mono font-bold text-gray-700">${(t.priceChargedCop || 0).toLocaleString()} COP</td>
                      <td className="py-3 text-right font-mono text-red-600">${t.cost.toLocaleString()} COP</td>
                      <td className="py-3 text-right font-mono text-emerald-700 font-bold">${t.profit.toLocaleString()} COP</td>
                      <td className="py-3 text-right font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.marginPercent > 70
                            ? "bg-emerald-50 text-emerald-700"
                            : t.marginPercent > 40
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}>
                          {t.marginPercent.toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
