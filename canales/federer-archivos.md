# Canal: Federer Archivos (@FedererArchivos)

> **Este archivo MANDA sobre cualquier regla genérica.** Si algo acá contradice la skill de nicho,
> el pipeline o tu criterio, **gana este archivo**.
> Leelo COMPLETO antes de escribir guion o editar. Mantenelo actualizado (§6).
>
> 📌 Esto **no es una biografía ficticia**. No inventes familia, edad ni vida personal. Es la
> **IDENTIDAD DE ESCRITURA del canal**: cómo escribe, cómo engancha, cómo suena.
>
> ⚠️ Archivo BOOTSTRAPEADO por el agente (2026-07-21) desde la skill `federer-video` (scopeada a
> ESTE canal). Persona = "Dr. Federer" (identidad de escritura, no biografía). Lo que sea dato
> personal REAL desconocido queda en ⬜ hasta que el creador lo confirme.

---

## 1. ADN DE ESCRITURA — cómo escribe este canal

> La fórmula general está en `para-chatgpt/GUION.md` (esa se aplica SIEMPRE).
> Acá va lo que es **propio de este canal** y la pisa.

- **Cómo son los ganchos acá:** gancho POR SÍNTOMA que el mayor de 60/80 siente en el cuerpo
  ("piernas que tiemblan al pararte, calambres de madrugada, se te aflojan al bajar la escalera")
  + creencia falsa que desarma ("creés que es la edad… no lo es").
- **Estructura preferida:** síntoma → HISTORIA EMOTIVA de un paciente concreto (nombre, edad, un
  detalle) → mecanismo (siempre atado al hilo de CIRCULACIÓN + recuperación del músculo de noche)
  → cuerpo numerado (de menor a mayor) → auto-diagnóstico ("¿cuál es tu caso?") → cierre + CTA guía.
- **Cómo abre y cómo cierra:** abre con avatar full hablando del síntoma; cierra con recap numerado
  + carnada de comentarios + teaser ultra-específico del próximo.
- **Densidad / ritmo:** frases cortas, natural-hablado, muletillas. ~1 visual cada 3-5 s.
- **Largo objetivo:** 20.000+ caracteres (confirmado por el creador 2026-07-21; mínimo global: 14.000).
- **Qué hace SIEMPRE:** escudo de honestidad; cantidades exactas EN LA DESCRIPCIÓN (manda a abrirla);
  distingue caso benigno de SEÑAL DE ALERTA que va al médico.
- **Qué NUNCA hace:** prometer curas milagrosas; decir "los médicos lo callan"; inventar estudios.

### Ganchos ya usados (para NO repetirlos)

| Fecha | Video | Gancho usado |
|---|---|---|
| 2026-07-21 | vlnljrhb57m3 — piernas fuertes antes de dormir | "Te parás de la silla y las piernas te tiemblan… no es la edad, es lo que hacés (o no comés) antes de dormir" |
| 2026-07-21 | vh7v3kdc5l9h — boca seca después de los 60 | "Las 3 de la madrugada, la lengua pegada al paladar, ni una gota de saliva… no es la edad, es un aviso" — 5 causas (deshidratación/medicamentos/respiración bucal-apnea/azúcar en sangre/Sjögren) |
| 2026-07-21 | vtio42jf5tzj — verdura #1 creatinina/riñones | "Tus riñones no te avisan cuando se están apagando; no hay dolor" → verdura #1 = MORRÓN ROJO (bajo potasio, alta vit C, antioxidante, agua). Enemigo = wellness/jugo verde-banana (potasio). Error final = confundir "sano" con "bueno para riñón cansado" |
| 2026-07-21 | vtio42jf5nvu — verdura #1 creatinina/riñones | "Don Alberto, 74, creatinina 2.1, le dijeron diálisis… bajó a 1.4 con algo de la heladera" — verdura #1 = MORRÓN ROJO (bajo en potasio/fósforo/sodio); mito = espinaca/acelga/remolacha; error = sal escondida (cubito/fiambre). Hilo circulación→filtrado renal |
| 2026-07-22 | vs9t3drvl5q6 — líneas en las uñas / falta de hierro | "Mirate las uñas ahora mismo: si ves líneas/surcos, no es la edad, es una carta que casi nadie sabe leer. La uña crece 0,1mm/día = reloj con fecha" — 5 señales (1 crestas verticales=edad+agua/hierro · 2 líneas blancas Muehrcke/leuconiquia=proteína+zinc · 3 surcos de Beau=cuerpo frenó · 4 uña en cuchara/pálida=HIERRO/ferritina=el ESTO · 5 línea oscura vertical o mitad-mitad=SEÑAL DE ALERTA→médico). Enemigo=biotina/queratina/esmalte que TAPA. Error final=tratar la uña por afuera. Teaser próximo=color del párpado de adentro p/ anemia. FocusCards en recap |

## 2. VOZ — cómo suena

- **Tono:** cálido-clínico, médico de confianza, ~40 años. Cercano pero con autoridad.
- **Trato al espectador:** VOSEO argentino (vos / escuchame / ¿viste?).
- **Muletillas:** "te juro", "escuchame", "¿viste?", "de esos que…", "te confieso", "y bueno".
- **Palabras que USA:** circulación, riego sanguíneo, óxido nítrico, músculo, recuperación.
- **Palabras que NUNCA usa:** "cura", "milagro", "los médicos te mienten".
- **Tags de TTS (v3):** SÍ [clears throat], [sighs], [chuckles], [whispers], [slowly],
  [emphatically] — pocos, siempre DESPUÉS de una frase, nunca abriendo párrafo. NO [pause]/[pausa].
- **Datos personales:** solo los que estén escritos acá. Nombre real detrás de "Dr. Federer" = ⬜.
  Credenciales específicas = ⬜. Voz HeyGen/ElevenLabs concreta = ⬜. NO inventar.

## 3. LOOK — la marca visual

- **Skill de nicho:** `federer-video` (kit `federer-video`, vive en `src/_fed6/`).
- **Componentes (compartidos del nicho):** AvatarLayer, AvatarKeyword, RawShot, FedererComponents2
  (todos bajo `src/_fed6/VideoEdit/`), FedWhiteboard (pizarra Vox, `src/FedWhiteboard.tsx`).
- **Paleta / tipografía:** CLÍNICO teal `#12B3AE` + blanco/crema + tinta oscura, Inter.
- **Formato:** híbrido — avatar a cámara (HeyGen) + capa densa de b-roll + imágenes IA + componentes.
- **Reglas visuales del canal:** avatar solo FULL / HIDDEN / SPLIT — CERO recuadro/PiP/cornerTR.
  Capa densa de b-roll siempre. Hook: avatar full ~1.4 s → hidden durante el scrim.

## 4. REGLAS DE PRODUCCIÓN — overrides de herramientas

- **Imágenes:** gpt-image-2 (clonar `gen_federer6.mjs`), NO Modal para este canal.
- **Voz / TTS:** avatar grabado en HeyGen por el creador (no TTS faceless).
- **B-roll:** Pexels (stock real) + match_v3.
- **Render:** farm de GitHub Actions, rama por slug.
- **Otros:** cantidades exactas de recetas → EN LA DESCRIPCIÓN, no en el audio.

## 5. GLOSARIO — elementos recurrentes

- **Dr. Federer:** médico-avatar cálido-clínico, consultorio/cocina, teal/blanco.
- **Guía / producto:** `archivos-federer.vercel.app` (SIN https en pantalla).
- **Hilo del canal:** todo se explica desde la CIRCULACIÓN y la recuperación del músculo de noche.

## 6. APRENDIZAJES — correcciones del creador (append-only)

- 2026-07-21 — Canal creado/bootstrapeado por el agente desde la skill `federer-video`. Falta que el
  creador confirme el nombre real / credenciales / voz concreta del presentador (hoy en ⬜).
- 2026-07-21 — SIEMPRE pegar el GUION COMPLETO en el chat (además del ATTACH del .txt), NUNCA solo
  decir la ubicación del archivo. El creador quiere leerlo/copiarlo directo en el chat.
- 2026-07-21 — LARGO objetivo firme de este canal: **+20.000 caracteres** por guion (no el piso global
  de 14.000). Desarrollar cada causa con su número + mini-ejemplo + objeción, no agregar relleno.
- 2026-07-21 — La GUÍA gratis del canal (`archivos-federer.vercel.app`) ES REAL y existe: se puede
  mencionar con confianza y mandar las cantidades exactas de recetas a la descripción/guía.
- 2026-07-21 — ⛔ NADA de SPLIT 50/50 (halfR) en este canal: cuando el avatar comparte pantalla con
  una imagen/clip, Federer queda MAL ENCUADRADO (cara cortada/descentrada). El avatar va SOLO en
  FULL (pantalla completa) o HIDDEN (visual a pantalla completa), alternando. En `Main_<slug>.tsx`,
  `buildWindows` NO debe emitir modo `halfR` — las ventanas de contenido van todas a `hidden`.
  (Refuerza la regla vieja "O avatar full O visual full; cero recuadro/PiP".)
- 2026-07-21 — (REEMPLAZA la línea de "NADA de split 50/50" de arriba) El creador SÍ quiere el SPLIT
  50/50, pero con Federer CENTRADO en su mitad. El `AvatarLayer` ya lo soporta: pasarle
  `avatarFocus={{ x, y, splitZoom }}` desde el Main (x/y = dónde está la cara en el clip, 0..1;
  splitZoom = zoom en el split). Para este avatar: `{ x: 0.5, y: 0.4, splitZoom: 1.12 }`. NO tocar el
  archivo compartido AvatarLayer. Re-habilitar `halfR` alternando en `buildWindows`.
- 2026-07-21 — PRIMER MINUTO = lo más importante: diseñar una GRILLA toma por toma ANTES de armar.
  Fórmula que funcionó (boca seca): recrear la HERIDA con macros de 1.5–2.5s (no ilustrar), un golpe
  visual inesperado (metáfora "luz de tablero", único acento rojo), avatar que VUELVE full en los
  remates, y DOS loops de curiosidad plantados en el min 1 (el "5 causas" + tarjeta CANDADO
  "te lo digo al final" → componente `LoopLock_<slug>.tsx`) que se pagan después. Cierre del hook con
  stat "9 de cada 10". Se re-rendea SOLO el chunk del hook si el resto no cambia.
- 2026-07-21 — Cuando el guion ENUMERA consejos/causas ("uno… dos… tres…"), mostrarlos como
  TARJETAS FLOTANTES numeradas, cada una con su imagen BORROSA, y a medida que el avatar dice cada
  número se ENFOCA la tarjeta que toca (se le quita el blur + borde teal + escala), las demás siguen
  borrosas. Anclar el enfoque al ms del caption (frase distintiva de cada ítem). Implementado como
  componente `FocusCards_<slug>.tsx` (kind `focuscards`, kit `_fed6`). Usarlo en TODO recap numerado.
- 2026-07-21 — CREADOR: la guía `archivos-federer.vercel.app` ES REAL → mencionarla siempre (CTA breve, regalo).
- 2026-07-21 — CREADOR: pegar SIEMPRE el guion COMPLETO en el chat (además del ATTACH), nunca solo la ubicación.
- 2026-07-21 — CREADOR: largo objetivo de guion de ESTE canal = **20.000+ caracteres** (reemplaza el 15.000 de §1).
- 2026-07-21 — CREADOR: técnica de retención OBLIGATORIA de este canal → meter el tag ElevenLabs v3 **`[clears throat]`** (carraspeo/tos leve) DESPUÉS de la primera oración del video y ANTES/DESPUÉS de cada oración importante o justo antes de revelar algo. Sube muchísimo la retención. (Esto pisa el "pocos tags" genérico: acá se usan seguido, pero SOLO en los puntos de revelación, no en cada frase.)
- 2026-07-21 — CREADOR (refuerza halfR): cuando el avatar comparte con imagen/video (split 50/50) Federer queda MAL ENCUADRADO → NUNCA split. Avatar SOLO full o hidden. `buildWindows` no emite halfR.
- 2026-07-21 — CREADOR: en las ENUMERACIONES de consejos ("uno… dos… tres…") usar **FocusCards** (tarjetas flotantes numeradas con imagen BORROSA; al decir cada número se ENFOCA/nitidez esa tarjeta). Componente `src/_fed6/VideoEdit/FocusCards_<slug>.tsx`, kind `focuscards`, items `{image, label, atPhrase}` anclados al ms del número. Va en el recap y en cualquier lista numerada.
- 2026-07-21 — CREADOR: ⛔ NO REPETIR CLIPS de b-roll. Si faltan, DESCARGAR MÁS (Pexels). El track anclado usa cada clip UNA vez en su momento de narración; nada de densify que repite.
- 2026-07-21 — CREADOR: cada clip/imagen/componente que aparece debe ENCAJAR EXACTO con lo que dice el avatar en ese instante y con el contexto (sync milimétrico por frase de Whisper).
- 2026-07-22 — CREADOR (transcripción): el sync milimétrico depende de la calidad de la transcripción. `modal_whisper.py` con modelo **`medium`** SE COME/COMPRIME palabras en habla rápida (dropea "uno/dos/tres" del recap, secciones enteras) → las anclas caen en fallback y "no encaja al ritmo". FIX: transcribir SIEMPRE con **`--model large-v3`** en este canal (captura +140 palabras, no dropea). El anclaje ya es al ms exacto de la palabra (findMs → startMs), el cuello era el modelo. Mejora futura: alineación forzada (WhisperX/wav2vec) para ms por palabra aun en habla muy rápida.
- 2026-07-22 — CREADOR (encuadre, refuerza halfR): confirmado en el video de creatinina — cuando hay muchas imágenes/clips el avatar en SPLIT queda mal encuadrado. Aplicado: `buildWindows` emite solo full/hidden (cero halfR). El recap enumerado ("uno… cinco") ahora va con FocusCards (5 tarjetas, la que toca se enfoca al decir su número, ancladas al ms). Ambos ya son estándar del canal.
- 2026-07-22 — PRODUCCIÓN (gotcha resuelto): si Pexels throttlea (429) y el b-roll queda RALO en un tramo (típico: el último tercio), el avatar en modo `hidden` sin clip detrás muestra el FONDO teal pelado → sale como NEGRO en el MP4 (blackdetect lo caza). FIX baked en `Main`: `buildWindows` ahora tiene un GAP-FILL — calcula cobertura (broll+fotos+comps) y donde NO hay contenido pone el avatar FULL (nunca fondo pelado). Aplicarlo a TODO Main de este kit. Además: auditar SIEMPRE el MP4 con `ffmpeg blackdetect` antes de dar por bueno el render; si hay negros, es b-roll ralo → gap-fill o bajar más clips y re-render PARCIAL de esos chunks.
- 2026-07-28 — AVATAR (HeyGen): el motor `avatar_iii` (digital twin) de ESTE avatar **NO deja costuras
  visibles** entre escenas de una misma llamada `create_video_from_studio`. Verificado en el video de
  las canas (8 escenas, 25:30): `ffmpeg select='gt(scene,0.06)'` no detectó nada, y bajando el umbral
  hasta 0.015 tampoco. O sea que el paso de "marcar las costuras como cortes obligados a visual
  full-screen" **no hace falta en este canal** — no hay salto de pose que tapar. Igual conviene
  correr la detección una vez por video por si cambia el avatar.
- 2026-07-28 — KIT (bug que MATA el render, no lo repitas): `AvatarPizarra` y `AvatarKeyword` NO
  comparten el shape del ítem. `KwItem` (keyword) = `{word, sub, image?, tone}`; `PizItem` (pizarra)
  = `{image | card, caption, eyebrow, sub}`. Si a la PIZARRA le pasás `word`, el ítem queda sin
  `image` y sin `card`, cae en la rama de imagen y ejecuta `staticFile(undefined)` → el chunk muere
  con "undefined was passed to staticFile()". Costó 4 chunks de 30. En la pizarra el título grande va
  en **`card`**, no en `word`.
- 2026-07-28 — KIT: `BigStatReveal` (kind `stat`) recibe `value` como **NUMBER** y lo dibuja con un
  odómetro. Si le pasás un string ("3,5 mg", "H₂O₂", "x3 o x4") NO falla: renderiza **`000`** en
  pantalla, que es peor porque parece un dato roto y no se ve hasta mirar el render. Hay que partir
  el string en `prefix` + número + `suffix`; y si no tiene número, usar `callout` (su `figure` sí es
  texto libre).
- 2026-07-28 — KIT: `BarCompare` en VERTICAL dibuja el valor arriba de la barra y la más alta pisa el
  título. En HORIZONTAL el valor va al costado y no choca, pero el encabezado igual cruza la primera
  fila y con 3+ barras la de arriba se corta. Receta que quedó bien: `orientation="horizontal"`, SIN
  `title` ni `eyebrow` (las etiquetas + `unit` alcanzan) y **máximo 2 barras** (la ganadora y su rival
  más alto). Resolverlo en el `Main_<slug>.tsx`, NUNCA en `scenes/BarCompare.tsx` (es compartido).
- 2026-07-28 — EDICIÓN: al inyectar muchos beats de componente anclados por frase (acá 167), dos caen
  casi en el mismo instante y se dibujan encimados. Hace falta un **des-solape por ZONA DE PANTALLA**,
  no por tipo: `lowerthird` vive en la banda inferior y `frasecinetica` en el centro (esos dos SÍ
  pueden convivir), y todo lo demás compite por la pantalla completa. Separación que funcionó: 3,0 s
  entre full, 2,2 s entre overlays de la misma zona. Ojo: `talk` y `raw` NO son componentes y no
  deben desplazar a nadie.
- 2026-07-28 — FARM: el tarball de assets topa en **2 GB** (límite de GitHub por asset de release; da
  HTTP 422 "size must be less than 2147483648"). Un video de 25 min con 340 clips daba 4,4 GB. Fix:
  recomprimir el b-roll a 720p CRF 28 recortado a 12 s (2,7 GB → 376 MB) y el avatar `_opt` a CRF 27
  (479 → 326 MB). Total ~860 MB. Los clips se ven ~4 s en pantalla: 720p no se nota.
- 2026-07-28 — FARM: el argumento de PREFIJO de `farm.mjs` tiene que ser **`p_<slug>`**, no `<slug>`.
  Las imágenes se llaman `p_<slug>_*.png` y el filtro es `startsWith(pref)`, así que con `<slug>`
  pelado el pre-vuelo dice "24 assets quedan FUERA de la lista del tar".
- 2026-07-28 — PIPELINE (falla silenciosa): `dense_prep_<slug>.mjs` NO debe sobreescribir
  `shots_dense_<slug>.json`, que es la lista COMPLETA de descarga. Si la pisa con los clips ya
  anclados, el fetcher deja de pedir el resto y **la descarga se estanca sin error** (acá: 5 tandas
  seguidas diciendo "155/155 bajados" cuando faltaban 290). El anclado va a `shots_used_<slug>.json`.
  Relacionado: el nombre del clip debe salir de un mapa persistente query→archivo
  (`qmap_<slug>.json`), no del índice, o reordenar el mapa desalinea todo lo ya bajado.
- 2026-07-28 — PIPELINE: `density_gate.mjs` y `broll_isolation_gate.mjs` solo miran `src/VideoEdit/`,
  y el kit de este canal vive en `src/_fed6/`. Para que midan, crear un **puente**
  `src/VideoEdit/Main_<slug>.tsx` que re-exporte el Main real y lleve el `ASSET_MANIFEST` en un
  comentario `/* */` con todos los visuales (el gate lo conserva cuando no hay `cues_<slug>.gen.tsx`).
- 2026-07-22 — CREADOR (ESTRUCTURA DE GUION, importante): el cuerpo NO va como lista fría ("señal uno, señal dos, beneficio tres") → aburre. Escribir el cuerpo como UNA SOLA HISTORIA tipo NOVELA: un paciente concreto con nombre/edad, detalles ultra reales (diálogos, la cocina, el mate frío, las manos heladas bajo la frazada, el turno que le dieron para dentro de 3 meses), y POLÉMICA que engancha al mayor ("te tratan de viejo y no te miran", "te venden el frasco caro en vez de revisarte", "es la edad" como desprecio del sistema). Cada beneficio/causa/señal se va REVELANDO como un capítulo de esa historia, no anunciando "número tal". El recap final SÍ queda numerado (para FocusCards en pantalla). Objetivo: "los ancianos te van a amar como Dr. Federer". Aplicar a TODOS los guiones de este canal de acá en más.
