// gen_federer.mjs — beatsheet/federer.json (Canal "Dr. Federer" · Video 1 ROMERO).
// Avatar médico (federer_opt.mp4 provee el audio). Anclaje por FRASE al ms exacto
// de captions_federer.json. Look CLÍNICO (THEME_MEDICO). Efectos clave del usuario:
//   · hook = AvatarScrimText (oscurece + palabra) — se cablea en Main_federer.tsx
//   · explicaciones = BlurExplainer (fondo se difumina + imagen + texto que se tipea)
// Assets provistos por el usuario ya en disco: img/romero.png · img/antiox.png ·
//   img/federer_casual.png (foto para la tarjeta de presentación).
//
// Flujo:
//   node gen_federer.mjs
//   node beatsheet.mjs beatsheet/federer.json
//   OPENAI_IMAGE_MODEL=gpt-image-2-2026-04-21 OPENAI_IMAGE_SIZE=auto node gen_images.mjs public/img/prompts_federer.json
//   OPENAI_IMAGE_MODEL=gpt-image-2-2026-04-21 node gen_images.mjs public/img/prompts_federer_diag.json
//   node gen_video.mjs public/vid/clips_federer.json     # anima las stills marcadas
import fs from "fs";

// ── PROMPT DE FOTOS = gpt-image-2 LOW, fórmula CORTA-IMPERFECTA ──
const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinación de cámara, luz desigual, piel y texturas reales, manos naturales con dedos correctos, fondo algo desordenado, pequeñas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental auténtico, saturación baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
// persona mayor (paciente) — sujeto recurrente para el hook/beneficios (NO es Federer)
const OLD = (d) => P(`una persona mayor sana de unos 80 años, ${d}, luz natural suave de interior`);
// diagrama médico CLÍNICO (paleta THEME_MEDICO: blanco/teal, esquina sup-der libre)
const DP = (d) => `Crear una infografía médica horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina científica editorial limpia y premium. Fondo blanco/gris muy claro, líneas azul-petróleo oscuro, acentos en verde-agua/teal (#109C99) y un toque de coral apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin dibujos ni texto) para colocar el avatar. Composición minimalista, mucho espacio en blanco, pocos bloques grandes, ilustración de trazo fino y suave, se entiende en 1 segundo. Textos en español, breves. Estética: ilustración médica moderna, infografía de salud premium, limpia y confiable. Evitá verse escolar/infantil/sobrecargado.`;

// helpers de beat ────────────────────────────────────────────────────────────
const r  = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const ro = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: OLD(prompt) }, ...o }); // paciente mayor
const rv = (name, prompt, o = {}) => ({ t: "raw", name, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const have = (name, o = {}) => ({ t: "raw", name, existing: true, ...o }); // asset ya en disco (img/<name>.png)
const c  = (kind, props = {}) => ({ t: kind, ...props });
let fSide = 0;
const fimg = (name, prompt, o = {}) => ({ t: "float", name, gen: { type: "image", name, prompt: P(prompt) }, side: (fSide++ % 2 ? "left" : "right"), ...o });
const half = (name, prompt, o = {}) => ({ t: "half", name, side: "right", gen: { type: "image", name, prompt: P(prompt) }, ...o });
// BlurExplainer — clip de fondo (se difumina) + imagen inset + texto que se tipea.
// clipName/imgName pueden ser gen nuevos o assets; body ≤ ~95 chars (se tipea).
let beCnt = 0;
const blur = (bg, ins, { eyebrow = "", title = "", body = "", side = beCnt++ % 2 ? "left" : "right", at } = {}) => ({
  t: "blurexplainer",
  clip: `img/${bg.name}.png`, image: `img/${ins.name}.png`,
  eyebrow, title, body, side, at,
  _gens: [bg.gen, ins.gen].filter(Boolean),
});
// gen de imagen suelto (para blur bg/inset): {name, gen}
const g  = (name, prompt) => ({ name, gen: { type: "image", name, prompt: P(prompt) } });

// diagramas (gpt-image-2 clínicos) — se juntan y se emiten aparte
const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

// ── STOCK/CLIP-FIRST: beats de acción/personas/objetos = footage REAL (broll/).
// name → query en inglés. fetch_pexels los baja a public/broll/<name>.mp4 (cascada
// Pexels→Pixabay→Archive). NO se generan por IA. Los componentes (blur inset,
// diagramas) siguen como stills/vector aparte.
const STOCK = {
  // hook — personas mayores sanas
  fe_viejo_piel: "happy elderly woman face closeup", fe_viejo_piernas: "senior person legs walking", fe_viejo_camina: "elderly man walking up stairs",
  // romero
  fe_romero_cocina: "rosemary sprig on kitchen counter", fe_romero_asado: "rosemary herb on roast food", fe_romero_mano: "hand holding rosemary sprig",
  fe_romero_manojo: "bunch of fresh rosemary", fe_romero_mal: "dried rosemary herb", fe_abuela_romero: "drying herbs hanging bunch",
  // beneficios / cuerpo
  fe_lab_micro: "scientist looking through microscope", fe_arrugas_cara: "elderly face wrinkles closeup", fe_espejo: "senior woman looking in mirror",
  fe_varices: "varicose veins on legs", fe_piernas_ligeras: "senior relaxing legs on sofa", fe_rodilla_dolor: "elderly knee pain",
  fe_manos_rigidas: "elderly hands closeup", fe_espejo_firme: "happy senior woman mirror", fe_escaleras: "elderly walking down stairs", fe_zapatos: "taking off shoes at home",
  // truco / aceite
  fe_aceite_frasco: "herbal infused oil jar sunlight", fe_frasco_oscuro: "glass jar in dark pantry", fe_colar: "straining oil through sieve",
  fe_prueba_brazo: "oil drop on skin forearm", fe_manos_frasco: "hands holding glass jar",
  // clips de acción (motion real)
  fe_manzana_time: "apple slice turning brown oxidation", fe_masaje_pierna: "leg massage with oil", fe_p1_meter: "putting herbs into glass jar",
  fe_p2_aceite: "pouring oil into a jar", fe_bano_maria: "pot warming oil on stove",
};

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.0, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, cross: 1.25, process: 1.5, journey: 2.6, infzoom: 1.3, annotated: 1.3, callout: 1.1, chips: 1.1, ingredients: 1.4, diagram: 2.4, blurexplainer: 2.8, float: 1.2, half: 1.6, depthtext: 1.2, nametag: 1.3 };

// ── SECCIONES (cada una ancla por una frase real del transcript) ─────────────
const SECTIONS = [
  // ░░ HOOK ░░ — avatar abre; Main pone AvatarScrimText "CONTRA LA FARMACIA" encima
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    ro("fe_viejo_piel", "with firm smooth skin on the face, close portrait, healthy glow", { at: "con la piel firme", kicker: "80 años, piel firme" }),
    ro("fe_viejo_piernas", "sitting, showing healthy legs with no varicose veins, light trousers rolled up", { at: "las piernas sin esas venas" }),
    ro("fe_viejo_camina", "walking easily up stairs outdoors, no knee pain, active", { at: "caminando sin quejarse", kicker: "Sin dolor de rodillas" }),
  ]},
  // ░░ ESCENA / IDENTIDAD ░░ — "casi siempre me dicen lo mismo. Romero."
  // reveal "ROMERO" = scrim palabra + ramita PNG (overlay en Main sobre avatar vivo)
  { key: "revela", phrase: "casi siempre me dicen lo mismo", beats: [
    c("talk", {}),
  ]},
  { key: "ramita", phrase: "esa ramita que quiza tienes", beats: [
    r("fe_romero_cocina", "a sprig of fresh rosemary sitting forgotten on a rustic kitchen counter next to a cutting board"),
    r("fe_romero_asado", "dried rosemary sprinkled over a sunday roast on a plate, homely kitchen"),
    r("fe_romero_mano", "an elderly hand picking up a small sprig of rosemary, soft daylight"),
  ]},
  { key: "subestimada", phrase: "esa misma planta es una", beats: [
    c("chips", { bg: "image", image: "img/federer_casual.png", imageDarken: 0.55, title: "La planta anti-edad más subestimada", chips: ["Barata", "En tu cocina", "Casi nadie la usa bien"] }),
    r("fe_romero_manojo", "a fresh bunch of rosemary tied with twine on a wooden table, close and real"),
  ]},
  // ░░ LA FORMA CORRECTA ░░
  { key: "formacorrecta", phrase: "esta el detalle la forma", beats: [
    r("fe_romero_mal", "a limp dried-out rosemary sprig discarded, the wrong careless way"),
    c("headline", { tokens: ["La", "mayoría", "lo", "usa", { t: "mal" }], eyebrow: "La forma correcta", bg: "image", image: "img/fe_romero_manojo.png" }),
  ]},
  { key: "trucoteaser", phrase: "hoy te voy a enseñar", beats: [
    c("chips", { bg: "image", image: "img/fe_romero_cocina.png", imageDarken: 0.6, title: "Hoy: el truco exacto", chips: ["Por qué funciona", "El paso a paso", "Cómo usarlo"] }),
  ]},
  // ░░ POR QUÉ ENVEJECEMOS ░░
  { key: "facultad", phrase: "dejame explicarte algo que", beats: [
    r("fe_lab_micro", "a doctor looking through a microscope in a clean modern clinic, teal accents"),
    c("headline", { tokens: ["Envejecer", "no", "es", "solo", "cumplir", { t: "años" }], eyebrow: "Lo que casi no se habla", bg: "image", image: "img/fe_lab_micro.png" }),
  ]},
  { key: "oxidacion", phrase: "en el fondo dos cosas", beats: [
    c("diagram", { eyebrow: "Las dos causas de envejecer", slides: [{ image: dg("dg_fe_infl_ox", "Diagrama simple y limpio con DOS causas del envejecimiento: a la izquierda 'INFLAMACIÓN' (una célula irritada, rojiza) y a la derecha 'OXIDACIÓN' (una célula con moléculas de radicales libres atacándola). Dos columnas claras, iconos médicos suaves."), eyebrow: "Inflamación y oxidación" }] }),
  ]},
  // ░░ BLUR-EXPLAINER #1 — la manzana / oxidación ░░
  { key: "manzana", phrase: "piensa en una manzana cortada", beats: [
    blur(
      g("fe_manzana_bg", "a cut apple slowly turning brown on a wooden kitchen board, oxidation, soft window light"),
      g("fe_celula_ox", "a stylized close macro of a human cell being oxidized, tiny sparks of damage, scientific but soft"),
      { eyebrow: "Oxidación", title: "Como una manzana cortada", body: "Tus células se oxidan cada día. Más óxido = más arrugas, venas y dolor.", at: "piensa en una manzana cortada" }
    ),
    rv("fe_manzana_time", "timelapse of an apple slice oxidizing and browning, macro, kitchen", { frames: 75 }),
  ]},
  // ░░ ANTIOXIDANTE — el romero ░░
  { key: "antioxidante", phrase: "y sabes que es el romero", beats: [
    have("antiox", { at: "y sabes qué es el romero", kicker: "Antioxidante potente", hold: true }),
    c("annotated", { image: "antiox", eyebrow: "El antioxidante", caption: "Frena el óxido interno de tus células", annotations: [{ kind: "circle", x: 50, y: 50, label: "Ácido carnósico + rosmarínico" }] }),
  ]},
  { key: "compuestos", phrase: "tiene dos compuestos con nombres", beats: [
    c("diagram", { eyebrow: "El ejército de escudos", slides: [{ image: dg("dg_fe_escudos", "Diagrama metafórico limpio: pequeños ESCUDOS teal formando una barrera que frena flechas de 'radicales libres' que intentan dañar una célula. Transmite 'protección antioxidante'. Simple, médico, elegante."), eyebrow: "Frenan la oxidación que te envejece" }] }),
    rv("fe_escudo_clip", "abstract soft animation of glowing teal shields protecting a cell from damage, medical", { frames: 75 }),
  ]},
  // ░░ LAS 3 COSAS ░░
  { key: "tresc", phrase: "ahora vamos por partes", beats: [
    c("chips", { bg: "image", image: "img/fe_romero_manojo.png", imageDarken: 0.62, title: "El romero toca 3 cosas", chips: ["Arrugas", "Várices", "Dolores"] }),
  ]},
  // ░░ 1) ARRUGAS ░░
  { key: "arrugas", phrase: "empecemos por la cara", beats: [
    c("rule", { number: "01", title: "Las arrugas", w: 3.2 }),
    ro("fe_arrugas_cara", "a close portrait showing facial wrinkles softening, before-care look, honest skin texture"),
  ]},
  { key: "arrugas_mec", phrase: "el romero aplicado sobre la piel", beats: [
    c("pizarra", { title: "Por qué borra arrugas", slides: [
      { eyebrow: "Circulación", heading: "Más sangre bajo la piel", body: "Más oxígeno y nutrientes llegan a las células cansadas.", image: "img/fe_piel_bg.png" },
      { eyebrow: "El resultado", heading: "Piel más firme y viva", body: "Como regar una planta que estaba por secarse.", image: "img/fe_gota_aceite.png" },
    ] }),
  ]},
  { key: "arrugas_const", phrase: "pero ojo esto no es una crema", beats: [
    c("stat", { value: 4, suffix: " semanas", label: "de constancia para verte distinto al espejo", eyebrow: "No es magia de un día" }),
    ro("fe_espejo", "an older person looking at themselves in a bathroom mirror, pleasantly surprised, rested look"),
    c("quote", { image: r("fe_paciente_desc", "a relaxed older patient smiling gently in a clinic, natural light").gen.name, text: "Doctor, no sé qué es, pero me veo *descansado*.", _genImg: "fe_paciente_desc", _prompt: P("a relaxed older patient smiling gently in a clinic, natural light") }),
  ]},
  // ░░ 2) VÁRICES ░░
  { key: "varices", phrase: "segundo las varices", beats: [
    c("rule", { number: "02", title: "Las várices", w: 3.2 }),
    ro("fe_varices", "close of older legs with visible varicose veins, honest medical documentary, soft light"),
  ]},
  { key: "varices_porque", phrase: "porque la sangre en las piernas", beats: [
    c("pizarra", { title: "Por qué aparecen las várices", slides: [
      { eyebrow: "El problema", heading: "La sangre se estanca", body: "Las paredes se debilitan y la sangre no logra subir.", image: "img/fe_pierna_bg.png" },
      { eyebrow: "El romero", heading: "Vuelve a mover la sangre", body: "Tonifica las paredes y reactiva la circulación estancada.", image: "img/fe_vena_flujo.png" },
    ] }),
  ]},
  { key: "varices_masaje", phrase: "por eso un masaje suave", beats: [
    rv("fe_masaje_pierna", "hands gently massaging rosemary oil onto a lower leg upward toward the knee, slow, home", { frames: 90, at: "por eso un masaje suave", kicker: "De abajo hacia el corazón" }),
    c("splitlist", { title: "El masaje correcto", items: ["Aceite de romero", "De abajo hacia arriba", "Siempre hacia el corazón"], palette: "G" }),
    ro("fe_piernas_ligeras", "older person relaxing on a sofa at night with a relieved expression, light legs feeling"),
  ]},
  // ░░ 3) DOLORES ░░
  { key: "dolores", phrase: "y tercero los dolores", beats: [
    c("rule", { number: "03", title: "Los dolores", w: 3.8 }),
    ro("fe_rodilla_dolor", "older hands holding a sore knee, morning stiffness, honest home light"),
    ro("fe_manos_rigidas", "stiff older hands in the morning, gentle documentary close-up"),
  ]},
  { key: "dolores_infl", phrase: "casi todo ese dolor tiene", beats: [
    c("pizarra", { title: "El dolor tiene un apellido", slides: [
      { eyebrow: "La causa", heading: "Casi todo es inflamación", body: "Rodillas, espalda baja, manos que amanecen rígidas.", image: "img/fe_rodilla_bg.png" },
      { eyebrow: "El romero", heading: "Antiinflamatorio natural", body: "Relaja el músculo y baja la hinchazón, sin pastillas.", image: "img/fe_articulacion_ins.png" },
    ] }),
  ]},
  { key: "resumen3", phrase: "una sola planta tocando", beats: [
    c("chips", { bg: "image", image: "img/fe_romero_manojo.png", imageDarken: 0.6, title: "Una sola planta", chips: ["La piel", "Las piernas", "El dolor"] }),
  ]},
  { key: "abuelos", phrase: "por algo nuestros abuelos la", beats: [
    r("fe_abuela_romero", "an old sepia-feel photo of an elderly woman hanging rosemary to dry in an old kitchen"),
    c("headline", { tokens: ["Ellos", "no", "leían", "estudios.", "Pero", { t: "sabían" }], eyebrow: "Los abuelos", bg: "image", image: "img/fe_abuela_romero.png" }),
  ]},
  // ░░ EL TRUCO (RECETA) ░░
  { key: "truco", phrase: "muy bien llego el momento", beats: [
    c("rule", { number: "★", title: "El truco: aceite de romero" }),
    r("fe_aceite_frasco", "a glass jar of homemade rosemary-infused oil on a sunny windowsill, amber oil, sprigs inside"),
  ]},
  { key: "ingredientes", phrase: "vas a necesitar dos cosas", beats: [
    c("ingredients", { title: "Solo dos cosas", items: [
      { name: "Romero", amount: "fresco o seco", image: "img/romero.png" },
      { name: "Aceite", amount: "oliva o almendras", image: r("fe_aceite_oliva", "a bottle of olive oil and a small bottle of almond oil on a wooden kitchen table").gen.name },
    ], _genImg: "fe_aceite_oliva", _prompt: P("a bottle of olive oil and a small bottle of almond oil on a wooden kitchen table") }),
  ]},
  { key: "paso1", phrase: "primer paso toma un puñado", beats: [
    c("process", { title: "Paso 1 · El frasco", eyebrow: "Bien seco", steps: [
      { title: "4-5 ramas de romero", desc: "un puñado generoso", image: r("fe_p1_ramas", "four or five rosemary sprigs held in a hand over a clean glass jar").gen.name, _genImg: "fe_p1_ramas", _prompt: P("four or five rosemary sprigs held in a hand over a clean glass jar") },
      { title: "Frasco de vidrio", desc: "limpio y MUY seco", image: r("fe_p1_frasco", "an empty clean dry glass jar on a kitchen counter, ready").gen.name, _genImg: "fe_p1_frasco", _prompt: P("an empty clean dry glass jar on a kitchen counter, ready") },
    ] }),
    rv("fe_p1_meter", "putting rosemary sprigs into a clean glass jar, close, kitchen", { frames: 75 }),
  ]},
  { key: "paso2", phrase: "segundo paso", beats: [
    rv("fe_p2_aceite", "pouring golden oil into a jar until the rosemary sprigs are fully submerged, macro", { frames: 90, at: "cubre el romero por completo", kicker: "Cubrir por completo" }),
  ]},
  { key: "paciencia", phrase: "ahora viene el secreto que casi", beats: [
    c("headline", { tokens: ["El", "secreto:", "la", { t: "paciencia" }], eyebrow: "Casi nadie lo respeta", bg: "image", image: "img/fe_aceite_frasco.png" }),
  ]},
  { key: "reposar", phrase: "tapa el frasco y dejalo", beats: [
    c("stat", { value: 15, suffix: " días", label: "reposando en un lugar oscuro: así se carga el aceite", eyebrow: "10 a 15 días" }),
    r("fe_frasco_oscuro", "a sealed jar of rosemary oil resting in a dark pantry cupboard, dim"),
  ]},
  { key: "atajo", phrase: "si tienes prisa hay un atajo", beats: [
    c("checklist", { title: "El atajo (mismo día)", items: [
      { text: "Aceite + romero a fuego muy bajo", state: "done" },
      { text: "Al baño maría, media hora", state: "done" },
      { text: "SIN que hierva nunca", state: "warn" },
    ] }),
    rv("fe_bano_maria", "a small pot with oil and rosemary warming gently in a water bath on a stove, low heat, no boiling", { frames: 90, at: "al baño maria", kicker: "Nunca que hierva" }),
    r("fe_colar", "straining warm rosemary oil through a sieve into a clean bottle, kitchen"),
  ]},
  { key: "comousar", phrase: "y como lo usas muy simple", beats: [
    c("process", { title: "Cómo usarlo", eyebrow: "Constancia", steps: [
      { title: "Cara", desc: "unas gotas de noche, en círculos", image: r("fe_uso_cara", "a few drops of oil massaged on face in circles at night, older person, bathroom").gen.name, _genImg: "fe_uso_cara", _prompt: P("a few drops of oil massaged on face in circles at night, older person, bathroom") },
      { title: "Piernas y dolores", desc: "masaje lento con más aceite", image: r("fe_uso_pierna", "massaging rosemary oil slowly on a leg at home").gen.name, _genImg: "fe_uso_pierna", _prompt: P("massaging rosemary oil slowly on a leg at home") },
    ] }),
  ]},
  { key: "repeticion", phrase: "no es la cantidad", beats: [
    c("headline", { tokens: ["No", "es", "la", "cantidad.", "Es", "la", { t: "repetición" }], eyebrow: "El verdadero secreto", bg: "image", image: "img/fe_aceite_frasco.png" }),
  ]},
  // ░░ ADVERTENCIA / RESPONSABLE ░░
  { key: "advertencia", phrase: "ahora escuchame bien por que", beats: [
    c("checklist", { title: "Úsalo con cabeza", items: [
      { text: "Embarazo o presión alta: consultá", state: "warn" },
      { text: "Si tomás medicación fuerte: consultá", state: "warn" },
      { text: "Probá primero un poco en el brazo", state: "done" },
    ] }),
    r("fe_prueba_brazo", "a small patch test of oil on the inner forearm, checking for allergy, home"),
  ]},
  { key: "aliado", phrase: "el romero es un aliado", beats: [
    c("quote", { image: r("fe_medico_calido", "a friendly doctor talking warmly, clinic, natural light").gen.name, text: "El romero es un *aliado*, no un milagro.", _genImg: "fe_medico_calido", _prompt: P("a friendly doctor talking warmly, clinic, natural light") }),
  ]},
  { key: "base", phrase: "esto no reemplaza dormir bien", beats: [
    c("splitlist", { title: "El romero potencia, tú pones la base", items: ["Dormir bien", "Tomar agua", "Moverte cada día"], palette: "G" }),
  ]},
  // ░░ PROYECCIÓN 80/40 ░░
  { key: "imagina", phrase: "imaginate por un momento dentro", beats: [
    ro("fe_espejo_firme", "an older person happily touching their firmer facial skin in the mirror, hopeful"),
    ro("fe_escaleras", "an older person going down stairs with ease, no knee pain, bright home"),
    ro("fe_zapatos", "an older person taking off shoes, legs feeling light, relaxed evening"),
  ]},
  { key: "ochenta", phrase: "a los 80 pareciendo de 40", beats: [
    c("stat", { value: 40, suffix: " años", prefix: "Aparentar ", label: "teniendo 80: por saber lo que casi nadie sabe", eyebrow: "El resultado" }),
  ]},
  { key: "info", phrase: "y esa es la diferencia entre", beats: [
    c("headline", { tokens: ["Envejecer", "vs.", "envejecer", { t: "bien" }], eyebrow: "La diferencia es la información", bg: "image", image: "img/fe_romero_cocina.png" }),
  ]},
  // ░░ CTA ░░
  { key: "favor", phrase: "asi que hazme un favor", beats: [
    c("chips", { bg: "image", image: "img/fe_aceite_frasco.png", imageDarken: 0.62, title: "Hoy, no mañana", chips: ["Conseguí tu romero", "Armá tu frasco", "Empezá hoy"] }),
    r("fe_manos_frasco", "older hands proudly holding a finished jar of homemade rosemary oil, warm kitchen"),
  ]},
  { key: "cta", phrase: "y si esto te sirvio", beats: [
    c("nametag", { name: "Dr. Federer", role: "Cada semana, un truco que los laboratorios prefieren callar" }),
  ]},
  { key: "coment", phrase: "cuentame en los comentarios", beats: [
    c("headline", { tokens: ["¿Ya", "lo", "usabas…", "o", "recién", "te", { t: "enteras" }, "?"], eyebrow: "Contame en los comentarios", bg: "image", image: "img/fe_romero_manojo.png" }),
  ]},
  { key: "cierre", phrase: "cuidate mucho nos vemos", beats: [
    c("talk", {}),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado) ─────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 430) + 2;

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + 5;
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
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
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
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") {
      beat.kind = "talk"; // avatar full; sin b-roll (el Main lo maneja)
    } else if (b.t === "raw") {
      beat.kind = "raw";
      const stq = STOCK[b.name];
      beat.src = b.existing ? `img/${b.name}.png` : stq ? `broll/${b.name}.mp4` : b.clip ? `vid/${b.name}.mp4` : `img/${b.name}.png`;
      if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen && !stq) beat.gen = b.gen; // stock → sin gen IA
    } else if (b.t === "float") {
      beat.kind = "float"; beat.src = `img/${b.name}.png`; beat.side = b.side; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = `img/${b.name}.png`; beat.side = b.side || "right"; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "blurexplainer") {
      beat.kind = "blurexplainer"; beat.clip = b.clip; beat.image = b.image;
      if (b.eyebrow) beat.eyebrow = b.eyebrow; if (b.title) beat.title = b.title; if (b.body) beat.body = b.body; if (b.side) beat.side = b.side;
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      delete beat._genImg; delete beat._prompt;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── recolectar gen blocks embebidos (quote/process/ingredients + blur _gens) ──
const extraImgs = [];
const scan = (o) => {
  if (!o || typeof o !== "object") return;
  if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt });
  if (Array.isArray(o._gens)) o._gens.forEach((gg) => gg && gg.type === "image" && extraImgs.push({ name: gg.name, prompt: gg.prompt }));
  for (const k of Object.keys(o)) scan(o[k]);
};
SECTIONS.forEach((s) => s.beats.forEach(scan));

// strip auxiliares + normalizar image pelada → img/<name>.png
const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; delete o._gens; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);

// ── prompts de FOTOS (gpt-image-2) desde beats con gen.type image + extraImgs ──
const photoPrompts = [];
const seen = new Set();
const pushPhoto = (name, prompt) => { if (name && prompt && !seen.has(name)) { seen.add(name); photoPrompts.push({ name, prompt }); } };
beats.forEach((b) => { if (b.gen && b.gen.type === "image") pushPhoto(b.gen.name, b.gen.prompt); });
extraImgs.forEach((e) => pushPhoto(e.name, e.prompt));
// clips LTX: los beats con gen.type clip → clips_federer.json (image = png fuente)
const clips = [];
beats.forEach((b) => { if (b.gen && b.gen.type === "clip") { pushPhoto(b.gen.image, b.gen.prompt); clips.push({ name: b.id.replace(/[^a-z0-9_]/gi, ""), image: b.gen.image, prompt: b.gen.prompt, frames: b.gen.frames || 90 }); } });

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer.json", JSON.stringify({ video: "federer", avatar: "federer_opt.mp4", theme: "medico", beats, extraImages: extraImgs }, null, 1));
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_federer.json", JSON.stringify(photoPrompts, null, 2));
fs.writeFileSync("public/img/prompts_federer_diag.json", JSON.stringify(DIAGRAMS.map((d) => ({ name: d.name, prompt: d.prompt })), null, 2));
fs.mkdirSync("public/vid", { recursive: true });
fs.writeFileSync("public/vid/clips_federer.json", JSON.stringify(clips, null, 2));
// stock (footage real) — solo las entradas realmente usadas por algún beat
const usedNames = new Set(beats.map((b) => (b.src || "").replace(/^broll\//, "").replace(/\.mp4$/, "")));
const stockMap = Object.fromEntries(Object.entries(STOCK).filter(([n]) => usedNames.has(n)));
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/stock_federer.json", JSON.stringify(stockMap, null, 2));

// ── ANCLAS DEL HOOK (para overlays scrim en Main_federer) ────────────────────
const findWord = (w, after = 0) => { const t = norm(w); for (const c of CW) if (c.s >= after && c.t === t) return c.s; return null; };
const hookFarmacia = findWord("farmacia", 0) ?? 11.5;
const hookFederer = findWord("soy", hookFarmacia + 0.3) ?? 12.4;
const hookRomero = findWord("romero", 28) ?? 32;
// ── PISO DE DURACIÓN de componentes (que se LEAN, no 1s y chau) ──────────────
// Un componente corto se extiende hasta MINC seg holdeando SOBRE el b-roll de
// abajo (que renderiza en su capa) — nunca pasa del inicio del PRÓXIMO componente.
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "process", "ingredients", "annotated", "diagram", "rule", "nametag", "blurexplainer", "pizarra"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
// beats crudos → para que Main_federer renderice los COMPONENTES con el kit premium (Fable 5)
fs.writeFileSync("src/VideoEdit/federer_beats.ts",
  `// AUTO-GENERADO por gen_federer.mjs — beats crudos para el mapeador premium.\n` +
  `export const FED_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/VideoEdit/federer_hooks.ts",
  `// AUTO-GENERADO por gen_federer.mjs — anclas (seg) de los overlays del hook + rangos talk.\n` +
  `export const HOOKS = { farmacia: ${hookFarmacia.toFixed(2)}, federer: ${hookFederer.toFixed(2)}, romero: ${hookRomero.toFixed(2)} };\n` +
  `export const TALKS: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
console.log(`hooks → farmacia ${hookFarmacia.toFixed(1)}s · federer ${hookFederer.toFixed(1)}s · romero ${hookRomero.toFixed(1)}s`);

const raw = beats.filter((b) => b.kind === "raw").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log(`beats: ${beats.length} · raw: ${raw} · stock: ${Object.keys(stockMap).length} · fotos IA: ${photoPrompts.length} · diagramas: ${DIAGRAMS.length} · clips LTX: ${clips.length} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
if (missing.length) console.log("⚠ frases NO ancladas (revisar):", JSON.stringify(missing));
