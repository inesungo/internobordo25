export interface Equipo {
  id: string;
  nombre: string;
  escudo_url?: string;
  grupo?: string;
  categoria: 'Masculino' | 'Femenino';
}

export interface Partido {
  id: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  cancha?: string;
  local_id: string;
  visitante_id: string;
  categoria: 'Masculino' | 'Femenino';
}

export interface Resultado {
  partido_id: string;
  goles_local: number;
  goles_visitante: number;
  observaciones?: string;
}

export interface Jugador {
  id: string;
  nombre: string;
  apellido: string;
  equipo_id: string;
}

export interface Goleador {
  jugador: string;
  equipo_id: string;
  goles: number;
}

export interface Valla {
  equipo_id: string;
  arq_nombre: string;
  goles_recibidos: number;
}

export interface Standing {
  equipo_id: string;
  nombre: string;
  grupo?: string;
  PJ: number;
  PG: number;
  PE: number;
  PP: number;
  GF: number;
  GC: number;
  DG: number;
  Pts: number;
}

export interface PartidoPlayoff {
  id: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  cancha?: string;
  local_id: string;
  visitante_id: string;
  categoria: 'Masculino' | 'Femenino';
  copa: 'Oro' | 'Plata';
  ronda: 'Cuartos' | 'Semis' | 'Final';
  bracket_position: string; // Q1, Q2, Q3, Q4, SF1, SF2, F1
}

export interface ResultadoPlayoff {
  partido_id: string;
  goles_local: number;
  goles_visitante: number;
  observaciones?: string;
}


