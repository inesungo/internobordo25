'use client';

import { Trophy, Calendar, Users, Instagram, Camera, Target, Loader2, GlassWater, Award, Medal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import NavBar from '@/components/NavBar';
import MatchCard from '@/components/MatchCard';
import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import type { TournamentData } from '@/lib/data';

export default function HomePage() {
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [stats, setStats] = useState({ equipos: 0, partidos: 0, jugadores: 0 });
  const [topGoleadores, setTopGoleadores] = useState<{
    masculino: { jugador: string; equipo: string; goles: number } | null;
    femenino: { jugador: string; equipo: string; goles: number } | null;
  }>({ masculino: null, femenino: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState({ equipos: 0, partidos: 0, jugadores: 0 });
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Llamar a la API route en lugar de getData directo
        const response = await fetch('/api/data', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data: TournamentData = await response.json();
        
        if (!mounted) return;
        
        console.log('📊 Datos cargados desde API:', {
          equipos: data.equipos.length,
          partidos: data.partidos.length,
          jugadores: data.jugadores?.length || 0,
        });
        
        setStats({
          equipos: data.equipos.length,
          partidos: data.partidos.length,
          jugadores: data.jugadores?.length || 0,
        });

        // Obtener próximos partidos (sin resultado)
        const partidosSinResultado = data.partidos
          .filter((p) => !data.resultados.find((r) => r.partido_id === p.id))
          .sort((a, b) => {
            const dateA = dayjs(`${a.fecha} ${a.hora}`);
            const dateB = dayjs(`${b.fecha} ${b.hora}`);
            return dateA.diff(dateB);
          })
          .slice(0, 4);

        const matches = partidosSinResultado.map((p) => {
          const local = data.equipos.find((e) => e.id === p.local_id);
          const visitante = data.equipos.find((e) => e.id === p.visitante_id);
          return {
            homeTeam: local?.nombre || 'TBD',
            awayTeam: visitante?.nombre || 'TBD',
            date: dayjs(p.fecha).format('DD MMM'),
            time: p.hora,
            category: (p.categoria || 'Masculino') as 'Masculino' | 'Femenino',
            status: 'Próximo' as const,
          };
        });

        if (mounted) {
          setUpcomingMatches(matches);

          // Calcular top goleadores por categoría
          const getTopGoleador = (categoria: 'Masculino' | 'Femenino') => {
            const equiposCategoria = data.equipos
              .filter((e) => e.categoria === categoria)
              .map((e) => e.id);
            
            const goleadoresFiltrados = data.goleadores.filter((g) =>
              equiposCategoria.includes(g.equipo_id)
            );

            // Agrupar por jugador y equipo_id, sumando los goles
            const goleadoresAgrupados = new Map<string, { jugador: string; equipo_id: string; goles: number }>();
            
            goleadoresFiltrados.forEach((goleador) => {
              const key = `${goleador.jugador}-${goleador.equipo_id}`;
              const existente = goleadoresAgrupados.get(key);
              
              if (existente) {
                existente.goles += goleador.goles;
              } else {
                goleadoresAgrupados.set(key, {
                  jugador: goleador.jugador,
                  equipo_id: goleador.equipo_id,
                  goles: goleador.goles,
                });
              }
            });

            const sorted = Array.from(goleadoresAgrupados.values())
              .sort((a, b) => b.goles - a.goles)
              .slice(0, 1);

            if (sorted.length > 0) {
              const top = sorted[0];
              const equipo = data.equipos.find((e) => e.id === top.equipo_id);
              return {
                jugador: top.jugador,
                equipo: equipo?.nombre || 'Sin equipo',
                goles: top.goles,
              };
            }
            return null;
          };

          setTopGoleadores({
            masculino: getTopGoleador('Masculino'),
            femenino: getTopGoleador('Femenino'),
          });
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Error desconocido');
          setLoading(false);
        }
      }
    }
    
    // Cargar datos inicialmente
    loadData();
    
    // Refrescar datos cada 2 minutos (120000 ms)
    const intervalId = setInterval(() => {
      if (mounted) {
        loadData();
      }
    }, 120000);
    
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Mostrar popup promocional al cargar la página
  useEffect(() => {
    // Verificar si el usuario ya cerró el popup anteriormente
    const popupClosed = localStorage.getItem('promo-popup-closed');
    if (!popupClosed) {
      // Pequeño delay para que la página cargue primero
      const timer = setTimeout(() => {
        setShowPromoPopup(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animación de conteo para las estadísticas
  useEffect(() => {
    if (loading) return;

    const duration = 1500; // Duración de la animación en ms
    const steps = 60; // Número de pasos
    const stepDuration = duration / steps;

    const animateValue = (
      start: number,
      end: number,
      callback: (value: number) => void
    ) => {
      const increment = (end - start) / steps;
      let current = start;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(start + increment * step, end);
        callback(Math.floor(current));

        if (step >= steps) {
          clearInterval(timer);
          callback(end);
        }
      }, stepDuration);
    };

    animateValue(0, stats.equipos, (value) => {
      setAnimatedStats((prev) => ({ ...prev, equipos: value }));
    });

    animateValue(0, stats.partidos, (value) => {
      setAnimatedStats((prev) => ({ ...prev, partidos: value }));
    });

    animateValue(0, stats.jugadores, (value) => {
      setAnimatedStats((prev) => ({ ...prev, jugadores: value }));
    });
  }, [stats, loading]);

  type Sponsor = {
    image: string;
    height?: string;
    padding?: string;
    imageClass?: string;
    imageStyle?: React.CSSProperties;
  };

  // Versión para forzar recarga de imágenes (cambiar este número cuando actualices los sponsors)
  const SPONSORS_VERSION = '2.0';

  const sponsors: Sponsor[] = [
    { image: '/assets/sponsor1.png', height: 'h-16 sm:h-20 md:h-20', imageStyle: { filter: 'brightness(0)' } }, // Más chico
    { image: '/assets/sponsor2.png', height: 'h-12 sm:h-14 md:h-14', padding: 'pt-4 sm:pt-5 md:pt-4 pb-1 sm:pb-2 md:pb-1', imageStyle: { filter: 'brightness(0)' } }, // Un poco más grande
    { image: '/assets/sponsor3.png', height: 'h-20 sm:h-28 md:h-24', imageStyle: { filter: 'brightness(0)' } },
    { image: '/assets/sponsor4.png', height: 'h-24 sm:h-32 md:h-28', imageStyle: { filter: 'brightness(0)' } },
    { image: '/assets/sponsor5.png', height: 'h-16 sm:h-20 md:h-20', imageStyle: { filter: 'brightness(0)' } }, // Un poquito más chico
    { image: '/assets/sponsor6.png', height: 'h-20 sm:h-28 md:h-24', imageStyle: { filter: 'brightness(0)' } },
    { image: '/assets/sponsor7.png', height: 'h-16 sm:h-20 md:h-20', imageStyle: { filter: 'brightness(0)' } }, // Más chico
    { image: '/assets/sponsor8.png', height: 'h-24 sm:h-32 md:h-28', imageStyle: { filter: 'brightness(0)' } }, // Más grande
    { image: '/assets/sponsor9.png', height: 'h-24 sm:h-32 md:h-28', imageStyle: { filter: 'brightness(0)' } }, // Más grande
    { image: '/assets/sponsor10png.png', height: 'h-12 sm:h-16 md:h-16', imageStyle: { filter: 'brightness(0)' } }, // Más chico
    { image: '/assets/sponsor11.png', height: 'h-24 sm:h-32 md:h-28', imageStyle: { filter: 'brightness(0)' } }, // Más grande
    { image: '/assets/sponsor12.png', height: 'h-24 sm:h-32 md:h-28', imageStyle: { filter: 'brightness(0)' } }, // Más grande
  ];

  const handleClosePromoPopup = () => {
    setShowPromoPopup(false);
    // Guardar en localStorage que el usuario cerró el popup
    localStorage.setItem('promo-popup-closed', 'true');
  };

  return (
    <div className="min-h-screen relative">
      {/* Popup Promocional */}
      <Dialog open={showPromoPopup} onOpenChange={handleClosePromoPopup}>
        <DialogContent className="max-w-2xl w-[95%] sm:w-[90%] max-h-[95vh] p-0 bg-transparent border-0 shadow-none overflow-hidden">
          <DialogTitle className="sr-only">Promoción</DialogTitle>
          <div className="relative w-full">
            <div className="relative w-full rounded-lg overflow-hidden">
              <img
                src="/assets/fiesta1.png"
                alt="Promoción"
                className="w-full h-auto block"
                style={{ maxHeight: '85vh', objectFit: 'contain' }}
                onError={(e) => {
                  // Si la imagen no existe, mostrar un placeholder
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen promocional%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center px-3 sm:px-4">
                <Button
                  onClick={() => {
                    window.open('https://www.instagram.com/internobordo?igsh=YXp0N2F0ZWszMTU0', '_blank');
                    handleClosePromoPopup();
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 py-2 sm:py-2.5 rounded-md font-medium shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  Comprar acá
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Carousel */}
      <section className="relative">
        <NavBar />
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {/* Slide 1: Interno Bordo */}
            <CarouselItem>
              <div 
                className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/foto2.jpeg)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-accent/60" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
                
                <div className="relative z-30 text-center px-4 animate-fade-in mb-8 md:mb-16">
                  <div className="mb-2 md:mb-4 flex justify-center">
                    <Image
                      src="/assets/logo_interno.png"
                      alt="Interno Bordo"
                      width={400}
                      height={200}
                      className="object-contain drop-shadow-lg w-56 md:w-96 h-auto"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                    <Link href="/fixture" className="w-full md:w-auto max-w-[17.5rem] md:max-w-none">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full md:min-w-[13.75rem] border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white font-bold text-xs md:text-lg px-3 md:px-8 py-1.5 md:py-3"
                      >
                        Ver Fixture
                      </Button>
                    </Link>
                    <Link href="/tabla" className="hidden md:block w-full md:w-auto max-w-[17.5rem] md:max-w-none">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full md:min-w-[13.75rem] border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white font-bold text-xs md:text-lg px-3 md:px-8 py-1.5 md:py-3"
                      >
                        Tabla de Posiciones
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Slide 2: Fotos */}
            <CarouselItem>
              <div 
                className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/foto1.jpeg)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-accent/60" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
                
                <div className="relative z-30 text-center px-12 sm:px-16 md:px-4 animate-fade-in mb-8 md:mb-16">
                  <div className="mb-2 md:mb-4 flex justify-center">
                    <Camera className="h-12 w-12 md:h-16 md:w-16 text-white drop-shadow-lg" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
                    ¡NO TE PIERDAS LAS FOTOS!
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 md:mb-6 max-w-2xl mx-auto drop-shadow-md">
                    Los mejores momentos del torneo capturados para vos
                  </p>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                    <Link href="/galeria" className="w-full md:w-auto max-w-[17.5rem] md:max-w-none">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full md:min-w-[13.75rem] border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white font-bold text-xs md:text-lg px-3 md:px-8 py-1.5 md:py-3"
                      >
                        Ver Galería
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Slide 3: Redes Sociales */}
            <CarouselItem>
              <div 
                className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/foto3.jpeg)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-accent/60" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
                
                <div className="relative z-10 text-center px-4 animate-fade-in">
                  <Instagram className="h-12 w-12 md:h-24 md:w-24 text-white mx-auto mb-3 md:mb-6 drop-shadow-lg" />
                  <h2 className="text-2xl md:text-6xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
                    SEGUÍ EL TORNEO
                  </h2>
                  <p className="text-sm md:text-2xl text-white/80 mb-4 md:mb-8 max-w-2xl mx-auto">
                    Unite a nuestra comunidad en redes sociales
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white font-bold text-sm md:text-lg px-4 md:px-8 py-2 md:py-3"
                    onClick={() => window.open('https://www.instagram.com/internobordo?igsh=YXp0N2F0ZWszMTU0', '_blank')}
                  >
                    @internobordo
                  </Button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white" />
          <CarouselNext className="right-4 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white" />
        </Carousel>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 -mt-12 md:-mt-16 relative z-10 mb-6 md:mb-10 pb-8 md:pb-12">
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {[
                { icon: Trophy, label: 'EQUIPOS', value: animatedStats.equipos || 0, suffix: '', href: '/equipos' },
                { icon: Calendar, label: 'PARTIDOS', value: animatedStats.partidos || 0, suffix: '', href: '/fixture' },
                { icon: Users, label: 'JUGADORES', value: animatedStats.jugadores || 0, suffix: '', href: '/equipos' },
              ].map((stat, index) => (
                <Link key={index} href={stat.href} className="block text-center relative">
                  {index < 2 && (
                    <div className="absolute -right-1 md:-right-2 top-0 bottom-0 w-[1px] flex items-center justify-center">
                      <div className="h-3/4 w-[0.09375rem] bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center">
                    <stat.icon className="hidden md:block h-6 w-6 md:h-8 md:w-8 text-secondary mb-2 md:mb-3" />
                    <p className={`font-bold text-primary mb-1 leading-tight min-h-[2rem] md:min-h-[3rem] flex items-center justify-center text-center w-full ${
                      stat.label === 'PARTIDOS' && stat.value === 0 
                        ? 'text-[0.625rem] md:text-sm' 
                        : 'text-2xl md:text-4xl'
                    }`}>
                      {stat.label === 'PARTIDOS' && stat.value === 0 
                        ? 'proximamente' 
                        : typeof stat.value === 'number' 
                          ? stat.value.toLocaleString() 
                          : stat.value}
                      {stat.suffix || ''}
                    </p>
                    <p className="text-xs md:text-sm text-primary font-semibold uppercase">{stat.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Próximos Partidos */}
      <section className="container mx-auto px-4 mb-16">
        {/* Título solo en desktop */}
        <h2 className="hidden md:flex text-4xl font-bold text-secondary mb-8 items-center gap-3">
          <Calendar className="h-10 w-10 text-secondary" />
          Próximos partidos
        </h2>

        {/* Mobile: Imagen arriba y cards abajo */}
        <div className="md:hidden space-y-6 mb-8">
          {/* Imagen con overlay */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10"></div>
            <Image
              src="/assets/proximos_partidos.jpeg"
              alt="Próximos Partidos"
              width={600}
              height={300}
              className="w-full h-[12.5rem] sm:h-[15rem] md:h-[18.75rem] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4 z-20">
              <p className="text-white font-bold text-lg">Próximos Partidos</p>
              <p className="text-white/80 text-xs">No te pierdas los próximos encuentros</p>
            </div>
          </div>

          {/* Cards de partidos - Solo 2 en mobile */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <Card className="bg-white border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                    <p className="text-muted-foreground text-center text-sm">Cargando próximos partidos...</p>
                  </div>
                </CardContent>
              </Card>
            ) : upcomingMatches.length > 0 ? (
              upcomingMatches.slice(0, 2).map((match, index) => (
                <MatchCard key={index} {...match} />
              ))
            ) : (
              <Card className="bg-white border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                    <p className="text-muted-foreground text-center text-sm">Esperando que arranque el campeonato</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Desktop: Imagen a un lado y cards al otro */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 mb-8">
          {/* Imagen con overlay */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl group h-[31.25rem] md:h-[35rem] lg:h-[37.5rem]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10"></div>
            <Image
              src="/assets/proximos_partidos.jpeg"
              alt="Próximos Partidos"
              width={600}
              height={500}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-6 z-20">
              <p className="text-white font-bold text-xl mb-2">Próximos Partidos</p>
              <p className="text-white/80 text-sm mb-4">No te pierdas los próximos encuentros</p>
              <Link href="/fixture">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white"
                >
                  Ver fixture completo
                </Button>
              </Link>
            </div>
          </div>

          {/* Cards de partidos - Solo 3 en desktop */}
          <div className="flex flex-col gap-3">
            {loading ? (
              <Card className="bg-white border-2 border-primary/20 h-full">
                <CardContent className="p-8 h-full flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center py-8 gap-3 w-full">
                    <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                    <p className="text-muted-foreground text-center text-sm">Cargando próximos partidos...</p>
                  </div>
                </CardContent>
              </Card>
            ) : upcomingMatches.length > 0 ? (
              upcomingMatches.slice(0, 3).map((match, index) => (
                <MatchCard key={index} {...match} />
              ))
            ) : (
              <Card className="bg-white border-2 border-primary/20 h-full">
                <CardContent className="p-8 h-full flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center py-8 gap-3 w-full">
                    <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                    <p className="text-muted-foreground text-center text-sm">Esperando que arranque el campeonato</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Botón solo en mobile */}
        <div className="md:hidden text-center mt-8">
          <Link href="/fixture">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Ver fixture completo
            </Button>
          </Link>
        </div>
      </section>

      {/* Línea divisoria */}
      <div className="container mx-auto px-4 mb-8 md:mb-12">
        <div className="h-[0.125rem] bg-gradient-to-r from-transparent via-secondary/80 via-secondary/80 to-transparent"></div>
      </div>

      {/* Goleadores */}
      <section className="container mx-auto px-4 mb-16 md:mb-24">
        {/* Título solo en desktop */}
        <h2 className="hidden md:flex text-4xl font-bold text-secondary mb-8 items-center gap-3">
          <Target className="h-10 w-10 text-secondary" />
          Goleadores hasta el momento
        </h2>
        
        {/* Mobile: Imagen arriba y cards abajo */}
        <div className="md:hidden space-y-6 mb-8">
          {/* Imagen con overlay */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10"></div>
            <Image
              src="/assets/goleadores.jpeg"
              alt="Goleadores"
              width={600}
              height={300}
              className="w-full h-[12.5rem] sm:h-[15rem] md:h-[18.75rem] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 z-20">
              <p className="text-white font-bold text-lg mb-2">Top Goleadores</p>
              <p className="text-white/80 text-xs mb-3">Los mejores del torneo</p>
              <Link href="/estadisticas">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white text-sm"
                >
                  Ver más
                </Button>
              </Link>
            </div>
          </div>

          {/* Cards de goleadores */}
          <div className="flex flex-col gap-4">
            {/* Goleador Masculino */}
            <div className="relative group">
              <div className="absolute -top-2 right-0 text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full z-10 shadow-lg">Masculino</div>
              <Card className="bg-white border-2 border-primary/20 hover:border-primary/40 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-0"></div>
                <CardContent className="p-5 relative z-10">
                  {topGoleadores.masculino ? (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-16 w-16 bg-gradient-to-br from-primary to-primary/80 ring-3 ring-primary/20">
                          <AvatarFallback className="text-secondary font-bold text-lg">
                            {topGoleadores.masculino.jugador
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-[0.625rem] font-bold">
                          🥇
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base text-foreground">{topGoleadores.masculino.jugador}</p>
                        <p className="text-xs text-muted-foreground">{topGoleadores.masculino.equipo}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-primary">{topGoleadores.masculino.goles}</div>
                        <p className="text-[0.625rem] text-muted-foreground font-medium">goles</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 relative z-20">
                      <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                      <p className="text-muted-foreground text-center text-sm">Esperando que arranque el campeonato</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Goleadora Femenina */}
            <div className="relative group">
              <div className="absolute -top-2 right-0 text-xs font-semibold text-white bg-secondary px-3 py-1 rounded-full z-10 shadow-lg">Femenino</div>
              <Card className="bg-white border-2 border-secondary/20 hover:border-secondary/40 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -z-0"></div>
                <CardContent className="p-5 relative z-10">
                  {topGoleadores.femenino ? (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-16 w-16 bg-gradient-to-br from-secondary to-secondary/80 ring-3 ring-secondary/20">
                          <AvatarFallback className="text-primary font-bold text-lg">
                            {topGoleadores.femenino.jugador
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-secondary text-primary rounded-full w-5 h-5 flex items-center justify-center text-[0.625rem] font-bold">
                          🥇
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base text-foreground">{topGoleadores.femenino.jugador}</p>
                        <p className="text-xs text-muted-foreground">{topGoleadores.femenino.equipo}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-secondary">{topGoleadores.femenino.goles}</div>
                        <p className="text-[0.625rem] text-muted-foreground font-medium">goles</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 relative z-20">
                      <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                      <p className="text-muted-foreground text-center text-sm">Esperando que arranque el campeonato</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Desktop: Card Masculino | Imagen | Card Femenino */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
          {/* Goleador Masculino */}
          <div className="relative group">
            <div className="absolute -top-3 right-0 text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full z-10 shadow-lg">Masculino</div>
            <Card className="bg-white border-2 border-primary/20 hover:border-primary/40 hover:shadow-2xl transition-all duration-300 overflow-hidden relative h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
              <CardContent className="p-6 relative z-10 h-full flex flex-col items-center justify-center">
                {topGoleadores.masculino ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/20">
                        <AvatarFallback className="text-secondary font-bold text-2xl">
                          {topGoleadores.masculino.jugador
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                        🥇
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-foreground">{topGoleadores.masculino.jugador}</p>
                      <p className="text-sm text-muted-foreground">{topGoleadores.masculino.equipo}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold text-primary">{topGoleadores.masculino.goles}</div>
                      <p className="text-xs text-muted-foreground font-medium">goles</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-3 relative z-20">
                    <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                    <p className="text-muted-foreground text-center text-sm">Esperando que arranque el campeonato</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Imagen con overlay */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10"></div>
            <Image
              src="/assets/goleadores.jpeg"
              alt="Goleadores"
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-6 z-20">
              <p className="text-white font-bold text-xl mb-2">Top Goleadores</p>
              <p className="text-white/80 text-sm mb-4">Los mejores del torneo</p>
              <Link href="/estadisticas">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white"
                >
                  Ver tabla goleadores
                </Button>
              </Link>
            </div>
          </div>

          {/* Goleadora Femenina */}
          <div className="relative group">
            <div className="absolute -top-3 right-0 text-xs font-semibold text-white bg-secondary px-3 py-1 rounded-full z-10 shadow-lg">Femenino</div>
            <Card className="bg-white border-2 border-secondary/20 hover:border-secondary/40 hover:shadow-2xl transition-all duration-300 overflow-hidden relative h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -z-0"></div>
              <CardContent className="p-6 relative z-10 h-full flex flex-col items-center justify-center">
                {topGoleadores.femenino ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 bg-gradient-to-br from-secondary to-secondary/80 ring-4 ring-secondary/20">
                        <AvatarFallback className="text-primary font-bold text-2xl">
                          {topGoleadores.femenino.jugador
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-secondary text-primary rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                        🥇
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-foreground">{topGoleadores.femenino.jugador}</p>
                      <p className="text-sm text-muted-foreground">{topGoleadores.femenino.equipo}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold text-secondary">{topGoleadores.femenino.goles}</div>
                      <p className="text-xs text-muted-foreground font-medium">goles</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-3 relative z-20">
                    <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                    <p className="text-muted-foreground text-center text-sm">Esperando que arranque el campeonato</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
      </section>

      {/* Línea divisoria */}
      <div className="container mx-auto px-4 mb-8 md:mb-12">
        <div className="h-[0.125rem] bg-gradient-to-r from-transparent via-secondary/80 via-secondary/80 to-transparent"></div>
      </div>

      {/* ¿Quién Toma Más? */}
      <section className="container mx-auto px-4 mb-16 md:mb-24 hidden">
        {/* Header */}
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-3">
            <GlassWater className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h2 className="text-3xl md:text-5xl font-bold text-secondary">¿Quién Toma Más?</h2>
            <GlassWater className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Resultados parciales
          </p>
        </div>

        {/* Podio - Desktop */}
        <div className="hidden md:flex items-end justify-center gap-6 max-w-5xl mx-auto">
          {/* 2do Lugar - Plata */}
                      <div className="flex-1 max-w-[13.75rem]">
            <Card className="border-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-8 pb-6 relative">
                  <div className="absolute top-4 right-4">
                    <Medal className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="flex flex-col items-center pt-4">
                    {/* Vaso de cerveza con líquido animado */}
                    <div className="mb-4 relative flex justify-center">
                      <div className="beer-glass-container beer-glass-container-md">
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-silver">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-slate-600 mb-2">2°</div>
                    <div className="text-lg font-semibold text-slate-700">Bertuca Jrs</div>
                  </div>
                </div>
                <div className="bg-white p-6 text-center border-t border-slate-200">
                  <div className="text-4xl font-bold text-slate-700 mb-1">124</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 1er Lugar - Oro */}
          <div className="flex-1 max-w-[16.25rem] relative -mt-8">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-full p-3 shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <Card className="border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white shadow-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-100 p-10 pb-8 relative">
                  <div className="absolute top-4 right-4">
                    <Award className="h-10 w-10 text-yellow-600" />
                  </div>
                  <div className="flex flex-col items-center pt-6">
                    {/* Vaso de cerveza con líquido animado - Oro casi lleno */}
                    <div className="mb-5 relative flex justify-center">
                      <div className="beer-glass-container beer-glass-container-lg">
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-gold">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-6xl font-bold text-yellow-700 mb-2">1°</div>
                    <div className="text-xl font-semibold text-yellow-800">CIANOS FC</div>
                  </div>
                </div>
                <div className="bg-white p-7 text-center border-t border-yellow-200">
                  <div className="text-5xl font-bold text-yellow-700 mb-1">187</div>
                  <div className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3er Lugar - Bronce */}
                      <div className="flex-1 max-w-[13.75rem]">
            <Card className="border-2 border-amber-700 bg-gradient-to-b from-amber-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 p-8 pb-6 relative">
                  <div className="absolute top-4 right-4">
                    <Medal className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="flex flex-col items-center pt-4">
                    {/* Vaso de cerveza con líquido animado - Bronce a la mitad */}
                    <div className="mb-4 relative">
                      <div className="beer-glass-container beer-glass-container-md">
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-bronze">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-amber-700 mb-2">3°</div>
                    <div className="text-lg font-semibold text-amber-800">Fecha Libre CF</div>
                  </div>
                </div>
                <div className="bg-white p-6 text-center border-t border-amber-200">
                  <div className="text-4xl font-bold text-amber-700 mb-1">98</div>
                  <div className="text-xs font-medium text-amber-600 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Podio - Mobile */}
        <div className="md:hidden space-y-5 max-w-md mx-auto">
          {/* 1er Lugar - Oro */}
          <div className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-full p-2 shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
            <Card className="border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-100 p-6 pb-5 relative">
                  <div className="absolute top-3 right-3">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="flex flex-col items-center pt-4">
                    {/* Vaso de cerveza con líquido animado - Oro casi lleno */}
                    <div className="mb-3 relative flex justify-center">
                      <div className="beer-glass-container">
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-gold">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-yellow-700 mb-1">1°</div>
                    <div className="text-base font-semibold text-yellow-800">CIANOS FC</div>
                  </div>
                </div>
                <div className="bg-white p-5 text-center border-t border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-700 mb-1">187</div>
                  <div className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2do y 3er Lugar */}
          <div className="grid grid-cols-2 gap-4">
            {/* 2do Lugar - Plata */}
            <Card className="border-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-5 pb-4 relative">
                  <div className="absolute top-2 right-2">
                    <Medal className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="flex flex-col items-center pt-2">
                    {/* Vaso de cerveza con líquido animado */}
                    <div className="mb-2 relative flex justify-center">
                      <div className="beer-glass-container" style={{ width: '5.3125rem', height: '5rem' }}>
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-silver">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-600 mb-1">2°</div>
                    <div className="text-sm font-semibold text-slate-700">Bertuca Jrs</div>
                  </div>
                </div>
                <div className="bg-white p-4 text-center border-t border-slate-200">
                  <div className="text-2xl font-bold text-slate-700 mb-1">124</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>

            {/* 3er Lugar - Bronce */}
            <Card className="border-2 border-amber-700 bg-gradient-to-b from-amber-50 to-white shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 p-5 pb-4 relative">
                  <div className="absolute top-2 right-2">
                    <Medal className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex flex-col items-center pt-2">
                    {/* Vaso de cerveza con líquido animado - Bronce a la mitad */}
                    <div className="mb-2 relative">
                      <div className="beer-glass-container" style={{ width: '3.75rem', height: '5rem' }}>
                        <div className="beer-glass">
                          <div className="liquid-fill liquid-bronze">
                            <div className="liquid-base"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                            <div className="liquid-wave"></div>
                          </div>
                          <div className="beer-foam"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-amber-700 mb-1">3°</div>
                    <div className="text-sm font-semibold text-amber-800">Fecha Libre CF</div>
                  </div>
                </div>
                <div className="bg-white p-4 text-center border-t border-amber-200">
                  <div className="text-2xl font-bold text-amber-700 mb-1">98</div>
                  <div className="text-xs font-medium text-amber-600 uppercase tracking-wider">Botellas</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Línea divisoria - Solo mobile */}
      <div className="md:hidden container mx-auto px-4 mb-8">
        <div className="h-[0.125rem] bg-gradient-to-r from-transparent via-secondary/80 via-secondary/80 to-transparent"></div>
      </div>

      {/* Sponsors */}
      <section className="container mx-auto px-4 py-4 sm:py-4 md:py-3 mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-lg sm:text-xl md:text-xl font-bold text-secondary mb-3 sm:mb-3 md:mb-3 text-center">Nuestros Sponsors</h2>
        
        {/* Mobile: Carrusel */}
        <div className="md:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {sponsors.map((sponsor, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-[45%]">
                  <Card className="hover:shadow-lg transition-all bg-white h-full">
                    <CardContent className="p-2 flex items-center justify-center h-[5rem]">
                      <div className={`relative w-full h-full flex items-center justify-center ${sponsor.padding || ''}`}>
                        <div className={`relative w-full ${sponsor.height || 'h-16'} flex items-center justify-center`}>
                          <Image
                            src={`${sponsor.image}?v=${SPONSORS_VERSION}`}
                            alt={`Sponsor ${index + 1}`}
                            width={200}
                            height={80}
                            className={`object-contain w-full h-full ${sponsor.imageClass || ''}`}
                            style={{ maxWidth: '100%', maxHeight: '100%', ...sponsor.imageStyle }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>

        {/* Desktop: Carrusel */}
        <div className="hidden md:block">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {sponsors.map((sponsor, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-[25%] lg:basis-[20%]">
                  <Card className="hover:shadow-lg transition-all bg-white h-full">
                    <CardContent className="p-2 flex items-center justify-center h-[5rem]">
                      <div className={`relative w-full h-full flex items-center justify-center ${sponsor.padding || ''}`}>
                        <div className={`relative w-full ${sponsor.height || 'h-16'} flex items-center justify-center`}>
                          <Image
                            src={`${sponsor.image}?v=${SPONSORS_VERSION}`}
                            alt={`Sponsor ${index + 1}`}
                            width={200}
                            height={80}
                            className={`object-contain w-full h-full ${sponsor.imageClass || ''}`}
                            style={{ maxWidth: '100%', maxHeight: '100%', ...sponsor.imageStyle }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </section>

    </div>
  );
}


