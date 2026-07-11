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

if (!clientEmail || !privateKey) {
  console.error('Error: Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in .env.local');
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive'
  ]
});

async function findSheet() {
  try {
    await auth.authorize();
    const drive = google.drive({ version: 'v3', auth });

    console.log('Searching for files named "Paunova Clinic DB"...');
    const response = await drive.files.list({
      q: "name = 'Paunova Clinic DB' and mimeType = 'application/vnd.google-apps.spreadsheet'",
      fields: 'files(id, name, ownerNames, owners(emailAddress))',
      spaces: 'drive'
    });

    const files = response.data.files || [];
    if (files.length === 0) {
      console.log('❌ No files found with name "Paunova Clinic DB".');
      console.log('Please make sure you shared the spreadsheet with the service account as Editor.');
      process.exit(1);
    }

    console.log(`\n🎉 Found ${files.length} spreadsheet(s):`);
    files.forEach(file => {
      console.log(`- Name: ${file.name}`);
      console.log(`  ID: ${file.id}`);
      if (file.owners) {
        console.log(`  Owner: ${file.owners.map(o => o.emailAddress).join(', ')}`);
      }
    });

  } catch (error) {
    console.error('❌ Error searching for sheet:', error.message || error);
    process.exit(1);
  }
}

findSheet();
