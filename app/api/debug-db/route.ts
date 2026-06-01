import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    const fileExists = fs.existsSync(dbPath);
    let fileSize = 0;
    if (fileExists) {
      const stats = fs.statSync(dbPath);
      fileSize = stats.size;
    }

    // Try query
    const users = db.prepare('SELECT id, name, email, role FROM users').all();

    return NextResponse.json({
      success: true,
      dbPath,
      fileExists,
      fileSize,
      users,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      stack: error.stack,
      dbPath: path.join(process.cwd(), 'database.sqlite'),
      fileExists: fs.existsSync(path.join(process.cwd(), 'database.sqlite')),
    }, { status: 500 });
  }
}
