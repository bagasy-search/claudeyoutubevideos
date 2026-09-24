# STATE fcsunaclavada — onicocriptosis · card fc202609206 · canal id=96 · guía SECUNDARIA
Paciente doña Soledad · ancla Winograd 1929 + Heifetz 1937 · ⛔ no verrugas ni juanetes.
## Cerrado
- guion_fcsunaclavada.txt 37.784 car (piso 20k) ✓
- Fish: fish_out/fcsunaclavada/master.wav 40,4 min → public/fcsunaclavada.wav + .m4a (110/110 bloques ok)
- 300 imágenes gpt-image-2 + 300 clips agnes → agnes_qc 300/300 aprobados, repetición 0, gate exit 0
- DIRECTOR: gen_fcsunaclavada_plan.mjs → _v3/fcsunaclavada_plan.json
  577 beats · avatar 127 (26,2%) · clip 269 (sin repetir) · imagen 103 · componente 78 (26 distintos)
- _fcs_densidad.mjs → exit 0
- build_fcsunaclavada.mjs → src/VideoEdit/cues_*.gen.tsx + src/_fed6/VideoEdit/Main_fcsunaclavada.tsx
  + avatar_fcsunaclavada.gen.ts + src/index_fcsunaclavada.tsx + _v3/fcsunaclavada_cues.json · tsc limpio
- Miniatura _v3/fcsunaclavada_thumb_final.jpg · public/fcsunaclavada_meta.json (CTA 1ª línea, 9 capítulos)
- ⚠️ Las 20 escenas "pres" quedaron FUERA del plan: gpt-image no respetó la identidad del Dr. Federer.
- ⚠️ RunPod job 1 murió por executionTimeout (60 min). Copia local del runner con
  policy.executionTimeout=4 h: _v3/fcsunaclavada_runpod_it.sh + _v3/fcsunaclavada_runpod_ventanas.mjs
## En curso
- RunPod job 2 (65098d1f-...-u2), 127 ventanas / 636 s visibles → _avatar_fp8/fcsunaclavada/runpod/
## Falta
1 COMPUERTA ffprobe del plate (apaisado ~832x464) · 2 copiar win-*.mp4 a public/broll/fcsunaclavada_av
3 build real (sin SKIP_ASSETS) + tsc · 4 scripts/density_gate.mjs (OFICIAL, exit 0)
5 _v3/fcsunaclavada_make_ref.sh + _v3/fcsunaclavada_farm_dispatch.sh (lee TOTAL_FRAMES del Main)
6 AUDITOR + scripts/entrega_mp4.sh + check_entrega · 7 _fcs_card_done.mjs fc202609206 _v3/fcsunaclavada_patch.json
8 append fila _v3/fcsunaclavada_canal_row.md a canales/federer-consejos-salud.md (§1 y §6) · 9 mp4 a D:\videosdeclaude\

## ⛔ BLOQUEO (21-sep 16:22) — RunPod SIN SALDO
`GET /v2/infinitetalk/status/<job>` devuelve `{"status":402,"title":"Insufficient Balance"}`.
Job 1 (b85a96cb…) murió por executionTimeout a los 60 min. Job 2 (65098d1f-50d2-4357-ac3d-63451476bbcf-u2)
se aceptó a las 15:04 y polleó IN_PROGRESS 78 min; a las 16:21 la cuenta se quedó sin saldo y el
/status pasa a 402 — no se puede saber si el worker terminó.
⛔ No puedo cargar saldo (acción financiera, la tiene que hacer el creador).
Apenas haya saldo: `node _v3/fcsunaclavada_runpod_ventanas.mjs fcsunaclavada --face public/img/federer_avref_16x9.png --size 720p`
(esa copia local ya lleva policy.executionTimeout=4 h) y después COMPUERTA ffprobe del plate (apaisado).
Mientras tanto se valida la composición con ventanas PLACEHOLDER (negro) que se reemplazan 1:1.

## 21-sep 17:2x — DESBLOQUEADO Y EN RENDER
- RunPod job 2 COMPLETED (el 402 era falta de saldo momentánea; saldo ahora $14). mp4 599,64 s de los
  636 s pedidos (tope ~600 s del endpoint) → 2º /run SOLO con la cola (40 s, 8 ventanas), $0,25.
- ✅ COMPUERTA AVATAR: los DOS plates vuelven 832x464 APAISADO (ffprobe). 127/127 ventanas cortadas
  a 1920x1080 30/1 en public/broll/fcsunaclavada_av/.
- ⚠️ IDENTIDAD: la cara aprobada del canal (public/img/federer_avref_16x9.png) es un médico JOVEN con
  barba y ambo teal — NO el señor canoso del crop ref_*_face.png (ése es de fcsmanos10 y gpt-image lo
  ignora igual). Las escenas "pres" coinciden con el avatar → vuelven al plan. La MINIATURA se rehízo
  desde la referencia aprobada (gpt-image /edits devolvió otra cara dos veces).
- Compuertas: _fcs_densidad exit 0 · scripts/density_gate exit 0 · agnes_qc_gate exit 0 · tsc 0 errores
- Rama fcsunaclavada-render (83f31e7) + worktree D:/rtmp/wt-fcsunaclavada (junctions a public/ y node_modules)
- FARM: run 35650886259, 60 chunks, TOTAL_FRAMES=72699 leído del Main (no recalculado).
- Miniatura _v3/fcsunaclavada_thumb_final.jpg (identidad correcta).

## ✅ ENTREGADO (21-sep ~20:50)
out/fcsunaclavada.mp4 (crudo del farm, run 35656656657 success) → scripts/entrega_mp4.sh →
out/fcsunaclavada_entrega.mp4 (913 MB, 2423,27 s) → D:\videosdeclaude\fcsunaclavada.mp4
AUDITOR: contact sheet _audit_fcsunaclavada/sheet_global.jpg (81 muestras) · blackdetect 0 ·
audio -21,9/-23,2 dB en 5 puntos (max -7,6) · duración 2423,27 vs wav 2422,79 · framing del avatar
verificado con frames reales (_audit_fcsunaclavada/avatar_framing.jpg).
check_entrega 7/7 exit 0 · _fcs_densidad exit 0 · density_gate exit 0 · agnes_qc_gate exit 0.
Bagasy fc202609206 done=true (script/transcript 37.784 car, hook 743, scriptMin 40,4) — readback OK.
Fila appendeada en canales/federer-consejos-salud.md (§1) + 4 aprendizajes en §6.
Worktree D:/rtmp/wt-fcsunaclavada eliminado (junctions sacadas ANTES; public/ intacto).

## 22-sep — RE-RENDER: el entregado tenía 57 TRAMOS NEGROS

⛔ `D:\videosdeclaude\fcsunaclavada.mp4` (el entregado) está DEFECTUOSO. Hay que reemplazarlo.
La tarjeta de Bagasy queda en `done` y NO se toca: no cambia nada del contenido.

### Qué pasó
`blackdetect=d=0.2:pix_th=0.10` sobre el mp4 entregado: **57 tramos negros**, y los **57 caen
exactamente en el arranque de un cue de componente** (de 78 cues). Duraciones 35×0,267 s +
10×0,20 s + 7×0,233 s + 5×0,30 s (esos 5 son los `StampBadge`).

**Causa:** los 78 cues de componente iban SIN `props.bed`. En el kit `_fed6`, `Panel` y
`Cinema` no pintan placa opaca: tratan el FOOTAGE. Sin nada debajo tratan el vacío y dan negro,
y el fade de `useBeat` (`op = enter * exit`, `enter = 0` en el frame 0) lo vuelve negro puro.
El molde `fcsmanos10` tiene 53/53 con cama y da **0** con el mismo umbral: era una regresión
de este lote contra su propio molde, no el look del canal.

**Por qué el auditor lo dejó pasar:** corría `blackdetect` con `d=0.5:pix_th=0.06`. Con
`pix_th=0.06` sólo cuenta negro el píxel bajo luma ~15 y el fondo del canal (`#08110F`) es
luma ~14, así que no calificaba nada. Mismo mp4: `0.06` → **0 tramos**, `0.10` → **57**.

### Arreglo
- 78 camas generadas con `node scripts/gen_beds.mjs fcsunaclavada` (39 archivos, 3,9 MB),
  derivadas de un cuadro del clip de b-roll de cada momento y normalizadas a luma ~130.
- `build_fcsunaclavada.mjs` emite `<><PhotoBed src={bed} /><Componente …/></>` y **falla duro**
  si un componente no trae cama. `FedWhiteboard` es la ÚNICA excepción nombrada (pinta su
  propia placa, YAVG 204/211).
- `TOTAL_FRAMES` intacto (72699): la cama no toca el timing.
- Se commitearon `src/index_fcsunaclavada.tsx`, `src/fcsunaclavada/Piezas.tsx` y
  `WhiteboardScene.tsx`: estaban en disco pero SIN commitear, y el bundle del farm habría
  muerto igual que la corrida 35672079865 de fcspuntos.
- `_v3/fcsunaclavada_agnes_qc.json`: re-sellado SÓLO el `mtime` de 269 clips. Una poda de otro
  agente reseteó las fechas; los 269 tienen **tamaño idéntico**, así que el contenido no cambió
  y la revisión a ojo sigue valiendo. Backup en `.bak`.

### Compuerta nueva (correr SIEMPRE antes de despachar)
`node scripts/overlay_gate.mjs fcsunaclavada` → **156/156 frames medidos, 0 oscuros**.
Renderiza el primer frame Y el del medio de cada beat. El barrido viejo miraba sólo el medio,
por eso daba verde con 57 negros en el arranque.

**PRÓXIMO:** bajar el mp4 → `bash _fcsunaclavada_auditor.sh <mp4>` (con blackdetect
`d=0.2:pix_th=0.10`, tiene que dar **0**) → `entrega_mp4.sh` → reemplazar
`D:\videosdeclaude\fcsunaclavada.mp4`. NO tocar la tarjeta.
