import Link from "next/link";
import { db } from "@/lib/db";

export async function PatientSectionPage({
  patientId,
  title,
  eyebrow,
  icon,
  items,
}: {
  patientId: string;
  title: string;
  eyebrow: string;
  icon: string;
  items: string[];
}) {
  const patient = await db.getPatient(patientId);

  return (
    <div className="space-y-7">
      <Link
        href={`/doctor/pacientes/${patientId}`}
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b99862] transition-colors hover:text-[#5f4f42]"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Volver al expediente</span>
      </Link>

      <section className="paunova-card rounded-[2rem] p-6 md:p-8">
        <p className="paunova-kicker mb-3">{eyebrow}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="material-symbols-outlined rounded-2xl bg-[#5f4f42] p-3 text-3xl text-[#fffdf8]">
            {icon}
          </span>
          <div>
            <h1 className="paunova-title text-4xl md:text-5xl">{title}</h1>
            <p className="mt-2 text-sm text-[#746b61]">
              {patient?.name ?? "Paciente"} - Dra Carolina Aguirre
            </p>
          </div>
        </div>
      </section>

      <section className="paunova-card rounded-[2rem] p-5 md:p-6">
        <div className="mb-5 border-b border-[#b99862]/16 pb-5">
          <p className="paunova-kicker">Estructura preparada</p>
          <h2 className="paunova-title mt-1 text-2xl">Contenido del modulo</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-[1.2rem] bg-white/68 p-4 text-sm leading-6 text-[#5f4f42] ring-1 ring-[#b99862]/14"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
