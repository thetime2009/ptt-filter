import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL;

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = {
  async query(text: string, params?: any[]) {
    return pool.query(text, params);
  },
};

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
