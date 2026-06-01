import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'ไม่พบไฟล์ภาพ' }, { status: 400 });
    }

    // Generate a unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '.jpg';
    const filename = `products/product-${uniqueSuffix}${ext}`;

    // Read file bytes into a Buffer to ensure compatibility and prevent streams hanging in Serverless environments
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload directly to Vercel Blob Storage using the Buffer
    const blob = await put(filename, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      filePath: blob.url
    });
  } catch (err: any) {
    console.error('Vercel Blob Upload Error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์ภาพ' 
    }, { status: 500 });
  }
}
