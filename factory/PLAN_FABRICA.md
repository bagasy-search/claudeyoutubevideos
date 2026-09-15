# 🏭 PLAN FÁBRICA — prompt maestro para Claude (x10 videos, misma calidad)

> **Para vos, Claude, en cualquier chat futuro.** Si estás leyendo esto es porque vas a
> tocar el pipeline de video (`video2`). Este documento es la ORDEN VIGENTE del creador
> (15-sep-2026): dejar de armar cada video a mano y convertir el pipeline en una FÁBRICA.
> No hace falta que el usuario te lo recuerde. Leé §0–§2 siempre; el checklist §4 es el
> trabajo; el LOG §7 dice por dónde vamos. **Al terminar cada sesión, actualizá §7.**

---

## §0. La orden, en una frase

**Un solo motor versionado (`node factory/run.mjs <slug>`) que lleva un `spec.json` de
guion a MP4 entregado, idempotente, reanudable, paralelo, con compuertas que FALLAN si no
miden, con recursos compartidos arbitrados por una cola — y Claude sólo en lo creativo.**
Meta: 5–10 videos/día sin supervisión, misma calidad que fa70estudios / tcfiltro.

## §1. Diagnóstico (medido en los videos 11–15 sep 2026 — no re-investigar)

Cómputo real por video ≈ 2–2,5 h (Fish ~23 min · agnes 40–55 · avatar 26–50 · farm 24).
Pago < US$2. Pero cada video tarda medio día a 2 días (fcspellizco ≈ 2 días). Causas:

| # | Sumidero | Evidencia |
|---|---|---|
| S1 | **Clonar scripts del slug anterior** → bugs viajan | `build_tcestufa.mjs`→tcbriquetas estiró planos sobre avatar (92/177 s tapados, compuertas verdes, 1 re-render); ~92 generadores agnes por slug; `_dispatch.sh` clonado reintentó 12×5 min (facrema81); 278 `build_*.mjs` en `scripts/` |
| S2 | **Compuertas/exit codes que mienten** | farm Vast "success" con 0 clips (fcspellizco); `farm.mjs` exit 0 con un `@` o cancelado (clembudo); luma=0 porque ffmpeg escribe a stderr; `ya estaban N` exit 0 sin generar; `density_gate` frames≠segundos; `clip=` inexistente salteado en silencio; juez visión colgado 30 min sin timeout |
| S3 | **Recursos compartidos sin árbitro** | C: al 100% en 5 videos + sesión que borró assets de otra (farinon/facrema81); agnes 429 por cupo compartido (~1 h perdida); 403 secundario GitHub hizo "falló" con render sano (4 videos); OpenAI sin crédito a mitad (castorglove parado); farm baja a 15–30 chunks con otros videos |
| S4 | **Claude orquestando turno por turno** | skills 3.376 líneas cargadas en cada llamada; ~127M tokens/video mediana; polls, imágenes leídas en hilo principal, 57% de Bash = `cd` sueltos; 6–13 subagentes de guion (prohibido 13-sep) |
| S5 | **Reglas viejas en memoria/skill** | Vast en vez de RunPod; "≤5 min por job"; tope RunPod ~600 s ignorado → 3 jobs en fcspellizco/fcscanas/fcsmanos10; pad 0,15 s atrasó lipsync en 121/122 ventanas |
| S6 | **Bugs de herramientas sueltas** | `asr_openai.mjs` 3er arg 5 vs 600 (Whisper inventó frases); `openai_batch_images.mjs fetch` crashea con 140 imgs y con 2 args; Fish loops con bloques 2500 chars (usar ≤1200); `runpod_it.sh` sube inputs a GitHub (403) |
| S7 | **Entrega manual** | re-subir mp4 con `?v=N`; m4a subido como `_fish.wav`; stitch usó audio de chunks (tcestufa); meta JSON a mano |

## §2. Reglas NO negociables (la calidad NO se toca)

Estas siguen mandando y la fábrica las CODIFICA, no las relaja:
- Avatar = RunPod público, un /run con todo lo visible, 2º sólo con la cola si vuelve corto (cap ~600 s). Sólo ventanas visibles (~27%). Sin pad que corra el lipsync.
- ASR = Modal por defecto; OpenAI whisper-1 sólo respaldo.
- Cada plano = lo que se dice en ese segundo · cobertura ≥90% · ≥25% metraje REAL · prompts de escena VIVA + ultradetalle (dirección manda).
- Clips agnes sólo por `scripts/agnes_i2v.mjs` + `agnes_qc.mjs --fix`; nunca repetir un clip; nunca pedir "respirar".
- Ruteo imagen: sin presentador→Klein; con presentador→gpt-image low `/edits` por Batch.
- MP4 del farm no se entrega crudo (reencode salvo que ya sea `tv`); pts==dts.
- Nombre personal nunca visible; no subir a YouTube hasta la FINAL; avisar proactivo al terminar.
- No borrar assets pagos. Finales → D:.
- Voz Federer = `federer_definitiva`.

Si una regla de §2 contradice código viejo, gana §2. Si contradice una skill, gana §2 y se corrige la skill.

## §3. Arquitectura objetivo

```
video2/factory/
  run.mjs                 # CLI: run <slug> [--from fase] [--only fase] [--dry]
  spec.schema.json        # contrato del video (validado con ajv)
  lib/
    state.mjs             # _state/<slug>/<fase>.json {ok, medido:{...}, inputsHash, ts}
    gate.mjs              # assertMeasured(nombre, valor, {min,max}) — tira si 0/NaN/undefined
    exec.mjs              # run(cmd) captura stdout+stderr, exit≠0 → throw, timeout obligatorio
    lease.mjs             # semáforos en Supabase: agnes, runpod, openai, fish, farm, disk
    gh.mjs                # GitHub con backoff exponencial + cache; nunca poll <5 min
    budget.mjs            # chequeo de saldo OpenAI/RunPod/Fish ANTES de encolar
    paths.mjs             # TODO path del slug sale de acá; nada fuera de su carpeta
  phases/
    00_preflight.mjs      # disco, saldo, keys, spec válido, commit limpio
    10_voice.mjs          # Fish bloques ≤1200 + ASR por bloque, detector de loops
    20_asr.mjs            # Modal; fallback OpenAI con args correctos
    30_direct.mjs         # UNA llamada Claude → beatsheet.json validado (ver §5)
    40_images.mjs         # Klein / gpt-image Batch con fetch en stream
    50_agnes.mjs          # i2v + QC + sello
    55_avatar.mjs         # RunPod ventanas visibles, auto-cola si <audio
    60_build.mjs          # beatsheet → props Remotion (UN build genérico por estilo)
    70_gates.mjs          # todas las compuertas, fail-closed
    80_render.mjs         # farm con commit verificado = disco
    90_deliver.mjs        # stitch con wav máster, reencode, release, meta, aviso
  styles/<canal>.json     # paleta, componentes, CTA, voz, avatar_ref, reparto de planos
  tests/fixtures/         # video "trampa" con defectos conocidos (control positivo)
```

Principios: **fase = función pura sobre disco** (inputs hasheados → si hash igual y `.done`, skip);
**fases independientes corren en paralelo** (tras 20_asr: 40→50, 55 y 60 a la vez);
**nada de scripts por slug** — lo específico va en `spec.json`/`styles/`.

---

## §4. CHECKLIST MAESTRO (marcá `[x]` + fecha + commit al terminar cada ítem)

Cada ítem tiene **Criterio de aceptación (CA)**. No se marca sin cumplir el CA medido.

### FASE A — Cimientos (primero, sin esto no hay nada)
- [x] **A1. Rama y carpeta.** Rama `factory` desde `main` actualizado (NO desde `clembudo-render`). Crear `factory/` según §3. CA: `node factory/run.mjs --help` imprime fases. — ✅ 15-sep `06cd6c8`…`d0cba2e`, armada con índice propio (no toca el índice compartido), CI `factory-tests` verde.
- [x] **A2. `lib/exec.mjs`.** Wrapper único de procesos: captura stdout **y** stderr, timeout obligatorio, exit≠0 → throw con cola del log. CA: test con `ffmpeg -f lavfi ... signalstats` devuelve luma≠0 leyendo stderr; comando colgado muere al timeout. — ✅ tests (gris >100, negro <25, timeout mata). Extra: `expect` exige marca positiva (exit 0 sin la marca = fallo).
- [x] **A3. `lib/gate.mjs` fail-closed.** `assertMeasured` tira si valor es 0/NaN/undefined/lista vacía salvo `allowZero` explícito; SIEMPRE imprime `GATE <nombre>: midió=<n> sobre <total>`. CA: test unitario de los 5 casos. — ✅ + `assertNoProblems` ("0 problemas" con 0 inspeccionados = fallo) + `GateReport` → GATES.md.
- [~] **A4. `lib/state.mjs`.** Estado por fase con hash de inputs; `--from`/`--only`; reanudación. CA: matar el proceso a mitad de 50_agnes y relanzar retoma sin rehacer lo sellado. — implementado y probado en unidad (fresca/rehacer, escritura atómica); batch ids de OpenAI y job ids de RunPod persistidos. ⏳ CA con un kill real sin medir.
- [~] **A5. `spec.schema.json` + `styles/`.** Campos: slug, canal, modo(avatar|narrador), guion_path, voice_id, avatar_ref, idioma, cta{landing,qr}, estilo, duración objetivo. CA: los 4 videos buenos (fa70estudios, tcfiltro, fcsmanos10, tcestufa) se expresan como spec sin campos extra. — `lib/spec.mjs` (valida typos) + `styles/taller-de-claudio.json`; specs de tcfiltro/tcbriquetas. ⛔ fa70estudios/fcsmanos10 (montaje Federer con componentes) todavía NO tienen montaje en la fábrica.
- [x] **A6. `lib/paths.mjs` y aislamiento.** Todo asset en `public/<slug>/…` y `_work/<slug>/…`; prohibido escribir/borrar fuera del slug. CA: grep en `factory/` no encuentra rutas armadas a mano. — ✅ `slugPaths` + `insideSlug` (test de prefijo parecido); únicas rutas fijas: `_v3/<slug>_i2v.json` y `_cues.json` que exigen agnes_qc/agnes_qc_gate compartidos.

### FASE B — Recursos compartidos (mata S3)
- [x] **B1. `lib/lease.mjs`** con tabla Supabase `factory_leases(resource, holder_slug, units, expires_at)`: agnes (N claves), runpod, openai_batch, fish, farm_slots(60), disk_gb. TTL + heartbeat. CA: dos `run.mjs` simultáneos nunca superan el cupo de agnes; lease vencido se libera solo. — ✅ backend local (mkdir atómico, heartbeat, vencidos se limpian); tests: 10 pedidos concurrentes con cupo 4 → 4. SQL para dos máquinas en `factory/sql/factory_leases.sql` (⏳ sin aplicar: el MCP de Supabase no está autorizado).
- [~] **B2. `lib/budget.mjs`.** Antes de encolar fase paga: saldo OpenAI, RunPod, Fish; si no alcanza para el estimado → fase queda `blocked:credit` y AVISA (no arranca a medias). CA: con key sin saldo, castorglove queda bloqueado en preflight, no a mitad. — RunPod se consulta en 00_preflight (< US$0,50 → blocked); OpenAI NO expone saldo con key normal → el primer `insufficient_quota` deja 40_images en `blocked` reanudable (batch ids persistidos). Clave RunPod movida a `.env` (estaba quemada en 12 scripts sueltos). ⏳ CA castorglove sin medir.
- [x] **B3. Disco.** Preflight exige ≥X GB libres en C: y D:; único proceso de limpieza (`factory gc`) que sólo borra derivados regenerables de slugs `delivered`, nunca assets pagos. CA: `factory gc --dry` lista y no toca slugs activos. — ✅ `gc` (dry por defecto, `--apply`) sólo con 90_deliver done y dentro del slug; preflight `FACTORY_MIN_C_GB`/`FACTORY_MIN_D_GB`.
- [x] **B4. `lib/gh.mjs`.** Backoff exponencial ante 403 secundario, cache de `release view`, polling ≥5 min, y "falló por rate limit" ≠ "falló el render" (verificar el asset real). CA: simular 403 → reintenta y reporta estado real. — ✅ tests (403 ×2 → ok; 404 no se reintenta); `waitRun` exige success + 0 jobs fallidos + >0 ok; `releaseAsset` compara bytes.
- [~] **B5. Cola.** `factory queue add <slug>` / `factory worker` que toma specs y respeta leases; integrable con el worker de Bagasy. CA: 4 specs encolados corren sin pisarse. — `queue add|ls` + `worker --n` implementados. ⏳ CA con 4 videos reales sin medir (H3).

### FASE C — Fases del motor (mata S1, S6)
Para cada fase: extraer la versión SANA (fuente: scripts usados en **fa70estudios** y **tcfiltro**), no la última copia.
- [~] **C1. 10_voice.** Fish bloques ≤1200 chars; ASR por bloque; detector de loops (n-gramas repetidos ≥3) → regenera sólo ese bloque; concat a wav máster único. CA: guion de tcbriquetas sale sin loops en una pasada. — compuerta blockChars ≤1200, loudnorm 2 pasadas (lee stderr), detector de bucles por n-gramas en 20_asr (test). ⏳ regeneración automática SÓLO del bloque con bucle: falta; CA sin medir (paga).
- [~] **C2. 20_asr.** Modal default; fallback OpenAI con chunk=600 s fijo en código (no por arg posicional). CA: timestamps por palabra, mediana error ≤~80 ms vs referencia. — implementado + alineación global genérica (`factory/py/align.py`); momentos portados dan **idénticos** al legado (tcfiltro 281/281, tcbriquetas 246/246). ⏳ CA de precisión sin medir.
- [~] **C3. 40_images.** Ruteo Klein/gpt-image automático por plano (flag `presentador` del beatsheet); Batch con fetch en STREAM (sin crash a 140+); filtro "gente inventada" y "objeto equivocado" (tcestufa anafe) por visión barata con muestreo. CA: 150 imgs fetch sin crash; reporte de rechazos con números. — `lib/openai_batch.mjs` (edits+generations, STREAM, batch ids persistidos, sin crédito → blocked). ⛔ Klein y filtro de visión: faltan.
- [~] **C4. 50_agnes.** Envolver `agnes_i2v.mjs` + `agnes_qc.mjs --fix`; regex de reintento correcta (fcspellizco tiraba 179/195); "ya estaban N" sólo cuenta clips con sello válido; throughput esperado ~7 clips/min como alarma. CA: re-run no duplica clips; 429 → espera lease, no falla. — envuelve el camino único, lease agnes, `--fix` automático, revisión a ojo → `needs` con comando exacto; cuenta aprobados por sello. ⏳ CA sin medir.
- [~] **C5. 55_avatar.** RunPod: ventanas visibles del beatsheet; UN /run; si mp4 < audio → 2º /run con la cola exacta; `executionTimeout` alto; inputs hospedados en Supabase/R2 (nunca GitHub); **sin pad** de ventanas; compuerta de sync (`avatar_sync_gate.mjs`) con offset medido. CA: farinon (792 s) resuelve en ≤2 jobs y offset |≤40 ms| en todas las ventanas. — implementado (1 job; cola cortada en borde de ventana; Supabase; job ids persistidos; sync corr ≥0,35 y desfase ≤40 ms; clip por ventana ±2 cuadros). Ventanas portadas = legado tcfiltro (Δ 0,000 s). ⏳ CA farinon sin medir (paga).
- [x] **C6. 60_build GENÉRICO.** Un solo build por estilo que lee beatsheet+style. Fix del bug tcestufa/tcbriquetas: **ningún plano puede solaparse con ventana de avatar visible** (assert). Respeta máx 3 s/img, ≤12 palabras por componente, staggers relativos a duración. CA: tcbriquetas reconstruido desde spec da 0 s de avatar tapado. — ✅ `lib/vlogplan.mjs` + `lib/timeline.mjs`: tcbriquetas desde spec (DRY) = 315 cues, 37.612 cuadros, **0 s tapado**, pasa `tsc`; tcfiltro con sus assets = 0 s (entregado: 73 s). ⛔ Sólo montaje vlog-crudo (componentes/Federer: falta).
- [~] **C7. 80_render.** Preflight: `git status` limpio en archivos del build y `HEAD` pusheado (el farm rinde el COMMIT, el tar sale del DISCO); lista `@assets` validada (≥ N, sin 404, sin `_blur.jpg` derivado en runtime); reparto por costo + `stitch_raw`; cancelada ≠ exit 0. CA: render de 24–30 min con 60 slots cuando hay cupo. — commit del árbol de imports leído del DISCO con índice propio y verificación blob por blob (test en repo temporal: HEAD e índice compartido intactos); farm con `expect WAIT_RUN`, reintento por rate limit con REUSE_ASSETS, `waitRun` estricto, desvío de duración ≤0,6 %. ⏳ CA sin render real.
- [~] **C8. 90_deliver.** Stitch SIEMPRE con wav máster; reencode según `reference_entrega_reencode_*`; verificar pts==dts; subir con nombre y extensión reales; `?v=N` automático; meta JSON (título/descr/links https) generado de spec; aviso proactivo. **No sube a YouTube.** CA: ffprobe OK y link final impreso. — re-encode con máster mono→estéreo (pan), check_entrega, saltos de PTS del archivo entero, blackdetect, hoja de contactos, release con bytes verificados, `?v=N`, Bagasy sólo con `FACTORY_DELIVER=1` y siempre `--no-youtube`. Meta = `needs` (creativo). ⏳ CA sin corrida real.

### FASE D — Compuertas que no mienten (mata S2)
- [x] **D1. Inventario.** Listar TODAS las compuertas actuales (`*_gate.mjs`, `audit_*.mjs`, `density_gate`, `dark_gate`, `broll_isolation_gate`, `check_redibujo`, `vision_haygente`, `agnes_qc_gate`). Para cada una: qué mide, puede dar verde sin mirar?, falsos positivos conocidos. — ✅ `factory/GATES_INVENTARIO.md` (29 scripts, con línea que prueba cada "verde sin mirar").
- [~] **D2. Migrar a `gate.mjs`.** Cada compuerta imprime cuánto midió; unidades explícitas (frames vs segundos con tipo en el nombre: `durFrames`, `durSec`); todo `fetch` con timeout. — ✅ las 8 más peligrosas arregladas con la convención **exit 2 = NO MIDIÓ** (`d0cba2e`): audit_frames (**daba ✅ con 3 s negros, probado con el original**), check_timestamps, dark_gate, gap_gate, check_arbol_git, gate_intrusos, vision_haygente, nudecheck. ⏳ resto en la tabla "Pendientes" del inventario.
- [~] **D3. Control positivo.** `tests/fixtures/trampa/`: video mini con defectos plantados (avatar tapado, luma negra, clip repetido, `clip=` inexistente, cobertura 60%, texto negro por prop inválida, velo 0,80, CTA comido por fade). CA: `factory test gates` falla en TODOS; video sano pasa. Corre en CI. — ✅ en CI (46 tests): trampas del montaje (avatar tapado, bug tcfiltro, asset inexistente, clip 0 cuadros, clip repetido, loop, apertura, CTA, cobertura) + video negro/sin cuadros/stills negros/entry inexistente. ⛔ faltan texto negro por prop inválida, velo 0,80 y CTA comido por fade (son de montajes con componentes, todavía no en la fábrica).
- [ ] **D4. Recalibrar falsos positivos.** `check_redibujo` (44 marcados/16 reales) y `vision_haygente`: umbral medido sobre muestra ≥5 etiquetada a mano. CA: precisión reportada en el propio archivo. — ⏳ requiere etiquetar a ojo una muestra.
- [~] **D5. Veredicto final único.** 70_gates produce `GATES.md` con tabla medido/umbral/estado y una hoja de contactos; Claude hace UNA revisión de visión sobre la hoja (no frame por frame). — 70_gates escribe GATES.md; 90_deliver deja `audit/hoja.jpg`. ⏳ sin corrida real.

### FASE E — Claude sólo en lo creativo (mata S4)
- [~] **E1. 30_direct = UNA llamada** (sin subagentes) con prompt fijo por estilo → `beatsheet.json` validado por schema (planos, tiempos ms, presentador?, tipo motor, prompt de escena viva, componente, clip real). Reintenta sólo si schema falla. CA: tokens de dirección por video medidos y ≤1/5 de hoy. — 30_direct arma `DIRECTOR_PROMPT.md` (reglas §2 + momentos + lugares + formato) y queda `needs`; `compose` valida TODO (lugar, token, respirar, cobertura, frases >7 s sin `x`, apertura, racha) con tests. ⏳ tokens sin medir.
- [~] **E2. Presupuesto de contexto.** El orquestador corre como proceso (no Claude); Claude recibe sólo resúmenes `state/*.json`. Nunca polls en el hilo; usar Monitor/notificación. CA: sesión de un video completo ≤ ~25M tokens. — `run.mjs` es proceso con log propio y `status` resume `medido`. ⏳ CA sin medir.
- [~] **E3. Adelgazar skills.** `video-pipeline` y `narrator-video` pasan a ≤250 líneas: "correr `factory/run.mjs`; reglas §2; cómo leer GATES.md". El conocimiento de gotchas vive en código+tests. Las versiones largas → `skills/_archive/` (no borrar historia). — cabecera de las dos skills manda a la fábrica con comandos exactos y dice qué montajes NO cubre. ⏳ recorte a ≤250 líneas: sólo cuando los montajes con componentes/narrador estén en la fábrica (si no se pierde conocimiento vivo).
- [ ] **E4. Lotes por canal.** `factory batch <canal> guiones/*.txt` genera specs + direct en paralelo controlado (cupo de API), luego encola. CA: 5 videos del mismo canal encolados de una. — ⏳ hoy: `new` + `queue add` por video.

### FASE F — Limpieza "sin rastros" (mata S1 y S5 para siempre)
- [ ] **F1. Archivar clones.** Mover `scripts/build_<slug>*.mjs`, `*_agnes_*.mjs` por slug, `_dispatch.sh` clonados, `@_<slug>_assets.txt` sueltos a `scripts/_archive/pre-factory/` en UN commit (git conserva historia). NO tocar assets pagos en `public/`. CA: `scripts/` sólo contiene herramientas genéricas; `run.mjs` no importa nada de `_archive`. — ⏳ a propósito NO todavía (§5.3: convive hasta H1 aprobado; farinon/facrema81 y otras sesiones usan esos scripts HOY). Mientras tanto el guard impide que se sumen nuevos.
- [x] **F2. Guard anti-regresión.** Pre-commit/CI que falla si aparece `scripts/*<slug-conocido>*.mjs` nuevo o un `build_*.mjs` fuera de `factory/`. CA: intentar agregar `build_prueba.mjs` rompe el check. — ✅ `factory/tools/guard.mjs` en CI: scripts por slug nuevos (legado congelado: 136) + CLAVES QUEMADAS (RunPod/OpenAI/GitHub/service_role) en archivos trackeados; test con `build_nuevo.mjs` y `rpa_…`.
- [x] **F3. Purga de reglas viejas.** Buscar en memoria + skills: "Vast" para avatar, "≤5 min por job", "pad", "asr_openai" como default, subagentes de guion, candado 20 slots. Corregir o marcar HISTÓRICO. CA: grep limpio salvo secciones HISTÓRICO explícitas. — ✅ "20 slots" corregido en reference_farm_concurrencia_github / pipeline_cuellos_medidos / parallel_safety; `runpod_ventanas.mjs` ya no sugiere Vast/Beam. Lo que queda son fichas de videos viejos (registro de lo usado, no reglas).
- [ ] **F4. Consolidar memoria.** Las fichas `reference_*` cuyo gotcha ya está cubierto por código+test → una línea "resuelto en factory (<commit>)" y salen del índice. MEMORY.md baja de tamaño. — ⏳ hacerlo cuando H1 valide el motor en una corrida real.
- [x] **F5. Cambiar el camino por defecto.** CLAUDE.md de video2 y la primera línea de las skills dicen: "para producir un video: `node factory/run.mjs`". Sin excepción salvo que el creador lo pida. — ✅ CLAUDE.md, `video-pipeline` y `narrator-video` (con qué montajes cubre hoy) + primera línea de MEMORY.md.

### FASE G — Deuda puntual detectada
- [x] **G1. tcestufa** (ya entregado): medir con el assert de C6 si tiene avatar tapado como tcbriquetas; si sí, AVISAR al creador antes de re-renderizar (cuesta). — ✅ medido (`factory/tools/medir_timeline.mjs`): **tcestufa 29,7 s tapados (12,7 %)** y además **tcfiltro 73,1 s (33 %)**, verificado a ojo en el mp4 entregado (w1 30–35 s muestra la estufa). tcbriquetas 0 s. ⏸ Re-render: decisión del creador (tcfiltro además necesita planos p163x/p217x).
- [ ] **G2. castorglove**: bloqueado por crédito OpenAI; retomarlo como PRIMER video por la fábrica cuando haya saldo (B2 lo detecta). — ⏳ sigue sin crédito; su montaje (Nightly Remedy) no es vlog-crudo.
- [x] **G3. farinon / facrema81**: terminarlos por el camino actual SI la fábrica no está lista; no mezclar a mitad. — farinon medido por otra sesión (fila del LOG).
- [ ] **G4. Caída de saldo RunPod $1,50 sin explicar** (fcspellizco): reconciliar con el historial de jobs. — ⏳

### FASE H — Validación de la meta x10
- [~] **H1. Piloto 1:** re-producir **tcfiltro** desde spec sin intervención → comparar lado a lado con el entregado (calidad igual o mejor, tiempo reloj medido). — a nivel BUILD hecho con datos reales (`import_legacy` + DRY): tcbriquetas idéntico al entregado; tcfiltro con 0 s tapado donde el entregado tiene 73 s. ⏸ render+entrega reales NO corridos: pisarían el release entregado de ese slug, C:/D: tienen 2,7/4,1 GB libres y compiten con los videos en curso → decisión del creador (propuesta: re-render de tcfiltro por la fábrica, que además arregla sus 73 s).
- [ ] **H2. Piloto 2:** un video NUEVO Federer (avatar) de punta a punta. Métrica: reloj, tokens, $, # intervenciones humanas (meta 0 salvo guion y visto final). — ⛔ necesita el montaje Federer con componentes en la fábrica (no está) y crédito OpenAI/RunPod (RunPod quedó ~US$0,04 tras fa70estudios). Un video NUEVO de Taller de Claudio sí se puede hoy.
- [ ] **H3. Carga:** 4 videos simultáneos por la cola. Métrica: ningún 429/403/disco lleno fatal; throughput/día. — ⏳ después de H1/H2.
- [x] **H4. Tablero.** `factory status` (y opcional artifact/Bagasy) con estado por slug/fase, tiempos y costo. — ✅ `status [<slug>]` (medido, ms, instrucciones de `needs`) + `leases`.

---

## §5. Orden de ejecución y reglas de trabajo

1. Orden: **A → D1–D3 → C (C6 y C7 primero, son los que más cuestan) → B → E → H1 → F → H2–H4.** G en cuanto haya herramienta.
2. Cada ítem = commit propio en rama `factory` con mensaje `factory(<ítem>): …`. Nunca commitear en la rama de un video en curso.
3. Nunca romper los videos en curso: la fábrica convive con los scripts viejos hasta H1 aprobado; recién ahí F1.
4. Antes de extraer una fase, **trazar la cadena** del video sano (qué script llamó a cuál con qué args) — no copiar la última versión.
5. Medir, no suponer: todo "listo" lleva número (tiempo, conteo, $) en el LOG.
6. Economía: sin subagentes en paralelo masivo; leer imágenes sólo en hojas de contacto; el orquestador corre en background y avisa.
7. Decisiones que cuestan plata o tocan entregados (re-render, borrar, subir) → preguntar al creador.

## §6. Definición de "terminado para siempre"

- `node factory/run.mjs <slug>` produce un video entregable sin que Claude edite código por video.
- `factory test gates` en CI atrapa todos los defectos plantados.
- No existen scripts por slug fuera de `_archive`; el guard F2 lo impide.
- Skills ≤250 líneas apuntando a la fábrica; memoria sin reglas contradictorias.
- H2 y H3 medidos con la meta cumplida (≥5 videos/día posibles, 0 intervenciones salvo guion + visto final).

## §7. LOG DE AVANCE (actualizar SIEMPRE al cerrar sesión)

| Fecha | Ítems | Commit | Medido / notas | Próximo paso |
|---|---|---|---|---|
| 2026-09-15 | Plan creado | — | Diagnóstico §1 de 11 videos (11–15 sep) | Arrancar A1 en rama `factory` desde `main` |
| 2026-09-15 | A1-A3 A6 B1 B3 B4 C6 D1 F2 F3 F5 G1 H4 ✅ · A4 A5 B2 B5 C1-C5 C7 C8 D2 D3 D5 E1-E3 H1 parcial | `06cd6c8` `d381119` `d4085a3` `d0cba2e` (rama `factory`, CI verde) | 46 tests en CI. Motor vlog-crudo = legado en tcbriquetas (315 cues, 37.612 cuadros, tsc OK); frases/ventanas portadas idénticas. **Entregados con avatar tapado: tcfiltro 73,1 s (33 %), tcestufa 29,7 s.** `audit_frames` daba ✅ con 3 s negros (leía stdout): arreglada + 7 compuertas más (exit 2 = no midió). Clave RunPod sacada de 12 scripts a `.env`. ⚠ el 1er commit pisó el `.gitignore` de main (MSYS convirtió `origin/main:.gitignore`) → corregido en `d381119`: usar `MSYS_NO_PATHCONV=1` con `git show ref:ruta` | Decisión del creador: ¿re-render de tcfiltro (y tcestufa) por la fábrica = H1 real? · Montaje Federer con componentes → fábrica · Klein · D4 · merge `factory`→`main` |
| 2026-09-15 | G3 farinon (camino viejo, medido) | — | Reloj ~5 h 45 (11:40→~17:25). Avatar 2 h 35 (Vast 45 min tirados + RunPod 1 job 97 min a ~8× RT, cap 600 s → cola 30 min); stock Pexels ~1 h (429 por ráfaga, 2 keys, 41/281 rechazados por visión → 2 re-pedidos + 12 a gpt-image); render farm 45 min (30 chunks por cola); incidentes compartidos ~45 min (C: lleno 2×, otra sesión borró public/img/farinon_*, 403 secundario GitHub 20 min, clip ENOSPC corrupto); errores de orquestación ~40 min (asr arg 5, junction public, blur pre-vuelo, ruta PS). Fish 18 min · gpt-image Batch 10 min · ASR 8 min · entrega local ~12 min | C5 avatar paralelo + B1/B3/B4 |
