# AUDITOR — olpots, MP4 FINAL (re-render completo del farm + reencode de entrega)
MP4: `D:/rtmp/olpots/olpots_final.mp4` (copia en `C:/tmp_olpots/final/`), 499 MB, 1920x1080. Farm: run 36665702909 (150 chunks, success, 0 fallidos), raw del release `olpots` → `vlog/olpots/entrega.sh` (setpts=N/(30*TB), yuv420p/tv/bt709, -bf 0, g=60, faststart, audio = mezcla determinista `mix.py`). Corrida con `python vlog/olpots/auditor.py` (salida completa en `out/auditor_final.txt`; exit 0, ninguna compuerta "no midió").

| compuerta | medido | umbral | estado |
|---|---|---|---|
| cuadros del MP4 vs TOTAL_FRAMES | **29.391 == 29.391** (packets contados) | igual | ✅ |
| color / formato | yuv420p · tv · bt709 | yuv420p/tv/bt709 | ✅ |
| B-frames | has_b_frames = 0; pts==dts en 30 s de paquetes: 0 diferencias | 0 | ✅ |
| duración audio vs video | 979,7 s vs 979,7 s | ±50 ms | ✅ |
| loudness | **−16,0 LUFS** | −16 ±0,8 | ✅ |
| sync vs máster (envolvente 300-3400 Hz, 4 puntos: 30 s, 323 s, 647 s, 940 s) | **lag 0 ms en los 4**, correlación 0,999 / 1,0 / 1,0 / 1,0 | ≤10 ms | ✅ |
| minuto 1: cortes (scene>0,3) | **23** | ≥20 | ✅ |
| minuto 1: silencios (−32 dB, 0,3 s) | **0** | 0 | ✅ |
| cuadros negros (blackdetect 0,25 s) | **0** | 0 | ✅ |
| QR en el cuadro renderizado del CTA (cv2, 3 cuadros) | decodifica `https://ole-camp-cookbook.vercel.app/?src=ole-olpots` 3/3 | URL del libro | ✅ (control positivo: la URL correcta sale de la imagen del mp4, no del archivo) |
| placeholders en el timeline | 0 | 0 | ✅ |
| **% avatar visible** (timeline) | **21,0 %** (incluye m5-m7 con avatar de respaldo; ≈19,7 % cuando entren) | ~20 % | ✅ |
| **% metraje real** (stock Pexels + archivo PD) | **29,8 %** | ≥25 % | ✅ |
| filmado agnes 2.5 (hablados m1-m4 + 2 detalles v2.0) | 1,7 % (suma al real: **≈31,5 %**) | — | — |

## Hojas de contacto MIRADAS del MP4 final
- `AUDITOR_min1.jpg` (minuto 1 cada 2 s): abre Ole hablando; las 24 tomas se leen; misma cara/vestuario/cabaña en los 4 hablados de agnes, en las anclas y en el avatar.
- `AUDITOR_cada30.jpg` (un cuadro cada 30 s, todo el largo): sin placeholders, sin negros; tarjetas de libro legibles (p.25, p.12), lámina p.10 ok.
- **TODAS las 3D** (20 cues: 13 repisa + 6 mapa de calor + 1 horno de brasas): `AUDITOR_3D_repisa.jpg` y `AUDITOR_3D_otros.jpg`. Repisa: ficha y sello BUY sobre la olla correcta en cada veredicto (corregí la altura del sello por olla tras ver la v1), vapor en la enlozada, sombras y reflejos en esmalte/acero; cierre con 5 BUY. Mapa de calor: 4 tomas (aluminio/inox/hierro) y horno de brasas 16+8 sin errores de render.
- Defectos hallados en la v1 de validación y corregidos: (1) sello BUY flotando sobre la sartén (ahora ancla por altura de olla), (2) m2 salió oscuro en agnes (levantado con eq gamma 1,15 en `prep_clips.mjs`), (3) etiqueta "outside: fine" del ChipMap pisada por el asa (movida).

## Pendientes / honestidad
- Hablados m5, m6, m7 de agnes NO llegaron (cola única, 4 h): sus tramos van con avatar (mismo lugar, misma voz máster). Cuando lleguen = v2 con re-render completo + `?v=N`.
- 2 clips de stock cortos (st138, st122: 0,17 s y 0,4 s de cuadro final congelado, invisible).
- Foley real bajo la voz: sólo los 2 detalles v2.0 llevan sfx de respaldo (sin foley agnes 2.5 en este video); el ambiente de cabaña y los sfx quedan a ≥ −10 dB bajo la voz por diseño (mezcla a −16 LUFS con la voz como máster).
- Disco: `D:` se llenó en el camino (otras sesiones); TEMP y tar/mp4/reencode en `C:`.
