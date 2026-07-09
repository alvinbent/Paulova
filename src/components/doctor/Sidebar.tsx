"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const logoSrc = "/brand-assets/logo-paunova-skin-age.png";

const menuItems = [
  { name: "Resumen", href: "/doctor/dashboard", icon: "dashboard" },
  { name: "Pacientes", href: "/doctor/crm", icon: "group" },
  { name: "Agenda", href: "/doctor/agenda", icon: "calendar_today" },
  { name: "Inventario", href: "/doctor/inventario", icon: "inventory_2" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/doctor/login");
        router.refresh();
      }
    } catch {
      window.location.href = "/api/auth/logout";
    }
  };

  const navList = (onNavigate?: () => void) => (
    <ul className="space-y-2">
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 active:scale-[0.98] ${
                isActive
                  ? "paunova-button-primary"
                  : "text-[#5f4f42] hover:bg-[#b99862]/10 hover:text-[#7c6756]"
              }`}
            >
              <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-0.5">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-[#b99862]/20 bg-[#fffdf8]/92 px-5 py-4 backdrop-blur-md md:hidden">
        <Image
          src={logoSrc}
          alt="Paunova Skin & Age Clinic"
          width={420}
          height={120}
          priority
          className="h-auto w-[238px] max-w-[64vw] object-contain drop-shadow-[0_18px_26px_rgba(95,79,66,0.18)]"
        />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-full p-2 text-[#5f4f42] transition-colors hover:bg-[#b99862]/10 focus:outline-none focus:ring-4 focus:ring-[#b99862]/18 active:scale-[0.96]"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#1d1c19]/42 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="relative z-50 flex h-full w-80 max-w-[90vw] flex-col justify-between border-r border-[#b99862]/22 bg-[#fffdf8] p-6 shadow-[0_40px_90px_-46px_rgba(29,28,25,0.88)]">
            <div className="space-y-8">
              <div className="border-b border-[#b99862]/18 pb-6">
                <Image
                  src={logoSrc}
                  alt="Paunova Skin & Age Clinic"
                  width={520}
                  height={148}
                  className="h-auto w-full max-w-[292px] object-contain drop-shadow-[0_18px_28px_rgba(95,79,66,0.2)]"
                />
                <p className="paunova-kicker mt-4">Portal médico</p>
              </div>
              <nav>{navList(() => setMobileOpen(false))}</nav>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#9b3f36] transition-all hover:bg-[#9b3f36]/8 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-[22rem] flex-col justify-between p-5 md:flex">
        <div className="paunova-card flex h-full flex-col justify-between rounded-[2rem] p-5">
          <div className="space-y-8">
            <div className="border-b border-[#b99862]/18 pb-7">
              <div className="paunova-inner rounded-[1.65rem] px-4 py-7">
                <Image
                  src={logoSrc}
                  alt="Paunova Skin & Age Clinic"
                  width={620}
                  height={177}
                  priority
                  className="mx-auto h-auto w-full max-w-[312px] object-contain drop-shadow-[0_22px_34px_rgba(95,79,66,0.22)]"
                />
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <p className="paunova-kicker">Cabina clínica</p>
                  <span className="text-[11px] text-[#746b61]">
                    Dra. Carolina Aguirre
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Activo
                </span>
              </div>
            </div>

            <nav>{navList()}</nav>

            <div className="paunova-inner rounded-[1.4rem] p-4 text-[11px] leading-relaxed text-[#746b61]">
              <p className="paunova-kicker mb-2">Modo pruebas</p>
              <p>
                Acceso temporal sin clave mientras se completa la generación y
                validación del sistema.
              </p>
            </div>
          </div>

          <div className="border-t border-[#b99862]/18 pt-5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#9b3f36] transition-all duration-300 hover:bg-[#9b3f36]/8 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
