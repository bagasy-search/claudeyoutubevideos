// gen_vlnljrhb5gbv.mjs — beatsheet del video "RECUPERAR LA FUERZA DE LAS PIERNAS comiendo
// proteína lenta (requesón/caseína) antes de dormir" (Canal Federer Archivos). Avatar
// vlnljrhb5gbv_opt.mp4 (~22.8min). Anclaje por FRASE a captions_vlnljrhb5gbv.json. Look
// CLÍNICO teal. Imágenes gpt-image-2: p_vlnljrhb5gbv_*.png + dg_vlnljrhb5gbv_*.png. Kit _fed6
// COMPLETO. Estructura: cold-open (piernas se apagan) → sarcopenia/resistencia anabólica →
// por qué la noche + Maastricht 2012 + caseína + leucina → requesón (estrella) → 3 refuerzos
// (vit D, magnesio, glicina) → circulación → límites honestos → enemigo → el ERROR (horario) →
// recap 6 puntos + cierre/teaser. 2 injertos de venta de la guía.
import fs from "fs";
const SLUG = "vlnljrhb5gbv";

const r  = (name, o = {}) => ({ t: "raw", name, ...o });
const c  = (kind, props = {}) => ({ t: kind, ...props });
const dg = (name, _eyebrow, o = {}) => ({ t: "diagram", slides: [{ image: `img/${name}.png` }], ...o });
const es = (number, title, o = {}) => ({ t: "errorstinger", number, title, tone: o.tone || "teal", ...o });
const mv = (myth, truth, o = {}) => ({ t: "mitoverdad", myth, truth, ...o });
const fc = (words, o = {}) => ({ t: "frasecinetica", words, tone: o.tone || "teal", perWord: o.perWord || 10, ...o });
const ak = (items, o = {}) => ({ t: "avatarkeyword", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const ap = (items, o = {}) => ({ t: "avatarpizarra", items, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const focc = (items, o = {}) => ({ t: "focuscards", items, title: o.title, ...o, at: o.at || (items[0] && items[0].atPhrase) });
const lt = (title, o = {}) => ({ t: "lowerthird", title, tone: o.tone || "teal", ...o });
const ge = (title, items, o = {}) => ({ t: "guardaesto", title, items, ...o });
const fz = (image, o = {}) => ({ t: "freezezoom", image: `img/${image}.png`, ...o });

const W = { raw: 1.4, quote: 1.1, headline: 1.0, rule: 1.0, stat: 1.05, checklist: 1.2, splitlist: 1.1, bars: 1.2, callout: 1.1, chips: 1.1, diagram: 2.4, board: 3.0, nametag: 1.3, annotated: 1.3, cross: 1.6, process: 2.6, talk: 1.0,
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6, focuscards: 6.0 };

const P = (n) => `p_${SLUG}_${n}`;   // foto hero
const D = (n) => `dg_${SLUG}_${n}`;  // diagrama

const SECTIONS = [
  // ░░ COLD-OPEN — las piernas se apagan en silencio ░░
  { key: "hook", phrase: null, start: 1.3, beats: [
    c("talk", {}),
    r(P("hombre_mira_piernas"), { at: "empiezan a apagarse en silencio", kicker: "Después de los 60" }),
    r(P("levantarse_silla_manos"), { at: "empujaste con las manos" }),
  ]},
  { key: "gesto", phrase: "apoyarte en el brazo", beats: [
    ak([{ word: "LA PRIMERA SEÑAL", sub: "apoyarte en el brazo del sillón para levantarte", tone: "warn", atPhrase: "apoyarte en el brazo" }], {}),
    r(P("apoyarse_brazo_sillon"), { at: "primera senal de algo" }),
  ]},
  { key: "promesa", phrase: "cambiar por completo", beats: [
    c("stat", { big: "80·90", unit: "años", label: "Podés recuperar fuerza en las piernas. Incluso a los 80. Incluso a los 90.", tone: "teal" }),
    r(P("piernas_fuertes_caminando")),
  ]},
  { key: "ventana", phrase: "un solo momento del", beats: [
    ak([{ word: "UNA SOLA VENTANA", sub: "un momento del día para reconstruir músculo — y no es entrenando", tone: "teal", atPhrase: "un solo momento del" }], {}),
    fc([{ t: "No" }, { t: "es" }, { t: "cuando" }, { t: "entrenás" }, { t: "es" }, { t: "mientras" }, { t: "dormís", hl: true }], { tone: "teal", at: "es mientras dormis" }),
    r(P("reloj_despertador_noche")),
  ]},
  { key: "roba", phrase: "fabricar musculo nuevo", beats: [
    dg(D("sintesis_nocturna"), "De noche: fabricás músculo o lo perdés"),
    mv("De noche el cuerpo solo descansa", "De noche fabrica músculo nuevo... o te lo roba", { flipPhrase: "puede robartelo" }),
    r(P("musculo_noche_fabrica")),
  ]},
  { key: "vacio", phrase: "el estomago vacio desde", beats: [
    r(P("cama_estomago_vacio"), { at: "llega a la cama" }),
    c("stat", { big: "12 h", unit: "sin proteína", label: "Desde las 7 de la tarde a la mañana, sin una sola gota de proteína.", tone: "warn" }),
  ]},
  { key: "saca_piernas", phrase: "lo saca de tus", beats: [
    dg(D("cuerpo_desarma_musculo"), "Sin proteína, saca aminoácidos de tus piernas"),
    fc([{ t: "Los" }, { t: "saca" }, { t: "de" }, { t: "tus" }, { t: "piernas", hl: true }], { tone: "warn", at: "saca de tus piernas" }),
    r(P("piernas_adelgazan")),
  ]},
  { key: "barato", phrase: "esta en cualquier heladera", beats: [
    r(P("requeson_heladera"), { at: "esta en cualquier heladera" }),
    ak([{ word: "BARATO Y EN LA HELADERA", sub: "ninguna empresa te lo recomienda: no se patenta ni se vende caro", tone: "teal", atPhrase: "patentar ni vender caro" }], {}),
  ]},
  { key: "teaser_error", phrase: "el error que cometen", beats: [
    lt("El ERROR de 9 de cada 10 — te lo cuento al final", { kicker: "Quedate hasta el final", desc: "Un detalle mínimo que hace que sigan perdiendo fuerza. Y lo cambia todo.", tone: "warn", at: "nueve de cada diez" }),
    r(P("hombre_pensativo_noche")),
  ]},
  { key: "intro", phrase: "soy en dr federer", beats: [
    c("nametag", { name: "Dr. Federer", role: "Bienvenido a los archivos", image: `img/${P("federer_saluda")}.png` }),
  ]},
  // ░░ EL PRINCIPIO — sarcopenia ░░
  { key: "principio", phrase: "primero quiero que entiendas", beats: [
    c("talk", {}),
    r(P("adulto_mayor_reflexivo")),
    r(P("federer_consultorio"), { at: "por su propio peso" }),
  ]},
  { key: "sarcopenia", phrase: "se llama sarcopenia", beats: [
    ak([{ word: "SARCOPENIA", sub: "sarco = músculo · penia = pérdida", tone: "teal", atPhrase: "se llama sarcopenia" }], {}),
    dg(D("sarcopenia_fibras"), "Sarcopenia: pérdida de músculo con la edad"),
    r(P("musculo_pierna_corte")),
  ]},
  { key: "perdida_decada", phrase: "a partir de los treinta", beats: [
    c("stat", { big: "3-8%", unit: "por década", label: "de masa muscular se pierde desde los 30. Después de los 60 se dispara.", tone: "warn" }),
    r(P("calendario_decadas")),
  ]},
  { key: "mitad_fibras", phrase: "perder la mitad de sus", beats: [
    c("stat", { big: "50%", unit: "de tus fibras", label: "Un adulto mayor puede perder la mitad de sus fibras entre los 50 y los 80.", tone: "warn" }),
    r(P("escalera_cuesta"), { at: "subias una escalera" }),
    r(P("caminar_baston")),
  ]},
  { key: "piernas_primero", phrase: "las piernas son siempre", beats: [
    dg(D("piernas_primeras"), "Las piernas se van primero: el músculo más grande"),
    ak([{ word: "LAS PIERNAS, PRIMERO", sub: "el cuerpo recorta donde más energía cuesta", tone: "warn", atPhrase: "primeras en irse" }], {}),
  ]},
  { key: "prueba_silla", phrase: "sentado en un banco", beats: [
    c("process", { title: "La prueba de la silla", eyebrow: "La que usamos los médicos", steps: [
      { title: "Te vas para adelante", desc: "y no salís", image: `img/${P("intento_pararse")}.png` },
      { title: "Segundo intento", desc: "te empujás con los brazos", image: `img/${P("empujarse_brazos")}.png` },
      { title: "El cuádriceps", desc: "perdió fuerza — se recupera", image: `img/${P("cuadriceps_muslo")}.png` },
    ] }),
  ]},
  { key: "caidas", phrase: "las caidas son una", beats: [
    c("stat", { big: "65+", unit: "años", label: "Las caídas: una de las principales causas de muerte por accidente. Detrás, piernas sin fuerza.", tone: "warn" }),
    r(P("adulto_tropieza")),
    r(P("cadera_rota_hospital"), { at: "una cadera rota" }),
  ]},
  { key: "tropezon", phrase: "el musculo no reacciono", beats: [
    fc([{ t: "El" }, { t: "músculo" }, { t: "no" }, { t: "reaccionó" }, { t: "a" }, { t: "tiempo", hl: true }], { tone: "warn", at: "no reacciono a tiempo" }),
    r(P("tropiezo_vereda")),
  ]},
  { key: "no_resignar", phrase: "no te tenes que resignar", beats: [
    mv("La debilidad en las piernas es la edad", "Es un proceso: se frena y muchas veces se da vuelta", { flipPhrase: "se puede dar vuelta" }),
    ak([{ word: "NO ESTÁS CONDENADO", sub: "estás mal alimentado en el momento equivocado del día", tone: "teal", atPhrase: "condenado a debilitarte" }], {}),
  ]},
  // ░░ RESISTENCIA ANABÓLICA ░░
  { key: "resistencia", phrase: "resistencia anabolica", beats: [
    dg(D("resistencia_anabolica"), "Resistencia anabólica: el músculo se vuelve 'sordo'"),
    ak([{ word: "RESISTENCIA ANABÓLICA", sub: "a tu edad el músculo escucha menos la proteína", tone: "teal", atPhrase: "resistencia anabolica" }], {}),
  ]},
  { key: "milanesa", phrase: "la porcion de milanesa", beats: [
    c("splitlist", { title: "La regla cambió y nadie te avisó", items: ["Joven: comés poco y el músculo construye", "Después de los 60: necesita MÁS y concentrada", "La milanesa del nieto ya no te alcanza"], palette: "T" }),
    r(P("plato_milanesa")),
    r(P("abuelo_nieto_comer")),
  ]},
  // ░░ ¿POR QUÉ LA NOCHE? ░░
  { key: "por_noche", phrase: "por que la noche", beats: [
    c("talk", {}),
    dg(D("modo_reparacion"), "De noche el cuerpo entra en modo reparación"),
    r(P("hombre_durmiendo"), { at: "cuando dormis" }),
  ]},
  { key: "hormona", phrase: "libera hormona de crecimiento", beats: [
    dg(D("hormona_crecimiento"), "Sueño profundo → hormona de crecimiento → repara"),
    c("checklist", { title: "La hormona de crecimiento repara", items: [
      { text: "Músculo", state: "done" }, { text: "Piel", state: "done" }, { text: "Hueso", state: "done" } ] }),
    r(P("sueno_profundo")),
  ]},
  { key: "ladrillos", phrase: "tu cuerpo necesita ladrillos", beats: [
    ak([{ word: "LADRILLOS = AMINOÁCIDOS", sub: "vienen de la proteína que comés", tone: "teal", atPhrase: "necesita ladrillos" }], {}),
    r(P("ladrillos_construccion")),
  ]},
  { key: "desarma", phrase: "desarma musculo viejo", beats: [
    dg(D("cuerpo_roba_piernas"), "Sin material, desarma tus piernas para sobrevivir"),
    fc([{ t: "Te" }, { t: "desarma" }, { t: "las" }, { t: "piernas", hl: true }], { tone: "warn", at: "te desarma las piernas" }),
    r(P("piernas_flacas_cama")),
  ]},
  // ░░ ESTUDIO MAASTRICHT 2012 ░░
  { key: "estudio", phrase: "la ciencia de verdad", beats: [
    c("talk", {}),
    dg(D("estudio_maastricht"), "Maastricht 2012: proteína antes de dormir"),
    r(P("laboratorio_estudio")),
  ]},
  { key: "experimento", phrase: "un experimento muy simple", beats: [
    c("process", { title: "El experimento", eyebrow: "Universidad de Maastricht, 2012", steps: [
      { title: "Grupo A", desc: "proteína antes de dormir", image: `img/${P("vaso_proteina_noche")}.png` },
      { title: "Grupo B", desc: "nada", image: `img/${P("cama_vacia")}.png` },
      { title: "Resultado", desc: "A fabricó músculo durmiendo", image: `img/${P("musculo_reparado")}.png` },
    ] }),
  ]},
  { key: "resultado", phrase: "fabrico musculo", beats: [
    ak([{ word: "FABRICARON MÚSCULO DURMIENDO", sub: "sin levantar una sola pesa", tone: "teal", atPhrase: "mientras dormian" }], {}),
    r(P("musculo_pierna_sano")),
  ]},
  { key: "cantidad", phrase: "de cuanta proteina hablamos", beats: [
    c("stat", { big: "30-40 g", unit: "de proteína", label: "Un buen tazón de requesón, o un yogur griego grande con nueces. Nada raro ni caro.", tone: "teal" }),
    r(P("tazon_requeson_nueces")),
  ]},
  // ░░ CASEÍNA — proteína lenta ░░
  { key: "caseina", phrase: "era caseina", beats: [
    dg(D("caseina_lenta"), "Caseína: proteína lenta, gota a gota toda la noche"),
    ak([{ word: "CASEÍNA", sub: "la proteína de la leche: yogur, queso, requesón", tone: "teal", atPhrase: "la caseina es la proteina" }], {}),
    r(P("leche_vaso_caseina")),
  ]},
  { key: "lenta", phrase: "proteina de digestion lenta", beats: [
    c("splitlist", { title: "Por qué la caseína gana de noche", items: ["Entra despacio, gota a gota, durante horas", "Otras proteínas: a las 2 h ya no queda nada", "La caseína te cubre la madrugada entera"], palette: "T" }),
    r(P("gota_leche_lenta")),
  ]},
  // ░░ LEUCINA — el interruptor ░░
  { key: "leucina", phrase: "se llama leucina", beats: [
    dg(D("leucina_interruptor"), "Leucina: el interruptor que enciende la construcción"),
    ak([{ word: "LEUCINA, EL INTERRUPTOR", sub: "le da la orden al músculo: construí ahora", tone: "teal", atPhrase: "se llama leucina" }], {}),
  ]},
  { key: "leucina_dosis", phrase: "cuanta leucina", beats: [
    c("stat", { big: "2,5-3 g", unit: "de leucina", label: "en una sola comida para prender el interruptor. A tu edad está más duro.", tone: "teal" }),
    c("chips", { title: "Dónde está tu leucina", chips: ["Requesón · Yogur griego", "Huevo · Quesos", "Cantidad y momento correctos"] }),
    r(P("huevo_queso_leucina")),
  ]},
  // ░░ EL ALIMENTO ESTRELLA — requesón + injerto guía #1 ░░
  { key: "estrella", phrase: "lo mejor que puedes comer", beats: [
    c("talk", {}),
    ak([{ word: "UNA PORCIÓN DE REQUESÓN", sub: "queso blanco, ricota, requesón — casi caseína pura", tone: "teal", atPhrase: "una porcion de requeson" }], {}),
    r(P("requeson_tazon_hero"), { at: "un tazon chico", hold: true }),
  ]},
  { key: "preparar", phrase: "como lo preparas", beats: [
    c("process", { title: "Tu postre de la noche en 3 minutos", eyebrow: "Para que no sea un castigo", steps: [
      { title: "Requesón", desc: "un tazón chico", image: `img/${P("requeson_cuchara")}.png` },
      { title: "Nueces", desc: "un puñado, 5 o 6", image: `img/${P("nueces_encima")}.png` },
      { title: "Miel o banana", desc: "si lo querés dulce", image: `img/${P("miel_banana")}.png` },
    ] }),
  ]},
  { key: "guia1", phrase: "la guia gratuita del canal", beats: [
    c("chips", { bg: "image", image: `img/${P("guia_heladera")}.png`, imageDarken: 0.62, title: "Guía gratis: las cantidades exactas", chips: ["Cuánto requesón, cuántas nueces", "A qué hora de la noche", "archivos-federer.vercel.app"] }),
    lt("Pegala al lado de la heladera — es un regalo", { kicker: "Guía gratuita del canal", desc: "archivos-federer.vercel.app · seguí escuchando, falta lo mejor.", tone: "teal", at: "al lado de la heladera" }),
  ]},
  { key: "alternativas", phrase: "un yogurt natural entero", beats: [
    c("checklist", { title: "Si no conseguís requesón", items: [
      { text: "Yogur natural ENTERO, no descremado", state: "done" },
      { text: "Yogur griego: casi el doble de proteína", state: "done" },
      { text: "Un par de huevos duros pelados", state: "done" } ] }),
    r(P("yogur_griego_nueces")),
    r(P("huevos_duros_pelados")),
  ]},
  { key: "porcion_chica", phrase: "la porcion es chica", beats: [
    ak([{ word: "MEDIA HORA ANTES, SENTADO", sub: "porción chica, masticando despacio — no en la cama", tone: "teal", atPhrase: "una media hora antes" }], {}),
    r(P("comer_sentado_tranquilo")),
  ]},
  // ░░ 3 REFUERZOS ░░
  { key: "refuerzos", phrase: "la proteina es la estrella", beats: [
    mv("Con la proteína de la noche alcanza", "La proteína es la estrella, pero hay 3 refuerzos", { flipPhrase: "tres refuerzos que multiplican" }),
    r(P("tres_alimentos_refuerzo")),
  ]},
  { key: "causa1", phrase: "el primer refuerzo", beats: [
    es("01", "Vitamina D", { w: 3.6 }),
  ]},
  { key: "vitd_musculo", phrase: "receptores de vitamina", beats: [
    dg(D("receptores_vitd"), "Tus músculos están llenos de receptores de vitamina D"),
    ak([{ word: "NO ES SOLO EL HUESO", sub: "sin vitamina D el músculo reacciona lento y no te sostiene", tone: "warn", atPhrase: "llenos de receptores" }], {}),
  ]},
  { key: "vitd_caidas", phrase: "asociado a las caidas", beats: [
    mv("En una caída lo que falla es el hueso", "Es el músculo que no reaccionó a tiempo", { flipPhrase: "el musculo que no reacciono" }),
    r(P("sol_manana_brazos"), { at: "un poco de sol" }),
  ]},
  { key: "vitd_sol", phrase: "un analisis de sangre", beats: [
    c("stat", { big: "15-20 min", unit: "de sol", label: "Sol de mañana en los brazos. Un análisis dice en un minuto si la tenés baja.", tone: "teal" }),
    r(P("analisis_sangre_tubo")),
  ]},
  { key: "causa2", phrase: "el segundo refuerzo", beats: [
    es("02", "Magnesio", { w: 3.6 }),
  ]},
  { key: "magnesio_mec", phrase: "hace dos cosas a la", beats: [
    dg(D("magnesio_musculo"), "Magnesio: relaja el músculo y profundiza el sueño"),
    c("splitlist", { title: "El magnesio, dos cosas a la vez", items: ["Contrae y relaja el músculo (menos calambres)", "Te hace dormir más profundo", "Más sueño = más hormona de crecimiento"], palette: "G" }),
  ]},
  { key: "magnesio_donde", phrase: "donde esta el magnesio", beats: [
    c("chips", { title: "Dónde está el magnesio", chips: ["Nueces · semillas de zapallo", "Hojas verdes · poroto", "Chocolate amargo de verdad"] }),
    ak([{ word: "NUECES = 2 EN 1", sub: "proteína lenta y magnesio en un solo bocado", tone: "teal", atPhrase: "en un solo bocado" }], {}),
    r(P("nueces_semillas_hojas")),
  ]},
  { key: "causa3", phrase: "el tercer refuerzo", beats: [
    es("03", "Glicina", { w: 3.6 }),
  ]},
  { key: "glicina_mec", phrase: "la glicina es un", beats: [
    dg(D("glicina_sueno"), "Glicina: baja la temperatura y lleva al sueño profundo"),
    ak([{ word: "GLICINA", sub: "gelatina y caldo de huesos — sueño profundo más rápido", tone: "teal", atPhrase: "esta en la gelatina" }], {}),
  ]},
  { key: "caldo_huesos", phrase: "un caldo de huesos casero", beats: [
    r(P("caldo_huesos_olla"), { at: "caldo de huesos casero" }),
    c("callout", { image: `img/${P("caldo_huesos_olla")}.png`, figure: "Caldo de huesos, tibio", caption: "Media hora antes de dormir. La misma olla de siempre de tus bisabuelas." }),
  ]},
  // ░░ CIRCULACIÓN (hilo del canal) ░░
  { key: "circulacion", phrase: "la circulacion", beats: [
    dg(D("circulacion_riego"), "Circulación: el camión que lleva la proteína al músculo"),
    mv("Alcanza con tener los ladrillos", "Sin circulación, el camión no llega a la obra", { flipPhrase: "no llega a la obra" }),
  ]},
  { key: "circulacion_tips", phrase: "musculo bien alimentado", beats: [
    c("checklist", { title: "Que la sangre llegue a la pierna", items: [
      { text: "No cenar tan pesado", state: "done" },
      { text: "Suficiente agua durante el día", state: "done" },
      { text: "Mover las piernas: la bomba trabaja", state: "done" } ] }),
    r(P("caminar_piernas_bomba")),
  ]},
  // ░░ LÍMITES HONESTOS ░░
  { key: "honesto", phrase: "dejame ser honesto con vos", beats: [
    c("talk", {}),
    lt("Esto no es magia: dale un mes, dale dos", { kicker: "Con toda honestidad", desc: "El músculo se construye ladrillo por ladrillo, noche por noche.", tone: "teal", at: "no es magia" }),
    r(P("calendario_un_mes")),
  ]},
  { key: "no_reemplaza", phrase: "tampoco reemplaza al movimiento", beats: [
    mv("Con la mejor proteína ya alcanza", "Sin movimiento, el cuerpo no ve motivo para el músculo", { flipPhrase: "no ve motivo" }),
    fc([{ t: "La" }, { t: "comida" }, { t: "pone" }, { t: "los" }, { t: "ladrillos" }, { t: "el" }, { t: "movimiento" }, { t: "los" }, { t: "ubica", hl: true }], { tone: "teal", at: "donde ponerlos" }),
  ]},
  { key: "sentadillas", phrase: "te levantes de la silla", beats: [
    c("stat", { big: "10 × 2", unit: "por día", label: "Levantate de la silla 10 veces, 2 veces al día. Es una razón para quedarse.", tone: "teal" }),
    r(P("sentadilla_silla")),
  ]},
  { key: "rinon", phrase: "si tenes problemas de rinon", beats: [
    lt("¿Riñón o medicación? Hablá con tu médico primero", { kicker: "Se respeta la salud", desc: "Yo te doy el conocimiento; las decisiones se toman con tu médico al lado.", tone: "warn", at: "antes de subir la proteina" }),
    r(P("medico_paciente_consulta")),
  ]},
  // ░░ ENEMIGO ░░
  { key: "enemigo", phrase: "la parte incomoda", beats: [
    c("talk", {}),
    ak([{ word: "NO HAY PASTILLA", sub: "nadie se hace rico recomendándote requesón", tone: "warn", atPhrase: "no existe una pastilla" }], {}),
  ]},
  { key: "industria", phrase: "la industria de los suplementos", beats: [
    c("splitlist", { title: "Lo que sí te venden", items: ["Potes de polvo a precio de oro", "Máquinas de gimnasio que intimidan", "Cuotas que no usás"], palette: "G" }),
    r(P("suplementos_polvo")),
    r(P("gimnasio_maquinas")),
  ]},
  { key: "gratis", phrase: "la verdad mas poderosa", beats: [
    mv("Perder fuerza en las piernas es normal a tu edad", "Nunca lo fue: es la excusa más cómoda que existe", { flipPhrase: "nunca lo fue" }),
    r(P("dinero_suplementos_caros")),
  ]},
  { key: "diferencia", phrase: "con silencio y resignacion", beats: [
    fc([{ t: "Las" }, { t: "encendemos" }, { t: "con" }, { t: "una" }, { t: "porción" }, { t: "de" }, { t: "requesón", hl: true }], { tone: "teal", at: "una porcion de requeson" }),
    r(P("requeson_antes_dormir")),
  ]},
  // ░░ EL ERROR — el horario ░░
  { key: "error", phrase: "te debo el error", beats: [
    es("!", "El error: el horario", { tone: "warn", w: 3.8 }),
  ]},
  { key: "error_horario", phrase: "el error es el horario", beats: [
    dg(D("ventana_proteina"), "El músculo aprovecha 25-30 g por comida — el resto se pierde"),
    c("stat", { big: "25-30 g", unit: "por comida", label: "Lo que te pasás de ahí en un solo plato no se guarda: se quema o se elimina.", tone: "warn" }),
  ]},
  { key: "error_almuerzo", phrase: "un buen plato de carne", beats: [
    c("process", { title: "El error de todos", eyebrow: "Toda la proteína al mediodía", steps: [
      { title: "Mediodía", desc: "un asado enorme", image: `img/${P("asado_mediodia")}.png` },
      { title: "Noche", desc: "un té y una tostada", image: `img/${P("te_tostada_noche")}.png` },
      { title: "12-14 h", desc: "sin un solo aminoácido", image: `img/${P("reloj_noche")}.png` },
    ] }),
  ]},
  { key: "reparto", phrase: "importa como la repartis", beats: [
    dg(D("reparto_comidas"), "Repartí la proteína en 4 momentos, nunca la noche vacía"),
    ap([
      { card: "Desayuno", sub: "un poco de proteína", atPhrase: "un poco en el desayuno" },
      { card: "Almuerzo", sub: "un poco", atPhrase: "un poco en el almuerzo" },
      { card: "Cena + antes de dormir", sub: "cubrí la noche entera", atPhrase: "un poco en la cena" },
    ], {}),
  ]},
  { key: "cuatro", phrase: "cuatro momentos no uno", beats: [
    ak([{ word: "4 MOMENTOS, NO UNO", sub: "y sobre todo, una porción justo antes de dormir", tone: "teal", atPhrase: "cuatro momentos no uno" }], {}),
    r(P("cuatro_comidas")),
  ]},
  { key: "arregla", phrase: "arregla ese horario", beats: [
    fc([{ t: "Comé" }, { t: "mejor" }, { t: "repartido" }, { t: "es" }, { t: "gratis", hl: true }], { tone: "teal", at: "comer mejor repartido" }),
    r(P("cuatro_platos_dia")),
  ]},
  // ░░ RECAP — los 6 puntos ░░
  { key: "recap", phrase: "vamos a repasar", beats: [
    c("talk", {}),
    focc([
      { image: `img/${P("requeson_tazon_hero")}.png`, label: "Proteína lenta antes de dormir", atPhrase: "una porción de proteína" },
      { image: `img/${P("nueces_encima")}.png`, label: "Un puñado de nueces arriba", atPhrase: "un puñado chico de nueces" },
      { image: `img/${P("sol_manana_brazos")}.png`, label: "Vitamina D: sol + suplemento", atPhrase: "cuidá la vitamina" },
      { image: `img/${P("caldo_huesos_olla")}.png`, label: "Magnesio + caldo con glicina", atPhrase: "sumá magnesio" },
      { image: `img/${P("cuatro_comidas")}.png`, label: "Repartí la proteína en 4 momentos", atPhrase: "repartí la proteína" },
      { image: `img/${P("sentadilla_silla")}.png`, label: "Mové las piernas todos los días", atPhrase: "mové las piernas todos" },
    ], { title: "Los 6 puntos", at: "para que te quede grabado" }),
  ]},
  { key: "recap_mov", phrase: "move las piernas todos", beats: [
    c("stat", { big: "10 × 2", unit: "sentadillas", label: "Levantate de la silla 10 veces, 2 veces al día. Caminá hasta la esquina.", tone: "teal" }),
    r(P("caminar_esquina")),
  ]},
  { key: "empieza", phrase: "empeza esta noche", beats: [
    ak([{ word: "EMPEZÁ ESTA NOCHE", sub: "un pote de requesón, unas nueces, y a dormir", tone: "teal", atPhrase: "un pote de requeson" }], {}),
    r(P("pote_requeson_cama")),
  ]},
  // ░░ INJERTO GUÍA #2 (pitch completo) ░░
  { key: "guia2", phrase: "todo esto ordenado", beats: [
    c("chips", { bg: "image", image: `img/${P("guia_celular_mano")}.png`, imageDarken: 0.62, title: "La guía completa, gratis", chips: ["Qué comer cada noche + cantidades", "Cómo repartir + rutina de la silla", "archivos-federer.vercel.app"] }),
    lt("Bajala y pegala en la heladera — es un regalo", { kicker: "Guía gratuita", desc: "archivos-federer.vercel.app · para acompañarte todas las noches.", tone: "teal", at: "pegala en heladera" }),
  ]},
  // ░░ CARNADA DE COMENTARIOS ░░
  { key: "comentarios", phrase: "contame en los comentarios", beats: [
    lt("Contame tu edad y si te cuesta pararte de la silla", { kicker: "En los comentarios", desc: "Los leo todos. Saber en qué punto estás me ayuda a preparar el próximo archivo.", tone: "teal", at: "cuantos años tenes" }),
    r(P("comentarios_celular")),
  ]},
  // ░░ TEASER + CIERRE ░░
  { key: "teaser", phrase: "en el proximo video", beats: [
    lt("Próximo: el único ejercicio que hacés sentado", { kicker: "No te lo pierdas", desc: "Despierta las piernas más rápido que caminar una hora. Casi nadie lo recomienda.", tone: "teal", at: "el unico ejercicio" }),
    r(P("ejercicio_sentado_silla")),
  ]},
  { key: "cierre", phrase: "tus piernas no se apagaron", beats: [
    c("talk", {}),
    fc([{ t: "Tus" }, { t: "piernas" }, { t: "solo" }, { t: "esperan" }, { t: "que" }, { t: "las" }, { t: "alimentes", hl: true }], { tone: "teal", at: "esperando que las alimentes" }),
  ]},
  { key: "close", phrase: "cuidate movete", beats: [
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
    const n = (beat.items || []).length;
    const spanF = Math.max(30, Math.round(beat.dur * 30));
    beat.items = (beat.items || []).map((it, i) => {
      let atF = null;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 0.5); if (ms != null) atF = Math.round((ms - beat.start) * 30); }
      if (atF == null || atF < 0 || atF > spanF) atF = Math.round(((i + 0.5) / n) * spanF); // fallback: reparto parejo
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    for (let i = 1; i < beat.items.length; i++) if (beat.items[i].at <= beat.items[i - 1].at) beat.items[i].at = beat.items[i - 1].at + Math.round(spanF / (n + 1));
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
