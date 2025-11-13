import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// Test commit with new Git user
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Footer from '@/components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
// import ComingSoonModal from '@/components/ComingSoonModal';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" style={{ backgroundColor: 'hsl(var(--primary))' }}>
      <body className={inter.className} style={{ backgroundColor: 'hsl(var(--primary))' }}>
        <TooltipProvider>
          {/* <ComingSoonModal /> */}
          {children}
          <Footer />
          <Toaster />
          <Sonner />
          <SpeedInsights />
          <Analytics />
        </TooltipProvider>
      </body>
    </html>
  );
}

