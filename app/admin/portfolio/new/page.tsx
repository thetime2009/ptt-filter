import { db } from '@/lib/db';
import PortfolioForm from '../PortfolioForm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewPortfolioPage() {
  // Server Action to create the portfolio item
  const createAction = async (payload: any) => {
    'use server';

    try {
      await db.query(`
        INSERT INTO portfolio_items (title, title_th, description, description_th, images, tags)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        payload.title,
        payload.title_th,
        payload.description,
        payload.description_th,
        payload.images,
        payload.tags
      ]);
      
      revalidatePath('/admin/portfolio');
      revalidatePath('/gallery');
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'บันทึกข้อมูลล้มเหลว' };
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/portfolio" style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
          &larr; กลับหน้ารายการผลงาน
        </Link>
      </div>
      <PortfolioForm saveAction={createAction} />
    </div>
  );
}
