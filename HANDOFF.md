# HANDOFF — jphigiene (Claudio en Japón #1 · serie "Lo que aprendí en Tokio": 11 reglas de higiene)
Estado: ✅ ENTREGADO 8-oct (job 783, tarjeta plan-own-1791387497512-0 del row 307 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/jphigiene/jphigiene.mp4 (15:24, 27.717 cuadros, final en el farm con encfin).
Números: voz 899 s (16/16) + 11 respiros de 2,4 s · minuto 1: 33 cortes, 0 silencios · avatar 1 /run 48 ventanas 203,7 s US$0,25 (cara 26 %: avatar 21 + fotos 5) ·
metraje real 36,6 % · agnes 10/16 · -14 LUFS TP -1,7 · Método: mención 1 a 3:54 (pág. 9) · 2 a 7:33 (ClBookPage pág. 9) · 3 a 13:46 (QR /r + US$27).
Video 2 = jpviejo: worktree desde jphigiene-render; guion ya escrito en D:/rtmp/jpviejo_work/jpviejo_filmado.txt (12.568 car, Regla 2 = pág. 10).

## Cadena = la del Albañil (vlog/claudio) adaptada a JAPÓN en ESTA rama jphigiene-render (videos 2-3 salen de acá)
- lib.mjs: WHO = polo rojo liso; HOUSE/BATH = casa latina luminosa, madera clara; HOTEL (Tokio); SATO = ficha de Sato-san (jefa, ~50, rodete, anteojos, uniforme azul).
- avatar: `vlog/jphigiene/mk_ref.mjs` (claudio_hd + polo rojo, living blanco/madera clara) → `public/ref_jphigiene.png` (ref_b elegido) ·
  cara `public/ref_jphigiene_face.png` = plan_red_claudio/face.png. Video N: copiar ambas como ref_<slug>*.png.
- Marca (ClTheme): washi + tinta sumi + ROJO del polo #C8102E + madera clara + amarillo del titular de la miniatura.
- Kit nuevo `src/claudio/ClJapon.tsx`: ClGridHook (la miniatura cobra vida en el seg 0: x_thumbbg = raw/<slug>.png, tiles = raw/<slug>_t1..6.png) ·
  ClRule (número grande + 11 puntos + "faltan N", `star` = "LA QUE CASI TODOS ROMPEMOS") · ClSato (polaroid + frase) · ClNumbers (la regla en números) ·
  ClDryBars · ClBodyMap (4 lugares que la nariz no alcanza) · ClDays (ventana de 2 días). Banco de stills `src/index_jpkit.tsx`.
- `vlog/claudio/pausas.py`: mete 2,4 s de silencio antes de cada regla (R1..R11) en el wav y corre wordms/paras → ClRule arranca en el respiro (timeline: pre 2,3 s).
- `vlog/claudio/chk.py`: car, minuto de cada mención del Método, regionalismos/usted.
- timeline.mjs: "Sato-san" (guion con guion) se busca sin el guion. dir_d.mjs = entradas de avatar para llevar la cara a ~25 %.
- job.mjs/meta.mjs → row 307; meta: 1ª línea 🎁 /gratis/?src=<slug>-desc · 2ª /?src=<slug> (la regla gratis).
- Método: Regla N del canal = página 8+N (jphigiene 9, jpviejo 10, jpgasto 11).

## Gotchas
- Duración: con claudio_definitiva a 1.0 (14,75 car/s) 13.300 car = 15 min; + 11 respiros = 15:24. El brief pedía 18-20 min Y <13.500 car (imposibles juntos): se respetó el tope de car.
- Modal whisper se comió 3 frases que Fish sí dijo → whisper-1 (verbose_json, word timestamps) sobre esos tramos y parche de captions antes de align.
- gpt safety rechazó "espalda con espuma" y "pies en la ducha" → objetos/paredes en vez de cuerpos.
- Stock rechazado a ojo (9): Tokio con carteles, gente en ducha/toalla, ofuro sucio, letrero en pared.
- agnes v2.0 rechazados a ojo (6/16): persona que desaparece, camisa → pantalón, toalla → negra, mano extra, espuma rara en espalda.
- D: llegó a 1,4 GB libres (pagefile 45 GB): se borraron worktrees algotera/algrieta/alolor (entregados, HANDOFF en sus ramas) y crudos de stock.
- audit.py con la URL del release cuenta 0 cortes (el -t antes de -i no anda por http): medir sobre un tramo bajado → 33.
- farm baja el crudo a D:/videosdeclaude (360 MB): borrarlo (el final sale de encfin). Cada `remotion still` copia public/ (~800 MB) a D:/rtmp/tmp.
- pre-vuelo del farm pide public/med (copiar de video2/public/med).
