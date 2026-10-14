# HANDOFF clmezcla — video 7 de Claudio el Conserje
Estado: ENTREGADO 14-oct-2026. Tarjeta plan-own-1791284273106-6, job 968, sin YouTube (--no-youtube).
- Final: release clmezcla/clmezcla.mp4 (16:16, 1920x1080 bt709 tv, keyframes 2 s). Copia local: D:/videosdeclaude/clmezcla.mp4
- Auditor: cuadro 0 = avatar · minuto 1 con 32 cortes y 0 silencios · 0 negros · 0 cuadros congelados. Plan: avatar 27,3 % · hueco máx 19,6 s · cl 40
- Avatar: 1 /run RunPod (US$0,25) · agnes 35 clips (34 OK) · metraje real 28,2 % · mezcla I −14,0 / TP −1,8
- DUDA: la landing ?src=clmezcla ofrece la página 15 GRATIS ("Su arreglo está gratis acá abajo"); no la toqué
- DUDA: los clips de agnes no traen audio (clips_con_audio 0): queda sólo la voz

## Cadena (en orden)
voz.py → compress_hook.py → asr_groq.py → align.py → paras.py → dir_a/b/c → timeline.mjs → plan_lint.mjs → mk_imgs → gptimg (4+4 primero)
→ post_imgs.py → stock.mjs → mk_i2v → agnes_multishot → agnes_qc --fix → avatar_run build/run → avatar_post → gen_timeline --final → mk_entry → mix.py
→ farm.mjs (STITCH_RAW=1) → encfin-<slug> (rama huérfana: encfin.yml + params.json, usa assets-<slug>/<slug>_mix.wav) → audit.py → meta.mjs → job.mjs → deliver_card

## Trampas
- post_imgs sólo hace _last.jpg para el stock: los clips de agnes necesitan su _last.jpg con ffmpeg antes de correr gen_timeline --final
- el farm necesita public/med copiado en el worktree
- timeline: las tomas cortas se corren en cascada (ya no se tiran); MIN es 0,9 s en el minuto 1
- las tarjetas de Bagasy no tienen slug: se buscan por cta_url ?src=<slug>
- sonido: SFX y ambientes apagados salvo SFX_ON=1; el audio de los clips va −22 dB debajo de la voz
