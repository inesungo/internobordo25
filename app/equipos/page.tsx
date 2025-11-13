'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SectionHero from '@/components/SectionHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import type { TournamentData } from '@/lib/data';

export default function EquiposPage() {
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
          <p className="text-center">Cargando...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <SectionHero
        title="Equipos"
        subtitle="Conoce todos los equipos y sus integrantes"
        imageSrc="/assets/equipos.jpeg"
        icon={<Users className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-secondary drop-shadow-lg" />}
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

          <TabsContent value="Masculino">
            <Accordion type="single" collapsible className="space-y-4">
              {data.equipos
                .filter((e: any) => e.categoria === 'Masculino')
                .map((equipo: any, index: number) => {
                  const jugadoresEquipo = data.jugadores?.filter((j: any) => j.equipo_id === equipo.id) || [];
                  const uniqueKey = equipo.id || `masculino-${index}-${equipo.nombre}`;
                  return (
                    <AccordionItem
                      key={uniqueKey}
                      value={`equipo-${uniqueKey}`}
                      className="border-2 border-primary/20 rounded-lg overflow-hidden bg-card hover:shadow-xl transition-all"
                    >
                      <AccordionTrigger className="hover:no-underline px-6 py-6 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                          {equipo.escudo_url ? (
                            <Image
                              src={equipo.escudo_url}
                              alt={equipo.nombre}
                              width={60}
                              height={60}
                              className="object-contain"
                            />
                          ) : (
                            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-lg">
                              <Users className="h-6 w-6 text-secondary" />
                            </div>
                          )}
                          <div className="text-left">
                            <h3 className="text-xl font-bold text-primary">{equipo.nombre}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {jugadoresEquipo.length} {jugadoresEquipo.length === 1 ? 'Jugador' : 'Jugadores'}
                              {equipo.grupo && ` • Grupo ${equipo.grupo}`}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-4">
                        {jugadoresEquipo.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {jugadoresEquipo.map((jugador: any, jugadorIndex: number) => (
                              <div
                                key={jugador.id || `jugador-${uniqueKey}-${jugadorIndex}`}
                                className="relative bg-gradient-to-br from-muted/40 to-muted/20 rounded-lg p-4 hover:from-muted/60 hover:to-muted/40 transition-all hover:scale-105 border border-border group"
                              >
                                <div className="flex flex-col items-center text-center gap-3">
                                  <Avatar className="h-16 w-16 bg-gradient-to-br from-primary to-accent border-2 border-secondary group-hover:scale-110 transition-transform">
                                    <AvatarFallback className="text-secondary font-bold text-lg">
                                      {getInitials(`${jugador.nombre} ${jugador.apellido}`)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-bold text-sm text-foreground leading-tight">
                                      {jugador.nombre} {jugador.apellido}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No hay jugadores registrados para este equipo
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </TabsContent>

          <TabsContent value="Femenino">
            <Accordion type="single" collapsible className="space-y-4">
              {data.equipos
                .filter((e: any) => e.categoria === 'Femenino')
                .map((equipo: any, index: number) => {
                  const jugadoresEquipo = data.jugadores?.filter((j: any) => j.equipo_id === equipo.id) || [];
                  const uniqueKey = equipo.id || `femenino-${index}-${equipo.nombre}`;
                  return (
                    <AccordionItem
                      key={uniqueKey}
                      value={`equipo-${uniqueKey}`}
                      className="border-2 border-primary/20 rounded-lg overflow-hidden bg-card hover:shadow-xl transition-all"
                    >
                      <AccordionTrigger className="hover:no-underline px-6 py-6 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                          {equipo.escudo_url ? (
                            <Image
                              src={equipo.escudo_url}
                              alt={equipo.nombre}
                              width={60}
                              height={60}
                              className="object-contain"
                            />
                          ) : (
                            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-lg">
                              <Users className="h-6 w-6 text-secondary" />
                            </div>
                          )}
                          <div className="text-left">
                            <h3 className="text-xl font-bold text-primary">{equipo.nombre}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {jugadoresEquipo.length} {jugadoresEquipo.length === 1 ? 'Jugadora' : 'Jugadoras'}
                              {equipo.grupo && ` • Grupo ${equipo.grupo}`}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-4">
                        {jugadoresEquipo.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {jugadoresEquipo.map((jugador: any, jugadorIndex: number) => (
                              <div
                                key={jugador.id || `jugador-${uniqueKey}-${jugadorIndex}`}
                                className="relative bg-gradient-to-br from-muted/40 to-muted/20 rounded-lg p-4 hover:from-muted/60 hover:to-muted/40 transition-all hover:scale-105 border border-border group"
                              >
                                <div className="flex flex-col items-center text-center gap-3">
                                  <Avatar className="h-16 w-16 bg-gradient-to-br from-primary to-accent border-2 border-secondary group-hover:scale-110 transition-transform">
                                    <AvatarFallback className="text-secondary font-bold text-lg">
                                      {getInitials(`${jugador.nombre} ${jugador.apellido}`)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-bold text-sm text-foreground leading-tight">
                                      {jugador.nombre} {jugador.apellido}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            No hay jugadoras registradas para este equipo
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


