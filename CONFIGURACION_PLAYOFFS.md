# 🏆 Configuración de Playoffs

## 📋 Estructura de Datos en Google Sheets

Para que los playoffs funcionen correctamente, necesitas crear **dos nuevas hojas** en tu Google Sheets:

### 1. Hoja "Playoffs" (Partidos de Playoffs)

Esta hoja contiene todos los partidos de playoffs programados.

#### Columnas requeridas:

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `id` | Texto | ID único del partido | `p1`, `p2`, `p3` |
| `fecha` | Fecha | Fecha del partido (YYYY-MM-DD) | `2025-01-20` |
| `hora` | Texto | Hora del partido (HH:mm) | `16:00` |
| `cancha` | Texto | Nombre de la cancha (opcional) | `Cancha 1` |
| `local_id` | Texto | ID del equipo local | Debe coincidir con `id` en hoja Equipos |
| `visitante_id` | Texto | ID del equipo visitante | Debe coincidir con `id` en hoja Equipos |
| `categoria` | Texto | `Masculino` o `Femenino` | `Masculino` |
| `copa` | Texto | `Oro` o `Plata` | `Oro` |
| `ronda` | Texto | `Cuartos`, `Semis` o `Final` | `Cuartos` |
| `bracket_position` | Texto | Posición en el bracket | `Q1`, `Q2`, `Q3`, `Q4`, `SF1`, `SF2`, `F1` |

#### Ejemplo de datos:

```
id  | fecha      | hora  | cancha   | local_id | visitante_id | categoria | copa  | ronda  | bracket_position
----|------------|-------|----------|----------|--------------|-----------|-------|--------|------------------
p1  | 2025-01-20 | 16:00 | Cancha 1 | equipo1  | equipo2      | Masculino | Oro   | Cuartos| Q1
p2  | 2025-01-20 | 18:00 | Cancha 1 | equipo3  | equipo4      | Masculino | Oro   | Cuartos| Q2
p3  | 2025-01-21 | 16:00 | Cancha 1 | equipo5  | equipo6      | Masculino | Oro   | Cuartos| Q3
p4  | 2025-01-21 | 18:00 | Cancha 1 | equipo7  | equipo8      | Masculino | Oro   | Cuartos| Q4
p5  | 2025-01-25 | 16:00 | Cancha 1 | TBD      | TBD          | Masculino | Oro   | Semis  | SF1
p6  | 2025-01-25 | 18:00 | Cancha 1 | TBD      | TBD          | Masculino | Oro   | Semis  | SF2
p7  | 2025-01-27 | 16:00 | Cancha 1 | TBD      | TBD          | Masculino | Oro   | Final  | F1
```

**Notas importantes:**
- Los `local_id` y `visitante_id` deben coincidir exactamente con los `id` de la hoja de Equipos
- Para partidos futuros donde aún no se conocen los equipos, puedes usar `TBD` o dejar vacío
- `bracket_position` debe seguir este formato:
  - Cuartos: `Q1`, `Q2`, `Q3`, `Q4`
  - Semis: `SF1`, `SF2`
  - Final: `F1`

### 2. Hoja "Resultados Playoffs" (Resultados de Playoffs)

Esta hoja contiene los resultados de los partidos de playoffs.

#### Columnas requeridas:

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `partido_id` | Texto | ID del partido (debe coincidir con `id` en hoja Playoffs) | `p1` |
| `goles_local` | Número | Goles del equipo local | `2` |
| `goles_visitante` | Número | Goles del equipo visitante | `1` |
| `observaciones` | Texto | Observaciones adicionales (opcional) | `Partido suspendido` |

#### Ejemplo de datos:

```
partido_id | goles_local | goles_visitante | observaciones
-----------|-------------|-----------------|---------------
p1         | 2           | 1               |
p2         | 0           | 3               |
p3         | 1           | 1               | Prórroga
```

## 🔧 Configuración en Vercel

Una vez que tengas las hojas creadas en Google Sheets, necesitas agregar las siguientes variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega estas dos nuevas variables:

```
NEXT_PUBLIC_CSV_PLAYOFFS=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/export?gid=GID_PLAYOFFS&format=csv

NEXT_PUBLIC_CSV_RESULTADOS_PLAYOFFS=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/export?gid=GID_RESULTADOS&format=csv
```

**Para obtener las URLs:**
1. Abre tu Google Sheet
2. Haz clic derecho en la pestaña de la hoja (ej: "Playoffs")
3. Selecciona "Copiar enlace a esta hoja"
4. O mejor aún, ve a "Archivo" → "Publicar en la web"
5. Selecciona la hoja específica y formato CSV
6. Copia la URL que se genera

**Importante:** Las hojas deben ser públicas (cualquiera con el enlace puede verlas) para que funcionen.

## 📊 Estructura del Bracket

El sistema organiza automáticamente los partidos en un árbol visual:

```
Cuartos de Final          Semifinales              Final
─────────────────         ────────────            ──────
Q1: Equipo1 vs Equipo2 ──┐
                         ├─→ SF1: Ganador Q1 vs Ganador Q2 ──┐
Q2: Equipo3 vs Equipo4 ──┘                                      │
                                                                ├─→ F1: Ganador SF1 vs Ganador SF2
Q3: Equipo5 vs Equipo6 ──┐                                      │
                         ├─→ SF2: Ganador Q3 vs Ganador Q4 ──┘
Q4: Equipo7 vs Equipo8 ──┘
```

## 🎨 Visualización

La página de Playoffs muestra:
- **Copa de Oro** y **Copa de Plata** por separado
- Filtros por categoría (Masculino/Femenino)
- Vista de árbol en desktop con líneas conectando los partidos
- Vista lista en mobile/tablet
- Resultados destacados con el ganador en color secundario
- Fechas, horas y canchas de cada partido

## ✅ Checklist de Configuración

- [ ] Crear hoja "Playoffs" en Google Sheets con todas las columnas
- [ ] Crear hoja "Resultados Playoffs" en Google Sheets
- [ ] Hacer públicas ambas hojas
- [ ] Obtener las URLs de exportación CSV
- [ ] Agregar variables de entorno en Vercel
- [ ] Redesplegar la aplicación en Vercel
- [ ] Verificar que los datos se cargan correctamente en `/playoffs`

## 🐛 Solución de Problemas

**Los playoffs no aparecen:**
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que las hojas sean públicas
- Revisa la consola del navegador para ver errores
- Verifica que los `local_id` y `visitante_id` coincidan con los IDs de equipos

**Los equipos aparecen como "TBD":**
- Verifica que los IDs en la hoja Playoffs coincidan exactamente con los IDs en la hoja Equipos
- Revisa que no haya espacios extra en los IDs

**Los resultados no se muestran:**
- Verifica que el `partido_id` en Resultados Playoffs coincida con el `id` en Playoffs
- Asegúrate de que los números de goles sean números válidos

