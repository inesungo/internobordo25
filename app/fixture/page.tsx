'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SectionHero from '@/components/SectionHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ListaPartidos from '@/components/ListaPartidos';
import type { TournamentData } from '@/lib/data';

export default function FixturePage() {
  const [category, setCategory] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'proximos' | 'finalizados'>('todos');
  const [data, setData] = useState<TournamentData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const tournamentData: TournamentData = await response.json();
        setData(tournamentData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    loadData();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <SectionHero
        title="Fixture del Torneo"
        subtitle="Consulta todos los partidos programados y resultados"
        imageSrc="/assets/fixture.jpeg"
        icon={<Calendar className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-secondary drop-shadow-lg" />}
      />

      <div className="container mx-auto px-4 py-8 sm:py-12">

        <Tabs defaultValue="Masculino" className="animate-scale-in">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="Masculino" onClick={() => setCategory('Masculino')}>
                Masculino
              </TabsTrigger>
              <TabsTrigger value="Femenino" onClick={() => setCategory('Femenino')}>
                Femenino
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant={estadoFiltro === 'todos' ? 'default' : 'outline'}
                className={estadoFiltro === 'todos' ? 'bg-secondary text-primary' : ''}
                onClick={() => setEstadoFiltro('todos')}
              >
                Todos
              </Button>
              <Button
                variant={estadoFiltro === 'proximos' ? 'default' : 'outline'}
                className={estadoFiltro === 'proximos' ? 'bg-secondary text-primary' : ''}
                onClick={() => setEstadoFiltro('proximos')}
              >
                Próximos
              </Button>
              <Button
                variant={estadoFiltro === 'finalizados' ? 'default' : 'outline'}
                className={estadoFiltro === 'finalizados' ? 'bg-secondary text-primary' : ''}
                onClick={() => setEstadoFiltro('finalizados')}
              >
                Finalizados
              </Button>
            </div>
          </div>

          <TabsContent value="Masculino">
            <ListaPartidos
              partidos={data.partidos}
              resultados={data.resultados}
              equipos={data.equipos}
              categoria="Masculino"
              estadoFiltro={estadoFiltro}
            />
          </TabsContent>

          <TabsContent value="Femenino">
            <ListaPartidos
              partidos={data.partidos}
              resultados={data.resultados}
              equipos={data.equipos}
              categoria="Femenino"
              estadoFiltro={estadoFiltro}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


