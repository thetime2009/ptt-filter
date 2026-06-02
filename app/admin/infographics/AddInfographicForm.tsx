'use client';

import { useState } from 'react';
import styles from './infographics-admin.module.css';

interface AddInfographicFormProps {
  saveAction: (payload: { title: string; image_url: string; display_order: number }) => Promise<{ success: boolean; error?: string }>;
}

export default function AddInfographicForm({ saveAction }: AddInfographicFormProps) {
  const [title, setTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setImageUrl(data.filePath);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('กรุณาอัปโหลดรูปภาพก่อนบันทึก');
      return;
    }

    setLoading(true);
    const orderNum = parseInt(displayOrder, 10) || 0;

    const res = await saveAction({
      title,
      image_url: imageUrl,
      display_order: orderNum,
    });

    if (res.success) {
      // Reset form
      setTitle('');
      setDisplayOrder('0');
      setImageUrl('');
      alert('บันทึกรูปอินโฟกราฟฟิคใหม่เรียบร้อยแล้ว');
    } else {
      alert(res.error || 'เกิดข้อผิดพลาดในการบันทึก');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} glass`}>
      <h3 className={styles.formTitle}>➕ อัปโหลดอินโฟกราฟฟิคใหม่</h3>
      
      <div className={styles.group}>
        <label className={styles.label}>ชื่อหรือคำอธิบายภาพ (Title / Alt Text)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.input}
          placeholder="เช่น โครงสร้างไส้กรองและส่วนประกอบ"
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>ลำดับการแสดงผล (Display Order)</label>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          required
          className={styles.input}
          placeholder="เช่น 0, 1, 2"
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>รูปภาพอินโฟกราฟฟิค</label>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
          {imageUrl ? (
            <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(239, 68, 68, 0.85)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
                title="ลบรูป"
              >
                &times;
              </button>
            </div>
          ) : (
            <label className={styles.uploadCard}>
              <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
              {uploading ? 'กำลังอัปโหลด...' : '➕ อัปโหลดรูปภาพ'}
            </label>
          )}
        </div>
      </div>

      <button type="submit" disabled={loading || uploading} className={styles.submitBtn}>
        {loading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกรูปภาพ'}
      </button>
    </form>
  );
}
