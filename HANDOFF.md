# HANDOFF — mecllave (Claudio el Mecánico #2 · serie "El auto de Doña Elena" ep. 2: la pila de la llave y las 7 funciones del control)
Estado: ✅ ENTREGADO 8-oct (job 796, tarjeta plan-own-1791434693203-1 del row 311 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/mecllave/mecllave.mp4?v=2 (15:09, 27.264 cuadros, sha256 8f8a9812…) · local D:/videosdeclaude/mecllave_entrega.mp4.
Auditor: min1 34 cortes / 0 silencios · negro 0 · congelados 0 · -14,0 LUFS / TP -1,8 · real 25,1 %.
Rama `mecllave-render`, sale de `mec99-render` (misma cadena: `git show mec99-render:HANDOFF.md`). Worktree en DESKTOP-CRNK37J: `D:/rtmp/wt-mecllave`.
mecmillon sale de ESTA rama.

## Qué cambia respecto de mec99
- Guion `guiones/mecllave_filmado.txt` 13.720 car (tú neutro) · Truco 2 de fixes.json = pág. 10 (`public/img/mecllave/page10.jpg`).
  Polaroid del ep. 1 (ClVideoRef th_mec99) · gancho al ep. 3: la mancha de aceite en la cochera tapada con un cartón + la válvula PCV
  (ClVideoRef th_mecmillon, `next`). Loop del minuto 1: el botón rojo que asustaba al estacionamiento (pago a las ~7:50).
- Kit nuevo (en `src/claudio/ClMecanico.tsx`): ClBatterySwap (id/plus/edges) · ClRangeMeter (now/compare/drop) · ClPanicWaves (alarm/find) ·
  ClDoorUnlock (once/twice) · ClProxStart (press/chip/key). ClKeyFob3D "battery" rehecho como almeja con bisagra (la pila sale a cámara).
  Registrados en ClMain, BEDABLE, CMAX (9), sound.mjs; banco `src/index_mekit2.tsx` (27 stills).
- `vlog/claudio/timeline.mjs` ahora lee también `dir_e.mjs` (tomas extra de ritmo).
- Avatar: misma ref (ref_mec99 → ref_mecllave).

## Números
- Voz claudio_definitiva 17 bloques (16 al 1er intento, b003 al 2º), 15,13 car/s, 911 s crudo → 908 s. Alineación 0,97 (números).
- Timeline 289 tomas · 27.264 cuadros (15:09) · minuto 1: 34 cortes, toma máx 3,66 s.
- Avatar 61 ventanas, reel 236,2 s, US$0,25 (1 FAILED 502 antes, no cobra), lag -0,10..0 · avatar 24,5 % · real 25,1 % (stock 8,4 + camas 16,7) · agnes 8/11 (2,7 %).
- Imágenes gpt 186+1 low Batch 1088x608 · stock: 4 rondas, 29 rechazados a ojo · sonido 319 efectos, 109 ambientes, -14,0 LUFS / TP -1,8.
- Manual: mención 1 ~3:49 (la frase de la pila, ClBookPage pág. 10) · 2 ~6:22 (ClBookPage pág. 10, paso por paso) · 3 ~13:47 (QR /r + US$27).

## Gotchas nuevos
- ⛔ Metraje real: este guion es de objetos chicos (control, pila) → el juez de Pexels no encuentra "key fob en manos de mecánico" ni
  "CR2032 en el banco" (influencer/showroom). Se llegó a 25 % con camas extra (sumar hasta que no quede componente sin cama: "camas X / Y")
  + consultas simples (q2 + STOCK_ALT=1: "car keys", "car dashboard", "coins table"). Medir ANTES del avatar no hace falta (no mueve ventanas).
- ⛔ Pexels trajo logos (VW, Toyota, Chevrolet, Texaco), un Arduino, un mensaje en inglés, una mesa de marmol por "cuchillo" → a ojo siempre.
- ⛔ `sfx_gate.py --prev <video anterior>` falla con autos (puerta, llave, motor se repiten por fuerza) y la vara del Albañil/Fumigador no lo
  usaba → se corre sin --prev (cortes del min 1 con efecto + 0 cuadros sin ambiente).
- gpt pintó "$400" en un presupuesto cuando el guion dice US$45 → toma sacada. Pedir papeles sin números legibles o revisar a ojo.
- agnes rechazados: el control que entra a una máquina, la llave que no sale, la puerta que se abre sola.
- node_modules del worktree = junction a `D:/rtmp/wt-mec99/node_modules` (ése sí completo, con su npm ci).
- ⛔⛔ El row 311 YA NO es `draft:claudiomecanico`: deliver_card con `https://www.youtube.com/channel/UCxZoTTzrSfghZupXsDIQbfg` (si no: "canal no encontrado").
- ⛔ farm.mjs AUTO-REPARTE los tramos si hay otro video en la cola (pedí 100, rindió 60) → encfin con el MISMO número que quedó en chunks-<slug>
  (contar assets del release) o forzar `FARM_FIXED_CHUNKS=1`. Con 100 encfin falló "no assets match chunk_60".
- ⛔ Cambiar stock DESPUÉS del farm = assets nuevos que no están en el tar → ONLY_CHUNKS da 404: render COMPLETO de nuevo (se hizo, 60 tramos).
  Se cambiaron b_coin (decía HANUKKAH) y b_clerk (oficinista) a foto, y entraron 3 stock nuevos para no bajar del 25 %.
