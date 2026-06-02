'use client';

import { useTransition } from 'react';
import styles from './portfolio-admin.module.css';

interface DeletePortfolioBtnProps {
  itemId: number;
  deleteAction: (id: number) => Promise<void>;
}

export default function DeletePortfolioBtn({ itemId, deleteAction }: DeletePortfolioBtnProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายการผลงานนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้')) {
      startTransition(async () => {
        await deleteAction(itemId);
      });
    }
  };

  return (
    <form onSubmit={handleDelete} style={{ display: 'inline' }}>
      <button type="submit" disabled={isPending} className={styles.deleteBtn}>
        {isPending ? 'กำลังลบ...' : 'ลบ'}
      </button>
    </form>
  );
}
