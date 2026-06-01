import { db } from '@/lib/db';
import ProductForm from '@/app/admin/products/ProductForm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categoriesRes = await db.query('SELECT * FROM categories');
  const categories = categoriesRes.rows;

  // Server Action to create the product
  const createAction = async (payload: any) => {
    'use server';

    try {
      await db.query(`
        INSERT INTO products (name, name_th, slug, category_id, description, description_th, images, specs, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        payload.name,
        payload.name_th,
        payload.slug,
        parseInt(payload.category_id),
        payload.description,
        payload.description_th,
        payload.images,
        payload.specs,
        payload.is_active ? 1 : 0
      ]);
      
      revalidatePath('/admin/products');
      revalidatePath('/products');
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'บันทึกข้อมูลล้มเหลว' };
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/products" style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
          &larr; กลับหน้ารายการสินค้า
        </Link>
      </div>
      <ProductForm categories={categories} saveAction={createAction} />
    </div>
  );
}
