# AUDITOR olstove — MP4 FINAL `C:/videosdeclaude_olstove/olstove_final.mp4` (reencode del farm; el crudo está en olstove.mp4; la 1ª versión sin arreglos quedó en C:/videosdeclaude_olstove/v0)
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
| % avatar (timeline) | 24,3 % (incluye 8 hablados de repuesto) | ~20-25 % | OK |
| % real (stock + archivo) | 25,0 % (sube a ~30 % cuando entren los hablados) | ≥25 % | OK, justo |
| hablados agnes 2.5 en el MP4 | m1 y m4 de 10 (0,7 %) | — | 8 = avatar de repuesto (cola de agnes saturada, respaldo del BRIEF) |
Clips agnes v2.0: 26 aprobados a ojo (agnes_qc, 0 pendientes / 0 rechazados / 0 repetidos). Nombre personal del creador: no aparece.

## Hojas de contacto (mín. 4), en D:/Proyectos/video2-wt/olstove/out/auditor/
1. `min1.jpg` (0-60 s cada 2 s) · 2. `hojaB.jpg` (1:02-8:14 cada 18 s) · 3. `hojaC.jpg` (8:20-15:08 cada 17 s) · 4. `cada30.jpg` (cada 30 s, primeros 12 min). Miradas 1-3 enteras.
Lo visto: primer cuadro = Ole hablando en la cabaña; identidad, vestuario y cabaña consistentes en anclas, avatar y clips; 3D (estufa lado a lado, pila que prende arriba, cabaña con mapa de calor) legibles; medidor, regulador, cord, calendario, tarjetas de seguridad, portada+QR y página del libro p.30 legibles; stock y archivo on-topic.

## Corregido en esta versión (v1-final)
medidor sin 0 % inicial · placas de regla con foto de fondo y número/título grandes · repaso de las 4 reglas en cartel grande · fondos vivos en los 6 componentes 2D · cabaña con mapa de calor menos lavada.

## Defectos que quedan (mejora en un v2 si llegan los hablados)
1. El minuto 1 usa avatar de repuesto en m2, m3, m5, m6 y m7 (Ole sigue hablando, con push lento e inserciones); hablados agnes sólo en m1 y m4.
2. Avatar: el fondo de la foto de referencia trae hotcakes + olla que a veces se ven "mosaico" (artefacto de InfiniteTalk); mismo comportamiento que olbeans.
3. La tarjeta de creosota (11:44) sigue siendo la más floja de los componentes 2D.
5. Foley vs voz: diseñado a −30 LUFS contra la voz a −16, NO medido por separado en el MP4.
