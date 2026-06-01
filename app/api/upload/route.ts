import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'ไม่พบไฟล์ภาพ' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to Base64 Data URL to allow database storage and bypass read-only filesystem limitations on Vercel
    const mimeType = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      filePath: dataUri
    });
  } catch (err: any) {
    console.error('Upload API Error:', err);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการเขียนไฟล์' }, { status: 500 });
  }
}
