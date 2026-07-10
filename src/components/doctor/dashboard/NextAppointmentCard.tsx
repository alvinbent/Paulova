import Link from "next/link";
import type { DashboardData } from "./types";

export default function NextAppointmentCard({ data }: { data: DashboardData }) {
  const next = data.nextAppointments[0];

  return (
    <section className="col-span-12 rounded-[28px] bg-[#f7efe7] p-6 shadow-[0_30px_70px_-54px_rgba(89,60,40,0.8)] ring-1 ring-[#d8ccc0] lg:col-span-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a28778]">
            Próxima cita
          </p>
          <h3 className="mt-3 font-serif text-3xl font-medium text-[#2b2520]">
            {next ? next.patientName : "Agenda libre"}
          </h3>
        </div>
        <span className="material-symbols-outlined rounded-2xl bg-[#593c28] p-3 text-2xl text-[#fffaf4]">
          calendar_today
        </span>
      </div>

      {next ? (
        <div className="mt-8 grid grid-cols-[5.5rem_1fr] gap-5">
          <div className="rounded-[24px] bg-[#fffaf4] p-4 text-center ring-1 ring-[#d8ccc0]">
            <p className="font-mono text-2xl font-semibold text-[#593c28]">
              {next.time}
            </p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a28778]">
              {next.date}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2b2520]">{next.treatment}</p>
            <p className="mt-2 text-sm leading-6 text-[#71665d]">{next.notes}</p>
            <Link
              href={`/doctor/pacientes/${next.patientId}`}
              className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#986b54]"
            >
              Abrir expediente
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      ) : (
        <p className="mt-8 text-sm text-[#71665d]">
          No hay citas programadas. Puedes abrir agenda para crear una nueva valoración.
        </p>
      )}
    </section>
  );
}
