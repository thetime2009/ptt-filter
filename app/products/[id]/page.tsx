import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import styles from './product-detail.module.css';
import { cookies } from 'next/headers';
import { translations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || 'th') as Locale;
  const t = translations[locale] || translations.th;

  const productRes = await db.query(`
    SELECT p.*, c.name as category_name_en, c.name_th as category_name_th 
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    WHERE p.id = $1 AND p.is_active = 1
  `, [productId]);
  const product = productRes.rows[0];

  if (!product) {
    return (
      <div className={`${styles.notFound} container`}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚠️</div>
        <h2>{locale === 'th' ? 'ไม่พบข้อมูลผลิตภัณฑ์' : 'Product Not Found'}</h2>
        <p style={{ color: 'var(--muted-foreground)', marginTop: '8px' }}>
          {locale === 'th' ? 'สินค้าอาจถูกลบหรือไม่มีอยู่ในระบบ' : 'The product might have been deleted or does not exist.'}
        </p>
        <Link href="/products" className={styles.backBtn} style={{ marginTop: '24px', display: 'inline-block' }}>
          {t.productDetail.back}
        </Link>
      </div>
    );
  }

  let images = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch (e) {
    images = [];
  }
  const firstImg = images.length > 0 ? images[0] : '';

  let specs = {} as Record<string, string>;
  try {
    specs = JSON.parse(product.specs || '{}');
  } catch (e) {
    specs = {};
  }

  const categoryName = locale === 'th' 
    ? product.category_name_th || product.category_name_en 
    : product.category_name_en;

  const name = locale === 'th' 
    ? product.name_th || product.name 
    : product.name;

  const description = locale === 'th' 
    ? product.description_th || product.description 
    : product.description;

  return (
    <div className={`${styles.container} container`}>
      <Link href="/products" className={styles.backBtn}>
        {t.productDetail.back}
      </Link>

      <div className={styles.layout}>
        {/* Product Media */}
        <div className={styles.imageArea}>
          <div className={styles.mainImagePlaceholder}>
            {firstImg ? (
              <img
                src={firstImg}
                alt={name}
                className={styles.image}
              />
            ) : (
              <span>⚙️</span>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((img: string, idx: number) => (
                <div key={idx} className={styles.thumb}>
                  <Image src={img} alt={`thumbnail-${idx}`} width={80} height={80} style={{ objectFit: 'cover', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className={styles.infoArea}>
          <span className={styles.category}>{categoryName}</span>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.desc}>{description}</p>

          {Object.keys(specs).length > 0 && (
            <div className={styles.specsSection}>
              <h3 className={styles.specsTitle}>{t.productDetail.spec}</h3>
              <table className={styles.specsTable}>
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key} className={styles.specRow}>
                      <td className={styles.specLabel}>{key}</td>
                      <td className={styles.specVal}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Call to Action for Business queries */}
          <div className={`${styles.contactBox} glass`}>
            <h4 className={styles.contactTitle}>{t.productDetail.inquire}</h4>
            <p className={styles.contactDesc}>
              {locale === 'th' 
                ? 'โครงสร้างไส้กรองของเราสามารถปรับแต่งขนาดและวัสดุตามเครื่องจักรและเป้าหมายการใช้งานอุตสาหกรรมของท่านได้' 
                : locale === 'zh'
                  ? '我们的过滤器结构可以根据您的机器和工业应用目标定制尺寸和材料。'
                  : 'Our filter structures can be custom-tailored in size and materials to fit your machinery and industrial applications.'}
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
