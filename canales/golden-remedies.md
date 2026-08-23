# Canal: Golden Remedies

> **Este archivo MANDA sobre cualquier regla genérica.** Si algo acá contradice la skill de nicho,
> el pipeline o tu criterio, **gana este archivo**.
>
> 📌 Esto **no es una biografía ficticia**. No inventes familia, edad ni vida personal.

Canal **EN-US**, remedios caseros para piel/salud, público **+55/60**.
⚠️ **Bagasy: el canal YA NO es borrador.** La clave es
`https://www.youtube.com/channel/UC2LXyiJ4NcO9CIyTC4D4pag` — `draft:scn3l7x` quedó obsoleta y
`deliver_card.mjs` sale con "canal no encontrado". Verificar la clave en `tracked_channels`
ANTES de entregar (`select=channel_key,name&role=eq.own`).
Presentadora: **mujer ~55, primera persona, testimonial confesional** — NO es médica, no se presenta
como autoridad clínica: la autoridad la aporta *el médico al que consulta* dentro de la historia.

---

## 1. ADN DE ESCRITURA — cómo escribe este canal

- **Cómo son los ganchos acá:** primera línea = el título en versión loquísima, **sobre el SUJETO**
  (el ingrediente cotidiano), nunca sobre ella. Ej. entregado: *"The coffee grounds you scrape into
  the trash every single morning hold more of the exact compound that tightens, brightens and
  de-puffs tired skin than the eighty dollar eye cream sitting on your bathroom shelf right now."*
- **Estructura preferida:** hook → 60s del SUJETO (qué es, de dónde salió, por qué se dejó de usar)
  → open loop grande ("lo hice mal el día 3") → mecanismo en N partes → "por qué nadie te lo dice"
  → **el experimento día por día** (columna vertebral de retención) → el médico → límites honestos
  → payoff del loop (info NUEVA y contraintuitiva) → CTA a la descripción → carnada + teaser + firma.
- **Cómo abre y cómo cierra:** abre con el objeto cotidiano; cierra con la frase-firma del canal.
- **Densidad / ritmo:** mucha info concreta con números; la lista larga se parte con una micro-historia.
- **Largo objetivo:** **20.000+ caracteres** (el creador lo subió el 23/08/2026; antes 14k).
- **Qué hace SIEMPRE:** primera persona · honestidad sobre los límites ANTES del payoff · seguridad
  explícita (patch test, zona del ojo) · testigo externo que valida (alguien que nota el cambio) ·
  medidas exactas → a la DESCRIPCIÓN, nunca en voz alta.
- **Qué NUNCA hace:** marcas comerciales · precio o link en voz alta · prometer que borra arrugas ·
  referirse al título · presentarse/saludar al abrir.

### Ganchos ya usados (para NO repetirlos)

| Fecha | Video | Gancho usado |
|---|---|---|
| 2026-08-23 | `grcoffee` — I Rubbed Coffee on My Face for 7 Days | Los posos de café que tirás tienen más del compuesto activo que la crema de ojos de $80 |
| 2026-08-23 | `grbanana` — Banana Peel on Your Wrinkles? | La cáscara de banana que tirás tiene 100× más del antioxidante que frena el pardeamiento que la fruta que te comiste |
| 2026-08-23 | `grvaseline` — Why Do Doctors NEVER Tell You to Rub Vaseline Here at Night? | El pote azul de vaselina frena el 98% del agua que se te va de la cara de noche; el frasco de tapa dorada, 20-30 |

## 2. VOZ — cómo suena

- **Tono:** confesional, cálido, autoirónico ("me sentí ridícula"), sin vender.
- **Trato al espectador:** *you*, directo, EN-US conversacional con contracciones.
- **Muletillas y frases propias:** "I want to be honest with you" · "I want that on the record" ·
  "Not gone. I want to be careful. Not gone." · firma de cierre: *"Nothing in my kitchen is rubbish
  until I have asked it what it can do."*
- **Palabras que NUNCA usa:** nombres de marca, "milagro", "cura".
- **Tags de TTS:** `[curious]` `[serious]` `[sighs]` `[pause]` `[emphatically]` — moderados.
  ⚠️ Fish requiere `--keep-tags` o el factory los borra.
- **Datos personales:** ⬜ solo lo escrito acá. Edad usada en `grcoffee`: 57. Tiene una hermana
  **2 años mayor**. Madre jardinera (echaba los posos a las rosas). No inventar más.

## 3. LOOK — la marca visual

- **Skill de nicho:** `dr-federer` (es la skill del nicho dermocosmético entero, no de una persona).
- **Componentes:** los compartidos del nicho. **No clonar ni renombrar el kit para este canal.**
- **Paleta / tipografía:** ⬜ a definir en el primer montaje. Referencia de miniatura del canal:
  alto contraste, amarillo + flash rojo sobre foto real.
- **Formato:** híbrido — avatar a cámara + escenas de profundidad.
- **Reglas visuales:** ⬜.

## 4. REGLAS DE PRODUCCIÓN — overrides de herramientas

- **Voz / TTS (receta v2, MEDIDA 2026-08-23 — reemplaza la de agosto):** **Fish `s2.1-pro-free`**,
  preset `golden_remedies` de `fish_presets.json`: voz **`golden_remedies_v2`**,
  **`temperature 0.95`, `top_p 0.9`**, `--keep-tags`, **tags DENSOS (1 cada ~100 chars)**,
  y después **SIEMPRE** `python fish_breathe.py <master> <out> 1.59` → recién ahí loudnorm **−14 LUFS**.
  ⛔ `temperature 0.7` **ahoga la prosodia**, y con tags densos la generación llega a COLAPSAR en
  monotonía (4,1 semitonos medidos). Era la config vieja: no volver a ella.
  ⛔ NO usar los defaults del factory (1.15 / 0.98): son de Federer y acá no aplican.
  ⚠️ La nota vieja de que `_intriga` era "la más plana" **es falsa**: midiéndola es la de mayor
  rango de las tres (17,1 st). El problema nunca fue el tramo de referencia, era la temperatura.
- **Imágenes / B-roll / Render:** ⬜ (defaults del pipeline).

## 5. GLOSARIO — elementos recurrentes

- **used / spent coffee grounds** — posos húmedos, usados y FRÍOS del fondo de la cafetera (marrón
  oscuro, textura de tierra mojada). ⛔ nunca café fresco seco de la bolsa: es el error del video.
- **the kitchen window** — su punto fijo de fotos, luz de mañana.
- **the little jar** — la crema de ojos cara del estante del baño (el antagonista del canal).

## 6. APRENDIZAJES — correcciones del creador (append-only)

- **2026-08-23** — Largo objetivo del canal: **20.000+ caracteres**, no 14k (pedido a mitad del
  primer guion: "me confundí, pasa los 20k").
- **2026-08-23** — El creador vuelve a mandar el wav de ElevenLabs para "clonar" aunque la voz YA
  esté registrada de esa misma fuente. Verificar duración/codec contra `fish_refs/` ANTES de
  re-registrar; si es el mismo material, avisar y usar el preset ganador.
- **2026-08-23** — Pidió la voz "extremadamente humana, idéntica al audio". **Re-clonar NO era la
  palanca** (el re-clon solo, a temp 0.7, salió PEOR: 12,7 st vs 14,6). Las dos que sí movieron la
  aguja, medidas contra la narración real: **(1) subir `temperature` a 0.95 / `top_p` 0.9** y
  **(2) el techo de pausas del modelo**, que se rompe en post con `fish_breathe.py`. Fish devuelve
  pausas de ~0,46s contra 0,73s de la voz humana **y eso no cambia con ningún parámetro, referencia
  ni tag `[pause]`**. Regla general para cualquier canal: si el creador dice "no suena humano",
  medir **respiración (silencio %, pausas/min, mediana de pausa)** antes que timbre — es por donde
  él juzga, y es lo que el modelo hace peor.
- **2026-08-23** — Largo entregado en `grvaseline`: 29,6k chars → 34,4 min, y 37,7 min ya con las
  pausas estiradas. El estirado cuesta **+3,3 min** de duración: presupuestarlo al planificar.

- **2026-08-23** — Video `grcoffee` entregado. **Avatar PARCIAL en bucle**: la creadora grabó 5:31.6
  de 27:23 (20%). Receta que funcionó: lean a 1.4 Mbps → `-stream_loop` hasta el largo del master →
  muxear el wav ahí mismo (un solo `<Video>`, sync perfecto, cero riesgo de audio doble). Y **prohibir
  el split a media pantalla pasada la costura**: media pantalla con su cara fuera de sincro se nota
  muchísimo más que b-roll a pantalla completa.
- **2026-08-23** — ⛔ **El kit premium tiene TODOS los `eyebrow` por defecto en ESPAÑOL** (NumberedSteps
  "Paso a paso", SplitPanel "En resumen", ChecklistReveal "Cómo darte cuenta", BarCompare "Frente a
  frente"). En este canal, que es EN, **hay que pasar `eyebrow` explícito en inglés SIEMPRE**. Salió
  en pantalla en la 1ª corrida. Lo mismo con `GuardaEsto` (`tag`/`prompt` en voseo).
- **2026-08-23** — `BigStatReveal` declara `value?: number`: pasarle texto ("More", "SUN") rinde
  **"000"** sin crashear. Para un valor que no es número va `callout` (`figure` sí acepta texto).
  Y `chips`/SplitPanel sin `image` dibuja una ilustración por defecto de sol y mar.
- **2026-08-23** — **agnes-VIDEO oscurece MUCHO más que agnes-IMAGEN con el mismo prompt** (medido:
  luminancia 0-23 contra 37-109). Los ambientes de cuarto oscuro salen negros en clip y bien en foto
  → conviene degradarlos a foto en vez de regenerar. Y los **macros extremos de piel** ("very close
  view of a lower eyelid") salen con textura pustulosa/uncanny: abrir el plano a la CARA.

- **2026-08-23** — **COSTO gpt-image en este canal.** El unico gasto real por video son las fotos
  HERO de la presentadora: agnes NO puede hacer su cara (no acepta referencia de imagen), asi que
  van si o si por `gen_images_ref.mjs` con `OPENAI_IMAGE_QUALITY=low`. En `grvaseline` fueron **14**.
  Dos palancas medidas para bajarlo:
  1. **BIBLIOTECA DE HERO POR CANAL** (la grande, pendiente): la casa es FIJA (misma cocina, mismo
     bano, misma mesa) y las poses se repiten en todos los videos — "en el lavabo", "frente al
     espejo", "sentada a la mesa mirando a camara", "en el borde de la banera". Generar ~30 UNA vez,
     etiquetarlas, y reusarlas -> el costo marginal por video baja a casi cero y solo se generan las
     2-4 poses realmente especificas del video.
  2. **REFERENCIA CHICA**: se estaba mandando el frame Full HD del avatar (1,7 MB) en CADA llamada.
     Con `/images/edits` la referencia se cobra como tokens de ENTRADA, y el script solo loguea los
     de salida, asi que ese gasto era invisible. Usar `ref_<slug>_small.png` (recorte cara+hombros
     a 768x768) — misma identidad, la mitad del peso.

- **2026-08-23** — ⛔⛔ **EL AVATAR PUEDE VENIR CON OTRA VOZ, NO CON LA MÍA.** En `grcoffee` el
  generador de avatar **re-sintetizó la locución un 23% más lenta** (150 wpm contra 177) en vez de
  lipsyncarla sobre el wav que le pasé. Mismas palabras, otro timing: muxear mi master encima
  calzaba sólo en el segundo 0 y a los 30s ya iba 2,4s corrido. Se descubrió **con el video ya
  entregado**, y el creador lo marcó ("no entiendo pq al principio el avatar no está sincronizado").
  **Correr SIEMPRE `node scripts/avatar_sync_gate.mjs <avatar.mp4> <master.wav>` antes de montar**
  (2 min; dio 0.078 en el caso roto y 1.000 en el control).
  **Fix sin regenerar el avatar** (el que se usó): master v2 = **audio PROPIO del avatar** en su
  tramo + mi master desde la palabra equivalente, empalmados en un límite de oración y cada tramo
  normalizado por separado a −14 LUFS. No hubo que reescribir NADA del montaje: los momentos y los
  componentes se anclan por FRASE, así que el generador los re-ubicó solo sobre las captions nuevas.
- **2026-08-23** — ⚠️ **No perseguir el 0,2% del farm.** El mp4 del farm dura ~0,195% más que la
  composición (60 chunks × ~57 ms de padding del AAC). Medido sobre el mp4 final contra el wav
  fuente parece deriva de lipsync (+3,0s a los 25 min), pero se estiran los DOS streams casi igual
  (video 0,1937% · audio 0,1963%) → desfase A/V **real de 9 ms**. Imperceptible. Lo tienen todos.

- **2026-08-23** — ✅ **`grvaseline` ENTREGADO** (job 217, tarjeta `k26it9s`, 37:46). Avatar PARCIAL
  en bucle: 10:30.6 de 37:46. Aprendizajes del montaje, todos con costo medido:
  - ⛔ **`MitoVerdad` lee `myth`/`truth`, NO `mito`/`verdad`** — y sus etiquetas por defecto son
    `"MITO"`/`"LA VERDAD"`, que en este canal EN hay que pisar con `mythLabel`/`truthLabel`. Con las
    props mal, las 4 tarjetas salieron **VACÍAS y el chunk en VERDE**. Es el fallo más caro porque
    no aparece en ningún log. Lo caza `node scripts/check_props.mjs <slug> <Main>`, que ahora valida
    que cada prop del beat aparezca como `b.<prop>` en el Main o `beat.<prop>` en los renderers.
  - ⛔ **`BlurExplainer` exige `clip` ADEMÁS de `image`** (el video borroso del fondo). Sin él,
    `staticFile(undefined)` mata todos los chunks que lo contengan.
  - ⛔ **RELLENO POST-COSTURA, obligatorio con avatar parcial.** Pasada la costura la boca no calza.
    Medido en la 1ª entrega: **16,1% del tramo posterior (4m22s) con la cara sola**, 39 tramos de
    ≥2,5s y el mayor de **12,4s**. Se tapa cada hueco con la FOTO del beat más cercano → **5,2% y
    CERO tramos ≥2,5s**. ANTES de la costura NO se toca (39% de avatar solo está bien: ahí sincroniza).
  - ⛔ **agnes-VIDEO: medir la luminancia al FINAL del clip, no sólo al principio** (`_v3/measure_tail.py`).
    Varios empiezan bien y se apagan (59 → 17). Y sobre el MP4 rendido, `blackdetect` + barrido de
    luminancia: 6 clips oscuros pasaron los filtros previos y se veían negros en pantalla.
  - ℹ️ **NO son bugs** aunque lo parezcan en un frame suelto: `BarCompare` tiene un movimiento de
    cámara que recorre las barras (a mitad se ve cortado, resuelve encuadrado), y el `body` de
    `BlurExplainer` se escribe con efecto de tipeo (1,4 chars/frame desde el segundo 1).

- **2026-08-23** — ⛔ **Al clonar un `Main_*.tsx` hay DOS cosas que se renderizan FUERA del beatsheet** y por eso
  `check_props`, `density_gate` y `gap_gate` son ciegos a ellas: el **HOOK** (`AvatarScrimText`, `<Sequence>` a
  mano con el texto escrito duro) y el **ENDCARD** (`<Endcard/>` sin props). En `grbanana` el hook salió con el
  texto de `grcoffee` ("COFFEE ON MY FACE") y el endcard con el default del kit, que es **"DR. FEDERER /
  Suscríbete / Cada semana, salud y vitalidad real para después de los 40"** — en español, en un canal inglés.
  Los agarró el AUDITOR mirando frames, no las compuertas. **Al clonar: pisar los dos SIEMPRE**
  (`kicker`/`title`/`subtitle`/`cta` del Endcard y setup/impact del hook). `grcoffee` se entregó con este bug.
- **2026-08-23** — `MitoVerdad` de `_fed6` usa `myth`/`truth` (el contrato de `check_props` decía `mito`/`verdad`,
  de otro kit) y sus etiquetas defaultean a **"MITO"/"LA VERDAD"**: en un canal EN hay que pasar
  `mythLabel`/`truthLabel` **y** que el Main los reenvíe. Ya está arreglado en `Main_grbanana`.
- **2026-08-23** — Cuota de agnes con OTRA tanda corriendo: los primeros 10 clips costaron 143 "cola llena" y
  115 rate-limits. Sola, la tanda rinde ~3-4 clips/min (388 clips ≈ 100 min). Mirar si hay otra tanda ANTES de
  prometer un plazo.
