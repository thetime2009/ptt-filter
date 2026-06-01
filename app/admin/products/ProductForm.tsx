'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './product-form.module.css';

interface ProductFormProps {
  categories: any[];
  initialProduct?: any;
  saveAction: (data: any) => Promise<{ success: boolean; error?: string }>;
}

export default function ProductForm({ categories, initialProduct, saveAction }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(initialProduct?.name || '');
  const [nameTh, setNameTh] = useState(initialProduct?.name_th || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [descriptionTh, setDescriptionTh] = useState(initialProduct?.description_th || '');
  const [isActive, setIsActive] = useState(initialProduct?.is_active !== undefined ? initialProduct?.is_active === 1 : true);
  
  // Specs state
  let initialSpecs: { key: string; val: string }[] = [];
  try {
    const parsed = JSON.parse(initialProduct?.specs || '{}');
    initialSpecs = Object.entries(parsed).map(([k, v]) => ({ key: k, val: String(v) }));
  } catch(e) {}
  const [specs, setSpecs] = useState<{ key: string; val: string }[]>(initialSpecs.length > 0 ? initialSpecs : [{ key: '', val: '' }]);

  // Image Upload state
  let initialImages = [];
  try { initialImages = JSON.parse(initialProduct?.images || '[]'); } catch(e) {}
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', val: '' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    const updated = specs.filter((_, i) => i !== idx);
    setSpecs(updated.length > 0 ? updated : [{ key: '', val: '' }]);
  };

  const handleSpecChange = (idx: number, field: 'key' | 'val', value: string) => {
    const updated = [...specs];
    updated[idx][field] = value;
    setSpecs(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
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
    } catch(err: any) {
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

    // Format specs as JSON object
    const specObj = {} as Record<string, string>;
    specs.forEach(s => {
      if (s.key.trim() && s.val.trim()) {
        specObj[s.key.trim()] = s.val.trim();
      }
    });

    const slug = (nameTh || name).toLowerCase().replace(/[^a-z0-9ก-๙]/g, '-').replace(/-+/g, '-');

    const productPayload = {
      id: initialProduct?.id,
      name,
      name_th: nameTh,
      slug,
      category_id: parseInt(categoryId.toString()),
      description,
      description_th: descriptionTh,
      images: JSON.stringify(images),
      specs: JSON.stringify(specObj),
      is_active: isActive ? 1 : 0
    };

    const res = await saveAction(productPayload);
    if (res.success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      setError(res.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} glass`}>
      <h2 className={styles.formTitle}>{initialProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>⚠️ {error}</div>}

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label}>ชื่อสินค้า (อังกฤษ)</label>
          <input value={name} onChange={e => setName(e.target.value)} required className={styles.input} placeholder="e.g. HEPA Filter H13" />
        </div>
        <div className={styles.group}>
          <label className={styles.label}>ชื่อสินค้า (ไทย)</label>
          <input value={nameTh} onChange={e => setNameTh(e.target.value)} required className={styles.input} placeholder="เช่น ไส้กรองอากาศ HEPA H13" />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>หมวดหมู่สินค้า</label>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={styles.select}>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name_th}</option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>รายละเอียดสินค้า (ภาษาไทย)</label>
        <textarea value={descriptionTh} onChange={e => setDescriptionTh(e.target.value)} className={styles.textarea} rows={3} placeholder="ข้อมูลผลิตภัณฑ์ จุดเด่น การนำไปใช้..." />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>รายละเอียดสินค้า (ภาษาอังกฤษ)</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className={styles.textarea} rows={3} placeholder="English descriptions..." />
      </div>

      {/* Dynamic Spec Inputs */}
      <div className={styles.specSection}>
        <h3 className={styles.sectionTitle}>คุณลักษณะเทคนิค (Specifications)</h3>
        {specs.map((spec, idx) => (
          <div key={idx} className={styles.specRow}>
            <input
              value={spec.key}
              onChange={e => handleSpecChange(idx, 'key', e.target.value)}
              className={styles.input}
              placeholder="เช่น ขนาด (Dimension) / วัสดุ (Material)"
            />
            <input
              value={spec.val}
              onChange={e => handleSpecChange(idx, 'val', e.target.value)}
              className={styles.input}
              placeholder="เช่น 610x610x292 mm / Stainless 304"
            />
            <button type="button" onClick={() => handleRemoveSpec(idx)} className={styles.removeBtn}>ลบ</button>
          </div>
        ))}
        <button type="button" onClick={handleAddSpec} className={styles.addSpecBtn}>
          ➕ เพิ่มคุณลักษณะ
        </button>
      </div>

      {/* Image Uploader */}
      <div className={styles.group}>
        <h3 className={styles.sectionTitle}>รูปภาพสินค้า</h3>
        <div className={styles.imageGrid}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.imageThumb}>
              <img src={img} alt="preview" />
              <button type="button" onClick={() => handleRemoveImage(idx)} className={styles.deleteImgBtn}>&times;</button>
            </div>
          ))}
          <label className={styles.uploadCard}>
            <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
            {uploading ? 'กำลังอัพโหลด...' : '➕ อัพโหลดรูป'}
          </label>
        </div>
      </div>

      {/* Status control */}
      <div className={styles.group} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
        <label htmlFor="isActive" style={{ cursor: 'pointer' }}>แสดงผลสินค้านี้สู่หน้าเว็บ</label>
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูลสินค้า'}
      </button>
    </form>
  );
}
