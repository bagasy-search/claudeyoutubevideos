# Fuentes y recursos — Hook "7 Construcciones Antiguas Que Hoy Serían Imposibles de Hacer"

## Narración
- Voz generada 100% con **Qwen3-TTS** (modo VoiceDesign, español neutro) en local. Sin voz humana grabada.
- Guion original propio: `e7h_guion.txt` · instrucción de voz: `e7h_instruct.txt`
- Mezcla final: `public/e7h_mix.wav` (VO + música + drone + SFX, ducking sidechain, −14.3 LUFS)

## Imagen fija — hero de apertura (la piedra de 1.000 toneladas)
- **"Baalbek – largest stone"** (La Piedra de la Embarazada, Líbano) — autor *Ralph Ellis*,
  **CC BY-SA 4.0**, Wikimedia Commons.
  https://commons.wikimedia.org/wiki/File:Baalbek-_largest_stone.jpg
- Detalle de juntas poligonales (muro): Pexels · Marco Alhelm ·
  https://www.pexels.com/photo/gray-tiles-on-vintage-wall-26985152/

## B-roll en video (todos Pexels, licencia Pexels — uso libre con atribución cortés)
- Cantera / bloque (drone) — David Pickup — https://www.pexels.com/video/drone-flight-of-a-stone-quarry-27290037/
- Muro inca / Machu Picchu — Florian Delée — https://www.pexels.com/video/walking-ruins-museum-finding-17636430/
- Terrazas Machu Picchu (aéreo) — Florian Delée — https://www.pexels.com/video/exploring-the-ancient-terraces-of-machu-picchu-29837360/
- Pirámides de Guiza (aéreo) — Blanka OG — https://www.pexels.com/video/aerial-view-on-cairo-and-pyramids-10719817/
- Pirámide (paneo) — Rafael Castro — https://www.pexels.com/video/a-panning-shot-of-pyramids-4174119/
- Grúa torre moderna — max laurell — https://www.pexels.com/video/close-up-video-of-a-tower-crane-6475920/
- Ruinas romanas Jerash (aéreo) — Mahmut Yılmaz — https://www.pexels.com/video/ancient-roman-ruins-aerial-view-in-jerash-35256076/
- Ruinas del desierto (aéreo) — Samir Smier — https://www.pexels.com/video/breathtaking-aerial-view-of-ancient-ruins-30546581/
- Muro de piedra (textura) — Адам Аушев — https://www.pexels.com/video/a-close-up-of-a-stone-wall-with-some-holes-in-it-28222218/
- Cielo estrellado (timelapse) — Alex Moliski — https://www.pexels.com/video/stunning-timelapse-of-starry-night-sky-37526465/
- Ruinas al atardecer (silueta) — Ahmed — https://www.pexels.com/video/exploring-ancient-ruins-at-sunset-35686423/
- Tallado en piedra — Engin Altundağ — https://www.pexels.com/video/stone-carving-4457895/

## Música y diseño sonoro
- Cama musical cinematográfica + drone de tensión: biblioteca de sonido del proyecto (`public/sfx/`, `cp_music.wav`, `rumble_const.mp3`).
- SFX (impactos, whooshes, riser): biblioteca del proyecto (`public/sfx/`).

## Tipografía
- **Anton**, **Oswald**, **Inter** — Google Fonts (SIL Open Font License).

## Datos citados (verificados)
- Piedra de la Embarazada, Baalbek: ~1.000 toneladas, 20,76 m de largo (Wikipedia "Baalbek Stones").
- Muros incas: juntas sin argamasa donde no entra una hoja de cuchillo (mampostería poligonal).
- Gran Pirámide de Guiza: base de ~230 m de lado, nivelada con un desnivel máximo de ~2,1 cm
  en toda su extensión. En pantalla se cita "230 m de lado" (no "13 ha", que confundía área con lado).
- **Comparación de la grúa (rehecha en v2):** la versión anterior comparaba la piedra (1.000 t) con
  "la grúa móvil más grande" (1.200 t) — la barra de la grúa salía MÁS LARGA y contradecía la
  narración ("no podríamos ni levantarla"). Se reemplazó por la referencia honesta y verificable:
  una **grúa torre de obra** (la que se ve en el b-roll) mueve típicamente **12–20 t**; se usa 16 t
  como valor medio → 1.000 / 16 ≈ **62×**. Sin afirmar récords mundiales.

## Stills del montaje final (extraídos con ffmpeg del propio material ya licenciado)
`public/img/e7h_f1..f7.jpg` (+ sus `_blur.jpg`) — cuadros congelados de los clips/imágenes de arriba,
usados en el flash de los 7. Etiquetas en pantalla: Baalbek · Líbano · Machu Picchu · Perú ·
Guiza · Egipto · Jerash · Jordania · Muro inca · Perú · "Bloques de una pirámide" (sin atribuir
localización porque la fuente no la especifica) · "Ruinas del desierto".

## Archivos del proyecto (editable)
- Composición Remotion: `src/VideoEdit/Main_e7h.tsx` (comp id **E7h**, 1959 frames / 65,3 s, 30fps, 1080p)
- Entry: `src/index_e7h.tsx` · registrada también en `src/Root.tsx`
- Guion/instrucción TTS: `e7h_guion.txt` / `e7h_instruct.txt`
- Mezcla: `mix_e7h.mjs` → `public/e7h_mix.wav`
- Assets del render: `_e7h_assets.txt`
- Render final: `D:\videosdeclaude\e7h.mp4`
