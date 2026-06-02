'use client';

import React, { useState } from 'react';
import styles from './contact.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <span className={styles.badge}>{t.contact.badge}</span>
        <h1 className={styles.title}>{t.contact.title}</h1>
        <p className={styles.subtitle}>{t.contact.desc}</p>
      </div>

      <div className={styles.layout}>
        {/* Contact Info */}
        <div className={`${styles.infoArea} glass`}>
          <h2 className={styles.infoTitle}>{t.contact.infoTitle}</h2>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📍</span>
              <div>
                <strong>{t.contact.addressTitle} (สำนักงานใหญ่)</strong>
                <p style={{ color: 'var(--foreground)', marginTop: '4px', fontSize: '14px', lineHeight: '1.5' }}>
                  <strong>บริษัท ปิ่นทองเทรดดิ้ง แอนด์ ซัพพลาย จำกัด</strong><br />
                  9/88 หมู่ที่ 2 ถนนบางพลี-ตำหรุ ตำบลแพรกษาใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ 10280
                </p>
                <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
                  📌 โครงการ Lalita Factory (ห้อง B6)<br />
                  🧾 เลขประจำตัวผู้เสียภาษีอากร: 0115564010531
                </div>
              </div>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.icon}>📞</span>
              <div>
                <strong>{t.contact.phone}</strong>
                <p style={{ color: 'var(--foreground)', marginTop: '4px', fontSize: '14px' }}>
                  🏢 สำนักงาน: <a href="tel:0622451241" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>062-245-1241</a><br />
                  📱 คุณสุรศักดิ์ (ฝ่ายขาย/การผลิต): <a href="tel:0846690495" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>084-669-0495</a>
                </p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.icon}>✉️</span>
              <div>
                <strong>{t.contact.email}</strong>
                <p style={{ color: 'var(--foreground)', marginTop: '4px', fontSize: '14px' }}>
                  <a href="mailto:THETIME.POTA@GMAIL.COM" style={{ color: 'var(--primary)', textDecoration: 'none' }}>THETIME.POTA@GMAIL.COM</a>
                </p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.icon}>💬</span>
              <div>
                <strong>Line Official (ติดต่อหลัก)</strong>
                <p style={{ color: 'var(--foreground)', marginTop: '4px', fontSize: '14px' }}>
                  ID: <strong style={{ color: '#06C755' }}>THETIME2009</strong>
                </p>
              </div>
            </div>
          </div>

          <a href="https://line.me/ti/p/~THETIME2009" target="_blank" rel="noopener noreferrer" className={styles.lineButtonCard}>
            <span>💬 แอดไลน์เพื่อสอบถามด่วน</span>
          </a>
        </div>

        {/* Contact Form */}
        <form className={`${styles.formArea} glass`} onSubmit={handleSubmit}>
          <h2 className={styles.infoTitle}>{t.contact.formTitle}</h2>
          
          {submitted ? (
            <div style={{ color: 'var(--success)', padding: '20px 0', fontWeight: 600 }}>
              {t.contact.successMsg}
            </div>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t.contact.name}</label>
                <input type="text" className={styles.input} required placeholder="ชื่อของคุณ / ชื่อบริษัท" />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.label}>{t.contact.email}</label>
                  <input type="email" className={styles.input} required placeholder="example@email.com" />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.label}>{t.contact.phone}</label>
                  <input type="tel" className={styles.input} required placeholder="08X-XXX-XXXX" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t.contact.subject}</label>
                <input type="text" className={styles.input} required placeholder="หัวข้อติดต่อ / ขอใบเสนอราคาไส้กรองสั่งผลิต" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t.contact.message}</label>
                <textarea className={styles.textarea} rows={4} placeholder="ระบุรายละเอียด เช่น ขนาดไส้กรองที่ต้องการ (OD, ID, H), ประเภทสื่อกรอง, จำนวน หรือข้อมูลเครื่องจักร..."></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>
                {t.contact.send}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Media and Map section */}
      <div className={styles.mediaSection}>
        {/* Route Map */}
        <div className={styles.mediaBlock}>
          <h3 className={styles.mediaTitle}>🗺️ แผนที่เส้นทางการเดินทาง</h3>
          <div className={styles.mapContainer}>
            <img src="/images/map.png" alt="แผนที่ตั้ง บริษัท ปิ่นทองเทรดดิ้ง แอนด์ ซัพพลาย จำกัด" className={styles.responsiveImg} />
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted-foreground)', textAlign: 'center' }}>
            ตั้งอยู่บนถนนบางพลี-ตำหรุ ใกล้กับจุดตัดถนนเทพารักษ์
          </div>
        </div>

        {/* Factory Building & Guide */}
        <div className={styles.mediaBlock}>
          <h3 className={styles.mediaTitle}>🏢 อาคารโรงงานและจุดติดต่อ</h3>
          <div className={styles.imageContainer}>
            <img src="/images/factory-building.jpg" alt="โรงงาน Lalita Factory" className={styles.responsiveImg} />
          </div>
          <div className={styles.buildingGuide}>
            🧭 **เมื่อเดินทางมาถึงโครงการ Lalita Factory:**<br />
            ให้เลี้ยวเข้ามาด้านในโครงการ โกดังของปิ่นทองเทรดดิ้งจะอยู่ **ห้องรองสุดท้าย ฝั่งซ้ายมือ (ห้องเลขที่ 9/88)**
          </div>
        </div>
      </div>

      {/* Business Cards / Billing Info Cards */}
      <div className={styles.mediaSection} style={{ marginTop: '32px' }}>
        <div className={styles.mediaBlock} style={{ gridColumn: 'span 2' }}>
          <h3 className={styles.mediaTitle}>💳 นามบัตรและข้อมูลสำหรับการออกใบกำกับภาษี</h3>
          <div className={styles.imageGrid}>
            <div className={styles.imageContainer}>
              <img src="/images/business-card.png" alt="นามบัตร บริษัท ปิ่นทองเทรดดิ้ง แอนด์ ซัพพลาย จำกัด" className={styles.responsiveImg} />
            </div>
            <div className={styles.imageContainer}>
              <img src="/images/tax-card.png" alt="ข้อมูลออกใบกำกับภาษี บริษัท ปิ่นทองเทรดดิ้ง แอนด์ ซัพพลาย จำกัด" className={styles.responsiveImg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
