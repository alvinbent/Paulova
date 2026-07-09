"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const logoSrc = "/brand-assets/logo-horizontal-dorado.png";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: "Resumen", href: "/doctor/dashboard", icon: "dashboard" },
    { name: "Pacientes (CRM)", href: "/doctor/crm", icon: "group" },
    { name: "Agenda", href: "/doctor/agenda", icon: "calendar_today" },
    { name: "Inventario", href: "/doctor/inventario", icon: "inventory_2" },
  ];

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

  return (
    <>
      <header className="md:hidden w-full bg-[#FDFBF7] border-b border-[#d2c4bb]/30 px-5 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center min-w-0">
          <Image
            src={logoSrc}
            alt="Dra Carolina Aguirre - Paunova"
            width={300}
            height={104}
            priority
            className="h-16 w-auto max-w-[230px] object-contain drop-shadow-[0_14px_22px_rgba(109,88,71,0.18)]"
          />
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-[#6d5847] focus:outline-none p-2 -mr-2 rounded-full hover:bg-[#c5a880]/10 transition-colors"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-[#1b1c1c]/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <nav className="relative w-80 max-w-[90vw] bg-[#FDFBF7] h-full flex flex-col justify-between p-6 shadow-xl z-50 border-r border-[#d2c4bb]/30">
            <div className="space-y-8">
              <div className="border-b border-[#d2c4bb]/20 pb-6">
                <Image
                  src={logoSrc}
                  alt="Dra Carolina Aguirre - Paunova"
                  width={360}
                  height={126}
                  className="h-24 w-auto max-w-full object-contain drop-shadow-[0_18px_28px_rgba(109,88,71,0.2)]"
                />
                <p className="mt-3 text-[10px] text-[#88705e] uppercase tracking-[0.22em] font-semibold">
                  Portal médico
                </p>
              </div>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                          isActive
                            ? "bg-[#6d5847] text-[#FDFBF7] shadow-md shadow-[#6d5847]/10"
                            : "text-[#6d5847] hover:bg-[#c5a880]/10 hover:text-[#88705e]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold text-red-600 hover:bg-red-50 transition-all"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      <aside className="hidden md:flex md:w-80 bg-[#FDFBF7] h-screen border-r border-[#d2c4bb]/30 p-6 flex-col justify-between sticky top-0">
        <div className="space-y-8">
          <div className="border-b border-[#d2c4bb]/20 pb-8">
            <div className="rounded-[1.75rem] bg-white/78 px-4 py-6 shadow-[0_28px_58px_-36px_rgba(109,88,71,0.62)] ring-1 ring-[#dec1ac]/40">
              <Image
                src={logoSrc}
                alt="Dra Carolina Aguirre - Paunova"
                width={420}
                height={148}
                priority
                className="mx-auto h-32 w-auto max-w-full object-contain drop-shadow-[0_22px_34px_rgba(109,88,71,0.22)]"
              />
            </div>
            <div className="mt-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-gray-500 font-sans">
                Dra. Carolina Aguirre
              </span>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] uppercase tracking-widest font-semibold transition-all duration-200 active:scale-[0.98] ${
                        isActive
                          ? "bg-[#6d5847] text-[#FDFBF7] shadow-md shadow-[#6d5847]/10"
                          : "text-[#6d5847] hover:bg-[#c5a880]/10 hover:text-[#88705e]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="border-t border-[#d2c4bb]/20 pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
