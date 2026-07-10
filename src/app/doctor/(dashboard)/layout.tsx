import React from "react";
import Sidebar from "@/components/doctor/Sidebar";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#eee6dc] text-[#2b2520] md:flex">
      <Sidebar />
      <main className="relative min-w-0 flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
