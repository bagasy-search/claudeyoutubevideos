# REPORTE — fumoscasf (Claudio el Fumigador · "La casa de los Ramírez" ep. 8)

**Video 8 del canal.** Título: *Cómo Mantener las Moscas Fuera de la Cocina Sin Mosquiteros ni Spray*.
Tarjeta `plan-own-1791387464226-7`. Slug `fumoscasf` (la corrida paralela usa `fumoscas`; NO se tocó).

- **mp4 (entrega)**: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/fumoscasf/fumoscasf.mp4
  · 432.784.333 bytes · 22.259 cuadros · **741,9667 s = 12:21,97** · 1920×1080 h264 CRF19 (re-encode de entrega `encfin`, el render de Remotion también es 1080p) · audio AAC 48 kHz estéreo
  · video 741,966667 s y audio 741,966667 s (encfin lo verifica: "cuadros 22259 (esperados 22259) · video 741.966667s · audio 741.966667s").
- **Imágenes (todas agnes, gratis)**: 267 pedidos → **251 usadas** (16 rerolls). Sin cara = `agnes-image-2.1/2.5-flash`; con cara (14 planos) = `agnes-image-2.5-flash` + ref. ⛔ Cero gpt-image / OpenAI.
- **Clips**: 252 pedidos → **251 usados** (1 reroll por cuadro muerto) con `agnes-video-v2.0` (121 cuadros @60 fps → ralentí ×2 = 4,033 s a 30 fps). **251 planos, 251 clips distintos, 0 repetidos.**
- **Voz**: Fish Audio (gratis), voz `claudio_definitiva` speed 1.0, 14 bloques → `fumoscasf_raw.wav` = 749,71 s. Pausas cortadas **por muestra** (numpy) → 741,9667 s = 22.259 cuadros. ⛔ ElevenLabs US$0.
- **Modal (ASR de la compuerta de voz)**: 2 llamadas, **15 wavs ≈ 13,4 min de audio** (~US$0,0x).
- **Mezcla**: `out/fumoscasf_mix.wav` 48 kHz estéreo · **−14,0 LUFS** · TP −2,4 dB · voz + ambiente por sección (fundidos 0,8 s, ~24 dB abajo, ducking) + 7 foley · **sin música**.
- **Componentes**: 8 (`src/fumoscasf/ov.json`, con el vlog del propio video como fondo) — revisados a ojo en el render final: ClVideoRef "VIDEO ANTERIOR" (13,3 s), ClFlyCycle (96,6), ClBookPage pág. 16 (469,0), ClDrainFactory (559,0), ClCheck "la revisión de la noche" (670,0), ClQRCard regalo (690,7), ClQRCard Manual US$27 (697,0), ClVideoRef "PRÓXIMO VIDEO" mosquitos (723,9).

## Compuertas
| Compuerta | Resultado |
|---|---|
| Voz por bloque (Fish + ASR Modal contra el texto) | 14/14 OK (b005 al 2º intento) |
| `agnes_qc.mjs` (medición + hoja de contacto) | 251/251 **aprobados a ojo**, 0 rechazados, 0 bloqueos automáticos |
| `agnes_qc_gate.mjs` (bloqueo del farm) | ✓ (repetición: 237 planos de clip · 0 más largos que su clip · 0 clips usados dos veces) |
| `vlog/claudio/audit.py` sobre el **2K final** | silencios >0,4 s @−32 dB **0** · negro ≥0,25 s **0** · **cortes scene>0,3 en el minuto 1: 31** (≥30) · **cuadros muertos ≥2,5 s: 0** |
| `fumi/chk.py fumoscasf` | exit 0, sin avisos · 11.077 car · 12,43 min · las 3 menciones al Manual (pág. dieciséis, hoja del CTA, Manual 66 arreglos US$27) |
| `chk_ov.py` (los 8 componentes y sus beds entran en 22.259 cuadros) | ✓ |

## Fallas y bloqueos (con la medición, no con la impresión)
1. **`mkvlog.py` recortaba mal.** El `select` acumulaba el índice con el largo del trozo (`n`) en vez del cuadro del clip (`CLIPF`), así que los rangos quedaban pegados (0-55, 56-114, 115-173…) y el filtro devolvía los primeros `sum(n)` cuadros: el vlog salía con clips enteros de 4,033 s pegados. **Medido** en el minuto 1: 14 cortes y 2 cuadros muertos. Arreglado con dos contadores (`pos` para `-frames:v`, `base += CLIPF` para el select) → 31 cortes y 0 congelados. El `-/vf <archivo>` **sí** aplica el filtro (probado: 30 cuadros de 90) — no era eso.
2. **Dos clips casi quietos rompían la compuerta de cuadros muertos**: s068 (freeze a 253,4 s en la 1ª armada) y s062 (freeze a 232,4 s en el render final, que la 1ª pasada con CRF17 no marcaba). Los dos se regeneraron con movimiento real visible (la luz corriendo por el piso / la mosca entrando al tarro); ahora freezedetect (−60 dB) da 0.
3. **Una tarjeta tapaba 2 cortes del minuto 1**: el ClVideoRef "VIDEO ANTERIOR" duraba 5,5 s y se comía los cortes de 15,5 s y 17,45 s (el detector bajó de 31 a 29 en el render final). Bajado a **2,0 s** (la frase "La vimos la semana pasada" dura ~1,7 s), así que la tarjeta entra y sale dentro del mismo tramo de 1,95 s.
4. **El pre-vuelo del farm exige `public/<slug>_fish.wav`** (lo busca el stitch): se copió el mix con ese nombre. Y cada re-disparo de `farm.mjs` **borra y recrea `assets-fumoscasf`**, así que hay que **volver a subir el mix** (`fumoscasf_mix.wav`, que es lo que baja `encfin`).
5. **Faltaban 45 clips distintos**: la primera armada usaba 237 planos con 192 clips (45 repetidos) = "nunca repetir clip" roto. Se amplió la lista con 56 planos nuevos (56 fotos + 56 clips, gratis) → 237/237 → 251/251.

## Gasto
ElevenLabs **US$0** (prohibido) · OpenAI **US$0** (prohibido) · RunPod **US$0** · agnes **gratis** (imágenes + v2.0) · Fish **gratis** · Modal **≈US$0,0x** (13,4 min de ASR). Farm: gratis (repo público).

## Para rehacer
`guiones/fumoscasf_filmado.txt` → `voz.py` → `cut.py` → `beats.py` + `agnes_img.mjs` + `agnes_i2v.mjs` → `agnes_qc.mjs` → `mkvlog.py --armar` → `mkov.py` → `mix.py` → farm (`ENTRY=src/index_fumoscasf.tsx FARM_REF=fumoscasf-render TAR_DIR=D:/rtmp/fu8 node scripts/farm.mjs fumoscasf Fumoscasf 22259 60 @_fumoscasf_assets.txt`) → mix a `assets-fumoscasf` → `encfin/push.sh fumoscasf 22259 60`.
