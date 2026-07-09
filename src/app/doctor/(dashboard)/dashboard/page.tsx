import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";

export const revalidate = 0; // Disable caching to ensure real-time database updates

export default async function DoctorDashboard() {
  const patients = await db.getPatients();
  const appointments = await db.getAppointments();
  const inventory = await db.getInventory();

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  const lowStockItems = inventory.filter((item) => item.units <= item.minUnits);

  // Mock a WhatsApp medical triage alert for visual demonstration
  const mockWhatsAppAlerts = [
    {
      id: "w1",
      patientName: "Sofía Rodríguez",
      message: "Presenta leve inflamación y enrojecimiento tras el tratamiento de ayer. Consulta si es normal.",
      time: "Hace 15 min",
      severity: "alta",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d2c4bb]/20 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#6d5847] font-normal">
            Bienvenida, <span className="italic">Dra. Carolina Aguirre</span>
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Resumen operativo y clínico de Paunova Skin & Age Clinic.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/doctor/crm"
            className="bg-[#6d5847] hover:bg-[#88705e] text-[#FDFBF7] px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>Nuevo Paciente</span>
          </Link>
          <Link
            href="/doctor/agenda"
            className="border border-[#6d5847] text-[#6d5847] hover:bg-[#6d5847]/5 px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span>Nueva Cita</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total Patients */}
        <Link
          href="/doctor/crm"
          className="bg-white border border-[#d2c4bb]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold font-sans">
              Pacientes Totales
            </p>
            <p className="text-3xl font-serif text-[#6d5847] font-semibold">
              {patients.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#c5a880]/10 flex items-center justify-center text-[#c5a880] group-hover:bg-[#6d5847]/10 group-hover:text-[#6d5847] transition-all">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
        </Link>

        {/* Metric 2: Today's Appointments */}
        <Link
          href="/doctor/agenda"
          className="bg-white border border-[#d2c4bb]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold font-sans">
              Citas para Hoy
            </p>
            <p className="text-3xl font-serif text-[#6d5847] font-semibold">
              {todayAppointments.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#c5a880]/10 flex items-center justify-center text-[#c5a880] group-hover:bg-[#6d5847]/10 group-hover:text-[#6d5847] transition-all">
            <span className="material-symbols-outlined text-2xl">calendar_today</span>
          </div>
        </Link>

        {/* Metric 3: Low Stock Warnings */}
        <Link
          href="/doctor/inventario"
          className="bg-white border border-[#d2c4bb]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold font-sans">
              Alertas Inventario
            </p>
            <p className={`text-3xl font-serif font-semibold ${lowStockItems.length > 0 ? "text-[#c5a880]" : "text-[#6d5847]"}`}>
              {lowStockItems.length}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-[#6d5847]/10 group-hover:text-[#6d5847] transition-all ${
            lowStockItems.length > 0 ? "bg-amber-50 text-[#c5a880]" : "bg-[#c5a880]/10 text-[#c5a880]"
          }`}>
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
        </Link>

        {/* Metric 4: WhatsApp Alerts */}
        <div className="bg-white border border-[#d2c4bb]/30 rounded-2xl p-6 shadow-sm flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold font-sans">
              Alertas WhatsApp
            </p>
            <p className="text-3xl font-serif text-[#c5a880] font-semibold">
              {mockWhatsAppAlerts.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <span className="material-symbols-outlined text-2xl animate-bounce">chat</span>
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Appointments */}
        <div className="lg:col-span-2 bg-white border border-[#d2c4bb]/30 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#d2c4bb]/20 pb-4">
            <h2 className="font-serif text-xl text-[#6d5847] font-normal flex items-center gap-2">
              <span className="material-symbols-outlined">schedule</span>
              <span>Próximas Citas de Hoy</span>
            </h2>
            <Link
              href="/doctor/agenda"
              className="text-[#c5a880] hover:text-[#6d5847] text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Ver Agenda Completa
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl block mb-2">event_busy</span>
              <p className="text-xs font-sans">No hay citas programadas para el día de hoy.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#d2c4bb]/10 text-gray-400 text-[10px] uppercase tracking-wider font-semibold font-sans">
                    <th className="pb-3 font-semibold">Hora</th>
                    <th className="pb-3 font-semibold">Paciente</th>
                    <th className="pb-3 font-semibold">Tratamiento</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d2c4bb]/10 text-xs font-sans">
                  {todayAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                      <td className="py-4 font-semibold text-[#6d5847]">{appt.time}</td>
                      <td className="py-4 font-semibold text-[#1b1c1c]">
                        <Link href={`/doctor/pacientes/${appt.patientId}`} className="hover:underline text-[#6d5847]">
                          {appt.patientName}
                        </Link>
                      </td>
                      <td className="py-4 text-[#88705e]">{appt.treatment}</td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/doctor/pacientes/${appt.patientId}`}
                          className="text-[#c5a880] hover:text-[#6d5847] font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <span>Expediente</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Active Alerts */}
        <div className="space-y-8">
          {/* WhatsApp Alerts Panel */}
          <div className="bg-white border border-[#d2c4bb]/30 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-lg text-[#6d5847] font-normal flex items-center gap-2 border-b border-[#d2c4bb]/20 pb-4">
              <span className="material-symbols-outlined text-red-500">chat_error</span>
              <span>Alertas de Pacientes</span>
            </h2>

            {mockWhatsAppAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-red-50/50 border border-red-200/40 rounded-2xl p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-xs text-[#1b1c1c]">{alert.patientName}</h4>
                  <span className="text-[9px] text-red-500 font-semibold uppercase tracking-wider">{alert.time}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">{alert.message}</p>
                <div className="pt-2 flex gap-2">
                  <a
                    href="https://wa.me/573506561869"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-[10px] uppercase tracking-widest font-semibold text-center transition-all flex items-center justify-center gap-1 shadow-md shadow-red-500/10"
                  >
                    <span className="material-symbols-outlined text-xs">chat</span>
                    <span>Responder</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Low Stock Panel */}
          <div className="bg-white border border-[#d2c4bb]/30 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-lg text-[#6d5847] font-normal flex items-center gap-2 border-b border-[#d2c4bb]/20 pb-4">
              <span className="material-symbols-outlined text-[#c5a880]">warning</span>
              <span>Stock Crítico</span>
            </h2>

            {lowStockItems.length === 0 ? (
              <div className="py-6 text-center text-gray-400 text-xs font-sans">
                <span className="material-symbols-outlined text-2xl block mb-1 text-emerald-500">check_circle</span>
                <p>Todos los insumos están sobre el nivel crítico.</p>
              </div>
            ) : (
              <ul className="space-y-4 font-sans text-xs">
                {lowStockItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-[#FDFBF7]">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#1b1c1c]">{item.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-amber-50 text-[#c5a880] border border-amber-100">
                        {item.units} / {item.minUnits} {item.unitName}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
