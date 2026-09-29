# ⛳ COMPUERTA 3a — olstove: turno de render
- Rama `olstove-render`, commit `79869bb` (código, timeline generado, `_olstove_assets.txt` con 165 assets; los assets viajan por tarball del DISCO). tsc limpio (`tsconfig.olstove.json`).
- ENTRY `src/index_olstove.tsx`, comp `Olstove`, **TOTAL_FRAMES = 28.156** (938,5 s, 30 fps 1920x1080). Chunks propuestos: **190** (~148 cuadros c/u). Medido en local (angle, 2 hilos): 3D = 0,3-1 s/cuadro (pila de fuego 1 s/cuadro), 2D/foto ≈ 0,1 s → un chunk 3D peor caso ≈ 2,5 min. Prueba de chunk 3D ya hecha en local (cuadros 5600-5629, 1020-1049, 7000-7029 OK).
- Comando propuesto: `ENTRY=src/index_olstove.tsx FARM_REF=olstove-render node scripts/farm.mjs olstove Olstove 28156 190 os` + `bash vlog/olstove/entrega.sh <farm.mp4> D:/rtmp/olstove/olstove_final.mp4` + `python vlog/olstove/auditor.py`. Render COMPLETO (no ONLY_CHUNKS).
- Disco: C: y D: ~19 GB libres; el tarball pesa ~1,3 GB (165 assets).
- QC agnes: `agnes_qc olstove` = 27 clips v2.0 aprobados a ojo (sin pendientes ni rechazados) tras 2 rondas de --fix.

## Lo que YA está (medido sobre `_v3/olstove_shots.json`, 182 tomas)
| capa | s | % |
|---|---|---|
| avatar RunPod (1 /run, 36 ventanas, 241,9 s, lag máx 0,10 s, $0,25) | 187,9 | 20,0 % |
| stock Pexels REAL (36 clips elegidos con juez + hoja a ojo, créditos en vlog/olstove/CREDITOS_stock.txt) | 198,2 | 21,1 % |
| archivo REAL dominio público (NARA, LoC, NYPL, IA books; CREDITOS_archivo.txt) | 36,8 | 3,9 % |
| **REAL (stock+archivo) medido** | 235,0 | **25,1 %** |
| hablados de Ole (agnes 2.5) | 46,0 | 4,9 % (**filmado**; con ellos real = 30,0 %) |
| fotos gpt-image-2 + clips v2.0 (23 animadas) | 193,9 | 20,7 % |
| componentes propios | 263,3 | 28,1 % |
| Ole en escena (gpt /edits) | 12,0 | 1,3 % |
Minuto 1: 22 cortes, toma máx 4,04 s. QR verificado con cv2 sobre el png (`ole-camp-cookbook.vercel.app/?src=ole-olstove`); el del cuadro renderizado lo mido en el AUDITOR. Mezcla de prueba: −16,1 LUFS, pico −3,1 dBFS.

## Hablados agnes 2.5-flash (cola única): 10 encolados, **1 listo (m1)**, 9 pendientes (espera estimada ~0,8 h + lo que la cola tarde).
Los tramos sin clip caen AUTOMÁTICAMENTE al avatar (ya están dentro del reel): el video se puede renderizar hoy. Con el avatar de repuesto: avatar 24,9 %, real (st+ar) 25,1 %.
**Decisión que necesito:** (a) renderizar YA con los hablados de repuesto (por la fecha de octubre) y, si llegan, re-render COMPLETO; o (b) esperar a los 9 hablados (horas) y renderizar una sola vez.

## Componentes propios (`src/olstove/`)
3D real three.js (3): StvStove3D (estufa en corte: humo/aire/llama; bottom-up, top-down, dormido, lado a lado), StvFireStack3D (la pila cae capa por capa y prende arriba), StvCabinHeat3D (cabaña en corte, mapa de calor azul→cálido). 2D/SVG propios (6): StvMoistureMeter, StvDamperDial, StvCreosoteWarning, StvCordStack, StvChimneyDraft, StvSeasonCalendar. Copiados/adaptados de Ole: OleBookPage (p.36 y p.30 con zoom al truco), OleCTA (portada + QR), OleRuleCard, OleRecapCard, OleComments/OleNote/OleAsk. 45 usos de componentes en la línea de tiempo.

## Costos reales hasta ahora
RunPod US$0,25 · gpt-image-2 (anclas US$0,18 + 47 imágenes ≈ US$0,10) · whisper-1 ≈ US$0,10 · Fish, Pexels, agnes, Commons = US$0. Total ≈ US$0,65.
