# 🔧 Solución: Datos no aparecen en Vercel (Actualizado)

## 🎯 Problema Resuelto

El código anterior intentaba usar `fetch` con `next: { revalidate }` en Client Components, lo cual no funciona. Ahora se ha creado una API route que se ejecuta en el servidor donde sí funciona correctamente.

## ✅ Cambios Realizados

1. **Creada API Route `/app/api/data/route.ts`**
   - Se ejecuta en el servidor donde `next: { revalidate }` funciona correctamente
   - Revalida los datos cada 2 minutos
   - Incluye logging detallado para debug

2. **Actualizado `src/lib/csv.ts`**
   - Detecta si está en servidor o cliente
   - Usa `next: { revalidate }` solo en servidor
   - Usa `cache: 'no-store'` en cliente

3. **Actualizadas todas las páginas**
   - `app/page.tsx`
   - `app/tabla/page.tsx`
   - `app/estadisticas/page.tsx`
   - `app/fixture/page.tsx`
   - `app/equipos/page.tsx`
   
   Todas ahora llaman a `/api/data` en lugar de `getData()` directo.

## 📋 Pasos para Solucionar en Vercel

### Paso 1: Verificar Variables de Entorno en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Selecciona tu proyecto
3. Ve a **Settings** (Configuración)
4. Haz clic en **Environment Variables** (Variables de Entorno)
5. Verifica que tengas estas variables configuradas:

```
NEXT_PUBLIC_CSV_EQUIPOS
NEXT_PUBLIC_CSV_PARTIDOS
NEXT_PUBLIC_CSV_RESULTADOS
NEXT_PUBLIC_CSV_GOLEADORES
NEXT_PUBLIC_CSV_VALLAS
NEXT_PUBLIC_CSV_JUGADORES
```

**Formato de cada URL:**
```
https://docs.google.com/spreadsheets/d/TU_SHEET_ID/export?gid=TU_GID&format=csv
```

### Paso 2: Verificar que los Google Sheets sean Públicos

**IMPORTANTE:** Los Google Sheets deben ser públicos:

1. Abre tu Google Sheet
2. Haz clic en **"Compartir"** (botón azul arriba a la derecha)
3. En "Obtener enlace", selecciona **"Cualquiera con el enlace"**
4. Asegúrate de que el permiso sea **"Lector"** (no "Editor")
5. Guarda los cambios

### Paso 3: Redesplegar en Vercel

Después de verificar las variables de entorno:

1. Ve a la pestaña **Deployments** en Vercel
2. Haz clic en los **3 puntos** del último deployment
3. Selecciona **"Redeploy"**
4. O simplemente haz un nuevo commit y push (Vercel desplegará automáticamente)

## 🔍 Verificar que Funciona

### En la Consola del Navegador (F12)

Después de desplegar, abre la consola del navegador y busca estos mensajes:

### ✅ Si está bien configurado:
```
📊 Datos cargados desde API: { equipos: 5, partidos: 10, ... }
```

### ❌ Si hay problemas:
```
❌ Error loading data: Error HTTP: 500
```

### En los Logs de Vercel

1. Ve a **Deployments** en Vercel
2. Selecciona el deployment más reciente
3. Haz clic en **"View Function Logs"**
4. Busca estos mensajes:

### ✅ Si está bien:
```
🔍 Variables de entorno: { equipos: "✓ Configurada", ... }
📊 Datos cargados: { equipos: 5, partidos: 10, ... }
```

### ❌ Si hay problemas:
```
✗ No configurada  (indica que falta una variable de entorno)
❌ Error en API /api/data: ...
```

## 🚨 Problemas Comunes y Soluciones

### Error 403 (Forbidden)
- **Causa:** El Google Sheet no es público
- **Solución:** Haz el Sheet público (Paso 2 arriba)

### Variables no configuradas
- **Causa:** Las variables no están en Vercel o están mal escritas
- **Solución:** 
  1. Verifica que todas las variables estén en Vercel
  2. Verifica que los nombres sean exactos (case-sensitive)
  3. Verifica que las URLs estén completas y correctas

### URLs incorrectas
- **Causa:** La URL del CSV está mal formada
- **Solución:** Verifica que la URL tenga el formato correcto:
  ```
  https://docs.google.com/spreadsheets/d/SHEET_ID/export?gid=GID&format=csv
  ```

### GID incorrecto
- **Causa:** El `gid` en la URL no corresponde a la pestaña correcta
- **Solución:** 
  1. Haz clic en la pestaña en Google Sheets
  2. Mira la URL del navegador: `.../edit#gid=123456789`
  3. Usa ese número en la URL del CSV: `&gid=123456789`

### Datos en 0
- **Causa:** Las variables están configuradas pero las URLs no funcionan
- **Solución:**
  1. Abre cada URL del CSV directamente en el navegador
  2. Deberías ver el contenido CSV, no un error
  3. Si ves un error 403, el Sheet no es público
  4. Si ves un error 404, la URL está mal formada

## 📝 Checklist Final

- [ ] Variables de entorno agregadas en Vercel (todas las 6)
- [ ] URLs de CSV correctas y completas
- [ ] Google Sheets configurados como públicos
- [ ] Permisos de "Cualquiera con el enlace" como "Lector"
- [ ] Proyecto redesplegado en Vercel
- [ ] Consola del navegador revisada (sin errores)
- [ ] Logs de Vercel revisados (variables configuradas)
- [ ] URLs de CSV probadas directamente en el navegador

## 🆘 Si aún no funciona

1. **Abre la consola del navegador** (F12) y copia todos los mensajes de error
2. **Verifica las URLs directamente:** Abre cada URL del CSV en el navegador para ver si descarga el CSV
3. **Revisa los logs de Vercel:** Ve a Deployments > selecciona el deployment > View Function Logs
4. **Verifica el formato de las URLs:** Deben ser exactamente:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/export?gid=[GID]&format=csv
   ```

## 💡 Notas Técnicas

- La API route se ejecuta en el servidor, por lo que tiene acceso a las variables de entorno
- Los datos se revalidan cada 2 minutos automáticamente
- El cache se maneja en el servidor, mejorando el rendimiento
- Los errores ahora se registran tanto en el cliente como en el servidor para facilitar el debug

