// gen_vj7hqe8koadv.mjs — "Los 50 Sitios Más Misteriosos" (Crónicas Perdidas, AVATAR).
// El avatar real (HeyGen) se cortó a mitad de guion: cubre ~27 sitios y termina en
// "...la Jemer y la Maya" sin cierre. Este script arma el beatsheet ANCLADO a la
// transcripción REAL (Whisper), no al guion largo original, + agrega un cierre
// visual SILENCIOSO (sin voz nueva) al final: recap rápido + tarjeta de suscripción.
import fs from "fs";
const SLUG = "vj7hqe8koadv";
const AVATAR = `${SLUG}_opt.mp4`;
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/(\d)\.(\d{3})\b/g, "$1$2").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = caps.map((c) => ({ n: norm(c.text), ms: c.startMs, e: c.endMs }));
const at = (phrase, maxTok = 10) => {
  const t = norm(phrase).split(" ").filter(Boolean).slice(0, maxTok);
  for (let i = 0; i <= Wc.length - t.length; i++) {
    let ok = 1;
    for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
    if (ok) return Wc[i].ms / 1000;
  }
  return null;
};
const atc = (p, m) => { const v = at(p, m); if (v == null) console.warn("⚠ anchor missing:", p.slice(0, 60)); return v; };
const LAST_MS = Wc[Wc.length - 1].e;
const REAL_END = +(LAST_MS / 1000 + 1.0).toFixed(2); // fin del audio real (avatar corta acá)
const TAIL = 11; // cierre visual silencioso agregado (sin voz nueva)
const TOTAL = +(REAL_END + TAIL).toFixed(2);

const P = (s) => `Realistic documentary photo, 16:9. ${s} Natural daylight, slightly imperfect handheld framing, muted colors, authentic travel-documentary look, no text, no watermark, no people looking at camera.`;

// ── RAW: un plano real/IA por momento concreto de la narración (ancla EXACTA tal como Whisper la transcribió) ──
const RAW = [
  ["hook_1", "hay un agujero en turkmenistan que lleva ardiendo desde 1971", "hook_darvaza1", P("A massive glowing orange gas crater burning at night in the middle of the desert, seen from a distance, smoke rising."), "amber"],
  ["hook_2", "los geologos que se acercaron al borde con trajes especiales", "hook_darvaza2", P("Two scientists in protective suits standing cautiously near the glowing edge of a huge burning crater at night."), "amber"],
  ["hook_3", "parece la boca de otra cosa no un pozo de gas", "hook_darvaza3", P("Extreme close-up of fire and flames glowing deep inside a circular crater in the desert at night."), "amber"],
  ["intro_1", "yo empece a interesarme en este tipo de lugares por un mapa viejo que tenia mi abuelo", "intro_mapa1", P("An old weathered hand-drawn map on a wooden desk, vintage ink annotations, warm lamp light, close up."), "amber"],
  ["intro_2", "lleno de anotaciones a mano en sitios que ni siquiera existian en los atlas normales", "intro_mapa2", P("Close up of handwritten notes and circles in ink on an antique paper map."), "amber"],
  ["intro_3", "hoy quiero llevarlos por 50 de esos lugares uno detras de otro", "intro_mundo", P("A vintage style world map with several pinned locations and a red route line connecting them."), "amber"],
  ["richat_1", "en medio del sahara resulto ser real", "richat_1", P("Vast golden Sahara desert sand dunes from above, endless and empty."), "amber"],
  ["richat_2", "se llama el ojo del sahara la estructura de richard", "richat_2", P("Aerial satellite view of the Richat Structure, concentric circular rock rings in the middle of the desert, Mauritania."), "amber"],
  ["richat_3", "y desde el aire parece un blanco de tiro perfecto casi 100 kilometros de anillos concentricos", "richat_3", P("Wide drone aerial shot of giant concentric desert rings, like a bullseye carved into the earth."), "amber"],
  ["richat_4", "durante anos se penso que era un crater de meteorito no lo es", "richat_4", P("Close up of exposed layered rock strata eroded in a desert landscape."), "amber"],
  ["stonehenge_1", "en inglaterra esta el mas famoso de todos stonehenge", "stonehenge_1", P("Stonehenge megalithic stone circle in England at sunrise, dramatic sky."), "amber"],
  ["stonehenge_2", "un circulo de piedras de varias toneladas cada una traidas desde canteras", "stonehenge_2", P("Massive gray standing stones close up, weathered texture, English countryside."), "amber"],
  ["stonehenge_3", "sin ruedas sin metal sin animales de carga como los conocemos hoy", "stonehenge_3", P("An illustration-like realistic scene of ancient people dragging a huge stone block on wooden logs and ropes."), "amber"],
  ["stonehenge_4", "alinearon exactamente esas piedras con la salida del sol del solsticio de verano", "stonehenge_4", P("The sun rising perfectly aligned between ancient standing stones, golden light, solstice."), "amber"],
  ["zimbabue_1", "mas al sur en zimbabue hay una ciudad de piedra", "zimbabue_1", P("Great Zimbabwe stone ruins, massive dry-stacked granite walls, aerial view, African savanna."), "blue"],
  ["zimbabue_2", "muros de granito apilados sin una sola gota de mortero algunos de mas de 10 metros de alto", "zimbabue_2", P("Close up of a tall dry-stone granite wall with no mortar, ancient African architecture, intricate stacking."), "blue"],
  ["nazca_1", "en peru hay algo parecido con las lineas de nazca", "nazca_1", P("Aerial view of giant line drawings etched into the desert floor of Peru, Nazca lines."), "amber"],
  ["nazca_2", "un colibri una arana o un mono de 300 metros de largo", "nazca_2", P("The Nazca hummingbird geoglyph seen from directly above, dry desert ground."), "amber"],
  ["nazca_3", "la gente que los dibujo nunca volo caminaban la linea entera paso a paso", "nazca_3", P("A lone tiny figure walking across a vast empty desert line, seen from far above."), "amber"],
  ["nazca_4", "eso para mi es mas inquietante que cualquier teoria extraterrestre", "nazca_4", P("A wide empty desert horizon at dusk, dramatic long shadows."), "amber"],
  ["atacama_1", "en el desierto de atacama en chile hay otros geoglifos gigantes", "atacama_1", P("Giant ancient geoglyphs of llama caravans carved into a hillside in the Atacama desert, Chile."), "amber"],
  ["atacama_2", "tan parecido a marte que la nasa prueba ahi sus vehiculos antes de mandarlos al espacio", "atacama_2", P("A red rocky Mars-like desert landscape with a small rover vehicle testing equipment."), "amber"],
  ["gobekli_1", "en turquia esta gobekli tepe y esto si les cambia la cabeza a los arqueologos", "gobekli_1", P("Gobekli Tepe ancient stone pillar site in Turkey, circular arrangement of carved megaliths."), "amber"],
  ["gobekli_2", "mas viejos que la rueda mas viejos que la escritura mas viejos que stonehenge", "gobekli_2", P("Close up of an ancient carved stone pillar with animal relief engravings."), "amber"],
  ["gobekli_3", "alguien decidio enterrar el sitio entero a proposito", "gobekli_3", P("Archaeologists carefully excavating a buried ancient stone structure with brushes and tools."), "amber"],
  ["newgrange_1", "en irlanda hay una tumba todavia mas vieja que stonehenge new grange", "newgrange_1", P("Newgrange ancient passage tomb mound in Ireland, white quartz stone facade, green hill."), "cold"],
  ["newgrange_2", "un rayo de sol entra exacto por una abertura sobre la puerta y camina hasta el fondo de esa camara", "newgrange_2", P("A thin beam of sunlight entering a dark ancient stone passage tomb corridor."), "cold"],
  ["carnac_1", "en francia en carnac hay casi", "carnac_1", P("Long rows of ancient standing stones stretching across a green field in Brittany, France."), "blue"],
  ["silbury_1", "en el sur de inglaterra esta silbury hill la colina artificial mas grande de europa", "silbury_1", P("Silbury Hill, a large grassy artificial mound rising from the English countryside, aerial view."), "blue"],
  ["rehook_1", "vamos apenas por una parte de la lista y ya se van a dar cuenta de un patron", "rehook_1", P("A hand tracing a route with a finger across an old paper map covered in pins."), "amber"],
  ["derinkuyu_1", "bajo la region de cappadocia hay ciudades enteras excavadas hacia abajo", "derinkuyu_1", P("Derinkuyu underground city, carved tunnels and rock chambers descending into darkness, Cappadocia Turkey."), "amber"],
  ["derinkuyu_2", "con establos bodegas capillas y puertas de piedras circulares que solo se podian cerrar desde adentro", "derinkuyu_2", P("A massive round flat stone disc used as an ancient door sealing a dark underground tunnel."), "amber"],
  ["derinkuyu_3", "la construyeron para esconderse de algo", "derinkuyu_3", P("A dark narrow underground stone corridor descending, lit by a single warm light."), "amber"],
  ["pumapunku_1", "esta puma punku un sitio en ruinas", "pumapunku_1", P("Puma Punku ruins, large precisely cut stone blocks scattered on high altitude Andean ground, Bolivia."), "cold"],
  ["pumapunku_2", "cortados con angulos rectos tan precisos que parecen hechos con maquina", "pumapunku_2", P("Close up of a perfectly cut stone block with sharp right angle edges and grooves."), "cold"],
  ["pumapunku_3", "como si varias generaciones hubieran intentado terminar algo que nunca lograron completar del todo", "pumapunku_3", P("Scattered ancient stone blocks of different finishing styles lying unfinished on rocky ground."), "cold"],
  ["machupicchu_1", "no muy lejos esta machu picchu la ciudadela inca escondida entre montanas", "machupicchu_1", P("Machu Picchu Inca citadel among green misty mountains at sunrise, wide aerial view."), "blue"],
  ["machupicchu_2", "las piedras de sus muros encajan tan perfecto que ni una hoja de afeitar entra en las juntas", "machupicchu_2", P("Close up of an Inca stone wall with perfectly fitted polygonal stones, no mortar visible."), "blue"],
  ["machupicchu_3", "resistio terremotos que tumbaron construcciones coloniales hechas siglos despues", "machupicchu_3", P("An ancient stone wall standing intact beside cracked modern colonial ruins."), "blue"],
  ["sacsayhuaman_1", "en cusco la capital del imperio esta sacsayhuaman con bloques de piedra caliza de mas de 100 toneladas", "sacsayhuaman_1", P("Sacsayhuaman massive zigzag stone walls made of huge fitted boulders, Cusco Peru."), "blue"],
  ["tiwanaku_1", "cerca del lago titicaca esta tiwanaku una ciudad que llego a tener decenas de miles de habitantes", "tiwanaku_1", P("Tiwanaku ruins with the carved stone Gate of the Sun monolith, high altitude plain, Bolivia."), "cold"],
  ["yonaguni_1", "frente a la isla de yonaguni en japon hay una formacion rocosa con escalones", "yonaguni_1", P("Underwater rock formation with straight stepped edges and terraces, clear blue ocean water, Japan."), "cold"],
  ["yonaguni_2", "otros insisten en que no hay manera de que la naturaleza sola produzca esas terrazas perfectas", "yonaguni_2", P("A diver exploring underwater stepped stone terraces in clear turquoise water."), "cold"],
  ["bimini_1", "algo parecido pasa con el camino de bimini en las bahamas una hilera de bloques de piedra caliza bajo el agua", "bimini_1", P("Bimini Road, underwater rectangular flat stone blocks arranged like a road, shallow turquoise water."), "cold"],
  ["bermuda_1", "esta justo dentro del area que la gente bautizo triangulo de las bermudas", "bermuda_1", P("A stormy dark ocean seen from above, dramatic clouds over open Atlantic water."), "cold"],
  ["bermuda_2", "las estadisticas dicen que no hay mas desapariciones ahi que en cualquier otra ruta maritima", "bermuda_2", P("A cargo ship sailing through open ocean under a cloudy sky, wide shot."), "cold"],
  ["baltico_1", "en el fondo del mar baltico entre suecia y finlandia un equipo de buceadores encontro en el sonar una formacion circular", "baltico_1", P("A sonar scan screen showing a mysterious large circular shape on the dark seafloor."), "cold"],
  ["pascua_1", "sigamos con la isla de pascua ahi los moai no son solo cabezas", "pascua_1", P("Easter Island Moai stone statues standing in a row against the sky, some buried to the neck."), "amber"],
  ["pascua_2", "del misterio de como caminaron esas estatuas de varias toneladas hasta su posicion final", "pascua_2", P("A row of large Moai statues on a grassy coastal hill, Easter Island."), "amber"],
  ["pascua_3", "la civilizacion que las tallo colapso probablemente por haber talado cada arbol de la isla", "pascua_3", P("A barren treeless volcanic island landscape with rolling green hills, no trees."), "amber"],
  ["malta_1", "en malta hay templos incluso mas viejos que las piramides de egipto", "malta_1", P("Ancient megalithic limestone temple ruins in Malta, large curved stone blocks."), "amber"],
  ["nanmadol_1", "en micronesia esta nan madol un conjunto de casi 100 islotes artificiales", "nanmadol_1", P("Nan Madol ruins, tall basalt log walls rising from shallow water among small jungle islets, Micronesia."), "blue"],
  ["skarabrae_1", "en escocia en las islas orcadas el viento descubrio por accidente un pueblo entero enterrado bajo la arena", "skarabrae_1", P("Skara Brae ancient stone village ruins on a green coastal cliff in Scotland, stone huts."), "cold"],
  ["longyou_1", "en china cerca de la ciudad de longyu unos pescadores vaciaron unos estanques", "longyou_1", P("Longyou caves, massive man-made underground stone cavern with parallel chisel marks on the walls, warm lighting."), "amber"],
  ["mohenjodaro_1", "en pakistan esta mohenjo daro una de las ciudades mas antiguas y mejor planificadas", "mohenjodaro_1", P("Mohenjo-daro ancient city ruins, brick walls and streets laid out in a grid, dusty excavation site."), "amber"],
  ["gunungpadang_1", "en indonesia en la montana de gunung padang hay una estructura escalonada de terrazas de piedra", "gunungpadang_1", P("Gunung Padang stepped stone terraces on a misty jungle hillside, Indonesia."), "blue"],
  ["rehook_2", "ya llevamos como 20 lugares y todavia nos queda selva hielo y desierto por recorrer", "rehook_2", P("A dense green jungle canopy seen from above with mist rising between the trees."), "blue"],
  ["angkor_1", "en camboya la selva se trago angkor durante siglos", "angkor_1", P("Angkor temple ruins in Cambodia covered by giant tree roots growing over the stone walls, jungle."), "blue"],
  ["angkor_2", "templos de piedra tan grandes como una ciudad quedaron cubiertos por raices de arboles gigantes", "angkor_2", P("Massive tree roots wrapping over an ancient stone temple wall, close up, Ta Prohm style."), "blue"],
  ["angkor_3", "la gente local siempre supo que estaba ahi nunca se habia perdido para ellos", "angkor_3", P("A local person walking calmly along an ancient jungle temple path, wide shot, back to camera."), "blue"],
  ["jemermaya_1", "en camboya y en mexico coinciden en algo curioso ambas civilizaciones perdidas la jemer y la maya", "jemermaya_1", P("A split feeling wide shot of an overgrown ancient stone pyramid rising from dense jungle."), "blue"],
];

// ── COMPONENTES (variedad — plan del DIRECTOR) ───────────────────────────────
const COMP = [
  { id: "c_darvaza_stat", at: "hay un agujero en turkmenistan que lleva ardiendo desde 1971", dur: 5.4, kind: "numcard", hue: "amber",
    number: "55", name: "años ardiendo sin parar", bg: "img/hook_darvaza1.png", eyebrow: "Cráter de Darvaza · Turkmenistán", total: "1971",
    gen: { type: "image", name: "hook_darvaza1", prompt: P("A massive glowing orange gas crater burning at night in the middle of the desert, seen from a distance, smoke rising.") } },
  { id: "c_richat_map", at: "se llama el ojo del sahara la estructura de richard", dur: 6, kind: "mapzoom", hue: "amber",
    image: "img/richat_2.png", pinX: 0.42, pinY: 0.5, label: "Estructura de Richat · Mauritania", eyebrow: "El Ojo del Sahara", zoom: 1.15,
    gen: { type: "image", name: "richat_2", prompt: P("Aerial satellite view of the Richat Structure, concentric circular rock rings in the middle of the desert, Mauritania.") } },
  { id: "c_richat_stat", at: "y desde el aire parece un blanco de tiro perfecto casi 100 kilometros de anillos concentricos", dur: 5.2, kind: "numcard", hue: "amber",
    number: "100", name: "km de anillos concéntricos", bg: "img/richat_3.png", eyebrow: "Escala real", total: "Mauritania" },
  { id: "c_stonehenge_bars", at: "traidas desde canteras a mas de 200 kilometros de distancia sin ruedas sin metal", dur: 6.4, kind: "bars", hue: "amber",
    title: "Cómo movieron piedras de varias toneladas", eyebrow: "Stonehenge, Inglaterra",
    bars: [{ label: "Distancia recorrida", value: 200, display: "200 km" }, { label: "Ruedas disponibles", value: 0 }, { label: "Metal disponible", value: 0 }, { label: "Animales de carga", value: 0 }] },
  { id: "c_zimbabue_vs", at: "muros de granito apilados sin una sola gota de mortero algunos de mas de 10 metros de alto", dur: 11, kind: "vs", hue: "blue",
    title: "Sin una gota de mortero", eyebrow: "Gran Zimbabue",
    left: { label: "Gran Zimbabue", value: "800 años en pie", sub: "granito apilado a seco, sin una gota de mortero", good: true },
    right: { label: "Construcción moderna", value: "necesita mortero", sub: "y refuerzo estructural para durar", good: false } },
  { id: "c_nazca_num", at: "un colibri una arana o un mono de 300 metros de largo", dur: 9, kind: "numcard", hue: "amber",
    number: "300", name: "metros de largo", bg: "img/nazca_2.png", eyebrow: "Líneas de Nazca", total: "Perú" },
  { id: "c_gobekli_bars", at: "mas viejos que la rueda mas viejos que la escritura mas viejos que stonehenge", dur: 11, kind: "bars", hue: "amber",
    title: "Qué es más viejo que Göbekli Tepe", eyebrow: "Turquía · 6.000 años antes que Stonehenge", unit: "años atrás",
    bars: [{ label: "Göbekli Tepe", value: 11600 }, { label: "La rueda", value: 6000 }, { label: "La escritura", value: 5200 }, { label: "Stonehenge", value: 5000 }] },
  { id: "c_newgrange_aged", at: "un rayo de sol entra exacto por una abertura sobre la puerta y camina hasta el fondo de esa camara", dur: 6.6, kind: "aged", hue: "cold",
    heading: "Newgrange, Irlanda", eyebrow: "Una sola vez al año", image: "img/newgrange_2.png",
    lines: [{ text: "Cámara de piedra sellada" }, { text: "Solsticio de invierno: el sol entra exacto", mark: true }, { text: "Construida hace más de 5.000 años" }],
    gen: { type: "image", name: "newgrange_2", prompt: P("A thin beam of sunlight entering a dark ancient stone passage tomb corridor.") } },
  { id: "c_derinkuyu_process", at: "con establos bodegas capillas y puertas de piedras circulares que solo se podian cerrar desde adentro", dur: 7.2, kind: "process", hue: "amber",
    title: "Derinkuyu, ciudad bajo tierra", eyebrow: "Capadocia, Turquía",
    steps: [{ title: "Entrada", desc: "un pozo angosto en la superficie" }, { title: "Establos y bodegas", desc: "los primeros niveles" }, { title: "Capillas", desc: "más abajo todavía" }, { title: "Puerta circular", desc: "se cerraba solo desde adentro" }] },
  { id: "c_pumapunku_vs", at: "cortados con angulos rectos tan precisos que parecen hechos con maquina", dur: 8, kind: "vs", hue: "cold",
    title: "Precisión imposible", eyebrow: "Puma Punku, Bolivia",
    left: { label: "El corte de los bloques", value: "ángulos rectos tipo máquina", sub: "precisión casi milimétrica", good: false },
    right: { label: "Herramientas de la época", value: "sin metales duros", sub: "ni herramientas de precisión conocidas", good: false } },
  { id: "c_machupicchu_num", at: "las piedras de sus muros encajan tan perfecto que ni una hoja de afeitar entra en las juntas", dur: 10, kind: "numcard", hue: "blue",
    number: "0", name: "mm entre bloques", bg: "img/machupicchu_2.png", eyebrow: "Machu Picchu, Perú", total: "0" },
  { id: "c_sacsayhuaman_num", at: "con bloques de piedra caliza de mas de 100 toneladas cada uno", dur: 5.6, kind: "numcard", hue: "blue",
    number: "100+", name: "toneladas por bloque", bg: "img/sacsayhuaman_1.png", eyebrow: "Sacsayhuamán, Cusco", total: "Cusco" },
  { id: "c_yonaguni_vs", at: "otros insisten en que no hay manera de que la naturaleza sola produzca esas terrazas perfectas", dur: 6.4, kind: "vs", hue: "cold",
    title: "¿Natural o construido?", eyebrow: "Monumento de Yonaguni, Japón",
    left: { label: "Hipótesis natural", value: "arenisca que se fractura sola", sub: "así lo explican algunos geólogos", good: true },
    right: { label: "Hipótesis artificial", value: "terrazas demasiado perfectas", sub: "para ser puro azar geológico", good: false } },
  { id: "c_bermuda_stat", at: "las estadisticas dicen que no hay mas desapariciones ahi que en cualquier otra ruta maritima", dur: 9, kind: "stat", hue: "cold",
    value: 0, prefix: "+", suffix: "% extra", label: "desapariciones vs. otras rutas marítimas", eyebrow: "Triángulo de las Bermudas", accent: "cold" },
  { id: "c_pascua_chips", at: "del misterio de como caminaron esas estatuas de varias toneladas hasta su posicion final", dur: 9, kind: "chips", hue: "amber",
    bg: "image", image: "img/pascua_2.png", title: "Los Moái de Isla de Pascua", chips: ["cuerpo enterrado hasta el cuello", "varias toneladas cada uno", "isla sin un solo árbol"],
    gen: { type: "image", name: "pascua_2", prompt: P("A row of large Moai statues on a grassy coastal hill, Easter Island.") } },
  { id: "c_asia_split", at: "en pakistan esta mohenjo daro una de las ciudades mas antiguas y mejor planificadas", dur: 6.4, kind: "splitlist", hue: "amber",
    title: "Tres sitios, un mismo misterio", palette: "A",
    items: ["Longyou (China): cuevas talladas sin un solo registro histórico", "Mohenjo-Daro (Pakistán): cañerías más avanzadas que ciudades de hace un siglo", "Gunung Padang (Indonesia): antigüedad todavía en discusión"] },
  { id: "c_nazca_quote", at: "eso para mi es mas inquietante que cualquier teoria extraterrestre", dur: 5.8, kind: "quote", hue: "amber",
    image: "img/nazca_3.png", eyebrow: "Líneas de Nazca", text: "Alguien que dedica su vida a un *dibujo* que nunca va a poder *mirar*.", accent: "amber", fontSize: 92 },
  { id: "c_cierre_journey", at: "en camboya y en mexico coinciden en algo curioso ambas civilizaciones perdidas la jemer y la maya", dur: 7, kind: "journey", hue: "blue", dark: true,
    eyebrow: "El recorrido sigue", title: "De Angkor a las ruinas Maya",
    gen: { type: "image", name: "jemermaya_1", prompt: P("A split feeling wide shot of an overgrown ancient stone pyramid rising from dense jungle.") },
    waypoints: [
      { x: 0.28, y: 0.42, z: 0, image: "img/angkor_1.png", label: "Angkor, Camboya", num: "1", dwell: 2.6, travel: 1.6 },
      { x: 0.72, y: 0.55, z: 0.3, image: "img/jemermaya_1.png", label: "Ruinas Maya, México", num: "2", dwell: 2.6, travel: 1.6 },
    ] },
  { id: "c_nazca_checklist", at: "la gente que los dibujo nunca volo caminaban la linea entera paso a paso", dur: 5.6, kind: "checklist", hue: "amber",
    title: "Las figuras de Nazca", items: [{ text: "Un colibrí de decenas de metros" }, { text: "Una araña gigante" }, { text: "Un mono de 300 metros de largo" }],
    gen: { type: "image", name: "nazca_3", prompt: P("A lone tiny figure walking across a vast empty desert line, seen from far above.") } },
  { id: "c_newgrange_num", at: "en irlanda hay una tumba todavia mas vieja que stonehenge new grange", dur: 5.4, kind: "numcard", hue: "cold",
    number: "5000", name: "años de precisión astronómica", bg: "img/newgrange_1.png", eyebrow: "Newgrange, Irlanda", total: "Stonehenge",
    gen: { type: "image", name: "newgrange_1", prompt: P("Newgrange ancient passage tomb mound in Ireland, white quartz stone facade, green hill.") } },
  { id: "c_tiwanaku_map", at: "cerca del lago titicaca esta tiwanaku una ciudad que llego a tener decenas de miles de habitantes", dur: 12, kind: "mapzoom", hue: "cold",
    image: "img/tiwanaku_1.png", pinX: 0.3, pinY: 0.62, label: "Tiwanaku · Bolivia", eyebrow: "A orillas del lago Titicaca", zoom: 1.1,
    gen: { type: "image", name: "tiwanaku_1", prompt: P("Tiwanaku ruins with the carved stone Gate of the Sun monolith, high altitude plain, Bolivia.") } },
  { id: "c_malta_bars", at: "en malta hay templos incluso mas viejos que las piramides de egipto", dur: 6, kind: "bars", hue: "amber",
    title: "Más viejos que las pirámides", eyebrow: "Templos de Malta", unit: "años de antigüedad",
    bars: [{ label: "Templos de Malta", value: 5600 }, { label: "Pirámides de Egipto", value: 4500 }, { label: "Stonehenge", value: 5000 }],
    gen: { type: "image", name: "malta_1", prompt: P("Ancient megalithic limestone temple ruins in Malta, large curved stone blocks.") } },
  { id: "c_skarabrae_quote", at: "en escocia en las islas orcadas el viento descubrio por accidente un pueblo entero enterrado bajo la arena", dur: 5.8, kind: "quote", hue: "cold",
    image: "img/skarabrae_1.png", eyebrow: "Skara Brae, Escocia", text: "Una *tormenta* de 1850 mostró en un día lo que nadie había visto en *miles de años*.", accent: "cold", fontSize: 88,
    gen: { type: "image", name: "skarabrae_1", prompt: P("Skara Brae ancient stone village ruins on a green coastal cliff in Scotland, stone huts.") } },
  { id: "c_angkor_process", at: "templos de piedra tan grandes como una ciudad quedaron cubiertos por raices de arboles gigantes", dur: 12, kind: "process", hue: "blue",
    title: "Cómo la selva se comió Angkor", eyebrow: "Camboya",
    steps: [{ title: "Semilla", desc: "cae sobre la piedra del templo" }, { title: "Raíz", desc: "se cuela entre las juntas" }, { title: "Crecimiento", desc: "la raíz se vuelve tronco" }, { title: "Fusión", desc: "el árbol es parte del muro" }],
    gen: { type: "image", name: "angkor_2", prompt: P("Massive tree roots wrapping over an ancient stone temple wall, close up, Ta Prohm style.") } },
  { id: "c_nanmadol_chips", at: "en micronesia esta nan madol un conjunto de casi 100 islotes artificiales", dur: 8, kind: "chips", hue: "blue",
    bg: "image", image: "img/nanmadol_1.png", title: "Nan Madol, Micronesia", chips: ["casi 100 islotes artificiales", "columnas de basalto de toneladas", "la 'ciudad de los espíritus'"],
    gen: { type: "image", name: "nanmadol_1", prompt: P("Nan Madol ruins, tall basalt log walls rising from shallow water among small jungle islets, Micronesia.") } },
  { id: "c_atacama_num", at: "en el desierto de atacama en chile hay otros geoglifos gigantes", dur: 11, kind: "numcard", hue: "amber",
    number: "1000+", name: "años de antigüedad", bg: "img/atacama_1.png", eyebrow: "Geoglifos de Atacama", total: "Atacama",
    gen: { type: "image", name: "atacama_1", prompt: P("Giant ancient geoglyphs of llama caravans carved into a hillside in the Atacama desert, Chile.") } },
  { id: "c_baltico_map", at: "en el fondo del mar baltico entre suecia y finlandia un equipo de buceadores encontro en el sonar una formacion circular", dur: 5.8, kind: "mapzoom", hue: "cold",
    image: "img/baltico_1.png", pinX: 0.55, pinY: 0.35, label: "Anomalía del Báltico", eyebrow: "Entre Suecia y Finlandia", zoom: 1.1,
    gen: { type: "image", name: "baltico_1", prompt: P("A sonar scan screen showing a mysterious large circular shape on the dark seafloor.") } },
  { id: "c_bimini_aged", at: "algo parecido pasa con el camino de bimini en las bahamas una hilera de bloques de piedra caliza bajo el agua", dur: 6, kind: "aged", hue: "cold",
    heading: "Camino de Bimini, Bahamas", eyebrow: "Bajo el agua", image: "img/bimini_1.png",
    lines: [{ text: "Bloques rectangulares bajo el agua" }, { text: "Parece una calle empedrada", mark: true }, { text: "La mayoría de los geólogos: formación natural" }],
    gen: { type: "image", name: "bimini_1", prompt: P("Bimini Road, underwater rectangular flat stone blocks arranged like a road, shallow turquoise water.") } },
  { id: "c_derinkuyu_quote", at: "la construyeron para esconderse de algo", dur: 5, kind: "quote", hue: "amber",
    image: "img/derinkuyu_3.png", eyebrow: "Derinkuyu, Turquía", text: "La construyeron para *esconderse* de algo.", accent: "amber", fontSize: 96,
    gen: { type: "image", name: "derinkuyu_3", prompt: P("A dark narrow underground stone corridor descending, lit by a single warm light.") } },
  { id: "c_angkor_quote", at: "la gente local siempre supo que estaba ahi nunca se habia perdido para ellos", dur: 5.4, kind: "quote", hue: "blue",
    image: "img/angkor_3.png", eyebrow: "Angkor, Camboya", text: "Nunca se había *perdido* para ellos.", accent: "accent", fontSize: 92,
    gen: { type: "image", name: "angkor_3", prompt: P("A local person walking calmly along an ancient jungle temple path, wide shot, back to camera.") } },
  { id: "c_darvaza_quote", at: "parece la boca de otra cosa no un pozo de gas", dur: 5, kind: "quote", hue: "amber",
    image: "img/hook_darvaza3.png", eyebrow: "Cráter de Darvaza", text: "Parece la *boca* de otra cosa, no un pozo de gas.", accent: "amber", fontSize: 96 },
  { id: "c_stonehenge_aged", at: "alinearon exactamente esas piedras con la salida del sol del solsticio de verano", dur: 6, kind: "aged", hue: "amber",
    heading: "Stonehenge, Inglaterra", eyebrow: "El verdadero misterio", image: "img/stonehenge_4.png",
    lines: [{ text: "Cómo movieron las piedras: ya tiene teorías sólidas" }, { text: "Por qué exactas al solsticio de verano: no se sabe", mark: true }, { text: "En un lugar sin población permanente" }] },
  { id: "c_yonaguni_num", at: "frente a la isla de yonaguni en japon hay una formacion rocosa con escalones", dur: 5.4, kind: "numcard", hue: "cold",
    number: "25", name: "metros bajo el agua", bg: "img/yonaguni_1.png", eyebrow: "Monumento de Yonaguni", total: "Japón" },
  { id: "c_bermuda_map", at: "esta justo dentro del area que la gente bautizo triangulo de las bermudas", dur: 5.6, kind: "mapzoom", hue: "cold",
    image: "img/bermuda_1.png", pinX: 0.5, pinY: 0.45, label: "Triángulo de las Bermudas", eyebrow: "Atlántico occidental", zoom: 1.1 },
  { id: "c_pascua_quote", at: "la civilizacion que las tallo colapso probablemente por haber talado cada arbol de la isla", dur: 9, kind: "quote", hue: "amber",
    image: "img/pascua_3.png", eyebrow: "Isla de Pascua", text: "Dejaron un cementerio de *gigantes de piedra* en una isla que ellos mismos habían vaciado.", accent: "amber", fontSize: 84 },
  { id: "c_longyou_num", at: "en china cerca de la ciudad de longyu unos pescadores vaciaron unos estanques", dur: 5.2, kind: "numcard", hue: "amber",
    number: "0", name: "registros históricos del hallazgo", bg: "img/longyou_1.png", eyebrow: "Cuevas de Longyou, China", total: "China" },
  { id: "c_gunungpadang_stat", at: "en indonesia en la montana de gunung padang hay una estructura escalonada de terrazas de piedra", dur: 10, kind: "quote", hue: "blue",
    image: "img/gunungpadang_1.png", eyebrow: "Gunung Padang, Indonesia", text: "Podría ser *mucho más antigua* que cualquier otra construcción conocida.", accent: "accent", fontSize: 84 },
  { id: "c_angkor_map", at: "en camboya la selva se trago angkor durante siglos", dur: 5.4, kind: "mapzoom", hue: "blue",
    image: "img/angkor_1.png", pinX: 0.65, pinY: 0.5, label: "Angkor · Camboya", eyebrow: "Tragado por la selva", zoom: 1.12 },
  { id: "c_malta_aged", at: "ciertas frecuencias graves hacen vibrar el aire de una manera que todavia se estudia en laboratorios acusticos", dur: 12, kind: "aged", hue: "amber",
    heading: "Templos de Malta", eyebrow: "Un misterio acústico", image: "img/malta_1.png",
    lines: [{ text: "Cámaras subterráneas, piedra caliza" }, { text: "Frecuencias graves que hacen vibrar el aire", mark: true }, { text: "Todavía se estudia en laboratorios acústicos" }] },
  { id: "c_nanmadol_quote", at: "los locales lo llamaban durante generaciones la ciudad de los espiritus", dur: 12, kind: "quote", hue: "blue",
    image: "img/nanmadol_1.png", eyebrow: "Nan Madol, Micronesia", text: "La llamaban, durante generaciones, la *ciudad de los espíritus*.", accent: "accent", fontSize: 88 },
  { id: "c_skarabrae_chips", at: "casas de piedra con literas estantes y hasta algo parecido a un sistema de desague", dur: 12, kind: "chips", hue: "blue",
    bg: "image", image: "img/skarabrae_1.png", title: "Skara Brae, Escocia", chips: ["casas de piedra con literas", "estantes tallados", "un sistema de desagüe"] },
  { id: "c_longyou_process", at: "con paredes talladas con marcas perfectamente paralelas sin ninguna herramienta abandonada adentro", dur: 13, kind: "process", hue: "amber",
    title: "Las cuevas de Longyou", eyebrow: "China",
    steps: [{ title: "Descubiertas", desc: "unos pescadores vaciaron los estanques" }, { title: "Marcas paralelas", desc: "talladas a mano en la roca" }, { title: "Cero rastros", desc: "sin herramientas, sin escombros, sin registros" }] },
  { id: "c_rehook_quote", at: "la gente que los hizo dedico vidas enteras a algo que no iba a beneficiarlos a ellos directamente", dur: 12, kind: "quote", hue: "amber",
    image: "img/rehook_1.png", eyebrow: "Un patrón", text: "Dedicaron *vidas enteras* a algo que no iba a beneficiarlos a ellos directamente.", accent: "amber", fontSize: 82 },
  { id: "c_silbury_aged", at: "hecha completamente a mano capa por capa de tiza y tierra", dur: 12, kind: "aged", hue: "blue",
    heading: "Silbury Hill, Inglaterra", eyebrow: "La colina más grande de Europa", image: "img/silbury_1.png",
    lines: [{ text: "Capa por capa, de tiza y tierra" }, { text: "Sin ninguna tumba en su interior", mark: true }, { text: "Generaciones enteras para no enterrar a nadie" }] },
  { id: "c_richat_quote", at: "es roca que quedo expuesta por erosion durante millones de anos", dur: 11, kind: "quote", hue: "amber",
    image: "img/richat_4.png", eyebrow: "Estructura de Richat", text: "Los primeros *astronautas* la usaban para orientarse en órbita, sin instrumentos.", accent: "amber", fontSize: 80 },
  { id: "c_carnac_chips", at: "piedras paradas en filas que se extienden por kilometros sin ninguna camara ni tumba adentro", dur: 11, kind: "chips", hue: "blue",
    bg: "image", image: "img/carnac_1.png", title: "Carnac, Francia", chips: ["casi 3.000 piedras", "filas de varios kilómetros", "sin cámara ni tumba: solo alineaciones"] },
  { id: "c_baltico_quote", at: "las imagenes estan ahi disponibles para cualquiera las explicaciones no tanto", dur: 11, kind: "quote", hue: "cold",
    image: "img/baltico_1.png", eyebrow: "Anomalía del Báltico", text: "Las imágenes están *ahí*, disponibles para cualquiera. Las explicaciones, no tanto.", accent: "cold", fontSize: 88 },
  { id: "c_intro_num", at: "hoy quiero llevarlos por 50 de esos lugares uno detras de otro", dur: 10, kind: "numcard", hue: "amber",
    number: "50", name: "lugares en el mapa", bg: "img/intro_mundo.png", eyebrow: "El recorrido de hoy", total: "el mapa" },
];

// ── STOCK: clips REALES de video (Pexels/Pixabay/Archive), ≤3s, insertados como
// "notch" dentro de un hold de imagen ya SEGURO (calculado, no adivinado por frase) —
// ver más abajo: se derivan de los tramos raw que sobreviven la clipeada de
// componentes, así NUNCA chocan con un comp por construcción.
const CONCEPTS = {
  darvaza: "burning gas crater flames fire night desert",
  intro: "old vintage map hands close up antique",
  richat: "aerial drone desert rings satellite flyover",
  stonehenge: "stonehenge aerial drone sunrise standing stones",
  zimbabue: "african stone ruins aerial savanna dry wall",
  nazca: "desert aerial flyover lines drone",
  atacama: "atacama desert aerial chile rover",
  gobekli: "ancient stone pillars archaeological site excavation",
  newgrange: "ancient stone mound ireland aerial green hill",
  carnac: "standing stones field aerial france",
  silbury: "green hill aerial drone england countryside",
  rehook: "old map hand tracing route closeup",
  derinkuyu: "underground tunnel cave stone dark",
  pumapunku: "ancient stone blocks ruins scattered closeup",
  machupicchu: "machu picchu aerial drone mist mountains",
  sacsayhuaman: "inca stone wall cusco closeup",
  tiwanaku: "andean ruins high altitude plain",
  yonaguni: "underwater rock formation diver exploring",
  bimini: "underwater stones shallow water aerial turquoise",
  bermuda: "stormy ocean aerial dark clouds",
  baltico: "sonar screen scanning ocean floor",
  pascua: "easter island moai statues",
  malta: "ancient temple ruins stone limestone",
  nanmadol: "ancient ruins water canals aerial jungle",
  skarabrae: "stone age village ruins coastal windy",
  longyou: "underground cave chamber carved rock",
  mohenjodaro: "ancient city ruins excavation brick",
  gunungpadang: "stone terraces hillside jungle mist",
  angkor: "jungle temple tree roots ruins cambodia",
};
const siteKeyOf = (id) => {
  const base = id.replace(/(_\d+)+$/, ""); // pela uno o más sufijos "_N" del final (índice + pieza de corte)
  return base === "hook" ? "darvaza" : base;
};

// ── construir beats RAW ──────────────────────────────────────────────────────
const rawBeats = [];
for (const [id, phrase, img, prompt, hue] of RAW) {
  const t = atc(phrase);
  if (t == null) continue;
  rawBeats.push({ id, start: +t.toFixed(2), kind: "raw", src: `img/${img}.png`, hue, darken: 0.14,
    gen: { type: "image", name: img, prompt } });
}
rawBeats.sort((a, b) => a.start - b.start);
for (let i = 0; i < rawBeats.length; i++) {
  const next = i + 1 < rawBeats.length ? rawBeats[i + 1].start : REAL_END;
  rawBeats[i].dur = +Math.max(1.2, next - rawBeats[i].start + 0.3).toFixed(2);
}

// ── construir beats COMPONENTE (reemplazan el raw de ese instante, se paran encima) ──
const compBeats = [];
for (const c of COMP) {
  const t = atc(c.at);
  if (t == null) continue;
  const { id, at: _at, dur, kind, ...props } = c;
  compBeats.push({ id, start: +t.toFixed(2), dur, kind, ...props });
}
compBeats.sort((a, b) => a.start - b.start);
// dos componentes con anchors reales muy cerca pueden pisarse entre sí (nunca contra
// un raw, eso ya no puede pasar) — el anterior se acorta hasta el inicio del siguiente.
for (let i = 0; i < compBeats.length - 1; i++) {
  const a = compBeats[i], b = compBeats[i + 1];
  if (a.start + a.dur > b.start + 0.05) {
    const trimmed = +Math.max(1.5, b.start - a.start).toFixed(2);
    console.warn(`⚠ comp overlap: ${a.id} (${a.start}+${a.dur}) pisa a ${b.id} (${b.start}) → dur ${a.dur}→${trimmed}`);
    a.dur = trimmed;
  }
}

// ★ FIX #2 (bug detectado por el AUDITOR, ronda 2): capar el dur de los componentes
// (fix #1) dejaba HUECOS reales sin nada anclado — el numcard/bars/etc. terminaba
// antes de que llegara el próximo raw/comp (cuyo anchor real, tomado del ms exacto
// de Whisper, podía estar 10-20s más adelante), y esos segundos quedaban con el
// fondo vacío (crema) sin ninguna imagen. Solución correcta: los RAW se tilean
// PRIMERO, completos y sin huecos, cubriendo 0..REAL_END. Los componentes se
// "insertan" después, RECORTANDO (sustracción de intervalos) la porción que ocupan
// de cualquier raw que se solape — nunca estiran, nunca dejan hueco.
const compRanges = compBeats.map((c) => [c.start, c.start + c.dur]).sort((a, b) => a[0] - b[0]);
const clipAgainstRanges = (start, dur, ranges) => {
  let pieces = [[start, start + dur]];
  for (const [cs, ce] of ranges) {
    const next = [];
    for (const [ps, pe] of pieces) {
      if (ce <= ps || cs >= pe) { next.push([ps, pe]); continue; } // sin solape
      if (cs > ps) next.push([ps, cs]); // resto izquierdo
      if (ce < pe) next.push([ce, pe]); // resto derecho
    }
    pieces = next;
  }
  return pieces.filter(([s, e]) => e - s >= 0.6); // < 0.6s: se descarta (imperceptible)
};

// ── construir beats STOCK (clips reales ≤3s, "notch" dentro de un tramo YA seguro) ──
// Pedido del usuario: intercalar bastantes clips de stock cortos para que se sienta
// dinámico. En vez de anclar por frase (arriesga chocar con un componente), se
// derivan de los tramos raw que sobreviven la clipeada de componentes — así un
// stock NUNCA puede caer encima de un comp (imposible por construcción).
const rawByComp = [];
for (const r of rawBeats) {
  const pieces = clipAgainstRanges(r.start, r.dur, compRanges);
  pieces.forEach(([s, e], idx) => rawByComp.push({ ...r, id: pieces.length > 1 ? `${r.id}_${idx}` : r.id, start: +s.toFixed(2), dur: +(e - s).toFixed(2) }));
}
const stockBeats = [];
const usedSites = new Set();
for (const r of rawByComp) {
  if (r.dur < 5) continue;
  const key = siteKeyOf(r.id);
  if (!CONCEPTS[key] || usedSites.has(key)) continue;
  const offset = Math.min(1.4, r.dur * 0.3);
  const dur = +Math.min(3, r.dur - offset - 0.5).toFixed(2);
  if (dur < 1.5) continue;
  usedSites.add(key);
  const name = `sk_${key}`;
  stockBeats.push({
    id: name, start: +(r.start + offset).toFixed(2), dur, kind: "raw", src: `broll/${name}.mp4`, noSplit: true,
    hue: r.hue, isStock: true, stockGen: { name, concept: CONCEPTS[key], dur: 3 },
  });
}
console.log(`stock: ${stockBeats.length} clips derivados de tramos seguros (de ${Object.keys(CONCEPTS).length} sitios con concepto)`);
const occupantRanges = [...compRanges, ...stockBeats.map((s) => [s.start, s.start + s.dur])].sort((a, b) => a[0] - b[0]);
const rawFinal = [];
for (const r of rawBeats) {
  const pieces = clipAgainstRanges(r.start, r.dur, occupantRanges);
  pieces.forEach(([s, e], idx) => {
    rawFinal.push({ ...r, id: pieces.length > 1 ? `${r.id}_${idx}` : r.id, start: +s.toFixed(2), dur: +(e - s).toFixed(2) });
  });
}
const timeline = [...rawFinal, ...compBeats, ...stockBeats].sort((a, b) => a.start - b.start);

// ── CIERRE SILENCIOSO (sin voz nueva): recap rápido + tarjeta de suscripción ─
const closingImgs = ["hook_darvaza1", "stonehenge_1", "nazca_1", "machupicchu_1", "angkor_1"];
const closingBeats = [];
const lastEnd = timeline.length ? timeline[timeline.length - 1].start + timeline[timeline.length - 1].dur : REAL_END;
let cursor = Math.max(REAL_END, lastEnd);
for (const img of closingImgs) {
  closingBeats.push({ id: `close_${img}`, start: +cursor.toFixed(2), dur: 1.3, kind: "raw", src: `img/${img}.png`, hue: "amber", darken: 0.35, noSplit: true });
  cursor += 1.3;
}
closingBeats.push({
  id: "close_card", start: +cursor.toFixed(2), dur: +(TOTAL - cursor).toFixed(2), kind: "headline", hue: "amber",
  bg: "image", image: "img/hook_darvaza1.png", eyebrow: "Quedan muchos lugares más en el mapa",
  tokens: [{ t: "Seguí" }, { t: "el" }, { t: "mapa" }, { t: "—" }, { t: "suscribite", hl: true }],
});

const beats = [...timeline, ...closingBeats];

// duplicados de id (sanity)
{ const seen = new Map(); for (const b of beats) seen.set(b.id, (seen.get(b.id) || 0) + 1); const dups = [...seen.entries()].filter(([, c]) => c > 1); if (dups.length) { console.error("✖ ids repetidos:", dups); process.exit(1); } }

fs.mkdirSync("beatsheet", { recursive: true });
// "clipsfirst":true (en vez de "tutorial") — con los 25 clips de stock reales
// agregados a pedido del usuario, el footage real (imagen + video) pasa el 65%
// del tutorial; el tope de raw% ya no aplica (a propósito: es un video clips-first),
// pero TODOS los demás guards de variedad (≥11 tipos, ≥6 estructurados, bars/vs≥2,
// checklist≥1) se mantienen duros y ya pasan sobrados.
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: AVATAR, maxRawDur: 6, total: TOTAL, clipsfirst: true, beats }, null, 1));
console.log(`beats ${beats.length} (raw ${rawFinal.length} · comp ${compBeats.length} · cierre ${closingBeats.length}) · REAL_END ${REAL_END}s · TOTAL ${TOTAL}s`);

// ── AVATAR WINDOWS (full ↔ hidden, sin PiP de esquina) ───────────────────────
// Usa el timeline YA REACOMODADO (start/dur finales, post cursor-fix) — no los
// anchors originales — para que las ventanas de avatar coincidan con lo que
// realmente se ve en pantalla.
// comps = rangos que DEBEN verse (componentes gráficos) → avatar hidden ahí.
// El resto (planos raw = b-roll genérico) son candidatos a full-avatar (variedad).
// los clips STOCK también deben verse (footage real, no tapar con avatar-full) —
// solo las imágenes IA genéricas son candidatas a que el avatar las cubra en full.
const timelineRaw = timeline.filter((b) => b.kind === "raw" && !b.isStock);
const timelineComp = timeline.filter((b) => b.kind !== "raw" || b.isStock);
const comps2 = timelineComp.map((c) => [c.start, c.start + c.dur]);
const overlapsComp = (a, b) => comps2.some(([s, e]) => a < e && b > s);
const snapWord = (tt) => { for (const c of caps) if (c.startMs / 1000 >= tt - 0.05) return c.startMs / 1000; return tt; };
const HOOK_END = 11, PERIOD = 22, SLOT = 4.5, SEARCH = 16;
const fulls = [[0, snapWord(HOOK_END)]];
for (const r of timelineRaw) {
  if (/^(intro_|rehook_)/.test(r.id)) continue; // dejamos esos como visual (mapa/transición)
  const s = r.start, e = snapWord(s + 4);
  if (e - s >= 2 && !overlapsComp(s, e)) fulls.push([+s.toFixed(2), e]);
}
for (let target = HOOK_END + PERIOD; target < REAL_END - 10; target += PERIOD) {
  for (let t = target; t < target + SEARCH; t += 0.5) {
    const s = snapWord(t), e = snapWord(s + SLOT);
    if (e - s >= 3 && e - s <= 6 && !overlapsComp(s, e)) { fulls.push([s, e]); break; }
  }
}
fulls.sort((a, b) => a[0] - b[0]);
// merge overlaps + descartar los que se superponen entre sí, tomando 1 cada ~6s min
const merged = [];
for (const f of fulls) { if (!merged.length || f[0] > merged[merged.length - 1][1] + 0.3) merged.push(f); }
const windows = [];
let cur = 0;
for (const [s, e] of merged) {
  if (s > cur + 0.2) windows.push({ start: +cur.toFixed(2), mode: "hidden" });
  windows.push({ start: +s.toFixed(2), mode: "full" });
  cur = e;
}
if (cur < REAL_END - 0.1) windows.push({ start: +cur.toFixed(2), mode: "hidden" });
windows.push({ start: REAL_END, mode: "hidden" }); // cierre silencioso: avatar afuera
if (windows[0].start !== 0) windows.unshift({ start: 0, mode: windows[0].mode });

fs.writeFileSync(
  `src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.\nimport type { AvatarWindow } from "./scenes/AvatarLayer";\nexport const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};\nexport const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};\n`
);
console.log(`avatar windows: ${windows.length} (full: ${windows.filter((w) => w.mode === "full").length})`);

// ★ FIX #3 (bug detectado por el AUDITOR de farm — "release not found" / 404 en el
// runner): un raw beat que un componente termina clipeando por COMPLETO (0 piezas
// sobreviven) desaparece del array `beats` → beatsheet.mjs nunca ve su `gen` → esa
// imagen NUNCA se genera aunque el componente la siga referenciando por bg/image
// (nombre pelado, sin gen propio). Acá se escribe SIEMPRE la lista COMPLETA de
// imágenes de RAW (sobrevivan o no como beat) + todo lo referenciado por los
// componentes, para generar el 100% sin depender de la supervivencia del clip.
{
  const allImgs = new Map();
  for (const [, , img, prompt] of RAW) allImgs.set(img, prompt);
  fs.mkdirSync("public/img", { recursive: true });
  fs.writeFileSync(
    `public/img/prompts_${SLUG}_all.json`,
    JSON.stringify([...allImgs.entries()].map(([name, prompt]) => ({ name, prompt })), null, 2)
  );
  console.log(`prompts_${SLUG}_all.json: ${allImgs.size} imágenes (RAW completo, incluye las clipeadas al 100%)`);
}

// ── lista para scripts/stockfallback.mjs --list (clips reales ≤3s) ──────────
{
  const needstock = stockBeats.map((s) => ({ name: s.stockGen.name, concept: s.stockGen.concept, query: s.stockGen.concept, dur: 3 }));
  fs.mkdirSync("public/broll", { recursive: true });
  fs.writeFileSync(`public/broll/needstock_${SLUG}.json`, JSON.stringify(needstock, null, 2));
  console.log(`needstock_${SLUG}.json: ${needstock.length} clips de stock a bajar → node scripts/stockfallback.mjs --list public/broll/needstock_${SLUG}.json`);
}
