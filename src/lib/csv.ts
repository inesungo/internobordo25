import Papa from 'papaparse';

/**
 * Fetch y parsea un CSV público desde Google Sheets
 * Usa ISR con revalidate de 120 segundos (2 minutos)
 */
export async function fetchCSV<T>(url: string): Promise<T[]> {
  if (!url) {
    return [];
  }

  try {
    // next: { revalidate } solo funciona en Server Components/API Routes
    // En Client Components, usamos fetch normal con cache
    const fetchOptions: RequestInit = typeof window === 'undefined' 
      ? { next: { revalidate: 120 } } // Servidor: usar ISR
      : { cache: 'no-store' }; // Cliente: no cachear (la API route maneja el cache)

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<T>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Normalizar nombres de columnas (quitar espacios, convertir a minúsculas)
          let normalized = header.trim().toLowerCase().replace(/\s+/g, '_');
          
          // Mapear variaciones de nombres de columnas
          const headerMap: Record<string, string> = {
            'ptos_ajustes_local': 'pts_ajuste_local',
            'ptos_ajustes_visitante': 'pts_ajuste_visitante',
            'ptos_ajuste_local': 'pts_ajuste_local',
            'ptos_ajuste_visitante': 'pts_ajuste_visitante',
            'grupo_1': 'grupo',
            'escudo_url': 'escudo_url',
            // Manejar variaciones comunes
            'grupo1': 'grupo',
            'grupo_': 'grupo',
            // Normalizar categoría
            'categoria': 'categoria',
            'categoría': 'categoria',
            'cat': 'categoria',
          };
          
          return headerMap[normalized] || normalized;
        },
        transform: (value, field) => {
          // Normalizar valores numéricos
          if (field === 'goles_local' || field === 'goles_visitante' || 
              field === 'goles' || field === 'goles_recibidos' ||
              field === 'pts_ajuste_local' || field === 'pts_ajuste_visitante' ||
              field === 'ptos_ajustes_local' || field === 'ptos_ajustes_visitante' ||
              field === 'ptos_ajuste_local' || field === 'ptos_ajuste_visitante') {
            const num = Number(value);
            return isNaN(num) ? 0 : num;
          }
          
          // Normalizar categoría
          if (field === 'categoria') {
            const cat = String(value || '').trim().toLowerCase();
            if (cat === 'masculino' || cat === 'm' || cat === 'masculina') return 'Masculino';
            if (cat === 'femenino' || cat === 'f' || cat === 'femenina') return 'Femenino';
            // Default a Masculino si no coincide
            return 'Masculino';
          }
          
          // Limpiar valores de texto
          if (typeof value === 'string') {
            return value.trim();
          }
          return value;
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing errors:', results.errors);
          }
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error(`Error fetching CSV from ${url}:`, error);
    return [];
  }
}


