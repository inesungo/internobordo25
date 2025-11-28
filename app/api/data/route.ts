import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

/**
 * API Route para obtener los datos del torneo
 * Se ejecuta en el servidor donde sí funciona next: { revalidate }
 * Revalida cada 2 minutos (120 segundos)
 */
export const revalidate = 120;

export async function GET() {
  try {
    // Log para debug en producción
    const envVars = {
      equipos: process.env.NEXT_PUBLIC_CSV_EQUIPOS ? '✓ Configurada' : '✗ No configurada',
      partidos: process.env.NEXT_PUBLIC_CSV_PARTIDOS ? '✓ Configurada' : '✗ No configurada',
      resultados: process.env.NEXT_PUBLIC_CSV_RESULTADOS ? '✓ Configurada' : '✗ No configurada',
      goleadores: process.env.NEXT_PUBLIC_CSV_GOLEADORES ? '✓ Configurada' : '✗ No configurada',
      vallas: process.env.NEXT_PUBLIC_CSV_VALLAS ? '✓ Configurada' : '✗ No configurada',
      jugadores: process.env.NEXT_PUBLIC_CSV_JUGADORES ? '✓ Configurada' : '✗ No configurada',
      playoffs: process.env.NEXT_PUBLIC_CSV_PLAYOFFS ? '✓ Configurada' : '✗ No configurada',
      resultadosPlayoffs: process.env.NEXT_PUBLIC_CSV_RESULTADOS_PLAYOFFS ? '✓ Configurada' : '✗ No configurada',
    };

    console.log('🔍 Variables de entorno:', envVars);

    const data = await getData();

    console.log('📊 Datos cargados:', {
      equipos: data.equipos.length,
      partidos: data.partidos.length,
      resultados: data.resultados.length,
      goleadores: data.goleadores.length,
      vallas: data.vallas.length,
      jugadores: data.jugadores.length,
      partidosPlayoff: data.partidosPlayoff?.length || 0,
      resultadosPlayoff: data.resultadosPlayoff?.length || 0,
    });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
      },
    });
  } catch (error) {
    console.error('❌ Error en API /api/data:', error);
    
    return NextResponse.json(
      {
        error: 'Error al cargar los datos',
        message: error instanceof Error ? error.message : 'Error desconocido',
        equipos: [],
        partidos: [],
        resultados: [],
        goleadores: [],
        vallas: [],
        jugadores: [],
        partidosPlayoff: [],
        resultadosPlayoff: [],
      },
      { status: 500 }
    );
  }
}

