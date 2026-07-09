import React from "react";
import { db } from "@/lib/db";
import InventarioClient from "@/components/doctor/InventarioClient";

export const revalidate = 0; // Disable cache to fetch real-time updates

export default async function DoctorInventario() {
  const inventory = await db.getInventory();

  return <InventarioClient initialInventory={inventory} />;
}
