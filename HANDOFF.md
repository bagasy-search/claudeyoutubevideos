# HANDOFF — mecmillon (Claudio el Mecánico #3 · serie "El auto de Doña Elena" ep. 3: la PCV de 5 dólares y los hábitos del motor de 1 millón)
Estado: ✅ ENTREGADO 8-oct (job 800, tarjeta plan-own-1791434693203-2 del row 311 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/mecmillon/mecmillon.mp4?v=1 (15:24, 27.718 cuadros, sha256 8d9c0b08…) · local D:/videosdeclaude/mecmillon_entrega.mp4.
Auditor: min1 33 cortes / 0 silencios · negro 0 · congelados 0 · -14,0 LUFS / TP -1,7. Farm 60 tramos fijos (FARM_FIXED_CHUNKS=1) + encfin 60.
Rama `mecmillon-render`, sale de `mecllave-render` (cadena: `git show mec99-render:HANDOFF.md` y `git show mecllave-render:HANDOFF.md`).
Worktree en DESKTOP-CRNK37J: `D:/rtmp/wt-mecmillon`. El video 4 (`mecvinagre`) sale de ESTA rama.

## Qué cambia respecto de mecllave
- Guion `guiones/mecmillon_filmado.txt` 13.715 car (tú neutro) · Truco 3 de fixes.json = pág. 11 (`public/img/mecmillon/page11.jpg`).
  Polaroid del ep. 2 (ClVideoRef th_mecllave) · loop del minuto 1: "lo que Don Ernesto dejó en la guantera" = la libreta azul (pago ~9:40,
  capítulo 5) · gancho al ep. 4: la aguja de temperatura que sube en el tráfico + el presupuesto del radiador + "un frasco de la cocina"
  (ClVideoRef th_mecvinagre, `next`).
- Kit nuevo (en `src/claudio/ClMecanico.tsx`): ClPCV3D (intro/rattle/stuck, three.js en corte) · ClEnginePressure (flow/blocked/leak + manómetro) ·
  ClSevereChart (table/trips) · ClColdStart (wait/gentle) · ClFilterLight (check/compare) · ClLogbook (ernesto/last/gap/new/two/consume).
  Registrados en ClMain, BEDABLE, CMAX (9), sound.mjs; banco `src/index_mekit3.tsx` (27 stills).
- `ClLogbook` es la libreta de Don Ernesto: sirve para los próximos episodios (Elena sigue anotando: `two`).

## Números
- Voz claudio_definitiva 17 bloques al 1er intento (14,87 car/s) → 926 s crudo (se recortó 1 frase del cierre y se regeneró sólo b016) → 923 s. Alineación 0,98.
- Timeline 291 tomas · 27.718 cuadros (15:24) · minuto 1: 33 cortes, toma máx 4,02 s.
- Avatar 62 ventanas, reel 226,6 s, US$0,25 (salió al 1er /run), lag -0,10..0 · avatar 23,0 % · real 27,3 % (stock 11,1 + camas 16,2) · agnes 5/9 (1,2 %).
- Imágenes gpt 188 low Batch 1088x608 (0 rebotes) · stock 88/109 → 9 rechazados a ojo · sonido 277 efectos, 86 ambientes, -14,0 LUFS / TP -1,8.
- Manual: mención 1 ~4:06 (la lista para la refaccionaria, ClBookPage pág. 11) · 2 ~6:41 (ClBookPage pág. 11, las medidas) · 3 ~14:11 (QR /r + US$27).

## Gotchas nuevos
- ⛔ Insertos de ritmo (`dir_e`) que caen a <1,6 s de otra toma (o de una vuelta a cámara) TIRAN la toma vecina ("toma caída por corta"):
  se cayeron ClColorCode, k_pcvout/k_pcvin y k_highlight hasta sacar los que chocaban. Leer SIEMPRE la lista de caídas del timeline.
- ⛔ El avatar se pasa de 30 % si se meten muchas vueltas a cámara y después se cortan con insertos: ajustar al final, contando sólo av.
- La voz salió más lenta (14,87) que en los eps. 1-2 (15,06-15,13): medir siempre y recortar en el ÚLTIMO bloque para regenerar uno solo.
- agnes rechazados: la gota que se vuelve pozo, la aguja que llega al rojo (el guion decía "no hasta el rojo"), brazo de más, cable que se estira.
- Este tema (motor, aceite, filtros, taller) da mucho stock: 27 % sin camas extra. El de la llave (ep. 2) no.
- deliver_card con `https://www.youtube.com/channel/UCxZoTTzrSfghZupXsDIQbfg` (el row 311 ya no es draft:).
