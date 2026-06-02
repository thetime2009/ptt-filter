'use client';

import { useState } from 'react';
import styles from './inquiries-admin.module.css';

interface StatusSelectorProps {
  inquiryId: number;
  currentStatus: string;
  updateStatusAction: (id: number, status: string) => Promise<boolean>;
}

export default function StatusSelector({
  inquiryId,
  currentStatus,
  updateStatusAction,
}: StatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus || 'pending');
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      const success = await updateStatusAction(inquiryId, newStatus);
      if (success) {
        setStatus(newStatus);
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (val: string) => {
    switch (val) {
      case 'completed':
        return '#10b981'; // Green
      case 'processing':
        return '#3b82f6'; // Blue
      default:
        return '#f59e0b'; // Yellow/Orange (Pending)
    }
  };

  return (
    <div className={styles.statusWrapper} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(status),
          display: 'inline-block',
        }}
      />
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={styles.statusSelect}
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid var(--border)',
          fontSize: '13px',
          fontWeight: 600,
          background: 'var(--card)',
          color: 'var(--foreground)',
          cursor: 'pointer',
        }}
      >
        <option value="pending">รอการตรวจสอบ (Pending)</option>
        <option value="processing">กำลังดำเนินการ (Processing)</option>
        <option value="completed">เสร็จสิ้น (Completed)</option>
      </select>
    </div>
  );
}
