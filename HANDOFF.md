# HANDOFF — fumoscas (Claudio el Fumigador #8 · "La casa de los Ramírez" ep. 8: moscas en la cocina)

Estado: ✅ ENTREGADO 9-oct (tarjeta `plan-own-1791387464226-7`, sin job de Bagasy, sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/fumoscas/fumoscas.mp4 (12:27,3 · 22.421 cuadros · 403 MB).
Auditor: minuto 1 con 0 silencios y 30 cortes (exigido ≥30) · negro 0 · "congelados" 5 = tarjetas estáticas a propósito (ClAsk×3 + ClQRCard), no video muerto.
Rama `fumoscas-render`, sale de `furatones5-render`. Formato CLÁSICO (cadena fuagua-style): voz de Claudio en OFF sobre planos vivos de la cocina de los Ramírez + componentes del kit encima.

## Cadena (todo en vlog/claudio/, guion en vlog/fumoscas/ y guiones/)
1. Guion `guiones/fumoscas_filmado.txt` (12.312 car) · `guiones/fumoscas.txt` (voz, 11.178) · fuente `D:/Proyectos/fumigador-guide/content/fixes.json` idx 7 = "Moscas" (Arreglo 8, pág. 16) · `chk.py fumoscas` 0 · tú neutro.
2. Voz: Fish Audio s2.1-pro-free, `claudio_definitiva` speed 1.0, 12 bloques (vlog/fumoscas/voz/), 3 reintentos por ASR Modal (compuerta por bloque) → `compress_hook` → `public/fumoscas.wav` (65,8 MB) + `fumoscas.m4a` (AAC 192k 48k).
3. `align` → `paras` → `dir_*.mjs` (dirección por escena, `bi`/`cl`/`c`) → timeline → `mk_imgs` → `agnes_img` (261 fotos agnes-image GRATIS) → `post_imgs`.
4. Cara de Claudio: `agnes-image-2.5-flash` + `public/ref_fumoscas_face.png` (plano `cl`). ⛔ SIN gpt-image, SIN avatar, SIN LTX, SIN stock.
5. Movimiento: `mk_i2v` → `agnes_i2v.mjs` (**v2.0**, default, sin cola): 30 clips. `agnes_qc.mjs --fix`: 30/30 ok · repetición {planos:30, loops:0, dobles:0}.
6. `gen_timeline --final` → `src/fumoscas/timeline.gen.ts` (TL + OV + AUDIO + TOTAL_FRAMES=22421) → `mk_entry` (`src/index_fumoscas.tsx`, ClMain) → `meta` → `mix` (`out/fumoscas_mix.wav`, −14 LUFS).
7. farm: `ENTRY=src/index_fumoscas.tsx FARM_REF=fumoscas-render TAR_DIR=… FARM_NOWAIT=1 node scripts/farm.mjs fumoscas Fumoscas 22421 … @_fumoscas_assets.txt` → run 37914667214 ✓ · assets 293 (+sfx compartidos).
8. Final 2K en farm: `encfin/push.sh fumoscas 22421 <chunks>` → run 37915602522 ✓ → release `fumoscas` con `fumoscas.mp4`.

## Qué funcionó / números
- Voz Fish claudio_definitiva: 12/12 bloques bien a la primera (0 créditos ElevenLabs, 0 dólares).
- agnes-image GRATIS: 261 fotos, 0 dólares. agnes-video v2.0: 30 clips, 0 dólares.
- Gasto total del video: ElevenLabs US$0 · Fish US$0 · Modal ASR ≤US$1 · OpenAI US$0 · RunPod US$0.
- Minuto 1: 30 cortes (3-5 s/plano), sin silencios >0,4 s a −32 dB.
- Continuidad: retoma de furatones5 (Lucía abrió la ventana, entraron 3 moscas, Jorge buscó aerosol). Cierra enganchando a `fumosquito` (mosquitos) + ClVideoRef `th_fumosquito`.

## Gotchas
- ⛔ `gen_timeline --final` tira exit 1 con "faltan … avatar" aunque haya 0 cues de avatar (avatar PROHIBIDO acá): es un falso requisito (`!AV_READY`). Confirmar 0 av cues y que los 338 assets existen → aceptar.
- ⛔ `agnes_qc` exige `_v3/fumoscas_cues.json` para medir repetición: correr `node scripts/agnes_qc.mjs fumoscas` DESPUÉS del gen_timeline (antes daba "repetición NO medida" y bloqueaba el farm).
- ⛔ farm pre-vuelo exige entry commiteado Y pusheado (rama local sin upstream = no pasa).
- ⛔ agnes "used up today's video generation quota" / "1 request every 3 minutes" NO es reject: `factory/lib/agnes_pool.mjs` lo clasifica como `quota` (QUOTA_REST 185 s). Parche commiteado con este video.
- Los 7 clips que se sostienen en su `_last.jpg` (Ken-Burns) no disparan freezedetect porque el Ken-Burns mueve el cuadro.
