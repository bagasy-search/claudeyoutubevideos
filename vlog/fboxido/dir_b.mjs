// DIRECTOR B — fboxido: POR QUÉ SE OXIDA DE NUEVO (metal desnudo + ácido + agua, la llave a la mañana, bicarbonato/calor/aceite) ·
// POR QUÉ GEL (el vinagre se escurre, el engrudo lo deja quieto, la sal, el film) · LOS 5 ERRORES · LO DEL VECINO (las dejó en la
// pileta → pelusa naranja → el final juntos) · LA PRUEBA (galpón húmedo vs lija, servilleta, gotas) · CTA 2 (párrafos 31-61).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { SHED, PLIERS, RUSTYP, CLEANP, GEL, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fboxido/";
export const SHOTS = [
  // ── por qué vuelve
  C(31, "", "ClChapter", { n: 3, title: "Por qué se oxida de nuevo", sub: "donde corta el video viral" }),
  S(31, "untan, esperan, cepillan", "bi", "b_viralshiny", { p: BI(`A pair of shiny gray pliers held up dripping wet in front of a shed window.`) }),
  S(31, "Ahí cortan", "bi", "st_phonevideo", { q: "watching video on phone", p: BI(`Hands holding a phone watching a video.`) }),
  S(32, "", "bi", "b_bare", { q: "steel metal surface", p: BI(`Extreme close view of bare freshly cleaned steel, matte gray with tiny pores.`) }),
  S(33, "", "bi", "b_wetpores", { p: BI(`Extreme macro of wet bare steel with tiny drops of liquid sitting in its pores.`) }),
  S(33, "Es la receta perfecta para el óxido", "bi", "st_rustwater", { q: "rust water metal", p: BI(`Rust forming on wet metal.`) }),
  S(34, "", "av", ""),
  S(34, "la dejé en la mesada", "bi", "b_counterwrench", { p: BI(`A freshly cleaned wet steel wrench lying on a kitchen counter at night.`) }),
  S(34, "ya tenía una pelusa naranja", "bi", "b_morningrust", { p: BI(`The same wrench in morning light covered in a thin orange rust fuzz.`), ov: { c: "ClStampOv", props: { text: "EN UNA NOCHE" } } }),
  S(35, "", "bi", "b_sodabath", { p: BI(`Tools resting in a bucket of water clouded with baking soda.`) }),
  S(35, "El calor saca el agua de los poros", "bi", "b_heater", { q: "space heater", p: BI(`Clean tools drying on a rack above a small heater.`) }),
  S(35, "Y el aceite le pone una capa finita", "bi", "b_oilsheen", { p: BI(`Extreme close view of a thin sheen of oil on gray steel, a water drop beading on it.`) }),
  S(36, "", "c", "ClDoDont", { props: { yes: { label: "Seca y aceitada", img: I + "b_oilsheen.jpg" }, no: { label: "Mojada en la mesada", img: I + "b_morningrust.jpg" } } }),
  S(36, "Lo mismo que con la grieta", "c", "ClVideoRef", { props: { thumb: I + "th_prev.jpg", title: "Silicona + cemento: la grieta" } }),
  // ── por qué gel
  C(37, "", "ClChapter", { n: 4, title: "Por qué gel y no vinagre solo", sub: "que se quede quieto" }),
  S(38, "", "bi", "b_vinegarrun", { p: BI(`Plain vinegar poured over a rusty saw blade running straight off onto the floor.`), anim: "the vinegar runs off" }),
  S(38, "una pinza o un serrucho no entran en ningún frasco", "bi", "b_jar", { p: BI(`A rusty hand saw next to a small glass jar of vinegar, far too big to fit in it.`) }),
  S(39, "", "bi", "b_stays", { p: BI(`A rusty wrench standing upright with a thick layer of beige paste staying put on it.`) }),
  S(39, "aunque la pieza esté parada", "bi", "b_sawpaste", { p: BI(`A hand saw hanging vertically on a wall, its blade coated in thick beige paste.`) }),
  S(40, "", "bi", "b_salt", { q: "salt spoon", p: BI(`Two tablespoons of fine salt poured into a pot of vinegar and flour.`) }),
  S(41, "", "bi", "b_crusty", { p: BI(`Dry cracked flour paste flaking off a rusty tool that was left unwrapped.`) }),
  S(41, "sigue húmedo toda la noche", "bi", "b_moist", { p: BI(`Cling film peeled back from a tool showing the beige paste still wet and glossy underneath.`) }),
  // ── errores
  C(42, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(43, "", "bi", "b_wetpile", { p: BI(`Wet cleaned tools piled in a sink without drying.`), ov: { c: "ClChip", props: { text: "1 · No neutralizar ni secar", alert: true } } }),
  S(44, "", "bi", "b_raw", { p: BI(`A thin watery mix of vinegar and flour dripping off a rusty wrench.`), ov: { c: "ClChip", props: { text: "2 · No calentarlo", alert: true } } }),
  S(45, "", "bi", "b_thinlayer", { p: BI(`A rusty wrench with a thin streaky smear of beige paste, rust showing through.`), ov: { c: "ClChip", props: { text: "3 · Untarlo finito", alert: true } } }),
  S(46, "", "bi", "b_nofilm", { p: BI(`Beige paste dried into a pale crust on a rusty tool on a sunny bench.`), ov: { c: "ClChip", props: { text: "4 · Sin film", alert: true } } }),
  S(47, "", "bi", "b_chrome", { p: BI(`A chrome-plated wrench with a dull etched patch where paste was left on it.`), ov: { c: "ClChip", props: { text: "5 · Sobre cromo o pintura", alert: true } } }),
  // ── el vecino
  C(48, "", "ClChapter", { n: 6, title: "Lo del vecino", sub: "las dejó en la pileta" }),
  S(49, "", "bi", "b_riverpincers", { p: BI(`${NEIGHBOR} holding up a pair of pincers caked in thick orange rust as if pulled from a river.`) }),
  S(49, "se fue corriendo a buscar el cajón entero", "bi", "b_neighborbox", { p: BI(`${NEIGHBOR} hurrying across a backyard carrying an old metal toolbox full of rusty tools.`) }),
  S(49, "ese mismo sábado hizo un balde de gel", "bi", "b_neighborgel", { p: BI(`${NEIGHBOR} stirring a big pot of beige paste on an outdoor burner.`) }),
  S(50, "", "bi", "b_neighborscrub", { p: BI(`${NEIGHBOR} scrubbing tools with a wire brush at a laundry sink, pleased.`) }),
  S(50, "las dejó en la pileta del lavadero", "bi", "b_laundrysink", { p: BI(`Wet clean tools left in a laundry sink with the light off at night.`) }),
  S(51, "", "bi", "b_neighbordoor", { p: BI(`${NEIGHBOR} at a front door in the morning holding an open toolbox of tools covered in orange rust fuzz, sheepish face.`) }),
  S(51, "con una pelusa naranja", "bi", "b_fuzzbox", { p: BI(`Close view inside a toolbox: every tool coated evenly in fresh orange rust fuzz.`) }),
  S(52, "", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt stand at a workbench in a backyard shed drying tools with a hair dryer, laughing.`) }),
  S(52, "el balde con bicarbonato", "bi", "b_neighborbucket", { p: BI(`${NEIGHBOR} lowering tools into a bucket of water with baking soda.`) }),
  S(53, "", "bi", "b_neighbortalk", { p: BI(`${NEIGHBOR} at a fence explaining to another neighbour, holding up an oil can.`) }),
  // ── la prueba
  C(54, "", "ClChapter", { n: 7, title: "La prueba del vecino", sub: "galpón, servilleta y gotas" }),
  S(55, "", "bi", "b_hanging", { q: "tools hanging shed", p: BI(`Two pairs of pliers hanging side by side on a nail in a damp old garden shed.`) }),
  S(55, "Al lado, una que limpió con lija", "bi", "b_sanded", { p: BI(`A pair of pliers rubbed shiny with sandpaper on a workbench, a sheet of sandpaper next to it.`) }),
  S(56, "", "bi", "b_spots", { p: BI(`Close view of a pair of pliers dotted with small orange rust spots, hanging in a shed.`) }),
  S(56, "La nuestra, gris", "bi", "b_stillgray", { q: "pliers hanging", p: BI(`A pair of clean gray oiled pliers hanging in a shed, no rust.`) }),
  S(57, "", "bi", "b_napkin", { p: BI(`A white paper napkin wiping the pivot of clean pliers.`), anim: "the napkin wipes the pivot" }),
  S(57, "Ni una mancha naranja", "bi", "b_cleannapkin", { p: BI(`A white paper napkin held up with only a faint shiny oil mark on it.`) }),
  S(58, "", "bi", "b_beading", { p: BI(`Water drops beading round on an oiled steel wrench.`) }),
  S(59, "", "bi", "b_neighborfinger", { p: BI(`${NEIGHBOR} opening a pair of clean pliers with one finger, laughing under his mustache.`) }),
  S(59, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily in a backyard shed, a mustached neighbour beside him shrugging.`) }),
  // ── CTA 2
  S(60, "", "av", ""),
  S(60, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(60, "Óxido, madera, humedad", "bi", "st_rustygate", { q: "rusty iron gate", p: BI(`A rusty iron gate.`) }),
  S(61, "", "bi", "b_gatepaint", { p: BI(`A freshly painted glossy black iron gate next to a rusty one on a street.`) }),
  S(61, "No te apuro", "av", ""),
];
