// build_salitre.mjs — CLIPS-FIRST DENSO (Constructor Libre, "El Constructor Libre").
// Re-angulado del hit de la madera, ahora sobre "la humedad que sube por la pared / el salitre".
// Avatar Tomás + b-roll dominante REAL: clips YouTube (matchfarm proxies) + cientos de imágenes
// web (fetch_bing). AI solo diagramas. Queries ANALIZADAS del guion (específicas, EN inglés,
// ancladas al TEMA: humedad ascendente / salitre / capilaridad / barrera anti-capilar / cal /
// drenaje) — no random. Pacing ~4.5s (denso). REGLA #0: cada beat al ms exacto.
// Modos:  node build_salitre.mjs match  |  node build_salitre.mjs
import fs from "fs";

const SLUG = "salitre";
const AVATAR = `${SLUG}_opt.mp4`;
const MODE = process.argv[2] === "match" ? "match" : "build";
const MINGAP = Number(process.env.OX_MINGAP) || 2.2;
const OPEN = 1.6, OV = 0.4, DLDUR = 6;

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase) => { const t = norm(phrase).split(" ").filter(Boolean); for (let i = 0; i <= Wc.length - t.length; i++) { let ok = 1; for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; } if (ok) return Wc[i].ms / 1000; } throw new Error("ANCHOR NOT FOUND: " + phrase); };
const atc = (p) => { try { return at(p); } catch { console.warn("⚠ anchor missing:", p); return null; } };
const TOTAL = +((Wc[Wc.length - 1].e) / 1000 + 1.5).toFixed(2);
const PHRASE_BOUNDS = [];
for (let i = 0; i < caps.length; i++) { const prev = caps[i - 1]; const punct = prev ? /[.,;:!?…"]$/.test(prev.text.trim()) : true; const gap = prev ? caps[i].startMs - prev.endMs : 9999; if (i === 0 || punct || gap > 200) PHRASE_BOUNDS.push(caps[i].startMs / 1000); }

const C = (name, query, concept, o = {}) => ({ k: "c", name, query, concept, ...o });
const I = (name, query, concept, o = {}) => ({ k: "i", name, query, concept, ...o });
const G = (name, o = {}) => ({ k: "g", name, ...o });
const X = (props) => ({ k: "comp", ...props });
const DP = (d) => `Crear una infografía horizontal, RELACIÓN DE ASPECTO EXACTA 16:9 (1792x1024), estilo lámina ilustrada hecha a mano pero muy profesional, limpia, premium y editorial. Fondo marfil claro con textura de papel muy sutil, líneas marrón oscuro casi negras, acentos en verde oliva/salvia y terracota apagado. ${d}. DEJÁ COMPLETAMENTE LIBRE la esquina superior derecha (limpia, sin texto) para colocar después el avatar. Composición minimalista, mucho espacio, pocos bloques grandes, tinta fina con acuarela suave, se entiende en 1 segundo. Textos en español, breves. Estética: vintage botanical / archival textbook illustration, premium editorial, papel levemente envejecido. Evitá verse escolar/infantil/sobrecargado.`;
const DIAGRAMS = [];
const dg = (name, desc) => { DIAGRAMS.push({ name, prompt: DP(desc) }); return `img/${name}.png`; };
const HUES = ["amber", "red", "blue"];

const SECTIONS = [
  // ░░ 1) COLD OPEN — la casa de 100 años vs tu pared con salitre ░░
  { a: "mira bien esto", start: 0, beats: [
    C("sl_old_farmhouse_dry", "old adobe brick farmhouse walls dry firm hundred years countryside", "a 100-year-old country house, dry, firm, spotless walls", { at: "una casa de campo de 100 anos" }),
    C("sl_old_stone_wall_road", "old stone wall by a country road planted in the ground for a century", "a roadside stone wall standing since before your grandpa", { at: "un muro de piedra al costado del camino" }),
    C("sl_your_damp_bedroom_wall", "interior bedroom wall with damp stain rising from the baseboard", "and next to it, your wall, the bedroom, the bathroom", { at: "y al lado tu pared" }),
    C("sl_plaster_crumbles_baseboard", "crumbling plaster near the baseboard falling apart by hand", "you painted it two summers ago and the plaster crumbles", { at: "la revocaste la pintaste hace dos veranos" }),
    C("sl_white_powder_floor_stain", "white salt powder on the floor damp stain rising up the wall", "white powder on the floor and a stain rising from below", { at: "cae un polvillo blanco al piso" }),
    C("sl_same_house_same_ground", "two walls same house same damp ground opposite fate comparison", "the same house, the same ground, opposite fate", { at: "la misma casa la misma tierra" }),
    I("sl_peeling_wall_worry", "homeowner worried inspecting a peeling flaking damp interior wall", "you're here because a wall of yours is flaking", { at: "si entraste a este video" }),
    C("sl_dark_stain_baseboard_rising", "dark damp stain rising above the baseboard interior wall", "a dark stain climbing from the baseboard, musty smell", { at: "que tiene una mancha oscura subiendo desde el zocalo" }),
    C("sl_old_bricklayers_knew", "old bricklayers working a wall traditional lime method knowledge", "the old bricklayers knew something nobody explained to you", { at: "los albaniles de antes sabian algo que a vos nadie te explico" }),
    G("sl_tomas_hook", { kicker: "Lo que la industria de la humedad no quiere que sepas" }),
  ]},
  // ░░ 2) LA PRUEBA — las dos paredes ░░
  { a: "internet esta lleno de gente que te vende pintura milagrosa", beats: [
    I("sl_fake_miracle_paint", "phone screen fake miracle waterproof paint ad online skeptical", "the internet is full of people selling miracle paint", { at: "internet esta lleno de gente que te vende pintura milagrosa" }),
    C("sl_two_walls_demo", "two wall test panels side by side from the same house damp demo", "look at these two walls, same house, same plaster", { at: "mira estas dos paredes" }),
    C("sl_waterproof_paint_brush", "brushing thick waterproof sealing paint onto a damp interior wall", "on the first I did what everyone does: waterproof paint", { at: "le pase una pintura impermeable" }),
    C("sl_paint_blistered_bubbles", "waterproof paint blistered peeling off a damp wall in bubbles", "look how it turned out: it blistered all over", { at: "se ampollo toda" }),
    C("sl_plaster_more_rotten", "plaster under paint softer more rotten than before wet damp", "and underneath the plaster is more rotten than before", { at: "y abajo el revoque esta mas podrido que antes" }),
    C("sl_sealed_and_burst", "sealed damp wall that got worse trapped moisture burst", "I sealed it in and I blew it up", { at: "la encerre y la revente" }),
    C("sl_second_wall_treated_right", "second wall treated the right way dry firm no blisters", "this other one I treated the right way", { at: "esta otra la de al lado la trate como corresponde" }),
    C("sl_wall_left_to_breathe", "wall left to breathe with a breathable lime finish drying", "I let it breathe and gave it a finish that lets damp out", { at: "la deje respirar" }),
    C("sl_wall_dry_firm_clean", "dry firm interior wall no blisters no powder healthy plaster", "it dried, firm, no blisters, no powder", { at: "esta firme sin ampollas sin polvillo" }),
    C("sl_seal_vs_dry_decision", "one wall sealed one wall dried the single decision comparison", "the only difference: one sealed, the other dried", { at: "la unica diferencia es que a una la selle y a la otra la deje secar" }),
  ]},
  // ░░ 3) LAS 4 COSAS / promesa ░░
  { a: "antes de llegar ahi te voy a mostrar las cuatro cosas que hay que hacer", beats: [
    C("sl_four_things_to_do", "four simple cheap steps to fix rising damp on a wall demo", "four things to do, from simplest to most powerful", { at: "antes de llegar ahi te voy a mostrar las cuatro cosas que hay que hacer" }),
    C("sl_cut_water_at_source", "finding an outside water source soaking the base of a wall garden", "first: cut the water at the source, often outside", { at: "de la mas simple a la mas poderosa" }),
    C("sl_let_wall_breathe", "stripping plastic paint off a wall so it can breathe again", "then: let the wall really breathe, strip the plastic paint", { at: "dejar que la pared respire de verdad" }),
    C("sl_old_mason_trick", "old bricklayer secret trick to stop rising damp at the base", "then the old mason's trick, that companies charge a fortune", { at: "el truco del albanil viejo" }),
    C("sl_cut_rising_at_base", "cutting the rising water at the base of the wall barrier wick", "cut the rising water at the base, the barrier that cuts the wick", { at: "cortar la subida del agua en la base de la pared" }),
    C("sl_drain_water_away", "grading soil and gravel to drain rainwater away from a wall base", "and finally, drain the water away from the ground for good", { at: "alejar el agua del terreno para que no vuelva nunca" }),
    C("sl_stay_until_end", "finger pointing keep watching screen reminder stay until the end", "stay till the end: the one error that ruins everything", { at: "quedate hasta el final" }),
  ]},
  // ░░ 4) SOY TOMÁS ░░
  { a: "soy tomas y esto es lo que la industria de la humedad no quiere que sepas", full: true, beats: [] },
  // ░░ 5) STAKES — lo que la humedad ya te costó ░░
  { a: "pensa un segundo en lo que esa humedad ya te costo", beats: [
    C("sl_damp_already_cost_you", "wasted money repainting a wall that flaked again damp cost", "think about what this damp already cost you, not just money", { at: "pensa un segundo en lo que esa humedad ya te costo" }),
    C("sl_musty_bedroom_unusable", "bedroom with a musty damp smell unusable closed closet", "the bedroom you can't use because of the musty smell", { at: "del dormitorio que no podes usar bien" }),
    C("sl_baseboard_falls_apart", "wooden baseboard crumbling apart on its own from damp", "the baseboard that falls apart on its own", { at: "del zocalo que se desarma solo" }),
    C("sl_mold_family_health", "black mold growing on a damp wall corner family health risk", "and your health: that musty smell is mold in your house", { at: "de la salud" }),
    C("sl_damp_is_treacherous", "rising damp spreading unseen up a wall slow treacherous stain", "here's what makes this damp so treacherous", { at: "y aca esta lo que hace a esta humedad tan traicionera" }),
    C("sl_slow_silent_damp", "slow silent damp creeping up a wall over months timelapse", "it's slow, silent, not a leak you can pinpoint", { at: "esto es lento silencioso" }),
    C("sl_tiny_stain_above_base", "tiny damp spot just above the baseboard barely noticeable", "it starts with a tiny spot above the baseboard", { at: "empieza con una manchita arriba del zocalo" }),
    C("sl_stain_up_to_waist", "damp stain risen up to waist height on an interior wall", "before you know it the stain reached waist height", { at: "la mancha llego a la altura de la cintura" }),
    C("sl_hack_open_redo_wall", "chipping out and redoing a ruined damp plaster wall labor", "then the neat wall must be hacked open and redone", { at: "hay que picarla y rehacerla" }),
    C("sl_it_comes_back", "damp coming back on a repainted wall because water not cut", "and if you didn't cut the water, it comes back", { at: "y si no cortaste el agua vuelve" }),
  ]},
  // ░░ 6) EL SECRETO — humedad ascendente y capilaridad ░░
  { a: "ahora si la verdad simple", beats: [
    G("sl_tomas_secreto", { kicker: "Tan simple que da bronca" }),
    C("sl_not_from_above", "checking a wall damp not coming from the roof or the rain above", "this damp doesn't come from above, it's not the rain", { at: "esa humedad no viene de arriba" }),
    C("sl_water_comes_from_below", "damp water rising from the soil up into the base of a wall", "this damp comes from below, from the soil, and rises", { at: "esa humedad viene de abajo" }),
    X({ kind: "diagram", at: "se llama humedad ascendente", eyebrow: "El agua del suelo sube por la pared como una mecha", slides: [{ image: dg("dg_sl_capillarity", "Diagrama en corte de una pared apoyada sobre la TIERRA HÚMEDA. La pared está llena de canalitos finitos (poros) dibujados como tubos verticales, como una ESPONJA. El AGUA del suelo (azul) SUBE por esos canalitos con flechas hacia arriba, 'sin bomba, sin nada'. Al costado, un farol con la mecha chupando aceite y una servilleta de papel apoyada en un charco absorbiendo agua, como analogías. Etiquetas 'tierra húmeda abajo', 'la pared chupa como esponja', 'capilaridad: el agua sube sola'. Transmite el mecanismo de la humedad ascendente."), eyebrow: "Humedad ascendente: la pared chupa agua del suelo" }] }),
    C("sl_wall_pores_like_sponge", "brick and plaster full of tiny pores like a sponge cross section", "the brick and plaster are full of tiny channels, like a sponge", { at: "estan llenos de porcitos de canalitos finitos" }),
    C("sl_water_rises_no_pump", "water climbing up tiny channels in a wall by itself no pump", "the water climbs on its own, no pump, no nothing", { at: "el agua del suelo se mete en esos canalitos y sube sola" }),
    C("sl_oil_lamp_wick", "oil rising up the wick of an old lamp capillary analogy", "just like oil rises up the wick of a lamp", { at: "igual que sube el aceite por la mecha de un farol" }),
    C("sl_capillarity_named", "water wicking up a paper napkin from a puddle capillary demo", "that's called capillarity, the wall drinks all day", { at: "eso se llama capilaridad" }),
  ]},
  // ░░ 7) POR QUÉ SALITRE — el agua trae sales que cristalizan ░░
  { a: "y esa agua sube hasta que llega a la parte de la pared donde se puede evaporar", beats: [
    C("sl_water_evaporates_surface", "damp water evaporating at the surface of a wall into the room air", "the water rises until it can evaporate at the surface", { at: "y esa agua sube hasta que llega a la parte de la pared donde se puede evaporar" }),
    C("sl_evaporates_as_vapor", "moisture leaving a wall as vapor into the room drying", "there the water leaves as vapor", { at: "ahi el agua se va en forma de vapor" }),
    C("sl_water_carries_salts", "groundwater carrying dissolved mineral salts from the soil", "but the groundwater isn't clean, it carries salts", { at: "viene cargada de sales" }),
    X({ kind: "diagram", at: "cuando el agua se evapora en la superficie de la pared", eyebrow: "El agua se evapora y las sales quedan, cristalizan y revientan", slides: [{ image: dg("dg_sl_salt_crystal", "Diagrama en corte de la SUPERFICIE de una pared. El agua salada SUBE desde abajo (flecha), llega a la cara de la pared y el AGUA se EVAPORA (vapor subiendo), pero las SALES (cristales blancos) QUEDAN atrás de la pintura y adentro del revoque. Los cristales, al juntarse, CRECEN y EMPUJAN como 'mil cuñitas' que revientan la pintura en ampollas y hacen saltar el revoque. Etiquetas 'el agua se va, la sal queda', 'la sal cristaliza y empuja', 'el salitre revienta la pintura'. Transmite que el salitre es sal cristalizando con fuerza."), eyebrow: "El salitre: sal que cristaliza y empuja como cuñitas" }] }),
    C("sl_salts_stay_behind_paint", "salt deposits building up behind paint inside plaster wall", "the water goes but the salts stay, behind the paint", { at: "el agua se va pero las sales quedan" }),
    C("sl_salts_grow_push", "salt crystals growing and pushing outward on a wall surface", "the salts join, grow, push", { at: "crecen hacen fuerza empujan" }),
    C("sl_efflorescence_white_salt", "white efflorescence salt bloom on a damp interior wall surface", "that white powder is the salitre", { at: "el salitre" }),
    C("sl_salt_bursts_paint_plaster", "salt crystals bursting paint into blisters and flaking plaster", "that force is what bursts the paint and flakes everything", { at: "la que descascara todo" }),
    C("sl_salt_wedges_push_out", "salt crystallizing like a thousand tiny wedges pushing out wall", "the salt, crystallizing, is like a thousand tiny wedges", { at: "es que la sal" }),
  ]},
  // ░░ 8) UN SOLO PROBLEMA (OVL) ░░
  { a: "la mancha que sube el revoque que se desarma y el polvillo blanco", beats: [
    C("sl_three_are_one_problem", "stain rising, plaster crumbling, white powder all one damp problem", "the stain, the crumbling plaster and the powder are one problem", { at: "la mancha que sube el revoque que se desarma y el polvillo blanco" }),
    C("sl_wall_drinking_from_below", "wall drinking water from the wet soil below the enemy", "it's soil water rising, evaporating, leaving the salt", { at: "es agua del suelo subiendo por la pared" }),
    C("sl_that_is_the_enemy", "the base of the wall taking water from the ground the enemy", "the wall is taking water from below, that's the enemy", { at: "la pared esta tomando agua de abajo" }),
  ]},
  // ░░ 9) DOS HECHOS — muro de piedra 200 años vs pared nueva ░░
  { a: "por que un muro de piedra de 200 anos", beats: [
    X({ kind: "diagram", at: "por que un muro de piedra de 200 anos", eyebrow: "Por qué el muro viejo está seco y tu pared no", slides: [{ image: dg("dg_sl_stone_vs_new", "Diagrama comparativo de dos paredes sobre la misma tierra húmeda. Izquierda: un MURO DE PIEDRA ANCHO de 200 años, con poros cerrados y revoque a la CAL, donde el agua sube poquito y se evapora rápido antes de subir, con cartel 'chupa poco + respira = seco'. Derecha: una PARED DE MATERIAL NUEVA, de ladrillo hueco y revoque de cemento que chupa agua 'como una toalla', sellada con PINTURA PLÁSTICA que la ahoga y le atrapa el agua, con cartel 'chupa mucho + sellada = se pudre'. Etiquetas 'piedra + cal: respira', 'ladrillo + cemento + plástico: se ahoga'. Transmite por qué una dura y la otra no."), eyebrow: "Piedra + cal respira · ladrillo + cemento + plástico se ahoga" }] }),
    C("sl_stone_wall_no_problem", "old thick stone wall in wet ground with no damp problem centuries", "why does a 200-year stone wall in the same wet ground have no problem", { at: "por que un muro de piedra de 200 anos" }),
    C("sl_stone_closed_pores_lime", "thick stone wall with lime mortar closed pores breathing", "because stone has tighter pores and they built with lime", { at: "porque la piedra tiene los poros mas cerrados" }),
    C("sl_new_wall_rots_two_years", "new tidy plastered wall rotting from damp in just two years", "and the new tidy wall rots in two years?", { at: "por que la pared de material nuevo prolija se pudre en dos anos" }),
    C("sl_hollow_brick_cement_toweling", "modern hollow brick and cement plaster soaking water like a towel", "because hollow brick and cement plaster soak water like a towel", { at: "porque el ladrillo hueco moderno y el revoque de cemento chupan agua como una toalla" }),
    C("sl_plastic_paint_cant_breathe", "plastic waterproof paint sealing a wall so it cannot breathe", "and you put plastic paint on it that won't let it breathe", { at: "y encima le pusiste pintura plastica que no la deja respirar" }),
  ]},
  // ░░ 10) POR QUÉ ANTES SECA — barrera de base + cal + vereda ░░
  { a: "y ahora la pregunta del principio", beats: [
    C("sl_grandpa_house_dry_question", "old grandpa house dry walls vs your damp wall question", "why was your grandpa's house dry and yours isn't", { at: "y ahora la pregunta del principio" }),
    C("sl_isolating_layer_base", "damp proof course isolating layer at the base of an old wall", "one: old houses had an isolating layer at the base", { at: "una barrera abajo de la pared que cortaba la subida del agua" }),
    C("sl_old_masons_lime_breathe", "old masons using lime that lets damp evaporate breathing wall", "the old ones knew to cut the water and let the wall breathe", { at: "los viejos sabian cortar el agua y sabian dejar respirar la pared" }),
    C("sl_sidewalk_slope_away", "old sidewalk built with a slope so water runs away from the wall", "they sloped the sidewalk so the water ran away", { at: "hacia la vereda con pendiente" }),
    C("sl_today_seal_and_pray", "today sealing a wall with plastic paint and hoping wrong slope", "today you seal with plastic paint and pray", { at: "hoy sellas con pintura plastica" }),
    C("sl_lost_secret_fight_water", "the lost secret they knew how to fight the water in walls", "that's the lost secret: they knew how to fight the water", { at: "ese es el secreto que se perdio" }),
  ]},
  // ░░ 11) REGLA #1 — la pared seca no se arruina ░░
  { a: "la regla numero uno", beats: [
    C("sl_rule_one_dry_wall", "the rule dry wall does not get ruined healthy dry plaster", "rule one: a dry wall doesn't get ruined", { at: "la pared seca no se arruina" }),
    C("sl_cut_below_breathe_above", "cutting water below and letting a wall breathe above job", "your only job: cut the water below, let it breathe above", { at: "vamos una por una" }),
  ]},
  // ░░ 12) MÉTODO 1 — cortar el agua en el origen ░░
  { a: "cortar el agua en el origen antes de tocar", beats: [
    C("sl_go_outside_find_water", "going outside to find where extra water enters a wall base", "before touching the wall, go outside and find the extra water", { at: "cortar el agua en el origen antes de tocar" }),
    C("sl_nobody_looks_at_this", "the extra water source nobody looks at against a wall garden", "here's what almost nobody looks at", { at: "porque acaba algo que casi nadie mira" }),
    X({ kind: "diagram", at: "esa tierra es una esponja pegada al muro", eyebrow: "Las fuentes de agua extra que le ponés a la pared sin querer", slides: [{ image: dg("dg_sl_water_sources", "Diagrama de una pared de casa vista de afuera con FLECHAS señalando las fuentes de agua EXTRA que la empapan: 1) un CANTERO / tierra de jardín apoyada contra la pared más alta que el piso ('esponja pegada al muro'), 2) un CAÑO o canilla que gotea al pie de la pared, 3) una VEREDA con pendiente EQUIVOCADA hacia la pared (el agua corre hacia el muro), 4) la BAJADA del techo / canaleta tirando agua justo al pie. Cada una con su icono y etiqueta corta. Transmite 'sacá estas fuentes antes de tratar nada'."), eyebrow: "Cantero · caño que pierde · vereda al revés · canaleta" }] }),
    C("sl_garden_bed_sponge", "garden soil bed piled against a wall higher than indoor floor sponge", "a garden bed against the wall is a sponge feeding it water", { at: "esa tierra es una esponja pegada al muro" }),
    C("sl_remove_soil_from_wall", "removing garden soil away from a wall leaving a gap breathing", "pull that soil away from the wall, give it a gap", { at: "saca esa tierra alejala de la pared" }),
    C("sl_leaking_pipe_wall_base", "a leaking pipe joint wetting the base of a wall constantly", "a leaking pipe joint soaking the foot of the wall", { at: "una junta de la caneria mojando el pie de la pared" }),
    C("sl_fix_the_leak_first", "fixing a leaking outdoor pipe before treating a damp wall", "fix that leak first, or you're bailing with the hole open", { at: "arregla esa perdida primero" }),
    C("sl_sidewalk_slopes_to_wall", "outdoor sidewalk sloping toward a wall so rain pools at the base", "a sidewalk sloping toward the wall pools rain against it", { at: "la vereda o el contrapiso de afuera tiene pendiente hacia la pared" }),
    C("sl_no_sidewalk_rain_hits", "no sidewalk rain hitting directly the base of a wall splashing", "no sidewalk and the rain hits straight at the base", { at: "no hay vereda y la lluvia pega directo en la base" }),
    C("sl_check_all_that_first", "checking outside water sources first cheap zero cost damp fix", "check all that first: it's free and often the damp drops a lot", { at: "mira todo eso primero" }),
    C("sl_cut_soil_fix_pipe_grade", "removing soil, fixing pipe and correcting outdoor grading wall", "cut the piled soil, fix the leaking pipe, correct the run-off", { at: "cortar la tierra apoyada arreglar el cano que pierde" }),
    C("sl_no_treatment_holds_extra", "no wall treatment holds if extra water keeps feeding it damp", "if you're feeding it extra water, no treatment holds", { at: "si le estas metiendo agua de mas sin querer" }),
  ]},
  // ░░ 13) MÉTODO 2 — dejar respirar / cal ░░
  { a: "el segundo metodo", beats: [
    C("sl_method_two_let_breathe", "second method letting a wall breathe removing what suffocates it", "the second method: let the wall breathe", { at: "el segundo metodo" }),
    C("sl_remove_what_suffocates", "stripping suffocating plastic coating off a wall breathing", "remove what's suffocating it", { at: "sacarle lo que la esta ahogando" }),
    C("sl_plastic_paint_synthetic", "plastic waterproof paint and synthetic filler that traps vapor wall", "if you put plastic paint or a synthetic filler on it", { at: "si vos le pusiste una pintura plastica impermeable" }),
    C("sl_water_still_rises_inside", "water still rising inside a wall behind sealing paint trapped", "the water still rises inside, the surface paint can't stop it", { at: "el agua igual sube" }),
    X({ kind: "diagram", at: "por eso sellar empeora todo", eyebrow: "Pintura plástica que encierra el agua vs cal que respira", slides: [{ image: dg("dg_sl_seal_vs_breathe", "Diagrama comparativo de dos paredes en corte. Izquierda: pared con PINTURA PLÁSTICA impermeable en la superficie; el agua sube por adentro pero NO puede salir, queda ATRAPADA, se acumula, empuja más arriba y la sal cristaliza justo debajo de la pintura reventándola en ampollas ('sellar = encerrar el agua'). Derecha: pared con revoque y pintura a la CAL, permeable; el vapor ATRAVIESA y sale al aire, la pared 'respira como la piel' y no se ampolla ('cal = deja salir el vapor'). Etiquetas 'plástico: encierra y revienta', 'cal: respira y seca'. Transmite el contraste sellar vs respirar."), eyebrow: "Plástico encierra y revienta · la cal respira y seca" }] }),
    C("sl_strip_plastic_to_plaster", "stripping plastic paint back down to the plaster on a wall", "the opposite of what they told you: strip that plastic paint", { at: "al reves de lo que te dijeron sacas toda esa pintura plastica" }),
    C("sl_chip_rotten_plaster_brick", "chipping soft sandy blown plaster back to sound brick wall", "if the plaster is rotten, chip it back to sound brick", { at: "si el reboque de abajo ya esta podrido" }),
    C("sl_lime_plaster_breathable", "applying breathable lime plaster to a wall instead of cement", "then rebuild with breathing materials: lime plaster", { at: "y ahi volves a armar la pared con materiales que respiran" }),
    C("sl_lime_mineral_paint_permeable", "permeable lime paint or mineral paint on a wall breathing vapor", "lime paint or mineral paint, permeable, letting vapor out", { at: "pintura a la cal o pintura mineral" }),
    C("sl_lime_the_old_material", "lime the old builders material letting damp evaporate breathe", "lime is the old-timers' material exactly for this", { at: "la cal es el material de los viejos justamente por esto" }),
    C("sl_lime_wall_no_blister", "lime plastered and painted wall releasing water not blistering", "a lime wall lets the water out and doesn't blister", { at: "una pared revocada y pintada a la cal larga el agua y no se ampolla" }),
    C("sl_opposite_of_sealing", "taking the lid off a pot analogy letting steam out wall breathe", "it's the exact opposite of sealing: you take the lid off", { at: "es lo opuesto exacto a sellar" }),
  ]},
  // ░░ 14) INJERTO 1 — manual (proporciones de la cal, ~52%) ░░
  { a: "las proporciones exactas de la mezcla", beats: [
    C("sl_exact_lime_proportions", "exact lime and sand proportions for breathable plaster mix notes", "the exact proportions of the mix: how much lime, how much sand", { at: "las proporciones exactas de la mezcla" }),
    C("sl_gathered_recipe_notes", "handwritten recipe with exact lime amounts gathered in a manual", "I gathered that recipe with the exact amounts", { at: "las tengo anotadas" }),
    C("sl_start_today_nothing_needed", "man starting to fix a damp wall today with basic supplies", "for today you need nothing, you can start already", { at: "pero ojo para lo de hoy no te hace falta tener nada" }),
    C("sl_keep_watching_trick_error", "keep watching the old mason trick and the error that ruins all", "keep watching: the old mason's trick and the error still come", { at: "segui mirando que todavia falta el truco del albanil viejo" }),
  ]},
  // ░░ 15) LÍMITE del respirar — la fuente de abajo sigue ░░
  { a: "el limite de este metodo", beats: [
    C("sl_breathe_limit_honest", "honest limit breathing helps dry but strong source keeps rising", "the honest limit: breathing helps but if the source is strong", { at: "el limite de este metodo" }),
    C("sl_dry_above_wet_below", "wall drying at the top but still wet at the base rising damp", "you'll see it dry above but it stays wet below", { at: "pero si el agua sigue subiendo fuerte desde el suelo" }),
    C("sl_salitre_keeps_coming", "salitre efflorescence still appearing slower on a damp wall", "and the salitre keeps appearing, slower", { at: "el salitre va a seguir apareciendo" }),
    C("sl_must_cut_the_rise", "you must cut the rising water at the base the real fix", "you have to cut the rise, and that's the method that changes the game", { at: "tenes que cortarle la subida" }),
  ]},
  // ░░ 16) MÉTODO 3 — el truco del albañil / barrera anti-capilar ░░
  { a: "este es el truco del albanil viejo", beats: [
    C("sl_old_mason_trick_hero", "the old bricklayer secret trick companies charge a fortune damp", "this is the old mason's trick companies charge a fortune for", { at: "este es el truco del albanil viejo" }),
    C("sl_cut_capillarity_wick", "cutting the capillary rise cutting the wall's wick barrier base", "cut the capillarity, cut the wall's wick", { at: "cortar la capilaridad" }),
    C("sl_water_up_channels_wick", "water rising up the tiny channels of a wall like a lamp wick", "the water rises up the wall's channels, like the lamp wick", { at: "acordate el agua sube por los canalitos de la pared" }),
    X({ kind: "diagram", at: "si en la base de la pared vos creas una barrera que el agua no puede cruzar", eyebrow: "La barrera anti-capilar: perforar e inyectar hidrofugante", slides: [{ image: dg("dg_sl_barrier_inject", "Diagrama en corte de la BASE de una pared, arriba del zócalo. Se ven PERFORACIONES en fila, un agujero cada pocos centímetros, ligeramente inclinados. Por esos agujeros se INYECTA un LÍQUIDO HIDROFUGANTE (a base de siliconas) que se REPARTE por los poros y los TAPA por dentro, formando una FAJA impermeable horizontal dentro de la pared. El agua que sube desde abajo (flecha azul) LLEGA a la faja y NO PUEDE PASAR; arriba de la faja la pared se SECA sola. Etiquetas 'perforar en fila', 'inyectar hidrofugante', 'faja que corta la subida', 'arriba se seca'. Transmite la barrera química anti-capilaridad."), eyebrow: "Perforar en fila · inyectar hidrofugante · cortar la mecha" }] }),
    C("sl_barrier_water_cant_cross", "a barrier at the wall base that water cannot cross rising damp", "make a barrier the water can't cross, above it the wall dries", { at: "si en la base de la pared vos creas una barrera que el agua no puede cruzar" }),
    C("sl_wall_dries_by_itself", "wall above the barrier drying by itself no new water rising", "it starts drying on its own, no new water getting in", { at: "empieza a secarse sola" }),
    C("sl_this_is_cutting_capillary", "cutting the capillary rise the root solution not the symptom", "that is cutting the capillarity, the root solution", { at: "eso es cortar la capilaridad" }),
    C("sl_how_company_charges", "damp company drilling and injecting a wall base overcharging", "how does the company do it and charge a fortune?", { at: "como lo hace la empresa y te cobra carisimo" }),
    C("sl_drill_holes_row", "drilling a row of holes every few centimeters along a wall base", "they drill the base, a hole every few centimeters", { at: "un agujero cada pocos centimetros" }),
    C("sl_inject_silicone_liquid", "injecting a silicone based water repellent liquid into wall pores", "and inject a silicone-based water-repellent liquid", { at: "a base de siliconas" }),
    C("sl_channels_stop_drinking", "treated wall channels turned water repellent stop drinking water", "that liquid makes the channels stop drinking water", { at: "ese liquido hace que los canalitos ya no chupen agua" }),
    C("sl_water_stops_at_band", "rising water stopped at the impermeable band inside the wall", "the water reaches it and can't pass", { at: "el agua llega hasta ahi y no puede pasar" }),
  ]},
  // ░░ 17) INJERTO 2 — el líquido barato + por qué te lo cobran caro ░░
  { a: "y aca esta la cosa", beats: [
    C("sl_liquid_cheap_at_store", "the silicone water repellent liquid sold cheap at a hardware store", "that liquid costs a fraction at the hardware store", { at: "y aca esta la cosa" }),
    C("sl_they_charge_labor_mystery", "company charging a fortune for labor and mystery on damp wall", "what they charge for is the labor and the mystery", { at: "lo que ellos cobran caro es la mano de obra y el misterio" }),
    C("sl_holes_angled_correctly", "drill holes placed correctly and angled so liquid spreads wall", "the holes placed right, angled so the liquid spreads", { at: "con los agujeros bien puestos e inclinados" }),
    C("sl_load_until_no_drink", "loading the liquid until the wall stops drinking patient work", "keep loading the liquid until the wall drinks no more", { at: "e ir cargando el liquido hasta que la pared no chupe mas" }),
    C("sl_not_rocket_science", "the same job the company does not rocket science DIY damp", "it takes patience but it's not rocket science, it's what they do", { at: "pero no es ciencia de otro mundo" }),
    C("sl_done_by_you_costs_coins", "the same treatment done by yourself costs only coins DIY", "done by you, it costs coins", { at: "hecha por vos sale monedas" }),
    C("sl_measures_matter_manual", "exact measures height spacing angle of holes in a manual damp", "the exact measures matter: height, spacing, angle, how long", { at: "que inclinacion cuanto liquido chupa cada metro de pared" }),
    C("sl_wrong_height_bridges", "drilling at wrong height leaving bridges water keeps rising fail", "wrong height or holes too far apart leaves bridges for the water", { at: "quedan puentes por donde el agua sigue subiendo" }),
    C("sl_you_know_more_than_most", "you now know more than most who pay the damp company", "you already know more than 90% who pay the company", { at: "ya sabes mas que el 90 de la gente que le paga a la empresa" }),
  ]},
  // ░░ 18) MÉTODO 4 — drenaje ░░
  { a: "el cuarto metodo", beats: [
    C("sl_method_four_drainage", "fourth method drainage grading soil away from a wall base", "the fourth method seals the job: drainage", { at: "el cuarto metodo" }),
    C("sl_move_water_from_base", "moving rainwater away from the base of a wall grading", "move the water away from the base of the wall", { at: "alejar el agua de la base de la pared" }),
    C("sl_remove_water_from_top", "taking the standing water off the wall base after rain", "if a puddle sits against the wall, you take it off", { at: "le sacas el agua de encima" }),
    C("sl_slope_ground_away", "grading the ground around a wall so rain runs away from it", "grade the ground so rainwater runs away, not toward the wall", { at: "dandole pendiente al terreno alrededor de la pared" }),
    C("sl_perimeter_walk_slope", "perimeter concrete walk with a slope draining away from a house", "a perimeter walk with the fall going outward", { at: "lejos del muro y no se quede estancada en la base" }),
    C("sl_gravel_strip_base", "a gravel strip at the foot of a wall draining rainwater fast", "a strip of gravel at the foot so the water drains fast", { at: "poniendo una franja de ripio o piedra al pie de la pared" }),
    C("sl_downspouts_away", "roof gutters and downspouts directing water away from the wall", "route the gutters and downspouts to throw the water far", { at: "encaminando bien las canaletas y las bajadas del techo" }),
    C("sl_buried_drain_pipe", "a buried french drain pipe alongside a wall carrying water away", "and if serious, a buried drain pipe alongside the wall", { at: "a veces va un cano de drenaje enterrado al costado de la pared" }),
  ]},
  // ░░ 19) COMBINÁ TODO ░░
  { a: "combina todo lo que aprendiste", beats: [
    C("sl_combine_everything", "combining cutting water, breathing lime and drainage on a wall", "combine everything: cut the water outside and the rise", { at: "combina todo lo que aprendiste" }),
    C("sl_breathe_lime_and_drain", "wall breathing with lime and drained water away from the base", "let it breathe with lime and drain the water from the base", { at: "dejas respirar la pared con cal y drenas el agua lejos de la base" }),
    C("sl_wall_stops_taking_water", "a treated wall that stops taking water and dries for good", "a wall treated this way stops taking water and dries", { at: "una pared tratada asi deja de tomar agua" }),
    C("sl_now_you_know_the_fight", "same wall same house now you know where the fight is masons", "the same wall, now you know where the fight is", { at: "la misma pared la misma casa solo que ahora sabes donde esta la pelea" }),
  ]},
  // ░░ 20) INJERTO 2 (chips + splitlist) — por qué no te lo cuentan ░░
  { a: "y dejame parar un segundo", beats: [
    G("sl_tomas_pausa", { kicker: "Nadie te lo cuenta" }),
    C("sl_none_expensive_hard", "simple cheap damp tricks none expensive nobody explains them", "none of these tricks is expensive or hard, yet nobody tells you", { at: "ninguno es dificil" }),
    X({ kind: "chips", at: "le conviene venderte pintura impermeable cada dos anos", title: "Por qué no te lo cuentan", chips: ["Al negocio no le conviene", "que tu pared se arregle una vez", "le conviene venderte pintura cada dos años"], hue: "red", imageDarken: 0.6, _bg: { name: "sl_waterproof_paint_upsell_bg", query: "shelf of waterproof sealing paint cans for sale at a hardware store", concept: "waterproof paint being sold again and again to hide damp" }, image: "real/sl_waterproof_paint_upsell_bg.png" }),
    X({ kind: "splitlist", at: "madera y metal que no se arruinan", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no se arruinan", "Plagas por centavos", "Goteras y humedad (el salitre)", "Arreglos del hogar y el auto"], palette: "A" }),
    C("sl_forty_same_criterion", "forty cheap repairs the industry hides so you keep paying manual", "forty repairs, all cheap things that work, what the industry hides", { at: "cuarenta arreglos todos con el mismo criterio" }),
  ]},
  // === INJERTO 2 — punto de inserción del video-CTA ===
  // El beat anterior termina en "...cuarenta arreglos, todos con el mismo criterio: lo barato que
  // funciona, y lo que la industria te oculta para que sigas pagando." AQUÍ, entre esa frase
  // ("cuarenta arreglos todos con el mismo criterio") y el siguiente beat ("Bien. Llegamos a lo
  // que te prometí al principio..."), se insertará después un clip aparte (video-CTA). NO editar
  // de forma rara alrededor: este comentario marca el límite EXACTO del punto de inserción.
  // ░░ 21) EL ERROR — sellar pared húmeda ░░
  { a: "bien llegamos a lo que te prometi al principio", beats: [
    C("sl_arrive_promised_error", "the one error that ruins all damp work reveal wall", "we reach what I promised: the error that ruins it all", { at: "bien llegamos a lo que te prometi al principio" }),
    C("sl_error_when_fixing", "person committing the error just when trying to fix the wall", "worst of all, people do it thinking they're fixing the wall", { at: "el que comete casi todo el mundo" }),
    C("sl_seal_wall_taking_water", "sealing a wall that is taking water with waterproof paint mistake", "the error: sealing a wall that's taking water", { at: "con la mejor intencion gastando plata" }),
    C("sl_membrane_surface_barrier", "a plastic membrane surface barrier painted onto a damp wall", "plastic, a membrane, a surface barrier", { at: "plastica una membrana una barrera en la superficie" }),
    C("sl_same_error_as_wet_wood", "same error as sealing wet wood trapping moisture inside", "it's exactly the same error as sealing wet wood", { at: "porque es exactamente el mismo error que sellar madera humeda" }),
    C("sl_stained_ugly_salitre", "damp wall stained ugly with white salitre before sealing", "you see it stained, ugly, with salitre", { at: "la ves manchada fea con salitre" }),
    X({ kind: "diagram", at: "porque le pusiste una tapa impermeable", eyebrow: "Sellar empuja el agua más arriba y revienta la pintura", slides: [{ image: dg("dg_sl_trapped_pushes", "Diagrama en corte de una pared pintada con PINTURA IMPERMEABLE. El agua sube por adentro (flecha) y como la superficie está SELLADA como una TAPA, el agua NO puede evaporar: se ACUMULA atrás de la pintura y SUBE MÁS ARRIBA buscando por dónde salir, apareciendo una MANCHA nueva medio metro más arriba. Justo debajo de la pintura la SAL cristaliza y REVIENTA la pintura en ampollas, y atrás el revoque se pudre en la oscuridad. Etiquetas 'le pusiste una tapa', 'el agua sube más arriba', 'la mancha aparece más arriba', 'por afuera prolijo, por adentro polvo'. Transmite que sellar empeora todo."), eyebrow: "El agua sube más arriba y revienta la pintura por dentro" }] }),
    C("sl_water_cant_get_out", "moisture trapped behind sealed paint unable to escape rising", "now the water that evaporated up top can't get out", { at: "pero ahora el agua que llegaba arriba y se evaporaba ya no puede salir" }),
    C("sl_water_builds_behind", "water accumulating behind sealing paint pushing on a wall", "the water builds up behind the paint, and what does it do", { at: "entonces el agua se acumula atras de la pintura" }),
    C("sl_climbs_higher_seeking", "damp climbing even higher seeking somewhere to evaporate wall", "it climbs even higher, looking for somewhere to evaporate", { at: "sube mas arriba todavia buscando por donde evaporarse" }),
    C("sl_stain_half_meter_up", "new damp stain appearing half a meter higher than before wall", "and the stain appears half a meter higher, where there was none", { at: "y te aparece la mancha medio metro mas arriba" }),
    C("sl_salt_bursts_blisters", "salt crystallizing under paint bursting it into blisters damp", "and the salt bursts the paint into blisters", { at: "y justo debajo de la pintura la sal cristaliza con toda la fuerza" }),
    C("sl_plaster_rots_dark", "plaster rotting in the dark behind the sealing paint hidden", "and behind it the plaster rots in the dark", { at: "y atras el reboque se pudre en la oscuridad" }),
    C("sl_neat_outside_powder_in", "wall neat outside falling apart to powder inside damp hidden", "neat outside for a while, inside it's falling apart", { at: "por adentro se esta deshaciendo" }),
  ]},
  // ░░ 22) LA REGLA MÁS IMPORTANTE — el orden correcto ░░
  { a: "sellar una pared humeda no la protege la condena", beats: [
    I("sl_seal_wet_condemns", "sealing a wet wall condemns it and pushes damp higher analogy", "sealing a wet wall doesn't protect it, it condemns it", { at: "sellar una pared humeda no la protege la condena" }),
    C("sl_covering_mouth_analogy", "covering the mouth of someone who needs to breathe analogy wall", "it's like covering the mouth of someone who needs to breathe", { at: "es como taparle la boca a alguien que necesita respirar" }),
    C("sl_never_seal_wall_water", "never seal a wall that is taking water the golden rule damp", "the rule, the most important of the whole video: never seal a wall taking water", { at: "nunca selles una pared que esta tomando agua" }),
    C("sl_first_cut_the_water", "first step cut the water outside and the rise at the base", "first: cut the water, outside and the rise from below", { at: "primero cortas el agua" }),
    C("sl_second_let_it_dry", "letting a wall dry slowly with patience over time damp", "second: let the wall dry, and this takes time, be patient", { at: "segundo dejas secar la pared" }),
    X({ kind: "diagram", at: "y recien tercero con la pared ya seca y con el agua cortada", eyebrow: "El orden sagrado: cortar el agua → secar → terminar con cal", slides: [{ image: dg("dg_sl_correct_order", "Diagrama de tres pasos numerados en fila para tratar bien una pared con humedad. Paso 1: CORTAR EL AGUA (la de afuera y la subida de abajo con la barrera), iconos de canilla cerrada y faja en la base. Paso 2: DEJAR SECAR la pared con paciencia (vapor saliendo, reloj/calendario, 'meses no días'). Paso 3: TERMINAR con algo que RESPIRE, a la CAL, nunca sellar (pincel con pintura a la cal, vapor atravesando). Una flecha grande marca el orden 1-2-3, y un cartel 'al revés, la arruinás'. Etiquetas 'cortar el agua', 'dejar secar', 'terminar a la cal'. Transmite el orden correcto."), eyebrow: "1. Cortar el agua · 2. Secar · 3. Terminar a la cal" }] }),
    C("sl_finish_with_lime_breathe", "finishing a dry wall with breathable lime never a sealer", "and only third, dry wall, a breathing finish, to the lime", { at: "y recien tercero con la pared ya seca y con el agua cortada" }),
    C("sl_reverse_ruins_it", "doing it in the wrong order ruins the wall damp mistake", "cut water, let dry, finish breathing. In that order", { at: "cortar el agua dejar secar terminar con algo que respira" }),
  ]},
  // ░░ 23) HONESTIDAD FINAL — paciencia + lo podrido no vuelve ░░
  { a: "esto no es magia instantanea", beats: [
    C("sl_not_instant_magic", "damp repair is not instant magic honesty patience wall", "one last honesty: this is not instant magic", { at: "esto no es magia instantanea" }),
    C("sl_soaked_wall_months", "a soaked wall full of years of damp takes months to dry", "a truly soaked wall takes months to dry, not days", { at: "porque una pared asi tarda meses en secarse" }),
    C("sl_liar_promises_tomorrow", "anyone promising a wall dry by tomorrow is lying damp", "whoever promises it dry tomorrow is lying to you", { at: "y el que te promete que manana esta seca te esta mintiendo" }),
    C("sl_rotten_plaster_no_paint", "very rotten sandy blown plaster that cannot be saved by painting", "and if the plaster is truly rotten, painting won't save it", { at: "y si el reboque de abajo ya esta muy podrido" }),
    C("sl_chip_to_sound_brick", "chipping ruined plaster back to sound brick then lime redo", "chip it back to sound brick and redo it with lime", { at: "hay que picarlo sacarlo hasta el ladrillo sano" }),
    C("sl_save_it_forever_above", "the sound wall above saved for good once water is cut", "but from there up, water cut and breathing, you save it for good", { at: "la salvas para siempre" }),
  ]},
  // ░░ 24) RECAP ░░
  { a: "no era mejor casa nada mas", beats: [
    C("sl_recap_fight_water", "montage cut water, lime breathing, barrier and drainage recap", "not a better house, they knew how to fight the water", { at: "no era mejor casa nada mas" }),
    C("sl_recap_breathe_lime", "wall breathing with lime instead of being suffocated recap", "let the wall breathe with lime instead of choking it", { at: "dejar respirar la pared con cal en vez de ahogarla" }),
    C("sl_recap_drain_away", "draining water away from a wall recap defense against damp", "and drain the water away from the wall", { at: "y brenar el agua lejos del muro" }),
    X({ kind: "checklist", at: "con esto solo", title: "El plan contra el salitre", items: [{ text: "Cortar el agua de afuera: cantero, caño, vereda", state: "done" }, { text: "Dejar respirar la pared con cal, no sellarla", state: "done" }, { text: "Cortar la subida con la barrera en la base", state: "done" }, { text: "Drenar el agua lejos del muro", state: "done" }, { text: "Nunca sellar pared húmeda: cortar → secar → cal", state: "done" }] }),
    C("sl_start_saving_wall", "starting to save a damp wall given up for lost salitre", "with this alone you can start saving that wall", { at: "ya podes empezar a salvar esa pared que dabas por perdida" }),
    C("sl_next_wall_dry_decades", "a new wall done right lasting dry for decades like the old ones", "and the next wall you build will last dry for decades", { at: "y la proxima pared que hagas" }),
  ]},
  // ░░ 25) INJERTO 3 + CIERRE ░░
  { a: "la casa entera esta llena de estos secretos que se perdieron", beats: [
    C("sl_house_full_lost_secrets", "old house full of cheap lost repair secrets damp rust pests", "the whole house is full of these lost secrets", { at: "la casa entera esta llena de estos secretos que se perdieron" }),
    C("sl_rust_eats_iron", "rust eating an old iron pipe cheap fix montage", "the rust that eats iron", { at: "el oxido que se come el hierro" }),
    C("sl_leak_old_mason_trick", "a roof leak sealed for good with an old bricklayer cheap trick", "the leak sealed for good with the old mason's trick", { at: "la gotera que se tapa para siempre con el truco del albanil viejo" }),
    C("sl_manual_gathered_forty", "home repair manual gathering forty cheap fixes with exact measures", "so I gathered the forty in the Home Repair Manual", { at: "por eso junte los 40 en el manual de reparaciones caseras" }),
    C("sl_exact_drilling_height", "exact drilling height and lime mix written in a repair manual", "with the exact measures: drilling height, spacing, the lime mix", { at: "incluida la altura justa para perforar" }),
    C("sl_no_pause_rewind", "no need to pause and rewind the video to note the amounts manual", "so you don't have to pause the video to note the amounts", { at: "para que no tengas que frenar el video" }),
    C("sl_cheaper_than_one_visit", "the manual cheaper than a single visit from a damp company value", "it costs less than a single visit from the damp company", { at: "cuesta menos que una sola visita de la empresa de seguridad" }),
    C("sl_go_out_to_the_patio", "going out to the patio to find where water enters the wall today", "even if you never grab it, go out to the patio today", { at: "pero escuchame incluso si nunca lo agarras" }),
    C("sl_give_back_the_years", "removing soil and fixing a leak giving a wall back its years", "cut the piled soil, fix the leak, give the wall back its years", { at: "cortale la tierra apoyada arregla el cano que pierde" }),
  ]},
  // ░░ 26) PRÓXIMO ░░
  { a: "en el proximo video te voy a contar algo que te va a hacer ruido", beats: [
    C("sl_next_video_cracked_cement", "old cement and plaster not cracking vs modern cracking crumbling", "next: why old cement and plaster didn't crack and yours does", { at: "en el proximo video te voy a contar algo que te va a hacer ruido" }),
    C("sl_cheap_ingredient_mix", "a cheap ingredient they used to add to the cement mix old builders", "there was one cheap ingredient they added and then dropped", { at: "es que habia un ingrediente barato que le ponian a la mezcla" }),
    C("sl_show_you_which_one", "showing which cheap ingredient to add back to the mix teaser", "I'll show you which one and how to use it again", { at: "te voy a mostrar cual es y como lo volves a usar" }),
  ]},
  { a: "la independencia no se compra se construye", full: true, beats: [] },
];

// ── motor (anclaje + placement + salida + avatar windows) ───────────────────
for (const s of SECTIONS) { if (s.start == null) s.start = atc(s.a); }
const SEC = SECTIONS.filter((s) => s.start != null).sort((a, b) => a.start - b.start);
const beats = [];
const MATCH = [], BING = [];
const seenM = new Set(), seenB = new Set();
const addM = (name, query, concept) => { if (!seenM.has(name)) { seenM.add(name); MATCH.push({ name, concept, query: Array.isArray(query) ? query : [query], dur: DLDUR }); } };
const addB = (name, query, concept) => { if (name && !seenB.has(name)) { seenB.add(name); BING.push({ name, query: Array.isArray(query) ? query[0] : query, concept: concept || query, count: 1 }); } };
for (let si = 0; si < SEC.length; si++) {
  const sec = SEC[si];
  const start = sec.start;
  const end = si + 1 < SEC.length ? SEC[si + 1].start : TOTAL;
  if (sec.full || !sec.beats.length) continue;
  const N = sec.beats.length;
  let secB = PHRASE_BOUNDS.filter((b) => b >= start + 0.05 && b <= end - 0.3);
  if (!secB.length) secB = [start];
  const placed = [];
  let lastT = start - 99;
  for (let i = 0; i < N; i++) {
    const b = sec.beats[i];
    let t = null;
    if (b.at) { const a = atc(b.at); if (a != null && a >= start && a < end) t = a; }
    if (t == null) {
      const target = start + ((i + 0.5) / N) * (end - start);
      let best = null, bd = 1e9;
      for (const bb of secB) { if (bb <= lastT + 0.4) continue; const d = Math.abs(bb - target); if (d < bd) { bd = d; best = bb; } }
      t = best != null ? best : Math.max(target, lastT + MINGAP * 0.6);
    }
    if (t <= lastT + 0.4) t = lastT + Math.max(MINGAP * 0.6, 1.0);
    lastT = t;
    placed.push({ b, t: +t.toFixed(2) });
  }
  for (let i = 0; i < placed.length; i++) {
    const { b, t } = placed[i];
    const nextT = i + 1 < placed.length ? placed[i + 1].t : end;
    const dur = +Math.min(nextT - t + OV, TOTAL - t).toFixed(2);
    const hue = b.hue || HUES[(si + i) % HUES.length];
    if (b.k === "c") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `broll/${b.name}.mp4`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); addM(b.name, b.query, b.concept); addB(b.name, b.query, b.concept); }
    else if (b.k === "i") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `real/${b.name}.png`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); addB(b.name, b.query, b.concept); }
    else if (b.k === "g") { beats.push({ id: b.name, start: t, dur, kind: "raw", src: `img/${b.name}.png`, darken: 0, hue, ...(b.kicker ? { kicker: b.kicker } : {}) }); }
    else if (b.k === "comp") {
      const { kind, at: _at, _bg, ...props } = b;
      if (_bg) addB(_bg.name, _bg.query, _bg.concept);
      const scanBg = (o) => { if (!o || typeof o !== "object") return; if (o._bg) { addB(o._bg.name, o._bg.query, o._bg.concept); delete o._bg; } for (const k of Object.keys(o)) scanBg(o[k]); };
      scanBg(props);
      const beat = { id: `cmp_${kind}_${si}_${i}`, start: t, dur: +Math.min(dur, 7.2).toFixed(2), kind, hue, ...props };
      if (kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((x) => (typeof x === "string" ? { t: x } : { t: x.t, hl: true }));
      if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
      if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l));
      beats.push(beat);
    }
  }
}
beats.sort((a, b) => a.start - b.start);

// ── OVERLAYS A MEDIDA encima del clip vivo (overlay:true → no roban slot, el clip corre detrás borroso) ──
// Diversificado a propósito: MUCHOS componentes DISTINTOS repartidos, casi nunca dos iguales
// seguidos. Se reusan los ox* + los componentes de madera (mdslider/mdname/mdgauge/mdkicker/
// mdrulestamp/mdrecap/mdendcard/mdsealtrap/mdrotinside/mdtwoplanks) re-textados a salitre.
const OVL = [
  // ── HOOK — comparador con divisor (hero) ──
  { kind: "mdslider", at: "la misma casa la misma tierra", dur: 5.2, beforeImg: "real/sl_your_damp_bedroom_wall.png", afterImg: "real/sl_old_stone_wall_road.png", beforeLabel: "Tu pared", afterLabel: "El muro viejo", beforeYears: "2 años", afterYears: "100 años", eyebrow: "La misma tierra, la misma agua abajo", accent: "amber" },
  // ── SOY TOMÁS — lower-third rústico ──
  { kind: "mdname", at: "soy tomas y esto es lo que la industria de la humedad no quiere que sepas", dur: 4.2, name: "Tomás", role: "El Constructor Libre", accent: "green" },
  // ── PRUEBA — las 2 paredes (momento viral; hero PROPIO de salitre) ──
  { kind: "sltwowalls", at: "mira estas dos paredes", dur: 6.5, title: "De la misma casa", buried: "el mismo revoque", note: "La única diferencia: sellar vs dejar secar", accent: "green" },
  // ── STAKES — la mancha sube sola (destornillador → dedo que se hunde) ──
  { kind: "oxstat", at: "la mancha llego a la altura de la cintura", dur: 4.0, value: 0, prefix: "", suffix: "", label: "cuando te querés acordar, la mancha ya llegó a la cintura", glyph: "📏", accent: "red" },
  // ── EL SECRETO / capilaridad ──
  { kind: "oxrule", at: "esa humedad viene de abajo", dur: 4.6, text: "La humedad no viene de arriba. *Viene de abajo, del suelo, y sube por la pared*.", accent: "amber" },
  // hero PROPIO de salitre: el agua trepa por los canalitos (capilaridad viva)
  { kind: "slcapillary", at: "el agua del suelo se mete en esos canalitos y sube sola", dur: 6.0, title: "El agua del suelo sube sola", accent: "blue" },
  { kind: "mdgauge", at: "eso se llama capilaridad", dur: 4.6, value: 100, danger: 20, label: "La pared chupa agua del piso todo el día", accent: "blue" },
  // ── EL SALITRE — hero PROPIO (la sal revienta la pintura) + regla ──
  { kind: "slsalt", at: "la que descascara todo", dur: 5.6, title: "El agua se va, la sal queda", accent: "red" },
  { kind: "oxrule", at: "el salitre", dur: 4.4, text: "El polvillo blanco es *salitre*: sal que cristaliza y revienta la pintura.", accent: "red" },
  { kind: "oxstat", at: "la pared esta tomando agua de abajo", dur: 4.0, value: 1, suffix: "", label: "no son tres problemas: es uno solo, la pared toma agua de abajo", glyph: "💧", accent: "red" },
  // ── DOS HECHOS — panel ──
  { kind: "oxside", at: "porque la piedra tiene los poros mas cerrados", dur: 5.2, image: "real/sl_stone_closed_pores_lime.png", title: "Por qué el muro viejo aguanta", lines: ["Piedra: poros cerrados, chupa poco", "Muros anchos y a la cal, que respiran", "Tu pared: ladrillo + cemento + plástico"], side: "right", accent: "amber" },
  { kind: "mdlife", at: "por que la pared de material nuevo prolija se pudre en dos anos", dur: 5.0, title: "Cuánto aguanta, según cómo la trates", low: { label: "Nueva, sellada", years: "2 años", value: 5 }, high: { label: "Vieja, a la cal", years: "100 años", value: 100 }, accent: "amber" },
  // ── REGLA #1 — sello de tinta (×3) ──
  { kind: "mdrulestamp", at: "la pared seca no se arruina", dur: 5.0, text: "LA PARED SECA NO SE ARRUINA", num: "1", label: "Regla", accent: "amber" },
  // ── MÉTODO 1 — kicker + ficha ──
  { kind: "mdkicker", at: "cortar el agua en el origen antes de tocar", dur: 3.4, num: "1", kicker: "Método", title: "Cortar el agua en el origen", glyph: "🚿", accent: "amber" },
  { kind: "oxmethod", at: "saca esa tierra alejala de la pared", dur: 4.6, num: "01", title: "Cortar el agua de afuera", chips: ["Sacá la tierra apoyada al muro", "Arreglá el caño que pierde", "Corregí la pendiente de la vereda"], cost: "plata cero", accent: "amber" },
  // ── MÉTODO 2 — kicker + tag ──
  { kind: "mdkicker", at: "el segundo metodo", dur: 3.2, num: "2", kicker: "Método", title: "Dejar respirar: la cal", glyph: "🧱", accent: "blue" },
  { kind: "oxtag", at: "la cal es el material de los viejos justamente por esto", dur: 4.2, name: "El revoque y la pintura a la cal", what: "Permeables: dejan salir el vapor en vez de encerrarlo", side: "left", accent: "blue" },
  // hero PROPIO de salitre: cal que respira vs plástica que sella (comparación)
  { kind: "sllime", at: "una pared revocada y pintada a la cal larga el agua y no se ampolla", dur: 5.6, title: "Sellar ahoga · la cal respira", accent: "blue" },
  { kind: "oxrule", at: "es lo opuesto exacto a sellar", dur: 4.4, text: "La cal es *lo opuesto a sellar*: en vez de tapar la olla, le sacás la tapa.", accent: "blue" },
  // ── INJERTO 1 — manual (mid) ──
  { kind: "manualcard", at: "las tengo anotadas", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "La mezcla justa de la cal y los 40 arreglos de la casa, con las medidas exactas.", accent: "amber" },
  // ── MÉTODO 3 — kicker + barrera (hero PROPIO de salitre: perforar + inyectar) ──
  { kind: "mdkicker", at: "este es el truco del albanil viejo", dur: 3.4, num: "3", kicker: "Método", title: "Cortar la capilaridad", glyph: "🧪", accent: "red" },
  { kind: "slbarrier", at: "eso es cortar la capilaridad", dur: 6.0, title: "La barrera del albañil", accent: "red" },
  { kind: "oxmethod", at: "un agujero cada pocos centimetros", dur: 4.8, num: "03", title: "La barrera anti-capilar", chips: ["Perforar en fila arriba del zócalo", "Inyectar hidrofugante de siliconas", "Cargar hasta que no chupe más"], cost: "el líquido sale monedas", accent: "red" },
  // ── INJERTO 2 — el líquido barato ──
  { kind: "oxstat", at: "hecha por vos sale monedas", dur: 4.2, value: 90, suffix: "%", label: "ya sabés más que el 90% que le paga la fortuna a la empresa", glyph: "💸", accent: "green" },
  // ── MÉTODO 4 — kicker + drenaje ──
  { kind: "mdkicker", at: "el cuarto metodo", dur: 3.4, num: "4", kicker: "Método", title: "El drenaje", glyph: "⛏", accent: "amber" },
  { kind: "oxmethod", at: "poniendo una franja de ripio o piedra al pie de la pared", dur: 4.6, num: "04", title: "Alejar el agua de la base", chips: ["Pendiente del terreno hacia afuera", "Franja de ripio al pie del muro", "Canaletas que tiren el agua lejos"], cost: "sella el trabajo", accent: "amber" },
  // ── EL ERROR — clímax ──
  { kind: "oxrule", at: "con la mejor intencion gastando plata", dur: 4.8, text: "El error: *sellar una pared que está tomando agua*. Le ponés una tapa y la reventás.", accent: "red" },
  { kind: "slseal", at: "por adentro se esta deshaciendo", dur: 6.2, title: "Sellaste la pared húmeda", accent: "red" },
  // ── LA REGLA — sello de tinta (2da del set) ──
  { kind: "mdrulestamp", at: "nunca selles una pared que esta tomando agua", dur: 5.0, text: "NUNCA SELLES UNA PARED HÚMEDA", num: "2", label: "Regla", accent: "red" },
  // ── CIERRE conceptual — sello de tinta (3ra del set) ──
  { kind: "mdrulestamp", at: "no era mejor casa nada mas", dur: 4.8, text: "NO ERA MEJOR CASA. LE PELEABAN AL AGUA.", num: "★", label: "La lección", accent: "green" },
  // ── RECAP de los 4 métodos como fichas ──
  { kind: "mdrecap", at: "dejar respirar la pared con cal en vez de ahogarla", dur: 5.4, title: "Los 4 métodos, en una", methods: [{ num: "1", name: "Cortar el agua de afuera", use: "cantero, caño, vereda", glyph: "🚿" }, { num: "2", name: "Dejar respirar: la cal", use: "revoque y pintura permeables", glyph: "🧱" }, { num: "3", name: "Barrera anti-capilar", use: "el truco del albañil, por monedas", glyph: "🧪" }, { num: "4", name: "Drenaje", use: "alejar el agua del muro", glyph: "⛏" }], accent: "amber" },
  // ── CIERRE — manual ──
  { kind: "manualcard", at: "por eso junte los 40 en el manual de reparaciones caseras", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Los 40 arreglos, con la altura justa para perforar y la mezcla precisa de la cal.", chip: "Accedé en la descripción", accent: "amber" },
  // ── CIERRE PREMIUM — endcard combinado ──
  { kind: "mdendcard", at: "en el proximo video te voy a contar algo que te va a hacer ruido", dur: 7.0, manualImg: "real/manual_cover.png", nextImg: "real/sl_next_video_cracked_cement.png", manualTitle: "Manual de Reparaciones Caseras", nextKicker: "En el próximo video", nextTitle: "Por qué el revoque de antes no se caía", motto: "La independencia no se compra, se construye.", cta: "Accedé en la descripción", accent: "green" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── TRANSICIONES DE MARCA entre capítulos (overlay corto, ~0.42s). SOLO en 6 saltos de sección.
const TRANS = [
  { at: "ahora si la verdad simple", variant: "ink", accent: "amber" },                 // → EL SECRETO
  { at: "cortar el agua en el origen antes de tocar", variant: "grain", accent: "amber" }, // → MÉTODOS
  { at: "este es el truco del albanil viejo", variant: "grain", accent: "red" },         // → barrera
  { at: "el cuarto metodo", variant: "paper", accent: "amber" },                         // → drenaje
  { at: "bien llegamos a lo que te prometi al principio", variant: "ink", accent: "red" }, // → EL ERROR
  { at: "la casa entera esta llena de estos secretos que se perdieron", variant: "paper", accent: "green" }, // → cierre
];
let nTr = 0;
for (const tr of TRANS) { const s = atc(tr.at); if (s == null) continue; const st = +Math.max(0, s - 0.12).toFixed(2); beats.push({ id: `tr_${tr.variant}_${Math.round(s)}`, start: st, dur: 0.42, kind: "mdtrans", overlay: true, hue: "amber", variant: tr.variant, accent: tr.accent }); nTr++; }
beats.sort((a, b) => a.start - b.start);

// ── MAXIMUM DENSITY: imágenes ancladas en CADA mini-frase del shotlist aún sin cubrir ──
// [name, query EN visual, concept resuelto al contexto, frase ancla exacta de captions]
const FILL = [
  // ── COLD OPEN ──
  ["sl_fill_look_closely", "close up hand on a dry old adobe wall vs a damp crumbling one", "look closely at these two walls", "mira bien esto"],
  ["sl_fill_since_grandpa", "old stone wall standing since before the grandfather was born sound", "planted in the ground since before your grandpa, sound", "un muro de piedra al costado del camino"],
  ["sl_fill_wall_crying_backwards", "damp stain rising up a wall as if it cried backwards from below", "a stain rising as if the wall cried backwards", "cae un polvillo blanco al piso"],
  ["sl_fill_why_seco_dos_anos", "one wall dry for a century another rotting in two years compare", "why one is dry a century and yours rots in two years", "la misma casa la misma tierra"],
  ["sl_fill_musty_closed_closet", "musty damp smell in a closed room closet damp interior", "the musty closed-closet smell filling the room", "que tiene una mancha oscura subiendo desde el zocalo"],
  ["sl_fill_medianera_palier", "damp on a party wall and entrance hallway of a house interior", "the party wall, the entrance hall, any of them", "puede ser el dormitorio"],
  ["sl_fill_right_place", "reassuring old bricklayer teaching how to fight damp know-how", "you're in the right place, it's not bad luck", "y quiero que sepas"],
  ["sl_fill_cheap_by_coins", "cheap materials to cut damp for coins without breaking the wall", "they cut it with cheap things, for coins", "los albaniles de antes sabian algo que a vos nadie te explico"],
  ["sl_fill_no_repaint_every_two", "tired of repainting the same wall every two years blistering", "without repainting the same wall every two years", "sin llamar a la empresa de humedad"],
  // ── PRUEBA ──
  ["sl_fill_prove_in_front", "man about to prove damp fix with two wall panels demo", "I'll prove it right now, in front of you", "internet esta lleno de gente que te vende pintura milagrosa"],
  ["sl_fill_both_had_rising", "two wall panels both with damp rising from below before", "both had damp rising from below", "son de la misma casa del mismo revoque"],
  ["sl_fill_seals_and_protects", "waterproof paint can labeled seals and protects loaded coat", "the one that says seals and protects, loaded on", "y abajo el revoque esta mas podrido que antes"],
  ["sl_fill_cut_water_below_first", "cutting the water at the base of a wall first before finishing", "first I cut the water from below", "esta otra la de al lado la trate como corresponde"],
  ["sl_fill_dried_secured", "wall dried out firm after being left to breathe healthy", "it dried, firm, no blisters, no powder", "la deje respirar"],
  ["sl_fill_that_decision_is_all", "the single decision to dry not seal a wall makes all difference", "that single decision is everything", "la unica diferencia es que a una la selle y a la otra la deje secar"],
  // ── LAS 4 COSAS ──
  ["sl_fill_that_is_the_end", "the ending of the story cut water dry finish breathing", "and that is just the end of the story", "antes de llegar ahi te voy a mostrar las cuatro cosas que hay que hacer"],
  ["sl_fill_the_barrier_wick", "the barrier at the base that cuts the wick of a wall damp", "the barrier that cuts the wick", "cortar la subida del agua en la base de la pared"],
  ["sl_fill_error_pushes_higher", "the one error that pushes damp higher and rots wall behind", "the error that makes damp climb higher, rotting behind", "quedate hasta el final"],
  // ── STAKES ──
  ["sl_fill_repainted_stained_again", "a wall repainted then stained and flaking again next year damp", "the wall you painted and it stained again next year", "pensa un segundo en lo que esa humedad ya te costo"],
  ["sl_fill_smell_in_clothes", "musty damp smell getting into clothes in a closet health", "the smell that gets into the clothes in the closet", "del dormitorio que no podes usar bien"],
  ["sl_fill_expensive_paint_scales", "expensive paint flaking off in scales onto the floor months later", "the expensive paint you bought, in scales on the floor", "del zocalo que se desarma solo"],
  ["sl_fill_kids_breathe_mold", "family especially kids breathing mold from a damp wall home", "the whole family breathes it, especially kids", "de la salud"],
  ["sl_fill_you_see_too_late", "damp already advanced far up a wall seen only when too late", "you usually see it when it advanced a lot", "y aca esta lo que hace a esta humedad tan traicionera"],
  ["sl_fill_finger_per_month", "damp rising a finger a month slowly up an interior wall", "it rises a finger a month, two fingers", "empieza con una manchita arriba del zocalo"],
  ["sl_fill_pay_plaster_labor_again", "paying for plaster paint and labor all over again on a wall", "you pay for plaster, paint and labor all over again", "hay que picarla y rehacerla"],
  // ── SECRETO / capilaridad ──
  ["sl_fill_so_simple_maddening", "damp company hiding a simple fix so it stays maddening secret", "so simple it makes you angry they don't explain it", "ahora si la verdad simple"],
  ["sl_fill_not_a_roof_leak", "checking it is not a roof leak or a broken pipe in the wall", "not the rain, not a roof leak, not a broken pipe", "esa humedad no viene de arriba"],
  ["sl_fill_soil_always_damp", "the soil under a house always holding some water damp ground", "the soil under your house always holds some water", "estan llenos de porcitos de canalitos finitos"],
  ["sl_fill_napkin_in_puddle", "a paper napkin tip in a puddle water climbing up capillary", "like a napkin tip in a puddle, water climbs the whole thing", "igual que sube el aceite por la mecha de un farol"],
  // ── SALITRE ──
  ["sl_fill_touches_room_air", "damp reaching the part of a wall touching room air evaporating", "it rises until it touches the room air and evaporates", "ahi el agua se va en forma de vapor"],
  ["sl_fill_minerals_from_soil", "groundwater loaded with dissolved minerals from the soil", "loaded with minerals it picks up from the ground", "viene cargada de sales"],
  ["sl_fill_salt_accumulates_face", "salt accumulating on the face of a wall behind the paint", "they accumulate on the face of the wall, behind the paint", "crecen hacen fuerza empujan"],
  ["sl_fill_not_dirty_it_is_salt", "wall not dirty but pushed apart by crystallizing salt wedges", "it's not that the wall is dirty, it's the salt", "la que descascara todo"],
  ["sl_fill_one_single_problem", "stain plaster powder all one single damp problem diagram wall", "they are not three problems, they are one", "es agua del suelo subiendo por la pared"],
  ["sl_fill_falls_into_place", "once you get it everything about damp falls into place wall", "once you get that, everything falls into place", "todo lo demas cae de maduro"],
  // ── DOS HECHOS ──
  ["sl_fill_same_wet_ground", "a stone wall in the same wet ground with no damp problem", "in the same wet ground, no problem", "porque la piedra tiene los poros mas cerrados"],
  ["sl_fill_and_the_reverse", "the reverse a new tidy wall rotting fast from damp compare", "and the reverse, the tidy new wall", "y al reves"],
  ["sl_fill_same_soil_water", "same soil same water below difference is how much wall drinks", "the same soil, the same water, the difference is the wall", "la diferencia es cuanto chupa la pared"],
  // ── POR QUÉ ANTES ──
  ["sl_fill_two_reasons", "two reasons old houses stayed dry base barrier and lime", "for two reasons, the first a base barrier", "por dos razones"],
  ["sl_fill_barrier_missing", "new houses missing or badly done base damp proof barrier", "many new houses have it wrong, shifted, or missing", "esa capa si no esta"],
  ["sl_fill_second_you_can_fix", "the second reason you can fix letting the wall breathe cut water", "but the second reason you can fix, and it matters", "pero la segunda razon si la podes arreglar"],
  ["sl_fill_no_soil_against_wall", "old builders never piling garden soil against a house wall", "they didn't pile garden soil against the wall", "hacia la vereda con pendiente"],
  // ── REGLA #1 ──
  ["sl_fill_your_only_job", "cut water below and let a wall breathe above the only job", "your only job: cut the water below, breathe above", "vamos una por una"],
  // ── MÉTODO 1 ──
  ["sl_fill_simplest_skipped", "the simplest step most people skip cutting water at source free", "the simplest and most-skipped, and often free", "porque acaba algo que casi nadie mira"],
  ["sl_fill_extra_water_source", "an extra water source feeding a wall without you noticing garden", "an extra water source you're feeding it without noticing", "no hay vereda y la lluvia pega directo en la base"],
  ["sl_fill_downspout_at_base", "a roof downspout dumping water right at the base of a wall", "the downspout dumping water right at the wall's foot", "mira todo eso primero"],
  // ── MÉTODO 2 ──
  ["sl_fill_remember_evaporate", "remember water rises and needs to evaporate up top wall", "remember: the water rises and needs to evaporate up top", "sacarle lo que la esta ahogando"],
  ["sl_fill_surface_cant_stop", "the surface paint cannot stop water rising inside the wall", "the surface paint can't stop the water rising inside", "el agua igual sube"],
  ["sl_fill_trapped_pushes_up", "moisture trapped behind paint pushing higher and bursting wall", "trapped, it pushes higher and the salt bursts it", "al reves de lo que te dijeron sacas toda esa pintura plastica"],
  ["sl_fill_back_to_sound_brick", "chipping soft blown plaster back to the sound brick underneath", "if it's rotten, chip it back to sound brick", "si el reboque de abajo ya esta podrido"],
  ["sl_fill_vapor_crosses_out", "vapor crossing a lime wall and leaving into the air breathing", "the vapor crosses it and leaves into the air", "una pared revocada y pintada a la cal larga el agua y no se ampolla"],
  ["sl_fill_changes_many_walls", "cutting outside water plus lime already changes many walls damp", "with cutting the outside water, it changes many walls", "es lo opuesto exacto a sellar"],
  // ── INJERTO 1 ──
  ["sl_fill_mixed_by_eye_failed", "mixing lime by eye and it crumbled off the wall a week later", "I mixed by eye once and it fell off in a week", "las proporciones exactas de la mezcla"],
  // ── LÍMITE respirar ──
  ["sl_fill_source_strong_below", "a strong water source still rising from below a wall base", "if the source below is strong, breathing isn't enough", "pero si el agua sigue subiendo fuerte desde el suelo"],
  ["sl_fill_game_changer_method", "the method that truly changes the game cutting the rise barrier", "that's the method that really changes the game", "respirar es necesario"],
  // ── MÉTODO 3 barrera ──
  ["sl_fill_cut_the_wick", "cutting the wall's capillary wick at the base barrier damp", "and if you cut the wall's wick?", "acordate el agua sube por los canalitos de la pared"],
  ["sl_fill_water_stays_below", "water below stays below and the wall above dries alone barrier", "the water below stays below, above it dries alone", "empieza a secarse sola"],
  ["sl_fill_root_not_symptom", "the root solution attacking the cause not the symptom damp", "it's the root solution, the cause not the symptom", "eso es cortar la capilaridad"],
  ["sl_fill_liquid_spreads_pores", "the injected liquid spreading through the wall pores sealing", "the liquid spreads through the pores and seals them inside", "a base de siliconas"],
  ["sl_fill_impermeable_band", "an impermeable band inside a wall at floor height stopping water", "like an impermeable band inside, at floor height", "el agua llega hasta ahi y no puede pasar"],
  // ── INJERTO 2 ──
  ["sl_fill_fraction_of_price", "the same repellent liquid sold for a fraction at hardware store", "for a fraction of what the company charges", "lo que ellos cobran caro es la mano de obra y el misterio"],
  ["sl_fill_patient_but_simple", "patient but simple work drilling and loading the liquid DIY", "it takes patience but it's the same they do", "e ir cargando el liquido hasta que la pared no chupe mas"],
  ["sl_fill_height_spacing_matters", "the exact height and spacing of the holes matters damp barrier", "the height, spacing and angle of the holes matter", "cuanto hay que esperar"],
  // ── MÉTODO 4 drenaje ──
  ["sl_fill_puddle_against_wall", "a rain puddle sitting against the base of a house wall", "a puddle against the wall gives the system extra fight", "le sacas el agua de encima"],
  ["sl_fill_gutters_water_far", "gutters and downspouts throwing rainwater far from the wall", "route the gutters to throw the water far, not at the foot", "encaminando bien las canaletas y las bajadas del techo"],
  // ── COMBINÁ ──
  ["sl_fill_starts_drying_real", "a treated wall starting to dry for real not ruining again", "it starts to dry for real and doesn't ruin again", "dejas respirar la pared con cal y drenas el agua lejos de la base"],
  // ── INJERTO 2 chips ──
  ["sl_fill_arrange_once_done", "the business preferring you never fix the wall just once damp", "the business doesn't want your wall fixed once and done", "ninguno es dificil"],
  ["sl_fill_industry_hides", "the industry hiding cheap fixes so you keep paying for walls", "what the industry hides so you keep paying", "lo que la industria te oculta para que sigas pagando"],
  // ── EL ERROR ──
  ["sl_fill_buy_the_paint", "buying waterproof paint at the store to seal a damp wall mistake", "you buy the waterproof paint and give it two coats", "la ves manchada fea con salitre"],
  ["sl_fill_you_put_a_lid", "sealing a damp wall like putting a lid trapping the water inside", "you put an impermeable lid on it", "pero ahora el agua que llegaba arriba y se evaporaba ya no puede salir"],
  ["sl_fill_neat_for_a_while", "wall looking neat for a while but rotting behind the paint", "neat for a little while, rotting behind", "y atras el reboque se pudre en la oscuridad"],
  // ── REGLA final ──
  ["sl_fill_air_out_with_force", "the trapped air escaping elsewhere with more force analogy wall", "the air comes out elsewhere, with more force", "es como taparle la boca a alguien que necesita respirar"],
  ["sl_fill_order_is_sacred", "the sacred order cut water dry then finish breathing wall", "the order is sacred and it's the reverse of what everyone does", "primero cortas el agua"],
  ["sl_fill_reverse_ruins_wall", "doing it in reverse ruins the wall no matter the paint", "in reverse, you ruin it", "cortar el agua dejar secar terminar con algo que respira"],
  // ── HONESTIDAD ──
  ["sl_fill_water_out_slowly", "a soaked wall letting its water out slowly over weeks drying", "the water has to come out slowly, better over weeks", "esa agua tiene que salir de a poco"],
  ["sl_fill_rotten_is_rotten", "cutting away truly rotten plaster keeping the sound wall above", "what's rotten is rotten, cut it and redo with lime", "hay que picarlo sacarlo hasta el ladrillo sano"],
  // ── RECAP ──
  ["sl_fill_cut_at_the_origin", "cutting the water at the origin outside a wall recap", "cut the water at the origin, outside", "no era mejor casa nada mas"],
  ["sl_fill_stop_the_salitre", "stopping the salitre eating a wall's plaster for good recap", "and stop the salitre eating the plaster", "ya podes empezar a salvar esa pared que dabas por perdida"],
  // ── CIERRE ──
  ["sl_fill_wood_two_peso_liquid", "old wood blinded with a two peso homemade liquid cheap fix", "the wood that's armored with a two-peso liquid", "el oxido que se come el hierro"],
  ["sl_fill_all_in_one_place", "forty cheap home repairs gathered ordered in one manual value", "gathered in one place, ordered for the day you need it", "para que no tengas que frenar el video"],
  ["sl_fill_house_and_pocket", "a restored dry wall your house and your pocket thank you", "your house will thank you, and your pocket too", "cortale la tierra apoyada arregla el cano que pierde"],
  ["sl_fill_dont_miss_it", "cracked crumbling modern cement vs sound old cement teaser next", "if this helped, don't miss the next one", "es que habia un ingrediente barato que le ponian a la mezcla"],
];
for (const [name, query, concept, ph] of FILL) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 3, kind: "raw", src: `real/${name}.png`, darken: 0, hue: HUES[Math.round(s) % 3] }); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── BURSTS extra (oxstack) para flashes sub-1s en momentos de lista ──
const BURSTS = [
  { at: "antes de llegar ahi te voy a mostrar las cuatro cosas que hay que hacer", images: ["real/sl_cut_water_at_source.png", "real/sl_let_wall_breathe.png", "real/sl_cut_rising_at_base.png"], captions: ["Cortar el agua", "Dejar respirar", "Cortar la subida"], accent: "amber" },
  { at: "la mancha que sube el revoque que se desarma y el polvillo blanco", images: ["real/sl_dark_stain_baseboard_rising.png", "real/sl_plaster_crumbles_baseboard.png", "real/sl_white_powder_floor_stain.png"], captions: ["La mancha que sube", "El revoque que se desarma", "El polvillo blanco"], accent: "red" },
  { at: "esa tierra es una esponja pegada al muro", images: ["real/sl_garden_bed_sponge.png", "real/sl_leaking_pipe_wall_base.png", "real/sl_sidewalk_slopes_to_wall.png"], captions: ["Cantero apoyado", "Caño que pierde", "Vereda al revés"], accent: "amber" },
  { at: "cortar el agua dejar secar terminar con algo que respira", images: ["real/sl_cut_water_at_source.png", "real/sl_wall_left_to_breathe.png", "real/sl_lime_plaster_breathable.png"], captions: ["Cortar el agua", "Dejar secar", "Terminar a la cal"], accent: "blue" },
];
for (const b of BURSTS) { const s = atc(b.at); if (s == null) continue; beats.push({ id: `burst_${Math.round(s)}`, start: +s.toFixed(2), dur: 4.2, kind: "oxstack", overlay: true, hue: "amber", images: b.images, captions: b.captions, accent: b.accent }); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados (gate de variedad: ≥6 tipos, ≥6% peso, bars≥2) ──
const STRUCT = [
  { kind: "bars", at: "y si no cortaste el agua vuelve", hue: "red", title: "Lo que te cuesta la humedad", bars: [{ label: "Picar, revocar, pintar y mano de obra otra vez", value: 100, display: "$$$", tone: "danger" }, { label: "Cortarle el agua vos mismo", value: 4, display: "monedas", winner: true }] },
  { kind: "bars", at: "por que un muro de piedra de 200 anos", hue: "amber", title: "Antes vs hoy: cuánto aguanta seca", bars: [{ label: "Muro viejo, a la cal", value: 100, display: "100+ años", winner: true }, { label: "Tu pared, sellada", value: 5, display: "2 años", tone: "danger" }] },
  { kind: "bars", at: "hecha por vos sale monedas", hue: "red", title: "La barrera: empresa vs vos", bars: [{ label: "Lo que cobra la empresa", value: 100, display: "una fortuna", tone: "danger" }, { label: "El mismo líquido, hecho por vos", value: 6, display: "monedas", winner: true }] },
  { kind: "process", at: "de la mas simple a la mas poderosa", hue: "amber", title: "Los 4 métodos, de más simple a más poderoso", eyebrow: "Cada uno ataca una parte del problema", steps: [{ title: "Cortar el agua de afuera", desc: "cantero apoyado, caño que pierde, pendiente de la vereda" }, { title: "Dejar respirar: la cal", desc: "sacar la pintura plástica, revoque y pintura permeables" }, { title: "Barrera anti-capilar", desc: "perforar e inyectar hidrofugante: el truco del albañil" }, { title: "Drenaje", desc: "alejar el agua de la base para que no vuelva" }] },
  { kind: "process", at: "y recien tercero con la pared ya seca y con el agua cortada", hue: "blue", title: "El orden sagrado (casi nadie lo respeta)", eyebrow: "Al revés, la arruinás", steps: [{ title: "Cortar el agua", desc: "la de afuera y la subida de abajo con la barrera" }, { title: "Dejar secar", desc: "con paciencia: una pared empapada tarda meses, no días" }, { title: "Terminar a la cal", desc: "un terminado que respire, nunca uno que selle" }] },
  { kind: "aged", at: "la pared esta tomando agua de abajo", hue: "blue", heading: "EL ENEMIGO", eyebrow: "No son tres problemas, es uno solo", lines: ["La mancha que sube, el revoque que se desarma", "y el polvillo blanco: la misma causa", { text: "La pared está tomando agua de abajo", mark: true }] },
  { kind: "aged", at: "con la mejor intencion gastando plata", hue: "red", heading: "EL ERROR FATAL", eyebrow: "Justo cuando creés que la cuidás", lines: ["Sellás una pared que todavía toma agua", "El agua sube más arriba buscando salir", { text: "La sal revienta la pintura y el revoque se pudre atrás", mark: true }] },
  // foto CON PARTES señaladas (AnnotatedImage) — la mancha que sube
  { kind: "annotated", at: "que tiene una mancha oscura subiendo desde el zocalo", hue: "red", image: "real/sl_dark_stain_baseboard_rising.png", eyebrow: "La pared que ya te está avisando", caption: "La mancha empieza arriba del zócalo y sube sola", annotations: [{ kind: "circle", x: 0.42, y: 0.74, w: 0.20, label: "empieza acá y trepa", color: "danger" }] },
  { kind: "callout", at: "eso se llama capilaridad", figure: "Capilaridad", caption: "El agua del suelo sube sola por los canalitos de la pared, como por una mecha.", accent: "danger", image: "real/sl_oil_lamp_wick.png" },
  { kind: "callout", at: "el salitre", figure: "El salitre", caption: "El agua se evapora y la sal queda: cristaliza y revienta la pintura como mil cuñitas.", accent: "danger", image: "real/sl_efflorescence_white_salt.png" },
  // dato duro de la barrera (StatBig) — el 90%
  { kind: "stat", at: "el 90 de la gente lo comete", value: 90, suffix: "%", eyebrow: "El error de sellar la pared húmeda", label: "de la gente lo comete justo cuando cree que la arregla", accent: "danger", hue: "red" },
  { kind: "callout", at: "cuesta menos que una sola visita de la empresa de seguridad", figure: "< 1 visita", caption: "El manual cuesta menos que una sola visita de la empresa de humedad.", accent: "good", image: "real/manual_cover.png" },
  // el error como REGLA numerada (RuleNumberScene)
  { kind: "rule", at: "sellar una pared humeda no la protege la condena", number: "!", title: "Sellar la pared húmeda", label: "no la protege: la condena y la empuja más arriba", hue: "red" },
  // recuperar lo sano = tarjeta-número honesta (NumberCard)
  { kind: "numcard", at: "la salvas para siempre", number: "✓", name: "De ahí para arriba, la salvás", eyebrow: "Lo podrido, picalo", total: "1", bg: "real/sl_save_it_forever_above.png", accent: "good" },
  { kind: "checklist", at: "y la proxima pared que hagas", hue: "blue", title: "El plan contra el salitre", items: [{ text: "Cortar el agua de afuera: cantero, caño, vereda", state: "done" }, { text: "Dejar respirar la pared con cal, no sellarla", state: "done" }, { text: "Cortar la subida con la barrera en la base", state: "done" }, { text: "Drenar el agua lejos del muro", state: "done" }, { text: "Nunca sellar pared húmeda: cortar → secar → cal", state: "done" }] },
  { kind: "callout", at: "a base de siliconas", figure: "Hidrofugante", caption: "El líquido de siliconas se mete en los poros y los vuelve repelentes: corta la mecha.", accent: "danger", image: "real/sl_inject_silicone_liquid.png" },
  { kind: "splitlist", at: "combina todo lo que aprendiste", title: "La pared blindada: las 4 defensas juntas", items: ["Cortar el agua de afuera", "Barrera anti-capilar en la base", "Revoque y pintura a la cal (respira)", "Drenaje que aleja el agua"], palette: "D" },
  { kind: "cross", at: "si en la base de la pared vos creas una barrera que el agua no puede cruzar", hue: "cold", title: "Dónde corta la barrera anti-capilar", eyebrow: "De arriba hacia abajo", layers: [{ label: "Pared de arriba", depth: "se seca sola", color: "#c9b28a" }, { label: "La faja inyectada", depth: "el agua no pasa", color: "#4f7fc9" }, { label: "Base con agua", depth: "el agua se queda abajo", color: "#7a6a52" }] },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); beats.push(beat); }
beats.sort((a, b) => a.start - b.start);

// ── LAYERED REVEALS — momentos "hero" de REVELADO POR CAPAS con zoom (LayeredReveal) ──
// Patrón canónico (receta del bórax en madera): imagen PRINCIPAL con ken-burns → cada sub
// entra anclada a SU palabra exacta. Full-screen, opaco, avatar OCULTO (ver HIDE abajo).
const LR_MAX = 16;
const LAYERED_WINDOWS = [];
const LAYERS = [
  // 1) LAS DOS PAREDES — sellada vs dejada secar (diagrama de esa sección ya cerró → libre)
  {
    at: "esta otra la de al lado la trate como corresponde", accent: "green", tail: 2.4,
    eyebrow: "Las dos paredes: sellar vs dejar secar",
    main: { image: "real/sl_two_walls_demo.png", caption: "De la misma casa, el mismo revoque" },
    subs: [
      { at: "la deje respirar", image: "real/sl_wall_left_to_breathe.png", caption: "Le corté el agua y la dejé respirar" },
      { at: "esta firme sin ampollas sin polvillo", image: "real/sl_wall_dry_firm_clean.png", caption: "Secó: firme, sin ampollas" },
    ],
  },
  // 2) LOS 4 MÉTODOS — cortar → respirar → barrera → drenaje (anclado en la promesa)
  {
    at: "de la mas simple a la mas poderosa", accent: "amber", tail: 2.4,
    eyebrow: "Las 4 cosas, de más simple a más poderosa",
    main: { image: "real/sl_four_things_to_do.png", caption: "Cuatro cosas que hay que hacer" },
    subs: [
      { at: "dejar que la pared respire de verdad", image: "real/sl_let_wall_breathe.png", caption: "Dejar respirar la pared" },
      { at: "cortar la subida del agua en la base de la pared", image: "real/sl_cut_rising_at_base.png", caption: "Cortar la subida en la base" },
      { at: "alejar el agua del terreno para que no vuelva nunca", image: "real/sl_drain_water_away.png", caption: "Alejar el agua del terreno" },
    ],
  },
  // 3) LA BARRERA ANTI-CAPILAR — perforar → inyectar → cargar (diagrama de esa sección ya cerró → libre)
  {
    at: "un agujero cada pocos centimetros", accent: "red", tail: 2.4,
    eyebrow: "La barrera del albañil: cómo se hace",
    main: { image: "real/sl_drill_holes_row.png", caption: "Perforar en fila, arriba del zócalo" },
    subs: [
      { at: "a base de siliconas", image: "real/sl_inject_silicone_liquid.png", caption: "Inyectar hidrofugante de siliconas" },
      { at: "ese liquido hace que los canalitos ya no chupen agua", image: "real/sl_channels_stop_drinking.png", caption: "Los canalitos ya no chupan agua" },
    ],
  },
];
for (const L of LAYERS) {
  const t0 = atc(L.at);
  if (t0 == null) continue;
  const t = t0;
  const subs = [];
  for (const s of L.subs) {
    const sa = atc(s.at);
    if (sa == null) continue;
    const off = +(sa - t).toFixed(2);
    if (off < -0.05 || off > LR_MAX - 1.2) continue;
    subs.push({ image: s.image, caption: s.caption, atFrame: Math.max(0, Math.round(off * 30)) });
  }
  subs.sort((a, b) => a.atFrame - b.atFrame);
  const lastSub = subs.length ? Math.max(...subs.map((x) => x.atFrame)) / 30 : 0.5;
  const dur = +Math.min(lastSub + (L.tail || 2.0), LR_MAX).toFixed(2);
  beats.push({ id: `layered_${Math.round(t)}`, start: +t.toFixed(2), dur, kind: "layered", hue: L.accent || "amber", main: L.main, subs, accent: L.accent || "amber", eyebrow: L.eyebrow });
  LAYERED_WINDOWS.push([+t.toFixed(2), +(t + dur).toFixed(2)]);
}
beats.sort((a, b) => a.start - b.start);

fs.mkdirSync("public/broll", { recursive: true }); fs.mkdirSync("public/real", { recursive: true }); fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(MATCH, null, 2));
fs.writeFileSync(`public/real/bing_${SLUG}.json`, JSON.stringify(BING, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_diag.json`, JSON.stringify(DIAGRAMS, null, 2));
if (MODE === "match") { console.log(`=== build_salitre MATCH ===`); console.log(`match ${MATCH.length} · bing ${BING.length} · diag ${DIAGRAMS.length} · proxy ${(2 * MATCH.length / 6).toFixed(0)}/IP`); process.exit(0); }
const haveClip = (n) => fs.existsSync(`public/broll/${n}.mp4`);
const haveReal = (n) => fs.existsSync(`public/real/${n}.png`) || fs.existsSync(`public/real/${n}.jpg`);
const haveImg = (n) => fs.existsSync(`public/img/${n}.png`);
let nClip = 0, nReal = 0, nImg = 0, nMiss = 0; const miss = [];
for (const b of beats) { if (b.kind !== "raw") continue; if (b.src.startsWith("broll/")) { if (haveClip(b.id)) nClip++; else if (haveReal(b.id)) { b.src = `real/${b.id}.png`; nReal++; } else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("real/")) { if (haveReal(b.id)) nReal++; else { nMiss++; miss.push(b.id); } } else if (b.src.startsWith("img/")) { if (haveImg(b.id)) nImg++; else { nMiss++; miss.push(b.id); } } }
// DENSIDAD MÁXIMA: recomputar dur por beat raw (permite flashes sub-1s, min 0.8s).
{ const ord = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
  for (let i = 0; i < ord.length; i++) { const b = ord[i]; if (b.kind !== "raw") continue; const next = i + 1 < ord.length ? ord[i + 1].start : TOTAL; b.dur = +Math.max(0.8, Math.min(next - b.start + 0.3, 7)).toFixed(2); } }
// SEGURIDAD: dropear beats raw cuyo asset no existe (evita 404 en el farm).
for (let i = beats.length - 1; i >= 0; i--) { const b = beats[i]; if (b.kind === "raw" && !fs.existsSync("public/" + b.src)) beats.splice(i, 1); }
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, tutorial: true, clipsfirst: true, beats }, null, 1));
const AVF = [[0, OPEN]];
for (let i = 0; i < SEC.length; i++) { if (!SEC[i].full) continue; const st = SEC[i].start; const end = i + 1 < SEC.length ? SEC[i + 1].start : TOTAL; AVF.push([st, end]); }
const POS = ["cornerTR", "cornerBL", "cornerTL", "right", "left", "cornerBR"];
const pip = []; let k = 0;
for (let i = 0; i < beats.length; i++) { if (beats[i].kind !== "raw") continue; if (i % 5 === 2) { pip.push([beats[i].start, beats[i].start + Math.min(beats[i].dur, 7), POS[k % POS.length]]); k++; } }
const firstClip = beats.length ? beats[0].start : OPEN;
const inAvf = (t) => AVF.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const cov = beats.filter((b) => b.kind === "raw").map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
const covered = (t) => cov.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
// ★ HIDE: ventanas donde un COMPONENTE PROMINENTE manda a PANTALLA COMPLETA y el avatar
// GRANDE NO debe tapar/duplicar: DIAGRAMAS, LAYERED REVEALS y el set de pulido cine.
const PROMINENT = new Set(["diagram", "layered", "sltwowalls", "slcapillary", "slsalt", "slseal", "slbarrier", "sllime", "mdrotinside", "mdrulestamp", "mdfungus", "mdslider", "mdkicker", "mdendcard"]);
const HIDE = [
  ...beats.filter((b) => PROMINENT.has(b.kind)).map((b) => [b.start, +(b.start + b.dur).toFixed(2)]),
].sort((a, b) => a[0] - b[0]);
const inHide = (t) => HIDE.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const modeAt = (t) => { if (inHide(t)) return "hidden"; if (t < firstClip - 1e-6) return "full"; if (inAvf(t)) return "full"; if (!covered(t)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, firstClip, ...AVF.flat(), ...pip.flatMap((p) => [p[0], p[1]]), ...cov.flat(), ...HIDE.flat(), TOTAL].map((x) => +(+x).toFixed(2)))].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
const avSecs = AVF.reduce((a, [s, e]) => a + (e - s), 0);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const rawN = beats.filter((b) => b.kind === "raw").length;
console.log(`=== build_salitre BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips ${nClip} · imgs ${nReal} · gpt ${nImg} · faltan ${nMiss} · dur ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full ${(avSecs / 60).toFixed(1)}min · PiP ${pip.length} · windows ${windows.length} · MATCH ${MATCH.length} · BING ${BING.length} · DIAG ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}`);
