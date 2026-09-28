# BRIEF tfbcola: pedido del creador + notas del orquestador

## NOTAS DEL ORQUESTADOR (leer primero)
- Sos 1 de 6 agentes: cada uno hace un video de The Free Builder en paralelo (tfbinodoro, tfbpintura, tfbpiedra, tfbcola, tfbtanque, tfbpiso). Comparten la cola de agnes, Fish, OpenAI y el farm, así que sé prolijo con esos recursos.
- El job de Bagasy YA está creado: `video_jobs` id **572** (provider `claude-code`, status running), enganchado en la tarjeta `fbv51790543074490-4`. `deliver_card.mjs` lo REUSA al entregar. Al final, repatcheá `provider: claude-code` si deliver_card lo pisa.
- NO edites memoria (`~/.claude/projects/.../memory`) ni skills. Los aprendizajes van en tu mensaje final bajo `APRENDIZAJES:` y yo los guardo.
- Si te trabás en una decisión que le corresponde al creador, o la cola de agnes/Fish no da abasto, escribí `DUDA:` + contexto + números (clips hechos/faltantes) y PARÁ. Yo te contesto por SendMessage.
- Economía de tokens: no leas archivos grandes enteros (usá grep/head). No mires imágenes una por una: primero el filtro gratis de agnes-3.0-flash, después hojas de contactos. Logs con `tail -n 5`. Procesos largos en background con log a disco. Matá procesos sólo por PID propio.
- ⛔ Regla de fábrica: no crees `build_tfbcola.mjs` ni scripts por slug en `scripts/`. Lo específico de este video va en `vlog/tfbcola/` (planes JSON, overrides) y en `src/tfb/` (componentes reusables, ver MONTAJE).

---

## EL PEDIDO

Producí de principio a fin un video del canal "The Free Builder" / El Constructor Libre (https://www.youtube.com/channel/UC-Xn4lJ35qOcf2px1BkHvEQ, Bagasy `tracked_channels` id 59) en el proyecto video2 y entregalo en Bagasy. Seguí el pipeline con las skills: abrí `video-pipeline`, la skill del nicho `constructor-video`, `agnes-broll` § "⭐⭐⭐ VLOG CONTINUO", `fish-tts` y `remotion-best-practices`. NO saltees el §0 DIRECTOR ni el §4 AUDITOR. Idioma del video: ESPAÑOL NEUTRO LATAM con "tú", sin voseo ni modismos regionales (el título queda literal). Conmigo hablás en español.

La vara del creador, textual: **"una locura, ultra dinámico, con un realismo increíble; el primer minuto sin silencios y lleno de efectos; componentes nuevos ultra profesionales, ahora que se puede hacer cualquier cosa frame a frame con código"**. Optimizá todo lo que puedas (paralelo, Batch, nada repetido), pero **sin bajar la calidad en absoluto**.

**Título (literal de la tarjeta):** Cómo Hacer COLA de Carpintero CASERA — Pega Más Fuerte Que la de Ferretería ($1)
**Slug:** `tfbcola` · **Worktree YA PREPARADO:** `D:/Proyectos/video2-wt/tfbcola` (rama `tfbcola-render`, nace de origin/main 8f943da). Tiene:
- `.env`, `fish_voices.json`, `fish_refs/claudio_{definitiva,calmo,enfatico}.wav`, `fish_factory.py`, `yt_comments.mjs`, `public/sfx`.
- `public/ref_tfbcola.png` = el presentador (`claudio_hd.png`) y `public/ref_tfbcola_face.png` = RECORTE 128x192 de su cara, neutra, para las anclas.
- `public/ref_vecino.png` + `public/ref_vecino_face.png` = el VECINO (ver PERSONAJES).
- `public/img/tfbcola/` con el QR REAL `qr_tfbcola.png` (decodifica `https://constructorlibre.com/?src=tfb-cola`, ya verificado con cv2), la portada REAL `portada-coleccion.jpg`, `manualconstructorlibre.png` y las páginas reales `peek1..8.jpg`.
- `_ref_realismo/` = LA VARA VISUAL (ver REALISMO). `_v3/v2/armar2_ref.mjs` = el armado v2 de tfbgrietas, sólo como referencia (el runner de main ya lo trae portado).
- `node_modules` es una JUNCTION al repo principal: NUNCA la borres ni corras `rm -rf`/`rmdir /s` sobre ella.
- ⚠️ `scripts/agnes_vlog.mjs` tiene un cambio mío SIN commitear (commitealo con tu primer commit): acepta `plan.light` (reemplaza el bloque de luz fijo de las anclas) y `plan.look` (reemplaza el de los clips). Usalos SIEMPRE con los bloques de REALISMO de abajo.

**Tarjeta:** card_id `fbv51790543074490-4`. Leela en `tracked_channels` id 59 (`plan[]`, con `scripts/supa_creds.mjs`): `angle` (molde, receta del hook) y `thumb`. Mirá la miniatura UNA vez: el video tiene que cumplir lo que prometen miniatura y título.
**Moldes:** «Como hacer COLA CASERA de carpintero, PEGAMENTO…» de La Bodega del Capi, G7Pqc7NqTyo (1,6M con 36K subs, x44) + Graciela Herman «Cola de Carpintero CASERA» 2oBEGGD8U7Y (2,1M) + LAS COSAS DE LA LOLA mqML1jipBMc (5,5M). Un solo intento reciente (790 views): hueco abierto. Es la fórmula del canal ($1 + «la ferretería no te lo dice»).

---

## ⭐⭐⭐ REALISMO: la vara nueva del creador (manda sobre todo lo anterior)

El creador comparó dos imágenes. Una era una "foto IA bonita" (luz de estudio pareja, pose de modelo, fondo cremoso, todo prolijo) y la rechazó: se nota IA. La otra parecía **un fotograma accidental de un video común**, y ése es el nivel. Mirá `_ref_realismo/h01..h05.png` (hechas con esta receta, aprobadas como dirección) y los prompts en `_ref_realismo/items.mjs`. Principios:
1. **La cámara antes que la estética.** Una cámara de video común, a la altura de los ojos, en mano, con un encuadre casual y algo imperfecto. Algo queda cortado por el borde. Casi todo en foco, "nothing blurred out", con el fondo desordenado y legible. Nada de desenfoque de catálogo.
2. **Gente haciendo cosas, no posando.** El instante exacto de una acción: torso girado, manos ocupadas, peso en una pierna, mirando al otro o a lo que hace (a cámara sólo cuando le habla al que filma). Expresiones sutiles, no teatrales.
3. **La luz mundana del lugar, y nada más.** Luz de día por la puerta o la ventana, más la luz del techo del lugar (tubo fluorescente, lamparita cálida). Cada cosa recibe la luz según dónde está: algo más claro y frío cerca de la puerta, rincones más oscuros. Sin luz de estudio, sin contraluz de belleza. Correctamente expuesto: que se vea bien, pero no "iluminado".
4. **Materiales con uso:** ropa con arrugas y polvo, madera con brillos desparejos, metal con marcas, piel con poros y tono desparejo, pelos sueltos.
5. **Física plausible** en lo que se mueve (chispas, polvo, agua, gotas): en distintas etapas, con un leve motion blur.
6. **Color de video común:** balance de blancos automático, corrección mínima, contraste moderado, algo de ruido de sensor y compresión.
7. ⛔ **Nada de vocabulario de director de fotografía ni de "hiperrealismo"**: `cinematic`, `8K`, `ultra realistic`, `photorealistic`, lentes, f-stops, `bokeh`, `golden hour`, `rim light`, `film grain`, `color grading`, `HDR`. El modelo los lee como "género cine/stock" y devuelve justo el cliché. Describí la SITUACIÓN FÍSICA y la cámara en positivo (cada negación dibuja lo que negás).

**`plan.light` (anclas), usalo literal y sumá en cada prompt la luz concreta de ESE lugar:**
"This is one ordinary frame pulled from a normal handheld video shot by a friend with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the cluttered background stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, the side near the opening a little brighter and cooler, the far corners dimmer. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, small blemishes and uneven tone; hair with stray strands; clothes with real creases, dust and wear. People are caught mid-action, unposed."

**`plan.look` (clips):**
"Ordinary handheld home video filmed by a friend with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural hands; people move naturally and unposed, nothing staged; no music."

⚠️ El `check` pregunta "¿bright?" con visión: un garaje con luz de día correcta tiene que dar ✓. Si marca "oscura", subí la luz del LUGAR en el prompt (puerta más abierta, más cielo), no el "estilo".

**Presentador:** hombre de unos 50, pelo negro rizado, barba corta entrecana (la cara de `ref_tfbcola_face.png`). **Vestuario FIJO en todo el video, igual que en las miniaturas del canal:** camisa de trabajo verde oliva gastada con las mangas arremangadas y manchas de pintura y polvo, y delantal de cuero marrón gastado. ⛔ La foto `claudio_hd.png` lo muestra con mameluco azul: NO lo uses. Describí el vestuario literal en cada K0 y repetilo en las cadenas. ⛔ Nunca dice su nombre y ningún nombre suyo aparece en pantalla ni en la metadata.

**PERSONAJES:** el **VECINO** (`ref_vecino*.png`): unos 65, robusto, pelado arriba con canas a los costados, bigote gris tupido, camisa celeste a cuadros de manga corta con una lapicera en el bolsillo, anteojos colgados de un cordón. Es escéptico y descreído ("eso no funciona", "¿estás loco?") y es el mismo en los 6 videos: ya es un personaje de la serie. Aparece en el gancho y en 2 o 3 momentos más (duda → prueba → "bueno, me callo"). Se hace con agnes SIN audio de referencia: su diálogo literal en el prompt + "in Spanish with a neutral Latin American accent, the gruff, amused voice of a 65-year-old man". En el armado suena SU audio. Puede haber un 3er personaje si el tema lo pide (la esposa, el ferretero), siempre con ficha y ref de cara propias.

---

## ⭐⭐ EL PRIMER MINUTO: "una locura", cero silencios

**Tráiler del gancho:** seg 0-4: dos tablas encoladas con una pesa de hierro colgando: la MADERA se parte con un crac al lado de la unión y la línea de cola queda entera (sonido del crujido; cámara lenta en la rotura) · 4-9: el VECINO levanta el pedazo: «Se rompió la madera… pero la cola no.» · 9-15: él a cámara con el frasco: «Esta cola la hice yo, con cosas de la cocina.» · 15-40: planos rápidos de la receta (la leche cortándose, el colado de la cuajada, la mezcla que se vuelve miel), el pincel y la prensa · 40-55: la promesa · 55-60: loop: «pero hay un error que la hace fallar a las 24 horas, y casi todos lo cometen».
Reglas medidas (son compuertas, no deseos):
- **Seg 0-3 = la ACCIÓN más fuerte del video**, con su sonido real (foley del clip `keyframe` de agnes) y sin música. Nada de "hola, bienvenidos", nada de logo, nada de intro.
- **20-25 cortes en el minuto 1** (en el resto del video, 10-14 por minuto). Mezclá los tamaños: detalle macro → plano medio → reacción del vecino → a cámara. Ninguna toma dura más de 4 s en el minuto 1.
- **Cero silencios:** la voz es el MÁSTER continuo y las pausas de más de 0,25 s se comprimen. Donde no habla nadie, suena foley o SFX. COMPUERTA sobre el MP4 FINAL: `ffmpeg -t 60 -i final.mp4 -af silencedetect=noise=-32dB:d=0.3 -f null -` = **0 silencios**, más conteo de cortes del minuto 1 con `select='gt(scene,0.3)'` ≥ 20. Si falla, no se entrega.
- **Diseño de sonido capa por capa:** foley real de los clips de acción, whoosh en los cortes rápidos, impacto en cada revelación, riser antes del loop abierto, y una cama musical que entra en el seg ~6 por debajo de la voz (−20 a −24 dB bajo la voz). SFX de `public/sfx` (mirá qué hay antes de pedir otros).
- **Loop abierto al seg ~50-60** que se paga recién al final.
- La promesa del título se DICE en los primeros 15 s y se VE cumplida (el arreglo base completo) antes del minuto 2.

---

## GUION

- **Largo:** ~14.500 caracteres hablados (±8 %). Con `claudio_definitiva` rinde ~14,5 car/s + relleno, o sea ~17-19 min, que es el rango de los hits del canal. Calculá dónde caen los minutos 2, 3 y 7 ANTES de lanzar clips.
- **ULTRA HUMANO:** como habla un vecino con oficio que piensa en voz alta: se corrige, pregunta, bromea con el vecino, dice los números y las advertencias sin vueltas. ⭐ **Escrito PARA SER FILMADO:** cada frase ocurre en un lugar y con una acción visible, anotados entre corchetes (la voz no los lee). Nada "en el aire".
- **ESTRUCTURA:** gancho → dolor → curiosidad → descubrimiento → demostración → nueva intriga → solución. Cada bloque abre una pregunta. Los loops retienen las CAPAS (la proporción exacta, el error que lo arruina, la variante), nunca el dato básico. Una historia ilustrativa con nombre y país (un lector que escribió), sin resultados milagrosos.
- **Arreglo base (COMPLETO y a la vista antes del minuto 2):** la receta COMPLETA de la cola de caseína (leche descremada + vinagre → cuajada, lavado y escurrido, + cal o bicarbonato → la cola), las proporciones, el tiempo de uso, cómo se aplica y se prensa, el tiempo de prensado y de curado, y la prueba de rotura
- **DOLOR (leelo, no lo inventes):** `node yt_comments.mjs G7Pqc7NqTyo 150` sobre el molde. Guardalo a disco y leé sólo tu resumen. Las 2 o 3 preguntas que más se repiten se responden en los primeros 3-4 minutos.
- **✅ VERDAD DE CONTENIDO (obligatorio):** nada inventado. Cero estudios, porcentajes, "los expertos dicen" o cifras de ahorro sin fuente. Mostrá el límite de cada truco. «Más fuerte» se muestra con la prueba honesta: la madera se rompe antes que la unión, algo que también logra una buena cola vinílica. La verdad: la ventaja es el costo, que la hacés vos y que no es tóxica; no digas que supera técnicamente a la de ferretería. Límites: no aguanta la intemperie ni la humedad como una cola D3/poliuretano (para exterior, la comprada); se usa en el día (no se guarda); necesita prensado. La cal es cáustica: guantes y gafas. Sin cifras de kg/cm² inventadas.
- **Voz:** Fish s2.1-pro-free, voz `claudio_definitiva` (YA registrada: NO la registres ni toques `fish_voices.json`). Guion en LF. `python fish_factory.py --script guiones/tfbcola.txt --voice claudio_definitiva --out D:/Proyectos/video2-wt/tfbcola/out/tfbcola --concurrency 3 --block-chars 900 --temperature 0.7 --top-p 0.7`. Generá ANTES un bloque de prueba: si deriva a España o suena plano, probá `claudio_enfatico`/`claudio_calmo`; si ninguna sirve, `DUDA:`. Verificá la duración del máster (Fish puede cortar). ASR por palabra con Modal (whisper-1 de respaldo) → tramos de ≤ ~9 s cortados en pausas.

---

## CÓMO SE FILMA: VLOG CONTINUO, 100 % agnes, receta validada

Referencia completa y medida: tfbgrietas (mismo canal, job 537). Todo el video es el presentador HACIENDO lo que dice, con SU voz, en tomas continuas, más detalles de acción y el vecino. ⛔ Sin InfiniteTalk, sin avatar frontal quieto, sin fotos animadas.
1. **§0 DIRECTOR = PLAN DE RODAJE:** escenas por lugar (6-10). Por escena, una foto base + los tramos con su acción. 1 tramo = 1 clip, de un ancla a la siguiente. ⛔ Cadenas de ≤15 anclas (el runner aborta si no): partí una escena larga en dos con su propia foto base.
2. **ANCLAS:** `node scripts/agnes_vlog.mjs vlog/tfbcola/s1.json,vlog/tfbcola/s2.json,… anclas` (TODAS las escenas juntas en las MISMAS rondas de Batch, 1088x608, cara 128x192 = US$0,0033/ancla). K0 de cada escena desde `ref_tfbcola.png` reubicado en ese set, con el vestuario fijo. K(n) desde K(n-1) + la cara (lo hace el runner). Hoja de contactos por escena ANTES de gastar clips, filtrada primero con agnes-3.0-flash: la misma cara, el vestuario correcto, sin objetos colados, luz correcta.
3. **CLIPS:** `reference` + [K(n), K(n+1), cara] + audio del tramo. Límites: 4-12 s, 720P, 24 fps. ⛔ `agnes-video-2.5` sin "flash" es PAGO: no se usa.
   ⚠️ **Cola compartida entre los 6 agentes:** lanzá los clips de a 2-3 escenas a la vez, apenas estén sus anclas (no todos los del video juntos). El runner reintenta solo ante `video_queue_full`/rate limit. Cada clip tarda 5-9 min en render más la espera de cola. Mientras esperás, escribí los componentes, la lámina y el meta: nunca te quedes parado.
4. **PLANOS DE DETALLE (`keyframe` first_frame + last_frame, sin habla, CON foley real):** la acción de cerca, cada ~20-40 s, y en el minuto 1 muchos más. Son los que dan el ritmo y esconden las costuras. ⚠️ Keyframe = 7-17 min/clip: planificalos temprano. Mismo tamaño de plano en los dos extremos (cerrado→medio = corte interno).
5. **VECINO y secundarios:** sin audio de referencia, con el diálogo literal y el acento en el prompt. Plano y contraplano: un solo personaje habla por clip.
6. ⛔ **COMPUERTA `check`:** transcripción + labios (corr ≥0,8, lag ≤0,1 s) + saltos de pose + identidad y luz. Regenerá los ⛔ con `clips <id>` (queda la MEJOR versión, no la última). Costura >30/255 → mirá esos 2 cuadros.
7. **`armar`** por escena (voz = máster continuo, cortes limpios, 30 fps CFR 1920x1080 bt709).
- **Material:** el video ES el vlog. La regla de ≥25 % de stock NO aplica (pedido del creador, igual que en tfbgrietas). Pexels o YouTube sólo si una idea no se puede filmar en el set.
- **Imágenes:** gpt-image-2 **LOW**, siempre por Batch (⛔ nunca high/medium). Presupuesto de referencia: anclas ≈ US$0,5-1 por video.

---

## MONTAJE: "una locura" pero profesional

La base son los mp4 por escena. Encima va una capa de motion graphics **nueva, hecha frame a frame con código**, al servicio de lo que se ve:
- **Antes de crear, buscá en el kit** (MCP `codebase-memory`, proyecto `C-Users-bauti-Downloads-video2`, `search_graph` con `--file-pattern "*kit*"`; si la búsqueda no cuadra con el disco, reindexá). Lo nuevo va en **`src/tfb/Tfb<Nombre>.tsx`**: reusable, con props, sin texto quemado, pensado para que los otros 5 videos del canal lo usen. Listá tus componentes nuevos en el mensaje final.
- **Ideas de nivel (elegí y superalas):** TfbForceGauge: un medidor que sube con la carga hasta la rotura (sólo cualitativo, sin kg inventados); TfbGlueLineMacro: la lupa sobre la línea de cola intacta; TfbRecipeFlow: leche → cuajada → cola como un diagrama que se transforma; TfbWipeCompare. Y en general: el círculo de zoom amarillo que sigue al objeto (la misma gramática de la miniatura), flechas y subrayados dibujados a mano que se trazan sobre el footage, un corte de rayos X / sección animada del objeto, pantalla partida antes/después con una cortina que barre, congelado + anotación, rampas de velocidad en la acción (cámara lenta en la revelación), transiciones whip-pan/zoom-punch entre escenas, números que cuentan (SÓLO si son verificables), un contador de pasos, cámara virtual (push-in, shake en los impactos).
- **Profesional = limpio:** ≤12 palabras en pantalla, tiempo de lectura suficiente, jerarquía clara, easing suave (spring/interpolate con curvas), nada de fuentes de sistema, una paleta coherente con las miniaturas (blanco / amarillo / rojo sobre el footage). ⛔ Nunca una tarjeta que imprima una instrucción del director o el nombre del tipo de plano. ⛔ Cero subtítulos corridos.
- **Un momento visual "wow" por minuto,** planificado en el DIRECTOR con su segundo exacto (anclado a la palabra por ASR).

---

## CONVERSIÓN (guía, lámina, CTA, descripción)

**ENCAJE CON LA GUÍA:** PARCIAL: 36 «Pegar lo que ningún pegamento pega» y 50 «Guardar pinturas, colas y selladores para que duren» (verificá por grep qué dicen; si el 36 trata otros adhesivos, no digas que trae esta receta). La lámina es «una ficha con el estilo de la guía», NUNCA «una página de la guía». CTA honesta y general: la colección de arreglos caseros con materiales y medidas (verificá cuántos en oferta.ts) + la guía anti-humedad + la hoja de compras + las fichas de emergencia. Jamás insinúes que este tema está adentro.
Fuente para verificar CUALQUIER afirmación sobre la guía: `C:/Users/bauti/Downloads/manual-reparaciones-caseras/content/guia/manual.json` (grep, nunca leerlo entero) y `content/oferta.ts`. ⛔ Ningún número de páginas, precio ni cantidad que no verifiques ahí. ⛔ Nunca "gratis/regalo". Nunca precio ni URL en voz alta.
**LÁMINA:** una ficha premium con el estilo de la guía ("LA COLECCIÓN DEL CONSTRUCTOR LIBRE · FICHA X"), con el paso a paso, las medidas y "LOS 3 ERRORES", en papel crema #F1E4C9, tinta espresso, óxido #8B2D22, oro #B1832F y serif grande. gpt-image-2 LOW con un prompt detalladísimo que cierre con "every word in SPANISH spelled EXACTLY as written, no invented words; CRITICAL SPELLING: render every accent and the N-with-tilde exactly". Revisala con zoom (inventa typos). La lámina resuelve el tema ENTERO sola y no revela el loop final. Si el tema NO está en la guía, es "una ficha con el estilo de la guía", NUNCA "una página de la guía".
**EL MOMENTO (min ~6-7):** en el vlog toma una hoja: "Presta muchísima atención a esta imagen, porque probablemente sea la parte más importante del video." Corte a la lámina a pantalla completa 25-40 s, con zoom punto por punto, y la voz sigue. Al terminar, casual y según el encaje: "…esta es una página de la guía completa del canal / esto lo tengo ordenado junto con otros arreglos en la guía del canal. Si estás en el televisor, apunta la cámara de tu teléfono a este código; si estás en el teléfono, el enlace está abajo." Encima va el QR REAL (sin Ken-Burns, fondo blanco, ≥4 s, que decodifique en un frame del MP4 FINAL con cv2) + la portada REAL. 3 CTAs casuales: ~min 6-7, ~60 % (que nazca del relato) y el cierre. Nada antes del minuto 6. Nada de "comprá", "oferta" ni precio.
**DESCRIPCIÓN:** arriba de todo la guía con el enlace. Verificá cada ítem contra `oferta.ts`: `🔧 LA COLECCIÓN DEL CONSTRUCTOR LIBRE — …` + `👉 https://constructorlibre.com/?src=tfb-cola`. Debajo, `EL TRUCO QUE MENCIONÉ EN EL VIDEO →` (un truco reservado COMPLETO de 3-5 líneas, con medida exacta, útil y honesto, que NO esté en el video; en el video: "Hay una variante de esto que funciona todavía mejor cuando [caso]. Te dejé exactamente cómo hacerlo en la descripción."). Después, la descripción value-first. El mismo bloque (guía + truco) va como comentario fijado: campo `"pinned_comment"` en el meta. Links SIEMPRE con `https://`.

---

## RENDER, AUDITOR Y ENTREGA

- Render en el FARM. Commiteá TODO antes: el farm rinde el COMMIT, no el disco. Todo asset va por props y en la lista del tar. ⛔ `git add -A` prohibido: agregá por ruta.
- MP4 no crudo: rango tv, bt709, cuadros == TOTAL_FRAMES, audio del máster, pts==dts.
- **§4 AUDITOR sobre el MP4 FINAL:** la misma cara y el mismo vestuario en TODO el video, costuras, luz, palabras, QR decodificable, **compuertas del minuto 1 (0 silencios, ≥20 cortes)** y una hoja de contactos del minuto 1 + 1 frame cada 30 s antes de entregar. Si algo no se puede renderizar de verdad o la cola de agnes no da abasto, PARÁ con `DUDA:` y el número de clips hechos/faltantes. ⛔ No degrades en silencio a fotos animadas.

**AISLAMIENTO:** trabajás SÓLO en `D:/Proyectos/video2-wt/tfbcola`. PROHIBIDO `git reset --hard`, `checkout --`, `clean`, `stash`, `branch -f`, push a main, `git add -A`, tocar otros worktrees o `C:/Users/bauti/Downloads/video2` (sólo lectura), `taskkill /IM` (matá sólo por PID propio) y `gh run watch` (da 403: usá `gh run view` cada ≥5 min o `curl -sIL` al release).

🎬 **ENTREGA FINAL, directo a Bagasy (NO me pases el link para subir a mano):**
1. MP4 final en el FARM + release (asset `tfbcola.mp4` en el repo público `bagasy-search/claudeyoutubevideos`).
2. `public/tfbcola_meta.json` = {"title":"…","description":"…","pinned_comment":"…"} (título = el de la tarjeta, literal).
3. `node scripts/deliver_card.mjs "https://www.youtube.com/channel/UC-Xn4lJ35qOcf2px1BkHvEQ" "fbv51790543074490-4" tfbcola --no-youtube`: reusa el job 572 y deja la tarjeta en "Video listo · subir". ⛔ NUNCA `done:true` en la tarjeta (el tic ✓ = SUBIDO A YOUTUBE). ⛔ NO subas el video a YouTube. `deliver_card` deja `provider: claude-chat`: repatchealo a `claude-code`. Después releé el plan del row 59 y verificá que las demás tarjetas conserven su `videoJobId` y `done`.
4. **Mensaje final:** confirmación de entrega (job, mp4_url con HTTP 200) + título, descripción y comentario fijado completos + métricas (duración, clips totales/regenerados, costura máx, cortes y silencios del minuto 1) + componentes nuevos en `src/tfb/` + costos reales (gpt-image, agnes, Fish) + `APRENDIZAJES:` (máx. 10 líneas).
