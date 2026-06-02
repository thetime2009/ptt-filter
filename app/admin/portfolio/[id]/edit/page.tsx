import { db } from '@/lib/db';
import PortfolioForm from '../../PortfolioForm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const itemId = parseInt(resolvedParams.id);
  const res = await db.query('SELECT * FROM portfolio_items WHERE id = $1', [itemId]);
  const item = res.rows[0];

  if (!item) {
    notFound();
  }

  // Server Action to update the portfolio item
  const updateAction = async (payload: any) => {
    'use server';

    try {
      await db.query(`
        UPDATE portfolio_items 
        SET title = $1, 
            title_th = $2, 
            description = $3, 
            description_th = $4, 
            images = $5, 
            tags = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
      `, [
        payload.title,
        payload.title_th,
        payload.description,
        payload.description_th,
        payload.images,
        payload.tags,
        payload.id
      ]);
      
      revalidatePath('/admin/portfolio');
      revalidatePath(`/gallery/${payload.id}`);
      revalidatePath('/gallery');
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'ปรับปรุงข้อมูลล้มเหลว' };
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/portfolio" style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
          &larr; กลับหน้ารายการผลงาน
        </Link>
      </div>
      <PortfolioForm initialItem={item} saveAction={updateAction} />
    </div>
  );
}
