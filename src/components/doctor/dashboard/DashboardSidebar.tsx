"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Inicio", href: "/doctor/dashboard", icon: "dashboard" },
  { name: "Agenda", href: "/doctor/agenda", icon: "calendar_today" },
  { name: "Pacientes", href: "/doctor/pacientes", icon: "group" },
  { name: "Tratamientos", href: "/doctor/productos", icon: "spa" },
  { name: "Historia clínica", href: "/doctor/historias-clinicas", icon: "clinical_notes" },
  { name: "Reportes", href: "/doctor/torre-control", icon: "monitoring" },
  { name: "Finanzas", href: "/doctor/torre-control", icon: "payments" },
  { name: "Configuración", href: "/doctor/torre-control", icon: "settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/doctor/login");
        router.refresh();
      }
    } catch {
      window.location.href = "/api/auth/logout";
    }
  };

  const nav = (onNavigate?: () => void) => (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
              active
                ? "bg-[#c7aca1] text-[#2b2520]"
                : "text-[#d8ccc0] hover:bg-white/8 hover:text-[#fffaf4]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#d8ccc0]/60 bg-[#f1e9df]/92 px-4 py-3 backdrop-blur-xl md:hidden">
        <Image
          src="/brand-assets/logo-paunova-skin-age.png"
          alt="Paunova Skin & Age Clinic"
          width={360}
          height={104}
          priority
          className="h-auto w-48 object-contain"
        />
        <button
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2b2520] text-[#fffaf4]"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-[#1d1c19]/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          />
          <aside className="relative flex h-full w-[min(270px,86vw)] flex-col bg-[#2b2520] p-4 text-[#fffaf4]">
            <SidebarContent nav={nav(() => setOpen(false))} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 bg-[#2b2520] p-4 text-[#fffaf4] md:block">
        <SidebarContent nav={nav()} onLogout={handleLogout} />
      </aside>
    </>
  );
}

function SidebarContent({
  nav,
  onLogout,
}: {
  nav: React.ReactNode;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="rounded-[28px] bg-[#fffaf4] p-4">
        <Image
          src="/brand-assets/logo-paunova-skin-age.png"
          alt="Paunova Skin & Age Clinic"
          width={420}
          height={120}
          priority
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1">{nav}</div>

      <div className="mt-6 rounded-[26px] bg-white/8 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c7aca1] font-serif text-xl text-[#2b2520]">
            C
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Dra. Carolina</p>
            <p className="text-xs text-[#c7aca1]">Médico estético</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/8 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eadbd2] transition hover:bg-white/12"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Salir
        </button>
      </div>
    </div>
  );
}
