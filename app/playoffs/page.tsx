'use client';

import { useState, useEffect } from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SectionHero from '@/components/SectionHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BracketTree from '@/components/BracketTree';
import type { TournamentData } from '@/lib/data';

export default function PlayoffsPage() {
  const [category, setCategory] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [copa, setCopa] = useState<'Oro' | 'Plata'>('Oro');
  const [data, setData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/api/data', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const tournamentData: TournamentData = await response.json();
        if (mounted) {
          setData(tournamentData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    loadData();
    
    // Refrescar datos cada 2 minutos
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

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <SectionHero
          title="Playoffs"
          subtitle=""
          imageSrc="/assets/playoffs.jpg"
        />
        <div className="container mx-auto px-4 py-12">
          <Card className="bg-white border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                <p className="text-muted-foreground text-center text-sm">Cargando playoffs...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <SectionHero
        title="Playoffs"
        subtitle=" "
        imageSrc="/assets/playoffs.jpg"
      />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Tabs defaultValue="Masculino" className="animate-scale-in">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2 h-9">
              <TabsTrigger value="Masculino" onClick={() => setCategory('Masculino')} className="text-sm">
                Masculino
              </TabsTrigger>
              <TabsTrigger value="Femenino" onClick={() => setCategory('Femenino')} className="text-sm">
                Femenino
              </TabsTrigger>
            </TabsList>
            
            {/* Filtro de Copa solo en mobile */}
            <div className="lg:hidden">
              <TabsList className="grid w-full grid-cols-2 h-9">
                <button
                  onClick={() => setCopa('Oro')}
                  className={`text-sm px-4 py-2 rounded-md transition-colors ${
                    copa === 'Oro'
                      ? 'bg-secondary text-primary font-medium'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Copa Rudy
                </button>
                <button
                  onClick={() => setCopa('Plata')}
                  className={`text-sm px-4 py-2 rounded-md transition-colors ${
                    copa === 'Plata'
                      ? 'bg-secondary text-primary font-medium'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Copa de Plata
                </button>
              </TabsList>
            </div>
          </div>

          <TabsContent value="Masculino" className="space-y-8">
            {/* Copa de Oro */}
            <Card className={`bg-gradient-to-br from-yellow-50/50 via-background to-yellow-50/30 border-2 border-yellow-200/50 shadow-xl ${copa !== 'Oro' ? 'lg:block hidden' : ''}`}>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl md:text-3xl text-center font-bold flex items-center justify-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                  <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Copa Rudy
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BracketTree
                  partidos={data.partidosPlayoff || []}
                  resultados={data.resultadosPlayoff || []}
                  equipos={data.equipos}
                  copa="Oro"
                  categoria="Masculino"
                />
              </CardContent>
            </Card>

            {/* Copa de Plata */}
            <Card className={`bg-gradient-to-br from-gray-50/50 via-background to-gray-50/30 border-2 border-gray-300/50 shadow-xl ${copa !== 'Plata' ? 'lg:block hidden' : ''}`}>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl md:text-3xl text-center font-bold flex items-center justify-center gap-3">
                  <Trophy className="h-8 w-8 text-gray-600" />
                  <span className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-clip-text text-transparent">
                    Copa de Plata
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BracketTree
                  partidos={data.partidosPlayoff || []}
                  resultados={data.resultadosPlayoff || []}
                  equipos={data.equipos}
                  copa="Plata"
                  categoria="Masculino"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Femenino" className="space-y-8">
            {/* Copa de Oro Femenino */}
            <Card className={`bg-gradient-to-br from-yellow-50/50 via-background to-yellow-50/30 border-2 border-yellow-200/50 shadow-xl ${copa !== 'Oro' ? 'lg:block hidden' : ''}`}>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl md:text-3xl text-center font-bold flex items-center justify-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                  <span className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Copa Rudy
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BracketTree
                  partidos={data.partidosPlayoff || []}
                  resultados={data.resultadosPlayoff || []}
                  equipos={data.equipos}
                  copa="Oro"
                  categoria="Femenino"
                />
              </CardContent>
            </Card>

            {/* Copa de Plata Femenino */}
            <Card className={`bg-gradient-to-br from-gray-50/50 via-background to-gray-50/30 border-2 border-gray-300/50 shadow-xl ${copa !== 'Plata' ? 'lg:block hidden' : ''}`}>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl md:text-3xl text-center font-bold flex items-center justify-center gap-3">
                  <Trophy className="h-8 w-8 text-gray-600" />
                  <span className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-clip-text text-transparent">
                    Copa de Plata
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BracketTree
                  partidos={data.partidosPlayoff || []}
                  resultados={data.resultadosPlayoff || []}
                  equipos={data.equipos}
                  copa="Plata"
                  categoria="Femenino"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

