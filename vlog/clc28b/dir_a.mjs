// DIRECTOR A — clc28b (moho negro en la PARED detrás del ropero): gancho (el ropero, el cloro que blanquea y vuelve, el hotel, los
// 10 puntos, el 9) + CTA 1 (pág. 24 real, arreglo 16) + punto 1 (la 214, el pedacito de revoque, el poro) + punto 2 (protección)
// + punto 3 (vinagre, una hora) — párrafos 0-17. Avatar = ventanas PAGADAS (AV_LOCK). Veo v01-v10 (broll/clc28b/vNN.mp4).
import { S, BI } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const V = (p, at, name) => S(p, at, "cl", name, { p: "veo", veo: 1 });
export const G = "a hand in a long yellow rubber glove";
export const ROOM = "a modest home bedroom in winter with cream painted walls, a tall old dark wooden wardrobe and a window with fogged glass";
export const HOTEL = "a small older hotel guest room in winter with cream walls, a single bed with a beige blanket and a dark wooden wardrobe";
export const MOLD = "a cream painted bedroom wall covered in small black mold spots rising from the baseboard";
export const ROSA = "Rosa, a hotel housekeeper in her fifties with dark hair in a bun and a light-blue housekeeping uniform";
export const CHIEF = "an old hotel maintenance chief in his late sixties with white hair, a gray work coat and reading glasses on a cord";
export const VINEGAR = "a big clear plastic jug of white vinegar with a plain blank label";
export const SPRAY = "a clear plastic spray bottle with a plain blank label";
export const H2O2 = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const I = "img/clc28b/";
export const CTA = { page: I + "book_p24.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 24 };
export const SHOTS = [
  // ── 0:00 gancho · el ropero (avatar 0-4,2)
  V(0, "y se queda helado", "v01"),
  C(0, "Una mancha que empieza en el zócalo", "MwWallReveal", { stage: 1 }),
  B(0, "Y la ropa del ropero", "b_sweatersmell", `A woman in a gray cardigan holding a folded wool sweater from an open dark wooden wardrobe close to her nose, frowning at the musty smell, other clothes hanging behind.`),
  // 21,4 · el cloro
  B(1, "Entonces hace lo que hace todo el mundo", "b_bleachgrab", `${G} lifting a white plastic bleach jug with a plain blank label out of a cabinet under a kitchen sink, other cleaning bottles around it.`),
  B(1, "lo pasa con una esponja", "b_bleachscrub", `${G} scrubbing small black mold spots on ${ROOM.replace("a modest home bedroom", "the wall of a modest home bedroom")} with a wet yellow sponge, bleach drips running down the paint.`),
  C(1, "y la mancha se pone blanca", "MwBleachCycle"),
  // 38,7 · treinta años, trescientas habitaciones
  ST(2, "detrás de los roperos", "s_hotelhall", "hotel corridor doors", `A long carpeted hotel corridor with numbered wooden doors and a housekeeping cart parked by one of them.`),
  B(2, "en los rincones", "b_corner", `The upper corner of ${HOTEL.replace("a small older hotel guest room", "a small older hotel guest room")} where two walls meet the ceiling, a dark cloud of black mold spots spreading from the corner, a curtain rod just below.`),
  B(2, "debajo de las ventanas", "b_undersill", `Black mold spots on the cream wall just under a white window sill in a hotel room, condensation droplets on the glass above and a wet streak running down to the mold.`),
  B(2, "mi enemigo número uno", "b_cartmold", `A hotel maintenance cart with a spray bottle, a stack of folded rags, rubber gloves and a ring of brass master keys, parked by a wardrobe pulled away from a wall with black mold spots.`),
  // 53,9 · diez puntos, el nueve
  C(3, "Son diez puntos", "MwTenTags", { hi: 9 }),
  B(3, "que hace que el moho no vuelva más", "b_gapteaser", `A dark wooden wardrobe standing a few centimeters away from a clean dry cream wall, a narrow strip of shadow behind it, ${G} resting on its side edge.`),
  // 68,7 · CTA 1 (pág. 24 real)
  C(4, "página veinticuatro", "MwBookBed", CTA),
  // 86,3 · la 214
  ST(6, "Era mi primer invierno en el hotel", "s_hotelsnow", "hotel building snow winter", `An old hotel facade in winter with snow on the window ledges and warm lights inside.`),
  B(6, "tenía moho detrás del ropero", "b_214", `A dark wooden wardrobe pulled away from the wall in a small hotel room, the wall behind it covered in black mold spots from the baseboard up, a folded blanket on the bed.`),
  B(6, "y yo, muy prolijo", "b_youngbleach", `${G} wiping a wall with black mold spots with a rag soaked in bleach, a bleach jug with a plain blank label on the floor, the spots turning pale.`),
  B(6, "Quedó blanquita", "b_paled", `A pale, bleached patch on a cream bedroom wall where black mold was, the paint a little streaky and still wet, a wardrobe edge at the side of the frame.`),
  // 103 · Rosa, volvió · el jefe y el cutter
  B(6, "Claudio, volvió", "b_rosa", `${ROSA} standing in a hotel room doorway pointing at a wall behind a wardrobe where black mold spots came back, looking annoyed.`),
  B(6, "Volvió otra vez", "b_moldback", `Gray-black mold spots coming back through a pale bleached patch on a cream hotel room wall, close view.`),
  B(6, "Y el jefe de mantenimiento", "b_chief", `${CHIEF} crouching by a hotel room wall with black mold spots, opening a small utility knife, a hotel room behind him.`),
  V(6, "un cutter y sacó un pedacito", "v03"),
  // 119,5 · el corte: blanco por fuera, la línea negra adentro
  C(7, "Por fuera, blanco", "MwPlasterSlice", { stage: 1 }),
  B(7, "metida medio centímetro adentro", "b_piece", `A small piece of wall plaster the size of a fingernail held on a fingertip of ${G}, seen from the side: white paint on top, gray plaster below and a thin black line inside.`),
  // 135,2 · poroso como una esponja
  B(8, "La pared, la pintura, el yeso, el revoque", "b_chipedge", `The broken edge of a cream bedroom wall at a corner where the plaster chipped, showing the layers: paint, white skim coat and rough gray plaster, close view.`),
  ST(8, "son como una esponja", "s_sponge", "sponge absorbing water", `A dry sponge soaking up spilled water on a kitchen counter.`),
  C(8, "El moho no vive arriba", "MwRootDrink"),
  // 151,2 · le dio de comer
  B(8, "y el agua que deja se mete", "b_wetpaint", `Drops of watery liquid soaking into a cream painted wall right above a pale patch, the paint darkening where it gets in, close view.`),
  B(8, "Usted le borró la cara al moho", "b_ghost", `A faint gray shadow of mold still visible under a bleached white patch on a cream bedroom wall, ${G} pointing at it.`),
  ST(9, "En el baño, sobre el azulejo", "s_tiles", "cleaning bathroom tiles", `A gloved hand wiping glossy white bathroom tiles with a cloth.`),
  // 167,6 · punto 2
  B(9, "en el dormitorio, detrás de un mueble", "b_behindchest", `The narrow dark gap between a chest of drawers and a bedroom wall, black mold spots on the wall inside the gap, a flashlight beam reaching in.`),
  C(10, "Punto dos", "ClChapter", { n: 2, title: "Cómo protegerse", label: "PUNTO" }),
  ST(11, "el moho suelta esporas", "s_dust", "dust particles light", `Tiny dust particles floating in a beam of window light inside a room.`),
  // 183 · el equipo
  B(11, "una mascarilla buena", "b_n95", `Two hands holding a white N95 respirator mask with two elastic headbands over a bedroom bed, a pair of long yellow rubber gloves next to it.`),
  C(11, "de las que se ajustan a la cara", "MwGearHook"),
  B(11, "Guantes de goma, de los largos", "b_longgloves", `A man pulling a long yellow rubber glove up over his forearm next to a bedroom wardrobe, a spray bottle on the floor.`),
  // 200,1 · la ventana y quién no está
  ST(12, "y una hora después", "s_windowopen", "open window curtain wind", `A bedroom window opened wide, a white curtain moving in the wind.`),
  B(12, "si en esa casa hay alguien con asma", "b_inhaler", `A blue asthma inhaler and a glass of water on a wooden nightstand next to a bed, a woman's hand reaching for it.`),
  B(12, "que no esté en esa habitación", "b_doorclosed", `A closed bedroom door seen from the hallway, a rolled towel pushed against the gap at the bottom, a spray bottle on a chair by the door.`),
  // 215,7 · punto 3: el vinagre
  B(14, "del común, del de cocina", "b_vinegarjug", `${VINEGAR} on a home kitchen counter next to a cutting board with an onion and a salt shaker, a hand turning the cap.`),
  B(14, "Puro, sin agua", "b_pourspray", `${G} pouring white vinegar from a big jug through a small plastic funnel into ${SPRAY} on a kitchen counter, a few drops spilling.`),
  V(14, "En un atomizador", "v04"),
  C(14, "Y lo rocía sobre la mancha", "MwSprayHalo"),
  // 234,1 · una hora
  B(15, "Y ahora el secreto", "b_wetsheen", `A wall with black mold spots wet and shiny all over with sprayed vinegar, drops running down, ${SPRAY} held at the edge of the frame.`),
  C(15, "Lo deja actuar una hora", "MwHourDoor"),
  ST(15, "El vinagre es un ácido suave", "s_vinegarpour", "pouring vinegar", `Clear vinegar being poured from a bottle into a glass measuring cup.`),
  // 253,1 · el hotel: puerta cerrada, ventana abierta · a la hora, frotar
  B(15, "con la ventana abierta", "b_hotelwin", `A small hotel room with the window wide open and a wardrobe pulled away from a wet sprayed wall, ${SPRAY} left on a wooden chair, the bed unmade.`),
  ST(15, "y nos íbamos a hacer otra cosa", "s_cart", "housekeeping cart corridor", `A housekeeping cart being pushed down a hotel corridor.`),
  B(16, "con un cepillo de cerdas suaves", "b_softbrush", `${G} gently brushing a wet wall with dark mold spots using a soft-bristle hand brush, gray foam on the bristles.`),
  V(16, "o una esponja por el lado amarillo", "v05"),
  // 268,9 · la sombra, el olor
  B(16, "Si quedó la sombra", "b_grayshadow", `A faint gray shadow left on a clean cream bedroom wall after scrubbing, a damp cloth hanging over a chair back nearby.`),
  ST(17, "El olor a vinagre se va", "s_curtain", "curtain breeze window", `A light curtain blowing gently at an open window on a cold bright morning.`),
  B(17, "Huele a ensalada", "b_salad", `A bowl of green salad with a vinegar dressing on a kitchen table, a hand holding a bottle of white vinegar above it.`),
  B(17, "Y el moho no vuelve", "b_cleancorner", `The cream wall behind a wardrobe now dry and even in color, a hand with a long yellow rubber glove brushing the baseboard, a rolled rag on the floor.`),
];
