// gen_coagulos.mjs — beatsheet "Eliminá los COÁGULOS de las Piernas Rápidamente" (Dr. Federer, salud +60).
// Avatar coagulos_opt.mp4. Material: b-roll REAL (Pexels, capa densa aparte) + componentes DIBUJADOS
// POR CÓDIGO (nada de IA ilustrativa). IA gpt-image-2 SOLO para fotos del presentador (nametag/cierre).
// Escudo de honestidad: separa mala circulación (benigno) de la SEÑAL DE ALARMA (urgencia). Las 5 señales
// van derechas (guardaesto + errorstingers warn). CTA embudo suave a la descripción, sin link/precio en voz.
import fs from "fs";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });
const pz = (items, o = {}) => ({ t: "avatarpizarra", items, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6 };

// ── SECCIONES (ancladas por FRASE textual del caption de whisper) ─────────────────
const SECTIONS = [
  // ───────────── HOOK (0 → ~55s): desproporcionado, planos cortos ─────────────
  { key: "hook_sintoma", phrase: "Se te hinchan los tobillos", start: 0.4, beats: [ c("talk", {}) ]},
  { key: "hook_pesadas", phrase: "las piernas pesadas", beats: [
    fc([{ t: "Piernas" }, { t: "PESADAS", hl: true }], { tone: "warn" }) ]},
  { key: "hook_calambre", phrase: "un calambre te despierta", beats: [
    fc([{ t: "Calambres" }, { t: "de" }, { t: "MADRUGADA", hl: true }], { tone: "warn" }) ]},
  { key: "hook_edad", phrase: "es la edad", beats: [
    ak([{ word: "¿ES LA EDAD? NO SIEMPRE", sub: "la edad no hincha UNA sola pierna de un día para el otro — a veces es otra cosa", tone: "warn", atPhrase: "la edad no aprieta una vena" }], {}) ]},
  { key: "hook_coagulo", phrase: "forma un coágulo", beats: [
    ak([{ word: "SANGRE QUE SE ESTANCA → COÁGULO", sub: "a los 60, a los 70, mucho más común de lo que se cree", tone: "warn" }], {}) ]},
  { key: "hook_promesa", phrase: "enseñarte dos cosas", beats: [ c("talk", {}) ]},
  { key: "hook_activar", phrase: "activar la circulación", beats: [
    fc([{ t: "Activá" }, { t: "la" }, { t: "CIRCULACIÓN", hl: true }], { tone: "teal" }) ]},
  { key: "hook_senal", phrase: "reconocer la señal de alarma", beats: [
    fc([{ t: "La" }, { t: "SEÑAL", hl: true }, { t: "de" }, { t: "ALARMA" }], { tone: "warn" }) ]},
  { key: "hook_honesto", phrase: "no se disuelve con un té", beats: [
    mv("Un coágulo ya formado se disuelve en casa con un té", "Un coágulo de verdad, ya formado, es urgencia médica. Lo que SÍ está en tus manos: prevenirlo, moverlo y reconocer la alarma a tiempo.", { flipPhrase: "eso sí está en gran parte en tus manos" }) ]},
  { key: "hook_presenta", phrase: "que esto te va a servir", beats: [ c("talk", {}) ]},
  { key: "hook_cinco", phrase: "cinco señales que jamás", beats: [
    fc([{ t: "5" }, { t: "señales" }, { t: "que" }, { t: "NO" }, { t: "hay" }, { t: "que" }, { t: "dejar" }, { t: "pasar", hl: true }], { tone: "warn" }) ]},

  // ───────────── HISTORIA: Don Ernesto (~55s → 3min) ─────────────
  { key: "st_intro", phrase: "contarte una historia", beats: [ c("talk", {}) ]},
  { key: "st_ernesto", phrase: "Don Ernesto", beats: [
    lt("Don Ernesto, 68 — taxista jubilado", { kicker: "Una historia real", desc: "Cuarenta años arriba de un auto. Cuarenta años sentado, la misma postura, ocho o diez horas por día.", tone: "teal", at: "taxista jubilado" }) ]},
  { key: "st_sentado", phrase: "el mismo asiento", beats: [
    c("stat", { big: "40 años", label: "sentado al volante, la misma postura", tone: "warn", at: "diez horas por día" }) ]},
  { key: "st_unasola", phrase: "izquierda hinchada", beats: [ c("talk", {}),
    ak([{ word: "UNA SOLA PIERNA HINCHADA", sub: "la izquierda hinchada, la derecha normal — caliente al tacto y con dolor", tone: "warn", atPhrase: "Solo una" }], {}) ]},
  { key: "st_tresdias", phrase: "días siguió", beats: [
    c("stat", { big: "3 días", label: "con la pierna así, sin consultar", tone: "warn", at: "Con la pierna así" }) ]},
  { key: "st_aire", phrase: "le faltó el aire", beats: [
    fc([{ t: "De" }, { t: "repente…" }, { t: "le" }, { t: "faltó" }, { t: "el" }, { t: "AIRE", hl: true }], { tone: "warn" }) ]},
  { key: "st_embolia", phrase: "Era un coágulo", beats: [ c("talk", {}),
    ak([{ word: "EL COÁGULO VIAJÓ AL PULMÓN", sub: "los médicos lo llaman embolia pulmonar. Don Ernesto tuvo mucha suerte.", tone: "warn", atPhrase: "embolia pulmonar" }], {}) ]},
  { key: "st_nadie", phrase: "nadie le había enseñado", beats: [
    fc([{ t: "Nadie" }, { t: "le" }, { t: "dijo" }, { t: "que" }, { t: "era" }, { t: "una" }, { t: "SEÑAL", hl: true }], { tone: "warn" }) ]},
  { key: "st_ati", phrase: "para que a ti sí", beats: [ c("talk", {}) ]},

  // ───────────── MECANISMO (~3 → 6min) ─────────────
  { key: "mec_subir", phrase: "tiene que subir", beats: [ c("talk", {}),
    pz([{ word: "LA SANGRE DE LAS PIERNAS TIENE QUE SUBIR", sub: "desde los pies, en contra de la gravedad, todo el camino de vuelta al corazón", tone: "teal", atPhrase: "en contra de la gravedad" }], { at: "trepar todo el camino" }) ]},
  { key: "mec_valvulas", phrase: "una sola dirección", beats: [
    c("bars", { w: 2.2, title: "Los dos motores que suben la sangre", unit: "", bars: [
      { label: "Válvulas: puertitas de una sola dirección, no la dejan caer", value: 85, tone: "teal", note: "en las venas" },
      { label: "Músculos de la pantorrilla: bombean al caminar", value: 95, tone: "teal", note: "motor gratis" } ], at: "los músculos de la pantorrilla" }) ]},
  { key: "mec_segundo", phrase: "el segundo corazón", beats: [
    ak([{ word: "LA PANTORRILLA = TU SEGUNDO CORAZÓN", sub: "cuando caminás, bombea la sangre hacia arriba; cuando estás quieto, se apaga", tone: "teal", atPhrase: "se apaga" }], {}) ]},
  { key: "mec_quieto", phrase: "muchas horas", beats: [
    fc([{ t: "Quieto" }, { t: "→" }, { t: "se" }, { t: "APAGA", hl: true }], { tone: "warn" }) ]},
  { key: "mec_contra", phrase: "juegan en contra", beats: [ c("talk", {}),
    c("bars", { w: 2.2, title: "Con los años, dos cosas juegan en contra", unit: "", bars: [
      { label: "Válvulas gastadas: la sangre cae y se junta (várices, hinchazón)", value: 80, tone: "danger", note: "estructura" },
      { label: "Sangre más espesa y lenta (poca agua, quietud)", value: 85, tone: "danger", note: "más pegajosa" } ], at: "a ponerse más lenta" }) ]},
  { key: "mec_receta", phrase: "para que se forme un coágulo", beats: [
    fc([{ t: "Sangre" }, { t: "QUIETA", hl: true }, { t: "+" }, { t: "sangre" }, { t: "ESPESA", hl: true }], { tone: "warn" }) ]},
  { key: "mec_separar", phrase: "separes dos cosas", beats: [ c("talk", {}),
    c("splitlist", { w: 2.2, title: "No confundas estas dos cosas", items: [
      "MALA CIRCULACIÓN (benigno): los DOS tobillos, a la tarde, pesadez, várices — se mejora",
      "COÁGULO (urgencia): casi siempre UNA sola pierna, hinchazón rápida, calor y dolor — al médico" ], tone: "teal", at: "muy distinta" }) ]},

  // ───────────── CUERPO NUMERADO (~6 → 15min) ─────────────
  { key: "b1_intro", phrase: "quedarte quieto demasiado", beats: [ c("talk", {}),
    es("1", "Quedarte quieto demasiado tiempo seguido", { tone: "warn", w: 2.6, eyebrow: "Lo que más coágulos causa" }) ]},
  { key: "b1_como", phrase: "las marcas del elástico", beats: [
    c("checklist", { w: 2.2, title: "¿Se te estancó la sangre?", tone: "teal", items: [
      { text: "Piernas dormidas y pesadas al levantarte de una tarde de sillón", state: "warn" },
      { text: "El surco del elástico de la media clavado en el tobillo", state: "warn" } ], at: "estuvo estancada" }) ]},
  { key: "b1_fix", phrase: "romper la quietud", beats: [
    c("checklist", { w: 2.4, title: "Rompé la quietud", tone: "teal", items: [
      { text: "Cada hora sentado: levantate y caminá 2-3 minutos (a la cocina y vuelta)", state: "done" },
      { text: "Sentado: apoyá el talón y subí/bajá la punta como un pedal, 30 veces", state: "done" },
      { text: "En viajes largos repetí ese ejercicio cada media hora: bombea sin moverte", state: "done" } ], at: "caminas dos o tres minutos" }) ]},
  { key: "b1_ankle", phrase: "pisaras un pedal", beats: [
    c("stat", { big: "30", label: "flexiones de tobillo, sentado: aprietan la pantorrilla y suben la sangre", tone: "teal", at: "aprieta la pantorrilla" }) ]},

  { key: "b2_intro", phrase: "la deshidratación", beats: [ c("talk", {}),
    es("2", "La deshidratación: la sangre se espesa", { tone: "warn", w: 2.6, eyebrow: "Nadie lo toma en serio" }) ]},
  { key: "b2_sed", phrase: "la sensación de sed", beats: [
    ak([{ word: "A LOS 60 SE PIERDE LA SED", sub: "tu cuerpo tiene menos agua de la que necesita y ni siquiera te avisa", tone: "warn", atPhrase: "ni siquiera te avisa" }], {}) ]},
  { key: "b2_orina", phrase: "mirar la orina", beats: [
    c("checklist", { w: 2.2, title: "Un truco: mirá el color de la orina", tone: "teal", items: [
      { text: "Amarillo fuerte y cargado = casi siempre te falta agua", state: "warn" },
      { text: "Tiene que tender a un amarillo claro, casi transparente", state: "done" } ], at: "casi transparente" }) ]},
  { key: "b2_fix", phrase: "el goteo constante", beats: [
    c("checklist", { w: 2.4, title: "El agua, bien repartida", tone: "teal", items: [
      { text: "Un vaso al levantarte, uno con cada comida, y algunos entre medio", state: "done" },
      { text: "No litros de golpe: no sirve y te hace ir al baño toda la noche", state: "warn" },
      { text: "Si tu médico te limitó los líquidos (corazón/riñón), le hacés caso a él", state: "warn" } ], at: "repartido en el día" }) ]},

  { key: "b3_intro", phrase: "la forma en la que te sientas", beats: [ c("talk", {}),
    es("3", "Cómo te sentás y lo que te ponés", { tone: "warn", w: 2.6, eyebrow: "Cruzar las piernas, ropa apretada" }) ]},
  { key: "b3_cruzar", phrase: "Cruzar las piernas", beats: [
    ak([{ word: "SI TE DEJA MARCA, TE FRENA LA SANGRE", sub: "piernas cruzadas horas, ropa apretada, calcetines que marcan: frenan el retorno", tone: "warn", atPhrase: "no ayudándolo" }], {}) ]},
  { key: "b3_medias", phrase: "medias de compresión", beats: [
    c("bars", { w: 2.2, title: "Medias de compresión: la correcta, no la más apretada", unit: "", bars: [
      { label: "La correcta: aprieta más en el tobillo, ayuda a subir la sangre", value: 90, tone: "teal", note: "según tu caso" },
      { label: "La más apretada 'porque sí': puede ser un error", value: 30, tone: "danger", note: "consultá antes" } ], at: "más aprieta mejor" }) ]},
  { key: "b3_consulta", phrase: "hablan con tu médico", beats: [
    c("checklist", { w: 2.4, title: "Medias de compresión, bien usadas", tone: "teal", items: [
      { text: "Muy útiles si estás mucho de pie, mucho sentado o viajás largo", state: "done" },
      { text: "La fuerza correcta depende de tu caso: consultala con tu médico o la farmacia", state: "warn" },
      { text: "No compres la más apretada 'porque más aprieta mejor': no funciona así", state: "warn" } ], at: "antes de comprar" }) ]},

  { key: "b4_intro", phrase: "las piernas para arriba", beats: [ c("talk", {}),
    es("4", "Las piernas para arriba", { tone: "teal", w: 2.6, eyebrow: "Simple y subestimado" }) ]},
  { key: "b4_fix", phrase: "más arriba que el corazón", beats: [
    c("checklist", { w: 2.4, title: "Piernas en alto", tone: "teal", items: [
      { text: "15 min recostado, las piernas más arriba que el corazón (almohadones o pies a la pared)", state: "done" },
      { text: "Vas a sentir cómo se desinflan los tobillos", state: "done" },
      { text: "De noche: levantá un poco el pie de la cama, un par de dedos de alto", state: "done" } ], at: "los pies apoyados en la pared" }) ]},
  { key: "b4_cama", phrase: "levanta un poco la parte de los pies", beats: [
    fc([{ t: "Amanecés" }, { t: "DESINFLADO", hl: true }, { t: "·" }, { t: "cero" }, { t: "costo" }], { tone: "teal" }) ]},

  { key: "b5_intro", phrase: "el de la comida", beats: [ c("talk", {}),
    es("5", "La comida: lo que arruina y lo que ayuda", { tone: "teal", w: 2.6, eyebrow: "Sacar antes que agregar" }) ]},
  { key: "b5_sal", phrase: "el exceso de sal", beats: [
    ak([{ word: "EL EXCESO DE SAL RETIENE AGUA → HINCHAZÓN", sub: "fiambres, embutidos, caldos en cubito, snacks salados, conservas: cargadísimos de sodio", tone: "warn", atPhrase: "a hinchar" }], {}) ]},
  { key: "b5_sumar", phrase: "sobre todo el pescado", beats: [
    c("splitlist", { w: 2.2, title: "Para la circulación de tus piernas", items: [
      "SACÁ: sal de más, fiambres, embutidos, caldos en cubito, snacks, conservas",
      "SUMÁ: pescado azul (omega 3), ajo, jengibre, cítricos (vitamina C) y agua" ], tone: "teal", at: "el pescado azul" }) ]},
  { key: "b5_cta1", phrase: "las cantidades justas", beats: [
    lt("Las combinaciones y cantidades exactas están en la descripción", { kicker: "Abrila cuando termines", desc: "Anoté las mezclas que ayudan a la circulación, con la dosis justa de cada una, ordenadas abajo 👇", tone: "teal", at: "en la descripción del video" }) ]},
  { key: "b5_warn", phrase: "si tú tomas anticoagulantes", beats: [
    c("checklist", { w: 2.4, title: "⚠️ Si tomás anticoagulantes, leé esto", tone: "warn", items: [
      { text: "Warfarina, acenocumarol, pastillas para la sangre: NO te atiborres de ajo, jengibre ni suplementos", state: "warn" },
      { text: "Esos alimentos y la hoja verde le cambian el efecto a tu medicación", state: "warn" },
      { text: "No es que no los puedas comer: cualquier cambio grande, se lo consultás al médico primero", state: "done" } ], at: "midiéndolo" }) ]},

  { key: "b6_intro", phrase: "el peso de más", beats: [ c("talk", {}),
    es("6", "El peso de más y la barriga", { tone: "warn", w: 2.6, eyebrow: "Presión sobre las venas" }) ]},
  { key: "b6_bars", phrase: "presión sobre esas venas", beats: [
    c("bars", { w: 2.2, title: "No hace falta un abdomen de revista", unit: "", bars: [
      { label: "Si te sobra peso: cada kilo es más presión sobre las venas", value: 80, tone: "danger", note: "y la barriga aprieta" },
      { label: "Bajar un 5-10%: le sacás una mochila enorme a tus piernas", value: 90, tone: "teal", note: "despacio y constante" } ], at: "un cinco un diez por ciento" }) ]},

  { key: "b7_intro", phrase: "el cigarrillo", beats: [ c("talk", {}),
    es("7", "El cigarrillo y la medicación sin revisar", { tone: "warn", w: 2.6, eyebrow: "El que nadie quiere escuchar" }) ]},
  { key: "b7_tabaco", phrase: "El tabaco", beats: [
    ak([{ word: "EL TABACO DAÑA LAS VENAS Y ESPESA LA SANGRE", sub: "de las peores cosas para tu circulación. No hay versión suave de esto.", tone: "warn", atPhrase: "formar coágulos" }], {}) ]},
  { key: "b7_med", phrase: "ciertos medicamentos", beats: [
    c("checklist", { w: 2.4, title: "Tu medicación, revisada", tone: "teal", items: [
      { text: "Hormonas y ciertas pastillas aumentan el riesgo de coágulos", state: "warn" },
      { text: "No las suspendas por tu cuenta, JAMÁS", state: "warn" },
      { text: "Andá con la lista de todo lo que tomás y que tu médico la revise (más si hubo trombosis en la familia)", state: "done" } ], at: "que tu médico la revise" }) ]},

  // ───────────── ALARMA — LO MÁS IMPORTANTE (~15 → 17min) ─────────────
  { key: "al_intro", phrase: "lo más importante del video", beats: [ c("talk", {}),
    fc([{ t: "LO" }, { t: "MÁS" }, { t: "IMPORTANTE", hl: true }], { tone: "warn" }) ]},
  { key: "al_guarda", phrase: "señales claras", beats: [
    ge("GUARDÁ ESTO · Las 5 señales de alarma", [
      "1 · UNA sola pierna hinchada (la otra normal)",
      "2 · Esa pierna caliente al tacto, piel roja o violácea",
      "3 · Dolor en la pantorrilla sin ningún golpe",
      "4 · Falta de aire de repente → EMERGENCIA",
      "5 · Dolor en el pecho al respirar hondo → EMERGENCIA" ], { tag: "Sacale una foto", at: "te las voy a dar" }) ]},
  { key: "al_s1", phrase: "una sola pierna", beats: [
    es("1", "UNA sola pierna hinchada — la otra normal", { tone: "warn", w: 2.4, eyebrow: "Señal" }) ]},
  { key: "al_s2", phrase: "caliente al tacto", beats: [
    es("2", "Caliente al tacto, la piel roja o violácea", { tone: "warn", w: 2.4, eyebrow: "Señal" }) ]},
  { key: "al_s3", phrase: "dolor en la pantorrilla", beats: [
    es("3", "Dolor en la pantorrilla, sin ningún golpe", { tone: "warn", w: 2.4, eyebrow: "Señal" }) ]},
  { key: "al_tres", phrase: "no esperes tres días", beats: [
    fc([{ t: "Ese" }, { t: "mismo" }, { t: "día:" }, { t: "AL" }, { t: "MÉDICO", hl: true }], { tone: "warn" }) ]},
  { key: "al_s4", phrase: "te falta el aire", beats: [
    es("4", "Falta de aire de repente = EMERGENCIA", { tone: "warn", w: 2.6, eyebrow: "Llamá a la ambulancia" }) ]},
  { key: "al_s5", phrase: "un dolor en el pecho", beats: [
    es("5", "Dolor de pecho al respirar hondo = EMERGENCIA", { tone: "warn", w: 2.6, eyebrow: "Llamá a la ambulancia" }) ]},
  { key: "al_ambulancia", phrase: "llamar a emergencias", beats: [
    ak([{ word: "FALTA DE AIRE O DOLOR DE PECHO = AMBULANCIA YA", sub: "no se piensa, no se espera a mañana. Mejor ir y que no sea nada.", tone: "warn", atPhrase: "esperando a que se pase" }], {}) ]},
  { key: "al_te", phrase: "no se cura con un té", beats: [ c("talk", {}) ]},

  // ───────────── AUTO-DIAGNÓSTICO (~17 → 18min) ─────────────
  { key: "dx_intro", phrase: "dos grupos", beats: [ c("talk", {}),
    c("splitlist", { w: 2.2, title: "¿Cuál es tu caso?", items: [
      "GRUPO 1: los dos tobillos, a la tarde, pesadez, várices — circulación cansada",
      "GRUPO 2: una sola pierna, algo que apareció rápido, antecedentes, hormonas, reposos largos" ], tone: "teal", at: "te divido en dos grupos" }) ]},
  { key: "dx_g1", phrase: "circulación cansada", beats: [
    ak([{ word: "GRUPO 1 · TODO LO DE HOY ES PARA VOS", sub: "moverte cada hora, agua, piernas arriba, compresión bien indicada, sacar la sal", tone: "teal", atPhrase: "más livianas" }], {}) ]},
  { key: "dx_g2", phrase: "Grupo 2", beats: [
    ak([{ word: "GRUPO 2 · SUMÁ LAS 5 SEÑALES + TU MÉDICO", sub: "no para asustarte: para tener tu riesgo controlado", tone: "warn", atPhrase: "tenerlo controlado" }], {}) ]},

  // ───────────── CIERRE (~18 → 19.5min) ─────────────
  { key: "cl_ernesto", phrase: "cerrar como empecé", beats: [ c("talk", {}),
    lt("Don Ernesto, hoy", { kicker: "El cierre", desc: "Camina todos los días, toma su agua, dejó el cigarrillo. Cada tanto me manda un saludo.", tone: "teal", at: "está bien" }) ]},
  { key: "cl_frase", phrase: "el peor susto", beats: [
    lt("«Si yo hubiera sabido lo que significaba esa pierna hinchada…»", { kicker: "Me dijo Don Ernesto", desc: "No le faltó fuerza ni aguante. Le faltó que alguien se lo explicara a tiempo.", tone: "teal", at: "explicara a tiempo" }) ]},
  { key: "cl_hoy", phrase: "Hoy te lo expliqué yo", beats: [ c("talk", {}) ]},
  { key: "cl_cta2", phrase: "lo dejé todo ordenado", beats: [
    lt("Guía completa + las señales de alarma para imprimir", { kicker: "Todo ordenado abajo", desc: "Las combinaciones con cantidades exactas y las 5 señales para pegar en la heladera. En la descripción 👇", tone: "teal", at: "acá abajo" }) ]},
  { key: "cl_compartir", phrase: "conoces a alguien", beats: [
    lt("Compartilo con alguien que se pasa el día sentado", { kicker: "Puede ser la info que le falta", desc: "Como le faltó a Don Ernesto. O con alguien que anda con las piernas hinchadas y dice «es la edad».", tone: "teal", at: "como le faltó" }) ]},
  { key: "cl_pregunta", phrase: "en los comentarios", beats: [
    fc([{ t: "¿Cuántas" }, { t: "horas" }, { t: "seguidas" }, { t: "estás" }, { t: "SENTADO?", hl: true }], { tone: "teal" }) ]},
  { key: "cl_cierre", phrase: "el próximo", beats: [
    c("nametag", { name: "Dr. Federer", role: "Cuidá esas piernas, que te tienen que llevar a muchos lugares todavía.", image: "img/co_federer_cierre.png" }) ]},
];

// ── ANCLAJE POR FRASE (idéntico al template validado federer19) ─────────────────
const CAPS = JSON.parse(fs.readFileSync("public/captions_coagulos.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; } if (ok) return CW[i].s; }
  return null;
};
const pinPhrase = (b) => b.at || null;
const VIDEO_END = (CW[CW.length - 1]?.s || 1170) + 2;

let cursorSec = 0; const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  let ms = findMs(sec.phrase, cursorSec + 1);
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
  const pin = sec.beats.map((b, i) => { if (i === 0) return start; const ph = pinPhrase(b); if (!ph) return null; const ms = findMs(ph, start + 0.4); return ms != null && ms > start + 0.8 && ms < end - 1.2 ? ms : null; });
  let lastPin = start;
  for (let i = 1; i < n; i++) { if (pin[i] != null) { if (pin[i] <= lastPin + 1.2) pin[i] = null; else lastPin = pin[i]; } }
  const fixed = []; for (let i = 0; i < n; i++) if (pin[i] != null) fixed.push(i); fixed.push(n);
  const startT = new Array(n);
  for (let f = 0; f < fixed.length - 1; f++) { const a = fixed[f], b = fixed[f + 1]; const ta = pin[a], tb = b === n ? end : pin[b]; let sw = 0; for (let i = a; i < b; i++) sw += ws[i]; let acc = ta; for (let i = a; i < b; i++) { startT[i] = acc; acc += (ws[i] / sw) * (tb - ta); } }
  sec.beats.forEach((b, i) => {
    const cursor = +startT[i].toFixed(2); const nextR = +(i + 1 < n ? startT[i + 1] : end).toFixed(2); let dur = +(nextR - cursor).toFixed(2);
    const id = `${sec.key}_${i}`; const beat = { id, start: cursor, dur, key: sec.key };
    if (b.t === "talk") { beat.kind = "talk"; }
    else if (b.t === "raw") { beat.kind = "raw"; beat.src = `img/${b.name}.png`; if (b.kicker) beat.kicker = b.kicker; if (b.hold) beat.hold = true; }
    else { beat.kind = b.t; Object.assign(beat, b); delete beat.t; beat.id = id; beat.start = cursor; beat.dur = dur; beat.key = sec.key;
      if (beat.kind === "checklist" && Array.isArray(beat.items)) beat.items = beat.items.map((it) => (typeof it === "string" ? { text: it, state: "done" } : it)); }
    beats.push(beat);
  });
}

// POST-PASS keyword + pizarra + mitoverdad (clips de avatar)
const KIT_CLIPS = [];
for (const beat of beats) {
  if (beat.kind === "avatarkeyword" || beat.kind === "avatarpizarra") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => { let atF = 0; if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); } last = Math.max(last, atF); const { atPhrase, ...rest } = it; return { ...rest, at: atF }; });
    if (last > 300) { beat.items = beat.items.map((it, i) => ({ ...it, at: i * 90 })); last = (beat.items.length - 1) * 90; }
    beat.dur = +(last / 30 + 2.8).toFixed(2); beat.clip = `avatar_clips/coagulos/${beat.id}.mp4`;
    KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) });
  }
  if (beat.kind === "mitoverdad" && beat.flipPhrase) { const ms = findMs(beat.flipPhrase, beat.start - 1); const lastSafe = Math.round(beat.dur * 30) - 26; let f = ms != null ? Math.round((ms - beat.start) * 30) : Math.round(beat.dur * 30 * 0.42); if (f < 8 || f > lastSafe) f = Math.round(beat.dur * 30 * 0.42); beat.flipAt = f; delete beat.flipPhrase; }
  if (beat.kind === "errorstinger" && !beat.eyebrow) beat.eyebrow = "Razón";
  if (beat.at) delete beat.at;
}
fs.writeFileSync("public/avatar_clips_coagulos.json", JSON.stringify(KIT_CLIPS, null, 1));

// PISO DE DURACIÓN de componentes (excepto el hook <66s: dejamos beats cortos)
const COMPK = new Set(["headline","stat","quote","chips","splitlist","checklist","callout","bars","diagram","rule","nametag","board","annotated","cross","process","lowerthird","guardaesto","errorstinger","mitoverdad","frasecinetica","freezezoom"]);
const MINC = 4.2;
const compIx = beats.map((b, i) => (COMPK.has(b.kind) && b.start > 66 ? i : -1)).filter((i) => i >= 0);
for (let k = 0; k < compIx.length; k++) { const i = compIx[k]; const nextComp = k + 1 < compIx.length ? beats[compIx[k + 1]].start : VIDEO_END; const capDur = nextComp - beats[i].start - 0.1; beats[i].dur = +Math.max(beats[i].dur, Math.min(MINC, capDur)).toFixed(2); }

const talks = beats.filter((b) => b.kind === "talk").map((b) => ({ start: +b.start.toFixed(2), dur: +b.dur.toFixed(2) }));
fs.writeFileSync("src/_fed6/VideoEdit/coagulos_beats.ts", `export const COAG_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync("src/_fed6/VideoEdit/coagulos_hooks.ts", `export const TALKS_COAG: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync("beatsheet/coagulos.json", JSON.stringify({ video: "coagulos", avatar: "coagulos_opt.mp4", theme: "medico", beats }, null, 1));

const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
if (missing.length) console.log(`⚠ no ancladas (${missing.length}):`, missing.slice(0, 30));
console.log(`beats: ${beats.length} · dur: ${(beats[beats.length-1].start+beats[beats.length-1].dur).toFixed(0)}s · distinct kinds: ${Object.keys(kinds).length}`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`avatar_clips: ${KIT_CLIPS.length}`);
