# HANDOFF — mecvinagre (Claudio el Mecánico #4 · serie "El auto de Doña Elena" ep. 4: el lavado del sistema de enfriamiento con vinagre)
Estado: ✅ ENTREGADO 8-oct (job 804, tarjeta plan-own-1791434693203-3 del row 311 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/mecvinagre/mecvinagre.mp4?v=1 (15:28, 27.844 cuadros, sha256 f44f5e57…) · local D:/videosdeclaude/mecvinagre_entrega.mp4.
Auditor: min1 35 cortes / 0 silencios · negro 0 · congelados 0 · -14,0 LUFS / TP -1,8. Farm 40 tramos fijos (FARM_FIXED_CHUNKS=1 + FARM_REF) + encfin 40.
Rama `mecvinagre-render`, sale de `mecmillon-render` (cadena: `git show mec99-render:HANDOFF.md`, `mecllave-render`, `mecmillon-render`).
Worktree en DESKTOP-CRNK37J: `D:/rtmp/wt-mecvinagre`. Hecho EN PARALELO con mecbebe (#5) y mecaceite (#6) desde la misma base.

## Qué cambia respecto de mecmillon
- Guion `guiones/mecvinagre_filmado.txt` 13.704 car (tú neutro) · Truco 4 de fixes.json = pág. 12. Paga el gancho del ep. 3 (la aguja que
  subió en el tráfico, el presupuesto del radiador en la carpeta, el frasco de la cocina). Loop del minuto 1: "lo que alguien le hizo al auto
  hace años" = el sobrino que le ponía agua de la manguera (pago ~5:15, con la libreta de Don Ernesto: refrigerante verde cada 2 años).
  Gancho al ep. 5: la nieta le pasó aceite de bebé a todo (faros, tablero, volante, pedales) + "lo que pasó cuando Elena pisó el freno".
- Kit NUEVO en su propio archivo `src/claudio/ClMec_mecvinagre.tsx` (no en ClMecanico.tsx, para no chocar con las otras ramas):
  ClRadiator3D (clean/scale/flush, three.js) · ClTempGauge (traffic/fixed/red) · ClBubbleTest (normal/gasket/crust) · ClMixJug (mix 1:4/timer)
  · ClHotCap (tapa en caliente). Piezas comunes en `src/claudio/ClMecParts.tsx` (Tag/Note/Cam/HandCircle/Dial; copia IDÉNTICA en las 3 ramas).
  ClLogbook ahora acepta `rows`, `elena` (líneas propias de Elena), `tag`, `note` (parche idéntico en las 3 ramas).
  Registrados en ClMain (import + COMP), BEDABLE (línea propia `for (const n of [...]) BEDABLE.add(n)`), sound.mjs (bloque propio). CMAX = 9 default.
  Banco de stills `src/index_mekit_mecvinagre.tsx` (31) mirado a ojo, re-hechos 9 tras ajustar.
- `vlog/claudio/fix_wordms.py` NUEVO: reparte las palabras que Whisper (Modal, máster entero) se saltea y align deja aplastadas (≥4 palabras
  <70 ms tras una palabra estirada o un hueco). Verificar antes que el hueco tenga voz (silencedetect / compuerta por bloque).

## Números
- Voz claudio_definitiva 17 bloques, 14,80 car/s → 930,2 s crudo → 927,2 s. Alineación 0,989.
- Timeline 308 tomas · 27.844 cuadros (15:28) · minuto 1: 35 cortes, toma máx 3,0 s · cara de Claudio a los 0,95 s.
- Avatar 72 ventanas, reel 243,6 s, US$0,25 (1 /run, salió al 1º), lag -0,10..0 · avatar 24,5 % · real 26,4 % (stock 12,8 + camas 13,6) · agnes 0 %.
- Imágenes: 2 con cara gpt-image-2 low Batch + 186 SIN cara en agnes-image (regla del creador 8-oct, la desvía openai_batch solo); 20 rehechas a ojo.
- Stock: 6 rondas, ~40 rechazados a ojo + duplicados entre los 3 videos por md5. Sonido 273 efectos, 130 ambientes, -14,0 LUFS / TP -1,8, sin música.
- Manual: mención 1 ~4:29 (la frase del mostrador, ClBookPage pág. 12) · 2 ~8:46 (ClBookPage pág. 12) · 3 ~14:13 (QR /r + US$27).

## Gotchas nuevos (los 3 videos en paralelo)
- ⛔⛔ OpenAI: la clave del .env quedó en `429 credit_balance_exhausted` a media tarde (las otras 2 de la PC: 401 desactivadas). El creador cargó
  crédito y volvió. Y desde el 8-oct las imágenes SIN cara van a agnes-image GRATIS (regla obligatoria): gpt sólo para las de Claudio.
- ⛔⛔ farm.mjs SIN `FARM_REF=<slug>-render` dispara el workflow sobre `main`: el runner no tiene el entry y Remotion toma la ruta como ID
  ("Could not find composition with ID src/index_<slug>.tsx · Available: Vslcurso"). Siempre `FARM_REF=<slug>-render`.
- ⛔⛔ agnes 2.5-flash con 3 videos a la vez: la cola GLOBAL del servidor llena ("cola llena (global)" en `agnes_pool stats`) → ~1 envío cada
  20 min para toda la PC. 27 kf eran horas: este video salió con los 9 kf como foto (aceptados en _v3/<slug>_aceptados.json).
- ⛔ Stock en paralelo: los 3 `_used.json` no se ven entre sí → mismos clips en 2-3 videos (24 duplicados). Cruzar los _used al empezar y
  deduplicar por md5 del mp4 conformado antes del farm (se queda el episodio anterior).
- ⛔ Agnes-image (sin ref) pone logos de Toyota/Hyundai/Ford en las parrillas y números inventados en tableros/papeles: pedir "plain grille
  without any emblem", "marked only with C and H, no numbers", "tiny gray lines too small to read".
- Al recortar para meter el guion en 15:30 se borró el error "cuatro" y la voz decía "Uno, Dos, Tres, Y cinco": se regeneró sólo ese bloque
  ANTES del timeline (barato). Releer la numeración después de cada recorte.
- Para regenerar un bloque: si su largo cambia, verificar que el split de los bloques SIGUIENTES no se corra (comparar contra el _voz.txt de git).
