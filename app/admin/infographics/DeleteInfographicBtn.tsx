'use client';

import { useState } from 'react';

interface DeleteInfographicBtnProps {
  id: number;
  deleteAction: (id: number) => Promise<void>;
}

export default function DeleteInfographicBtn({ id, deleteAction }: DeleteInfographicBtnProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรูปอินโฟกราฟฟิคนี้ออกจากหน้าแรก?')) return;
    setLoading(true);
    try {
      await deleteAction(id);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบรูปภาพ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {loading ? 'กำลังลบ...' : 'ลบรูปภาพ'}
    </button>
  );
}
