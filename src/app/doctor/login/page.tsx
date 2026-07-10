"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import IconoDoctor from "@/components/doctor/IconoDoctor";

export default function DoctorLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTestAccess = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/test-access", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        router.push("/doctor/panel");
        router.refresh();
      } else {
        setError(data.error || "No fue posible abrir la aplicación.");
      }
    } catch {
      setError("No fue posible conectar con la aplicación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="paunova-app-shell relative flex min-h-[100dvh] items-center justify-center overflow-hidden p-4">
      <div className="paunova-card relative z-10 w-full max-w-xl rounded-[2.25rem] p-8 md:p-10">
        <div className="text-center">
          <Image
            src="/brand-assets/logo-paunova-skin-age.png"
            alt="Paunova Skin & Age Clinic"
            width={680}
            height={194}
            priority
            className="mx-auto h-auto w-full max-w-[460px] object-contain drop-shadow-[0_24px_36px_rgba(95,79,66,0.2)]"
          />
          <p className="paunova-kicker mt-7">Modo de pruebas</p>
          <h1 className="paunova-title mt-3 text-3xl md:text-4xl">
            Acceso directo a la aplicación
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#746b61]">
            Durante la etapa de generación no se solicitará usuario ni clave.
            El acceso con credenciales queda reservado para la configuración final.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-[#9b3f36]/18 bg-[#fff7f4] px-4 py-3 text-xs font-medium text-[#9b3f36]">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={handleTestAccess}
          className="paunova-button-primary mt-8 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <span>Abriendo aplicación...</span>
          ) : (
            <>
              <span>Entrar ahora</span>
              <IconoDoctor name="login" className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="paunova-inner mt-8 rounded-[1.5rem] p-4 text-center text-[11px] leading-5 text-[#746b61]">
          Próxima tarea final: activar acceso con usuario, clave y roles
          definidos para producción.
        </div>
      </div>
    </main>
  );
}
