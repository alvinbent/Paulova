"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { clinicalFlow } from "@/lib/doctor-system";

const sections = [
  "Motivo de consulta",
  "Enfermedad actual",
  "Antecedentes",
  "Valoracion",
  "Impresion clinica",
  "Plan",
  "Procedimiento",
  "Productos e insumos",
  "Recomendaciones",
  "Proximo control",
];

export default function FlujoConsultaClinica({
  patientId,
}: {
  patientId: string;
}) {
  const [step, setStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState(
    "Paciente consulta por control estetico. Refiere buena evolucion, sin eventos de alarma. Solicita revisar hidratacion y textura de piel."
  );
  const [modal, setModal] = useState<"ai" | "safety" | null>(null);

  const draft = useMemo(
    () =>
      sections.map((section) => ({
        section,
        value:
          section === "Motivo de consulta"
            ? "Control estetico y revision de evolucion."
            : section === "Productos e insumos"
              ? "Pendiente de confirmar lote, cantidad y unidad antes de descontar inventario."
              : "Borrador generado a partir del texto corregido. Requiere revision clinica.",
      })),
    []
  );

  return (
    <div className="space-y-6">
      <div className="paunova-card rounded-[2rem] p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-[#b99862]/16 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="paunova-kicker">Nueva consulta</p>
            <h1 className="paunova-title mt-1 text-3xl md:text-4xl">
              Historia clinica asistida
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#746b61]">
              Flujo seguro para dictar, transcribir, corregir y dejar un
              borrador listo para aprobacion de la Dra Carolina Aguirre.
            </p>
          </div>
          <Link
            href={`/doctor/pacientes/${patientId}`}
            className="paunova-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Expediente
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-6">
          {clinicalFlow.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-[1.15rem] p-3 text-left transition-all ${
                step === index
                  ? "bg-[#5f4f42] text-[#fffdf8]"
                  : "bg-white/64 text-[#746b61] ring-1 ring-[#b99862]/14 hover:bg-[#b99862]/10"
              }`}
            >
              <span className="font-mono text-[10px] font-semibold">
                0{index + 1}
              </span>
              <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.12em]">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="paunova-kicker">Dictado temporal</p>
              <h2 className="paunova-title mt-1 text-2xl">
                Captura y correccion
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setRecording((value) => !value)}
              className={`flex h-14 w-14 items-center justify-center rounded-full text-white transition-all active:scale-95 ${
                recording ? "bg-[#9b3f36]" : "bg-[#5f4f42]"
              }`}
              aria-label={recording ? "Pausar grabacion" : "Iniciar grabacion"}
            >
              <span className="material-symbols-outlined text-2xl">
                {recording ? "pause" : "mic"}
              </span>
            </button>
          </div>

          <div className="mt-5 rounded-[1.35rem] bg-white/70 p-4 ring-1 ring-[#b99862]/14">
            <div className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em]">
              <span className={recording ? "text-[#9b3f36]" : "text-[#9b8a76]"}>
                {recording ? "Grabando" : "Pausado"}
              </span>
              <span className="font-mono text-[#9b8a76]">00:04:18</span>
            </div>
            <textarea
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              rows={9}
              className="paunova-input min-h-52 resize-none px-4 py-3 text-sm leading-6"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setModal("safety")}
              className="paunova-button-secondary rounded-full px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em]"
            >
              Reglas
            </button>
            <button
              type="button"
              onClick={() => setModal("ai")}
              className="paunova-button-primary rounded-full px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em]"
            >
              Organizar IA
            </button>
          </div>
        </div>

        <div className="paunova-card rounded-[2rem] p-5 md:p-6">
          <div className="border-b border-[#b99862]/16 pb-5">
            <p className="paunova-kicker">Borrador estructurado</p>
            <h2 className="paunova-title mt-1 text-2xl">
              Comparacion y aprobacion
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#746b61]">
              Documento generado con apoyo de inteligencia artificial. Requiere
              revision y aprobacion de la Dra Carolina Aguirre antes de su cierre.
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            {draft.map((item) => (
              <details
                key={item.section}
                className="group rounded-[1.2rem] bg-white/68 p-4 ring-1 ring-[#b99862]/14"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#5f4f42]">
                  {item.section}
                  <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#746b61]">{item.value}</p>
              </details>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button className="paunova-button-secondary rounded-full px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em]">
              Guardar borrador
            </button>
            <button className="paunova-button-secondary rounded-full px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em]">
              Comparar
            </button>
            <button className="paunova-button-primary rounded-full px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em]">
              Aprobar y firmar
            </button>
          </div>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-[#1d1c19]/44 backdrop-blur-sm"
            onClick={() => setModal(null)}
            aria-label="Cerrar explicacion"
          />
          <div className="paunova-card relative z-10 w-full max-w-lg rounded-[2rem] p-6">
            <div className="flex items-start justify-between gap-4 border-b border-[#b99862]/16 pb-4">
              <div>
                <p className="paunova-kicker">
                  {modal === "ai" ? "IA clinica" : "Seguridad"}
                </p>
                <h3 className="paunova-title mt-1 text-2xl">
                  {modal === "ai"
                    ? "Que hara la IA en esta fase"
                    : "Reglas obligatorias"}
                </h3>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-full p-2 text-[#5f4f42] hover:bg-[#b99862]/10"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#746b61]">
              {modal === "ai"
                ? "La IA solo ordena la informacion entregada por dictado o escritura. No inventa diagnosticos, dosis, productos ni datos personales. El resultado queda como borrador."
                : "El audio es temporal, las historias firmadas no se editan directamente y los productos vencidos o sin stock deben bloquearse antes de guardar un procedimiento."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
