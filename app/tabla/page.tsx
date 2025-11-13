'use client';

import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SectionHero from '@/components/SectionHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buildStandings } from '@/lib/standings';
import TablaPosiciones from '@/components/TablaPosiciones';
import type { TournamentData } from '@/lib/data';

export default function TablaPage() {
  const [category, setCategory] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [data, setData] = useState<TournamentData | null>(null);
  const [standingsGeneral, setStandingsGeneral] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    
    async function loadData() {
      try {
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
        }
      } catch (error) {
        console.error('Error loading data:', error);
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

  useEffect(() => {
    if (!data) return;

    // Calcular tabla general por categoría
    const general = buildStandings(data.equipos, data.partidos, data.resultados, category);
    setStandingsGeneral(general);

    // Obtener grupos únicos de la categoría
    const equiposCategoria = data.equipos.filter((e: any) => e.categoria === category);
    const gruposUnicos = [...new Set(equiposCategoria.map((e: any) => e.grupo).filter(Boolean))];
    setGrupos(gruposUnicos);
  }, [data, category]);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <SectionHero
        title="Tabla de Posiciones"
        subtitle="Consulta las posiciones generales y por serie"
        imageSrc="/assets/posiciones.jpeg"
        
      />

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">

        <Tabs defaultValue="Masculino" className="animate-scale-in">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 md:mb-8 h-9">
            <TabsTrigger value="Masculino" onClick={() => setCategory('Masculino')} className="text-sm">
              Masculino
            </TabsTrigger>
            <TabsTrigger value="Femenino" onClick={() => setCategory('Femenino')} className="text-sm">
              Femenino
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Masculino" className="space-y-4 md:space-y-6">
            {grupos.length > 0 && data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {grupos.map((grupo) => {
                  const standingsGrupo = buildStandings(
                    data.equipos,
                    data.partidos,
                    data.resultados,
                    category,
                    grupo
                  );
                  return (
                    <Card key={grupo}>
                      <CardHeader className="pb-3 md:pb-6">
                        <CardTitle className="text-lg md:text-xl text-primary">Grupo {grupo}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 md:p-6">
                        <TablaPosiciones standings={standingsGrupo} />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="Femenino" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-lg md:text-xl text-primary">Tabla General</CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <TablaPosiciones standings={standingsGeneral} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


