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

// Initial Mock Data
const mockPatients = [
  ['p1', 'Sofía Rodríguez', '+57 315 789 4512', 'sofia.rod@gmail.com', '1994-08-14', 'Paciente recurrente. Piel mixta con tendencia a rosácea leve.', '2026-05-10T12:00:00.000Z'],
  ['p2', 'Mateo Gómez', '+57 320 456 7890', 'mateo.gomez@yahoo.com', '1988-11-22', 'Sufre de acné vulgar controlado. Asiste para mantenimiento.', '2026-06-01T15:30:00.000Z'],
  ['p3', 'Valeria Cárdenas', '+57 301 234 5678', 'valecar@hotmail.com', '1991-03-05', 'Interesada en Toxina Botulínica y Ácido Hialurónico. Primera consulta.', '2026-07-08T10:15:00.000Z']
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const mockAppointments = [
  ['a1', 'p2', 'Mateo Gómez', today, '14:00', 'Limpieza Facial Hydrash Profunda', 'Programada', 'Sesión de mantenimiento mensual.'],
  ['a2', 'p1', 'Sofía Rodríguez', today, '16:30', 'Toxina Botulínica', 'Programada', 'Retoque en tercio superior facial.'],
  ['a3', 'p3', 'Valeria Cárdenas', tomorrow, '09:00', 'Valoración Inicial', 'Programada', 'Consulta de diagnóstico y plan de tratamientos.']
];

const mockInventory = [
  ['i1', 'Ácido Hialurónico (Juvederm Ultra 4)', 'Inyectable', '8', '3', 'viales'],
  ['i2', 'Toxina Botulínica (Dysport 500U)', 'Inyectable', '180', '50', 'unidades'],
  ['i3', 'Cabezales de Succión Hydrash', 'Equipo/Accesorios', '4', '6', 'piezas'],
  ['i4', 'Crema Anestésica Lidocaína 15%', 'Anestésico', '2', '2', 'tubos'],
  ['i5', 'Cartucho Agujas Nanopore (12 pines)', 'Equipo/Accesorios', '12', '10', 'cartuchos'],
  ['i6', 'Gel Conductor Spectrum Mask', 'Cuidado Post-Láser', '1', '2', 'galón']
];

const mockClinicalInfo = [
  ['p1', 'Ninguna conocida', 'Mixta y Sensible', 'Paciente busca atenuar líneas de expresión finas en frente y patas de gallo.'],
  ['p2', 'Polen', 'Grasa con tendencia acneica', 'Control de grasa e hiperpigmentación post-inflamatoria.'],
  ['p3', 'Látex', 'Seca', 'Interesada en hidratación profunda.']
];

const mockTreatmentsApplied = [
  ['t1', 'p1', 'Revitalización Profunda', 'i1', 'Ácido Hialurónico (Juvederm Ultra 4)', '1', 'Aplicación de 1 jeringa de AH en tercio medio.', '2026-05-15']
];

const mockAccessKeys = [
  ['carolina', 'paunova2026', 'doctor']
];

const headersMap = {
  Pacientes: {
    headers: ['id', 'name', 'phone', 'email', 'birthday', 'notes', 'createdAt'],
    data: mockPatients
  },
  Citas: {
    headers: ['id', 'patientId', 'patientName', 'date', 'time', 'treatment', 'status', 'notes', 'googleCalendarEventId', 'googleMeetUrl'],
    data: mockAppointments
  },
  Inventario: {
    headers: ['id', 'name', 'category', 'units', 'minUnits', 'unitName'],
    data: mockInventory
  },
  Fichas_Medicas: {
    headers: ['patientId', 'allergies', 'skinType', 'notes'],
    data: mockClinicalInfo
  },
  Tratamientos_Aplicados: {
    headers: ['id', 'patientId', 'treatmentName', 'productUsedId', 'productNameUsed', 'productQuantityUsed', 'details', 'date', 'lotUsedId', 'adverseEvent', 'consentStatus', 'priceChargedCop'],
    data: mockTreatmentsApplied
  },
  Lotes: {
    headers: ['id', 'productId', 'lotNumber', 'expiryDate', 'serialNumber', 'providerId', 'costUnitCop', 'initialQty', 'currentQty', 'physicalLocation', 'status'],
    data: [
      ['l1', 'i1', 'L-AH9832', '2026-12-31', 'SN-90823', 'prov1', '400000', '10', '8', 'Nevera 1', 'activo'],
      ['l2', 'i2', 'L-TB2204', '2026-08-15', 'SN-11029', 'prov2', '350000', '200', '180', 'Nevera 1', 'activo']
    ]
  },
  Proveedores: {
    headers: ['id', 'companyName', 'nit', 'contactName', 'phone', 'email', 'city', 'country', 'actorType'],
    data: [
      ['prov1', 'Galderma Colombia', '800.123.456-1', 'Representante Galderma', '+57 312 999 8888', 'contacto@galderma.com.co', 'Bogotá', 'Colombia', 'Distribuidor Oficial'],
      ['prov2', 'Merz Aesthetic Colombia', '900.987.654-2', 'Representante Merz', '+57 310 777 6666', 'pedidos@merz.com', 'Bogotá', 'Colombia', 'Fabricante']
    ]
  },
  Protocolos: {
    headers: ['id', 'name', 'indications', 'contraindications', 'recommendedSessions', 'notes', 'active'],
    data: [
      ['prot1', 'Toxina tercio superior', 'Líneas en frente, entrecejo y patas de gallo.', 'Embarazo, miastenia gravis, lactancia.', '1', 'Control de retoque a los 15 días.', 'TRUE'],
      ['prot2', 'Perfilado de Labios Premium', 'Pérdida de volumen labial o asimetrías.', 'Herpes activo, rellenos permanentes previos.', '1', 'Evitar morder alimentos duros primeras 24 horas.', 'TRUE']
    ]
  },
  Protocolo_Items: {
    headers: ['id', 'protocolId', 'productId', 'standardQuantity', 'unitName', 'optional'],
    data: [
      ['pi1', 'prot1', 'i2', '50', 'unidades', 'FALSE'],
      ['pi2', 'prot2', 'i1', '1', 'viales', 'FALSE']
    ]
  },
  Conversaciones: {
    headers: ['whatsappUserId', 'patientId', 'state', 'preferredName', 'fullName', 'serviceInterest', 'appointmentMode', 'consentStatus', 'lastMessageAt'],
    data: []
  },
  Claves_Acceso: {
    headers: ['username', 'password', 'role'],
    data: mockAccessKeys
  }
};

async function initialize() {
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    await auth.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Get spreadsheet sheets
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = metadata.data.sheets || [];
    const existingTitles = existingSheets.map(s => s.properties.title);
    
    console.log(`Existing tabs: ${existingTitles.join(', ')}`);

    // 2. Add missing sheets (tabs)
    const requests = [];
    for (const title of Object.keys(headersMap)) {
      if (!existingTitles.includes(title)) {
        requests.push({
          addSheet: {
            properties: { title }
          }
        });
      }
    }

    if (requests.length > 0) {
      console.log(`Adding ${requests.length} missing sheets...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests }
      });
      console.log('✅ Missing sheets added successfully!');
    }

    // 3. Populate headers and mock data
    console.log('Writing headers and seeding initial mock data...');
    for (const [title, config] of Object.entries(headersMap)) {
      // Check if sheet is empty
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${title}!A1:A5`
      });

      if (!response.data.values || response.data.values.length === 0) {
        console.log(` - Seeding tab: ${title}`);
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${title}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [config.headers, ...config.data]
          }
        });
      } else {
        console.log(` - Tab ${title} already has data, skipping seeding.`);
      }
    }

    // 4. Delete default blank sheet "Hoja 1" if it exists and we created the others
    const finalMetadata = await sheets.spreadsheets.get({ spreadsheetId });
    const finalSheets = finalMetadata.data.sheets || [];
    const hoja1 = finalSheets.find(s => s.properties.title === 'Hoja 1');

    if (hoja1 && finalSheets.length > 1) {
      console.log('Deleting default empty "Hoja 1"...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            deleteSheet: {
              sheetId: hoja1.properties.sheetId
            }
          }]
        }
      });
      console.log('✅ Default "Hoja 1" deleted.');
    }

    console.log('\n=========================================');
    console.log('🎉 SPREADSHEET INITIALIZED & SEEDED SUCCESSFULLY!');
    console.log('=========================================');

  } catch (error) {
    console.error('❌ Failed to initialize spreadsheet tabs:', error);
    process.exit(1);
  }
}

initialize();
