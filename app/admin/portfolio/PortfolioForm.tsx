'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './portfolio-form.module.css';

interface PortfolioFormProps {
  initialItem?: any;
  saveAction: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export default function PortfolioForm({ initialItem, saveAction }: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(initialItem?.title || '');
  const [titleTh, setTitleTh] = useState(initialItem?.title_th || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [descriptionTh, setDescriptionTh] = useState(initialItem?.description_th || '');
  const [tags, setTags] = useState(initialItem?.tags || '');

  // Image Upload state
  let initialImages = [];
  try {
    if (initialItem?.images) {
      initialImages = typeof initialItem.images === 'string'
        ? JSON.parse(initialItem.images)
        : initialItem.images;
    }
  } catch (e) {}
  const [images, setImages] = useState<string[]>(Array.isArray(initialImages) ? initialImages : []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert(`อัปโหลดล้มเหลว (Server Status: ${res.status}): ${errorText}`);
        return;
      }

      const data = await res.json();
      if (data.success && data.filePath) {
        setImages([...images, data.filePath]);
      } else {
        alert(data.error || 'อัพโหลดรูปล้มเหลว');
      }
    } catch (err: any) {
      console.error(err);
      alert(`มีข้อผิดพลาดขณะอัพโหลด: ${err.message || String(err)}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: initialItem?.id,
      title,
      title_th: titleTh,
      description,
      description_th: descriptionTh,
      images: JSON.stringify(images),
      tags,
    };

    const res = await saveAction(payload);
    if (res.success) {
      router.push('/admin/portfolio');
      router.refresh();
    } else {
      setError(res.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} glass`}>
      <h2 className={styles.formTitle}>{initialItem ? 'แก้ไขข้อมูลผลงาน' : 'เพิ่มผลงานใหม่'}</h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>⚠️ {error}</div>}

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label}>ชื่อผลงาน / โครงการ (อังกฤษ)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
            placeholder="e.g. HEPA Filter Installation at Medical Clinic"
          />
        </div>
        <div className={styles.group}>
          <label className={styles.label}>ชื่อผลงาน / โครงการ (ไทย)</label>
          <input
            value={titleTh}
            onChange={(e) => setTitleTh(e.target.value)}
            required
            className={styles.input}
            placeholder="เช่น งานติดตั้งระบบกรอง HEPA ที่คลินิกแพทย์"
          />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>แท็กอ้างอิง / หมวดหมู่ผลงาน (คั่นด้วยเครื่องหมายลูกน้ำ ,)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={styles.input}
          placeholder="เช่น HEPA, Cleanroom, โรงพยาบาล"
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>รายละเอียดผลงาน (ภาษาไทย)</label>
        <textarea
          value={descriptionTh}
          onChange={(e) => setDescriptionTh(e.target.value)}
          className={styles.textarea}
          rows={4}
          placeholder="อธิบายข้อมูล รายละเอียดการติดตั้ง หรือจุดเด่นของงานชิ้นนี้..."
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>รายละเอียดผลงาน (ภาษาอังกฤษ)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          rows={4}
          placeholder="English details or project specifications..."
        />
      </div>

      {/* Image Uploader */}
      <div className={styles.group}>
        <h3 className={styles.sectionTitle}>รูปภาพผลงาน</h3>
        <div className={styles.imageGrid}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.imageThumb}>
              <img src={img} alt="preview" />
              <button type="button" onClick={() => handleRemoveImage(idx)} className={styles.deleteImgBtn}>
                &times;
              </button>
            </div>
          ))}
          <label className={styles.uploadCard}>
            <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
            {uploading ? 'กำลังอัปโหลด...' : '➕ อัปโหลดรูป'}
          </label>
        </div>
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูลผลงาน'}
      </button>
    </form>
  );
}
