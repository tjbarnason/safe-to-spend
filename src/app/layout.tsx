import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Safe to Spend',
  description: 'Know whether your financial decisions are safe before you make them.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen antialiased flex flex-col`}>
        <AppHeader />
        <div className="flex-1 pb-20">
          {children}
        </div>
        <AppFooter />
      </body>
    </html>
  );
}
