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
                <strong>{t.contact.addressTitle}</strong>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '4px', fontSize: '14px' }}>
                  123/45 นิคมอุตสาหกรรมพัฒนา ถนนสุขุมวิท ตำบลมาบตาพุด อำเภอเมืองระยอง จังหวัดระยอง 21150
                </p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.icon}>📞</span>
              <div>
                <strong>{t.contact.phone}</strong>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '4px', fontSize: '14px' }}>
                  02-XXX-XXXX / 081-XXX-XXXX
                </p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.icon}>✉️</span>
              <div>
                <strong>{t.contact.email}</strong>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '4px', fontSize: '14px' }}>
                  sales@pttfilter.com / info@pttfilter.com
                </p>
              </div>
            </div>
          </div>
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
                <input type="text" className={styles.input} required placeholder="Name / Company Name" />
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
                <input type="text" className={styles.input} required placeholder="Subject / RFQ" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t.contact.message}</label>
                <textarea className={styles.textarea} rows={4} placeholder="Dimensions, air flow, application, quantity..."></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>
                {t.contact.send}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
