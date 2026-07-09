"use client";

import React, { useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  category: "Inyectable" | "Exfoliante" | "Equipo/Accesorios" | "Cuidado Post-Láser" | "Anestésico";
  units: number;
  minUnits: number;
  unitName: string;
}

export default function InventarioClient({
  initialInventory,
}: {
  initialInventory: InventoryItem[];
}) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newUnits, setNewUnits] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setNewUnits(item.units);
    setModalOpen(true);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/doctor/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedItem.id, units: newUnits }),
      });

      const data = await res.json();
      if (res.ok) {
        setInventory(
          inventory.map((item) => (item.id === selectedItem.id ? data : item))
        );
        setModalOpen(false);
        setSelectedItem(null);
      } else {
        setError(data.error || "Error al actualizar stock");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="paunova-card rounded-[2rem] p-6 md:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <p className="paunova-kicker mb-2">Control de insumos</p>
          <h1 className="paunova-title text-3xl md:text-4xl">
            Control de <span className="italic">Inventario e Insumos</span>
          </h1>
          <p className="text-sm text-[#746b61] mt-3 max-w-2xl leading-6">
            Supervisión de stock crítico, viales de inyectables y consumibles estéticos.
          </p>
        </div>
      </div>

      <div className="paunova-table-wrap rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#d2c4bb]/10 text-gray-400 text-[10px] uppercase tracking-wider font-semibold font-sans bg-[#FDFBF7] px-6">
                <th className="px-6 py-4 font-semibold">Producto / Insumo</th>
                <th className="px-6 py-4 font-semibold">Categoría</th>
                <th className="px-6 py-4 font-semibold">Stock Actual</th>
                <th className="px-6 py-4 font-semibold">Nivel Crítico</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d2c4bb]/10 text-xs font-sans">
              {inventory.map((item) => {
                const isLowStock = item.units <= item.minUnits;
                return (
                  <tr key={item.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#1b1c1c]">{item.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#6d5847]">
                      {item.units} {item.unitName}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {item.minUnits} {item.unitName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                        isLowStock
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {isLowStock ? "Stock Crítico" : "Óptimo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-[#c5a880] hover:text-[#6d5847] font-semibold transition-all inline-flex items-center gap-1 active:scale-[0.95]"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        <span>Ajustar Stock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1d1c19]/45 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="paunova-card max-w-sm w-full rounded-[2rem] p-6 relative z-10 space-y-6">
            <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-3">
              <h3 className="paunova-title text-2xl">Ajustar stock</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6d5847] hover:text-[#c5a880]">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-[#9b3f36]/18 bg-[#fff7f4] px-4 py-3 text-xs font-medium text-[#9b3f36]">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <p className="font-semibold text-gray-500">Insumo:</p>
                <p className="text-[#1b1c1c] font-semibold">{selectedItem.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{selectedItem.category}</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                  Nueva Cantidad ({selectedItem.unitName}) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newUnits}
                  onChange={(e) => setNewUnits(Number(e.target.value))}
                  className="paunova-input px-4 py-2.5 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="paunova-button-secondary flex-1 py-2.5 rounded-full transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="paunova-button-primary flex-1 py-2.5 rounded-full transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
