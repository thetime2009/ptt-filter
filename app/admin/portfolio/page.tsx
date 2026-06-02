import { db } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import styles from './portfolio-admin.module.css';
import DeletePortfolioBtn from './DeletePortfolioBtn';
import { parseProductImages } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolioPage() {
  const res = await db.query('SELECT * FROM portfolio_items ORDER BY created_at DESC');
  const items = res.rows;

  // Server Action to delete a portfolio item
  const deleteAction = async (id: number) => {
    'use server';
    await db.query('DELETE FROM portfolio_items WHERE id = $1', [id]);
    revalidatePath('/admin/portfolio');
    revalidatePath('/gallery');
  };

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>จัดการผลงานของเรา (Portfolio)</h1>
          <p className={styles.subtitle}>เพิ่ม แก้ไข หรือลบรูปภาพและรายละเอียดผลงานที่แสดงในแกลเลอรี</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin" className={styles.addBtn} style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
            &larr; กลับหน้าหลัก
          </Link>
          <Link href="/admin/portfolio/new" className={styles.addBtn}>
            ➕ เพิ่มผลงานใหม่
          </Link>
        </div>
      </div>

      <div className={`${styles.tableWrapper} glass`}>
        {items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
            ยังไม่มีรายการผลงานในระบบ กดปุ่มด้านบนเพื่อเพิ่มผลงานแรกของคุณ
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>รูปภาพ</th>
                <th>ชื่องาน / โครงการ</th>
                <th>แท็ก</th>
                <th>วันที่สร้าง</th>
                <th style={{ width: '180px', textAlign: 'right' }}>เครื่องมือ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const images = parseProductImages(item.images);
                const firstImg = images.length > 0 ? images[0] : '';
                return (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.imgThumb}>
                        {firstImg ? (
                          <img src={firstImg} alt="first" />
                        ) : (
                          <span style={{ fontSize: '20px' }}>🖼️</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.title_th}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{item.title}</div>
                    </td>
                    <td>
                      <div className={styles.tagsContainer}>
                        {item.tags ? (
                          item.tags.split(',').map((tag: string, idx: number) => (
                            <span key={idx} className={styles.tagBadge}>
                              {tag.trim()}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--muted-foreground)', fontSize: '13px' }}>-</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                      {new Date(item.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/admin/portfolio/${item.id}/edit`} className={styles.editBtn}>
                          แก้ไข
                        </Link>
                        <DeletePortfolioBtn itemId={item.id} deleteAction={deleteAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
