import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'ไม่พบไฟล์ภาพ' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save image to /public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure dir exists
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.name) || '.jpg';
    const filename = `product-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      filePath: `/uploads/${filename}`
    });
  } catch (err: any) {
    console.error('Upload API Error:', err);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการเขียนไฟล์' }, { status: 500 });
  }
}
