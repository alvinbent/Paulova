"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Patient {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  treatment: string;
  status: "Programada" | "Completada" | "Cancelada";
  notes: string;
}

const treatmentOptions = [
  "Valoración Inicial",
  "Limpieza Facial Hydrash Profunda",
  "Toxina Botulínica",
  "Ácido Hialurónico",
  "Bioestimuladores de Colágeno",
  "Láser Nd YAG Q-Switched",
  "Micropunción Nanopore",
  "Spectrum Mask (Terapia LED)",
  "Revitalización Profunda",
];

export default function AgendaCliente({
  initialAppointments,
  patients,
}: {
  initialAppointments: Appointment[];
  patients: Patient[];
}) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<"Todas" | "Hoy" | "Próximas" | "Completadas" | "Canceladas">("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState(treatmentOptions[0]);
  const [notes, setNotes] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleStatusChange = async (id: string, newStatus: Appointment["status"]) => {
    setStatusError("");
    try {
      const res = await fetch(`/api/doctor/citas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments(
          appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch {
      setStatusError("No fue posible actualizar el estado de la cita.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/doctor/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: selectedPatientId, date, time, treatment, notes }),
      });

      const data = await res.json();
      if (res.ok) {
        setAppointments([...appointments, data].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)));
        // Reset form
        setSelectedPatientId("");
        setDate("");
        setTime("");
        setTreatment(treatmentOptions[0]);
        setNotes("");
        setModalOpen(false);
      } else {
        setError(data.error || "Error al programar la cita");
      }
    } catch {
      setError("Error en la conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === "Todas") return true;
    if (filter === "Hoy") return appt.date === todayStr;
    if (filter === "Próximas") return appt.date >= todayStr && appt.status === "Programada";
    if (filter === "Completadas") return appt.status === "Completada";
    if (filter === "Canceladas") return appt.status === "Cancelada";
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="paunova-card rounded-[2rem] p-6 md:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <p className="paunova-kicker mb-2">Planificación clínica</p>
          <h1 className="paunova-title text-3xl md:text-4xl">
            Agenda y <span className="italic">Citas Programadas</span>
          </h1>
          <p className="text-sm text-[#746b61] mt-3 max-w-2xl leading-6">
            Programación de citas de valoración, tratamientos estéticos y controles.
          </p>
        </div>
        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="paunova-button-primary w-full px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">edit_calendar</span>
            <span>Programar Cita</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      {statusError && (
        <div className="rounded-2xl border border-[#9b3f36]/18 bg-[#fff7f4] px-4 py-3 text-xs font-medium text-[#9b3f36]">
          {statusError}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        {(["Todas", "Hoy", "Próximas", "Completadas", "Canceladas"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl transition-all font-semibold ${
              filter === tab
                ? "paunova-button-primary"
                : "paunova-button-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="paunova-card rounded-[2rem] p-12 text-center">
          <span className="material-symbols-outlined text-4xl block mb-3 text-[#b99862]">event_busy</span>
          <p className="text-sm font-medium text-[#5f4f42]">No hay citas en este rango de selección.</p>
          <p className="mt-1 text-xs text-[#746b61]">Cambia el filtro o programa una nueva cita.</p>
        </div>
      ) : (
        <div className="paunova-table-wrap rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d2c4bb]/10 text-gray-400 text-[10px] uppercase tracking-wider font-semibold font-sans bg-[#FDFBF7] px-6">
                  <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                  <th className="px-6 py-4 font-semibold">Paciente</th>
                  <th className="px-6 py-4 font-semibold">Tratamiento</th>
                  <th className="px-6 py-4 font-semibold">Notas</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2c4bb]/10 text-xs font-sans">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#6d5847]">{appt.date}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{appt.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/doctor/pacientes/${appt.patientId}`} className="font-semibold text-[#1b1c1c] hover:underline">
                        {appt.patientName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-[#88705e]">{appt.treatment}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate" title={appt.notes}>
                      {appt.notes || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                        appt.status === "Programada"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : appt.status === "Completada"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {appt.status === "Programada" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(appt.id, "Completada")}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg transition-all"
                            title="Completar cita"
                          >
                            <span className="material-symbols-outlined text-sm block">check</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(appt.id, "Cancelada")}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-all"
                            title="Cancelar cita"
                          >
                            <span className="material-symbols-outlined text-sm block">close</span>
                          </button>
                        </div>
                      )}
                      {appt.status !== "Programada" && (
                        <span className="text-gray-400 text-[10px]">Cerrada</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Appointment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-[#1d1c19]/42 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#fffdf8] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-[#b99862]/22">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-4">
                <h3 className="paunova-title text-2xl">Programar nueva cita</h3>
                <button onClick={() => setModalOpen(false)} className="text-[#6d5847] hover:text-[#c5a880]">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200/50 rounded-xl px-4 py-3 text-xs text-red-600 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Paciente *
                  </label>
                  <select
                    required
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="paunova-input px-4 py-2.5 text-xs"
                  >
                    <option value="">Seleccione un paciente...</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="paunova-input px-4 py-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Hora *
                    </label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="paunova-input px-4 py-2.5 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Tratamiento / Consulta *
                  </label>
                  <select
                    required
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="paunova-input px-4 py-2.5 text-xs"
                  >
                    {treatmentOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Notas adicionales
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Instrucciones previas, tipo de sesión, etc."
                    className="paunova-input px-4 py-2.5 text-xs resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="paunova-button-primary w-full py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Programando..." : "Programar Cita"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
