// DIRECTOR B — clsilicona: POR QUÉ EL ROCIADO NO PUEDE (paga el loop 1: chorrea, el moho está adentro, la venda del video del sarro, la
// prueba del hisopo) · EL CÚTER (paga el loop 2: la unión mojada, el contratista) · REHACERLA BIEN · CTA 2 · LAS 40 BAÑERAS (paga el loop 3:
// la noche, Rosa, 37 de 40, el inspector, la huésped) (párrafos 21-42).
import { S, BI, CLP } from "../claudio/lib.mjs";
import { TUB, CAULK, BOTTLE } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const G = "a hand in a blue nitrile glove";
const I = "img/clsilicona/";
const ROSA = "a hotel laundry worker in her fifties, Rosa, with dark hair pulled back in a bun, a gray uniform with a white collar and pink rubber gloves";
const MANAGER = "a hotel manager in his forties with neat short hair, a dark suit and a tie";
const CONTRACTOR = "a contractor in his thirties in a gray work shirt with a caulking gun";
export const SHOTS = [
  // ── 4:05 · por qué el rociado no puede
  C(21, "", "ClChapter", { n: 2, title: "Por qué el rociado no puede", sub: "chorrea en un minuto" }),
  S(21, "Porque la silicona es lisa", "bi", "b_caulkwall", { p: BI(`Close view of a glossy white silicone caulk line running up the vertical corner between two beige wall tiles in a shower, water droplets sliding down it.`), anim: "a water drop slides down the silicone" }),
  C(21, "Usted rocía", "ClCaulk3D", { mode: "spray", labels: { a: "Chorrea", b: "El moho, igual" } }),
  S(21, "El agua oxigenada necesita tiempo mojando", "av", ""),
  C(22, "", "ClCaulk3D", { mode: "inside", labels: { a: "Como a través de un vidrio" } }),
  S(22, "como a través de un vidrio sucio", "bi", "st_dirtyglass", { q: "dirty window glass close", p: BI("A dirty window pane close up with a view behind it.") }),
  C(23, "", "ClCaulk3D", { mode: "strips", labels: { a: "La humedad entra", b: "Toda la noche" } }),
  C(23, "Es la misma idea de las tiras con vinagre", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El sarro del inodoro" }),
  S(23, "La venda", "bi", "b_bandage", { p: BI("Looking down into a white toilet bowl with soaked paper strips stuck all around the waterline like a bandage.") }),
  // la prueba del hisopo
  S(24, "", "bi", "b_swabcaulk", { p: BI(`${G} pressing a cotton swab dipped in clear liquid against a black spot on a bathtub silicone line.`) }),
  S(24, "Si la mancha se aclara y el hisopo sale gris", "bi", "b_swabgray", { p: BI("Close view of a used cotton swab with a gray smudge on its tip held next to a silicone line where a lighter spot now shows.") }),
  S(24, "Si el hisopo sale blanco", "bi", "b_swabwhite", { p: BI("Close view of a still-white clean cotton swab held next to a silicone line whose black stain is unchanged.") }),
  // nunca mezclar
  C(25, "", "ClNeverMix", { a: "Vinagre", b: "Agua oxigenada", verdict: "Nunca en la misma tira", short: true }),
  // ── 5:25 · el cúter (paga el loop 2)
  C(26, "", "ClChapter", { n: 3, label: "ERROR", title: "El cúter", sub: "silicona nueva sobre una unión mojada", alert: true }),
  S(26, "la corta la arranca", "bi", "b_ripcaulk", { p: BI(`${G} pulling a long strip of old black moldy silicone caulk off the edge of a bathtub after cutting it with a utility knife.`), anim: "the strip of silicone is pulled off slowly" }),
  S(26, "y pone silicona nueva encima de la unión el mismo día", "bi", "b_newcaulkwet", { p: BI("A caulking gun laying a new white silicone bead into a still-wet, dark bathtub joint with water droplets visible.") }),
  S(27, "", "bi", "b_newdots", { p: BI("Close view of a fairly new white silicone caulk line along a bathtub with fresh small black mold dots appearing through it.") }),
  C(27, "Estaba en la unión", "ClCaulk3D", { mode: "seal", labels: { a: "La unión mojada", b: "Encerrado" } }),
  S(27, "Le pusieron una tapa a la casa del moho", "av", ""),
  S(28, "", "bi", "b_contractor", { p: BI(`${CONTRACTOR} quickly running a white silicone bead along a hotel bathtub, a row of open bathroom doors behind him in the corridor.`), anim: "the caulking gun moves along the tub" }),
  S(28, "las diez tenían puntitos negros", "bi", "b_tendots", { p: BI("A hotel bathtub silicone line about six weeks old with black mold dots coming through, a hotel towel folded on the tub edge.") }),
  S(28, "El gerente me llamó a mí", "cl", "c_contractor", { p: CLP(`He stands in a hotel bathroom explaining with his hands to ${CONTRACTOR} who listens with his arms crossed, ${MANAGER} watching from the doorway.`) }),
  // rehacerla bien
  C(29, "", "ClChapter", { n: 4, title: "Si hay que rehacerla", sub: "se rehace bien" }),
  S(30, "", "bi", "b_scraper", { p: BI(`${G} scraping the last bits of old silicone off a bathtub edge with a plastic scraper, without scratching the enamel.`) }),
  S(31, "", "bi", "b_jointspray", { p: BI(`${G} spraying ${BOTTLE} along a bare bathtub-to-tile joint after the old silicone was removed.`) }),
  C(32, "", "ClTimer30", { minutes: 1440, text: "24 horas", label: "secando la unión" }),
  S(32, "Con el extractor o la ventana abierta", "bi", "st_bathfan", { q: "bathroom exhaust fan", p: BI("A bathroom ceiling exhaust fan.") }),
  C(33, "", "ClCaulkGun", {}),
  S(33, "saque la cinta", "bi", "b_tapeoff", { p: BI(`${G} peeling masking tape away from both sides of a freshly smoothed white silicone bead along a bathtub, leaving a clean straight line.`), anim: "the tape peels away slowly" }),
  S(34, "", "av", ""),
  S(34, "sale mucho más que un rollo de papel", "bi", "b_invoice", { p: BI("A printed handyman invoice for bathtub re-caulking lying on a bathroom counter next to a roll of paper towels and a brown bottle with a blank label.") }),
  S(34, "Casi siempre le ahorra todo lo demás", "av", ""),
  // CTA 2
  S(35, "", "av", ""),
  C(35, "está en la página catorce", "ClBookPage", { page: I + "book_p14.jpg", pageNo: 14, qr: I + "qr.jpg", stamp: "Se la regalo" }),
  C(35, "El código está acá", "ClQRCard", { qr: I + "qr.jpg", cover: I + "book_cover.jpg", text: "la página 14, gratis" }),
  // ── 7:50 · las 40 bañeras (paga el loop 3)
  C(36, "", "ClChapter", { n: 5, title: "Las cuarenta bañeras", sub: "la noche antes de la inspección" }),
  S(36, "venía una inspección de la cadena hotelera", "bi", "b_inspectorcar", { p: BI("A man in a suit with a clipboard getting out of a car in front of a hotel entrance in the morning.") }),
  C(36, "el de la libreta", "ClVideoRef", { thumb: I + "th_clsarro.jpg", title: "El gerente de la libreta" }),
  S(36, "Mucha plata", "bi", "b_quote2", { p: BI(`${MANAGER} holding a printed contractor's quote at his desk, rubbing his forehead.`) }),
  S(37, "", "cl", "c_supplies", { p: CLP("He stands at a hotel storeroom shelf at night loading two rolls of paper towels, four brown bottles with blank labels and three rolls of cling film into a cleaning cart, looking at the camera with determination.") }),
  C(37, "A las diez de la noche empecé por el primer piso", "ClTubMap", {}),
  S(38, "", "bi", "b_rosacut", { p: BI(`${ROSA} kneeling on a hotel bathroom floor at night cutting paper towels into strips with scissors, a stack of strips beside her.`), anim: "she keeps cutting strips" }),
  S(38, "no se escuchaba más que el film", "bi", "b_filmstretch", { p: BI(`Close view of ${G} pulling clear cling film from a roll with a stretching sheen, in a dim hotel bathroom at night.`) }),
  S(39, "", "bi", "b_morningtub", { p: BI(`Early morning light in a hotel bathroom: ${G} peeling cling film and paper strips off a bathtub silicone line that is now bright white.`), anim: "the film peels away slowly" }),
  S(39, "Treinta y siete de cuarenta", "av", ""),
  S(40, "", "bi", "b_patiowall", { p: BI("A hotel bathroom whose outer wall faces a damp patio: a damp stain on the wall above the bathtub, the silicone still gray.") }),
  S(41, "", "bi", "b_inspector", { p: BI("A hotel inspector in a suit shining a flashlight along a clean white bathtub silicone line, a clipboard under his arm.") }),
  S(41, "El gerente rompió el presupuesto", "bi", "b_tearquote", { p: BI(`${MANAGER} tearing a printed contractor's quote in half at a hotel reception desk, smiling.`) }),
  S(41, "Y Rosa y yo nos fuimos a desayunar", "cl", "c_breakfast", { p: CLP(`He sits at a small table in a hotel staff kitchen early in the morning across from ${ROSA}, both with coffee cups and bread, laughing tiredly.`) }),
  S(42, "", "bi", "b_guestask", { p: BI("A well-dressed woman guest in her sixties at a hotel reception desk asking a question, leaning in with curiosity.") }),
  S(42, "Le escribí en un papelito", "bi", "b_note", { p: BI("A small handwritten note on hotel notepaper on a reception desk beside a pen.") }),
  S(42, "mandó una carta al hotel con una foto", "bi", "b_letterphoto", { p: BI("An opened letter on a hotel desk with a printed photo of a bright clean white bathtub clipped to it.") }),
];
