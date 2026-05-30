import Link from 'next/link';
import { db } from '@/lib/db';
import styles from '../admin.module.css';
import { revalidatePath } from 'next/cache';
import DeleteProductBtn from './DeleteProductBtn';

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
  const products = db.prepare(`
    SELECT p.*, c.name_th as category_name_th 
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    ORDER BY p.id DESC
  `).all() as any[];

  // Server action to delete product
  const deleteProductAction = async (id: number) => {
    'use server';
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    revalidatePath('/admin/products');
    revalidatePath('/products');
  };

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>จัดการรายการสินค้า</h1>
          <p className={styles.subtitle}>เพิ่ม แก้ไข หรือลบข้อมูลโครงสร้างไส้กรองและสินค้า</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin" className={styles.addBtn} style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
            &larr; กลับหน้าหลัก
          </Link>
          <Link href="/admin/products/new" className={styles.addBtn}>
            ➕ เพิ่มสินค้าใหม่
          </Link>
        </div>
      </div>

      <div className={`${styles.tableCard} glass`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>รูปภาพ</th>
              <th>ชื่อสินค้า (TH)</th>
              <th>ชื่อสินค้า (EN)</th>
              <th>หมวดหมู่</th>
              <th>สถานะการแสดงผล</th>
              <th style={{ textAlign: 'right' }}>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-foreground)' }}>
                  ยังไม่มีการเพิ่มรายการสินค้าใดๆ เข้ามาในระบบ
                </td>
              </tr>
            ) : (
              products.map((p) => {
                let images = [];
                try { images = JSON.parse(p.images || '[]'); } catch(e) {}
                const firstImg = images.length > 0 ? images[0] : '';
                return (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.tableImg}>
                        {firstImg ? <img src={firstImg} alt={p.name} /> : '⚙️'}
                      </div>
                    </td>
                    <td>
                      <strong>{p.name_th}</strong>
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category_name_th}</td>
                    <td>
                      <span className={p.is_active ? styles.statusActive : styles.statusInactive}>
                        {p.is_active ? 'แสดงผล' : 'ปิดการแสดงผล'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        <Link href={`/admin/products/${p.id}/edit`} style={{ padding: '6px 12px', background: 'var(--secondary)', borderRadius: '4px', fontSize: '13px' }}>
                          แก้ไข
                        </Link>
                        <DeleteProductBtn productId={p.id} deleteAction={deleteProductAction} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
