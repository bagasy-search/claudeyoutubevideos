# AUDITOR olstove — MP4 FINAL `C:/videosdeclaude_olstove/olstove_final.mp4` (reencode del farm; el crudo está en olstove.mp4)
Medido con `vlog/olstove/auditor.py` (exit por compuertas: ninguna "no midió") + hojas MIRADAS.
| compuerta | medido | umbral | estado |
|---|---|---|---|
| cuadros del MP4 | 28.156 | == TOTAL_FRAMES 28.156 | OK |
| B-frames / pts==dts (primeros 30 s) | has_b_frames 0 · 0 paquetes con pts≠dts | 0 | OK |
| color | yuv420p · tv · bt709 | idem | OK |
| audio vs video | 938,533 s vs 938,533 s | ±50 ms | OK |
| loudness integrado | −16,1 LUFS (pico −3,1 dBFS en la mezcla) | −16 ±0,8 | OK |
| sync contra el máster de voz (4 puntos: 30 s, 310 s, 619 s, 899 s) | lag 0 ms en los 4, correlación 0,988 / 1,0 / 1,0 / 1,0 | ≤10 ms | OK |
| minuto 1: cortes (scene>0,3) | 22 | ≥20 | OK |
| minuto 1: silencios (−32 dB, 0,3 s) | 0 | 0 | OK |
| negros (blackdetect 0,25 s) | 0 intervalos, en todo el largo | 0 | OK |
| QR legible con cv2 sobre el CUADRO renderizado del CTA (3 cuadros) | `https://ole-camp-cookbook.vercel.app/?src=ole-olstove` ×3 | decodifica | OK |
| placeholders (assets faltantes en la línea de tiempo) | 0 | 0 | OK |
| % avatar (timeline) | 24,5 % (incluye 9 hablados de repuesto) | ~20-25 % | OK |
| % real (stock + archivo) | 25,0 % (sube a ~30 % cuando entren los hablados) | ≥25 % | OK, justo |
| hablados agnes 2.5 en el MP4 | 1 de 10 (0,4 %) | — | los 9 restantes = avatar de repuesto |
Clips agnes v2.0: 26 aprobados a ojo (agnes_qc, 0 pendientes / 0 rechazados / 0 repetidos). Nombre personal del creador: no aparece.

## Hojas de contacto (mín. 4), en D:/Proyectos/video2-wt/olstove/out/auditor/
1. `min1.jpg` (0-60 s cada 2 s) · 2. `hojaB.jpg` (1:02-8:14 cada 18 s) · 3. `hojaC.jpg` (8:20-15:08 cada 17 s) · 4. `cada30.jpg` (cada 30 s, primeros 12 min). Miradas 1-3 enteras.
Lo visto: primer cuadro = Ole hablando en la cabaña; identidad, vestuario y cabaña consistentes en anclas, avatar y clips; 3D (estufa lado a lado, pila que prende arriba, cabaña con mapa de calor) legibles; medidor, regulador, cord, calendario, tarjetas de seguridad, portada+QR y página del libro p.30 legibles; stock y archivo on-topic.

## Defectos conocidos (los corrijo en el re-render completo cuando lleguen los hablados)
1. Medidor de humedad del minuto 1 (24,8 s): arranca en 0 % con la leyenda "ready to burn" durante ~1 s. YA corregido en código (lectura inicial inmediata); no está en este MP4.
2. Avatar: el fondo de la foto de referencia trae hotcakes + olla que a veces se ven "mosaico" (artefacto de InfiniteTalk); mismo comportamiento que olbeans.
3. La tarjeta de resumen de las 4 reglas (14:30) queda chica en el cuadro; el pico de la mezcla previa al loudnorm es +2,2 dBFS pero el MP4 final está en −3,1 dBFS de pico.
4. Estufa 3D dentro de la cabaña (mapa de calor) queda algo lavada; cumple el pago pero se puede afinar.
5. Foley vs voz: diseñado a −30 LUFS contra la voz a −16, NO medido por separado en el MP4.
