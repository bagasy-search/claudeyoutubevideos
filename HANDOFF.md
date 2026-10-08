# HANDOFF — mecbebe (Claudio el Mecánico #5 · serie "El auto de Doña Elena" ep. 5: el aceite de bebé en el auto, dónde sí y dónde no)
Estado: ✅ ENTREGADO 8-oct (job 805, tarjeta plan-own-1791434693203-4 del row 311 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/mecbebe/mecbebe.mp4?v=1 (15:23, 27.698 cuadros, sha256 71c4d372…) · local D:/videosdeclaude/mecbebe_entrega.mp4.
Auditor: min1 34 cortes / 0 silencios · negro 0 · congelados 0 · -14,0 LUFS / TP -1,8. Farm 40 tramos fijos (FARM_FIXED_CHUNKS=1 + FARM_REF) + encfin 40.
Rama `mecbebe-render`, sale de `mecmillon-render` (en paralelo con mecvinagre y mecaceite; los gotchas comunes están en `git show mecvinagre-render:HANDOFF.md`).
Worktree en DESKTOP-CRNK37J: `D:/rtmp/wt-mecbebe`.

## Qué cambia respecto de mecmillon
- Guion `guiones/mecbebe_filmado.txt` 13.615 car (tú neutro) · Truco 5 de fixes.json = pág. 13. "13 trucos" = 7 usos donde SÍ (calcomanía de
  la agencia, savia, alquitrán, manos, placa y tornillos, herramientas del baúl, la prueba de la gota en el faro) + 6 donde NUNCA (pedales,
  volante y palanca + alfombrilla, tablero, gomas de puertas → silicona, parabrisas y escobillas, frenos y llantas). Lo honesto de fixes.json.
  Loop del minuto 1: el freno que resbaló (pago ~6:53: marcha atrás, medio metro del poste). Polaroid del ep. 4 · gancho al ep. 6: Elena
  ADELANTA el cambio de aceite antes de la playa en un lugar de 15 minutos → varilla muy arriba + gota en el tapón (continuidad: en el ep. 3
  ya se había cambiado el aceite, por eso "adelantar").
- Kit propio `src/claudio/ClMec_mecbebe.tsx`: ClOilMap13 (hoja con el sedán desde arriba y 13 pines verde/rojo: all/upto/n) · ClDropTest
  (surface/inside) · ClGrip (dry/oiled, +0,5 m) · ClSealSwell (oil/silicone, 0→12 meses) · ClGlare (oil/clean, el reflejo en el parabrisas).
  Banco `src/index_mekit_mecbebe.tsx` (25), ClGrip y ClDropTest rehechos tras mirar los stills.

## Números
- Voz claudio_definitiva 16 bloques (b015 regenerado 2 veces: continuidad + recorte para entrar en 15:30), 925,2 s → 922,5 s. Alineación 0,977
  (Whisper se comió 3 frases que Fish SÍ dijo: arreglado con fix_wordms.py; verificado por tiempos y por la compuerta por bloque).
- Timeline 288 tomas · 27.698 cuadros (15:23) · minuto 1: 34 cortes, toma máx 3,9 s · cara a los 1,76 s.
- Avatar 65 ventanas, reel 239,6 s, US$0,25 (1 /run), lag -0,10..0 · avatar 24,4 % · real 25,7 % (stock 11,7 + camas 14,1) · agnes 1/9 (0,5 %).
- Imágenes 3 con cara (gpt) + 174 sin cara (agnes-image), 15 rehechas a ojo · stock 5 rondas · sonido 270 efectos, 104 ambientes, -14,0 LUFS.
- Manual: mención 1 ~3:17 (la frase, ClBookPage pág. 13) · 2 ~6:37 (ClBookPage pág. 13, "la lista honesta") · 3 ~14:15 (QR /r + US$27).

## Gotchas nuevos
- La nieta no tiene nombre en el guion: no ponerle uno en la libreta ("— Elena y su nieta").
- agnes-image sin ref hizo a "la señora del pie en el freno" asiática y de blusa blanca: para planos de Elena sin cara, pedir SÓLO el pie/la mano.
- Stock del faro/pedales casi no existe en Pexels: el % real salió de camas + consultas de 2-3 palabras (q2 con STOCK_ALT=1).
