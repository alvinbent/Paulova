import type { Appointment, InventoryItem, Patient } from "@/lib/db";

export type DashboardData = {
  patients: Patient[];
  todayAppointments: Appointment[];
  nextAppointments: Appointment[];
  lowStockItems: InventoryItem[];
  currentDate: string;
};

export type MetricTone = "gold" | "rose" | "taupe" | "sage";
