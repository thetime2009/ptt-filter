import Link from 'next/link';
import { db } from '@/lib/db';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Query counts and stats
  const productsCountRes = await db.query('SELECT COUNT(*) as count FROM products');
  const productsCount = productsCountRes.rows[0];

  const categoriesCountRes = await db.query('SELECT COUNT(*) as count FROM categories');
  const categoriesCount = categoriesCountRes.rows[0];

  const portfolioCountRes = await db.query('SELECT COUNT(*) as count FROM portfolio_items');
  const portfolioCount = portfolioCountRes.rows[0];

  const inquiriesCountRes = await db.query('SELECT COUNT(*) as count FROM custom_inquiries');
  const inquiriesCount = inquiriesCountRes.rows[0];

  const recentProductsRes = await db.query(`
    SELECT p.*, c.name_th as category_name_th 
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    ORDER BY p.id DESC LIMIT 5
  `);
  const recentProducts = recentProductsRes.rows;

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>ระบบจัดการหลังบ้าน (Admin Panel)</h1>
          <p className={styles.subtitle}>ยินดีต้อนรับผู้ดูแลระบบ จัดการสินค้า ข้อมูลโครงสร้าง และหมวดหมู่ได้ที่นี่</p>
        </div>
        <Link href="/admin/products/new" className={styles.addBtn}>
          ➕ เพิ่มสินค้าใหม่
        </Link>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statIcon}>⚙️</span>
          <div>
            <h3 className={styles.statVal}>{productsCount?.count || 0}</h3>
            <p className={styles.statLabel}>สินค้าทั้งหมด</p>
          </div>
        </div>

        <div className={`${styles.statCard} glass`}>
          <span className={styles.statIcon}>📁</span>
          <div>
            <h3 className={styles.statVal}>{categoriesCount?.count || 0}</h3>
            <p className={styles.statLabel}>หมวดหมู่สินค้า</p>
          </div>
        </div>

        <div className={`${styles.statCard} glass`}>
          <span className={styles.statIcon}>🖼️</span>
          <div>
            <h3 className={styles.statVal}>{portfolioCount?.count || 0}</h3>
            <p className={styles.statLabel}>ผลงานทั้งหมด</p>
          </div>
        </div>

        <div className={`${styles.statCard} glass`}>
          <span className={styles.statIcon}>📥</span>
          <div>
            <h3 className={styles.statVal}>{inquiriesCount?.count || 0}</h3>
            <p className={styles.statLabel}>คำขอใบเสนอราคา</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Recent Products Table */}
        <div className={`${styles.tableCard} glass`}>
          <div className={styles.tableHeader}>
            <h3>สินค้าที่เพิ่มล่าสุด</h3>
            <Link href="/admin/products" style={{ color: 'var(--primary)', fontSize: '14px' }}>
              จัดการทั้งหมด &rarr;
            </Link>
          </div>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted-foreground)' }}>
                    ยังไม่มีข้อมูลสินค้า
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => {
                  let images = [];
                  try { images = JSON.parse(p.images || '[]'); } catch(e) {}
                  const firstImg = images.length > 0 ? images[0] : '';
                  return (
                    <tr key={p.id}>
                      <td style={{ width: '60px' }}>
                        <div className={styles.tableImg}>
                          {firstImg ? <img src={firstImg} alt={p.name} /> : '⚙️'}
                        </div>
                      </td>
                      <td>
                        <strong>{p.name_th || p.name}</strong>
                      </td>
                      <td>{p.category_name_th}</td>
                      <td>
                        <span className={p.is_active ? styles.statusActive : styles.statusInactive}>
                          {p.is_active ? 'แสดงผล' : 'ปิดการแสดงผล'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Shortcuts / Quick Actions */}
        <div className={`${styles.tableCard} glass`} style={{ flex: '0 0 320px' }}>
          <h3 style={{ marginBottom: '20px' }}>การนำทางด่วน</h3>
          <div className={styles.quickList}>
            <Link href="/admin/products" className={styles.quickItem}>
              📦 จัดการข้อมูลและรายการสินค้า
            </Link>
            <Link href="/admin/products/new" className={styles.quickItem}>
              ➕ อัพโหลดสินค้าและสเปคใหม่
            </Link>
            <Link href="/admin/portfolio" className={styles.quickItem}>
              🖼️ จัดการรูปภาพและผลงาน (Portfolio)
            </Link>
            <Link href="/admin/portfolio/new" className={styles.quickItem}>
              ➕ เพิ่มผลงานหรือโครงการใหม่
            </Link>
            <Link href="/admin/inquiries" className={styles.quickItem}>
              📥 ดูคำขอใบเสนอราคาจำลอง (Inquiries)
            </Link>
            <Link href="/admin/infographics" className={styles.quickItem}>
              🎨 จัดการรูปภาพสไลด์หน้าแรก (Hero Image)
            </Link>
            <Link href="/gallery" target="_blank" className={styles.quickItem}>
              👁️ เปิดชมหน้าแกลเลอรีผลงาน
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
