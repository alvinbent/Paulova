"use client";

import React, { useState } from "react";
import { InventoryItem, Lot, Provider } from "@/lib/db";

export default function InventarioClient({
  initialInventory,
  initialLots,
  initialProviders,
}: {
  initialInventory: InventoryItem[];
  initialLots: Lot[];
  initialProviders: Provider[];
}) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [lots, setLots] = useState<Lot[]>(initialLots);
  const [providers, setProviders] = useState<Provider[]>(initialProviders);

  // Navigation tabs: "catalog" | "lots" | "providers"
  const [activeTab, setActiveTab] = useState<"catalog" | "lots" | "providers">("catalog");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);

  const [lotModalOpen, setLotModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Form states
  // 1. Product Form
  const [prodId, setProdId] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState<InventoryItem["category"]>("Inyectable");
  const [prodMinUnits, setProdMinUnits] = useState(0);
  const [prodUnitName, setProdUnitName] = useState("unidades");
  const [prodBrand, setProdBrand] = useState("");
  const [prodPresentation, setProdPresentation] = useState("");
  const [prodInvima, setProdInvima] = useState("");

  // 2. Lot Form
  const [lotProductId, setLotProductId] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [lotExpiryDate, setLotExpiryDate] = useState("");
  const [lotSerial, setLotSerial] = useState("");
  const [lotProviderId, setLotProviderId] = useState("");
  const [lotCost, setLotCost] = useState(0);
  const [lotInitialQty, setLotInitialQty] = useState(0);
  const [lotCurrentQty, setLotCurrentQty] = useState(0);
  const [lotLocation, setLotLocation] = useState("");
  const [lotStatus, setLotStatus] = useState<Lot["status"]>("activo");

  // 3. Provider Form
  const [provCompanyName, setProvCompanyName] = useState("");
  const [provNit, setProvNit] = useState("");
  const [provContactName, setProvContactName] = useState("");
  const [provPhone, setProvPhone] = useState("");
  const [provEmail, setProvEmail] = useState("");
  const [provCity, setProvCity] = useState("Buga");
  const [provCountry, setProvCountry] = useState("Colombia");
  const [provActorType, setProvActorType] = useState("Distribuidor");

  // Helper to open Product Modal
  const openProductModal = (prod: InventoryItem | null = null) => {
    setError("");
    setSelectedProduct(prod);
    if (prod) {
      setProdId(prod.id);
      setProdName(prod.name);
      setProdCategory(prod.category);
      setProdMinUnits(prod.minUnits);
      setProdUnitName(prod.unitName);
      setProdBrand(prod.brand || "");
      setProdPresentation(prod.presentation || "");
      setProdInvima(prod.invimaRef || "");
    } else {
      setProdId("");
      setProdName("");
      setProdCategory("Inyectable");
      setProdMinUnits(0);
      setProdUnitName("unidades");
      setProdBrand("");
      setProdPresentation("");
      setProdInvima("");
    }
    setProductModalOpen(true);
  };

  // Helper to open Lot Modal
  const openLotModal = (lot: Lot | null = null) => {
    setError("");
    setSelectedLot(lot);
    if (lot) {
      setLotProductId(lot.productId);
      setLotNumber(lot.lotNumber);
      setLotExpiryDate(lot.expiryDate);
      setLotSerial(lot.serialNumber || "");
      setLotProviderId(lot.providerId);
      setLotCost(lot.costUnitCop);
      setLotInitialQty(lot.initialQty);
      setLotCurrentQty(lot.currentQty);
      setLotLocation(lot.physicalLocation);
      setLotStatus(lot.status);
    } else {
      setLotProductId(inventory[0]?.id || "");
      setLotNumber("");
      setLotExpiryDate("");
      setLotSerial("");
      setLotProviderId(providers[0]?.id || "");
      setLotCost(0);
      setLotInitialQty(10);
      setLotCurrentQty(10);
      setLotLocation("");
      setLotStatus("activo");
    }
    setLotModalOpen(true);
  };

  // Helper to open Provider Modal
  const openProviderModal = (prov: Provider | null = null) => {
    setError("");
    setSelectedProvider(prov);
    if (prov) {
      setProvCompanyName(prov.companyName);
      setProvNit(prov.nit);
      setProvContactName(prov.contactName);
      setProvPhone(prov.phone);
      setProvEmail(prov.email);
      setProvCity(prov.city);
      setProvCountry(prov.country);
      setProvActorType(prov.actorType);
    } else {
      setProvCompanyName("");
      setProvNit("");
      setProvContactName("");
      setProvPhone("");
      setProvEmail("");
      setProvCity("Buga");
      setProvCountry("Colombia");
      setProvActorType("Distribuidor");
    }
    setProviderModalOpen(true);
  };

  // Save Product Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEdit = !!selectedProduct;
      const res = await fetch("/api/doctor/inventory", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: isEdit ? "product" : undefined,
          id: prodId,
          name: prodName,
          category: prodCategory,
          minUnits: prodMinUnits,
          unitName: prodUnitName,
          brand: prodBrand,
          presentation: prodPresentation,
          invimaRef: prodInvima,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (isEdit) {
          setInventory(inventory.map((item) => (item.id === prodId ? data : item)));
          setNotice("Producto actualizado correctamente.");
        } else {
          setInventory([...inventory, data]);
          setNotice("Producto registrado correctamente.");
        }
        setProductModalOpen(false);
      } else {
        setError(data.error || "Error al procesar producto");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Save Lot Handler
  const handleSaveLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEdit = !!selectedLot;
      const url = "/api/doctor/lots";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? {
            id: selectedLot.id,
            expiryDate: lotExpiryDate,
            serialNumber: lotSerial,
            providerId: lotProviderId,
            costUnitCop: lotCost,
            currentQty: lotCurrentQty,
            physicalLocation: lotLocation,
            status: lotStatus,
          }
        : {
            productId: lotProductId,
            lotNumber,
            expiryDate: lotExpiryDate,
            serialNumber: lotSerial,
            providerId: lotProviderId,
            costUnitCop: lotCost,
            initialQty: lotInitialQty,
            physicalLocation: lotLocation,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        // Refresh local lists
        if (isEdit) {
          setLots(lots.map((l) => (l.id === selectedLot.id ? data : l)));
          setNotice("Lote físico ajustado correctamente.");
        } else {
          setLots([...lots, data]);
          setNotice("Nuevo lote registrado correctamente.");
        }
        // Sync catalog quantities
        const updatedInventoryRes = await fetch("/api/doctor/inventory");
        if (updatedInventoryRes.ok) {
          const updatedInventory = await updatedInventoryRes.json();
          setInventory(updatedInventory);
        }
        setLotModalOpen(false);
      } else {
        setError(data.error || "Error al procesar lote");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Save Provider Handler
  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEdit = !!selectedProvider;
      const res = await fetch("/api/doctor/providers", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedProvider?.id,
          companyName: provCompanyName,
          nit: provNit,
          contactName: provContactName,
          phone: provPhone,
          email: provEmail,
          city: provCity,
          country: provCountry,
          actorType: provActorType,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (isEdit) {
          setProviders(providers.map((p) => (p.id === selectedProvider.id ? data : p)));
          setNotice("Proveedor actualizado.");
        } else {
          setProviders([...providers, data]);
          setNotice("Proveedor registrado.");
        }
        setProviderModalOpen(false);
      } else {
        setError(data.error || "Error al guardar proveedor");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Expiry styling helpers
  const getExpiryLabel = (lot: Lot) => {
    if (lot.status === "bloqueo") return { text: "Bloqueado", css: "bg-red-100 text-red-800 border border-red-200" };
    if (lot.currentQty === 0 || lot.status === "agotado") return { text: "Agotado", css: "bg-gray-100 text-gray-500 border border-gray-200" };

    const today = new Date();
    const expiry = new Date(lot.expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff <= 0) {
      return { text: "Vencido", css: "bg-red-50 text-red-600 border border-red-100 animate-pulse" };
    }
    if (daysDiff <= 30) {
      return { text: `Vence en ${daysDiff} días`, css: "bg-red-50 text-red-600 border border-red-100 font-bold" };
    }
    if (daysDiff <= 90) {
      return { text: `Vence en ${daysDiff} días`, css: "bg-amber-50 text-amber-700 border border-amber-200" };
    }
    return { text: `Vence ${lot.expiryDate}`, css: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
  };

  // Filters search query
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredLots = lots.filter((lot) => {
    const prod = inventory.find((p) => p.id === lot.productId);
    const prodName = prod ? prod.name : "";
    return (
      lot.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.physicalLocation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredProviders = providers.filter((prov) =>
    prov.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prov.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prov.nit.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="paunova-card rounded-[2rem] p-6 md:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <p className="paunova-kicker mb-2">Control de insumos y trazabilidad</p>
          <h1 className="paunova-title text-3xl md:text-4xl">
            Inventario de la <span className="italic">Clínica</span>
          </h1>
          <p className="text-sm text-[#746b61] mt-3 max-w-2xl leading-6">
            Gestión integrada de productos de cabina, lotes INVIMA con semáforo de caducidad y base de datos de proveedores oficiales.
          </p>
        </div>
      </div>

      {/* Tabs list and search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#d2c4bb]/20 pb-3">
        <div className="flex gap-4">
          {[
            ["catalog", "Catálogo de Productos", "science"],
            ["lots", "Lotes en Stock", "calendar_today"],
            ["providers", "Proveedores", "group"],
          ].map(([id, label, icon]) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id as any);
                setSearchQuery("");
                setNotice("");
              }}
              className={`pb-2 text-xs font-semibold uppercase tracking-wider font-sans border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === id
                  ? "border-[#6d5847] text-[#6d5847]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="material-symbols-outlined text-xs">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Global Tab Search & Action */}
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#d2c4bb]/30 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#6d5847] text-[#1b1c1c]"
            />
          </div>

          {activeTab === "catalog" && (
            <button
              onClick={() => openProductModal(null)}
              className="paunova-button-primary px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Nuevo Producto</span>
            </button>
          )}

          {activeTab === "lots" && (
            <button
              onClick={() => openLotModal(null)}
              className="paunova-button-primary px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">library_add</span>
              <span>Registrar Lote</span>
            </button>
          )}

          {activeTab === "providers" && (
            <button
              onClick={() => openProviderModal(null)}
              className="paunova-button-primary px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Nuevo Proveedor</span>
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          {notice}
        </div>
      )}

      {/* Main content table */}
      <div className="paunova-table-wrap rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "catalog" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d2c4bb]/10 text-gray-400 text-[10px] uppercase tracking-wider font-semibold font-sans bg-[#FDFBF7] px-6">
                  <th className="px-6 py-4 font-semibold">SKU / ID</th>
                  <th className="px-6 py-4 font-semibold">Producto</th>
                  <th className="px-6 py-4 font-semibold">Categoría</th>
                  <th className="px-6 py-4 font-semibold">Marca / Presentación</th>
                  <th className="px-6 py-4 font-semibold">Registro INVIMA</th>
                  <th className="px-6 py-4 font-semibold text-right">Stock Actual</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2c4bb]/10 text-xs font-sans">
                {filteredInventory.map((item) => {
                  const isLow = item.units <= item.minUnits;
                  return (
                    <tr key={item.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-400">{item.id}</td>
                      <td className="px-6 py-4 font-semibold text-[#1b1c1c]">{item.name}</td>
                      <td className="px-6 py-4 text-gray-500">{item.category}</td>
                      <td className="px-6 py-4">
                        <span className="block font-semibold text-[#6d5847]">{item.brand || "—"}</span>
                        <span className="text-[10px] text-gray-400">{item.presentation || "—"}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono">{item.invimaRef || "No Registrado"}</td>
                      <td className="px-6 py-4 text-right font-bold text-[#6d5847]">
                        {item.units} {item.unitName}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                          isLow ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                          {isLow ? "Stock Bajo" : "Suficiente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openProductModal(item)}
                          className="text-[#c5a880] hover:text-[#6d5847] font-semibold transition-all inline-flex items-center gap-1 active:scale-[0.95]"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeTab === "lots" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d2c4bb]/10 text-gray-400 text-[10px] uppercase tracking-wider font-semibold font-sans bg-[#FDFBF7] px-6">
                  <th className="px-6 py-4 font-semibold">Lote</th>
                  <th className="px-6 py-4 font-semibold">Producto</th>
                  <th className="px-6 py-4 font-semibold">Ubicación Física</th>
                  <th className="px-6 py-4 font-semibold">Proveedor</th>
                  <th className="px-6 py-4 font-semibold text-right">Costo unit.</th>
                  <th className="px-6 py-4 font-semibold text-right">Stock</th>
                  <th className="px-6 py-4 font-semibold">Vencimiento</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2c4bb]/10 text-xs font-sans">
                {filteredLots.map((lot) => {
                  const prod = inventory.find((p) => p.id === lot.productId);
                  const prov = providers.find((p) => p.id === lot.providerId);
                  const expiry = getExpiryLabel(lot);

                  return (
                    <tr key={lot.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#6d5847]">{lot.lotNumber}</td>
                      <td className="px-6 py-4">
                        <span className="block font-semibold text-[#1b1c1c]">{prod ? prod.name : lot.productId}</span>
                        <span className="text-[9px] font-mono text-gray-400">SKU: {lot.productId}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-semibold">{lot.physicalLocation || "Por ubicar"}</td>
                      <td className="px-6 py-4 text-gray-500">{prov ? prov.companyName : lot.providerId}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-500">
                        ${lot.costUnitCop.toLocaleString()} COP
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        <span className="text-[#1b1c1c]">{lot.currentQty}</span>
                        <span className="text-gray-400"> / {lot.initialQty} {prod?.unitName || "ud"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold ${expiry.css}`}>
                          {expiry.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openLotModal(lot)}
                          className="text-[#c5a880] hover:text-[#6d5847] font-semibold transition-all inline-flex items-center gap-1 active:scale-[0.95]"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                          <span>Ajustar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeTab === "providers" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d2c4bb]/10 text-gray-400 text-[10px] uppercase tracking-wider font-semibold font-sans bg-[#FDFBF7] px-6">
                  <th className="px-6 py-4 font-semibold">NIT</th>
                  <th className="px-6 py-4 font-semibold">Empresa</th>
                  <th className="px-6 py-4 font-semibold">Tipo Actor</th>
                  <th className="px-6 py-4 font-semibold">Contacto Principal</th>
                  <th className="px-6 py-4 font-semibold">Teléfono / Email</th>
                  <th className="px-6 py-4 font-semibold">Ubicación</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2c4bb]/10 text-xs font-sans">
                {filteredProviders.map((prov) => (
                  <tr key={prov.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-400 font-bold">{prov.nit}</td>
                    <td className="px-6 py-4 font-semibold text-[#1b1c1c]">{prov.companyName}</td>
                    <td className="px-6 py-4 text-gray-500 font-semibold">{prov.actorType}</td>
                    <td className="px-6 py-4 text-gray-600">{prov.contactName}</td>
                    <td className="px-6 py-4">
                      <span className="block font-semibold text-[#6d5847]">{prov.phone}</span>
                      <span className="text-[10px] text-gray-400 block">{prov.email}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{prov.city}, {prov.country}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openProviderModal(prov)}
                        className="text-[#c5a880] hover:text-[#6d5847] font-semibold transition-all inline-flex items-center gap-1 active:scale-[0.95]"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        <span>Editar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL 1: Product Add / Edit */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1d1c19]/45 backdrop-blur-sm" onClick={() => setProductModalOpen(false)} />
          <div className="paunova-card max-w-md w-full rounded-[2rem] p-6 relative z-10 space-y-6">
            <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-3">
              <h3 className="paunova-title text-2xl">
                {selectedProduct ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-[#6d5847] hover:text-[#c5a880]">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-[#9b3f36]/18 bg-[#fff7f4] px-4 py-3 text-xs font-medium text-[#9b3f36]">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    ID / SKU *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!selectedProduct}
                    value={prodId}
                    onChange={(e) => setProdId(e.target.value.toUpperCase())}
                    placeholder="Ej. TX-BOTOX-100"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] disabled:opacity-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Categoría *
                  </label>
                  <select
                    required
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  >
                    <option value="Inyectable">Inyectable</option>
                    <option value="Exfoliante">Exfoliante</option>
                    <option value="Equipo/Accesorios">Equipo/Accesorios</option>
                    <option value="Cuidado Post-Láser">Cuidado Post-Láser</option>
                    <option value="Anestésico">Anestésico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                  Nombre Comercial *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ej. Botox Cosmetic Vial 100U"
                  className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="Ej. Allergan"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Presentación
                  </label>
                  <input
                    type="text"
                    value={prodPresentation}
                    onChange={(e) => setProdPresentation(e.target.value)}
                    placeholder="Ej. Ampolla 100 UI / Caja 1 vial"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Registro INVIMA / NSO
                  </label>
                  <input
                    type="text"
                    value={prodInvima}
                    onChange={(e) => setProdInvima(e.target.value)}
                    placeholder="Ej. INVIMA 2020M-001092"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Min. Stock
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={prodMinUnits}
                      onChange={(e) => setProdMinUnits(Number(e.target.value))}
                      className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Unidad
                    </label>
                    <input
                      type="text"
                      required
                      value={prodUnitName}
                      onChange={(e) => setProdUnitName(e.target.value)}
                      placeholder="viales"
                      className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="paunova-button-secondary flex-1 py-2.5 rounded-full transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="paunova-button-primary flex-1 py-2.5 rounded-full transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Lot Add / Edit */}
      {lotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1d1c19]/45 backdrop-blur-sm" onClick={() => setLotModalOpen(false)} />
          <div className="paunova-card max-w-md w-full rounded-[2rem] p-6 relative z-10 space-y-6">
            <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-3">
              <h3 className="paunova-title text-2xl">
                {selectedLot ? "Ajustar Lote Físico" : "Nuevo Lote de Insumo"}
              </h3>
              <button onClick={() => setLotModalOpen(false)} className="text-[#6d5847] hover:text-[#c5a880]">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-[#9b3f36]/18 bg-[#fff7f4] px-4 py-3 text-xs font-medium text-[#9b3f36]">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveLot} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                  Producto / Insumo *
                </label>
                <select
                  required
                  disabled={!!selectedLot}
                  value={lotProductId}
                  onChange={(e) => setLotProductId(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] disabled:opacity-50"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.id}] {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Número de Lote *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!selectedLot}
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value.toUpperCase())}
                    placeholder="Ej. LOT-XE24A"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] disabled:opacity-50 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={lotExpiryDate}
                    onChange={(e) => setLotExpiryDate(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Código de Serie / Nro Único
                  </label>
                  <input
                    type="text"
                    value={lotSerial}
                    onChange={(e) => setLotSerial(e.target.value)}
                    placeholder="Opcional"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Proveedor *
                  </label>
                  <select
                    required
                    value={lotProviderId}
                    onChange={(e) => setLotProviderId(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Costo unitario (COP) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={lotCost}
                    onChange={(e) => setLotCost(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] font-mono"
                  />
                </div>

                {selectedLot ? (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Cant. Actual *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={lotCurrentQty}
                      onChange={(e) => setLotCurrentQty(Number(e.target.value))}
                      className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                      Cant. Inicial *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={lotInitialQty}
                      onChange={(e) => setLotInitialQty(Number(e.target.value))}
                      className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Estado *
                  </label>
                  <select
                    required
                    value={lotStatus}
                    onChange={(e) => setLotStatus(e.target.value as any)}
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  >
                    <option value="activo">Activo</option>
                    <option value="agotado">Agotado</option>
                    <option value="bloqueo">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                  Ubicación Física *
                </label>
                <input
                  type="text"
                  required
                  value={lotLocation}
                  onChange={(e) => setLotLocation(e.target.value)}
                  placeholder="Ej. Nevera 1 / Locker A3"
                  className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setLotModalOpen(false)}
                  className="paunova-button-secondary flex-1 py-2.5 rounded-full transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="paunova-button-primary flex-1 py-2.5 rounded-full transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar Lote"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Provider Add / Edit */}
      {providerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1d1c19]/45 backdrop-blur-sm" onClick={() => setProviderModalOpen(false)} />
          <div className="paunova-card max-w-md w-full rounded-[2rem] p-6 relative z-10 space-y-6">
            <div className="flex justify-between items-center border-b border-[#d2c4bb]/20 pb-3">
              <h3 className="paunova-title text-2xl">
                {selectedProvider ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h3>
              <button onClick={() => setProviderModalOpen(false)} className="text-[#6d5847] hover:text-[#c5a880]">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-[#9b3f36]/18 bg-[#fff7f4] px-4 py-3 text-xs font-medium text-[#9b3f36]">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveProvider} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    NIT / Identificación *
                  </label>
                  <input
                    type="text"
                    required
                    value={provNit}
                    onChange={(e) => setProvNit(e.target.value)}
                    placeholder="Ej. NIT 900.123.456-7"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Tipo de Actor *
                  </label>
                  <select
                    required
                    value={provActorType}
                    onChange={(e) => setProvActorType(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  >
                    <option value="Fabricante">Fabricante</option>
                    <option value="Importador">Importador</option>
                    <option value="Distribuidor">Distribuidor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                  Razón Social / Nombre Comercial *
                </label>
                <input
                  type="text"
                  required
                  value={provCompanyName}
                  onChange={(e) => setProvCompanyName(e.target.value)}
                  placeholder="Ej. Merz Colombia S.A."
                  className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                  Nombre de Contacto *
                </label>
                <input
                  type="text"
                  required
                  value={provContactName}
                  onChange={(e) => setProvContactName(e.target.value)}
                  placeholder="Ej. Sandra Pérez"
                  className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    required
                    value={provPhone}
                    onChange={(e) => setProvPhone(e.target.value)}
                    placeholder="Ej. +57 300 123 4567"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={provEmail}
                    onChange={(e) => setProvEmail(e.target.value)}
                    placeholder="Ej. ventas@merz.co"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={provCity}
                    onChange={(e) => setProvCity(e.target.value)}
                    placeholder="Ej. Buga"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6d5847] font-semibold mb-1.5">
                    País *
                  </label>
                  <input
                    type="text"
                    required
                    value={provCountry}
                    onChange={(e) => setProvCountry(e.target.value)}
                    placeholder="Ej. Colombia"
                    className="w-full bg-[#FDFBF7] border border-[#d2c4bb]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6d5847]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setProviderModalOpen(false)}
                  className="paunova-button-secondary flex-1 py-2.5 rounded-full transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="paunova-button-primary flex-1 py-2.5 rounded-full transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar Proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
