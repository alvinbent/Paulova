import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    value = value.replace(/\\n/g, '\n');
    env[match[1].trim()] = value;
  }
});

const clientEmail = env.GOOGLE_CLIENT_EMAIL;
const privateKey = env.GOOGLE_PRIVATE_KEY;
const spreadsheetId = env.GOOGLE_SPREADSHEET_ID;

if (!clientEmail || !privateKey || !spreadsheetId) {
  console.error('Error: Missing GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SPREADSHEET_ID in .env.local');
  process.exit(1);
}

const DB_DIR = path.join(process.cwd(), '.dev-db');

// Default Mocks if local files do not exist
const defaultPatients = [
  { id: 'p1', name: 'Sofía Rodríguez', phone: '+57 315 789 4512', email: 'sofia.rod@gmail.com', birthday: '1994-08-14', notes: 'Paciente recurrente. Piel mixta con tendencia a rosácea leve.', createdAt: '2026-05-10T12:00:00.000Z' },
  { id: 'p2', name: 'Mateo Gómez', phone: '+57 320 456 7890', email: 'mateo.gomez@yahoo.com', birthday: '1988-11-22', notes: 'Sufre de acné vulgar controlado. Asiste para mantenimiento.', createdAt: '2026-06-01T15:30:00.000Z' },
  { id: 'p3', name: 'Valeria Cárdenas', phone: '+57 301 234 5678', email: 'valecar@hotmail.com', birthday: '1991-03-05', notes: 'Interesada en Toxina Botulínica y Ácido Hialurónico. Primera consulta.', createdAt: '2026-07-08T10:15:00.000Z' }
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const defaultAppointments = [
  { id: 'a1', patientId: 'p2', patientName: 'Mateo Gómez', date: today, time: '14:00', treatment: 'Limpieza Facial Hydrash Profunda', status: 'Programada', notes: 'Sesión de mantenimiento mensual.' },
  { id: 'a2', patientId: 'p1', patientName: 'Sofía Rodríguez', date: today, time: '16:30', treatment: 'Toxina Botulínica', status: 'Programada', notes: 'Retoque en tercio superior facial.' },
  { id: 'a3', patientId: 'p3', patientName: 'Valeria Cárdenas', date: tomorrow, time: '09:00', treatment: 'Valoración Inicial', status: 'Programada', notes: 'Consulta de diagnóstico y plan de tratamientos.' }
];

const defaultInventory = [
  { id: 'i1', name: 'Ácido Hialurónico (Juvederm Ultra 4)', category: 'Inyectable', units: 8, minUnits: 3, unitName: 'viales' },
  { id: 'i2', name: 'Toxina Botulínica (Dysport 500U)', category: 'Inyectable', units: 180, minUnits: 50, unitName: 'unidades' },
  { id: 'i3', name: 'Cabezales de Succión Hydrash', category: 'Equipo/Accesorios', units: 4, minUnits: 6, unitName: 'piezas' },
  { id: 'i4', name: 'Crema Anestésica Lidocaína 15%', category: 'Anestésico', units: 2, minUnits: 2, unitName: 'tubos' },
  { id: 'i5', name: 'Cartucho Agujas Nanopore (12 pines)', category: 'Equipo/Accesorios', units: 12, minUnits: 10, unitName: 'cartuchos' },
  { id: 'i6', name: 'Gel Conductor Spectrum Mask', category: 'Cuidado Post-Láser', units: 1, minUnits: 2, unitName: 'galón' }
];

const defaultClinicalRecords = [
  {
    patientId: 'p1',
    allergies: 'Ninguna conocida',
    skinType: 'Mixta y Sensible',
    notes: 'Paciente busca atenuar líneas de expresión finas en frente y patas de gallo.',
    treatmentsApplied: [
      { id: 't1', treatmentName: 'Revitalización Profunda', productUsedId: 'i1', productNameUsed: 'Ácido Hialurónico (Juvederm Ultra 4)', productQuantityUsed: 1, details: 'Aplicación de 1 jeringa de AH en tercio medio.', date: '2026-05-15' }
    ]
  },
  {
    patientId: 'p2',
    allergies: 'Polen',
    skinType: 'Grasa con tendencia acneica',
    notes: 'Control de grasa e hiperpigmentación post-inflamatoria.',
    treatmentsApplied: [
      { id: 't2', treatmentName: 'Limpieza Facial Hydrash', productUsedId: 'i3', productNameUsed: 'Cabezales de Succión Hydrash', productQuantityUsed: 1, details: 'Protocolo completo de succión y exfoliación.', date: '2026-06-05' }
    ]
  },
  {
    patientId: 'p3',
    allergies: 'Látex',
    skinType: 'Seca',
    notes: 'Interesada en hidratación profunda.',
    treatmentsApplied: []
  }
];

const defaultAccessKeys = [
  { username: 'carolina', password: 'paunova2026', role: 'doctor' }
];

// Helper to read local JSON or fallback
function readLocalJson(filename, defaultValue) {
  const filePath = path.join(DB_DIR, filename);
  if (fs.existsSync(filePath)) {
    try {
      console.log(`Reading local file: ${filename}`);
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.warn(`⚠️ Warning: Could not parse ${filename}, using default mock.`);
    }
  }
  return defaultValue;
}

async function syncLocalToSheets() {
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    await auth.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Read local data
    const patients = readLocalJson('patients.json', defaultPatients);
    const appointments = readLocalJson('appointments.json', defaultAppointments);
    const inventory = readLocalJson('inventory.json', defaultInventory);
    const clinicalRecords = readLocalJson('clinical_records.json', defaultClinicalRecords);
    const accessKeys = readLocalJson('access_keys.json', defaultAccessKeys);

    // Map to row arrays
    const patientRows = patients.map(p => [p.id, p.name, p.phone, p.email, p.birthday, p.notes, p.createdAt]);
    const apptRows = appointments.map(a => [a.id, a.patientId, a.patientName, a.date, a.time, a.treatment, a.status, a.notes]);
    const inventoryRows = inventory.map(i => [i.id, i.name, i.category, String(i.units), String(i.minUnits), i.unitName]);
    
    // Clinical records split
    const clinicalInfoRows = clinicalRecords.map(r => [r.patientId, r.allergies, r.skinType, r.notes]);
    const treatmentRows = [];
    clinicalRecords.forEach(r => {
      if (r.treatmentsApplied) {
        r.treatmentsApplied.forEach(t => {
          treatmentRows.push([
            t.id,
            r.patientId,
            t.treatmentName,
            t.productUsedId || '',
            t.productNameUsed || '',
            String(t.productQuantityUsed || 0),
            t.details,
            t.date
          ]);
        });
      }
    });

    const accessRows = accessKeys.map(k => [k.username, k.password, k.role]);

    const dataConfig = {
      Pacientes: {
        headers: ['id', 'name', 'phone', 'email', 'birthday', 'notes', 'createdAt'],
        rows: patientRows
      },
      Citas: {
        headers: ['id', 'patientId', 'patientName', 'date', 'time', 'treatment', 'status', 'notes'],
        rows: apptRows
      },
      Inventario: {
        headers: ['id', 'name', 'category', 'units', 'minUnits', 'unitName'],
        rows: inventoryRows
      },
      Fichas_Medicas: {
        headers: ['patientId', 'allergies', 'skinType', 'notes'],
        rows: clinicalInfoRows
      },
      Tratamientos_Aplicados: {
        headers: ['id', 'patientId', 'treatmentName', 'productUsedId', 'productNameUsed', 'productQuantityUsed', 'details', 'date'],
        rows: treatmentRows
      },
      Claves_Acceso: {
        headers: ['username', 'password', 'role'],
        rows: accessRows
      }
    };

    console.log('Synchronizing local database to Google Sheets...');

    for (const [title, config] of Object.entries(dataConfig)) {
      console.log(` - Cleared and uploading tab: ${title} (${config.rows.length} rows)`);
      
      // Clear range first
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${title}!A1:Z1000`
      });

      // Write headers + data
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${title}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [config.headers, ...config.rows]
        }
      });
    }

    console.log('\n=========================================');
    console.log('🎉 LOCAL DATABASE SYNCED TO GOOGLE SHEETS!');
    console.log('=========================================');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

syncLocalToSheets();
