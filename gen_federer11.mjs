// gen_federer11.mjs — beatsheet/federer11.json (Canal "Federer Archivos" · Dr. Federer · PIERNAS HINCHADAS / RETENCIÓN +60).
// Avatar federer11_opt.mp4 (~21min, TÚ mexicano). Anclaje por FRASE a captions_federer11.json.
// Look CLÍNICO teal. Imágenes gpt-image-2 (.png): fe11_*.png + dg_fe11_*.png. Kit premium COMPLETO.
// Estructura: HOOK (Carmen 86, tobillos hinchados, "ya me resigné") → por qué se hinchan (cañerías/válvulas/bomba
// pantorrilla → válvulas flojas → linfático lento → sal retiene agua = 3 fallas) → SEÑAL DE ALERTA (firme) →
// REVELACIÓN (semillas de calabaza = magnesio + perejil = diurético, y POR QUÉ de noche) → PASO A PASO (puñado /
// infusión tibia / almohada bajo los pies) → EL ERROR (la cena salada) → Carmen vuelve (emotivo) → Don Ernesto
// (calambres → sueño → todo conectado) → 4 consejos (agua/moverse/no cruzar/constancia) → injertos guía (drfederer.com)
// → carnada comentarios/comparte → cierre. Diagramas SIN eyebrow. Salida a src/_fed6/VideoEdit/.
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o }); // SIN eyebrow
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

const SECTIONS = [
  // ░░ HOOK — CARMEN 86 ░░
  { key: "hook", phrase: null, start: 1.0, beats: [
    c("talk", {}),
    r("fe11_carmen_tobillos", { at: "me mostró sus tobillos", kicker: "Carmen, 86 años. Tobillos a punto de reventar." }),
  ]},
  { key: "impresionaron", phrase: "las de carmen me impresionaron", beats: [
    r("fe11_tobillo_brilla", { at: "la piel brillaba", hold: true }),
    c("callout", { image: "img/fe11_tobillo_brilla.png", figure: "«La piel brilla, tensa»", caption: "Cuando la piel del tobillo brilla estirada, hay líquido empujando desde adentro.", at: "a punto de reventar" }),
  ]},
  { key: "presion", phrase: "cuando presioné con el dedo", beats: [
    ak([{ word: "LA MARCA NO VUELVE", sub: "presionas el tobillo y el hoyito tarda en desaparecer: eso es líquido retenido", tone: "warn", atPhrase: "una marca hundida" }], {}),
  ]},
  { key: "resigne", phrase: "ya me resigné", beats: [
    c("talk", {}),
    mv("Las piernas hinchadas son normales a mi edad", "No es normal — es una SEÑAL que tu cuerpo te manda", { flipPhrase: "es una señal" }),
  ]},
  { key: "senal", phrase: "tu cuerpo te está avisando", beats: [
    ak([{ word: "TU CUERPO TE ESTÁ AVISANDO", sub: "piernas hinchadas después de los 60 = una señal que casi nadie sabe leer", tone: "warn", atPhrase: "casi nadie te enseña" }], {}),
  ]},
  { key: "error_tease", phrase: "hay un error", beats: [
    fc([{ t: "Y" }, { t: "hay" }, { t: "un" }, { t: "ERROR", hl: true }, { t: "cada" }, { t: "noche" }], { tone: "warn", at: "un error pequeñísimo" }),
  ]},
  { key: "promesa", phrase: "qué puedes comer esta noche", beats: [
    c("talk", {}),
  ]},
  // ░░ POR QUÉ SE HINCHAN — MECANISMO ░░
  { key: "porque_cumplimos", phrase: "cuando cumplimos años", beats: [
    c("talk", {}),
  ]},
  { key: "canerias", phrase: "una casa con cañerías", beats: [
    dg("dg_fe11_canerias", "Tu cuerpo es una casa con cañerías: la sangre baja fácil, subir cuesta"),
  ]},
  { key: "valvulas", phrase: "unas válvulas pequeñitas", beats: [
    dg("dg_fe11_valvulas", "Válvulas dentro de las venas: compuertas que dejan subir la sangre y no bajar"),
  ]},
  { key: "bomba", phrase: "una bomba que llevas", beats: [
    ak([{ word: "TUS PANTORRILLAS SON UNA BOMBA", sub: "al caminar, el músculo aprieta las venas y empuja la sangre hacia el corazón", tone: "teal", atPhrase: "aprietan las venas" }], {}),
  ]},
  { key: "desgastan", phrase: "se van desgastando", beats: [
    dg("dg_fe11_valvulas_flojas", "Con los años las compuertas se aflojan: la sangre se escurre y se estanca abajo"),
  ]},
  { key: "estancada", phrase: "estancada en tus tobillos", beats: [
    r("fe11_tobillo_hinchado_cerca", { at: "esa marca que queda", hold: true }),
    c("annotated", { image: "img/fe11_tobillo_hinchado_cerca.png", eyebrow: "Dónde se acumula", caption: "La sangre se estanca abajo y empuja líquido a los tejidos", annotations: [
      { label: "Tobillo hinchado", x: 42, y: 55 },
      { label: "Empeine y pie", x: 60, y: 74 } ], at: "hacia los tejidos" }),
  ]},
  { key: "linfatico", phrase: "tu sistema linfático", beats: [
    dg("dg_fe11_linfatico", "El sistema linfático (tu drenaje) se vuelve lento — como una esponja que no exprime"),
  ]},
  { key: "sodio", phrase: "retienen más sodio", beats: [
    dg("dg_fe11_sal_agua", "Los riñones retienen más sal, y donde hay sal hay agua: la sal es un imán de agua"),
  ]},
  { key: "zapatos", phrase: "no te entran los zapatos", beats: [
    r("fe11_zapatos_no_entran", { at: "al final del día", hold: true }),
  ]},
  { key: "tres_fallas", phrase: "tres cosas fallando", beats: [
    c("chips", { bg: "image", image: "img/fe11_piernas_mayor.png", imageDarken: 0.55, title: "No es la vejez, es fisiología", chips: ["Válvulas flojas", "Drenaje lento", "Sal que retiene agua"] }),
  ]},
  { key: "puedes_influir", phrase: "en las tres puedes influir", beats: [
    fc([{ t: "En" }, { t: "las" }, { t: "TRES" }, { t: "puedes" }, { t: "influir", hl: true }], { tone: "teal", at: "con lo que comes" }),
  ]},
  // ░░ SEÑAL DE ALERTA (honestidad) ░░
  { key: "advertir", phrase: "advertirte algo serio", beats: [
    c("talk", {}),
    c("splitlist", { title: "No todas las piernas hinchadas son iguales", items: ["La gran mayoría: circulación cansada, mejora en casa", "La señal de alerta: al médico, sin demora"], tone: "teal", at: "no todas las piernas" }),
  ]},
  { key: "alerta_lista", phrase: "una sola pierna", beats: [
    c("checklist", { title: "Ve a tu médico si...", tone: "warn", items: [
      { text: "Hinchazón repentina en UNA sola pierna", state: "warn" },
      { text: "Viene con falta de aire", state: "warn" },
      { text: "O con dolor en el pecho", state: "warn" } ], at: "o con dolor en el pecho" }),
  ]},
  { key: "no_reemplaza", phrase: "no reemplazar a quien", beats: [
    lt("Yo te acompaño. Tu médico te revisa.", { kicker: "Que quede claro", desc: "La mayoría de las piernas hinchadas es circulación cansada y mejora en casa. Pero si tienes una señal de alerta, ve a tu médico. Cada quien su trabajo.", tone: "teal", at: "cuidarte con cabeza" }),
  ]},
  // ░░ REVELACIÓN — EL REMEDIO ░░
  { key: "recete_carmen", phrase: "lo que le receté a carmen", beats: [
    c("talk", {}),
    r("fe11_hija_rie", { at: "su hija se rió", kicker: "Tan simple que su hija se rió" }),
  ]},
  { key: "como_cuando", phrase: "sino como y cuando", beats: [
    ak([{ word: "NO ES SOLO QUÉ — ES CÓMO Y CUÁNDO", sub: "el mismo alimento, a la hora correcta, cambia todo", tone: "teal", atPhrase: "lo cambia todo" }], {}),
  ]},
  { key: "primera_semillas", phrase: "la primera son las", beats: [
    es("01", "Semillas de calabaza (pepitas)", { tone: "teal", w: 3.2, eyebrow: "El remedio" }),
    r("fe11_semillas_calabaza", { at: "esas tepitas verdes", hold: true }),
  ]},
  { key: "segunda_perejil", phrase: "la segunda es el perejil", beats: [
    es("02", "Perejil común y corriente", { tone: "teal", w: 3.2, eyebrow: "El remedio" }),
    r("fe11_perejil_fresco", { at: "que casi nunca te comes", hold: true }),
  ]},
  { key: "magnesio_rico", phrase: "más ricas de magnesio", beats: [
    dg("dg_fe11_magnesio_venas", "El magnesio relaja y da flexibilidad a las paredes de las venas: empujan mejor la sangre"),
    c("bars", { w: 1.6, title: "Magnesio (mg por 30 g, aprox.)", unit: "mg", bars: [
      { label: "Semilla de calabaza", value: 150, tone: "teal", note: "la campeona" },
      { label: "Almendra", value: 80, tone: "teal" },
      { label: "Espinaca cocida", value: 45, tone: "teal" } ], at: "oro puro" }),
  ]},
  { key: "oro_puro", phrase: "es oro puro", beats: [
    ak([{ word: "MAGNESIO = VENAS FLEXIBLES", sub: "una vena flexible trabaja mejor y sube la sangre de vuelta", tone: "teal", atPhrase: "trabajan mejor" }], {}),
  ]},
  { key: "potasio_sodio", phrase: "de la mano con el potasio", beats: [
    dg("dg_fe11_potasio_sodio", "Magnesio + potasio empujan el exceso de sodio afuera — y con la sal se va el agua"),
  ]},
  { key: "tesoro", phrase: "un pequeño tesoro", beats: [
    c("chips", { title: "Semilla de calabaza — un paquete completo", chips: ["Magnesio", "Potasio", "Antioxidantes", "Grasas antiinflamatorias"], tone: "teal", at: "la gente tira a la basura" }),
  ]},
  { key: "perejil_diuretico", phrase: "de los diuréticos naturales", beats: [
    dg("dg_fe11_perejil_rinon", "El perejil: diurético suave — ayuda al riñón a soltar el líquido que sobra"),
  ]},
  { key: "equipo", phrase: "para trabajar en equipo", beats: [
    c("process", { title: "Trabajan en equipo", eyebrow: "Uno saca, el otro fortalece", steps: [
      { title: "Perejil", desc: "saca el líquido que sobra", image: "img/fe11_perejil_fresco.png" },
      { title: "Semilla", desc: "relaja las venas, equilibra minerales", image: "img/fe11_semillas_calabaza.png" },
      { title: "Juntos", desc: "más que la suma de sus partes", image: "img/fe11_semillas_perejil.png" } ], at: "la suma de sus partes" }),
  ]},
  { key: "por_que_noche", phrase: "por qué de noche", beats: [
    dg("dg_fe11_noche_drenaje", "De noche tus piernas quedan al nivel del corazón: tu cuerpo drena mejor"),
  ]},
  { key: "corriente", phrase: "a favor de la corriente", beats: [
    ak([{ word: "DÁSELO ANTES DE DORMIR", sub: "ayudas a tu cuerpo justo cuando más está drenando: remas a favor de la corriente", tone: "teal", atPhrase: "remar a favor" }], {}),
  ]},
  // ░░ PASO A PASO ░░
  { key: "paso1", phrase: "un puñado pequeño", beats: [
    es("01", "Un puñado de semillas", { tone: "teal", w: 3.0, eyebrow: "Paso" }),
    r("fe11_semillas_mano", { at: "el cuenco de tu mano", hold: true }),
  ]},
  { key: "sin_sal", phrase: "crudas o tostadas sin sal", beats: [
    ak([{ word: "SIN SAL", sub: "si les echas sal haces justo lo contrario de lo que queremos", tone: "warn", atPhrase: "justo lo contrario" }], {}),
  ]},
  { key: "paso2", phrase: "la infusión de perejil", beats: [
    es("02", "Infusión de perejil, tibia", { tone: "teal", w: 3.0, eyebrow: "Paso" }),
    r("fe11_infusion_taza", { at: "una taza de agua", hold: true }),
  ]},
  { key: "reposar", phrase: "reposar 5 minutos", beats: [
    c("process", { title: "La infusión, paso a paso", eyebrow: "Facilísima", steps: [
      { title: "Calienta", desc: "una taza de agua, sin hervir fuerte", image: "img/fe11_infusion_taza.png" },
      { title: "Reposa", desc: "perejil 5 minutos, tapado", image: "img/fe11_perejil_picado.png" },
      { title: "Cuela y toma", desc: "tibio, con unas gotas de limón", image: "img/fe11_colar_te.png" } ], at: "lo cuelas y te lo tomas" }),
  ]},
  { key: "paso3", phrase: "un pequeño truco", beats: [
    es("03", "Las piernas un poco elevadas", { tone: "teal", w: 3.0, eyebrow: "Paso" }),
    r("fe11_almohada_pies", { at: "una almohada debajo de", hold: true }),
  ]},
  { key: "combinacion", phrase: "por dentro y por fuera", beats: [
    ge("Tu ritual de esta noche", ["Un puñado de semillas de calabaza (sin sal)", "Una infusión de perejil tibia", "Las piernas sobre una almohada"], { at: "todo empujando en la misma" }),
  ]},
  // ░░ EL ERROR — LA CENA SALADA ░░
  { key: "error", phrase: "recuerdas que al principio", beats: [
    c("talk", {}),
    es("!", "La cena salada", { tone: "warn", w: 3.2, eyebrow: "El error" }),
  ]},
  { key: "cena_salada", phrase: "una sopa de sobre", beats: [
    r("fe11_cena_salada", { at: "cualquier comida procesada", hold: true }),
    c("checklist", { title: "La bomba de sal antes de dormir", tone: "warn", items: [
      { text: "Sopa de sobre", state: "warn" },
      { text: "Embutidos", state: "warn" },
      { text: "Pan con quesos curados", state: "warn" } ], at: "una bomba de sal" }),
    c("bars", { w: 1.6, title: "Sodio en la cena (mg, aprox.)", unit: "mg", bars: [
      { label: "Sopa de sobre", value: 1200, tone: "danger", note: "una bomba" },
      { label: "Embutidos", value: 900, tone: "danger" },
      { label: "Cena casera ligera", value: 250, tone: "teal", note: "así sí" } ], at: "la sal de la cena" }),
  ]},
  { key: "canilla", phrase: "vaciar una tina", beats: [
    ak([{ word: "ES VACIAR UNA TINA CON LA CANILLA ABIERTA", sub: "el perejil saca agua por un lado, la sal la retiene por el otro", tone: "warn", atPhrase: "la canilla abierta" }], {}),
  ]},
  { key: "lo_que_quitas", phrase: "sino lo que quitas", beats: [
    mv("El secreto es solo lo que agregas", "La mitad de la batalla es lo que QUITAS: una cena ligera y baja en sal", { flipPhrase: "una cena ligera" }),
  ]},
  { key: "piernas_de_antes", phrase: "sus piernas de antes", beats: [
    fc([{ t: "Volver" }, { t: "a" }, { t: "tus" }, { t: "piernas" }, { t: "de" }, { t: "antes", hl: true }], { tone: "teal", at: "sus piernas de antes" }),
  ]},
  // ░░ CTA 1 (guía) ░░
  { key: "no_magia", phrase: "es entender a tu cuerpo", beats: [
    c("talk", {}),
  ]},
  { key: "injerto1", phrase: "cuidar tu cuerpo después", beats: [
    lt("Todo esto, ordenado para tu edad", { kicker: "Lo reuní para ti", desc: "Los alimentos que desinflaman y los que te hinchan sin que lo sepas, en una guía sencilla con letra grande. Te dejé el enlace arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "el enlace arriba de todo" }),
  ]},
  // ░░ CARMEN VUELVE ░░
  { key: "carmen_vuelve", phrase: "te acuerdas de carmen", beats: [
    c("talk", {}),
    r("fe11_carmen_consultorio", { at: "los tobillos brillantes", hold: true }),
  ]},
  { key: "sin_fallar", phrase: "todas las noches sin fallar", beats: [
    ak([{ word: "TODAS LAS NOCHES, SIN FALLAR", sub: "Carmen lo hizo en serio, con la terquedad hermosa de las abuelas", tone: "teal", atPhrase: "decidió intentarlo" }], {}),
  ]},
  { key: "tres_semanas", phrase: "tres semanas después", beats: [
    r("fe11_carmen_feliz", { at: "caminaba distinto", kicker: "Tres semanas después", hold: true }),
    c("process", { title: "El cambio de Carmen", eyebrow: "Constancia, todas las noches", steps: [
      { title: "Día 1", desc: "tobillos brillantes, el hoyito no vuelve", image: "img/fe11_carmen_tobillos.png" },
      { title: "Semana 1", desc: "empieza a bajar la hinchazón", image: "img/fe11_tobillo_hinchado_cerca.png" },
      { title: "Semana 3", desc: "se marcan los huesitos del tobillo", image: "img/fe11_tobillo_sano.png" } ], at: "se subió el pantalón" }),
  ]},
  { key: "huesitos", phrase: "los huesitos del tobillo", beats: [
    r("fe11_tobillo_sano", { at: "la piel ya no brillaba", hold: true }),
  ]},
  { key: "primera_vez", phrase: "por primera vez en más", beats: [
    lt("«Por primera vez en una década, mis piernas no se hinchan»", { kicker: "Carmen, 86 años", desc: "Puedo cruzar una pierna sobre la otra. Puedo ponerme los zapatos por la mañana sin pelear.", tone: "teal", at: "cruzar una pierna sobre" }),
  ]},
  { key: "tu_puedes", phrase: "tú también puedes", beats: [
    fc([{ t: "Si" }, { t: "Carmen" }, { t: "pudo," }, { t: "tú" }, { t: "también", hl: true }], { tone: "teal", at: "tú también puedes" }),
  ]},
  // ░░ DON ERNESTO ░░
  { key: "don_ernesto", phrase: "hay un señor don ernesto", beats: [
    c("talk", {}),
    r("fe11_ernesto_calambre", { at: "calambres terribles", kicker: "Don Ernesto — calambres a las 3 de la madrugada", hold: true }),
  ]},
  { key: "primos", phrase: "son primos hermanos", beats: [
    ak([{ word: "CALAMBRES Y PIERNAS HINCHADAS: PRIMOS HERMANOS", sub: "misma raíz: falta de magnesio y mala circulación", tone: "teal", atPhrase: "la misma raíz" }], {}),
  ]},
  { key: "noche_entera", phrase: "la noche entera", beats: [
    r("fe11_dormir_placido", { at: "dormía la noche entera", hold: true }),
  ]},
  { key: "sistema_nervioso", phrase: "calma tu sistema nervioso", beats: [
    dg("dg_fe11_magnesio_sueno", "El magnesio relaja los músculos y calma el sistema nervioso: mejor descanso"),
  ]},
  { key: "conectado", phrase: "todo está conectado", beats: [
    c("chips", { title: "Cuidas una cosa y se acomodan tres", chips: ["Piernas desinflamadas", "Menos calambres", "Mejor sueño", "Más energía"], tone: "teal", at: "un cuerpo que rinde" }),
  ]},
  // ░░ 4 CONSEJOS ░░
  { key: "consejos_intro", phrase: "algunos consejos extra", beats: [
    c("talk", {}),
    c("process", { title: "Tu día, sin complicarte", eyebrow: "Cuatro gestos simples", steps: [
      { title: "Todo el día", desc: "agua a sorbos, sin esperar la sed", image: "img/fe11_vaso_agua.png" },
      { title: "Cada hora", desc: "mueve los pies, activa la bomba", image: "img/fe11_caminar_parque.png" },
      { title: "En la noche", desc: "semillas, perejil y piernas arriba", image: "img/fe11_semillas_mano.png" } ], at: "ganar esta batalla" }),
  ]},
  { key: "consejo1", phrase: "consejo número 1", beats: [
    es("01", "El agua (toma más, no menos)", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    r("fe11_vaso_agua", { at: "dejar de tomar agua", hold: true }),
  ]},
  { key: "modo_ahorro", phrase: "en modo ahorro", beats: [
    mv("Si retengo líquido, mejor tomo menos agua", "Al revés: sin agua tu cuerpo entra en modo ahorro y retiene MÁS", { flipPhrase: "y es al revés" }),
  ]},
  { key: "consejo2", phrase: "consejo número 2", beats: [
    es("02", "Muévete, aunque sea poco", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    r("fe11_caminar_parque", { at: "la bomba se apaga", hold: true }),
  ]},
  { key: "acelerador", phrase: "el acelerador de un carro", beats: [
    ak([{ word: "BOMBEA SENTADO", sub: "sube y baja las puntas de los pies, como pisando el acelerador, 10-20 veces", tone: "teal", atPhrase: "subiendo y bajando las puntas" }], {}),
  ]},
  { key: "consejo3", phrase: "consejo número 3", beats: [
    es("03", "No aprietes tus venas", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
    r("fe11_piernas_cruzadas", { at: "las piernas cruzadas", hold: true }),
  ]},
  { key: "consejo4", phrase: "quizás el más importante", beats: [
    es("04", "La constancia", { tone: "teal", w: 3.0, eyebrow: "Consejo" }),
  ]},
  { key: "constancia", phrase: "no mejoró en un día", beats: [
    ak([{ word: "NOCHE TRAS NOCHE", sub: "Carmen no mejoró en un día — mejoró porque fue constante. Está a tu alcance.", tone: "teal", atPhrase: "está al alcance tuyo" }], {}),
  ]},
  // ░░ CTA 2 (guía completa) ░░
  { key: "injerto2", phrase: "un plan completo para", beats: [
    fz("fe11_libro_guia", { at: "tres guías que complementan", kicker: "Las 3 guías · enlace arriba en la descripción", link: "drfederer.com" }),
  ]},
  { key: "inversion", phrase: "la mejor inversión", beats: [
    lt("La mejor inversión: los años que te quedan", { kicker: "Para vivirlos de pie", desc: "Un plan completo para cuidar tu cuerpo después de los 60: circulación, articulaciones, energía y descanso. El enlace está arriba, en la descripción.", link: "drfederer.com", tone: "teal", at: "los años que te quedan" }),
  ]},
  // ░░ CIERRE ░░
  { key: "despedirme", phrase: "antes de despedirme", beats: [
    c("talk", {}),
  ]},
  { key: "imagina", phrase: "caminar hasta la esquina", beats: [
    c("splitlist", { title: "Imagina tus piernas livianas otra vez", items: ["Zapatos que entran por la mañana", "Caminar sin ese peso, sin esa presión"], tone: "teal", at: "sin sentir ese peso" }),
  ]},
  { key: "no_resignes", phrase: "nunca te resignes", beats: [
    fc([{ t: "No" }, { t: "te" }, { t: "resignes." }, { t: "Empieza" }, { t: "HOY", hl: true }], { tone: "teal", at: "empieza hoy" }),
  ]},
  { key: "cta_coment", phrase: "suscríbete a este canal", beats: [
    lt("¿Hace cuánto sufres las piernas hinchadas?", { kicker: "Cuéntame abajo", desc: "Déjame un me gusta, suscríbete, y compártelo con alguien que ya se resignó. Puede que le cambies la vida.", tone: "teal", at: "compártelo con esa persona" }),
  ]},
  { key: "cierre", phrase: "nos vemos muy pronto", beats: [
    c("nametag", { name: "Dr. Federer", role: "Esta noche ya sabes lo que tienes que hacer", image: "img/fe11_federer_cocina.png" }),
  ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado federer10) ───────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_federer11.json", "utf8"));
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1258) + 2;

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

// ── POST-PASS MILIMÉTRICO (avatarpizarra/keyword + mitoverdad) ───────
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
    beat.clip = `avatar_clips/federer11/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) {
    const ms = findMs(beat.flipPhrase, beat.start - 1);
    const lastSafe = Math.round(beat.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42);
    beat.flipAt = f; delete beat.flipPhrase;
  }
  if (beat.kind === "errorstinger" && !beat.eyebrow) {
    beat.eyebrow = "Razón";
  }
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_federer11.json", JSON.stringify(KIT_CLIPS, null, 1));

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
fs.writeFileSync("src/_fed6/VideoEdit/federer11_beats.ts",
  `// AUTO-GENERADO por gen_federer11.mjs — beats (imágenes fe11_*.png / dg_fe11_*.png).\n` +
  `export const FED11_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/federer11_hooks.ts",
  `// AUTO-GENERADO por gen_federer11.mjs — rangos talk.\n` +
  `export const TALKS11: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/federer11.json", JSON.stringify({ video: "federer11", avatar: "federer11_opt.mp4", theme: "medico", beats }, null, 1));

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
console.log("MISS:", miss.join(" "));
