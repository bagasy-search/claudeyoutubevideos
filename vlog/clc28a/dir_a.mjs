// DIRECTOR A — clc28a (ÓXIDO en el inodoro): gancho · CTA 1 (pág. 10 real) · punto 1 (hierro, prueba del vaso) · punto 2 (lavandina, Don Elías, nunca mezclar) · punto 3 (bajar el agua) — párrafos 0-15.
import { S, BI } from "../claudio/lib.mjs";
export const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const B = (p, at, name, scene, o = {}) => S(p, at, "bi", name, { p: BI(scene), ...o });
export const ST = (p, at, name, q, scene, o = {}) => S(p, at, "bi", name, { q, p: BI(scene), ...o });
export const V = (p, at, name) => S(p, at, "cl", name, { p: "veo", veo: 1 });
export const G = "a hand in a long yellow rubber glove";
export const WC = "an ordinary white ceramic toilet in an old hotel bathroom with white wall tiles";
export const BOWL = "the inside of a white ceramic toilet bowl seen from above";
export const RUSTY = "orange-brown rust streaks running down from under the rim";
export const BLEACH = "a white plastic bleach jug with a plain blank label";
export const VINEGAR = "a clear plastic bottle of white vinegar with a plain blank label";
export const STONE = "a gray rectangular pumice stone";
export const I = "img/clc28a/";
export const CTA = { page: I + "book_p10.png", cover: I + "book_cover.png", qr: I + "qr.png", pageNo: 10 };
const CH = (p, at, n, title, o = {}) => C(p, at, "ClChapter", { n, title, label: "PUNTO", ...o });
export { CH };
export const SHOTS = [
  B(0, "le echa producto", "b_cleaner", `${G} squeezing thick blue toilet cleaner from a bottle with a plain blank label under the rim of ${WC}.`),
  B(0, "descarga", "b_flushbtn", `A hand pressing the chrome flush button on top of the tank of ${WC}, water starting to swirl.`),
  C(0, "Y esa mancha anaranjada", "OxRimStain"),
  B(0, "Y la línea roja en el fondo", "b_redline", `${BOWL}, a thin reddish-orange ring exactly at the waterline at the bottom of the bowl.`),
  B(1, "Un buen chorro", "b_bleachpour", `${BLEACH} tipped over ${WC}, a thick stream of bleach falling under the rim onto ${RUSTY}.`),
  C(1, "la deja toda la noche", "OxBleachNight"),
  V(2, "Yo trabajé treinta años", "v01"),
  B(2, "Agua con hierro", "b_wellwater", `A chrome bathroom tap running slightly orange-tinted water into a white ceramic sink, the old sink stained around the drain.`),
  B(2, "Cientos de inodoros", "b_rowdoors", `A long old hotel corridor with many numbered bathroom doors open and a housekeeping cart, white toilets visible through two doors.`),
  B(2, "con las cantidades exactas", "b_measure", `Measuring spoons, a glass measuring cup and a small jar of white powder lined up on a white bathroom counter next to folded towels.`),
  B(2, "si le echa lavandina", "b_bleachhold", `${G} holding ${BLEACH} in front of ${WC} with ${RUSTY}, about to open the cap.`),
  C(3, "el de la piedra", "OxTenHoles", { hi: 9 }),
  B(3, "raya la porcelana", "b_scratch", `Close view of fine gray scratches on white toilet porcelain next to a dry worn pumice stone.`),
  B(3, "y si se hace bien", "b_whitebowl", `${BOWL}, spotless and bright white, clear water, no stains at all, under the rim shining.`),
  C(4, "armé con mis treinta", "OxBookTank", CTA),
  B(4, "Una visita de limpieza", "b_invoice", `A handwritten paper invoice from a cleaning service on a white bathroom counter next to a stack of bills and a pen, no readable words.`),
  CH(5, "Por qué sale esa mancha", 1, "De dónde viene la mancha"),
  B(5, "la va a limpiar mil veces", "b_scrubagain", `${G} scrubbing under the rim of ${WC} with a plastic toilet brush, ${RUSTY}, foam dripping.`),
  B(6, "La mancha roja o anaranjada", "b_macrorust", `Very close view of ${RUSTY} on white porcelain, little drip tracks, crusty orange edges, a wet shine.`),
  B(6, "el agua de algunas cañerías", "b_oldpipes", `Old corroded iron water pipes with rusty joints running along a basement wall, a small rust stain under one elbow.`),
  B(6, "el agua de un tanque", "b_rooftank", `An old concrete water reserve tank on a flat roof with rusty pipes coming out of it, a clear sky behind.`),
  C(6, "Ese hierro viaja disuelto", "OxIronPipe"),
  B(6, "el hierro se junta", "b_edge", `The waterline inside a white toilet bowl with an orange film forming just above the still water, seen very close.`),
  B(6, "Gota a gota", "b_drop", `A single water drop running down a thin orange streak on white porcelain, close view.`),
  B(7, "Hay una prueba", "b_emptyglass", `An empty clear drinking glass on a kitchen counter next to a chrome tap, morning light from a window.`),
  B(7, "Llene un vaso", "b_fillglass", `A hand filling a clear drinking glass with water from a chrome kitchen tap.`),
  C(7, "déjelo en un lugar quieto", "OxGlassWindow"),
  B(7, "o tiene un polvito", "b_sediment", `A clear glass of slightly yellow water on a windowsill, a thin layer of fine orange sediment settled at the bottom.`),
  B(8, "Si el agua del vaso", "b_clearglass", `A clear glass full of perfectly clean water on a windowsill, sunlight passing through it.`),
  C(8, "hay que buscar en otro lado", "OxWhereElse"),
  B(8, "A eso vamos", "b_seatbolt", `The back of a white toilet seat with a rusty metal bolt, a small orange stain below it on the porcelain.`),
  CH(9, "no se olvide nunca", 2, "La lavandina", { alert: true }),
  B(10, "para desinfectar", "b_sinkwipe", `${G} wiping a white bathroom sink with a cloth, ${BLEACH} on the counter beside it.`),
  B(10, "Pero con el hierro", "b_orange", `A bright orange stain under the rim of a white toilet, very close, the porcelain around it clean.`),
  C(10, "La lavandina oxida más", "OxFixedStain"),
  B(10, "Por eso cuando usted", "b_bleachon", `Clear bleach running over an orange stain inside a white toilet bowl, the liquid pooling near the waterline.`),
  B(10, "a la mañana está marrón", "b_brown", `A dark brown stain under the rim of a white toilet in early morning light, darker and crusted.`),
  B(11, "Yo eso lo aprendí mal", "b_oldphoto", `A row of worn hotel staff lockers in a back corridor, an old navy work jacket hanging from one open door.`),
  ST(11, "Mi primer verano", "s_hotelsummer", "old hotel building summer", `An old hotel facade on a bright summer day with open shutters.`),
  B(11, "eché lavandina a todos", "b_bleachrow", `${G} pouring bleach into a white toilet in a hotel bathroom, a second jug with a plain blank label waiting on the floor by a housekeeping cart.`),
  B(11, "Don Elías", "b_elias", `Don Elías, an old hotel floor supervisor in his sixties with white hair and a gray work coat, standing in a tiled hotel bathroom doorway with his arms crossed and a stern face.`),
  B(11, "me llevó del brazo", "b_eliasarm", `An old hand in a gray coat sleeve gripping the forearm of a young worker in a navy jacket, seen from behind, walking down a hotel corridor.`),
  B(11, "Antes eran naranjas", "b_browntwo", `The same old hotel floor supervisor pointing with one finger at a dark brown stain inside a white toilet, only his arm and gray sleeve visible.`),
  B(11, "Ahora vas a tener", "b_scrubhard", `Two gloved hands scrubbing hard inside a white toilet with a brush in a hotel bathroom, a bucket beside the toilet.`),
  B(12, "muy importante", "b_stopjug", `${BLEACH} set on a white tiled floor away from a toilet, a yellow rubber glove lying next to it.`),
  B(12, "descargue varias veces", "b_flushagain", `Clear water rushing and swirling down inside a white toilet bowl during a flush, seen from above.`),
  ST(12, "espere hasta el otro día", "s_calendarwall", "wall calendar flip page", `A paper wall calendar with a hand turning the page to the next day.`),
  B(12, "antes de usar cualquiera", "b_products", `A jar of white powder, ${VINEGAR}, a brown bottle with a plain blank label and a lemon lined up on a shelf in a bathroom.`),
  C(12, "mezcla con vinagre", "OxNeverMix"),
  B(12, "Nunca en el mismo balde", "b_bucket", `An empty blue plastic bucket on a white tiled bathroom floor with a pair of yellow rubber gloves draped over its edge.`),
  CH(13, "Bajar el agua", 3, "Bajar el agua de la taza"),
  B(13, "Este paso parece", "b_lowglass", `An old plastic cup resting on the rim of a white toilet whose bowl is half empty.`),
  B(13, "y es el que hace", "b_lowered", `${BOWL} with almost no water left, ${RUSTY} now fully exposed and dry.`),
  B(14, "La mancha está justo", "b_atline", `A rust-colored line exactly at the water level inside a full white toilet bowl, close view.`),
  C(14, "no hace nada", "OxDiluted"),
  V(14, "cierre la llave", "v02"),
  C(14, "Descargue una vez", "OxShutOff"),
  B(14, "con un balde chico", "b_smallbucket", `${G} scooping the last water out of a white toilet bowl with a small plastic bucket.`),
  B(14, "hasta que la mancha quede", "b_stainabove", `${BOWL}, only a little water at the very bottom and the orange stain sitting well above it.`),
  B(15, "Guantes de goma", "b_gloves", `A man's forearm pulling on a long yellow rubber glove beside a white toilet in a hotel bathroom.`),
  B(15, "Ventana abierta", "b_window", `A small frosted bathroom window pushed wide open onto white wall tiles, bright daylight coming in.`),
  ST(15, "o el extractor", "s_fan", "bathroom exhaust fan ceiling", `A white exhaust fan on a bathroom ceiling spinning.`),
  B(15, "Y con eso ya tiene", "b_dryready", `A white toilet with the bowl lowered and rust streaks dry and exposed, a brush and gloves resting on the closed tank.`),
];
