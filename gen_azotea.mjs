// gen_azotea.mjs — beatsheet/azotea.json (El Constructor Libre · impermeabilización).
// "El Líquido De $2 Que Impermeabiliza Cualquier Azotea PARA SIEMPRE". ~19 min.
// ★★ REGLA DURA (usuario): CADA beat con at:"frase" → un visual por cada cosa nombrada,
// anclado al ms EXACTO. Nada de reparto proporcional. min-gap de anclaje = 0.9s.
import fs from "fs";

const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinacion de camara, luz desigual, texturas reales, manos naturales con dedos correctos, pequenas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental autentico, saturacion baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
const AV = "un hombre rural de unos 45 anos, pelo oscuro y barba corta canosa, piel curtida, camisa de trabajo verde oliva y delantal de cuero marron";
const PAV = (d) => P(`${AV}, ${d}, en la azotea o el patio de una casa`);
const DP = (d) => `Crear una infografia horizontal, RELACION DE ASPECTO EXACTA 16:9 (1792x1024), estilo lamina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, lineas marron oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJA LIBRE la esquina superior derecha (sin texto ni dibujos). Composicion minimalista, mucho espacio, ilustracion de tinta fina con acuarela suave, se entiende en 1 segundo. Textos en espanol, breves. Estetica vintage botanical / archival textbook.`;
const CUT = (d) => `${d}. Recorte troquelado (die-cut) sobre fondo COMPLETAMENTE TRANSPARENTE. NADA detras: sin fondo, sin piso, sin sombra, sin gradiente, transparencia total (alpha). Solo el objeto centrado, borde limpio, PNG con transparencia real.`;

const HUES = ["blue", "amber", "red"];
const r = (name, at, prompt, o = {}) => ({ t: "raw", name, at, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rv = (name, at, prompt, o = {}) => ({ t: "raw", name, at, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const rav = (name, at, prompt, o = {}) => ({ t: "raw", name, at, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, at, props = {}) => ({ t: kind, at, ...props });
const sd = (at, panels) => ({ t: "scrolldoc", at, panels });

const DIAGRAMS = [], CUTOUTS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const cut = (name, prompt) => { CUTOUTS.push({ name, prompt, transparent: true, size: "1024x1024" }); return `img/${name}.png`; };
const pz = (at, items, o = {}) => ({ t: "avpizarra", at, items, ...o });

const W = { raw: 1.4, quote: 1.05, headline: 1.0, aged: 1.2, checklist: 1.3, splitlist: 1.1, bars: 1.25, annotated: 1.3, callout: 1.05, diagram: 2.4, scrolldoc: 6.0, avpizarra: 3.0 };

// ── SECCIONES — CADA beat lleva su at:"frase textual" ────────────────────────
const SECTIONS = [
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", null, {}),
    rv("az_techo", "levanta la vista", "low angle looking up at a gray flat concrete rooftop of a modest house, overcast sky", { frames: 90, hold: true }),
    r("az_losa_gris", "losa de concreto gris", "a solid gray concrete roof slab, massive and firm looking, close up of the surface"),
    rv("az_esponja", "es una esponja", "extreme macro of gray concrete drinking water into its pores like a sponge, water absorbing", { frames: 90 }),
    rv("az_agua_chupa", "se chupa el agua", "rain water seeping silently into concrete pores on a rooftop", { frames: 75 }),
    r("az_hierro_oxida", "moja el hierro", "rebar steel bars inside concrete starting to rust orange from water"),
    rv("az_oxido_raja", "raja el concreto", "rust expanding and cracking concrete from the inside, chunks breaking off", { frames: 75 }),
    r("az_mancha_amarilla", "la mancha amarilla", "an ugly yellow-brown water stain spreading on a white living room ceiling"),
    rv("az_gota_noche", "la gota", "a water drop falling from a ceiling into a bucket in a dark room at night", { frames: 75 }),
    r("az_ferreteria", "a la ferreteria", "a person walking into a hardware store looking worried, aisles of products"),
    r("az_dineral", "todo un domingo", "hands paying a lot of money at a hardware store counter, expensive"),
    r("az_balde_caro", "el balde mas caro", "an expensive branded bucket of acrylic waterproofing paint at a hardware store"),
    rv("az_pintando_rojo", "pintando la azotea", "a person painting a rooftop red with waterproofing paint on a sunday", { frames: 75 }),
    rv("az_globo", "la va a inflar como un globo", "trapped humidity ballooning a waterproofing membrane up like a bubble on a hot roof", { frames: 75 }),
    rv("az_goma_despella", "se va a empezar a despellejar", "a red waterproofing rubber membrane blistering and peeling off a sunbaked rooftop", { frames: 90 }),
    c("headline", "un verdadero escudo de cristal", { tokens: ["Un", "escudo", "de", { t: "cristal" }], eyebrow: "Menos de dos dólares", bg: "image", image: r("az_hook_super", null, "water beading and rolling off a sealed glossy rooftop like off glass").gen.name, _genImg: "az_hook_super", _prompt: P("water beading and rolling off a sealed glossy rooftop like off glass") }),
    rav("az_tomas_hook", "yo soy tomas", "kneeling on a rooftop holding a jug of homemade sealer, confident, looking at camera", { kicker: "El líquido de $2" }),
  ]},
  // ░░ MENCIÓN 1 al Manual ░░
  { key: "guia1", phrase: "una cosa antes de arrancar", beats: [
    c("callout", "el manual del constructor libre", { image: r("az_manual1", null, "a phone showing an open ebook home-repair manual on a workbench, warm light").gen.name, figure: "+40", caption: "arreglos de la casa, en un solo lugar", accent: "good", _genImg: "az_manual1", _prompt: P("a phone showing an open ebook home-repair manual on a workbench, warm light") }),
  ]},
  // ░░ POR QUÉ FALLA EL DE MARCA ░░
  { key: "falla", phrase: "por que el impermeabilizante del balde te falla", beats: [
    r("az_goma_capa", "el impermeabilizante de marca es una goma", "a rubber plastic membrane layer sitting on top of concrete, peeling at a corner"),
    r("az_no_agarra", "se apoya no se agarra", "adhesive tape peeling off a dusty wall, poor adhesion analogy"),
    r("az_sella_adentro", "sella la humedad adentro", "moisture trapped under a sealed membrane, humidity locked inside the slab"),
    rv("az_ampollas", "levanta la goma en ampollas", "trapped humidity making a waterproofing membrane bubble up in blisters on a hot roof", { frames: 75 }),
    rv("az_sol_cuartea", "el sol", "sun cracking and embrittling a dried waterproofing coating into a web of cracks", { frames: 75 }),
    c("quote", "esta diseñado para durar poco", { image: r("az_industria", null, "a faceless paint company selling buckets that fail on purpose, planned obsolescence").gen.name, text: "Está *diseñado para durar poco*.", accent: "danger", _genImg: "az_industria", _prompt: P("a faceless waterproofing company, buckets that fail so you rebuy") }),
  ]},
  // ░░ CÁNCER DEL CONCRETO (pizarra) ░░
  { key: "cancer", phrase: "el cancer del concreto", beats: [
    pz("el cancer del concreto", [{ png: cut("az_cut_varilla", CUT("una varilla de hierro de construccion oxidada, corroida y naranja")), title: "El óxido se expande 7×", body: "y revienta la losa desde adentro" }], { side: "right", eyebrow: "El cáncer del concreto" }),
    r("az_cascotes", "esos cascotes", "concrete chunks fallen from a ceiling exposing rusted rebar inside"),
  ]},
  // ░░ PREP: EL ERROR ░░
  { key: "prep", phrase: "el error garrafal", beats: [
    r("az_superficie", "es por la superficie", "a close look at a rooftop surface, the real problem is the surface not the rain"),
    r("az_no_es_cemento", "no es el cemento", "the gray even layer on a roof that is actually a crust of grime, not the real concrete"),
    r("az_costra", "una costra de tierra", "a rooftop covered in a baked crust of dirt, grease, smog and black mold"),
    rv("az_deslava", "se va a deslavar", "sealer washing off a dirty rooftop in the first rain, failing on grime", { frames: 60 }),
    rv("az_espatula", "la espatula de acero", "a rigid steel spatula scraping old peeling paint and blisters off a concrete roof", { frames: 75, at: "raspa con ganas" }),
    rv("az_escoba", "cerdas duras", "scrubbing a concrete roof hard with a stiff brush, water and degreaser soap", { frames: 75 }),
    r("az_hidro", "una hidrolavadora", "a pressure washer blasting a concrete rooftop clean, close range"),
    rv("az_barro_negro", "un barro negro", "disgusting black mud sludge running out of concrete pores while washing", { frames: 75 }),
    rv("az_secar_sol", "dos dias enteros", "an empty clean concrete rooftop drying under strong sun, hot and dry", { frames: 75 }),
    r("az_poros_abren", "pidan agua", "macro of dry concrete pores opening up, thirsty, ready to drink the sealer"),
    r("az_tercer_dia", "tercer dia la losa", "a clean bone-dry whitish concrete rooftop on day three, rough and ready"),
  ]},
  // ░░ LA RECETA — cada ingrediente su beat anclado ░░
  { key: "receta", phrase: "ahora si la quimica", beats: [
    r("az_sombra", "un rincon con sombra", "mixing waterproofing in the shade of a patio, out of the sun, a clean 20L plastic bucket"),
    r("az_balde20", "un balde de plastico grande", "a clean empty 20 liter plastic bucket ready for mixing"),
    rv("az_agua", "cuatro botellas de un litro de agua", "pouring four one-liter bottles of clean water into a plastic bucket", { frames: 75 }),
    r("az_cemento_blanco", "el cemento blanco", "a bag of pure white architectural cement, NOT gray, next to the bucket"),
    r("az_no_gris", "no gris", "a gray cement bag with a red X over it, do not use gray cement"),
    rv("az_echar_tazas", "diez tazas", "pouring cups of fine white cement powder slowly into water like fine rain", { frames: 75 }),
    rv("az_revolver", "una leche muy espesa", "stirring cement and water into a smooth thick slurry with a thick wooden stick", { frames: 90 }),
    rv("az_rajaduras", "un mapa de rajaduras", "a network of white hairline cracks in a dried cement-only coating, a failed slurry", { frames: 60 }),
    r("az_piedra_dura", "se hace piedra dura", "hard brittle cement that cracks when the slab expands with heat"),
    r("az_resina", "la resina acrilica transparente", "a container of clear transparent acrylic wall resin, water based, from a paint store"),
    rv("az_resina_chicloso", "denso pesado chicloso", "the mix turning dense and gluey as clear acrylic resin is stirred in, thick and sticky", { frames: 75 }),
    r("az_detergente", "dos cucharadas", "two tablespoons of dish soap being added from a bottle into the bucket"),
    rv("az_tension", "la tension superficial", "macro of surface tension breaking, liquid spreading flat and slipping into tiny pores", { frames: 60 }),
    rv("az_penetra", "los agujeritos mas chiquitos", "the mix soaking down centimeters into concrete pores thanks to the surfactant", { frames: 60 }),
    rv("az_brillo_satinado", "un brillo satinado", "the finished mix with a satin sheen, ready to apply, glossy grey-white", { frames: 60 }),
  ]},
  // ░░ MENCIÓN 2 al Manual ░░
  { key: "guia2", phrase: "las cantidades exactas por metro cuadrado", beats: [
    c("callout", "esta en el manual", { image: r("az_manual2", null, "a printed measurements table pinned to a workshop wall, exact quantities per square meter").gen.name, figure: "×m²", caption: "cantidades exactas, para no desperdiciar", accent: "good", _genImg: "az_manual2", _prompt: P("a printed measurements table pinned to a workshop wall") }),
  ]},
  // ░░ APLICACIÓN — cada paso anclado ░░
  { key: "aplica", phrase: "ahora la aplicacion", beats: [
    rv("az_temprano", "se aplica temprano", "early morning 6am on a cool rooftop, fresh light, ready to work", { frames: 75 }),
    r("az_losa_fria", "la losa todavia fria", "a cool shaded concrete rooftop before the sun hits it"),
    rv("az_evapora", "el agua se evapora de golpe", "sealer boiling and turning to useless white powder on a hot sun-baked slab", { frames: 60, at: "el sol ya calento" }),
    r("az_charco", "un charco generoso", "pouring a generous puddle of the grey sealer directly onto a rough concrete roof"),
    r("az_jalador", "un jalador de goma dura", "a heavy hard rubber floor squeegee resting on a wet rooftop"),
    rv("az_empuja", "empuja con toda tu fuerza", "pushing the squeegee hard to inject the sealer into the concrete pores under pressure", { frames: 90, at: "inyectar la mezcla a presion" }),
    rv("az_rodillo", "un rodillo de felpa", "a thick fluffy paint roller smoothing the sealer coat evenly on the roof", { frames: 75 }),
    rv("az_gris_blanco", "de ese gris feo a un blanco puro", "concrete transforming from ugly gray to pure bright white as it drinks the sealer", { frames: 90 }),
    r("az_cuatro_horas", "primera mano cuatro horas", "the first coat of white sealer drying on a rooftop, a clock, deep anchor"),
    rv("az_segunda_cruzada", "cruzando el sentido", "rolling a second coat crossing the direction of the first, glossy white armor", { frames: 75 }),
    r("az_coraza", "una coraza plastica brillante", "a glossy 2mm plastic waterproof shell coating a white rooftop like glass"),
  ]},
  // ░░ LA PRUEBA ░░
  { key: "prueba", phrase: "la prueba de fuego", beats: [
    rv("az_tormenta", "una tormenta electrica", "a heavy electric thunderstorm pounding a house rooftop at night, lightning", { frames: 90 }),
    r("az_trapos_baldes", "con trapos", "someone rushing with rags and buckets to catch leaks in a living room during a storm"),
    r("az_sillon", "me quede en el sillon", "a man relaxed on a couch listening calmly to the rain, no leaks, at peace"),
    rv("az_gotitas_teflon", "gotitas perfectas redonditas", "perfect round water droplets beading on a sealed rooftop like on teflon or car wax", { frames: 90, hold: true }),
    rv("az_rebota_rejilla", "se iba patinando", "water sheeting and rolling off a sealed roof toward the drains, not soaking in", { frames: 75 }),
    c("quote", "esa es la formula", { image: r("az_losa_sellada", null, "a beautiful sealed white glossy rooftop repelling water at golden hour").gen.name, text: "Fácil, barata, y *para siempre*.", _genImg: "az_losa_sellada", _prompt: P("a sealed white glossy rooftop repelling water") }),
  ]},
  // ░░ OTROS USOS + PLATA ░░
  { key: "usos", phrase: "no sirve solo para la azotea", beats: [
    r("az_pared_ladrillo", "una pared de ladrillo", "an exterior brick wall being sealed against rain with the same mix"),
    r("az_cisterna", "un tanque de agua o una cisterna", "a concrete water cistern being waterproofed inside with the cement sealer"),
    r("az_base_columna", "la base de una columna", "the base of a concrete column being sealed against water"),
    r("az_jardinera", "una jardinera de material", "a crumbling concrete planter box being sealed against constant watering"),
    c("bars", "hagamos la cuenta", { title: "Lo que ahorrás", unit: "US$", bars: [{ label: "Balde de marca", value: 40, tone: "danger" }, { label: "Casero", value: 2, winner: true }] }),
  ]},
  // ░░ FAQ → SCROLLDOC ░░
  { key: "faq", phrase: "las preguntas que siempre me hacen", beats: [
    rav("az_tomas_faq", "las preguntas que siempre me hacen", "answering questions relaxed on the rooftop, tools nearby", { kicker: "Las dudas de siempre" }),
    sd("primera cuanto dura", [
      { name: "az_q_dura", eyebrow: "Duración", heading: "¿Cuánto dura?", prompt: "a sealed rooftop still repelling water years later, renewal coat", clip: true },
      { name: "az_q_teja", eyebrow: "Superficie", heading: "¿Chapa o teja?", prompt: "porous concrete brick and render vs non-porous metal sheet roof", clip: true },
      { name: "az_q_metros", eyebrow: "Rendimiento", heading: "¿Cuántos m²?", prompt: "measuring a rooftop area in square meters with a tape", clip: true },
      { name: "az_q_pintar", eyebrow: "Color", heading: "¿Puedo pintarlo?", prompt: "painting an exterior color over the cured white sealer, white reflects sun", clip: true },
    ]),
  ]},
  // ░░ ERRORES → SCROLLDOC ░░
  { key: "errores", phrase: "los errores que arruinan todo", beats: [
    sd("uno saltarte la limpieza", [
      { name: "az_e_mugre", eyebrow: "Error 1", heading: "Sobre mugre", prompt: "sealer flaking off a dirty unprepared rooftop surface", clip: true },
      { name: "az_e_sol", eyebrow: "Error 2", heading: "Losa caliente", prompt: "sealer turning to useless white powder on a hot sun-baked slab", clip: true },
      { name: "az_e_gris", eyebrow: "Error 3", heading: "Cemento gris", prompt: "gray cement bag crossed out, must use white cement", clip: true },
      { name: "az_e_fragua", eyebrow: "Error 4", heading: "Mezcla parada", prompt: "leftover mix hardened solid in the bucket, wasted", clip: true },
    ]),
  ]},
  // ░░ INDUSTRIA ░░
  { key: "industria", phrase: "por que no lo sabe todo el mundo", beats: [
    r("az_gondola", "el balde de dos mil pesos", "a hardware store shelf full of expensive branded waterproofing buckets"),
    c("headline", "es el modelo de negocio", { tokens: ["Necesitan", "que", { t: "falle" }], eyebrow: "Para que vuelvas a comprar", bg: "image", image: r("az_cinta", null, "a person trapped on a conveyor belt of repeated expenses, planned failure").gen.name, _genImg: "az_cinta", _prompt: P("endless cycle of buying failing waterproofing buckets") }),
  ]},
  // ░░ MENCIÓN 3 (CTA) ░░
  { key: "cta", phrase: "en el manual del constructor libre con las medidas al mililitro", beats: [
    c("quote", "ya lo pagaste", { image: r("az_manual3", null, "a phone showing the home-repair manual on a rooftop at golden hour").gen.name, text: "Con ahorrarte UN balde, *ya lo pagaste*.", accent: "good", _genImg: "az_manual3", _prompt: P("a phone showing an ebook home-repair manual, golden hour") }),
  ]},
  // ░░ CIERRE + PUENTE ░░
  { key: "cierre", phrase: "sellar el techo es apenas la primera batalla", beats: [
    r("az_salitre", "ese salitre blanco feo", "white saltpeter efflorescence and blistering paint at the bottom of an interior wall, rising damp"),
    rav("az_tomas_cierre", "en el proximo video", "on the rooftop at golden hour closing the video, warm, pointing down at the walls", { kicker: "La humedad que sube por los muros" }),
    c("headline", "que el agua rebote", { tokens: ["Que", "el", "agua", { t: "rebote" }], eyebrow: "Dormí tranquilo aunque truene", bg: "image", image: r("az_cierre_gota", null, "a single water droplet rolling off a sealed rooftop at golden hour, macro").gen.name, _genImg: "az_cierre_gota", _prompt: P("a water droplet rolling off a sealed rooftop at golden hour") }),
  ]},
];

// ── ANCLAJE POR FRASE (min-gap 0.9s → sync fino) ─────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_azotea.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000, raw: x.text }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 7);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const capsText = (t, win = 3.0, maxWords = 16) => { const w = []; for (const x of CW) { if (x.s < t - 0.15) continue; if (x.s > t + win) break; w.push(x.raw); if (w.length >= maxWords) break; } return w.join(" ").replace(/\s+/g, " ").trim(); };
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1134) + 1.5;

let cursorSec = 0;
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  sec.start = ms != null ? ms : cursorSec + 5;
  if (ms == null) console.warn(`⚠ sin ancla SECCION: "${sec.phrase}" (${sec.key}) → ${sec.start}`);
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const MISS = [];
const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.3);
    if (ms == null && b.at) MISS.push(`${sec.key}[${i}] "${b.at}"`);
    return ms != null && ms > start + 0.5 && ms < end - 1.0 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 0.9) pin[i] = null; else lastPin = pin[i]; } }
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
    const dur = +((i + 1 < n ? startT[i + 1] : end) - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const hue = HUES[(si + i) % HUES.length];
    const beat = { id, start: cursor, dur };
    if (b.t === "raw") {
      beat.kind = "raw"; beat.src = fs.existsSync(`public/vid/${b.name}.mp4`) ? `vid/${b.name}.mp4` : `img/${b.name}.png`; beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; if (b.gen) beat.gen = b.gen;
    } else if (b.t === "scrolldoc") {
      beat.kind = "scrolldoc"; const np = b.panels.length, per = dur / np;
      beat.panels = b.panels.map((p, k) => { const pt = +(cursor + k * per).toFixed(2); const clipOk = fs.existsSync(`public/vid/${p.name}.mp4`); const pan = { eyebrow: p.eyebrow, heading: p.heading, body: capsText(pt, Math.min(per, 3.4)) }; if (clipOk) pan.media = `vid/${p.name}.mp4`; else pan.poster = `img/${p.name}.png`; return pan; });
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; delete beat._genImg; delete beat._prompt;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (!beat.hue) beat.hue = hue;
    }
    beats.push(beat);
  });
}

const extraImgs = [];
const scan = (o) => { if (!o || typeof o !== "object") return; if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt }); for (const k of Object.keys(o)) scan(o[k]); };
SECTIONS.forEach((s) => s.beats.forEach(scan));
const panelImgs = [];
SECTIONS.forEach((s) => s.beats.forEach((b) => { if (b.t === "scrolldoc") b.panels.forEach((p) => panelImgs.push({ name: p.name, prompt: P(p.prompt) })); }));

const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; delete o.at; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);
const BG = new Set(["headline", "aged", "quote", "callout"]);
for (const b of beats) { if (BG.has(b.kind) && typeof b.image === "string") { const m = b.image.match(/^img\/(.+)\.png$/); if (m && fs.existsSync(`public/vid/${m[1]}.mp4`)) b.image = `vid/${m[1]}.mp4`; } }

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/azotea.json", JSON.stringify({ video: "azotea", avatar: "azotea_opt.mp4", tutorial: true, beats, extraImages: extraImgs.concat(panelImgs) }, null, 1));
fs.writeFileSync("public/img/prompts_azotea_diag.json", JSON.stringify(DIAGRAMS, null, 2));
fs.writeFileSync("public/img/prompts_azotea_cutouts.json", JSON.stringify(CUTOUTS, null, 2));

const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${beats.filter((b) => b.kind === "raw").length} · scrolldoc: ${beats.filter((b) => b.kind === "scrolldoc").length} · avpizarra: ${beats.filter((b) => b.kind === "avpizarra").length} · diag: ${DIAGRAMS.length} · cutouts: ${CUTOUTS.length} · dur: ${(dur / 60).toFixed(1)}min`);
if (MISS.length) console.log(`⚠ anclas no encontradas (${MISS.length}): ${MISS.join(" · ")}`);
else console.log("✓ TODAS las anclas at: encontradas");
