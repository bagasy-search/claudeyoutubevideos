// DIRECTOR B — fbgoteras: POR QUÉ la acetona arruina el frasco (cura con la humedad, la acelera, bola de goma; el aguarrás la disuelve) ·
// DÓNDE ENTRA el agua de verdad (camina por la losa, medir, manguera por tramos) · LOS 5 ERRORES · LO DEL VECINO (techo mojado, se
// levantó como cinta) · LA PRUEBA (manguera, charco toda la noche, la uña) · CTA 2 (párrafos 29-57).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { ROOF, CRACK, SEALED, JAR, HANDS, NEIGHBOR } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/fbgoteras/";
export const SHOTS = [
  // ── por qué
  C(29, "", "ClChapter", { n: 3, title: "Por qué la acetona arruina el frasco", sub: "lo que muestra el video viral" }),
  S(29, "el cartucho entero en el frasco, con acetona", "bi", "b_viraljar", { p: BI(`Top view of ${JAR} with a whole tube of white silicone and a big splash of acetone, a brush standing in it, on a roof parapet.`) }),
  S(30, "", "bi", "b_humidair", { q: "humid morning mist", p: BI(`Morning mist and humid air over rooftops.`) }),
  S(30, "se transforma en goma", "bi", "b_curedpeel", { p: BI(`Extreme close view of a thin strip of cured white silicone being stretched between two gloved fingers like rubber.`) }),
  S(31, "", "bi", "b_acetonemacro", { p: BI(`Extreme macro of a drop of clear acetone landing on soft white silicone paste.`) }),
  S(31, "se aguanta la próxima lluvia", "bi", "st_rainroof", { q: "rain on concrete roof", p: BI(`Rain falling on a flat concrete roof.`) }),
  S(32, "", "av", ""),
  S(32, "el resto se está curando adentro", "bi", "b_jarskin", { p: BI(`Close view inside ${JAR}: a rubbery skin forming on top of white silicone, a brush stuck in it.`) }),
  S(32, "Hice el frasco del video viral", "cl", "c_jarshow", { p: CLP(`He holds up ${JAR} of white silicone toward the camera, raising an eyebrow, on a sunny roof.`) }),
  S(32, "sale una bola de goma", "bi", "b_gumball2", { p: BI(`Close view of a stick lifted from a jar with a big stretchy ball of cured white silicone rubber hanging from it.`), anim: "the rubber ball stretches and bounces", ov: { c: "ClStampOv", props: { text: "GOMA" } } }),
  S(33, "", "bi", "b_turpsjar", { p: BI(`A stick stirring ${JAR} of smooth creamy liquid white silicone thinned with turpentine, flowing freely.`), anim: "the creamy liquid flows off the stick" }),
  S(33, "cuando la extiendes finita al aire", "bi", "b_thincoat", { p: BI(`A brush spreading a thin white silicone coat on concrete, the fresh coat going from glossy to matte.`) }),
  S(34, "", "c", "ClDoDont", { props: { yes: { label: "Aguarrás para pincelar", img: I + "b_turpsjar.jpg" }, no: { label: "Acetona en el frasco", img: I + "b_gumball2.jpg" } } }),
  S(34, "Lo mismo que con el piso", "c", "ClVideoRef", { props: { thumb: I + "th_prev.jpg", title: "Cemento blanco + pintura: el piso" } }),
  // ── dónde entra
  C(35, "", "ClChapter", { n: 4, title: "Dónde entra el agua de verdad", sub: "casi nunca donde gotea" }),
  S(35, "Casi nunca la gotera está donde gotea", "av", ""),
  S(36, "", "bi", "b_slabsection", { p: BI(`A cutaway of a concrete roof slab: water entering through a crack at the top, traveling inside along the steel bars and dripping out a meter away at the ceiling.`) }),
  S(36, "a un metro, o a dos", "bi", "b_ceilingdrip", { q: "ceiling leak drip", p: BI(`Water drops forming on a white ceiling far from the wall.`) }),
  S(37, "", "bi", "b_tapein", { q: "tape measure wall", p: BI(`A tape measure stretched from a wall to a stain on a ceiling inside a room.`) }),
  S(37, "subes y mides lo mismo arriba", "bi", "b_tapeout", { p: BI(`A man on a flat roof measuring from the parapet with a tape measure, a chalk mark on the concrete.`) }),
  S(37, "Ahí suele estar la grieta de verdad", "bi", "b_found", { p: BI(`A gloved finger pointing at a fine crack found uphill from a chalk mark on a gray concrete roof.`) }),
  S(38, "", "bi", "st_hoseroof", { q: "garden hose water spray", p: BI(`A garden hose spraying water on concrete.`), anim: "water sprays" }),
  S(38, "empezando por abajo", "bi", "b_hosesection", { p: BI(`A hose wetting just one square section of a flat roof near the drain, the rest dry.`) }),
  S(38, "alguien adentro te avisa", "bi", "b_shout", { p: BI(`A woman in a room looking up at a drip on the ceiling and calling out toward the window.`) }),
  // ── errores
  C(39, "", "ClChapter", { n: 5, title: "Los 5 errores", sub: "de mayor a menor" }),
  S(40, "", "bi", "b_puddleroof", { q: "puddles flat roof", p: BI(`A flat concrete roof with puddles after rain, a crack under water.`), ov: { c: "ClChip", props: { text: "1 · Techo mojado", alert: true } } }),
  S(41, "", "bi", "b_jarlump2", { p: BI(`A glass jar tipped on its side on a roof parapet, a solid rubbery plug of white cured silicone stuck inside, a brush glued into it.`), ov: { c: "ClChip", props: { text: "2 · Frasco con acetona", alert: true } } }),
  S(42, "", "bi", "b_mossy", { q: "moss on concrete", p: BI(`A strip of silicone peeling off a dusty, mossy crack in a concrete roof in one piece.`), ov: { c: "ClChip", props: { text: "3 · No limpiar", alert: true } } }),
  S(42, "como una curita vieja", "bi", "st_bandaid", { q: "peeling adhesive tape", p: BI(`Old tape peeling off a surface.`) }),
  S(43, "", "bi", "b_bead", { p: BI(`A thin bead of silicone run over a hairline crack on concrete, one edge lifted and dirty water under it.`), ov: { c: "ClChip", props: { text: "4 · Sin abrir la grieta", alert: true } } }),
  S(44, "", "bi", "b_thick", { p: BI(`A thick sticky white silicone coat on concrete with crazing cracks and leaves stuck to it.`), ov: { c: "ClChip", props: { text: "5 · Una mano gruesa", alert: true } } }),
  // ── el vecino
  C(45, "", "ClChapter", { n: 6, title: "Lo del vecino", sub: "el techo mojado" }),
  S(46, "", "bi", "b_neighborroof", { p: BI(`${NEIGHBOR} on his own flat roof with a half-used silicone cartridge, puddles around him, the sky still cloudy.`) }),
  S(46, "que había llovido a la mañana", "bi", "st_morningrain", { q: "rain puddle rooftop", p: BI(`Puddles on a rooftop after rain.`) }),
  S(47, "", "bi", "b_neighborbrag", { p: BI(`${NEIGHBOR} at a sidewalk chatting proudly with two neighbours, pointing up at his roof.`) }),
  S(47, "una tormenta de verdad", "bi", "st_storm", { q: "heavy rain storm", p: BI(`Heavy rain pouring down on houses.`) }),
  S(48, "", "bi", "b_neighborgate", { p: BI(`${NEIGHBOR} at a front gate with a sad, sheepish face, shoulders slumped, rain-soaked.`) }),
  S(48, "como una tira de cinta", "bi", "b_peelstrip", { p: BI(`A thumbnail lifting a whole strip of silicone off a damp crack in a concrete roof, like peeling tape.`), anim: "the strip peels off" }),
  S(48, "con verdín", "bi", "b_greencrack", { q: "moss in concrete crack", p: BI(`Close view of a damp crack in concrete with green algae inside it.`) }),
  S(49, "", "cl", "c_together", { p: CLP(`He and a mustached neighbour in a light-blue checked shirt kneel side by side on a sunny flat roof, brushing white coating on a crack, laughing.`) }),
  S(49, "Y antes de bajar, el balde", "bi", "b_neighborbucket", { p: BI(`${NEIGHBOR} throwing a bucket of water over a white-coated crack on a sunny flat roof.`) }),
  S(50, "", "bi", "b_neighbortalk", { p: BI(`${NEIGHBOR} at a fence lecturing another neighbour, wagging a finger toward the sun.`) }),
  // ── la prueba
  C(51, "", "ClChapter", { n: 7, title: "La prueba del vecino", sub: "manguera, charco y la uña" }),
  S(52, "", "bi", "b_hosecrack", { p: BI(`A garden hose running water straight onto a white-coated crack on a flat roof.`) }),
  S(52, "Yo abajo con la linterna", "cl", "c_flashlight", { p: CLP(`He stands in a bedroom shining a flashlight up at a dry white ceiling, serious, checking.`) }),
  S(53, "", "bi", "b_pond", { p: BI(`A shallow pond of water held on a flat roof by a ring of white silicone, covering a sealed crack, evening light.`) }),
  S(53, "el techo de abajo seco", "bi", "b_dryceiling2", { p: BI(`Morning light on a dry white bedroom ceiling, no stain, no drop.`) }),
  S(54, "", "bi", "b_nailtest", { p: BI(`Extreme close view of a thumbnail trying to lift the edge of a white silicone coating on concrete, it does not budge.`) }),
  S(55, "", "bi", "b_neighborhands", { p: BI(`${NEIGHBOR} brushing off his hands on a sunny flat roof, nodding, a reluctant smile under his mustache.`) }),
  S(55, "Bueno, me callo", "cl", "c_laugh", { p: CLP(`He laughs heartily on a sunny flat roof, a mustached neighbour beside him shrugging.`) }),
  // ── CTA 2
  S(56, "", "av", ""),
  S(56, "setenta y seis", "c", "ClBookPage", { props: { page: I + "book_cover.jpg", pageNo: 76, qr: I + "qr.jpg", stamp: "Las 10 mezclas, gratis" } }),
  S(56, "Madera, óxido, humedad", "bi", "st_dampwall", { q: "damp wall mold", p: BI(`A damp wall with mold stains.`) }),
  S(57, "", "bi", "b_moldcorner", { p: BI(`A ceiling corner with a dark damp stain and mold, a flashlight beam on it.`) }),
  S(57, "No te apuro", "av", ""),
];
