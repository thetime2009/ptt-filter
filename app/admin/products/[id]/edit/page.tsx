import { db } from '@/lib/db';
import ProductForm from '@/app/admin/products/ProductForm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);
  const productRes = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
  const product = productRes.rows[0];
  const categoriesRes = await db.query('SELECT * FROM categories');
  const categories = categoriesRes.rows;

  if (!product) {
    notFound();
  }

  // Server Action to update the product
  const updateAction = async (payload: any) => {
    'use server';

    try {
      await db.query(`
        UPDATE products 
        SET name = $1, 
            name_th = $2, 
            slug = $3, 
            category_id = $4, 
            description = $5, 
            description_th = $6, 
            images = $7, 
            specs = $8, 
            is_active = $9,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
      `, [
        payload.name,
        payload.name_th,
        payload.slug,
        parseInt(payload.category_id),
        payload.description,
        payload.description_th,
        payload.images,
        payload.specs,
        payload.is_active ? 1 : 0,
        payload.id
      ]);
      
      revalidatePath('/admin/products');
      revalidatePath(`/products/${payload.id}`);
      revalidatePath('/products');
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'ปรับปรุงข้อมูลล้มเหลว' };
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/products" style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
          &larr; กลับหน้ารายการสินค้า
        </Link>
      </div>
      <ProductForm categories={categories} initialProduct={product} saveAction={updateAction} />
    </div>
  );
}
