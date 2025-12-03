'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Calendar, Clock, MapPin, Info } from 'lucide-react';
import Image from 'next/image';
import type { PartidoPlayoff, ResultadoPlayoff, Equipo } from '@/lib/types';

interface BracketTreeProps {
  partidos: PartidoPlayoff[];
  resultados: ResultadoPlayoff[];
  equipos: Equipo[];
  copa: 'Oro' | 'Plata';
  categoria: 'Masculino' | 'Femenino';
}

interface MatchData {
  partido: PartidoPlayoff;
  resultado?: ResultadoPlayoff;
  local?: Equipo;
  visitante?: Equipo;
}

export default function BracketTree({ partidos, resultados, equipos, copa, categoria }: BracketTreeProps) {
  // Función para obtener la ruta del escudo del equipo
  const getEscudoUrl = (equipo: Equipo | undefined): string | null => {
    if (!equipo?.escudo_url) return null;
    
    const escudoUrl = equipo.escudo_url.trim();
    
    // Si es una URL externa (http/https), usarla directamente
    if (escudoUrl.startsWith('http://') || escudoUrl.startsWith('https://')) {
      return escudoUrl;
    }
    
    // Si ya empieza con /, usarla directamente
    if (escudoUrl.startsWith('/')) {
      return escudoUrl;
    }
    
    // Si es un nombre de archivo local, construir la ruta
    return `/assets/escudos/${escudoUrl}`;
  };

  // Filtrar partidos por copa y categoría
  const partidosFiltrados = partidos.filter(
    (p) => p.copa === copa && p.categoria === categoria
  );

  // Organizar partidos por ronda
  const cuartos = partidosFiltrados
    .filter((p) => p.ronda === 'Cuartos')
    .sort((a, b) => a.bracket_position.localeCompare(b.bracket_position))
    .map((p) => {
      const resultado = resultados.find((r) => r.partido_id === p.id);
      return {
        partido: p,
        resultado,
        local: equipos.find((e) => e.id === p.local_id),
        visitante: equipos.find((e) => e.id === p.visitante_id),
      };
    });

  const semis = partidosFiltrados
    .filter((p) => p.ronda === 'Semis')
    .sort((a, b) => a.bracket_position.localeCompare(b.bracket_position))
    .map((p) => {
      const resultado = resultados.find((r) => r.partido_id === p.id);
      return {
        partido: p,
        resultado,
        local: equipos.find((e) => e.id === p.local_id),
        visitante: equipos.find((e) => e.id === p.visitante_id),
      };
    });

  const final = partidosFiltrados
    .filter((p) => p.ronda === 'Final')
    .map((p) => {
      const resultado = resultados.find((r) => r.partido_id === p.id);
      return {
        partido: p,
        resultado,
        local: equipos.find((e) => e.id === p.local_id),
        visitante: equipos.find((e) => e.id === p.visitante_id),
      };
    })[0];

  const getWinner = (match: MatchData): Equipo | null => {
    if (!match.resultado) return null;
    if (match.resultado.goles_local > match.resultado.goles_visitante) {
      return match.local || null;
    }
    if (match.resultado.goles_visitante > match.resultado.goles_local) {
      return match.visitante || null;
    }
    return null; // Empate
  };

  const MatchCard = ({ match, size = 'normal' }: { match: MatchData; size?: 'small' | 'normal' | 'large' }) => {
    const isSmall = size === 'small';
    const isLarge = size === 'large';
    const winner = getWinner(match);
    const isFinished = !!match.resultado;
    const isEmpty = !match.local && !match.visitante && !match.partido.fecha;

    // Clases dinámicas basadas en tamaño
    const paddingClass = isSmall ? 'p-2' : isLarge ? 'p-4' : 'p-3';
    const marginBottomClass = isSmall ? 'mb-1' : 'mb-2';
    const textSizeClass = isSmall ? 'text-xs' : isLarge ? 'text-lg' : 'text-sm';
    const iconSizeClass = isSmall ? 'h-3 w-3' : 'h-4 w-4';
    const gapClass = isSmall ? 'gap-1' : 'gap-2';
    const escudoSizeClass = isSmall ? 'w-6 h-6' : isLarge ? 'w-10 h-10' : 'w-8 h-8';
    const scoreSizeClass = isSmall ? 'text-sm' : 'text-lg';

    // Si la card está vacía, mostrar mensaje
    if (isEmpty) {
      return (
        <Card className="bg-white/50 border-2 border-dashed border-primary/20 shadow-md">
          <CardContent className={`${paddingClass} text-center`}>
            <div className={`${textSizeClass} text-muted-foreground italic`}>
              Esperando resultados del fixture
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        className={`bg-white border-2 ${
          isFinished
            ? winner === match.local || winner === match.visitante
              ? 'border-secondary shadow-lg'
              : 'border-primary/30'
            : 'border-primary/20 hover:border-secondary transition-all'
        } ${isLarge ? 'shadow-xl' : 'shadow-md'}`}
      >
        <CardContent className={paddingClass}>
          {/* Fecha y hora */}
          {match.partido.fecha && (
            <div className={`flex items-center gap-2 ${marginBottomClass} ${textSizeClass} text-muted-foreground`}>
              <Calendar className={iconSizeClass} />
              <span>{new Date(match.partido.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>
              {match.partido.hora && (
                <>
                  <Clock className={`${iconSizeClass} ml-2`} />
                  <span>{match.partido.hora}</span>
                </>
              )}
              {match.partido.cancha && (
                <>
                  <MapPin className={`${iconSizeClass} ml-2`} />
                  <span>{match.partido.cancha}</span>
                </>
              )}
            </div>
          )}

          {/* Equipos */}
          <div className="space-y-2">
            {/* Local */}
            <div
              className={`flex items-center ${gapClass} ${
                winner === match.local ? 'font-bold text-secondary' : ''
              }`}
            >
              {getEscudoUrl(match.local) && (
                <div className={`relative ${escudoSizeClass} flex-shrink-0`}>
                  <Image
                    src={getEscudoUrl(match.local)!}
                    alt={match.local?.nombre || 'Equipo'}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className={`${textSizeClass} truncate flex-1`}>
                {match.local?.nombre || 'TBD'}
              </span>
              {isFinished && (
                <span className={`${scoreSizeClass} font-bold ${
                  winner === match.local ? 'text-secondary' : 'text-muted-foreground'
                }`}>
                  {match.resultado?.goles_local ?? '-'}
                </span>
              )}
            </div>

            {/* Visitante */}
            <div
              className={`flex items-center ${gapClass} ${
                winner === match.visitante ? 'font-bold text-secondary' : ''
              }`}
            >
              {getEscudoUrl(match.visitante) && (
                <div className={`relative ${escudoSizeClass} flex-shrink-0`}>
                  <Image
                    src={getEscudoUrl(match.visitante)!}
                    alt={match.visitante?.nombre || 'Equipo'}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className={`${textSizeClass} truncate flex-1`}>
                {match.visitante?.nombre || 'TBD'}
              </span>
              {isFinished && (
                <span className={`${scoreSizeClass} font-bold ${
                  winner === match.visitante ? 'text-secondary' : 'text-muted-foreground'
                }`}>
                  {match.resultado?.goles_visitante ?? '-'}
                </span>
              )}
            </div>
          </div>

          {/* Observaciones */}
          {match.resultado?.observaciones && (
            <div className={`flex items-start gap-1.5 mt-2 pt-2 border-t border-primary/10`}>
              <Info className={`${iconSizeClass} text-primary/60 flex-shrink-0 mt-0.5`} />
              <span className={`${isSmall ? 'text-[10px]' : 'text-xs'} text-primary/70 italic leading-tight`}>
                {match.resultado.observaciones}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Crear estructura completa siempre, incluso si no hay partidos
  const cuartosCompletos = cuartos.length > 0 
    ? cuartos 
    : Array.from({ length: 4 }, (_, idx) => ({
        partido: {
          id: `empty-q${idx + 1}`,
          fecha: '',
          hora: '',
          cancha: '',
          local_id: '',
          visitante_id: '',
          categoria,
          copa,
          ronda: 'Cuartos' as const,
          bracket_position: `Q${idx + 1}`,
        },
        resultado: undefined,
        local: undefined,
        visitante: undefined,
      }));

  const semisCompletos = semis.length > 0
    ? semis
    : Array.from({ length: 2 }, (_, idx) => ({
        partido: {
          id: `empty-sf${idx + 1}`,
          fecha: '',
          hora: '',
          cancha: '',
          local_id: '',
          visitante_id: '',
          categoria,
          copa,
          ronda: 'Semis' as const,
          bracket_position: `SF${idx + 1}`,
        },
        resultado: undefined,
        local: undefined,
        visitante: undefined,
      }));

  const finalCompleto = final || {
    partido: {
      id: 'empty-f1',
      fecha: '',
      hora: '',
      cancha: '',
      local_id: '',
      visitante_id: '',
      categoria,
      copa,
      ronda: 'Final' as const,
      bracket_position: 'F1',
    },
    resultado: undefined,
    local: undefined,
    visitante: undefined,
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Desktop View */}
      <div className="hidden lg:block min-w-max">
        <div className="relative flex items-center gap-12 justify-center py-12">
          {/* Cuartos de Final */}
          <div className="flex flex-col gap-4 z-10">
            <h3 className="text-lg font-bold text-primary uppercase tracking-wide text-center mb-4">
              Cuartos de Final
            </h3>
            <div className="space-y-2">
              {cuartosCompletos.map((match) => (
                <div key={match.partido.id}>
                  <MatchCard match={match} size="normal" />
                </div>
              ))}
            </div>
          </div>

          {/* Semifinales - Centradas verticalmente */}
          <div className="flex flex-col gap-4 items-center z-10">
            <h3 className="text-lg font-bold text-secondary uppercase tracking-wide text-center mb-4">
              Semifinales
            </h3>
            <div className="space-y-2">
              {semisCompletos.map((match) => (
                <div key={match.partido.id}>
                  <MatchCard match={match} size="normal" />
                </div>
              ))}
            </div>
          </div>

          {/* Final - Centrada verticalmente */}
          <div className="flex flex-col items-center z-10">
            <h3 className="text-xl font-bold text-secondary uppercase tracking-wide text-center mb-4">
              Final
            </h3>
            <MatchCard match={finalCompleto} size="large" />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden space-y-6 py-4">
        {/* Cuartos de Final */}
        <div>
          <h3 className="text-base font-bold text-primary uppercase tracking-wide mb-3 text-center">
            Cuartos de Final
          </h3>
          <div className="space-y-2">
            {cuartosCompletos.map((match) => (
              <MatchCard key={match.partido.id} match={match} size="normal" />
            ))}
          </div>
        </div>

        {/* Semifinales */}
        <div>
          <h3 className="text-base font-bold text-secondary uppercase tracking-wide mb-3 text-center">
            Semifinales
          </h3>
          <div className="space-y-2">
            {semisCompletos.map((match) => (
              <MatchCard key={match.partido.id} match={match} size="normal" />
            ))}
          </div>
        </div>

        {/* Final */}
        <div>
          <h3 className="text-lg font-bold text-secondary uppercase tracking-wide mb-3 text-center">
            Final
          </h3>
          <MatchCard match={finalCompleto} size="normal" />
        </div>
      </div>
    </div>
  );
}

