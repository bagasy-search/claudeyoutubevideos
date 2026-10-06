# HANDOFF — clsarro (video 2 de Claudio el Conserje)

Estado: ✅ ENTREGADO 6-oct (job 747, tarjeta "Video listo · subir", sin YouTube). mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/clsarro/clsarro.mp4?v=2 · local D:/videosdeclaude/clsarro_entrega.mp4 (15:03). Auditor: min1 0 silencios / 35 cortes, negro 0, congelados 0, cara en el seg 1, lag avatar -0,10..0.

## Cadena (para el video N, igual)
1. worktree `git worktree add -b <slug>-render D:/Proyectos/video2-wt/<slug> clsarro-render` + junction node_modules + `public/sfx_pro` (junction a D:/Proyectos/sfx_pro) + `public/sfx` (copia, la pide el pre-vuelo) + refs `public/ref_<slug>*.png` + `.env` + `fish_refs/claudio_definitiva.wav` + `fish_voices.json` con `claudio_definitiva`.
2. `guiones/<slug>_filmado.txt` + `vlog/<slug>/tags.json` → `mk_guion.py` → `voz.py --voice claudio_definitiva` (⛔ NO `claudio_mendoza_s4`: refs reclonadas de audio sintético = robótica).
3. `compress_hook.py raw→wav 75` → m4a → `modal run modal_whisper.py --slug --lang es` → `align.py` → `paras.py`.
4. directores `vlog/<slug>/dir_a|b|c.mjs` → `timeline.mjs` → `avatar_run.mjs build` + `run` (UN /run).
5. `imgs_extra.json` → `mk_imgs.mjs` → `scripts/gptimg.mjs` (Batch) · `beds.json` + `stock.mjs` (sembrar `_v3/<slug>_stock/_used.json` con los usados de los videos anteriores) · hoja a ojo → `_rech/`.
6. `mk_i2v.mjs` → `agnes_i2v.mjs` kf (v2.0, sin AG_MODEL) + i2v → `agnes_qc.mjs` → `--revision` a ojo → `--fix` → 2ª vuelta a `_rech`.
7. `avatar_post.py` → `gen_timeline.mjs --final` → `sfx_gate.py --prev D:/Proyectos/video2-wt/clborde/:clborde` → `mix.py` (-14 LUFS, TP ≤ -1) → `mk_entry.mjs` → farm.
8. `job.mjs` / `meta.mjs` (chapters.json + fijado; 1ª línea de la descripción = la página GRATIS).

## Números
- Voz claudio_definitiva 905 s · 14,66 car/s · 16/16 bloques al 1er intento. Final 27.093 cuadros = 15:03.
- Minuto 1: 35 cortes · 0 silencios >0,3 s en el máster · promesa 8,5 s · antes/después en 8,5 s · cara de Claudio en el seg 1 (avatar).
- Sonido: 84 efectos distintos (sfx_pro), 320 eventos, 141 tramos de ambiente, 0 cuadros sin ambiente, 35/35 cortes del min 1 con efecto, 0 del video 1 · mezcla -14,0 LUFS, TP -1,8.
- Metraje real 26,3 % (stock en toma 6,4 % + camas 19,9 %) · avatar 22 % · agnes 8,4 %.
- Costo ≈ US$0,73: gpt-image ~US$0,24 · RunPod 0,25 + 0,20 del 1er avatar cancelado (voz s4) · Modal ~0,04.

## Componentes nuevos (src/claudio/)
ClBowl3D (3D: capas del sarro, modos layers/brush/lower/paste/vinegar + lupa) · ClValve3D (3D: llave de paso) · ClPumiceTest · ClPasteRecipe · ClNotebook (libreta del gerente, strike) · ClVideoRef (cadena de videos: polaroid "ya en el canal"/"próximo video") · banco `ClKitSarro` (entry src/index_clkitsarro.tsx).

## Sonido nuevo (D:/Proyectos/sfx_pro, LICENCIAS.md)
+25: amb_hotel_hallway/_b, amb_hotel_lobby, valve_*, tp_*, ladle_pour, keys_*, lid_close_*, stir_*, powder_pour, sponge_bucket, bucket_pour, ceramic_scrape, chalk_eraser, pencil_*.
Cadena: `vlog/claudio/sound.mjs` (amb por escena, foley por prompt, diseño por componente/overlay), `sfx_gate.py`, `mix.py` nuevo.

## Gotchas nuevos
- ⛔ voz `claudio_mendoza_s4` = robótica (refs de audio sintético). Usar `claudio_definitiva` a 1.0. Avatar con s4 cancelado (US$0,20 tirados).
- Landing: `?src=<slug>` ahora muestra el arreglo de ESE video gratis + franja amarilla "¿Viene del video de Claudio?" (build_landing.mjs SAMPLES + app.js).
- ClBowl3D: lathe = media taza de ATRÁS (phiStart π/2+A0); bandas DoubleSide o no se ven.
- `sfx_gate` compara envolventes: buzzer_wrong_bass y ding_cooking_bell "suenan" como el whoosh/stinger de clborde → impact_echo y ding_oven.
- gptimg `ref` sólo acepta crop de cara 128x192 → el "después" del antes/después se hizo con inpaint OpenCV de la misma foto (b_ringclean_ab).
- D: el pagefile.sys subió a 29 GB a mitad del video (D 30 → 14 GB).
