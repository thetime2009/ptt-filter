import type { Metadata } from 'next';
import './globals.css';
import { auth, signOut } from '@/lib/auth';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

import { LanguageProvider } from '@/lib/i18n/LanguageContext';

export const metadata: Metadata = {
  title: 'PTT Filter | ระบบกรองอุตสาหกรรม และโครงสร้างไส้กรองคุณภาพสูง',
  description: 'ผู้ผลิตและออกแบบโครงสร้างไส้กรองอากาศ, ดักฝุ่น, ควัน, และกรองน้ำมันไฮดรอลิกสำหรับงานอุตสาหกรรมหนักทุกประเภท',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const signOutAction = async () => {
    'use server';
    await signOut();
  };

  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <LanguageProvider>
          <Navbar session={session} signOutAction={signOutAction} />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
