import { fetchCSV } from './csv';
import { Equipo, Partido, Resultado, Goleador, Valla, Jugador, PartidoPlayoff, ResultadoPlayoff } from './types';

export interface TournamentData {
  equipos: Equipo[];
  partidos: Partido[];
  resultados: Resultado[];
  goleadores: Goleador[];
  vallas: Valla[];
  jugadores: Jugador[];
  partidosPlayoff: PartidoPlayoff[];
  resultadosPlayoff: ResultadoPlayoff[];
}

/**
 * Carga todos los datos del torneo desde los CSVs públicos
 * En desarrollo, retorna datos mock si las env están vacías
 */
export async function getData(): Promise<TournamentData> {
  const equiposUrl = process.env.NEXT_PUBLIC_CSV_EQUIPOS || '';
  const partidosUrl = process.env.NEXT_PUBLIC_CSV_PARTIDOS || '';
  const resultadosUrl = process.env.NEXT_PUBLIC_CSV_RESULTADOS || '';
  const goleadoresUrl = process.env.NEXT_PUBLIC_CSV_GOLEADORES || '';
  const vallasUrl = process.env.NEXT_PUBLIC_CSV_VALLAS || '';
  const jugadoresUrl = process.env.NEXT_PUBLIC_CSV_JUGADORES || '';
  const playoffsUrl = process.env.NEXT_PUBLIC_CSV_PLAYOFFS || '';
  const resultadosPlayoffsUrl = process.env.NEXT_PUBLIC_CSV_RESULTADOS_PLAYOFFS || '';

  // En desarrollo, usar datos mock si no hay URLs
  if (process.env.NODE_ENV === 'development' && 
      !equiposUrl && !partidosUrl && !resultadosUrl && !goleadoresUrl && !vallasUrl && !jugadoresUrl) {
    return getMockData();
  }

  // Cargar todos los CSVs en paralelo
  const [equipos, partidos, resultados, goleadores, vallas, jugadoresRaw, partidosPlayoff, resultadosPlayoff] = await Promise.all([
    fetchCSV<Equipo>(equiposUrl),
    fetchCSV<Partido>(partidosUrl),
    fetchCSV<Resultado>(resultadosUrl),
    fetchCSV<Goleador>(goleadoresUrl),
    fetchCSV<Valla>(vallasUrl),
    fetchCSV<any>(jugadoresUrl),
    playoffsUrl ? fetchCSV<PartidoPlayoff>(playoffsUrl) : Promise.resolve([]),
    resultadosPlayoffsUrl ? fetchCSV<ResultadoPlayoff>(resultadosPlayoffsUrl) : Promise.resolve([]),
  ]);

  // Transformar formato ancho del CSV de jugadores a formato de filas individuales
  // El CSV tiene formato: equipo_id, nombre, apellido, jugador1, apellido1, jugador2, apellido2, ...
  const jugadores: Jugador[] = [];
  if (jugadoresRaw && jugadoresRaw.length > 0) {
    jugadoresRaw.forEach((row: any, rowIndex: number) => {
      const equipoId = String(row.equipo_id || row.equipo || '').trim();
      if (!equipoId) return;
      
      const columns = Object.keys(row);
      let jugadorIndex = 0;
      
      // Procesar todas las columnas buscando pares (nombre, apellido)
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const colLower = col.toLowerCase();
        
        // Saltar columnas que no son nombres de jugadores
        if (colLower === 'equipo_id' || colLower === 'equipo') continue;
        
        // Buscar columnas que contengan nombres (jugador, nombre)
        if (colLower.includes('jugador') || (colLower.includes('nombre') && !colLower.includes('apellido'))) {
          const nombre = String(row[col] || '').trim();
          
          // Buscar el apellido correspondiente en la siguiente columna o una columna con el mismo número
          let apellido = '';
          const numMatch = col.match(/(\d+)/);
          
          if (numMatch) {
            // Buscar apellido con el mismo número
            const num = numMatch[1];
            const apellidoKey = columns.find((c: string) => 
              c.toLowerCase().includes('apellido') && c.includes(num)
            );
            if (apellidoKey) {
              apellido = String(row[apellidoKey] || '').trim();
            }
          } else {
            // Buscar el siguiente apellido
            const apellidoKey = columns.find((c: string, idx: number) => 
              idx > i && c.toLowerCase().includes('apellido')
            );
            if (apellidoKey) {
              apellido = String(row[apellidoKey] || '').trim();
            }
          }
          
          // Si hay nombre, crear el jugador (aunque no tenga apellido)
          if (nombre) {
            jugadores.push({
              id: `${equipoId}-${rowIndex}-${jugadorIndex++}`,
              nombre,
              apellido,
              equipo_id: equipoId,
            });
          }
        }
      }
    });
  }

  // Log para debug
  if (process.env.NODE_ENV === 'development') {
    console.log('CSV URLs:', {
      equipos: equiposUrl ? '✓' : '✗',
      partidos: partidosUrl ? '✓' : '✗',
      resultados: resultadosUrl ? '✓' : '✗',
      goleadores: goleadoresUrl ? '✓' : '✗',
      vallas: vallasUrl ? '✓' : '✗',
      jugadores: jugadoresUrl ? '✓' : '✗',
      playoffs: playoffsUrl ? '✓' : '✗',
      resultadosPlayoffs: resultadosPlayoffsUrl ? '✓' : '✗',
    });
    console.log('Datos cargados:', {
      equipos: equipos.length,
      partidos: partidos.length,
      resultados: resultados.length,
      goleadores: goleadores.length,
      vallas: vallas.length,
      jugadores: jugadores.length,
      partidosPlayoff: partidosPlayoff.length,
      resultadosPlayoff: resultadosPlayoff.length,
    });
  }

  return {
    equipos,
    partidos,
    resultados,
    goleadores,
    vallas,
    jugadores,
    partidosPlayoff: partidosPlayoff || [],
    resultadosPlayoff: resultadosPlayoff || [],
  };
}

/**
 * Datos mock para desarrollo
 */
function getMockData(): TournamentData {
  return {
    equipos: [
      { id: '1', nombre: 'Los Tigres', escudo_url: undefined, grupo: 'A', categoria: 'Masculino' },
      { id: '2', nombre: 'Los Leones', escudo_url: undefined, grupo: 'A', categoria: 'Masculino' },
      { id: '3', nombre: 'Las Águilas', escudo_url: undefined, grupo: 'B', categoria: 'Femenino' },
      { id: '4', nombre: 'Los Pumas', escudo_url: undefined, grupo: 'B', categoria: 'Femenino' },
    ],
    partidos: [
      {
        id: '1',
        fecha: '2025-01-15',
        hora: '16:00',
        cancha: 'Cancha 1',
        local_id: '1',
        visitante_id: '2',
        categoria: 'Masculino',
      },
      {
        id: '2',
        fecha: '2025-01-15',
        hora: '18:00',
        cancha: 'Cancha 1',
        local_id: '3',
        visitante_id: '4',
        categoria: 'Femenino',
      },
    ],
    resultados: [
      {
        partido_id: '1',
        goles_local: 3,
        goles_visitante: 2,
        observaciones: '',
      },
    ],
    goleadores: [
      { jugador: 'Juan Pérez', equipo_id: '1', goles: 15 },
      { jugador: 'Carlos López', equipo_id: '2', goles: 12 },
      { jugador: 'Miguel Ángel', equipo_id: '3', goles: 11 },
    ],
    vallas: [
      { equipo_id: '1', arq_nombre: 'Martín González', goles_recibidos: 8 },
      { equipo_id: '2', arq_nombre: 'Pablo Rodríguez', goles_recibidos: 10 },
    ],
    jugadores: [
      { id: '1', nombre: 'Juan', apellido: 'Pérez', equipo_id: '1' },
      { id: '2', nombre: 'Carlos', apellido: 'López', equipo_id: '2' },
    ],
    partidosPlayoff: [
      {
        id: 'p1',
        fecha: '2025-01-20',
        hora: '16:00',
        cancha: 'Cancha 1',
        local_id: '1',
        visitante_id: '2',
        categoria: 'Masculino',
        copa: 'Oro',
        ronda: 'Cuartos',
        bracket_position: 'Q1',
      },
    ],
    resultadosPlayoff: [],
  };
}


