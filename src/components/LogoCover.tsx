'use client';

import { useEffect } from 'react';
import Image from 'next/image';

// Pantalla que tapa toda la web (solo logo sobre fondo bordo).
// Para sacarla, quitar <LogoCover /> de app/layout.tsx.
export default function LogoCover() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ backgroundColor: 'hsl(var(--primary))', height: '100dvh' }}
    >
      <Image
        src="/assets/logo_interno.png"
        alt="Interno Bordo"
        width={320}
        height={320}
        priority
        className="w-48 h-auto md:w-72"
      />
    </div>
  );
}
