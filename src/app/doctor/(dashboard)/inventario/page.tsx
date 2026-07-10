import React from "react";
import { db } from "@/lib/db";
import InventarioCliente from "@/components/doctor/InventarioCliente";

export const revalidate = 0; // Disable cache to fetch real-time updates

export default async function DoctorInventario() {
  const inventory = await db.getInventory();
  const lots = await db.getLots();
  const providers = await db.getProviders();

  return (
    <InventarioCliente
      initialInventory={inventory}
      initialLots={lots}
      initialProviders={providers}
    />
  );
}
