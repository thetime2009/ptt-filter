import { db } from '@/lib/db';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { translations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';
import styles from './gallery-detail.module.css';
import { parseProductImages } from '@/lib/utils';
import ProductImages from '../../products/[id]/ProductImages';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const getCachedPortfolioItem = unstable_cache(
  async (id: number) => {
    const res = await db.query('SELECT * FROM portfolio_items WHERE id = $1', [id]);
    return res.rows[0];
  },
  ['portfolio-detail'],
  { tags: ['portfolio'] }
);

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const itemId = parseInt(resolvedParams.id);

  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || 'th') as Locale;
  const t = translations[locale] || translations.th;

  const item = await getCachedPortfolioItem(itemId);

  if (!item) {
    return (
      <div className={`${styles.notFound} container`}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚠️</div>
        <h2>{locale === 'th' ? 'ไม่พบข้อมูลผลงานโครงการ' : 'Project Not Found'}</h2>
        <p style={{ color: 'var(--muted-foreground)', marginTop: '8px' }}>
          {locale === 'th'
            ? 'โครงการผลงานนี้อาจถูกลบหรือไม่มีอยู่ในระบบ'
            : 'The portfolio item might have been deleted or does not exist.'}
        </p>
        <Link href="/gallery" className={styles.backBtn} style={{ marginTop: '24px', display: 'inline-block' }}>
          {locale === 'th' ? '← กลับหน้าแกลเลอรี' : '← Back to Gallery'}
        </Link>
      </div>
    );
  }

  const images = parseProductImages(item.images);
  const displayTitle = locale === 'th' ? item.title_th || item.title : item.title;
  const displayDesc = locale === 'th' ? item.description_th || item.description : item.description;

  return (
    <div className={`${styles.container} container`}>
      <Link href="/gallery" className={styles.backBtn}>
        {locale === 'th' ? '← กลับหน้าแกลเลอรี' : '← Back to Gallery'}
      </Link>

      <div className={styles.layout}>
        {/* Project Images Gallery */}
        <div className={styles.imageArea}>
          <ProductImages images={images} name={displayTitle} />
        </div>

        {/* Project Details */}
        <div className={styles.infoArea}>
          {item.tags && (
            <div className={styles.tagsContainer}>
              {item.tags.split(',').map((tag: string, idx: number) => (
                <Link key={idx} href={`/gallery?tag=${encodeURIComponent(tag.trim())}`} className={styles.tagBadge}>
                  #{tag.trim()}
                </Link>
              ))}
            </div>
          )}

          <h1 className={styles.title}>{displayTitle}</h1>
          
          <div className={styles.divider}></div>

          <div className={styles.desc}>
            {displayDesc || (
              <span style={{ fontStyle: 'italic', color: 'var(--muted-foreground)' }}>
                {locale === 'th' ? 'ไม่มีคำอธิบายสำหรับโครงการนี้' : 'No description available for this project.'}
              </span>
            )}
          </div>

          {/* Contact Inquiry CTA Card */}
          <div className={`${styles.contactBox} glass`}>
            <h4 className={styles.contactTitle}>
              {locale === 'th'
                ? 'สนใจติดตั้งระบบกรองลักษณะนี้?'
                : locale === 'zh'
                ? '对此类过滤系统感兴趣？'
                : 'Interested in this type of installation?'}
            </h4>
            <p className={styles.contactDesc}>
              {locale === 'th'
                ? 'เราให้บริการออกแบบ ผลิตโครงสร้าง และติดตั้งหน้างานจริงโดยทีมวิศวกรผู้เชี่ยวชาญ ยินดีรับประเมินหน้างานและเสนอราคาฟรี'
                : locale === 'zh'
                ? '我们提供由专业工程师团队设计、结构制造及现场安装的一站式服务。欢迎联系我们进行现场评估与免费报价。'
                : 'We offer layout design, filter structure fabrication, and complete on-site installation by professional engineers. Contact us for custom quotes.'}
            </p>
            <Link href="/contact" className={styles.contactBtn}>
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
