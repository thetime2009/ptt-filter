import { db } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import styles from './inquiries-admin.module.css';
import DeleteInquiryBtn from './DeleteInquiryBtn';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const res = await db.query('SELECT * FROM custom_inquiries ORDER BY created_at DESC');
  const inquiries = res.rows;

  // Server Action to delete an inquiry
  const deleteAction = async (id: number) => {
    'use server';
    await db.query('DELETE FROM custom_inquiries WHERE id = $1', [id]);
    revalidatePath('/admin/inquiries');
  };

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>รายการขอใบเสนอราคาไส้กรองสั่งผลิต (Custom Inquiries)</h1>
          <p className={styles.subtitle}>ดูข้อมูลรายละเอียดชิ้นส่วนประกอบและขนาดที่ลูกค้าออกแบบจำลองส่งเข้ามา</p>
        </div>
        <Link href="/admin" className={styles.backBtn}>
          &larr; กลับหน้าหลักหลังบ้าน
        </Link>
      </div>

      <div className={styles.listContainer}>
        {inquiries.length === 0 ? (
          <div className={`${styles.noData} glass`}>
            <span>📥</span>
            <p>ยังไม่มีคำขอใบเสนอราคาจำลองประกอบส่งเข้ามาในระบบ</p>
          </div>
        ) : (
          inquiries.map((inq) => {
            let specs = {} as any;
            try {
              specs = typeof inq.specs === 'string' ? JSON.parse(inq.specs) : inq.specs;
            } catch (e) {
              specs = {};
            }

            return (
              <div key={inq.id} className={`${styles.inquiryCard} glass`}>
                <div className={styles.cardHeader}>
                  <div className={styles.customerInfo}>
                    <h3 className={styles.customerName}>{inq.name}</h3>
                    <span className={styles.date}>
                      📅 {new Date(inq.created_at).toLocaleString('th-TH')}
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <DeleteInquiryBtn inquiryId={inq.id} deleteAction={deleteAction} />
                  </div>
                </div>

                <div className={styles.cardBody}>
                  {/* Contact details */}
                  <div className={styles.contactRow}>
                    <div><strong>📧 อีเมล:</strong> <a href={`mailto:${inq.email}`}>{inq.email}</a></div>
                    {inq.phone && <div><strong>📞 โทรศัพท์:</strong> <a href={`tel:${inq.phone}`}>{inq.phone}</a></div>}
                  </div>

                  {/* Specifications details */}
                  <div className={styles.specsWrapper}>
                    <h4 className={styles.specsTitle}>รายละเอียดโครงสร้างประกอบ:</h4>
                    <div className={styles.specsGrid}>
                      <div className={styles.specItem}>
                        <span>ประเภทการกรอง:</span>
                        <strong>
                          {specs.category === 'dust' ? 'ฝุ่นละออง' :
                           specs.category === 'oil' ? 'น้ำมันไฮดรอลิก' :
                           specs.category === 'odor' ? 'กลิ่น / คาร์บอน' :
                           specs.category === 'smoke' ? 'ควันไอเสีย' :
                           specs.category === 'sediment' ? 'ตะกอนและของแข็ง' : 'อื่นๆ'}
                        </strong>
                      </div>
                      <div className={styles.specItem}>
                        <span>ฝาบน (Upper Cap):</span>
                        <strong>{specs.capTop === 'through' ? 'เจาะรูทะลุ' : 'ฝาปิดทึบ/อื่นๆ'}</strong>
                      </div>
                      <div className={styles.specItem}>
                        <span>ฝาล่าง (Lower Cap):</span>
                        <strong>
                          {specs.capBottom === 'closed' ? 'ฝาปิดทึบ' :
                           specs.capBottom === 'through' ? 'เจาะรูทะลุ' : 'ฝาอื่นๆ'}
                        </strong>
                      </div>
                      <div className={styles.specItem}>
                        <span>ซีล / ปะเก็น:</span>
                        <strong>
                          {specs.seal === 'sponge' ? 'ซีลฟองน้ำดำ' :
                           specs.seal === 'oil' ? 'ซีลยางส้มกันน้ำมัน' : 'ยางโอริง'}
                        </strong>
                      </div>
                      <div className={styles.specItem}>
                        <span>วัสดุกรอง (Media):</span>
                        <strong>
                          {specs.media === 'polyester' ? 'Polyester สีขาว' :
                           specs.media === 'cellulose' ? `Cellulose (${specs.mediaDetails})` :
                           `ตะแกรงละเอียด (${specs.mediaDetails})`}
                        </strong>
                      </div>
                      <div className={styles.specItem}>
                        <span>ตะแกรงนอก:</span>
                        <strong>
                          {specs.meshOuter === 'round' ? 'รูกลมสับหว่าง' :
                           specs.meshOuter === 'diamond' ? 'รูข้าวหลามตัด' : 'ตะแกรงลวดละเอียด'}
                        </strong>
                      </div>
                      <div className={styles.specItem}>
                        <span>ตะแกรงใน:</span>
                        <strong>
                          {specs.meshInner === 'round' ? 'รูกลมสับหว่าง' :
                           specs.meshInner === 'diamond' ? 'รูข้าวหลามตัด' :
                           specs.meshInner === 'square' ? 'รูสี่เหลี่ยม' : 'ตะแกรงลวดละเอียด'}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.dimensionsRow}>
                      <div className={styles.dimensionItem}>
                        <span>ขนาดเส้นผ่านศูนย์กลางนอก (OD):</span>
                        <strong>{specs.outerDiameter || '-'}</strong>
                      </div>
                      <div className={styles.dimensionItem}>
                        <span>ขนาดเส้นผ่านศูนย์กลางใน (ID):</span>
                        <strong>{specs.innerDiameter || '-'}</strong>
                      </div>
                      <div className={styles.dimensionItem}>
                        <span>ความสูง (H):</span>
                        <strong>{specs.height || '-'}</strong>
                      </div>
                      <div className={styles.dimensionItem} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '12px' }}>
                        <span>จำนวนสั่งผลิต:</span>
                        <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{specs.quantity || '1 ชิ้น'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Customer message */}
                  {inq.message && (
                    <div className={styles.messageBox}>
                      <strong>📝 หมายเหตุสั่งทำเพิ่มเติม:</strong>
                      <p>{inq.message}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
