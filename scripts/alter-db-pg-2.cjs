const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env file manually
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
  console.error('Error: POSTGRES_URL environment variable is missing!');
  process.exit(1);
}

console.log('Connecting to PostgreSQL database to add hero_infographics table...');

const pool = new Pool({
  connectionString: postgresUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_infographics (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        title VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if table is empty, if so, insert default infographic (/hero-infographic.png)
    const res = await pool.query('SELECT count(*) FROM hero_infographics');
    if (parseInt(res.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO hero_infographics (image_url, title, display_order)
        VALUES ('/hero-infographic.png', 'Default Infographic', 0)
      `);
      console.log('Default infographic inserted.');
    }

    console.log('Table hero_infographics verified/created successfully.');
  } catch (error) {
    console.error('Migration Error:', error);
  } finally {
    await pool.end();
  }
}

run();
