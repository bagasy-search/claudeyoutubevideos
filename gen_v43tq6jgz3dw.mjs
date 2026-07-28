// gen_v43tq6jgz3dw.mjs — beatsheet del video del slug v43tq6jgz3dw (canal "Dr. Federer").
// Avatar v43tq6jgz3dw_opt.mp4. Anclaje por FRASE a public/captions_v43tq6jgz3dw.json. Look CLÍNICO teal.
// Imágenes gpt-image-2: p_v43tq6jgz3dw_*.png + dg_v43tq6jgz3dw_*.png. Kit _fed6 COMPLETO.
//
// ⚠ LA TABLA `SECTIONS` ESTÁ EN PLACEHOLDER — se escribe con el guion real. Toda la maquinaria
//   (helpers, pesos W, findMs, post-passes atPhrase→at, MINC, QA) ya está cableada al slug nuevo.
//
// Salidas:
//   src/_fed6/VideoEdit/federer_v43tq6jgz3dw_beats.ts   → export FEDZ_BEATS
//   src/_fed6/VideoEdit/federer_v43tq6jgz3dw_hooks.ts   → export TALKSZ
//   beatsheet/v43tq6jgz3dw.json
//   public/avatar_clips_v43tq6jgz3dw.json
import fs from "fs";
const SLUG = "v43tq6jgz3dw";

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

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS — FIRMA:
//   { key, phrase, start?, beats: [...] }
//     key    → sección lógica; el Main pone AVATAR FULL en el beat _0 de las keys
//              /^(hook|story|principio|al[1-6]|objecion|limites|error|recap|cta|close)$/
//     phrase → frase LITERAL del guion (2..6 palabras) que ancla el inicio al ms del caption
//     start  → segundos fijos (solo la primera sección; si está, ignora `phrase`)
//     beats  → array de helpers, en orden. El beat 0 arranca en `start` de la sección;
//              los demás se reparten por PESO W, y se CLAVAN si traen `at` (frase literal).
//
// EJEMPLO DE CADA HELPER (referencia — descomentar/adaptar con el guion real):
//   c("talk", {})                                     // avatar hablando (ventana FULL)
//   r(P("manos_manchas"), { at: "mira tus manos", kicker: "Míralas ahora", hold: true })
//   dg(D("melanocito"), "Los melanocitos hacen el pigmento")
//   es("01", "Las manchas se aclaran", { w: 3.4, tone: "teal" })
//   mv("La piel se repara de día", "De día solo se defiende: la reparación es de noche", { flipPhrase: "la reparacion real" })
//   fc([{ t: "Un" }, { t: "problema" }, { t: "de" }, { t: "reparación", hl: true }], { tone: "teal", at: "un problema de reparacion" })
//   ak([{ word: "TIROSINASA", sub: "el interruptor del pigmento", tone: "teal", atPhrase: "la enzima se llama tirosinasa" }], {})
//   ap([{ word: "3 CAPAS", sub: "todas de noche", tone: "teal", atPhrase: "la rutina de tres capas" }], {})
//   lt("Las medidas exactas están en la descripción", { kicker: "Para que no anotes nada", desc: "La ficha completa, arriba en la descripción.", tone: "teal", at: "en la descripcion" })
//   ge("Guarda esto", ["Paso 1…", "Paso 2…", "Paso 3…"], { tag: "GUARDA" })
//   fz(P("bote_agua"), { x: 0.5, y: 0.5, label: "Sacar agua con el agujero abierto", zoom: 1.4, tone: "warn", at: "el agujero sigue abierto" })
//   c("checklist", { title: "…", items: [{ text: "…", state: "done" }, { text: "…", state: "warn" }] })
//   c("stat", { big: "2×", unit: "renovación celular", label: "…", tone: "teal" })
//   c("bars", { title: "…", unit: "", items: [{ label: "…", value: 100, winner: true }, { label: "…", value: 25 }] })
//   c("splitlist", { title: "…", items: ["…", "…", "…"], palette: "T" })
//   c("chips", { bg: "image", image: `img/${P("guia_telefono")}.png`, imageDarken: 0.62, title: "…", chips: ["…", "…"] })
//   c("process", { title: "…", eyebrow: "…", steps: [{ title: "…", desc: "…", image: `img/${P("x")}.png` }] })
//   c("nametag", { name: "Dr. Federer", role: "Médico general · Salud holística", image: `img/${P("federer_cocina")}.png`, at: "me llamo doctor federer" })
//   c("looplock", { title: "EL ERROR", sub: "te lo digo al final", at: "mas adelante en este video" })
//   c("focuscards", { title: "…", items: [{ image: `img/${P("x")}.png`, label: "1 · …", atPhrase: "primero …" }], at: "…" })
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  // ══ HOOK ═══════════════════════════════════════════════════════════════════
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    fc([{ t: "Seis" }, { t: "alimentos" }, { t: "de tu" }, { t: "cocina", hl: true }], { at: "ya tenés en la cocina" }),
    c("looplock", { title: "EL ERROR", sub: "que anula los seis", at: "y que anula la mitad" }),
    ak([{ word: "UNA CANA", sub: "no es un pelo que se pintó de blanco", tone: "teal", atPhrase: "Una cana no es un pelo" },
        { word: "SALIÓ SIN PINTAR", sub: "la fábrica bajó la persiana", tone: "warn", atPhrase: "es un pelo que salió" }], {}),
    r(P("lee_paper"), { at: "me cambió la cabeza", kicker: "Lo leí y no lo pude creer", hold: true }),
  ]},
  { key: "hook", phrase: "Tu propio cuerpo fabrica agua oxigenada", beats: [
    ap([{ word: "MELANOCITOS", sub: "la fábrica de pigmento, en el bulbo", tone: "teal", atPhrase: "células que se llaman melanocitos" },
        { word: "CATALASA", sub: "la enzima que barre el agua oxigenada", tone: "teal", atPhrase: "cuyo único trabajo es barrer" },
        { word: "SE JUNTA", sub: "con los años la catalasa baja", tone: "warn", atPhrase: "el peróxido se empieza a juntar" }], {}),
    c("callout", { figure: "2009", caption: "Karin Schallreuter · Universidad de Bradford · FASEB Journal", eyebrow: "El estudio", image: `img/${P("lee_paper")}.png`, at: "En dos mil nueve" }),
    fc([{ t: "El pelo" }, { t: "se decolora" }, { t: "a sí mismo", hl: true }], { tone: "warn", at: "el pelo se decolora" }),
    c("stat", { eyebrow: "Adentro de tu folículo", value: "H₂O₂", label: "el mismo peróxido que usan para decolorar en la peluquería", tone: "warn", at: "una peluquería trabajando adentro" }),
  ]},
  { key: "hook", phrase: "Y por eso te vendieron la tintura", beats: [
    mv("La tintura devuelve el color del pelo", "La tintura pinta el pelo muerto: la raíz sigue saliendo blanca", { flipPhrase: "la tintura no repigmenta nada" }),
    c("bars", { title: "Tintura vs. materia prima", unit: "", eyebrow: "Qué pasa en la raíz", bars: [{ label: "Tintura (color prestado)", value: 22, tone: "danger" }, { label: "Pigmento propio (melanina)", value: 100, winner: true }], at: "mete un color prestado" }),
    fc([{ t: "Es un" }, { t: "alquiler", hl: true }, { t: "no una" }, { t: "solución" }], { tone: "warn", at: "Es un alquiler" }),
  ]},

  // ══ STORY — ELSA ═══════════════════════════════════════════════════════════
  { key: "story", phrase: "te quiero contar de Elsa", beats: [
    c("talk", {}),
    c("lowerthird", { title: "Elsa, 71", desc: "Peluquera durante cuarenta años en Morón", kicker: "El caso", tone: "teal", at: "fue peluquera cuarenta años" }),
    c("quote", { text: "Me pasé la vida tapándole las canas a todo el mundo y nunca nadie me preguntó por qué salían.", image: `img/${P("consulta_elsa")}.png`, at: "yo me pasé la vida" }),
  ]},
  { key: "story", phrase: "A los sesenta y ocho dejó", beats: [
    c("checklist", { title: "Por qué tuvo que dejar de teñirse", items: [{ text: "Ardor y picazón en el cuero cabelludo", state: "warn" }, { text: "Placas rojas detrás de las orejas", state: "warn" }, { text: "Sensibilización a la parafenilendiamina", state: "warn" }], at: "Le empezó a arder" }),
  ]},
  { key: "story", phrase: "Apareció una cocina", beats: [
    r(P("mira_analisis"), { at: "los estudios que nadie", kicker: "Los estudios que nadie le pidió", hold: true }),
    c("bars", { title: "El análisis de Elsa", unit: "", eyebrow: "Lo que nadie miró", bars: [{ label: "Ferritina 9 (reserva de hierro)", value: 12, tone: "danger" }, { label: "Ferritina deseable", value: 100, winner: true }], at: "Ferritina en nueve" }),
    c("splitlist", { title: "El desayuno de media Argentina a los 70", items: ["Mate. Dos horas de mate.", "Dos tostadas.", "Un té con una galletita.", "A la noche, algo liviano."], palette: "T", at: "mate, dos tostadas" }),
  ]},
  { key: "story", phrase: "tres médicos distintos le dijeron", beats: [
    es("!", "«Es la edad» no es un diagnóstico", { tone: "warn", at: "no es un diagnóstico" }),
    fc([{ t: "A los 50" }, { t: "te estudian." }, { t: "A los 70" }, { t: "te dicen que es la edad", hl: true }], { tone: "warn", at: "Vos tenés cincuenta" }),
    r(P("escribe_lista"), { at: "le cambié la lista", kicker: "Le cambié la lista del supermercado" }),
    r(P("revisa_coronilla"), { at: "pelos oscuros en la raíz", kicker: "Siete meses después", hold: true }),
  ]},

  // ══ PRINCIPIO — EL COBRE ═══════════════════════════════════════════════════
  { key: "principio", phrase: "Empecemos por lo que casi todos", beats: [
    c("talk", {}),
    ap([{ word: "TIROSINASA", sub: "la enzima que fabrica la melanina", tone: "teal", atPhrase: "una enzima que se llama tirosinasa" },
        { word: "COBRE", sub: "el mineral que va encastrado adentro", tone: "teal", atPhrase: "Ese mineral es el COBRE" },
        { word: "SIN COBRE", sub: "no hay pigmento, por más melanocitos que tengas", tone: "warn", atPhrase: "Sin cobre, no hay tirosinasa" }], {}),
    fc([{ t: "El mineral" }, { t: "del que" }, { t: "nadie habla", hl: true }], { at: "del que nadie habla nunca" }),
    r(P("seis_alimentos_mesa"), { at: "te los cuento hoy uno por uno", kicker: "Los seis, uno por uno", hold: true }),
  ]},

  // ══ #1 SÉSAMO NEGRO ════════════════════════════════════════════════════════
  { key: "al1", phrase: "El primero es el sésamo negro", beats: [
    c("rule", { number: "01", title: "Sésamo negro" }),
    c("stat", { eyebrow: "Cada 100 g de sésamo", value: "4 mg", label: "de cobre · tu requerimiento diario es 0,9 mg", tone: "teal", at: "cuatro miligramos de cobre" }),
    r(P("muele_sesamo"), { at: "en un mortero", kicker: "Molido, siempre" }),
  ]},
  { key: "al1", phrase: "La semilla entera no te sirve", beats: [
    es("01", "Tragarla entera: todo el cobre te pasa de largo", { tone: "warn", at: "te sale igual del otro lado" }),
    c("process", { eyebrow: "Cómo se prepara", title: "Sésamo negro, en tres pasos", steps: [
      { title: "Tostar", desc: "Un minuto en sartén seca, hasta que salta", image: `img/${P("muele_sesamo")}.png` },
      { title: "Moler", desc: "Mortero, o el fondo de un vaso", image: `img/${P("muele_sesamo")}.png` },
      { title: "Guardar", desc: "Frasco de vidrio en la heladera", image: `img/${P("dos_frascos_sesamo")}.png` }], at: "Hay que romperla" }),
    r(P("dos_frascos_sesamo"), { at: "andá ahora a la alacena", kicker: "Blanco o negro: fijate ahora", hold: true }),
  ]},

  // ══ #2 HÍGADO ══════════════════════════════════════════════════════════════
  { key: "al2", phrase: "El segundo lo vas a odiar", beats: [
    c("rule", { number: "02", title: "Hígado" }),
    c("bars", { title: "Cobre cada 100 g", unit: " mg", eyebrow: "El campeón absoluto", bars: [{ label: "Sésamo", value: 4 }, { label: "Cacao amargo", value: 3.5 }, { label: "Hígado de vaca", value: 12, winner: true }], at: "entre nueve y catorce" }),
  ]},
  { key: "al2", phrase: "por qué me importa tanto la B doce", beats: [
    c("stat", { eyebrow: "100 g de hígado", value: "70 mcg", label: "de vitamina B12 · el requerimiento diario son 2,4 mcg", tone: "teal", at: "setenta microgramos de vitamina" }),
    c("splitlist", { title: "Lo que aparece cuando encanecen temprano", items: ["B12 baja.", "Ferritina baja.", "Cobre bajo."], palette: "T", at: "B doce baja, ferritina baja" }),
    fc([{ t: "Medicina" }, { t: "vieja," }, { t: "de manual", hl: true }], { at: "Es medicina vieja" }),
  ]},
  { key: "al2", phrase: "Y ahora la advertencia", beats: [
    c("checklist", { title: "Hígado: la letra chica", items: [{ text: "100 g, UNA vez por semana. Ni un día más.", state: "done" }, { text: "Vitamina A: se acumula, no se elimina", state: "warn" }, { text: "Embarazo: ni lo mires", state: "warn" }, { text: "Anticoagulantes: consultá antes (vitamina K)", state: "warn" }], at: "una cantidad enorme de vitamina" }),
    r(P("higado_bandeja"), { at: "Elsa lo hacía a la milanesa", kicker: "A la milanesa, al horno", hold: true }),
  ]},

  // ══ OBJECIÓN + MITO ════════════════════════════════════════════════════════
  { key: "objecion", phrase: "hay una objeción dando vueltas", beats: [
    c("talk", {}),
    c("quote", { text: "Doctor, pero las canas son genéticas. ¿Qué me va a hacer una semilla?", image: `img/${P("consulta_elsa")}.png`, at: "pero las canas son genéticas" }),
    mv("Si es genético, no hay nada que hacer", "La genética te da el CALENDARIO. La nutrición te da la VELOCIDAD", { flipPhrase: "La genética te da el CALENDARIO" }),
    c("bars", { title: "Dos hermanos, el mismo gen", unit: " años", eyebrow: "La diferencia la escribió la mesa", bars: [{ label: "Encanece entero", value: 55, tone: "danger" }, { label: "Media cabeza con color", value: 65, winner: true }], at: "Dos hermanos con el mismo gen" }),
  ]},
  { key: "objecion", phrase: "te desarmo el mito", beats: [
    mv("El romero y la cebolla en el cuero cabelludo devuelven el color", "Sirven para que el pelo CREZCA, no para que crezca CON COLOR", { flipPhrase: "no para que crezca CON COLOR" }),
    r(P("mito_romero_cebolla"), { at: "la cebolla en el cuero cabelludo", kicker: "Lo que me preguntan todas las semanas" }),
  ]},

  // ══ #3 NUEZ DE BRASIL ══════════════════════════════════════════════════════
  { key: "al3", phrase: "El tercero es la nuez de Brasil", beats: [
    c("rule", { number: "03", title: "Nuez de Brasil" }),
    ap([{ word: "DOS BOMBEROS", sub: "catalasa (hierro) y glutatión peroxidasa (selenio)", tone: "teal", atPhrase: "Tenés dos bomberos" },
        { word: "SELENIO", sub: "va adentro de la enzima que apaga el peróxido", tone: "teal", atPhrase: "y lleva SELENIO adentro" }], {}),
    c("stat", { eyebrow: "UNA sola nuez", value: "68-90 mcg", label: "de selenio · el requerimiento diario son 55 mcg", tone: "teal", at: "sesenta y ocho y noventa" }),
  ]},
  { key: "al3", phrase: "DOS por día", beats: [
    r(P("una_nuez_brasil"), { at: "bajale el fuego", kicker: "UNA por día. Dos como máximo.", hold: true }),
    es("!", "Selenosis: el primer síntoma es que se te CAE el pelo", { tone: "warn", at: "Se llama selenosis" }),
    c("checklist", { title: "Si te pasás de selenio", items: [{ text: "Se te cae el pelo", state: "warn" }, { text: "Uñas quebradizas", state: "warn" }, { text: "Aliento con olor a ajo", state: "warn" }], at: "Aliento con olor a ajo" }),
    fc([{ t: "En nutrición," }, { t: "más" }, { t: "no es mejor", hl: true }], { tone: "warn", at: "más no es mejor" }),
  ]},

  // ══ #4 HUEVO ═══════════════════════════════════════════════════════════════
  { key: "al4", phrase: "El cuarto es el huevo", beats: [
    c("rule", { number: "04", title: "Huevo entero" }),
    mv("La yema hay que sacarla, por el colesterol", "Todo lo que te importa está en la yema: B12, biotina, hierro y azufre", { flipPhrase: "está en la yema" }),
    r(P("separa_yema"), { at: "La clara es proteína y agua", kicker: "La yema, siempre" }),
  ]},
  { key: "al4", phrase: "entra en esta lista por el azufre", beats: [
    ak([{ word: "GLUTATIÓN", sub: "el antioxidante jefe · se fabrica con azufre", tone: "teal", atPhrase: "el jefe de todos" },
        { word: "QUERATINA", sub: "tu pelo se sostiene con puentes de azufre", tone: "teal", atPhrase: "se sostiene con puentes" }], {}),
    c("callout", { figure: "1-2", caption: "huevos por día, con la yema. Pasados por agua mejor que fritos.", eyebrow: "La cantidad", image: `img/${P("separa_yema")}.png`, at: "Uno o dos huevos" }),
  ]},

  // ══ #5 LENTEJAS ════════════════════════════════════════════════════════════
  { key: "al5", phrase: "el que no come hígado", beats: [
    c("rule", { number: "05", title: "Lentejas con limón" }),
    c("bars", { title: "Cuánto hierro absorbés de verdad", unit: "%", eyebrow: "Hemo vs. no hemo", bars: [{ label: "Hierro vegetal solo", value: 4, tone: "danger" }, { label: "Hierro de la carne", value: 22 }, { label: "Vegetal + vitamina C", value: 15, winner: true }], at: "se absorbe mal" }),
  ]},
  { key: "al5", phrase: "lentejas con jugo de medio limón", beats: [
    r(P("exprime_limon_lentejas"), { at: "al final, en el plato", kicker: "En el plato, no en la olla", hold: true }),
    es("02", "El limón adentro de la olla: el calor mata la vitamina C", { tone: "warn", at: "No adentro de la olla" }),
    c("splitlist", { title: "Si el limón no te gusta", items: ["Morrón rojo crudo picado arriba.", "Perejil fresco.", "Tomate.", "Con reflujo o gastritis: usá el morrón."], palette: "T", at: "un morrón rojo crudo" }),
  ]},

  // ══ #6 CACAO ═══════════════════════════════════════════════════════════════
  { key: "al6", phrase: "El cacao amargo", beats: [
    c("rule", { number: "06", title: "Cacao amargo" }),
    c("stat", { eyebrow: "100 g de cacao en polvo", value: "3,5 mg", label: "de cobre · a la altura del sésamo", tone: "teal", at: "tres miligramos y medio" }),
  ]},
  { key: "al6", phrase: "Los flavanoles del cacao mejoran", beats: [
    ap([{ word: "EL FOLÍCULO", sub: "trabaja 24 h y le llega por capilares finísimos", tone: "teal", atPhrase: "con más demanda de sangre" },
        { word: "ÓXIDO NÍTRICO", sub: "les dice a tus arterias que se abran", tone: "teal", atPhrase: "la producción de óxido nítrico" },
        { word: "MÁS RIEGO", sub: "la materia prima llega a destino", tone: "teal", atPhrase: "Más apertura, más riego" }], {}),
    fc([{ t: "Todo es" }, { t: "circulación", hl: true }], { at: "Siempre fue circulación" }),
    r(P("parte_chocolate"), { at: "Dos cuadraditos por día", kicker: "70% para arriba" }),
    es("03", "El chocolate del kiosco: 20% cacao, el resto azúcar", { tone: "warn", at: "el chocolate del kiosco" }),
  ]},

  // ══ LÍMITES HONESTOS ═══════════════════════════════════════════════════════
  { key: "limites", phrase: "Esos son los seis", beats: [
    c("talk", {}),
    fc([{ t: "El pelo" }, { t: "que ya salió" }, { t: "está muerto", hl: true }], { tone: "warn", at: "está afuera de tu cabeza" }),
    c("callout", { figure: "6-8", caption: "meses hasta ver raíz nueva pigmentada. El pelo crece 1 cm por mes.", eyebrow: "Cuánto tarda", image: `img/${P("revisa_coronilla")}.png`, at: "esto se mide en meses" }),
  ]},
  { key: "limites", phrase: "Segundo límite, y es el grande", beats: [
    c("bars", { title: "Funciona si te FALTABA", unit: "", eyebrow: "Ferritina", bars: [{ label: "Ferritina 9 → la subís", value: 100, winner: true }, { label: "Ferritina 120 → más cobre", value: 8, tone: "danger" }], at: "si tenías una carencia" }),
    r(P("orden_analisis"), { at: "pedí un análisis", kicker: "Ferritina · B12 · hemograma · tiroides", hold: true }),
    c("checklist", { title: "Los otros límites", items: [{ text: "Encaneciste a los 25: vas a frenar, no revertir", state: "warn" }, { text: "Si fumás, empezá por ahí", state: "warn" }], at: "sos genético fuerte" }),
  ]},
  { key: "limites", phrase: "si aparecen mechones blancos de golpe", beats: [
    es("!", "Esto NO es esto: andá al dermatólogo", { tone: "warn", at: "eso no es esto" }),
    c("checklist", { title: "Señales de alerta", items: [{ text: "Parches redondos bien delimitados", state: "warn" }, { text: "Mechón blanco con mancha en la piel", state: "warn" }, { text: "Cansancio raro y hormigueo en manos o pies", state: "warn" }, { text: "Lengua lisa y brillante", state: "warn" }], at: "en parches redondos" }),
  ]},

  // ══ EL ERROR (pago del loop) ═══════════════════════════════════════════════
  { key: "error", phrase: "Ahora sí. El error", beats: [
    c("talk", {}),
    es("01", "El horario del mate", { tone: "warn", at: "La primera es el mate" }),
    c("bars", { title: "Cuánto hierro te roban los taninos", unit: "%", eyebrow: "Tomados CON la comida", bars: [{ label: "Té", value: 55, tone: "danger" }, { label: "Café", value: 40, tone: "danger" }, { label: "Lejos de la comida", value: 0, winner: true }], at: "Los tres tienen taninos" }),
    c("splitlist", { title: "El desayuno que anula todo", items: ["Mate con las tostadas.", "Mate después de las tostadas.", "Mate en vez del almuerzo."], palette: "T", at: "Dos horas de mate" }),
  ]},
  { key: "error", phrase: "La regla es simple y es gratis", beats: [
    r(P("mate_y_reloj"), { at: "que lo corras de lugar", kicker: "1 h antes · 2 h después", hold: true }),
    ge("Corré el mate dos horas", ["1 hora ANTES de la comida con hierro", "o 2 horas DESPUÉS", "Nunca pegado al plato", "El café con leche arriba de las lentejas: lo peor"], { tag: "GUARDÁ ESTO", at: "Una hora antes" }),
  ]},
  { key: "error", phrase: "El zinc suelto", beats: [
    es("02", "El frasco de zinc que tomás para estar mejor", { tone: "warn", at: "un suplemento de zinc solo" }),
    ak([{ word: "MISMO TRANSPORTADOR", sub: "zinc y cobre compiten en el intestino", tone: "warn", atPhrase: "se absorben por el MISMO" },
        { word: "TE VACÍA EL COBRE", sub: "y el cobre es la pieza que te da el color", tone: "warn", atPhrase: "lo tira afuera" }], {}),
    r(P("frasco_zinc"), { at: "que sea con supervisión", kicker: "Zinc solo, a largo plazo: no" }),
    fc([{ t: "No es la" }, { t: "paciencia." }, { t: "Es el mate" }, { t: "y el zinc", hl: true }], { tone: "warn", at: "No es la paciencia" }),
  ]},

  // ══ RECAP ══════════════════════════════════════════════════════════════════
  { key: "recap", phrase: "Vamos al resumen", beats: [
    c("talk", {}),
    c("focuscards", { title: "Los seis", items: [
      { image: `img/${P("card_sesamo")}.png`, label: "1 · Sésamo negro molido", atPhrase: "Uno. Sésamo negro" },
      { image: `img/${P("card_higado")}.png`, label: "2 · Hígado, 1 vez por semana", atPhrase: "Dos. Hígado" },
      { image: `img/${P("card_nuez")}.png`, label: "3 · Nuez de Brasil, UNA", atPhrase: "Tres. Nuez de Brasil" },
      { image: `img/${P("card_huevo")}.png`, label: "4 · Huevo entero, con yema", atPhrase: "Cuatro. Huevo entero" },
      { image: `img/${P("card_lentejas")}.png`, label: "5 · Lentejas con limón", atPhrase: "Cinco. Lentejas con limón" },
      { image: `img/${P("card_cacao")}.png`, label: "6 · Cacao amargo 70%", atPhrase: "Seis. Cacao amargo" }] }),
    ge("La regla que los hace funcionar", ["El mate, el té y el café LEJOS de las comidas", "Una hora antes, dos horas después"], { tag: "LA REGLA", at: "la regla que los hace funcionar" }),
  ]},

  // ══ CTA ════════════════════════════════════════════════════════════════════
  { key: "cta", phrase: "Las cantidades exactas", beats: [
    c("nametag", { name: "Dr. Federer", role: "Federer Archivos", image: `img/${P("orden_analisis")}.png` }),
    c("chips", { bg: "image", image: `img/${P("escribe_lista")}.png`, imageDarken: 0.62, title: "archivos-federer.vercel.app", chips: ["Cantidades exactas", "Cómo se prepara el sésamo", "La receta del hígado", "Tabla de los 6 alimentos"], at: "en la guía gratuita" }),
    c("lowerthird", { title: "Contame a qué edad te salió la primera cana", desc: "Y de qué lado de la cabeza. Los leo todos.", kicker: "En los comentarios", tone: "teal", at: "Contame en los comentarios" }),
  ]},

  // ══ CIERRE ═════════════════════════════════════════════════════════════════
  { key: "close", phrase: "Que ya sé cuál va a ser", beats: [
    c("talk", {}),
    c("headline", { tokens: [{ t: "¿Por qué las" }, { t: "cejas", hl: true }, { t: "encanecen" }, { t: "15 años después?" }], eyebrow: "El próximo video", at: "Las cejas" }),
  ]},
  { key: "close", phrase: "Tu cuerpo no dejó de fabricar", beats: [
    r(P("cierre_elsa"), { at: "Se quedó sin material", kicker: "Se quedó sin material", hold: true }),
    fc([{ t: "Cuidate." }, { t: "Comé bien." }, { t: "Y movete el mate" }, { t: "dos horas", hl: true }], { at: "movete el mate dos horas" }),
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1164) + 2;

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
    const id = `${sec.key}_${si}_${i}`;
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

// ── BEATS EXTRA (overlays sobre el b-roll) ───────────────────────────────────
// Los OVERLAY (lowerthird / frasecinetica) y los carteles cortos (errorstinger / stat)
// van ENCIMA del b-roll: no lo tapan, lo anotan. Vienen en archivos aparte para poder
// densificar sin reescribir SECTIONS. Cada uno trae su `at` (frase literal del guion).
const OVERLAY_DUR = { lowerthird: 4.6, frasecinetica: 4.0, errorstinger: 2.6, stat: 4.4 };
let extraOK = 0, extraMiss = 0;
for (const f of fs.readdirSync("public").filter((x) => /^extra_beats_.*\.json$/.test(x))) {
  for (const e of JSON.parse(fs.readFileSync(`public/${f}`, "utf8"))) {
    // Anclaje TOLERANTE: la frase viene del GUION pero se busca en las CAPTIONS, y Whisper
    // escribe distinto los números ("100" vs "cien") y se come alguna palabra. Si la frase
    // entera no matchea, se prueba con prefijos cada vez más cortos (hasta 2 palabras).
    let t = findMs(e.at, 0);
    if (t == null) {
      const w = e.at.split(/\s+/).filter(Boolean);
      for (let k = w.length - 1; k >= 2 && t == null; k--) t = findMs(w.slice(0, k).join(" "), 0);
      for (let off = 1; off + 2 <= w.length && t == null; off++) t = findMs(w.slice(off, off + 3).join(" "), 0);
    }
    if (t == null) { extraMiss++; continue; }
    const { at, kind, ...props } = e;
    const b = { id: `x_${extraOK}`, start: +t.toFixed(2), dur: OVERLAY_DUR[kind] || 4.2, key: "extra", kind, ...props };
    if (kind === "frasecinetica" && Array.isArray(b.words)) b.perWord = b.perWord || 10;
    beats.push(b); extraOK++;
  }
}
beats.sort((a, b) => a.start - b.start);
if (extraOK || extraMiss) console.log(`beats extra: +${extraOK} anclados · ${extraMiss} sin ancla`);

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
    beat.dur = +(last / 30 + 4.5).toFixed(2);
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
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", clipsfirst: true, beats }, null, 1));

// ── QA ──
const need = new Set();
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); if (Array.isArray(b.steps)) b.steps.forEach((s) => s && s.image && need.add(s.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats.length ? beats[beats.length - 1].start + beats[beats.length - 1].dur : 0;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100 * raw / (beats.length || 1)).toFixed(0)}%) · diagramas: ${kinds.diagram || 0} · dur: ${dur.toFixed(0)}s (${(dur / 60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
console.log("IMG_NEEDED:" + [...need].join(","));
