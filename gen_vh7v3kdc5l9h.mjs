// gen_vh7v3kdc5l9h.mjs — beatsheet del video "Si te despertás con la BOCA SECA después de los 60"
// (Canal Federer Archivos). Avatar vh7v3kdc5l9h_opt.mp4 (~22.1min). Anclaje por FRASE a
// captions_vh7v3kdc5l9h.json. Look CLÍNICO teal. Imágenes gpt-image-2: p_vh7v3kdc5l9h_*.png +
// dg_vh7v3kdc5l9h_*.png. Kit _fed6 COMPLETO. Estructura: cold-open 3am → historia de Don Alberto →
// 5 CAUSAS (deshidratación, medicamentos, respiración bucal/apnea, azúcar, Sjögren) + el ERROR +
// límites honestos + recap. 3 injertos de venta de la guía.
import fs from "fs";
const SLUG = "vh7v3kdc5l9h";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const ap = (items, o = {}) => ({ t: "avatarpizarra", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

const P = (n) => `p_${SLUG}_${n}`;   // foto hero
const D = (n) => `dg_${SLUG}_${n}`;  // diagrama

const SECTIONS = [
  // ░░ COLD-OPEN CINE — 3 de la madrugada (primer minuto irresistible) ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),                                                     // avatar full 0-2.2 + scrim
    r(P("ojos_abren"), { at: "abri los ojos", kicker: "Las 3 de la madrugada" }),
    r(P("lengua_seca_macro"), { at: "la lengua se te pego" }),
    r(P("labios_secos_macro"), { at: "la boca seca aspera" }),
    r(P("arena_cae"), { at: "arena adentro" }),
    r(P("mano_vaso_vacio"), { at: "ni una gota de saliva" }),
    r(P("hombre_techo_resignado"), { at: "es la edad", hold: true }),  // resignación
  ]},
  { key: "noesedad", phrase: "no es la edad", beats: [
    ak([{ word: "NO ES LA EDAD", sub: "esa boca seca es un aviso de tu cuerpo", tone: "teal", atPhrase: "no es la edad" }], {}),
  ]},
  { key: "tablero", phrase: "lucecita en el tablero", beats: [
    r(P("tablero_luz_roja"), { at: "lucecita en el tablero", kicker: "Una luz en el tablero", hold: true }),
    fc([{ t: "Es" }, { t: "un" }, { t: "aviso", hl: true }], { tone: "warn", at: "es un aviso" }),
  ]},
  { key: "elerror_hook", phrase: "tomando un vaso de agua", beats: [
    r(P("hombre_despierta_3am"), { at: "volviendose a dormir" }),
  ]},
  { key: "cinco", phrase: "una de 5 cosas", beats: [
    es("5", "5 causas de la boca seca", { tone: "teal", w: 3.4 }),
  ]},
  { key: "loop_pinchazo", phrase: "pinchazo en el dedo", beats: [
    r(P("gota_sangre_dedo"), { at: "pinchazo en el dedo" }),
    c("looplock", { title: "La quinta causa", sub: "la que menos perdona — te la digo al final", at: "para el final" }),
  ]},
  { key: "confirma", phrase: "9 de cada 10 personas", beats: [
    c("stat", { big: "9 de 10", unit: "", label: "creen que la boca seca de noche es normal por la edad. Casi nunca lo es.", tone: "teal" }),
  ]},
  { key: "promesa", phrase: "quedate conmigo estos minutos", beats: [
    c("chips", { bg: "image", image: `img/${P("hombre_techo_resignado")}.png`, imageDarken: 0.62, title: "5 causas de la boca seca después de los 60", chips: ["Deshidratación · Medicamentos", "Respirar por la boca · Azúcar", "Y una que va al médico"] }),
  ]},
  // ░░ HISTORIA DE DON ALBERTO (emotiva) ░░
  { key: "story", phrase: "don alberto", beats: [
    c("talk", {}),
    r(P("don_alberto_consultorio"), { at: "73 anos jubilado", kicker: "Don Alberto, 73 años", hold: true }),
  ]},
  { key: "story_pregunta", phrase: "le pregunte tres cosas", beats: [
    ap([
      { card: "¿Tomás mucha agua de día?", atPhrase: "si tomaba mucha agua" },
      { card: "¿Roncás?", atPhrase: "si roncaba" },
      { card: "¿Vas al baño de noche?", sub: "tres, cuatro veces", atPhrase: "seguido al bano de noche" },
    ], {}),
  ]},
  { key: "story_dx", phrase: "tenia el azucar por las nubes", beats: [
    r(P("analisis_sangre_glucosa"), { at: "un analisis de sangre" }),
    c("quote", { image: `img/${P("don_alberto_consultorio")}.png`, text: "La única señal que su cuerpo le dio en meses fue esa boca seca. *Esa pavada le estaba salvando la vida.*" }),
  ]},
  // ░░ EL PRINCIPIO — qué es la saliva ░░
  { key: "principio", phrase: "empecemos por lo que casi", beats: [
    c("talk", {}),
    ak([{ word: "LA SALIVA NO ES BABA", sub: "medio litro a litro y medio por día — te protege", tone: "teal", atPhrase: "la saliva no es baba" }], {}),
    c("splitlist", { title: "Para qué sirve la saliva", items: ["Lava las bacterias", "Cuida los dientes de las caries", "Arranca la digestión y te deja tragar"], palette: "T" }),
  ]},
  { key: "saliva_stat", phrase: "una de cada tres personas", beats: [
    c("stat", { big: "1 de 3", unit: "", label: "mayores de 60 convive con la boca seca. Casi ninguna sabe que se puede tratar.", tone: "teal" }),
    c("checklist", { title: "Sin saliva, mucho tiempo", items: [
      { text: "Caries donde nunca tuviste", state: "warn" },
      { text: "Llagas y mal aliento", state: "warn" },
      { text: "La dentadura postiza lastima", state: "warn" } ] }),
    r(P("dentadura_postiza"), { at: "usa dentadura postiza" }),
  ]},
  { key: "clave", phrase: "la saliva se fabrica", beats: [
    dg(D("saliva_glandula"), "Saliva = agua + riego sanguíneo"),
    ak([{ word: "AGUA + SANGRE", sub: "las glándulas necesitan las dos cosas para fabricar saliva", tone: "teal", atPhrase: "con agua y con riego" }], {}),
  ]},
  { key: "fuego", phrase: "vamos a buscar el fuego", beats: [
    dg(D("cinco_causas"), "5 lugares donde puede estar el problema"),
    fc([{ t: "La" }, { t: "boca" }, { t: "seca" }, { t: "es" }, { t: "el" }, { t: "humo", hl: true }], { tone: "warn", at: "es el humo" }),
  ]},
  // ░░ CAUSA 1 — DESHIDRATACIÓN SILENCIOSA ░░
  { key: "causa1", phrase: "estas deshidratado", beats: [
    es("01", "Deshidratación silenciosa", { w: 3.6 }),
  ]},
  { key: "causa1_mec", phrase: "con la edad el cuerpo pierde", beats: [
    dg(D("sensacion_sed"), "Con la edad se apaga la sensación de sed"),
    ak([{ word: "SE APAGA LA SED", sub: "podés estar deshidratado y no sentir ni una pizca", tone: "warn", atPhrase: "la sensacion de sed" }], {}),
  ]},
  { key: "prioriza", phrase: "manda el poco liquido", beats: [
    dg(D("prioriza_agua"), "El cuerpo raciona: la saliva queda última"),
    r(P("hombre_mayor_cansado")),
  ]},
  { key: "senales", phrase: "no viene sola", beats: [
    c("splitlist", { title: "La deshidratación también da", items: ["Mareo al pararte de la silla", "Más cansancio, ideas confusas", "Hasta estreñimiento"], palette: "G" }),
  ]},
  { key: "cafe", phrase: "el cafe y el te", beats: [
    r(P("cafe_te_taza"), { at: "tres cuatro pocillos" }),
    ak([{ word: "SON DIURÉTICOS", sub: "por cada café, sumá un vaso de agua aparte", tone: "warn", atPhrase: "son diureticos" }], {}),
  ]},
  { key: "pis", phrase: "mira el pis", beats: [
    dg(D("semaforo_pis"), "El semáforo del pis: claro = bien, oscuro = falta agua"),
    r(P("vaso_agua_dia"), { at: "vas bien" }),
  ]},
  { key: "error_teaser", phrase: "corregir esto no cuesta nada", beats: [
    lt("Guardá esto para el final: el ERROR que empeora todo", { kicker: "Quedate", desc: "Lo hace el 90% cada noche. Ya vas a ver por qué.", tone: "warn", at: "el error que hace" }),
  ]},
  // ░░ CAUSA 2 — LOS MEDICAMENTOS ░░
  { key: "causa2", phrase: "la segunda causa vive", beats: [
    es("02", "Tus remedios", { w: 3.6 }),
    r(P("mesita_remedios"), { at: "son tus remedios" }),
  ]},
  { key: "causa2_num", phrase: "mas de 400 medicamentos", beats: [
    c("stat", { big: "+400", unit: "", label: "medicamentos de uso común resecan la boca. Presión, diuréticos, alergia, sueño, vejiga.", tone: "warn" }),
    dg(D("medicamentos_resecan"), "Los remedios que más resecan"),
  ]},
  { key: "coctel", phrase: "el coctel", beats: [
    ak([{ word: "EL CÓCTEL", sub: "no es un remedio malo, es la SUMA de varios", tone: "warn", atPhrase: "es la suma" }], {}),
  ]},
  { key: "ejemplo", phrase: "te doy un ejemplo", beats: [
    c("process", { title: "El cóctel que reseca", eyebrow: "Cada uno recetado aparte", steps: [
      { title: "Presión", desc: "+ diurético", image: `img/${P("pastillas_mano")}.png` },
      { title: "Alergia", desc: "antihistamínico", image: `img/${P("mesita_remedios")}.png` },
      { title: "Dormir", desc: "una pastillita", image: `img/${P("pastillas_mano")}.png` } ] }),
  ]},
  { key: "no_dejes", phrase: "no te estoy diciendo que dejes", beats: [
    lt("NUNCA toques tu medicación por tu cuenta", { kicker: "Escudo de honestidad", desc: "Cortar una pastilla de la presión es más peligroso que la boca seca.", tone: "warn", at: "toques tu medicacion" }),
  ]},
  { key: "pregunta_medico", phrase: "agarra la lista completa", beats: [
    r(P("lista_medicamentos_medico"), { at: "la lista completa" }),
    c("callout", { image: `img/${P("lista_medicamentos_medico")}.png`, figure: "Preguntale al médico", caption: "¿Alguno me reseca la boca? ¿Se puede cambiar o mover el horario?" }),
    lt("Qué preguntarle al médico, ordenado en mi guía", { kicker: "Si querés la lista", desc: "El enlace está abajo, en la descripción.", tone: "teal", at: "hay una alternativa que no te seca" }),
  ]},
  // ░░ CAUSA 3 — RESPIRACIÓN BUCAL / APNEA ░░
  { key: "causa3", phrase: "vamos a la tercera", beats: [
    es("03", "Respirás por la boca de noche", { w: 3.6 }),
  ]},
  { key: "respira", phrase: "estas respirando por la boca", beats: [
    dg(D("respiracion_bucal"), "Boca abierta 8 h → se evapora la saliva"),
    r(P("hombre_boca_abierta_duerme"), { at: "la boca abierta" }),
  ]},
  { key: "roncas", phrase: "si roncas", beats: [
    ak([{ word: "SI RONCÁS, ES ESTO", sub: "roncar = respirás por la boca", tone: "warn", atPhrase: "roncas como un tractor" }], {}),
    r(P("pareja_ronca_noche"), { at: "tu pareja te dice" }),
  ]},
  { key: "costado", phrase: "dormi un poco de costado", beats: [
    c("splitlist", { title: "Un truco que no cuesta nada", items: ["Boca arriba: la lengua se va atrás, roncás", "De costado: respirás por la nariz", "Probalo una semana"], palette: "T" }),
    r(P("dormir_costado"), { at: "de costado respiras mejor" }),
  ]},
  { key: "apnea", phrase: "se llama apnea del sueno", beats: [
    dg(D("apnea_sueno"), "Apnea: dejás de respirar decenas de veces"),
    lt("¿Seco Y cansado aunque dormiste 8 horas? Al médico", { kicker: "Ojo con la apnea", desc: "Sube la presión y castiga el corazón. Se estudia y tiene solución.", tone: "warn", at: "muchas veces por noche" }),
  ]},
  // ░░ CAUSA 4 — AZÚCAR EN SANGRE (el loop del pinchazo) ░░
  { key: "causa4", phrase: "y ahora si la cuarta", beats: [
    es("04", "El azúcar en la sangre", { tone: "warn", w: 3.8 }),
  ]},
  { key: "azucar", phrase: "es el azucar en la sangre", beats: [
    dg(D("azucar_orina"), "Azúcar alto → saca agua por la orina"),
  ]},
  { key: "azucar_senales", phrase: "boca seca todo el tiempo", beats: [
    ap([
      { card: "Boca seca", sub: "sobre todo de noche", atPhrase: "boca seca todo el tiempo" },
      { card: "Sed que no se calma", sub: "tomás y seguís seco", atPhrase: "sed que no se calma" },
      { card: "Pis varias veces de noche", sub: "las tres juntas", atPhrase: "hacer pis varias veces" },
    ], {}),
  ]},
  { key: "analisis", phrase: "hacete un analisis de sangre", beats: [
    r(P("glucometro_dedo"), { at: "un pinchazo en el dedo" }),
    ak([{ word: "GLUCOSA EN AYUNAS", sub: "un pinchazo, barato — puede ser lo único que avisa", tone: "warn", atPhrase: "la glucosa en ayunas" }], {}),
    fz(P("glucometro_dedo"), { x: 0.5, y: 0.5, label: "Esa lucecita te está gritando", zoom: 1.6, tone: "warn", at: "te esta gritando" }),
  ]},
  { key: "callada", phrase: "la diabetes tipo dos", beats: [
    mv("Un poco más de sed es la edad", "Puede ser azúcar comiéndote los vasos", { flipPhrase: "comiendo los vasos" }),
  ]},
  // ░░ EL ERROR (pago del loop grande) ░░
  { key: "error", phrase: "te debo el error", beats: [
    es("!", "El error que empeora todo", { tone: "warn", w: 3.6 }),
  ]},
  { key: "error1", phrase: "el alcohol reseca", beats: [
    r(P("enjuague_alcohol"), { at: "enjuague bucal" }),
    ak([{ word: "ENJUAGUE CON ALCOHOL", sub: "reseca más — buscá uno sin alcohol", tone: "warn", atPhrase: "el alcohol reseca" }], {}),
  ]},
  { key: "error2", phrase: "el vaso de agua enorme", beats: [
    r(P("vaso_litro_noche"), { at: "antes de acostarte" }),
    fc([{ t: "No" }, { t: "es" }, { t: "más" }, { t: "agua" }, { t: "de" }, { t: "golpe" }, { t: "es" }, { t: "llegar" }, { t: "húmedo", hl: true }], { tone: "teal", at: "llegar humedo a la noche" }),
  ]},
  // ░░ CAUSA 5 — SJÖGREN (la del final) ░░
  { key: "causa5", phrase: "y llegamos a la quinta", beats: [
    es("05", "Las propias glándulas", { w: 3.6 }),
  ]},
  { key: "sjogren", phrase: "sindrome de chogren", beats: [
    dg(D("sjogren_glandulas"), "Sjögren: las defensas atacan las glándulas"),
    ak([{ word: "SÍNDROME DE SJÖGREN", sub: "el sistema inmune seca saliva y lágrimas", tone: "teal", atPhrase: "sindrome de chogren" }], {}),
  ]},
  { key: "ojos_secos", phrase: "viene con ojos secos", beats: [
    r(P("ojos_secos_gotas"), { at: "ojos secos" }),
    c("callout", { image: `img/${P("ojos_secos_gotas")}.png`, figure: "Boca seca + ojos secos", caption: "Decíselo al médico por nombre: quiero descartar Sjögren." }),
  ]},
  // ░░ ENEMIGO ░░
  { key: "enemigo", phrase: "por que nadie te explica", beats: [
    c("talk", {}),
    mv("Te venden el spray y el chicle para la boca seca", "El spray es un cliente; la causa es un paciente que se cura", { flipPhrase: "un paciente que se cura" }),
  ]},
  // ░░ ALIVIO — el mientras tanto ░░
  { key: "alivio", phrase: "cositas que alivian", beats: [
    ge("Mientras encontrás la causa", [
      { text: "Humidificador en la pieza", image: `img/${P("humidificador_pieza")}.png` },
      { text: "Chicle sin azúcar de día (estimula saliva)", image: `img/${P("chicle_sin_azucar")}.png` },
      { text: "Saliva artificial de la farmacia", image: `img/${P("saliva_artificial")}.png` },
    ], { at: "cuatro cositas que alivian" }),
  ]},
  // ░░ LÍMITES HONESTOS ░░
  { key: "honesto", phrase: "ahora te tengo que ser honesto", beats: [
    c("talk", {}),
    lt("La mayoría de las veces es solo deshidratación", { kicker: "Con toda honestidad", desc: "Agua a sorbos todo el día. Lo más común y lo más simple.", tone: "teal", at: "es la causa numero uno" }),
  ]},
  { key: "banderas", phrase: "3 banderas rojas", beats: [
    c("checklist", { title: "Tres banderas rojas que van al médico", items: [
      { text: "Con mucha sed y pis de noche → análisis de azúcar", state: "warn" },
      { text: "Ronquido fuerte y cansancio → estudio del sueño", state: "warn" },
      { text: "Ojos secos siempre → descartar lo autoinmune", state: "warn" } ] }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "hagamos el repaso", beats: [
    c("talk", {}),
    c("focuscards", { title: "¿Cuál es tu caso?", items: [
      { image: `img/${P("vaso_agua_dia")}.png`, label: "Deshidratación", atPhrase: "deshidratacion silenciosa" },
      { image: `img/${P("lista_medicamentos_medico")}.png`, label: "Tus remedios", atPhrase: "tus remedios" },
      { image: `img/${P("dormir_costado")}.png`, label: "Respirás por la boca", atPhrase: "respiras por la boca" },
      { image: `img/${P("glucometro_dedo")}.png`, label: "El azúcar en sangre", atPhrase: "el azucar en sangre" },
      { image: `img/${P("ojos_secos_gotas")}.png`, label: "Glándulas · Sjögren", atPhrase: "las glandulas mismas" },
    ], at: "escucha cual es tu caso" }),
  ]},
  { key: "recap_error", phrase: "arriba de todo el error", beats: [
    c("splitlist", { title: "El error a corregir esta noche", items: ["Nada de enjuague con alcohol", "Nada de un litro de agua antes de dormir", "Humidificador + chicle sin azúcar mientras tanto"], palette: "G" }),
  ]},
  // ░░ CTA COMENTARIOS ░░
  { key: "comentarios", phrase: "contame en los comentarios", beats: [
    lt("¿Cuál de las 5 es tu caso? Escribime el número", { kicker: "En los comentarios", desc: "Los leo todos, uno por uno. No estás solo con esto.", tone: "teal", at: "cual de las cinco" }),
  ]},
  // ░░ INJERTO GUÍA #3 (pitch completo) ░░
  { key: "guia", phrase: "la guia gratis del canal", beats: [
    r(P("guia_celular"), { at: "la guia gratis", hold: true }),
    c("chips", { bg: "image", image: `img/${P("guia_celular")}.png`, imageDarken: 0.62, title: "La Guía de la Salud +60", chips: ["Cuánta agua según tu peso", "Qué preguntarle al médico", "archivos-federer.vercel.app"] }),
    lt("El enlace está abajo, en la descripción", { kicker: "Un regalo, no una obligación", desc: "archivos-federer.vercel.app — te acompaña más allá del video.", tone: "teal", at: "abajo en la descripcion" }),
  ]},
  // ░░ CIERRE + TEASER ░░
  { key: "cierre", phrase: "tu cuerpo te habla", beats: [
    c("talk", {}),
    fc([{ t: "Los" }, { t: "que" }, { t: "aprenden" }, { t: "a" }, { t: "escucharlas" }, { t: "viven" }, { t: "mejor", hl: true }], { tone: "teal", at: "viven mejor" }),
  ]},
  { key: "teaser", phrase: "en el proximo video", beats: [
    lt("Próximo: por qué te levantás al baño de noche", { kicker: "No te lo pierdas", desc: "En el hombre, muchas veces NO es la próstata. Empieza más arriba.", tone: "teal", at: "no es la prostata" }),
  ]},
  { key: "close", phrase: "por que te levantas al bano", beats: [
    c("nametag", { name: "Dr. Federer", role: "Cada semana, salud real para después de los 60", image: `img/${P("federer_despide")}.png` }),
  ]},
];

// ── ANCLAJE POR FRASE ─────────────────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const pinPhrase = (b) => b.at || (b.t === "quote" && b.text ? b.text.replace(/\*/g, "") : null);
const VIDEO_END = (CW[CW.length - 1]?.s || 1329) + 2;

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + 5;
  cursorSec = sec.start;
}
SECTIONS.sort((a, b) => a.start - b.start);

const beats = [];
for (let si = 0; si < SECTIONS.length; si++) {
  const sec = SECTIONS[si];
  const start = sec.start;
  const end = si + 1 < SECTIONS.length ? SECTIONS[si + 1].start : VIDEO_END;
  const n = sec.beats.length;
  const ws = sec.beats.map((b) => { let w = W[b.t] ?? 1.1; if (b.t === "raw" && b.hold) w *= 1.7; if (b.w) w *= b.w; return w; });
  const pin = sec.beats.map((b, i) => {
    if (i === 0) return start;
    const ph = pinPhrase(b); if (!ph) return null;
    const ms = findMs(ph, start + 0.4);
    return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null;
  });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i);
  fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) {
    const a = fixed[f], b = fixed[f + 1];
    const ta = pin[a], tb = b === n ? end : pin[b];
    let sw = 0; for (let i = a; i < b; i++) sw += ws[i];
    let acc = ta;
    for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); }
  }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2);
    const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2);
    let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`;
    const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.png`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "headline" && Array.isArray(beat.tokens)) beat.tokens = beat.tokens.map((t) => (typeof t === "string" ? { t } : { t: t.t, hl: true }));
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it));
    }
    beats.push(beat);
  });
}

// ── POST-PASS MILIMÉTRICO ───────
const KIT_CLIPS = [];
for (const beat of beats) {
  if (beat.kind === "avatarpizarra" || beat.kind === "avatarkeyword") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    const GAP = 90;
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
    const hold = beat.kind === "avatarpizarra" ? 4.2 : 2.8;
    beat.dur = +(last / 30 + hold).toFixed(2);
    beat.clip = `avatar_clips/${SLUG}/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "focuscards") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    beat.dur = +(last / 30 + 4.5).toFixed(2); // hold ~4.5s tras enfocar la última tarjeta
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

// ── PISO DE DURACIÓN ──
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) {
  const i = compIx[k];
  const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END;
  const capDur = nextComp - beats[i].start - 0.1;
  beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2);
}

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — beats (imágenes p_${SLUG}_*.png / dg_${SLUG}_*.png).\n` +
  `export const FEDZ_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — rangos talk.\n` +
  `export const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats }, null, 1));

// ── QA ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
console.log("IMG_NEEDED:" + [...need].join(","));
