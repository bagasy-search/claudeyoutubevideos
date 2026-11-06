// DIRECTOR A — cons6nb (las sábanas blancas que se pusieron grises): MINUTO 1 (el armario, grises, cloro → la lavandería del hotel →
// el mismo juego → 3 anzuelos) + CTA 1 (pág. 37) + llenas no sucias + el tubito + el cloro + Rosa 1995 + la prueba de la gota + lo que
// necesita + las reglas + la etiqueta + el paso 3 (párr. 0-25). Avatar = ventanas PAGADAS (_v3/cons6nb_avlock.json, AV_LOCK): acá no van
// AV(). Veo b01-b10 = Claudio (broll/cons6nb/bNN.mp4).
import { S, BI, BOTTLE } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const V = (p, at, name) => S(p, at, "cl", name, { p: "veo", veo: 1 });
export { BOTTLE };
export const G = "hands in blue rubber cleaning gloves";
export const GRAYS = "a dingy grayish off-white cotton bed sheet";
export const WHITES = "a bright clean white cotton bed sheet";
export const BUCKET = "a large white plastic bucket of hot water";
export const BEDROOM = "a modest home bedroom with a wooden bed and a window";
export const LAUND = "a hotel basement laundry room with big stainless steel industrial washing machines, long folding tables and wooden shelves of folded white sheets";
export const ROSA = "Rosa, a hotel laundry supervisor in her fifties with gray hair in a bun and a light-blue work smock";
export const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie, holding a small black notebook";
export const SODA = "a plain white box of baking soda with a blank label";
export const I = "img/cons6nb/";
export const SHOTS = [
  // ── 0:00 · el armario (avatar 0-3,1)
  B(0, "las estira sobre la cama", "b_stretch", `Two hands smoothing ${GRAYS} over a mattress on ${BEDROOM}, morning window light.`, { anim: "the hands smooth the sheet across the bed" }),
  B(0, "y no son blancas", "b_notwhite", `Close view of ${GRAYS} on a bed, its dull gray tone next to a bright white pillow.`),
  V(0, "Son grises", "b01"),
  B(0, "Apagadas", "b_dull", `Extreme close view of the woven surface of ${GRAYS}, dull and dingy, small pills of lint.`),
  B(0, "Como si tuvieran veinte años", "b_oldstack", `A stack of folded dingy gray cotton sheets on an old wardrobe shelf at home.`),
  B(0, "Y las lavó con cloro", "b_bleachjug", `A white plastic jug of chlorine bleach with a blank label standing on top of a home washing machine.`),
  B(0, "la semana pasada", "b_bleachpour", `Chlorine bleach with a blank label being poured into the drawer of a home washing machine.`, { anim: "the bleach pours into the drawer" }),
  // 13 · la lavandería del hotel
  ST(1, "Esto es lo que se usaba en la lavandería", "b_laundry", "hotel laundry room", `${LAUND}, warm overhead light, no people.`),
  ST(1, "sábanas blancas en cada cama", "b_hotelbed", "hotel bed white sheets", `A made hotel bed with crisp white sheets folded down, two white pillows, a soft lamp on.`),
  B(1, "en cada cama", "b_bedrow", `A row of hotel guest rooms seen through open doors from the corridor, a crisp white made bed in each one.`),
  B(1, "todos los días", "b_maidcart", `A hotel housekeeping cart stacked with folded white sheets parked in a carpeted corridor.`),
  B(1, "Y en las sábanas no se usaba cloro", "b_nobleach", `A jug of bleach with a blank label pushed to the back of a dusty storeroom shelf in a hotel basement.`),
  B(1, "no se usaba cloro", "b_bleachshelf", `A white bleach jug with a plain blank label pushed to the back of a high shelf in a hotel laundry room.`),
  V(1, "Se usaba este frasco marrón", "b02"),
  // 28 · el mismo juego
  B(2, "Mire esta sábana", "b_hold1", `Two hands holding up ${GRAYS} against a sunny window, its dull gray tone clear.`),
  B(2, "Y mire esta otra", "b_hold2", `Two hands holding up ${WHITES} against the same sunny window, bright and crisp.`),
  B(2, "y la otra no", "b_onlyone", `Two folded sheets on a table, one dingy gray and one bright white, a tag tied to the white one.`),
  C(2, "Hoy le enseño a hacerlo en su casa", "SbTwoSheets"),
  B(2, "en una tarde, sin cloro", "b_afternoon", `A bucket of soaking white sheets on a home laundry floor in warm afternoon light from a window.`),
  // 40 · tres cosas
  B(3, "Pero antes, tres cosas", "b_three", `${GRAYS} and ${WHITES} folded side by side on a wooden table, ${BOTTLE} between them.`),
  ST(3, "que tiene que saber", "b_closet", "linen closet folded sheets", `A hand opening a home linen closet full of folded sheets, morning light.`),
  ST(3, "Por qué sus sábanas se ponen grises", "b_washer", "washing machine white laundry", `A front-loading home washing machine running with white sheets tumbling in sudsy water behind the round glass door.`, { anim: "the sheets tumble behind the glass" }),
  B(3, "se ponen grises", "b_grayfold", `A folded dingy gray cotton bed sheet on top of a white washing machine, close view.`),
  ST(3, "aunque las lave bien", "b_powder", "laundry powder washing machine", `A scoop of laundry powder poured into the drawer of a home washing machine.`),
  B(3, "y no es por la mugre", "b_mugre", `Close view of the inside of a clean white bed sheet corner held up to the light, dull gray tone, no visible dirt.`),
  B(3, "la proporción exacta que usaba Rosa en la lavandería", "b_rosa", `${ROSA} standing by a long folding table in ${LAUND}, a measuring jug in her hand.`),
  B(3, "que usaba Rosa en la lavandería", "b_rosalaund", `${ROSA} pouring a measured amount from ${BOTTLE} into a big bucket in ${LAUND}.`),
  ST(3, "la que le devolvía el blanco a las sábanas de trescientas camas", "b_shelves300", "folded white sheets shelves", `Tall wooden shelves packed with hundreds of folded bright white sheets in a hotel linen room.`),
  B(3, "de trescientas camas", "b_hotelbeds", `A row of hotel guest rooms seen through open doors from the corridor, a crisp white made bed in each one.`),
  // 62 · CTA 1 (pág. 37)
  C(4, "los blancos grises y apagados", "TbBookTub", { page: I + "book_p37.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 37 }),
  C(4, "El link está en la primera línea", "TbBookTub", { page: I + "book_p37.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 37, skip: 96 }),
  // 74 · llenas, no sucias
  B(5, "Empecemos por lo que nadie le dice", "b_wardrobe", `An open home wardrobe with folded bed sheets on a shelf, a little daylight from the side.`),
  B(5, "Sus sábanas no están grises porque estén sucias", "b_freshfold", `${GRAYS} just out of the washer, folded and smelling clean, on top of a laundry basket.`),
  // 82 · el tubito
  C(6, "Y cada vez que usted duerme", "SbFiberTube"),
  ST(6, "Cada vez que lava, queda un poquito de jabón", "b_detergent", "liquid detergent pouring", `A plastic measuring cap overflowing with blue liquid laundry detergent over the open drawer of a washing machine.`, { anim: "the detergent drips into the drawer" }),
  B(6, "Y si su agua es dura", "b_hardtap", `White chalky crust around a chrome kitchen tap, water running from it.`),
  ST(6, "lo pega a la fibra", "b_fibermacro", "cotton fabric macro", `Extreme macro view of cotton threads in a woven sheet, tiny dull specks stuck between the fibers.`),
  // 99 · capa sobre capa
  B(7, "Y esa capa es la que se ve gris", "b_grayedge", `The hem of a grayish cotton sheet next to a brand new white hem, side by side on a table, close view.`),
  ST(7, "porque atrapa la mugre del agua", "b_grayrinse", "washing machine drum water", `Gray cloudy rinse water swirling in the round glass door of a front-loading washing machine.`, { anim: "the gray water swirls" }),
  // 110 · el cloro
  C(8, "El cloro blanquea por arriba", "SbBleachThin"),
  B(8, "se rompen en el medio", "b_tear", `A worn white cotton bed sheet with a thin torn hole in the middle, held up against a window.`),
  B(8, "y con los meses se ponen amarillas", "b_yellow", `An old cotton bed sheet with yellowish patches folded on a shelf, close view.`),
  B(8, "una sábana lavada con cloro duraba la mitad", "b_ragbin", `Old thin torn white sheets cut into cleaning rags in a laundry bin in a hotel basement.`),
  // 130 · Rosa, 1995
  B(9, "Le cuento", "b_photo95", `An old faded printed photograph of a hotel laundry room crew in the 1990s pinned to a corkboard.`),
  B(9, "En mil novecientos noventa y cinco el", "b_drums", `Several big plastic drums of laundry detergent with blank labels delivered on a pallet in a hotel basement loading area.`),
  B(9, "con nuestro jabón, póngale el doble", "b_salesman", `A salesman in a short-sleeved shirt pouring a big scoop of laundry powder into an industrial washer drawer while ${MANAGER} watches.`),
  // 145 · grises
  B(10, "A los tres meses", "b_graypile", `A long folding table in ${LAUND} covered with piles of dingy gray sheets.`),
  C(10, "Los huéspedes se quejaban", "ClNotebook", { title: "Lavandería · 1995", rows: [{ k: "Queja", v: "«grises»" }, { k: "Causa", v: "doble jabón" }, { k: "Orden", v: "300 juegos nuevos" }] }),
  B(10, "Trescientos juegos", "b_cart300", `Laundry carts piled high with dingy gray bed sheets lined up in a hotel basement corridor.`),
  // 159 · Rosa pide una semana
  B(11, "le pidió una semana", "b_rosamgr", `${ROSA} talking to ${MANAGER} beside an industrial washing machine in ${LAUND}.`),
  B(11, "Bajó la mitad", "b_halfscoop", `A half-full scoop of laundry powder held over an industrial washer drawer in a hotel laundry.`),
  B(11, "puso las sábanas en remojo con el frasco marrón", "b_soaktubs", `Several deep laundry tubs of water with white sheets soaking, ${BOTTLE} on the tub rim, in ${LAUND}.`),
  B(11, "No se tiró ni uno", "b_whitecart", `A laundry cart piled with bright white folded sheets in a hotel basement corridor.`),
  // 174 · la prueba
  C(12, "Es una gota de agua caliente", "SbFoamDrop"),
  B(13, "Agarre una punta de la sábana", "b_corner", `A hand holding up one corner of ${GRAYS}, dry, next to a kitchen sink.`),
  B(13, "Sin nada", "b_nosoap", `A bar of soap set aside on the edge of a sink, unused, a dry sheet corner beside it.`),
  // 192 · si hace espuma
  V(14, "Si le hace espuma", "b03"),
  B(14, "Ese jabón es el que se pone gris", "b_foammacro", `Extreme close view of white soap foam on a wet corner of a cotton sheet between two fingers.`),
  ST(14, "en casi todas las casas", "b_homes", "laundry hanging street", `A row of small houses on a quiet street with laundry hanging on lines in the backyards.`),
  // 203 · si no hace espuma
  B(15, "el problema es más la grasa y el agua dura", "b_wetcorner", `A wet corner of a grayish sheet rubbed between two hands with no foam at all, over a sink.`),
  B(15, "El remojo sirve igual", "b_bucketready", `${BUCKET} on a laundry room floor, steam rising, ready.`, { anim: "steam rises from the bucket" }),
  // 212 · lo que necesita
  B(16, "Lo que necesita para el remojo", "b_table", `${BOTTLE}, ${SODA}, a measuring jug and a wooden paddle laid out on a laundry room counter.`),
  C(17, "El frasco marrón, agua oxigenada al tres por ciento", "SbKit"),
  B(17, "Una jarra medidora, una paleta de madera", "b_jugpaddle", `A clear plastic measuring jug with cup markings and a wooden paddle on a laundry counter.`),
  ST(17, "y guantes", "b_gloves", "rubber gloves", `A pair of blue rubber cleaning gloves on the edge of a laundry sink.`),
  // 232 · las reglas
  B(18, "Y las reglas, antes que nada", "b_labelwhite", `The sewn-in care label of a white cotton bed sheet, close view, the label text not readable.`),
  B(18, "El agua oxigenada es sólo para telas blancas", "b_onlywhite", `A pile of only white cotton sheets and white towels in a laundry basket, colored clothes in a separate basket beside it.`),
  B(18, "Y nunca en colores sin probar primero en un dobladillo", "b_hem", `A fingertip pointing at the inside hem of a light blue cotton sheet, close view.`),
  B(18, "Y nunca, nunca, mezclada con cloro", "b_apart", `A jug of bleach with a blank label on a high shelf on one side of a laundry room, ${BOTTLE} on a low shelf on the far other side.`),
  B(18, "Si usó cloro en ese balde, lávelo bien antes", "b_rinsebucket", `An empty white plastic bucket being rinsed under a running laundry tap.`, { anim: "water rinses the bucket" }),
  // 254 · la etiqueta
  B(19, "Mire la etiqueta de la sábana", "b_tag", `Fingers turning over the care label of a white bed sheet, close view.`),
  C(19, "Si dice cuarenta, use cuarenta", "SbLabelTemp"),
  // 266 · el paso tres
  B(20, "Ahora sí, el paso número tres", "b_step3", `${BUCKET} on a tiled laundry floor beside ${BOTTLE} and ${SODA}, steam rising.`),
  ST(21, "Llene el balde con diez litros", "b_fill", "filling bucket water", `Hot water from a laundry tap filling a large white plastic bucket, steam rising.`, { anim: "the water fills the bucket, steam rises" }),
  C(21, "Si no sabe cuánto es", "SbRatio"),
  // 288 · la proporción
  V(22, "Por cada diez litros, dos tazas", "b04"),
  V(22, "Revuelva con la paleta", "b05"),
  // 300 · por qué el bicarbonato
  B(23, "Por qué el bicarbonato", "b_sodaspoon", `A half cup of white baking soda powder in a measuring cup over a bucket of hot water.`),
  B(23, "Porque ablanda el agua, le saca la piedra", "b_dissolve", `White baking soda powder dissolving and clouding in hot water in a bucket, seen from above.`, { anim: "the powder swirls and dissolves" }),
  B(23, "Solos, cada uno hace la mitad", "b_pair", `${BOTTLE} and ${SODA} side by side on a laundry counter, a wooden paddle across them.`),
  B(23, "Juntos, hacen lo que hacía la lavandería", "b_tubsrow", `A row of deep steel soaking tubs in ${LAUND}, white sheets under water.`),
  // 315 · meta las sábanas
  V(24, "Meta las sábanas", "b06"),
  B(24, "que queden todas tapadas por el agua", "b_covered", `A white sheet fully under the water in a large bucket, seen from above, a wooden paddle holding it down.`),
  B(24, "siempre con la misma proporción", "b_twobuckets", `Two large white plastic buckets of hot water side by side on a laundry floor, a measuring jug between them.`),
  // 330 · dos horas
  ST(25, "Y las deja dos horas", "b_clock", "wall clock", `A plain round wall clock above a laundry sink, a bucket below it.`),
  B(25, "Cada media hora, las da vuelta con la paleta", "b_turn", `${G} turning a soaking white sheet with a wooden paddle in a bucket of water.`, { anim: "the paddle turns the sheet in the water" }),
  ST(25, "Va a ver unas burbujitas chiquitas", "b_bubbles", "bubbles water surface", `Tiny bubbles rising on the surface of water over a soaking white sheet in a bucket, close view.`, { anim: "tiny bubbles rise" }),
];
