# HANDOFF · rhgrout (Rhonda #6) — ENTREGADO 11-oct-2026

**Your Grout Isn't Worn Out — It's Dirty Down Deep (Skip the $1,200 Regrout)**
- mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/rhgrout/rhgrout.mp4 (678 MB)
- Bagasy: row 302, tarjeta plan-own-1791246085234-5, video_jobs 886 (deliver_card --no-youtube; NO subido a YouTube, done sin tic)
- Rama rhgrout-render (worktree D:/Proyectos/video2-wt/rhgrout)

## Números
| | |
|---|---|
| duración | 16:16 (976,4 s · 29 293 cuadros) |
| minuto 1 | cara en 0,8 s · promesa con números ~4,5 s · antes/después 33 s · 48 cortes (scene>0,18) · 38 (scene>0,3, audit) |
| silencios ≥0,3 s en minuto 1 | 0 (audit sobre el máster) |
| congelados | 1 de 1,1 s en 3:59 (fuera del minuto 1) |
| metraje real | 26,4 % (stock en toma 13,1 % + camas bajo tarjetas 13,3 %) |
| avatar | 18,6 % · RunPod 1 /run · lag mediana 0,00 s |
| sonido | voz + audio real de 50 clips · sin música/ambiente/sfx · −14,2 LUFS · TP −1,8 |
| entrega | encfin en el farm: yuv420p tv bt709, g=60, -bf 0 · check_entrega 6/6 |
| costo | avatar US$0,25 + gpt-image low Batch US$0,052 + ASR Modal ~US$0,02 = **~US$0,32** |

## Componentes nuevos (src/rhonda/RhGrout.tsx)
RhGroutJoint3D (3D: junta de lechada en corte), RhQuoteStamp (presupuesto tachado), RhFloorMap (mapa de zonas sucias), RhBrushCompare.

## Gotchas
- La cola de agnes rindió ~15 clips/h para TODO el pool → 15 kf quedaron como foto con movimiento (ACEPT en `_v3/rhgrout_aceptados.json`); 8 clips rechazados a ojo.
- gen_timeline: los punch-ins (`cofs`) contaban como "clip repetido" en la compuerta → arreglado (una toma continua). Y faltaba `_last.jpg` cuando cofs+dur > clip → 8 chunks caídos; arreglado.
- `draft:rhondacleans` NO es el channel_key para deliver_card: usar `https://www.youtube.com/channel/UCzaeGNv8JtxzV7eluTqQ4SA`.
- Dispersión de tomas del minuto 1 p75 ~1,7 s (debajo del ~2,6 objetivo Kit2).
