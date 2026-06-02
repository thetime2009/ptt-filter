import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { translations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';
import styles from './gallery.module.css';
import { parseProductImages } from '@/lib/utils';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const getCachedPortfolio = unstable_cache(
  async () => {
    const res = await db.query('SELECT * FROM portfolio_items ORDER BY created_at DESC');
    return res.rows;
  },
  ['portfolio-list'],
  { tags: ['portfolio'] }
);

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeTag = resolvedParams?.tag || '';

  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || 'th') as Locale;
  const t = translations[locale] || translations.th;

  const items = await getCachedPortfolio();

  // Extract all unique tags
  const allTags = new Set<string>();
  items.forEach((item) => {
    if (item.tags) {
      item.tags.split(',').forEach((tag: string) => {
        const trimmed = tag.trim();
        if (trimmed) allTags.add(trimmed);
      });
    }
  });

  // Filter items if active tag is specified
  const filteredItems = activeTag
    ? items.filter((item) =>
        item.tags
          ? item.tags
              .split(',')
              .map((t: string) => t.trim().toLowerCase())
              .includes(activeTag.toLowerCase())
          : false
      )
    : items;

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.headerArea}>
        <span className={styles.badge}>
          {locale === 'th' ? '✦ แกลเลอรีผลงาน' : locale === 'zh' ? '✦ 工程案例' : '✦ OUR PORTFOLIO'}
        </span>
        <h1 className={styles.title}>
          {locale === 'th'
            ? 'ความไว้วางใจจากหน้างานจริง'
            : locale === 'zh'
            ? '客户现场真实案例'
            : 'Trusted Installations & Projects'}
        </h1>
        <p className={styles.subtitle}>
          {locale === 'th'
            ? 'ภาพถ่ายจริงจากการออกแบบและติดตั้งโครงสร้างไส้กรองและระบบกรองอากาศควันฝุ่นของบริษัทในกลุ่มอุตสาหกรรมหนักต่าง ๆ'
            : locale === 'zh'
            ? '我们在各类重工业企业设计和安装的空气、烟雾和除尘过滤器结构的真实工程照片展示'
            : 'Real on-site pictures of filter structures and air/smoke/dust filtration systems engineered for heavy industries.'}
        </p>
      </div>

      {/* Tags Filtering Section */}
      {allTags.size > 0 && (
        <div className={styles.tagsFilterWrapper}>
          <Link
            href="/gallery"
            className={`${styles.tagFilterItem} ${!activeTag ? styles.tagFilterActive : ''}`}
          >
            {locale === 'th' ? 'ทั้งหมด' : locale === 'zh' ? '全部' : 'All'}
          </Link>
          {Array.from(allTags).map((tag) => (
            <Link
              key={tag}
              href={`/gallery?tag=${encodeURIComponent(tag)}`}
              className={`${styles.tagFilterItem} ${
                activeTag.toLowerCase() === tag.toLowerCase() ? styles.tagFilterActive : ''
              }`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Grid of Portfolio Cards */}
      {filteredItems.length === 0 ? (
        <div className={`${styles.noItems} glass`}>
          <span>🖼️</span>
          <h3>
            {locale === 'th'
              ? 'ไม่พบข้อมูลผลงานในแท็กนี้'
              : locale === 'zh'
              ? '未找到该标签下的案例'
              : 'No projects found with this tag'}
          </h3>
          <Link href="/gallery" className={styles.resetBtn}>
            {locale === 'th' ? 'แสดงทั้งหมด' : locale === 'zh' ? '显示全部' : 'Show All'}
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map((item) => {
            const images = parseProductImages(item.images);
            const firstImg = images.length > 0 ? images[0] : '';
            const displayTitle = locale === 'th' ? item.title_th || item.title : item.title;
            const displayDesc = locale === 'th' ? item.description_th || item.description : item.description;

            return (
              <Link href={`/gallery/${item.id}`} key={item.id} className={`${styles.card} glass`}>
                <div className={styles.imageWrapper}>
                  {firstImg ? (
                    <Image
                      src={firstImg}
                      alt={displayTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.image}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>🖼️</div>
                  )}
                  {item.tags && (
                    <div className={styles.cardTags}>
                      {item.tags.split(',').slice(0, 2).map((tag: string, idx: number) => (
                        <span key={idx} className={styles.cardTag}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{displayTitle}</h3>
                  <p className={styles.cardDesc}>
                    {displayDesc && displayDesc.length > 120
                      ? `${displayDesc.substring(0, 120)}...`
                      : displayDesc}
                  </p>
                  <span className={styles.learnMore}>
                    {locale === 'th' ? 'ดูรายละเอียดโครงการ' : locale === 'zh' ? '查看案例详情' : 'View Project Details'} &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
