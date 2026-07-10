"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import IconoDoctor from "@/components/doctor/IconoDoctor";

const logoSrc = "/brand-assets/logo-paunova-skin-age.png";
const doctorAvatarSrc = "/brand-assets/dra-carolina-avatar.jpeg";

const menuItems = [
  { name: "Panel", href: "/doctor/dashboard", icon: "dashboard" },
  { name: "Pacientes", href: "/doctor/pacientes", icon: "group" },
  { name: "Historias", href: "/doctor/historias-clinicas", icon: "clinical_notes" },
  { name: "Agenda", href: "/doctor/agenda", icon: "calendar_today" },
  { name: "Productos", href: "/doctor/productos", icon: "science" },
  { name: "Insumos", href: "/doctor/insumos", icon: "vaccines" },
  { name: "Inventario", href: "/doctor/inventario", icon: "inventory_2" },
  { name: "Solicitudes", href: "/doctor/solicitudes", icon: "shopping_cart" },
  { name: "Seguimientos", href: "/doctor/seguimientos", icon: "event_repeat" },
  { name: "Alertas", href: "/doctor/alertas", icon: "notifications_active" },
  { name: "Reportes", href: "/doctor/reportes", icon: "chart" },
  { name: "Finanzas", href: "/doctor/finanzas", icon: "money" },
  { name: "Configuración", href: "/doctor/configuracion", icon: "settings" },
  { name: "Torre de control", href: "/doctor/torre-control", icon: "monitoring" },
];

export default function BarraLateral() {
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
    <ul className="space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                isActive
                  ? "bg-[#c7aca1] text-[#2b2520]"
                  : "text-[#d8ccc0] hover:bg-white/8 hover:text-[#fffaf4]"
              }`}
            >
              <IconoDoctor
                name={item.icon}
                className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
              />
              <span>{item.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#d8ccc0]/60 bg-[#2b2520] px-4 py-3 backdrop-blur-xl xl:hidden">
        <Image
          src={logoSrc}
          alt="Paunova Skin & Age Clinic"
          width={360}
          height={104}
          priority
          className="h-auto w-48 object-contain"
        />
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#2b2520] text-[#fffaf4]"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <IconoDoctor name={mobileOpen ? "close" : "menu"} className="h-5 w-5" />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-[#1d1c19]/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <aside className="relative flex h-full w-[min(20rem,88vw)] flex-col bg-[#2b2520] p-4 text-[#fffaf4] shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="min-h-0 space-y-6 overflow-y-auto pr-1">
                <div className="rounded-[28px] bg-[#fffaf4] p-4">
                  <Image
                    src={logoSrc}
                    alt="Paunova Skin & Age Clinic"
                    width={420}
                    height={120}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <nav>{navList(() => setMobileOpen(false))}</nav>
              </div>
              <div className="mt-auto pt-6">
                <div className="rounded-[26px] bg-white/8 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#c7aca1] ring-1 ring-white/20">
                      <Image
                        src={doctorAvatarSrc}
                        alt="Dra Carolina Aguirre"
                        width={96}
                        height={96}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">Dra. Carolina</p>
                      <p className="text-xs text-[#c7aca1]">Médico estético</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/8 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eadbd2] hover:bg-white/12"
                >
                  <IconoDoctor name="logout" className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 bg-[#2b2520] p-4 text-[#fffaf4] xl:block">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-6">
            <div className="rounded-[28px] bg-[#fffaf4] p-4">
              <Image
                src={logoSrc}
                alt="Paunova Skin & Age Clinic"
                width={420}
                height={120}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
            <nav className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1">{navList()}</nav>
          </div>

          <div className="mt-6 rounded-[26px] bg-white/8 p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#c7aca1] ring-1 ring-white/20">
                <Image
                  src={doctorAvatarSrc}
                  alt="Dra Carolina Aguirre"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Dra. Carolina</p>
                <p className="text-xs text-[#c7aca1]">Médico estético</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/8 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eadbd2] hover:bg-white/12"
            >
              <IconoDoctor name="logout" className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
