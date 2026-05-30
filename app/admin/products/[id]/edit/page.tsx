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
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as any;
  const categories = db.prepare('SELECT * FROM categories').all() as any[];

  if (!product) {
    notFound();
  }

  // Server Action to update the product
  const updateAction = async (payload: any) => {
    'use server';

    try {
      db.prepare(`
        UPDATE products 
        SET name = @name, 
            name_th = @name_th, 
            slug = @slug, 
            category_id = @category_id, 
            description = @description, 
            description_th = @description_th, 
            images = @images, 
            specs = @specs, 
            is_active = @is_active,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
      `).run(payload);
      
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
