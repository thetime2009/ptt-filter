import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');

export const db = new Database(dbPath, {
  // verbose: console.log
});

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  name_th: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  name_th: string;
  slug: string;
  description: string;
  description_th: string;
  category_id: number;
  category_name?: string;
  category_name_th?: string;
  images: string; // JSON string of array
  specs: string; // JSON string of object
  is_featured: number; // 0 or 1
  is_active: number; // 0 or 1
  created_at: string;
  updated_at: string;
}
