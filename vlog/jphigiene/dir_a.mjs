// DIRECTOR A — jphigiene (Claudio en Japón #1, "Lo que aprendí en Tokio"): MINUTO 1 (la grilla de la miniatura cobra vida + "hueles
// mal" → Sato-san lo corrige delante de todos (loop de la toalla) → bañarse no alcanza → promesa 11 reglas + la 7 → credibilidad 15
// años + el test del final) + reglas 1 (toalla), 2 (orden) y 3 (esponja, mención 1 del Método pág. 9). Párrafos 0-20.
import { S, BI, CLP, SATO, HOTEL, HOUSE, BATH } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/jphigiene/";
export const H = "a man's hands with tanned skin, the sleeve of a plain red polo shirt at the edge of the frame";
export const STAFF = "a line of Japanese hotel housekeeping staff in dark navy uniforms with white collars standing in a row in a quiet hotel corridor";
export const TOWEL = "a thick gray terry bath towel folded double on a single metal hook";
export const SATOP = I + "x_sato.jpg";
export const SHOTS = [
  // ── 0:00 · la miniatura cobra vida
  C(0, "", "ClGridHook", { bed: I + "x_thumbbg.jpg", tiles: [1, 2, 3, 4, 5, 6].map((k) => I + `x_t${k}.jpg`), words: ["por esto", "hueles mal"], every: 8 }),
  // ── Sato-san delante de todos
  S(1, "", "bi", "b_corridor", { q: "japanese hotel corridor", p: BI(`A long, quiet corridor of ${HOTEL}: beige carpet, identical doors with small brass room numbers, soft ceiling lights, a housekeeping cart parked near a door.`) }),
  S(1, "en un hotel de Tokio", "bi", "b_tokyo", { q: "tokyo street night", p: BI("A Tokyo street in the early morning: small hotels and shops with lit signs, a few people in coats walking to work, overhead wires.") }),
  S(1, "mi jefa, Sato-san", "bi", "b_satoface", { p: BI(`${SATO}, standing in a hotel corridor, looking straight ahead with a serious, attentive expression, a clipboard held against her chest.`) }),
  S(1, "me paró en el pasillo", "bi", "b_satostop", { p: BI(`${SATO} raising one hand to stop a man in a red polo shirt seen from behind in a hotel corridor, a housekeeping cart beside them.`) }),
  S(1, "delante de todo el equipo", "bi", "b_staffline", { q: "hotel staff meeting", p: BI(`${STAFF}, all turned toward the same point, a couple of them glancing sideways at each other.`) }),
  S(1, "Se acercó", "bi", "b_satolean", { p: BI(`${SATO} leaning slightly toward the shoulder of a man in a red polo shirt, her face close to the fabric, sniffing discreetly, in a hotel corridor.`) }),
  S(1, "me olió el hombro", "bi", "b_shoulder", { p: BI("Close view of the shoulder of a man's dark navy hotel uniform jacket, a woman's face with thin metal glasses leaning close to it.") }),
  S(1, "y me dijo una frase sobre mi toalla", "bi", "b_towelhook", { q: "towel hanging hook bathroom", p: BI(`Close view of ${TOWEL} on the white tiled wall of a small hotel staff bathroom, the towel slightly damp and heavy.`) }),
  S(1, "que todavía me da vergüenza repetir", "av", ""),
  // ── bañarse no alcanza
  S(2, "", "cl", "c_shower", { p: CLP(`He stands in ${HOUSE}, rubbing his freshly washed damp hair with a small towel, looking at the camera a little embarrassed.`) }),
  S(2, "Ése es el problema", "av", ""),
  S(2, "te puedes bañar dos veces al día", "bi", "b_showerhead", { q: "shower water running", p: BI(`Close view of water pouring from a chrome shower head in ${BATH}, drops in the air.`) }),
  S(2, "ponerte ropa limpia", "bi", "b_cleanshirt", { q: "folded clean shirts", p: BI("A man's hands taking a freshly ironed white cotton shirt from a neat stack on a light-wood shelf in a bright bedroom.") }),
  S(2, "y oler mal a las dos de la tarde", "bi", "b_office2pm", { q: "office worker afternoon", p: BI("A Latin American office at two in the afternoon: a man in a white shirt at his desk, a coworker beside him leaning slightly away from him with a polite face, a wall clock showing two o'clock.") }),
  S(2, "Y nadie te lo va a decir", "av", ""),
  // ── la promesa
  S(3, "las once reglas de higiene", "bi", "b_jpbath", { q: "japanese bathroom", p: BI("A Japanese home bathroom: a small stool and a wooden bucket next to a shower on the wall, a deep square bathtub with a lid, light-wood details, everything spotless.") }),
  S(3, "que en Japón son normales", "bi", "b_jpsento", { q: "japanese bathroom wooden bucket", p: BI("A traditional Japanese home bath with a wooden tub, a wooden bucket and a small stool, morning light from a frosted window.") }),
  S(3, "que nosotros rompemos todos los días", "bi", "b_messybath", { p: BI("A small Latin American bathroom in the morning: a damp towel crumpled on the toilet lid, a colorful mesh shower puff hanging dripping, bottles crowding the edge of the tub.") }),
  S(3, "sin saberlo", "bi", "b_rush", { q: "morning routine bathroom", p: BI("A Latin American man hurrying in a small bathroom in the morning, toothbrush in mouth, buttoning a shirt, a damp towel thrown on the sink.") }),
  S(3, "Casi ninguna cuesta dinero", "bi", "b_coins", { p: BI("A few coins on a light-wood bathroom shelf next to a plain bar of white soap and a neatly folded small hand towel.") , ov: { c: "ClChip", props: { text: "$0" } } }),
  S(3, "Y la número siete", "bi", "b_feet7", { q: "bare feet bathroom floor", p: BI("Close view of a man's bare feet on a white bath mat in a bright bathroom, wet toes.") , ov: { c: "ClChip", props: { text: "REGLA 7", alert: true } } }),
  S(3, "es la que casi todos rompemos", "bi", "b_toesmacro", { p: BI("Extreme close view of the wet gaps between the toes of a bare foot on a bathroom floor tile.") }),
  S(3, "Yo también la rompía", "cl", "c_guilty", { p: CLP(`He stands in ${HOUSE}, raising one hand in a guilty admission and smiling sideways at the camera.`) }),
  // ── credibilidad + el test
  S(4, "", "av", "", { ov: { c: "ClNameTag", props: { name: "Claudio", sub: "15 años de conserje en Tokio" } } }),
  S(4, "en las habitaciones", "bi", "b_hotelroom", { q: "japanese hotel room", p: BI(`A small, perfectly made room of ${HOTEL}: white bed, folded yukata on the pillow, a window with thin blinds, a housekeeping cart in the doorway.`) }),
  S(4, "donde se nota todo", "bi", "b_pillowcheck", { p: BI("Gloved hands of a hotel housekeeper lifting a white pillow from a bed to strip the pillowcase, morning light from the window.") }),
  S(4, "Y al final te dejo el test de cinco minutos", "bi", "b_sniffpillow", { p: BI(`A Latin American woman in her fifties in ${HOUSE} bending over her bed and smelling the center of a pillow, curious.`) }),
  S(4, "el test de cinco minutos", "bi", "b_timer5", { q: "kitchen timer", p: BI("A simple white kitchen timer set to five minutes on a light-wood table next to a folded towel and a pillow.") }),
  S(4, "para saber a qué huele tu casa", "bi", "b_brighthome", { q: "bright tidy living room", p: BI(`${HOUSE}: a living room in the morning, a window open, the curtain moving.`) }),
  S(4, "sin que nadie te lo tenga que decir", "av", ""),
  S(5, "al salir de la ducha", "bi", "b_showerdoor", { q: "shower door steam", p: BI(`A fogged glass shower door in ${BATH} sliding open, steam escaping into the room.`) }),
  S(5, "", "bi", "b_reachtowel", { q: "hand reaching towel", p: BI(`A wet hand reaching out from behind a shower curtain toward ${TOWEL} in ${BATH}.`) }),

  // ══ REGLA 1 · la toalla
  C(6, "", "ClRule", { n: 1, title: "La toalla", sub: "lo primero que tocas limpio" }),
  S(6, "Sato-san me hizo cambiar la toalla", "bi", "b_satotowel", { p: BI(`${SATO} in the bathroom of a hotel room, holding up a white towel by two corners and pointing at it, a man's arm in a red polo shirt reaching to take it.`) }),
  S(6, "tres veces", "bi", "b_threetowels", { p: BI("Three white hotel towels piled on a housekeeping cart in a hotel corridor, one of them visibly damp and darker.") }),
  C(6, "No estaba sucia", "ClSato", { img: SATOP, quote: "No está sucia. Está húmeda." }),
  S(7, "", "bi", "b_thicktowel", { q: "towel on hook", p: BI(`${TOWEL} in a small windowless Latin American bathroom lit by a ceiling bulb, the mirror still fogged.`) }),
  S(7, "y se usa siete veces", "bi", "b_sevendays", { p: BI("A paper calendar on a bathroom door with seven days crossed out in pen, a thick towel hanging on a hook below it.") }),
  S(8, "", "kf", "k_towelwet", { p: BI(`Close view of the inside fold of ${TOWEL}, a hand opening the fold to show the darker, still-damp fabric inside.`), d1: "the hand opens the folded towel", d2: "the inner fold shows dark damp fabric", sound: "a soft towel being unfolded in a small bathroom" }),
  C(8, "más de doce horas", "ClDryBars", { title: "Cuánto tarda en secarse", rows: [{ label: "Doblada en el gancho", h: 12, note: "nunca llega a secarse" }, { label: "Extendida y abierta", h: 2, good: true }] }),
  S(8, "Sales de la ducha limpio", "bi", "b_drybody", { q: "man drying with towel", p: BI("A man's back and shoulders seen from behind as he rubs himself dry with a gray terry towel in a small steamy bathroom, only shoulders visible.") }),
  S(9, "", "cl", "c_sniffdry", { p: CLP(`He stands in ${BATH} holding a dry gray towel up to his nose, sniffing it with a neutral face.`) }),
  S(9, "Ahora moja una punta", "kf", "k_wetcorner", { p: BI(`Close view of ${H} holding one corner of a gray towel under a running bathroom tap.`), d1: "the corner of the towel is held under the tap", d2: "the corner is soaked and dripping", sound: "a bathroom tap running onto a towel" }),
  S(9, "y vuelve a olerla", "cl", "c_sniffwet", { p: CLP(`He stands in ${BATH} holding the wet corner of a gray towel to his nose and pulls his face back with a grimace.`) }),
  S(9, "Ese olor agrio", "av", ""),
  S(10, "", "bi", "b_towelspread", { q: "towel drying rack", p: BI(`A gray towel hung fully spread open over a wide towel bar in ${BATH}, sunlight from the window on it.`) }),
  S(10, "Se cambia cada tres usos", "bi", "b_towelstack", { q: "folded towels shelf", p: BI("A neat stack of clean folded towels in light colors on a light-wood bathroom shelf, a small plant beside them.") }),
  S(10, "Una para la cara", "bi", "b_twotowels", { p: BI(`Two towels hanging side by side spread open in ${BATH}: a small hand towel and a larger bath towel.`) }),
  S(10, "Y la puerta del baño queda abierta", "bi", "b_dooropen", { p: BI(`The door of ${BATH} left wide open, daylight coming in from the hallway, a towel drying spread on the bar inside.`) }),
  C(10, "para que se seque", "ClNumbers", { rows: [["La toalla", "extendida, cambio cada 3 usos"], ["Cara y cuerpo", "una toalla para cada uno"], ["El baño", "puerta abierta al salir"]], page: 9 }),
  S(11, "", "kf", "k_soak", { p: BI("A white plastic basin in a laundry sink with gray towels soaking in steaming hot water."), d1: "towels soaking in steaming water", d2: "steam rises slowly from the basin", sound: "water and steam in a laundry sink" }),
  S(11, "y después al sol", "bi", "b_towelsun", { q: "towels drying sun clothesline", p: BI("Gray towels hanging on a clothesline on a sunny Latin American rooftop terrace, blue sky, water tanks in the background.") }),

  // ══ REGLA 2 · el orden
  C(12, "", "ClRule", { n: 2, title: "El orden", sub: "a la tina se entra limpio" }),
  S(12, "En el hotel había un baño japonés", "bi", "b_ofuro", { q: "japanese bath tub ofuro", p: BI(`The shared bath room of ${HOTEL}: a large square tub of hot water with steam, a row of low stools and wooden buckets with hand showers along the wall.`) }),
  S(12, "a la tina se entra limpio", "c", "ClSato", { props: { img: SATOP, quote: "A la tina se entra limpio." } }),
  S(12, "Primero te lavas sentado afuera", "bi", "b_stool", { q: "japanese bath stool bucket", p: BI("A small plastic bath stool and a wooden bucket in front of a hand shower on a tiled wall, a bar of soap on a little shelf, water on the floor.") }),
  S(12, "Y recién ahí, al agua caliente", "kf", "k_steam", { p: BI("Close view of the surface of a deep Japanese bathtub full of hot water, steam rising."), d1: "still hot water in the tub", d2: "steam drifts across the water", sound: "steam and quiet water in a bath" }),
  S(13, "Diez minutos parados", "bi", "b_longshower", { q: "shower running water", p: BI(`Water running down from a shower head in ${BATH}, the glass fogged.`) }),
  S(13, "y el pelo al final", "bi", "b_shampoohand", { q: "shampoo in hand", p: BI("Close view of a hand squeezing white shampoo from a bottle with a blank white label into the other palm over a bathroom sink.") }),
  S(13, "Y lo último que te cae por la espalda", "bi", "b_backfoam", { p: BI("White shampoo and conditioner foam sliding down the white tiles of a shower wall toward the drain, water running, a shampoo bottle with a blank label on the corner shelf.") }),
  S(13, "que se queda pegada a la piel todo el día", "av", ""),
  C(14, "", "ClDoDont", { yes: { label: "Pelo → cuerpo → espalda", img: I + "b_rinseback.jpg" }, no: { label: "Cuerpo → pelo al final", img: I + "b_backfoam.jpg" } }),
  S(14, "treinta segundos de agua sola", "bi", "b_rinseback", { p: BI("A man seen from behind in a shower, head tipped forward, clear water running down his back, no foam.") , ov: { c: "ClChip", props: { text: "30 s" } } }),
  S(15, "", "bi", "b_nightbath", { q: "bathroom at night", p: BI(`${BATH} at night, warm light, a folded pajama waiting on a stool by the door.`) }),
  S(15, "te llevas a la cama todo el día", "bi", "b_bedmorning", { q: "unmade bed sheets", p: BI("A double bed with wrinkled white sheets in the morning light, a pillow with a faint grayish mark where the head rests.") }),
  S(15, "el humo de la calle", "bi", "b_street", { q: "busy city street", p: BI("A busy Latin American avenue at midday with buses, exhaust and people walking on the sidewalk.") }),
  S(15, "Prueba bañarte de noche una semana", "cl", "c_sheets", { p: CLP(`He stands by a neatly made bed with fresh white sheets in ${HOUSE}, smoothing the sheet with one hand and nodding at the camera.`) }),

  // ══ REGLA 3 · con qué te frotas (mención 1)
  C(16, "", "ClRule", { n: 3, title: "Con qué te frotas", sub: "la esponja que nunca se seca" }),
  S(16, "En el vestuario del hotel", "bi", "b_lockers", { q: "staff locker room", p: BI("A small hotel staff locker room: gray metal lockers, a bench, a sink and a mirror, uniforms on hangers.") }),
  S(16, "su esponja de malla", "bi", "b_poof", { q: "shower puff", p: BI("A round colorful mesh shower puff hanging by its cord from a tap, dripping, in a tiled staff shower.") }),
  S(16, "Sato-san la levantó con dos dedos", "bi", "b_twofingers", { p: BI(`${SATO} holding a wet colorful mesh shower puff at arm's length between two fingers, her face neutral, in a staff locker room.`) }),
  S(16, "y la tiró a la basura", "kf", "k_bin", { p: BI("A small white trash bin under a sink in a staff locker room, a colorful mesh shower puff falling into it."), d1: "the puff is above the bin", d2: "the puff lands in the bin", sound: "a soft thud in a small plastic bin" }),
  S(17, "", "bi", "b_poofcorner", { p: BI(`A faded mesh shower puff hanging in the wettest corner of a shower in ${BATH}, water drops on the tiles around it.`) }),
  S(17, "atrapa agua, jabón y piel muerta", "bi", "b_poofmacro", { p: BI("Extreme close view of the folded netting of an old mesh shower puff, soap residue and water trapped between the folds.") }),
  S(17, "¿Te acuerdas de cuándo la compraste?", "cl", "c_poofq", { p: CLP(`He holds up an old faded mesh shower puff in ${BATH}, frowning at it with one eyebrow raised.`) }),
  S(18, "", "bi", "b_nylontowel", { q: "nylon washcloth", p: BI("A long, narrow white nylon Japanese body-washing towel hanging dry over a towel bar outside a shower, sunlight on it.") }),
  S(18, "que hace mucha espuma", "kf", "k_foam", { p: BI(`Close view of ${H} rubbing a long white nylon body towel with a bar of soap, thick white foam forming.`), d1: "the hands rub the nylon towel with soap", d2: "a thick white foam covers the towel", sound: "soap and foam being rubbed" }),
  S(18, "llega a toda la espalda", "bi", "b_backscrub", { p: BI("A man seen from behind scrubbing his upper back with a long white nylon body towel held by both ends over his shoulders, foam on his skin.") }),
  S(18, "un cepillo suave de mango largo", "bi", "b_brush", { q: "bath brush long handle", p: BI("A soft wooden bath brush with a long handle hanging on a hook beside a window in a bright bathroom.") }),
  // mención 1 · el Método pág. 9
  S(19, "", "av", ""),
  S(19, "En el Método te dejé anotado lo único que hace falta", "bi", "b_shoplist", { p: BI("A handwritten shopping list on a small notepad lying on a light-wood table next to a bar of soap and a folded hand towel.") , ov: { c: "ClChip", props: { text: "Método · pág. 9" } } }),
  S(19, "y casi siempre es algo que ya tienes", "bi", "b_drawer", { p: BI("An open bathroom drawer with a clean spoon, a bar of white soap and a few folded hand towels neatly arranged.") }),
  S(19, "En la tienda, pide así", "bi", "b_storecounter", { q: "pharmacy counter", p: BI("The counter of an ordinary neighborhood pharmacy: a small hand towel, a metal tongue scraper and a bar of neutral white soap with a blank label laid on the counter.") }),
  C(19, "necesito una toalla de mano chica", "ClCheck", { title: "Lo único que hay que comprar", label: "MÉTODO · PÁG. 9", items: ["Toalla de mano extra por persona", "Raspador de lengua (o una cuchara)", "Jabón neutro en barra", "Cepillo suave para la espalda"] }),
  S(20, "", "bi", "b_poofbin", { p: BI("A colorful mesh shower puff lying in a bathroom trash bin.") }),
  S(20, "colgados donde les dé el aire", "bi", "b_nylonwindow", { p: BI(`A white nylon body towel and a wooden bath brush hanging on hooks next to an open window in ${BATH}.`) }),
];
