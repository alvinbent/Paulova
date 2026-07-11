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
  scopes: ['https://www.googleapis.com/auth/calendar']
});

const calendar = google.calendar({ version: 'v3', auth });

async function listCalendars() {
  try {
    await auth.authorize();
    console.log('Listing shared calendars for service account...');
    
    const response = await calendar.calendarList.list();
    const items = response.data.items || [];
    
    console.log(`\n🎉 Found ${items.length} shared calendar(s):`);
    items.forEach(item => {
      console.log(`- Summary: ${item.summary}`);
      console.log(`  ID: ${item.id}`);
      console.log(`  Access Role: ${item.accessRole}`);
      console.log('------------------------------');
    });

  } catch (error) {
    console.error('❌ Failed to list calendars:', error.message || error);
    process.exit(1);
  }
}

listCalendars();
