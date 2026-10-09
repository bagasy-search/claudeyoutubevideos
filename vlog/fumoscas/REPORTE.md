# REPORTE — fumoscas (Claudio el Fumigador #8 · moscas)

- **Título:** Cómo Mantener las Moscas Fuera de la Cocina Sin Mosquiteros ni Spray
- **Tarjeta:** `plan-own-1791387464226-7` · **Serie:** La casa de los Ramírez, episodio 8 · **Fuente:** fixes.json idx 7 "Moscas" (Arreglo 8, pág. 16)
- **Formato:** voz OFF de Claudio sobre planos vivos de la cocina + componentes del kit (cadena clásica fuagua-style, sin avatar, sin stock, sin LTX)
- **Estado:** ✅ ENTREGADO · **Rama:** `fumoscas-render` · **mp4:** release `fumoscas`

## Números finales
| | |
|---|---|
| Duración | 747,37 s = 12:27,3 · 22.421 cuadros @30 fps |
| Tamaño | 403 MB (yuv420p / tv / bt709 / has_b_frames=0) |
| Imágenes | 261 agnes-image (GRATIS, `img/fumoscas/`) |
| Movimiento | 30 clips agnes-video **v2.0** (`broll/fumoscas/`) + 7 `_last.jpg` de sostén |
| Cara | agnes-image-2.5-flash + `ref_fumoscas_face.png` |
| Voz | Fish Audio `claudio_definitiva` speed 1.0 · 12 bloques · `fumoscas.wav`/`fumoscas.m4a` |
| QC agnes | 30/30 revisados y ok · repetición {planos:30, loops:0, dobles:0} |
| Mezcla | `fumoscas_mix.wav` −14 LUFS, alimiter |

## Auditoría (audit.py)
- **Minuto 1:** 0 silencios >0,4 s a −32 dB (exigido 0) · **30 cortes** (exigido ≥30) ✓
- **Negro:** 0 ✓
- **Congelados (freeze ≥2,5 s): 5** → 571,4 / 591,7 / 601,8 (tarjetas ClAsk "Cuénteme en los comentarios") y 689,0 / 691,6 (ClQRCard, una sola tarjeta de 9,2 s). Son **tarjetas estáticas de información a propósito**, no video muerto. Los 7 sostenes en `_last.jpg` NO se marcan porque el Ken-Burns mueve el cuadro.

## Gasto (límites del brief: ElevenLabs 0 · Fish free · Modal ≤1 · OpenAI 0 · RunPod 0)
- ElevenLabs US$0 · Fish US$0 · Modal ASR ≤US$1 · OpenAI US$0 · RunPod US$0 ✓ (todo imágenes y video por agnes, gratis)

## Continuidad
- **Enganche de entrada:** retoma furatones5 — Lucía abrió la ventana para ventilar el olor de la espuma, entraron tres moscas grandes, Jorge buscó aerosol.
- **Enganche de salida:** cierra derivando a los mosquitos → próximo video `fumosquito` + ClVideoRef `th_fumosquito`.

## Capítulos
0 Por qué no se rocía aerosol en la cocina · 6 La casa de los Ramírez · 14 Las tres cosas, en orden · 19 Primero: sin basura ni olor · 29 El limón con diez clavos · 38 La albahaca en la ventana · 44 La cinta pegajosa · 51 Moscas grandes: algo muerto · 65 Tres días después · 69 La revisión de la noche (10 minutos) · 75 Los mosquitos.

## Cierres del brief
- [x] Todo el video a mano, sin agentes, sin preguntas.
- [x] SÓLO agnes, gratis (imágenes agnes-image, cara 2.5-flash, video v2.0). Sin gpt-image, sin 2.5-flash en video, sin avatar/RunPod, sin LTX, sin stock.
- [x] Voz Fish claudio_definitiva speed 1.0 (ElevenLabs PROHIBIDO). ASR Modal por bloque.
- [x] Minuto 1 ≥30 cortes, resto 3-5 s/plano, componentes del kit encima.
- [x] Sin deliver_card, sin Bagasy, sin YouTube, sin Telegram. Repo público sin .env ni claves.
- [x] HANDOFF.md (raíz) + vlog/fumoscas/REPORTE.md commiteados en `fumoscas-render`.
