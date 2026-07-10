import Link from "next/link";
import Icon from "./Icon";

export default function DashboardHeader({ currentDate }: { currentDate: string }) {
  return (
    <header className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a28778]">
          {currentDate}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-medium leading-none text-[#2b2520] md:text-5xl">
          Buenos días, Dra. Carolina
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block w-full sm:w-[21rem]">
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a28778]" />
          <input
            className="h-12 w-full rounded-full border border-[#d8ccc0] bg-[#f9f4ee] pl-12 pr-4 text-sm text-[#2b2520] outline-none transition focus:border-[#986b54] focus:ring-4 focus:ring-[#c7aca1]/20"
            placeholder="Buscar paciente, cita o insumo"
          />
        </label>
        <button
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f9f4ee] text-[#593c28] ring-1 ring-[#d8ccc0] transition hover:bg-[#efe4d9]"
          aria-label="Notificaciones"
        >
          <Icon name="bell" className="h-5 w-5" />
        </button>
        <Link
          href="/doctor/agenda"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#593c28] px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fffaf4] shadow-[0_18px_40px_-24px_rgba(89,60,40,0.9)] transition hover:bg-[#463123]"
        >
          <Icon name="add" className="h-4 w-4" />
          Nueva cita
        </Link>
      </div>
    </header>
  );
}
