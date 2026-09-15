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
- [ ] **A1. Rama y carpeta.** Rama `factory` desde `main` actualizado (NO desde `clembudo-render`). Crear `factory/` según §3. CA: `node factory/run.mjs --help` imprime fases.
- [ ] **A2. `lib/exec.mjs`.** Wrapper único de procesos: captura stdout **y** stderr, timeout obligatorio, exit≠0 → throw con cola del log. CA: test con `ffmpeg -f lavfi ... signalstats` devuelve luma≠0 leyendo stderr; comando colgado muere al timeout.
- [ ] **A3. `lib/gate.mjs` fail-closed.** `assertMeasured` tira si valor es 0/NaN/undefined/lista vacía salvo `allowZero` explícito; SIEMPRE imprime `GATE <nombre>: midió=<n> sobre <total>`. CA: test unitario de los 5 casos.
- [ ] **A4. `lib/state.mjs`.** Estado por fase con hash de inputs; `--from`/`--only`; reanudación. CA: matar el proceso a mitad de 50_agnes y relanzar retoma sin rehacer lo sellado.
- [ ] **A5. `spec.schema.json` + `styles/`.** Campos: slug, canal, modo(avatar|narrador), guion_path, voice_id, avatar_ref, idioma, cta{landing,qr}, estilo, duración objetivo. CA: los 4 videos buenos (fa70estudios, tcfiltro, fcsmanos10, tcestufa) se expresan como spec sin campos extra.
- [ ] **A6. `lib/paths.mjs` y aislamiento.** Todo asset en `public/<slug>/…` y `_work/<slug>/…`; prohibido escribir/borrar fuera del slug. CA: grep en `factory/` no encuentra rutas armadas a mano.

### FASE B — Recursos compartidos (mata S3)
- [ ] **B1. `lib/lease.mjs`** con tabla Supabase `factory_leases(resource, holder_slug, units, expires_at)`: agnes (N claves), runpod, openai_batch, fish, farm_slots(60), disk_gb. TTL + heartbeat. CA: dos `run.mjs` simultáneos nunca superan el cupo de agnes; lease vencido se libera solo.
- [ ] **B2. `lib/budget.mjs`.** Antes de encolar fase paga: saldo OpenAI, RunPod, Fish; si no alcanza para el estimado → fase queda `blocked:credit` y AVISA (no arranca a medias). CA: con key sin saldo, castorglove queda bloqueado en preflight, no a mitad.
- [ ] **B3. Disco.** Preflight exige ≥X GB libres en C: y D:; único proceso de limpieza (`factory gc`) que sólo borra derivados regenerables de slugs `delivered`, nunca assets pagos. CA: `factory gc --dry` lista y no toca slugs activos.
- [ ] **B4. `lib/gh.mjs`.** Backoff exponencial ante 403 secundario, cache de `release view`, polling ≥5 min, y "falló por rate limit" ≠ "falló el render" (verificar el asset real). CA: simular 403 → reintenta y reporta estado real.
- [ ] **B5. Cola.** `factory queue add <slug>` / `factory worker` que toma specs y respeta leases; integrable con el worker de Bagasy. CA: 4 specs encolados corren sin pisarse.

### FASE C — Fases del motor (mata S1, S6)
Para cada fase: extraer la versión SANA (fuente: scripts usados en **fa70estudios** y **tcfiltro**), no la última copia.
- [ ] **C1. 10_voice.** Fish bloques ≤1200 chars; ASR por bloque; detector de loops (n-gramas repetidos ≥3) → regenera sólo ese bloque; concat a wav máster único. CA: guion de tcbriquetas sale sin loops en una pasada.
- [ ] **C2. 20_asr.** Modal default; fallback OpenAI con chunk=600 s fijo en código (no por arg posicional). CA: timestamps por palabra, mediana error ≤~80 ms vs referencia.
- [ ] **C3. 40_images.** Ruteo Klein/gpt-image automático por plano (flag `presentador` del beatsheet); Batch con fetch en STREAM (sin crash a 140+); filtro "gente inventada" y "objeto equivocado" (tcestufa anafe) por visión barata con muestreo. CA: 150 imgs fetch sin crash; reporte de rechazos con números.
- [ ] **C4. 50_agnes.** Envolver `agnes_i2v.mjs` + `agnes_qc.mjs --fix`; regex de reintento correcta (fcspellizco tiraba 179/195); "ya estaban N" sólo cuenta clips con sello válido; throughput esperado ~7 clips/min como alarma. CA: re-run no duplica clips; 429 → espera lease, no falla.
- [ ] **C5. 55_avatar.** RunPod: ventanas visibles del beatsheet; UN /run; si mp4 < audio → 2º /run con la cola exacta; `executionTimeout` alto; inputs hospedados en Supabase/R2 (nunca GitHub); **sin pad** de ventanas; compuerta de sync (`avatar_sync_gate.mjs`) con offset medido. CA: farinon (792 s) resuelve en ≤2 jobs y offset |≤40 ms| en todas las ventanas.
- [ ] **C6. 60_build GENÉRICO.** Un solo build por estilo que lee beatsheet+style. Fix del bug tcestufa/tcbriquetas: **ningún plano puede solaparse con ventana de avatar visible** (assert). Respeta máx 3 s/img, ≤12 palabras por componente, staggers relativos a duración. CA: tcbriquetas reconstruido desde spec da 0 s de avatar tapado.
- [ ] **C7. 80_render.** Preflight: `git status` limpio en archivos del build y `HEAD` pusheado (el farm rinde el COMMIT, el tar sale del DISCO); lista `@assets` validada (≥ N, sin 404, sin `_blur.jpg` derivado en runtime); reparto por costo + `stitch_raw`; cancelada ≠ exit 0. CA: render de 24–30 min con 60 slots cuando hay cupo.
- [ ] **C8. 90_deliver.** Stitch SIEMPRE con wav máster; reencode según `reference_entrega_reencode_*`; verificar pts==dts; subir con nombre y extensión reales; `?v=N` automático; meta JSON (título/descr/links https) generado de spec; aviso proactivo. **No sube a YouTube.** CA: ffprobe OK y link final impreso.

### FASE D — Compuertas que no mienten (mata S2)
- [ ] **D1. Inventario.** Listar TODAS las compuertas actuales (`*_gate.mjs`, `audit_*.mjs`, `density_gate`, `dark_gate`, `broll_isolation_gate`, `check_redibujo`, `vision_haygente`, `agnes_qc_gate`). Para cada una: qué mide, puede dar verde sin mirar?, falsos positivos conocidos.
- [ ] **D2. Migrar a `gate.mjs`.** Cada compuerta imprime cuánto midió; unidades explícitas (frames vs segundos con tipo en el nombre: `durFrames`, `durSec`); todo `fetch` con timeout.
- [ ] **D3. Control positivo.** `tests/fixtures/trampa/`: video mini con defectos plantados (avatar tapado, luma negra, clip repetido, `clip=` inexistente, cobertura 60%, texto negro por prop inválida, velo 0,80, CTA comido por fade). CA: `factory test gates` falla en TODOS; video sano pasa. Corre en CI.
- [ ] **D4. Recalibrar falsos positivos.** `check_redibujo` (44 marcados/16 reales) y `vision_haygente`: umbral medido sobre muestra ≥5 etiquetada a mano. CA: precisión reportada en el propio archivo.
- [ ] **D5. Veredicto final único.** 70_gates produce `GATES.md` con tabla medido/umbral/estado y una hoja de contactos; Claude hace UNA revisión de visión sobre la hoja (no frame por frame).

### FASE E — Claude sólo en lo creativo (mata S4)
- [ ] **E1. 30_direct = UNA llamada** (sin subagentes) con prompt fijo por estilo → `beatsheet.json` validado por schema (planos, tiempos ms, presentador?, tipo motor, prompt de escena viva, componente, clip real). Reintenta sólo si schema falla. CA: tokens de dirección por video medidos y ≤1/5 de hoy.
- [ ] **E2. Presupuesto de contexto.** El orquestador corre como proceso (no Claude); Claude recibe sólo resúmenes `state/*.json`. Nunca polls en el hilo; usar Monitor/notificación. CA: sesión de un video completo ≤ ~25M tokens.
- [ ] **E3. Adelgazar skills.** `video-pipeline` y `narrator-video` pasan a ≤250 líneas: "correr `factory/run.mjs`; reglas §2; cómo leer GATES.md". El conocimiento de gotchas vive en código+tests. Las versiones largas → `skills/_archive/` (no borrar historia).
- [ ] **E4. Lotes por canal.** `factory batch <canal> guiones/*.txt` genera specs + direct en paralelo controlado (cupo de API), luego encola. CA: 5 videos del mismo canal encolados de una.

### FASE F — Limpieza "sin rastros" (mata S1 y S5 para siempre)
- [ ] **F1. Archivar clones.** Mover `scripts/build_<slug>*.mjs`, `*_agnes_*.mjs` por slug, `_dispatch.sh` clonados, `@_<slug>_assets.txt` sueltos a `scripts/_archive/pre-factory/` en UN commit (git conserva historia). NO tocar assets pagos en `public/`. CA: `scripts/` sólo contiene herramientas genéricas; `run.mjs` no importa nada de `_archive`.
- [ ] **F2. Guard anti-regresión.** Pre-commit/CI que falla si aparece `scripts/*<slug-conocido>*.mjs` nuevo o un `build_*.mjs` fuera de `factory/`. CA: intentar agregar `build_prueba.mjs` rompe el check.
- [ ] **F3. Purga de reglas viejas.** Buscar en memoria + skills: "Vast" para avatar, "≤5 min por job", "pad", "asr_openai" como default, subagentes de guion, candado 20 slots. Corregir o marcar HISTÓRICO. CA: grep limpio salvo secciones HISTÓRICO explícitas.
- [ ] **F4. Consolidar memoria.** Las fichas `reference_*` cuyo gotcha ya está cubierto por código+test → una línea "resuelto en factory (<commit>)" y salen del índice. MEMORY.md baja de tamaño.
- [ ] **F5. Cambiar el camino por defecto.** CLAUDE.md de video2 y la primera línea de las skills dicen: "para producir un video: `node factory/run.mjs`". Sin excepción salvo que el creador lo pida.

### FASE G — Deuda puntual detectada
- [ ] **G1. tcestufa** (ya entregado): medir con el assert de C6 si tiene avatar tapado como tcbriquetas; si sí, AVISAR al creador antes de re-renderizar (cuesta).
- [ ] **G2. castorglove**: bloqueado por crédito OpenAI; retomarlo como PRIMER video por la fábrica cuando haya saldo (B2 lo detecta).
- [ ] **G3. farinon / facrema81**: terminarlos por el camino actual SI la fábrica no está lista; no mezclar a mitad.
- [ ] **G4. Caída de saldo RunPod $1,50 sin explicar** (fcspellizco): reconciliar con el historial de jobs.

### FASE H — Validación de la meta x10
- [ ] **H1. Piloto 1:** re-producir **tcfiltro** desde spec sin intervención → comparar lado a lado con el entregado (calidad igual o mejor, tiempo reloj medido).
- [ ] **H2. Piloto 2:** un video NUEVO Federer (avatar) de punta a punta. Métrica: reloj, tokens, $, # intervenciones humanas (meta 0 salvo guion y visto final).
- [ ] **H3. Carga:** 4 videos simultáneos por la cola. Métrica: ningún 429/403/disco lleno fatal; throughput/día.
- [ ] **H4. Tablero.** `factory status` (y opcional artifact/Bagasy) con estado por slug/fase, tiempos y costo.

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
| 2026-09-15 | G3 farinon (camino viejo, medido) | — | Reloj ~5 h 45 (11:40→~17:25). Avatar 2 h 35 (Vast 45 min tirados + RunPod 1 job 97 min a ~8× RT, cap 600 s → cola 30 min); stock Pexels ~1 h (429 por ráfaga, 2 keys, 41/281 rechazados por visión → 2 re-pedidos + 12 a gpt-image); render farm 45 min (30 chunks por cola); incidentes compartidos ~45 min (C: lleno 2×, otra sesión borró public/img/farinon_*, 403 secundario GitHub 20 min, clip ENOSPC corrupto); errores de orquestación ~40 min (asr arg 5, junction public, blur pre-vuelo, ruta PS). Fish 18 min · gpt-image Batch 10 min · ASR 8 min · entrega local ~12 min | C5 avatar paralelo + B1/B3/B4 |
