---
name: video-pipeline
description: >-
  Motor COMPARTIDO y OBLIGATORIO para montar/editar/renderizar cualquier video documental con avatar del
  usuario en Remotion (proyecto C:\Users\bauti\Downloads\video2), pipeline CORE v4 HÍBRIDO (clips reales de
  YouTube + stock + imágenes IA + componentes). Es el checklist con COMPUERTAS que impone los pasos que suelo
  saltear — sobre todo el §0 DIRECTOR al inicio y el §4 AUDITOR antes de shipear. Usar SIEMPRE que se arme,
  edite, "montá el video", "hacé la edición", "pasalo a video", o se renderice un video del canal, en cualquier
  nicho. Se combina con la skill de NICHO (amish-doc, constructor-video, nature-doc, finance-avatar-video,
  doc-broll-video, doc-mograph, stickman-explainer): el nicho define look/marca/CTA/glosario; ESTA define el
  PROCESO. Si estás por renderizar el final sin haber corrido el DIRECTOR y el AUDITOR, PARÁ. NO saltear fases.
---

# Video pipeline (CORE v4 híbrido) — el PROCESO compartido

Esta skill es un **checklist con compuertas, no una sugerencia.** El problema que resuelve: en tareas largas
me salteo pasos que están en la memoria (sobre todo **DIRECTOR** §0 y **AUDITOR** §4) porque la memoria es
recall pasivo que ojeo — y el video sale flojo (imágenes genéricas, planos que no pegan). Acá esos pasos son
**obligatorios y ordenados**. Proyecto base: `C:\Users\bauti\Downloads\video2`.

> ## ⛔ REGLA DURA — TODO EL CÓMPUTO PESADO EN LA NUBE (nunca local)
> La PC del usuario se cuelga / se pone lenta con procesos pesados locales (ya causó un reinicio en seco). Por eso, en CUALQUIER video:
> - **RENDER de Remotion: SIEMPRE en el FARM (GitHub Actions).** PROHIBIDO `npx remotion render`, `remotion preview`, un preview "liviano", o levantar `chrome-headless-shell` para rendear frames en local. **Nada de Remotion render local, nunca.**
> - **TTS → Modal · Whisper → Modal (`modal_whisper.py`) · Imágenes → Modal.** Nada de ComfyUI/whisper/TTS local.
> - **AUDITOR:** revisá frames sacados con **ffmpeg** del MP4 que YA rindió el farm (ffmpeg extraer imágenes es liviano y sí va local). Si el farm no terminó, esperá su run — no rindas local para adelantar.
> - Lo ÚNICO pesado permitido en la PC: **git** (push al farm) y **ffmpeg** puntual (extraer frames/audio). Todo lo demás va a la nube.
> Esta regla vale para el worker de Bagasy y para cualquier sesión que monte un video.

## Cómo se combina con la skill de nicho
- **NICHO** (amish-doc / constructor-video / nature-doc / …) = QUÉ se ve: look, marca, paleta, pacing del
  estilo, CTA/embudo, glosario del sujeto, kit de componentes preferido. **Abrí SOLO la del canal** (ver el
  router en memoria). Si el nicho tiene su propio runbook completo (p.ej. `constructor-video`), ese manda y
  esta queda de respaldo conceptual.
- **ESTA** = CÓMO se hace: las 9 fases + las compuertas. Los prompts EXACTOS de los agentes están en
  `video2/match_v3/PROMPTS.md` (§0 director, §1 autor, §2 juez, §3 verificador, §4 auditor) — **usá esos, no
  los inventes.** El flujo canónico está en `video2/match_v3/README.md` y la memoria `reference_core_pipeline_v4`.

## Mapa de MODELOS por agente (barato donde es objetivo, fuerte donde es criterio)
Haiku ≈ modelo fuerte SOLO en tareas acotadas/objetivas de alto volumen → ahí conviene lanzar MUCHOS baratos en
paralelo. En tareas de gusto/juicio holístico, un modelo fuerte cambia el resultado (un error se propaga a todo
el video). Regla: **barato+muchos donde hay respuesta correcta; fuerte+pocos donde hay criterio.**
| Agente | Modelo | Cantidad |
|---|---|---|
| §0 DIRECTOR (plan editorial) | sonnet/opus | 1 |
| §1 AUTOR de queries | sonnet | 1/sección |
| §2 JUEZ visual (elige tile de la grilla) | **haiku** | muchos (1/batch, paralelo) |
| §3 VERIFICADOR (watermark/off-topic sí/no) | **haiku** | muchos (1/batch) |
| §4 AUDITOR final (mismatch/ugly/dead — gusto) | sonnet/opus | 1-3 |
| Dimensiones "editado a mano" (variedad/ritmo/continuidad/legibilidad) | **haiku** | muchos, paralelo |
"Parece editado por humano" NO sale de amontonar Haikus con gusto — sale de **descomponer lo subjetivo en muchos
chequeos objetivos baratos** (¿dos clips seguidos se parecen? ¿plano clavado? ¿el visual sigue al sujeto de la
frase? ¿el hook/cierre son los más cortos?) + UN pase de gusto con modelo fuerte. Pasar `model:` en el Agent tool.

## Regla de oro
**NUNCA entregar/subir/dar por bueno un video sin que el AUDITOR (Fase 8) haya corrido sobre el render y sus
issues estén resueltos.** La memoria dice "NUNCA shipear sin AUDITOR §4" y aun así se saltea — por eso está
acá como compuerta dura.

## Fase 0 — LEER (antes de tocar nada)
No confíes en el recuerdo de fondo; ABRÍ y releé:
- `reference_core_pipeline_v4.md` + `video2/match_v3/README.md` — flujo canónico comando a comando.
- `video2/match_v3/PROMPTS.md` — prompts EXACTOS de los 5 agentes.
- La skill del NICHO (look, CTA, glosario) + la memoria del proyecto de ESE canal.
- Las reglas duras (abajo) — confirmá cada una antes de arrancar.

## Reglas duras (compuertas de contenido — verificá SIEMPRE)
1. **Pacing: ningún plano de imagen/clip >5s, apuntar ≤3s** (`feedback_video_clip_max_3s`). Excepción: visuales
   con TEXTO (diagrama, receta, componente) se mantienen mientras el avatar explica. **Clips reales de video =
   `noSplit`** (el movimiento ya es dinámico; no cortarlos a 3s).
2. **Avatar full-o-visual-full, CERO PiP chico en esquina** (`feedback_video_avatar_full_or_fullvisual`).
   Windowing `full↔hidden↔right/left` dentro del build. **Avatar full SIEMPRE con push lento Ken-Burns** —
   nunca estático (`feedback_video_avatar_full_push`; el gate ">4s" dejaba quietos los headers cortos).
   - ⛔ **ARRANQUE OBLIGATORIO: el video ABRE con el AVATAR HABLANDO a pantalla completa.** Los primeros
     **2 segundos como mínimo** (frames 0 a 60 a 30fps) son avatar full, sin excepción. **NADA** de abrir
     con b-roll, con una imagen, con un cartel de título, con logo ni con negro. Es la cara hablando lo
     primero que se ve. Recién después de esos 2s podés alternar a visual full.
   - Verificalo en el AUDITOR: extraé el frame 15 y el frame 45 del MP4 y confirmá que se ve el avatar.
     Si en el segundo 0-2 hay b-roll, **el video NO se shipea**: se corrige el build y se re-rendea.
3. **Anclar TODO al ms de Whisper** (`feedback_video_anchor_everything_ms`), nunca por matemática. Anclá a las
   captions REALES del avatar (suele ser una versión condensada del guion), no al guion puro.
4. **CTA/embudo del nicho** (sin precio si el canal así lo pide). Link SIN https arriba de la descripción,
   detalle numerado abajo (`feedback_video_avatar_full_or_fullvisual` + la skill de nicho).
5. **NUNCA borrar assets generados/pagos** (`feedback_no_borrar_assets_pagos`; `rm` no va a papelera). Regenerar
   sobre lo existente, salvo borrar los clips YT RECHAZADOS de `public/broll/` (o el build usa uno malo).
6. **CERO filtros de color, corte limpio, avatar sin fade, cero temblor handheld.**
7. **Contexto en visuales**: cada referencia ("el líquido", "esto") se resuelve al sujeto real de TODO el video
   vía glosario (`feedback_video_visual_context`), no a la frase aislada.

## Fase 1 — Assets base (avatar → captions)
```
FF=<ffmpeg de WinGet>;  SRC=<avatar A-roll .mp4>
$FF -y -i "$SRC" -vf "crop=iw:ih-(ih%2):0:0,scale='min(1920,iw)':-2" -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 160k public/<slug>_opt.mp4
$FF -y -i "$SRC" -vn -ac 1 -ar 16000 -c:a pcm_s16le public/<slug>_16k.wav
$FF -y -i "$SRC" -vn -ac 1 -ar 16000 public/<slug>.wav      # AvatarLayer deriva <slug>_opt.mp4→<slug>.wav (borde audio-reactivo; 404 si falta)
WHISPER_LANG=<en|es> node transcribe_cuda.mjs <slug>        # Whisper CUDA → public/captions_<slug>.json (word-level)
```
GOTCHA: HeyGen suele venir a **25fps y altura impar (1082)** → cropear a 1080. La comp SIEMPRE 30fps (`sec()` hardcodea 30); el `<Video>` reproduce a tiempo real igual.

## Fase 2 — DIRECTOR (compuerta §0, NO saltear)
1 agente con el prompt de `PROMPTS.md §0`. Entrada: guion + GLOSARIO (sujeto y elementos recurrentes descritos
IGUAL siempre) + secciones con timecodes. Salida `_v3/<slug>_plan.json`: `anchors`, `pace` por sección,
`fuentes` (youtube/stock/imagen/mixto por sección: dónde el tema TIENE footage real), `componentes`
(kind + frase ancla por cada cifra/lista/comparación), `imagenes` (con DIRECCIÓN fuerte anti-genérica para las
que son IA), `escaso` (poco footage → stock-first), `musica`. **Este plan manda** ritmo, fuentes e imágenes.

## Fase 3 — Momentos + autoría de queries (§1)
1. `node match_v3/1_segment.mjs public/captions_<slug>.json _v3/<slug>_skel.json` → momentos ~6-7s.
2. N agentes (1 por sección/tercio, prompt §1) escriben por momento: `desc` EN + `queries` (2, ES/EN, ANCLADAS
   al NOMBRE del sujeto del glosario) + `anchor` + `shot` + `src` (`youtube`|`stock`|`photo`; ante la duda → youtube).
   **GOTCHA: los .json de los agentes traen BOM → `.replace(/^﻿/,"")` al parsear.** Mergear por name, ordenar por ms.

## Fase 4 — Búsqueda + jueces (grilla §2)
```
node match_v3/2_search_mosaics.mjs _v3/<slug>_beats.json _v3_mosaics 6 2 [--anchors "sujeto,sinónimos"]
node match_v3/split_judge.mjs _v3_mosaics 8
```
- Piso de duración configurable (nicho escaso → clips cortos igual sirven; ver constructor-video: `V3_DUR_MIN=30 MAXQ=2` bajó escasez 75%→40%).
- N agentes JUEZ (Haiku, 1 por batch, prompt §2) miran mosaicos → `picks_NN.json` → merge (BOM!). El juez devuelve `{id,frag,row,col}`, NUNCA calcula ts.
```
node match_v3/3_assemble.mjs _v3/<slug>_beats.json _v3_mosaics/_judge/picks.json public/broll/clips_<slug>_matched.json _v3_mosaics/_manifest.json
```

## Fase 5 — Fetch + verificadores + stock (good-set §3)
```
# ⚡ SIEMPRE EN PARALELO — 1 worker por proxy (hay 6 en cookies/proxies.txt). Baja de ~70 min a ~12.
node scripts/fetch_parallel.mjs public/broll/clips_<slug>_matched.json 6
#   (fetch_clips.mjs SOLO si no hay cookies/proxies.txt: baja de a UNO y es la fase más lenta
#    de todo el pipeline. Mismo gate de calidad en los dos: valida 480p + ffprobe; los que
#    fallan por bot-detection caen a la cascada de stock igual.)
node match_v3/4_stills.mjs public/broll/clips_<slug>_matched.json _v3_<slug>_stills
```
- N agentes VERIFICADOR (Haiku visión, prompt §3 — **OBLIGATORIO**) cazan lo que la miniatura ocultaba:
  watermark/cara-a-cámara/texto-quemado/off-topic. Aprueban ~40%. → `verdicts_NN` (BOM!) → `5_apply_verdicts.mjs`.
- `node scripts/stockfallback.mjs --list <needstock.json>` (Pexels→Pixabay→Archive) para lo rechazado/faltante.
  **GOTCHA: `5_apply_verdicts` reescribe `needstock.json` → puede quedar corto.** Al final, chequeá que TODOS los
  beats del cuerpo tengan `broll/<name>.mp4` en disco; a los que falten, armales needstock con su query y bajá.
- **Good-set por MTIME**: borrá de `public/broll/` los clips YT viejos/rechazados o el build usa uno malo.

## Fase 6 — Imágenes IA para lo SIN clip (§directorplan)
Momentos sin clip real (cold-open con personajes, avisos vintage, etc.) → imagen IA con la **DIRECCIÓN del
DIRECTOR** (no prompts genéricos). Motor: **Modal gratis** `PYTHONUTF8=1 PYTHONIOENCODING=utf-8 python -m modal
run modal_batch.py --list <prompts.json>` (SDXL RealVisXL). **gpt-image-2 es mejor para caras/emoción/vintage
con texto, PERO se topa el billing hard limit** → si `Billing hard limit reached`, usá Modal. Estilo foto casual
imperfecta, glosario coherente (`feedback_video_prompt_consistency`). Regenerar sobre lo existente = borrar el
png viejo primero (Modal saltea los que existen).

## Fase 7 — Build híbrido
`build_<slug>.mjs` (cloná uno hecho). Momentos con good-set → beat VIDEO `src:"broll/<name>.mp4"` + `noSplit`.
Resto → imagen ≤3s. Componentes del kit anclados a frases reales. Avatar windows `full↔hidden↔right` dentro del
build. **Tileo contiguo por tramo** (cada cue dura hasta el próximo dentro de su ventana visible) para que NO
asome el fondo entre planos ("destello"). Luego:
```
node build_<slug>.mjs && node beatsheet.mjs beatsheet/<slug>.json
```
Cloná `Main_<slug>.tsx` + un entry mínimo `src/index_<slug>.tsx` (evita el OOM del Root grande) con la
`<Composition id="...">`. tsc limpio antes de renderizar.

## Fase 8 — AUDITOR (LA COMPUERTA MÁS IMPORTANTE — NO SHIPEAR SIN ESTO)

### 8a. ANTES de rendear — cuadrícula de contacto en la nube (OBLIGATORIO y barato)
Rendear para DESPUÉS descubrir un problema y volver a rendear es lo más caro del pipeline.
Esto cuesta **1 job de ~2 min** contra los ~20 del render completo:
```
ENTRY=src/index_<slug>.tsx FARM_REF=molino-<slug> node scripts/grid.mjs <slug> <CompId> <total_frames> 12
# → public/_audit/<slug>/grid-<slug>.jpg  (+ los frames sueltos en stills/)
```
**MIRÁ la cuadrícula** (tool de leer imágenes) y verificá:
- **frames 15 y 45 = avatar hablando a pantalla completa** (regla dura del arranque)
- ningún frame **negro** ni con **asset roto**
- cada visual **corresponde a lo que se dice** en ese momento (no genérico, no fuera de tema)
- hay **b-roll de verdad**: si es solo avatar + carteles, está MAL → volvé a la fase de assets

Corregí todo acá y volvé a sacar la cuadrícula. **Recién con la cuadrícula limpia, rendeás.**

### 8b. DESPUÉS del render — chequeo TÉCNICO (segundos)
Sobre el MP4 que ya rindió el farm: duración esperada, sin negros largos, audio presente.
Si 8a quedó limpio, esto casi nunca dispara un re-render.
```
node scripts/audit_video.mjs <slug> --video <mp4> --every 12     # revisión semántica completa, si hace falta
```
Repartí los frames en lotes → agentes AUDITOR (prompt §4). Issues:
- `mismatch`/`ugly` → regenerá esa imagen on-topic (dirección) o re-ruteá a stock.
- `burned` (watermark/logo/cara/texto) → sacar ese clip/imagen.
- `illegible` (componente chico/tapado) → agrandar/arreglar props.
- `dead` (plano clavado >12s) → acortar/partir.
Aplicá, **re-renderizá y re-auditá hasta casi limpio.** Recién ahí mostrale al usuario los frames marcados (o una
contact sheet) para su OK de gusto — no el video entero.

## Fase 9 — Render + entrega — **LOS FINALES VAN AL FARM (nube), NUNCA local**
NUNCA renderizar el final en la máquina local (lento, OOM con muchas capas de video). El local casero "en 2
mitades" es un error — los finales van al **FARM en la nube** (GitHub Actions). Checklist EXACTO (los 3 pasos
que ya salteé — hacelos SÍ o SÍ):
1. **Comp en `src/Root.tsx`** (NO solo en `index_<slug>.tsx`): el farm rinde desde el entry por defecto (Root).
   `import { Main<Slug>, TOTAL_FRAMES_<SLUG> } from ...` + `<Composition id="<Comp>" .../>`. Verificá con
   `npx remotion compositions` que `<Comp>` aparezca ANTES de farmear.
2. **Sincronizá `molino-v1` a tu HEAD**: `git add <src foods> && git commit && git branch -f molino-v1 HEAD &&
   git push -f origin molino-v1`; verificá `git rev-parse origin/molino-v1 == HEAD` (`reference_farm_branch_sync`).
3. **Correr el farm CON `FARM_REF` — sin él, `gh workflow run` usa la rama DEFAULT y renderiza el commit
   EQUIVOCADO (sin tu comp) → falla o rinde viejo.** Ese fue el bug: omití FARM_REF y rindió un commit sin `Foods`.
   ```
   FARM_REF=molino-v1 TAR_DIR=/d node scripts/farm.mjs <slug> <Comp> <TOTAL×30> 24 @_<slug>_assets.txt
   ```
   `@_<slug>_assets.txt` = lista de assets (rutas relativas a public/): todos los `broll/*.mp4` + `img/*.png` del
   beatsheet. El farm tarrea eso + `<slug>_opt.mp4` + `<slug>.wav` + sfx/avatar_clips, sube release, dispara.
4. **Trackear por SHA** (no `run list --limit 1`): `gh run list --branch molino-v1 --json databaseId,headSha`
   → el run cuyo `headSha == git rev-parse HEAD`. Si la descarga del farm se cuelga, bajá directo:
   `gh run download <run> -n final-<slug> -D _dl && cp _dl/<slug>.mp4 /d/videosdeclaude/`.
- Verificá dur/streams con ffprobe (extraé un frame de un momento clave). Subida SOLO con OK del usuario.

## Al terminar
Actualizá SOLO la memoria de HECHOS/ESTADO del proyecto (video hecho, gotcha nuevo). Si aprendés una regla que
debería ser compuerta, agregala a ESTA skill o a la de nicho — **no a un archivo de memoria suelto** (los
procedimientos van en skills, la memoria queda para hechos).
