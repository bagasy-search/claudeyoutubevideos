# AUDITOR olcabin — MP4 FINAL (render 3 del farm, commit `2f351a3`, hablados m1+m3 reales, resto avatar de repuesto)
Archivo: `C:/rtmp_olcabin/olcabin_final.mp4` (675 MB, reencode `entrega.sh` -bf 0). Comando: `PYTHONIOENCODING=utf-8 python vlog/olcabin/auditor.py <mp4>` → **✅ todas las compuertas medidas en verde** (`C:/rtmp_olcabin/auditor2.out`).

| Compuerta | Medido | Resultado |
|---|---|---|
| Cuadros == TOTAL_FRAMES | 34.843 == 34.843 (ffprobe -count_packets) | ✅ |
| Sin B-frames / pts==dts | has_b_frames 0 · pts==dts en 30 s de muestra 0 desvíos | ✅ |
| Formato | yuv420p · tv · bt709 | ✅ |
| Loudness | -16,0 LUFS | ✅ |
| Audio == video | 1161,433 s == 1161,433 s | ✅ |
| Sync vs máster (4 puntos: 30, 383, 767, 1121 s) | lag 0 ms en los 4, correlación 0,999-1,000 | ✅ |
| Minuto 1 | 26 cortes (scene>0,3) · 0 silencios (silencedetect -32 dB / 0,3 s) | ✅ |
| Negros | 0 tramos | ✅ |
| QR legible con cv2 en el CUADRO RENDEREADO (3 cuadros del CTA) | `https://ole-camp-cookbook.vercel.app/?src=ole-olcabin` ×3 | ✅ |
| Avatar % | 19,1 % (incl. repuesto de m2, m4, m5, m6) | — |
| Real % (stock + archivo PD) | 27,4 % (del timeline; = lo renderizado, 0 placeholders) | ✅ ≥25 |
| Placeholders | 0 | ✅ |
| Hablados agnes 2.5 | 2 de 6 (m1, m3) — 0,6 % de cuadros | m2/m4/m5/m6 → v2 |

Control positivo: el QR se decodificó en los 3 cuadros y el URL es el de la guía (`?src=ole-olcabin`); las compuertas de silencio y cortes se probaron primero en el borrador (2 silencios reales antes de subir el ambiente, 0 después).

## Hojas de contacto (MIRADAS)
`GATE3_hoja_min1.jpg` (minuto 1, cada 2 s) · `GATE3_hoja_0-400s.jpg` · `GATE3_hoja_400-800s.jpg` · `GATE3_hoja_800-1160s.jpg` (cada 10 s) · `out/auditor/cada30.jpg`. Hallazgos ya corregidos en este render: stock fuera de tema (salteado de zanahorias en bannock/kraut) retirado; tarjetas manuscritas agrandadas; "Number four/one" con 3D en vez de tabla vacía; texto del CTA acortado. Hallazgos que quedan (no bloquean): (1) el avatar repite el mismo encuadre en todas sus ventanas (una sola foto de referencia); (2) [corregido] la página del libro ya está desde el cuadro 0; (3) [corregido] los dos planos de stock aproximados se reemplazaron.

## Pendientes conocidos
- Re-render completo cuando lleguen los hablados m2-m6 (m2 salió con palabras cambiadas y está re-encolado; m3-m6 en la cola del orquestador).
- Licencias: fotos MNHS/NAHA/Hennepin/DPLA con la nota "Public domain per Wikimedia Commons" en `CREDITOS_archivo.txt`; `ar_belgian_doorcounty` y `ar_charles_xii` retiradas y reemplazadas por fotos gpt-image.
