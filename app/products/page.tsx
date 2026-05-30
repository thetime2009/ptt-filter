import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import styles from './products.module.css';
import { cookies } from 'next/headers';
import { translations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const selectedCategorySlug = resolvedParams?.category || '';

  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || 'th') as Locale;
  const t = translations[locale] || translations.th;

  // Get categories for sidebar
  const categories = db.prepare('SELECT * FROM categories').all() as any[];

  // Get products based on filter query
  let products = [];
  if (selectedCategorySlug) {
    products = db.prepare(`
      SELECT p.*, c.name as category_name_en, c.name_th as category_name_th 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE c.slug = ? AND p.is_active = 1
    `).all(selectedCategorySlug) as any[];
  } else {
    products = db.prepare(`
      SELECT p.*, c.name as category_name_en, c.name_th as category_name_th 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1
    `).all() as any[];
  }

  return (
    <div className={`${styles.container} container`}>
      <h1 className={styles.title}>{t.products.title}</h1>
      <p className={styles.desc}>{t.products.desc}</p>

      <div className={styles.layout}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={`${styles.sidebarGroup} glass`}>
            <h3 className={styles.groupTitle}>{t.products.categoryFilter}</h3>
            <div className={styles.filterList}>
              <Link
                href="/products"
                className={`${styles.filterItem} ${!selectedCategorySlug ? styles.activeFilter : ''}`}
              >
                {t.products.all}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`${styles.filterItem} ${selectedCategorySlug === cat.slug ? styles.activeFilter : ''}`}
                >
                  {locale === 'th' ? cat.name_th || cat.name : cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main style={{ flex: 1 }}>
          {products.length === 0 ? (
            <div className={`${styles.noProducts} glass`}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗙</div>
              <h3>{t.products.noProducts}</h3>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((prod) => {
                let images = [];
                try {
                  images = JSON.parse(prod.images || '[]');
                } catch (e) {
                  images = [];
                }
                const firstImg = images.length > 0 ? images[0] : '';

                const categoryName = locale === 'th' 
                  ? prod.category_name_th || prod.category_name_en 
                  : prod.category_name_en;

                const name = locale === 'th' 
                  ? prod.name_th || prod.name 
                  : prod.name;

                const description = locale === 'th' 
                  ? prod.description_th || prod.description 
                  : prod.description;

                return (
                  <Link href={`/products/${prod.id}`} key={prod.id} className={`${styles.productCard} glass`}>
                    <div className={styles.imagePlaceholder}>
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
                    <div className={styles.productContent}>
                      <span className={styles.catBadge}>{categoryName}</span>
                      <h3 className={styles.prodTitle}>{name}</h3>
                      <p className={styles.prodDesc}>{description}</p>
                      <span className={styles.learnMore}>{t.products.viewDetails} &rarr;</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
