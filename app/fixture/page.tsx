'use client';

import { useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SectionHero from '@/components/SectionHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import ListaPartidos from '@/components/ListaPartidos';
import type { TournamentData } from '@/lib/data';

export default function FixturePage() {
  const [category, setCategory] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'proximos' | 'finalizados'>('todos');
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [data, setData] = useState<TournamentData | null>(null);

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

  // Limpiar equipos seleccionados cuando cambia la categoría
  useEffect(() => {
    if (data) {
      const equiposCategoria = data.equipos
        .filter((e) => e.categoria === category)
        .map((e) => e.id);
      setEquiposSeleccionados((prev) => prev.filter((id) => equiposCategoria.includes(id)));
    }
  }, [category, data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <SectionHero
          title="Fixture del Torneo"
          subtitle="Consulta todos los partidos programados y resultados"
          imageSrc="/assets/fixture.jpeg"
        />
        <div className="container mx-auto px-4 py-12">
          <Card className="bg-white border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
                <p className="text-muted-foreground text-center text-sm">Cargando partidos...</p>
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
        title="Fixture del Torneo"
        subtitle="Consulta todos los partidos programados y resultados"
        imageSrc="/assets/fixture.jpeg"
        
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

            <div className="flex gap-2">
              <Button
                variant={estadoFiltro === 'todos' ? 'default' : 'outline'}
                className={`${estadoFiltro === 'todos' ? 'bg-secondary text-primary' : ''} h-9 px-3 text-sm`}
                onClick={() => setEstadoFiltro('todos')}
              >
                Todos
              </Button>
              <Button
                variant={estadoFiltro === 'proximos' ? 'default' : 'outline'}
                className={`${estadoFiltro === 'proximos' ? 'bg-secondary text-primary' : ''} h-9 px-3 text-sm`}
                onClick={() => setEstadoFiltro('proximos')}
              >
                Próximos
              </Button>
              <Button
                variant={estadoFiltro === 'finalizados' ? 'default' : 'outline'}
                className={`${estadoFiltro === 'finalizados' ? 'bg-secondary text-primary' : ''} h-9 px-3 text-sm`}
                onClick={() => setEstadoFiltro('finalizados')}
              >
                Finalizados
              </Button>
              
              <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={`h-9 px-3 ${equiposSeleccionados.length > 0 ? 'bg-secondary/20 border-secondary' : ''}`}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Filtrar</span>
                    {equiposSeleccionados.length > 0 && (
                      <span className="ml-2 bg-secondary text-primary rounded-full px-2 py-0.5 text-xs">
                        {equiposSeleccionados.length}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[calc(100%-2rem)] max-w-[26.5625rem] rounded-2xl sm:rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Filtrar por equipo</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {data && (
                      <>
                        <ScrollArea className="h-[18.75rem] pr-4">
                          <div className="space-y-2">
                            {data.equipos
                              .filter((equipo) => equipo.categoria === category)
                              .sort((a, b) => a.nombre.localeCompare(b.nombre))
                              .map((equipo) => (
                                <div
                                  key={equipo.id}
                                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                  <Checkbox
                                    id={equipo.id}
                                    checked={equiposSeleccionados.includes(equipo.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setEquiposSeleccionados([...equiposSeleccionados, equipo.id]);
                                      } else {
                                        setEquiposSeleccionados(
                                          equiposSeleccionados.filter((id) => id !== equipo.id)
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={equipo.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                  >
                                    {equipo.nombre}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                        <div className="flex gap-2">
                          {equiposSeleccionados.length > 0 && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEquiposSeleccionados([]);
                              }}
                              className="flex-1"
                            >
                              Limpiar filtro
                            </Button>
                          )}
                          <Button
                            variant="default"
                            onClick={() => {
                              setIsFilterOpen(false);
                            }}
                            className={`${equiposSeleccionados.length > 0 ? 'flex-1' : 'w-full'} bg-secondary text-primary hover:bg-secondary/90`}
                          >
                            Aplicar
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="Masculino">
            <ListaPartidos
              partidos={data.partidos}
              resultados={data.resultados}
              equipos={data.equipos}
              categoria="Masculino"
              estadoFiltro={estadoFiltro}
              equiposSeleccionados={equiposSeleccionados}
            />
          </TabsContent>

          <TabsContent value="Femenino">
            <ListaPartidos
              partidos={data.partidos}
              resultados={data.resultados}
              equipos={data.equipos}
              categoria="Femenino"
              estadoFiltro={estadoFiltro}
              equiposSeleccionados={equiposSeleccionados}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


