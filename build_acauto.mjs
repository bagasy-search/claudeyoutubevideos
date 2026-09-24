// build_acauto.mjs — CLIPS-FIRST DENSO (Constructor Libre, "El Constructor Libre").
// Tema: CARGAR EL AIRE ACONDICIONADO DEL AUTO UNO MISMO (cuando enfría poco / tira caliente).
// Avatar Tomás + b-roll dominante REAL: clips YouTube (matchfarm proxies) + cientos de imágenes
// web (fetch_bing). AI solo diagramas. Queries ANALIZADAS del guion (específicas, EN inglés,
// ancladas al TEMA: aire de auto / recarga de gas / manómetro / compresor / fuga UV / R134a).
// Pacing ~4-4.5s (denso). REGLA #0: cada beat al ms exacto. Clonado de build_madera.mjs.
// Modos:  node build_acauto.mjs match  |  node build_acauto.mjs
import fs from "fs";

const SLUG = "acauto";
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
  // ░░ 1) COLD OPEN — el horno vs la heladera (30° → 6°) ░░
  { a: "mira bien esto", start: 0, beats: [
    C("ac_hot_car_summer_interior", "hot car interior in summer heat driver sweating dashboard", "January, 35°C in the shade, the car is an oven", { at: "enero 35 grados a la sombra" }),
    C("ac_vent_blowing_warm_air", "car ac vent blowing warm air hand feeling dashboard vents", "you crank the AC and warm air comes out of the vents", { at: "prendes el aire lo pones al maximo" }),
    C("ac_hand_feeling_no_cold", "hand held to car vent feeling no cold air disappointment", "you put your hand there and it doesn't cool at all", { at: "o tibio que es lo mismo" }),
    C("ac_mechanic_expensive_invoice", "mechanic handing an expensive invoice car ac diagnosis worried", "the mechanic comes out saying you have to recharge the gas", { at: "y a la media hora sale el tipo con cara de medico" }),
    C("ac_mechanic_says_compressor", "mechanic pointing at car ac compressor saying it must be replaced", "or worse: it's the compressor, has to be replaced", { at: "o peor mira es el compresor hay que cambiarlo" }),
    C("ac_shocking_quote_paper", "shocked man reading a high car repair estimate sitting down", "and hands you a quote that sits you down in the chair", { at: "te pasa un presupuesto que te sienta en la silla" }),
    C("ac_pay_kids_in_back_summer", "family paying car mechanic kids in the back seat summer", "and you pay, because the kids are in the back, because it's summer", { at: "y vos pagas" }),
    C("ac_cold_air_thermometer_vent", "thermometer in car vent showing very cold air blowing again", "this same car, blowing cold again in 20 minutes", { at: "lo deje soplando frio de nuevo" }),
    C("ac_gas_can_gauge_curb", "car ac recharge can with gauge and hose on the curb", "no shop, just a little tool and a can from the parts store", { at: "con un fierrito y una lata" }),
    G("ac_tomas_hook", { kicker: "Lo que el taller no te quiere contar" }),
  ]},
  // ░░ 2) ESTÁS EN EL LUGAR CORRECTO / promesa ░░
  { a: "si entraste a este video es porque tu aire no enfria", beats: [
    C("ac_driver_ac_not_cooling", "frustrated driver whose car ac blows warm air not cooling", "you're here because your AC doesn't cool", { at: "si entraste a este video es porque tu aire no enfria" }),
    I("ac_scared_by_quote_phone", "person scared by an expensive car ac repair quote on phone", "you're thinking of the shop, or they scared you with a quote", { at: "y estas pensando en llevarla al taller" }),
    C("ac_reassuring_diy_driveway", "reassuring man explaining a simple cheap car ac fix at home", "you're in the right place, in most cases it's nothing serious", { at: "estas en el lugar correcto" }),
    C("ac_single_gas_can_simple", "single can of car ac refrigerant simple cheap fix", "it's one silly, cheap thing, fixed on your own curb", { at: "es una sola cosa" }),
    C("ac_step_by_step_demo_hood", "step by step car ac recharge demonstration under the hood", "I'll show it to you step by step this weekend", { at: "te la voy a mostrar paso a paso" }),
    C("ac_no_shop_no_compressor_upsell", "avoiding shop upsell of car ac compressor to empty your wallet", "no shop, no scary quotes, no compressor upsell", { at: "sin que nadie te tire compresor para vaciarte el bolsillo" }),
    I("ac_internet_talk_no_proof", "phone screen car ac advice video that tells but never shows", "the internet is full of people who tell but don't show", { at: "internet esta lleno de gente que te cuenta" }),
  ]},
  // ░░ 3) LA PRUEBA — 30 grados ░░
  { a: "con un termometro delante tuyo", beats: [
    C("ac_kitchen_thermometer_intro", "common kitchen thermometer held up to prove car ac temp", "I'll prove it with a common kitchen thermometer", { at: "con un termometro delante tuyo" }),
    C("ac_thermometer_into_center_vent", "kitchen thermometer inserted into center car ac vent", "I put it here, in the center vent", { at: "lo meto aca en la rejilla del medio" }),
    C("ac_engine_running_ac_max", "car running with ac at maximum thermometer in vent", "engine running, AC at max", { at: "con el auto en marcha y el aire al maximo" }),
    C("ac_thermometer_reads_30", "thermometer reading 30 degrees in a car vent hot air", "look at the number: 30 degrees", { at: "30 grados" }),
    C("ac_same_outside_air_no_cooling", "car ac blowing the same warm outside air not cooling", "it's blowing the same air as outside, cooling nothing", { at: "me esta tirando el mismo aire de afuera" }),
    C("ac_refrigerant_can_shown", "hand showing a can of car ac refrigerant gas close up", "now look, this is the can of gas", { at: "esta es la lata de gas" }),
    C("ac_gauge_manifold_tool", "car ac recharge gauge manometer tool with hose close up", "this is the little tool with the gauge, the manometer", { at: "el fierrito con el reloj el manometro" }),
  ]},
  // ░░ 4) LA PRUEBA — 6 grados / la clave ░░
  { a: "el mismo auto el mismo termometro", beats: [
    C("ac_thermometer_reads_6_cold", "thermometer reading 6 degrees cold air in car vent", "same car, same thermometer: 6 degrees", { at: "el mismo auto el mismo termometro" }),
    C("ac_from_oven_to_fridge", "car ac cold air like a fridge after recharge cold vent", "from 30 to 6, from oven to fridge", { at: "de horno a heladera" }),
    C("ac_recharging_gas_by_hand", "man recharging car ac gas by hand with a can and gauge", "the only difference: I put in the gas it was missing, by hand", { at: "le puse el gas que le faltaba" }),
    C("ac_fraction_of_shop_cost", "spending a fraction of the shop cost on a cheap gas can", "spending a fraction of what they wanted to charge me", { at: "gastando una fraccion de lo que me querian cobrar" }),
    C("ac_80_percent_low_gas", "most car ac failures are just low refrigerant gas not broken", "80% of the time the AC not cooling is just low gas", { at: "no esta rotonada le falta gas" }),
    C("ac_right_way_vs_ruin_it", "right way vs wrong way to recharge car ac same tools", "there's a right way and a way to ruin everything", { at: "hay una manera correcta de hacerlo y una manera de arruinar todo" }),
    C("ac_same_tools_both_ways", "the same car ac recharge tools used both correctly and wrong", "both use exactly the same tools", { at: "las dos usan exactamente las mismas herramientas" }),
  ]},
  // ░░ 5) LO QUE VAS A APRENDER / open loops ░░
  { a: "si es gas bajo o si de verdad hay una falla", beats: [
    C("ac_diagnose_low_gas_or_fault", "diagnosing whether car ac has low gas or a real fault engine bay", "first, how to tell if it's low gas or a real fault", { at: "si es gas bajo o si de verdad hay una falla" }),
    C("ac_low_port_connection_point", "car ac low pressure port connection point where hose attaches", "then the recharge: where to connect and where never to", { at: "donde se conecta y donde nunca hay que conectar" }),
    C("ac_uv_dye_leak_stop", "uv dye and leak stop for car ac to make the charge last", "then how to stop the leak so it doesn't vanish in two months", { at: "como frenar la perdida" }),
    C("ac_stay_until_the_end", "finger pointing keep watching car ac tutorial reminder", "stay until the end: the one error that ruins it all", { at: "quedate hasta el final" }),
    C("ac_error_ruins_compressor", "the single error that breaks a healthy car ac compressor", "the only error, the one that breaks a healthy compressor", { at: "el unico error" }),
    C("ac_everyone_makes_it_first_time", "almost everyone makes this car ac recharge mistake first time", "almost everyone makes it the first time", { at: "casi todo el mundo lo comete la primera vez" }),
  ]},
  // ░░ 6) SOY TOMÁS ░░
  { a: "soy tomas", full: true, beats: [] },
  // ░░ 7) STAKES — lo que ya te costó ░░
  { a: "pensa un segundo en lo que este problema ya te costo", beats: [
    C("ac_think_what_it_cost", "man thinking about what a broken car ac has already cost", "think about what this problem already cost you, not just money", { at: "pensa un segundo en lo que este problema ya te costo" }),
    C("ac_hot_road_trip_kids_crying", "family road trip hot car kids crying window down highway", "the trip to the coast, kids in back, three hours of road", { at: "tres horas de ruta" }),
    C("ac_shirt_stuck_to_back_work", "man arriving at work shirt stuck to his sweaty back", "arriving at work with your shirt stuck to your back", { at: "la camisa pegada a la espalda" }),
    C("ac_shop_charges_you_desperate", "car shop charging a desperate customer in summer heat", "the shop that grabs you in January when you're desperate", { at: "de la plata" }),
    C("ac_told_compressor_terror_number", "mechanic saying the compressor is done quoting a terror number", "he says the compressor is done and quotes a number of terror", { at: "el compresor esta para cambiar" }),
    C("ac_cant_tell_if_true", "customer unable to tell if the mechanic is telling the truth", "you have no way to know if they're telling the truth", { at: "vos no tenes como saber si te estan diciendo la verdad" }),
    C("ac_car_in_the_pit_waiting", "car up on a shop lift in the pit while owner waits outside", "the car's inside in the pit, you're outside with a coffee", { at: "el auto esta adentro en la fosa" }),
    C("ac_you_dont_know_how_it_works", "confused customer who doesn't know how car ac works", "you don't know how it works, and they know it", { at: "no sabes como funciona" }),
    C("ac_your_ignorance_is_the_business", "car shop profiting from customer ignorance about ac", "your not-knowing is exactly the business", { at: "ese desconocimiento tuyo es justamente el negocio" }),
    C("ac_no_more_selling_smoke", "informed driver so the shop can't sell him smoke anymore", "the day you understand it, they can't sell you smoke anymore", { at: "no te pueden vender mas humo" }),
  ]},
  // ░░ 8) EL PRINCIPIO — el circuito cerrado del gas ░░
  { a: "ahora si el principio", beats: [
    G("ac_tomas_principio", { kicker: "Tan simple que da bronca" }),
    C("ac_not_making_cold_from_nothing", "car ac does not create cold from nothing it moves a gas", "the AC doesn't make cold from nothing", { at: "no fabrica frio de la nada" }),
    C("ac_refrigerant_gas_special", "special refrigerant gas moving through a car ac system", "it moves a special gas called refrigerant", { at: "un gas especial que se llama refrigerante" }),
    X({ kind: "diagram", at: "un cano que da toda la vuelta y se muerde la cola", eyebrow: "El aire es un circuito CERRADO de gas", slides: [{ image: dg("dg_ac_closed_circuit", "Diagrama del circuito cerrado del aire acondicionado de un auto, en corte simple tipo esquema. Un CAÑO que forma un anillo cerrado que se muerde la cola, con el GAS refrigerante (flechas) dando toda la vuelta. En el anillo, tres piezas grandes etiquetadas: el COMPRESOR (que aprieta el gas), el CONDENSADOR (adelante, donde el gas suelta calor) y el EVAPORADOR (adentro del auto, donde el gas se pone helado y un ventilador sopla ese frío). Etiquetas 'circuito cerrado', 'siempre el mismo gas', 'compresor', 'condensador', 'evaporador'. Transmite que es un anillo cerrado y siempre los mismos gramos dando vueltas."), eyebrow: "Compresor · condensador · evaporador" }] }),
    C("ac_gas_goes_around_returns", "refrigerant gas going around the loop and coming back", "the gas goes out, goes around, and returns, always the same gas", { at: "el gas sale da la vuelta y vuelve" }),
    C("ac_compressor_squeezes_gas", "car ac compressor squeezing refrigerant gas engine bay", "when the compressor squeezes it and releases it", { at: "cuando el compresor lo aprieta" }),
    C("ac_gas_becomes_freezing_cold", "refrigerant gas becoming freezing cold as it expands", "it gets ice cold as it expands", { at: "se pone helado" }),
    C("ac_fan_blows_cold_inside", "car cabin fan blowing cold air onto the driver inside", "and a fan blows that cold inside the car", { at: "un ventilador te sopla adentro del auto" }),
  ]},
  // ░░ 9) POR QUÉ DEJA DE ENFRIAR — pierde gas ░░
  { a: "por que deja de enfriar", beats: [
    C("ac_why_stops_cooling", "car ac slowly stops cooling over the years low gas", "so why does it stop cooling? because the circuit loses gas", { at: "por que deja de enfriar" }),
    X({ kind: "diagram", at: "tiene juntas", eyebrow: "El gas se escapa de a poco por las uniones", slides: [{ image: dg("dg_ac_slow_leak", "Diagrama del circuito del aire de un auto mostrando las UNIONES de goma: varias juntas, o-rings (anillitos de goma) y uniones de caños marcadas con círculos. En una o dos de ellas, un GAS que se escapa muy de a poco (flechitas pequeñas saliendo) con la etiqueta 'un poquito por año'. Al lado, un calendario o el paso de los años (icono). Etiquetas 'juntas', 'o-rings de goma', 'se escapa un poquito año tras año', 'es normal, todos los autos lo hacen'. Transmite la pérdida lenta y normal por las gomas."), eyebrow: "Juntas y o-rings resecos: pierden lento" }] }),
    C("ac_rubber_orings_joints", "close up of rubber o-rings and joints in a car ac system", "it has joints, o-rings, rubber unions", { at: "tiene juntas" }),
    C("ac_gas_escapes_slowly_years", "refrigerant gas escaping slowly year after year normal", "a little escapes, year after year, it's normal", { at: "se escapa un poco de gas" }),
    C("ac_all_cars_do_this", "all cars slowly lose ac refrigerant over time normal wear", "all cars do it", { at: "todos los autos lo hacen" }),
    C("ac_compressor_nothing_to_work", "car ac compressor with too little gas cannot work well", "with little gas the compressor has nothing to work with", { at: "el compresor no tiene con que trabajar" }),
    C("ac_cant_compress_well_warm", "car ac compressor unable to compress cooling less and less", "it can't compress well, and cools less and less", { at: "no puede comprimir bien" }),
    C("ac_missing_gas_not_broken", "car ac just missing gas nothing actually broken reassuring", "nothing broke: it's missing the gas that left over the years", { at: "le falta el gas que se le fue con los anos" }),
  ]},
  // ░░ 10) NO ES EL COMPRESOR / REGLA #1 ░░
  { a: "el 80 de el aire no enfria es simplemente gas bajo", beats: [
    C("ac_80_percent_just_low_gas", "80 percent of car ac problems are simply low gas statistic", "80% of 'the AC doesn't cool' is simply low gas", { at: "el 80 de el aire no enfria es simplemente gas bajo" }),
    C("ac_not_the_compressor_durable", "car ac compressor is a durable iron piece lasts years", "not the compressor, it's an iron that lasts years and years", { at: "no es el compresor" }),
    C("ac_compressor_is_the_expensive", "expensive car ac compressor is what shops push to sell", "but the compressor is the expensive part, so that's what they push", { at: "pero como el compresor es lo caro" }),
    C("ac_recharge_fraction_of_compressor", "a gas recharge costs a fraction of a car ac compressor", "a recharge costs a fraction of a compressor", { at: "una recarga de gas te sale una fraccion" }),
    C("ac_diy_kit_parts_store", "diy car ac recharge kit bought at an auto parts store", "many times you can do the recharge with a kit from the parts store", { at: "con un kit que compras en cualquier casa de repuestos" }),
    C("ac_rule_number_one", "rule number one for car ac if it doesnt cool it's low gas", "rule number one, take this even if you forget everything else", { at: "la regla numero uno" }),
    C("ac_check_before_paying_fortune", "checking car ac before paying a fortune at the shop free", "before paying a fortune, check it, checking is free", { at: "antes de pagar una fortuna chequealo" }),
  ]},
  // ░░ 11) PASO 1 — DIAGNÓSTICO / el embrague ░░
  { a: "diagnosticar", beats: [
    C("ac_diagnose_first_step", "diagnosing a car ac before buying any refrigerant can", "step one, before buying any can: diagnose", { at: "diagnosticar" }),
    C("ac_charging_wrong_car_waste", "charging gas into a car with another problem wasting money", "charging a car with another problem is throwing money away", { at: "cargar gas a un auto que tiene otro problema es tirar la plata" }),
    C("ac_you_alone_no_tools", "man diagnosing car ac himself with no tools two minutes", "you do this alone, no tools, in two minutes", { at: "esto lo haces vos solo sin herramientas" }),
    C("ac_go_to_engine_bay_front", "opening the hood going to the front engine compartment ac", "start the car, AC to max, and go to the engine bay", { at: "anda al frente del motor" }),
    C("ac_find_the_ac_compressor", "locating the car ac compressor with a pulley and belt engine bay", "find the AC compressor: a part with a pulley up front", { at: "busca el compresor del aire" }),
    X({ kind: "diagram", at: "tiene que engancharse una parte del frente de esa polea", eyebrow: "El embrague del compresor: el test gratis", slides: [{ image: dg("dg_ac_clutch", "Diagrama del COMPRESOR del aire de un auto visto de frente, mostrando la POLEA por donde pasa la correa. En el frente de la polea, el EMBRAGUE (una parte que se engancha) con una flecha y la palabra 'CLAC'. Dos escenas: 1) el embrague ENGANCHADO y girando la parte de adentro, con un ícono de oído escuchando 'clic clic' y un cartel verde 'engancha = compresor vivo, sistema eléctrico OK'. 2) el embrague QUIETO sin enganchar nunca, cartel rojo 'no engancha = fusible, sensor o sistema muy vacío'. Etiquetas 'polea', 'correa', 'embrague', 'clic'. Transmite el test del embrague."), eyebrow: "Engancha con un clic = compresor vivo" }] }),
    C("ac_clutch_engaging_clac", "car ac compressor clutch engaging with a clac on the pulley", "when you turn on the AC the clutch engages with a 'clac'", { at: "tiene que engancharse una parte del frente de esa polea" }),
    C("ac_clutch_clicking_engaging", "car ac compressor clutch clicking engaging and releasing", "you'll hear a click, click: the clutch engaging and releasing", { at: "el embrague enganchando y soltando" }),
    C("ac_clutch_spins_good_news", "car ac compressor clutch engaging and spinning good sign", "if the clutch engages and spins, great: the compressor is alive", { at: "si ese embrague engancha y gira buenisimo" }),
    C("ac_click_is_your_best_friend", "the click of the car ac clutch is your best friend diagnosis", "that click is your best friend", { at: "ese click es tu mejor amigo" }),
    C("ac_clutch_never_moves_problem", "car ac compressor clutch that never engages a problem", "if the clutch never moves, there could be something else", { at: "si el embrague ni se mueve" }),
    C("ac_safety_lock_empty_system", "car ac safety lock stops compressor when system is empty", "a safety won't let it start if the system is too empty", { at: "un seguro no lo deja arrancar para no danarse" }),
  ]},
  // ░░ 12) PASO 1 — fusible, correa, pérdida grande ░░
  { a: "revisa lo basico que la gente saltea", beats: [
    C("ac_check_fuse_box_basics", "checking the car ac fuse in the fuse box owner manual", "second, check the basics people skip: the AC fuse", { at: "revisa lo basico que la gente saltea" }),
    C("ac_belt_not_loose_or_cut", "inspecting a car ac belt that is not loose or cut engine", "and the belt, that it's not loose or cut", { at: "la correa que no este floja ni cortada" }),
    C("ac_dead_ac_no_gas_missing", "blown fuse leaves car ac dead without any gas missing", "a blown fuse or worn belt leaves the AC dead with gas full", { at: "te dejan el aire muerto" }),
    C("ac_look_for_big_leak", "looking for a big obvious oily car ac leak engine bay", "third, look for a big, obvious leak", { at: "fijate si hay una perdida grande" }),
    C("ac_oily_stains_ac_joints", "oily greasy stains on car ac line joints near compressor", "oily stains on the AC line joints, near the compressor", { at: "busca manchas de aceite aceitoso en las uniones" }),
    C("ac_gas_travels_with_oil", "car ac refrigerant gas travels with a little oil marking leaks", "the AC gas travels with a bit of oil that marks leaks", { at: "el gas del aire viaja con un aceitito" }),
    C("ac_oil_smear_on_a_joint", "an obvious oil smear on a car ac union pointing to the leak", "if you see an oil smear on a union, that's your leak", { at: "si ves un chorreado de aceite evidente en una union" }),
    C("ac_all_dry_clean_good_news", "car ac lines all dry and clean no leak good news", "but if it's all dry and clean, that's the good news", { at: "si esta todo seco y prolijo es la buena noticia" }),
    C("ac_recharge_fixes_it", "a simple car ac recharge fixing the slow normal leak", "a recharge solves it", { at: "una recarga te lo resuelve" }),
  ]},
  // ░░ 13) RESUMEN DIAGNÓSTICO ░░
  { a: "si el embrague del compresor engancha y hace clic", beats: [
    C("ac_summary_clutch_clicks", "summary of car ac diagnosis clutch engages and clicks", "summary: if the clutch engages and clicks", { at: "si el embrague del compresor engancha y hace clic" }),
    C("ac_perfect_candidate_recharge", "a car that is a perfect candidate for a diy ac recharge", "you're the perfect candidate for the recharge", { at: "sos candidato perfecto para la recarga" }),
    C("ac_fixed_in_20_min_curb", "car ac fixed in 20 minutes on the curb driveway diy", "that's the car fixed in 20 minutes on the curb", { at: "ese es el auto que se arregla en 20 minutos en la vereda" }),
  ]},
  // ░░ 14) PASO 2 — LA REGLA DE ORO: baja vs alta ░░
  { a: "ahora si el paso dos", beats: [
    G("ac_tomas_regla_oro", { kicker: "La única regla de seguridad que importa" }),
    C("ac_step_two_the_recharge", "starting step two the car ac recharge with the kit curb", "now step two: the recharge", { at: "ahora si el paso dos" }),
    C("ac_golden_rule_focus", "focus on the golden safety rule of car ac recharge", "there's a golden rule, respect it and this is easy and safe", { at: "hay una regla de oro" }),
    C("ac_always_low_never_high", "always charge car ac by the low side never the high side", "you always charge by the LOW pressure side, never the high", { at: "se carga siempre por el lado de baja presion" }),
    X({ kind: "diagram", at: "el de baja presion y el de alta presion", eyebrow: "Dos puertos: BAJA (tuyo) vs ALTA (peligro)", slides: [{ image: dg("dg_ac_two_ports", "Diagrama del circuito del aire de un auto con los DOS PUERTOS de carga bien diferenciados. A la IZQUIERDA, el puerto de BAJA presión: en el CAÑO MÁS GRUESO que sale del compresor hacia el habitáculo, con una tapa que dice 'L' (low), remarcado en VERDE con un tilde grande y el cartel 'BAJA = el tuyo, cargás acá'. A la DERECHA, el puerto de ALTA presión: en el CAÑO MÁS FINO, con tapa que dice 'H' (high), remarcado en ROJO con una prohibición y el cartel 'ALTA = nunca la tocás'. El conector del kit solo entra en la de baja (dibujar el conector calzando en L y sin calzar en H). Transmite baja=seguro, alta=peligro."), eyebrow: "L = low = baja (tuyo) · H = high = alta (jamás)" }] }),
    C("ac_two_sides_low_and_high", "car ac circuit two sides low pressure and high pressure", "the circuit has two sides: low pressure and high pressure", { at: "el de baja presion y el de alta presion" }),
    C("ac_two_valves_with_caps", "two car ac service valve ports with caps like tire valves", "two little valves with caps, like tire valves but different", { at: "dos piquitos con tapa" }),
    C("ac_low_is_the_one_you_use", "the low pressure car ac port is the one you connect to", "the low one is yours, the high one you never touch", { at: "la de baja es la que vos vas a usar" }),
  ]},
  // ░░ 15) PASO 2 — cómo distinguir baja vs alta ░░
  { a: "como las distinguis para no equivocarte", beats: [
    C("ac_how_to_tell_them_apart", "how to tell the low and high car ac ports apart safely", "how do you tell them apart so you don't get it wrong?", { at: "como las distinguis para no equivocarte" }),
    C("ac_kit_only_fits_low_port", "car ac recharge kit connector only fits the low pressure port", "the kit only fits the low port, it won't engage the high", { at: "el kit de recarga solo entra en la de baja" }),
    C("ac_low_on_thicker_pipe", "car ac low pressure port on the thicker pipe from compressor", "the low is on the thicker pipe from the compressor", { at: "la de baja esta en el cano mas grueso" }),
    C("ac_low_marked_L_letter", "car ac low pressure valve cap marked with letter L for low", "it usually says an 'L' for low", { at: "suele decir una l de low" }),
    C("ac_high_on_thin_pipe_H", "car ac high pressure port on thin pipe marked H for high", "the high is on the thinner pipe and says 'H' for high", { at: "la de alta esta en el cano mas fino y dice h de high" }),
    C("ac_connector_only_fits_there", "car ac kit hose connector only clicks onto the low port", "the connector only clicks there", { at: "el conector solo calza ahi" }),
    C("ac_check_the_letter_L", "double checking the letter L on the low car ac port", "still, check the letter: L, the low, is yours", { at: "mira la letra y asegurate" }),
    C("ac_high_side_huge_pressure", "car ac high side under huge pressure with engine running", "the high side, with the car running, has enormous pressure", { at: "tiene una presion enorme" }),
    C("ac_hose_bursts_in_face_danger", "car ac hose could burst under high pressure danger warning", "it could burst the hose in your face and freeze-burn your skin", { at: "te puede reventar la manguera en la cara" }),
    C("ac_low_always_low_reminder", "reminder to always charge car ac low side never high", "so: low, always low", { at: "por eso baja siempre baja" }),
  ]},
  // ░░ 16) PASO 2 — la recarga en sí ░░
  { a: "la recarga en si", beats: [
    C("ac_buy_the_kit", "buying a car ac recharge kit can gauge and hose parts store", "the recharge itself: first, you buy the kit", { at: "la recarga en si" }),
    C("ac_can_gauge_hose_assembled", "car ac recharge can with gauge and low side hose assembled", "a can of refrigerant with a gauge and a hose for the low valve", { at: "una lata de gas refrigerante con un manometro" }),
    C("ac_sold_at_parts_stores", "car ac kit sold at auto parts stores and online cheap", "sold at parts stores, some hardware stores, or online", { at: "te lo venden en casas de repuestos" }),
    C("ac_check_which_gas_first", "checking which refrigerant gas the car takes before buying", "check WHICH gas your car takes before buying, there are two types", { at: "fijate que gas lleva tu auto antes de comprar" }),
    C("ac_car_running_ventilated_curb", "car running in a ventilated spot on the curb handbrake on", "second, engine running, in a ventilated spot, handbrake on", { at: "pones el auto en marcha en un lugar ventilado" }),
    C("ac_ac_max_cold_fan_full", "car ac set to max cold fan on full windows open recharge", "AC at max cold, fan at max, windows open", { at: "prendes el aire acondicionado al maximo frio" }),
    C("ac_compressor_full_low_asks_gas", "car ac compressor working at full so low side asks for gas", "max makes the compressor work full so the low side asks for gas", { at: "el aire al maximo hace que el compresor trabaje a full" }),
    C("ac_connect_to_low_valve", "connecting the kit hose to the car ac low pressure valve", "third, find the low valve, remove the cap, connect the kit", { at: "buscas la valvula de baja" }),
    C("ac_click_when_connected", "car ac kit connector clicking onto the low valve engaged", "you'll hear a click when it engages", { at: "vas a escuchar un click cuando engancha" }),
    C("ac_gauge_shows_pressure_reading", "car ac gauge showing the resting system pressure reading", "the gauge already shows a pressure, your system at rest", { at: "esa es la presion que tiene tu sistema en reposo de carga" }),
    C("ac_needle_in_low_red_zone", "car ac gauge needle down in the low or red zone confirms", "if it's down in the low or red zone, confirmed, it needs gas", { at: "en la zona roja o baja del relojito" }),
  ]},
  // ░░ 17) PASO 2 — cargar de a poco (el momento clave) ░░
  { a: "cargas de a poco", beats: [
    C("ac_charge_little_by_little", "recharging car ac little by little watching the gauge", "fourth, the key moment: you charge little by little", { at: "cargas de a poco" }),
    C("ac_open_can_a_little", "opening the car ac can a little with the trigger valve", "shake the can, open it slightly, let gas in a few seconds", { at: "la abris apenas" }),
    C("ac_charge_stop_look_gauge", "charge a bit stop and look at the car ac gauge repeat", "a little, stop, look. a little, stop, look. never all at once", { at: "cargas un poquito paras miras" }),
    X({ kind: "diagram", at: "la aguja del manometro tiene una zona marcada", eyebrow: "El manómetro te dice cuándo parar", slides: [{ image: dg("dg_ac_gauge_zone", "Diagrama grande de un MANÓMETRO redondo (el relojito del kit de recarga) con la aguja. La esfera dividida en tres zonas de color: una ZONA ROJA baja a la izquierda ('vacío = le falta gas'), una ZONA VERDE en el medio remarcada como el objetivo ('la zona correcta, PARÁS acá') y una ZONA ROJA alta a la derecha ('demasiado = peligro, sobrecarga'). Una flecha muestra la aguja SUBIENDO de a poco desde el rojo bajo hacia el verde. Cartel 'cargá hasta el verde y ni una pizca más'. Transmite que el verde es el objetivo y pasarse es peligroso."), eyebrow: "Rojo bajo → VERDE (parás) → rojo alto (peligro)" }] }),
    C("ac_gauge_marked_zone_needle", "car ac gauge with a marked green zone the needle must reach", "the needle has a marked zone, almost always green, your target", { at: "la aguja del manometro tiene una zona marcada" }),
    C("ac_green_zone_is_target", "green zone on car ac gauge is where you must reach and stop", "green is where you have to reach", { at: "casi siempre verde" }),
    C("ac_rise_into_correct_zone", "car ac pressure rising slowly into the correct green zone", "rise slowly into that correct zone", { at: "hasta meterte en esa zona correcta" }),
    C("ac_zone_painted_by_temp", "car ac gauge zone painted according to outside temperature", "most kit gauges have the zone painted by outside temperature", { at: "la zona pintada segun la temperatura de afuera" }),
  ]},
  // ░░ 18) PASO 2 — controlar la rejilla, terminar ░░
  { a: "anda controlando la temperatura en la rejilla con el termometro", beats: [
    C("ac_monitor_vent_temp_thermometer", "monitoring car vent temperature with a thermometer while charging", "meanwhile, monitor the vent temp with the thermometer", { at: "anda controlando la temperatura en la rejilla con el termometro" }),
    C("ac_vent_number_drops_magic", "car vent thermometer number dropping from 30 to 6 as gas rises", "the vent number drops: 30, 20, 12, to the 6, 7 you want", { at: "el numero de la rejilla baja" }),
    C("ac_reaches_6_7_degrees", "car ac vent reaching 6 to 7 degrees cold air success", "to the 6, 7 degrees you're after", { at: "a los 6 7 grados que buscas" }),
    C("ac_close_can_disconnect_cap", "closing the car ac can disconnecting and capping the valve", "close the can, disconnect carefully, cap the valve, done", { at: "cerras la lata desconectas con cuidado" }),
    C("ac_did_it_yourself_20_min", "man finishing car ac recharge himself in 20 minutes proud", "you just did in 20 minutes what they'd charge like an operation", { at: "lo que te querian cobrar como una operacion" }),
  ]},
  // ░░ 19) INJERTO 1 — el manual (presiones exactas, ~38%) ░░
  { a: "las presiones exactas", beats: [
    C("ac_exact_psi_by_temp", "exact car ac psi pressures chart by outside temperature", "the exact pressures, the PSI by outside temperature", { at: "las presiones exactas" }),
    X({ kind: "diagram", at: "las tengo todas anotadas", eyebrow: "Las presiones justas, anotadas por gas y temperatura", slides: [{ image: dg("dg_ac_manual_pressures", "Lámina de un cuaderno/manual casero abierto sobre el capó de un auto, con una TABLITA de presiones del aire acondicionado anotada a mano: columnas de temperatura de afuera y de PSI en reposo y con el compresor enganchado, para dos gases (R134a y R1234yf). Al lado, la lata de gas con manómetro, el termómetro y un lápiz, estilo archivo artesanal. Transmite 'los números justos para no quedarte corto ni pasarte'. Sin texto legible fino."), eyebrow: "El Manual de Reparaciones Caseras" }] }),
    C("ac_went_short_first_time", "measuring car ac pressure by eye and going short first time", "the first time I went by eye and came up short, and almost overfilled", { at: "las tengo todas anotadas" }),
    C("ac_gathered_in_a_manual", "gathering car and home repair recipes into a home repair manual", "so I gathered those exact numbers in a manual", { at: "un manual que arme" }),
    C("ac_start_today_nothing_needed", "man starting car ac recharge today with just the kit gauge", "for today you need nothing: the kit's own gauge shows the zone", { at: "para lo de hoy no te hace falta tener nada" }),
    C("ac_keep_watching_leak_error", "keep watching for the leak fix and the error that ruins all", "keep watching: the leak fix and the error are still coming", { at: "segui mirando" }),
  ]},
  // ░░ 20) PASO 3 — buscar y frenar la pérdida (UV) ░░
  { a: "buscar y frenar las perdidas chicas", beats: [
    C("ac_find_stop_small_leaks", "finding and stopping small car ac leaks so charge lasts", "step three: find and stop the small leaks so the charge lasts", { at: "buscar y frenar las perdidas chicas" }),
    C("ac_gas_escapes_somewhere", "car ac refrigerant escaping slowly from somewhere leak", "if the gas left, it's escaping somewhere, even if slow", { at: "si el gas se fue es porque por algun lado se escapa" }),
    C("ac_new_gas_leaves_too", "newly charged car ac gas leaking out again in months", "if you only charge, that new gas will leave too", { at: "ese gas nuevo se va a ir yendo tambien" }),
    C("ac_attack_the_leak", "attacking the car ac leak so the recharge lasts years", "so if you want it to last, you attack the leak", { at: "si queres que dure atacas la perdida" }),
    C("ac_cans_with_uv_dye_sealer", "car ac gas cans that include uv dye and leak sealer inside", "there are cans that come with UV dye and leak sealer inside", { at: "latas de gas que ya vienen con tintura" }),
    C("ac_dye_travels_with_gas", "uv dye colorant traveling with car ac gas marking the leak", "the dye travels with the gas, leaking a bit of ink at the leak", { at: "la tintura es un colorante que viaja con el gas" }),
    X({ kind: "diagram", at: "iluminas las uniones del aire", eyebrow: "La tintura UV te muestra la fuga exacta", slides: [{ image: dg("dg_ac_uv_leak", "Diagrama en tres pasos horizontales para encontrar la fuga del aire con tintura UV. Paso 1: una lata de gas con TINTURA UV que entra al circuito ('la tinta viaja con el gas'). Paso 2: por la unión donde se escapa el gas, sale un poquito de TINTA. Paso 3: una LINTERNA de luz ULTRAVIOLETA ilumina las uniones en la sombra y aparece una MARCA FLUORESCENTE verdosa-amarillenta BRILLANDO justo en el punto exacto de la fuga (un o-ring/anillito de goma). Etiquetas 'tintura UV', 'se escapa con el gas', 'linterna UV', 'la marca fluorescente = tu fuga'. Transmite cómo la tintura delata la fuga."), eyebrow: "Linterna UV → marca fluorescente = tu fuga" }] }),
    C("ac_uv_flashlight_joints", "shining a uv flashlight on car ac joints in the shade", "with a cheap UV flashlight, light the AC joints in the shade", { at: "iluminas las uniones del aire" }),
    C("ac_fluorescent_leak_mark", "fluorescent greenish yellow mark glowing at a car ac leak point", "a fluorescent greenish-yellow mark glows at the exact spot", { at: "una marca florescente verdosa amarillenta" }),
    C("ac_there_is_your_leak", "there is your car ac leak found with uv dye pinpointed", "there's your leak", { at: "ahi esta tu fuga" }),
    C("ac_tighten_loose_joint", "tightening a loose car ac joint with a wrench cheap fix", "often it's just a loose joint you tighten", { at: "una junta floja que ajustas" }),
    C("ac_replace_dry_oring", "replacing a dry cracked car ac o-ring rubber ring cheap", "or a dry o-ring, a rubber ring you swap for a few pesos", { at: "un anillito de goma" }),
    C("ac_sealer_swells_rubber", "car ac leak sealer swelling rubber seals to stop tiny leaks", "the sealer helps plug very fine leaks by swelling the seals", { at: "el sellador de perdidas que viene en algunas latas" }),
    C("ac_slow_leak_of_years_ok", "sealer enough for the slow normal car ac leak of the years", "no miracle on a big hole, but for the slow leak it's often enough", { at: "para la perdida lenta de los anos" }),
    C("ac_recharge_lasts_years", "car ac recharge lasting years instead of two months sealed", "so the recharge lasts years instead of two months", { at: "te dura anos" }),
  ]},
  // ░░ 21) PASO 4 — mantenimiento ░░
  { a: "paso cuatro el mantenimiento", beats: [
    C("ac_step_four_maintenance", "car ac maintenance routine to never go through this again", "step four, maintenance, so you never go through this again", { at: "paso cuatro el mantenimiento" }),
    C("ac_use_ac_often_even_winter", "using the car ac often even in winter to keep seals healthy", "first, use the AC often, even in winter, a few minutes", { at: "usa el aire seguido" }),
    C("ac_oil_keeps_seals_lubricated", "car ac oil circulating keeping joints lubricated and sealed", "using it, the oil circulates and keeps the seals lubricated", { at: "el aceitito circula y mantiene las juntas" }),
    C("ac_clean_the_condenser", "cleaning the car ac condenser radiator in front of the car", "second, clean the condenser, that thin radiator up front", { at: "limpia el condensador" }),
    C("ac_condenser_behind_grille_dirty", "car ac condenser behind the grille full of dirt bugs leaves", "behind the grille, it fills with dirt, bugs and leaves", { at: "detras de la parrilla" }),
    C("ac_clogged_cant_dump_heat", "clogged car ac condenser cannot dump heat cools poorly", "if it's clogged, the AC can't dump heat and cools badly", { at: "el aire no puede tirar el calor afuera" }),
    C("ac_gentle_hose_wash_fins", "gently hosing a car ac condenser from inside out careful fins", "a gentle hose wash from inside out, careful with the fins", { at: "un mangueraso suave de agua" }),
    C("ac_change_cabin_filter", "changing the car cabin air filter behind the glovebox paper", "third, change the cabin filter behind the glovebox", { at: "cambia el filtro de habitaculo" }),
    C("ac_clogged_filter_no_airflow", "clogged car cabin filter blocking airflow to the vents", "when it clogs, no air reaches you no matter how cold", { at: "no pasa aire" }),
    C("ac_cheap_five_minute_swap", "cheap five minute car cabin air filter swap easy", "it's dirt cheap and you swap it in five minutes", { at: "lo cambias en cinco minutos" }),
  ]},
  // ░░ 22) INJERTO 2 — por qué no te lo cuentan (chips + splitlist, ~65%) ░░
  { a: "y dejame parar un segundo", beats: [
    G("ac_tomas_pausa", { kicker: "Nadie te lo cuenta" }),
    C("ac_none_of_it_expensive", "none of these car ac fixes is expensive or hard curb mate", "none of what I told you is expensive or hard", { at: "nada de lo que te acabo de contar es caro" }),
    C("ac_work_on_curb_with_mate", "man doing car ac work on the curb drinking mate relaxed", "the kit is cheap, diagnosis free, work done on the curb", { at: "el trabajo lo haces en la vereda tomando mate" }),
    C("ac_yet_nobody_explains", "yet nobody at the shop explains the cheap car ac fix", "and yet, nobody explains it to you", { at: "nadie te lo explica" }),
    C("ac_shop_doesnt_want_diy", "car shop that doesn't want you to recharge ac yourself", "because the shop doesn't want you charging it in 20 minutes", { at: "al taller no le conviene" }),
    X({ kind: "chips", at: "su negocio es tu desconocimiento", title: "Por qué no te lo cuentan", chips: ["Al taller no le conviene", "que sepas que es solo gas", "su negocio es tu desconocimiento"], hue: "red", imageDarken: 0.6, _bg: { name: "ac_shop_business_ignorance_bg", query: "car repair shop invoice business profiting from customer ignorance", concept: "the shop business built on the customer not knowing" }, image: "real/ac_shop_business_ignorance_bg.png" }),
    // === INJERTO 2 — punto de inserción del video-CTA ===
    // El beat siguiente ("lo dividí justo así... cuarenta arreglos") es donde, cuando Tomás
    // cuenta cómo dividió el manual en cuatro peleas, se insertará después un clip aparte
    // (video-CTA). NO editar de forma rara: este comentario marca el límite exacto.
    X({ kind: "splitlist", at: "lo dividi justo asi", title: "Los 40 arreglos, divididos así", items: ["Madera y metal que no se pudran ni oxiden", "Plagas por centavos", "Goteras y humedad", "Arreglos del hogar y el auto"], palette: "A" }),
    C("ac_forty_fixes_same_criteria", "forty cheap home and car repairs same criteria manual", "forty fixes, all with the same criteria: cheap that works", { at: "40 arreglos todos con el mismo criterio" }),
  ]},
  // ░░ 23) EL ERROR — sobrecargar (clímax) ░░
  { a: "llegamos a lo que te prometi al principio", beats: [
    C("ac_arrive_the_promised_error", "arriving at the one error that ruins the car ac recharge", "we reach what I promised: the error that ruins it all", { at: "llegamos a lo que te prometi al principio" }),
    C("ac_ten_peso_fix_becomes_1000", "a ten peso car ac fix turning into a thousand peso repair", "the one that turns a 10-peso fix into a 1000-peso one", { at: "un arreglo de 10 pesos en uno de mil" }),
    C("ac_done_with_best_intention", "person making car ac mistake with the best intention", "and people do it with the best intention", { at: "con la mejor intencion" }),
    G("ac_error_sobrecargar", { kicker: "El error: SOBRECARGAR" }),
    C("ac_overfilling_more_gas_more_cold", "overfilling car ac thinking more gas means more cold wrong", "the error: overcharging, thinking more gas means more cold", { at: "pensando que mas gas mas frio" }),
    C("ac_seems_logical_everyone", "the overfill logic seems obvious so everyone does it car ac", "it seems the most logical thing, so everyone does it", { at: "es lo mas logico del mundo pensarlo" }),
    C("ac_exactly_the_opposite", "overfilling car ac cools worse exactly the opposite result", "and it's exactly the opposite", { at: "y es exactamente al reves" }),
    C("ac_more_gas_cools_worse", "too much car ac gas makes it cool worse not better", "with more gas than it needs, the AC cools worse", { at: "con mas gas del que corresponde el aire enfria peor" }),
    X({ kind: "diagram", at: "si metes gas de mas el circuito queda demasiado lleno", eyebrow: "Sobrecargar ahoga el sistema y rompe el compresor", slides: [{ image: dg("dg_ac_overcharge", "Diagrama del circuito del aire de un auto SOBRECARGADO, en corte. El caño demasiado LLENO de gas (muy apretado, sin lugar), el COMPRESOR forzado que no puede comprimir bien (ícono de esfuerzo, sudor), la presión del lado de ALTA disparándose ('por las nubes', flecha roja hacia arriba fuera de escala) y el compresor RECALENTADO (ondas de calor, ícono rojo). Un cartel grande: 'de más = enfría PEOR + rompés el compresor sano'. Contraste con un recuadro chico al costado del sistema en su punto justo enfriando bien. Transmite que sobrecargar ahoga y rompe."), eyebrow: "Demasiado lleno → se ahoga → rompe el compresor" }] }),
    C("ac_circuit_too_full_no_room", "car ac circuit too full compressor has no room to compress", "if you overfill, the circuit is too full, no room to compress", { at: "si metes gas de mas el circuito queda demasiado lleno" }),
    C("ac_high_pressure_skyrockets", "car ac high side pressure skyrocketing system chokes", "the high side pressure skyrockets and the system chokes", { at: "la presion del lado de alta se dispara por las nubes" }),
    C("ac_compressor_overworked_hot", "car ac compressor overworked and overheating from overfill", "the compressor works way too hard and overheats", { at: "el compresor trabaja forzadisimo" }),
    C("ac_break_healthy_compressor", "overfilling car ac actually breaks the healthy compressor", "and that's where you really can break the compressor", { at: "ahi es donde de verdad podes romper el compresor" }),
    C("ac_the_irony_of_overfilling", "the irony overfilling to cool more breaks the sound compressor", "the irony: charging more to cool more breaks a healthy compressor", { at: "entendes la ironia" }),
    C("ac_the_error_pays_itself", "the car ac overfill error pays itself with a costly repair", "the error pays itself", { at: "el error se paga solo" }),
  ]},
  // ░░ 24) EL MANÓMETRO MANDA — parás a tiempo ░░
  { a: "el manometro es tu mejor amigo", beats: [
    C("ac_gauge_is_your_best_friend", "the car ac gauge manometer is your best friend when to stop", "that's why the gauge is your best friend", { at: "el manometro es tu mejor amigo" }),
    C("ac_gauge_tells_when_to_stop", "car ac gauge in the green zone telling you exactly when to stop", "the gauge tells you when to stop: green zone, vent cold, STOP", { at: "el manometro te dice cuando parar" }),
    C("ac_no_a_little_more", "resisting the urge to add a little more car ac gas just in case", "not 'a little more just in case'", { at: "un poquito mas por las dudas" }),
    C("ac_less_is_safer_than_more", "undercharging car ac is safer than overcharging you can add", "less is always safer than more: short cools less but breaks nothing", { at: "menos es siempre mas seguro que demas" }),
    C("ac_overfill_damage_done", "car ac overfill and the damage is already done irreversible", "if you overshoot, the damage is done", { at: "si te pasas ya esta el dano hecho" }),
    C("ac_gauge_rules_not_anxiety", "the car ac gauge rules the recharge not your anxiety", "the gauge rules, not your anxiety", { at: "el reloj manda no tu ansiedad" }),
  ]},
  // ░░ 25) SEGUNDO ERROR — cargar sin sellar ░░
  { a: "cargar sin buscar la perdida", beats: [
    C("ac_charge_without_finding_leak", "charging car ac without finding the leak second error", "a second error: charging without finding the leak", { at: "cargar sin buscar la perdida" }),
    C("ac_charge_again_and_again", "recharging car ac again and again wasting money on gas", "many just charge, and charge, and charge, wasting money on gas", { at: "cargar y cargar cada poco tiempo" }),
    C("ac_leaky_bucket_analogy", "filling a leaking bucket analogy for car ac charge without sealing", "charging without sealing is filling a leaky bucket", { at: "cargar sin sellar es llenar un balde agujereado" }),
  ]},
  // ░░ 26) HONESTIDAD — los límites ░░
  { a: "una honestidad grande", beats: [
    C("ac_big_honesty_limits", "honest man explaining the limits of a diy car ac recharge", "an honesty: this works for the huge majority, low gas", { at: "una honestidad grande" }),
    C("ac_must_tell_the_limits", "explaining the limits so you don't make a car ac mistake", "but I have to tell you the limits", { at: "pero tengo que decirte los limites" }),
    C("ac_big_leak_pouring_oil", "car ac with a big leak pouring oil empties in a day", "if you have a BIG leak, oil pouring, empties in a day", { at: "si tu auto tiene una perdida grande" }),
    C("ac_recharge_wont_save_it", "a car ac recharge that won't save a big leak repair first", "the recharge won't save it, you must repair the leak first", { at: "la recarga no te lo va a salvar" }),
    C("ac_compressor_truly_dead", "a car ac compressor that is truly dead needs replacement", "and if the compressor is truly dead, no click, ugly metal noise", { at: "si el compresor de verdad esta muerto" }),
    C("ac_ugly_metal_noise", "car ac compressor making an ugly grinding metal noise dead", "an ugly metal noise, or you charged well and still no cold", { at: "hace un ruido feo de metal" }),
    C("ac_you_checked_first_advantage", "informed driver who checked the car ac first before the shop", "the difference: now you checked first, you know what you have", { at: "la diferencia es que ahora vos lo chequeaste primero" }),
    C("ac_cant_sell_compressor_upfront", "shop that can't sell a compressor upfront after diy check", "they can't sell you a compressor upfront without trying the recharge", { at: "no te lo van a poder vender de arranque" }),
    C("ac_check_first_mostly_gas", "check the car ac first most of the time it's just gas", "check first: most of the time, it's gas", { at: "chequea primero" }),
  ]},
  // ░░ 27) SEGURIDAD ░░
  { a: "guantes y anteojos", beats: [
    X({ kind: "diagram", at: "guantes y anteojos", eyebrow: "La seguridad, en serio (5 reglas)", slides: [{ image: dg("dg_ac_safety", "Diagrama de seguridad con cinco íconos numerados en fila para cargar el aire de un auto: 1) GUANTES y ANTEOJOS (el gas congela la piel al toque), 2) trabajar SIEMPRE al AIRE LIBRE / ventilado, nunca en garaje cerrado (el gas desplaza el aire), 3) NO FUEGO ni cigarrillo cerca (ícono de fuego tachado), 4) NUNCA por el lado de ALTA, siempre por la BAJA (una 'H' tachada en rojo y una 'L' en verde) remarcado como la más importante, 5) no tirar las latas al FUEGO ni al SOL (están a presión). Etiquetas cortas debajo de cada ícono. Transmite las 5 reglas de seguridad de un vistazo."), eyebrow: "Guantes · ventilado · sin fuego · baja · latas a presión" }] }),
    C("ac_gloves_goggles_always", "wearing gloves and safety goggles for car ac recharge always", "one: gloves and goggles, always", { at: "guantes y anteojos" }),
    C("ac_gas_freezes_skin_touch", "car ac refrigerant gas freezing skin on contact cold burn", "the gas is so cold it freezes your skin at a touch", { at: "te congela la piel al toque" }),
    C("ac_work_outdoors_ventilated", "working on car ac outdoors well ventilated never closed garage", "two: work outdoors or well ventilated, never a closed garage", { at: "trabaja siempre al aire libre o bien ventilado" }),
    C("ac_gas_displaces_air", "car ac gas displaces breathable air in a closed space danger", "because the gas displaces the air and you don't want to breathe it", { at: "el gas desplaza el aire" }),
    C("ac_no_smoking_no_fire", "no smoking no open flame near car ac refrigerant work", "three: no smoking, no fire nearby", { at: "no fumes ni haya fuego cerca" }),
    C("ac_never_high_always_low", "never charge car ac by the high side always the low side rule", "four, the most important: never the high side, always the low", { at: "nunca cargues por el lado de alta siempre por el de baja" }),
    C("ac_dont_burn_cans_pressure", "car ac gas cans not thrown in fire or left in strong sun pressure", "five: don't toss cans in fire or leave them in strong sun", { at: "no tires las latas al fuego" }),
  ]},
  // ░░ 28) LOS DOS GASES — R134a vs R1234yf ░░
  { a: "hay dos tipos de gas y no son lo mismo", beats: [
    C("ac_two_types_of_gas", "two types of car ac refrigerant gas not interchangeable", "the last key thing: there are two types of gas, not the same", { at: "hay dos tipos de gas y no son lo mismo" }),
    X({ kind: "diagram", at: "el clasico el que lleva la mayoria de los autos de unos anos para atras se llama r134a", eyebrow: "R134a vs R1234yf: fijate cuál lleva TU auto", slides: [{ image: dg("dg_ac_two_gases", "Diagrama comparativo de los dos gases del aire de auto, en dos columnas. Izquierda: una lata etiquetada 'R134a' con carteles 'el clásico', 'autos de unos años para atrás', 'barato y fácil de conseguir'. Derecha: una lata etiquetada 'R1234yf' con carteles 'los autos más nuevos / 0 km', 'más moderno y más caro'. En el medio, una flecha con una prohibición grande: 'NO son intercambiables, no pongas uno por el otro'. Abajo, una ETIQUETA como la que va bajo el capó, con una lupa, señalando 'buscá esta etiqueta en el capó o cerca del radiador'. Transmite elegir el gas correcto."), eyebrow: "R134a (clásico, barato) · R1234yf (nuevo, caro)" }] }),
    C("ac_r134a_classic_gas_can", "can of R134a classic car ac refrigerant gas for older cars", "the classic, on most older cars, is called R134a", { at: "se llama r134a" }),
    C("ac_r1234yf_newer_gas_can", "can of R1234yf modern car ac refrigerant for newer cars", "newer cars use R1234yf, different and more expensive", { at: "el r1234yf" }),
    C("ac_gases_not_interchangeable", "two car ac gases that are not interchangeable warning", "you can't put one for the other", { at: "no podes poner uno por el otro" }),
    C("ac_know_which_your_car_takes", "knowing which refrigerant gas your car takes before buying", "before buying, you must know which one your car takes", { at: "tenes que saber cual lleva tu auto" }),
    C("ac_open_hood_find_label", "opening the car hood to find the refrigerant type label", "open the hood and find a label, usually inside the hood", { at: "abri el capo y busca una etiqueta" }),
    C("ac_label_says_gas_and_grams", "car ac label under hood stating gas type and grams", "it says the gas type and even how many grams your car takes", { at: "cuantos gramos lleva tu auto" }),
    C("ac_buy_the_matching_can", "buying the matching car ac gas can R134a or R1234yf", "check that label and buy the matching can", { at: "compra la lata que corresponde" }),
    C("ac_classic_car_is_r134a", "classic older car almost surely uses cheap R134a gas", "a classic car is almost surely R134a, the cheap and easy one", { at: "si lo tuyo es un auto clasico casi seguro es r134a" }),
  ]},
  // ░░ 29) RECAP — la regla de oro ░░
  { a: "repasemos la regla de oro de todo esto", beats: [
    C("ac_recap_golden_rule", "recap of the golden rule of car ac diy recharge montage", "let's recap the golden rule: AC not cooling is almost always low gas", { at: "repasemos la regla de oro de todo esto" }),
    C("ac_check_clutch_and_leak", "checking car ac clutch engages and no big leak recap", "check first that the clutch engages and there's no big leak", { at: "chequeas primero que el embrague enganche" }),
    C("ac_always_low_never_high_recap", "always charge car ac low never high recap reminder", "charge always by the low, never the high", { at: "cargas siempre por la baja nunca por la alta" }),
    X({ kind: "checklist", at: "baja despacio manometro y paras", title: "La regla de oro, en una", items: [{ text: "Casi siempre es gas bajo, no el compresor", state: "done" }, { text: "Chequeá el embrague y que no haya pérdida grande", state: "done" }, { text: "Cargá SIEMPRE por la baja, nunca por la alta", state: "done" }, { text: "Cargá despacio, mirando el manómetro", state: "done" }, { text: "Pará en la zona verde: ni una pizca de más", state: "done" }] }),
    C("ac_slow_gauge_stop_in_time", "charge car ac slowly watching gauge and stop in time green", "slow, watching the gauge, and stop in time in the green zone", { at: "baja despacio manometro y paras" }),
    C("ac_ac_blowing_cold_weekend", "car ac blowing cold again this weekend on the curb happy", "with just this you can leave your AC cold again this weekend", { at: "ya podes dejar tu aire soplando frio de nuevo" }),
    C("ac_road_trip_cool_kids", "family road trip with cold car ac kids cool in back seat", "the trip to the coast with the kids, nice and cool", { at: "el viaje a la costa con los chicos fresquito" }),
    C("ac_car_fridge_wallet_intact", "cool car like a fridge and wallet intact happy driver", "the car a fridge, and your wallet intact", { at: "el auto una heladera y el bolsillo entero" }),
  ]},
  // ░░ 30) INJERTO 3 + CIERRE ░░
  { a: "el auto entero esta lleno de estos arreglos", beats: [
    C("ac_whole_car_cheap_fixes", "the whole car is full of cheap fixes shops overcharge for", "the whole car is full of these fixes they charge like surgery", { at: "el auto entero esta lleno de estos arreglos" }),
    C("ac_squealing_brakes_cheap", "squealing car brakes fixed for pennies cheap fix", "the brakes that squeal and fix for pennies", { at: "los frenos que chillan y se arreglan por monedas" }),
    C("ac_dashboard_light_cheap_sensor", "car dashboard warning light that was a two peso sensor", "the dashboard light that scared you was a two-peso sensor", { at: "la luz del tablero que te asusta" }),
    C("ac_gathered_numbers_recipes", "gathering car and home repair numbers and recipes into a manual", "so I gathered those numbers and recipes with exact measures", { at: "por eso junte esos numeros y esas recetas" }),
    X({ kind: "diagram", at: "en el manual de reparaciones caseras", eyebrow: "Los 40, ordenados y con las medidas exactas", slides: [{ image: dg("dg_ac_manual_stack", "Lámina tipo colección de valor artesanal: el Manual de Reparaciones Caseras con 40 arreglos (madera y metal, plagas, goteras y humedad, y hogar y auto) con planos y medidas, apilado como una pila de valor. Al lado, la lata de gas con manómetro, el termómetro y la tablita de presiones del aire. Estilo archivo, incluida la receta justa del aire según gas y temperatura. Sin precios ni texto legible fino."), eyebrow: "Incluidas las presiones justas del aire" }] }),
    C("ac_manual_cheaper_than_one_charge", "home repair manual cheaper than one car ac shop charge value", "it costs less than what the shop wanted for one recharge", { at: "cuesta menos que lo que te queria cobrar el taller" }),
    C("ac_link_below_description", "link in the description and pinned comment for the manual", "the link is below, in the description and the pinned comment", { at: "el link esta abajo" }),
    C("ac_do_it_today_anyway", "man deciding to fix his car ac today even without the manual", "even if you never grab it, do today's fix", { at: "hazelo de hoy" }),
    C("ac_buy_the_matching_kit", "buying the right car ac gas kit for your car checking label", "check the hood label, buy the kit for your car's gas", { at: "compra el kit del gas que lleva tu auto" }),
    C("ac_kids_and_wallet_thank_you", "kids in cool car back seat and wallet thanking the driver", "your kids in the back will thank you, and your wallet too", { at: "tus chicos en el asiento de atras te lo van a agradecer" }),
  ]},
  // ░░ 31) PRÓXIMO ░░
  { a: "en el proximo video te voy a mostrar como sacar las abolladuras", beats: [
    C("ac_next_dent_removal_preview", "removing car body dents at home with heat and cold no paint", "next: how to pull dents out of the car's body", { at: "en el proximo video te voy a mostrar como sacar las abolladuras" }),
    C("ac_dent_shop_charges_fortune", "body shop charging a fortune to fix a car dent parking lot", "the ones the body shop charges a fortune for", { at: "te cobran una fortuna" }),
    C("ac_dent_fix_heat_and_cold", "pulling a car dent with just heat and cold cheap no paint", "and you'll do it with just heat and cold, without touching the paint", { at: "con nada mas que calor y frio" }),
    C("ac_seems_impossible_but_not", "a dent fix that seems impossible but it isn't cheap diy", "it seems impossible and it isn't", { at: "parece imposible y no lo es" }),
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
// seguidos. Reusa los ox* que ya andan bien del kit + componentes de refuerzo para acauto.
const OVL = [
  // ── HOOK — comparador termómetro 30° vs 6° (hero) ──
  { kind: "mdslider", at: "lo deje soplando frio de nuevo", dur: 5.2, beforeImg: "real/ac_thermometer_reads_30.png", afterImg: "real/ac_thermometer_reads_6_cold.png", beforeLabel: "Antes", afterLabel: "Después", beforeYears: "30°", afterYears: "6°", eyebrow: "El mismo auto, 20 minutos después", accent: "red" },
  // ── SOY TOMÁS — lower-third ──
  { kind: "mdname", at: "soy tomas", dur: 4.2, name: "Tomás", role: "El Constructor Libre", accent: "green" },
  // ── LA PRUEBA — dato 30° ──
  { kind: "oxstat", at: "30 grados", dur: 4.0, value: 30, suffix: "°", label: "el aire te está tirando el mismo aire de afuera", glyph: "🌡", accent: "red" },
  // ── LA CLAVE — 80% es gas bajo (regla madre) ──
  { kind: "oxstat", at: "no esta rotonada le falta gas", dur: 4.4, value: 80, suffix: "%", label: "de las veces que el aire no enfría, solo le falta gas", glyph: "💨", accent: "amber" },
  { kind: "oxrule", at: "hay una manera correcta de hacerlo y una manera de arruinar todo", dur: 4.6, text: "Hay una manera *correcta* y una manera de *arruinar todo*. Las dos usan las mismas herramientas.", accent: "red" },
  // ── STAKES — el negocio es tu desconocimiento ──
  { kind: "oxrule", at: "ese desconocimiento tuyo es justamente el negocio", dur: 4.6, text: "El auto está en la fosa, vos afuera. *Tu desconocimiento es el negocio.*", accent: "red" },
  // ── EL PRINCIPIO — kicker de capítulo ──
  { kind: "mdkicker", at: "no fabrica frio de la nada", dur: 3.4, num: "★", kicker: "El principio", title: "Un gas que da vueltas", glyph: "❄", accent: "blue" },
  { kind: "oxrule", at: "el gas sale da la vuelta y vuelve", dur: 4.4, text: "Siempre *el mismo gas*, siempre los mismos gramos, dando vueltas por un circuito cerrado.", accent: "blue" },
  // ── HERO acauto: el circuito cerrado (compresor→condensador→evaporador) + fuga lenta ──
  { kind: "accircuit", at: "un ventilador te sopla adentro del auto", dur: 6.4, title: "Un circuito cerrado de gas", accent: "blue" },
  // ── POR QUÉ DEJA — pérdida lenta ──
  { kind: "oxtag", at: "se escapa un poco de gas", dur: 4.0, name: "La pérdida normal", what: "Año tras año se escapa un poquito por las gomas. No se rompió: le falta gas.", side: "left", accent: "amber" },
  // ── REGLA #1 — sello de tinta (reutilizable ×3) ──
  { kind: "mdrulestamp", at: "la regla numero uno", dur: 5.0, text: "SI NO ENFRÍA, CASI SIEMPRE ES GAS BAJO", num: "1", label: "Regla", accent: "amber" },
  { kind: "bars", at: "una recarga de gas te sale una fraccion", dur: 6.2, title: "Recarga vs compresor", bars: [{ label: "Cambiar el compresor", value: 100, display: "$$$", tone: "danger" }, { label: "Recargar el gas vos mismo", value: 8, display: "una fracción", winner: true }] },
  // ── PASO 1 — kicker ──
  { kind: "mdkicker", at: "diagnosticar", dur: 3.4, num: "1", kicker: "Paso", title: "Diagnosticar (gratis)", glyph: "🔎", accent: "green" },
  { kind: "oxmethod", at: "busca el compresor del aire", dur: 4.8, num: "01", title: "El test del embrague", chips: ["Auto en marcha, aire al máximo", "Mirá la polea del compresor", "Tiene que enganchar con un clic"], cost: "0 herramientas", accent: "green" },
  { kind: "oxtag", at: "ese click es tu mejor amigo", dur: 4.0, name: "El clic del embrague", what: "Si engancha y gira, el compresor está vivo y el sistema eléctrico OK", side: "right", accent: "green" },
  { kind: "oxmethod", at: "revisa lo basico que la gente saltea", dur: 4.6, num: "02", title: "Lo básico que se saltea", chips: ["El fusible del aire", "La correa: ni floja ni cortada", "10 minutos, cargar al pedo evitado"], cost: "gratis", accent: "blue" },
  { kind: "oxtag", at: "el gas del aire viaja con un aceitito", dur: 4.0, name: "La mancha de aceite", what: "El gas viaja con un aceitito: donde hay fuga grande, queda marcado y pegajoso", side: "left", accent: "amber" },
  // ── PASO 2 — kicker + regla de oro (sello ×3) ──
  { kind: "mdkicker", at: "ahora si el paso dos", dur: 3.4, num: "2", kicker: "Paso", title: "La recarga", glyph: "🔧", accent: "blue" },
  { kind: "mdrulestamp", at: "se carga siempre por el lado de baja presion", dur: 5.0, text: "SIEMPRE POR LA BAJA. JAMÁS POR LA ALTA.", num: "!", label: "Seguridad", accent: "red" },
  // ── HERO acauto: los DOS puertos, BAJA (tuyo) vs ALTA (peligro) ──
  { kind: "acports", at: "la de baja es la que vos vas a usar", dur: 6.2, title: "Dónde SÍ y dónde NUNCA", accent: "green" },
  { kind: "oxtag", at: "el kit de recarga solo entra en la de baja", dur: 4.2, name: "La baja: la 'L'", what: "Caño más grueso, dice L de low. El conector del kit solo calza ahí", side: "right", accent: "green" },
  { kind: "oxstat", at: "tiene una presion enorme", dur: 4.0, value: 0, prefix: "", suffix: "", label: "la ALTA revienta la manguera en la cara y el gas te quema la piel", glyph: "⚠", accent: "red" },
  { kind: "oxmethod", at: "una lata de gas refrigerante con un manometro", dur: 4.8, num: "03", title: "El kit de recarga", chips: ["Lata de gas + manómetro", "Manguera con conector de baja", "Fijate QUÉ gas lleva tu auto"], cost: "no es caro", accent: "blue" },
  { kind: "oxrule", at: "el aire al maximo hace que el compresor trabaje a full", dur: 4.6, text: "Aire al *máximo* y ventilador a fondo: el lado de baja *pide* gas y la carga entra bien.", accent: "amber" },
  // ── PASO 2 — el momento clave: de a poco ──
  { kind: "mdrulestamp", at: "cargas de a poco", dur: 4.8, text: "UN POQUITO, PARÁS, MIRÁS. NUNCA DE GOLPE.", num: "2", label: "Regla", accent: "blue" },
  // ── HERO acauto: el manómetro manda (aguja sube al verde) ──
  { kind: "acgauge", at: "hasta meterte en esa zona correcta", dur: 6.0, title: "El manómetro te dice cuándo parar", accent: "green" },
  { kind: "oxstat", at: "a los 6 7 grados que buscas", dur: 4.2, value: 6, suffix: "°", label: "de 30 a 20, a 12, a los 6-7 grados que buscás en la rejilla", glyph: "🌡", accent: "green" },
  // ── HERO acauto: los pasos de la recarga, escalonados ──
  { kind: "acsteps", at: "cerras la lata desconectas con cuidado", dur: 6.4, title: "La recarga, paso a paso", accent: "green" },
  // ── INJERTO 1 — manual (mid, presiones) ──
  { kind: "manualcard", at: "un manual que arme", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Las presiones justas del aire según el gas y la temperatura, y 40 arreglos más del hogar y el auto.", accent: "amber" },
  // ── PASO 3 — kicker + UV ──
  { kind: "mdkicker", at: "buscar y frenar las perdidas chicas", dur: 3.4, num: "3", kicker: "Paso", title: "Frenar la pérdida", glyph: "🔦", accent: "amber" },
  { kind: "oxmethod", at: "latas de gas que ya vienen con tintura", dur: 4.8, num: "04", title: "Tintura UV + sellador", chips: ["La tinta viaja con el gas", "Linterna UV: la fuga brilla", "El sellador hincha las gomas"], cost: "barato, junto al kit", accent: "amber" },
  { kind: "oxtag", at: "un anillito de goma", dur: 4.0, name: "El o-ring reseco", what: "La fuga suele ser una junta floja o un anillito de goma de dos pesos", side: "left", accent: "green" },
  // ── PASO 4 — kicker + mantenimiento ──
  { kind: "mdkicker", at: "paso cuatro el mantenimiento", dur: 3.4, num: "4", kicker: "Paso", title: "Mantenimiento", glyph: "🛠", accent: "green" },
  { kind: "oxmethod", at: "usa el aire seguido", dur: 4.8, num: "05", title: "Tres cositas y anda años", chips: ["Usá el aire seguido, aun en invierno", "Limpiá el condensador de la parrilla", "Cambiá el filtro de habitáculo"], cost: "centavos", accent: "green" },
  // ── EL ERROR — kicker + regla ──
  { kind: "mdkicker", at: "con la mejor intencion", dur: 3.4, num: "✕", kicker: "El error", title: "SOBRECARGAR", glyph: "🚫", accent: "red" },
  { kind: "oxrule", at: "y es exactamente al reves", dur: 4.6, text: "'Más gas, más frío' es *mentira*. De más, el aire enfría *PEOR* y rompés el compresor sano.", accent: "red" },
  { kind: "oxstat", at: "un arreglo de 10 pesos en uno de mil", dur: 4.2, value: 1000, suffix: "", label: "el error convierte un arreglo de $10 en uno de $1000", glyph: "💸", accent: "red" },
  // ── HERO acauto: EL ERROR — sobrecargar (aguja al rojo + compresor recalienta) ──
  { kind: "acoverfill", at: "ahi es donde de verdad podes romper el compresor", dur: 6.2, title: "Más gas NO es más frío", accent: "red" },
  // ── EL MANÓMETRO MANDA — sello ×3 (3ra) ──
  { kind: "mdrulestamp", at: "el manometro te dice cuando parar", dur: 5.0, text: "PARÁS EN EL VERDE. NI UNA PIZCA MÁS.", num: "3", label: "Regla", accent: "green" },
  { kind: "oxrule", at: "menos es siempre mas seguro que demas", dur: 4.4, text: "*Menos es más seguro que de más*: corto enfría un poco menos y agregás. Pasado, ya rompiste.", accent: "amber" },
  // ── SEGUNDO ERROR — balde agujereado ──
  { kind: "oxrule", at: "cargar sin sellar es llenar un balde agujereado", dur: 4.6, text: "Cargar sin sellar es *llenar un balde agujereado*. En dos meses estás igual.", accent: "red" },
  // ── HONESTIDAD — límites ──
  { kind: "oxrule", at: "chequea primero", dur: 4.4, text: "Si hay fuga grande o el compresor está muerto, es taller. Pero *chequeá primero*: casi siempre es gas.", accent: "amber" },
  // ── RECAP — regla de oro ──
  { kind: "mdrulestamp", at: "baja despacio manometro y paras", dur: 5.0, text: "BAJA · DESPACIO · MANÓMETRO · PARÁS", num: "★", label: "La regla de oro", accent: "green" },
  // ── CIERRE — manual ──
  { kind: "manualcard", at: "en el manual de reparaciones caseras", dur: 6.0, image: "real/manual_cover.png", title: "Manual de Reparaciones Caseras", desc: "Los 40 arreglos, incluidas las presiones justas del aire, con las medidas exactas.", chip: "El link está en la descripción", accent: "amber" },
  // ── CIERRE PREMIUM — endcard combinado libro 3D + próximo video + lema ──
  { kind: "mdendcard", at: "en el proximo video te voy a mostrar como sacar las abolladuras", dur: 7.0, manualImg: "real/manual_cover.png", nextImg: "real/ac_next_dent_removal_preview.png", manualTitle: "Manual de Reparaciones Caseras", nextKicker: "En el próximo video", nextTitle: "Sacar las abolladuras con calor y frío", motto: "La independencia no se compra, se construye.", cta: "El link está en la descripción", accent: "green" },
];
let nOv = 0;
for (const o of OVL) { const s = atc(o.at); if (s == null) continue; const { kind, at: _a, dur = 4.2, ...props } = o; beats.push({ id: `ov_${kind}_${Math.round(s)}`, start: +s.toFixed(2), dur, kind, overlay: true, hue: "amber", ...props }); nOv++; }
beats.sort((a, b) => a.start - b.start);

// ── TRANSICIONES DE MARCA entre capítulos (overlay corto, ~0.42s). SOLO en 6 saltos
// de sección para que sigan siendo especiales. Se ancla al ARRANQUE de cada capítulo y
// arranca un pelín antes (offset) para que barra justo en el corte.
const TRANS = [
  { at: "ahora si el principio", variant: "ink", accent: "blue" },                 // → EL PRINCIPIO
  { at: "diagnosticar", variant: "grain", accent: "green" },                       // → PASO 1
  { at: "ahora si el paso dos", variant: "paper", accent: "blue" },                // → PASO 2 (recarga)
  { at: "buscar y frenar las perdidas chicas", variant: "grain", accent: "amber" },// → PASO 3
  { at: "llegamos a lo que te prometi al principio", variant: "ink", accent: "red" }, // → EL ERROR
  { at: "el auto entero esta lleno de estos arreglos", variant: "paper", accent: "green" }, // → cierre
];
let nTr = 0;
for (const tr of TRANS) { const s = atc(tr.at); if (s == null) continue; const st = +Math.max(0, s - 0.12).toFixed(2); beats.push({ id: `tr_${tr.variant}_${Math.round(s)}`, start: st, dur: 0.42, kind: "mdtrans", overlay: true, hue: "amber", variant: tr.variant, accent: tr.accent }); nTr++; }
beats.sort((a, b) => a.start - b.start);

// ── MAXIMUM DENSITY: imágenes ancladas en CADA mini-frase del shotlist aún sin cubrir ──
// [name, query EN visual, concept resuelto al contexto, frase ancla exacta de captions]
const FILL = [
  // ── COLD OPEN ──
  ["ac_fill_mira_bien_esto", "close up hand on a hot car dashboard vent in summer", "look closely at this hot car in summer", "mira bien esto"],
  ["ac_fill_ac_at_max_button", "pressing the car ac max button on a dashboard control", "you crank the AC to max", "prendes el aire lo pones al maximo"],
  ["ac_fill_leave_car_at_shop", "leaving a car at a repair shop and waiting outside", "you leave it at the shop and wait", "vas al taller"],
  ["ac_fill_pay_no_choice_summer", "family paying the shop with no choice in summer heat", "and you pay, no choice, it's summer", "y vos pagas"],
  ["ac_fill_now_watch_this", "man about to prove a car ac fix now watch this", "and now watch this", "y ahora mira esto"],
  ["ac_fill_why_charge_like_lifesaver", "shop charging like it saved your life for a 20 minute job", "why do they charge like they saved your life?", "el taller te lo cobra como si te salvara la vida"],
  // ── LUGAR CORRECTO ──
  ["ac_fill_sounds_like_serious", "driver fearing a serious car ac failure compressor dineral", "what sounds to you like a serious failure", "a compresor a un dineral"],
  ["ac_fill_copy_this_weekend", "man planning to copy a car ac recharge this weekend at home", "to copy this same weekend", "te la voy a mostrar paso a paso"],
  // ── LA PRUEBA 30° ──
  ["ac_fill_thermometer_type_kitchen", "a common kitchen thermometer probe type used for car vent", "a common kitchen thermometer, the kind that measures temp", "con un termometro delante tuyo"],
  // ── LA PRUEBA 6° / clave ──
  ["ac_fill_only_difference_gas", "the only difference was adding the missing car ac gas by hand", "the only difference: I added the gas it lacked", "le puse el gas que le faltaba"],
  // ── OPEN LOOPS ──
  ["ac_fill_where_never_connect", "the port on a car ac where you must never connect danger", "where you connect and where you never connect", "donde se conecta y donde nunca hay que conectar"],
  ["ac_fill_error_breaks_healthy", "the error that breaks a healthy car ac compressor reveal", "the one error, breaks a healthy compressor", "el unico error"],
  // ── STAKES ──
  ["ac_fill_what_it_cost_you", "man calculating what a broken car ac already cost him", "think about what this problem cost you", "pensa un segundo en lo que este problema ya te costo"],
  ["ac_fill_hot_night_in_car", "a stiflingly hot night inside a parked car cannot think", "the night it's 30 degrees inside the car", "la camisa pegada a la espalda"],
  ["ac_fill_car_in_pit_coffee", "car up on a shop lift owner drinking machine coffee outside", "the car in the pit, you outside with a coffee", "el auto esta adentro en la fosa"],
  // ── EL PRINCIPIO ──
  ["ac_fill_thats_all_the_magic", "that's all the magic a gas that spins and cools when it expands", "that's all the magic: a gas that cools as it expands", "un ventilador te sopla adentro del auto"],
  // ── POR QUÉ DEJA ──
  ["ac_fill_normal_all_cars", "it's normal all cars slowly lose car ac gas over time", "it's normal, all cars do it", "todos los autos lo hacen"],
  ["ac_fill_blows_warm_one_day", "car ac blowing directly warm air one day low gas", "until one day it blows warm", "no puede comprimir bien"],
  // ── NO ES EL COMPRESOR ──
  ["ac_fill_compressor_diff_of_money", "the compressor is where the shop's money difference is", "the compressor is where the money difference is", "pero como el compresor es lo caro"],
  // ── PASO 1 ──
  ["ac_fill_wasting_money_wrong", "charging gas to the wrong problem wastes money car ac", "charging the wrong car wastes money", "cargar gas a un auto que tiene otro problema es tirar la plata"],
  ["ac_fill_pulley_belt_front", "car ac compressor pulley with the belt running over it front", "a part with a pulley up front, where the belt runs", "busca el compresor del aire"],
  ["ac_fill_look_finer_problem", "if the clutch never moves look finer fuse sensor car ac", "if it never engages, look finer: a fuse, a sensor", "si el embrague ni se mueve"],
  ["ac_fill_ten_minutes_check", "ten minute basic car ac check of fuse and belt saves money", "ten minutes that save you charging for nothing", "la correa que no este floja ni cortada"],
  ["ac_fill_gas_goes_two_days", "a big car ac leak wastes a fresh charge in two days", "otherwise it goes again in two days", "si ves un chorreado de aceite evidente en una union"],
  // ── PASO 2 regla ──
  ["ac_fill_focus_here", "concentrate on the golden safety rule of car ac recharge", "here you have to concentrate", "hay una regla de oro"],
  ["ac_fill_valves_like_tire", "two car ac service valves like tire valves but different", "two little capped valves, like tire valves but different", "dos piquitos con tapa"],
  ["ac_fill_factory_protects_you", "factory design protects you kit only fits low car ac port", "the factory already protects you", "el kit de recarga solo entra en la de baja"],
  // ── PASO 2 recarga ──
  ["ac_fill_handbrake_on_curb", "car running on the curb with the handbrake on for ac recharge", "engine running, handbrake on, in a ventilated spot", "pones el auto en marcha en un lugar ventilado"],
  ["ac_fill_remove_valve_cap", "removing the cap from the car ac low pressure valve", "remove the cap and connect the kit", "buscas la valvula de baja"],
  // ── PASO 2 de a poco ──
  ["ac_fill_shake_the_can", "shaking a car ac refrigerant can before charging", "shake the can, open it a little", "la abris apenas"],
  ["ac_fill_reach_and_stop", "reaching the green zone on the car ac gauge and stopping", "just reach the zone and stop", "la zona pintada segun la temperatura de afuera"],
  // ── PASO 2 terminar ──
  ["ac_fill_watch_the_magic", "watching the vent temperature drop the magic of the recharge", "you'll see the magic, the vent number drops", "el numero de la rejilla baja"],
  // ── INJERTO 1 ──
  ["ac_fill_psi_by_outside_temp", "exact psi numbers by outside temperature for car ac chart", "how many PSI by outside temperature", "las presiones exactas"],
  // ── PASO 3 UV ──
  ["ac_fill_reason_gas_left", "if the gas left something leaks even slowly car ac", "if the gas left, it leaks somewhere, even slow", "si el gas se fue es porque por algun lado se escapa"],
  ["ac_fill_used_by_good_shops", "leak dye method used even by good car ac repair shops", "the most practical, used even by good shops", "si queres que dure atacas la perdida"],
  ["ac_fill_no_miracle_big_hole", "sealer no miracle on a big hole but ok for slow car ac leak", "no miracle on a big hole, fine for the slow leak", "para la perdida lenta de los anos"],
  // ── PASO 4 ──
  ["ac_fill_unused_ac_dries_seals", "an unused car ac dries out the rubber seals and leaks", "the AC never used dries the seals and leaks", "el aceitito circula y mantiene las juntas"],
  ["ac_fill_condenser_clogged_mugre", "car ac condenser clogged with dirt cools poorly even full", "if clogged with dirt, it cools badly even with gas", "el aire no puede tirar el calor afuera"],
  ["ac_fill_cabin_filter_glovebox", "car cabin air filter paper element behind the glovebox", "the paper filter behind the glovebox", "cambia el filtro de habitaculo"],
  // ── INJERTO 2 ──
  ["ac_fill_kit_fraction_of_shop", "the diy car ac kit costs a fraction of the shop price", "the kit is a fraction of what the shop charges", "nada de lo que te acabo de contar es caro"],
  ["ac_fill_wood_metal_no_rot", "home repair manual part on wood and metal that won't rot or rust", "one part on wood and metal that won't rot or rust", "una parte de madera y metal"],
  ["ac_fill_pests_for_cents", "home repair manual part on getting rid of pests for cents", "another on pests for cents", "otra de plagas por centavos"],
  // ── EL ERROR ──
  ["ac_fill_if_little_cools_little", "the false logic if little gas cools little then more cools more", "'if little gas cools little, more cools more'", "es lo mas logico del mundo pensarlo"],
  ["ac_fill_high_side_chokes", "car ac high side pressure choking the overfilled system", "the system chokes, less cold not more", "la presion del lado de alta se dispara por las nubes"],
  ["ac_fill_pays_the_expensive_repair", "the overfiller ends up paying the expensive compressor repair", "and then pays the expensive repair", "el error se paga solo"],
  // ── MANÓMETRO MANDA ──
  ["ac_fill_not_a_bit_more", "resisting adding a bit more car ac gas that breaks compressors", "'a bit more just in case' breaks compressors", "un poquito mas por las dudas"],
  // ── HONESTIDAD ──
  ["ac_fill_repair_leak_first", "repairing a big car ac leak first before recharging shop", "a big leak must be repaired first, sometimes at a shop", "la recarga no te lo va a salvar"],
  ["ac_fill_charged_still_no_cold", "charged the car ac well and still no cold dead compressor", "or you charged well and still no cold: minority of cases", "hace un ruido feo de metal"],
  // ── SEGURIDAD ──
  ["ac_fill_cold_burn_dry_ice", "a cold burn from car ac gas like dry ice on skin", "a cold burn like dry ice", "te congela la piel al toque"],
  ["ac_fill_never_closed_garage", "never recharge car ac in a closed garage gas displaces air", "never in a closed garage", "el gas desplaza el aire"],
  // ── GASES ──
  ["ac_fill_more_modern_expensive", "R1234yf a more modern and more expensive car ac gas", "more modern and more expensive", "el r1234yf"],
  ["ac_fill_label_under_hood_lupa", "reading the car ac gas label under the hood with attention", "the label says which gas your car takes", "cuantos gramos lleva tu auto"],
  ["ac_fill_new_car_check_other", "a new zero km car may use the other refrigerant gas check", "if it's a new car, check, it may be the other", "si lo tuyo es un auto clasico casi seguro es r134a"],
  // ── RECAP ──
  ["ac_fill_take_it_engraved", "the golden rule of car ac to take engraved recap", "the golden rule, take it engraved", "repasemos la regla de oro de todo esto"],
  // ── CIERRE ──
  ["ac_fill_battery_terminal_cheap", "a car battery that just needed the sulfated terminal cleaned", "the battery that only needed the terminal cleaned", "los frenos que chillan y se arreglan por monedas"],
  ["ac_fill_all_in_one_place", "forty cheap car and home fixes gathered in one ordered manual", "gathered in one place for the day you need it", "cuesta menos que lo que te queria cobrar el taller"],
  ["ac_fill_give_back_the_cold", "giving back the cold to a car ac you gave up for dead", "give back the cold to that AC you gave up for dead", "compra el kit del gas que lleva tu auto"],
  ["ac_fill_without_touching_paint", "pulling a car dent without touching the paint cheap diy", "without touching the paint", "parece imposible y no lo es"],
];
for (const [name, query, concept, ph] of FILL) { const s = atc(ph); if (s == null) continue; beats.push({ id: name, start: +s.toFixed(2), dur: 3, kind: "raw", src: `real/${name}.png`, darken: 0, hue: HUES[Math.round(s) % 3] }); addB(name, query, concept); }
beats.sort((a, b) => a.start - b.start);

// ── BURSTS extra (oxstack) para flashes sub-1s en momentos de lista ──
const BURSTS = [
  { at: "de horno a heladera", images: ["real/ac_thermometer_reads_30.png", "real/ac_recharging_gas_by_hand.png", "real/ac_thermometer_reads_6_cold.png"], captions: ["30° (horno)", "el gas que faltaba", "6° (heladera)"], accent: "red" },
  { at: "esto lo haces vos solo sin herramientas", images: ["real/ac_clutch_engaging_clac.png", "real/ac_check_fuse_box_basics.png", "real/ac_oily_stains_ac_joints.png"], captions: ["El embrague", "Fusible y correa", "La mancha de aceite"], accent: "green" },
  { at: "buscas la valvula de baja", images: ["real/ac_low_marked_L_letter.png", "real/ac_connect_to_low_valve.png", "real/ac_needle_in_low_red_zone.png"], captions: ["Válvula de baja (L)", "Conectás el kit", "El manómetro marca"], accent: "blue" },
  { at: "paso cuatro el mantenimiento", images: ["real/ac_use_ac_often_even_winter.png", "real/ac_clean_the_condenser.png", "real/ac_change_cabin_filter.png"], captions: ["Usá el aire seguido", "Limpiá el condensador", "Cambiá el filtro"], accent: "green" },
];
for (const b of BURSTS) { const s = atc(b.at); if (s == null) continue; beats.push({ id: `burst_${Math.round(s)}`, start: +s.toFixed(2), dur: 4.2, kind: "oxstack", overlay: true, hue: "amber", images: b.images, captions: b.captions, accent: b.accent }); }
beats.sort((a, b) => a.start - b.start);

// ── STRUCT — formatos estructurados (gate de variedad: ≥6 tipos, ≥6% peso, bars≥2) ──
const STRUCT = [
  { kind: "bars", at: "y a la media hora sale el tipo con cara de medico", hue: "red", title: "Lo que te cuesta el aire roto", bars: [{ label: "Taller: recarga o compresor", value: 100, display: "$$$", tone: "danger" }, { label: "Cargarlo vos en la vereda", value: 6, display: "una lata", winner: true }] },
  { kind: "bars", at: "no es el compresor", hue: "amber", title: "El aire que no enfría", bars: [{ label: "Gas bajo (lo simple)", value: 80, display: "80%", winner: true }, { label: "Compresor u otra falla", value: 20, display: "20%", tone: "danger" }] },
  { kind: "process", at: "vamos paso a paso", hue: "blue", title: "Los 4 pasos, de principio a fin", eyebrow: "Cada uno importa", steps: [{ title: "Diagnosticar", desc: "embrague, fusible, correa y pérdida grande, gratis" }, { title: "Recargar", desc: "siempre por la baja, de a poco, mirando el manómetro" }, { title: "Frenar la pérdida", desc: "tintura UV, junta u o-ring, para que dure años" }, { title: "Mantenimiento", desc: "usar el aire, limpiar condensador, cambiar filtro" }] },
  { kind: "process", at: "la recarga en si", hue: "blue", title: "La recarga, paso a paso", eyebrow: "Con el auto en marcha y el aire al máximo", steps: [{ title: "Conectás la baja", desc: "sacás la tapita, el conector hace clic" }, { title: "Cargás de a poco", desc: "un poquito, parás, mirás el manómetro" }, { title: "Parás en el verde", desc: "zona correcta y rejilla a 6-7°, y guardás" }] },
  { kind: "aged", at: "casi siempre es gas bajo no el compresor", hue: "amber", heading: "LA REGLA MADRE", eyebrow: "Antes de pagar una fortuna", lines: ["El compresor es un fierro que dura años", "Que se rompa de verdad es la minoría", { text: "Si no enfría, casi siempre es solo gas bajo", mark: true }] },
  { kind: "aged", at: "sobrecargar", hue: "red", heading: "EL ERROR FATAL", eyebrow: "Justo cuando creés que lo hacés bien", lines: ["Metés más gas pensando 'más frío'", "El sistema se ahoga y enfría PEOR", { text: "Rompés el compresor que estaba sano", mark: true }] },
  // dato duro de seguridad como REGLA numerada
  { kind: "rule", at: "por eso baja siempre baja", number: "!", title: "Siempre por la baja", label: "la alta, con el auto andando, tiene una presión enorme: nunca la tocás", hue: "red" },
  // callouts terrosos
  { kind: "callout", at: "ese click es tu mejor amigo", figure: "Clic", caption: "Si el embrague engancha y gira, el compresor está vivo y el sistema eléctrico OK.", accent: "good", image: "real/ac_clutch_clicking_engaging.png" },
  { kind: "callout", at: "tiene una presion enorme", figure: "Peligro", caption: "El lado de alta puede reventar la manguera en la cara y el gas te quema la piel.", accent: "danger", image: "real/ac_hose_bursts_in_face_danger.png" },
  { kind: "callout", at: "ahi esta tu fuga", figure: "UV", caption: "La tintura brilla justo en la unión donde se escapa el gas: ahí está tu fuga.", accent: "good", image: "real/ac_fluorescent_leak_mark.png" },
  // ecuación de ingredientes = el kit
  { kind: "ingredients", at: "una lata de gas refrigerante con un manometro", items: [{ image: "real/ac_refrigerant_can_shown.png", label: "Lata de gas" }, { image: "real/ac_gauge_manifold_tool.png", label: "Manómetro" }, { image: "real/ac_connect_to_low_valve.png", label: "Manguera de baja" }], resultLabel: "El kit de recarga" },
  // stat del error
  { kind: "stat", at: "con mas gas del que corresponde el aire enfria peor", value: 0, prefix: "", suffix: "", eyebrow: "Más gas ≠ más frío", label: "de más, el aire enfría PEOR y rompés el compresor", accent: "danger", hue: "red" },
  // annotated — la etiqueta bajo el capó
  { kind: "annotated", at: "abri el capo y busca una etiqueta", hue: "blue", image: "real/ac_label_says_gas_and_grams.png", eyebrow: "La etiqueta que decide qué lata comprar", caption: "Dice R134a o R1234yf y hasta los gramos que lleva tu auto", annotations: [{ kind: "circle", x: 0.5, y: 0.5, w: 0.28, label: "acá dice tu gas", color: "cold" }] },
  // callout del manual barato
  { kind: "callout", at: "cuesta menos que lo que te queria cobrar el taller", figure: "< 1 recarga", caption: "El manual cuesta menos que lo que te cobraban por cargar el aire una sola vez.", accent: "good", image: "real/manual_cover.png" },
  // splitlist — la regla de oro compacta
  { kind: "splitlist", at: "cargas siempre por la baja nunca por la alta", title: "La regla de oro, en 4", items: ["Casi siempre es gas bajo", "Siempre por la baja", "Despacio, mirando el manómetro", "Parás en el verde, ni una pizca más"], palette: "D" },
  // cross-section — dónde se conecta
  { kind: "cross", at: "el de baja presion y el de alta presion", hue: "cold", title: "Los dos lados del circuito", eyebrow: "Baja y alta presión", layers: [{ label: "Lado de BAJA (L)", depth: "caño grueso: cargás acá", color: "#6a9a6a" }, { label: "Compresor", depth: "aprieta el gas", color: "#7a6a52" }, { label: "Lado de ALTA (H)", depth: "caño fino: NUNCA lo tocás", color: "#c94f4f" }] },
  // numcard honesta — chequeaste primero
  { kind: "numcard", at: "la diferencia es que ahora vos lo chequeaste primero", number: "✓", name: "Chequeaste primero", eyebrow: "Ya no te venden humo", total: "1", bg: "real/ac_you_checked_first_advantage.png", accent: "good" },
];
for (const s of STRUCT) { const t = atc(s.at); if (t == null) continue; const { kind, at: _a, image, ...props } = s; const beat = { id: `cmp_${kind}_st_${Math.round(t)}`, start: +t.toFixed(2), dur: 6.5, kind, hue: s.hue || "blue", ...props, ...(image ? { image } : {}) }; if (kind === "aged" && Array.isArray(beat.lines)) beat.lines = beat.lines.map((l) => (typeof l === "string" ? { text: l } : l)); if (kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); beats.push(beat); }
beats.sort((a, b) => a.start - b.start);

// ── LAYERED REVEALS — momentos "hero" de REVELADO POR CAPAS con zoom (LayeredReveal) ──
// Patrón canónico (receta del bórax): imagen PRINCIPAL con ken-burns zoom IN → cuando se
// nombra cada parte, la principal hace zoom OUT + blur y entra UNA sub-imagen por vez (cada
// una anclada a SU palabra exacta). Full-screen, opaco, y con avatar OCULTO.
const LR_MAX = 16;
const LAYERED_WINDOWS = [];
const LAYERS = [
  // 1) EL KIT DE RECARGA — lata + manómetro + manguera de a uno
  {
    at: "una lata de gas refrigerante con un manometro", accent: "blue", tail: 2.2,
    eyebrow: "El kit de recarga y sus partes",
    main: { image: "real/ac_can_gauge_hose_assembled.png", caption: "El kit, todo junto" },
    subs: [
      { at: "una lata de gas refrigerante con un manometro", image: "real/ac_refrigerant_can_shown.png", caption: "Lata de gas + manómetro" },
      { at: "fijate que gas lleva tu auto antes de comprar", image: "real/ac_check_which_gas_first.png", caption: "Fijate qué gas lleva tu auto" },
    ],
  },
  // 2) LOS 5 PASOS DE LA RECARGA — conectar → cargar → parar
  {
    at: "buscas la valvula de baja", accent: "green", tail: 2.4,
    eyebrow: "La recarga, paso a paso",
    main: { image: "real/ac_connect_to_low_valve.png", caption: "Conectás la válvula de baja" },
    subs: [
      { at: "cargas de a poco", image: "real/ac_charge_stop_look_gauge.png", caption: "Cargás de a poco, mirando el reloj" },
      { at: "a los 6 7 grados que buscas", image: "real/ac_reaches_6_7_degrees.png", caption: "Parás en 6-7° y zona verde" },
    ],
  },
  // 3) ENCONTRAR LA FUGA — tintura → linterna UV → o-ring
  {
    at: "la tintura es un colorante que viaja con el gas", accent: "amber", tail: 2.4,
    eyebrow: "Encontrar y frenar la fuga",
    main: { image: "real/ac_dye_travels_with_gas.png", caption: "La tintura UV viaja con el gas" },
    subs: [
      { at: "iluminas las uniones del aire", image: "real/ac_uv_flashlight_joints.png", caption: "Linterna UV sobre las uniones" },
      { at: "un anillito de goma", image: "real/ac_replace_dry_oring.png", caption: "Cambiás el o-ring de dos pesos" },
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
if (MODE === "match") { console.log(`=== build_acauto MATCH ===`); console.log(`match ${MATCH.length} · bing ${BING.length} · diag ${DIAGRAMS.length} · proxy ${(2 * MATCH.length / 6).toFixed(0)}/IP`); process.exit(0); }
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
// GRANDE NO debe tapar/duplicar (diagramas, layered reveals, y componentes hero del kit).
const PROMINENT = new Set(["diagram", "layered", "mdrulestamp", "mdslider", "mdkicker", "mdendcard", "acgauge", "acports", "acoverfill", "acsteps", "accircuit"]);
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
console.log(`=== build_acauto BUILD ===`);
console.log(`beats ${beats.length} (raw ${rawN}, ${(100 * rawN / beats.length).toFixed(0)}%) · clips ${nClip} · imgs ${nReal} · gpt ${nImg} · faltan ${nMiss} · dur ${(dur / 60).toFixed(1)}min · pace ${(dur / beats.length).toFixed(1)}s`);
console.log(`avatar-full ${(avSecs / 60).toFixed(1)}min · PiP ${pip.length} · windows ${windows.length} · MATCH ${MATCH.length} · BING ${BING.length} · DIAG ${DIAGRAMS.length}`);
if (miss.length) console.log(`faltan (${miss.length}): ${miss.slice(0, 12).join(", ")}`);
