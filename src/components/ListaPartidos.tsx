import MatchCard from './MatchCard';
import { Partido, Resultado, Equipo } from '@/lib/types';
import dayjs from 'dayjs';

interface ListaPartidosProps {
  partidos: Partido[];
  resultados: Resultado[];
  equipos: Equipo[];
  categoria?: 'Masculino' | 'Femenino';
  estadoFiltro?: 'todos' | 'proximos' | 'finalizados';
  equiposSeleccionados?: string[];
}

export default function ListaPartidos({ partidos, resultados, equipos, categoria, estadoFiltro = 'todos', equiposSeleccionados = [] }: ListaPartidosProps) {
  // Filtrar por categoría si se especifica
  let partidosFiltrados = partidos;
  if (categoria) {
    partidosFiltrados = partidos.filter((p) => p.categoria === categoria);
  }

  // Filtrar por estado (próximos, finalizados, todos)
  if (estadoFiltro === 'proximos') {
    partidosFiltrados = partidosFiltrados.filter((p) => !resultados.find((r) => r.partido_id === p.id));
  } else if (estadoFiltro === 'finalizados') {
    partidosFiltrados = partidosFiltrados.filter((p) => resultados.find((r) => r.partido_id === p.id));
  }

  // Filtrar por equipos seleccionados
  if (equiposSeleccionados.length > 0) {
    partidosFiltrados = partidosFiltrados.filter((p) => {
      return equiposSeleccionados.includes(p.local_id) || equiposSeleccionados.includes(p.visitante_id);
    });
  }

  const partidosOrdenados = [...partidosFiltrados].sort((a, b) => {
    const dateA = dayjs(`${a.fecha} ${a.hora}`);
    const dateB = dayjs(`${b.fecha} ${b.hora}`);
    return dateA.diff(dateB);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {partidosOrdenados.map((partido) => {
        const local = equipos.find((e) => e.id === partido.local_id);
        const visitante = equipos.find((e) => e.id === partido.visitante_id);
        const resultado = resultados.find((r) => r.partido_id === partido.id);

        return (
          <MatchCard
            key={partido.id}
            homeTeam={local?.nombre || 'TBD'}
            awayTeam={visitante?.nombre || 'TBD'}
            homeScore={resultado?.goles_local}
            awayScore={resultado?.goles_visitante}
            date={dayjs(partido.fecha).format('DD MMM')}
            time={partido.hora}
            category={partido.categoria}
            status={resultado ? 'Finalizado' : 'Próximo'}
          />
        );
      })}
    </div>
  );
}


