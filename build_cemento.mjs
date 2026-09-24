// build_cemento.mjs — CLIPS-FIRST DENSO (Constructor Libre, "El Constructor Libre").
// Video "cemento": por qué las paredes viejas duran 100 años y las nuevas se rajan — el
// secreto de la CAL y el CURADO. Avatar Tomás + b-roll dominante REAL: clips YouTube
// (matchfarm proxies) + cientos de imágenes web (fetch_bing). AI solo diagramas. Queries
// ANALIZADAS del guion (específicas, EN inglés, ancladas al TEMA: construcción, albañilería,
// cemento, cal, arena, curado) — no random. Pacing ~4-5s. REGLA #0: cada beat al ms exacto.
// Modos:  node build_cemento.mjs match  |  node build_cemento.mjs
import fs from "fs";

const SLUG = "cemento";
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
  // ░░ 1) COLD OPEN — pared vieja sana vs nueva rajada ░░
  { a: "fijate un segundo en la pared de una casa vieja", start: 0, beats: [
    C("ce_old_healthy_wall", "old country house wall seventy years old solid no cracks exterior", "the wall of an old house, seventy or eighty years old", { at: "de esas de 70 u 80 anos" }),
    I("ce_old_wall_no_crack", "old plaster wall smooth intact not a single crack close up", "solid and almost never a single crack", { at: "esta sana y casi siempre sin ni una sola grieta" }),
    C("ce_new_cracked_wall", "cracked peeling plaster wall house only five years old damp stains", "a five-year-old build already cracked and peeling", { at: "y ahora mira una construccion de hace apenas cinco anos" }),
    I("ce_damp_stain_wall", "ugly damp humidity stains spreading on a house wall interior", "cracked, flaking, with ugly damp stains", { at: "toda rajada y descascarada y con esas manchas feas de humedad" }),
    C("ce_why_this_happens", "man puzzled looking at cracked wall wondering why exterior", "and why does this happen?", { at: "y por que pasa esto" }),
    C("ce_material_not_magic", "old bag of cement and lime on a jobsite nothing magic close up", "it's not that the old material was magic", { at: "no es que el material de antes fuera magico" }),
    C("ce_old_masons_knew", "old experienced mason working a wall with trowel knew a secret", "the old masons knew something", { at: "los viejos albaniles sabian algo" }),
    C("ce_cement_factory_hide", "cement bags stacked in a factory warehouse industry rows", "something the cement factory would rather you didn't know", { at: "que la fabrica de cemento prefiere que vos no sepas" }),
    C("ce_sell_expensive_bag", "buying an expensive bag of cement at a hardware counter", "it suits them to sell you the bag and have you use it wrong", { at: "les conviene venderte la bolsa cara y que la uses mal" }),
    G("ce_tomas_hook", { kicker: "Por qué la pared de antes no se rajaba" }),
    I("ce_one_dollar_bill", "a single one dollar bill held in a working hand close up", "and what they knew costs you, literally, one dollar", { at: "te cuesta literalmente un dolar" }),
  ]},
  // ░░ 2) PROMESA — qué vas a aprender ░░
  { a: "asi que hoy te lo paso enterito", beats: [
    C("ce_pass_it_whole", "old mason teaching a younger one on a jobsite passing knowledge", "so today I hand it over whole", { at: "asi que hoy te lo paso enterito" }),
    C("ce_why_wall_cracks", "crack spreading across a plaster wall understanding why", "you'll understand why your wall cracks", { at: "vas a entender por que se te raja la pared" }),
    I("ce_lime_bag_ingredient", "bag of hydrated lime construction one dollar ingredient close up", "the one-dollar ingredient the old ones added to the mix", { at: "cual es ese ingrediente de un dolar" }),
    C("ce_almost_nobody_uses", "modern mason mixing plain cement no lime rushed jobsite", "and that almost nobody uses today", { at: "y que hoy ya casi nadie usa" }),
    C("ce_thirty_second_mistake", "mason making a quick careless mistake mixing cement 30 seconds", "and the 30-second mistake almost everyone makes", { at: "y tambien el error de 30 segundos" }),
    C("ce_ruins_best_cement", "expensive premium cement bag ruined by bad use jobsite", "that ruins even the most expensive cement", { at: "que te arruina hasta el cemento mas caro que compres" }),
    C("ce_wall_100_years", "very old stone and lime wall standing a hundred years intact", "the difference between a wall that lasts 100 years", { at: "una pared que te dura 100 anos" }),
    C("ce_wall_falls_apart", "modern wall crumbling and falling apart in chunks exterior", "and one that falls apart on you", { at: "y una que se te cae a pedazos" }),
  ]},
  // ░░ 3) EL CEMENTO NO SE SECA, SE CURA ░░
  { a: "y arranquemos por entender que es el cemento", beats: [
    C("ce_what_is_cement", "wet fresh cement being poured and worked on a jobsite close up", "let's start by understanding what cement is", { at: "y arranquemos por entender que es el cemento" }),
    C("ce_people_think_dries", "fresh cement left to dry in the sun like mud misconception", "a lot of people think cement dries", { at: "un monton de gente cree que el cemento se seca" }),
    I("ce_mud_dries_sun", "cracked dried mud in the sun ground pattern like clay", "you think it dries like mud in the sun", { at: "como el barro al sol" }),
    C("ce_that_is_a_lie", "cracked wall proving the drying idea wrong exterior", "and that's a lie, the mistake that costs you the wall", { at: "y eso es mentira" }),
    X({ kind: "diagram", at: "porque el cemento no se seca el cemento se cura", eyebrow: "El cemento no se seca: se cura", slides: [{ image: dg("dg_ce_cure", "Diagrama en corte de cemento fresco curandose: NO es que pierde agua al aire, sino que el agua ADENTRO reacciona quimicamente con el cemento formando cristales entrelazados que dan la dureza. A la izquierda 'MITO: se seca como el barro' con el agua evaporandose y quedando debil. A la derecha 'REAL: se cura' con gotas de agua adentro y cristales que crecen y traban. Etiquetas 'necesita agua adentro varios dias', 'reaccion quimica, no evaporacion'. Transmite que el agua es amiga, no enemiga."), eyebrow: "Reacción química con agua adentro, no evaporación" }] }),
    C("ce_chemical_reaction", "hardened cement setting like stone chemical curing macro", "it's a chemical reaction, it needs water inside for days", { at: "es una reaccion quimica" }),
    C("ce_dries_too_fast", "fresh cement drying too fast in hot sun weak surface", "if it dries too fast, it stays forever at half its strength", { at: "si se te seca demasiado rapido" }),
    I("ce_half_strength_forever", "weak crumbly cement surface low strength never recovers close up", "and never recovers it, not ever", { at: "no la recupera nunca mas" }),
  ]},
  // ░░ 4) EL CURADO — mojar la pared ░░
  { a: "y esto los viejos lo sabian en el cuerpo", beats: [
    C("ce_old_ones_knew_body", "old mason instinctively caring for a fresh wall jobsite", "the old ones knew this in their bones", { at: "y esto los viejos lo sabian en el cuerpo" }),
    C("ce_mason_wetting_wall", "mason wetting a fresh concrete block wall with a hose curing", "ever seen an old mason wetting the fresh wall day after day?", { at: "nunca viste a un albanil de los de antes que andaba mojando la pared" }),
    I("ce_bucket_wet_wall", "man splashing water from a bucket onto a new brick wall", "with a hose, or with a bucket", { at: "con la manguera o con un balde" }),
    C("ce_young_laughs_habit", "young worker laughing thinking it's an old man's quirk jobsite", "the younger one laughs, thinks it's an old man's quirk", { at: "y el mas joven se rie" }),
    C("ce_secret_number_one", "old mason confidently soaking a fresh wall the number one secret", "but it's no quirk: it's secret number one, and it's free", { at: "es el secreto numero uno y encima es gratis" }),
    I("ce_water_finishes_reaction", "water soaking into fresh cement finishing the reaction close up", "giving the cement the water it needs to finish the reaction", { at: "para terminar bien la reaccion" }),
    C("ce_hard_as_stone", "cured concrete wall hard as stone solid finished surface", "and end up hard as a stone", { at: "quedar duro como una piedra" }),
  ]},
  // ░░ 5) LA BOLSA NUNCA TE LO DICE — 7 días ░░
  { a: "y la bolsa de cemento nunca te lo dice", beats: [
    I("ce_cement_bag_instructions", "printed mixing instructions on a bag of cement close up", "the cement bag never tells you this", { at: "y la bolsa de cemento nunca te lo dice" }),
    C("ce_only_mixing_printed", "reading the small print on a cement sack mixing directions", "it prints how to mix it", { at: "te trae las instrucciones de como mezclarlo" }),
    C("ce_keep_it_moist", "keeping a fresh cement wall damp and moist after finishing", "but doesn't shout the one thing: keep it moist", { at: "lo tenes que mantener humedo" }),
    X({ kind: "diagram", at: "siete dias como minimo mojandolo la manana y a la tarde", eyebrow: "El curado: 7 días mínimo", slides: [{ image: dg("dg_ce_7days", "Diagrama tipo calendario de 7 dias en fila, cada dia con dos gotas de agua (una manana con sol suave, una tarde). Un albanil mojando la pared recien hecha. Arriba un gran '7 DIAS'. A un costado dos enemigos ilustrados: un SOL FUERTE y VIENTO con lineas, con una flecha que muestra que le chupan el agua al cemento y aparecen grietas. Etiquetas '7 dias minimo, manana y tarde', 'mas si hace calor o viento', 'el sol y el viento son los enemigos'. Transmite rutina simple y gratis."), eyebrow: "Mañana y tarde · más si hay sol o viento" }] }),
    C("ce_seven_days_minimum", "watering a new concrete wall morning and evening seven days", "seven days minimum, morning and evening", { at: "siete dias como minimo" }),
    C("ce_more_if_hot_windy", "hot sun and strong wind blowing over a drying wall jobsite", "and more if it's very hot or windy", { at: "y mas todavia si hace mucho calor o corre viento" }),
    C("ce_sun_wind_enemies", "strong sun and wind pulling moisture from fresh cement wall", "those two are the enemies: the strong sun and the wind", { at: "el sol fuerte y el viento" }),
    C("ce_cracks_appear", "cracks appearing all over a wall that dried too fast exterior", "and that's when all the cracks come out", { at: "y ahi es cuando te salen todas las grietas" }),
  ]},
  // ░░ 6) INJERTO 1 — la guía / manual ░░
  { a: "esto del curado es uno de los secretos que fui juntando en una guia", beats: [
    C("ce_curing_one_secret", "handwritten notebook of old building tricks and measures", "this curing thing is one of the secrets I gathered in a guide", { at: "esto del curado es uno de los secretos que fui juntando en una guia" }),
    C("ce_years_writing_tricks", "man writing down each old builder trick in a notebook years", "for years I wrote down each of these old-timers' tricks", { at: "yo durante anos me dedique a anotar cada uno de estos trucos de los viejos" }),
    I("ce_wood_no_rot_notes", "old wood beam that doesn't rot and a rusty iron bar notes", "the cement, the wood that doesn't rot, the wall that doesn't leak", { at: "el de la madera que no se pudre" }),
    C("ce_carpenter_mason_showed", "old carpenter and mason showing a craft trick on a jobsite", "each thing an old mason or carpenter showed me", { at: "cada cosa que un albanil o un carpintero viejo me llegaba a mostrar" }),
    I("ce_exact_measures_proportions", "handwriting exact measures and proportions each step repair", "with exact measures, proportions, every step", { at: "con las medidas exactas y las proporciones y cada paso" }),
    I("ce_forty_fixes_manual", "home repair manual with forty cheap fixes on a table", "I gathered 40 of those fixes in a single manual", { at: "termine juntando 40 de esos arreglos en un solo manual" }),
    C("ce_industry_hides_fixes", "industry preferring people not learn cheap repairs alone", "the one-to-five-dollar fixes the industry hides", { at: "que la industria preferiria que vos no sepas hacer solo" }),
  ]},
  // ░░ 7) LA CAL — el ingrediente de un dólar ░░
  { a: "el ingrediente de un dolar que es la cal", beats: [
    I("ce_lime_the_star", "open bag of hydrated lime white powder the star ingredient", "the star ingredient, the one-dollar one: lime", { at: "el ingrediente de un dolar que es la cal" }),
    C("ce_ask_lime_hardware", "asking for a bag of lime at a building supply yard corralon", "go to any yard, ask for a bag of lime, costs two coins", { at: "anda a cualquier corralon y pedi una bolsa de cal" }),
    C("ce_lime_in_every_mix", "old mason adding lime to mortar for plaster and bricks", "the old ones put it in nearly every mix", { at: "y eso es lo que los viejos le metian a casi toda mezcla" }),
    I("ce_lime_for_bricks", "laying bricks with lime mortar between them close up trowel", "to plaster, to lay bricks, for everything", { at: "para asentar los ladrillos" }),
    C("ce_industry_all_in_one", "modern all-in-one fast cement bags on a store shelf", "the industry sells all-in-one, pure fast cement", { at: "la industria te vende esas mezclas todo en uno" }),
    C("ce_sets_in_two_days", "fast cement setting hard in two days rushed jobsite", "it sets in two days so you keep working right away", { at: "que fragua en dos dias y te deja seguir la obra enseguida" }),
    C("ce_bad_for_the_wall", "convenient but poor fast cement cracking on a wall", "convenient for the rushed, but terrible for the wall", { at: "pero es pesimo para la pared" }),
  ]},
  // ░░ 8) POR QUÉ LA CAL ES MÁGICA — 3 razones ░░
  { a: "y por que la cal es tan magica", beats: [
    C("ce_why_lime_magic", "lime powder poured into mortar three reasons it works", "and why is lime so magic? For three reasons", { at: "y por que la cal es tan magica" }),
    I("ce_lime_flexible_mix", "flexible lime mortar bending slightly without cracking close up", "first: lime makes the mix much more flexible", { at: "la cal te hace la mezcla mucho mas flexible" }),
    C("ce_pure_cement_brittle", "cracked brittle pure cement panel like glass shattered", "pure cement is rigid, hard but brittle, like glass", { at: "el cemento puro es rigido es duro pero fragil" }),
    C("ce_movement_temp_cracks", "wall cracking from house movement and temperature change", "any movement or temperature change and it cracks", { at: "cualquier movimiento de la casa o cualquier cambio de temperatura y se te raja" }),
    C("ce_lime_lets_wall_move", "lime wall flexing slightly without breaking elasticity", "lime gives it elasticity to move a bit without breaking", { at: "la cal le da una elasticidad" }),
  ]},
  // ░░ 9) LA CAL SE CURA SOLA ░░
  { a: "la cal se cura sola", beats: [
    C("ce_lime_self_heals", "lime wall micro crack closing itself over time self healing", "second, incredible: lime cures itself", { at: "la cal se cura sola" }),
    X({ kind: "diagram", at: "cuando aparece una microfisura", eyebrow: "La cal sella la fisura sola", slides: [{ image: dg("dg_ce_selfheal", "Diagrama en tres pasos de una microfisura en una pared de cal que se sella sola. Paso 1: aparece una GRIETA CHIQUITA en la pared de cal. Paso 2: le entra HUMEDAD y AIRE (gotas y flechas), y la cal REACCIONA. Paso 3: con el tiempo la grieta se CIERRA sola, sellada. Al costado, en contraste, el CEMENTO PURO con una grieta que en vez de cerrarse se agranda cada vez mas. Etiquetas 'la cal reacciona con humedad y aire', 'vuelve a cerrar la grieta sola', 'el cemento puro solo se agranda'. Transmite el auto-reparado."), eyebrow: "Con humedad y aire, la cal vuelve a cerrarla" }] }),
    I("ce_micro_crack_humidity", "tiny hairline micro crack in a wall with moisture entering", "when a micro-crack appears and a bit of humidity and air get in", { at: "cuando aparece una microfisura" }),
    C("ce_lime_closes_crack", "lime reacting and closing a crack in a wall over time", "the lime reacts and closes that crack on its own", { at: "la cal reacciona" }),
    C("ce_seals_itself", "lime wall sealing its own crack self repairing surface", "it seals itself, a lime wall literally repairs itself", { at: "que se sella a si misma" }),
    C("ce_pure_cement_crack_grows", "small crack in pure cement growing bigger never stopping", "pure cement does none of that: a small crack keeps growing", { at: "una grieta chiquita se te va agrandando" }),
  ]},
  // ░░ 10) LA CAL DEJA RESPIRAR ░░
  { a: "y la tercera es que la cal deja respirar la pared", beats: [
    C("ce_lime_lets_breathe", "lime wall breathing letting moisture vapor pass outward", "and third: lime lets the wall breathe", { at: "y la tercera es que la cal deja respirar la pared" }),
    X({ kind: "diagram", at: "el cemento puro en cambio te sella todo", eyebrow: "La cal respira, el cemento atrapa", slides: [{ image: dg("dg_ce_breathe", "Diagrama comparativo de dos paredes en corte. Izquierda 'PARED DE CAL': porosa, con flechas de VAPOR de humedad saliendo para afuera, pared seca y sana. Derecha 'CEMENTO PURO': sellado, la humedad queda ATRAPADA adentro, y aparecen MANCHAS, SALITRE blanco y PINTURA que se hincha y se cae. Etiquetas 'la cal deja pasar el vapor', 'el cemento atrapa la humedad', 'manchas, salitre, pintura hinchada'. Transmite por que la pared de cal no se pudre."), eyebrow: "El cemento atrapa la humedad: manchas y salitre" }] }),
    I("ce_salitre_white_stain", "white efflorescence salitre and blistering paint on damp wall", "then come the stains, the white salitre, the paint that blisters", { at: "esas manchas y ese salitre blanco" }),
    C("ce_lime_wall_stays_dry", "healthy dry lime wall breathing not rotting inside", "the lime wall breathes, stays dry, doesn't rot inside", { at: "la pared de cal respira y se mantiene seca" }),
    C("ce_lime_walls_centuries", "hundreds of years old lime wall still standing solid", "there are lime walls hundreds of years old still standing", { at: "hay paredes de cal de hace cientos de anos que siguen paradas" }),
  ]},
  // ░░ 11) LOS ROMANOS — 2000 años ░░
  { a: "los romanos construian con cal", beats: [
    C("ce_romans_built_lime", "ancient roman concrete wall ruins colosseum standing", "the Romans built with lime, their works stand after 2000 years", { at: "los romanos construian con cal" }),
    I("ce_roman_ruins_intact", "roman aqueduct or pantheon dome intact after two thousand years", "two thousand years", { at: "despues de dos mil anos" }),
    C("ce_believe_crack_in_five", "modern wall cracking in just five years unbelievable", "and they want you to believe a wall cracking in five is normal", { at: "que una pared es normal que se raje en cinco" }),
    C("ce_not_time_problem", "old lime wall vs new cracked wall time is not the problem", "time isn't the problem", { at: "no es el tiempo el problema" }),
    C("ce_removed_lime_speed", "removing lime from the mix to sell speed pure cement", "they took the lime out to sell you speed", { at: "le sacaron la cal para poder venderte rapidez" }),
  ]},
  // ░░ 12) CÓMO SE USA — la proporción 1-1-6 ░░
  { a: "en lugar de hacer la mezcla solamente con cemento y arena", beats: [
    C("ce_cement_sand_only", "mixing plain cement and sand only on a jobsite shovel", "instead of just cement and sand", { at: "en lugar de hacer la mezcla solamente con cemento y arena" }),
    C("ce_add_the_lime", "adding a scoop of lime into the cement and sand mix", "you add the lime, a proportion that never fails", { at: "le sumas la cal" }),
    X({ kind: "diagram", at: "es una parte de cemento", eyebrow: "La proporción que nunca falla", slides: [{ image: dg("dg_ce_ratio", "Diagrama de la proporcion de mezcla con tres baldes o pilas en fila. 1 BALDE de CEMENTO (gris) etiquetado 'fuerza'. 1 BALDE de CAL (blanca) etiquetado 'flexible, respira, se repara'. 5 a 6 BALDES de ARENA (dorada) etiquetado 'relleno'. Arriba un titulo grande '1 : 1 : 5-6'. Una cuchara de albanil al costado. Etiquetas 'cemento para agarrar fuerza', 'cal para todo lo bueno', 'arena como relleno', 'sirve para revocar y para asentar'. Transmite receta simple y memorable."), eyebrow: "1 cemento · 1 cal · 5-6 arena" }] }),
    I("ce_one_part_cement", "one bucket of grey cement for the mix strength close up", "one part cement so it grabs strength", { at: "es una parte de cemento" }),
    C("ce_one_part_lime_sand", "one part lime and five parts sand measured in buckets", "one part lime, and five or six of sand", { at: "una parte de cal y una cinco o seis de arena" }),
    C("ce_sand_as_filler", "pile of construction sand shovel as filler in the mix", "the sand as filler", { at: "y la arena como relleno" }),
    C("ce_grandparents_houses", "old grandparents house still standing built with lime mortar", "and there's a reason our grandparents' houses still stand", { at: "las casas de nuestros abuelos siguen paradas" }),
  ]},
  // ░░ 13) LA ARENA — limpia y grano medio ░░
  { a: "y ahora vamos con la arena", beats: [
    C("ce_now_the_sand", "close up of a pile of construction sand being shoveled", "now the sand, it seems minor but it isn't at all", { at: "y ahora vamos con la arena" }),
    C("ce_sand_must_be_clean", "clean washed construction sand fine even grain close up", "the sand has to be clean", { at: "la arena tiene que estar limpia" }),
    I("ce_dirty_sand_roots", "dirty sand with soil clay and root debris weakens mix", "if it has soil, clay or roots, that dirt weakens the mix", { at: "porque si viene con tierra o con barro o con restos de raices" }),
    C("ce_old_ones_sieved_sand", "old mason sieving and washing sand with a screen before use", "the old ones washed it or sieved it before using it", { at: "por eso los viejos la lavaban o la zarandeaban" }),
    C("ce_medium_grain_sand", "even medium grain construction sand not too fine not coarse", "not too fine like dust, not too coarse: even, medium grain", { at: "ni tampoco muy gruesa" }),
    C("ce_bad_sand_ruins_mix", "poor gritty sand ruining an otherwise good mortar mix", "bad sand ruins even the best of mixes", { at: "una arena mala te arruina hasta la mejor de las mezclas" }),
  ]},
  // ░░ 14) EL ERROR — demasiada agua ░░
  { a: "y ahora si llegamos al error", beats: [
    C("ce_now_the_error", "mason about to make the big mixing mistake pouring water", "and now the mistake, the one that ruins even the priciest cement", { at: "y ahora si llegamos al error" }),
    C("ce_error_is_water", "pouring too much water into a cement mix in a wheelbarrow", "the error is water: putting too much water in the mix", { at: "el error es el agua meterle demasiada agua a la mezcla" }),
    C("ce_soupy_easy_mix", "runny soupy wet mortar easy to spread with a trowel", "people over-water so it's soft and easy to spread", { at: "porque asi la mezcla queda bien blandita y chirle" }),
    C("ce_comfortable_poison", "comfortable to work but ruinous over-watered cement mix", "comfortable to work, and it's poison", { at: "comoda para trabajar y es veneno" }),
    X({ kind: "diagram", at: "cuando el cemento cura se termina evaporando", eyebrow: "El agua de más te deja aire adentro", slides: [{ image: dg("dg_ce_water", "Diagrama comparativo en corte de dos paredes. Izquierda 'MEZCLA FIRME': llena de PIEDRA solida, densa, fuerte. Derecha 'MEZCLA CON AGUA DE MAS': cuando el agua sobrante se EVAPORA al curar, deja HUECOS, POROS y BURBUJAS por dentro, una pared llena de AIRE. Flechas de agua evaporandose dejando agujeros. Etiquetas 'firme = llena de piedra', 'agua de mas = llena de aire, debil y porosa', 'chupa humedad y se raja al primer frio'. Transmite piedra vs aire."), eyebrow: "Se evapora y deja huecos, poros y burbujas" }] }),
    I("ce_holes_pores_inside", "porous cement full of holes air pockets and bubbles inside", "all that extra water evaporates and leaves holes and pores inside", { at: "y te deja huecos y poros y burbujas por dentro" }),
    C("ce_wall_full_of_air", "weak porous wall full of air instead of stone cross section", "a wall full of air instead of stone", { at: "en vez de estar llena de piedra esta llena de aire" }),
    C("ce_cracks_first_cold", "porous wall cracking at the first cold snap winter exterior", "weak, porous, cracks at the first cold", { at: "se te raja el primer frio que venga" }),
  ]},
  // ░░ 15) LA MEZCLA SECA Y FIRME ░░
  { a: "la mezcla en realidad tiene que quedar mas bien seca y firme", beats: [
    I("ce_firm_dry_mix_trowel", "stiff firm mortar holding on a trowel without dripping", "the mix should be drier and firm, holding on the trowel", { at: "la mezcla en realidad tiene que quedar mas bien seca y firme" }),
    C("ce_more_arm_work", "mason working stiff mortar harder sweating a bit more effort", "yes, it takes more arm to work it that way", { at: "te cuesta un poco mas de brazo trabajarla asi" }),
    C("ce_stone_vs_air_wall", "solid stone wall versus a weak airy porous wall compared", "that's the difference between a stone wall and an air wall", { at: "una pared de piedra y una pared de aire" }),
    C("ce_old_ones_sweated", "old masons working hard firm mortar their walls still standing", "the old ones made it hard on purpose, and their walls still stand", { at: "los viejos la hacian dura a proposito" }),
  ]},
  // ░░ 16) REPASO / PLAN COMPLETO ░░
  { a: "hagamos un repaso rapido de todo el plan completo", beats: [
    C("ce_quick_recap_plan", "mason reviewing the full plan before mixing next batch", "let's do a quick recap, the complete plan", { at: "hagamos un repaso rapido de todo el plan completo" }),
    C("ce_first_cement_cures", "watering a fresh wall remembering cement cures not dries", "first: cement doesn't dry, it cures", { at: "el cemento no se seca sino que se cura" }),
    C("ce_wet_wall_seven_days", "wetting the fresh wall morning and evening for seven days", "so wet the fresh wall seven days, morning and evening", { at: "asi que moja la pared recien hecha durante siete dias" }),
    C("ce_second_add_lime", "adding lime to the mix second step of the plan", "second: add the lime to the mix", { at: "lo segundo es meterle la cal a la mezcla" }),
    C("ce_ratio_one_one_six", "measuring one cement one lime five sand proportion buckets", "with that one cement, one lime, five or six sand ratio", { at: "con esa proporcion de una de cemento una de cal y cinco o seis de arena" }),
    C("ce_third_clean_sand", "using clean even grain sand no soil third step recap", "third: clean, even-grain sand, no dirt", { at: "lo tercero es usar arena linca y de grano parejo" }),
    C("ce_fourth_never_water", "never overdoing the water firm mix fourth step of the plan", "and fourth, the error: never overdo the water", { at: "es no pasarte nunca con el agua" }),
    C("ce_less_water_more_stone", "firm self-supporting mortar less water more stone strength", "firm mix that holds itself: less water, more stone", { at: "mezcla firme que se sostenga sola" }),
  ]},
  // ░░ 17) CIERRE — la industria / manual ░░
  { a: "y antes de que te vayas dejame cerrar con esto", beats: [
    C("ce_before_you_go_close", "old mason speaking directly to camera closing thought jobsite", "before you go, let me close with this", { at: "y antes de que te vayas dejame cerrar con esto" }),
    C("ce_lime_curing_water", "lime bag hose and firm mortar the three lessons together", "the lime, the curing, the right water: knowledge that worked", { at: "todo lo que viste hoy la cal y el curado y el agua justa" }),
    C("ce_lost_being_too_good", "old building knowledge fading lost because it was too good", "it wasn't lost for being bad, but for being too good and cheap", { at: "se perdio justamente por ser demasiado bueno y demasiado barato" }),
    C("ce_wall_hundred_years_dollar", "hundred year wall anyone can build with a one dollar lime bag", "industry hates a wall that lasts 100 years for a dollar of lime", { at: "una pared que dura cien anos" }),
    C("ce_sell_expensive_fast", "expensive fast cement that cracks right on time to resell", "they'd rather sell the pricey fast one that cracks on schedule", { at: "venderte el producto caro y rapido" }),
    I("ce_manual_constructor_libre", "the Constructor Libre home building manual on a workbench cover", "that's why I gathered the 40 secrets in the Constructor Libre Manual", { at: "que es el manual del constructor libre" }),
    C("ce_no_depend_on_anyone", "independent builder not needing hardware store or specialist", "so you don't depend on anyone, not the yard, not the specialist", { at: "lo arme para que no dependas de nadie" }),
    C("ce_next_water_out_wall", "old trick keeping water out of a wall lime render dry house", "next: the old secret to keep water out of a wall for good", { at: "para que el agua no entre nunca mas a una pared" }),
    C("ce_independence_built", "self-reliant builder one fix at a time constructing independence", "independence isn't bought, it's built, one fix at a time", { at: "la independencia no se compra se construye" }),
  ]},
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
const OVL = [
  // ── HOOK — vieja sana vs nueva rajada ──
  { kind: "oxbefore", at: "y ahora mira una construccion de hace apenas cinco anos", dur: 4.6, before: "real/ce_old_wall_no_crack.png", after: "real/ce_damp_stain_wall.png", accent: "red" },
  // ── PROMESA — 100 años vs se cae a pedazos ──
  { kind: "oxstat", at: "una pared que te dura 100 anos", dur: 4.2, value: 100, suffix: " años", label: "vs una que se raja en 5: la diferencia no es la plata, es lo que sabés", glyph: "🧱", accent: "green" },
  // ── EL CEMENTO SE CURA ──
  { kind: "oxrule", at: "porque el cemento no se seca el cemento se cura", dur: 4.6, text: "El cemento *no se seca*: se *cura*. Es una reacción química que necesita agua adentro.", accent: "amber" },
  // ── EL CURADO ──
  { kind: "oxrule", at: "es el secreto numero uno y encima es gratis", dur: 4.4, text: "Mojá la pared recién hecha, día tras otro. Es el secreto Nº1 y encima es *gratis*.", accent: "green" },
  { kind: "oxstat", at: "siete dias como minimo", dur: 4.4, value: 7, suffix: " días", label: "curando la pared, mañana y tarde: más si hay sol fuerte o viento", glyph: "💧", accent: "blue" },
  { kind: "oxside", at: "el sol fuerte y el viento", dur: 5.0, image: "real/ce_sun_wind_enemies.png", title: "Los enemigos del curado", lines: ["El sol fuerte le chupa el agua", "El viento la evapora", "Sin agua adentro: aparecen las grietas"], side: "right", accent: "red" },
  // ── INJERTO 1 — manual (mid, sin chip) ──
  { kind: "manualcard", at: "esto del curado es uno de los secretos que fui juntando en una guia", dur: 6.0, image: "real/manual_cover.png", title: "Manual del Constructor Libre", desc: "Los 40 arreglos de $1 a $5 del hogar, con los pasos y las medidas exactas.", accent: "amber" },
  // ── LA CAL — ingrediente de un dólar ──
  { kind: "oxtag", at: "el ingrediente de un dolar que es la cal", dur: 4.2, name: "La cal", what: "El ingrediente de un dólar que los viejos le metían a casi toda mezcla", side: "left", accent: "green" },
  { kind: "oxside", at: "y por que la cal es tan magica", dur: 5.4, image: "real/ce_lime_bag_ingredient.png", title: "Lo que la cal te da", lines: ["Flexible: la pared se mueve sin partirse", "Se auto-repara: sella la fisura sola", "Deja respirar: no atrapa la humedad"], side: "right", accent: "green" },
  // ── SE CURA SOLA ──
  { kind: "oxrule", at: "que se sella a si misma", dur: 4.4, text: "Una pared con cal *se repara sola*: sella la microfisura. El cemento puro solo la agranda.", accent: "green" },
  // ── LOS ROMANOS ──
  { kind: "oxstat", at: "despues de dos mil anos", dur: 4.2, value: 2000, suffix: " años", label: "las obras romanas de cal siguen enteras: no es el tiempo, es la cal", glyph: "🏛️", accent: "amber" },
  // ── LA PROPORCIÓN ──
  { kind: "oxmethod", at: "es una parte de cemento", dur: 4.8, num: "1·1·6", title: "La proporción que nunca falla", chips: ["1 de cemento: fuerza", "1 de cal: lo bueno", "5-6 de arena: relleno"], cost: "$1 la cal", accent: "green" },
  // ── LA ARENA ──
  { kind: "oxrule", at: "la arena tiene que estar limpia", dur: 4.4, text: "Arena *limpia* y de grano *parejo*. La tierra y las raíces te debilitan la mezcla.", accent: "blue" },
  // ── EL ERROR — agua de más ──
  { kind: "oxrule", at: "el error es el agua meterle demasiada agua a la mezcla", dur: 4.8, text: "El error más común: *demasiada agua*. Cómoda de tirar, pero es veneno para la pared.", accent: "red" },
  { kind: "oxstat", at: "en vez de estar llena de piedra esta llena de aire", dur: 4.2, value: 0, prefix: "Aire", suffix: "", label: "el agua de más se evapora y deja huecos: pared débil, porosa, que se raja", glyph: "🫧", accent: "red" },
  // ── MEZCLA FIRME ──
  { kind: "oxrule", at: "los viejos la hacian dura a proposito", dur: 4.4, text: "Mezcla *seca y firme* que se sostenga sola. Cuanta menos agua, más piedra vas a tener.", accent: "amber" },
  // ── CIERRE ──
  { kind: "manualcard", at: "el link lo tenes abajo en la descripcion y en el comentario que deje fijado", dur: 6.0, image: "real/manual_cover.png", title: "Manual del Constructor Libre", desc: "Los 40 arreglos, incluido el de la cal y el curado, con las medidas exactas.", chip: "Accedé en la descripción", accent: "amber" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── MAXIMUM DENSITY: imágenes ancladas en CADA mini-frase del shotlist aún sin cubrir ──
// [name, query EN visual, concept resuelto al contexto, frase ancla exacta de captions]
const FILL = [
  // ── COLD OPEN ──
  ["ce_fill_material_before", "old bag of cement on a jobsite the material of before close up", "it's not that the material of before was magic", "no es que el material de antes fuera magico"],
  ["ce_fill_verdad_no_conviene", "cement industry counter sale it doesn't suit them to tell you", "the truth is it doesn't suit them", "porque la verdad es que no le conviene"],
  ["ce_fill_use_bag_wrong", "worker misusing cement from an expensive bag jobsite", "sell you the bag and have you use it wrong", "y que la uses mal"],
  ["ce_fill_fix_all_again", "cracked wall being torn down and redone five years later", "in five years you fix it all again and buy again", "arreglar todo de nuevo y volves a comprar"],
  // ── PROMESA ──
  ["ce_fill_ingredient_mix", "adding a scoop of lime into a mortar mix on a jobsite", "the ingredient the old ones put in the mix", "que los viejos le metian a la mezcla"],
  ["ce_fill_stay_until_end", "old mason gesturing keep watching until the end jobsite", "stay until the end, that last point makes the difference", "quedate hasta el final"],
  ["ce_fill_first_deception", "reading a bag of cement realizing the first trick close up", "let's understand cement, here's the first deception", "porque aca ya esta el primer engano"],
  // ── EL CEMENTO SE CURA ──
  ["ce_fill_throw_it_wait", "throwing fresh cement and waiting for it to dry misconception", "you throw it and wait for it to dry", "o sea que lo tiras"],
  ["ce_fill_costs_you_wall", "cracked wall the mistake that costs you the whole wall", "and that's the mistake that will cost you the wall", "el error que te va a costar la pared"],
  ["ce_fill_water_days_strength", "water soaking into curing cement gaining full strength days", "it needs water inside for days to grab all its strength", "para agarrar toda su fuerza"],
  ["ce_fill_half_resistance", "weak low strength cement stuck at half its resistance forever", "it stays forever at half the resistance it should have", "con la mitad de la resistencia que tendria que tener"],
  // ── EL CURADO ──
  ["ce_fill_day_after_day", "mason wetting a fresh wall day after day with a hose", "wetting the fresh wall a day after the other", "un dia tras otro"],
  ["ce_fill_not_a_quirk", "old mason soaking a wall proving it's no old-man quirk", "but it's no quirk", "pero no es ninguna mania"],
  ["ce_fill_giving_the_water", "hose giving fresh cement the water it needs to react", "what he's doing is giving the cement the water it needs", "lo que esta haciendo es darle al cemento el agua que necesita"],
  // ── LA BOLSA / 7 DÍAS ──
  ["ce_fill_never_shouts", "small print on cement bag never shouting the key thing", "it doesn't shout the one thing that really matters", "lo unico que de verdad importa"],
  ["ce_fill_before_it_cures", "sun and wind pulling water before the cement can cure", "they suck the water from the cement before it cures", "antes de que llegue a curar"],
  // ── INJERTO 1 ──
  ["ce_fill_wall_no_leak", "old lime rendered wall that doesn't leak water notebook", "the wall that doesn't leak, the iron that doesn't rust", "el de la pared que no filtra"],
  ["ce_fill_iron_no_rust", "old iron bar treated so it doesn't rust builder trick", "the iron that doesn't rust", "el del hierro que no se oxida"],
  ["ce_fill_link_below_pinned", "phone showing link in description and pinned comment guide", "the link is below, in the description and pinned comment", "el link esta abajo en la descripcion y en el comentario que deje fijado"],
  // ── LA CAL ──
  ["ce_fill_two_coins_bag", "a cheap bag of lime costing two coins at a supply yard", "a bag of lime that costs you two coins", "que te va a salir dos monedas"],
  ["ce_fill_to_plaster", "mason plastering a wall with lime mortar smooth render", "to plaster, to lay bricks, for everything", "para revocar"],
  ["ce_fill_nobody_uses_now", "modern jobsite where almost nobody uses lime anymore", "and today almost nobody uses it", "y hoy ya casi nadie la usa"],
  ["ce_fill_rushed_worker", "worker in a hurry choosing fast pure cement convenient", "convenient for whoever's in a rush", "que es comodo para el que anda con apuro"],
  // ── POR QUÉ LA CAL ──
  ["ce_fill_three_reasons", "lime poured into mortar three reasons it changes the house", "for three reasons that change the whole house", "por tres razones que te cambian la casa entera"],
  ["ce_fill_move_without_break", "lime wall flexing slightly moving without splitting apart", "lets the wall move a little without splitting", "moverse un poquito sin llegar a partirse"],
  ["ce_fill_second_incredible", "lime wall micro crack sealing itself second incredible reason", "the second is incredible: lime cures itself", "la segunda es increible"],
  ["ce_fill_repairs_itself", "lime wall literally repairing its own crack over time", "a lime wall literally repairs itself", "una pared hecha con cal literalmente se repara sola"],
  // ── RESPIRAR ──
  ["ce_fill_vapor_outward", "moisture vapor passing outward through a breathing lime wall", "it lets the moisture vapor pass outward", "el vapor de la humedad para afuera"],
  ["ce_fill_traps_humidity", "pure cement wall sealing and trapping humidity inside damp", "pure cement seals it all and traps the humidity inside", "y te atrapa la humedad adentro"],
  ["ce_fill_paint_blisters", "paint blistering swelling and falling off a damp cement wall", "the paint that blisters and ends up falling", "esa pintura que se hincha y se termina cayendo"],
  ["ce_fill_no_rot_inside", "healthy dry lime wall not rotting from the inside", "stays dry and doesn't rot inside", "y no se te pudre por dentro"],
  // ── ROMANOS ──
  ["ce_fill_hundreds_years", "hundreds of years old lime wall still standing solid", "there are lime walls hundreds of years old still up", "de hace cientos de anos que siguen paradas"],
  ["ce_fill_two_thousand_years", "roman ruins standing whole after two thousand years intact", "two thousand years", "dos mil anos"],
  // ── PROPORCIÓN ──
  ["ce_fill_never_fails_ratio", "a mortar proportion that never fails for plaster and bricks", "a proportion that never fails, for plaster and for laying", "una proporcion que nunca te falla"],
  ["ce_fill_cement_grabs", "grey cement giving the mix its strength grabbing hard", "a bit of cement so it grabs strength", "un poco de cemento para que agarre fuerza"],
  ["ce_fill_same_mix_always", "the same lime mortar mix masons used their whole lives", "that same mix masons used all their lives", "esa misma mezcla la usaron los albaniles toda la vida"],
  // ── ARENA ──
  ["ce_fill_seems_minor", "a pile of sand that seems a minor detail but isn't jobsite", "it seems a minor detail and it isn't at all", "que parece un detalle sin importancia y no lo es para nada"],
  ["ce_fill_dirt_weakens", "soil and clay in sand weakening the mortar mix close up", "all that dirt weakens the mix", "toda esa suciedad te debilita la mezcla"],
  ["ce_fill_not_like_dust", "very fine dusty sand not good for mortar too powdery", "not too fine like dust", "ni muy fina como si fuera polvo"],
  ["ce_fill_dont_neglect_it", "checking sand quality carefully don't neglect it jobsite", "so don't neglect it", "asi que no la descuides"],
  // ── ERROR / AGUA ──
  ["ce_fill_most_common_all", "over-watering the mix the most common mistake of all", "pay attention, it's the most common of all", "es el mas comun de todos"],
  ["ce_fill_easy_to_throw", "runny wet mortar easy to throw and smooth with trowel", "easy to throw and smooth with the trowel", "y facil de tirar y de emparejar con la cuchara"],
  ["ce_fill_weak_and_porous", "weak porous cement wall sucking humidity cross section", "weak and porous, it sucks up humidity", "asi que es debil y porosa y te chupa la humedad"],
  ["ce_fill_holds_no_drip", "firm mortar holding itself on the trowel without dripping", "that holds itself on the trowel without dripping", "que se sostenga sola en la cuchara sin chorrear"],
  ["ce_fill_walls_still_up", "old masons' firm walls still standing there today exterior", "and that's why their walls are still standing there", "y por eso las paredes de ellos siguen ahi paradas"],
  // ── REPASO ──
  ["ce_fill_free_changes_most", "free wall watering the thing that changes the result most", "it's free and it's what changes the result most", "es gratis y es lo que mas te va a cambiar el resultado"],
  ["ce_fill_dollar_a_bag", "one dollar bag of lime cheap ingredient for the mix", "and it costs barely a dollar a bag", "y te cuesta apenas un dolar la bolsa"],
  ["ce_fill_four_things_no_crack", "four simple steps a wall that doesn't crack recap jobsite", "with those four things, your wall doesn't crack", "y con esas cuatro cosas no mas tu pared no se raja"],
  ["ce_fill_neighbor_picks_cracks", "neighbor chipping his wall to patch cracks five years later", "the neighbor will be chipping it all to patch cracks", "va a estar picando todo para tapar las grietas"],
  ["ce_fill_its_what_you_know", "confident builder the difference is what you know not money", "the difference was never money, it's what you know", "esta en lo que sabes"],
  // ── CIERRE ──
  ["ce_fill_proven_generations", "old building knowledge proven over whole generations lime", "knowledge proven over whole generations, and lost", "durante generaciones enteras y se perdio"],
  ["ce_fill_too_durable", "too good too cheap too durable old method being buried", "lost for being too good, too cheap, too durable", "demasiado bueno y demasiado barato y demasiado duradero"],
  ["ce_fill_hardware_corralon", "not depending on the hardware store or the supply yard", "not the hardware store, not the yard, not the one who overcharges", "ni de la ferreteria ni del corralon"],
  ["ce_fill_less_than_a_bag", "the manual costing less than a single bag of pricey cement", "it costs less than one bag of the expensive cement, with a guarantee", "y te sale menos que una sola bolsa del cemento caro y encima tiene garantia"],
  ["ce_fill_water_from_rain", "old trick keeping rain water out of a wall lime render", "so water never gets in, from rain outside or damp rising", "ni por la lluvia de afuera ni por la humedad que sube desde abajo"],
  ["ce_fill_lime_render_dry", "lime render keeping a house dry inside for decades trick", "the lime and render trick that keeps the house dry for decades", "el truco de la cal y del reboque que te mantiene la casa seca por dentro durante decadas"],
  ["ce_fill_one_fix_at_time", "self-reliant builder one fix at a time see you next time", "one fix at a time, see you in the next one", "un arreglo a la vez"],
];
for (const [name, query, concept, ph] of FILL) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 3, kind: "raw", src: `real/${name}.png`, darken: 0, hue: HUES[Math.round(s) % 3] }); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── BURSTS extra (oxstack) para flashes sub-1s en momentos de lista ──
const BURSTS = [
  { at: "por tres razones que te cambian la casa entera", images: ["real/ce_lime_flexible_mix.png", "real/ce_lime_self_heals.png", "real/ce_lime_lets_breathe.png"], captions: ["Flexible", "Se cura sola", "Deja respirar"], accent: "green" },
  { at: "es una parte de cemento", images: ["real/ce_one_part_cement.png", "real/ce_lime_bag_ingredient.png", "real/ce_sand_as_filler.png"], captions: ["1 cemento", "1 cal", "5-6 arena"], accent: "amber" },
  { at: "hagamos un repaso rapido de todo el plan completo", images: ["real/ce_wet_wall_seven_days.png", "real/ce_add_the_lime.png", "real/ce_firm_dry_mix_trowel.png"], captions: ["Curá 7 días", "Metele cal", "Mezcla firme"], accent: "blue" },
];
for (const b of BURSTS) { const s = atc(b.at); if (s == null) continue; beats.push({ id: `burst_${Math.round(s)}`, start: +s.toFixed(2), dur: 4.2, kind: "oxstack", overlay: true, hue: "amber", images: b.images, captions: b.captions, accent: b.accent }); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados (gate de variedad: ≥6 tipos, ≥6% peso, bars≥2) ──
const STRUCT = [
  { kind: "vs", at: "una que se te cae a pedazos", hue: "amber", title: "Cuánto te dura la pared", left: { label: "Con cal", value: "100 años", sub: "la pared de los viejos", good: true }, right: { label: "Sin cal", value: "5 años", sub: "y ya se raja" } },
  { kind: "vs", at: "si se te seca demasiado rapido", hue: "red", title: "El cemento no se seca, se cura", left: { label: "Curada 7 días", value: "100% fuerza", sub: "dura como piedra", good: true }, right: { label: "Seca muy rápido", value: "la mitad", sub: "débil para siempre" } },
  { kind: "vs", at: "en vez de estar llena de piedra esta llena de aire", hue: "red", title: "El agua de la mezcla", left: { label: "Mezcla firme", value: "llena de piedra", sub: "fuerte y sana", good: true }, right: { label: "Agua de más", value: "llena de aire", sub: "porosa, se raja" } },
  { kind: "process", at: "es el secreto numero uno y encima es gratis", hue: "blue", title: "El curado, paso a paso", eyebrow: "Gratis, y es lo que más cambia el resultado", steps: [{ title: "Mojá la pared recién hecha", desc: "a la mañana y a la tarde, con manguera o balde" }, { title: "Siete días mínimo", desc: "más todavía si hace calor o corre viento" }, { title: "Queda dura como piedra", desc: "el agua adentro termina la reacción química" }] },
  { kind: "process", at: "en lugar de hacer la mezcla solamente con cemento y arena", hue:"cold", title: "La mezcla con cal", eyebrow: "La proporción que nunca falla", steps: [{ title: "1 parte de cemento", desc: "para que la mezcla agarre fuerza" }, { title: "1 parte de cal", desc: "flexible, se auto-repara y deja respirar la pared" }, { title: "5 a 6 partes de arena", desc: "limpia y de grano parejo, como relleno" }] },
  { kind: "aged", at: "porque el cemento no se seca el cemento se cura", hue: "amber", heading: "EL PRIMER ENGAÑO", eyebrow: "El cemento no se seca: se cura", lines: ["No se seca como el barro al sol", "Es una reacción química con agua adentro", { text: "Si se seca rápido, pierde la mitad de su fuerza", mark: true }] },
  { kind: "aged", at: "el error es el agua meterle demasiada agua a la mezcla", hue: "red", heading: "EL ERROR MÁS COMÚN", eyebrow: "Demasiada agua = una pared de aire", lines: ["Queda blandita y cómoda de tirar", "El agua de más se evapora y deja huecos", { text: "Pared débil y porosa que se raja al primer frío", mark: true }] },
  { kind: "callout", at: "te cuesta literalmente un dolar", figure: "$1", caption: "Lo que los viejos sabían te cuesta, literalmente, un dólar.", accent: "good", image: "real/ce_one_dollar_bill.png" },
  { kind: "callout", at: "quedar duro como una piedra", figure: "El curado", caption: "Darle al cemento el agua para terminar la reacción y quedar duro como piedra.", accent: "cold", image: "real/ce_water_finishes_reaction.png" },
  { kind: "callout", at: "que se sella a si misma", figure: "Se repara sola", caption: "Una pared de cal sella la microfisura ella sola con la humedad y el aire.", accent: "good", image: "real/ce_seals_itself.png" },
  { kind: "callout", at: "esa pintura que se hincha y se termina cayendo", figure: "Salitre", caption: "El cemento puro atrapa la humedad: salitre, manchas y pintura que se cae.", accent: "danger", image: "real/ce_salitre_white_stain.png" },
  { kind: "callout", at: "que una pared es normal que se raje en cinco", figure: "2000 años", caption: "Las obras romanas de cal siguen enteras. No es el tiempo: es la cal.", accent: "good", image: "real/ce_roman_ruins_intact.png" },
  { kind: "callout", at: "una arena mala te arruina hasta la mejor de las mezclas", figure: "Arena limpia", caption: "Con tierra o raíces, la arena te arruina hasta la mejor de las mezclas.", accent: "danger", image: "real/ce_dirty_sand_roots.png" },
  { kind: "checklist", at: "hagamos un repaso rapido de todo el plan completo", hue: "blue", title: "El plan completo", items: [{ text: "Curá: mojá la pared 7 días, mañana y tarde", state: "done" }, { text: "Metele cal: 1 cemento, 1 cal, 5-6 arena", state: "done" }, { text: "Arena limpia y de grano parejo, sin tierra", state: "done" }, { text: "Nunca te pases con el agua: mezcla firme", state: "done" }, { text: "Menos agua, más piedra vas a tener", state: "done" }] },
  { kind: "callout", at: "una pared que dura cien anos", figure: "La industria", caption: "No le sirve una pared que dura 100 años y se hace con $1 de cal.", accent: "danger", image: "real/ce_wall_hundred_years_dollar.png" },
  { kind: "callout", at: "que es el manual del constructor libre", figure: "40 arreglos", caption: "Los 40 secretos de los viejos en el Manual del Constructor Libre.", accent: "good", image: "real/ce_manual_constructor_libre.png" },
  { kind: "splitlist", at: "por tres razones que te cambian la casa entera", title: "Lo que la cal te da", items: ["Flexible: la pared se mueve sin rajarse", "Se cura sola: sella la microfisura", "Deja respirar: no atrapa la humedad", "Cuesta apenas un dólar la bolsa"], palette: "A" },
  { kind: "cross", at: "es una parte de cemento", hue:"amber", title: "La mezcla, en 3 ingredientes", eyebrow: "1 : 1 : 5-6", layers: [{ label: "Cemento (1)", depth: "para que agarre fuerza", color: "#8a8f96" }, { label: "Cal (1)", depth: "flexible, respira, se repara", color: "#e8e2d2" }, { label: "Arena (5-6)", depth: "limpia, grano parejo, relleno", color: "#c9a25f" }] },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); beats.push(beat); }
beats.sort((a, b) => a.start - b.start);

fs.mkdirSync("public/broll", { recursive: true }); fs.mkdirSync("public/real", { recursive: true }); fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(`public/broll/match_${SLUG}.json`, JSON.stringify(MATCH, null, 2));
fs.writeFileSync(`public/real/bing_${SLUG}.json`, JSON.stringify(BING, null, 2));
fs.writeFileSync(`public/img/prompts_${SLUG}_diag.json`, JSON.stringify(DIAGRAMS, null, 2));
if (MODE === "match") { console.log(`=== build_cemento MATCH ===`); console.log(`match ${MATCH.length} · bing ${BING.length} · diag ${DIAGRAMS.length} · proxy ${(2 * MATCH.length / 6).toFixed(0)}/IP`); process.exit(0); }
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
// cobertura por beats raw; en huecos SIN clip el avatar va FULL (nunca negro)
const cov = beats.filter((b) => b.kind === "raw").map((b) => [b.start, b.start + b.dur]).sort((a, b) => a[0] - b[0]);
const covered = (t) => cov.some(([s, e]) => t >= s - 1e-6 && t < e - 1e-6);
const modeAt = (t) => { if (t < firstClip - 1e-6) return "full"; if (inAvf(t)) return "full"; if (!covered(t)) return "full"; const p = pip.find(([s, e]) => t >= s - 1e-6 && t < e - 1e-6); return p ? p[2] : "hidden"; };
const pts = [...new Set([0, firstClip, ...AVF.flat(), ...pip.flatMap((p) => [p[0], p[1]]), ...cov.flat(), TOTAL].map((x) => +(+x).toFixed(2)))].sort((a, b) => a - b);
const windows = []; let cur = null;
for (const t of pts) { if (t >= TOTAL - 1e-6) break; const m = modeAt(t); if (m !== cur) { windows.push({ start: +t.toFixed(2), mode: m }); cur = m; } }
windows.push({ start: TOTAL, mode: "hidden" });
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`);
const avSecs = AVF.reduce((a, [s, e]) => a + (e - s), 0);
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const rawN = beats.filter((b) => b.kind === "raw").length;
console.log(`=== build_cemento BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips ${nClip} · imgs ${nReal} · gpt ${nImg} · faltan ${nMiss} · dur ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full ${(avSecs / 60).toFixed(1)}min · PiP ${pip.length} · windows ${windows.length} · MATCH ${MATCH.length} · BING ${BING.length} · DIAG ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}`);
