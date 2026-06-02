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

const pool = new Pool({
  connectionString: postgresUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function run() {
  try {
    await pool.query(`
      INSERT INTO hero_infographics (image_url, title, display_order)
      VALUES ('/images/hero-infographic-2.jpg', 'Industrial Custom Filter Structure', 1)
    `);
    console.log('Inserted new infographic to DB successfully.');
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

run();
