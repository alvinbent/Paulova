import React from "react";
import BarraLateral from "@/components/doctor/BarraLateral";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="paunova-doctor-shell min-h-dvh bg-[#eee6dc] text-[#2b2520] md:flex">
      <BarraLateral />
      <main className="relative min-w-0 flex-1 overflow-x-hidden p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}
