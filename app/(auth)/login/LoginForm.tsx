'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export default function LoginForm({ loginAction }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(result.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={`${styles.card} glass`} onSubmit={handleSubmit}>
        <h1 className={styles.title}>
          <span style={{ color: 'var(--primary)' }}>PTT</span> FILTER ADMIN
        </h1>
        <p className={styles.subtitle}>กรุณาเข้าสู่ระบบเพื่อจัดการสินค้าและหมวดหมู่หลังบ้าน</p>

        {error && (
          <div className={styles.errorAlert}>
            ⚠️ {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>อีเมลผู้ดูแลระบบ (Email)</label>
          <input
            name="email"
            type="email"
            required
            className={styles.input}
            placeholder="admin@pttfilter.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>รหัสผ่าน (Password)</label>
          <input
            name="password"
            type="password"
            required
            className={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', textAlign: 'center', marginTop: '10px' }}>
          * บัญชีเริ่มต้น: admin@pttfilter.com | รหัสผ่าน: admin1234
        </p>
      </form>
    </div>
  );
}
