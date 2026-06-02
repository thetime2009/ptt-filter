import { db } from '@/lib/db';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { translations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';
import styles from './custom-builder.module.css';
import BuilderFormClient from './BuilderFormClient';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function CustomFilterPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || 'th') as Locale;
  const t = translations[locale] || translations.th;

  // Server Action to handle the custom builder inquiry submission
  const submitInquiryAction = async (payload: any) => {
    'use server';

    try {
      await db.query(`
        INSERT INTO custom_inquiries (name, email, phone, specs, message)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        payload.name,
        payload.email,
        payload.phone || '',
        JSON.stringify(payload.specs),
        payload.message || ''
      ]);

      revalidatePath('/admin');
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล ขออภัยในความไม่สะดวก' };
    }
  };

  return (
    <div className={`${styles.container} container`}>
      {/* Header section */}
      <div className={styles.header}>
        <span className={styles.badge}>
          {locale === 'th' ? '✦ บริการสั่งทำพิเศษ' : locale === 'zh' ? '✦ 独家定制' : '✦ MADE TO ORDER'}
        </span>
        <h1 className={styles.title}>
          {locale === 'th' ? 'ออกแบบไส้กรองและสเปกโครงสร้างเอง' : locale === 'zh' ? '自主设计过滤器规格与结构' : 'Custom Filter Configurator'}
        </h1>
        <p className={styles.subtitle}>
          {locale === 'th'
            ? 'เลือกส่วนประกอบ ขนาด และวัสดุตามต้องการ ระบบจะวาดแปลนไส้กรองจำลองตามสเปกที่คุณกำหนด สามารถส่งข้อมูลขอใบเสนอราคากับวิศวกรได้โดยตรง'
            : locale === 'zh'
            ? '根据需求定制尺寸与部件材料，系统实时模拟装配图纸，可直接向我们的技术团队发送询价。'
            : 'Select filter components, custom dimensions, and materials. Visualize the custom assembly real-time and send it to our engineering team for a quote.'}
        </p>
      </div>

      {/* Render the Client Side Form which combines option selector & SVG visualizer */}
      <BuilderFormClient locale={locale} submitAction={submitInquiryAction} />
    </div>
  );
}
