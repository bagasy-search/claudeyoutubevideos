# HANDOFF — furatones5 (Claudio el Fumigador #7 · "La casa de los Ramírez" ep. 7: los 5 lugares por donde entra el ratón)
Estado: ✅ ENTREGADO 9-oct (job 811, tarjeta plan-own-1791387464226-6, sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/furatones5/furatones5.mp4?v=1 (11:05,6 · 19.969 cuadros).
Auditor: minuto 1 sin silencios · negro 0 · congelados 0 (el detector cuenta 3 cortes en el min 1: es VLOG continuo, son 12 cambios de clip ancla→ancla).
Rama `furatones5-render`, sale de `fufruta-render`. Formato NUEVO: VLOG CONTINUO 100 % IA en movimiento (sin avatar, sin stock, sin fotos).

## Cadena (todo en vlog/furatones5/)
1. Guion `guiones/furatones5_filmado.txt` (9.880 car, tú neutro, chk.py 0) · tags v4 `tags.json` (75) · `rooms.json` (sala por párrafo).
2. Voz: `vlog/claudio/voz_blocks.py` (bloques POR SALA) → `voz_el.py --cps 15` (v4 Turbo, 14/14 al 1er intento, 761 créditos) →
   `sala.py` (SoX por sala, la cola de eco de un bloque pisa la entrada del siguiente: 0 silencios agregados) → public/furatones5.wav.
3. `seg.py` → 76 tramos (min 1: 4-6 s; resto 9,6-11,85 s, corte en fin de frase) · `scenes.json` (13 escenas) · `escenas.mjs` (dirección: base + [acción, fin] por clip).
4. `mkvlog.mjs` → un plan por escena. Anclas en ESTRELLA (K0 base desde la ref; K1..Kn todas desde K0) = 2 rondas de Batch, 89 anclas US$0,46.
   `gen_audio` = tramo CONTINUADO con el máster real hasta el segundo entero (agnes no queda callado ni repite la frase); armado `trunc`.
5. Clips: `clips.sh` (1 proceso por escena) + `sup.py` (compuerta y relanza) · compuerta `vl_check.py` (VL_DIR por escena; banda 300-3000 Hz; acepta r≥0,95).
6. ⭐ Donde agnes no entró: `ltx/mk.py` + `ltx/modal_ltx.py` (LTX-2.5 a2vid en Modal, foto = ancla de inicio, audio = tramo exacto, 5 H100 en paralelo):
   25 clips en ~10 min, 2.765 s de H100 ≈ US$3,0. `mkall.py`: agnes si pasó la compuerta → si no LTX → si no foto Ken-Burns con fundido al ancla de fin.
7. `agnes_vlog.mjs all/plan.json armar` (un solo armado: 20.326/20.326 cuadros, 0 s agregados) → `pausas.py` + `recorte.py`
   (81 pausas, −11,9 s, cortes ALINEADOS A CUADRO y select por número de cuadro; imagen y voz idénticas; grado nocturno en la escena "noche").
8. `mkov.py` (9 componentes, tiempos re-mapeados) · `src/index_furatones5.tsx` (vlog + ClCasa5×3, ClVideoRef×2, ClChip, ClBookPage p.15, ClQRCard×2)
   · `foley/mkfoley.py` (MMAudio caras tapadas, 38 clips) · `mix5.py` (ambiente por escena: ferretería/viento/garaje/noche generados con ElevenLabs SFX 880 créditos; −14 LUFS).
9. farm `ENTRY=src/index_furatones5.tsx FARM_REF=furatones5-render TAR_DIR=D:/rtmp/fu7 FARM_NOWAIT=1 node scripts/farm.mjs furatones5 Furatones5 19969 60 @_furatones5_assets.txt`
   → mix a assets-furatones5 → `encfin/push.sh furatones5 19969 60`.

## Qué funcionó / números
- Sala A (etiqueta v4 de ambiente) vs B (voz seca + SoX): MEDIDO, la etiqueta NO agrega eco (cola −23,4 dB = voz seca); SoX sí → B (elegida también por el creador).
- agnes 2.5-flash: 51/76 entregados y aprobados; ritmo 28-40 clips/h al principio, después 0-12/h (cola global llena; quota diaria de las cuentas).
  Clips a 12 s (T=12): 26 de 76 tramos; casi todos 9-12 s. Rechazos reales: agnes cambió la voz por otra (c23, c24, c31, c70) → LTX.
- Costuras: cortes limpios 57/75 (entre escenas y entre agnes/LTX); fundido sólo entre poses iguales.

## Gotchas
- ⛔ vl_check con envolvente de banda completa daba r 0,74 en clips buenos de afuera (agnes agrega viento/rumble) → medir en 300-3000 Hz.
- ⛔ Recorte de pausas sin alinear a cuadro = deriva acumulada (+0,2 s a −1 s al final, labios fuera de sync). select por `t` en float perdía cuadros → por `n`.
- ⛔ Grado nocturno fuerte (brightness −0,16 + viñeta) = casi negro → −0,05.
- ⛔ meta.mjs usa _v3/paras.json del máster: re-mapear con `mapear()` tras el recorte (backup _v3/furatones5_paras_master.json).
- ⛔ C: llegó a 256 MB (otra sesión); tar del farm en D:.
- agnes_vlog `gen_audio` y vl_check VL_DIR/banda/r≥0,95 están SÓLO en esta rama.
