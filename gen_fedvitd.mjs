// gen_fedvitd.mjs — beatsheet del video "Solo 1 VITAMINA mantiene tus piernas fuertes a los 95"
// (Canal Federer Consejos, Dr. Federer, TÚ/mexicano). Avatar fedvitd_opt.mp4 (~33.5min). Anclaje por
// FRASE a captions_fedvitd.json. Look dark-cinematic, kit _fed6. Imágenes gpt-image-2: p_fedvitd_*.png
// + dg_fedvitd_*.png. Estructura: cold-open doña Amelia → gancho 1 vitamina → ancla histórica raquitismo
// + Cerdeña → enemigo → ciencia (VDR, fibras tipo II) → BENEFICIOS COMO NOVELA (5 regalos semana a semana)
// → el ERROR (3 hermanos) → protocolo → remedios caseros (romero, baño de pies, infusión, batido) →
// don Rigoberto + mito → cierre. 3 injertos de venta de la guía (archivos-federer.vercel.app).
import fs from "fs";
const SLUG = "fedvitd";

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
  // ░░ COLD-OPEN — DOÑA AMELIA Y LA SILLA DE RUEDAS ░░
  { key: "hook", phrase: null, start: 1.2, beats: [
    c("talk", {}),                                                        // avatar full 0-2.2 + scrim
    r(P("amelia_silla_ruedas"), { at: "silla de ruedas", kicker: "Doña Amelia, 78 años" }),
    r(P("amelia_paredes_pasos"), { at: "se agarraba de las paredes" }),
    r(P("escaleras_sola"), { at: "no bajaba sola las escaleras" }),
    r(P("expediente_estudios"), { at: "revise su expediente" }),
    r(P("un_solo_numero"), { at: "un solo numero", hold: true }),
    r(P("amelia_pan_dulce_estufa"), { at: "un pan dulce", hold: true }),
  ]},
  { key: "gancho", phrase: "existe una sola vitamina", beats: [
    ak([{ word: "UNA SOLA VITAMINA", sub: "sostiene tus piernas incluso pasados los 90", tone: "teal", atPhrase: "existe una sola vitamina" }], {}),
  ]},
  { key: "desarma", phrase: "empieza a desarmar", beats: [
    fc([{ t: "Tu" }, { t: "cuerpo" }, { t: "desarma" }, { t: "sus" }, { t: "propios" }, { t: "músculos", hl: true }], { tone: "warn", at: "sus propios musculos" }),
    r(P("hombre_mayor_piernas_debiles"), { at: "un suplemento carisimo" }),
  ]},
  // ░░ PRESENTACIÓN + PROMESA ░░
  { key: "presenta", phrase: "en los proximos minutos", beats: [
    c("talk", {}),
    c("chips", { bg: "image", image: `img/${P("federer_consultorio_calido")}.png`, imageDarken: 0.6, title: "Lo que vas a descubrir hoy", chips: ["Por qué se debilitan tus piernas", "La única vitamina que lo cambia todo", "El error que arruina el resultado"] }),
  ]},
  { key: "promesa", phrase: "quedate conmigo hasta el final", beats: [
    ak([{ word: "EL TERCER BENEFICIO", sub: "hace desaparecer el miedo más silencioso de la vejez", tone: "teal", atPhrase: "el tercero es el que hace" }], {}),
  ]},
  // ░░ ANCLA HISTÓRICA — RAQUITISMO / LA ENFERMEDAD INGLESA ░░
  { key: "historia_intro", phrase: "ciudades del norte de europa", beats: [
    c("talk", {}),
    r(P("ciudad_industrial_humo"), { at: "grandes ciudades industriales", kicker: "Hace más de 100 años" }),
  ]},
  { key: "enfermedad_inglesa", phrase: "la enfermedad inglesa", beats: [
    ak([{ word: "LA ENFERMEDAD INGLESA", sub: "niños con las piernas arqueadas, torcidas", tone: "warn", atPhrase: "la enfermedad inglesa" }], {}),
    r(P("nino_piernas_arqueadas"), { at: "piernas arqueadas", hold: true }),
  ]},
  { key: "raquitismo", phrase: "por su nombre", beats: [
    r(P("huesos_blandos_raquitismo"), { at: "huesos blandos" }),
  ]},
  { key: "humo_sol", phrase: "la unica diferencia real", beats: [
    dg(D("campo_vs_ciudad"), "Campo con sol vs ciudad con humo"),
    r(P("chimeneas_humo_cielo"), { at: "las chimeneas de las fabricas" }),
  ]},
  { key: "bacalao", phrase: "aceite de higado de bacalao", beats: [
    r(P("aceite_bacalao_cuchara"), { at: "una cucharada" }),
  ]},
  { key: "enderezan", phrase: "empezaron a enderezarse", beats: [
    r(P("nino_camina_firme"), { at: "volvieron a caminar firmes" }),
  ]},
  { key: "vitaminad_nombre", phrase: "cuarta letra del abecedario", beats: [
    ak([{ word: "VITAMINA D", sub: "la vitamina del sol — la cuarta que se descubrió", tone: "teal", atPhrase: "la cuarta letra" }], {}),
  ]},
  { key: "primera_piernas", phrase: "enfermedad de piernas débiles", beats: [
    fc([{ t: "La" }, { t: "curó" }, { t: "una" }, { t: "enfermedad" }, { t: "de" }, { t: "piernas", hl: true }, { t: "débiles", hl: true }], { tone: "teal", at: "piernas debiles" }),
  ]},
  { key: "cerdena", phrase: "isla de cerdena", beats: [
    r(P("cerdena_pastor_montana"), { at: "pueblos de montana", kicker: "Cerdeña, Italia" }),
    c("stat", { big: "95", unit: "años", label: "y esos pastores siguen subiendo cerros con sus cabras.", tone: "teal" }),
  ]},
  { key: "sol_movimiento", phrase: "sol y movimiento", beats: [
    fc([{ t: "Sol" }, { t: "y" }, { t: "movimiento", hl: true }], { tone: "teal", at: "sol y movimiento" }),
  ]},
  // ░░ ENEMIGO ░░
  { key: "enemigo_intro", phrase: "quiza te moleste un poco", beats: [
    c("talk", {}),
  ]},
  { key: "porque_nadie", phrase: "casi nadie te lo explica", beats: [
    ak([{ word: "¿POR QUÉ NADIE TE LO DICE?", sub: "tu médico te mide todo… menos este número", tone: "warn", atPhrase: "casi nadie te lo explica" }], {}),
  ]},
  { key: "venden", phrase: "calcio en pastillas caras", beats: [
    r(P("farmacia_productos_caros"), { at: "batidos de proteina" }),
    c("splitlist", { title: "Lo que te venden (y deja dinero)", items: ["Calcio en pastillas caras", "Aparatos y cremas para el dolor", "Andaderas y hasta sillas de ruedas"], palette: "G" }),
  ]},
  { key: "gratis", phrase: "practicamente gratis", beats: [
    mv("La solución tiene que ser cara", "La que sostiene tus piernas es casi gratis: te la regala el sol", { flipPhrase: "te la regala el sol" }),
  ]},
  { key: "sintomas", phrase: "te tiembla las piernas", beats: [
    c("checklist", { title: "No lo llames \"la edad\"", items: [
      { text: "Te tiemblan las piernas", state: "warn" },
      { text: "Te cuesta pararte de la silla", state: "warn" },
      { text: "Pierdes el equilibrio y te caes", state: "warn" } ] }),
  ]},
  { key: "es_la_edad", phrase: "la excusa mas comoda", beats: [
    ak([{ word: "\"ES LA EDAD\"", sub: "la excusa que impide buscar la causa verdadera", tone: "warn", atPhrase: "la excusa mas comoda" }], {}),
    c("bars", { title: "La edad no explica la debilidad", unit: "", bars: [
      { label: "Piernas a los 50 con vitamina D baja", value: 45, tone: "danger" },
      { label: "Piernas a los 80 con vitamina D correcta", value: 90, winner: true, note: "lo veo en el consultorio" } ], at: "piernas de 50" }),
    fc([{ t: "La" }, { t: "diferencia" }, { t: "casi" }, { t: "nunca" }, { t: "es" }, { t: "la" }, { t: "edad", hl: true }], { tone: "teal", at: "casi nunca es la edad" }),
  ]},
  // ░░ CIENCIA — EL MECANISMO ░░
  { key: "ciencia_intro", phrase: "que esta pasando dentro de tus piernas", beats: [
    c("talk", {}),
  ]},
  { key: "hormona", phrase: "mas como una hormona", beats: [
    ak([{ word: "NO ES SOLO PARA LOS HUESOS", sub: "actúa como una hormona en todo tu cuerpo", tone: "teal", atPhrase: "como una hormona" }], {}),
  ]},
  { key: "ruta", phrase: "los rayos ultravioleta b", beats: [
    c("cross", { title: "Cómo tu piel fabrica la vitamina", eyebrow: "Del sol a la sangre", layers: [
      { label: "Rayos UVB del sol", color: "#E0A93E", weight: 1 },
      { label: "Tu piel fabrica vitamina D3", color: "#109C99", weight: 2 },
      { label: "Sangre → hígado → riñón → activa", color: "#2E7DB0", weight: 2 } ], at: "una sustancia llamada" }),
    dg(D("ruta_vitamina_d"), "Sol → piel → hígado → riñón → vitamina D activa"),
    ak([{ word: "25-HIDROXIVITAMINA D", sub: "ese es el número que hay que medir", tone: "teal", atPhrase: "25 hidroxivitamina d" }], {}),
  ]},
  { key: "vdr", phrase: "receptores como cerraduras", beats: [
    dg(D("vdr_cerradura_llave"), "Receptores VDR = cerraduras; la vitamina D es la llave"),
    ak([{ word: "LA LLAVE DEL MÚSCULO", sub: "sin vitamina D, la cerradura no abre", tone: "teal", atPhrase: "es la llave de esas cerraduras" }], {}),
  ]},
  { key: "afloja", phrase: "esas cerraduras se quedan cerradas", beats: [
    r(P("musculo_pierna_flojo"), { at: "se afloja" }),
  ]},
  { key: "sarcopenia", phrase: "se llama sarcopenia", beats: [
    ak([{ word: "SARCOPENIA", sub: "el músculo se apaga con la edad — la vitamina D baja lo acelera", tone: "warn", atPhrase: "se llama sarcopenia" }], {}),
  ]},
  { key: "fibras", phrase: "dos tipos de fibras", beats: [
    dg(D("fibras_tipo_dos"), "Fibras lentas vs fibras rápidas (tipo II)"),
  ]},
  { key: "red_seguridad", phrase: "son tu red de seguridad", beats: [
    r(P("tropiezo_alfombra_reflejo"), { at: "tropiezas con el borde" }),
    c("callout", { image: `img/${P("tropiezo_alfombra_reflejo")}.png`, figure: "Tu red de seguridad", caption: "Al tropezar, esta fibra dispara sola para que no te caigas — y depende de la vitamina D.", at: "sin que tu lo pienses" }),
    ak([{ word: "FIBRAS RÁPIDAS = TU RED", sub: "las primeras que se pierden sin vitamina D", tone: "teal", atPhrase: "las que mas dependen" }], {}),
  ]},
  { key: "orquesta", phrase: "tus piernas son una orquesta", beats: [
    dg(D("orquesta_director"), "La vitamina D = el director de la orquesta de tus músculos"),
  ]},
  // ░░ INJERTO GUÍA #1 ░░
  { key: "guia1", phrase: "el enlace abajo en la descripcion", beats: [
    lt("Las medidas exactas están en la descripción", { kicker: "Sin desviarnos", desc: "archivos-federer.vercel.app — el enlace está abajo.", tone: "teal", at: "abajo en la descripcion" }),
  ]},
  // ░░ BENEFICIOS COMO NOVELA — LOS 5 REGALOS DE DOÑA AMELIA ░░
  { key: "novela_intro", phrase: "una lista aburrida de beneficios", beats: [
    c("talk", {}),
    fc([{ t: "No" }, { t: "una" }, { t: "lista" }, { t: "—" }, { t: "una" }, { t: "historia", hl: true }, { t: "real", hl: true }], { tone: "teal", at: "semana por semana" }),
  ]},
  { key: "amelia_llega", phrase: "no llego caminando", beats: [
    r(P("amelia_hijos_entran"), { at: "sus dos hijos" }),
    r(P("sobre_amarillo_estudios"), { at: "un sobre amarillo" }),
  ]},
  { key: "nota", phrase: "deterioro propio de la edad", beats: [
    c("quote", { image: `img/${P("nota_especialista")}.png`, text: "Deterioro propio de la edad. Se recomienda adquirir silla de ruedas y adaptar el domicilio." }),
  ]},
  { key: "renglon", phrase: "sentenciado en un renglon", beats: [
    fc([{ t: "La" }, { t: "sentenciaron" }, { t: "en" }, { t: "un" }, { t: "renglón", hl: true }], { tone: "warn", at: "un renglon" }),
  ]},
  { key: "calcio_dos_anos", phrase: "le habian vendido calcio", beats: [
    r(P("calcio_frascos_farmacia"), { at: "frasco tras frasco" }),
    ak([{ word: "2 AÑOS DE CALCIO, CERO MEDICIÓN", sub: "le vendieron ladrillos y nunca le mandaron al albañil", tone: "warn", atPhrase: "le mandaron al albanil" }], {}),
  ]},
  { key: "piso", phrase: "tan por el piso", beats: [
    r(P("analisis_vitd_bajo"), { at: "cuando llego el resultado" }),
    fc([{ t: "No" }, { t: "era" }, { t: "la" }, { t: "edad", hl: true }], { tone: "teal", at: "no era la edad" }),
  ]},
  { key: "protocolo_amelia", phrase: "su solecito en el patio", beats: [
    c("process", { title: "Lo que empezó a hacer (nada caro)", eyebrow: "Doña Amelia", steps: [
      { title: "Sol", desc: "cada mañana en el patio", image: `img/${P("amelia_sol_patio")}.png` },
      { title: "Sardinas", desc: "y su magnesio", image: `img/${P("sardinas_lata")}.png` },
      { title: "Romero", desc: "aceite en las piernas de noche", image: `img/${P("aceite_romero_frasco")}.png` },
      { title: "Silla", desc: "pararse y sentarse", image: `img/${P("ejercicio_silla")}.png` } ] }),
  ]},
  { key: "regalo1", phrase: "el primer regalo", beats: [
    r(P("amelia_se_para_sola"), { at: "parada frente a la estufa" }),
    ak([{ word: "EL PRIMER REGALO: LA FUERZA", sub: "se levantó sola de la silla, sin manos", tone: "teal", atPhrase: "el primer regalo" }], {}),
  ]},
  { key: "regalo1_det", phrase: "sin usar las manos", beats: [
    r(P("levantarse_sin_manos"), { at: "subir un escalon" }),
  ]},
  { key: "regalo2", phrase: "deje de contar las baldosas", beats: [
    r(P("amelia_camina_derecha_sala"), { at: "por el mero medio" }),
    ak([{ word: "EL SEGUNDO REGALO: EL EQUILIBRIO", sub: "dejó de caminar pegada a la pared", tone: "teal", atPhrase: "el equilibrio habia vuelto" }], {}),
  ]},
  { key: "regalo3_teaser", phrase: "me hizo temblar", beats: [
    fc([{ t: "Y" }, { t: "entonces" }, { t: "vino" }, { t: "el" }, { t: "tercero", hl: true }], { tone: "warn", at: "vino el tercero" }),
  ]},
  { key: "tapete", phrase: "el borde de un tapete", beats: [
    r(P("tropiezo_tapete_sala"), { at: "un tapete" }),
  ]},
  { key: "cadera", phrase: "una cadera rota", beats: [
    ak([{ word: "FRACTURA DE CADERA", sub: "el miedo más peligroso y silencioso de la vejez", tone: "warn", atPhrase: "una cadera rota" }], {}),
    lt("Muchos ya no vuelven a caminar como antes", { kicker: "Con la verdad en la mano", desc: "Pierden su independencia de un día para el otro.", tone: "warn", at: "vuelven a caminar como antes" }),
  ]},
  { key: "atrapa", phrase: "disparo con fuerza y la sostuvo", beats: [
    r(P("pierna_atrapa_no_cae"), { at: "no se cayo" }),
    ak([{ word: "EL TERCER REGALO", sub: "no se cayó — la vitamina le salvó la cadera", tone: "teal", atPhrase: "no se cayo" }], {}),
  ]},
  { key: "libertad", phrase: "la libertad de vivir sin ese miedo", beats: [
    fc([{ t: "Le" }, { t: "devolvimos" }, { t: "la" }, { t: "libertad", hl: true }], { tone: "teal", at: "sin ese miedo" }),
  ]},
  { key: "regalo4", phrase: "no se enfermo fue ella", beats: [
    r(P("familia_gripe_abuela_sana"), { at: "toda la familia cayo" }),
    ak([{ word: "EL CUARTO REGALO: LAS DEFENSAS", sub: "fue la única que no cayó con la gripe", tone: "teal", atPhrase: "no se enfermo fue ella" }], {}),
  ]},
  { key: "regalo5", phrase: "le volvio la luz a los ojos", beats: [
    r(P("amelia_rie_luz_ojos"), { at: "empezo a dormir de corrido" }),
    ak([{ word: "EL QUINTO REGALO: EL ÁNIMO", sub: "volvió a dormir, a despertarse con ganas, a reírse", tone: "teal", atPhrase: "le volvio la luz" }], {}),
  ]},
  { key: "amelia_entra", phrase: "entro caminando sola", beats: [
    r(P("amelia_entra_pan_dulce"), { at: "un pan dulce recien horneado", hold: true }),
  ]},
  { key: "silla_polvo", phrase: "juntando polvo", beats: [
    r(P("silla_ruedas_polvo_rincon"), { at: "en un rincon de la casa", hold: true }),
    fz(P("silla_ruedas_polvo_rincon"), { x: 0.5, y: 0.55, label: "El recordatorio más caro", zoom: 1.5, tone: "warn", at: "el recordatorio mas caro" }),
  ]},
  // ░░ INJERTO GUÍA #2 ░░
  { key: "guia2", phrase: "las deje ordenadas para ti", beats: [
    lt("Las cantidades exactas — ordenadas en la descripción", { kicker: "Si las querés", desc: "archivos-federer.vercel.app — abajo de todo.", tone: "teal", at: "abajo en la descripcion" }),
  ]},
  // ░░ EL ERROR (3 HERMANOS) ░░
  { key: "error_intro", phrase: "punto mas importante de todo el video", beats: [
    c("talk", {}),
    es("!", "El error que arruina todo", { tone: "warn", w: 3.4 }),
  ]},
  { key: "error1", phrase: "creer que con calcio basta", beats: [
    es("01", "Creer que con calcio basta", { tone: "warn", w: 3.4 }),
    dg(D("calcio_albanil"), "Calcio = ladrillos; vitamina D = el albañil que los coloca"),
    c("bars", { title: "Calcio que tu cuerpo aprovecha", unit: "%", bars: [
      { label: "Sin vitamina D", value: 15, tone: "danger", note: "el resto se desperdicia" },
      { label: "Con vitamina D", value: 90, winner: true } ], at: "apenas absorbe una fraccion" }),
    r(P("pastillas_calcio_mano"), { at: "corre a comprar calcio" }),
  ]},
  { key: "error2", phrase: "el sol detras de la ventana", beats: [
    es("02", "Tomar el sol detrás del vidrio", { tone: "warn", w: 3.4 }),
    dg(D("vidrio_bloquea_uvb"), "El vidrio bloquea los rayos UVB: no fabricas nada"),
    r(P("anciano_sol_ventana"), { at: "junto a la ventana" }),
    ak([{ word: "SOL DE MENTIRAS", sub: "el vidrio bloquea los rayos que fabrican la vitamina", tone: "warn", atPhrase: "sol de mentiras" }], {}),
  ]},
  { key: "error3", phrase: "sin sus dos companeras", beats: [
    es("03", "Tomarla sin sus dos aliadas", { tone: "warn", w: 3.4 }),
  ]},
  { key: "magnesio", phrase: "para poder activar la vitamina", beats: [
    dg(D("magnesio_activa"), "Sin magnesio, la vitamina D queda dormida"),
    ak([{ word: "MAGNESIO = LA LLAVE", sub: "sin él, la vitamina D no se enciende", tone: "teal", atPhrase: "necesita magnesio" }], {}),
  ]},
  { key: "k2", phrase: "un policia de transito", beats: [
    dg(D("k2_calcio_arterias"), "La vitamina K2 lleva el calcio al hueso, no a las arterias"),
  ]},
  { key: "equipo", phrase: "los tres juntos son un equipo", beats: [
    c("chips", { title: "El equipo que sí funciona", chips: ["Vitamina D", "+ Magnesio", "+ Vitamina K2"] }),
  ]},
  { key: "liposoluble", phrase: "se disuelve en grasa", beats: [
    ak([{ word: "TÓMALA CON GRASA", sub: "aguacate, un huevo o un chorrito de aceite de oliva", tone: "teal", atPhrase: "se disuelve en grasa" }], {}),
    r(P("comida_grasa_aguacate_huevo"), { at: "un poco de aguacate" }),
  ]},
  // ░░ PROTOCOLO ░░
  { key: "protocolo_intro", phrase: "el protocolo completo", beats: [
    c("talk", {}),
    es("✓", "Tu protocolo, paso a paso", { tone: "teal", w: 3.2 }),
  ]},
  { key: "paso1", phrase: "conoce tu numero", beats: [
    dg(D("medir_25oh"), "Paso 1: pídele a tu médico la 25-hidroxivitamina D"),
    ak([{ word: "MIDE TU NÚMERO", sub: "un análisis barato — nunca a ciegas", tone: "teal", atPhrase: "conoce tu numero" }], {}),
  ]},
  { key: "paso2", phrase: "el sol bien tomado", beats: [
    r(P("anciano_sol_patio_brazos"), { at: "toque tus brazos" }),
    c("splitlist", { title: "El sol, bien tomado", items: ["Al aire libre, sin vidrio de por medio", "Que toque brazos y piernas", "Un rato, varios días — sin quemarte"], palette: "T" }),
  ]},
  { key: "paso2_embudo", phrase: "segun el color de tu piel", beats: [
    lt("Cuánto sol según tu piel — en la descripción", { kicker: "La medida exacta", desc: "archivos-federer.vercel.app", tone: "teal", at: "anotado abajo en la descripcion" }),
  ]},
  { key: "paso3", phrase: "llena tu plato de vitamina", beats: [
    ge("Alimentos con vitamina D", [
      { text: "Sardinas en lata (baratas y potentes)", image: `img/${P("sardinas_lata")}.png` },
      { text: "La yema del huevo", image: `img/${P("yema_huevo")}.png` },
      { text: "Hongos puestos al sol", image: `img/${P("hongos_al_sol")}.png` },
      { text: "Hígado y salmón cuando puedas", image: `img/${P("salmon_higado")}.png` },
    ], { at: "aqui estan tus aliados" }),
  ]},
  { key: "aliadas_plato", phrase: "no te olvides de las dos aliadas", beats: [
    c("splitlist", { title: "Las dos aliadas en tu plato", items: ["Magnesio: pepitas, frijoles, almendras, espinaca", "Un cuadrito de chocolate amargo de verdad", "K2: fermentados y quesos curados"], palette: "G" }),
  ]},
  // ░░ REMEDIOS CASEROS ░░
  { key: "remedios_intro", phrase: "los remedios caseros", beats: [
    c("talk", {}),
    ak([{ word: "REMEDIOS CASEROS", sub: "ayudamos a esas piernas también por fuera", tone: "teal", atPhrase: "los remedios caseros" }], {}),
  ]},
  { key: "romero_intro", phrase: "el aceite de romero para masajear", beats: [
    r(P("romero_maceta"), { at: "una plantita humilde" }),
    ak([{ word: "ACEITE DE ROMERO", sub: "un tesoro para la circulación de las piernas", tone: "teal", atPhrase: "para la circulacion de las piernas" }], {}),
  ]},
  { key: "romero_ciencia", phrase: "acido rosmarinico", beats: [
    dg(D("romero_circulacion"), "Ácido rosmarínico: activa la circulación y desinflama"),
  ]},
  { key: "romero_receta", phrase: "un puñado de romero", beats: [
    c("process", { title: "Aceite de romero, paso a paso", eyebrow: "Remedio 1", steps: [
      { title: "Romero", desc: "un puñado en un frasco de vidrio", image: `img/${P("romero_frasco_vidrio")}.png` },
      { title: "Aceite", desc: "cubrir con oliva o almendras", image: `img/${P("romero_cubre_aceite")}.png` },
      { title: "Baño María", desc: "fuego bajo, sin quemar", image: `img/${P("romero_bano_maria")}.png` },
      { title: "Colar", desc: "y masajear las piernas", image: `img/${P("masaje_piernas_aceite")}.png` } ] }),
  ]},
  { key: "romero_masaje", phrase: "hacia el corazon", beats: [
    r(P("masaje_piernas_noche"), { at: "unos minutos cada noche" }),
    lt("Proporción exacta de romero y aceite — en la descripción", { kicker: "Es muy importante", desc: "Para que salga bien y no se eche a perder.", tone: "teal", at: "las medidas precisas anotadas abajo" }),
  ]},
  { key: "bano_pies", phrase: "un baño de pies", beats: [
    r(P("bano_pies_sal_epsom"), { at: "sal de epsom" }),
    c("splitlist", { title: "Baño de pies con sal de Epsom", items: ["Agua tibia + sal inglesa (puro magnesio)", "Pies y pantorrillas, 15 min de noche", "Suma unas hojitas de romero"], palette: "T" }),
  ]},
  { key: "infusion", phrase: "jengibre y cúrcuma", beats: [
    r(P("infusion_jengibre_curcuma"), { at: "color dorado" }),
    ak([{ word: "JENGIBRE + CÚRCUMA", sub: "antiinflamatorios para rodillas y tobillos", tone: "teal", atPhrase: "antiinflamatorios naturales" }], {}),
  ]},
  { key: "infusion_receta", phrase: "una pizca de pimienta negra", beats: [
    dg(D("pimienta_curcumina"), "Una pizca de pimienta multiplica la absorción de la cúrcuma"),
    c("process", { title: "Infusión de jengibre y cúrcuma", eyebrow: "Remedio 3", steps: [
      { title: "Hervir", desc: "agua + rodajas de jengibre", image: `img/${P("jengibre_hervir")}.png` },
      { title: "Cúrcuma", desc: "una cucharadita", image: `img/${P("curcuma_cucharadita")}.png` },
      { title: "Pimienta", desc: "una pizca — el truco clave", image: `img/${P("pimienta_negra")}.png` },
      { title: "Limón y miel", desc: "y a tomar", image: `img/${P("infusion_taza_limon")}.png` } ] }),
  ]},
  { key: "batido", phrase: "un pequeño batido de la mañana", beats: [
    r(P("batido_platano_pepitas"), { at: "en la licuadora" }),
    ge("Batido de la mañana para tus piernas", [
      { text: "Plátano (potasio, evita calambres)", image: `img/${P("platano")}.png` },
      { text: "Semillas de calabaza (magnesio)", image: `img/${P("pepitas_calabaza")}.png` },
      { text: "Avena + yogur natural", image: `img/${P("avena_yogur")}.png` },
      { text: "Un vaso de leche o tu bebida", image: `img/${P("vaso_leche")}.png` },
    ], { at: "pones un platano" }),
  ]},
  // ░░ MOVIMIENTO ░░
  { key: "movimiento", phrase: "mueve tus piernas", beats: [
    ak([{ word: "MUEVE TUS PIERNAS", sub: "la vitamina construye; el movimiento usa el músculo", tone: "teal", atPhrase: "mueve tus piernas" }], {}),
    c("process", { title: "El ejercicio de la silla", eyebrow: "Sin gimnasio", steps: [
      { title: "Siéntate", desc: "despacio, con control", image: `img/${P("ejercicio_silla_sentar")}.png` },
      { title: "Levántate", desc: "con las piernas, no las manos", image: `img/${P("ejercicio_silla_parar")}.png` },
      { title: "Repite", desc: "aunque sean cinco", image: `img/${P("ejercicio_silla")}.png` },
      { title: "Camina", desc: "la cuadra, cada día", image: `img/${P("caminar_cuadra")}.png` } ] }),
  ]},
  { key: "mov_frase", phrase: "piernas que se quedan", beats: [
    fc([{ t: "Piernas" }, { t: "que" }, { t: "se" }, { t: "mueven" }, { t: "son" }, { t: "piernas" }, { t: "que" }, { t: "se" }, { t: "quedan", hl: true }], { tone: "teal", at: "piernas que se quedan" }),
  ]},
  // ░░ DON RIGOBERTO + MITO ░░
  { key: "rigoberto", phrase: "don rigoberto", beats: [
    c("talk", {}),
    r(P("rigoberto_cuarto"), { at: "no salia de su cuarto", kicker: "Don Rigoberto, 83 años" }),
  ]},
  { key: "nunca_tarde", phrase: "nunca es demasiado tarde", beats: [
    ak([{ word: "NUNCA ES TARDE", sub: "el músculo responde a cualquier edad", tone: "teal", atPhrase: "nunca es demasiado tarde" }], {}),
    c("stat", { big: "90+", unit: "años", label: "y con ejercicio suave volvieron a ganar fuerza.", tone: "teal" }),
  ]},
  { key: "rigoberto_mejora", phrase: "volvio a bajar solo a desayunar", beats: [
    r(P("rigoberto_desayuno_familia"), { at: "a las pocas semanas" }),
  ]},
  { key: "mito", phrase: "cuanta mas mejor", beats: [
    mv("Más vitamina D, siempre mejor", "En dosis exageradas y sin control, hace daño: mide y ajusta", { flipPhrase: "puede hacerte dano" }),
  ]},
  { key: "complementa", phrase: "no lo reemplaza", beats: [
    lt("Esto complementa a tu médico — no lo reemplaza", { kicker: "Con toda honestidad", desc: "Una herramienta para llegar a tu consulta sabiendo más.", tone: "teal", at: "no lo reemplaza" }),
  ]},
  // ░░ CONSEJO FINAL ░░
  { key: "consejo", phrase: "no le regales tus piernas", beats: [
    c("talk", {}),
    fc([{ t: "No" }, { t: "le" }, { t: "regales" }, { t: "tus" }, { t: "piernas" }, { t: "a" }, { t: "la" }, { t: "edad", hl: true }], { tone: "teal", at: "sin pelear" }),
    c("headline", { tokens: ["Tus piernas te cargaron toda la vida", { t: "ahora te toca cuidarlas a ti", hl: true }], at: "es tu turno de cuidarlas" }),
  ]},
  { key: "acciones", phrase: "veces antes de comer", beats: [
    ge("Empieza hoy mismo", [
      { text: "Sal un ratito al sol", image: `img/${P("anciano_sol_patio_brazos")}.png` },
      { text: "Una lata de sardinas en la despensa", image: `img/${P("sardinas_lata")}.png` },
      { text: "Prepara tu aceite de romero", image: `img/${P("aceite_romero_frasco")}.png` },
      { text: "La silla: cinco veces antes de comer", image: `img/${P("ejercicio_silla")}.png` },
    ], { at: "ponte una lata de sardinas" }),
  ]},
  // ░░ INJERTO GUÍA #3 (pitch completo) ░░
  { key: "guia3", phrase: "mi guia completa de la salud", beats: [
    r(P("guia_libro_recetas"), { at: "mi guia completa", hold: true }),
    c("chips", { bg: "image", image: `img/${P("guia_libro_recetas")}.png`, imageDarken: 0.62, title: "Guía de la Salud después de los 60", chips: ["Protocolo + cantidades exactas", "+150 remedios caseros", "archivos-federer.vercel.app"] }),
    lt("El enlace está abajo, en la descripción", { kicker: "Un regalo, no una obligación", desc: "archivos-federer.vercel.app — complementa, no reemplaza a tu médico.", tone: "teal", at: "el enlace esta justo abajo" }),
  ]},
  // ░░ CARNADA + COMPARTIR + CIERRE ░░
  { key: "comentarios", phrase: "de que parte de mexico", beats: [
    c("talk", {}),
    lt("¿De qué parte nos ves? ¿Te midieron la vitamina D?", { kicker: "En los comentarios", desc: "Los leo todos, uno por uno. Cuéntame tu caso.", tone: "teal", at: "en los comentarios" }),
  ]},
  { key: "compartir", phrase: "alguien que amas", beats: [
    fc([{ t: "Compártelo" }, { t: "con" }, { t: "alguien" }, { t: "que" }, { t: "amas", hl: true }], { tone: "teal", at: "alguien que amas" }),
    r(P("compartir_video_familia"), { at: "esa persona lleva anos" }),
  ]},
  { key: "cierre", phrase: "un fuerte abrazo", beats: [
    c("nametag", { name: "Dr. Federer", role: "Cuídate mucho — y cuida esas piernas que tanto te han llevado", image: `img/${P("federer_despide")}.png` }),
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
const VIDEO_END = (CW[CW.length - 1]?.s || 2012) + 2;

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
    // avatarkeyword usa el avatar principal con seek (avatarFrom) — sin sub-clips.
    if (beat.kind === "avatarpizarra") { beat.clip = `avatar_clips/${SLUG}/${beat.id}.mp4`; KIT_CLIPS.push({ name: beat.id, start: +beat.start.toFixed(2), dur: +(beat.dur + 0.4).toFixed(2) }); }
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
fs.mkdirSync("src/_fed6/VideoEdit", { recursive: true });
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — beats (imágenes p_${SLUG}_*.png / dg_${SLUG}_*.png).\n` +
  `export const FEDZ_BEATS: any[] = ${JSON.stringify(beats)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_hooks.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — rangos talk.\n` +
  `export const TALKSZ: { start: number; dur: number }[] = ${JSON.stringify(talks)};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "federer_dark", clipsfirst: true, beats }, null, 1));

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
