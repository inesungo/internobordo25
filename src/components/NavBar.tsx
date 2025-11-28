'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Countdown from '@/components/Countdown';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    // Verificar posición inicial
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 50);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Fixture', path: '/fixture' },
    { name: 'Posiciones', path: '/tabla' },
    { name: 'Playoffs', path: '/playoffs' },
    { name: 'Estadísticas', path: '/estadisticas' },
    { name: 'Equipos', path: '/equipos' },
    { name: 'Galería', path: '/galeria' },
    { name: '¿Quién Toma Más?', path: '/quien-toma-mas', hidden: true },
  ].filter(item => !item.hidden);

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={!isScrolled ? { backgroundColor: 'transparent', borderColor: 'transparent' } : { backgroundColor: 'hsl(343, 64%, 25%, 0.95)', backdropFilter: 'blur(0.5rem)', borderBottom: '0.0625rem solid hsl(45, 90%, 57%, 0.2)' }}
      >
        <div className="container mx-auto px-4">
          <div className={`flex items-center h-20 justify-between gap-4`}>
            {isHome ? (
              isScrolled && (
                <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                  <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
                    <Image src="/assets/logo_interno.png" alt="Club Seminario" className="h-10 w-10 md:h-14 md:w-14 object-contain" width={56} height={56} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Countdown targetDate="2025-11-17" />
                  </div>
                </div>
              )
            ) : (
              isScrolled && (
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <Image src="/assets/logo_interno.png" alt="Club Seminario" className="h-14 w-14 object-contain" width={56} height={56} />
                  <div className="hidden md:block">
                    <h1 className="text-secondary font-bold text-xl leading-tight">INTERNO BORDO</h1>
                    <p className="text-secondary/80 text-xs">Club Seminario</p>
                  </div>
                </Link>
              )
            )}
            
            {/* Espacio invisible para mantener botones a la derecha cuando no hay texto */}
            {!isScrolled && <div className="flex-1" />}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-secondary text-primary'
                        : 'text-secondary hover:bg-secondary/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-secondary hover:bg-secondary/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

        </div>
      </nav>

      {/* Mobile Navigation - Fuera del nav para que el fondo se vea en todas las páginas */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100] md:hidden"
            onClick={() => setIsOpen(false)}
            style={{ 
              backgroundColor: 'hsl(343, 64%, 25%, 0.95)',
              backdropFilter: 'blur(0.5rem)',
              WebkitBackdropFilter: 'blur(0.5rem)'
            }}
          />
          <div className="fixed top-0 left-0 right-0 z-[101] md:hidden">
            <div className="container mx-auto px-4 pt-6 pb-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-secondary font-bold text-lg">Menú</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-secondary hover:bg-secondary/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-secondary text-primary shadow-md'
                          : 'text-secondary hover:bg-secondary/20 hover:shadow-sm'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;

