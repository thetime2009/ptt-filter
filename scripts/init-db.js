const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_th TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_th TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    description_th TEXT,
    category_id INTEGER REFERENCES categories(id),
    images TEXT DEFAULT '[]',
    specs TEXT DEFAULT '{}',
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default categories
const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (name, name_th, slug, description, icon)
  VALUES (?, ?, ?, ?, ?)
`);

insertCategory.run('Air Filter', 'ไส้กรองอากาศอุตสาหกรรม', 'air-filter', 'Industrial air filtration systems, cleanroom filters, and HVAC systems.', 'Wind');
insertCategory.run('Dust Collector Filter', 'ไส้กรองดักฝุ่น', 'dust-collector-filter', 'Dust collector cartridges, bags, and pleats for heavy industrial dust collection.', 'Activity');
insertCategory.run('Smoke Filter', 'ไส้กรองควันและกลิ่น', 'smoke-filter', 'Fume, smoke, and odor control filtration with activated carbon and HEPA technology.', 'CloudSmoke');
insertCategory.run('Industrial Oil Filter', 'ไส้กรองน้ำมันอุตสาหกรรม', 'industrial-oil-filter', 'Hydraulic oil, lube oil, and fuel oil filtration systems (Non-automotive).', 'Droplet');
insertCategory.run('Filter Housing & Accessories', 'โครงสร้างไส้กรองและอุปกรณ์เสริม', 'filter-housing-accessories', 'Industrial filter housings, frames, bags, and support structures.', 'Layers');

// Insert initial admin user (admin@pttfilter.com / admin1234)
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('admin1234', salt);

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (name, email, password_hash, role)
  VALUES (?, ?, ?, ?)
`);
insertUser.run('Admin', 'admin@pttfilter.com', hash, 'admin');

console.log('Database initialized successfully with default categories and admin user!');
db.close();
