// gen_quebracho.mjs — beatsheet/quebracho.json (El Constructor Libre · MADERA #2).
// "La Madera Que Rompe El Hacha: 100 Años Sin Pudrirse" (quebracho/especie-historia).
// Clon de gen_impermeable + ScrollDoc. Anclaje por frase a captions_quebracho.json. ~23 min.
import fs from "fs";

const IMPERF = "Que se vea como una foto casera real: leve desenfoque en algunas zonas, ligera inclinacion de camara, luz desigual, texturas reales, manos naturales con dedos correctos, fondo algo desordenado, pequenas imperfecciones, nada perfecto, nada pulido, sin apariencia de IA, estilo documental autentico, saturacion baja, colores suaves y ligeramente apagados. Sin texto legible.";
const P = (d) => `Foto documental muy realista, 16:9. ${d}. ${IMPERF}`;
const AV = "un hombre rural de unos 45 anos, pelo oscuro y barba corta canosa, piel curtida, camisa de trabajo verde oliva y delantal de cuero marron";
const PAV = (d) => P(`${AV}, ${d}, en un taller rural`);
const DP = (d) => `Crear una infografia horizontal, RELACION DE ASPECTO EXACTA 16:9 (1792x1024), estilo lamina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, lineas marron oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJA COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto ni dibujos) para colocar despues el avatar. Composicion minimalista, mucho espacio, pocos bloques grandes, ilustracion de tinta fina con acuarela suave, se entiende en 1 segundo. Textos en espanol, breves. Estetica: vintage botanical / archival textbook illustration, premium editorial, papel levemente envejecido.`;

const HUES = ["amber", "blue", "red"];
const r = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: P(prompt) }, ...o });
const rv = (name, prompt, o = {}) => ({ t: "raw", name, clip: true, gen: { type: "clip", image: name, prompt: P(prompt), frames: o.frames || 90 }, ...o });
const rav = (name, prompt, o = {}) => ({ t: "raw", name, gen: { type: "image", name, prompt: PAV(prompt) }, ...o });
const c = (kind, props = {}) => ({ t: kind, ...props });
const half = (name, prompt, o = {}) => ({ t: "half", name, side: "right", gen: { type: "image", name, prompt: P(prompt) }, ...o });
const sd = (panels) => ({ t: "scrolldoc", panels });

const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.0, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, cross: 1.25, annotated: 1.3, callout: 1.0, chips: 1.0, diagram: 2.4, half: 1.3, scrolldoc: 6.0, avpizarra: 3.0 };

// recortes transparentes (gpt-image-1.5) para las pizarras sobre el avatar
const CUTOUTS = [];
const cut = (name, prompt) => { CUTOUTS.push({ name, prompt, transparent: true, size: "1024x1024" }); return `img/${name}.png`; };
const CUT = (d) => `${d}. Recorte troquelado (die-cut sticker) sobre fondo COMPLETAMENTE TRANSPARENTE. NADA detras del objeto: sin fondo, sin piso, sin superficie, sin mesa, sin sombra, sin gradiente, sin pared, transparencia total (alpha). Solo el objeto centrado, recortado con borde limpio, PNG con transparencia real. Foto realista del objeto, nada mas en la imagen.`;
const pz = (items, o = {}) => ({ t: "avpizarra", items, ...o });

const SECTIONS = [
  // ░░ HOOK ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    rv("qb_hacha_rebota", "extreme slow motion of an axe striking an extremely hard dark wood log and bouncing off, sparks, the wood barely marked", { frames: 120, at: "rompe el hacha", hold: true }),
    rv("qb_poste_100", "a gray weathered wooden fence post that has stood in a field for a hundred years, still solid", { frames: 90 }),
    r("qb_durmiente", "an old wooden railway sleeper under train tracks, a century old, weathered but sound"),
    rv("qb_estufa_raja", "a wood stove glowing red hot, its iron cracking from the intense heat of burning extremely dense hardwood", { frames: 75, at: "rajar" }),
    r("qb_generaciones", "an old man, his grown son and a small grandson standing by the same old wooden post, three generations"),
    rv("qb_hunde_agua", "a dense dark piece of wood sinking straight to the bottom of a bucket of water like a stone", { frames: 75 }),
    c("headline", { tokens: ["100", "años", "enterrada.", "Sin", { t: "pudrirse" }], eyebrow: "La madera que rompe el hacha", bg: "image", image: r("qb_hook_super", "an ancient dark hardwood fence post in a field, monumental, golden light").gen.name, _genImg: "qb_hook_super", _prompt: P("an ancient dark hardwood fence post in a field, monumental, golden light"), at: "cien anos" }),
    rav("qb_tomas_hook", "holding a heavy dark piece of hardwood, showing its weight to camera, serious", { kicker: "La madera que quisieron borrar" }),
  ]},
  // ░░ ESPECIES INTRO ░░
  { key: "conoces", phrase: "vos ya la conoces", beats: [
    rav("qb_tomas_ensena", "explaining, holding a chunk of dense red hardwood, in his workshop"),
    r("qb_arbol", "a gnarled quebracho tree in the dry Chaco scrubland, tough and ancient"),
    r("qb_nandubay_alambrado", "old twisted nandubay fence posts holding a wire fence along a rural road"),
    r("qb_ruta_postes", "a long line of gray weathered fence posts along a rural roadside, older than the people who drive past"),
    r("qb_urunday_rojo", "freshly cut urunday wood showing deep blood-red color inside"),
    r("qb_hacha_rebota_cerca", "an axe head bouncing off an extremely hard log, the blade barely marking it"),
    r("qb_osage_arco", "a native american osage orange bow, honey colored hardwood, historical"),
    r("qb_caballo", "a criollo horse standing in a field, once the price of a single osage bow"),
    pz([
      { png: cut("qb_cut_colorado", CUT("un trozo macizo de madera de quebracho colorado, rojo oscuro y denso")), title: "Quebracho", body: "el rey" },
      { png: cut("qb_cut_nandubay", CUT("un trozo de poste de nandubay, madera gris retorcida y durisima")), title: "Ñandubay" },
      { png: cut("qb_cut_urunday", CUT("un trozo de madera de urunday, rojiza")), title: "Urunday" },
      { png: cut("qb_cut_algarrobo", CUT("un trozo de madera de algarrobo con veta oscura noble")), title: "Algarrobo" },
      { png: cut("qb_cut_lapacho", CUT("una rama de lapacho con flores rosadas")), title: "Lapacho" },
    ], { side: "right", eyebrow: "Las maderas eternas", at: "el nandubay" }),
    r("qb_itin_arbol", "a dense thorny itin tree in dry scrubland, extremely hard wood"),
    r("qb_lapacho", "a lapacho tree in bloom with pink flowers, its wood famously hard and lasting"),
    rv("qb_algarrobo_arbol", "an old spreading algarrobo tree in the dry countryside, noble and ancient", { frames: 75 }),
    c("headline", { tokens: ["Por", "qué", "esta", "no", "se", { t: "pudre" }], eyebrow: "La misma madera imposible, en todo el mundo", bg: "image", image: r("qb_mundo", "different hard dense woods from around the world side by side, dark and heavy").gen.name, _genImg: "qb_mundo", _prompt: P("different hard dense woods from around the world side by side, dark and heavy"), at: "por que esta no se pudre" }),
  ]},
  // ░░ CIENCIA ░░
  { key: "ciencia", phrase: "la primera la densidad", beats: [
    c("diagram", { eyebrow: "Por qué no se pudre", slides: [
      { image: dg("dg_qb_densidad", "Diagrama: madera de crecimiento LENTO con anillos finisimos y apretados, casi sin aire adentro = muy densa, se hunde en agua. Comparar con madera de pino de anillos anchos y porosa. Etiqueta: 'sin aire = sin pudricion'."), eyebrow: "Densidad: anillos finos, sin aire para el hongo" },
      { image: dg("dg_qb_taninos", "Diagrama: la madera fabrica taninos y resinas (extractivos) que son VENENO para hongos y termitas. El hongo se muere de hambre, la termita se va. Etiqueta: 'proteccion de fabrica, desde adentro'."), eyebrow: "Taninos: veneno natural contra hongo y termita" } ] }),
    rv("qb_anillos_finos", "macro of extremely fine tight growth rings in a cross section of dense hardwood", { frames: 75, at: "anillo fino" }),
    r("qb_pesa_hierro", "a small block of dark dense wood on a scale, weighing as much as iron"),
    r("qb_resinas", "amber colored natural resins and oils inside dense hardwood, the tree's own defense"),
    r("qb_tanino_hongo", "wood fungus unable to grow on a tannin-rich dark hardwood, dying"),
    rv("qb_termita_va", "a termite biting hard tannin-rich wood and turning away, unable to eat it", { frames: 60, at: "la termita" }),
    r("qb_bacteria_no", "microscopic view of bacteria unable to break down tannin-protected wood fiber"),
    pz([
      { png: cut("qb_cut_veta", CUT("un corte transversal de madera oscura mostrando anillos finos muy apretados")), title: "Anillos finos", body: "sin aire, no entra la pudrición" },
      { png: cut("qb_cut_hongo", CUT("un hongo de madera con una gran X roja tachandolo")), title: "El hongo se muere" },
      { png: cut("qb_cut_termita", CUT("una termita con una gran X roja tachandola")), title: "La termita se va" },
    ], { side: "left", eyebrow: "Veneno de fábrica", at: "el hongo que" }),
    c("quote", { image: r("qb_blindada", "dense dark hardwood, sealed and protected from within by natural oils").gen.name, text: "Ya viene con la protección puesta *de fábrica*.", _genImg: "qb_blindada", _prompt: P("dense dark hardwood, sealed and protected from within"), at: "de fabrica" }),
  ]},
  // ░░ DUREZA ░░
  { key: "dureza", phrase: "que dureza estamos hablando", beats: [
    c("bars", { title: "Dureza (escala Janka)", unit: "", bars: [
      { label: "Pino (corralón)", value: 15 },
      { label: "Roble", value: 50 },
      { label: "Quebracho colorado", value: 100, winner: true } ] }),
    rv("qb_sierra_chispas", "a saw blade throwing sparks and struggling against extremely hard dense wood", { frames: 75 }),
    r("qb_filo_embota", "a dulled chipped saw blade after cutting extremely hard wood"),
    r("qb_carpintero_maldice", "a carpenter frustrated and impressed working a stubborn dense hardwood"),
    r("qb_brasas_horas", "long-lasting glowing embers of hardwood still burning hot hours later in a stove"),
    pz([{ png: cut("qb_cut_hacha", CUT("un hacha de campo vieja, hoja de acero y mango de madera")), title: "Rompe el hacha", body: "más dura que el roble" }], { side: "left", eyebrow: "Dureza Janka", at: "el carpintero" }),
    rv("qb_arde_brasas", "quebracho firewood burning with intense heat and long lasting embers in a stove", { frames: 90, at: "arde tan caliente" }),
  ]},
  // ░░ ESPECIES DETALLE → SCROLLDOC ░░
  { key: "especies", phrase: "dejame contarte de las especies", beats: [
    rav("qb_tomas_especies", "showing several different dense wood samples on a table, teaching", { kicker: "Cada una tiene su carácter" }),
    sd([
      { name: "qb_e_colorado", eyebrow: "El rey", heading: "Quebracho colorado", prompt: "deep red dark quebracho colorado hardwood, one of the hardest woods in the world", clip: true },
      { name: "qb_e_blanco", eyebrow: "Durísimo igual", heading: "Quebracho blanco", prompt: "pale hard quebracho blanco wood log", clip: true },
      { name: "qb_e_nandubay", eyebrow: "El del alambrado", heading: "Ñandubay", prompt: "twisted nandubay fence post that resists river humidity for decades", clip: true },
      { name: "qb_e_urunday", eyebrow: "Rojo sangre", heading: "Urunday", prompt: "reddish urunday hardwood used for lasting construction", clip: true },
      { name: "qb_e_itin", eyebrow: "Casi imposible", heading: "Itín", prompt: "extremely dense itin wood, almost impossible to work", clip: true },
      { name: "qb_e_algarrobo", eyebrow: "Noble y hermoso", heading: "Algarrobo", prompt: "beautiful algarrobo hardwood with dark grain, prized for furniture", clip: true },
    ]),
    c("quote", { image: r("qb_pelearon", "hard trees growing slowly in harsh dry cracked soil under harsh sun").gen.name, text: "La comodidad hace madera blanda. La pelea hace madera *eterna*.", _genImg: "qb_pelearon", _prompt: P("hard trees growing in harsh dry cracked soil under harsh sun"), at: "la pelea hace madera" }),
  ]},
  // ░░ BELLEZA ░░
  { key: "belleza", phrase: "ademas de eterna", beats: [
    r("qb_mesa_algarrobo", "a solid algarrobo wood table with beautiful dark grain, heirloom quality"),
    rv("qb_veta_roja", "close macro of polished quebracho colorado showing deep red fiery grain", { frames: 75 }),
    r("qb_marca_anos", "an old well-used hardwood table whose marks and patina make it more beautiful"),
    r("qb_lustre", "hands rubbing oil into dark hardwood bringing out a deep warm glow"),
  ]},
  // ░░ HISTORIA TANINO / LA FORESTAL ░░
  { key: "historia", phrase: "una historia argentina", beats: [
    c("diagram", { eyebrow: "El tanino: de la madera al cuero", slides: [{ image: dg("dg_qb_tanino", "Diagrama: el tanino del quebracho colorado se hervia de la madera y servia para CURTIR cuero. Flecha: rollizos de quebracho → fabrica → extracto de tanino → cuero. Etiqueta: 'Argentina le dio tanino al mundo'."), eyebrow: "El veneno del árbol curtía el cuero del mundo" }] }),
    pz([{ png: cut("qb_cut_mapa", CUT("un mapa recortado de la region del Chaco en el norte de Argentina, silueta simple estilo sepia")), title: "El Chaco", body: "millones de quebrachos" }], { side: "right", eyebrow: "La Forestal", at: "millones de" }),
    r("qb_forestal_fabrica", "an old early 1900s tannin factory in the Chaco forest, sepia archival feel"),
    r("qb_hacheros", "axemen (hacheros) felling giant quebracho trees by hand in the hot Chaco forest, sepia"),
    r("qb_hervir_madera", "workers boiling quebracho wood chips in huge vats to extract dark tannin, sepia"),
    r("qb_tren_monte", "an old logging railway cutting into the quebracho forest to haul out logs, sepia vintage"),
    r("qb_extracto_tanino", "old barrels and sacks of dark quebracho tannin extract in a factory yard, sepia"),
    rv("qb_cuero_curtido", "hides being tanned into leather in vats, tannin turning skin into lasting leather, sepia", { frames: 75 }),
    r("qb_rollizos", "giant quebracho logs stacked waiting to be processed for tannin, sepia archival"),
    r("qb_almacen_empresa", "an old company store where workers spent their wages, early 1900s, sepia"),
    r("qb_casas_caidas", "collapsed abandoned wooden worker houses in the depleted Chaco, sepia, silent"),
    c("aged", { heading: "Se llevaron en décadas lo que la naturaleza tardó siglos en hacer", lines: [{ text: "Millones de quebrachos volteados por su tanino.", mark: true }, { text: "Cuando el monte se agotó, la empresa se fue." }], image: r("qb_pueblo_fantasma", "an abandoned ghost town in the Chaco, rusted rails and fallen houses, the forest gone").gen.name, _genImg: "qb_pueblo_fantasma", _prompt: P("an abandoned ghost town in the Chaco, rusted rails and fallen houses, the forest gone") }),
  ]},
  // ░░ CERCAS VIVAS / POR QUE LO BORRARON ░░
  { key: "borrar", phrase: "esta madera fue la que sostenia", beats: [
    r("qb_cerca_viva", "a living fence of dense thorny trees grown together as a green wall in old countryside"),
    r("qb_poste_campo", "endless line of hardwood fence posts across the pampas, a century old"),
    rv("qb_alambre_puas", "vintage barbed wire and steel fence posts replacing old living fences, sepia", { frames: 75, at: "alambre de puas" }),
    r("qb_cerca_muralla", "a thick living fence of thorny trees grown as an impenetrable green wall"),
    r("qb_grampas", "a hand hammering steel staples and barbed wire onto posts, the replacement industry"),
    r("qb_fabrica_alambre", "an old steel wire and fence factory, industrial, replacing the living fence"),
    r("qb_herbicida_cerca", "a living fence sprayed with herbicide to kill it, official campaign against it"),
    r("qb_poste_tratado", "cheap chemically treated pine fence posts that rot in a few years, contrast"),
    c("headline", { tokens: ["Si", "dura", "demasiado", "dejan", "de", { t: "nombrarlo" }], eyebrow: "No lo prohíben: lo hacen quedar mal", bg: "image", image: r("qb_plaga", "hardwood trees labeled a nuisance weed to be cleared, herbicide on living fences").gen.name, _genImg: "qb_plaga", _prompt: P("hardwood trees being cleared as a nuisance"), at: "dejan de nombrarlo" }),
  ]},
  // ░░ PRACTICA: RECONOCER ░░
  { key: "reconocer", phrase: "como la reconoces", beats: [
    c("checklist", { title: "Cómo reconocer la madera buena", items: [
      { text: "Pesa una barbaridad para su tamaño", state: "done" },
      { text: "Tirada al agua, se HUNDE", state: "done" },
      { text: "Cortada fresca, huele fuerte a tanino", state: "done" } ] }),
    rv("qb_test_agua", "throwing a piece of dense wood into a bucket of water where it sinks, a test", { frames: 75, at: "se hunde" }),
    r("qb_peso_mano", "a hand struggling to lift a small but very heavy dark wood block, surprised by the weight"),
    rv("qb_olor_tanino", "freshly sawn dense wood releasing sawdust, the astringent smell of tannin, macro", { frames: 60 }),
    r("qb_veta_densa", "macro of dense dark tight tannin-rich wood grain freshly cut"),
    r("qb_clavo_dobla", "a bent nail that buckled trying to go into extremely hard wood"),
    r("qb_agujero_guia", "drilling a pilot hole in extremely hard wood before nailing, workshop"),
  ]},
  // ░░ USOS HISTORICOS → SCROLLDOC ░░
  { key: "usos", phrase: "para que se usaba esta madera", beats: [
    sd([
      { name: "qb_u_durmientes", eyebrow: "Bajo los trenes", heading: "Durmientes", prompt: "wooden railway sleepers under tracks holding train weight for decades outdoors", clip: true },
      { name: "qb_u_adoquines", eyebrow: "En las calles", heading: "Adoquines de madera", prompt: "old streets paved with hardwood wooden blocks that lasted generations", clip: true },
      { name: "qb_u_pilotes", eyebrow: "Bajo el agua", heading: "Pilotes de muelle", prompt: "hardwood pilings driven underwater to hold a dock, resisting rot", clip: true },
      { name: "qb_u_ruedas", eyebrow: "El golpe diario", heading: "Ruedas y mangos", prompt: "hardwood cart wheel hubs and tool handles that take a lifetime of blows", clip: true },
    ]),
    c("quote", { image: r("qb_no_falla", "the strongest most lasting hardwood chosen for things that must never fail").gen.name, text: "Lo barato, a la larga, *siempre sale caro*.", _genImg: "qb_no_falla", _prompt: P("hardwood chosen for things that must never fail"), at: "siempre sale caro" }),
  ]},
  // ░░ FAQ → SCROLLDOC ░░
  { key: "faq", phrase: "las tres preguntas que siempre me hacen", beats: [
    rav("qb_tomas_faq", "answering questions relaxed to camera in his workshop", { kicker: "Las dudas de siempre" }),
    sd([
      { name: "qb_q_cien", eyebrow: "¿De verdad?", heading: "¿Dura 100 años?", prompt: "a documented century-old hardwood post still standing sound in a field", clip: true },
      { name: "qb_q_hoy", eyebrow: "Entonces...", heading: "¿Por qué no se usa hoy?", prompt: "scarce slow growing hardwood, expensive and hard to work, vs cheap treated pine", clip: true },
      { name: "qb_q_plantar", eyebrow: "Lo mejor", heading: "¿Puedo plantar una?", prompt: "hands planting a young hardwood sapling for future generations, hopeful", clip: true },
    ]),
  ]},
  // ░░ CAVEAT HONESTO ░░
  { key: "caveat", phrase: "te tengo que ser sincero", beats: [
    rav("qb_tomas_sincero", "speaking honestly and warmly to camera, hand on heart, sincere"),
    r("qb_monte_agotado", "a thinned depleted forest where the big hardwoods were all taken, few left"),
    r("qb_rama_caida", "a fallen hardwood branch and an old recovered post worth reusing, not cutting new"),
    rv("qb_plantar", "an old man planting a tree he will never see grown, for his grandchildren", { frames: 90, at: "planta un arbol" }),
  ]},
  // ░░ CTA ░░
  { key: "cta", phrase: "y aca esta la vuelta", beats: [
    pz([
      { png: cut("qb_cut_aceite", CUT("una aceitera de aceite de linaza con una gota cayendo")), title: "Aceite" },
      { png: cut("qb_cut_borato", CUT("una caja de borax en polvo blanco")), title: "Borato" },
      { png: cut("qb_cut_fuego", CUT("una llama de fuego naranja")), title: "Fuego" },
      { png: cut("qb_cut_cal", CUT("un balde de cal blanca")), title: "Cal" },
    ], { side: "right", eyebrow: "Blindá tu madera barata", at: "con el aceite" }),
    rv("qb_aceite_pincel", "brushing protective oil into cheap pine to make it last like hardwood", { frames: 75 }),
    r("qb_borato_tratar", "treating cheap wood with borate solution to poison it against fungus and termites"),
    rv("qb_fuego_chamuscar", "charring the surface of a wooden board with fire to protect it, japanese technique", { frames: 75 }),
    r("qb_tanino_hervido", "boiling quebracho bark to make dark tannin water to protect and age cheap wood"),
    c("bars", { title: "El valor", unit: "US$", bars: [{ label: "Por separado", value: 158, tone: "danger" }, { label: "Hoy", value: 27, winner: true }] }),
    c("quote", { image: r("qb_manual_celular", "a phone showing an open ebook wood-care manual on a workbench, warm light").gen.name, text: "Que tu madera de dos pesos dure *como una de cien años*.", accent: "good", _genImg: "qb_manual_celular", _prompt: P("a phone showing an open ebook wood-care manual on a workbench, warm light") }),
  ]},
  // ░░ COMENTARIOS ░░
  { key: "coment", phrase: "contame algo en los comentarios", beats: [
    rav("qb_tomas_camara", "talking warmly to camera inviting comments in his workshop", { kicker: "¿Cuál es la madera eterna de tu zona?" }),
    c("headline", { tokens: ["El", "mapa", "de", "las", "maderas", { t: "eternas" }], eyebrow: "Quebracho, ñandubay, lapacho, algarrobo?", bg: "grid", hue: "amber" }),
  ]},
  // ░░ CIERRE ░░
  { key: "cierre", phrase: "los arboles mas duros", beats: [
    c("quote", { image: r("qb_arbol_dorado", "an ancient hardwood tree standing alone at golden hour, weathered and eternal").gen.name, text: "La madera que dura es la que *nadie apuró*.", _genImg: "qb_arbol_dorado", _prompt: P("an ancient hardwood tree at golden hour, weathered and eternal"), at: "nadie apuro" }),
    c("headline", { tokens: ["Plantá", "un", "árbol", "que", "dure", "más", "que", { t: "vos" }], eyebrow: "Cuida la que dura", bg: "image", image: r("qb_cierre_plantar", "hands firming soil around a newly planted tree at golden hour").gen.name, _genImg: "qb_cierre_plantar", _prompt: P("hands firming soil around a newly planted tree at golden hour") }),
    rav("qb_tomas_firma", "at his workshop door closing the video, golden hour, warm", { hold: true }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico a gen_impermeable) ───────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_quebracho.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000, raw: x.text }));
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
const capsText = (t, win = 3.0, maxWords = 16) => {
  const w = [];
  for (const x of CW) { if (x.s < t - 0.15) continue; if (x.s > t + win) break; w.push(x.raw); if (w.length >= maxWords) break; }
  return w.join(" ").replace(/\s+/g, " ").trim();
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1383) + 1.5;

let cursorSec = 0;
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  sec.start = ms != null ? ms : cursorSec + 5;
  if (ms == null) console.warn(`⚠ sin ancla: "${sec.phrase}" (${sec.key}) → ${sec.start}`);
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
      beat.src = fs.existsSync(`public/vid/${b.name}.mp4`) ? `vid/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen) beat.gen = b.gen;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = fs.existsSync(`public/vid/${b.name}.mp4`) ? `vid/${b.name}.mp4` : `img/${b.name}.png`; beat.side = b.side || "right"; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "scrolldoc") {
      beat.kind = "scrolldoc";
      const np = b.panels.length; const per = dur / np;
      beat.panels = b.panels.map((p, k) => {
        const pt = +(cursor + k * per).toFixed(2);
        const clipOk = fs.existsSync(`public/vid/${p.name}.mp4`);
        const panel = { eyebrow: p.eyebrow, heading: p.heading, body: capsText(pt, Math.min(per, 3.4)) };
        if (clipOk) panel.media = `vid/${p.name}.mp4`; else panel.poster = `img/${p.name}.png`;
        return panel;
      });
    } else {
      beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur;
      delete beat._genImg; delete beat._prompt;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
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

const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);
const BG_KINDS = new Set(["chips", "headline", "aged", "quote", "callout"]);
for (const b of beats) { if (BG_KINDS.has(b.kind) && typeof b.image === "string") { const m = b.image.match(/^img\/(.+)\.png$/); if (m && fs.existsSync(`public/vid/${m[1]}.mp4`)) b.image = `vid/${m[1]}.mp4`; } }

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/quebracho.json", JSON.stringify({ video: "quebracho", avatar: "quebracho_opt.mp4", tutorial: false, beats, extraImages: extraImgs.concat(panelImgs) }, null, 1));
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_quebracho_diag.json", JSON.stringify(DIAGRAMS, null, 2));
fs.writeFileSync("public/img/prompts_quebracho_cutouts.json", JSON.stringify(CUTOUTS, null, 2));
console.log(`recortes transparentes (avpizarra): ${CUTOUTS.length}`);

const raw = beats.filter((b) => b.kind === "raw").length;
const sdc = beats.filter((b) => b.kind === "scrolldoc").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${raw} · scrolldoc: ${sdc} · diagramas: ${DIAGRAMS.length} · extra+panels: ${extraImgs.length + panelImgs.length} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
