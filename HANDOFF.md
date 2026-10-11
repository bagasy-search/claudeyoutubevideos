# HANDOFF · rhmusty (Rhonda #7) — ENTREGADO 11-oct-2026

**Your House Smells Musty Even After You Clean — Find the Source in 5 Minutes**
- mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/rhmusty/rhmusty.mp4 (623 MB)
- Bagasy: row 302, tarjeta plan-own-1791246085234-6, video_jobs 887 (deliver_card --no-youtube; NO subido a YouTube)
- Rama rhmusty-render (sale de rhgrout-render)

## Números
| | |
|---|---|
| duración | 15:29 (928,8 s · 27 863 cuadros) |
| minuto 1 | cara en 0,8 s · promesa con números ~4,5 s (RhPromise "6 places / 5 minutes / 1 flashlight…") · antes/después (RhWipeReveal) ~30 s · 48 cortes (scene>0,18) · 41 (scene>0,3, audit) |
| silencios ≥0,3 s en minuto 1 | 0 (audit sobre el máster) |
| congelados ≥1 s | 0 |
| metraje real | 25,7 % (stock en toma 11,2 % + camas bajo tarjetas 14,5 %) |
| avatar | 23,4 % · RunPod 1 /run · lag mediana 0,00 s |
| sonido | voz + audio real de 30 clips · sin música/ambiente/sfx · −14,2 LUFS · TP −1,8 |
| entrega | encfin en el farm · check_entrega 6/6 |
| costo | avatar US$0,25 + gpt-image low Batch US$0,06 + ASR Modal ~US$0,02 = **~US$0,33** |

## Componentes nuevos (src/rhonda/RhMusty.tsx)
RhHousePlan3D (3D: plano de la casa con los 6 lugares), RhNoseMeter, RhDrainTrap (sifón seco/lleno/aceite), RhFridgeGrille, RhHygrometer.

## Gotchas
- 30 kf quedaron como foto con movimiento (cola de agnes ~15 clips/h para todo el pool); 10 clips rechazados a ojo.
- RhWetMap (componente de rhmold) exige `img` → sin ella cayó el chunk 52; se reemplazó por RhHygrometer y se rehízo SÓLO ese chunk (ONLY_CHUNKS=52) + encfin.
- RhQuoteStamp mostraba "Grind out & regrout" (líneas fijas de rhgrout) → prop `job` + `lines`.
- Los kf no estaban en el registro de agnes_qc (kf e i2v se pisan el json) → `_v3/rhmusty_i2v_kf.json`.
