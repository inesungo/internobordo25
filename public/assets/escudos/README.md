# 🛡️ Escudos de Equipos

Coloca aquí los archivos de imagen de los escudos de cada equipo.

## 📋 Instrucciones

1. **Coloca los archivos de imagen aquí:**
   - Extensiones soportadas: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`
   - Tamaño recomendado: 200x200px
   - Formato recomendado: PNG con fondo transparente

2. **Nombra los archivos:**
   - Puedes usar cualquier nombre: `equipo1.png`, `tigres.jpg`, `los-tigres.png`, etc.

3. **En Google Sheets:**
   - En la columna `escudo_url`, pon solo el nombre del archivo (ej: `equipo1.png`)
   - El sistema construirá automáticamente la ruta: `/assets/escudos/equipo1.png`

## 📝 Ejemplo

- Archivo en esta carpeta: `tigres.png`
- En Google Sheets (columna `escudo_url`): `tigres.png`
- El sitio mostrará: `/assets/escudos/tigres.png`

## 🔍 Búsqueda Automática

Si no especificas `escudo_url` en Google Sheets, el sistema intentará buscar automáticamente un archivo basado en el nombre del equipo:
- Nombre del equipo: "Los Tigres"
- El sistema buscará: `los-tigres.png` (normalizado)

