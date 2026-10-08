# HANDOFF — jpcasa (Claudio en Japón #4 · "Lo que aprendí en Tokio": 11 cosas que hacen que tu casa huela a viejo)
Estado: ✅ ENTREGADO 8-oct (job 788, tarjeta plan-own-1791387497512-3 del row 307 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/jpcasa/jpcasa.mp4 (15:19, 27.574 cuadros, final con encfin).

- Cadena = jphigiene → jpviejo → jpgasto → jpcasa. Rama jpcasa-render = base del video 5 (jpagua, ya anticipado: el frasco marrón
  que en Japón está en la cocina). Guiones de jpagua y jpbano ya redactados en D:/rtmp/jpagua_work y D:/rtmp/jpbano_work.
- Las 11: cortinas · alfombras (mención 1, pág. 12, mostrador) · almohadas y cojines · colchón · alfombrita del baño · toallas (mención 2
  ClBookPage pág. 12) · 7 = la lavadora (ClWasher3D peel/cycle/ajar) · zapatos · basurero · cajón de las verduras · clóset (ClClosetAir,
  ClWardrobeGap, ClCrossVent). Loop: Sato-san le pone la punta de la cortina en la cara → se paga en NEXT ("el olor vive en lo que no se lava").
- Voz 895 s (16/16 al 1er intento) + 11 respiros · minuto 1: 33 cortes, 0 silencios · avatar 40 ventanas 167 s US$0,25 ·
  real 28,7 % · agnes 16/19 (3 → foto) · -14 LUFS TP -1,8 · gpt 153 imgs low Batch.

## Gotchas
- Modal se comió "Número dos: las alfombras" → patch_asr.py 157:9.
- Minuto 1 salió con 27 cortes: tomas a <0,9 s se caen (dos `at` en la misma frase) → repartir en frases distintas (dir_d).
- Metraje real 21,8 % en la 1ª pasada → sumar `q:` a ~20 tomas bi y 2ª pasada de stock.mjs (rechazados a ojo a public/broll/<slug>_st/_rech).
- agnes_qc mira public/broll por defecto: los kf viven en public/vid/<slug> → `QC_CLIPDIR=public/vid/<slug>`.
- kf rechazados 2 veces → _v3/<slug>_aceptados.json (repuesto aceptado) para que gen_timeline --final pase.
- gen_timeline pide public/<slug>.m4a (ffmpeg del wav).
