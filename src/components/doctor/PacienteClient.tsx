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

interface InventoryItem {
  id: string;
  name: string;
  unitName: string;
}

interface TreatmentApplied {
  id: string;
  treatmentName: string;
  productUsedId?: string;
  productNameUsed?: string;
  productQuantityUsed?: number;
  details: string;
  date: string;
}

interface ClinicalRecord {
  patientId: string;
  allergies: string;
  skinType: string;
  notes: string;
  treatmentsApplied: TreatmentApplied[];
}

const treatmentOptions = [
  "Limpieza Facial Hydrash Profunda",
  "Toxina Botulínica",
  "Ácido Hialurónico",
  "Bioestimuladores de Colágeno",
  "Láser Nd YAG Q-Switched",
  "Micropunción Nanopore",
  "Spectrum Mask (Terapia LED)",
  "Revitalización Profunda",
];

export default function PacienteClient({
  patient,
  record: initialRecord,
  inventory,
}: {
  patient: Patient;
  record: ClinicalRecord;
  inventory: InventoryItem[];
}) {
  const [record, setRecord] = useState<ClinicalRecord>(initialRecord);
  const [editInfoMode, setEditInfoMode] = useState(false);
  const [treatmentModalOpen, setTreatmentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit clinical info state
  const [allergies, setAllergies] = useState(record.allergies);
  const [skinType, setSkinType] = useState(record.skinType);
  const [notes, setNotes] = useState(record.notes);

  // New treatment state
  const [treatmentName, setTreatmentName] = useState(treatmentOptions[0]);
  const [productUsedId, setProductUsedId] = useState("");
  const [productQuantityUsed, setProductQuantityUsed] = useState(1);
  const [details, setDetails] = useState("");

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/doctor/patients/${patient.id}/clinical-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "info", allergies, skinType, notes }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecord(data);
        setEditInfoMode(false);
      } else {
        alert(data.error || "Error al actualizar");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/doctor/patients/${patient.id}/clinical-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "treatment",
          treatmentName,
          productUsedId: productUsedId || undefined,
          productQuantityUsed: productUsedId ? productQuantityUsed : undefined,
          details,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecord(data);
        // Reset form
        setTreatmentName(treatmentOptions[0]);
        setProductUsedId("");
        setProductQuantityUsed(1);
        setDetails("");
        setTreatmentModalOpen(false);
      } else {
        alert(data.error || "Error al registrar tratamiento");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button and profile header */}
      <div className="space-y-4">
        <Link
          href="/doctor/crm"
          className="text-[#c5a880] hover:text-[#6d5847] text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-1 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-xs">arrow_back</span>
          <span>Volver a Pacientes</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d2c4bb]/20 pb-6">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-[#c5a880] font-semibold bg-[#c5a880]/10 rounded px-1.5 py-0.5">
              Expediente Clínico
            </span>
            <h1 className="font-serif text-3xl text-[#6d5847] font-normal italic">
              {patient.name}
            </h1>
            <p className="text-xs text-gray-400 font-sans">
              Fecha de Registro: {new Date(patient.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setTreatmentModalOpen(true)}
              className="bg-[#6d5847] hover:bg-[#88705e] text-[#FDFBF7] px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 active:scale-[0.98] shadow-md shadow-[#6d5847]/10"
            >
              <span className="material-symbols-outlined text-sm">vaccines</span>
              <span>Registrar Tratamiento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal and Medical Details */}
        <div className="space-y-8 lg:col-span-1">
          {/* Card: Personal Info */}
          <div className="bg-white border border-[#d2c4bb]/30 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base text-[#6d5847] border-b border-[#d2c4bb]/10 pb-2 font-semibold">
              Datos Personales
            </h3>
            <ul className="space-y-3 text-xs font-sans text-gray-600">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#c5a880]">phone</span>
                <span>{patient.phone}</span>
              </li>
              {patient.email && (
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#c5a880]">mail</span>
                  <span className="truncate" title={patient.email}>{patient.email}</span>
                </li>
              )}
              {patient.birthday && (
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#c5a880]">cake</span>
                  <span>{patient.birthday}</span>
                </li>
              )}
              {patient.notes && (
                <li className="border-t border-[#d2c4bb]/10 pt-3 mt-3">
                  <span className="font-semibold block text-[#6d5847] mb-1">Notas de Registro:</span>
                  <p className="text-gray-500 italic">{patient.notes}</p>
                </li>
              )}
            </ul>
          </div>

          {/* Card: Clinical Information */}
          <div className="bg-white border border-[#d2c4bb]/30 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#d2c4bb]/10 pb-2">
              <h3 className="font-serif text-base text-[#6d5847] font-semibold">Ficha Médica</h3>
              {!editInfoMode && (
                <button
                  onClick={() => setEditInfoMode(true)}
                  className="text-xs text-[#c5a880] hover:text-[#6d5847] font-semibold flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  <span>Editar</span>
                </button>
              )}
            </div>

            {editInfoMode ? (
              <form onSubmit={handleUpdateInfo} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1">
                    Alergias / Contraindicaciones
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Ej. Ácido Hialurónico, Látex, Ninguna"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1">
                    Tipo de Piel
                  </label>
                  <input
                    type="text"
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    placeholder="Ej. Seca, Grasa, Rosácea"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1">
                    Antecedentes y Diagnóstico
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Historial estético previo, objetivos del paciente..."
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditInfoMode(false)}
                    className="flex-1 border border-[#d2c4bb]/40 py-2 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#6d5847] hover:bg-[#88705e] text-[#FDFBF7] py-2 rounded-xl transition-all font-semibold"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs font-sans text-gray-600">
                <div>
                  <span className="font-semibold text-[#6d5847] block mb-0.5">Alergias:</span>
                  <p className={record.allergies ? "text-[#1b1c1c]" : "text-gray-400 italic"}>
                    {record.allergies || "No registradas"}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-[#6d5847] block mb-0.5">Tipo de Piel:</span>
                  <p className={record.skinType ? "text-[#1b1c1c]" : "text-gray-400 italic"}>
                    {record.skinType || "No registrado"}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-[#6d5847] block mb-0.5">Diagnóstico y Notas:</span>
                  <p className={record.notes ? "text-gray-700 whitespace-pre-line leading-relaxed" : "text-gray-400 italic"}>
                    {record.notes || "Sin antecedentes registrados"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Treatments Applied history */}
        <div className="lg:col-span-2 bg-white border border-[#d2c4bb]/30 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-xl text-[#6d5847] border-b border-[#d2c4bb]/10 pb-4 font-normal flex items-center gap-2">
            <span className="material-symbols-outlined">history</span>
            <span>Historial de Tratamientos Aplicados</span>
          </h3>

          {record.treatmentsApplied.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl block mb-2">vaccines</span>
              <p className="text-xs font-sans">No se han registrado tratamientos médicos aplicados aún.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {record.treatmentsApplied
                .slice()
                .reverse()
                .map((treatment) => (
                  <div
                    key={treatment.id}
                    className="border border-[#d2c4bb]/20 hover:border-[#6d5847]/40 rounded-2xl p-5 hover:bg-[#FDFBF7]/30 transition-all duration-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#d2c4bb]/10 pb-2">
                      <h4 className="font-serif text-base text-[#6d5847] font-semibold">
                        {treatment.treatmentName}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-sans font-semibold">
                        {treatment.date}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-sans whitespace-pre-line">
                      {treatment.details}
                    </p>

                    {treatment.productNameUsed && (
                      <div className="pt-2 flex items-center gap-1.5 text-[10px] font-sans">
                        <span className="px-2 py-0.5 rounded bg-[#c5a880]/10 text-[#c5a880] font-semibold uppercase tracking-wider">
                          Insumo Descontado
                        </span>
                        <span className="text-gray-500">
                          {treatment.productNameUsed} ({treatment.productQuantityUsed} unidad/es)
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Treatment Modal */}
      {treatmentModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-[#1b1c1c]/40 backdrop-blur-xs" onClick={() => setTreatmentModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-[#d2c4bb]/30">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-4">
                <h3 className="font-serif text-xl text-[#6d5847]">Registrar Tratamiento</h3>
                <button onClick={() => setTreatmentModalOpen(false)} className="text-[#6d5847] hover:text-[#c5a880]">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <form onSubmit={handleAddTreatment} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Tratamiento Realizado *
                  </label>
                  <select
                    required
                    value={treatmentName}
                    onChange={(e) => setTreatmentName(e.target.value)}
                    className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
                  >
                    {treatmentOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-[#d2c4bb]/10 pt-4 mt-2">
                  <span className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-2">
                    Uso de Insumos (Descuento Automático de Inventario)
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                        Producto Usado
                      </label>
                      <select
                        value={productUsedId}
                        onChange={(e) => setProductUsedId(e.target.value)}
                        className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-[11px] text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
                      >
                        <option value="">Ninguno / No descuenta stock</option>
                        {inventory.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="1"
                        disabled={!productUsedId}
                        value={productQuantityUsed}
                        onChange={(e) => setProductQuantityUsed(Number(e.target.value))}
                        className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847] disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Detalles y Observaciones Clínicas *
                  </label>
                  <textarea
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={6}
                    placeholder="Escriba la dosificación, zona de aplicación, evolución, y cualquier detalle médico importante..."
                    className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847] resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#6d5847] hover:bg-[#88705e] text-[#FDFBF7] py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Registrar Tratamiento"}
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
