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
  category: string;
  units: number;
  minUnits: number;
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

interface SpeechRecognitionResultEventLike {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
    };
  }>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

type WindowWithSpeechRecognition = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    _recognitionInstance?: SpeechRecognitionLike | null;
  };

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
  const [tab, setTab] = useState<"treatments" | "supplies">("treatments");
  const [notice, setNotice] = useState("");

  // Voice dictation states
  const [dictationMode, setDictationMode] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

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
    setNotice("");
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
        setNotice(data.error || "Error al actualizar");
      }
    } catch {
      setNotice("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");
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
        setDictationMode(false);
        setTranscriptionText("");
      } else {
        setNotice(data.error || "Error al registrar tratamiento");
      }
    } catch {
      setNotice("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Start voice recording handler
  const startRecording = () => {
    const speechWindow = window as WindowWithSpeechRecognition;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setNotice("El dictado por voz no está soportado en este navegador. Usa Chrome, Edge o Safari.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = "es-ES";
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscriptionText(finalTranscript || interimTranscript);
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setRecording(false);
      };

      rec.onend = () => {
        setRecording(false);
      };

      rec.start();
      speechWindow._recognitionInstance = rec;
      setRecording(true);
      setTranscriptionText("");
    } catch (err) {
      console.error(err);
      setNotice("No se pudo iniciar el dictado.");
    }
  };

  // Stop voice recording handler
  const stopRecording = () => {
    const speechWindow = window as WindowWithSpeechRecognition;
    if (speechWindow._recognitionInstance) {
      try {
        speechWindow._recognitionInstance.stop();
      } catch {}
      speechWindow._recognitionInstance = null;
    }
    setRecording(false);
  };

  // AI completions processing handler
  const processDictation = async () => {
    if (!transcriptionText.trim()) {
      setNotice("Realiza un dictado de voz antes de procesar.");
      return;
    }
    setNotice("");
    setAiLoading(true);

    try {
      const res = await fetch(`/api/doctor/patients/${patient.id}/process-dictation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcriptionText }),
      });
      const data = await res.json();
      if (res.ok) {
        setTreatmentName(data.treatmentName || treatmentOptions[0]);
        setProductUsedId(data.productUsedId || "");
        setProductQuantityUsed(data.productQuantityUsed || 1);
        setDetails(data.clinicalReport || "");
        setDictationMode(false); // Switch to review in form editor
      } else {
        setNotice(data.error || "Error al procesar con IA");
      }
    } catch {
      setNotice("Error de conexión al procesar dictado");
    } finally {
      setAiLoading(false);
    }
  };

  // Aggregate consumed supplies map for this patient
  const consumedSuppliesMap = new Map<string, { name: string; quantity: number; unitName: string }>();
  record.treatmentsApplied.forEach((treatment) => {
    if (treatment.productUsedId && treatment.productNameUsed && treatment.productQuantityUsed) {
      const existing = consumedSuppliesMap.get(treatment.productUsedId);
      const matchingProduct = inventory.find((i) => i.id === treatment.productUsedId);
      const unit = matchingProduct ? matchingProduct.unitName : "unidades";
      if (existing) {
        existing.quantity += treatment.productQuantityUsed;
      } else {
        consumedSuppliesMap.set(treatment.productUsedId, {
          name: treatment.productNameUsed,
          quantity: treatment.productQuantityUsed,
          unitName: unit,
        });
      }
    }
  });
  const consumedSupplies = Array.from(consumedSuppliesMap.entries()).map(([id, info]) => ({
    id,
    name: info.name,
    quantity: info.quantity,
    unitName: info.unitName,
  }));

  return (
    <div className="space-y-8">
      {/* Back button and profile header */}
      <div className="space-y-4">
        <Link
          href="/doctor/pacientes"
          className="text-[#c5a880] hover:text-[#6d5847] text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-1 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-xs">arrow_back</span>
          <span>Volver a Pacientes</span>
        </Link>

        <div className="paunova-card rounded-[2rem] p-6 md:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-1">
            <span className="paunova-kicker">
              Expediente clínico
            </span>
            <h1 className="paunova-title text-3xl md:text-4xl italic">
              {patient.name}
            </h1>
            <p className="text-xs text-[#746b61]">
              Fecha de registro: {new Date(patient.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/doctor/pacientes/${patient.id}/consultas/nueva`}
              className="paunova-button-secondary px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">mic</span>
              <span>Nueva consulta</span>
            </Link>
            <button
              onClick={() => setTreatmentModalOpen(true)}
              className="paunova-button-primary px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">vaccines</span>
              <span>Registrar Tratamiento</span>
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl border border-[#9b3f36]/18 bg-[#fff7f4] px-4 py-3 text-xs font-medium text-[#9b3f36]">
          {notice}
        </div>
      )}

      <div className="paunova-card rounded-[1.75rem] p-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
          {[
            ["Consultas", "history", `/doctor/pacientes/${patient.id}/consultas`],
            ["Tratamientos", "spa", `/doctor/pacientes/${patient.id}/tratamientos`],
            ["Productos", "science", `/doctor/pacientes/${patient.id}/productos`],
            ["Insumos", "vaccines", `/doctor/pacientes/${patient.id}/insumos`],
            ["Fotos", "photo_camera", `/doctor/pacientes/${patient.id}/fotografias`],
            ["Consent.", "fact_check", `/doctor/pacientes/${patient.id}/consentimientos`],
            ["Nueva", "add_circle", `/doctor/pacientes/${patient.id}/consultas/nueva`],
          ].map(([label, icon, href]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-center gap-2 rounded-[1rem] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5f4f42] transition-all hover:bg-[#b99862]/10"
            >
              <span className="material-symbols-outlined text-sm">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal and Medical Details */}
        <div className="space-y-8 lg:col-span-1">
          {/* Card: Personal Info */}
          <div className="paunova-card rounded-[1.75rem] p-6 space-y-4">
            <h3 className="paunova-title text-lg border-b border-[#d2c4bb]/10 pb-2">
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
          <div className="paunova-card rounded-[1.75rem] p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#d2c4bb]/10 pb-2">
              <h3 className="paunova-title text-lg">Ficha médica</h3>
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

        {/* Right Column: Treatments Applied history and Supplies Consumed */}
        <div className="paunova-card lg:col-span-2 rounded-[2rem] p-6 md:p-8 space-y-6">
          {/* Tab Selection */}
          <div className="flex gap-4 border-b border-[#d2c4bb]/20 pb-3">
            <button
              onClick={() => setTab("treatments")}
              className={`pb-2 text-xs font-semibold uppercase tracking-wider font-sans border-b-2 transition-all ${
                tab === "treatments"
                  ? "border-[#6d5847] text-[#6d5847]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Historial Clínico
            </button>
            <button
              onClick={() => setTab("supplies")}
              className={`pb-2 text-xs font-semibold uppercase tracking-wider font-sans border-b-2 transition-all flex items-center gap-1.5 ${
                tab === "supplies"
                  ? "border-[#6d5847] text-[#6d5847]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="material-symbols-outlined text-xs">vaccines</span>
              <span>Insumos Consumidos</span>
            </button>
          </div>

          {tab === "treatments" ? (
            record.treatmentsApplied.length === 0 ? (
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
                            {treatment.productNameUsed} ({treatment.productQuantityUsed} {inventory.find(i => i.id === treatment.productUsedId)?.unitName || "unidades"})
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )
          ) : consumedSupplies.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl block mb-2">inventory</span>
              <p className="text-xs font-sans">Este paciente aún no registra consumo de insumos médicos.</p>
            </div>
          ) : (
            <div className="border border-[#d2c4bb]/30 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#d2c4bb]/10 text-gray-400 text-[10px] uppercase tracking-wider font-semibold font-sans bg-[#FDFBF7] px-4">
                    <th className="px-4 py-3 font-semibold">Insumo Consumido</th>
                    <th className="px-4 py-3 font-semibold">Cantidad Total</th>
                    <th className="px-4 py-3 font-semibold">Estado en Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d2c4bb]/10 text-xs font-sans">
                  {consumedSupplies.map((supply) => {
                    const currentStock = inventory.find((i) => i.id === supply.id);
                    const unitsLeft = currentStock ? currentStock.unitName : "";
                    const countLeft = currentStock ? currentStock.units : 0;
                    const isLow = currentStock ? currentStock.units <= currentStock.minUnits : false;

                    return (
                      <tr key={supply.id} className="hover:bg-[#FDFBF7]/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-[#1b1c1c]">
                          {supply.name}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#6d5847]">
                          {supply.quantity} {supply.unitName}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                            isLow
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            <span>{countLeft} {unitsLeft} en stock</span>
                            {isLow && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Log Treatment Modal */}
      {treatmentModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-[#1d1c19]/42 backdrop-blur-sm" onClick={() => setTreatmentModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#fffdf8] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-[#b99862]/22">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-4">
                <h3 className="paunova-title text-2xl">Registrar tratamiento</h3>
                <button onClick={() => setTreatmentModalOpen(false)} className="text-[#6d5847] hover:text-[#c5a880]">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {/* Mode Toggle: Manual vs Voice Dictation */}
              <div className="flex bg-[#c5a880]/10 p-1 rounded-xl gap-1 text-[10px] font-sans font-semibold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setDictationMode(false)}
                  className={`flex-1 py-2 rounded-lg text-center transition-all ${!dictationMode ? "bg-[#6d5847] text-[#FDFBF7] shadow-xs" : "text-[#6d5847] hover:bg-[#c5a880]/5"}`}
                >
                  Registro Manual
                </button>
                <button
                  type="button"
                  onClick={() => setDictationMode(true)}
                  className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${dictationMode ? "bg-[#6d5847] text-[#FDFBF7] shadow-xs" : "text-[#6d5847] hover:bg-[#c5a880]/5"}`}
                >
                  <span className="material-symbols-outlined text-xs">mic</span>
                  <span>Dictado por Voz (IA)</span>
                </button>
              </div>

              {dictationMode ? (
                /* Dictation AI Interface */
                <div className="space-y-5 text-xs font-sans">
                  <div className="bg-white border border-[#d2c4bb]/30 rounded-2xl p-6 text-center space-y-4 shadow-xs">
                    <p className="text-[11px] text-gray-500">
                      Presiona el botón para iniciar el dictado clínico de voz durante el tratamiento.
                    </p>

                    <div className="flex justify-center">
                      {recording ? (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md shadow-red-500/20 relative"
                        >
                          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
                          <span className="material-symbols-outlined text-3xl">mic_off</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="w-16 h-16 rounded-full bg-[#6d5847] text-[#FDFBF7] flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#6d5847]/20"
                        >
                          <span className="material-symbols-outlined text-3xl">mic</span>
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] uppercase tracking-wider font-semibold">
                      {recording ? (
                        <span className="text-red-500 animate-pulse flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Grabando Dictado...
                        </span>
                      ) : (
                        <span className="text-gray-400">Micrófono Apagado</span>
                      )}
                    </div>
                  </div>

                  {/* Transcript Area */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold">
                      Transcripción del Dictado (En Tiempo Real)
                    </label>
                    <textarea
                      readOnly
                      placeholder="La transcripción de tu voz aparecerá aquí de forma temporal para procesamiento de IA..."
                      value={transcriptionText}
                      rows={5}
                      className="w-full bg-[#FDFBF7]/60 border border-[#d2c4bb]/30 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none resize-none italic"
                    />
                    <p className="text-[9px] text-gray-400">
                      * Por motivos de privacidad médica, ni el audio ni este texto crudo serán guardados en la base de datos.
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      disabled={aiLoading || !transcriptionText.trim() || recording}
                      onClick={processDictation}
                      className="w-full bg-[#6d5847] hover:bg-[#88705e] text-[#FDFBF7] py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-semibold transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {aiLoading ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                          <span>Procesando Clínico con IA...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">psychology</span>
                          <span>Generar Reporte con IA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Manual Form Review */
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
