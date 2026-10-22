import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// Test commit with new Git user
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import LogoCover from '@/components/LogoCover';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interno Bordo - Club Seminario',
  description: 'Campeonato Interno · Club Seminario',
  icons: {
    icon: '/assets/logo.png',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7f1d1d' },
    { media: '(prefers-color-scheme: dark)', color: '#7f1d1d' },
  ],
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout(_props: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ backgroundColor: 'hsl(var(--primary))' }}>
      <body className={inter.className} style={{ backgroundColor: 'hsl(var(--primary))' }}>
        {/* Web tapada: solo se muestra el logo. Para reabrir, restaurar el bloque anterior (ver git). */}
        <LogoCover />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

