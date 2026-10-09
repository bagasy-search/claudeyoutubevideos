# REPORTE — fumoscasf (Claudio el Fumigador · "La casa de los Ramírez" ep. 8)

**Video 8 del canal.** Título: *Cómo Mantener las Moscas Fuera de la Cocina Sin Mosquiteros ni Spray*.
Tarjeta `plan-own-1791387464226-7`. Slug `fumoscasf` (la corrida paralela usa `fumoscas`; NO se tocó).

- **mp4 (entrega)**: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/fumoscasf/fumoscasf.mp4
  · 22.259 cuadros · **741,9667 s = 12:21,97** · 1920×1080 h264 CRF19 (re-encode de entrega `encfin`) · audio AAC 48 kHz estéreo.
  **2ª pasada: este mp4 REEMPLAZÓ al de la 1ª** (mismo nombre, mismo release) — ahora lleva el avatar y los 4 componentes nuevos.
- **Imágenes (todas agnes, gratis)**: 267 pedidos → **251 usadas** (16 rerolls). Sin cara = `agnes-image-2.1/2.5-flash`; con cara (14 planos) = `agnes-image-2.5-flash` + ref. ⛔ Cero gpt-image / OpenAI.
- **Clips**: 252 pedidos → **251 usados** (1 reroll por cuadro muerto) con `agnes-video-v2.0` (121 cuadros @60 fps → ralentí ×2 = 4,033 s a 30 fps). **251 planos, 251 clips distintos, 0 repetidos.**
- **Voz**: Fish Audio (gratis), voz `claudio_definitiva` speed 1.0, 14 bloques → `fumoscasf_raw.wav` = 749,71 s. Pausas cortadas **por muestra** (numpy) → 741,9667 s = 22.259 cuadros. ⛔ ElevenLabs US$0.
- **Avatar (2ª pasada)**: RunPod InfiniteTalk público, **UN solo /run = US$0,25** (job `d4c15c7e-…-u1`, 14:40 → 15:03; `reel.mp4` 170,92 s a 768×512 → `reel30.mp4` 1920×1080 30 fps mudo). **9 ventanas · reel de 171,0 s = 23,0 % del video en audio · 158,4 s = 21,4 % de imagen a la vista** (pedido: 20-30 %). Lag por ventana por correlación de envolvente: −0,10…0,00 s. El audio del avatar son los mismos tramos del máster: la voz es una sola de punta a punta y **la mezcla no se tocó**.
- **Modal (ASR de la compuerta de voz)**: 2 llamadas, **15 wavs ≈ 13,4 min de audio** (~US$0,0x).
- **Mezcla**: `out/fumoscasf_mix.wav` 48 kHz estéreo · **−14,0 LUFS** · TP −2,4 dB · voz + ambiente por sección (fundidos 0,8 s, ~24 dB abajo, ducking) + 7 foley · **sin música**.
- **Componentes**: **12 apariciones (12,1 % del video)** en `src/fumoscasf/ov.json`, todas con el vlog del propio video como fondo y **ninguna pisando una ventana de avatar** (compuerta en `mkov.py`, exit 2 si pasa):
  ClVideoRef "VIDEO ANTERIOR" (13,5 s, 2,0) · **ClFlyDoor** (85,6, 7,5) · ClFlyCycle (96,6, 7,0) · **ClLemon10** (325,5, 10,0) · **ClTapeHigh** (423,2, 12,5) · ClBookPage pág. 16 (474,0, 5,5) · ClDrainFactory (559,0, 7,0) · **ClMoscasMap** (619,4, 11,0) · ClCheck "la revisión de la noche" (670,0, 9,0) · ClQRCard regalo (684,9, 6,5) · ClQRCard Manual US$27 (700,6, 7,0) · ClVideoRef "PRÓXIMO VIDEO" (723,9, 5,0).
  Los 4 en negrita son el **kit nuevo `src/claudio/ClMoscas.tsx`** (2ª pasada), con cuadros fijos revisados a ojo en `vlog/fumoscasf/kit/`.

## Compuertas
| Compuerta | Resultado |
|---|---|
| Voz por bloque (Fish + ASR Modal contra el texto) | 14/14 OK (b005 al 2º intento) |
| `agnes_qc.mjs` (medición + hoja de contacto) | 251/251 **aprobados a ojo**, 0 rechazados, 0 bloqueos automáticos |
| `agnes_qc_gate.mjs` (bloqueo del farm) | ✓ (repetición: 237 planos de clip · 0 más largos que su clip · 0 clips usados dos veces) |
| `avatar_post.py` (duración del reel de RunPod vs el audio enviado) | ✓ 170,92 s vs 170,99 s (−0,07 s) |
| `mkov.py` (ningún componente pisa una ventana de avatar) | ✓ **12 componentes, 0 solapes** con las 9 ventanas |
| `avwin.py` + `chk_ov.py` (ventanas y componentes dentro de 22.259 cuadros) | ✓ |
| `vlog/claudio/audit.py` sobre el **2K final** | silencios >0,4 s @−32 dB **0** · negro ≥0,25 s **0** · **cortes scene>0,3 en el minuto 1: 31** (≥30) · **cuadros muertos ≥2,5 s: 0** |
| `fumi/chk.py fumoscasf` | exit 0, sin avisos · 11.077 car · 12,43 min · las 3 menciones al Manual (pág. dieciséis, hoja del CTA, Manual 66 arreglos US$27) |

## Fallas y bloqueos (con la medición, no con la impresión)
1. **El avatar tapando el minuto 1 se comía los cortes.** Con las ventanas sólidas (GANCHO 0-13,5 s y PROMESA 46-75,8 s) la imagen del avatar tapa ~6 y ~8 cortes medidos → `scene>0,3` bajaba de 31 a ~24-25 y la compuerta (≥30) se caía. Solución **sin un 2º /run**: `avwin.py` parte esas dos ventanas en TRAMOS ENTEROS de `planos.json` y muestra el avatar en los pares — cada cambio avatar↔vlog cae exactamente en un corte que ya existía. **Medido después: 31 cortes**, igual que la 1ª pasada. El audio del avatar no cambia (sigue siendo la voz en off continua).
2. **Chunk caído por el tope de 25 min.** Tres chunks con 3 videos a la vez (vlog + cama del componente + avatar) tardan ~25 min bajo swangle: dos llegaron justo, el chunk 50 (cuadros 18.550-18.920 = ClMoscasMap entero) murió a los 25. Re-render parcial con `only_chunks=50` (y `timeout-minutes: 45` en la rama) → ✓. ⛔ **Trampa medida**: el stitch baja el release `chunks-fumoscasf` ANTES de persistir y `cp -n` rellena lo que falta, así que la 1ª corrida concatenó **el chunk 50 de la 1ª pasada** (sin avatar/componentes) y quedó VERDE. Por eso el chunk 50 se re-renderizó (dos veces, una en la PC) antes de re-disparar el stitch.
3. **`mkvlog.py` recortaba mal.** El `select` acumulaba el índice con el largo del trozo (`n`) en vez del cuadro del clip (`CLIPF`), así que los rangos quedaban pegados (0-55, 56-114, 115-173…) y el filtro devolvía los primeros `sum(n)` cuadros: el vlog salía con clips enteros de 4,033 s pegados. **Medido** en el minuto 1: 14 cortes y 2 cuadros muertos. Arreglado con dos contadores (`pos` para `-frames:v`, `base += CLIPF` para el select) → 31 cortes y 0 congelados. El `-/vf <archivo>` **sí** aplica el filtro (probado: 30 cuadros de 90) — no era eso.
4. **Dos clips casi quietos rompían la compuerta de cuadros muertos**: s068 (freeze a 253,4 s en la 1ª armada) y s062 (freeze a 232,4 s en el render final, que la 1ª pasada con CRF17 no marcaba). Los dos se regeneraron con movimiento real visible (la luz corriendo por el piso / la mosca entrando al tarro); ahora freezedetect (−60 dB) da 0.
5. **Una tarjeta tapaba 2 cortes del minuto 1**: el ClVideoRef "VIDEO ANTERIOR" duraba 5,5 s y se comía los cortes de 15,5 s y 17,45 s (el detector bajó de 31 a 29 en el render final). Bajado a **2,0 s** (la frase "La vimos la semana pasada" dura ~1,7 s), así que la tarjeta entra y sale dentro del mismo tramo de 1,95 s.
6. **El pre-vuelo del farm exige `public/<slug>_fish.wav`** (lo busca el stitch): se copió el mix con ese nombre. Y cada re-disparo de `farm.mjs` **borra y recrea `assets-fumoscasf`**, así que hay que **volver a subir el mix** (`fumoscasf_mix.wav`, que es lo que baja `encfin`).
7. **Faltaban 45 clips distintos**: la primera armada usaba 237 planos con 192 clips (45 repetidos) = "nunca repetir clip" roto. Se amplió la lista con 56 planos nuevos (56 fotos + 56 clips, gratis) → 237/237 → 251/251.
8. **Dos textos mal, vistos en los cuadros fijos** (2ª pasada): el ClQRCard del Manual recortaba "66 arreglos · garantía 7 días" en "7 dí" (a 52 px medía ~700 px y la tarjeta tiene 580) → el componente ahora achica la letra si el texto pasa de 23 caracteres. Y el ClFlyCycle decía "MOSQUITAS"/"mosquitas" (venía del episodio del frutero): ahora recibe `name` y en este video dice **"MOSCAS"**.

## Gasto
2ª pasada: **RunPod US$0,25** (un solo /run de InfiniteTalk) · OpenAI **US$0** · ElevenLabs **US$0** · agnes **gratis** · Fish **gratis** · farm gratis (repo público).
1ª pasada: todo US$0 salvo Modal **≈US$0,0x** (13,4 min de ASR).

## Para rehacer
`guiones/fumoscasf_filmado.txt` → `voz.py` → `cut.py` → `beats.py` + `agnes_img.mjs` + `agnes_i2v.mjs` → `agnes_qc.mjs` → `mkvlog.py --armar` → `mkov.py` → `mix.py` → `avwin.py build` → `avatar_run.mjs run` → `avatar_post.py` → farm (`ENTRY=src/index_fumoscasf.tsx FARM_REF=fumoscasf-render TAR_DIR=D:/rtmp/fu8 node scripts/farm.mjs fumoscasf Fumoscasf 22259 60 @_fumoscasf_assets.txt`) → mix a `assets-fumoscasf` → `encfin/push.sh fumoscasf 22259 60`.
