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

    // Upload directly to Vercel Blob Storage
    // Vercel automatically provides BLOB_READ_WRITE_TOKEN in production
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      filePath: blob.url // This will be stored in the database
    });
  } catch (err: any) {
    console.error('Vercel Blob Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์ภาพ' }, { status: 500 });
  }
}
