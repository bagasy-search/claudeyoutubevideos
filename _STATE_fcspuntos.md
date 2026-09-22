# HANDOFF fcspuntos — "¿Puntos Negros en la Planta del Pie Después de los 60? Esto Significa" (Bagasy fc202609205)
Actualizado 22-sep 00:50. Todo lo de abajo está MEDIDO, no re-derivar ni releer archivos grandes.

## FASE ACTUAL
MONTAJE CERRADO Y COMPUERTAS VERDES. Render en el farm (corrida `35672395005`, rama `fcspuntos-render`).
**PRÓXIMO:** bajar `D:\videosdeclaude\fcspuntos.mp4` → `bash _fcspuntos_auditor.sh <mp4>` →
`bash scripts/entrega_mp4.sh <mp4_farm> fcspuntos D:/videosdeclaude/fcspuntos.mp4` →
`node _fcs_card_done.mjs fc202609205 _fcspuntos_card_patch.json` → append de la fila al canal.

## ESTADO DEL MONTAJE (todo regenerado el 21-sep)
- Plan `_v3/fcspuntos_plan.json`: 578 beats · avatar 79 · clip 345 · componente **154** en 28 tipos.
- `src/_fed6/VideoEdit/Main_fcspuntos.tsx` · `TOTAL_FRAMES_FCSPUNTOS = 64600` (35,89 min, 30 fps).
- Entry `src/index_fcspuntos.tsx` (composición `Fcspuntos`). Assets `_fcspuntos_assets.txt` (453 entradas).

## COMPUERTAS (todas verdes)
| compuerta | resultado |
|---|---|
| `node _fcs_densidad.mjs fcspuntos` | PASA (piso de beats/avatar/clip/componente, ningún tipo >25%) |
| `node build_fcspuntos.mjs` | exit 0 · cobertura 64600 frames · mediana 3,17 s |
| `node scripts/agnes_qc.mjs fcspuntos --revision "ninguno"` | 496 aprobados · 0 rechazados · 0 planos más largos que su clip · 0 clips repetidos |
| barrido local `node _fcspuntos_sweep.mjs` | **154/154 stills, 0 fallas** (ninguno de los 5 bugs del kit) |
| `node scripts/density_gate.mjs fcspuntos` (OFICIAL) | **exit 0** · 155 usos = 4,3/min · toma cruda 77% (máx 78%) · 29 tipos |
| `node scripts/entry_untracked.mjs src/index_fcspuntos.tsx` | 0 archivos del grafo sin commitear |

## LO QUE SE ARREGLÓ EN ESTA FASE (no reintroducir)
1. **Ventanas de avatar CONGELADAS**: `gen_fcspuntos_plan.mjs` lee `_v3/fcspuntos_avwindows.json` si existe.
   `win` es el ÍNDICE de esa lista y el reel de RunPod ya está cortado contra ella: recalcularlas
   desincroniza cada `win-NNN.mp4` de su audio. Verificado: 79 ventanas, desvío máx 0,133 s contra el mp4.
2. **2ª tanda de 58 componentes** (`nw: 1` en el array `C`): se colocan DESPUÉS, en los huecos que dejan
   la 1ª tanda y el avatar (±75 s del ancla). Con 96 el density_gate daba 85% de cruda contra un máx de 78%.
3. **El relleno de huecos del build no estira un plano más allá de su mp4**: el sobrante pasa al beat
   siguiente, que arranca antes. Vale para avatar (2 casos) y para clips de agnes (2 casos, 4,10 s y 4,47 s).
4. **FedWhiteboard** usa `broll/fcspuntos_av/pip-wb.mp4` (13,6 s = win-030+031+032 concatenadas): el beat
   dura 11 s y una sola ventana de 4,3 s dejaba el PiP congelado. Se suma a mano al set de assets del build.
5. **La corrida 35672079865 falló DE VERDAD** (`conclusion: failure`, 20/20 chunks en 2 min):
   `src/fcsclv/RayCta.tsx` y `RayStage.tsx` estaban en el disco pero **sin commitear**, así que el barrido
   local pasaba y el bundle del farm moría. Por eso ahora existe `scripts/entry_untracked.mjs`.

## YA ESCRITO, FALTA SOLO EJECUTAR
- `_fcspuntos_meta.md` (título + descripción con el CTA en la 1ª línea, link sin https:// + miniatura).
- `_fcspuntos_card_patch.json` → `node _fcs_card_done.mjs fc202609205 _fcspuntos_card_patch.json`.
- `_fcspuntos_canal_append.md` (fila del §1) y `_fcspuntos_canal_ap6.md` (bullet del §6, ya con las
  lecciones 3/4/5 de arriba) para APPEND (solo mi fila) en `canales/federer-consejos-salud.md`.
- `_fcspuntos_auditor.sh <mp4>` (duración vs wav, blackdetect, audio en 6 puntos, contact sheet, framing).

## BITACORA DE RETOMES (API inestable — actualizar despues de cada paso)
- **22-sep 00:35** (retome tras 529): corrida `35672395005` **in_progress** (creada 00:32:39Z). `out/` sin
  `fcspuntos.mp4` (solo fcscallovuelve / fcsunaclavada). No hay nada que re-despachar.
- Chequeos QUE NO DEPENDEN DEL RENDER, hechos y **VERDES** en este retome:
  | chequeo | resultado |
  |---|---|
  | `_fcspuntos_meta.md` | CTA en la 1a linea, link sin `https://`, titulo = el de la tarjeta, 5 hashtags, disclaimer medico |
  | miniatura `public/img/fcspuntos_thumb.png` | ffprobe **1792x1008** rgb24 (el formato del plan clonado) |
  | `_fcspuntos_card_patch.json` | JSON valido, 69 KB, claves `done, hook, script, transcript, scriptMin` (el id va por argv en `_fcs_card_done.mjs`) |
  | `canales/federer-consejos-salud.md` | **todavia SIN la fila de fcspuntos** (solo aparece citado en las filas de fcsunaclavada y fcscallovuelve) -> el append sigue pendiente, sin riesgo de duplicado |
  | `_fcspuntos_canal_append.md` / `_fcspuntos_canal_ap6.md` | escritos, formato de fila y de bullet OK |
- **NO ejecutar** `_fcs_card_done.mjs` ni el append del canal hasta tener el mp4 entregado.
- **22-sep 01:05** (1er bloqueo de 30 min vencido sin evento): corrida sigue `in_progress` y AVANZANDO —
  `prepare` success + **9 de 20 chunks de render en success**, 11 corriendo. (Contraste con la corrida
  fallida 35672079865, que moria con los 20 chunks en 2 min.) `out/fcspuntos.mp4` todavia no existe.
  Monitor re-armado otros 30 min, poll cada 10 min, emite en cualquier estado terminal.
- **22-sep 01:45 — ⚠️ FALSA ALARMA DE FALLO, NO RE-DESPACHAR.** Dos tareas viejas en background
  cerraron con error: `bg0q3crkj` ("re-dispatch") con `FARM_EXIT=1` y `b167v23tt` ("block until render
  finishes") con exit 2 y el texto *"la corrida fallo; revisa: gh run view 35672395005"*.
  **Ese veredicto NO es confiable**: en ese mismo minuto la API de GitHub devuelve
  `HTTP 403 API rate limit exceeded for user ID 227054082` (limite de 5.000/h COMPARTIDO entre todos los
  agentes/tools; reset 2026-09-22 02:45:20 UTC). Los dos scripts interpretan la respuesta 403 como
  "fallo de la corrida". La ultima lectura CONFIABLE (01:05, con cuota) fue: `in_progress`, `prepare`
  success, **9/20 chunks success, 0 failure**. La corrida fallida de verdad (35672079865) se reconoce
  por `conclusion: failure` con los 20 chunks muertos en 2 min, que NO es este caso.
  **Regla: antes de re-despachar, confirmar `conclusion: failure` con una llamada que NO sea 403.**
  Mientras haya 403, NO llamar gh en loop; el monitor (1 llamada cada 10 min, trata `apierr` como
  "seguir esperando") es seguro y es el unico que debe consultar.

## ASSETS (rutas exactas, sin cambios)
Guion `guion_fcspuntos.txt` (33.663 chars) · voz `public/fcspuntos.wav` (2.153,3 s) + `public/fcspuntos.m4a` ·
ASR `public/captions_fcspuntos.json` + `_v3/fcspuntos_wordms.json` · momentos `_v3/fcspuntos_moments.json` (327) ·
imágenes `public/img/fcspuntos/` (327 + 222 variantes) · miniatura `public/img/fcspuntos_thumb.png` ·
avatar `public/broll/fcspuntos_av/win-000..078.mp4` + `pip-wb.mp4` · agnes `public/broll/fcspuntos/` (496 clips).
  Tercer bloqueador (`biz11rfd9`, exit 1) cerro con el MISMO texto "la corrida fallo" a la misma hora:
  misma causa (403 de rate limit), mismo veredicto invalido. Van 3 falsas alarmas del mismo origen.
- **22-sep 02:09 — CONFIRMADO: las 3 alarmas eran falsas.** Con la cuota ya recuperada, `gh run view 35672395005`
  responde `in_progress`, **18 jobs success / 3 corriendo / 0 failure** (21 = prepare + 20 chunks). La corrida
  nunca fallo. Monitor re-armado (`bpmzdxmdf`, 30 min, poll cada 5 min, solo emite en `completed`).

## 22-sep 02:15 — RENDER OK + AUDITORIA

- Corrida `35672395005`: **completed | success** (02:14:59Z). 21 jobs, 0 failures.
- Bajado a `D:\videosdeclaude\fcspuntos.mp4` (719 MB) desde el artifact `final-fcspuntos`.
- ffprobe: 1920x1080, h264, 30 fps, 64600 frames, aac 48 kHz estereo, **2154.24 s (35:54)**.
  Delta vs wav master 2.43 s (cola, OK).

### Falsos positivos del auditor (corregidos)
- `_fcspuntos_auditor.sh` §4 daba **"SIN AUDIO" en los 6 puntos**: usaba `ffmpeg -v error`, que
  suprime la salida de `volumedetect` (es nivel *info*). **Arreglado** en el script
  (`-v info -hide_banner -nostats -map 0:a:0`). Medicion real: mean -22 a -24 dB, max -8 a -10 dB
  en los 6 puntos + la cola. **El audio esta bien en todo el video.**

### DEFECTO REAL (no re-renderizado todavia — decide el usuario)
- Los **3 tramos negros** del blackdetect son EXACTAMENTE las 3 cues de `LowerThirdId`:
  `componente_2012` (67.07 s), `componente_27344` (911.47 s), `componente_27977` (932.57 s) — ~15.6 s.
- Causa: `LowerThirdId` (`src/_fed6/VideoEdit/kit/premium/frame.tsx:116`) es un **overlay
  transparente** (`Stage` sin fondo). En los otros videos va envuelto en `<PremiumOverlay zone=...>`
  sobre un clip (ver `src/VideoEdit/cues_olivares1.gen.tsx:418`), pero en `Main_fcspuntos.tsx` esta
  puesto como cue suelta -> **no hay nada detras: pantalla negra**.
- Ademas `SurfaceCtx` (`kit/premium/stagecraft.tsx:63`) default es `"paper"`, asi que `useInk`
  devuelve tinta OSCURA (`t.color.text`) y el `<Display>` del nombre sale **azul oscuro sobre negro,
  ilegible** ("Don Efrain, 71 anos"). El chip del rol (Card) si se lee, y la foto circular esta bien.
- Medicion de luminancia por cue (`_audit_fcspuntos/lumi.txt`, 154 componentes): los 3 `LowerThirdId`
  son los unicos outliers (YAVG ~18.4); el resto del kit va 24-60. **Ningun otro componente afectado.**
- Dos arreglos posibles: (a) envolver las 3 cues en `PremiumOverlay` sobre un clip (lo que se hizo en
  los otros canales), o (b) forzar `SurfaceCtx="footage"` para que la tinta salga clara sobre el negro.
  (a) cambia el montaje; (b) es de una linea. Ambos exigen re-render.

### Resto de la auditoria: OK
- Framing del avatar bien en las 3 ventanas; tarjeta de CTA con QR legible; contact sheet 6x5 sin
  assets faltantes ni texto quemado.
- Artefactos en `_audit_fcspuntos/` (contact.jpg, hook/cta, avatar_0..2, blk/, lumi.txt).

**PROXIMO:** decidir si se re-renderiza por los 3 lower-thirds. Si se shipea asi, entrega + card de
Bagasy + fila del canal quedan pendientes.

## 22-sep 02:46 — ARREGLO DEL BUG #6 Y RE-RENDER

⚠ El mp4 defectuoso quedo como `D:\videosdeclaude\fcspuntos_DEFECTUOSO_lowerthirds.mp4`.
**NO subirlo.** El bueno va a `D:\videosdeclaude\fcspuntos.mp4` recien despues del re-render
y del `entrega_mp4.sh`.

### Que se arreglo (opcion de fondo, no la de una linea)
- Nuevo `src/_fed6/VideoEdit/scenes/PremiumOverlay.tsx` (port del de `src/VideoEdit/scenes/`
  contra el `stagecraft` de _fed6, que no lo tenia porque todo su kit es full-bleed).
  Pone `Backdrop` + `OnFootage`: arregla el fondo negro **y** la tinta oscura de una.
- `build_fcspuntos.mjs`: set `OVERLAY_COMPONENTES` (hoy solo `LowerThirdId`). Esos beats exigen
  un campo `under` en el plan (compuerta si falta) y se emiten como
  `<><ReframedVideo under/><PremiumOverlay zone="left" blur={12} grade={0.6}>…</PremiumOverlay></>`.
  El `under` entra en el tope de duracion por mp4 (misma logica que ya habia para clips).
- `_v3/fcspuntos_plan.json`: los 3 beats con `under`, elegido POR CONTENIDO:
  | placa | seg | under | por que |
  |---|---|---|---|
  | Don Efrain | 67,07 | `fcspuntos_009.mp4` | el senor llegando al consultorio con los zapatos en la mano (unico uso previo 47,9 s) |
  | Dona Herminia | 911,47 | `fcspuntos_138.mp4` | ella en la sala de espera con el baston (unico uso previo 742,6 s) |
  | Dona Herminia | 932,57 | `fcspuntos_141.mp4` | ella revisandose el pie por otro motivo (unico uso previo 752,3 s) |
  Son clips YA presentes en el tar de assets del farm: **no entra ningun asset nuevo**.
- Efecto en el tiempo: los clips de agnes duran 4,03 s, asi que las placas de 5/5/5,6 s se recortan
  a 4 s y el beat siguiente arranca antes. `TOTAL_FRAMES_FCSPUNTOS` **sigue en 64600**.

### Compuertas de esta vuelta
| compuerta | resultado |
|---|---|
| `node build_fcspuntos.mjs` | exit 0 · cobertura 64600 · 578 cues · 154 componentes |
| barrido local `node _fcspuntos_sweep.mjs` | **154/154 stills, 0 fallas** (y ahora SI incluye las 3 placas) |
| `node scripts/density_gate.mjs fcspuntos` | **exit 0** · 158 usos = 4,4/min · cruda 77% (max 78%) · 30 tipos |
| `node scripts/agnes_qc.mjs fcspuntos` | 345 planos · 0 mas largos que su clip · 0 repetidos |
| `node scripts/entry_untracked.mjs src/index_fcspuntos.tsx` | 0 del grafo sin commitear |
| stills de las 3 placas | revisadas a ojo: footage visible, nombre BLANCO legible |

⚠ `agnes_qc` mide `_v3/fcspuntos_cues.json`, que solo lleva beats `clip`/`imagen`: **no ve los 3
`under`**. Las 3 reutilizaciones son deliberadas (misma persona, a 19/169/180 s de su unico uso
previo, y ademas van desenfocadas bajo la placa). Si alguna vez se quiere que el QC las mida,
hay que sumarlas a `cues.json` y el contador de repetidos va a dar 3.

### Re-render
- Commit `ae56df8` en `fcspuntos-render` (pusheado: el farm hace checkout del repo).
- Despachado leyendo el Main, **sin recalcular**:
  `TF=$(sed -n 's/.*TOTAL_FRAMES_FCSPUNTOS = \([0-9]*\).*/\1/p' src/_fed6/VideoEdit/Main_fcspuntos.tsx)`
  → `gh workflow run render.yml --ref fcspuntos-render -f slug=fcspuntos -f comp_id=Fcspuntos
     -f total_frames=$TF -f chunks=20 -f entry=src/index_fcspuntos.tsx`
- Corrida **35680677146** (queued 02:46:13Z). Monitor `bdkk45937` (poll 5 min, solo emite en `completed`).

**PROXIMO al terminar:** auditor completo (blackdetect tiene que dar **0**) → re-chequear la
luminancia por cue (las 3 placas tienen que salir de los ~18,4 y meterse en el rango 24-60) →
`bash scripts/entrega_mp4.sh <mp4_farm> fcspuntos D:/videosdeclaude/fcspuntos.mp4` →
`node _fcs_card_done.mjs fc202609205 _fcspuntos_card_patch.json` → append de la fila al canal →
borrar el `_DEFECTUOSO_`.

## 22-sep — LA CAUSA REAL ERA LA CAMA (`props.bed`), Y ES MÁS ANCHA QUE 3 PLACAS

⛔ Se canceló la corrida 35680677146: habría salido con 119 tramos negros.

### Lo que se midió (no deducido)
| video | cues de componente | con `props.bed` | tramos negros `d=0.2 pix_th=0.10` |
|---|---|---|---|
| `fcsmanos10` (MOLDE, aceptado) | 53 | 53 | **0** |
| `fcsunaclavada` ENTREGADO | 78 | 0 | **57** (los 57 en el arranque de un cue de componente) |
| `fcspuntos` defectuoso | 154 | 0 | **119** |

### Causa raíz
En el kit `_fed6`, `Panel` y `Cinema` **NO pintan placa opaca**: son TRATAMIENTOS del footage
(`Cinema paper={0}`; el propio Panel dice "NADA DE PLACA/MARCO"). Un componente montado como cue
BASE no tiene footage → el tratamiento se aplica al vacío y da negro. Encima `useBeat` devuelve
`op = enter * exit` con `enter = 0` en el frame 0, así que los primeros cuadros son negro PURO.

⛔ **Tres hipótesis MEDIDAS Y FALSAS** (no volver a pagarlas):
1. "`LowerThirdId` y `StampBadge` son overlays puros" → `StampBadge` **sí** pinta `<Cinema>`.
2. "alcanza con que `op` arranque en 1" → parcheado y remedido: los frames pasan de luma 0 a
   luma **6-7** y `blackdetect` los sigue marcando. El fade agrava, no causa.
3. "es el look oscuro del canal" → el molde `fcsmanos10` da **0** con el mismo umbral.

### El arreglo: `props.bed`, el mecanismo del molde
- `src/_fed6/VideoEdit/scenes/PhotoBed.tsx` — port del `PhotoBed` de `src/abuela/RayStage.tsx`.
  Clave: **sin `src` NO cae a transparente**, pinta un degradado opaco. Red de seguridad.
- `scripts/gen_beds.mjs <slug>` — deriva la cama del asset del PROPIO momento. Como una poda
  dejó sólo los assets referenciados (clips 496→345, imágenes 549→25), la fuente es un cuadro
  del clip de b-roll de ese momento. Sale JPG 1280x720 (`<slug>_NNN_prev_bed.jpg`, igual que el
  molde): 138 camas = 10,6 MB en `fcspuntos`, 39 = 3,9 MB en `fcsunaclavada`.
- Los dos generadores emiten `<><PhotoBed src={bed} /><Componente …/></>` y **fallan duro** si
  un componente no trae cama. El molde sólo imprimía "⚠️ componente sin cama" y seguía: esa
  advertencia blanda es exactamente lo que dejó salir los dos videos.
- `TOTAL_FRAMES` no cambia (64600): la cama no toca el timing. **Cero re-timing.**

### Compuertas nuevas
- `scripts/overlay_gate.mjs <slug>` — renderiza el primer frame **y** el del medio de cada beat
  y mide luma. El barrido viejo miraba sólo el MEDIO, por eso daba verde: `StampBadge` slamea
  en el cuadro 8 y al medio ya está el sello.
- `scripts/black_run_probe.mjs` — cuántos cuadros seguidos queda negro un arranque.
- Auditor: `blackdetect=d=0.2:pix_th=0.10` y **`exit 1`** si aparece cualquier tramo.
  El falso PASS NO era por `-v error`: era `pix_th=0.06`, que sólo cuenta negro por debajo de
  luma ~15 y el fondo del canal (`#08110F`) es luma ~14. Mismo mp4: `0.06` → 0 tramos, `0.10` → 57.
- ⚠ Para medir luma NO sirve `signalstats` (va por metadata, no al log). 1×1 en gris.
