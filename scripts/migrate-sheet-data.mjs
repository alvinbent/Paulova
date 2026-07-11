import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

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
    }
    value = value.replace(/\\n/g, '\n');
    env[match[1].trim()] = value;
  }
});

const clientEmail = env.GOOGLE_CLIENT_EMAIL;
const privateKey = env.GOOGLE_PRIVATE_KEY;
const oldSpreadsheetId = '1f_cmkkfurR4krRkiVMAlu9mz8m7us49Icdst-rinAZE';
const newSpreadsheetId = env.GOOGLE_SPREADSHEET_ID; // 1sQNTpsaBmqY-I1V1TTUmRlu5VmDnjhfyh1xT4BTRp7E

if (!clientEmail || !privateKey) {
  console.error('Error: Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in .env.local');
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

const tabs = [
  'Pacientes',
  'Citas',
  'Inventario',
  'Fichas_Medicas',
  'Tratamientos_Aplicados',
  'Lotes',
  'Proveedores',
  'Protocolos',
  'Protocolo_Items',
  'Conversaciones',
  'Claves_Acceso'
];

async function migrate() {
  try {
    console.log('Connecting to Google Sheets API...');
    await auth.authorize();
    
    console.log(`Migrating data from OLD sheet (${oldSpreadsheetId}) to NEW sheet (${newSpreadsheetId})...\n`);

    for (const tab of tabs) {
      console.log(`Reading data from tab: ${tab}...`);
      
      let oldDataResponse;
      try {
        oldDataResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: oldSpreadsheetId,
          range: `${tab}!A:Z`
        });
      } catch (err) {
        console.warn(`⚠️ Could not read old tab ${tab} (maybe it doesn't exist yet in the old sheet). Skipping.`);
        continue;
      }

      const rows = oldDataResponse.data.values;
      if (!rows || rows.length <= 1) {
        console.log(`ℹ️ Tab ${tab} is empty or only has headers. Skipping.`);
        continue;
      }

      console.log(`Writing ${rows.length} rows (including headers) to NEW tab: ${tab}...`);
      await sheets.spreadsheets.values.update({
        spreadsheetId: newSpreadsheetId,
        range: `${tab}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: rows
        }
      });
      console.log(`✅ Tab ${tab} migrated successfully!`);
    }

    console.log('\n🎉 ALL DATA MIGRATED SUCCESSFULLY!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message || error);
    process.exit(1);
  }
}

migrate();
