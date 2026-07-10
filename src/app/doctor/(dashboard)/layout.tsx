import React from "react";
import Link from "next/link";
import Sidebar from "@/components/doctor/Sidebar";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="paunova-app-shell flex flex-col md:flex-row">
      <Sidebar />
      <main className="relative flex-1 w-full overflow-y-auto">
        <header className="sticky top-0 z-20 border-b border-[#b99862]/16 bg-[#fbf8f3]/82 px-4 py-3 backdrop-blur-xl sm:px-6 md:px-10 xl:px-12">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="paunova-kicker">Paunova Digital Clinic System</p>
              <h2 className="text-sm font-semibold text-[#5f4f42]">
                Dra Carolina Aguirre - Skin & Age Clinic
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#b99862]">
                  search
                </span>
                <input
                  className="paunova-input py-2.5 pl-10 pr-4 text-sm"
                  placeholder="Buscar paciente, cita o insumo"
                />
              </div>
              <Link
                href="/doctor/pacientes"
                className="paunova-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="material-symbols-outlined text-sm">person_search</span>
                Paciente
              </Link>
              <Link
                href="/doctor/torre-control"
                className="paunova-button-primary inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
              >
                <span className="material-symbols-outlined text-sm">monitoring</span>
                Torre
              </Link>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:px-10 md:py-10 xl:px-12">
        {children}
        </div>
      </main>
    </div>
  );
}
