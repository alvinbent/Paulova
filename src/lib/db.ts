import { promises as fs } from "fs";
import path from "path";
import { google } from "googleapis";

const DB_DIR =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "paunova-db")
    : path.join(process.cwd(), ".dev-db");

// Google Sheets credentials from .env.local
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

type SheetsClient = ReturnType<typeof google.sheets>;
type SheetRow = string[];

let sheetsClient: SheetsClient | null = null;

function normalizeRows(rows: unknown): SheetRow[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter((row): row is unknown[] => Array.isArray(row))
    .map((row) => row.map((cell) => String(cell ?? "")));
}

function normalizeAppointmentStatus(value: string): Appointment["status"] {
  if (value === "Completada" || value === "Cancelada") return value;
  return "Programada";
}

function normalizeInventoryCategory(value: string): InventoryItem["category"] {
  const allowed: InventoryItem["category"][] = [
    "Inyectable",
    "Exfoliante",
    "Equipo/Accesorios",
    "Cuidado Post-Láser",
    "Anestésico",
  ];

  return allowed.includes(value as InventoryItem["category"])
    ? (value as InventoryItem["category"])
    : "Inyectable";
}

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  if (!clientEmail || !privateKey || !spreadsheetId || spreadsheetId === "1AbCdEfGhIJkLmNopQRstuVWXyz123456789") {
    return null;
  }
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    sheetsClient = google.sheets({ version: "v4", auth });
    return sheetsClient;
  } catch (err) {
    console.error("Failed to initialize Google Sheets client:", err);
    return null;
  }
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  notes: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  treatment: string;
  status: "Programada" | "Completada" | "Cancelada";
  notes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Inyectable" | "Exfoliante" | "Equipo/Accesorios" | "Cuidado Post-Láser" | "Anestésico";
  units: number;
  minUnits: number;
  unitName: string;
  brand?: string;
  presentation?: string;
  invimaRef?: string;
}

export interface Provider {
  id: string;
  companyName: string;
  nit: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  actorType: string;
}

export interface Lot {
  id: string;
  productId: string;
  lotNumber: string;
  expiryDate: string;
  serialNumber?: string;
  providerId: string;
  costUnitCop: number;
  initialQty: number;
  currentQty: number;
  physicalLocation: string;
  status: "activo" | "agotado" | "bloqueo";
}

export interface Protocol {
  id: string;
  name: string;
  indications: string;
  contraindications: string;
  recommendedSessions: number;
  notes: string;
  active: boolean;
}

export interface ProtocolItem {
  id: string;
  protocolId: string;
  productId: string;
  standardQuantity: number;
  unitName: string;
  optional: boolean;
}

export interface TreatmentApplied {
  id: string;
  treatmentName: string;
  productUsedId?: string;
  productNameUsed?: string;
  productQuantityUsed?: number;
  details: string;
  date: string;
  lotUsedId?: string;
  lotNumberUsed?: string;
  adverseEvent?: string;
  consentStatus?: "Firmado" | "Pendiente" | "No Aplica";
  priceChargedCop?: number;
}

export interface ClinicalRecord {
  patientId: string;
  allergies: string;
  skinType: string;
  notes: string;
  treatmentsApplied: TreatmentApplied[];
}

const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Sofía Rodríguez",
    phone: "+57 315 789 4512",
    email: "sofia.rod@gmail.com",
    birthday: "1994-08-14",
    notes: "Paciente recurrente. Piel mixta con tendencia a rosácea leve.",
    createdAt: "2026-05-10T12:00:00.000Z",
  },
  {
    id: "p2",
    name: "Mateo Gómez",
    phone: "+57 320 456 7890",
    email: "mateo.gomez@yahoo.com",
    birthday: "1988-11-22",
    notes: "Sufre de acné vulgar controlado. Asiste para mantenimiento.",
    createdAt: "2026-06-01T15:30:00.000Z",
  },
  {
    id: "p3",
    name: "Valeria Cárdenas",
    phone: "+57 301 234 5678",
    email: "valecar@hotmail.com",
    birthday: "1991-03-05",
    notes: "Interesada en Toxina Botulínica y Ácido Hialurónico. Primera consulta.",
    createdAt: "2026-07-08T10:15:00.000Z",
  },
];

const mockAppointments = (): Appointment[] => {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return [
    {
      id: "a1",
      patientId: "p2",
      patientName: "Mateo Gómez",
      date: today,
      time: "14:00",
      treatment: "Limpieza Facial Hydrash Profunda",
      status: "Programada",
      notes: "Sesión de mantenimiento mensual.",
    },
    {
      id: "a2",
      patientId: "p1",
      patientName: "Sofía Rodríguez",
      date: today,
      time: "16:30",
      treatment: "Toxina Botulínica",
      status: "Programada",
      notes: "Retoque en tercio superior facial.",
    },
    {
      id: "a3",
      patientId: "p3",
      patientName: "Valeria Cárdenas",
      date: tomorrow,
      time: "09:00",
      treatment: "Valoración Inicial",
      status: "Programada",
      notes: "Consulta de diagnóstico y plan de tratamientos.",
    },
  ];
};

const mockInventory: InventoryItem[] = [
  {
    id: "i1",
    name: "Ácido Hialurónico (Juvederm Ultra 4)",
    category: "Inyectable",
    units: 8,
    minUnits: 3,
    unitName: "viales",
  },
  {
    id: "i2",
    name: "Toxina Botulínica (Dysport 500U)",
    category: "Inyectable",
    units: 180,
    minUnits: 50,
    unitName: "unidades",
  },
  {
    id: "i3",
    name: "Cabezales de Succión Hydrash",
    category: "Equipo/Accesorios",
    units: 4,
    minUnits: 6,
    unitName: "piezas",
  },
  {
    id: "i4",
    name: "Crema Anestésica Lidocaína 15%",
    category: "Anestésico",
    units: 2,
    minUnits: 2,
    unitName: "tubos",
  },
  {
    id: "i5",
    name: "Cartucho Agujas Nanopore (12 pines)",
    category: "Equipo/Accesorios",
    units: 12,
    minUnits: 10,
    unitName: "cartuchos",
  },
  {
    id: "i6",
    name: "Gel Conductor Spectrum Mask",
    category: "Cuidado Post-Láser",
    units: 1,
    minUnits: 2,
    unitName: "galón",
  },
];

const mockClinicalRecords: ClinicalRecord[] = [
  {
    patientId: "p1",
    allergies: "Ninguna conocida",
    skinType: "Mixta y Sensible",
    notes: "Paciente busca atenuar líneas de expresión finas en frente y patas de gallo.",
    treatmentsApplied: [
      {
        id: "t1",
        treatmentName: "Revitalización Profunda",
        productUsedId: "i1",
        productNameUsed: "Ácido Hialurónico (Juvederm Ultra 4)",
        productQuantityUsed: 1,
        details: "Aplicación de 1 jeringa de AH en tercio medio.",
        date: "2026-05-15",
      },
    ],
  },
  {
    patientId: "p2",
    allergies: "Polen",
    skinType: "Grasa con tendencia acneica",
    notes: "Control de grasa e hiperpigmentación post-inflamatoria.",
    treatmentsApplied: [
      {
        id: "t2",
        treatmentName: "Limpieza Facial Hydrash",
        productUsedId: "i3",
        productNameUsed: "Cabezales de Succión Hydrash",
        productQuantityUsed: 1,
        details: "Protocolo completo de succión y exfoliación.",
        date: "2026-06-05",
      },
    ],
  },
  {
    patientId: "p3",
    allergies: "Látex",
    skinType: "Seca",
    notes: "Interesada en hidratación profunda.",
    treatmentsApplied: [],
  },
];

async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {
    // Ya existe o no se puede crear
  }
}

async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDir(DB_DIR);
  const filePath = path.join(DB_DIR, filename);
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    try {
      await writeJsonFile(filename, defaultValue);
    } catch {
      return defaultValue;
    }
    return defaultValue;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDir(DB_DIR);
  const filePath = path.join(DB_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export const db = {
  // --- PACIENTES ---
  async getPatients(): Promise<Patient[]> {
    const client = getSheetsClient();
    if (!client) {
      return readJsonFile<Patient[]>("patients.json", mockPatients);
    }
    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Pacientes!A2:G1000",
      });
      const rows = normalizeRows(response.data.values);
      return rows.map((row) => ({
        id: row[0] || "",
        name: row[1] || "",
        phone: row[2] || "",
        email: row[3] || "",
        birthday: row[4] || "",
        notes: row[5] || "",
        createdAt: row[6] || "",
      }));
    } catch (err) {
      console.error("Error reading patients from Sheets, using local fallback:", err);
      return readJsonFile<Patient[]>("patients.json", mockPatients);
    }
  },

  async getPatient(id: string): Promise<Patient | undefined> {
    const list = await this.getPatients();
    return list.find((p) => p.id === id);
  },

  async createPatient(patient: Omit<Patient, "id" | "createdAt">): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: `p_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const client = getSheetsClient();
    if (!client) {
      const list = await this.getPatients();
      list.push(newPatient);
      await writeJsonFile("patients.json", list);
      return newPatient;
    }

    try {
      await client.spreadsheets.values.append({
        spreadsheetId,
        range: "Pacientes!A2",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            newPatient.id,
            newPatient.name,
            newPatient.phone,
            newPatient.email,
            newPatient.birthday,
            newPatient.notes,
            newPatient.createdAt
          ]]
        }
      });
      return newPatient;
    } catch (err) {
      console.error("Error writing patient to Sheets, writing local fallback:", err);
      const list = await readJsonFile<Patient[]>("patients.json", mockPatients);
      list.push(newPatient);
      await writeJsonFile("patients.json", list);
      return newPatient;
    }
  },

  // --- CITAS ---
  async getAppointments(): Promise<Appointment[]> {
    const client = getSheetsClient();
    if (!client) {
      return readJsonFile<Appointment[]>("appointments.json", mockAppointments());
    }
    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Citas!A2:H1000",
      });
      const rows = normalizeRows(response.data.values);
      return rows.map((row) => ({
        id: row[0] || "",
        patientId: row[1] || "",
        patientName: row[2] || "",
        date: row[3] || "",
        time: row[4] || "",
        treatment: row[5] || "",
        status: normalizeAppointmentStatus(row[6]),
        notes: row[7] || "",
      }));
    } catch (err) {
      console.error("Error reading appointments from Sheets, using local fallback:", err);
      return readJsonFile<Appointment[]>("appointments.json", mockAppointments());
    }
  },

  async getAppointmentsByDate(dateStr: string): Promise<Appointment[]> {
    const list = await this.getAppointments();
    return list.filter((a) => a.date === dateStr);
  },

  async createAppointment(appt: Omit<Appointment, "id">): Promise<Appointment> {
    const newAppt: Appointment = {
      ...appt,
      id: `a_${Date.now()}`,
    };

    const client = getSheetsClient();
    if (!client) {
      const list = await this.getAppointments();
      list.push(newAppt);
      await writeJsonFile("appointments.json", list);
      return newAppt;
    }

    try {
      await client.spreadsheets.values.append({
        spreadsheetId,
        range: "Citas!A2",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            newAppt.id,
            newAppt.patientId,
            newAppt.patientName,
            newAppt.date,
            newAppt.time,
            newAppt.treatment,
            newAppt.status,
            newAppt.notes
          ]]
        }
      });
      return newAppt;
    } catch (err) {
      console.error("Error writing appointment to Sheets, writing local fallback:", err);
      const list = await readJsonFile<Appointment[]>("appointments.json", mockAppointments());
      list.push(newAppt);
      await writeJsonFile("appointments.json", list);
      return newAppt;
    }
  },

  async updateAppointmentStatus(id: string, status: Appointment["status"]): Promise<Appointment | undefined> {
    const client = getSheetsClient();
    if (!client) {
      const list = await this.getAppointments();
      const appt = list.find((a) => a.id === id);
      if (!appt) return undefined;
      appt.status = status;
      await writeJsonFile("appointments.json", list);
      return appt;
    }

    try {
      const appts = await this.getAppointments();
      const index = appts.findIndex((a) => a.id === id);
      if (index === -1) return undefined;

      const appt = appts[index];
      appt.status = status;

      // Update G column (status)
      const rowNum = index + 2;
      await client.spreadsheets.values.update({
        spreadsheetId,
        range: `Citas!G${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[status]]
        }
      });

      return appt;
    } catch (err) {
      console.error("Error updating appointment in Sheets, writing local fallback:", err);
      const list = await readJsonFile<Appointment[]>("appointments.json", mockAppointments());
      const appt = list.find((a) => a.id === id);
      if (!appt) return undefined;
      appt.status = status;
      await writeJsonFile("appointments.json", list);
      return appt;
    }
  },

  // --- INVENTARIO ---
  async getInventory(): Promise<InventoryItem[]> {
    const client = getSheetsClient();
    if (!client) {
      return readJsonFile<InventoryItem[]>("inventory.json", mockInventory);
    }
    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Inventario!A2:I1000",
      });
      const rows = normalizeRows(response.data.values);
      return rows.map((row) => ({
        id: row[0] || "",
        name: row[1] || "",
        category: normalizeInventoryCategory(row[2]),
        units: Number(row[3]) || 0,
        minUnits: Number(row[4]) || 0,
        unitName: row[5] || "",
        brand: row[6] || "",
        presentation: row[7] || "",
        invimaRef: row[8] || "",
      }));
    } catch (err) {
      console.error("Error reading inventory from Sheets, using local fallback:", err);
      return readJsonFile<InventoryItem[]>("inventory.json", mockInventory);
    }
  },

  async updateInventoryStock(id: string, units: number): Promise<InventoryItem | undefined> {
    const client = getSheetsClient();
    if (!client) {
      const list = await this.getInventory();
      const item = list.find((i) => i.id === id);
      if (!item) return undefined;
      item.units = units;
      await writeJsonFile("inventory.json", list);
      return item;
    }

    try {
      const items = await this.getInventory();
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) return undefined;

      const item = items[index];
      item.units = units;

      const rowNum = index + 2;
      await client.spreadsheets.values.update({
        spreadsheetId,
        range: `Inventario!D${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[units]]
        }
      });

      return item;
    } catch (err) {
      console.error("Error updating inventory in Sheets, writing local fallback:", err);
      const list = await readJsonFile<InventoryItem[]>("inventory.json", mockInventory);
      const item = list.find((i) => i.id === id);
      if (!item) return undefined;
      item.units = units;
      await writeJsonFile("inventory.json", list);
      return item;
    }
  },

  async deductInventoryStock(id: string, quantity: number): Promise<InventoryItem | undefined> {
    const client = getSheetsClient();
    if (!client) {
      const list = await this.getInventory();
      const item = list.find((i) => i.id === id);
      if (!item) return undefined;
      item.units = Math.max(0, item.units - quantity);
      await writeJsonFile("inventory.json", list);
      return item;
    }

    try {
      const items = await this.getInventory();
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) return undefined;

      const item = items[index];
      const newUnits = Math.max(0, item.units - quantity);
      item.units = newUnits;

      const rowNum = index + 2;
      await client.spreadsheets.values.update({
        spreadsheetId,
        range: `Inventario!D${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[newUnits]]
        }
      });

      return item;
    } catch (err) {
      console.error("Error deducting inventory in Sheets, writing local fallback:", err);
      const list = await readJsonFile<InventoryItem[]>("inventory.json", mockInventory);
      const item = list.find((i) => i.id === id);
      if (!item) return undefined;
      item.units = Math.max(0, item.units - quantity);
      await writeJsonFile("inventory.json", list);
      return item;
    }
  },

  async addProduct(product: Omit<InventoryItem, "units">): Promise<InventoryItem> {
    const client = getSheetsClient();
    const newItem: InventoryItem = {
      ...product,
      units: 0,
      brand: product.brand || "",
      presentation: product.presentation || "",
      invimaRef: product.invimaRef || "",
    };

    if (!client) {
      const list = await this.getInventory();
      list.push(newItem);
      await writeJsonFile("inventory.json", list);
      return newItem;
    }

    try {
      await client.spreadsheets.values.append({
        spreadsheetId,
        range: "Inventario!A2",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            newItem.id,
            newItem.name,
            newItem.category,
            0,
            newItem.minUnits,
            newItem.unitName,
            newItem.brand,
            newItem.presentation,
            newItem.invimaRef
          ]]
        }
      });
      return newItem;
    } catch (err) {
      console.error("Error adding product to Sheets, using local fallback:", err);
      const list = await this.getInventory();
      list.push(newItem);
      await writeJsonFile("inventory.json", list);
      return newItem;
    }
  },

  async updateProduct(id: string, product: Omit<InventoryItem, "units">): Promise<InventoryItem | undefined> {
    const client = getSheetsClient();
    const list = await this.getInventory();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) return undefined;

    const currentItem = list[index];
    const updatedItem = {
      ...currentItem,
      name: product.name,
      category: product.category,
      minUnits: product.minUnits,
      unitName: product.unitName,
      brand: product.brand || "",
      presentation: product.presentation || "",
      invimaRef: product.invimaRef || "",
    };

    if (!client) {
      list[index] = updatedItem;
      await writeJsonFile("inventory.json", list);
      return updatedItem;
    }

    try {
      const rowNum = index + 2;
      await client.spreadsheets.values.update({
        spreadsheetId,
        range: `Inventario!A${rowNum}:I${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            updatedItem.id,
            updatedItem.name,
            updatedItem.category,
            updatedItem.units,
            updatedItem.minUnits,
            updatedItem.unitName,
            updatedItem.brand,
            updatedItem.presentation,
            updatedItem.invimaRef
          ]]
        }
      });
      return updatedItem;
    } catch (err) {
      console.error("Error updating product in Sheets, using local fallback:", err);
      list[index] = updatedItem;
      await writeJsonFile("inventory.json", list);
      return updatedItem;
    }
  },

  // --- LOTES ---
  async getLots(): Promise<Lot[]> {
    const client = getSheetsClient();
    if (!client) {
      return readJsonFile<Lot[]>("lots.json", []);
    }
    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Lotes!A2:K1000",
      });
      const rows = normalizeRows(response.data.values);
      return rows.map((row) => ({
        id: row[0] || "",
        productId: row[1] || "",
        lotNumber: row[2] || "",
        expiryDate: row[3] || "",
        serialNumber: row[4] || "",
        providerId: row[5] || "",
        costUnitCop: Number(row[6]) || 0,
        initialQty: Number(row[7]) || 0,
        currentQty: Number(row[8]) || 0,
        physicalLocation: row[9] || "",
        status: (row[10] as Lot["status"]) || "activo",
      }));
    } catch (err) {
      console.error("Error reading lots from Sheets:", err);
      return readJsonFile<Lot[]>("lots.json", []);
    }
  },

  async addLot(lot: Lot): Promise<Lot> {
    const client = getSheetsClient();

    if (!client) {
      const list = await this.getLots();
      list.push(lot);
      await writeJsonFile("lots.json", list);

      // Update inventory total units
      const inventory = await this.getInventory();
      const product = inventory.find((p) => p.id === lot.productId);
      if (product) {
        product.units += lot.initialQty;
        await writeJsonFile("inventory.json", inventory);
      }
      return lot;
    }

    try {
      await client.spreadsheets.values.append({
        spreadsheetId,
        range: "Lotes!A2",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            lot.id,
            lot.productId,
            lot.lotNumber,
            lot.expiryDate,
            lot.serialNumber || "",
            lot.providerId,
            lot.costUnitCop,
            lot.initialQty,
            lot.currentQty,
            lot.physicalLocation,
            lot.status
          ]]
        }
      });

      // Update the product's units in Inventario
      const inventory = await this.getInventory();
      const index = inventory.findIndex((p) => p.id === lot.productId);
      if (index !== -1) {
        const product = inventory[index];
        const newUnits = product.units + lot.initialQty;
        product.units = newUnits;
        const rowNum = index + 2;
        await client.spreadsheets.values.update({
          spreadsheetId,
          range: `Inventario!D${rowNum}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[newUnits]]
          }
        });
      }
      return lot;
    } catch (err) {
      console.error("Error writing lot to Sheets:", err);
      const list = await this.getLots();
      list.push(lot);
      await writeJsonFile("lots.json", list);
      return lot;
    }
  },

  async deductLotStock(lotId: string, quantity: number): Promise<Lot | undefined> {
    const client = getSheetsClient();
    const lots = await this.getLots();
    const lotIndex = lots.findIndex((l) => l.id === lotId);
    if (lotIndex === -1) return undefined;

    const lot = lots[lotIndex];
    const newQty = Math.max(0, lot.currentQty - quantity);
    const difference = lot.currentQty - newQty;
    lot.currentQty = newQty;

    if (lot.currentQty === 0) {
      lot.status = "agotado";
    }

    if (!client) {
      await writeJsonFile("lots.json", lots);

      // Update inventory total units
      const inventory = await this.getInventory();
      const product = inventory.find((p) => p.id === lot.productId);
      if (product) {
        product.units = Math.max(0, product.units - difference);
        await writeJsonFile("inventory.json", inventory);
      }
      return lot;
    }

    try {
      const rowNum = lotIndex + 2;
      await client.spreadsheets.values.update({
        spreadsheetId,
        range: `Lotes!I${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[newQty]]
        }
      });

      if (lot.currentQty === 0) {
        await client.spreadsheets.values.update({
          spreadsheetId,
          range: `Lotes!K${rowNum}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [["agotado"]]
          }
        });
      }

      // Update general product units in Inventario
      const inventory = await this.getInventory();
      const index = inventory.findIndex((p) => p.id === lot.productId);
      if (index !== -1) {
        const product = inventory[index];
        const newUnits = Math.max(0, product.units - difference);
        product.units = newUnits;
        const pRowNum = index + 2;
        await client.spreadsheets.values.update({
          spreadsheetId,
          range: `Inventario!D${pRowNum}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[newUnits]]
          }
        });
      }
      return lot;
    } catch (err) {
      console.error("Error deducting lot stock in Sheets:", err);
      await writeJsonFile("lots.json", lots);
      return lot;
    }
  },

  async adjustLotStockDirect(lotId: string, quantity: number): Promise<Lot | undefined> {
    const client = getSheetsClient();
    const lots = await this.getLots();
    const lotIndex = lots.findIndex((l) => l.id === lotId);
    if (lotIndex === -1) return undefined;

    const lot = lots[lotIndex];
    lot.currentQty = lot.currentQty + quantity;
    if (lot.currentQty > 0 && lot.status === "agotado") {
      lot.status = "activo";
    }

    if (!client) {
      await writeJsonFile("lots.json", lots);
      const inventory = await this.getInventory();
      const product = inventory.find((p) => p.id === lot.productId);
      if (product) {
        product.units = product.units + quantity;
        await writeJsonFile("inventory.json", inventory);
      }
      return lot;
    }

    try {
      const rowNum = lotIndex + 2;
      await client.spreadsheets.values.update({
        spreadsheetId,
        range: `Lotes!I${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[lot.currentQty]]
        }
      });
      await client.spreadsheets.values.update({
        spreadsheetId,
        range: `Lotes!K${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[lot.status]]
        }
      });

      // Update general product units in Inventario
      const inventory = await this.getInventory();
      const index = inventory.findIndex((p) => p.id === lot.productId);
      if (index !== -1) {
        const product = inventory[index];
        const newUnits = product.units + quantity;
        product.units = newUnits;
        const pRowNum = index + 2;
        await client.spreadsheets.values.update({
          spreadsheetId,
          range: `Inventario!D${pRowNum}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[newUnits]]
          }
        });
      }
      return lot;
    } catch (err) {
      console.error("Error adjusting lot stock directly:", err);
      await writeJsonFile("lots.json", lots);
      return lot;
    }
  },

  async updateLotDirect(id: string, updated: Omit<Lot, "id" | "productId" | "initialQty" | "lotNumber">): Promise<Lot | undefined> {
    const client = getSheetsClient();
    const lots = await this.getLots();
    const index = lots.findIndex((l) => l.id === id);
    if (index === -1) return undefined;

    const current = lots[index];
    const oldQty = current.currentQty;
    const newQty = updated.currentQty;
    const difference = newQty - oldQty;

    const updatedLot = {
      ...current,
      expiryDate: updated.expiryDate,
      serialNumber: updated.serialNumber || "",
      providerId: updated.providerId,
      costUnitCop: Number(updated.costUnitCop),
      currentQty: Number(updated.currentQty),
      physicalLocation: updated.physicalLocation,
      status: updated.status,
    };

    if (!client) {
      lots[index] = updatedLot;
      await writeJsonFile("lots.json", lots);

      const inventory = await this.getInventory();
      const product = inventory.find((p) => p.id === current.productId);
      if (product) {
        product.units = Math.max(0, product.units + difference);
        await writeJsonFile("inventory.json", inventory);
      }
      return updatedLot;
    }

    try {
      const rowNum = index + 2;
      await client.spreadsheets.values.update({
        spreadsheetId,
        range: `Lotes!D${rowNum}:K${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            updatedLot.expiryDate,
            updatedLot.serialNumber || "",
            updatedLot.providerId,
            updatedLot.costUnitCop,
            updatedLot.initialQty,
            updatedLot.currentQty,
            updatedLot.physicalLocation,
            updatedLot.status
          ]]
        }
      });

      const inventory = await this.getInventory();
      const pIndex = inventory.findIndex((p) => p.id === current.productId);
      if (pIndex !== -1) {
        const product = inventory[pIndex];
        const newUnits = Math.max(0, product.units + difference);
        product.units = newUnits;
        const pRowNum = pIndex + 2;
        await client.spreadsheets.values.update({
          spreadsheetId,
          range: `Inventario!D${pRowNum}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[newUnits]]
          }
        });
      }

      return updatedLot;
    } catch (err) {
      console.error("Error updating lot directly:", err);
      lots[index] = updatedLot;
      await writeJsonFile("lots.json", lots);
      return updatedLot;
    }
  },

  // --- PROVEEDORES ---
  async getProviders(): Promise<Provider[]> {
    const client = getSheetsClient();
    if (!client) {
      return readJsonFile<Provider[]>("providers.json", []);
    }
    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Proveedores!A2:I1000",
      });
      const rows = normalizeRows(response.data.values);
      return rows.map((row) => ({
        id: row[0] || "",
        companyName: row[1] || "",
        nit: row[2] || "",
        contactName: row[3] || "",
        phone: row[4] || "",
        email: row[5] || "",
        city: row[6] || "",
        country: row[7] || "",
        actorType: row[8] || "",
      }));
    } catch (err) {
      console.error("Error reading providers from Sheets:", err);
      return readJsonFile<Provider[]>("providers.json", []);
    }
  },

  async addProvider(provider: Provider): Promise<Provider> {
    const client = getSheetsClient();
    if (!client) {
      const list = await this.getProviders();
      list.push(provider);
      await writeJsonFile("providers.json", list);
      return provider;
    }
    try {
      await client.spreadsheets.values.append({
        spreadsheetId,
        range: "Proveedores!A2",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            provider.id,
            provider.companyName,
            provider.nit,
            provider.contactName,
            provider.phone,
            provider.email,
            provider.city,
            provider.country,
            provider.actorType
          ]]
        }
      });
      return provider;
    } catch (err) {
      console.error("Error writing provider to Sheets:", err);
      const list = await this.getProviders();
      list.push(provider);
      await writeJsonFile("providers.json", list);
      return provider;
    }
  },

  // --- PROTOCOLOS ---
  async getProtocols(): Promise<Protocol[]> {
    const client = getSheetsClient();
    if (!client) {
      return readJsonFile<Protocol[]>("protocols.json", []);
    }
    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Protocolos!A2:G1000",
      });
      const rows = normalizeRows(response.data.values);
      return rows.map((row) => ({
        id: row[0] || "",
        name: row[1] || "",
        indications: row[2] || "",
        contraindications: row[3] || "",
        recommendedSessions: Number(row[4]) || 1,
        notes: row[5] || "",
        active: row[6] === "TRUE",
      }));
    } catch (err) {
      console.error("Error reading protocols from Sheets:", err);
      return readJsonFile<Protocol[]>("protocols.json", []);
    }
  },

  async getProtocolItems(): Promise<ProtocolItem[]> {
    const client = getSheetsClient();
    if (!client) {
      return readJsonFile<ProtocolItem[]>("protocol_items.json", []);
    }
    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Protocolo_Items!A2:F1000",
      });
      const rows = normalizeRows(response.data.values);
      return rows.map((row) => ({
        id: row[0] || "",
        protocolId: row[1] || "",
        productId: row[2] || "",
        standardQuantity: Number(row[3]) || 0,
        unitName: row[4] || "",
        optional: row[5] === "TRUE",
      }));
    } catch (err) {
      console.error("Error reading protocol items from Sheets:", err);
      return readJsonFile<ProtocolItem[]>("protocol_items.json", []);
    }
  },

  async addProtocol(protocol: Protocol, items: Omit<ProtocolItem, "id" | "protocolId">[]): Promise<Protocol> {
    const client = getSheetsClient();

    if (!client) {
      const protocols = await this.getProtocols();
      protocols.push(protocol);
      await writeJsonFile("protocols.json", protocols);

      const allItems = await this.getProtocolItems();
      const newItems = items.map((item, idx) => ({
        ...item,
        id: `pi_${protocol.id}_${idx}`,
        protocolId: protocol.id,
      }));
      allItems.push(...newItems);
      await writeJsonFile("protocol_items.json", allItems);
      return protocol;
    }

    try {
      await client.spreadsheets.values.append({
        spreadsheetId,
        range: "Protocolos!A2",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            protocol.id,
            protocol.name,
            protocol.indications,
            protocol.contraindications,
            protocol.recommendedSessions,
            protocol.notes,
            protocol.active ? "TRUE" : "FALSE"
          ]]
        }
      });

      if (items.length > 0) {
        const values = items.map((item, idx) => [
          `pi_${protocol.id}_${idx}`,
          protocol.id,
          item.productId,
          item.standardQuantity,
          item.unitName,
          item.optional ? "TRUE" : "FALSE"
        ]);
        await client.spreadsheets.values.append({
          spreadsheetId,
          range: "Protocolo_Items!A2",
          valueInputOption: "RAW",
          requestBody: {
            values
          }
        });
      }
      return protocol;
    } catch (err) {
      console.error("Error writing protocol to Sheets:", err);
      const protocols = await this.getProtocols();
      protocols.push(protocol);
      await writeJsonFile("protocols.json", protocols);
      return protocol;
    }
  },

  // --- HISTORIAL CLÍNICO ---
  async getClinicalRecords(): Promise<ClinicalRecord[]> {
    const client = getSheetsClient();
    if (!client) {
      return readJsonFile<ClinicalRecord[]>("clinical_records.json", mockClinicalRecords);
    }
    try {
      const responseSheets = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Fichas_Medicas!A2:D1000",
      });
      const sheetRows = normalizeRows(responseSheets.data.values);

      const responseTreatments = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Tratamientos_Aplicados!A2:M1000",
      });
      const treatmentRows = normalizeRows(responseTreatments.data.values);

      const treatments: (TreatmentApplied & { patientId: string })[] = treatmentRows.map((row) => ({
        id: row[0] || "",
        patientId: row[1] || "",
        treatmentName: row[2] || "",
        productUsedId: row[3] || undefined,
        productNameUsed: row[4] || undefined,
        productQuantityUsed: row[5] ? Number(row[5]) : undefined,
        details: row[6] || "",
        date: row[7] || "",
        lotUsedId: row[8] || undefined,
        lotNumberUsed: row[9] || undefined,
        adverseEvent: row[10] || "",
        consentStatus: (row[11] as TreatmentApplied["consentStatus"]) || "No Aplica",
        priceChargedCop: row[12] ? Number(row[12]) : 0,
      }));

      return sheetRows.map((row) => {
        const patientId = row[0] || "";
        return {
          patientId,
          allergies: row[1] || "",
          skinType: row[2] || "",
          notes: row[3] || "",
          treatmentsApplied: treatments.filter((t) => t.patientId === patientId),
        };
      });
    } catch (err) {
      console.error("Error reading clinical records from Sheets, using local fallback:", err);
      return readJsonFile<ClinicalRecord[]>("clinical_records.json", mockClinicalRecords);
    }
  },

  async getPatientClinicalRecord(patientId: string): Promise<ClinicalRecord> {
    const client = getSheetsClient();
    if (!client) {
      const records = await this.getClinicalRecords();
      let record = records.find((r) => r.patientId === patientId);
      if (!record) {
        record = {
          patientId,
          allergies: "",
          skinType: "",
          notes: "",
          treatmentsApplied: [],
        };
        records.push(record);
        await writeJsonFile("clinical_records.json", records);
      }
      return record;
    }

    try {
      const records = await this.getClinicalRecords();
      let record = records.find((r) => r.patientId === patientId);
      if (!record) {
        record = {
          patientId,
          allergies: "",
          skinType: "",
          notes: "",
          treatmentsApplied: [],
        };

        await client.spreadsheets.values.append({
          spreadsheetId,
          range: "Fichas_Medicas!A2",
          valueInputOption: "RAW",
          requestBody: {
            values: [[patientId, "", "", ""]]
          }
        });
      }
      return record;
    } catch (err) {
      console.error("Error fetching clinical record from Sheets, using local fallback:", err);
      const records = await readJsonFile<ClinicalRecord[]>("clinical_records.json", mockClinicalRecords);
      let record = records.find((r) => r.patientId === patientId);
      if (!record) {
        record = {
          patientId,
          allergies: "",
          skinType: "",
          notes: "",
          treatmentsApplied: [],
        };
        records.push(record);
        await writeJsonFile("clinical_records.json", records);
      }
      return record;
    }
  },

  async updateClinicalInfo(
    patientId: string,
    info: Pick<ClinicalRecord, "allergies" | "skinType" | "notes">
  ): Promise<ClinicalRecord> {
    const client = getSheetsClient();
    if (!client) {
      const records = await this.getClinicalRecords();
      let record = records.find((r) => r.patientId === patientId);
      if (!record) {
        record = {
          patientId,
          allergies: info.allergies,
          skinType: info.skinType,
          notes: info.notes,
          treatmentsApplied: [],
        };
        records.push(record);
      } else {
        record.allergies = info.allergies;
        record.skinType = info.skinType;
        record.notes = info.notes;
      }
      await writeJsonFile("clinical_records.json", records);
      return record;
    }

    try {
      const responseSheets = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Fichas_Medicas!A2:A1000",
      });
      const ids = normalizeRows(responseSheets.data.values).map((row) => row[0]);
      const index = ids.indexOf(patientId);

      if (index === -1) {
        await client.spreadsheets.values.append({
          spreadsheetId,
          range: "Fichas_Medicas!A2",
          valueInputOption: "RAW",
          requestBody: {
            values: [[patientId, info.allergies, info.skinType, info.notes]]
          }
        });
      } else {
        const rowNum = index + 2;
        await client.spreadsheets.values.update({
          spreadsheetId,
          range: `Fichas_Medicas!B${rowNum}:D${rowNum}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[info.allergies, info.skinType, info.notes]]
          }
        });
      }

      return this.getPatientClinicalRecord(patientId);
    } catch (err) {
      console.error("Error updating clinical info in Sheets, writing local fallback:", err);
      const records = await readJsonFile<ClinicalRecord[]>("clinical_records.json", mockClinicalRecords);
      let record = records.find((r) => r.patientId === patientId);
      if (!record) {
        record = {
          patientId,
          allergies: info.allergies,
          skinType: info.skinType,
          notes: info.notes,
          treatmentsApplied: [],
        };
        records.push(record);
      } else {
        record.allergies = info.allergies;
        record.skinType = info.skinType;
        record.notes = info.notes;
      }
      await writeJsonFile("clinical_records.json", records);
      return record;
    }
  },

  async addTreatmentApplied(patientId: string, treatment: Omit<TreatmentApplied, "id" | "date">): Promise<ClinicalRecord> {
    const client = getSheetsClient();
    const dateStr = new Date().toISOString().split("T")[0];
    const treatmentId = `t_${Date.now()}`;

    let productNameUsed: string | undefined = undefined;
    if (treatment.productUsedId) {
      const inventory = await this.getInventory();
      const product = inventory.find((p) => p.id === treatment.productUsedId);
      if (product) {
        productNameUsed = product.name;
      }
    }

    let lotNumberUsed: string | undefined = undefined;
    if (treatment.lotUsedId) {
      const lots = await this.getLots();
      const lot = lots.find((l) => l.id === treatment.lotUsedId);
      if (lot) {
        lotNumberUsed = lot.lotNumber;
        await this.deductLotStock(treatment.lotUsedId, treatment.productQuantityUsed || 1);
      }
    }

    if (!client) {
      const records = await this.getClinicalRecords();
      let record = records.find((r) => r.patientId === patientId);
      if (!record) {
        record = {
          patientId,
          allergies: "",
          skinType: "",
          notes: "",
          treatmentsApplied: [],
        };
        records.push(record);
      }

      const newTreatment: TreatmentApplied = {
        ...treatment,
        id: treatmentId,
        date: dateStr,
        productNameUsed,
        lotNumberUsed,
      };

      record.treatmentsApplied.push(newTreatment);
      await writeJsonFile("clinical_records.json", records);
      return record;
    }

    try {
      await client.spreadsheets.values.append({
        spreadsheetId,
        range: "Tratamientos_Aplicados!A2",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            treatmentId,
            patientId,
            treatment.treatmentName,
            treatment.productUsedId || "",
            productNameUsed || "",
            treatment.productQuantityUsed || 0,
            treatment.details,
            dateStr,
            treatment.lotUsedId || "",
            lotNumberUsed || "",
            treatment.adverseEvent || "",
            treatment.consentStatus || "No Aplica",
            treatment.priceChargedCop || 0
          ]]
        }
      });

      return this.getPatientClinicalRecord(patientId);
    } catch (err) {
      console.error("Error writing treatment to Sheets, writing local fallback:", err);
      const records = await readJsonFile<ClinicalRecord[]>("clinical_records.json", mockClinicalRecords);
      let record = records.find((r) => r.patientId === patientId);
      if (!record) {
        record = {
          patientId,
          allergies: "",
          skinType: "",
          notes: "",
          treatmentsApplied: [],
        };
        records.push(record);
      }

      const newTreatment: TreatmentApplied = {
        ...treatment,
        id: treatmentId,
        date: dateStr,
        productNameUsed,
        lotNumberUsed,
      };

      record.treatmentsApplied.push(newTreatment);
      await writeJsonFile("clinical_records.json", records);
      return record;
    }
  },

  async updateTreatmentApplied(
    patientId: string,
    treatmentId: string,
    updated: Omit<TreatmentApplied, "id" | "date">
  ): Promise<ClinicalRecord> {
    const client = getSheetsClient();
    const records = await this.getClinicalRecords();
    const record = records.find((r) => r.patientId === patientId);
    if (!record) throw new Error("Record not found");

    const index = record.treatmentsApplied.findIndex((t) => t.id === treatmentId);
    if (index === -1) throw new Error("Treatment not found");

    const oldTreatment = record.treatmentsApplied[index];

    // Return old stock if it was used
    if (oldTreatment.lotUsedId && oldTreatment.productQuantityUsed) {
      await this.adjustLotStockDirect(oldTreatment.lotUsedId, oldTreatment.productQuantityUsed);
    }

    // Deduct new stock
    let productNameUsed: string | undefined = undefined;
    if (updated.productUsedId) {
      const inventory = await this.getInventory();
      const product = inventory.find((p) => p.id === updated.productUsedId);
      if (product) {
        productNameUsed = product.name;
      }
    }

    let lotNumberUsed: string | undefined = undefined;
    if (updated.lotUsedId) {
      const lots = await this.getLots();
      const lot = lots.find((l) => l.id === updated.lotUsedId);
      if (lot) {
        lotNumberUsed = lot.lotNumber;
        await this.deductLotStock(updated.lotUsedId, updated.productQuantityUsed || 1);
      }
    }

    const updatedTreatment: TreatmentApplied = {
      ...oldTreatment,
      treatmentName: updated.treatmentName,
      productUsedId: updated.productUsedId || undefined,
      productNameUsed,
      productQuantityUsed: updated.productUsedId ? updated.productQuantityUsed : undefined,
      details: updated.details,
      lotUsedId: updated.lotUsedId || undefined,
      lotNumberUsed,
      adverseEvent: updated.adverseEvent || "",
      consentStatus: updated.consentStatus || "No Aplica",
      priceChargedCop: updated.priceChargedCop || 0,
    };

    if (!client) {
      record.treatmentsApplied[index] = updatedTreatment;
      await writeJsonFile("clinical_records.json", records);
      return record;
    }

    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: "Tratamientos_Aplicados!A2:A2000",
      });
      const ids = normalizeRows(response.data.values).map((r) => r[0]);
      const sheetIndex = ids.indexOf(treatmentId);

      if (sheetIndex !== -1) {
        const rowNum = sheetIndex + 2;
        await client.spreadsheets.values.update({
          spreadsheetId,
          range: `Tratamientos_Aplicados!A${rowNum}:M${rowNum}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[
              treatmentId,
              patientId,
              updatedTreatment.treatmentName,
              updatedTreatment.productUsedId || "",
              updatedTreatment.productNameUsed || "",
              updatedTreatment.productQuantityUsed || 0,
              updatedTreatment.details,
              updatedTreatment.date,
              updatedTreatment.lotUsedId || "",
              updatedTreatment.lotNumberUsed || "",
              updatedTreatment.adverseEvent || "",
              updatedTreatment.consentStatus || "No Aplica",
              updatedTreatment.priceChargedCop || 0
            ]]
          }
        });
      }
      return this.getPatientClinicalRecord(patientId);
    } catch (err) {
      console.error("Error updating treatment in Sheets:", err);
      record.treatmentsApplied[index] = updatedTreatment;
      await writeJsonFile("clinical_records.json", records);
      return record;
    }
  },
};
