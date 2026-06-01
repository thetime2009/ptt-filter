import LoginForm from './LoginForm';
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export default function LoginPage() {
  const loginAction = async (formData: FormData) => {
    'use server';
    try {
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: '/admin'
      });
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      }
      throw error;
    }
  };

  return <LoginForm loginAction={loginAction} />;
}
