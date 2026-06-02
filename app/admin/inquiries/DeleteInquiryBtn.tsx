'use client';

import { useTransition } from 'react';
import styles from './inquiries-admin.module.css';

interface DeleteInquiryBtnProps {
  inquiryId: number;
  deleteAction: (id: number) => Promise<void>;
}

export default function DeleteInquiryBtn({ inquiryId, deleteAction }: DeleteInquiryBtnProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายการขอใบเสนอราคานี้?')) {
      startTransition(async () => {
        await deleteAction(inquiryId);
      });
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" disabled={isPending} className={styles.deleteBtn}>
        {isPending ? 'กำลังลบ...' : 'ลบคำขอ'}
      </button>
    </form>
  );
}
