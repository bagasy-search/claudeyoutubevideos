// build_vwtchhlmzl7f.mjs — Levi Lapp Jardín · "25 usos del agua oxigenada".
// DIRECTOR POR SECCIONES + BUILD. Ancla todo al ms exacto de las captions de Whisper.
//   node build_vwtchhlmzl7f.mjs
// Emite: _v3/vwtchhlmzl7f_plan.json · src/VideoEdit/cues_vwtchhlmzl7f.gen.tsx
//        src/VideoEdit/Main_vwtchhlmzl7f.tsx · src/index_vwtchhlmzl7f.tsx
//        public/img/prompts_vwtchhlmzl7f.json (imágenes personales, gpt-image-2 + ref)
import fs from "fs";

const SLUG = "vwtchhlmzl7f";
const FPS = 30;
const TOTAL_S = 1479.006;
const TOTAL_FRAMES = Math.round(TOTAL_S * FPS);

// ── 1. CAPTIONS → ORACIONES ──────────────────────────────────────────────────
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const words = (Array.isArray(caps) ? caps : caps.words || caps.segments).map((w) => ({
  t: (w.text || w.word || "").trim(),
  a: (w.startMs ?? w.start ?? 0) / 1000,
  b: (w.endMs ?? w.end ?? 0) / 1000,
}));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const sentences = [];
{
  let cur = null;
  for (const w of words) {
    if (!cur) cur = { a: w.a, b: w.b, t: w.t };
    else { cur.t += " " + w.t; cur.b = w.b; }
    if (/[.?!]$/.test(w.t)) { sentences.push(cur); cur = null; }
  }
  if (cur) sentences.push(cur);
}
const SN = sentences.map((s) => norm(s.t));
// Texto global normalizado + mapa posición→oración. Hace falta porque Whisper corta las
// oraciones donde quiere: una ancla como "Uso uno. Despertar semillas duras" cae partida
// en dos oraciones y una búsqueda por-oración no la encuentra nunca.
const FULL = SN.join(" ");
const POS = new Int32Array(FULL.length + 8);
{ let p = 0; SN.forEach((s, i) => { for (let k = 0; k <= s.length; k++) POS[p + k] = i; p += s.length + 1; }); }
// Whisper escribe los números en DÍGITOS ("Uso 16", "200 plantines", "60 años") mientras que
// el guion los tiene en letras. Sin esta traducción se pierde el ancla de casi todos los usos.
const NUM = { uno: "1", dos: "2", tres: "3", cuatro: "4", cinco: "5", seis: "6", siete: "7", ocho: "8", nueve: "9", diez: "10", once: "11", doce: "12", trece: "13", catorce: "14", quince: "15", dieciseis: "16", diecisiete: "17", dieciocho: "18", diecinueve: "19", veinte: "20", veintiuno: "21", veintidos: "22", veintitres: "23", veinticuatro: "24", veinticinco: "25", treinta: "30", cincuenta: "50", sesenta: "60", noventa: "90", cien: "100", doscientos: "200" };
const conDigitos = (q) => q.split(" ").map((w) => NUM[w] || w).join(" ");
const at = (frase) => {
  const q = norm(frase);
  if (!q) return -1;
  for (const cand of [q, conDigitos(q)]) {
    let k = FULL.indexOf(cand);
    if (k >= 0) return POS[k];
    const corto = cand.split(" ").slice(0, 5).join(" ");
    if (corto.length > 12) { k = FULL.indexOf(corto); if (k >= 0) return POS[k]; }
  }
  console.warn(`  ⚠ ancla no encontrada: "${frase}"`);
  return -1;
};

// ── 2. SECCIONES ─────────────────────────────────────────────────────────────
// Cada sección: su OBJETIVO declarado + pool de b-roll propio + sus componentes.
const B = (n) => `broll/${SLUG}/${n}.mp4`;
const IMG = (n) => `img/${SLUG}_${n}.png`;

const SECCIONES = [
  { id: "hook", objetivo: "Clavar el frasco de $1 en 30s: el objeto, la promesa imposible y el primer loop.",
    desde: 0,
    pool: ["px_pharmacy_shelf","px_brown_bottle","px_hand_bottle","px_veg_garden_rows","px_chickens_yard","px_farmhouse_kitchen","px_cleaning_products","px_pouring_liquid","px_garden_golden","px_hands_harvest"] },
  { id: "ciencia", objetivo: "Explicar QUÉ es el peróxido para que los 25 usos se expliquen solos. El frasco marrón como plantada del loop final.",
    ancla: "El agua oxigenada es agua con un átomo de oxígeno de más",
    pool: ["px_bubbles_macro","px_oxygen_bubbles","px_water_drop","px_foam_close","px_dark_soil","px_lab_glass","px_old_bottles","px_vintage_shelf","px_green_leaves_macro","px_pouring_liquid","px_brown_bottle","px_sunlight_window"] },
  { id: "enemigo", objetivo: "Nosotros vs ellos: la industria partió un frasco en 25 productos. Bronca controlada.",
    ancla: "Y por qué se dejó de usar",
    pool: ["px_supermarket_aisle","px_cleaning_products","px_shopping_cart","px_money_hand","px_baking_soda","px_vintage_shelf","px_dusty_shelf","px_bathroom_shelf"] },
  { id: "abuelo", objetivo: "La herida: 200 plantines caídos. La prueba humana de lo ya explicado, no una presentación.",
    ancla: "A mi abuelo Amos yo lo vi salvar una siembra entera",
    pool: ["px_greenhouse_inside","px_seed_trays","px_tomato_seedlings","px_wilted_plant","px_rain_greenhouse","px_barn_field","px_countryside_road","px_farmhouse_kitchen","px_canning_jars","px_watering_can","px_old_farmer","px_elderly_hands","px_rain_leaves"] },
  { id: "promesa", objetivo: "Roadmap con números + los tres loops abiertos (los 4 límites y el error del 90%).",
    ancla: "Y ahora la promesa",
    pool: ["px_measuring_spoon","px_mixing_bucket","px_veg_garden_rows","px_chickens_yard","px_kitchen_sponge","px_hands_soil"] },
  { id: "raiz", objetivo: "Usos 1-7: semilla y raíz. Los de resultado más rápido, para que pruebe hoy.",
    ancla: "Empecemos por la semilla y la raíz",
    pool: ["px_parsley_seeds","px_carrot_seeds","px_seeds_jar_water","px_sowing_seeds","px_sprout_timelapse","px_seedling_growing","px_watering_tray","px_seed_trays","px_yellow_leaves","px_potted_plant_sad","px_repotting","px_roots_soil","px_wet_muddy_soil","px_cutting_in_water","px_mint_glass","px_murky_water","px_plastic_pots","px_washing_pots","px_terracotta_pots","px_pruning_shears","px_pruning_rose","px_diseased_leaf","px_garden_tools","px_wiping_blade","px_measuring_spoon","px_dark_soil"] },
  { id: "objecion", objetivo: "Matar la objeción de la dilución con el argumento de la lluvia. Confianza técnica.",
    ancla: "hay una objeción que se te tiene que haber cruzado",
    pool: ["px_storm_sky","px_thunder_field","px_rain_leaves","px_rain_puddle","px_wet_leaves_sun","px_green_leaves_macro","px_watering_garden","px_measuring_spoon","px_dark_soil"] },
  { id: "plagas", objetivo: "Usos 8-14: hongos y plagas. Es donde el frasco se pone bravo — el tramo de mayor dolor.",
    ancla: "Vamos a los hongos y las plagas",
    pool: ["px_squash_leaves","px_zucchini_plant","px_cucumber_vine","px_pumpkin_patch","px_spraying_plants","px_spray_bottle","px_garden_sprayer","px_tomato_plant","px_tomato_leaves","px_tomato_stake","px_strawberry_plants","px_strawberry_close","px_straw_mulch","px_moldy_fruit","px_gnats_plant","px_watering_houseplant","px_aphids_macro","px_ladybug_leaf","px_spider_mite_web","px_soap_bubbles_bowl","px_ants_marching","px_ant_nest","px_mossy_pot","px_greenhouse_glass","px_scrub_brush","px_diseased_leaf"] },
  { id: "limites", objetivo: "Lo que NO hace + seguridad. Es el tramo que lo vuelve creíble y no un vendedor.",
    ancla: "Te dije que te iba a decir lo que el agua oxigenada NO hace",
    pool: ["px_fertilizer_hand","px_fertilizer_bag","px_beetle_leaf","px_stink_bug","px_weevil_macro","px_cut_finger","px_first_aid","px_washing_hands","px_hospital_corridor","px_vinegar_bottle","px_bleach_cleaning","px_warning_label","px_gloves_mask","px_foam_close"] },
  { id: "animales", objetivo: "Usos 15-19: gallinero, galpón y el moho negro (el que reemplaza 3 productos).",
    ancla: "Los animales y el galpón",
    pool: ["px_chickens_yard","px_chicken_drinking","px_chicken_waterer","px_slimy_container","px_chicken_coop","px_nesting_box_eggs","px_hen_closeup","px_bird_bath","px_ducks_pond","px_green_pond","px_rubber_boots","px_boots_walking","px_shed_door","px_black_mold_wall","px_bathroom_tile","px_damp_basement","px_scrubbing_tile","px_spray_bottle"] },
  { id: "casa", objetivo: "Usos 20-25: cocina, heladera, ropa y baño. Universal — engancha al que no tiene huerta.",
    ancla: "Ahora entramos a la casa",
    pool: ["px_cutting_board","px_raw_chicken_board","px_washing_dishes","px_kitchen_sponge","px_cleaning_counter","px_fridge_open","px_fridge_shelves","px_veg_drawer","px_washing_lettuce","px_lettuce_fresh","px_berries_bowl","px_moldy_fruit","px_laundry_stain","px_white_shirt","px_washing_machine","px_clothes_line","px_toothbrush_glass","px_toothbrush_macro","px_bathroom_shelf"] },
  { id: "error", objetivo: "PAGAR el loop grande con info NUEVA: el frasco está muerto. Prueba de la papa.",
    ancla: "Y ahora sí, el error",
    pool: ["px_dusty_shelf","px_opening_cap","px_sunlight_window","px_brown_bottle","px_spray_bottle","px_potato_cut","px_potato_raw","px_foam_close","px_sink_drain","px_writing_label","px_bathroom_shelf","px_bubbles_macro"] },
  { id: "cierre", objetivo: "Recap accionable de 4 pasos, carnada de comentarios, teaser de cáscaras de huevo y firma.",
    ancla: "Haz esto esta semana",
    pool: ["px_potato_cut","px_writing_label","px_brown_bottle","px_pruning_shears","px_berries_bowl","px_eggshells","px_glass_jar_lid","px_cracked_tomato","px_harvest_basket","px_garden_golden","px_barn_evening","px_veg_garden_rows","px_hands_harvest","px_compost_pile"] },
];

// resolver límites de sección
for (const s of SECCIONES) s.i0 = s.desde != null ? s.desde : at(s.ancla);
SECCIONES.sort((a, b) => a.i0 - b.i0);
for (let k = 0; k < SECCIONES.length; k++) SECCIONES[k].i1 = k + 1 < SECCIONES.length ? SECCIONES[k + 1].i0 : sentences.length;
const secOf = (i) => SECCIONES.find((s) => i >= s.i0 && i < s.i1) || SECCIONES[SECCIONES.length - 1];

// ── 3. LOS 25 USOS (tabla del DIRECTOR) ──────────────────────────────────────
// Cada uso: ancla de su título · dilución (titular corto) · pasos · porqué.
// Los textos de los carteles son TITULARES: ≤12 palabras (0,8s + palabras/2,5).
const USOS = [
  { n: "01", ancla: "Uso uno. Despertar semillas duras", tit: "Despertar semillas duras", dil: "1 cdita en ½ taza · 30 min",
    pasos: ["Remojo 30 min", "Enjuagar", "Sembrar húmedas"], stat: { v: 10, suf: " días", lab: "Perejil: de 21 días a" } },
  { n: "02", ancla: "Desinfectar la tierra del almácigo", tit: "Tierra de almácigo limpia", dil: "1 cucharada por litro",
    pasos: ["Regar hasta que drene", "Esperar 1 hora", "Recién ahí sembrar"] },
  { n: "03", ancla: "Frenar el mal del almácigo", tit: "Frenar el mal del almácigo", dil: "1 cucharada por litro · 2 riegos",
    pasos: ["Sacar los caídos", "Regar el resto", "Repetir a los 3 días"] },
  { n: "04", ancla: "Uso cuatro. Raíces ahogadas", tit: "Raíces ahogadas", dil: "1 cucharada por litro",
    lista: ["No le falta agua", "Le falta aire", "La raíz se está pudriendo"], stat: { v: 4, suf: " días", lab: "La planta cambia la cara en" } },
  { n: "05", ancla: "Enraizar gajos en agua", tit: "Gajos que no se pudren", dil: "½ cucharadita por litro",
    pasos: ["Cambiar el agua cada 3 días", "Con la misma mezcla", "Tallo blanco, raíces afuera"] },
  { n: "06", ancla: "Uso seis. Bandejas y macetas usadas", tit: "Macetas y bandejas usadas", dil: "1 parte en 5 de agua",
    lista: ["Guardan esporas en cada rayita", "Trapo y secar al sol"] },
  { n: "07", ancla: "Uso siete. Las tijeras de podar", tit: "Las tijeras de podar", dil: "Puro, al 3% · 4 segundos",
    lista: ["Vacunás a la sana con la enferma", "Un frasquito en el cinturón", "No oxida el filo"] },
  { n: "08", ancla: "Uso ocho. Mildiu polvoriento", tit: "Mildiu polvoriento", dil: "1 parte en 9 de agua",
    lista: ["Rociar debajo de la hoja", "Al atardecer, nunca al mediodía", "Cada 7 días"], stat: { v: 5, suf: " semanas", lab: "Cosecha que ibas a perder" } },
  { n: "09", ancla: "Tizón y manchas en el tomate", tit: "Tizón del tomate", dil: "1 parte en 9 de agua",
    lista: ["Rociar el SUELO, no solo la hoja", "El hongo salpica hacia arriba"] },
  { n: "10", ancla: "Moho gris de la fresa", tit: "Moho gris de la fresa", dil: "1 en 9 · con la fruta verde",
    lista: ["Sobre la planta y la paja", "Con pelusa, ya la perdiste"] },
  { n: "11", ancla: "La mosquita del sustrato", tit: "Mosquita del sustrato", dil: "1 cucharada por litro · 2 riegos",
    lista: ["La mosca no molesta", "La larva se come las raíces", "Repetir a los 4 días"] },
  { n: "12", ancla: "Uso doce. Pulgones", tit: "Pulgones y araña roja", dil: "2 cdas + ½ cdita de jabón por litro",
    lista: ["El jabón rompe la cera", "El oxígeno entra", "Rociar al atardecer"] },
  { n: "13", ancla: "El nido de hormigas en la maceta", tit: "Nido de hormigas", dil: "1 parte en 5 · chorro al nido",
    lista: ["No las mata a todas", "Les arruina el hormiguero"] },
  { n: "14", ancla: "Uso catorce. El verdín", tit: "El verdín", dil: "1 en 5 · 10 minutos · cepillo",
    lista: ["Macetas de barro", "Vidrios del invernadero", "La regadera por dentro"] },
  { n: "15", ancla: "El bebedero de las gallinas", tit: "Bebedero de gallinas", dil: "1 cdita por litro · 2 veces/semana",
    lista: ["El limo es biofilm", "Empezar con menos", "Nunca en aves enfermas"] },
  { n: "16", ancla: "Uso dieciséis. El gallinero", tit: "El gallinero", dil: "1 parte en 5 de agua",
    lista: ["Nidos, comederos, perchas", "Sin gases pesados como el cloro"] },
  { n: "17", ancla: "El bebedero de pájaros", tit: "Bebedero y charca", dil: "1 parte en 5 de agua",
    lista: ["Vaciar y rociar", "Cepillar", "Enjuagar antes de llenar"] },
  { n: "18", ancla: "Tus botas y tus manos", tit: "Botas y manos", dil: "Puro, al 3% · 5 segundos",
    lista: ["Vos sos el transporte del hongo", "Frasquito en la puerta del galpón"] },
  { n: "19", ancla: "Uso diecinueve. El moho negro", tit: "El moho negro", dil: "Puro, al 3% · 15 minutos",
    lista: ["Juntas, sótano, pared húmeda", "Entra en el poro", "El cloro solo blanquea"], stat: { v: 3, suf: " productos", lab: "Los que tiré del galpón" } },
  { n: "20", ancla: "Uso veinte. La tabla de picar", tit: "La tabla de picar", dil: "Puro · 5 minutos",
    pasos: ["Primero agua y jabón", "Después el oxígeno", "Al revés no sirve"] },
  { n: "21", ancla: "La esponja de la pila", tit: "La esponja de la cocina", dil: "Remojo 10 min · 1 vez por semana",
    lista: ["El objeto más sucio de la casa", "Más que el baño"] },
  { n: "22", ancla: "Uso veintidós. La nevera", tit: "La nevera", dil: "Puro · trapo húmedo",
    lista: ["Sobre todo el cajón de verdura", "Sin olor a producto"] },
  { n: "23", ancla: "Que la verdura te dure más", tit: "Que la verdura dure", dil: "1 parte en 30 · 2 minutos",
    pasos: ["Remojo 2 minutos", "Enjuagar bien", "Secar bien"], stat: { v: 7, suf: " días", lab: "Las fresas, en vez de 3" } },
  { n: "24", ancla: "Manchas de sangre", tit: "Sangre, hierba y sudor", dil: "Puro · 5 minutos",
    lista: ["Mitad y mitad con bicarbonato", "Probar en la costura de dentro"] },
  { n: "25", ancla: "Uso veinticinco. El cepillo de dientes", tit: "El cepillo de dientes", dil: "Un dedo en un vaso · 5 minutos",
    lista: ["Vaso, cepillo y férula", "Cabeza abajo"] },
];

// El PORQUÉ de cada uso, en formato TITULAR (≤12 palabras entre título y chips).
// Es lo que separa "una lista de 25 cosas" de "aprendí algo": cada uso explica su mecanismo.
const PORQUE = {
  "01": ["Por qué funciona", "Ablanda la cubierta", "y mata el hongo de fábrica"],
  "02": ["El siseo que se oye", "Es el hongo", "muriéndose"],
  "03": ["Lo que sí y lo que no", "No resucita al caído", "Le corta la carrera al hongo"],
  "04": ["Lo que pasa en la maceta", "La raíz respira", "en barro no puede"],
  "05": ["No falló la planta", "Se pudrió", "el agua"],
  "06": ["Dónde se esconde", "Esporas", "en cada rayita del plástico"],
  "07": ["El error caro", "Pasás la enfermedad", "de la enferma a la sana"],
  "08": ["Por qué al atardecer", "A pleno sol se evapora", "y quema la hoja"],
  "09": ["Dónde está el enemigo", "No en la hoja", "en los 2 cm de tierra"],
  "10": ["El momento justo", "Con la fruta verde", "después ya es tarde"],
  "11": ["Quién hace el daño", "La mosca no", "la larva sí"],
  "12": ["Por qué el jabón", "El pulgón tiene cera", "el jabón la rompe"],
  "13": ["Qué logra de verdad", "No las mata", "les arruina el hormiguero"],
  "14": ["La ventaja sobre el cloro", "Sin olor pegado", "en el invernadero"],
  "15": ["Qué es ese limo", "Biofilm", "bacterias con techo propio"],
  "16": ["Por qué no cloro", "Deja gases pesados", "en un galpón cerrado"],
  "17": ["El orden importa", "Vaciar, rociar, cepillar", "y enjuagar bien"],
  "18": ["Cómo cruza el hongo", "De un bancal al otro", "en tu suela"],
  "19": ["Por qué gana al cloro", "El cloro solo blanquea", "el peróxido entra en el poro"],
  "20": ["Primero jabón", "El jabón saca la grasa", "después entra el oxígeno"],
  "21": ["El dato incómodo", "Más sucia", "que el baño"],
  "22": ["Por qué sin olor", "La nevera le pasa", "el olor a la comida"],
  "23": ["Qué estás matando", "Las esporas de moho", "que ya vienen de la góndola"],
  "24": ["Por qué hace tanta espuma", "La catalasa", "de la sangre"],
  "25": ["El más chiquito", "Y el que más gente", "podría hacer a diario"],
};

// ── 4. COMPONENTES SUELTOS (fuera de los 25 usos) ────────────────────────────
const EXTRA = [
  { ancla: "El de toda la vida", kind: "headline", tokens: [["AGUA", 0], ["OXIGENADA", 1]], eyebrow: "Peróxido de hidrógeno al 3%", dur: 5.4 },
  { ancla: "El agua oxigenada es agua con un átomo de oxígeno de más", kind: "chips", title: "Agua con un átomo de más", chips: ["H2O2", "en vez de H2O"], dur: 5.6 },
  { ancla: "Cuando se suelta, oxida lo que tenga enfrente", kind: "process", title: "Qué hace ese átomo flojo", steps: [["Se suelta", "con luz o calor"], ["Oxida", "hongo o bacteria"], ["Queda agua", "sin residuo"]], dur: 7.2 },
  { ancla: "No deja residuo", kind: "checklist", title: "Lo que NO deja", items: ["Residuo", "Sal", "Veneno en el suelo"], dur: 6.0 },
  { ancla: "Lo descubrió un químico francés", kind: "aged", heading: "Louis Thénard · 1818", lines: [["Descubierto hace más de 200 años", false], ["En todos los botiquines para 1920", true], ["Lecherías, graneros, hospitales", false]], eyebrow: "De dónde salió", dur: 8.0 },
  { ancla: "El frasco es marrón", kind: "quote", eyebrow: "Por qué el frasco es marrón", q: "La luz sola le suelta el *oxígeno*", dur: 5.6 },
  { ancla: "Descubrió que se gana más vendiendo veinticinco productos", kind: "splitlist", title: "Un producto por problema", items: ["Fungicida", "Enraizante", "Desinfectante", "Limpiador de juntas"], cross: true, dur: 7.6 },
  { ancla: "Un fungicida para el mildiu", kind: "vs", title: "Lo mismo, 25 veces", left: { tag: "La industria", title: "25 envases", sub: "25 precios", note: "Uno por problema" }, right: { tag: "El estante de arriba", title: "1 frasco", sub: "1 dólar", note: "Al lado del bicarbonato" }, dur: 7.6 },
  { ancla: "Doscientos plantines acostados", kind: "stat", v: 200, lab: "Plantines caídos en una noche", sub: "el tallito estrangulado a ras de tierra", dur: 5.8 },
  { ancla: "Se llama mal del almácigo", kind: "cross", title: "Dónde vive el mal del almácigo", layers: [["Aire", "arriba", 0.7], ["Tallo tierno", "el blanco", 0.6], ["Tierra mojada sin aire", "el hongo", 1.2], ["Tierra profunda", "", 1.0]], dur: 7.4 },
  { ancla: "Siete para la semilla y la raíz", kind: "reframe", title: "Los 25, en cuatro bloques", items: ["7 · semilla y raíz", "7 · plagas y hongos", "5 · animales y galpón", "6 · dentro de casa"], dur: 8.8 },
  { ancla: "El error que hace que el noventa por ciento", kind: "quote", eyebrow: "Quedate hasta el final", q: "El error del *90%* está en el frasco", dur: 5.6 },
  { ancla: "depende enteramente de la dilución", kind: "bars", title: "Todo depende de la dilución", bars: [["Puro, al 3%", 100, "quema la raíz", "danger"], ["1 cda por litro", 4, "menos de 0,1%", "good"]], dur: 7.4 },
  { ancla: "El agua de lluvia de tormenta trae peróxido", kind: "chips", title: "La lluvia ya lo trae", chips: ["Lo forman los rayos", "y la luz ultravioleta"], dur: 6.2 },
  { ancla: "Por eso las plantas se ponen verdes después de una tormenta", kind: "quote", eyebrow: "No estás inventando nada", q: "Estás copiando a la *lluvia*", dur: 5.4 },
  { ancla: "El vivero te vende un veneno que se queda en la tierra", kind: "vs", title: "Nosotros y ellos", left: { tag: "El vivero", title: "Veneno", sub: "se queda en la tierra", note: "Te obliga a volver" }, right: { tag: "La lluvia", title: "Oxidante", sub: "se convierte en agua", note: "Te deja en paz" }, dur: 7.4 },
  { ancla: "Primero. No es un fertilizante", kind: "checklist", title: "Lo que NO hace", items: ["No es fertilizante", "No mata bichos con caparazón", "No cura heridas", "No se bebe. Nunca."], dur: 8.4 },
  { ancla: "esa espuma NO es la infección muriéndose", kind: "quote", eyebrow: "El mito grande", q: "La espuma es la *catalasa* de tu piel", dur: 5.8 },
  { ancla: "El peróxido llamado grado alimenticio", kind: "callout", figure: "35%", eyebrow: "Grado alimenticio", caption: "Quema boca, esófago y estómago", accent: "danger", dur: 5.6 },
  { ancla: "Nunca lo mezcles con vinagre", kind: "splitlist", title: "Nunca mezclar con", items: ["Vinagre", "Cloro", "Amoníaco"], cross: true, dur: 6.4 },
  { ancla: "Eso es biofilm", kind: "callout", figure: "2 días", eyebrow: "El limo del bebedero", caption: "Biofilm: bacterias con techo propio", dur: 5.6 },
  { ancla: "Este es el uso que me hizo tirar tres frascos", kind: "splitlist", title: "Tres frascos que tiré", items: ["Antimoho", "Desinfectante", "Blanqueador de juntas"], cross: true, dur: 6.6 },
  { ancla: "El cloro blanquea la superficie", kind: "vs", title: "Sobre algo poroso", left: { tag: "Cloro", title: "Blanquea", sub: "no entra en el poro", note: "Vuelve en 3 semanas" }, right: { tag: "Agua oxigenada", title: "Entra", sub: "molécula más chica", note: "Vuelve mucho más tarde" }, dur: 7.6 },
  { ancla: "Casi todo el que dice que el agua oxigenada no funciona", kind: "quote", eyebrow: "El error", q: "Está usando *agua*. Literalmente agua.", dur: 6.0 },
  { ancla: "Un frasco cerrado, en un lugar oscuro y fresco", kind: "bars", title: "Cuánto le queda de vida", bars: [["Cerrado y oscuro", 12, "un año", "good"], ["Abierto, de a poco", 2, "1 o 2 meses", "danger"], ["Diluido en el rociador", 0.02, "horas", "danger"]], dur: 8.2 },
  { ancla: "La mezcla se prepara y se usa el mismo día", kind: "quote", eyebrow: "Lo que sobra", q: "Se tira. Es de un *dólar*.", dur: 5.2 },
  { ancla: "Corta una papa cruda", kind: "process", title: "La prueba de los 4 segundos", steps: [["Papa cruda", "un pedacito"], ["Un chorrito", "encima"], ["¿Espuma?", "está vivo"]], dur: 7.4 },
  { ancla: "Si no pasa nada, o si hace tres burbujitas tristes", kind: "callout", figure: "MUERTO", eyebrow: "Si no hace espuma", caption: "Tiralo por el desagüe y comprá otro", accent: "danger", dur: 5.8 },
  { ancla: "Si no hace ruido, no está trabajando", kind: "quote", eyebrow: "Mi vecino Jonás, 81 años", q: "Si no hace ruido, no está *trabajando*", dur: 6.4 },
  { ancla: "Haz esto esta semana", kind: "reframe", title: "Esta semana", items: ["Prueba de la papa", "Frasco chico + fecha", "Un solo uso para arrancar", "Frasquito con las tijeras"], dur: 9.6 },
  { ancla: "en tu casa el frasco marrón está en el baño", kind: "chips", title: "Contame en los comentarios", chips: ["¿Baño, cocina", "o galpón?"], dur: 6.2 },
  { ancla: "Un puñado de cáscaras de huevo", kind: "checklist", title: "El próximo video", items: ["Cáscaras de huevo", "Un frasco de vidrio", "Vinagre", "Cuatro semanas a oscuras"], dur: 8.0 },
  { ancla: "fue un frasco partido en veinticinco pedazos", kind: "quote", eyebrow: "Lo que llamaron progreso", q: "Un frasco partido en *veinticinco* pedazos", dur: 6.8 },
  // ── segunda pasada del DIRECTOR: los tramos que en la primera quedaban solo con b-roll ──
  { ancla: "que le hace a tu huerta", kind: "chips", title: "Un frasco. Tres lugares.", chips: ["Huerta", "Gallinero", "Cocina"], dur: 5.6 },
  { ancla: "durante sesenta años", kind: "callout", figure: "60 años", eyebrow: "Guardado en las despensas", caption: "Mientras afuera inventaban un producto por problema", dur: 5.8 },
  { ancla: "Es flojo", kind: "chips", title: "El átomo de más", chips: ["Está mal pegado", "Se suelta al primer golpe"], dur: 5.4 },
  { ancla: "Un hongo. Una bacteria", kind: "splitlist", title: "Lo que apaga al contacto", items: ["Un hongo", "Una bacteria", "Una espora dormida"], dur: 6.4 },
  { ancla: "En agua común y corriente", kind: "callout", figure: "H₂O", eyebrow: "Después de trabajar", caption: "Se convierte en agua y se va", accent: "good", dur: 5.4 },
  { ancla: "en los hospitales de campaña", kind: "chips", title: "Dónde estaba en 1920", chips: ["Botiquines", "Lecherías", "Graneros"], dur: 5.8 },
  { ancla: "Opaco. Nunca transparente", kind: "checklist", title: "Por qué es marrón y opaco", items: ["La luz le suelta el oxígeno", "El calor también", "Y cada vez que lo abrís"], dur: 6.8 },
  { ancla: "después de la guerra", kind: "aged", heading: "Años 50 y 60", lines: [["La industria química encontró algo mejor", false], ["Que un producto que sirve para todo", true], ["Veinticinco que sirven para uno", false]], eyebrow: "Cuándo se perdió", dur: 8.2 },
  { ancla: "Llovió veintitrés días de treinta", kind: "stat", v: 23, lab: "Días de lluvia de treinta", sub: "una primavera podrida en Lancaster", dur: 5.4 },
  { ancla: "Como si alguien les hubiera pasado un hilo", kind: "quote", eyebrow: "El tallito estrangulado", q: "Como un *hilo* por el cuello", dur: 5.4 },
  { ancla: "esos tomates eran las conservas", kind: "callout", figure: "TODO EL INVIERNO", eyebrow: "Lo que estaba en juego", caption: "Las conservas de la casa", accent: "danger", dur: 5.6 },
  { ancla: "una cucharada de agua oxigenada en un litro de agua de lluvia", kind: "process", title: "Lo que hizo mi abuelo", steps: [["1 cucharada", "por litro"], ["Regar antes", "de sembrar"], ["Esperar", "una hora"]], dur: 7.2 },
  { ancla: "Siete para las plagas y los hongos", kind: "bars", title: "Cómo se reparten los 25", bars: [["Semilla y raíz", 7, "7 usos", "good"], ["Plagas y hongos", 7, "7 usos", "good"], ["Animales y galpón", 5, "5 usos", "good"], ["Dentro de casa", 6, "6 usos", "good"]], dur: 8.4 },
  { ancla: "las cuatro cosas que el agua oxigenada NO hace", kind: "callout", figure: "4", eyebrow: "Los límites honestos", caption: "Lo que NO hace, sin adornarlo", dur: 5.6 },
  { ancla: "tienen una cubierta dura", kind: "splitlist", title: "Semillas de cubierta dura", items: ["Perejil", "Zanahoria", "Remolacha", "Espárrago"], dur: 6.6 },
  { ancla: "Le falta aire", kind: "vs", title: "El diagnóstico que casi todos erran", left: { tag: "Lo que creés", title: "Le falta agua", sub: "y regás más", note: "La ahogás peor" }, right: { tag: "Lo que pasa", title: "Le falta AIRE", sub: "la raíz se asfixia", note: "1 cucharada por litro" }, dur: 7.8 },
  { ancla: "A los cinco días el agua está turbia", kind: "process", title: "Por qué se pudre el gajo", steps: [["Agua turbia", "a los 5 días"], ["Tallo marrón", "desde abajo"], ["No falló la planta", "falló el agua"]], dur: 7.2 },
  { ancla: "Esa capita blanca, como talco", kind: "chips", title: "Mildiu: dónde aparece", chips: ["Zapallo", "Pepino", "Calabacín"], dur: 5.6 },
  { ancla: "Ganas cuatro o cinco semanas", kind: "callout", figure: "4-5 semanas", eyebrow: "Lo que ganás", caption: "No lo hace desaparecer. Lo frena.", accent: "good", dur: 5.8 },
  { ancla: "manchas marrones de borde amarillo", kind: "annotatedlite", title: "El tizón sube desde abajo", items: ["Hojas de abajo primero", "Borde amarillo", "Salpica con el riego"], dur: 6.6 },
  { ancla: "Esas mosquitas negras chiquitas", kind: "cross", title: "Dónde está la larva", layers: [["Aire", "la mosca", 0.6], ["Primer centímetro", "la larva", 1.0], ["Raíces nuevas", "lo que come", 0.9], ["Tierra profunda", "", 1.0]], dur: 7.2 },
  { ancla: "El pulgón tiene una capa cerosa", kind: "quote", eyebrow: "Por qué sola no alcanza", q: "La cera lo *repele*. El jabón la rompe.", dur: 6.0 },
  { ancla: "Es más limpio que un veneno", kind: "vs", title: "Hormigas: dos caminos", left: { tag: "Veneno", title: "6 meses", sub: "en esa tierra", note: "Y vas a sembrar ahí" }, right: { tag: "1 en 5", title: "Se mudan", sub: "sin residuo", note: "El suelo queda limpio" }, dur: 7.6 },
  { ancla: "No tiene nitrógeno", kind: "splitlist", title: "Lo que NO tiene", items: ["Nitrógeno", "Fósforo", "Potasio"], cross: true, dur: 6.2 },
  { ancla: "Olvídate del escarabajo", kind: "chips", title: "Contra caparazón, rebota", chips: ["Escarabajo", "Gorgojo", "Chinche"], dur: 5.6 },
  { ancla: "también daña el tejido nuevo", kind: "callout", figure: "AGUA Y JABÓN", eyebrow: "Para una herida abierta", caption: "El peróxido daña el tejido que cierra", accent: "danger", dur: 6.2 },
  { ancla: "Juntos forman ácido peracético", kind: "quote", eyebrow: "Peróxido + vinagre", q: "Forman ácido *peracético*. Corrosivo.", dur: 5.8 },
  { ancla: "Cajas de nido, comederos, perchas", kind: "checklist", title: "El gallinero, punto por punto", items: ["Cajas de nido", "Comederos", "Perchas", "Secar con sol y viento"], dur: 7.4 },
  { ancla: "La esponja de la cocina es el objeto más sucio", kind: "stat", v: 1, lab: "El objeto más sucio de tu casa", sub: "más que el baño", dur: 5.2 },
  { ancla: "Las fresas, en vez de tres días", kind: "bars", title: "Cuánto te duran las fresas", bars: [["Sin remojo", 3, "3 días", "danger"], ["Con remojo 1 en 30", 7, "6 o 7 días", "good"]], dur: 6.8 },
  { ancla: "mitad agua oxigenada y mitad bicarbonato", kind: "process", title: "Cuello amarillo de camisa", steps: [["Mitad y mitad", "con bicarbonato"], ["Media hora", "al sol"], ["A la lavadora", ""]], dur: 7.2 },
  { ancla: "anótale la fecha de apertura", kind: "callout", figure: "LA FECHA", eyebrow: "Con bolígrafo, en la etiqueta", caption: "Solo eso ya te cambia el resultado", accent: "good", dur: 5.8 },
  // tercera pasada: la sección del ABUELO quedaba pelada (mucho avatar, poco visual).
  { ancla: "Sembramos las bandejas de tomate", kind: "process", title: "Cómo empezó", steps: [["Bandejas", "de tomate"], ["Plantines", "un dedo de alto"], ["Una mañana", "todos caídos"]], dur: 6.8 },
  { ancla: "Y la tierra hizo un ruido", kind: "quote", eyebrow: "Al regar la segunda tanda", q: "Un siseo bajito, de *gaseosa*", dur: 5.4 },
  { ancla: "en la única semana de su vida en la que no se puede defender", kind: "callout", figure: "1 SEMANA", eyebrow: "El mal del almácigo ataca", caption: "La única en que el plantín no se defiende", accent: "danger", dur: 6.2 },
  { ancla: "Vive en la tierra húmeda y sin aire", kind: "chips", title: "Dónde vive el hongo", chips: ["Tierra húmeda", "y sin aire"], dur: 5.2 },
  { ancla: "Mi abuelo no dijo casi nada", kind: "annot", img: "abuelo_manos_tierra", caption: "Fue al galpón y volvió con el frasco marrón", eyebrow: "Mi abuelo Amos", ann: [{ kind: "circle", x: 0.5, y: 0.55, w: 0.16, label: "el frasco", color: "amber" }] },
  { ancla: "Todos. Doscientos plantines", kind: "annot", img: "plantines_caidos", caption: "El tallito estrangulado justo donde tocaba la tierra", eyebrow: "Mal del almácigo", ann: [{ kind: "circle", x: 0.42, y: 0.62, w: 0.14, label: "el cuello", color: "danger" }] },
  { ancla: "De la segunda tanda no se cayó ni uno", kind: "callout", figure: "0", eyebrow: "De la segunda tanda", caption: "No se cayó ni uno", accent: "good", dur: 5.4 },
  // cuarta pasada: subir usos del kit a 7/min repartiendo por los tramos flojos.
  { ancla: "en el último estante de cualquier farmacia", kind: "annot", img: "levi_frasco_galpon", caption: "Un dólar, en el último estante de la farmacia", eyebrow: "El frasco", ann: [{ kind: "circle", x: 0.5, y: 0.5, w: 0.18, label: "$1", color: "amber" }] },
  { ancla: "los veinticinco usos se te van a explicar solos", kind: "headline", tokens: [["25", 1], ["USOS", 0]], eyebrow: "Con la dilución exacta de cada uno", dur: 5.0 },
  { ancla: "Le rompe la pared y lo apaga", kind: "process", title: "Cómo apaga al hongo", steps: [["Se suelta", "el oxígeno"], ["Oxida", "la pared"], ["Se apaga", ""]], dur: 6.4 },
  { ancla: "Ese frasco feo está diseñado", kind: "annot", img: "frasco_marron_estante", caption: "Diseñado para proteger algo que se muere con la luz", eyebrow: "El frasco marrón", ann: [{ kind: "underline", x: 0.5, y: 0.7, w: 0.2, label: "opaco a propósito", color: "amber" }] },
  { ancla: "Cada uno en su envase de colores", kind: "chips", title: "Cada uno con su precio", chips: ["Envase de colores", "y un problema"], dur: 5.2 },
  { ancla: "Pon las semillas en un frasquito", kind: "callout", figure: "30 min", eyebrow: "El remojo", caption: "Ni más. Después enjuagás y siembras húmedas.", dur: 5.8 },
  { ancla: "sospecha del frasco", kind: "quote", eyebrow: "Si no hace nada al regar", q: "Sospechá del *frasco*", dur: 5.0 },
  { ancla: "sácalos con tierra y todo", kind: "process", title: "Si ya empezó", steps: [["Sacar los caídos", "con tierra"], ["Regar el resto", "1 cda/litro"], ["Repetir", "a los 3 días"]], dur: 6.6 },
  { ancla: "En tres o cuatro días la planta cambia la cara", kind: "callout", figure: "3-4 días", eyebrow: "Raíces ahogadas", caption: "La planta cambia la cara", accent: "good", dur: 5.4 },
  { ancla: "El agua se mantiene clara", kind: "checklist", title: "Con la mezcla, el gajo", items: ["Agua clara", "Tallo blanco", "Raíces afuera"], dur: 6.0 },
  { ancla: "Es lo que hacen los viveros grandes", kind: "annot", img: "levi_regando_bandeja", caption: "Lo que hacen los viveros antes de cada temporada", eyebrow: "Bandejas y macetas", ann: [{ kind: "circle", x: 0.55, y: 0.5, w: 0.16, label: "1 en 5", color: "amber" }] },
  { ancla: "Y no oxida el filo", kind: "vs", title: "Para la tijera", left: { tag: "Cloro", title: "Oxida", sub: "el filo", note: "Y lo arruina" }, right: { tag: "Agua oxigenada", title: "No oxida", sub: "pura, al 3%", note: "Cuatro segundos" }, dur: 7.0 },
  { ancla: "A esa altura el oxígeno se suelta", kind: "callout", figure: "0,1%", eyebrow: "Una cucharada por litro", caption: "Se agota en minutos, sin acumularse", accent: "good", dur: 6.0 },
  { ancla: "Rocías arriba y, sobre todo, debajo de la hoja", kind: "checklist", title: "Cómo se rocía", items: ["Arriba de la hoja", "Y sobre todo abajo", "Al atardecer"], dur: 6.4 },
  { ancla: "esperando la próxima salpicadura", kind: "quote", eyebrow: "El tizón, de verdad", q: "Está en la *tierra*, no en la hoja", dur: 5.4 },
  { ancla: "cuando la fruta todavía está verde", kind: "callout", figure: "VERDE", eyebrow: "El momento de rociar", caption: "Con pelusa gris, esa fruta ya la perdiste", accent: "danger", dur: 6.0 },
  { ancla: "Repites a los cuatro días", kind: "process", title: "Mosquita del sustrato", steps: [["Riego a fondo", "1 cda/litro"], ["A los 4 días", "otra vez"], ["Listo", ""]], dur: 6.4 },
  { ancla: "El verde sale sin refregar", kind: "chips", title: "El verdín sale solo", chips: ["10 minutos", "y cepillo"], dur: 5.0 },
  { ancla: "Son dos cosas distintas", kind: "vs", title: "Aire no es comida", left: { tag: "Fertilizante", title: "Comida", sub: "N-P-K", note: "Para la planta flaca" }, right: { tag: "Agua oxigenada", title: "Aire", sub: "oxígeno en la raíz", note: "Para la ahogada" }, dur: 7.2 },
  { ancla: "manda gente al hospital todos los años", kind: "splitlist", title: "Al 35% quema", items: ["La boca", "El esófago", "El estómago"], cross: true, dur: 6.2 },
  { ancla: "El agua se mantiene limpia mucho más tiempo", kind: "annot", img: "levi_gallinero", caption: "Una cucharadita por litro, dos veces por semana", eyebrow: "El bebedero", ann: [{ kind: "circle", x: 0.5, y: 0.6, w: 0.16, label: "sin limo", color: "good" }] },
  { ancla: "no lo uses en aves enfermas", kind: "checklist", title: "Con las aves, cuidado", items: ["Empezar con menos", "Mirar que beban normal", "Nunca en aves enfermas ni pollitos"], dur: 7.2 },
  { ancla: "Suela de la bota y manos", kind: "chips", title: "Cinco segundos", chips: ["Suela", "y manos"], dur: 4.8 },
  { ancla: "La molécula del agua oxigenada es más chica", kind: "cross", title: "Por qué entra en el poro", layers: [["Superficie", "el cloro llega", 0.7], ["Poro de la junta", "el peróxido entra", 1.1], ["Raíz del moho", "acá vive", 1.0], ["Material", "", 0.9]], dur: 7.4 },
  { ancla: "prueba primero en un rincón escondido", kind: "callout", figure: "PROBÁ ANTES", eyebrow: "En un rincón escondido", caption: "Sobre color y madera teñida destiñe", accent: "danger", dur: 6.0 },
  { ancla: "primero el jabón saca la grasa", kind: "annot", img: "levi_estante_tres_frascos", caption: "Un frasco reemplazó a tres del estante", eyebrow: "Tres productos menos", ann: [{ kind: "circle", x: 0.45, y: 0.5, w: 0.18, label: "3 → 1", color: "good" }] },
  { ancla: "Está mojada, tibia, y llena de comida", kind: "chips", title: "Por qué la esponja", chips: ["Mojada y tibia", "y llena de comida"], dur: 5.4 },
  { ancla: "donde se pudre lo que se pudre", kind: "callout", figure: "EL CAJÓN", eyebrow: "En la nevera", caption: "Es donde se pudre lo que se pudre", dur: 5.6 },
  { ancla: "Enjuagas bien con agua limpia y las secas bien", kind: "process", title: "Que la verdura dure", steps: [["Remojo", "2 minutos"], ["Enjuagar", "con agua limpia"], ["Secar bien", "no se salta"]], dur: 6.8 },
  { ancla: "y en la sangre hace muchísima espuma", kind: "quote", eyebrow: "Otra vez la catalasa", q: "En la sangre hace *muchísima* espuma", dur: 5.6 },
  { ancla: "el cepillo cabeza abajo", kind: "chips", title: "El cepillo de dientes", chips: ["Un dedo en un vaso", "cinco minutos"], dur: 5.4 },
  { ancla: "El mismo frasco, abierto y usado de a poquito", kind: "annot", img: "dos_frascos_chicos", caption: "Dos frascos chicos, uno en la cocina y otro en el galpón", eyebrow: "Por qué chicos", ann: [{ kind: "underline", x: 0.5, y: 0.72, w: 0.22, label: "y con la fecha escrita", color: "amber" }] },
  { ancla: "como una cerveza mal servida", kind: "annot", img: "levi_papa_prueba", caption: "Si espuma, tu frasco está vivo", eyebrow: "La prueba de la papa", ann: [{ kind: "circle", x: 0.5, y: 0.48, w: 0.18, label: "espuma", color: "good" }] },
  { ancla: "que de paso te desinfecta el sifón", kind: "chips", title: "Si está muerto", chips: ["Al desagüe", "y comprá otro"], dur: 5.0 },
  { ancla: "me dijo una sola frase sobre esto", kind: "annot", img: "vecino_jonas_huerta", caption: "Ochenta y un años y una huerta impecable", eyebrow: "Mi vecino Jonás", ann: [{ kind: "underline", x: 0.5, y: 0.75, w: 0.2, label: "él me dijo la frase", color: "amber" }] },
  { ancla: "cuatro semanas quietos en un rincón oscuro", kind: "annot", img: "cascaras_frasco_vinagre", caption: "Cáscaras de huevo, vinagre y cuatro semanas", eyebrow: "El próximo video", ann: [{ kind: "circle", x: 0.5, y: 0.5, w: 0.18, label: "a oscuras", color: "amber" }] },
  { ancla: "Lo guardaron porque nunca les llegó el catálogo", kind: "quote", eyebrow: "Por qué lo guardaron 60 años", q: "Nunca les llegó el *catálogo*", dur: 6.0 },
  { ancla: "Y ese átomo de más está mal pegado", kind: "split", eyebrow: "El mecanismo", title: "El átomo que se suelta", phase: "suelta", dur: 6.4 },
  { ancla: "oxida lo que tenga enfrente", kind: "split", eyebrow: "Qué hace al soltarse", title: "Oxida y apaga", phase: "oxida", target: "hongo", dur: 6.2 },
  { ancla: "se convierte en agua", kind: "split", eyebrow: "Y después", title: "Queda agua común", phase: "agua", dur: 6.2 },
  { ancla: "el oxígeno se suelta y se agota en cuestión de minutos", kind: "split", eyebrow: "Diluido", title: "Se agota en minutos", phase: "agua", dur: 6.0 },
  { ancla: "El oxígeno ablanda esa cubierta", kind: "split", eyebrow: "En la semilla", title: "Ablanda la cubierta", phase: "oxida", target: "cubierta", dur: 6.0 },
  { ancla: "soltando oxígeno puro justo donde no llegaba nada", kind: "split", eyebrow: "En la tierra", title: "Oxígeno donde no llegaba", phase: "suelta", dur: 6.2 },
  { ancla: "El jabón rompe la cera", kind: "split", eyebrow: "Con jabón", title: "La cera se rompe", phase: "oxida", target: "cera", dur: 6.0 },
  { ancla: "que parte el peróxido al instante", kind: "split", eyebrow: "La catalasa", title: "Parte el peróxido al instante", phase: "agua", dur: 6.2 },
  { ancla: "Es lo que quedó guardado en las despensas", kind: "chips", title: "Sesenta años guardado", chips: ["En las despensas", "de la gente sencilla"], dur: 5.2 },
  { ancla: "Media hora. Ni más", kind: "callout", figure: "MEDIA HORA", eyebrow: "El remojo de semillas", caption: "Ni más", dur: 4.4 },
  { ancla: "esperas una hora, y recién ahí siembras", kind: "chips", title: "Antes de sembrar", chips: ["Regar", "y esperar una hora"], dur: 4.8 },
  { ancla: "Las macetas de plástico del año pasado", kind: "callout", figure: "1 EN 5", eyebrow: "Macetas usadas", caption: "Trapo y secar al sol", dur: 4.8 },
  { ancla: "Cada siete días mientras dure la humedad", kind: "callout", figure: "CADA 7 DÍAS", eyebrow: "Mildiu", caption: "Mientras dure la humedad", dur: 4.8 },
  { ancla: "Misma mezcla, uno en nueve", kind: "chips", title: "Tizón del tomate", chips: ["1 en 9", "y al suelo"], dur: 4.6 },
  { ancla: "Una parte por cinco de agua, un chorro directo al nido", kind: "callout", figure: "1 EN 5", eyebrow: "Al nido de hormigas", caption: "Un chorro directo", dur: 4.8 },
  { ancla: "Uno en cinco, pulverizador", kind: "callout", figure: "1 EN 5", eyebrow: "El gallinero", caption: "Y secar con sol y viento", dur: 4.8 },
  { ancla: "Empapas. Lo dejas quince minutos", kind: "callout", figure: "15 MIN", eyebrow: "Moho negro", caption: "Puro, sin diluir. Después cepillo.", dur: 5.2 },
  { ancla: "Remojo de diez minutos", kind: "callout", figure: "10 MIN", eyebrow: "La esponja", caption: "Una vez por semana", dur: 4.6 },
  { ancla: "una parte por treinta", kind: "callout", figure: "1 EN 30", eyebrow: "Lechuga y fresas", caption: "Dos minutos y secar bien", dur: 5.0 },
  { ancla: "La dejas cinco minutos y lavas normal", kind: "chips", title: "Sobre la mancha", chips: ["Puro", "cinco minutos"], dur: 4.6 },
  { ancla: "El de toda la vida", kind: "chips", title: "El de toda la vida", chips: ["Al 3%", "de farmacia"], dur: 3.4 },
  { ancla: "Nada más que eso", kind: "chips", title: "Nada más que eso", chips: ["H2O2"], dur: 3.2 },
  { ancla: "Se va", kind: "chips", title: "Y se va", chips: ["Sin residuo"], dur: 3.0 },
  { ancla: "Duele", kind: "chips", title: "El día antes de cosechar", chips: ["Duele"], dur: 3.0 },
  { ancla: "Dos riegos y se terminó", kind: "chips", title: "Dos riegos", chips: ["Y se terminó"], dur: 3.2 },
  { ancla: "Rebota", kind: "chips", title: "Contra caparazón", chips: ["Rebota"], dur: 3.0 },
  { ancla: "Guárdalo aparte", kind: "chips", title: "Cloro y amoníaco", chips: ["Guardalo aparte"], dur: 3.4 },
  { ancla: "Cinco segundos", kind: "chips", title: "Botas y manos", chips: ["Cinco segundos"], dur: 3.2 },
  { ancla: "Literalmente agua", kind: "chips", title: "Lo que tenés en el frasco", chips: ["Literalmente agua"], dur: 3.4 },
  { ancla: "No semanas. Horas", kind: "chips", title: "Diluido, en el rociador", chips: ["Horas", "no semanas"], dur: 3.6 },
  { ancla: "No lo guardes", kind: "chips", title: "Lo que sobra", chips: ["Se tira"], dur: 3.0 },
  { ancla: "Nos vemos en el galpón", kind: "headline", tokens: [["NOS VEMOS", 0], ["EN EL GALPÓN", 1]], eyebrow: "Levi Lapp Jardín", dur: 4.6 },
  { ancla: "Ese ruido es el hongo muriéndose", kind: "quote", eyebrow: "Ese siseo", q: "Es el hongo *muriéndose*", dur: 4.6 },
  { ancla: "salieron los plantines", kind: "chips", title: "Iban bien", chips: ["Verdes", "un dedo de alto"], dur: 4.4 },
  { ancla: "Regamos la segunda tanda de bandejas", kind: "callout", figure: "1 CDA / LITRO", eyebrow: "En agua de lluvia", caption: "Antes de sembrar la segunda tanda", dur: 5.4 },
  { ancla: "Como si alguien les hubiera pasado un hilo", kind: "chips", title: "Todos caídos", chips: ["Doscientos", "en una noche"], dur: 4.4 },
  { ancla: "Busca el frasco que ya tienes", kind: "checklist", title: "Qué comprar", items: ["Chico", "Al 3%", "Marrón", "Con la fecha escrita"], dur: 6.6 },
  { ancla: "Elige un solo uso para arrancar", kind: "chips", title: "Empezá por uno solo", chips: ["La bandeja", "o las fresas"], dur: 4.6 },
  { ancla: "Ese hábito solo ya te salva una planta", kind: "callout", figure: "1 PLANTA / AÑO", eyebrow: "El frasquito con las tijeras", caption: "Todos los años", accent: "good", dur: 5.4 },
  { ancla: "Si no hace espuma, a la basura", kind: "chips", title: "Si no hace espuma", chips: ["A la basura"], dur: 3.6 },
  { ancla: "dice mucho sobre para qué lo usaban tus abuelos", kind: "quote", eyebrow: "Dónde lo guardaban", q: "Dice para qué lo usaban tus *abuelos*", dur: 5.6 },
  { ancla: "La mitad de las mejores ideas de este canal", kind: "chips", title: "Las mejores ideas", chips: ["Salieron de", "los comentarios"], dur: 4.8 },
  { ancla: "Fue al galpón", kind: "chips", title: "Volvió con el frasco", chips: ["Del galpón", "el frasco marrón"], dur: 4.6 },
  { ancla: "y mata al plantín", kind: "callout", figure: "LA 1ª SEMANA", eyebrow: "Cuándo mata el hongo", caption: "La única en que el plantín no se defiende", accent: "danger", dur: 5.8 },
];

// ── 5. VENTANAS DE AVATAR FULL (≥28%) ────────────────────────────────────────
// Momentos personales, remates y arranque. El avatar es quien sostiene la emoción.
const AV_ANCLAS = [
  ["", 0, 7.7],                                                   // apertura obligatoria
  ["Y no es un truco de internet", 0, 11.3],
  ["Escucha primero qué es", 0, 8.8],
  ["Eso es algo que ningún producto de góndola", 0, 8.8],
  ["Acuérdate de ese detalle", 0, 11.3],
  ["Y en las casas donde no entró la publicidad", 0, 11.3],
  ["A mi abuelo Amos yo lo vi salvar", 0, 12.5],
  ["Mi madre Rebeca se puso a llorar", 0, 10.0],
  ["De la segunda tanda no se cayó ni uno", 0, 7.0],
  ["Y ahora la promesa", 0, 10.0],
  ["Porque un tipo que te promete", 0, 11.3],
  ["Quédate hasta ahí aunque no te interese la huerta", 0, 10.0],
  ["Este es mi favorito", 0, 8.8],
  ["Las raíces respiran, igual que tú", 0, 8.8],
  ["Esta es la que más caro te sale", 0, 8.8],
  ["Tú, con tu propia mano", 0, 8.8],
  ["La respuesta honesta es", 0, 10.0],
  ["No juegues con eso", 0, 7.4],
  ["Y hay un detalle que a mí me terminó de convencer", 0, 10.0],
  ["Aquí es donde el frasco se pone bravo", 0, 7.4],
  ["Aquí el agua oxigenada sola no alcanza", 0, 8.8],
  ["porque esta es la parte que más me importa del video", 0, 11.3],
  ["Yo la uso para desinfectar objetos", 0, 10.0],
  ["Y esto lo digo con todas las letras", 0, 10.0],
  ["Dos advertencias más de seguridad", 0, 8.8],
  ["Seguimos con lo que sí", 0, 8.8],
  ["Si tienes gallinas ya sabes de qué hablo", 0, 10.0],
  ["solo para lavar el bebedero", 0, 10.0],
  ["Esto no es manía", 0, 8.8],
  ["Tres productos, tres precios, tres olores", 0, 10.0],
  ["El orden importa", 0, 8.8],
  ["Este te ahorra dinero todas las semanas", 0, 8.8],
  ["Es el uso más chiquito de los veinticinco", 0, 11.3],
  ["Y ahora sí, el error", 0, 10.5],
  ["porque si te llevas una sola cosa de todo este video", 0, 12.0],
  ["Y tú concluiste que el truco era mentira", 0, 11.3],
  ["Y hay una segunda mitad del error", 0, 10.0],
  ["Yo tengo dos", 0, 12.5],
  ["Mi vecino Jonás", 0, 10.0],
  ["Y cuéntame algo en los comentarios", 0, 10.0],
  ["Y si tienes un uso que yo no dije", 0, 11.3],
  ["En el próximo video te voy a mostrar algo", 0, 11.3],
  ["Y una última cosa", 0, 8.0],
  ["La gente sencilla no guardó el frasco marrón", 0, 13.5],
  ["Nos vemos en el galpón", 0, 7.4],
];

// ── 6. IMÁGENES PERSONALES (gpt-image-2 + ref del avatar) ────────────────────
const REF = `public/ref_${SLUG}.png`;
const PROMPTS = [
  ["abuelo_manos_tierra", "Foto casera con celular, luz de mañana: un hombre mayor amish de barba blanca larga, camisa lisa azul y tiradores, agachado en un invernadero de madera, hundiendo las manos en tierra oscura de una bandeja de siembra. Grano suave, nada pulido, sin texto.", null],
  ["plantines_caidos", "Foto casera con celular: bandeja de siembra con doscientos plantines de tomate caídos, tallitos doblados a ras de la tierra, invernadero de madera al fondo, luz gris de día lluvioso. Documental, sin texto.", null],
  ["levi_frasco_galpon", "Foto casera con celular: hombre joven amish de barba corta oscura sin bigote, sombrero de paja, camisa lisa y tiradores, sosteniendo un frasco marrón pequeño en un galpón de madera con herramientas colgadas. Luz de ventana lateral, grano, imperfecta, sin texto.", REF],
  ["levi_regando_bandeja", "Foto casera con celular: hombre joven amish con sombrero de paja y tiradores regando una bandeja de almácigo con una regadera chica, dentro de un invernadero. Luz cálida de tarde, documental, sin texto.", REF],
  ["levi_tijeras_frasquito", "Foto casera con celular: manos de hombre joven mojando una tijera de podar con un trapo húmedo, un frasquito marrón colgado del cinturón, rosal al fondo. Macro, luz natural, sin texto.", REF],
  ["levi_gallinero", "Foto casera con celular: hombre joven amish con sombrero de paja limpiando un bebedero de gallinas de plástico dentro de un gallinero de madera, gallinas alrededor. Luz de mañana, documental, sin texto.", REF],
  ["levi_estante_tres_frascos", "Foto casera con celular: hombre joven amish sacando tres botellas de limpieza de un estante de madera de un galpón, cara de fastidio leve. Luz de ventana, grano, sin texto.", REF],
  ["levi_papa_prueba", "Foto casera con celular: manos de hombre joven echando un chorrito de líquido de un frasco marrón sobre media papa cruda apoyada en una tabla de madera, espuma blanca subiendo. Macro, cocina rústica, sin texto.", REF],
  ["frasco_marron_estante", "Foto casera con celular: un frasco marrón opaco de farmacia, medio empezado, en un estante de baño con azulejos viejos, polvo, luz de ventana. Documental, sin texto.", null],
  ["dos_frascos_chicos", "Foto casera con celular: dos frascos marrones chicos, uno en una mesada de cocina rústica y otro en un banco de galpón de madera, junto a una caja de bicarbonato. Luz natural, sin texto.", null],
  ["vecino_jonas_huerta", "Foto casera con celular: hombre muy mayor, unos ochenta años, gorra de tela y camisa a cuadros, de pie en una huerta prolija con bancales de madera al atardecer. Documental, grano, sin texto.", null],
  ["cascaras_frasco_vinagre", "Foto casera con celular: un frasco de vidrio con cáscaras de huevo trituradas y vinagre, en un rincón oscuro de un galpón de madera. Luz baja de ventana, macro, sin texto.", null],
  ["lancaster_campo", "Foto casera con celular: campo ondulado de Lancaster con un granero rojo, cercos de madera y bancales de huerta, cielo gris de primavera lluviosa. Documental, sin texto.", null],
  ["tomates_partidos", "Foto casera con celular: tomates maduros en la planta con la piel partida de arriba, gotas de lluvia. Macro, luz natural, sin texto.", null],
];
fs.mkdirSync("public/img", { recursive: true });
fs.writeFileSync(
  `public/img/prompts_${SLUG}.json`,
  JSON.stringify(PROMPTS.map(([name, prompt, ref]) => (ref ? { name: `${SLUG}_${name}`, prompt, ref } : { name: `${SLUG}_${name}`, prompt })), null, 2)
);

// ── 7. SLOTS: partir el timeline en planos ───────────────────────────────────
// Cada oración → 1..N planos. Objetivo: mediana ~3,6s en b-roll, ventanas de avatar largas.
const MINS = 2.4, MAXS = 5.2;
const slots = [];
for (let i = 0; i < sentences.length; i++) {
  const s = sentences[i];
  let a = s.a, b = s.b;
  if (i === sentences.length - 1) b = Math.max(b, TOTAL_S);
  const dur = b - a;
  if (dur <= 0.35) continue;
  const n = Math.max(1, Math.round(dur / 3.6));
  const step = dur / n;
  for (let k = 0; k < n; k++) slots.push({ i, a: a + k * step, b: a + (k + 1) * step, first: k === 0 });
}
// unir slots demasiado cortos con el siguiente de la MISMA oración
for (let k = slots.length - 2; k >= 0; k--) {
  if (slots[k].b - slots[k].a < MINS && slots[k + 1] && slots[k + 1].i === slots[k].i) {
    slots[k].b = slots[k + 1].b; slots.splice(k + 1, 1);
  }
}

// ── 8. ASIGNACIÓN ────────────────────────────────────────────────────────────
const marca = new Map(); // idx de oración → {tipo,...}
const usados = new Set();

// 8a. ventanas de avatar full
const avWins = [];
for (const [ancla, , len] of AV_ANCLAS) {
  const i = ancla === "" ? 0 : at(ancla);
  if (i < 0) continue;
  const a = sentences[i].a;
  avWins.push({ i, a, b: Math.min(a + len, TOTAL_S) });
}
avWins.sort((x, y) => x.a - y.a);
// fusionar solapes
for (let k = avWins.length - 2; k >= 0; k--) if (avWins[k + 1].a < avWins[k].b) { avWins[k].b = Math.max(avWins[k].b, avWins[k + 1].b); avWins.splice(k + 1, 1); }
const enAvatar = (t) => avWins.some((w) => t >= w.a - 0.05 && t < w.b);

// 8b. componentes de los 25 usos → rule + (process|checklist) + stat
const comps = []; // {a, dur, jsx, kind}
const J = (x) => JSON.stringify(x);
const bgIdx = {};
// Los carteles NO van sobre fondo plano: se apoyan en un frame REAL del b-roll de su
// propia sección. Así el componente y el material on-topic son el MISMO plano y el
// video no se convierte en una sucesión de placas de texto.
const bgOf = (sid) => {
  const sec = SECCIONES.find((x) => x.id === sid) || SECCIONES[0];
  bgIdx[sid] = (bgIdx[sid] || 0) + 1;
  return `img/${SLUG}_bg_${sec.pool[bgIdx[sid] % sec.pool.length]}.jpg`;
};
const hueOf = (sid) => (["limites", "plagas"].includes(sid) ? "red" : ["error", "enemigo"].includes(sid) ? "cold" : "amber");

for (const u of USOS) {
  const i = at(u.ancla);
  if (i < 0) continue;
  const s = sentences[i];
  const sid = secOf(i).id;
  comps.push({ a: s.a, dur: 4.2, kind: "RuleNumberScene",
    jsx: `<RuleNumberScene durationInFrames={d} number=${J(u.n)} label="USO" title=${J(u.tit)} hue=${J(hueOf(sid))} />` });
  // el cartel de dilución, 1,2s después
  comps.push({ a: s.a + 4.4, dur: 5.0, kind: "CalloutMark",
    jsx: `<CalloutMark durationInFrames={d} figure=${J(u.dil)} image=${J(bgOf(sid))} eyebrow=${J(u.tit)} caption="La dilución exacta" accent="accent" hue=${J(hueOf(sid))} />` });
  const later = sentences[Math.min(i + 2, sentences.length - 1)];
  if (u.pasos) {
    comps.push({ a: later.a, dur: 6.6, kind: "ProcessSteps",
      jsx: `<ProcessSteps durationInFrames={d} eyebrow=${J("Uso " + u.n)} title=${J(u.tit)} accent="accent" hue=${J(hueOf(sid))} steps={${J(u.pasos.map((p) => ({ title: p })))}} />` });
  } else if (u.lista) {
    comps.push({ a: later.a, dur: 3.0 + u.lista.length * 1.5, kind: "Checklist",
      jsx: `<Checklist durationInFrames={d} eyebrow=${J("Uso " + u.n)} image=${J(bgOf(sid))} pin=${J(comps.length % 2 ? "left" : "right")} title=${J(u.tit)} accent="good" hue=${J(hueOf(sid))} items={${J(u.lista.map((t) => ({ text: t, state: "done" })))}} />` });
  }
  if (u.stat) {
    const l3 = sentences[Math.min(i + 4, sentences.length - 1)];
    comps.push({ a: l3.a, dur: 5.4, kind: "StatBig",
      jsx: `<StatBig durationInFrames={d} to={${u.stat.v}} suffix=${J(u.stat.suf)} label=${J(u.stat.lab)} icon="check" accent="good" hue=${J(hueOf(sid))} />` });
  }
  // el PORQUÉ del uso — sin esto los carteles son una lista y el espectador no aprende nada.
  if (PORQUE[u.n]) {
    const [tit, ...chips] = PORQUE[u.n];
    const l4 = sentences[Math.min(i + (u.stat ? 6 : 4), sentences.length - 1)];
    comps.push({ a: l4.a, dur: 5.4, kind: "ChipsCluster",
      jsx: `<ChipsCluster durationInFrames={d} bg="image" image=${J(bgOf(sid))} title=${J(tit)} chips={${J(chips)}} hue=${J(hueOf(sid))} />` });
  }
}

// 8c. componentes sueltos
const mkExtra = (e, sid) => {
  const hue = J(hueOf(sid));
  switch (e.kind) {
    case "headline": return { kind: "KineticHeadline", jsx: `<KineticHeadline durationInFrames={d} eyebrow=${J(e.eyebrow)} hue=${hue} tokens={${J(e.tokens.map(([t, hi]) => ({ text: t, accent: !!hi })))}} />` };
    case "chips": return { kind: "ChipsCluster", jsx: `<ChipsCluster durationInFrames={d} bg="image" image=${J(bgOf(sid))} title=${J(e.title)} chips={${J(e.chips)}} hue=${hue} />` };
    case "process": return { kind: "ProcessSteps", jsx: `<ProcessSteps durationInFrames={d} title=${J(e.title)} accent="accent" hue=${hue} steps={${J(e.steps.map(([t, dsc]) => ({ title: t, desc: dsc })))}} />` };
    case "checklist": return { kind: "Checklist", jsx: `<Checklist durationInFrames={d} title=${J(e.title)} accent="good" hue=${hue} items={${J(e.items.map((t) => ({ text: t, state: "done" })))}} />` };
    case "aged": return { kind: "AgedDoc", jsx: `<AgedDoc durationInFrames={d} eyebrow=${J(e.eyebrow)} heading=${J(e.heading)} accent="accent" hue=${hue} lines={${J(e.lines.map(([text, mark]) => ({ text, mark })))}} />` };
    case "quote": return { kind: "KineticQuote", jsx: `<KineticQuote durationInFrames={d} image=${J(bgOf(sid))} eyebrow=${J(e.eyebrow)} words={parseQuote(${J(e.q)})} accent="accent" hue="cold" />` };
    case "splitlist": return { kind: "SplitList", jsx: `<SplitList durationInFrames={d} title=${J(e.title)} items={${J(e.items)}} accent={D}${e.cross ? " cross" : ""} />` };
    case "vs": return { kind: "OptionCompare", jsx: `<OptionCompare durationInFrames={d} left={${J({ ...e.left, icon: "warn", accent: "#8a949e" })}} right={${J({ ...e.right, icon: "check", accent: "#e0a33a" })}} />` };
    case "stat": return { kind: "StatBig", jsx: `<StatBig durationInFrames={d} to={${e.v}} label=${J(e.lab)} caption=${J(e.sub || "")} icon="warn" accent="danger" hue="red" />` };
    case "cross": return { kind: "CrossSection", jsx: `<CrossSection durationInFrames={d} title=${J(e.title)} hue=${hue} layers={${J(e.layers.map(([label, depth, weight], k) => ({ label, depth, weight, color: ["rgba(150,160,170,0.45)", "rgba(200,170,110,0.55)", "rgba(110,90,60,0.75)", "rgba(70,55,40,0.85)"][k] })))}} />` };
    case "reframe": return { kind: "ReframeList", jsx: `<ReframeList durationInFrames={d} title=${J(e.title)} accent={A} items={${J(e.items.map((t) => ({ text: t, icon: "check" })))}} />` };
    case "bars": return { kind: "BarCompare", jsx: `<BarCompare durationInFrames={d} title=${J(e.title)} orientation="horizontal" hue=${hue} bars={${J(e.bars.map(([label, value, display, tone]) => ({ label, value, display, tone })))}} />` };
    case "split": return { kind: "PeroxideSplit", jsx: `<PeroxideSplit durationInFrames={d} eyebrow=${J(e.eyebrow)} title=${J(e.title)} phase=${J(e.phase)}${e.target ? ` targetLabel=${J(e.target)}` : ""} />` };
    case "annot": return { kind: "AnnotatedImage", jsx: `<AnnotatedImage durationInFrames={d} image=${J(`img/${SLUG}_${e.img}.jpg`)} eyebrow=${J(e.eyebrow)} caption=${J(e.caption)} hue=${hue} annotations={${J(e.ann || [])}} />` };
    case "annotatedlite": return { kind: "ReframeList", jsx: `<ReframeList durationInFrames={d} title=${J(e.title)} accent={A} items={${J(e.items.map((t) => ({ text: t, icon: "check" })))}} />` };
    case "callout": return { kind: "CalloutMark", jsx: `<CalloutMark durationInFrames={d} figure=${J(e.figure)} image=${J(bgOf(sid))} eyebrow=${J(e.eyebrow)} caption=${J(e.caption)} accent=${J(e.accent || "accent")} hue=${hue} />` };
    default: return null;
  }
};
for (const e of EXTRA) {
  if (e.dur == null) e.dur = 6.2;
  const i = at(e.ancla);
  if (i < 0) continue;
  const made = mkExtra(e, secOf(i).id);
  if (made) comps.push({ a: sentences[i].a, dur: e.dur, ...made });
}

// 8d. TextCardReveal de sección (stinger) al inicio de cada bloque de usos
for (const [ancla, l1, l2] of [
  ["Empecemos por la semilla y la raíz", "Semilla", "y raíz · usos 1 a 7"],
  ["Vamos a los hongos y las plagas", "Hongos", "y plagas · usos 8 a 14"],
  ["Los animales y el galpón", "Animales", "y galpón · usos 15 a 19"],
  ["Ahora entramos a la casa", "Dentro", "de casa · usos 20 a 25"],
]) {
  const i = at(ancla);
  if (i < 0) continue;
  comps.push({ a: sentences[i].a, dur: 4.6, kind: "TextCardReveal", jsx: `<TextCardReveal durationInFrames={d} lines={${J([l1, l2])}} accent={A} />` });
}

// 8e. imágenes personales ancladas (AnnotatedImage / PhotoScene sobre la img generada)
for (const [ancla, name, kicker, caption] of [
  ["A mi abuelo Amos yo lo vi salvar", "abuelo_manos_tierra", "Mi abuelo Amos", "Salvó la siembra con el frasco marrón"],
  ["Doscientos plantines acostados", "plantines_caidos", "Una mañana entré", "Doscientos plantines acostados"],
  ["Fue una primavera podrida en Lancaster", "lancaster_campo", "Lancaster", "Llovió veintitrés días de treinta"],
  ["Un frasquito con agua oxigenada pura al tres por ciento", "levi_tijeras_frasquito", "Colgado del cinturón", "Mojás y pasás · cuatro segundos"],
  ["Una cucharadita de agua oxigenada por litro de agua de bebida", "levi_gallinero", "El bebedero", "Una cucharadita por litro, dos veces por semana"],
  ["Este es el uso que me hizo tirar tres frascos", "levi_estante_tres_frascos", "Tres frascos menos", "Antimoho, desinfectante y blanqueador"],
  ["Si tu frasco está vivo", "levi_papa_prueba", "La prueba de la papa", "Si espuma como cerveza mal servida, está vivo"],
  ["O sea que ese frasco que tienes hace ocho meses", "frasco_marron_estante", "Ocho meses abierto", "Ese frasco ya es agua"],
  ["Yo tengo dos", "dos_frascos_chicos", "Uno en la cocina, uno en el galpón", "Chicos, a propósito"],
  ["Mi vecino Jonás", "vecino_jonas_huerta", "Jonás, 81 años", "Una huerta que da vergüenza de lo linda"],
  ["Un puñado de cáscaras de huevo", "cascaras_frasco_vinagre", "El próximo video", "Cáscaras, vinagre y cuatro semanas a oscuras"],
  ["cuando se le partían de arriba", "tomates_partidos", "Tomates partidos", "El único remedio que vi funcionar"],
  ["Esto es lo que hizo mi abuelo", "levi_regando_bandeja", "Una cucharada por litro", "Regás, esperás una hora, y recién ahí sembrás"],
  ["El de toda la vida", "levi_frasco_galpon", "El frasco de un dólar", "El de toda la vida"],
]) {
  const i = at(ancla);
  if (i < 0) continue;
  comps.push({ a: sentences[i].a, dur: 5.2, kind: "PhotoScene",
    jsx: `<PhotoScene durationInFrames={d} name=${J(`${SLUG}_${name}`)} hue="amber" kicker=${J(kicker)} caption=${J(caption)} accent={A} />` });
}

// ── 8f. DURACIÓN POR LECTURA REAL ────────────────────────────────────────────
// La duración de un cartel NO se elige a ojo: se calcula. Hay que NOTAR el cartel antes
// de leerlo, y el espectador además está escuchando → 0,8s + palabras ÷ 2,5.
// Los textos ya se escribieron como TITULARES (≤12 palabras), así que casi ninguno pide
// más de 6s; los que piden, se los damos y el b-roll de alrededor corta más rápido.
const palabrasDe = (jsx) => {
  const txt = [...jsx.matchAll(/"([^"]*)"/g)].map((m) => m[1])
    .filter((t) => /\s/.test(t) || /[a-záéíóúñ]{4,}/i.test(t))
    .filter((t) => !/^(broll|img|vid)\//.test(t) && !/\.(mp4|png|jpg)$/.test(t))
    .filter((t) => !["amber","cold","red","good","danger","accent","warn","check","horizontal","done","doing","left","right"].includes(t));
  return txt.join(" ").split(/\s+/).filter(Boolean).length;
};
for (const c of comps) {
  if (c.kind === "PhotoScene" || c.kind === "PeroxideSplit") continue; // manda el visual, no el texto
  const w = palabrasDe(c.jsx);
  const leg = 0.8 + w / 2.5;
  c.dur = +Math.max(2.6, Math.min(8.4, leg)).toFixed(2);
}

// ── 9. TEJIDO FINAL: componentes en su ancla, avatar en sus ventanas, b-roll el resto
comps.sort((x, y) => x.a - y.a);
const cues = [];
const ocupado = []; // [a,b]
const libre = (a, b) => !ocupado.some((o) => a < o[1] - 0.03 && b > o[0] + 0.03) && !enAvatar(a + 0.05);
const push = (c) => { cues.push(c); ocupado.push([c.a, c.a + c.dur]); };

// Un componente que cae dentro de una ventana de avatar o pisado por otro NO se tira:
// se corre al primer hueco libre dentro de los 12s siguientes. Descartarlos hacía perder
// ~30 de 135 componentes y dejaba tramos enteros solo con b-roll.
for (const c of comps) {
  let a = c.a;
  for (let intento = 0; intento < 40; intento++) {
    if (enAvatar(a)) { const w = avWins.find((w) => a >= w.a - 0.05 && a < w.b); a = w ? w.b + 0.05 : a + 0.5; continue; }
    if (!libre(a, a + c.dur)) {
      const fin = ocupado.filter((o) => a < o[1] && a + c.dur > o[0]).map((o) => o[1]);
      a = fin.length ? Math.max(...fin) + 0.05 : a + 0.5;
      continue;
    }
    break;
  }
  if (a - c.a > 12 || a + c.dur > TOTAL_S) continue;
  push({ ...c, a, key: `c${cues.length}` });
}

// ── RELLENO TOTAL DE HUECOS ──────────────────────────────────────────────────
// Regla dura: cada instante del video tiene que estar cubierto o por un CUE o por una
// ventana de avatar full. Un hueco sin ninguno de los dos = el AvatarLayer está en
// "hidden" y se ve el fondo pelado. Se detectó armando la primera pasada: quedaban
// 354s (24% del video) de fondo vacío. Acá se rellenan con b-roll partido en planos.
const bloques = [...ocupado.map(([a, b]) => ({ a, b })), ...avWins.map((w) => ({ a: w.a, b: w.b }))]
  .sort((x, y) => x.a - y.a);
const huecos = [];
{
  let t = 0;
  for (const bl of bloques) { if (bl.a > t + 0.35) huecos.push([t, bl.a]); t = Math.max(t, bl.b); }
  if (t < TOTAL_S - 0.35) huecos.push([t, TOTAL_S]);
}
// cortes preferidos: los bordes de slot (que salen de la puntuación de Whisper)
const cortes = slots.map((s) => s.a);
const poolIdx = {};
for (const [ha, hb] of huecos) {
  let t = ha;
  while (hb - t > 0.35) {
    // el plano dura ~3,4s pero se estira/encoge hasta el corte de frase más cercano
    const ideal = t + 2.45;
    let end = cortes.find((c) => c >= t + 1.9 && c <= t + 3.6 && c <= hb) ?? Math.min(ideal, hb);
    if (hb - end < 1.4) end = hb; // no dejar una colita
    end = Math.min(end, hb);
    if (end - t < 0.5) break;
    const si = sentences.findIndex((s) => t >= s.a - 0.01 && t < s.b + 0.01);
    const sec = secOf(si < 0 ? 0 : si);
    poolIdx[sec.id] = (poolIdx[sec.id] || 0) + 1;
    const name = sec.pool[poolIdx[sec.id] % sec.pool.length];
    cues.push({ a: +t.toFixed(2), dur: +(end - t).toFixed(2), kind: "RawShot", key: `b${cues.length}`,
      jsx: `<RawShot durationInFrames={d} src=${J(B(name))} hue=${J(hueOf(sec.id))} grade="warm" kbPhase={${((cues.length % 3) * 0.33).toFixed(2)}} />` });
    t = end;
  }
}

cues.sort((x, y) => x.a - y.a);

// ── 10. PLAN DEL DIRECTOR ────────────────────────────────────────────────────
fs.mkdirSync("_v3", { recursive: true });
const plan = {
  slug: SLUG, total_s: TOTAL_S,
  secciones: SECCIONES.map((s) => {
    const a = sentences[s.i0].a;
    const b = s.i1 < sentences.length ? sentences[s.i1].a : TOTAL_S;
    const mios = cues.filter((c) => c.a >= a && c.a < b);
    const av = avWins.filter((w) => w.a >= a && w.a < b);
    return {
      id: s.id, objetivo: s.objetivo, inicio: +a.toFixed(2), fin: +b.toFixed(2), dur: +(b - a).toFixed(2),
      momentos: [
        ...mios.map((c) => ({
          dice: (sentences.find((x) => Math.abs(x.a - c.a) < 3.2) || { t: "" }).t.slice(0, 90),
          muestra: c.kind === "RawShot" ? `clip real: ${(c.jsx.match(/broll\/[a-z0-9_\/]+/i) || [""])[0]}` : `componente ${c.kind}`,
          tipo: c.kind === "RawShot" ? "clip" : c.kind === "PhotoScene" ? "imagen" : "componente",
          kind: c.kind, seg: +c.dur.toFixed(2),
          porque: c.kind === "RawShot" ? "material real on-topic para lo que se dice justo ahí" : "el dato clave del tramo necesita cartel",
        })),
        ...av.map((w) => ({
          dice: (sentences[w.i] || { t: "" }).t.slice(0, 90), muestra: "avatar a pantalla completa",
          tipo: "componente", kind: "AvatarLayer", seg: +(w.b - w.a).toFixed(2),
          porque: "momento personal / remate: lo sostiene la cara, no el b-roll",
        })),
      ].sort((x, y) => 0),
    };
  }),
};
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 2));

// ── 11. CUES + MAIN + ENTRY ──────────────────────────────────────────────────
const cuesTsx = `// AUTOGENERADO por build_${SLUG}.mjs — no editar a mano.
import React from "react";
import { COLORS } from "./theme";
import { RawShot } from "./scenes/RawShot";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { StatBig } from "./scenes/DataViz";
import { ReframeList, ChipsCluster } from "./scenes/ReframeContent";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { CalloutMark } from "./scenes/CalloutMark";
import { AnnotatedImage } from "./scenes/AnnotatedImage";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { SplitList } from "./scenes/SplitList";
import { BarCompare } from "./scenes/BarCompare";
import { OptionCompare } from "./scenes/OptionCompare";
import { CrossSection } from "./scenes/CrossSection";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { AgedDoc } from "./scenes/AgedDoc";
import { Checklist } from "./scenes/Checklist";
import { PhotoScene } from "./MongolKit";
import { PeroxideSplit } from "./scenes/PeroxideSplit_vwtchhlmzl7f";

const A = COLORS.accent;
const D = COLORS.danger;

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
${cues.map((c) => `  { key: ${J(c.key)}, start: ${c.a.toFixed(2)}, dur: ${(+c.dur).toFixed(2)}, el: (d) => ${c.jsx} },`).join("\n")}
];

export const AVATAR_WINDOWS = ${J(
  (() => {
    const w = [];
    let last = 0;
    for (const win of avWins) {
      if (win.a > last + 0.1) w.push({ start: +last.toFixed(2), mode: "hidden" });
      w.push({ start: +win.a.toFixed(2), mode: "full" });
      last = win.b;
    }
    w.push({ start: +last.toFixed(2), mode: "hidden" });
    return w.filter((x, k, arr) => k === 0 || x.start > arr[k - 1].start);
  })()
)} as const;
`;
{
  // COMPUERTA: el JSX se genera como STRING, así que tsc NO ve los componentes usados.
  // Un import faltante sólo aparece adentro del render ("X is not defined") con los runners
  // ya encendidos. Ya costó dos jobs del farm: se verifica acá, gratis.
  const usados = [...new Set([...cuesTsx.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map((m) => m[1]))];
  const imp = new Set([...cuesTsx.matchAll(/import\s*\{([^}]+)\}/g)].flatMap((m) => m[1].split(",").map((x) => x.trim().split(/\s+as\s+/).pop())));
  const faltan = usados.filter((u) => !imp.has(u));
  if (faltan.length) { console.error(`✗ IMPORTS FALTANTES en cues: ${faltan.join(", ")}`); process.exit(1); }
}
fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, cuesTsx);

const mainTsx = `import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { SfxCue, POPS, SFX } from "./components/Sfx";
import { CUES, AVATAR_WINDOWS } from "./cues_${SLUG}.gen";

// Levi Lapp Jardín — "25 usos del agua oxigenada que los Amish guardaron 60 años".
// Avatar HeyGen (avatar_${SLUG}.mp4) = pista de audio + ventanas full/hidden.
// Los CUES tapan a pantalla completa cuando el avatar está "hidden".
export const TOTAL_FRAMES_${SLUG.toUpperCase()} = ${TOTAL_FRAMES};

export const Main${SLUG}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <TechBackground glowX={50} glowY={44} hue="amber" drift={0.4} />
    <AvatarLayer src="avatar_${SLUG}.mp4" wav="${SLUG}.wav" windows={AVATAR_WINDOWS as unknown as AvatarWindow[]} />
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
        {cue.el(sec(cue.dur))}
      </Sequence>
    ))}
    {CUES.map((cue, i) => (
      <SfxCue
        key={"sfx" + cue.key}
        at={sec(cue.start)}
        src={cue.start < 45 ? (i % 2 === 0 ? SFX.whoosh2 : SFX.swish) : POPS[i % POPS.length]}
        volume={0.26}
        durationInFrames={38}
      />
    ))}
  </AbsoluteFill>
);
`;
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, mainTsx);

const entry = `import { Composition, registerRoot } from "remotion";
import { Main${SLUG}, TOTAL_FRAMES_${SLUG.toUpperCase()} } from "./VideoEdit/Main_${SLUG}";
import "./index.css";

const Root: React.FC = () => (
  <Composition
    id="Peroxido"
    component={Main${SLUG}}
    durationInFrames={TOTAL_FRAMES_${SLUG.toUpperCase()}}
    fps={30}
    width={1920}
    height={1080}
  />
);
registerRoot(Root);
`;
fs.writeFileSync(`src/index_${SLUG}.tsx`, entry);

// ── informe ──────────────────────────────────────────────────────────────────
const durs = [...cues.map((c) => +c.dur), ...avWins.map((w) => w.b - w.a)].sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
const avS = avWins.reduce((s, w) => s + (w.b - w.a), 0);
const comp = cues.filter((c) => c.kind !== "RawShot");
console.log(`── BUILD ${SLUG} ──`);
console.log(`  oraciones            : ${sentences.length}`);
console.log(`  cues                 : ${cues.length}  (${comp.length} componentes · ${cues.length - comp.length} RawShot)`);
console.log(`  componentes distintos: ${new Set(comp.map((c) => c.kind)).size}`);
console.log(`  ventanas avatar full : ${avWins.length} · ${avS.toFixed(0)}s = ${((avS / TOTAL_S) * 100).toFixed(1)}%`);
console.log(`  planos totales       : ${durs.length} · mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${((durs.filter((x) => x >= 5).length / durs.length) * 100).toFixed(0)}%`);
console.log(`  crudo (RawShot)      : ${(((cues.length - comp.length) / cues.length) * 100).toFixed(0)}%`);
console.log(`  usos comp/min        : ${(comp.length / (TOTAL_S / 60)).toFixed(1)}`);
