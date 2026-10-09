# HANDOFF — fumoscasf (Claudio el Fumigador · "La casa de los Ramírez" ep. 8: las moscas en la cocina)
Estado: ✅ ENTREGADO 9-oct (tarjeta plan-own-1791387464226-7, slug `fumoscasf`; la corrida paralela usa `fumoscas`, NO tocarla).
Título: "Cómo Mantener las Moscas Fuera de la Cocina Sin Mosquiteros ni Spray".
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/fumoscasf/fumoscasf.mp4 (12:21,97 · 22.259 cuadros · 2K).
Rama `fumoscasf-render` (sale de `furatones5-render`) · worktree `D:/Proyectos/video2-wt/fumoscasf`.
Formato: VLOG CONTINUO 100 % IA (voz en off de Claudio sobre planos vivos de la cocina de los Ramírez; sin avatar, sin stock, sin fotos).
Imágenes: SOLO agnes (gratis) — sin cara `agnes-image-2.1/2.5-flash`, con cara `agnes-image-2.5-flash` + ref. ⛔ gpt-image, 2.5-flash-video, avatar y LTX NO se usaron en este video.
Voz: Fish (gratis), `claudio_definitiva` speed 1.0. ⛔ ElevenLabs no se usó (US$0).

## Cadena (todo en `vlog/fumoscasf/`)
1. `guiones/fumoscasf.txt` (11.077 car, tú neutro) + `_filmado.txt` (mismo texto con `[SECCIÓN|etiqueta]` por línea) · `tags.json`.
2. Voz: `vlog/claudio/voz.py` = Fish s2.1-pro-free por bloque + compuerta ASR en **Modal** por bloque (`gate.json`: 14/14 OK, b005 al 2º intento).
   → `public/fumoscasf_raw.wav` (749,71 s). `cut.py` quita las pausas de `cortes.json` **por muestra** (numpy+wave) →
   `public/fumoscasfcut.wav` = 741,9667 s = 22.259 cuadros (1 cuadro = 1470 muestras @44,1 k). `vlog/claudio/align.py` (difflib) → `_v3/fumoscasf_wordms.json`.
3. `beats.py` (251 planos: 237 sin cara + 14 con cara; `_v3/fumoscasf_img_*.json`) → `agnes_img.mjs` → `i2v_pend.py` → `agnes_i2v.mjs` (v2.0, 121 cuadros @60 → ralentí ×2 = 4,033 s a 30 fps) → `public/broll/fumoscasf/` (251 clips).
4. `agnes_qc.mjs` (mide + hoja de contacto) + revisión a ojo → sello `_v3/fumoscasf_agnes_qc.json`. ⛔ Las pistas de la visión fueron ruido otra vez: los 2 defectos reales (ci1, cl4) salieron mirando las hojas.
5. `mkvlog.py` (plan `planos.json`: cortes cada ~1,95 s en el minuto 1, 4,033 s después) → `public/vid/fumoscasf/vlog.mp4` (22.259 cuadros).
   `mkov.py` → `src/fumoscasf/ov.json` (8 componentes) + `bed_<n>.mp4` (fragmento del propio vlog). `chk_ov.py` verifica que cada componente y su bed entren.
6. `mix.py` → `out/fumoscasf_mix.wav` (48 k estéreo, **−14,0 LUFS**, TP −2,4 dB): voz + ambiente por sección (fundidos 0,8 s, ~24 dB abajo, ducking) + 7 foley. **Sin música.** `chapters.py` → `vlog/fumoscasf/chapters.json`.
7. `src/index_fumoscasf.tsx` (vlog mudo + OV) · `src/fumoscasf/total.ts` (22.259).
8. farm: `ENTRY=src/index_fumoscasf.tsx FARM_REF=fumoscasf-render TAR_DIR=D:/rtmp/fu8 FARM_NOWAIT=1 node scripts/farm.mjs fumoscasf Fumoscasf 22259 60 @_fumoscasf_assets.txt`
   (run **37919581924** · 62 jobs · 0 fallidos · 60 chunks en `chunks-fumoscasf`) → mix a `assets-fumoscasf` (lo necesita encfin) →
   `bash D:/Proyectos/encfin/push.sh fumoscasf 22259 60` (run **37921496888** ✓) → release `fumoscasf`.

## Qué funcionó / números
- 251 planos / **251 clips distintos** (0 repetidos). Para lograrlo hubo que ampliar la lista: la 1ª armada usaba 237 planos con 192 clips (45 repetidos) → +56 planos nuevos (56 fotos + 56 clips, gratis).
- Imágenes: 267 pedidos → 251 usadas (16 rerolls). Clips: 252 pedidos → 251 usados (1 reroll).
- Gasto: **US$0** de OpenAI, ElevenLabs y RunPod. Modal: 15 wavs ≈ 13,4 min de audio (~US$0,0x).
- Auditor minuto 1 sobre el vlog: silencios >0,4 s @−32 dB **0** · cortes scene>0,3 **31** (≥30) · negro **0** · cuadros muertos **0**.

## ⛔ Gotchas (para el próximo)
- **`mkvlog.py` recortaba mal (bug real, arreglado 9-oct).** El `select` acumulaba el índice con el largo del TROZO (`n`) en vez del cuadro del CLIP (`CLIPF`): los rangos quedaban pegados (0-55, 56-114, 115-173…) y el filtro devolvía los primeros `sum(n)` cuadros tal cual → el vlog salía con **clips enteros de 4,033 s pegados**. Se veía así: 14 cortes en el minuto 1 y 2 cuadros muertos. Hay que llevar DOS contadores (`pos` para `-frames:v`, `base += CLIPF` para el select). El `-/vf <archivo>` **sí** aplica el filtro (medido: 30 de 90 cuadros) — no era eso.
- **Un clip que no se mueve rompe el gate de congelados**: s068 (tarro de basura quieto) daba freeze ≥2,5 s. Se regeneró con movimiento real (la luz corre por el piso); ahora 0. freezedetect usa −60 dB: cualquier plano muy quieto lo dispara.
- **El pre-vuelo del farm exige `public/<slug>_fish.wav`** (lo busca el stitch). Acá se copió el **mix** con ese nombre (el render sale con el audio final ya puesto; el 2K lo re-encoda encfin con `fumoscasf_mix.wav` del release). ⛔ Si se re-dispara farm.mjs, borra y recrea `assets-fumoscasf` → **volver a subir el mix**.
- `cut.py`: en audio `aselect=n` cuenta FRAMES DEL FILTRO (~1024 muestras), no muestras → devolvía el archivo entero; `aselect=t` pega los bordes al bloque (742,095 s). El corte exacto es por muestra con numpy.
- `_v3/` está en .gitignore (sellos, ASR, cues): el farm los lee del disco local, no viajan en la rama.
