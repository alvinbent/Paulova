import { promises as fs } from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), ".dev-db");

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
}

export interface TreatmentApplied {
  id: string;
  treatmentName: string;
  productUsedId?: string;
  productNameUsed?: string;
  productQuantityUsed?: number;
  details: string;
  date: string;
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
    await writeJsonFile(filename, defaultValue);
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
    return readJsonFile<Patient[]>("patients.json", mockPatients);
  },
  async getPatient(id: string): Promise<Patient | undefined> {
    const list = await this.getPatients();
    return list.find((p) => p.id === id);
  },
  async createPatient(patient: Omit<Patient, "id" | "createdAt">): Promise<Patient> {
    const list = await this.getPatients();
    const newPatient: Patient = {
      ...patient,
      id: `p_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newPatient);
    await writeJsonFile("patients.json", list);
    return newPatient;
  },

  // --- CITAS ---
  async getAppointments(): Promise<Appointment[]> {
    return readJsonFile<Appointment[]>("appointments.json", mockAppointments());
  },
  async getAppointmentsByDate(dateStr: string): Promise<Appointment[]> {
    const list = await this.getAppointments();
    return list.filter((a) => a.date === dateStr);
  },
  async createAppointment(appt: Omit<Appointment, "id">): Promise<Appointment> {
    const list = await this.getAppointments();
    const newAppt: Appointment = {
      ...appt,
      id: `a_${Date.now()}`,
    };
    list.push(newAppt);
    await writeJsonFile("appointments.json", list);
    return newAppt;
  },
  async updateAppointmentStatus(id: string, status: Appointment["status"]): Promise<Appointment | undefined> {
    const list = await this.getAppointments();
    const appt = list.find((a) => a.id === id);
    if (!appt) return undefined;
    appt.status = status;
    await writeJsonFile("appointments.json", list);
    return appt;
  },

  // --- INVENTARIO ---
  async getInventory(): Promise<InventoryItem[]> {
    return readJsonFile<InventoryItem[]>("inventory.json", mockInventory);
  },
  async updateInventoryStock(id: string, units: number): Promise<InventoryItem | undefined> {
    const list = await this.getInventory();
    const item = list.find((i) => i.id === id);
    if (!item) return undefined;
    item.units = units;
    await writeJsonFile("inventory.json", list);
    return item;
  },
  async deductInventoryStock(id: string, quantity: number): Promise<InventoryItem | undefined> {
    const list = await this.getInventory();
    const item = list.find((i) => i.id === id);
    if (!item) return undefined;
    item.units = Math.max(0, item.units - quantity);
    await writeJsonFile("inventory.json", list);
    return item;
  },

  // --- HISTORIAL CLÍNICO ---
  async getClinicalRecords(): Promise<ClinicalRecord[]> {
    return readJsonFile<ClinicalRecord[]>("clinical_records.json", mockClinicalRecords);
  },
  async getPatientClinicalRecord(patientId: string): Promise<ClinicalRecord> {
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
  },
  async updateClinicalInfo(
    patientId: string,
    info: Pick<ClinicalRecord, "allergies" | "skinType" | "notes">
  ): Promise<ClinicalRecord> {
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
  },
  async addTreatmentApplied(patientId: string, treatment: Omit<TreatmentApplied, "id" | "date">): Promise<ClinicalRecord> {
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

    let productNameUsed: string | undefined = undefined;
    if (treatment.productUsedId) {
      const inventory = await this.getInventory();
      const product = inventory.find((p) => p.id === treatment.productUsedId);
      if (product) {
        productNameUsed = product.name;
        // Descontamos de inventario
        await this.deductInventoryStock(treatment.productUsedId, treatment.productQuantityUsed || 1);
      }
    }

    const newTreatment: TreatmentApplied = {
      ...treatment,
      id: `t_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      productNameUsed,
    };

    record.treatmentsApplied.push(newTreatment);
    await writeJsonFile("clinical_records.json", records);
    return record;
  },
};
