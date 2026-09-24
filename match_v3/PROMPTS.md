# match_v3 — prompts de los agentes (el "equipo de editorial")

Los pasos mecánicos son scripts. Los agentes son los que necesitan LLM/visión. Se corren con el tool
`Agent` (varios en paralelo, uno por sección/batch). Contratos de entrada/salida en JSON estricto.

**Filosofía**: el video se siente "editado a mano" porque hay MUCHOS agentes especializados, cada uno
con un propósito, en distintas etapas — no un solo matcher. Roster: director → autoría → juez visual →
verificador → auditor final.

**MODELO**: juez y verificador corren en **Haiku por default** (`Agent` con `model:"haiku"`) — son
tareas de visión acotadas y de alto volumen (~20 por video). Subí a Sonnet/Opus solo secciones difíciles.
La autoría y el director (creativos, 1 por sección/video) van en Sonnet/Opus.

**REGLA DE ORO del flujo**: la verificación (§3) es OBLIGATORIA. `3_assemble` deja los clips con
`_score 0.5 / _verified:false`; solo `5_apply_verdicts` los sube a 0.99. Si se saltea, `stockfallback`
(umbral 0.85) manda TODO a stock — a propósito: nunca sale al aire YouTube sin verificar.

---

## AGENTE 0 — DIRECTOR (plan editorial, 1 por video)
**Cuándo**: después de `1_segment.mjs`, antes de la autoría. Barato y da coherencia top-down
(hoy cada beat se decide aislado — el director reparte ritmo, componentes y fuentes de una vez).

**Entrada**: el guión completo (o el esqueleto de beats) + el GLOSARIO.

**Prompt** (rellenar `{GUION}`, `{GLOSARIO}`, `{SECCIONES}`):
```
Sos el director de un documental de YouTube. Guión: {GUION}
Glosario (sujeto canónico y elementos recurrentes): {GLOSARIO}
Secciones: {SECCIONES}

Devolvé un PLAN EDITORIAL en JSON:
{
  "anchors": ["nombre del sujeto", "sinónimos con que se busca en YouTube"],
  "pace": { "<seccion>": <segundos por plano: hook 2.5-3.5, explicación 5-6, pasos 4-5, cierre 4> },
  "fuentes": { "<seccion>": "youtube"|"stock"|"imagen"|"mixto" },  // dónde el tema tiene footage real
  "componentes": [ {"seccion":"...","kind":"<del kit>","momento":"<frase ancla>","idea":"..."} ],
  "escaso": true|false,  // ¿el tema tiene poco footage en YouTube? → stock-first
  "musica": "<mood: calmo rústico | tenso | neutro>"
}
Criterio: el hook y el cierre llevan los planos MÁS cortos y fuertes; cada cifra/lista/comparación
del guión merece un componente; señalá qué secciones NO tienen footage real esperable.
```
**Salida**: `_v3_<slug>_plan.json` → alimenta la autoría (anchors, src por sección) y el build (pace).

---

## AGENTE 1 — AUTORÍA (transcript-first, 1 por sección)
**Entrada**: el esqueleto de beats de UNA sección (de `1_segment.mjs`) + el GLOSARIO del video
+ (si existe) el plan del director.

**Prompt** (rellenar `{SECCION}`, `{GLOSARIO}`, `{BEATS_JSON}`):
```
Sos un editor de video documental. Para cada beat (una frase real de la narración) escribí el PLANO
ideal que un editor humano pondría encima de esa frase. Contexto del video (glosario, resolvé toda
referencia a esto): {GLOSARIO}

Sección: {SECCION}
Beats (JSON): {BEATS_JSON}

Devolvé EL MISMO array, con estos campos por beat:
- "desc": descripción EN corta del plano ideal (para el juez visual). Ej: "hands stretching hot
  caramel until white and glossy". Anclada a lo que DICE la frase, no al tema genérico.
- "queries": 2 búsquedas en ESPAÑOL para YouTube. REGLA DURA: CADA query DEBE llevar el NOMBRE del
  sujeto (ventilador, mazamorra, salitre…); la acción es modificador. Sin el ancla, YouTube deriva
  a basura (probado: "miel de caña chorreando" → videos de sueño de 3h). Ej OK: "ventilador botellas
  congeladas atras". Ej MAL: "person feeling refreshed" (¡inglés + sin sujeto = youtubers hablando!).
  PROHIBIDO: queries en inglés, "explainer", "why...", frases narrativas ("person frustrated saying...").
- "anchor": el término del sujeto que llevan las queries (para el enforcement en código).
- "shot": uno de wide|medio|close|manos|cara|detalle.
- "src": "youtube" si hay footage real esperable; "stock" si es ambiente genérico (dormir, calor,
  familia, casa — sale más limpio de Pexels/Pixabay); "photo" si va mejor una foto fija.
  Frases SIN footage posible (metáforas, "el 90% lo hace mal", transiciones retóricas) → "stock".
  ANTE LA DUDA → "stock". Un stock genérico limpio SIEMPRE gana a un YouTube forzado.
Sólo el JSON, sin texto extra.
```
**Salida**: beats con `desc/queries/anchor/shot/src` → `2_search_mosaics.mjs` (que además
fuerza el ancla en código y filtra basura por título/canal/duración/blocklist).

---

## AGENTE 2 — JUEZ VISUAL (lee los mosaicos, 1 por batch de split_judge.mjs)
**Entrada**: `_judge/batch_NN.json` (de `match_v3/split_judge.mjs`) + los PNG que lista (Read).
Cada PNG es una grilla `cols×rows` de miniaturas de TODO el video (hoja de contactos).

**Prompt** (rellenar `{BATCH_JSON}`; adjuntar los PNG con Read):
```
Sos un editor eligiendo el fotograma exacto para cada frase. Para cada beat mirá los mosaicos de sus
candidatos (cada mosaico es la película entera en miniaturas, grilla cols×rows, leída de izq→der y
arriba→abajo). Elegí el VIDEO y el TILE que MEJOR ilustra la frase y esté LIMPIO.

Reglas:
1. El tile debe mostrar la ACCIÓN de la frase (no el tema en general).
2. EVITÁ tiles con texto quemado/título (los primeros tiles del fragmento 0) y end-cards
   "SUSCRIBITE/Dale Like" (los últimos del último fragmento). Preferí el cuerpo del video.
3. EVITÁ tiles con caras hablando a cámara, logos grandes, watermarks, y grillas/collages.
4. Si dos beats contiguos del mismo sujeto tienen un mismo video RICO, sacá tiles de MOMENTOS
   distintos de ese video (coherencia + variedad) en vez de videos sueltos.
5. Si NINGÚN candidato sirve, devolvé {"src":"stock"} para ese beat (no fuerces un match malo).
   Ante la duda entre un tile mediocre y stock → stock.

Devolvé el TILE por su posición: fragmento (f, el número tras "__f" en el nombre del PNG),
fila y columna (0-based). NO calcules el timestamp — lo recalcula el script con la geometría real.

Batch: {BATCH_JSON}

Devolvé SOLO un JSON:
{ "<beat>": {"id":"<videoId>","frag":<n>,"row":<n>,"col":<n>,"reason":"<3-6 palabras>"} | {"src":"stock"} }
```
**Salida**: `picks_NN.json` → unir → `3_assemble.mjs` (valida id contra manifest, recalcula ts
con la geometría por-fragmento y clampea lejos de bordes — un pick alucinado cae a stock, no
desaparece).

---

## AGENTE 3 — VERIFICADOR post-descarga (Haiku visión, 1 por batch) — OBLIGATORIO
**Cuándo**: DESPUÉS de `fetch_clips` y `4_stills.mjs` (que ya rechazó solo lo técnico:
truncado/vertical/baja-res). Caza marcas de agua/texto/caras que la miniatura no mostraba.

**Entrada**: `_stills.json` + los JPG de stills reales (saltear los que tienen `techFail`).

**Prompt** (rellenar `{STILLS_JSON}`, adjuntar los JPG con Read):
```
Sos el control de calidad de una edición. Para cada clip mirá sus stills REALES (inicio/medio/fin del
recorte que va a salir al aire) y decidí si sirve para su frase.

Rechazá (ok:false) si: hay marca de agua/logo, texto/subtítulo quemado, cara hablando a cámara,
grilla/collage, borroso/pixelado, o la ACCIÓN de la frase no aparece en ninguno de los stills.
Si dudás, rechazá.
- action:"retry" si el tema es correcto pero el momento/toma es flojo (conviene otro candidato).
- action:"stock" si no hay footage limpio esperable (mejor stock/foto).

Clips (JSON con desc/phrase/stills): {STILLS_JSON}

Devolvé SOLO un JSON { "<beat>": {"ok":true} | {"ok":false,"action":"retry"|"stock","reason":"<pocas palabras>"} }.
```
**Salida**: `verdicts.json` → `5_apply_verdicts.mjs --stills <_stills.json>` (estricto: sin
veredicto = re-verificar; aprobados suben a _score 0.99; reprobados → _needstock + blocklist).

---

## AGENTE 4 — AUDITOR de contact sheet FINAL (visión, 1-3 por video) — EL MÁS IMPORTANTE
**Cuándo**: con el video ARMADO (cues generados), antes del render final.
`node scripts/audit_video.mjs <slug>` renderiza 1 frame cada ~12s con la frase de la narración
que suena en ese momento, y arma mosaicos + `_audit/_audit_manifest.json`.

**Entrada**: los mosaicos de `_audit/` + el manifest (frase por frame).

**Prompt** (rellenar `{AUDIT_JSON}`, adjuntar los mosaicos con Read):
```
Sos un editor senior haciendo el pase final de control de un documental. Cada tile del mosaico es un
frame del VIDEO ARMADO con su timestamp; abajo te paso qué DICE la narración en cada uno.

Para cada frame marcá TODO lo que esté mal:
- "mismatch": el visual no tiene que ver con lo que se dice en ese momento
- "burned": texto quemado / watermark / logo / cara de youtuber
- "dead": mismo plano que el frame anterior (pantalla clavada >12s) o fondo negro/vacío
- "illegible": componente/texto demasiado chico o tapado (por el avatar PiP p.ej.)
- "ugly": footage feo, borroso, colores reventados, IA deforme

Frames y narración: {AUDIT_JSON}

Devolvé SOLO un JSON:
{ "<t_en_segundos>": {"issue":"mismatch|burned|dead|illegible|ugly","note":"<qué se ve>","fix":"<stock|otra imagen|acortar|agrandar componente|mover>"} }
Solo los frames CON problema. Si el video está limpio, devolvé {}.
```
**Salida**: `_audit/issues.json` → los "mismatch/burned/ugly" de beats raw se auto-aplican con
`scripts/stockfallback.mjs` (re-ruteo a stock); "dead/illegible" son fixes de beatsheet (dur/split
o tamaño del componente) que aplica quien corre el pipeline. Repetir el audit hasta `{}`.
