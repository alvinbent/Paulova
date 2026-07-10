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
const spreadsheetId = env.GOOGLE_SPREADSHEET_ID;

console.log('Testing Google Sheets connection...');
console.log('Client Email:', clientEmail);
console.log('Spreadsheet ID:', spreadsheetId);
console.log('Private Key length:', privateKey ? privateKey.length : 0);
if (privateKey) {
  console.log('Private Key format checks:');
  console.log(' - Starts with "-----BEGIN PRIVATE KEY-----":', privateKey.startsWith('-----BEGIN PRIVATE KEY-----'));
  console.log(' - Ends with "-----END PRIVATE KEY-----":', privateKey.trim().endsWith('-----END PRIVATE KEY-----'));
  console.log(' - Has newlines:', privateKey.includes('\n'));
}

if (!clientEmail || !privateKey || !spreadsheetId) {
  console.error('Error: Missing required environment variables in .env.local');
  process.exit(1);
}

async function runTest() {
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    await auth.authorize();
    console.log('✅ Google API Authentication successful!');

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('Attempting to fetch spreadsheet metadata...');
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    console.log('✅ Successfully connected to Spreadsheet!');
    console.log('Title:', response.data.properties.title);
    console.log('Sheets found:', response.data.sheets.map(s => s.properties.title).join(', '));
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error(error);
    process.exit(1);
  }
}

runTest();
