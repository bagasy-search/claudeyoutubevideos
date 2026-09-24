// gen_vtio42jf5tzj.mjs — beatsheet del video "La VERDURA #1 que limpia tu creatinina y cuida tus riñones +60"
// (Canal Federer Archivos). Avatar vtio42jf5tzj_opt.mp4 (~22.8min). Anclaje por FRASE a
// captions_vtio42jf5tzj.json. Look CLÍNICO teal. Imágenes gpt-image-2: p_vtio42jf5tzj_*.png +
// dg_vtio42jf5tzj_*.png. Kit _fed6 COMPLETO. Estructura: cold-open riñón callado → historia de
// Ernesto → creatinina/filtro → morrón rojo (4 razones) → 3+1 acompañantes → mitos → límites
// honestos → el ERROR (sano ≠ bueno para riñón cansado) → enemigo wellness → recap. 3 injertos guía.
import fs from "fs";
const SLUG = "vtio42jf5tzj";

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
const fcards = (title, items, o = {}) => ({ t: "focuscards", title, items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

const P = (n) => `p_${SLUG}_${n}`;   // foto hero
const D = (n) => `dg_${SLUG}_${n}`;  // diagrama

const SECTIONS = [
  // ░░ COLD-OPEN — el riñón callado ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r(P("rinones_silueta"), { at: "ese filtro que tenes", kicker: "Tu riñón, en silencio" }),
    r(P("analisis_creatinina"), { at: "esa palabra creatinina" }),
  ]},
  { key: "confirma", phrase: "verdura numero 1", beats: [
    ak([{ word: "LA VERDURA #1", sub: "barata, la tenés en la heladera y no lo sabías", tone: "teal", atPhrase: "verdura numero 1" }], {}),
  ]},
  { key: "error_teaser", phrase: "hay un error uno solo", beats: [
    lt("Guardá esto para el final: el ERROR que arruina el 90%", { kicker: "Quedate conmigo", desc: "Si comés la verdura pero cometés este error, no sirve de nada.", tone: "warn", at: "hay un error uno solo" }),
  ]},
  // ░░ HISTORIA DE ERNESTO ░░
  { key: "story", phrase: "un paciente de esos", beats: [
    c("talk", {}),
    r(P("ernesto_consultorio"), { at: "llego al consultorio con", kicker: "Ernesto, 72 años", hold: true }),
  ]},
  { key: "story_jugo", phrase: "jugo verde por dia", beats: [
    r(P("jugo_verde_licuadora"), { at: "licuados de banana con" }),
    mv("El jugo verde y el licuado son sanísimos", "Para un riñón cansado, son una avalancha de potasio", { flipPhrase: "una montana de potasio" }),
  ]},
  { key: "story_payoff", phrase: "se habia acomodado", beats: [
    r(P("ernesto_alivio"), { at: "volvio a jugar con los nietos" }),
    c("quote", { image: `img/${P("ernesto_consultorio")}.png`, text: "No fue el número lo que me quedó grabado. *Fue la cara: volvió a jugar con los nietos sin ese miedo encima.*" }),
  ]},
  // ░░ EL PRINCIPIO — qué es la creatinina ░░
  { key: "principio", phrase: "empecemos por lo que casi", beats: [
    c("talk", {}),
    ak([{ word: "LA CREATININA ES BASURA", sub: "el desecho que deja el músculo al trabajar", tone: "teal", atPhrase: "es un desecho" }], {}),
  ]},
  { key: "creatinina_que", phrase: "para que dimensiones", beats: [
    dg(D("creatinina_filtro"), "Creatinina = desecho; el riñón la filtra"),
    c("splitlist", { title: "El circuito de la creatinina", items: ["El músculo trabaja y deja basura", "Esa basura es la creatinina", "El riñón la filtra y la manda al pis"], palette: "T" }),
  ]},
  { key: "millon", phrase: "millon de filtritos", beats: [
    dg(D("millon_filtritos"), "Cada riñón: ~1 millón de filtritos que no se regeneran"),
    c("stat", { big: "1.000.000", unit: "filtritos", label: "tiene cada riñón. Los que se gastan con los años NO vuelven.", tone: "teal" }),
  ]},
  { key: "sube", phrase: "cuando la creatinina sube", beats: [
    ak([{ word: "EL FILTRO VA LENTO", sub: "no hay más basura: el riñón filtra menos", tone: "warn", atPhrase: "el filtro esta sacando menos" }], {}),
  ]},
  { key: "lucecita", phrase: "la lucecita del tablero", beats: [
    fc([{ t: "La" }, { t: "creatinina" }, { t: "es" }, { t: "el" }, { t: "aviso", hl: true }, { t: "no" }, { t: "el" }, { t: "problema" }], { tone: "warn", at: "no es el problema" }),
    r(P("tablero_luz")),
  ]},
  { key: "callado", phrase: "el organo mas callado", beats: [
    mv("El riñón te avisa cuando algo anda mal", "Es el órgano más callado: podés perder la mitad sin sentirlo", { flipPhrase: "sentirte mas o menos igual" }),
  ]},
  // ░░ POR QUÉ +60 → CIRCULACIÓN + STAKES ░░
  { key: "porque60", phrase: "con los anos riega menos", beats: [
    c("talk", {}),
    dg(D("circulacion_rinon"), "El riñón es un colador de sangre: sin buen riego, filtra mal"),
  ]},
  { key: "colador", phrase: "menos sangre con menos", beats: [
    ak([{ word: "COLADOR DE SANGRE", sub: "cuidar el riñón = cuidar cómo le llega la sangre", tone: "teal", atPhrase: "cuidar como le llega" }], {}),
  ]},
  { key: "stakes", phrase: "la puerta de la dialisis", beats: [
    c("checklist", { title: "Lo que está en juego si lo dejás correr", items: [
      { text: "Más cansancio y presión alta", state: "warn" },
      { text: "Piernas hinchadas a la tarde", state: "warn" },
      { text: "La puerta de la diálisis, 3 veces por semana", state: "warn" } ] }),
  ]},
  // ░░ EL MORRÓN ROJO (reveal) ░░
  { key: "reveal", phrase: "es el morron rojo", beats: [
    es("★", "El morrón rojo", { w: 3.8 }),
    r(P("morron_rojo"), { at: "el pimiento rojo", kicker: "La verdura #1", hold: true }),
  ]},
  { key: "porque_esta", phrase: "explico por que esta", beats: [
    dg(D("morron_beneficios"), "4 razones: bajo potasio · vitamina C · antioxidante · agua"),
    c("annotated", { at: "es de las poquisimas", caption: "Todo junto en un solo morrón", image: `img/${P("morron_rojo")}.png`, annotations: [{ x: 28, y: 34, label: "Bajo potasio" }, { x: 72, y: 30, label: "Vitamina C" }, { x: 32, y: 70, label: "Antioxidante" }, { x: 74, y: 66, label: "+90% agua" }] }),
  ]},
  // razón 1 potasio
  { key: "potasio", phrase: "baja en potasio", beats: [
    ak([{ word: "BAJO EN POTASIO", sub: "el riñón cansado no saca el potasio de más — y es peligroso", tone: "teal", atPhrase: "el potasio de mas" }], {}),
    dg(D("potasio_comparacion"), "Morrón: poco potasio · Banana y espinaca: mucho"),
  ]},
  { key: "banana_ej", phrase: "una banana tiene", beats: [
    r(P("banana_espinaca"), { at: "una taza de espinaca" }),
    c("bars", { title: "Potasio (carga para el riñón)", items: [
      { label: "Banana", value: 100, tone: "warn" },
      { label: "Espinaca hervida", value: 115, tone: "warn" },
      { label: "Morrón rojo", value: 30, tone: "teal" } ] }),
  ]},
  // razón 2 vitamina C
  { key: "vitc", phrase: "una bomba de vitamina", beats: [
    r(P("naranja_morron"), { at: "que una naranja" }),
    ak([{ word: "MÁS VIT. C QUE UNA NARANJA", sub: "antioxidante: protege las células del riñón", tone: "teal", atPhrase: "protege a las celulas" }], {}),
  ]},
  // razón 3 antioxidante
  { key: "antiox", phrase: "un antioxidante potente", beats: [
    dg(D("antioxidante_oxido"), "El óxido interno lastima los vasos; el antioxidante lo frena"),
  ]},
  { key: "oxido", phrase: "el oxido que agarra", beats: [
    fc([{ t: "Riñón" }, { t: "bien" }, { t: "regado" }, { t: "riñón" }, { t: "que" }, { t: "filtra" }, { t: "mejor", hl: true }], { tone: "teal", at: "rinon que filtra mejor" }),
  ]},
  // razón 4 agua/fibra
  { key: "agua_fibra", phrase: "es agua y fibra", beats: [
    r(P("morron_corte_agua"), { at: "casi todo el morron" }),
    c("splitlist", { title: "Agua + fibra", items: ["+90% agua: te hidrata sin darte cuenta", "Arrastra la basura hacia afuera", "La fibra cuida el azúcar en sangre"], palette: "T" }),
  ]},
  // comparación con otras verduras
  { key: "comparacion", phrase: "no es que sea la unica", beats: [
    c("talk", {}),
    c("process", { title: "La barra corta de verduras del riñón", eyebrow: "El morrón es el titular", steps: [
      { title: "Ajo y cebolla", desc: "buenos, pero condimento", image: `img/${P("ajo_cebolla")}.png` },
      { title: "Coliflor y repollo", desc: "buenos suplentes", image: `img/${P("coliflor_repollo")}.png` },
      { title: "Morrón rojo", desc: "junta todo", image: `img/${P("morron_rojo")}.png` } ] }),
  ]},
  { key: "titular", phrase: "el morron es el titular", beats: [
    r(P("verduras_rinon"), { at: "las otras son la compania" }),
  ]},
  // cómo comerlo + guía #1
  { key: "comerlo", phrase: "crudo o apenas cocido", beats: [
    c("talk", {}),
    dg(D("como_comerlo"), "Crudo o apenas cocido, en rojo — conserva la vitamina C"),
    c("process", { title: "Cómo comerlo bien", eyebrow: "Así conserva la vitamina C", steps: [
      { title: "Rojo maduro", desc: "no el verde", image: `img/${P("morron_rojo")}.png` },
      { title: "Crudo o 1 minuto", desc: "no 20 min hirviendo", image: `img/${P("morron_tiras")}.png` },
      { title: "En ensalada", desc: "varias veces por semana", image: `img/${P("morron_corte_agua")}.png` } ] }),
  ]},
  { key: "rojo", phrase: "en rojo siempre", beats: [
    r(P("morron_tiras"), { at: "cortalo en tiras" }),
    ak([{ word: "SIEMPRE EN ROJO", sub: "el verde es el mismo sin madurar: tiene menos", tone: "teal", atPhrase: "el mismo morron sin madurar" }], {}),
  ]},
  { key: "guia1", phrase: "en mi guia gratis", beats: [
    lt("La cantidad exacta y cómo combinarlo, en la guía gratis", { kicker: "Un regalo", desc: "El link está abajo, en la descripción. No te cuesta nada.", tone: "teal", at: "con el link en la descripcion" }),
  ]},
  // ░░ 3 ACOMPAÑANTES ░░
  { key: "acompanan", phrase: "las tres que lo acompanan", beats: [
    c("chips", { bg: "image", image: `img/${P("morron_rojo")}.png`, imageDarken: 0.6, title: "Lo que multiplica el efecto", chips: ["Agua a lo largo del día", "Menos sal de paquete", "Proteína medida + caminar"] }),
  ]},
  // agua
  { key: "agua1", phrase: "suena obvio pero la", beats: [
    es("01", "El agua", { w: 3.4 }),
  ]},
  { key: "sed", phrase: "la sensacion de sed", beats: [
    dg(D("sed_apaga"), "Con la edad se apaga la sed: tomás menos justo cuando más falta"),
    r(P("vaso_agua_dia"), { at: "el vaso de agua a media" }),
  ]},
  { key: "no_sed", phrase: "no esperar la sed", beats: [
    ak([{ word: "NO ESPERES LA SED", sub: "a tu edad, la sed llega tarde — tomá igual", tone: "warn", atPhrase: "la sed llega tarde" }], {}),
  ]},
  // sal
  { key: "sal1", phrase: "bajarle a la sal", beats: [
    es("02", "Menos sal de paquete", { w: 3.4 }),
  ]},
  { key: "escondida", phrase: "del enemigo escondido", beats: [
    r(P("fiambre_paquete"), { at: "el fiambre el pan" }),
    ak([{ word: "SAL ESCONDIDA", sub: "no es el salero: ya viene en la comida de paquete", tone: "warn", atPhrase: "ya viene metida adentro" }], {}),
  ]},
  { key: "presion", phrase: "la sal te sube", beats: [
    dg(D("sal_presion"), "Sal → presión alta → rompe los vasitos del filtro"),
    c("bars", { title: "Sodio escondido (carga para el riñón)", items: [
      { label: "Fiambre / embutido", value: 100, tone: "warn" },
      { label: "Caldo en cubito", value: 120, tone: "warn" },
      { label: "Comida casera sin paquete", value: 22, tone: "teal" } ] }),
  ]},
  // proteína
  { key: "prot1", phrase: "mas gente saltea", beats: [
    es("03", "Proteína medida", { w: 3.4 }),
    r(P("carne_roja_plato"), { at: "la carne roja todos los dias" }),
  ]},
  { key: "prot_mec", phrase: "mas creatinina generas", beats: [
    dg(D("proteina_desecho"), "Más carne de más = más desecho = más creatinina"),
    c("callout", { image: `img/${P("carne_roja_plato")}.png`, figure: "Que te entre en la palma", caption: "Moderá la porción; sumá pescado o huevo. El riñón te lo agradece." }),
  ]},
  { key: "mate", phrase: "el mate me hace mal", beats: [
    mv("El mate te hace mal al riñón", "El problema no es el mate: es el salame al lado", { flipPhrase: "lo que hace el salame" }),
  ]},
  // yapa 4 caminar
  { key: "yapa", phrase: "una yapa la cuarta", beats: [
    es("04", "Una caminata suave", { w: 3.4 }),
  ]},
  { key: "caminar", phrase: "una caminata suave", beats: [
    r(P("caminata_parque"), { at: "20 minutos despues" }),
    dg(D("caminar_circulacion"), "Caminar bombea sangre → mejor riego al filtro"),
  ]},
  { key: "pajaros", phrase: "tres pajaros de un tiro", beats: [
    c("splitlist", { title: "Una caminata después de comer", items: ["Te baja el azúcar", "Te ayuda con la presión", "Le manda sangre limpia al riñón"], palette: "G" }),
    c("callout", { image: `img/${P("caminata_parque")}.png`, figure: "20 minutos después de comer", caption: "Bombea sangre y le mejora el riego al filtro. Sin gastar un peso." }),
  ]},
  // auto-diagnóstico
  { key: "autodx", phrase: "cual es tu caso", beats: [
    ap([
      { card: "¿Jugo verde a la mañana?", sub: "pensando que hace bien", atPhrase: "el jugo verde a la manana" },
      { card: "¿Sal a todo por costumbre?", sub: "sin siquiera probar", atPhrase: "sal a todo por costumbre" },
      { card: "¿Días sin un vaso de agua?", sub: "solo café y mate", atPhrase: "un vaso de agua sola" },
    ], {}),
  ]},
  // mitos
  { key: "mitos", phrase: "romperte dos mitos", beats: [
    c("talk", {}),
    es("!", "Dos mitos que hay que romper", { tone: "warn", w: 3.6 }),
  ]},
  { key: "mito_limon", phrase: "agua con limon", beats: [
    mv("El agua con limón te limpia el riñón", "El limón es sano, pero no disuelve la creatinina: ayuda el agua", { flipPhrase: "es la hidratacion el agua" }),
  ]},
  { key: "mito_agua", phrase: "cuanta mas agua tome", beats: [
    ak([{ word: "NI POCA NI DEMASIADA", sub: "el agua de más no limpia mejor; puede hacer daño", tone: "warn", atPhrase: "puede ser hasta peligroso" }], {}),
  ]},
  // ░░ LÍMITES HONESTOS ░░
  { key: "honesto", phrase: "que ser honesto", beats: [
    c("talk", {}),
    lt("Esto NO es una cura ni reemplaza al médico", { kicker: "Escudo de honestidad", desc: "El morrón no destapa un riñón muy dañado. Va de la mano del control.", tone: "teal", at: "no es una cura" }),
  ]},
  { key: "avanzada", phrase: "enfermedad renal avanzada", beats: [
    ak([{ word: "MANDA TU NEFRÓLOGO", sub: "con enfermedad renal avanzada, el potasio se mide", tone: "warn", atPhrase: "manda tu nefrologo" }], {}),
  ]},
  { key: "senales", phrase: "senales que no son", beats: [
    c("checklist", { title: "Señales que van HOY al médico", items: [
      { text: "Mucho menos pis que antes", state: "warn" },
      { text: "Tobillos y piernas hinchados", state: "warn" },
      { text: "Pis espumoso o de otro color", state: "warn" },
      { text: "Cansancio sin razón y piel que pica", state: "warn" } ] }),
  ]},
  { key: "espumoso", phrase: "el pis espumoso", beats: [
    r(P("tobillos_hinchados"), { at: "se te hinchan los tobillos" }),
  ]},
  { key: "guia2", phrase: "impresas para pegar", beats: [
    lt("Las señales de alerta, impresas, en la guía gratis", { kicker: "Tenelas a mano", desc: "Para pegar en la heladera, por vos y por los tuyos.", tone: "teal", at: "en la puerta de la heladera" }),
  ]},
  // ░░ EL ERROR (pago del loop grande) ░░
  { key: "error", phrase: "te prometi el error", beats: [
    c("talk", {}),
    es("!", "El error que arruina el 90%", { tone: "warn", w: 3.8 }),
  ]},
  { key: "sano_bueno", phrase: "bueno para el rinon", beats: [
    mv("Sano y bueno para el riñón es lo mismo", "No lo son: lo sano para un riñón joven sobrecarga al cansado", { flipPhrase: "puede ser justo lo que" }),
  ]},
  { key: "acordas", phrase: "te acordas de ernesto", beats: [
    r(P("jugo_verde_licuadora"), { at: "el del jugo verde" }),
    c("splitlist", { title: "Sanísimo… para un riñón joven", items: ["Banana, espinaca cruda a lo bestia", "Jugo de naranja de litro, agua de coco", "Poroto y palta en exceso"], palette: "G" }),
  ]},
  // ░░ ENEMIGO ░░
  { key: "incomodar", phrase: "el polvito la licuadora", beats: [
    ak([{ word: "¿QUIÉN TE LO METE?", sub: "el que te vende el polvito y la licuadora de mil dólares", tone: "warn", atPhrase: "el polvito la licuadora" }], {}),
  ]},
  { key: "wellness", phrase: "verduleria no le deja", beats: [
    mv("Necesitás suplementos caros para el riñón", "Un morrón no le deja plata a nadie: por eso nadie te lo cuenta", { flipPhrase: "nadie te lo cuenta" }),
  ]},
  { key: "simple", phrase: "la salud simple", beats: [
    fc([{ t: "La" }, { t: "salud" }, { t: "simple" }, { t: "no" }, { t: "es" }, { t: "negocio", hl: true }], { tone: "warn", at: "no le deja plata" }),
    r(P("morron_heladera"), { at: "el cajon de abajo" }),
  ]},
  // ░░ RECAP ░░
  { key: "recap", phrase: "para que te quede grabado", beats: [
    fcards("El plan en 5", [
      { label: "Creatinina alta = filtro lento, el aviso", image: `img/${P("analisis_creatinina")}.png`, atPhrase: "la creatinina alta no" },
      { label: "Verdura #1: morrón rojo, crudo y rojo", image: `img/${P("morron_rojo")}.png`, atPhrase: "la verdura numero uno es" },
      { label: "Agua, menos sal, proteína, caminar", image: `img/${P("vaso_agua_dia")}.png`, atPhrase: "acompanalo con agua" },
      { label: "No confundas sano con bueno p/ tu riñón", image: `img/${P("jugo_verde_licuadora")}.png`, atPhrase: "no confundas sano" },
      { label: "Con creatinina alta, va con el médico", image: `img/${P("nefrologo_consulta")}.png`, atPhrase: "el mas importante de todos" },
    ], { at: "para que te quede grabado" }),
  ]},
  // ░░ CTA COMENTARIOS ░░
  { key: "comentarios", phrase: "contame en los comentarios", beats: [
    lt("¿Sabés tu último valor de creatinina? Escribilo", { kicker: "En los comentarios", desc: "Los leo todos. Y mandale este video a quien vive a jugo verde.", tone: "teal", at: "hace cuanto que no te" }),
  ]},
  // ░░ TEASER ░░
  { key: "teaser", phrase: "en el proximo video", beats: [
    lt("Próximo: una fruta que parece puro azúcar", { kicker: "No te lo pierdas", desc: "Es de las mejores amigas de tu presión y, de rebote, de tus riñones.", tone: "teal", at: "hay una fruta una sola" }),
  ]},
  // ░░ INJERTO GUÍA #3 (pitch completo) ░░
  { key: "guia3", phrase: "todo esto ordenado", beats: [
    r(P("guia_celular"), { at: "te dejo mi guia", hold: true }),
    c("chips", { bg: "image", image: `img/${P("guia_celular")}.png`, imageDarken: 0.62, title: "La Guía de la Salud +60", chips: ["Cantidades exactas del morrón", "Qué sí y qué no con la creatinina alta", "archivos-federer.vercel.app"] }),
  ]},
  // ░░ CIERRE ░░
  { key: "cierre", phrase: "acordate de una sola cosa", beats: [
    c("talk", {}),
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1360) + 2;

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
    const n = beat.items.length;
    // ms exacto de cada número (frames rel al inicio del beat); null si Whisper lo omitió
    const raw = beat.items.map((it) => { if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 0.5); if (ms != null) return Math.max(0, Math.round((ms - beat.start) * 30)); } return null; });
    // rellenar los null por interpolación monótona entre anclas conocidas
    for (let i = 0; i < n; i++) {
      if (raw[i] == null) {
        const prev = i > 0 ? raw[i - 1] : 0;
        let nj = i + 1; while (nj < n && raw[nj] == null) nj++;
        raw[i] = nj < n && raw[nj] != null ? Math.round(prev + (raw[nj] - prev) / (nj - (i - 1))) : prev + 60;
      }
      if (i > 0 && raw[i] <= raw[i - 1]) raw[i] = raw[i - 1] + 36; // monotonía (mín 1.2s entre tarjetas)
    }
    beat.items = beat.items.map((it, i) => { const { atPhrase, ...rest } = it; return { ...rest, at: raw[i] }; });
    beat.dur = +(raw[n - 1] / 30 + 3.2).toFixed(2); // 3.2s de hold tras enfocar la última
    beat.focusAnchored = raw.filter((_, i) => beat.items[i]).length;
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
