# HANDOFF — fbgranito (El Constructor Libre, serie "Mezclá X con Y", video 1 de 10)

Estado: ✅ ENTREGADO 7-oct (job 760, tarjeta fbmz1791336952476-0 del row 59 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/fbgranito/fbgranito.mp4 · local D:/videosdeclaude/fbgranito_entrega.mp4 (15:10, 27.307 cuadros).

## Números
- Voz claudio_definitiva 913 s crudo (16/16 bloques, 14,62 car/s) → 909,8 s con el gancho comprimido. Alineación 0,984.
- Minuto 1: 32 cortes · 0 silencios · cara en el seg ~6 · "ERROR" sobre el barniz cayendo en el seg 0. Negro 0 · congelados 0.
- Avatar RunPod 1 job, 33 ventanas, 183,6 s, US$0,25, lag -0,10..0. Avatar 19,4 % · metraje real 26,0 % · agnes 8,1 %.
- QR legible en el MP4 final en las 3 CTAs (5:40 · 10:27 · 14:33), → /regalo?src=fbgranito#granito.
- Sonido: 251 efectos, 70 ambientes, mezcla -14,1 LUFS / TP -1,8. Sin música.
- Costo ≈ US$0,60 (gpt-image 158 + ref ~US$0,32 · RunPod 0,25 · Modal ~0,04).

## Cadena = vlog/claudio adaptada al Constructor (en ESTA rama)
- `vlog/claudio/lib.mjs`: WHO = presentador del canal (camisa verde oliva + delantal de cuero), escena patio-taller, luz de DÍA brillante.
  ⛔ Sacada la frase "Any bottle label is plain blank white" del TAIL: metía botellas blancas en ~40 fotos.
- `vlog/claudio/sound.mjs`: ambiente por defecto = backyard (no baño).
- Ref avatar = `public/ref_fbgranito.png` (generada: cara claudio_hd + ropa de tomas.jpg, 1536x1024 low Batch, `vlog/fbgranito/mk_ref.mjs`).
  Para el video N: copiar ref_fbgranito*.png como ref_<slug>*.png (mismo presentador en toda la serie).
- `public/med` = stub de 3 archivos (copiar de clsilicona) o el pre-vuelo del farm frena.
- Meta: `vlog/fbgranito/meta_fb.mjs` (1ª línea = regalo gratis con ?src, 2ª = Colección). Entrega: `scripts/deliver_card.mjs <channel_key> <card_id> <slug> --no-youtube`.

## Gotchas de esta corrida
- El stitch del farm falló 2 veces con "MP4 CRUDO (remux a CFR)": el render está sano → `gh run download <id> -n final-<slug>-RAW` + `entrega.sh`, y subir el release a mano.
- `agnes_qc` hay que re-correrlo después de cada `gen_timeline --final` (el pre-vuelo exige la repetición medida con cues.json).
- `sfx_gate --prev` contra el conserje es inútil (otro canal): sin --prev en el video 1; desde el video 2 usar `--prev D:/Proyectos/video2-wt/fbgranito/:fbgranito`.
- Stock: el juez aceptó 17 off-topic en 3 tandas (pareja joven como "vecino", cuchillo como "lija", especias como "óxido", pájaro en el poste…) → hoja a ojo SIEMPRE.
- agnes: 12/34 rechazados a ojo en la 1ª vuelta, 3 más en la 2ª (personas que desaparecen, manos que se derriten).
