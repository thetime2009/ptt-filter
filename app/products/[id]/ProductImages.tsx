'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './product-images.module.css';

interface ProductImagesProps {
  images: string[];
  name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const validImages = (images || []).filter(
    (img) => img !== null && img !== undefined && typeof img === 'string' && img.trim() !== ''
  );

  const [activeIndex, setActiveIndex] = useState(0);

  if (validImages.length === 0) {
    return (
      <div className={styles.noImage}>
        <span>⚙️</span>
      </div>
    );
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.container}>
      {/* Main Image Viewer */}
      <div className={styles.mainWrapper}>
        <div className={styles.mainImageContainer}>
          <Image
            src={validImages[activeIndex]}
            alt={`${name} - Image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain' }}
            className={styles.mainImage}
            priority
          />
        </div>

        {/* Navigation Arrows for Slider */}
        {validImages.length > 1 && (
          <>
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev} aria-label="Previous image">
              &#10094;
            </button>
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext} aria-label="Next image">
              &#10095;
            </button>
          </>
        )}

        {/* Dynamic Pagination Dots */}
        {validImages.length > 1 && (
          <div className={styles.dots}>
            {validImages.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Navigation */}
      {validImages.length > 1 && (
        <div className={styles.thumbnails}>
          {validImages.map((img, idx) => (
            <button
              key={idx}
              className={`${styles.thumbnailWrapper} ${idx === activeIndex ? styles.activeThumb : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                width={80}
                height={80}
                style={{ objectFit: 'cover' }}
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
