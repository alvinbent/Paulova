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
    // Remove enclosing quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    // Unescape newlines for private key
    value = value.replace(/\\n/g, '\n');
    env[match[1].trim()] = value;
  }
});

const clientEmail = env.GOOGLE_CLIENT_EMAIL;
const privateKey = env.GOOGLE_PRIVATE_KEY;
const targetEmail = 'Paunova.co@gmail.com';

if (!clientEmail || !privateKey) {
  console.error('Error: Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in .env.local');
  process.exit(1);
}

// Headers from template
const headersMap = {
  Pacientes: ['id', 'name', 'phone', 'email', 'birthday', 'notes', 'createdAt'],
  Citas: ['id', 'patientId', 'patientName', 'date', 'time', 'treatment', 'status', 'notes'],
  Inventario: ['id', 'name', 'category', 'units', 'minUnits', 'unitName'],
  Fichas_Medicas: ['patientId', 'allergies', 'skinType', 'notes'],
  Tratamientos_Aplicados: ['id', 'patientId', 'treatmentName', 'productUsedId', 'productNameUsed', 'productQuantityUsed', 'details', 'date'],
  Claves_Acceso: ['username', 'password', 'role']
};

async function createAndInitializeSheet() {
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ]
    });

    await auth.authorize();
    console.log('✅ Google API Authentication successful!');

    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('Creating a new Google Spreadsheet named "Paunova Clinic DB"...');
    const resource = {
      properties: {
        title: 'Paunova Clinic DB',
      },
      sheets: Object.keys(headersMap).map(title => ({
        properties: { title }
      }))
    };

    const spreadsheet = await sheets.spreadsheets.create({
      resource,
      fields: 'spreadsheetId,spreadsheetUrl',
    });

    const newSpreadsheetId = spreadsheet.data.spreadsheetId;
    const spreadsheetUrl = spreadsheet.data.spreadsheetUrl;
    console.log(`✅ Spreadsheet created successfully!`);
    console.log(`ID: ${newSpreadsheetId}`);
    console.log(`URL: ${spreadsheetUrl}`);

    // Populate Headers for each tab
    console.log('Initializing column headers for all tables...');
    for (const [sheetName, headers] of Object.entries(headersMap)) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: newSpreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        resource: {
          values: [headers]
        }
      });
      console.log(` - Initialized headers for tab: ${sheetName}`);
    }

    // Try sharing with user email via Google Drive API
    try {
      console.log(`Attempting to share spreadsheet with ${targetEmail} as Editor...`);
      const drive = google.drive({ version: 'v3', auth });
      await drive.permissions.create({
        fileId: newSpreadsheetId,
        requestBody: {
          type: 'user',
          role: 'writer',
          emailAddress: targetEmail
        },
        sendNotificationEmail: true
      });
      console.log(`✅ Shared successfully with ${targetEmail}! Check your Google Sheets inbox.`);
    } catch {
      console.warn(`⚠️ Could not share automatically. Google Drive API might not be enabled.`);
      console.warn(`Please enable it in Google Console, or manually share using the Service Account email:`);
      console.warn(`👉 ${clientEmail}`);
    }

    // Update .env.local file
    console.log('Updating GOOGLE_SPREADSHEET_ID in .env.local...');
    let updatedEnvContent = envContent;
    if (envContent.includes('GOOGLE_SPREADSHEET_ID=')) {
      updatedEnvContent = envContent.replace(
        /GOOGLE_SPREADSHEET_ID=.*/,
        `GOOGLE_SPREADSHEET_ID="${newSpreadsheetId}"`
      );
    } else {
      updatedEnvContent += `\nGOOGLE_SPREADSHEET_ID="${newSpreadsheetId}"\n`;
    }

    fs.writeFileSync(envPath, updatedEnvContent, 'utf8');
    console.log('✅ Updated .env.local file with the new GOOGLE_SPREADSHEET_ID!');
    console.log('\n=========================================');
    console.log('🎉 INITIALIZATION COMPLETE');
    console.log(`Spreadsheet URL: ${spreadsheetUrl}`);
    console.log('=========================================');

  } catch (error) {
    console.error('❌ Failed to create spreadsheet:', error);
    process.exit(1);
  }
}

createAndInitializeSheet();
