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

export default function AgendaClient({
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

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState(treatmentOptions[0]);
  const [notes, setNotes] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleStatusChange = async (id: string, newStatus: Appointment["status"]) => {
    try {
      const res = await fetch(`/api/doctor/appointments/${id}`, {
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
      alert("Error al actualizar estado");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/doctor/appointments", {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d2c4bb]/20 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#6d5847] font-normal">
            Agenda y <span className="italic">Citas Programadas</span>
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Programación de citas de valoración, tratamientos estéticos y controles.
          </p>
        </div>
        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-[#6d5847] hover:bg-[#88705e] text-[#FDFBF7] px-5 py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-[#6d5847]/10"
          >
            <span className="material-symbols-outlined text-sm">edit_calendar</span>
            <span>Programar Cita</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-[#d2c4bb]/10 pb-4 text-xs font-sans">
        {(["Todas", "Hoy", "Próximas", "Completadas", "Canceladas"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl transition-all font-semibold ${
              filter === tab
                ? "bg-[#6d5847] text-[#FDFBF7] shadow-sm shadow-[#6d5847]/10"
                : "bg-white text-[#6d5847] border border-[#d2c4bb]/20 hover:bg-[#6d5847]/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white border border-[#d2c4bb]/30 rounded-3xl p-12 text-center text-gray-400">
          <span className="material-symbols-outlined text-4xl block mb-2">event_busy</span>
          <p className="text-xs font-sans">No hay citas en este rango de selección.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#d2c4bb]/30 rounded-3xl overflow-hidden shadow-sm">
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
          <div className="fixed inset-0 bg-[#1b1c1c]/40 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-[#d2c4bb]/30">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-4">
                <h3 className="font-serif text-xl text-[#6d5847]">Programar Nueva Cita</h3>
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
                    className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
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
                      className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
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
                      className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
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
                    className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
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
                    className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847] resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#6d5847] hover:bg-[#88705e] text-[#FDFBF7] py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
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
