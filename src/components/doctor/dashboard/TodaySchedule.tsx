import Link from "next/link";
import type { DashboardData } from "./types";

export default function TodaySchedule({ data }: { data: DashboardData }) {
  const schedule =
    data.todayAppointments.length > 0 ? data.todayAppointments : data.nextAppointments.slice(0, 4);

  return (
    <section className="col-span-12 min-h-[27rem] rounded-[28px] bg-[#fffaf4] p-6 ring-1 ring-[#ded2c6] lg:col-span-8">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a28778]">
            Agenda diaria
          </p>
          <h3 className="mt-2 font-serif text-3xl font-medium text-[#2b2520]">
            Timeline clínico
          </h3>
        </div>
        <Link
          href="/doctor/agenda"
          className="rounded-full bg-[#f3e7d8] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#593c28]"
        >
          Ver agenda
        </Link>
      </div>

      <div className="space-y-4">
        {schedule.map((appointment, index) => (
          <article
            key={appointment.id}
            className="grid grid-cols-[4.75rem_1fr] gap-4 rounded-[24px] bg-[#f8f1ea] p-4"
          >
            <div className="relative">
              <p className="font-mono text-sm font-semibold text-[#593c28]">
                {appointment.time}
              </p>
              {index < schedule.length - 1 && (
                <span className="absolute left-4 top-8 h-12 w-px bg-[#d8ccc0]" />
              )}
              <span className="mt-3 block h-8 w-8 rounded-full bg-[#593c28] ring-4 ring-[#eadbd2]" />
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <Link
                  href={`/doctor/pacientes/${appointment.patientId}`}
                  className="text-base font-semibold text-[#2b2520]"
                >
                  {appointment.patientName}
                </Link>
                <p className="mt-1 text-sm text-[#71665d]">{appointment.treatment}</p>
              </div>
              <span className="w-fit rounded-full bg-[#fffaf4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#986b54] ring-1 ring-[#d8ccc0]">
                {appointment.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
