'use client';

import { Trophy, Calendar, Users, Instagram, Camera, Share2, Target, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Llamar a la API route en lugar de getData directo
        const response = await fetch('/api/data');
        
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
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  type Sponsor = {
    image: string;
    height?: string;
    padding?: string;
    imageClass?: string;
    imageStyle?: React.CSSProperties;
  };

  const sponsors: Sponsor[] = [
    { image: '/assets/sponsor1.png', height: 'h-20 sm:h-28 md:h-24' }, // Más grande
    { image: '/assets/sponsor2.png', height: 'h-10 sm:h-12 md:h-12', padding: 'pt-4 sm:pt-5 md:pt-4 pb-1 sm:pb-2 md:pb-1' }, // Más chico y centrado con menos padding arriba
    { image: '/assets/sponsor3.png', height: 'h-20 sm:h-28 md:h-24' }, // Más grande
    { image: '/assets/sponsor4.png', height: 'h-24 sm:h-32 md:h-28', imageStyle: { filter: 'brightness(0)' } }, // Más grande, convertido a negro
  ];

  return (
    <div className="min-h-screen relative">
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
                className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/foto2.jpeg)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-accent/60" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
                
                <div className="relative z-30 text-center px-4 animate-fade-in mb-16">
                  <div className="mb-4 flex justify-center">
                    <Image
                      src="/assets/logo_interno.png"
                      alt="Interno Bordo"
                      width={400}
                      height={200}
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/fixture">
                      <Button
                        size="lg"
                        className="bg-secondary text-primary hover:bg-secondary/90 font-bold text-lg px-8"
                      >
                        Ver Fixture
                      </Button>
                    </Link>
                    <Link href="/tabla">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-secondary text-secondary hover:bg-secondary/10 font-bold text-lg px-8"
                      >
                        Tabla de Posiciones
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Slide 2: Fotos - Oculto temporalmente hasta que haya fotos */}
            {/* <CarouselItem>
              <div 
                className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/foto1.jpeg)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-accent/60" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
                
                <div className="relative z-10 text-center px-4 animate-fade-in">
                  <Camera className="h-24 w-24 text-secondary mx-auto mb-6 drop-shadow-lg" />
                  <h2 className="text-4xl md:text-6xl font-bold text-secondary mb-4 drop-shadow-lg">
                    ¡NO TE PIERDAS LAS FOTOS!
                  </h2>
                  <p className="text-xl md:text-2xl text-secondary/90 mb-8 max-w-2xl mx-auto">
                    Los mejores momentos del torneo capturados para vos
                  </p>
                  <Button
                    size="lg"
                    className="bg-secondary text-primary hover:bg-secondary/90 font-bold text-lg px-8"
                  >
                    Ver Galería
                  </Button>
                </div>
              </div>
            </CarouselItem> */}

            {/* Slide 3: Redes Sociales */}
            <CarouselItem>
              <div 
                className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/foto3.jpeg)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-accent/60" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
                
                <div className="relative z-10 text-center px-4 animate-fade-in">
                  <Share2 className="h-24 w-24 text-secondary mx-auto mb-6 drop-shadow-lg" />
                  <h2 className="text-4xl md:text-6xl font-bold text-secondary mb-4 drop-shadow-lg">
                    SEGUÍ EL TORNEO
                  </h2>
                  <p className="text-xl md:text-2xl text-secondary/90 mb-8 max-w-2xl mx-auto">
                    Unite a nuestra comunidad en redes sociales
                  </p>
                  <Button
                    size="lg"
                    className="bg-secondary text-primary hover:bg-secondary/90 font-bold text-lg px-8"
                    onClick={() => window.open('https://www.instagram.com/internobordo?igsh=YXp0N2F0ZWszMTU0', '_blank')}
                  >
                    <Instagram className="mr-2 h-5 w-5" />
                    Seguinos en Instagram
                  </Button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-secondary/90 text-primary border-0 hover:bg-secondary" />
          <CarouselNext className="right-4 bg-secondary/90 text-primary border-0 hover:bg-secondary" />
        </Carousel>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 -mt-32 relative z-10 mb-6 md:mb-16 pb-8 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: Trophy, label: 'Equipos', value: stats.equipos || 0, color: 'text-secondary', suffix: '', href: '/equipos' },
            { icon: Calendar, label: 'Partidos', value: stats.partidos || 0, color: 'text-secondary', suffix: '', href: '/fixture' },
            { icon: Users, label: 'Jugadores', value: stats.jugadores || 0, color: 'text-secondary', suffix: ' ', href: '/equipos' },
          ].map((stat, index) => (
            <Link key={index} href={stat.href} className="block w-full">
              <Card className="bg-card/95 backdrop-blur-sm border-border hover:shadow-xl transition-all animate-scale-in cursor-pointer hover:scale-105 w-full">
                <CardContent className="p-4 md:p-6 text-center">
                  <stat.icon className={`h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 ${stat.color}`} />
                  <p className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    {stat.suffix || ''}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
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
              className="w-full h-[200px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4 z-20">
              <p className="text-white font-bold text-lg">Próximos Partidos</p>
              <p className="text-white/80 text-xs">No te pierdas los próximos encuentros</p>
            </div>
          </div>

          {/* Cards de partidos - Solo 2 en mobile */}
          <div className="flex flex-col gap-4">
            {upcomingMatches.slice(0, 2).map((match, index) => (
              <MatchCard key={index} {...match} />
            ))}
          </div>
        </div>

        {/* Desktop: Imagen a un lado y cards al otro */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 mb-8">
          {/* Imagen con overlay */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl group h-[500px]">
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
            {upcomingMatches.slice(0, 3).map((match, index) => (
            <MatchCard key={index} {...match} />
          ))}
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

      {/* Goleadores */}
      <section className="container mx-auto px-4 mb-16">
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
              className="w-full h-[200px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4 z-20">
              <p className="text-white font-bold text-lg">Top Goleadores</p>
              <p className="text-white/80 text-xs">Los mejores del torneo</p>
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
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                          🥇
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base text-foreground">{topGoleadores.masculino.jugador}</p>
                        <p className="text-xs text-muted-foreground">{topGoleadores.masculino.equipo}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-primary">{topGoleadores.masculino.goles}</div>
                        <p className="text-[10px] text-muted-foreground font-medium">goles</p>
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
                        <div className="absolute -bottom-1 -right-1 bg-secondary text-primary rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                          🥇
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base text-foreground">{topGoleadores.femenino.jugador}</p>
                        <p className="text-xs text-muted-foreground">{topGoleadores.femenino.equipo}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-secondary">{topGoleadores.femenino.goles}</div>
                        <p className="text-[10px] text-muted-foreground font-medium">goles</p>
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
        
        {/* Botón en mobile */}
        <div className="md:hidden text-center mt-4">
          <Link href="/estadisticas">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Ver tabla goleadores
            </Button>
          </Link>
        </div>
      </section>

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
                    <CardContent className="p-2 flex items-center justify-center h-[80px]">
                      <div className={`relative w-full h-full flex items-center justify-center ${sponsor.padding || ''}`}>
                        <div className={`relative w-full ${sponsor.height || 'h-16'} flex items-center justify-center`}>
                          <Image
                            src={sponsor.image}
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

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-2">
          {sponsors.map((sponsor, index) => (
            <Card key={index} className="hover:shadow-lg transition-all bg-white h-full">
              <CardContent className="p-2 flex items-center justify-center h-[80px]">
                <div className={`relative w-full h-full flex items-center justify-center ${sponsor.padding || ''}`}>
                  <div className={`relative w-full ${sponsor.height || 'h-16'} flex items-center justify-center`}>
                    <Image
                      src={sponsor.image}
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
          ))}
        </div>
      </section>

    </div>
  );
}


