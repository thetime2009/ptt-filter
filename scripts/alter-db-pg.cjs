const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
let postgresUrl = process.env.POSTGRES_URL;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/POSTGRES_URL=["']?([^"'\r\n]+)/);
  if (match) {
    postgresUrl = match[1];
  }
}

if (!postgresUrl) {
  console.error('Error: POSTGRES_URL is missing!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: postgresUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  try {
    console.log('Altering custom_inquiries table...');
    await pool.query(`
      ALTER TABLE custom_inquiries ADD COLUMN IF NOT EXISTS request_number VARCHAR(100);
      ALTER TABLE custom_inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
    `);
    console.log('Table custom_inquiries altered successfully!');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    await pool.end();
  }
}

main();
