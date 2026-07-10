"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  notes: string;
  createdAt: string;
}

export default function CrmCliente({ initialPatients }: { initialPatients: Patient[] }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [notes, setNotes] = useState("");

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/doctor/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, birthday, notes }),
      });

      const data = await res.json();
      if (res.ok) {
        setPatients([data, ...patients]);
        // Reset form
        setName("");
        setPhone("");
        setEmail("");
        setBirthday("");
        setNotes("");
        setModalOpen(false);
      } else {
        setError(data.error || "Error al registrar el paciente");
      }
    } catch {
      setError("Error en la conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="paunova-card rounded-[2rem] p-6 md:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <p className="paunova-kicker mb-2">Relación paciente</p>
          <h1 className="paunova-title text-3xl md:text-4xl">
            Expedientes de <span className="italic">Pacientes</span>
          </h1>
          <p className="text-sm text-[#746b61] mt-3 max-w-2xl leading-6">
            Gestión y seguimiento de fichas clínicas, consentimientos e historial estético.
          </p>
        </div>
        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="paunova-button-primary w-full px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>Registrar Paciente</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-lg w-full relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#c5a880] pointer-events-none">
          <span className="material-symbols-outlined text-lg">search</span>
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="paunova-input pl-11 pr-4 py-3.5 text-sm placeholder:text-[#9b8a76]"
        />
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="paunova-card rounded-[2rem] p-12 text-center">
          <span className="material-symbols-outlined text-4xl block mb-3 text-[#b99862]">person_search</span>
          <p className="text-sm font-medium text-[#5f4f42]">No se encontraron pacientes que coincidan con la búsqueda.</p>
          <p className="mt-1 text-xs text-[#746b61]">Ajusta el texto o registra un nuevo paciente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="paunova-card rounded-[1.75rem] p-6 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="paunova-title text-xl">{patient.name}</h3>
                  <span className="text-[9px] uppercase tracking-wider text-[#c5a880] font-semibold bg-[#c5a880]/10 rounded px-1.5 py-0.5 mt-1 inline-block">
                    Paciente activo
                  </span>
                </div>
                <div className="space-y-2 text-xs font-sans text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#c5a880]">phone</span>
                    <span>{patient.phone}</span>
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#c5a880]">mail</span>
                      <span className="truncate">{patient.email}</span>
                    </div>
                  )}
                  {patient.birthday && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#c5a880]">cake</span>
                      <span>{patient.birthday}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-[#d2c4bb]/10 pt-4 mt-6 flex justify-between items-center">
                <Link
                  href={`/doctor/pacientes/${patient.id}`}
                  className="paunova-button-primary w-full text-center py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-xs">clinical_notes</span>
                  <span>Ver expediente</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Slide-over / Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-[#1d1c19]/42 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#fffdf8] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-[#b99862]/22">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-4">
                <h3 className="paunova-title text-2xl">Registrar nuevo paciente</h3>
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
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. María Camila Restrepo"
                    className="paunova-input px-4 py-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +57 300 123 4567"
                    className="paunova-input px-4 py-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. maria@ejemplo.com"
                    className="paunova-input px-4 py-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="paunova-input px-4 py-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Notas iniciales
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Antecedentes médicos, tipo de piel, alergias o motivos de consulta."
                    className="paunova-input px-4 py-2.5 text-xs resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="paunova-button-primary w-full py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Registrando..." : "Guardar paciente"}
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
