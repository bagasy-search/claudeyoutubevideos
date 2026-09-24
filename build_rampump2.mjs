// build_rampump2.mjs — REMAKE mejor + más largo del ariete (hit 2.4K) · canal claudio yoder.
// "Build This Amish Water Pump That Runs Forever on No Power ($40)."
// HOW-TO real: enseña a construir la bomba de la miniatura (PVC + 2 check valves + tee +
// rubber boots + botella de aire), materiales alternativos, tuneo, dimensionado, primer
// arranque, 5 fallas, invierno, escalar. Anclado al ms EXACTO de Whisper (captions_rampump2).
// PiP QUIETO en UNA esquina (cornerBR) que a veces desaparece — NO rotar (feedback usuario).
// 3 menciones casuales a la guía de los comentarios → overlays phrasetag.
//
// Modo: node build_rampump2.mjs match | node build_rampump2.mjs
import fs from "fs";

const MODE = process.argv[2] === "match" ? "match" : "build";
const SLUG = "rampump2";
const caps = JSON.parse(fs.readFileSync("public/captions_rampump2.json", "utf8"));
const TOTAL = +(caps[caps.length - 1].endMs / 1000).toFixed(2);
const OPEN = 0.26;
const DLDUR = 6;

// ── anchoring por FRASE (ms real del narrador) ──
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = [];
for (const c of caps) for (const w of norm(c.text).split(" ")) if (w) W.push({ w, ms: c.startMs });
const words = W.map((x) => x.w);
const warn = [];
function at(phrase, fromMs = 0) {
  const p = norm(phrase).split(" ");
  let s = 0;
  if (fromMs > 0) { s = W.findIndex((x) => x.ms >= fromMs); if (s < 0) s = 0; }
  for (let i = s; i <= words.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) if (words[i + j] !== p[j]) { ok = false; break; }
    if (ok) return +(W[i].ms / 1000).toFixed(2);
  }
  if (fromMs > 0) return at(phrase, 0); // reintento global
  warn.push(phrase);
  return null;
}

// ── AV FULL: momentos personales/emotivos/CTA (avatar a pantalla completa) ──
const AV_FULL = [
  [OPEN, at("no cord running to it")],                 // hook: apertura mirando a cámara
  [at("My grandfather built one just like it"), at("wander off")], // promesa: te voy a enseñar
  [at("The winter my father was a boy"), at("let them be forgotten")], // anécdota del valle
  [at("come and subscribe"), TOTAL],                    // sign-off
].filter((w) => w[0] != null && w[1] != null);

// ── CLIPS: [frase-ancla, name, query(ES+ancla sujeto), concepto] en ORDEN de narración ──
const CLIPS = [
  // HOOK
  ["no cord running to it", "rp_bench_pump", ["homemade hydraulic ram pump on a workbench","pvc ram pump with a bottle on a board"], "el arietito de PVC sobre el banco"],
  ["start pushing water uphill", "rp_water_climb", ["water flowing up a pipe on a hillside","pipe running up a grassy hill"], "el agua subiendo el caño por la loma"],
  ["for twenty years without me", "rp_pump_running", ["ram pump working by a creek","water trickling from a hydraulic ram pump"], "el ariete funcionando solo junto al arroyo"],
  ["the power company would never", "rp_water_bill", ["a water utility bill on a table","monthly water bill paper"], "la factura del agua que nunca llega"],
  ["out of a few pieces of pipe", "rp_pipe_bottle", ["pvc pipe fittings and a plastic bottle","plumbing parts and a soda bottle on a bench"], "unos caños, válvulas y una botella"],
  ["for about forty dollars", "rp_cheap_parts", ["cheap plumbing fittings in a hand","a handful of pipe valves and fittings"], "cuarenta dólares en fittings"],
  ["stops nine out of ten of these dead", "rp_valve_close", ["a check valve snapping shut","spring valve closing on a pipe"], "la válvula que mata nueve de cada diez"],
  // STORY
  ["the spring sat down in the low ground", "rp_spring_low", ["spring water at the bottom of a slope","low spring in a green field"], "el manantial en el bajo"],
  ["the house sat up on the rise", "rp_house_hill", ["farmhouse on top of a hill","old farm house above a field"], "la casa arriba en la loma"],
  ["two buckets at a time", "rp_buckets", ["carrying water buckets uphill on a farm","hauling water in pails up a slope"], "acarreando baldes cuesta arriba"],
  ["till her hands were ruined", "rp_hands_pail", ["worn tired hands holding a bucket handle","rough hands and a pail rope"], "las manos gastadas por el balde"],
  ["a gasoline engine", "rp_gas_engine", ["old gasoline water pump engine","vintage petrol engine on a farm"], "el motor a nafta ruidoso"],
  ["loud, thirsty thing", "rp_engine_smoke", ["smoking old engine running","exhaust from a petrol motor"], "el motor humeando, tragando combustible"],
  ["their water quit right along with it", "rp_empty_can", ["empty rusty fuel can","dry gas can in a shed"], "sin combustible, sin agua"],
  ["The water is already moving", "rp_stream_moving", ["a stream running through green farmland","creek flowing across a pasture"], "el arroyo que ya se está moviendo"],
  ["hand a little of that strength back", "rp_rushing_creek", ["fast rushing creek water close up","strong stream current"], "la fuerza del agua que corre"],
  ["The water pumps the water", "rp_water_only", ["clear water flowing close up","moving water surface detail"], "el agua bombea el agua"],
  // SECRET / water hammer
  ["carried a full pail, walking quick", "rp_carry_pail", ["person carrying a full bucket of water","hand holding a sloshing pail"], "cargando un balde lleno, rápido"],
  ["slops right over the front lip", "rp_spill_pail", ["water sloshing over a bucket rim","splashing water out of a pail"], "el agua saltando por el borde"],
  ["water hammer", "rp_pipe_bang", ["water pipe shaking from pressure","banging plumbing pipe"], "el golpe de ariete en los caños"],
  ["a hard, sharp shove", "rp_water_gush", ["water bursting from a pipe close up","forceful jet of water"], "un empujón fuerte y seco"],
  ["curse it when a pipe bangs in the wall", "rp_wall_pipe", ["old pipes inside a wall","household plumbing behind a wall"], "los caños que golpean en la pared"],
  ["a thousand times an hour", "rp_ticking", ["hydraulic ram pump ticking rhythmically","steady knocking water pump"], "mil golpes por hora"],
  ["that machine is called a hydraulic ram", "rp_ram_iron", ["old iron hydraulic ram pump by a spring","antique brass ram pump"], "el ariete hidráulico, de hierro"],
  // FIVE PARTS
  ["the drive pipe", "rp_drive_pipe", ["water flowing down a sloped pipe","pipe carrying water downhill"], "el caño de empuje, el agua baja y acelera"],
  ["the waste valve", "rp_waste_valve", ["spring check valve close up","flap valve on a water pipe"], "la válvula de descarga"],
  ["the delivery valve", "rp_delivery_valve", ["one-way brass check valve close up","check valve fitting"], "la válvula de entrega, de una vía"],
  ["a sealed pocket of trapped air", "rp_bottle_air", ["plastic bottle air chamber on a pump","sealed bottle on pipe fittings"], "la cámara de aire, la botella"],
  ["carries your water on up the hill", "rp_delivery_line", ["thin water line going up a hill","small pipe climbing a slope"], "el caño de entrega sube la loma"],
  ["Two of them are just pipe", "rp_pipe_pieces", ["cut lengths of pvc pipe","pipe sections on a bench"], "dos partes son sólo caño"],
  // HOW IT WORKS
  ["comes rushing down the drive pipe", "rp_water_down", ["water rushing down a pipe","fast water in a tube"], "el agua bajando por el caño"],
  ["pours straight out through the waste valve", "rp_waste_gush", ["water gushing out of an open valve","water spilling from a pipe outlet"], "el agua sale por la válvula de descarga"],
  ["it slams it shut", "rp_valve_slam", ["a valve snapping shut fast","mechanical flap closing"], "la válvula se cierra de golpe"],
  ["where is all that moving water to go", "rp_pressure", ["pressure gauge spiking","high pressure surge in a pipe"], "toda esa agua frenada de golpe"],
  ["It leaps up through the delivery valve", "rp_slug_up", ["a slug of water forced up a pipe","water pushed up a tube"], "salta por la válvula de entrega"],
  ["shoves a mouthful of water up", "rp_mouthful", ["water spurting up into a chamber","jet of water into a bottle"], "un buche de agua hacia arriba"],
  ["the whole thing repeats", "rp_cycle", ["ram pump cycling repeatedly","water pump in steady operation"], "y todo vuelve a empezar"],
  ["feel the ground tick with it", "rp_heartbeat", ["ram pump pulsing by a stream","rhythmic knocking pump outdoors"], "el suelo late con la bomba"],
  // BUILD
  ["Bring your bench over", "rp_workbench", ["workbench with plumbing tools","building a pump on a wooden bench"], "el banco de trabajo"],
  ["You need your pipe", "rp_pvc_pipe", ["grey pvc pipe lengths","plastic pipe on a table"], "el caño de PVC"],
  ["two ordinary spring check valves", "rp_check_valves", ["two spring check valves","brass and plastic check valves"], "dos válvulas de retención"],
  ["You need a t fitting", "rp_tee", ["pvc tee fitting close up","plumbing tee joint"], "un tee"],
  ["those black rubber couplings", "rp_rubber_boot", ["black rubber pipe coupling with hose clamps","flexible mission coupling"], "los acoples de goma con abrazadera"],
  ["nothing but a stout plastic soda bottle", "rp_bottle", ["plastic soda bottle threaded on a pipe","bottle used as air chamber"], "la botella de gaseosa como cámara"],
  ["most of that's the valves", "rp_forty", ["pile of cheap plumbing fittings","valves and fittings with price tags"], "todo por unos cuarenta dólares"],
  ["Start with your t laid", "rp_assemble", ["assembling pvc pipe and a tee","hands fitting plumbing pieces"], "empezá por el tee"],
  ["Glue your PVC joints", "rp_glue", ["applying pvc cement to a joint","gluing plastic pipe"], "pegando las uniones de PVC"],
  ["leave the waste valve joined with a rubber boot", "rp_boot_clamp", ["tightening a hose clamp on a coupling","rubber boot clamp on a pipe"], "la válvula de descarga con acople, no pegada"],
  // OTHER MATERIALS
  ["the air inside a bottle slowly dissolves", "rp_bottle_water", ["water filling a clear bottle","bubbles dissolving in water"], "el aire de la botella se disuelve"],
  ["a capped length of larger pipe", "rp_capped_pipe", ["capped section of pvc pipe standing up","sealed pipe air chamber"], "un caño tapado más grande"],
  ["a section of an old bicycle inner tube", "rp_inner_tube", ["old bicycle inner tube rubber","black rubber inner tube coil"], "un pedazo de cámara de bici"],
  ["an old pressure tank off a well", "rp_pressure_tank", ["blue well pressure tank","water system pressure vessel"], "un viejo tanque de presión"],
  ["build it in brass and", "rp_brass_iron", ["galvanized iron pipe and brass valves","heavy metal plumbing fittings"], "en bronce y hierro galvanizado"],
  ["that one is iron", "rp_iron_pump", ["old iron water ram pump outdoors","weathered metal pump by a spring"], "el ariete de hierro del abuelo"],
  // SETTING UP
  ["set it by the water right", "rp_set_water", ["installing a pump at a creek bank","placing a ram pump by a stream"], "montarla bien junto al agua"],
  ["If your creek runs down a hillside", "rp_hillside_creek", ["a stream running down a hillside","creek flowing down a slope"], "un arroyo que baja la ladera"],
  ["say your creek is flat, lazy", "rp_flat_creek", ["slow flat calm creek","still lazy stream"], "un arroyo chato y lento"],
  ["you set a barrel, or a little stock tank", "rp_barrel", ["a barrel collecting stream water","water filling a stock tank"], "un barril arriba juntando agua"],
  ["dug into the bank", "rp_dig_bank", ["digging into a creek bank with a shovel","earth bank by a stream"], "cavando en la barranca para ganar caída"],
  ["The drive pipe has got to be rigid", "rp_rigid_pipe", ["rigid straight metal pipe","stiff steel drive pipe"], "el caño de empuje tiene que ser rígido"],
  ["never a soft, floppy garden hose", "rp_garden_hose", ["a coiled soft garden hose","flexible rubber hose"], "nunca una manguera blanda"],
  ["about five to seven times as long as your fall", "rp_pipe_long", ["a long pipe running down a slope","steady long drive pipe on a hill"], "el caño 5 a 7 veces la caída"],
  ["a half-inch of black poly tubing off a roll", "rp_poly_tube", ["roll of black poly water tubing","coil of irrigation pipe"], "el caño de entrega, poly fino"],
  // TUNING
  ["tuned to slam at just the right beat", "rp_tune_valve", ["adjusting a check valve on a pump","tuning a ram pump valve"], "tunear la válvula al ritmo justo"],
  ["add a small weight to the flapper", "rp_washer_weight", ["adding a washer to a valve arm","small weight on a valve flap"], "una arandela de peso en la tapa"],
  ["like a man tuning a fiddle", "rp_fiddle", ["old man adjusting by ear","hands tuning carefully"], "afinándola de oído, como un violín"],
  ["patient tick tick tick", "rp_tick_steady", ["ram pump knocking steadily","rhythmic pump beat by water"], "el tic parejo, una vez por segundo"],
  // FALL / RATIO / HOW MUCH
  ["It is the fall", "rp_the_fall", ["water dropping into a pump","measuring the drop of a stream"], "la caída, el desnivel"],
  ["Three feet of fall is enough to start", "rp_three_feet", ["a small three foot drop in a creek","little waterfall on a stream"], "tres pies de caída alcanzan"],
  ["One foot of fall, ten feet of lift", "rp_one_ten", ["water shooting up high from a small drop","tall thin jet of water"], "un pie cae, diez pies sube"],
  ["Six for sixty", "rp_trough_high", ["water tank high above a spring","elevated tank far up a hill"], "seis de caída, sesenta de subida"],
  ["the rest spits out the waste valve", "rp_waste_back", ["water spilling back to a stream","overflow returning to a creek"], "el resto vuelve al arroyo"],
  ["Water while you sleep", "rp_night_water", ["water tank filling at dusk","quiet homestead at night"], "agua mientras dormís"],
  // USES
  ["You run it into a tank at the top", "rp_tank_top", ["water storage tank on a hilltop","filling a cistern up high"], "a un tanque arriba de la loma"],
  ["water with pressure", "rp_tap_pressure", ["water running from a tap with pressure","kitchen faucet flowing strong"], "agua con presión por gravedad"],
  ["run a drip line the whole length of your garden", "rp_drip_garden", ["drip irrigation line in a vegetable garden","garden watering rows"], "riego por goteo en la huerta"],
  ["top off a pond for your ducks", "rp_duck_pond", ["ducks on a small farm pond","pond with ducks on a homestead"], "el estanque de los patos"],
  ["a whole homestead's water", "rp_homestead", ["homestead with running water and garden","self sufficient farm water system"], "el agua de toda la chacra"],
  // FIRST START
  ["the very first start", "rp_first_start", ["starting a ram pump by a stream","first run of a homemade pump"], "el primer arranque"],
  ["flood the pump full", "rp_flood_pump", ["water filling a pump body","priming a water pump"], "cebando la bomba, llenándola"],
  ["Water will come pouring out the waste valve", "rp_waste_pour", ["water pouring steadily from a valve","open valve gushing water"], "el agua saliendo pareja por la descarga"],
  ["press the valve closed, quick", "rp_hand_prime", ["a finger pressing a valve on a pump","hand tapping a pump valve"], "apretando la válvula con el dedo"],
  ["you'll feel it catch", "rp_catch", ["ram pump starting to knock","pump beginning to cycle"], "la bomba engancha el ritmo"],
  ["begins to climb your delivery pipe", "rp_water_up2", ["water rising up a clear pipe","water climbing a hose uphill"], "el agua trepa el caño de entrega"],
  ["you walk away, and it keeps right on working", "rp_walk_away", ["a person walking away from a working pump","farmer leaving a running ram pump"], "te vas, y sigue trabajando sola"],
  // TROUBLESHOOTING
  ["the air chamber fills with water", "rp_chamber_flood", ["a waterlogged pump chamber","air chamber full of water"], "la cámara de aire se llena de agua"],
  ["drill one tiny hole", "rp_snifter", ["drilling a tiny hole in a pipe","small snifter hole on a pump"], "un agujerito, el snifter"],
  ["a bit of grit or a leaf", "rp_grit_leaf", ["a leaf caught in water intake","debris in a stream pipe"], "una hojita o arenilla trabando la válvula"],
  ["put a screen on the mouth of your drive pipe", "rp_intake_screen", ["a screen on a water intake pipe","mesh filter on a creek pipe"], "una malla en la boca del caño"],
  ["that's not enough fall", "rp_no_fall", ["a very small drop in a flat stream","shallow slow creek"], "poca caída, no arranca"],
  ["run your hand over every joint", "rp_check_joints", ["checking pipe joints for leaks by hand","inspecting plumbing connections"], "revisando cada unión con la mano"],
  ["Water freezes, and a frozen ram is a cracked ram", "rp_frozen_pipe", ["frozen cracked water pipe","ice on outdoor plumbing"], "un ariete congelado se raja"],
  ["bury your pipes below the frost line", "rp_bury_pipe", ["burying water pipe in a trench","pipe laid below frost line"], "los caños bajo la línea de helada"],
  ["a pile of straw bales", "rp_straw_box", ["straw bales around a pump","insulating with hay bales"], "fardos de paja tapando la bomba"],
  ["warm from its own motion", "rp_pump_snow", ["a water pump working in the snow","ram pump running in winter"], "la bomba tibia por su propio movimiento"],
  // SCALING + ANECDOTE
  ["what if I need more water", "rp_more_water", ["several pipes carrying water uphill","multiple water lines on a farm"], "si necesito más agua"],
  ["you build two small ones", "rp_two_pumps", ["two small ram pumps side by side","a pair of pumps on a creek"], "dos bombas chicas, no una grande"],
  ["clocks on a mantle", "rp_two_clocks", ["two old mantel clocks ticking","antique clocks side by side"], "como dos relojes viejos en la repisa"],
  ["coming to her kitchen with their pails", "rp_neighbors_pails", ["neighbors carrying pails in winter","women fetching water in snow"], "las vecinas con sus baldes"],
  // HISTORY
  ["a Frenchman named Montgolfier", "rp_montgolfier", ["antique engraving of an inventor","old french hot air balloon engraving"], "un francés, Montgolfier"],
  ["patented this ram back in", "rp_patent", ["old patent drawing of a pump","antique technical diagram"], "patentado hace siglos"],
  ["whole villages watered themselves this way", "rp_village", ["old european village by a river","historic riverside town"], "pueblos enteros funcionaban así"],
  ["Great manor houses ran their fountains", "rp_manor", ["grand old country estate with a fountain","historic manor and gardens"], "casonas con sus fuentes"],
  ["the electric came, and the gas engine came", "rp_grid_towers", ["electric power lines being installed","power grid towers going up"], "llegó la red y el motor a nafta"],
  ["came with a metre on it", "rp_meter_bill", ["electricity meter dial spinning","utility meter counting"], "vino con un medidor y una factura"],
  ["got rich off my grandfather's spring", "rp_spring_free", ["free clear spring water on a farm","natural spring bubbling"], "nadie se hizo rico con el manantial"],
  // PAYOFF
  ["the black cold of January", "rp_january_snow", ["deep snow on a winter farm","frozen rural landscape in january"], "el frío negro de enero"],
  ["you can still feel it", "rp_pump_ice", ["ram pump under ice still working","water pump in frozen creek"], "bajo el hielo, todavía late"],
  ["No cord", "rp_no_bill", ["a simple pump with no wires","off grid water pump close up"], "sin cable, sin motor, sin factura"],
  ["never be beholden to another soul for his water", "rp_free_indep", ["clear water flowing freely on land","independent homestead water"], "nunca depender de nadie por el agua"],
  ["you can build it this week", "rp_build_week", ["hands finishing a homemade ram pump","completed diy water pump"], "lo podés construir esta semana"],
];

// ── resolver clips con cursor (orden de narración; maneja frases repetidas) ──
let cur = 0;
const clipsR = [];
for (const [phrase, name, query, concept] of CLIPS) {
  const t = at(phrase, cur > 0 ? cur - 0.3 : 0);
  if (t == null) continue;
  cur = t;
  clipsR.push([t, name, query, concept]);
}
clipsR.sort((a, b) => a[0] - b[0]);

const inFull = (t) => AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const MINGAP = 2.6;
const clips = [];
let lastT = -99;
for (const c of clipsR.filter((c) => !inFull(c[0]))) {
  if (c[0] - lastT < MINGAP) continue;
  clips.push(c);
  lastT = c[0];
}

if (MODE === "match") {
  const match = clips.map(([t, name, query, concept]) => ({ name, concept, query, dur: DLDUR }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(match, null, 2));
  // ── formato CORE v4 (match_v3): ms, queries(EN), desc, anchor, src ──
  const v3 = clips.map(([t, name, query, concept]) => ({
    name, section: "rp", ms: Math.round(t * 1000), phrase: concept, dur: DLDUR,
    desc: Array.isArray(query) ? query[0] : query,
    queries: Array.isArray(query) ? query : [query],
    anchor: "", shot: "", src: "youtube",
  }));
  fs.mkdirSync("_v3", { recursive: true });
  fs.writeFileSync(`_v3/${SLUG}_beats.json`, JSON.stringify(v3, null, 1));
  console.log(`match_${SLUG}.json + _v3/${SLUG}_beats.json: ${match.length} clips a matchear`);
  if (warn.length) console.log(`⚠ frases NO encontradas (${warn.length}):\n  ` + warn.join("\n  "));
  process.exit(0);
}

// ── BUILD HÍBRIDO ──
const have = (name) => fs.existsSync(`public/broll/${name}.mp4`);
const haveImg = (name) => fs.existsSync(`public/real/${name}.jpg`) || fs.existsSync(`public/real/${name}.png`);
const IMG_STYLE = ", documentary photo that looks like a real casual snapshot, slightly soft focus, uneven natural light, real texture, small imperfections, nothing polished, no AI look, low saturation, muted colors, no text, no captions, no watermark, no logo";
const nClip = clips.filter((c) => have(c[1])).length;
const avStarts = AV_FULL.map(([s]) => s);
const OV = 0.5;
const bounds = [...clips.map((c) => c[0]), ...avStarts, TOTAL].sort((a, b) => a - b);
const nextBound = (t) => bounds.find((b) => b > t + 1e-6) ?? TOTAL;
let beats = clips.map(([t, name, query, concept]) => {
  const dur = +Math.min(nextBound(t) - t + OV, TOTAL - t).toFixed(2);
  if (have(name)) return { id: name, start: t, dur, kind: "raw", src: `broll/${name}.mp4`, darken: 0 };
  if (haveImg(name)) { const ext = fs.existsSync(`public/real/${name}.jpg`) ? "jpg" : "png"; return { id: name, start: t, dur, kind: "raw", src: `real/${name}.${ext}`, darken: 0 }; }
  return { id: name, start: t, dur, kind: "raw", src: `img/${name}.png`, darken: 0, gen: { type: "image", name, prompt: (Array.isArray(query) ? query[0] : query) + IMG_STYLE } };
});

// ── PASADA 2: COMPONENTES (re-anclados por frase) ──
const ck = (text, note) => (note ? { text, note, state: "done" } : { text, state: "done" });
const atC = (phrase, hint) => at(phrase, hint ? hint - 3 : 0);
const COMPONENTS = [
  { p: "believe me at first", id: "cmp_hook", kind: "impact", image: "img/cmp_hook_bg.png",
    setup: "Watch closely:", impact: "Water uphill. On no power.", impactAccent: "cold", hitAt: 1.2, boom: 0, darken: 0.42,
    bg: "water flowing uphill through a pipe on a green hillside, impossible looking" },
  { p: "There are really only five parts", id: "cmp_parts", kind: "checklist", hue: "cold", accent: "good",
    title: "The whole machine", eyebrow: "5 parts · 2 are just pipe",
    items: [ck("Drive pipe"), ck("Waste valve"), ck("Delivery valve"), ck("Air chamber"), ck("Delivery pipe")],
    bg: "metal pipe fittings and two valves laid out on a workbench" },
  { p: "so simple a child can see it", id: "cmp_cycle", kind: "rampump", eyebrow: "How it works", title: "One knock at a time",
    driveTag: { text: "Drive pipe", sub: "water falls & speeds up" }, wasteTag: { text: "Waste valve", sub: "slams shut → hammer" },
    airTag: { text: "Air chamber", sub: "cushions the blow" }, tankTag: { text: "Up the hill", sub: "to your tank" }, ratioTag: "10 fall · 1 climbs" },
  { p: "Here is everything you need", id: "cmp_materials", kind: "checklist", hue: "amber", accent: "good",
    title: "The shopping list", eyebrow: "~$40 · any hardware store",
    items: [ck("1¼\" pipe (drive + body)"), ck("Two check valves"), ck("A tee fitting"), ck("Rubber boots + clamps"), ck("A bottle for the air chamber")],
    bg: "plumbing fittings, two check valves and a soda bottle on a hardware store counter" },
  { p: "One foot of fall, ten feet of lift", id: "cmp_lift", kind: "stat", hue: "cold", accent: "good",
    value: 10, suffix: "×", label: "higher than the distance the water falls", eyebrow: "The rule of ten" },
  { p: "a tenth of the water that runs through it", id: "cmp_ratio", kind: "bars", hue: "cold", accent: "good", unit: "gal",
    title: "Out of every 10 gallons", eyebrow: "Where the water goes",
    bars: [{ label: "Back to the creek (free)", value: 9, display: "9 gal", tone: "amber" }, { label: "Up the hill", value: 1, display: "1 gal", winner: true }] },
  { p: "a thousand gallons a day up a good hill", id: "cmp_perday", kind: "stat", hue: "amber", accent: "good",
    value: 1000, prefix: "+", suffix: " gal/day", label: "from a machine that costs a few dollars and runs on falling water", eyebrow: "Day and night" },
  { p: "let me give you the troubleshooting", id: "cmp_trouble", kind: "checklist", hue: "amber", accent: "danger",
    title: "The 5 ways it fails", eyebrow: "…and every fix",
    items: [ck("Air chamber floods → a snifter hole"), ck("Valve stuck → screen the intake"), ck("Won't start → gain more fall"), ck("Air leak → seal the joints"), ck("Freeze → bury pipes, box it in")],
    bg: "a homemade ram pump by a creek with tools beside it" },
  { p: "patented this ram back in", id: "cmp_history", kind: "timeline", eyebrow: "It is not new", title: "Why you never heard of it",
    events: [{ year: "1796", label: "patented in France", accent: "amber" }, { year: "1800s", label: "farms & villages everywhere", accent: "amber" }, { year: "1900s", label: "the grid buried it", accent: "danger" }] },
  { p: "you can build it this week", id: "cmp_weekend", kind: "process", hue: "amber", accent: "good",
    title: "Your weekend", eyebrow: "Build a small one first",
    steps: [{ title: "Find falling water" }, { title: "Build the pump ($40)" }, { title: "Set it & tune the knock" }] },
  { p: "one more forgotten skill like this", id: "cmp_next", kind: "nextvideo", kicker: "Next time",
    title: "Light a whole room with one small flame", sub: "No grid, no batteries — a forgotten trick that makes one candle shine like ten." },
];
let nComp = 0;
const placed = new Set();
for (const c of COMPONENTS) {
  const ct = atC(c.p);
  if (ct == null) continue;
  let idx = -1;
  for (let i = 0; i < beats.length; i++) { if (beats[i].start <= ct + 0.01) { if (!placed.has(beats[i].id)) idx = i; } else break; }
  if (idx < 0) continue;
  const start = beats[idx].start;
  const D = 6.2;
  const { p, bg, kind, ...rest } = c;
  const ab = { id: c.id, start, dur: D, kind };
  delete rest.id;
  Object.assign(ab, rest);
  if (bg) { ab.image = `img/${c.id}_bg.png`; ab.gen = { type: "image", name: `${c.id}_bg`, prompt: bg + IMG_STYLE }; }
  let rm = 1;
  while (idx + rm < beats.length && beats[idx + rm].start < start + D - 0.05 && !placed.has(beats[idx + rm].id)) rm++;
  beats.splice(idx, rm, ab);
  placed.add(c.id);
  nComp++;
}

// ── tiling (cero pantallas vacías) ──
beats.sort((a, b) => a.start - b.start);
const avStartsAll = AV_FULL.map(([s]) => s);
for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const nextStart = i + 1 < beats.length ? beats[i + 1].start : TOTAL;
  const avAfter = avStartsAll.filter((s) => s > b.start + 1e-6).sort((x, y) => x - y)[0] ?? Infinity;
  let end = Math.min(nextStart, TOTAL);
  if (avAfter < end) end = avAfter;
  const ov = b.kind === "raw" ? OV : 0;
  b.dur = +(Math.max(0.2, Math.min(end + ov, TOTAL) - b.start)).toFixed(2);
}

// ── PASADA 3: OVERLAYS (data tags + 3 menciones de guía) anclados al ms ──
const st = (p, value, suffix, label, corner = "TL") => { const t = at(p); return t == null ? null : { id: `ov_${Math.round(t)}`, start: t, dur: 3.6, kind: "stattag", overlay: true, value, suffix, label, corner, accent: "cold" }; };
const stx = (p, text, label, corner = "TL") => { const t = at(p); return t == null ? null : { id: `ovx_${Math.round(t)}`, start: t, dur: 3.6, kind: "stattag", overlay: true, text, label, corner, accent: "amber" }; };
const ph = (p, text, pos = "bottom", accent = "cold") => { const t = at(p); return t == null ? null : { id: `ovp_${Math.round(t)}`, start: t, dur: 3.4, kind: "phrasetag", overlay: true, text, pos, accent }; };
const guide = (p, text) => { const t = at(p); return t == null ? null : { id: `ovg_${Math.round(t)}`, start: t, dur: 4.2, kind: "phrasetag", overlay: true, text, pos: "bottom", accent: "amber" }; };
const OVERLAYS = [
  ph("start pushing water uphill", "Water uphill — on its own", "bottom", "cold"),
  ph("no gasoline, no battery, no solar panel", "No power · no motor · no fuel", "top", "amber"),
  st("once a second for 79 years", 79, " yrs", "still knocking", "TR"),
  ph("water hammer", "Water hammer = the engine", "bottom", "danger"),
  ph("it slams it shut", "It slams shut", "bottom", "danger"),
  // GUÍA #1 (materiales)
  guide("take it to the hardware store", "📌 Full parts list — free guide in the comments"),
  stx("about five to seven times as long as your fall", "5–7×", "drive pipe vs fall", "TL"),
  st("Three feet of fall is enough to start", 3, " ft", "drop is plenty", "TR"),
  stx("One foot of fall, ten feet of lift", "1 : 10", "fall vs lift", "TL"),
  // GUÍA #2 (dimensionado)
  guide("I put a little sizing table in that same guide", "📌 Sizing table — in the free guide (comments)"),
  ph("press the valve closed, quick", "Prime it by hand → it catches", "bottom", "cold"),
  ph("warm from its own motion", "Runs right through winter", "top", "cold"),
  stx("came with a metre on it", "$0/yr", "to run, forever", "TR"),
  ph("No cord", "No cord · no motor · no bill", "bottom", "cold"),
  // GUÍA #3 (cierre)
  guide("in the guide I put together for you", "📌 Free guide + 90 old skills — in the comments"),
];
beats.push(...OVERLAYS.filter((o) => o && !inFull(o.start)));

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({
  video: SLUG, avatar: `${SLUG}_opt.mp4`, clipsfirst: true, maxRawDur: 8,
  beats,
}, null, 2));

// ── ventanas de avatar: PiP QUIETO en UNA esquina (cornerBR), a veces hidden. NO rotar. ──
const timeline = beats.filter((b) => !b.overlay).sort((a, b) => a.start - b.start);
const CORNER = "cornerBR";
const pip = [];
for (let i = 0; i < timeline.length; i++) {
  // aparece ~1 de cada 3 tramos, siempre en la MISMA esquina; el resto oculto
  if (i % 3 === 1 && !inFull(timeline[i].start)) {
    const s = timeline[i].start;
    const e = Math.min(s + 6.5, timeline[i].start + (timeline[i].dur || 5));
    pip.push([s, e, CORNER]);
  }
}
const firstClip = clips.length ? clips[0][0] : OPEN;
const modeAt = (t) => {
  if (t < firstClip - 1e-6) return "full";
  if (AV_FULL.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6)) return "full";
  const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
  return p ? p[2] : "hidden";
};
const pts = [...new Set([0, firstClip, ...AV_FULL.flat(), ...pip.flatMap((p) => [p[0], p[1]]), TOTAL])].sort((a, b) => a - b);
const windows = [];
let curM = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== curM) { windows.push({ start: +t.toFixed(2), mode: m }); curM = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_RAMPUMP2 = ${TOTAL};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

const avSecs = AV_FULL.reduce((a, [s, e]) => a + (e - s), 0);
console.log(`=== build_${SLUG} ===`);
console.log(`beats: ${timeline.length} (+${beats.length - timeline.length} overlays) · clips: ${nClip} · imágenes: ${timeline.length - nClip - nComp} · componentes: ${nComp}`);
console.log(`avatar-full: ${(avSecs / 60).toFixed(1)}min · PiP(${CORNER}): ${pip.length} · windows: ${windows.length}`);
if (warn.length) console.log(`⚠ frases NO encontradas (${warn.length}):\n  ` + warn.join("\n  "));
