// gen_impermeable.mjs — beatsheet/impermeable.json (El Constructor Libre · MADERA #3).
// "El Invento De $2 Que Impermeabiliza TODO En 5 Minutos" (silicona + disolvente).
// Clon de gen_maderarest + ScrollDoc para clusters explicativos (superficies/metodos/FAQ/
// errores/trucos). Anclaje por frase a captions_impermeable.json. ~29 min.
//
// Flujo: node gen_impermeable.mjs → node beatsheet.mjs beatsheet/impermeable.json
//        → generar fotos + animar TODAS → split_avatar_diagrams → preblur → farm.
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
// scrolldoc: panels = [{name, eyebrow, heading, prompt, clip?}] ; body se llena de captions en post-pass
const sd = (panels) => ({ t: "scrolldoc", panels });

const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };

const W = { raw: 1.5, quote: 1.05, headline: 1.0, rule: 1.0, stat: 1.0, aged: 1.2, checklist: 1.2, splitlist: 1.1, bars: 1.25, cross: 1.25, annotated: 1.3, callout: 1.0, chips: 1.0, diagram: 2.4, half: 1.3, scrolldoc: 6.0 };

// ── SECCIONES (ancladas a frases verbatim del transcript impermeable) ─────────
const SECTIONS = [
  // ░░ HOOK ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    rv("im_agua_perla", "extreme macro of water poured onto a pine wood board beading up into round droplets and rolling off, the wood staying dry, hydrophobic", { frames: 120, at: "sobre una tabla", hold: true }),
    rv("im_gotas_ruedan", "close macro of water droplets sliding off a treated wood surface like off marble, not soaking in", { frames: 90, at: "las gotas se juntan" }),
    r("im_pino_corralon", "cheap pine boards stacked at a hardware store, common lumber"),
    rv("im_tabla_hinchada", "a piece of pine wood swelling, going dark and rotting after soaking up water, ruined", { frames: 75, at: "se hincha" }),
    r("im_frasco_silicona", "a cartridge of silicone and a can of solvent on a rustic workshop table, cheap materials", { at: "un frasco de una cosa" }),
    rv("im_pincelada_seca", "brushing the mix on wood, drying in minutes, quick and easy", { frames: 75 }),
    r("im_gondola_cara", "a store shelf of expensive branded waterproofing sprays with price tags"),
    c("headline", { tokens: ["Impermeabiliza", "TODO", "en", "5", { t: "minutos" }], eyebrow: "Menos de dos pesos", bg: "image", image: r("im_hook_super", "many objects lined up: wood, cardboard, boots, canvas, all beading water off, waterproof").gen.name, _genImg: "im_hook_super", _prompt: P("many objects lined up: wood, cardboard, boots, canvas, all beading water off, waterproof"), at: "impermeabilizar la madera" }),
    r("im_carton_hook", "water beading off a treated cardboard box, staying dry"),
    r("im_botas_hook", "water rolling off treated leather work boots"),
    rav("im_tomas_hook", "holding a jar of homemade waterproofing mix, pouring water on a board that repels it, confident", { kicker: "El invento de $2" }),
  ]},
  // ░░ ENTENDER: el agua es el enemigo ░░
  { key: "entender", phrase: "antes de mostrarte la mezcla", beats: [
    rav("im_tomas_serio", "leaning to camera explaining something important in his workshop, serious"),
    r("im_cerca_podrida", "an old gray rotting wooden fence in a yard"),
    rv("im_deck_gris", "a gray weathered wooden deck lifting and warping, damaged by weather", { frames: 75 }),
    r("im_puerta_hinchada", "a swollen wooden shed door that won't close, jammed in its frame in winter"),
    r("im_carton_humedo", "a soggy cardboard box falling apart from damp in a storeroom"),
    rv("im_lona_picada", "an old canvas tarp pitted and rotting from moisture, torn", { frames: 75 }),
    r("im_botas_empapadas", "wet work boots soaked through, dripping"),
    rv("im_herramienta_oxida", "a metal tool rusting from humidity in a shed", { frames: 60 }),
    r("im_pared_salitre", "a house wall with rising damp and white saltpeter stains"),
    c("splitlist", { title: "Todo lo arruina el agua", items: ["Madera que se pudre", "Carton que se deshace", "Tela que se pica", "Metal que se oxida"], palette: "D" }),
    c("headline", { tokens: ["Un", "solo", "culpable:", "el", { t: "agua" }], eyebrow: "El 90% de lo que se arruina", bg: "image", image: r("im_agua_culpable", "water dripping and pooling on various household surfaces causing damage").gen.name, _genImg: "im_agua_culpable", _prompt: P("water dripping and pooling on various household surfaces causing damage"), at: "un solo culpable" }),
    c("diagram", { eyebrow: "El secreto del maestro carpintero", slides: [{ image: dg("dg_im_secar", "Diagrama: la madera mojada NO se pudre si se puede secar. Un poste al aire (sol y viento) se seca y dura decadas; la parte enterrada, que queda mojada, se pudre. Flechas de sol/viento secando arriba, humedad atrapada abajo. Etiquetas: 'se seca = sana', 'queda mojada = se pudre'."), eyebrow: "La madera se pudre cuando queda mojada, no por mojarse" }] }),
    r("im_poste_podrido_abajo", "a wooden fence post rotted only at the buried base, sound above ground"),
    c("quote", { image: r("im_maestro_manos", "old weathered carpenter hands on aged wood, wise").gen.name, text: "La madera se pudre cuando *queda mojada*.", _genImg: "im_maestro_manos", _prompt: P("old weathered carpenter hands on aged wood, wise"), at: "queda mojada" }),
  ]},
  // ░░ LA MEZCLA ░░
  { key: "mezcla", phrase: "vamos a la mezcla", beats: [
    c("splitlist", { title: "Solo dos cosas", items: ["Silicona de cartucho", "Disolvente universal"], palette: "A" }),
    half("im_silicona_cartucho", "a common silicone cartridge tube on a workshop table", { kicker: "1 · Silicona (la mas barata)" }),
    half("im_disolvente", "a can of universal solvent / mineral spirits on a shelf", { kicker: "2 · Disolvente universal" }),
    r("im_poner_silicona", "squeezing silicone from the cartridge into a glass jar"),
    rv("im_agregar_disolvente", "pouring universal solvent into the jar with the silicone", { frames: 60, at: "le agregas el disolvente" }),
    rv("im_revolver_frasco", "stirring silicone dissolving into solvent in a glass jar with a stick until it turns liquid like milk", { frames: 90, at: "revolvelo" }),
    r("im_pegote_silicona", "the silicone still a sticky blob at first before it dissolves"),
    r("im_liquido_listo", "the finished milky liquid waterproofing mix, ready to brush, right consistency"),
    c("annotated", { image: "im_poner_silicona", eyebrow: "Dos cosas, nada mas", caption: "Silicona de cartucho + disolvente universal", annotations: [{ kind: "circle", x: 40, y: 50, label: "Silicona" }, { kind: "arrow", x: 70, y: 45, label: "Disolvente" }] }),
    c("callout", { image: r("im_consistencia_leche", "a jar of milky liquid waterproofing mix, right consistency, being brushed").gen.name, figure: "1 : 3", caption: "Una parte de silicona, tres o cuatro de disolvente.", _genImg: "im_consistencia_leche", _prompt: P("a jar of milky liquid waterproofing mix, right consistency, being brushed"), at: "una parte de silicona" }),
  ]},
  // ░░ SEGURIDAD 1 (inflamable) ░░
  { key: "seguridad1", phrase: "la parte de seguridad", beats: [
    c("checklist", { title: "El disolvente es INFLAMABLE", items: [
      { text: "Lugar ventilado, puerta abierta", state: "done" },
      { text: "Lejos de toda llama o chispa", state: "done" },
      { text: "Guantes puestos", state: "done" } ] }),
    rv("im_ventilado", "gloved hands working with solvent near an open workshop door, fresh air, safe", { frames: 75 }),
  ]},
  // ░░ CIENCIA DEL PERLADO ░░
  { key: "ciencia", phrase: "porque funciona porque", beats: [
    c("diagram", { eyebrow: "Por que el agua no se moja", slides: [
      { image: dg("dg_im_capilar", "Diagrama: en madera POROSA sin tratar, el agua se mete por los huequitos (capilaridad), hincha la fibra y llega el hongo. Flechas de agua entrando en los poros. Etiqueta: 'el agua se agarra y penetra'."), eyebrow: "Sin tratar: el agua penetra y pudre" },
      { image: dg("dg_im_perla", "Diagrama: con la pelicula de silicona encima, el agua NO se puede agarrar, se junta en una bolita redonda y RESBALA (efecto hoja de loto). Gotas redondas rodando. Etiqueta: 'pelicula impermeable, el agua rueda'."), eyebrow: "Con la pelicula: el agua se hace bolita y rueda" } ] }),
    rv("im_capilaridad", "macro of water being sucked into porous wood grain like a sponge, capillarity soaking in", { frames: 75, at: "se mete adentro" }),
    c("annotated", { image: "im_capilaridad", eyebrow: "El agua entra por capilaridad", caption: "Se mete en los poros y hincha la fibra", annotations: [{ kind: "arrow", x: 45, y: 40, label: "El agua penetra" }] }),
    r("im_fibra_hincha", "close macro of wood fiber swelling and softening after absorbing water"),
    rv("im_gota_bolita", "a water droplet pulling itself into a perfect round bead on a slippery surface", { frames: 60, at: "una bolita" }),
    rv("im_hoja_loto", "macro of water beading on a lotus leaf, perfect round droplets rolling off, nature's hydrophobic surface", { frames: 90, at: "hoja de loto" }),
    r("im_repollo_rocio", "dew beading into perfect drops on a cabbage leaf, nature's water repellent"),
    c("cross", { title: "Que pasa en la superficie", eyebrow: "Capa por capa", layers: [
      { label: "Pelicula impermeable (el agua rueda)", color: "#6F8478", weight: 1 },
      { label: "Fibra de la madera (sellada)", color: "#A9794A", weight: 3 },
      { label: "Madera sana adentro", color: "#6E8B47", weight: 2 } ] }),
    r("im_veta_plastico", "a treated wood surface where water beads like on plastic or marble, looks sealed"),
    c("headline", { tokens: ["Parece", "plastico.", "Es", { t: "madera" }], eyebrow: "Abajo, tu tabla de dos pesos", bg: "image", image: r("im_parece_marmol", "water beading on wood that looks like polished marble surface").gen.name, _genImg: "im_parece_marmol", _prompt: P("water beading on wood that looks like polished marble surface") }),
  ]},
  // ░░ VELOCIDAD ░░
  { key: "velocidad", phrase: "la velocidad", beats: [
    c("bars", { title: "Cuanto tarda en secar", unit: "h", bars: [
      { label: "Barniz / pintura", value: 24, tone: "danger" },
      { label: "Este invento", value: 1, winner: true } ] }),
    rv("im_seca_rapido", "a freshly brushed waterproofed board drying in minutes, solvent flashing off", { frames: 75, at: "cinco diez minutos" }),
    c("stat", { value: 5, suffix: " min", label: "y ya esta seco al tacto y listo para el agua", eyebrow: "Velocidad" }),
    c("chips", { bg: "image", image: "img/im_seca_rapido.png", imageDarken: 0.6, title: "Vs 24 horas del barniz", chips: ["Se evapora", "Seca solo", "Listo para el agua"], hue: "blue" }),
    c("process", { title: "Como se aplica", eyebrow: "Simple", steps: [
      { title: "Preparar", desc: "silicona + disolvente", image: r("im_p_preparar", "stirring the silicone and solvent mix in a jar").gen.name, _genImg: "im_p_preparar", _prompt: P("stirring the silicone and solvent mix in a jar") },
      { title: "Pincelar", desc: "una mano finita", image: r("im_p_pincelar", "brushing a thin even coat of the mix onto wood").gen.name, _genImg: "im_p_pincelar", _prompt: P("brushing a thin even coat of the mix onto wood") },
      { title: "Secar", desc: "5-10 minutos", image: r("im_p_secar", "a freshly coated board drying quickly in the shade").gen.name, _genImg: "im_p_secar", _prompt: P("a freshly coated board drying quickly in the shade") },
      { title: "2a mano", desc: "si sufre mucho", image: r("im_p_segunda", "applying a second thin coat after the first dried").gen.name, _genImg: "im_p_segunda", _prompt: P("applying a second thin coat after the first dried") } ] }),
    r("im_mano_pareja", "brushing a thin even coat of the mix onto wood with a brush"),
  ]},
  // ░░ DEMO (medio tabla) ░░
  { key: "demo", phrase: "dejame mostrarte como se prueba", beats: [
    rv("im_media_tabla", "a board treated on only half, water poured across both halves: beads off the treated half, soaks the raw half, clear boundary line", { frames: 120, at: "solo la mitad", hold: true }),
    rv("im_echar_agua", "pouring water across both halves of a board, the moment of the test", { frames: 60, at: "echale agua" }),
    c("annotated", { image: "im_frontera", eyebrow: "La frontera que convence", caption: "Tratada resbala · cruda se empapa", annotations: [{ kind: "arrow", x: 30, y: 45, label: "Cruda: empapa" }, { kind: "arrow", x: 70, y: 45, label: "Tratada: resbala" }], _genImg: "im_frontera", _prompt: P("close-up of the boundary line on a half-treated board, one side wet one side beading"), at: "mira la frontera" }),
    r("im_mitad_cruda", "the raw untreated half of the board darkened and soaked with water"),
    rv("im_gotas_bonitas", "beautiful round water droplets sitting on the treated half of the board, catching light", { frames: 60 }),
    rv("im_dedo_seco", "a finger wiping the treated half of the board, coming away dry", { frames: 60, at: "le pasas el dedo" }),
    r("im_misma_tabla", "the same board, same water, only one half protected, the convincing comparison"),
  ]},
  // ░░ SUPERFICIES — b-roll por material (denso, anclado a cada frase) ░░
  { key: "sf_madera", phrase: "empecemos por la madera", beats: [
    rav("im_tomas_superficies", "gesturing at a table full of different materials to waterproof, enthusiastic", { kicker: "Superficie por superficie" }),
    rv("im_sf_deck", "a weathered wooden deck being brushed with the mix, water later beading off", { frames: 90 }),
    r("im_sf_aglomerado", "particle board swelling and abombing with a single drop of water, the most delicate wood"),
    rv("im_sf_aglomerado_ok", "the same particle board treated, now repelling water like nothing", { frames: 75, at: "aglomerado" }),
    c("chips", { bg: "image", image: "img/im_sf_deck.png", imageDarken: 0.6, title: "Toda madera a la intemperie", chips: ["Deck y cerca", "Postes", "Muebles de patio", "Mangos de herramientas"], hue: "amber" }),
  ]},
  { key: "sf_carton", phrase: "esta te va a volar", beats: [
    r("im_sf_carton_aislante", "stacks of cardboard as a free insulation material, cheap and abundant"),
    rv("im_sf_carton_agua", "water beading and rolling off a treated cardboard box, staying dry and firm", { frames: 90, at: "impermeabilizas el carton" }),
    rv("im_sf_carton_crudo", "raw cardboard soaking up water, going soft, swelling and falling apart, ruined", { frames: 75 }),
    r("im_sf_carton_seco", "the treated cardboard lifted up completely dry after water, amazing"),
  ]},
  { key: "sf_papel", phrase: "tercera el papel", beats: [
    rv("im_sf_papel_gotas", "water droplets sliding off a treated sheet of paper like off glass", { frames: 75 }),
    r("im_sf_papel_etiquetas", "waterproofed garden plant labels and seed packets surviving the rain"),
    rv("im_sf_papel_crudo", "raw paper getting two drops, sticking, wrinkling and tearing", { frames: 60 }),
  ]},
  { key: "sf_tela", phrase: "cuarta superficie", beats: [
    rv("im_sf_lona", "a waxed canvas tarp repelling rain, water rolling off the fabric", { frames: 90 }),
    r("im_sf_encerado", "old sailors in waxed oilskin capes and a waxed cotton work jacket, sepia history"),
    r("im_sf_toldo", "a canvas awning and truck tarp shedding rain, waterproof fabric"),
  ]},
  { key: "sf_cuero", phrase: "quinta el cuero", beats: [
    rv("im_sf_botas", "leather work boots being waterproofed, water beading off, the foot staying dry", { frames: 90 }),
    r("im_sf_cuero_cera", "beeswax and grease being rubbed into leather boots, feeding and sealing them"),
    r("im_sf_montura", "a leather saddle, belt and gloves treated against water"),
  ]},
  { key: "sf_barro", phrase: "sexta el barro", beats: [
    r("im_sf_maceta_rajada", "a terracotta pot cracked apart by frost after soaking up water"),
    rv("im_sf_maceta_repele", "a treated terracotta pot repelling water, no longer cracking in frost", { frames: 75, at: "impermeabilizas la maceta" }),
    r("im_sf_ladrillo", "an exposed brick wall and porous concrete floor repelling water after treatment"),
  ]},
  { key: "sf_metal", phrase: "la septima", beats: [
    rv("im_sf_metal_film", "a thin film coating a saw blade and hand tool to stop rust, workshop", { frames: 75 }),
    r("im_sf_herramientas", "tools stored for winter with a wax coat, rust-free next year"),
  ]},
  // ░░ METODOS → SCROLLDOC ░░
  { key: "metodos", phrase: "te prometi mas metodos", beats: [
    rav("im_tomas_metodos", "showing several jars of different homemade waterproofing methods on a table", { kicker: "Un metodo para cada uso" }),
    sd([
      { name: "im_m_silicona", eyebrow: "El estrella", heading: "Silicona + disolvente", prompt: "the silicone and solvent mix, fast cheap waterproofing being brushed on wood", clip: true },
      { name: "im_m_cera", eyebrow: "Natural", heading: "Cera disuelta", prompt: "beeswax or paraffin dissolving in warm solvent in a double boiler, natural sealer", clip: true },
      { name: "im_m_ceraaceite", eyebrow: "Para lo que tocas", heading: "Cera de abeja + aceite", prompt: "beeswax melted with linseed oil into a wood butter paste, food safe finish being rubbed on a cutting board", clip: true },
      { name: "im_m_linaza", eyebrow: "Para restaurar", heading: "Aceite de linaza + trementina", prompt: "linseed oil penetrating and reviving old gray wood, restoration", clip: true },
    ]),
    c("splitlist", { title: "El criterio", items: ["Rapido y barato: silicona", "Comida o piel: cera+aceite", "Madera vieja: linaza", "Cuero: cera o grasa"], palette: "G" }),
  ]},
  // ░░ USOS EXTRA ░░
  { key: "usos", phrase: "unos cuantos usos mas", beats: [
    r("im_u_mimbre", "a wicker basket and straw hat treated to repel rain"),
    rv("im_u_soga", "a natural fiber rope treated to resist moisture, outdoors", { frames: 75 }),
    r("im_u_bote", "a small wooden boat and oar being waterproofed with the mix"),
    r("im_u_adobe", "an adobe mud wall protected from rain, still breathing"),
    r("im_u_colmena", "a wooden beehive, chicken coop and tool handles treated against water"),
    c("chips", { bg: "image", image: "img/im_u_mimbre.png", imageDarken: 0.6, title: "Cualquier cosa porosa", chips: ["Mimbre y paja", "Soga", "Bote", "Adobe"], hue: "amber" }),
  ]},
  // ░░ FAQ → SCROLLDOC ░░
  { key: "faq", phrase: "las preguntas que siempre me hacen", beats: [
    rav("im_tomas_faq", "sitting relaxed answering questions to camera in his workshop", { kicker: "Las dudas, una por una" }),
    c("headline", { tokens: ["Las", "dudas", "reales", "que", "te", { t: "frenan" }], eyebrow: "Una por una", bg: "grid", hue: "amber" }),
    sd([
      { name: "im_q_dura", eyebrow: "Duracion", heading: "Cuanto dura?", prompt: "weathered outdoor wood still repelling water after years, renewal coat being applied", clip: true },
      { name: "im_q_renovar", eyebrow: "La prueba de la gota", heading: "Cuando renovar?", prompt: "flicking water on wood to test if it still beads, the drop test", clip: true },
      { name: "im_q_sol", eyebrow: "El sol", heading: "Aguanta el sol?", prompt: "sun beating on treated wood that wears evenly, no peeling flakes unlike varnish", clip: true },
      { name: "im_q_enterrado", eyebrow: "Bajo tierra", heading: "Sirve enterrado?", prompt: "a fence post base in wet soil, the toughest test for any coating", clip: true },
      { name: "im_q_toxico", eyebrow: "Cuando seca", heading: "Es toxico?", prompt: "cured dry waterproofed wood safe near a chicken coop and plants", clip: true },
      { name: "im_q_pintura", eyebrow: "Sobre pintura", heading: "Sobre barniz viejo?", prompt: "flaking old paint being scraped off before treating clean firm wood", clip: true },
      { name: "im_q_auto", eyebrow: "El auto", heading: "Sirve para vidrios?", prompt: "rain beading and rolling off a car windshield, glass water repellent", clip: true },
    ]),
  ]},
  // ░░ PLATA ░░
  { key: "plata", phrase: "la de la plata", beats: [
    c("bars", { title: "Lo que ahorras", unit: "US$", bars: [
      { label: "Impermeabilizante de marca", value: 40, tone: "danger" },
      { label: "Casero (litros)", value: 2, winner: true } ] }),
    r("im_gondola_frascos", "a hardware store shelf full of expensive branded waterproofing sprays"),
    c("quote", { image: r("im_frasco_barato", "a cheap silicone cartridge and solvent making liters of waterproofing mix").gen.name, text: "Un tarrito casero = *veinte frascos de marca*.", accent: "danger", _genImg: "im_frasco_barato", _prompt: P("a cheap silicone cartridge and solvent making liters of waterproofing mix"), at: "veinte frascos" }),
  ]},
  // ░░ TRUCOS → SCROLLDOC ░░
  { key: "trucos", phrase: "trucos finos de artesano", beats: [
    sd([
      { name: "im_t_guardar", eyebrow: "Que dure meses", heading: "Guardar la mezcla", prompt: "a sealed glass jar of waterproofing mix stored on a cool shelf, airtight", clip: true },
      { name: "im_t_acabado", eyebrow: "Mate o satinado", heading: "El acabado", prompt: "two wood samples, one matte invisible finish one satin sheen", clip: true },
      { name: "im_t_temperatura", eyebrow: "Dia templado", heading: "Temperatura y momento", prompt: "applying the mix in the shade on a mild day, warm sun helping it penetrate", clip: true },
      { name: "im_t_trapo", eyebrow: "Mejor que pincel", heading: "El trapo", prompt: "wiping the mix on with an old cotton rag for thin even coats", clip: true },
    ]),
    c("callout", { image: r("im_t_trapos_secar", "oily solvent rags laid out flat outdoors to dry safely, fire safety").gen.name, figure: "OJO", caption: "Los trapos con solvente, extendidos afuera. Nunca en bollo.", accent: "danger", _genImg: "im_t_trapos_secar", _prompt: P("solvent rags laid out flat outdoors to dry safely, fire safety") }),
  ]},
  // ░░ ERRORES → SCROLLDOC ░░
  { key: "errores", phrase: "ahora los errores", beats: [
    sd([
      { name: "im_e_gruesa", eyebrow: "Error 1", heading: "Mano demasiado gruesa", prompt: "a thick sticky whitish coat of silicone that did not dry right, a mistake", clip: true },
      { name: "im_e_mojada", eyebrow: "Error 2", heading: "Superficie mojada o sucia", prompt: "damp dirty wood being sealed the wrong way, trapping moisture inside", clip: true },
      { name: "im_e_pintar", eyebrow: "Error 3", heading: "Pintar despues", prompt: "paint refusing to stick to a silicone-treated surface, beading off", clip: true },
      { name: "im_e_comida", eyebrow: "Error 4", heading: "En lo que toca comida", prompt: "a cutting board that should use food-safe beeswax not solvent mix", clip: true },
    ]),
  ]},
  // ░░ POR QUE LO OCULTAN ░░
  { key: "ocultan", phrase: "si esto es tan barato", beats: [
    rv("im_barnices_publicidad", "shelves of shiny branded waterproofing products in a modern store, cold light", { frames: 75 }),
    r("im_spray_lindo", "a fancy branded waterproofing spray bottle with a nice label and a high price tag"),
    r("im_frasco_gasta", "an expensive product that peels off after one season, needing rebuying"),
    c("chips", { bg: "image", image: "img/im_spray_lindo.png", imageDarken: 0.62, title: "El negocio del reemplazo", chips: ["Se descascara", "Recomprás", "Cada año"], hue: "red" }),
    c("quote", { image: r("im_industria", "a faceless chemical company, expensive products that wear out and get rebought").gen.name, text: "Ellos viven de que *vuelvas a comprar*.", accent: "danger", _genImg: "im_industria", _prompt: P("a faceless chemical company, expensive products that wear out and get rebought"), at: "vuelvas a comprar" }),
    r("im_abuelo_lona", "an old grandfather waterproofing a cart canvas with grease and wax for pennies, sepia"),
    c("headline", { tokens: ["Las", "fabricas", "nos", "van", "a", { t: "linchar" }], eyebrow: "El dia que esto se sepa", bg: "image", image: r("im_linchar", "a cheap homemade jar next to twenty expensive branded bottles, David vs Goliath").gen.name, _genImg: "im_linchar", _prompt: P("a cheap homemade jar next to twenty expensive branded bottles"), at: "linchar" }),
  ]},
  // ░░ HISTORIA ░░
  { key: "historia", phrase: "nada de esto es nuevo", beats: [
    r("im_h_barco", "an old sailing ship hull being sealed with pitch and tar, sepia vintage feel"),
    r("im_h_encerado", "old sailors in waxed oilskin capes in a storm, sepia archival"),
    r("im_h_gaucho", "a gaucho curing leather boots and saddle with grease and tallow, rural sepia"),
    c("chips", { bg: "image", image: "img/im_h_barco.png", imageDarken: 0.62, title: "Lo NUEVO es el spray caro", chips: ["Brea: 5000 anos", "Cera: milenios", "Spray: ayer"], hue: "amber" }),
    c("splitlist", { title: "Cinco mil anos ganandole al agua", items: ["Brea en los barcos", "Cera de abeja", "Aceite y grasa", "Sebo en el cuero"], palette: "A" }),
    c("aged", { heading: "Cinco mil anos ganandole al agua", lines: [{ text: "Brea, cera, aceite, grasa.", mark: true }, { text: "El spray caro de la ferreteria es lo NUEVO." }], image: r("im_h_lona_carro", "a waxed canvas cart cover from old times repelling rain, sepia").gen.name, _genImg: "im_h_lona_carro", _prompt: P("a waxed canvas cart cover from old times repelling rain, sepia") }),
  ]},
  // ░░ CTA ░░
  { key: "cta", phrase: "si queres tenerlo todo ordenado", beats: [
    c("diagram", { eyebrow: "Todo, ordenado y probado", slides: [{ image: dg("dg_im_manual", "Lamina del Manual del Constructor Libre: la tabla de medidas de impermeabilizante por superficie (silicona para el deck, cera para las botas, la manteca de madera al gramo) + otros 39 arreglos de un peso, apilados como pila de valor. Sin precios ni texto legible."), eyebrow: "Las medidas por superficie + 39 arreglos mas" }] }),
    c("bars", { title: "El valor", unit: "US$", bars: [{ label: "Por separado", value: 158, tone: "danger" }, { label: "Hoy", value: 27, winner: true }] }),
    c("quote", { image: r("im_manual_celular", "a phone showing an open ebook home-repair manual on a workbench, warm light").gen.name, text: "Con impermeabilizar una lona, *ya lo pagaste*.", accent: "good", _genImg: "im_manual_celular", _prompt: P("a phone showing an open ebook home-repair manual on a workbench, warm light") }),
  ]},
  // ░░ COMENTARIOS ░░
  { key: "coment", phrase: "contame en los comentarios", beats: [
    rav("im_tomas_camara", "talking warmly to camera inviting comments in his workshop", { kicker: "Que vas a impermeabilizar?" }),
    c("headline", { tokens: ["Que", "truco", "usaban", "en", "tu", { t: "zona" }], eyebrow: "Grasa, cera, brea, aceite quemado?", bg: "grid", hue: "amber" }),
  ]},
  // ░░ CIERRE ░░
  { key: "cierre", phrase: "el agua siempre busca", beats: [
    c("quote", { image: r("im_madera_dorada", "a beautifully waterproofed wooden surface glowing in golden hour, water beading").gen.name, text: "La independencia se prepara *con las manos*.", _genImg: "im_madera_dorada", _prompt: P("a beautifully waterproofed wooden surface glowing in golden hour, water beading"), at: "con las manos" }),
    c("headline", { tokens: ["Que", "el", "agua", { t: "resbale" }], eyebrow: "Cuida lo tuyo", bg: "image", image: r("im_cierre_gota", "a single water droplet rolling off restored wood at golden hour, macro").gen.name, _genImg: "im_cierre_gota", _prompt: P("a single water droplet rolling off restored wood at golden hour, macro") }),
    rav("im_tomas_firma", "at his workshop door closing the video, golden hour, warm", { hold: true }),
  ]},
];

// ── ANCLAJE POR FRASE ────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_impermeable.json", "utf8"));
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
// texto de captions en una ventana [t, t+win] → cuerpo tipeado del panel
const capsText = (t, win = 3.0, maxWords = 16) => {
  const w = [];
  for (const x of CW) { if (x.s < t - 0.15) continue; if (x.s > t + win) break; w.push(x.raw); if (w.length >= maxWords) break; }
  return w.join(" ").replace(/\s+/g, " ").trim();
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1764) + 1.5;

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
      const clipOk = fs.existsSync(`public/vid/${b.name}.mp4`);
      beat.src = clipOk ? `vid/${b.name}.mp4` : `img/${b.name}.png`;
      beat.hue = hue; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true;
      if (b.gen) beat.gen = b.gen;
    } else if (b.t === "half") {
      beat.kind = "half"; beat.src = fs.existsSync(`public/vid/${b.name}.mp4`) ? `vid/${b.name}.mp4` : `img/${b.name}.png`; beat.side = b.side || "right"; beat.hue = hue; if (b.gen) beat.gen = b.gen; if (b.kicker) beat.kicker = b.kicker;
    } else if (b.t === "scrolldoc") {
      beat.kind = "scrolldoc";
      // panels: distribuir en la ventana, body = captions, media = vid si existe si no poster png
      const np = b.panels.length;
      const per = dur / np;
      beat.panels = b.panels.map((p, k) => {
        const pt = +(cursor + k * per).toFixed(2);
        const clipOk = fs.existsSync(`public/vid/${p.name}.mp4`);
        const panel = { eyebrow: p.eyebrow, heading: p.heading, body: capsText(pt, Math.min(per, 8), 42) };
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

// extraImages (embebidas en props) + imágenes de panels de scrolldoc
const extraImgs = [];
const scan = (o) => { if (!o || typeof o !== "object") return; if (o._genImg && o._prompt) extraImgs.push({ name: o._genImg, prompt: o._prompt }); for (const k of Object.keys(o)) scan(o[k]); };
SECTIONS.forEach((s) => s.beats.forEach(scan));
// panels → imágenes a generar (con su prompt corto)
const panelImgs = [];
SECTIONS.forEach((s) => s.beats.forEach((b) => { if (b.t === "scrolldoc") b.panels.forEach((p) => panelImgs.push({ name: p.name, prompt: P(p.prompt) })); }));

const strip = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(strip); return; } delete o._genImg; delete o._prompt; for (const k of Object.keys(o)) strip(o[k]); };
beats.forEach(strip);
const fixImg = (o) => { if (!o || typeof o !== "object") return; if (Array.isArray(o)) { o.forEach(fixImg); return; } if (typeof o.image === "string" && !o.image.includes("/") && !o.image.includes(".")) o.image = `img/${o.image}.png`; for (const k of Object.keys(o)) { if (k === "gen") continue; fixImg(o[k]); } };
beats.forEach(fixImg);
// animar fondos de componente
const BG_KINDS = new Set(["chips", "headline", "aged", "quote", "callout"]);
for (const b of beats) { if (BG_KINDS.has(b.kind) && typeof b.image === "string") { const m = b.image.match(/^img\/(.+)\.png$/); if (m && fs.existsSync(`public/vid/${m[1]}.mp4`)) b.image = `vid/${m[1]}.mp4`; } }

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/impermeable.json", JSON.stringify({ video: "impermeable", avatar: "impermeable_opt.mp4", tutorial: true, beats, extraImages: extraImgs.concat(panelImgs) }, null, 1));
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync("public/img/prompts_impermeable_diag.json", JSON.stringify(DIAGRAMS, null, 2));

const raw = beats.filter((b) => b.kind === "raw").length;
const sdc = beats.filter((b) => b.kind === "scrolldoc").length;
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
console.log(`beats: ${beats.length} · raw: ${raw} · scrolldoc: ${sdc} · diagramas: ${DIAGRAMS.length} · extra+panels: ${extraImgs.length + panelImgs.length} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
console.log("kinds:", JSON.stringify(kinds));
