// gen_maderarest.mjs — beatsheet/maderarest.json (El Constructor Libre · subnicho MADERA).
// Video: "Oculta Desde 1932: La Mezcla De $1 Que Deja La Madera Vieja COMO NUEVA".
// Narrador "Tomás". Clon de gen_estufarocket.mjs (mismo canal/marca/avatar).
// Anclaje por frase a captions_maderarest.json (sync fino). Diagramas gpt-image-2 = dg_mr_*.
//
// Flujo:
//   node gen_maderarest.mjs
//   node beatsheet.mjs beatsheet/maderarest.json
//   node flowgen.mjs public/img/prompts_maderarest.json          # fotos Nano Banana (o gen_images.mjs)
//   node gen_video.mjs public/vid/clips_maderarest.json          # clips LTX (anima stills)
//   OPENAI_IMAGE_MODEL=gpt-image-2-2026-04-21 node gen_images.mjs public/img/prompts_maderarest_diag.json
import fs from "fs";

// ── PROMPT DE FOTOS = fórmula CORTA-IMPERFECTA (estándar) ──
const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinación de cámara, luz desigual, texturas reales, manos naturales con dedos correctos, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico, saturación baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
// Tomás como sujeto (look fijo y consistente con el canal). Encuadre abierto/medio.
const AV = "un hombre rural de unos 45 años, pelo oscuro y barba corta canosa, piel curtida, camisa de trabajo verde oliva y delantal de cuero marrón";
const PAV = (d) => P(`${AV}, ${d}, en un taller rural con madera`);
// diagrama gpt-image-2 (paleta de marca, esquina sup-der libre para el avatar)
const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto ni dibujos) para colocar después el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, ilustración de tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves. Estética: vintage botanical / archival textbook illustration, premium editorial, papel levemente envejecido. Evitá verse escolar/infantil/sobrecargado.`;

const HUES = ["amber", "red", "blue"];
// helpers de beat
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rv = (name, prompt, o = {}) => ({ t: "raw", name, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const fimg = (name, prompt, o = {}) => ({ t: "float", name, gen: { type: "image", name, prompt: P(prompt) }, side: (fSide++ % 2 ? "left" : "right"), ...o });
const half = (name, prompt, o = {}) => ({ t: "half", name, side: "right", gen: { type: "image", name, prompt: P(prompt) }, ...o });
const real = (name, o = {}) => ({ t: "raw", name, broll: true, ...o });

const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.0, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, cross: 1.25, process: 1.5, journey: 2.6, infzoom: 1.3, annotated: 1.3, callout: 1.0, chips: 1.0, impact: 1.4, diagram: 2.4, float: 1.2, depthtext: 1.2 };

// ── SECCIONES (cada una ancla por una frase verbatim del guion) ──────────────
const SECTIONS = [
  // ░░ HOOK ░░ — avatar abre ~1.3s; el macro del líquido cae en "le devuelve a la madera"
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}), // avatar full; Main pone AvatarScrimText "La madera vieja COMO NUEVA · $1"
    rv("mr_liquido_macro", "extreme macro of a brush loaded with translucent amber liquid stroking across a weathered gray wood board, the grain instantly darkening and glowing warm as it soaks in, thirsty wood drinking", { frames: 120, kicker: "Menos de un dólar", at: "le devuelve a la madera", hold: true }),
    rv("mr_veta_revive", "close macro of dry gray wood grain turning rich golden brown as oil penetrates, color returning in real time", { frames: 90 }),
    r("mr_cerca_podrida", "an old weathered gray rotting wooden fence in a rural yard, cracked sun-bleached boards"),
    rv("mr_cerca_restaurada", "the same wooden fence half restored: left side gray and dead, right side rich dark restored wood, before and after", { frames: 75, at: "una cerca podrida" }),
    r("mr_terraza_vieja", "an old worn gray wooden deck terrace, faded and dried out by the sun"),
    r("mr_mueble_basura", "an old shabby wooden chair that looks ready for the trash, dusty and gray, in a shed"),
    c("headline", { tokens: ["Sin", "lijar,", "sin", "herramientas,", "sin", { t: "experiencia" }], eyebrow: "Nada complicado", bg: "image", image: r("mr_mueble_exhibicion", "a beautifully restored glossy old wooden chair looking like a showroom piece, warm light").gen.name, _genImg: "mr_mueble_exhibicion", _prompt: P("a beautifully restored glossy old wooden chair looking like a showroom piece, warm light"), at: "sin lijar" }),
    r("mr_artesanos_30", "a very old sepia 1930s photograph feel of craftsmen working wood in an old workshop, vintage tools"),
    r("mr_ebanistas_sepia", "sepia vintage photo of an old cabinetmaker teaching his son to treat wood, 1930s workshop, warm archival tone"),
    c("quote", { image: r("mr_botella_enterrada", "a small old amber glass bottle of wood oil half buried in dirt, forgotten, dim light").gen.name, text: "La enterraron porque *funcionaba demasiado bien*.", accent: "danger", _genImg: "mr_botella_enterrada", _prompt: P("a small old amber glass bottle of wood oil half buried in dirt, forgotten, dim light"), at: "la enterraron porque" }),
  ]},
  // ░░ IDENTIDAD ░░
  { key: "ident", phrase: "yo soy tomas", beats: [
    rav("mr_tomas_retrato", "documentary portrait standing in his workshop next to old restored wooden furniture, calm confident gaze", { hold: true, kicker: "Tomás" }),
    c("headline", { tokens: ["Hoy", "la", "desenterramos", "—", "con", "las", { t: "medidas exactas" }], eyebrow: "Completa", bg: "image", image: r("mr_tres_frascos_mesa", "three glass bottles on a rustic workshop table: white vinegar, boiled linseed oil, turpentine, natural light").gen.name, _genImg: "mr_tres_frascos_mesa", _prompt: P("three glass bottles on a rustic workshop table: white vinegar, boiled linseed oil, turpentine, natural light") }),
  ]},
  // ░░ ENTENDER PRIMERO ░░
  { key: "entender", phrase: "antes de la formula", beats: [
    rav("mr_tomas_serio", "leaning toward camera with a serious knowing look in his workshop, about to explain something important", { kicker: "Entendé esto primero" }),
    r("mr_madera_fallo", "a piece of wood that was oiled wrong: sticky, gummy, uneven blotchy surface, a failed job"),
  ]},
  // ░░ POR QUÉ SE PONE GRIS ░░
  { key: "gris", phrase: "la madera no se pone", beats: [
    c("diagram", { eyebrow: "Por qué la madera se pone gris", slides: [{ image: dg("dg_mr_gris", "Diagrama en corte de una tabla de madera al sol: los rayos del sol rompen la 'lignina' (el pegamento natural) de la capa superficial y la lluvia se lleva los restos, dejando una capa gris de fibra seca y muerta arriba, y madera sana debajo. Flechas del sol pegando y de la lluvia lavando. Etiquetas: 'sol', 'lluvia', 'fibra muerta gris', 'madera sana'."), eyebrow: "El sol rompe la fibra, la lluvia se la lleva" }] }),
    rv("mr_sol_tabla", "harsh sunlight beating down on a gray wooden board, heat shimmer, sun-bleached surface", { frames: 75 }),
    rv("mr_lluvia_madera", "rain drops hitting weathered wood and running off, washing the surface, overcast", { frames: 75, at: "la lluvia se lleva" }),
    c("annotated", { image: "mr_fibra_gris", eyebrow: "Madera muerta por fuera", caption: "Fibra seca, sin una gota de aceite", annotations: [{ kind: "arrow", x: 40, y: 35, label: "Fibra levantada" }, { kind: "circle", x: 62, y: 62, label: "Sin aceite" }], _genImg: "mr_fibra_gris", _prompt: P("extreme macro of dry gray weathered wood grain, raised dead fibers, no shine, cracked surface") }),
    r("mr_banco_gris", "a gray weathered wooden garden bench and an old gray door, sun-faded, in a rural yard"),
    c("chips", { bg: "image", image: "img/mr_fibra_gris.png", imageDarken: 0.6, title: "Madera sedienta", chips: ["Seca", "Apagada", "Sin una gota de aceite"], hue: "amber", at: "madera sedienta" }),
  ]},
  // ░░ POR QUÉ LIJAR Y BARNIZAR ESTÁ MAL ░░
  { key: "lijar", phrase: "lijar y barnizar es", beats: [
    c("cross", { title: "Barnizar = tapar el problema", eyebrow: "Qué pasa por dentro", layers: [
      { label: "Barniz (capa de plástico)", color: "#A9794A", weight: 1 },
      { label: "Madera muerta (sigue gris)", color: "#6F8478", weight: 3 },
      { label: "Madera sana", color: "#6E8B47", weight: 2 } ] }),
    rv("mr_barniz_descascara", "old varnish peeling and flaking off a wooden surface in curls, a failed finish", { frames: 90, at: "se descascara" }),
    r("mr_veta_tapada", "beautiful wood grain covered and hidden under a thick shiny plastic varnish coat, a shame"),
    c("quote", { image: r("mr_aceite_absorbe", "close-up of a brush spreading oil on porous wood, the wood drinking it in, grain darkening").gen.name, text: "Los viejos hacían al revés: *alimentaban* la madera.", _genImg: "mr_aceite_absorbe", _prompt: P("close-up of a brush spreading oil on porous wood, the wood drinking it in, grain darkening"), at: "era al reves" }),
  ]},
  // ░░ SON TRES COSAS ░░
  { key: "tres", phrase: "son tres cosas", beats: [
    c("splitlist", { title: "Cada una hace algo distinto", items: ["Vinagre — despierta la fibra", "Linaza — nutre por dentro", "Trementina — empuja el aceite"], palette: "A" }),
    r("mr_tres_frascos_close", "close-up of three labeled bottles side by side on a wood table: white vinegar, boiled linseed oil, turpentine"),
    c("chips", { bg: "image", image: "img/mr_tres_frascos_mesa.png", imageDarken: 0.6, title: "Cada una hace algo distinto", chips: ["Vinagre despierta", "Linaza nutre", "Trementina penetra"], hue: "amber" }),
  ]},
  // ░░ INGREDIENTE 1 — VINAGRE ░░
  { key: "vinagre", phrase: "la primera vinagre", beats: [
    half("mr_vinagre_frasco", "a bottle of clear white vinegar next to a cloth on a rustic wood table, natural light", { kicker: "1 · Vinagre blanco" }),
    c("diagram", { eyebrow: "Qué hace el vinagre", slides: [{ image: dg("dg_mr_vinagre", "Diagrama simple: un trapo con vinagre pasa sobre madera gris; el vinagre disuelve la capa oxidada gris y ABRE los poros de la fibra para que después el aceite pueda entrar. Antes: fibra cerrada y gris. Después: fibra abierta y limpia, lista. Flecha de 'vinagre' y poros abriéndose."), eyebrow: "Abre la fibra para que entre el aceite" }] }),
    rv("mr_vinagre_trapo", "a cloth soaked in vinegar wiping over gray weathered wood, the gray loosening and lifting", { frames: 90, at: "neutraliza el gris" }),
    c("callout", { image: r("mr_puerta_cerrada", "a close macro comparing two wood surfaces, one sealed and closed, one open and porous").gen.name, figure: "Paso 0", caption: "Sin esto, el aceite queda arriba y se pega.", _genImg: "mr_puerta_cerrada", _prompt: P("a close macro comparing two wood surfaces, one sealed and closed, one open and porous") }),
  ]},
  // ░░ INGREDIENTE 2 — LINAZA HERVIDA ░░
  { key: "linaza", phrase: "la segunda aceite de", beats: [
    half("mr_linaza_frasco", "a bottle of boiled linseed oil, amber colored, on a workshop shelf, warm light", { kicker: "2 · Aceite de linaza HERVIDO" }),
    r("mr_linaza_cruda_vs", "two bottles of linseed oil side by side, one raw pale, one boiled darker, comparison on a table"),
    rv("mr_semillas_gel", "a pot boiling flax seeds in water turning into a useless sticky gel on a stove", { frames: 75, at: "hirviendo la semilla" }),
    rv("mr_linaza_verter", "pouring amber boiled linseed oil from a can into a glass jar, close-up, warm light", { frames: 75 }),
    r("mr_ferreteria_estante", "a hardware store shelf with cans of linseed oil, a hand reaching for one"),
    c("headline", { tokens: ["Hervido", "es", "solo", "el", { t: "nombre" }], eyebrow: "No lo hervís vos", bg: "image", image: r("mr_etiqueta_boiled", "close-up of a can of boiled linseed oil on a shelf, hardware store, warm light, no legible text").gen.name, _genImg: "mr_etiqueta_boiled", _prompt: P("close-up of a can of boiled linseed oil on a shelf, hardware store, warm light, no legible text") }),
  ]},
  // ░░ INGREDIENTE 3 — TREMENTINA ░░
  { key: "trementina", phrase: "la tercera trementina", beats: [
    half("mr_trementina_frasco", "a bottle of turpentine on a workshop table, yellowish tint, rag beside it", { kicker: "3 · Trementina (aguarrás)" }),
    c("diagram", { eyebrow: "Qué hace la trementina", slides: [{ image: dg("dg_mr_trementina", "Diagrama simple mostrando cómo la trementina EMPUJA el aceite de linaza hacia adentro de la fibra de la madera, en lugar de dejarlo arriba haciendo una capa pegajosa. Una gota de aceite (círculo) siendo empujada por una flecha de 'trementina' hacia el interior de líneas de fibra de madera. Etiquetas: 'aceite', 'trementina empuja', 'penetra'."), eyebrow: "Empuja el aceite adentro, no lo deja arriba" }] }),
    r("mr_aguarras_mexico", "a can labeled as high quality mineral spirits on a hardware store shelf in latin america, no legible text"),
  ]},
  // ░░ PROPORCIONES ░░
  { key: "proporciones", phrase: "las proporciones exactas", beats: [
    c("headline", { tokens: ["Las", "proporciones", { t: "exactas" }], eyebrow: "Lo que casi nunca te dan", bg: "image", image: r("mr_jarro_midiendo", "hands measuring oil and turpentine into a glass jar in a workshop, careful pouring").gen.name, _genImg: "mr_jarro_midiendo", _prompt: P("hands measuring oil and turpentine into a glass jar in a workshop, careful pouring") }),
    r("mr_partes_iguales", "three small glasses side by side with equal amounts of vinegar, oil and turpentine on a wood table"),
    rv("mr_agua_aceite", "oil and water refusing to mix in a jar, separating into layers, close-up", { frames: 75, at: "se pelean" }),
    r("mr_mezcla_revolver", "a hand stirring the oil and turpentine mixture in a jar with a stick, blending"),
  ]},
  // ░░ LAS DOS RECETAS ░░
  { key: "recetas", phrase: "son dos recetas", beats: [
    c("diagram", { eyebrow: "Las dos recetas", slides: [
      { image: dg("dg_mr_receta1", "Diagrama de receta 1 (RESTAURAR madera gris): un vaso dividido en dos mitades iguales, una mitad 'aceite de linaza hervido' color ámbar y la otra mitad 'trementina' color amarillo. Proporción grande y clara '1 : 1'. Nota: 'primero el vinagre, aparte'. Limpio, editorial."), eyebrow: "Restaurar: 1 parte aceite + 1 parte trementina" },
      { image: dg("dg_mr_receta2", "Diagrama de receta 2 (MANTENER madera sana): un vaso dividido en tres partes, dos partes 'aceite de linaza' ámbar y una parte 'trementina' amarillo. Proporción grande '2 : 1'. Nota: 'más protección arriba'. Limpio, editorial."), eyebrow: "Mantener: 2 partes aceite + 1 de trementina" } ] }),
    rv("mr_vinagre_primero", "applying vinegar first with a cloth on gray wood, then letting it dry, step one", { frames: 75, at: "primero el vinagre" }),
    c("chips", { bg: "image", image: "img/mr_jarro_midiendo.png", imageDarken: 0.6, title: "Anotá esto", chips: ["Restaurar 1:1", "Mantener 2:1", "El vinagre va aparte"], hue: "blue" }),
    c("stat", { value: 90, suffix: "%", label: "de la madera de tu casa, ya lo arreglás con esto", eyebrow: "Con dos fórmulas", at: "el 90" }),
  ]},
  // ░░ INJERTO 1 — CTA manual (medidas finas) ░░
  { key: "cta1", phrase: "las medidas finas", beats: [
    half("mr_manual_tabla", "a printed table of wood treatment measurements pinned on a workshop wall, ruler beside it, no legible text", { kicker: "En el manual: la tabla al mililitro" }),
    c("diagram", { eyebrow: "Las medidas exactas, documentadas", slides: [{ image: dg("dg_mr_manual1", "Lámina de un manual/libro de reparaciones caseras abierto, con una tabla de medidas de tratamiento de madera (mililitros y cucharadas por tipo de madera), regla y lápiz al lado, estilo archivo. Transmite 'medidas exactas, imprimible, pegá en el taller'. Sin texto legible."), eyebrow: "Imprimís, pegás en el taller, listo" }] }),
  ]},
  // ░░ LAS DUDAS ░░
  { key: "dudas", phrase: "ahora las dudas", beats: [
    rav("mr_tomas_dudas", "sitting relaxed talking to camera in his workshop, about to answer common questions, friendly", { kicker: "Las dudas, una por una" }),
    c("headline", { tokens: ["Las", "preguntas", "que", "siempre", { t: "quedan" }], eyebrow: "Una por una", bg: "grid", hue: "amber" }),
  ]},
  // ░░ DUDA 1 — PEGAJOSA + REGLA DE ORO ░░
  { key: "pegajosa", phrase: "quedo pegajosa y", beats: [
    r("mr_madera_pegajosa", "a wooden surface left sticky and gummy after too much oil, shiny wet blotches, a mistake"),
    rv("mr_mucho_aceite", "pouring way too much oil onto wood, pooling on the surface, the wrong way", { frames: 75 }),
  ]},
  { key: "regla", phrase: "la madera toma lo", beats: [
    c("diagram", { eyebrow: "La regla de oro", slides: [{ image: dg("dg_mr_regla", "Diagrama de la regla más importante: la madera ABSORBE el aceite que necesita, y el sobrante que queda BRILLANDO arriba hay que RETIRARLO con un trapo seco a los 20 minutos. Antes: brillo de sobrante arriba. Después: superficie mate, sana, no pegajosa. Reloj marcando '20 min', trapo retirando el exceso."), eyebrow: "La madera toma lo que necesita; el resto lo sacás" }] }),
    rv("mr_trapo_retira", "a dry clean cloth wiping excess oil off wood 20 minutes after applying, shine turning to matte", { frames: 90, at: "retiras todo lo que" }),
    c("stat", { value: 20, suffix: " min", label: "y retirás con un trapo seco todo lo que no absorbió", eyebrow: "Regla de oro" }),
  ]},
  // ░░ DUDA 2 — MADERA PINTADA ░░
  { key: "pintada", phrase: "sirve en madera pintada", beats: [
    c("annotated", { image: "mr_cruda_vs_barniz", eyebrow: "¿En qué madera sirve?", caption: "Solo en madera cruda o gastada, no sobre barniz sano", annotations: [{ kind: "circle", x: 30, y: 55, label: "Cruda: SÍ" }, { kind: "arrow", x: 72, y: 45, label: "Barniz sano: NO" }], _genImg: "mr_cruda_vs_barniz", _prompt: P("split comparison of two wood boards, one raw bare wood and one with shiny sealed varnish") }),
    rv("mr_lijar_apenas", "lightly sanding just the corner of a painted board to reach bare wood, minimal sanding", { frames: 75, at: "lijar apenas" }),
  ]},
  // ░░ DUDA 3 — MESA / COMIDA ░░
  { key: "comida", phrase: "una mesa donde como", beats: [
    half("mr_tabla_cortar", "a wooden cutting board and a dining table surface, warm kitchen light", { kicker: "¿Mesa o tabla de cortar?" }),
    c("splitlist", { title: "Para algo que toca comida", items: ["Aceite de linaza PURO", "Sin trementina", "Curar 2-3 semanas"], palette: "G" }),
    c("stat", { value: 21, suffix: " días", label: "de curado y queda una superficie sana para comer", eyebrow: "Solo aceite" }),
  ]},
  // ░░ DUDA 4 — INTEMPERIE ░░
  { key: "afuera", phrase: "aguanta afuera la", beats: [
    rv("mr_madera_intemperie", "outdoor wooden deck and fence standing strong against rain and sun, weathered but solid", { frames: 90 }),
    c("stat", { value: 50, suffix: " años", label: "y sigue firme, con una mano de mantenimiento al año", eyebrow: "Aguanta afuera", at: "50" }),
    r("mr_mantenimiento", "a hand giving a quick maintenance coat of oil to an outdoor wooden railing, five minute job"),
  ]},
  // ░░ VARIANTE GASOIL (honesto) ░░
  { key: "gasoil", phrase: "los viejos del campo", beats: [
    r("mr_gasoil_garrafa", "an old diesel fuel jerry can in a rural shed, warning red feel, not recommended for touchable wood"),
    rv("mr_gasoil_mezcla", "mixing linseed oil with diesel in an old bucket for outdoor posts, rural method, close-up", { frames: 75 }),
    r("mr_postes_campo", "weathered wooden fence posts standing in a field exposed to sun and rain, old rural fence"),
    c("quote", { image: r("mr_banco_plaza", "an old wooden park bench outdoors exposed to weather in a plaza, worn but standing").gen.name, text: "Hay una *versión mejor* para cada cosa.", _genImg: "mr_banco_plaza", _prompt: P("an old wooden park bench outdoors exposed to weather in a plaza, worn but standing"), at: "version mejor" }),
  ]},
  // ░░ DUDA 5 — SEGURIDAD ░░
  { key: "seguridad", phrase: "es de seguridad", beats: [
    c("checklist", { title: "Seguridad — no se negocia", items: [
      { text: "Guantes puestos", state: "done" },
      { text: "Lugar ventilado, puerta abierta", state: "done" },
      { text: "Tomá descansos", state: "done" } ] }),
    rv("mr_guantes_ventilado", "gloved hands working with wood oil near an open workshop door with fresh air, safe practice", { frames: 75 }),
  ]},
  // ░░ TRAPOS — combustión (crítico) ░░
  { key: "trapos", phrase: "los trapos que usaste", beats: [
    c("headline", { tokens: ["El", "trapo", "puede", "prenderse", "fuego", { t: "solo" }], eyebrow: "Esto salva casas", bg: "image", image: r("mr_trapos_bollo", "oily rags balled up in a metal bucket, a fire hazard, dim workshop corner").gen.name, _genImg: "mr_trapos_bollo", _prompt: P("oily rags balled up in a metal bucket, a fire hazard, dim workshop corner"), at: "prenderse fuego solo", hold: true }),
    rv("mr_trapos_llama", "a balled oily rag smoldering and catching fire on its own, spontaneous combustion, warning", { frames: 75 }),
    rv("mr_trapos_extendidos", "oily rags laid out flat spread open outdoors on a wire to dry safely, sunlight", { frames: 75, at: "bien extendidos" }),
    c("callout", { image: r("mr_trapos_secos", "flattened dried stiff rags laid outside safely after use, correct disposal").gen.name, figure: "¡OJO!", caption: "Nunca los tires en bollo. Extendelos afuera.", accent: "danger", _genImg: "mr_trapos_secos", _prompt: P("flattened dried stiff rags laid outside safely after use, correct disposal") }),
  ]},
  // ░░ APLICACIÓN — paso a paso ░░
  { key: "aplicacion", phrase: "la parte linda", beats: [
    c("checklist", { title: "Cómo se aplica — 4 pasos", items: [
      { text: "Limpiar: vinagre + cepillo, secar", state: "done" },
      { text: "Aplicar la mezcla, en la veta", state: "done" },
      { text: "Retirar el sobrante a los 20 min", state: "done" },
      { text: "Secar un día por mano", state: "done" } ] }),
  ]},
  // ░░ PASO 1 ░░
  { key: "paso1", phrase: "uno limpias el", beats: [
    rv("mr_paso1_vinagre", "applying vinegar on gray wood and scrubbing with a brush, dirt and gray coming off", { frames: 90 }),
    c("headline", { tokens: ["Error", "#1:", "aceitar", "madera", { t: "húmeda" }], eyebrow: "La pudrís desde adentro", bg: "image", image: r("mr_madera_humeda", "a wet damp wooden board, water on the surface, the wrong moment to oil it").gen.name, _genImg: "mr_madera_humeda", _prompt: P("a wet damp wooden board, water on the surface, the wrong moment to oil it"), at: "madera humeda" }),
  ]},
  // ░░ PASO 2 — la transformación ░░
  { key: "paso2", phrase: "dos aplicas la", beats: [
    rv("mr_paso2_transforma", "brushing the oil mixture on gray wood and the gray vanishing, color and life returning before your eyes, beautiful", { frames: 120, at: "aplicas la mezcla", hold: true }),
    c("annotated", { image: "mr_sentido_veta", eyebrow: "Siempre en el sentido de la veta", caption: "La madera lo toma como una esponja", annotations: [{ kind: "arrow", x: 50, y: 45, label: "En la veta" }], _genImg: "mr_sentido_veta", _prompt: P("brushing oil along the direction of the wood grain, close-up, the wood absorbing it") }),
    rv("mr_esponja", "dry wood soaking up oil like a sponge, grain turning rich and alive, macro", { frames: 75 }),
  ]},
  // ░░ PASO 3 ░░
  { key: "paso3", phrase: "tres esperas veinte", beats: [
    rv("mr_paso3_retira", "waiting then wiping the excess oil off with a dry cloth, shine turning matte, step three", { frames: 90 }),
    c("callout", { image: r("mr_20min_reloj", "an old clock on a workshop wall reading twenty minutes, oiled board waiting below").gen.name, figure: "20 min", caption: "Lo que no absorbió, afuera.", _genImg: "mr_20min_reloj", _prompt: P("an old clock on a workshop wall, oiled board waiting below") }),
  ]},
  // ░░ PASO 4 ░░
  { key: "paso4", phrase: "cuatro dejas secar", beats: [
    r("mr_paso4_secar", "a richly oiled restored wooden board drying overnight, deep warm color, workshop"),
    c("stat", { value: 3, suffix: " manos", label: "para un deck o mueble que sufre, un día entre cada una", eyebrow: "Más capas, más fuerte" }),
    rv("mr_capas_profundo", "applying a second coat of oil, the wood getting deeper and richer in color, layered", { frames: 75 }),
  ]},
  // ░░ ESO ES TODO + durabilidad ░░
  { key: "todo", phrase: "y eso es todo", beats: [
    c("quote", { image: r("mr_manos_abuelo", "old weathered wise hands resting on a beautifully aged wooden surface, dignified").gen.name, text: "Esto es lo que sabía *tu abuelo*.", _genImg: "mr_manos_abuelo", _prompt: P("old weathered wise hands resting on a beautifully aged wooden surface, dignified"), at: "sabia tu abuelo" }),
    c("bars", { title: "Cuánto dura", unit: "años", bars: [
      { label: "Barniz de $30", value: 1, tone: "danger" },
      { label: "Aceite de linaza", value: 50, winner: true } ] }),
  ]},
  // ░░ POR QUÉ LO OCULTARON — 1932 ░░
  { key: "ocultaron", phrase: "por que te lo tuvieron", beats: [
    rv("mr_barniz_publicidad", "a vintage 1930s advertisement feel for synthetic varnish, sepia, old print, no legible text", { frames: 75 }),
    c("aged", { heading: "El secreto de los abuelos", lines: [{ text: "No lo prohibieron.", mark: true }, { text: "Simplemente dejaron de enseñártelo." }], image: r("mr_manual_viejo_cajon", "an old wood-treatment recipe manual being shut away in a drawer, sepia, forgotten knowledge").gen.name, _genImg: "mr_manual_viejo_cajon", _prompt: P("an old wood-treatment recipe manual being shut away in a drawer, sepia, forgotten knowledge") }),
    c("callout", { image: r("mr_1932_archivo", "a sepia 1930s hardware store scene with rows of new synthetic varnish cans, vintage archival").gen.name, figure: "1932", caption: "Cuando llegó el barniz que había que recomprar.", _genImg: "mr_1932_archivo", _prompt: P("a sepia 1930s hardware store scene with rows of new synthetic varnish cans, vintage archival") }),
  ]},
  // ░░ LOS BARNICES SINTÉTICOS ░░
  { key: "sinteticos", phrase: "los primeros barnices", beats: [
    c("quote", { image: r("mr_ferreteria_barniz", "shelves of shiny synthetic varnish cans in a modern hardware store, cold light, no legible text").gen.name, text: "Duraba demasiado. *No les servía*.", accent: "danger", _genImg: "mr_ferreteria_barniz", _prompt: P("shelves of shiny synthetic varnish cans in a modern hardware store, cold light, no legible text") }),
    r("mr_barniz_recomprar", "a peeling varnished surface that needs to be redone and rebought every year, worn"),
    r("mr_lata_sintetico", "a can of modern synthetic varnish on a shelf, industrial product, cold light"),
    rv("mr_pincel_barniz", "a brush applying glossy synthetic varnish that will peel in a year, close-up", { frames: 75 }),
  ]},
  // ░░ COMENTARIOS ░░
  { key: "coment", phrase: "dejamelo en los comentarios", beats: [
    rav("mr_tomas_camara", "talking warmly to camera in his workshop, inviting, friendly, asking a question", { kicker: "¿Qué madera vas a salvar?" }),
    c("headline", { tokens: ["Contame", "qué", "madera", { t: "salvaste" }], eyebrow: "Leo todos los comentarios", bg: "grid", hue: "amber" }),
  ]},
  // ░░ INJERTO 2 — CTA manual completo ░░
  { key: "cta2", phrase: "dejame contarte que arme", beats: [
    c("diagram", { eyebrow: "Todo, ordenado y probado", slides: [{ image: dg("dg_mr_manual2", "Lámina tipo 'valor': el Manual del Constructor Libre, con la tabla de medidas de madera y otros 39 arreglos de un dólar (termitas, óxido, moho, goteras, caños), apilados como una pila de valor, estilo archivo artesanal. Sin precios ni texto legible."), eyebrow: "La tabla de madera + otros 39 arreglos de $1" }] }),
    c("chips", { bg: "image", image: "img/mr_tres_frascos_mesa.png", imageDarken: 0.62, title: "40 arreglos de $1 a $5", chips: ["Termitas", "Óxido", "Moho", "Goteras"], hue: "amber" }),
    c("bars", { title: "El valor", unit: "US$", bars: [{ label: "Por separado", value: 158, tone: "danger" }, { label: "Hoy, lanzamiento", value: 27, winner: true }] }),
    c("quote", { image: r("mr_manual_celular", "a phone showing an open ebook home-repair manual on a wooden workbench, warm light").gen.name, text: "Con arreglar una gotera, *ya lo pagaste*.", accent: "good", _genImg: "mr_manual_celular", _prompt: P("a phone showing an open ebook home-repair manual on a wooden workbench, warm light") }),
  ]},
  // ░░ CIERRE ░░
  { key: "cierre", phrase: "la independencia no se", beats: [
    c("quote", { image: "mr_j_nueva", text: "La independencia no se compra. Se *prepara con las manos*.", _genImg: "mr_j_nueva", _prompt: P("a fully restored rich glowing wooden surface like new, warm light") }),
    c("headline", { tokens: ["Cuidá", "tu", { t: "madera" }], eyebrow: "La independencia se prepara con las manos", bg: "image", image: r("mr_madera_dorada", "a beautiful richly restored wooden surface glowing in golden hour light, a hand touching the grain").gen.name, _genImg: "mr_madera_dorada", _prompt: P("a beautiful richly restored wooden surface glowing in golden hour light, a hand touching the grain") }),
    rav("mr_tomas_firma", "looking warmly at camera at his workshop door with restored wood around him, closing the video, golden hour", { hold: true }),
  ]},
];

// ── ANCLAJE POR FRASE ────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_maderarest.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 699) + 1.5;

let cursorSec = 0;
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  sec.start = ms != null ? ms : cursorSec + 5;
  if (ms == null) console.warn(`⚠ no encontró ancla de sección: "${sec.phrase}" (key=${sec.key}) → fallback ${sec.start}`);
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.5);
    return ms != null && ms > start + 1 && ms < end - 1.5 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.5) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = b.hue || HUES[(si + i) % HUES.length];
    const beat = { id, start: cursor, dur };
    if (b.t === "raw") {
      beat.kind = "raw";
      // clip LTX si existe en disco (cualquier still animada), si no fallback al still Ken-Burns
      const clipOk = fs.existsSync(`public/vid/${b.name}.mp4`);
      beat.src = b.broll ? `broll/${b.name}.mp4` : clipOk ? `vid/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen) beat.gen = b.gen;
    } else if (b.t === "float") {
      beat.kind = "float"; beat.src = fs.existsSync(`public/vid/${b.name}.mp4`) ? `vid/${b.name}.mp4` : `img/${b.name}.png`; beat.side = b.side; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = fs.existsSync(`public/vid/${b.name}.mp4`) ? `vid/${b.name}.mp4` : `img/${b.name}.png`; beat.side = b.side || "right"; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur;
      delete beat._genImg; delete beat._prompt;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (beat.kind === "journey") delete beat.accent;
      if (beat.kind !== "journey" && !beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}

// recolectar gen blocks de imágenes embebidas en props
const extraImgs = [];
const scan = (o) => {
  if (!o || typeof o !== "object") return;
  if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt });
  for (const k of Object.keys(o)) scan(o[k]);
};
SECTIONS.forEach((s) => s.beats.forEach(scan));

const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; delete o._note; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);
// ★ animar FONDOS de componente (ImageBackdrop es video-aware): si existe el clip,
// el fondo full-bleed reproduce el mp4. Solo el `image` de nivel-beat de estos kinds
// (NO journey/process cuyos images son nodos posicionados, ni annotated con flechas).
const BG_KINDS = new Set(["chips", "headline", "aged", "quote", "callout"]);
for (const b of beats) {
  if (BG_KINDS.has(b.kind) && typeof b.image === "string") {
    const m = b.image.match(/^img\/(.+)\.png$/);
    if (m && fs.existsSync(`public/vid/${m[1]}.mp4`)) b.image = `vid/${m[1]}.mp4`;
  }
}

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/maderarest.json", JSON.stringify({ video: "maderarest", avatar: "maderarest_opt.mp4", tutorial: true, beats, extraImages: extraImgs }, null, 1));

fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_maderarest_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));

const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / beats.length).toFixed(0)}%) · diagramas: ${DIAGRAMS.length} · extraImgs: ${extraImgs.length} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
