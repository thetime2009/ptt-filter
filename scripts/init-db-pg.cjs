const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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

console.log('Connecting to PostgreSQL database...');

const pool = new Pool({
  connectionString: postgresUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function init() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_th VARCHAR(255),
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_th VARCHAR(255),
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        description_th TEXT,
        category_id INTEGER REFERENCES categories(id),
        images TEXT DEFAULT '[]',
        specs TEXT DEFAULT '{}',
        is_featured INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS portfolio_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_th VARCHAR(255),
        description TEXT,
        description_th TEXT,
        images TEXT DEFAULT '[]',
        tags VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS custom_inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        specs JSONB NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully.');

    // Insert default categories
    const categories = [
      ['Air Filter', 'ไส้กรองอากาศอุตสาหกรรม', 'air-filter', 'Industrial air filtration systems, cleanroom filters, and HVAC systems.', 'Wind'],
      ['Dust Collector Filter', 'ไส้กรองดักฝุ่น', 'dust-collector-filter', 'Dust collector cartridges, bags, and pleats for heavy industrial dust collection.', 'Activity'],
      ['Smoke Filter', 'ไส้กรองควันและกลิ่น', 'smoke-filter', 'Fume, smoke, and odor control filtration with activated carbon and HEPA technology.', 'CloudSmoke'],
      ['Industrial Oil Filter', 'ไส้กรองน้ำมันอุตสาหกรรม', 'industrial-oil-filter', 'Hydraulic oil, lube oil, and fuel oil filtration systems (Non-automotive).', 'Droplet'],
      ['Filter Housing & Accessories', 'โครงสร้างไส้กรองและอุปกรณ์เสริม', 'filter-housing-accessories', 'Industrial filter housings, frames, bags, and support structures.', 'Layers']
    ];

    for (const cat of categories) {
      await pool.query(`
        INSERT INTO categories (name, name_th, slug, description, icon)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO NOTHING
      `, cat);
    }

    console.log('Categories inserted successfully.');

    // Insert admin user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin1234', salt);

    await pool.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['Admin', 'admin@pttfilter.com', hash, 'admin']);

    console.log('Admin user inserted successfully.');
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Initialization Error:', error);
  } finally {
    await pool.end();
  }
}

init();
