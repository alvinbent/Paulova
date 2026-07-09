import React from "react";
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
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:px-10 md:py-10 xl:px-12">
        {children}
        </div>
      </main>
    </div>
  );
}
