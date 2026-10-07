# HANDOFF — almoho (Claudio el Albañil #1 · serie "La casa de Doña Marta" ep. 1)
Estado: ✅ ENTREGADO 7-oct (job 768, tarjeta plan-own-1791387479663-0 del row 306 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/almoho/almoho.mp4?v=2 · local D:/videosdeclaude/almoho_entrega.mp4 (15:01, 27.026 cuadros).

## Cadena = vlog/claudio adaptada al ALBAÑIL (en ESTA rama almoho-render; videos 2-6 salen de acá)
- lib.mjs: WHO = remera naranja + cinta métrica; BATH/HOUSE = la casa de Doña Marta (paredes verde menta, piso de barro rojo, ventanas
  con rejas blancas, ropero oscuro); MARTA = ficha de texto de Doña Marta (pelo blanco corto, cárdigan lila, delantal). Sin "bottle label".
- avatar: ref generada `vlog/almoho/mk_ref.mjs` (claudio_hd + remera naranja, en el living de Doña Marta) → `public/ref_almoho.png`;
  cara `public/ref_almoho_face.png` = plan_red_claudio/face.png. Video N: copiar ambas como ref_<slug>*.png.
- Marca: ClTheme carbón de cemento + amarillo cinta métrica + naranja; ClChapter = cinta métrica (KeyTag); ClCheck "HOJA DE OBRA".
- Kit nuevo src/claudio/ClAlbanil.tsx: ClFoilTest (out/wall/dry/all) · ClHouseMap (plano de la casa: done/now/next) · ClWardrobeGap (0/5 cm) · ClTapeTest (clean/paint/salt).
  ClNotebook con `mark`; ClQRCard con `kicker`. Banco de stills: src/index_alkit.tsx.
- gen_timeline: kf = clip + su último cuadro (nunca más largo que el clip) → hacer `_last.jpg` de vid/ y broll/ agnes.
- stock.mjs: juez de "home repair". sound.mjs: ambiente por defecto amb_suburb_birds + foley de aluminio/cinta/ropero/rodillo.
- job.mjs/meta.mjs: row 306; meta = 1ª línea landing ?src=<slug> · 2ª regalo /gratis/?src=<slug>-desc · intro de chapters.json.
- FINAL EN EL FARM: `bash D:/Proyectos/encfin/push.sh <slug> <frames> 60` (rama huérfana encfin-<slug>; tramos en paralelo desde el release
  chunks-<slug> + `<slug>_mix.wav` subido a mano al release assets-<slug>) → release <slug>/<slug>.mp4. El render del farm con STITCH_RAW (default).
- Entrega: `MP4_SUFIJO="?v=N" node scripts/deliver_card.mjs https://www.youtube.com/channel/UC6SEoZl8HMxAMR1OTTqHcUQ <cardId> <slug> --no-youtube`.

## Números
- Voz claudio_definitiva 903,6 s crudo (16/16 bloques al 1er intento, 14,85 car/s) · 13.358 car → 15:01. Alineación 0,98.
- Minuto 1: 34 cortes · 0 silencios · cara en el seg 1,6. Negro 0 · congelados 0. Avatar 1 /run 41 ventanas 234 s US$0,25, lag -0,10..0.
- Metraje real 26,4 % (stock en toma 8,2 % + camas 18,2 %) · avatar 25 % · agnes 2,7 % (9/11 clips; bleachwipe/spray/painterbleach pintaban MÁS negro).
- Sonido: 233 efectos, 128 ambientes, -14,0 LUFS / TP -1,8, sin música. Imágenes gpt 118+2 low Batch.
- Manual: mención 1 a las ~2:58 (pág. 9, frase del mostrador) · 2 a las ~8:15 (ClBookPage pág. 9) · 3 a las 13:40 (QR regalo /r + Manual US$27).

## Gotchas
- encfin: con `-frames:v` el muxer cortó 10 s de audio → audio aparte + `-c copy -max_interleave_delta 0`. apt-get de ffmpeg se colgó en 12 de
  60 runners → ffmpeg estático de BtbN. check_entrega leía "15.03," como NaN (keyframes "cada 3 s" falsos) → parseFloat.
- ⛔ matar procesos por CommandLine '*farm.mjs almoho*' mata también los bash que esperan con ese texto: filtrar por Name node.exe.
- Libreta (ClNotebook) traía "blanco ✓" fijo del conserje y filas largas que se pisaban → filas cortas + mark.
- Stock: el juez aprobó playa/caño/teja/pareja/pesos/lluvia como moho/pared → hoja a ojo SIEMPRE (16 rechazados en 3 rondas).
- Libro: la frase del mostrador del Arreglo 1 dice "barbijo" (rioplatense); el video dice "mascarilla".
