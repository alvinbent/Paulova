"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Patient, ClinicalRecord, InventoryItem, Lot, Protocol, ProtocolItem, TreatmentApplied } from "@/lib/db";
import IconoDoctor from "@/components/doctor/IconoDoctor";

type DictationResultEvent = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
    };
  }>;
};

type DictationRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: DictationResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type DictationRecognitionConstructor = new () => DictationRecognition;

declare global {
  interface Window {
    SpeechRecognition?: DictationRecognitionConstructor;
    webkitSpeechRecognition?: DictationRecognitionConstructor;
    _recognitionInstance?: DictationRecognition | null;
  }
}

export default function PacienteCliente({
  patient,
  record: initialRecord,
  inventory,
  lots,
  protocols,
  protocolItems,
}: {
  patient: Patient;
  record: ClinicalRecord;
  inventory: InventoryItem[];
  lots: Lot[];
  protocols: Protocol[];
  protocolItems: ProtocolItem[];
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

  // Editing state for past treatments
  const [editingTreatmentId, setEditingTreatmentId] = useState<string | null>(null);

  // New treatment / edit treatment states
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>("");
  const [treatmentName, setTreatmentName] = useState("");
  const [productUsedId, setProductUsedId] = useState("");
  const [lotUsedId, setLotUsedId] = useState("");
  const [productQuantityUsed, setProductQuantityUsed] = useState(1);
  const [details, setDetails] = useState("");
  const [priceChargedCop, setPriceChargedCop] = useState<number>(0);
  const [adverseEvent, setAdverseEvent] = useState("");
  const [consentStatus, setConsentStatus] = useState<TreatmentApplied["consentStatus"]>("No Aplica");

  // Patient allergy safety check
  const getSafetyWarning = () => {
    if (!selectedProtocolId) return null;
    const proto = protocols.find((p) => p.id === selectedProtocolId);
    if (!proto || !patient) return null;

    const patientAllergies = record.allergies.toLowerCase();
    if (!patientAllergies || patientAllergies === "ninguna" || patientAllergies === "ninguna conocida") return null;

    const contraindications = proto.contraindications.toLowerCase();
    
    // Check if any word from patient allergies matches words in contraindications
    const keywords = patientAllergies.split(/[\s,.]+/).filter((w) => w.length > 3);
    const matches = keywords.filter((word) => contraindications.includes(word));

    if (matches.length > 0) {
      return `⚠️ Alerta de Seguridad: El paciente presenta alergias a "${matches.join(", ")}" que coinciden con contraindicaciones de este protocolo (${proto.contraindications})`;
    }
    return null;
  };

  const safetyWarning = getSafetyWarning();

  // Handle clinical record general info updates (allergies, skin type, notes)
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");
    setLoading(true);

    try {
      const res = await fetch(`/api/doctor/pacientes/${patient.id}/historial-clinico`, {
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

  // Open modal for registration
  const openNewTreatmentModal = () => {
    setEditingTreatmentId(null);
    setSelectedProtocolId("");
    setTreatmentName("");
    setProductUsedId("");
    setLotUsedId("");
    setProductQuantityUsed(1);
    setDetails("");
    setPriceChargedCop(0);
    setAdverseEvent("");
    setConsentStatus("No Aplica");
    setDictationMode(false);
    setTranscriptionText("");
    setNotice("");
    setTreatmentModalOpen(true);
  };

  // Open modal for editing past entries
  const openEditTreatmentModal = (treatment: TreatmentApplied) => {
    setNotice("");
    setEditingTreatmentId(treatment.id);
    setSelectedProtocolId(""); // Not linked to active selection dropdown on edit
    setTreatmentName(treatment.treatmentName);
    setProductUsedId(treatment.productUsedId || "");
    setLotUsedId(treatment.lotUsedId || "");
    setProductQuantityUsed(treatment.productQuantityUsed || 1);
    setDetails(treatment.details);
    setPriceChargedCop(treatment.priceChargedCop || 0);
    setAdverseEvent(treatment.adverseEvent || "");
    setConsentStatus(treatment.consentStatus || "No Aplica");
    setDictationMode(false);
    setTranscriptionText("");
    setTreatmentModalOpen(true);
  };

  // Handle Protocol change
  const handleProtocolChange = (protoId: string) => {
    setSelectedProtocolId(protoId);
    if (!protoId) {
      setTreatmentName("");
      setProductUsedId("");
      setLotUsedId("");
      setDetails("");
      return;
    }

    const proto = protocols.find((p) => p.id === protoId);
    if (proto) {
      setTreatmentName(proto.name);
      
      // Fetch standard item mapped to this protocol
      const items = protocolItems.filter((i) => i.protocolId === protoId);
      const mainItem = items.find((i) => !i.optional) || items[0];

      if (mainItem) {
        setProductUsedId(mainItem.productId);
        setProductQuantityUsed(mainItem.standardQuantity || 1);
        
        // Auto select first active lot if available
        const matchingLots = lots.filter((l) => l.productId === mainItem.productId && l.status === "activo" && l.currentQty > 0);
        if (matchingLots.length > 0) {
          setLotUsedId(matchingLots[0].id);
        } else {
          setLotUsedId("");
        }
      } else {
        setProductUsedId("");
        setLotUsedId("");
      }

      setDetails(`Tratamiento: ${proto.name}\nIndicaciones: ${proto.indications}\n\nCuidados Recomendados:\n- ${proto.notes}`);
    }
  };

  // Handle Product change to reset Lot dropdown
  const handleProductChange = (prodId: string) => {
    setProductUsedId(prodId);
    const matchingLots = lots.filter((l) => l.productId === prodId && l.status === "activo" && l.currentQty > 0);
    if (matchingLots.length > 0) {
      setLotUsedId(matchingLots[0].id);
    } else {
      setLotUsedId("");
    }
  };

  // Submit form (both adding and editing)
  const handleSaveTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("");
    setLoading(true);

    try {
      const isEdit = !!editingTreatmentId;
      const type = isEdit ? "edit-treatment" : "treatment";
      const payload = {
        type,
        treatmentId: editingTreatmentId || undefined,
        treatmentName,
        productUsedId: productUsedId || undefined,
        productQuantityUsed: productUsedId ? productQuantityUsed : undefined,
        lotUsedId: (productUsedId && lotUsedId) ? lotUsedId : undefined,
        details,
        priceChargedCop: priceChargedCop || 0,
        adverseEvent: adverseEvent || "",
        consentStatus: consentStatus || "No Aplica",
      };

      const res = await fetch(`/api/doctor/pacientes/${patient.id}/historial-clinico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setRecord(data);
        setTreatmentModalOpen(false);
      } else {
        setNotice(data.error || "Error al guardar tratamiento");
      }
    } catch {
      setNotice("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Voice dictation handlers
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setNotice("El dictado por voz no está soportado en este navegador. Usa Chrome o Edge.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = "es-ES";
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event: DictationResultEvent) => {
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

      rec.onerror = () => {
        setRecording(false);
      };

      rec.onend = () => {
        setRecording(false);
      };

      rec.start();
      window._recognitionInstance = rec;
      setRecording(true);
      setTranscriptionText("");
    } catch {
      setNotice("No se pudo iniciar el dictado.");
    }
  };

  const stopRecording = () => {
    if (window._recognitionInstance) {
      try {
        window._recognitionInstance.stop();
      } catch {}
      window._recognitionInstance = null;
    }
    setRecording(false);
  };

  const processDictation = async () => {
    if (!transcriptionText.trim()) {
      setNotice("Realiza un dictado de voz antes de procesar.");
      return;
    }
    setNotice("");
    setAiLoading(true);

    try {
      const res = await fetch(`/api/doctor/pacientes/${patient.id}/procesar-dictado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcriptionText }),
      });
      const data = await res.json();
      if (res.ok) {
        setTreatmentName(data.treatmentName || "");
        setProductUsedId(data.productUsedId || "");
        setProductQuantityUsed(data.productQuantityUsed || 1);
        setDetails(data.clinicalReport || "");
        
        if (data.productUsedId) {
          const matchingLots = lots.filter((l) => l.productId === data.productUsedId && l.status === "activo" && l.currentQty > 0);
          if (matchingLots.length > 0) {
            setLotUsedId(matchingLots[0].id);
          }
        }
        setDictationMode(false);
      } else {
        setNotice(data.error || "Error al procesar con IA");
      }
    } catch {
      setNotice("Error de conexión al procesar dictado");
    } finally {
      setAiLoading(false);
    }
  };

  // Aggregate consumed supplies
  const consumedSuppliesMap = new Map<string, { name: string; quantity: number; unitName: string }>();
  record.treatmentsApplied.forEach((t) => {
    if (t.productUsedId && t.productNameUsed && t.productQuantityUsed) {
      const existing = consumedSuppliesMap.get(t.productUsedId);
      const matchingProduct = inventory.find((i) => i.id === t.productUsedId);
      const unit = matchingProduct ? matchingProduct.unitName : "unidades";
      if (existing) {
        existing.quantity += t.productQuantityUsed;
      } else {
        consumedSuppliesMap.set(t.productUsedId, {
          name: t.productNameUsed,
          quantity: t.productQuantityUsed,
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
          <IconoDoctor name="arrow_back" className="h-3.5 w-3.5" />
          <span>Volver a Pacientes</span>
        </Link>

        <div className="paunova-card rounded-[2rem] p-6 md:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-1">
            <span className="paunova-kicker">Expediente clínico</span>
            <h1 className="paunova-title text-3xl md:text-4xl italic">{patient.name}</h1>
            <p className="text-xs text-[#746b61]">
              Fecha de registro: {new Date(patient.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/doctor/pacientes/${patient.id}/consultas/nueva`}
              className="paunova-button-secondary px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <IconoDoctor name="mic" className="h-4 w-4" />
              <span>Nueva consulta</span>
            </Link>
            <button
              onClick={openNewTreatmentModal}
              className="paunova-button-primary px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 active:scale-[0.98]"
            >
              <IconoDoctor name="vaccines" className="h-4 w-4" />
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal info and clinical record */}
        <div className="space-y-8 lg:col-span-1">
          {/* Datos Personales */}
          <div className="paunova-card rounded-[1.75rem] p-6 space-y-4">
            <h3 className="paunova-title text-lg border-b border-[#d2c4bb]/10 pb-2">Datos Personales</h3>
            <ul className="space-y-3 text-xs font-sans text-gray-600">
              <li className="flex items-center gap-2">
                <IconoDoctor name="phone" className="h-4 w-4 text-[#c5a880]" />
                <span>{patient.phone}</span>
              </li>
              {patient.email && (
                <li className="flex items-center gap-2">
                  <IconoDoctor name="mail" className="h-4 w-4 text-[#c5a880]" />
                  <span className="truncate" title={patient.email}>{patient.email}</span>
                </li>
              )}
              {patient.birthday && (
                <li className="flex items-center gap-2">
                  <IconoDoctor name="cake" className="h-4 w-4 text-[#c5a880]" />
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

          {/* Ficha Médica */}
          <div className="paunova-card rounded-[1.75rem] p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#d2c4bb]/10 pb-2">
              <h3 className="paunova-title text-lg">Ficha médica</h3>
              {!editInfoMode && (
                <button
                  onClick={() => setEditInfoMode(true)}
                  className="text-xs text-[#c5a880] hover:text-[#6d5847] font-semibold flex items-center gap-0.5"
                >
                  <IconoDoctor name="edit" className="h-3.5 w-3.5" />
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

        {/* Right Column: Treatment log and history tabs */}
        <div className="paunova-card lg:col-span-2 rounded-[2rem] p-6 md:p-8 space-y-6">
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
              <IconoDoctor name="vaccines" className="h-3.5 w-3.5" />
              <span>Insumos Consumidos</span>
            </button>
          </div>

          {tab === "treatments" ? (
            record.treatmentsApplied.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <IconoDoctor name="vaccines" className="h-9 w-9 mb-2" />
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
                      className="border border-[#d2c4bb]/20 hover:border-[#6d5847]/40 rounded-2xl p-5 hover:bg-[#FDFBF7]/30 transition-all duration-200 space-y-3 relative group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#d2c4bb]/10 pb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base text-[#6d5847] font-semibold">
                            {treatment.treatmentName}
                          </h4>
                          {treatment.priceChargedCop ? (
                            <span className="text-[10px] font-sans font-bold bg-[#c5a880]/10 text-[#6d5847] px-2 py-0.5 rounded">
                              ${treatment.priceChargedCop.toLocaleString()} COP
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-400 font-sans font-semibold">
                            {treatment.date}
                          </span>
                          <button
                            onClick={() => openEditTreatmentModal(treatment)}
                            className="opacity-0 group-hover:opacity-100 text-[#c5a880] hover:text-[#6d5847] font-semibold text-[10px] transition-all flex items-center gap-0.5 active:scale-[0.95]"
                          >
                            <IconoDoctor name="edit" className="h-3.5 w-3.5" />
                            <span>Editar</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed font-sans whitespace-pre-line">
                        {treatment.details}
                      </p>

                      {treatment.adverseEvent && (
                        <div className="rounded-xl border border-red-100 bg-red-50/50 px-3.5 py-2 text-xs text-red-700 font-sans mt-2">
                          <strong className="block font-bold">Evento Adverso:</strong>
                          <span className="italic">{treatment.adverseEvent}</span>
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap gap-2 text-[9px] font-mono">
                        {treatment.productNameUsed && (
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#c5a880]/10 text-[#c5a880] font-semibold uppercase tracking-wider">
                            <span>Insumo: {treatment.productNameUsed} ({treatment.productQuantityUsed} {inventory.find(i => i.id === treatment.productUsedId)?.unitName || "unidades"})</span>
                          </div>
                        )}
                        {treatment.lotNumberUsed && (
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold uppercase tracking-wider">
                            <span>Lote INVIMA: {treatment.lotNumberUsed}</span>
                          </div>
                        )}
                        <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                          treatment.consentStatus === "Firmado" ? "bg-emerald-50 text-emerald-700" : treatment.consentStatus === "Pendiente" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-400"
                        }`}>
                          <span>Consentimiento: {treatment.consentStatus || "No Aplica"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )
          ) : consumedSupplies.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <IconoDoctor name="inventory" className="h-9 w-9 mb-2" />
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
                        <td className="px-4 py-3 font-semibold text-[#1b1c1c]">{supply.name}</td>
                        <td className="px-4 py-3 font-semibold text-[#6d5847]">{supply.quantity} {supply.unitName}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                            isLow ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
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

      {/* Log / Edit Treatment Slide-over Modal */}
      {treatmentModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-[#1d1c19]/42 backdrop-blur-sm" onClick={() => setTreatmentModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#fffdf8] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-[#b99862]/22">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-4">
                <h3 className="paunova-title text-2xl">
                  {editingTreatmentId ? "Editar Tratamiento" : "Registrar Tratamiento"}
                </h3>
                <button onClick={() => setTreatmentModalOpen(false)} className="text-[#6d5847] hover:text-[#c5a880]">
                  <IconoDoctor name="close" className="h-5 w-5" />
                </button>
              </div>

              {/* Mode Toggle: Manual vs Voice Dictation */}
              {!editingTreatmentId && (
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
                    <IconoDoctor name="mic" className="h-3.5 w-3.5" />
                    <span>Dictado por Voz (IA)</span>
                  </button>
                </div>
              )}

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
                          <IconoDoctor name="mic_off" className="h-7 w-7" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="w-16 h-16 rounded-full bg-[#6d5847] text-[#FDFBF7] flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#6d5847]/20"
                        >
                          <IconoDoctor name="mic" className="h-7 w-7" />
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

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold">
                      Transcripción del Dictado (Tiempo Real)
                    </label>
                    <textarea
                      readOnly
                      placeholder="La transcripción de tu voz aparecerá aquí de forma temporal..."
                      value={transcriptionText}
                      rows={5}
                      className="w-full bg-[#FDFBF7]/60 border border-[#d2c4bb]/30 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none resize-none italic"
                    />
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
                          <IconoDoctor name="sync" className="h-4 w-4 animate-spin" />
                          <span>Procesando Clínico con IA...</span>
                        </>
                      ) : (
                        <>
                          <IconoDoctor name="psychology" className="h-4 w-4" />
                          <span>Generar Reporte con IA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Manual Review & Registration Form */
                <form onSubmit={handleSaveTreatment} className="space-y-4 text-xs font-sans">
                  {/* Protocol Selector */}
                  {!editingTreatmentId && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                        Protocolo de Tratamiento
                      </label>
                      <select
                        value={selectedProtocolId}
                        onChange={(e) => handleProtocolChange(e.target.value)}
                        className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
                      >
                        <option value="">Personalizado (Sin pre-cargar insumos)</option>
                        {protocols.map((proto) => (
                          <option key={proto.id} value={proto.id}>
                            {proto.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Safety alerts banner */}
                  {safetyWarning && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 font-sans font-semibold">
                      {safetyWarning}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Nombre del Tratamiento *
                    </label>
                    <input
                      type="text"
                      required
                      value={treatmentName}
                      onChange={(e) => setTreatmentName(e.target.value)}
                      placeholder="Ej. Toxina Tercio Superior"
                      className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
                    />
                  </div>

                  <div className="border-t border-[#d2c4bb]/10 pt-4 mt-2">
                    <span className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-2">
                      Insumo Médico / Sustancia
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                          Producto
                        </label>
                        <select
                          value={productUsedId}
                          onChange={(e) => handleProductChange(e.target.value)}
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

                    {/* Specific Lot Selector */}
                    {productUsedId && (
                      <div className="mt-3">
                        <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                          Lote Activo de Insumo *
                        </label>
                        <select
                          required
                          value={lotUsedId}
                          onChange={(e) => setLotUsedId(e.target.value)}
                          className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-[11px] text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
                        >
                          <option value="">Seleccione Lote...</option>
                          {lots
                            .filter((l) => l.productId === productUsedId && (l.status === "activo" || l.id === lotUsedId))
                            .map((l) => (
                              <option key={l.id} value={l.id}>
                                Lote {l.lotNumber} (vence {l.expiryDate}) — {l.currentQty} en stock
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#d2c4bb]/10 pt-4 mt-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                        Precio Cobrado (COP)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={priceChargedCop}
                        onChange={(e) => setPriceChargedCop(Number(e.target.value))}
                        className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                        Consentimiento Informado
                      </label>
                      <select
                        value={consentStatus}
                        onChange={(e) => setConsentStatus(e.target.value as TreatmentApplied["consentStatus"])}
                        className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
                      >
                        <option value="No Aplica">No Aplica</option>
                        <option value="Firmado">Firmado / Aprobado</option>
                        <option value="Pendiente">Pendiente por Firmar</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Eventos Adversos / Complicaciones (Opcional)
                    </label>
                    <input
                      type="text"
                      value={adverseEvent}
                      onChange={(e) => setAdverseEvent(e.target.value)}
                      placeholder="Ej. Eritema leve, Ninguno"
                      className="w-full bg-white border border-[#d2c4bb]/40 rounded-xl px-4 py-2 text-xs text-[#1b1c1c] focus:outline-none focus:border-[#6d5847]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Detalles y Notas Clínicas *
                    </label>
                    <textarea
                      required
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={4}
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
                      {loading ? "Guardando..." : editingTreatmentId ? "Guardar Cambios" : "Registrar Tratamiento"}
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
