# HANDOFF · rhmattress (Rhonda #8) — ENTREGADO 11-oct-2026

**Yellow Stains on Your Mattress Do Come Out — How a Cleaning Lady Does It**
- mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/rhmattress/rhmattress.mp4 (634 MB)
- Bagasy: row 302, tarjeta plan-own-1791246085234-7, video_jobs 888 (deliver_card --no-youtube; NO subido a YouTube)
- Rama rhmattress-render (sale de rhmusty-render) · libro pág. 16

## Números
| | |
|---|---|
| duración | 15:29 (929,4 s · 27 882 cuadros) |
| minuto 1 | cara en 0 s · antes/después (colchón mitad blanco/mitad amarillo) 2,7 s · promesa con números (RhPromise "1 cup peroxide / 3 tbsp…") 4,7 s · 45 cortes (scene>0,18) · 34 (scene>0,3, audit) |
| silencios ≥0,3 s en minuto 1 | 0 (audit sobre el máster) |
| congelados ≥1 s | 0 |
| metraje real | 26,3 % (stock en toma 12,8 % + camas bajo tarjetas 13,5 %) |
| avatar | 23,6 % · RunPod 1 /run (cuenta 2) · reel 233,7 s · lag mediana 0,00 s |
| sonido | voz + audio real de 13 clips · sin música/ambiente/sfx · −14,2 LUFS · TP −1,8 |
| entrega | encfin en el farm · check_entrega 6/6 |
| costo | avatar US$0,25 + gpt-image low Batch ~US$0,05 + ASR Modal ~US$0,02 = **~US$0,32** |

## Componentes nuevos (src/rhonda/RhMattress.tsx)
RhMattress3D (3D: corte del colchón funda/espuma/núcleo, la mancha baja), RhDampMeter, RhDryTimer, RhCornerTest, RhPressureBottle.

## Gotchas
- Reel del avatar daba 275 s (>240 = mosaico) → se taparon tramos con b-roll/RhCheck hasta 233,7 s. Un b-roll anclado al inicio de párrafo se comía el RhChapter → anclar más adentro.
- El juez de stock tiraba a baños: picks a ojo con STOCK_ALT=1 + STOCK_PICKS (D:/rtmp/rhmattress_work/picks1/2.json); 14 clips malos a `_rech`. Real 19,8 → 26,3 % en 2 tandas.
- `--final` frenaba por un `_last.jpg` faltante de un stock (b_fan_night) usado con punch-in → generarlo con ffmpeg -sseof.
- Etiquetas del 3D se cortaban → maxWidth con wrap. QuoteStamp con `job`/`lines` propios (colchón queen/king/limpieza).
- C: quedó en ~2 GB por pagefile.sys del sistema (35,8 GB); todo lo del farm a D:/rtmp_rh.
