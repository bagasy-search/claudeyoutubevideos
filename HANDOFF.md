# HANDOFF — Claudio Cocina (canal ES, Bagasy row 309) · rama ccfrijoles-render

Worktree `D:/Proyectos/video2-wt/ccfrijoles` = TODOS los videos cc* (ccfrijoles, cccostillas, ccejotes, cccafe, ccrepollo, ccmuslos, cccarne…).
Datos pesados en `D:/rtmp/cc/<slug>/` y, desde el 10-oct (D: lleno por otras sesiones), en **C:/rtmp_cc/** (arm/, out/*_mix.wav,
public/vid/<slug> y out/<slug>_avatar* son JUNCTIONS a C: — borrar con `rmdir` sin /S, nunca rm -rf).

## Formato (10-oct, cambio de plan por cuello de agnes)
- Avatar RunPod InfiniteTalk (ref claudio_look.png = public/ref_<slug>.png): 1er /run = tramos `av` (hook/cierre), 2º /run = `av2`
  (`SLUG=x python vlog/cc/av2sel.py 195` elige ~200 s de escenas "a cámara"; `AVTAG=2 AVK=av2 node vlog/cc/avatar_run.mjs build|run`).
  ≤240 s por /run. Si el proceso muere poleando: `... avatar_run.mjs poll` (retoma job.json, no paga otro /run).
  Cola serie: `bash vlog/cc/av2_cola.sh slug slug:1 …` (un /run por vez).
- Resto de vl: clip agnes si `check` dio "ok" (clips/check_hist.json) · si no, Ken Burns entre anclas (vl_kb).
- st = stock real Pexels juzgado por visión (≥25 % del metraje; reintento con `q2` + STOCK_ALT=1) · kf = agnes 2.5 héroe con sonido real.
- ⛔ LTX prohibido. ⛔ sin música/ambiente. CTA = Recetario de la Fonda US$19 + QR (nada gratis).

## Cadena por video
voz.py → ASR Modal → align/paras/seg → escenas.mjs → mkvlog → anclas · avatar×2 · stock · kf → `LIP=0.10 python vlog/<slug>/armar.py`
→ pausas.py → recorte.py → mkov.py → farm (`ENTRY=src/index_<slug>.tsx … node scripts/farm.mjs`) → encfin 2K → deliver_card.

## Estado
- ccfrijoles: montaje 18:46 (1125.9 s), real 302 s (26 %), av 286 s. Render farm en curso.
- cccostillas, ccejotes, cccafe, ccrepollo, ccmuslos: av2 elegidos, cola de 2º avatar; armar/recorte ya con av2 + salida en C:.
- cccarne: voz/ASR/seg/escenas/anclas/stock/kf/beds hechos o corriendo; scripts de montaje + index listos.
