# HANDOFF — jpbano (Claudio en Japón #6 · "Lo que aprendí en Tokio": 12 productos del baño que los japoneses reemplazaron)
Estado: ✅ ENTREGADO 8-oct (job 794, tarjeta plan-own-1791387497512-5 del row 307 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/jpbano/jpbano.mp4 (15:08, 27.241 cuadros, final con encfin).

- Cadena = … → jpcasa → jpagua → jpbano. Rama jpbano-render = base del video 7 (jpasco, ya anticipado: los 11 hábitos del baño que a un
  japonés le dan asco, "tirar la cadena con la tapa abierta"; polaroid th_jpasco.jpg ya en public/img/jpbano).
- Sin marcas ni salud: el molde (dJeTfT5V_zQ) ataca marcas y habla de hormonas/PFAS → se reescribió entero desde fixes.json: aromatizante de
  enchufe · pastillas del tanque (mención 1 pág. 14 + mostrador al final de la 2) · cortina de plástico · flor de baño · cepillo en su vasito ·
  aerosol para el moho (mención 2 ClBookPage pág. 14) · 7 = el cloro mezclado (ClNeverMix ×2, aviso "consulta a un médico") · toallitas ·
  botellas · afeitadora · papel perfumado · 12 = el baño que no se seca. Loop: los dos aerosoles → "es que nunca lo dejas secar".
- Voz 881 s (16/16 1er intento) + 12 respiros · minuto 1: 33 cortes · avatar 40 ventanas 204 s US$0,25 · real 25,5 % · agnes 16/19 · -14 LUFS.

## Gotchas
- Modal se comió "Número ocho…" y "Número nueve…" → patch_asr.py 527:10 572:10.
- Stock de baño: 27 rechazados a ojo (cuerpos en ducha/bañera, mano saliendo de la espuma, reloj dentro del inodoro, carteles, gente posando).
  Sembrar `q:` en ~30 tomas ANTES de la 1ª pasada ahorra pasadas.
- La miniatura (ClGridHook) se comía: el 1er `at` del párrafo 0 no puede ser la 1ª palabra (arranca en 0 y la grilla dura <1 s).
