import Link from "next/link";
import type { DashboardData } from "./types";
import Icon from "./Icon";

export default function DashboardHero({ data }: { data: DashboardData }) {
  const completion = Math.min(92, 58 + data.todayAppointments.length * 8);

  return (
    <section className="relative col-span-12 min-h-[21rem] overflow-hidden rounded-[28px] bg-[#593c28] p-7 text-[#fffaf4] shadow-[0_36px_80px_-48px_rgba(89,60,40,0.9)] lg:col-span-7">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(199,172,161,0.32),transparent_18rem)]" />
      <div className="absolute bottom-[-4rem] right-[-3rem] h-64 w-64 rounded-full border border-[#c7aca1]/20" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c7aca1]">
            Centro clínico Paunova
          </p>
          <h2 className="mt-4 max-w-xl font-serif text-5xl font-medium leading-[0.98] md:text-6xl">
            Decisiones claras para una atención más humana.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-sm">
            <div className="h-2 overflow-hidden rounded-full bg-white/14">
              <div
                className="h-full rounded-full bg-[#c7aca1]"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#eadbd2]">
              <span>Flujo del día</span>
              <span className="font-mono">{completion}%</span>
            </div>
          </div>
          <Link
            href="/doctor/pacientes"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#fffaf4] px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#593c28] transition hover:bg-[#eadbd2]"
          >
            <Icon name="mic" className="h-4 w-4" />
            Dictar consulta
          </Link>
        </div>
      </div>
    </section>
  );
}
