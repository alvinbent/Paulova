"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/doctor/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Contraseña incorrecta");
      }
    } catch {
      setError("Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#6d5847]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#c5a880]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-[#d2c4bb]/30 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="font-sans tracking-[0.2em] uppercase text-[10px] text-[#c5a880] font-semibold block mb-2">
            Acceso Médico Privado
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#6d5847] font-normal italic tracking-wide">
            Paunova
          </h1>
          <p className="text-[#88705e] text-xs font-sans mt-2">
            Dra Carolina Aguirre - Skin & Age Clinic
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider text-[#6d5847] font-semibold mb-2"
            >
              Contraseña de Acceso
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-4 py-3.5 text-sm text-[#1b1c1c] placeholder-gray-400 focus:outline-none focus:border-[#6d5847] focus:ring-1 focus:ring-[#6d5847] transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200/50 rounded-xl px-4 py-3 text-xs text-red-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm font-variation-settings-'opsz'-20">
                error
              </span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6d5847] hover:bg-[#88705e] text-[#FDFBF7] py-3.5 rounded-xl font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md shadow-[#6d5847]/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Cargando...</span>
            ) : (
              <>
                <span>Ingresar</span>
                <span className="material-symbols-outlined text-sm">login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#d2c4bb]/20 pt-6">
          <p className="text-[10px] text-gray-400 font-sans">
            Para recuperar su contraseña o solicitar acceso, por favor contacte a soporte técnico.
          </p>
        </div>
      </div>
    </main>
  );
}
