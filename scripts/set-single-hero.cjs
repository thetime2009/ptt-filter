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
    // Clear the table
    await pool.query('DELETE FROM hero_infographics');
    
    // Insert new single hero image
    await pool.query(`
      INSERT INTO hero_infographics (image_url, title, display_order)
      VALUES ('/images/hero-bg.jpg', 'Hero Background Collage', 0)
    `);
    console.log('Successfully cleared table and set single hero background image.');
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

run();
