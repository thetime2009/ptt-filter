'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';

interface Infographic {
  id: number;
  image_url: string;
  title: string | null;
}

interface HeroSliderProps {
  initialInfographics: Infographic[];
}

export default function HeroSlider({ initialInfographics }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = initialInfographics && initialInfographics.length > 0 
    ? initialInfographics 
    : [{ id: 0, image_url: '/hero-infographic.png', title: 'Default Infographic' }];

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.infographicWrapper} style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: '16px' }}>
      {images.map((img, idx) => (
        <div
          key={img.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: activeIndex === idx ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: activeIndex === idx ? 2 : 1,
            pointerEvents: activeIndex === idx ? 'auto' : 'none',
          }}
        >
          <img
            src={img.image_url}
            alt={img.title || "PTT Filter Infographic Layout"}
            className={styles.infographicImage}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              objectFit: 'cover',
              objectPosition: 'right center',
              boxShadow: 'var(--shadow-md)',
              border: '2px solid var(--border)',
            }}
          />
        </div>
      ))}

      {/* Slider indicators */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 15,
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '6px 12px',
            borderRadius: '20px',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activeIndex === idx ? 'var(--primary)' : 'var(--muted)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
