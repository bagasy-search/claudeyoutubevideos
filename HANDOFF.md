# HANDOFF — fu30 (Claudio el Fumigador #2 · serie "La casa de los Ramírez" ep. 2: la barrera de la puerta)
Estado: ✅ ENTREGADO 8-oct (job 786, tarjeta plan-own-1791387464226-1 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/fu30/fu30.mp4?v=1 (15:28, 27.850 cuadros). Auditor: min1 31 cortes / 0 silencios, negro 0, congelados 0.
 Rama `fu30-render`, sale de `fuagua-render` (misma cadena; ver su HANDOFF en git: `git show fuagua-render:HANDOFF.md`).

## Qué cambia respecto de fuagua
- Guion `guiones/fu30_filmado.txt` 13.516 car (tú neutro) · Arreglo 2 de fixes.json = pág. 10 del Manual (`public/img/fu30/page10.jpg` de book.pdf).
- Polaroid del ep. 1 (ClVideoRef th_fuagua, párr. 6) · gancho al ep. 3: bolitas negras + bolsa de croquetas mordida en el garaje → ratones (ClVideoRef th_furatas, `next`).
- Seguridad: hierbas en el marco ARRIBA (el laurel le cae mal al perro, ClBarrierLine "dog") + cebo de bórax en tapita cerrada (ClCheck) + el ácido bórico del ep. 1 (ClFridgeBack fixed).
- Kit nuevo `src/claudio/ClPuerta.tsx`: ClDoorGap (light/sealed: la rayita de luz de 1 cm y el burlete) · ClBarrierLine (line/herbs/dog) · ClPerimeter30 (bridges/clean).
  Registrados en ClMain, BEDABLE (gen_timeline), CMAX (timeline), sound.mjs, banco src/index_fukit.tsx.

## Números
- Voz 16/16 bloques al 1er intento, 931 s crudo → 927 s tras comprimir el gancho. Modal marcó 4 huecos: los 4 FALSOS (whisper-1).
- Minuto 1: 33 cortes, toma máx 3,06 s · Manual: mención 1 ~3:33 (frase del mostrador, pág. 10) · 2 ~8:38 (ClBookPage pág. 10) · 3 ~14:06 (QR /r + US$27).
- avatar 58 ventanas 272 s (1 /run) · real 26,5 % · agnes 7/10 (rechazados k_chalk mano que desaparece, k_droppings salto, k_pipe caño que muta → fotos; b_droppings regenerada).

## Gotchas
- ⛔ D: se llenó a 34 MB a mitad de imágenes + stock (ENOSPC). gptimg se REANUDA solo (estado de batches), stock salta lo hecho.
  Liberado: worktree fuagua (pusheado), temporales remotion/gh-artifact >2 h en D:/rtmp/tmp, crudos `_v3/fu30_stock/*.mp4`.
- ⛔ `D:/Proyectos/sfx_pro` PERDIÓ archivos (otra sesión poda): 14 efectos que usaba sound.mjs ya no existen → remapeados a los que sí
  (scrub_pad→scrub_floor, fizz_gentle→fizz_tablet_a, stamp_es→stamp_rubber, amb_suburb_backyard→amb_suburb_birds…). Antes del farm:
  `grep -o '"[a-z]*/[a-z_0-9]*\.flac"' vlog/claudio/sound.mjs | ... [ -f D:/Proyectos/sfx_pro/$f ]`.
- Stock: juez aprobó otras familias, otro perro, cucaracha de Madagascar → 28 a `_rech`; tomas con Lucía/Jorge/niños/Bruno bloqueadas antes (touch `_rech/<n>.mp4`).
- ⛔ encfin falla 'no assets match' si falta `out/<slug>_mix.wav` en el release assets-<slug>: `gh release upload assets-<slug> out/<slug>_mix.wav` y `gh run rerun`.
- ⛔ push.sh de encfin usa /tmp (= D:/rtmp/tmp): con D lleno, `TMPDIR=C:/Users/bauti/AppData/Local/Temp/encfin`.
- Congelado 6 s (stock de mosquito quieto) en 12:35 → st_mosquito a foto en timeline.gen.ts + ONLY_CHUNKS=48 (la foto ya estaba en el tar) + encfin de nuevo.
- ⛔ El canal 305 ya NO es `draft:claudiofumigador`: deliver_card con `https://www.youtube.com/channel/UCQZUY5cP_86-mYvG6FxqS8g`.
