import { db } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import styles from './infographics-admin.module.css';
import DeleteInfographicBtn from './DeleteInfographicBtn';
import AddInfographicForm from './AddInfographicForm';

export const dynamic = 'force-dynamic';

export default async function AdminInfographicsPage() {
  // Query all infographics
  const res = await db.query('SELECT * FROM hero_infographics ORDER BY display_order ASC, created_at DESC');
  const items = res.rows;

  // Server Action to delete an infographic
  const deleteAction = async (id: number) => {
    'use server';
    await db.query('DELETE FROM hero_infographics WHERE id = $1', [id]);
    revalidatePath('/admin/infographics');
    revalidatePath('/');
  };

  // Server Action to save a new infographic
  const saveAction = async (payload: { title: string; image_url: string; display_order: number }) => {
    'use server';
    try {
      await db.query(
        'INSERT INTO hero_infographics (title, image_url, display_order) VALUES ($1, $2, $3)',
        [payload.title, payload.image_url, payload.display_order]
      );
      revalidatePath('/admin/infographics');
      revalidatePath('/');
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'บันทึกข้อมูลล้มเหลว' };
    }
  };

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🎨 จัดการรูปภาพอินโฟกราฟฟิคหน้าแรก (Hero Slider)</h1>
          <p className={styles.subtitle}>เพิ่มหรือลบรูปภาพที่จะแสดงและสไลด์หมุนเวียนในหน้าแรกของเว็บไซต์</p>
        </div>
        <Link href="/admin" className={styles.backBtn}>
          &larr; กลับหน้าหลักหลังบ้าน
        </Link>
      </div>

      <div className={styles.dashboardLayout}>
        {/* Infographics List */}
        <div className={styles.listCard}>
          <h3 className={styles.listTitle}>🖼️ รายการรูปภาพแสดงผลปัจจุบัน</h3>
          {items.length === 0 ? (
            <div style={{ color: 'var(--muted-foreground)', textAlign: 'center', padding: '40px' }}>
              ยังไม่มีรูปภาพอินโฟกราฟฟิคในระบบ
            </div>
          ) : (
            <div className={styles.grid}>
              {items.map((item) => (
                <div key={item.id} className={styles.imgCard}>
                  <div className={styles.imageWrapper}>
                    <img src={item.image_url} alt={item.title || "infographic"} />
                  </div>
                  <div className={styles.cardBody}>
                    <h4 className={styles.imgTitle} title={item.title || "Infographic"}>
                      {item.title || "ไม่มีชื่อรูปภาพ"}
                    </h4>
                    <span className={styles.orderBadge}>ลำดับ: {item.display_order}</span>
                    <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                      <DeleteInfographicBtn id={item.id} deleteAction={deleteAction} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Form */}
        <div>
          <AddInfographicForm saveAction={saveAction} />
        </div>
      </div>
    </div>
  );
}
