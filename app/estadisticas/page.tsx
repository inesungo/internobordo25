'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import SectionHero from '@/components/SectionHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Shield, Loader2 } from 'lucide-react';
import TablaGoleadores from '@/components/TablaGoleadores';
import TablaVallas from '@/components/TablaVallas';
import type { TournamentData } from '@/lib/data';

export default function EstadisticasPage() {
  const [category, setCategory] = useState<'Masculino' | 'Femenino'>('Masculino');
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
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'hsl(343, 64%, 25%)' }} />
            <p className="text-muted-foreground text-center text-sm">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <SectionHero
        title="Estadísticas"
        subtitle="Goleadores y arqueros menos vencidos del torneo"
        imageSrc="/assets/estadisticas.jpeg"
        
      />

      <div className="container mx-auto px-4 py-8 sm:py-12">

        <Tabs defaultValue="Masculino" className="animate-scale-in">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="Masculino" onClick={() => setCategory('Masculino')}>
              Masculino
            </TabsTrigger>
            <TabsTrigger value="Femenino" onClick={() => setCategory('Femenino')}>
              Femenino
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Masculino" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-3">
                  <Target className="h-8 w-8 text-secondary" />
                  Tabla de Goleadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TablaGoleadores goleadores={data.goleadores} equipos={data.equipos} categoria="Masculino" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-3">
                  <Shield className="h-8 w-8 text-accent" />
                  Arqueros Menos Vencidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TablaVallas vallas={data.vallas} equipos={data.equipos} categoria="Masculino" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Femenino" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-3">
                  <Target className="h-8 w-8 text-secondary" />
                  Tabla de Goleadoras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TablaGoleadores goleadores={data.goleadores} equipos={data.equipos} categoria="Femenino" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-3">
                  <Shield className="h-8 w-8 text-accent" />
                  Arqueras Menos Vencidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TablaVallas vallas={data.vallas} equipos={data.equipos} categoria="Femenino" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


