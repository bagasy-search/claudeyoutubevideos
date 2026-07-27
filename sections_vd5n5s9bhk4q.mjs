// sections_vd5n5s9bhk4q.mjs — el MAPA de dirección del video (qué se ve en cada momento).
// Lo consume gen_vd5n5s9bhk4q.mjs, que lo ancla al ms del caption.
const SLUG = "vd5n5s9bhk4q";

export const P = (n) => `p_${SLUG}_${n}`;
export const D = (n) => `dg_${SLUG}_${String(n).replace(/^dg_/, "")}`;

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
const I = (n) => `img/${P(n)}.png`;

export const SECTIONS = [
  // ══ TRAMO 1 ══════════════════════════════════════════════════════════════
  { key: "hook", phrase: null, start: 0.4, beats: [
    c("talk", {}),
    r(P("rama_romero_asado_brasas"), { at: "que casi todos tiran arriba", kicker: "La rama que casi todos tiran" }),
    r(P("guante_algodon_viejo_mesa"), { at: "en un guante de algodon viejo" }),
    r(P("frasco_crema_caro_ochenta"), { at: "que ningun frasco de" }),
    fc([{ t: "Trabaja" }, { t: "8" }, { t: "horas" }, { t: "mientras" }, { t: "vos" }, { t: "dormís", hl: true }], { tone: "teal", at: "horas seguidas mientras vos dormis" }),
    ak([{ word: "ROMERO", sub: "No es una crema. Es una rama.", tone: "teal", atPhrase: "No es una crema es romero" }], {}),
    mv("Suena a cuento de abuela", "Tiene nombre, tiene mecanismo y tiene número", { flipPhrase: "tiene nombre tiene mecanismo y" }),
  ]},
  { key: "amanda", phrase: "Vino al consultorio por otra", beats: [
    c("talk", {}),
    r(P("amanda_consultorio_tensiometro"), { at: "por un tema de presion" }),
    r(P("amanda_sube_manga_costado"), { at: "se subio la manga de costado", kicker: "Tapándose con la otra mano" }),
    c("quote", { image: I("amanda_sube_manga_costado"), text: "Doctor, hace cuatro años que *no me saco el saquito*. Ni en enero, ni con cuarenta grados." }),
    r(P("saquito_hilo_verano_calor"), { at: "y un saquito de hilo puesto", hold: true }),
  ]},
  { key: "boda", phrase: "Era que a su nieta", beats: [
    r(P("vestido_sin_mangas_percha"), { at: "Ya tenia el vestido comprado", kicker: "Y el vestido no tenía mangas", hold: true }),
    r(P("amanda_ojos_llorosos_consultorio"), { at: "se le llenaron los ojos" }),
    lt("Una mujer de 68 años llorando por la piel de sus brazos", { kicker: "Seis nietos", desc: "No es vanidad. Es dejar de esconderse.", tone: "warn", at: "llorando por la piel de" }),
  ]},
  { key: "espejo", phrase: "te estas mirando el brazo", beats: [
    c("talk", {}),
    r(P("brazo_piel_crepe_macro"), { at: "arruga finita como papel de seda" }),
    fz(P("brazo_piel_crepe_macro"), { x: 0.5, y: 0.55, label: "Se arruga como papel de seda", zoom: 1.7, tone: "warn", at: "la agarras entre dos dedos" }),
    r(P("brazo_cara_inferior_crepe"), { at: "la parte de abajo del brazo", kicker: "Textura crepé" }),
    c("chips", { bg: "image", image: I("brazo_cara_inferior_crepe"), imageDarken: 0.62, title: "Lo que te llevás de este video", chips: ["Lo que usó doña Amanda", "El mecanismo completo", "Y no comprás nada"] }),
    c("looplock", { title: "El error del 90%", sub: "no se comete de noche — te lo digo al final", at: "te voy a mandar a comprar" }),
  ]},
  { key: "colageno", phrase: "el numero que a mi", beats: [
    c("stat", { big: "1%", unit: "por año", label: "Colágeno que perdés desde los 20", tone: "teal" }),
    dg(D("colageno_perdida_anual"), "Curva descendente del colágeno desde los 20 años"),
    ak([{ word: "48 AÑOS", sub: "de ese 1% acumulándose en silencio", tone: "warn", atPhrase: "de dona Amanda son" }], {}),
    ak([{ word: "30%", sub: "del colágeno de la piel en los 5 años tras la menopausia", tone: "warn", atPhrase: "despues de la menopausia se puede" }], {}),
    dg(D("menopausia_caida_colageno"), "Caída del 30% concentrada en 5 años"),
    fc([{ t: "No" }, { t: "es" }, { t: "la" }, { t: "edad" }, { t: "parejo" }, { t: "es" }, { t: "un" }, { t: "derrumbe", hl: true }], { tone: "warn", at: "Eso es un derrumbe concentrado" }),
  ]},
  { key: "camionero", phrase: "el brazo y no la cara", beats: [
    c("talk", {}),
    r(P("camionero_cara_asimetrica"), { at: "el caso de un camionero", kicker: "Caso publicado en 2012", hold: true }),
    r(P("camion_ventanilla_sol_lateral"), { at: "Y la foto de ese hombre" }),
    fz(P("camionero_cara_asimetrica"), { x: 0.32, y: 0.45, label: "El lado de la ventanilla", zoom: 1.8, tone: "warn", at: "que daba a la ventanilla" }),
    c("splitlist", { title: "Misma persona, misma edad", items: ["Misma sangre", "Mismos genes", "Distinto lado del vidrio"], palette: "T" }),
    c("callout", { image: I("camionero_cara_asimetrica"), figure: "28 años al volante", caption: "Media cara de 69. Media cara de 90." }),
    lt("La única diferencia era de qué lado le pegaba la luz", { kicker: "Mismo hombre", desc: "El vidrio deja pasar el UVA que rompe el colágeno.", tone: "warn", at: "pegaba la luz por el vidrio" }),
  ]},
  { key: "loop_error", phrase: "Acordate de ese camionero", beats: [
    ak([{ word: "EL ERROR", sub: "por eso el 90% no ve nada", tone: "warn", atPhrase: "el error que hace que" }], {}),
    fc([{ t: "No" }, { t: "de" }, { t: "noche" }, { t: "a" }, { t: "la" }, { t: "mañana", hl: true }], { tone: "warn", at: "el error no se comete" }),
    lt("Antes de las nueve de la mañana", { kicker: "El error", desc: "Ahí se arruina todo lo que hiciste de noche.", tone: "warn", at: "Se comete a la manana" }),
  ]},
  { key: "presenta", phrase: "que me presente recien ahora", beats: [
    c("talk", {}),
    lt("Dr. Federer · Federer Archivos", { kicker: "Más de 10 años de consultorio", desc: "Lo que en el consultorio nunca me dan el tiempo de explicar.", tone: "teal", at: "Esto es Federer Archivos" }),
    ak([{ word: "12 MINUTOS", sub: "lo que dura un turno. Esto necesita veinte.", tone: "teal", atPhrase: "Porque un turno dura" }], {}),
    r(P("federer_consultorio_reloj"), { at: "Y te aviso algo desde ahora" }),
  ]},
  { key: "nocompres", phrase: "te vengo a vender un frasco", beats: [
    mv("Para la piel del brazo hay que gastar en cremas caras", "Todo lo que necesitás ya está en tu cocina", { flipPhrase: "esta en tu cocina" }),
    c("checklist", { title: "Lo que NO vas a necesitar", items: [{ text: "El frasco de ochenta dólares", state: "warn" }, { text: "La crema antiedad de farmacia", state: "warn" }, { text: "Romero y un guante de algodón", state: "done" }] }),
    r(P("cocina_romero_pan_mesa"), { at: "menos que un kilo de pan" }),
  ]},
  { key: "circulacion", phrase: "Yo miro casi todo desde la", beats: [
    c("talk", {}),
    ak([{ word: "CIRCULACIÓN", sub: "después de los 60, casi todo empieza ahí", tone: "teal", atPhrase: "casi todo lo que sentimos" }], {}),
    fc([{ t: "La" }, { t: "sangre" }, { t: "es" }, { t: "el" }, { t: "camión" }, { t: "de" }, { t: "reparto", hl: true }], { tone: "teal", at: "La sangre es el camion de" }),
    r(P("camion_reparto_barrio_calle"), { at: "cuando el camion no llega" }),
    ap([
      { card: "El último barrio", sub: "a la piel el camión llega último. Siempre.", atPhrase: "al que el camion llega ultimo" },
      { card: "Y peor todavía", sub: "la cara de abajo del brazo, entre el codo y la axila", atPhrase: "hay una zona a la que" },
    ], {}),
    dg(D("circulacion_barrio_piel"), "La piel al final de la ruta de reparto"),
    r(P("brazo_cara_inferior_saludo"), { at: "entre el codo y la axila", kicker: "Esa parte que se mueve cuando saludás" }),
  ]},
  { key: "mecanismo", phrase: "Vamos con el mecanismo", beats: [
    mv("Tenés el brazo arrugado porque te falta crema", "Te faltan tres cosas, y ninguna es crema", { flipPhrase: "arrugada porque te falta crema" }),
    ak([{ word: "TRES COSAS", sub: "y ninguna es crema", tone: "teal", atPhrase: "Te faltan tres cosas" }], {}),
  ]},
  { key: "falta1_agua", phrase: "Te falta agua en la capa", beats: [
    es("01", "Te falta agua en la capa de arriba", { w: 3.6 }),
    fc([{ t: "No" }, { t: "agua" }, { t: "de" }, { t: "tomar" }, { t: "agua" }, { t: "en" }, { t: "la" }, { t: "barrera", hl: true }], { tone: "teal", at: "No agua de tomar" }),
    ak([{ word: "ESTRATO CÓRNEO", sub: "la capa de células muertas que forma la barrera", tone: "teal", atPhrase: "Esa capa se llama estrato corneo" }], {}),
    r(P("pared_ladrillos_sin_cemento"), { at: "es literalmente una pared de ladrillos", hold: true }),
    dg(D("estrato_corneo_ladrillos"), "Ladrillos = células · cemento = grasas"),
    c("annotated", { image: I("pared_ladrillos_sin_cemento"), eyebrow: "Estrato córneo", caption: "Ladrillos = células. Cemento = grasas. Con los años, el cuerpo fabrica menos cemento." }),
    c("splitlist", { title: "El cemento que dejás de fabricar", items: ["Menos ceramidas", "Menos colesterol", "Menos ácidos grasos"], palette: "T" }),
    lt("Pérdida de agua transepidérmica", { kicker: "Tiene nombre en dermatología", desc: "Una pared sin cemento pierde agua todo el día. Todos los días.", tone: "warn", at: "Eso tiene nombre en dermatologia" }),
    dg(D("perdida_agua_transepidermica"), "El agua escapando por las juntas sin cemento"),
    fc([{ t: "No" }, { t: "se" }, { t: "ve" }, { t: "seca" }, { t: "se" }, { t: "ve" }, { t: "arrugada", hl: true }], { tone: "warn", at: "La piel no se ve seca" }),
    fz(P("brazo_piel_papel_seda_dedos"), { x: 0.5, y: 0.5, label: "Finita. De papel.", zoom: 1.8, tone: "warn", at: "la textura que estas mirando ahora" }),
  ]},
  { key: "falta2_glandulas", phrase: "Y esto casi nadie te lo", beats: [
    es("02", "Te faltan glándulas", { w: 3.6 }),
    ak([{ word: "SEBÁCEAS", sub: "la cara tiene una cantidad enorme. El brazo, casi ninguna.", tone: "teal", atPhrase: "Enorme de glandulas sebaceas" }], {}),
    r(P("nariz_brilla_piel_cara"), { at: "Por eso te brilla la nariz" }),
    dg(D("glandulas_cara_vs_brazo"), "Densidad de glándulas: cara vs brazo"),
    c("bars", { title: "Glándulas sebáceas por zona", unit: "", items: [{ label: "Cara y frente", value: 100 }, { label: "Espalda", value: 55 }, { label: "Cara de abajo del brazo", value: 8 }] }),
    fc([{ t: "El" }, { t: "brazo" }, { t: "nunca" }, { t: "tuvo" }, { t: "su" }, { t: "propia" }, { t: "crema", hl: true }], { tone: "warn", at: "una de las zonas con menos" }),
  ]},

  // ══ TRAMO 2 ══════════════════════════════════════════════════════════════
  { key: "glandulas2", phrase: "las zonas con menos glandulas", beats: [
    c("talk", {}),
    ak([{ word: "SIN GLÁNDULAS", sub: "el brazo casi no fabrica su propia grasa", tone: "warn", atPhrase: "nunca tuvo su propia crema" }], {}),
    r(P("brazo_piel_papel_luz_ventana"), { at: "la pared todavia tenia cemento", kicker: "A los 20 el cemento todavía estaba" }),
  ]},
  { key: "riego", phrase: "se pierde densidad de capilares", beats: [
    c("talk", {}),
    dg(D("capilares_dermis_cierre"), "Red capilar densa a los 20 vs cerrada a los 60"),
    fc([{ t: "Oxígeno" }, { t: "y" }, { t: "aminoácidos" }, { t: "para" }, { t: "el" }, { t: "colágeno", hl: true }], { tone: "teal", at: "los que le llevan el oxigeno" }),
    ak([{ word: "FIBROBLASTOS", sub: "las células que levantan la pared", tone: "teal", atPhrase: "las celulas que fabrican colageno" }], {}),
    r(P("albanil_manos_vacias_pared"), { at: "un fibroblasto sin riego", kicker: "Va a trabajar. No tiene con qué." }),
  ]},
  { key: "pared_gotea", phrase: "le pones una crema carisima", beats: [
    c("talk", {}),
    ap([{ card: "Sin cemento", sub: "la barrera está rota", atPhrase: "la crema se te evapora" },
        { card: "Sin glándulas", sub: "nada que la selle" },
        { card: "Sin riego", sub: "nadie trae materiales" }], {}),
    r(P("crema_cara_mesa_luz_manana"), { at: "la piel esta igual que ayer", kicker: "Tres horas. Y a la mañana, igual." }),
    r(P("pared_humeda_pintura_rodillo"), { at: "le estas poniendo pintura" }),
    mv("La crema que compraste es mala", "Es pintura sobre una pared que gotea", { flipPhrase: "la pintura no tapa la gotera" }),
  ]},
  { key: "tres_a_la_vez", phrase: "ataca las tres cosas", beats: [
    c("talk", {}),
    c("checklist", { title: "Romero + guante: las tres a la vez", items: [
        { text: "Repone el cemento de la barrera", state: "done" },
        { text: "Tapa y frena la fuga de agua", state: "done" },
        { text: "Llama sangre a la zona", state: "done" }] }),
  ]},
  { key: "la_planta", phrase: "Empecemos por la planta", beats: [
    c("talk", {}),
    es("01", "La planta", { w: 3.6 }),
    r(P("romero_rama_manos_mesa"), { at: "el romero no es perejil", kicker: "Romero. No es perejil." }),
    ap([{ card: "Ácido carnósico", sub: "antioxidante", atPhrase: "El romero tiene tres compuestos" },
        { card: "Ácido rosmarínico", sub: "antiinflamatorio" },
        { card: "Ácido ursólico", sub: "espesor" }], {}),
  ]},
  { key: "carnosico", phrase: "es el acido carnosico", beats: [
    c("talk", {}),
    ak([{ word: "CARNÓSICO", sub: "de los antioxidantes vegetales más potentes que se conocen", tone: "teal", atPhrase: "Es uno de los antioxidantes vegetales" }], {}),
    r(P("aceite_cocina_botella_conservante"), { at: "Lo usa como conservante natural", kicker: "Conservante natural en la industria" }),
    dg(D("oxidacion_piel_mecanismo"), "La misma oxidación en la manzana y en la piel"),
    r(P("manzana_cortada_marron_tabla"), { at: "Por el que una manzana cortada", kicker: "El mismo proceso" }),
  ]},
  { key: "rosmarinico", phrase: "Es el acido rosmarinico", beats: [
    c("talk", {}),
    ak([{ word: "GLICACIÓN", sub: "el azúcar de la sangre se pega al colágeno y lo endurece", tone: "warn", atPhrase: "cuando el azucar de la sangre" }], {}),
    dg(D("glicacion_colageno_rigido"), "Colágeno flexible vs colágeno glicado y quebradizo"),
    lt("La prueba casera", { kicker: "Treinta segundos, ahora mismo", desc: "Pellizcá el dorso de la mano, soltá y contá.", tone: "teal", at: "cual es la prueba casera de" }),
    r(P("pellizco_dorso_mano_mayor"), { at: "Del dorso de la mano" }),
    fz(P("pellizco_dorso_mano_mayor"), { x: 0.52, y: 0.55, label: "Si tarda en volver, ahí tenés la respuesta", zoom: 1.6, tone: "warn", at: "Si tarda en volver" }),
  ]},
  { key: "ursolico", phrase: "es el que mas me interesa", beats: [
    c("talk", {}),
    ak([{ word: "URSÓLICO", sub: "vive en la cerita que cubre la hoja", tone: "teal", atPhrase: "Que cubre la hoja del romero" }], {}),
    dg(D("espesor_epidermis_ursolico"), "Epidermis fina vs epidermis con más espesor y colágeno"),
    fc([{ t: "Espesor" }, { t: "justo" }, { t: "lo" }, { t: "que" }, { t: "perdiste", hl: true }], { tone: "teal", at: "Justo lo que perdiste" }),
  ]},
  { key: "ensayo_ocho", phrase: "Con un extracto de romero", beats: [
    c("talk", {}),
    r(P("frasco_extracto_romero_citrico_mesa"), { at: "Combinado con un citrico", kicker: "Tomado por vía oral" }),
    lt("Ensayo clínico publicado", { kicker: "Mejora medida, no prometida", desc: "Menos profundidad de arrugas a las ocho semanas.", tone: "teal", at: "Se midio una mejora real" }),
    c("stat", { big: "8", unit: "semanas", label: "No tres días. Anotate ese número.", tone: "teal" }),
    ak([{ word: "PACIENCIA", sub: "te voy a pedir ocho semanas, y ya sabés de dónde sale", tone: "warn", atPhrase: "Te voy a pedir paciencia" }], {}),
  ]},
  { key: "circulacion2", phrase: "La parte de la circulacion", beats: [
    c("talk", {}),
    c("bars", { title: "Aceite de romero contra minoxidil", unit: "seis meses", items: [
        { label: "Aceite de romero", value: 10 },
        { label: "Minoxidil al dos por ciento", value: 10 }] }),
    lt("El romero no perdió", { kicker: "Ensayo de 2015, cuero cabelludo", desc: "Seis meses de aplicación diaria.", tone: "teal", at: "En el cuero cabelludo" }),
    ak([{ word: "RUBEFACIENTE", sub: "llama sangre a la zona donde se aplica", tone: "teal", atPhrase: "Que propusieron los autores" }], {}),
    dg(D("rubefaciente_capilares_abiertos"), "Capilares cerrados vs dilatados tras el romero"),
    fc([{ t: "Riego" }, { t: "capilares" }, { t: "el" }, { t: "camión" }, { t: "de" }, { t: "reparto", hl: true }], { tone: "teal", at: "Y que te dije" }),
    ap([{ card: "El material", sub: "los ladrillos para la pared", atPhrase: "es la unica cosa barata" },
        { card: "El camión", sub: "la sangre que los lleva hasta ahí" }], {}),
  ]},
  { key: "guia_cantidades", phrase: "te hago la primera", beats: [
    c("talk", {}),
    r(P("frasco_ambar_romero_macerado_cocina"), { at: "con el paso a paso", kicker: "Todo esto, ordenado por escrito" }),
    c("process", { title: "El paso a paso completo", eyebrow: "Guía, sección piel", steps: [
        { title: "El aceite", desc: "romero y aceite portador, cantidades exactas" },
        { title: "El macerado", desc: "cuántos días y a qué temperatura" },
        { title: "El colado", desc: "cuándo filtrarlo y en qué frasco guardarlo" },
        { title: "La aplicación", desc: "brazo, guante de algodón, toda la noche" }] }),
    lt("Las cantidades, escritas", { kicker: "Nadie las anota mirando un video", desc: "Están en la descripción. Abrila cuando termines.", tone: "teal", at: "te las deje escritas" }),
  ]},
  { key: "el_guante0", phrase: "que todos se saltean", beats: [
    c("talk", {}),
    es("02", "El guante", { w: 3.6 }),
    r(P("aceite_romero_frotado_brazo_noche"), { at: "Si vos te pones", kicker: "Aceite, frotado, a dormir" }),
    r(P("sabana_acolchado_mancha_aceite"), { at: "te vas a dormir", kicker: "Te lo llevás puesto la sábana" }),
  ]},
  { key: "oclusion", phrase: "y no paso nada", beats: [
    c("talk", {}),
    ak([{ word: "OCLUSIÓN", sub: "tapar la piel cambia el juego entero", tone: "teal", atPhrase: "La oclusion cambia el juego" }], {}),
    dg(D("perdida_agua_ocluida"), "Piel destapada perdiendo agua vs piel tapada que la retiene"),
    c("stat", { big: "95%", unit: "menos fuga", label: "El mejor oclusivo que se conoce: la vaselina", tone: "teal" }),
    c("splitlist", { title: "La piel tapada se hidrata sola", items: ["No hace falta que le pongas agua", "Hace falta que dejes de perderla"], palette: "T" }),
  ]},
  { key: "absorcion", phrase: "hay un segundo efecto", beats: [
    c("talk", {}),
    ak([{ word: "ABSORBE", sub: "piel tapada, tibia y húmeda: entra muchísimo más", tone: "teal", atPhrase: "lo que le pongas encima" }], {}),
    r(P("guante_algodon_viejo_brazo_cama"), { at: "Es un truco viejo", kicker: "Un truco viejo de dermatología" }),
    lt("Terapia oclusiva", { kicker: "Se usa hace décadas con cremas medicadas", desc: "Tapás, y el activo entra en serio en vez de quedarse arriba.", tone: "teal", at: "con las cremas medicadas" }),
  ]},

  // ══ TRAMO 3 ══════════════════════════════════════════════════════════════
  { key: "noche_ventana", phrase: "de noche la piel se repara", beats: [
    c("talk", {}),
    dg(D("reloj_piel_noche"), "Pico de división celular de la epidermis en la madrugada"),
    ak([{ word: "TU VENTANA", sub: "de noche la barrera está más permeable: lo que pongas, entra", tone: "teal", atPhrase: "eso que suena a problema" }], {}),
    fc([{ t: "La" }, { t: "piel" }, { t: "abre" }, { t: "la" }, { t: "puerta", hl: true }], { tone: "teal", at: "la piel abre la puerta" }),
    r(P("habitacion_aire_seco_noche"), { at: "el aire seco de tu habitacion", kicker: "¿Qué la está esperando del otro lado?" }),
    r(P("guante_algodon_brazo_cama"), { at: "por un guante de algodon", kicker: "Aceite atrapado contra la piel" }),
    c("stat", { big: "8 h", unit: "por noche", label: "Trabajando mientras vos dormís, sin hacer nada", tone: "teal" }),
  ]},
  { key: "paso1_aceite", phrase: "te doy el como", beats: [
    es("01", "El aceite portador", { w: 3.6 }),
    r(P("aceite_oliva_extravirgen_botella"), { at: "Aceite de oliva extra virgen", kicker: "Si tenés la piel muy seca" }),
    r(P("aceite_girasol_alto_oleico"), { at: "o girasol alto oleico", kicker: "Más liviano · sin olor a ensalada" }),
    c("splitlist", { title: "Cuál usar de base", items: ["Oliva extra virgen — piel muy seca", "Girasol alto oleico — más liviano", "Sésamo o almendras — mejor todavía", "El de tu cocina ya sirve"], palette: "T" }),
    lt("El de oliva de tu cocina sirve", { kicker: "No compres nada raro", desc: "No hace falta salir a buscar nada especial.", tone: "teal", at: "pero no salgas a comprar" }),
  ]},
  { key: "error_hervir", phrase: "aca esta el error", beats: [
    c("talk", {}),
    ak([{ word: "NUNCA HIERVE", sub: "el romero se macera a fuego mínimo — nunca, nunca hierve", tone: "warn", atPhrase: "el romero se macera" }], {}),
    dg(D("acido_carnosico_calor"), "El ácido carnósico se destruye con el calor fuerte"),
    fc([{ t: "Estás" }, { t: "cocinando" }, { t: "lo" }, { t: "que" }, { t: "fuiste" }, { t: "a" }, { t: "buscar", hl: true }], { tone: "warn", at: "estas cocinando exactamente lo que fuiste" }),
    mv("Si huele bárbaro, quedó bien", "Te queda un aceite que huele bárbaro y no sirve para nada", { flipPhrase: "y no sirve para nada" }),
    r(P("bano_maria_frasco_romero"), { at: "a fuego el mas bajo", kicker: "Baño María · un par de horas" }),
    c("process", { title: "El macerado con fuego", eyebrow: "Paso a paso", steps: [
      { title: "Romero", desc: "un buen manojo, bien seco", image: I("rama_romero_manojo_mesa") },
      { title: "Baño María", desc: "el fuego más bajo de la hornalla", image: I("bano_maria_frasco_romero") },
      { title: "Dos horas", desc: "sin que burbujee nunca", image: I("hornalla_fuego_minimo_olla") }] }),
    c("checklist", { title: "Control de temperatura", items: [
      { text: "Aceite quieto, apenas tibio", state: "done" },
      { text: "Un par de horas, sin apuro", state: "done" },
      { text: "Si burbujea, apagalo YA", state: "warn" }] }),
  ]},
  { key: "sin_fuego", phrase: "es sin fuego", beats: [
    r(P("frasco_romero_ventana_tibia"), { at: "el frasco cerrado en un lugar", kicker: "Dos o tres semanas en un lugar tibio" }),
    ap([
      { card: "Sacudirlo una vez por día", sub: "todos los días, sin falta", atPhrase: "y lo sacudis una vez" },
      { card: "Dos o tres semanas", sub: "cero calor, cero degradación" }], {}),
    lt("La que yo prefiero", { kicker: "Sin fuego", desc: "Más lenta, pero no perdés nada de lo bueno.", tone: "teal", at: "es la que yo prefiero" }),
  ]},
  { key: "colar_frasco", phrase: "Tercero colar bien", beats: [
    ak([{ word: "NI UNA HOJITA", sub: "vegetal húmedo dentro del aceite = ahí crecen los bichos", tone: "warn", atPhrase: "ni una hojita adentro" }], {}),
    r(P("colar_lienzo_aceite_romero"), { at: "Colas con un lienzo", kicker: "Colar con lienzo y exprimir" }),
    r(P("frasco_vidrio_oscuro_armario"), { at: "y va a un frasco de vidrio", kicker: "Vidrio oscuro, nunca transparente" }),
    fc([{ t: "La" }, { t: "luz" }, { t: "oxida" }, { t: "el" }, { t: "aceite", hl: true }], { tone: "warn", at: "La luz oxida el aceite" }),
    c("stat", { big: "3 meses", unit: "de duración", label: "Guardado en un armario, lejos de la luz", tone: "teal" }),
    lt("Si huele a rancio, lo tirás", { kicker: "Sin discusión", desc: "Olor a crayón o a pintura vieja = se oxidó. No se usa.", tone: "warn", at: "a crayon a pintura vieja" }),
  ]},
  { key: "aplicacion", phrase: "Cuarto la aplicacion", beats: [
    ak([{ word: "PIEL HÚMEDA", sub: "húmeda, no mojada. Y nunca seca.", tone: "teal", atPhrase: "Humeda no mojada no seca" }], {}),
    r(P("brazo_humedo_toalla_bano"), { at: "te secas con la toalla", kicker: "Secarte a medias" }),
    r(P("aceite_romero_gotas_antebrazo"), { at: "y ahi le pones el aceite", kicker: "Tenés unos tres minutos de ventana" }),
    dg(D("sellar_agua_ducha"), "Piel húmeda: el aceite sella el agua · piel seca: sellás el desierto"),
    mv("El aceite hidrata la piel", "El aceite no hidrata: sella adentro el agua de la ducha", { flipPhrase: "esta sellando el agua de la" }),
    fc([{ t: "Con" }, { t: "el" }, { t: "brazo" }, { t: "seco" }, { t: "sellás" }, { t: "el" }, { t: "desierto", hl: true }], { tone: "warn", at: "estas sellando el desierto" }),
    c("annotated", { image: I("aceite_romero_gotas_antebrazo"), eyebrow: "La ventana de 3 minutos", caption: "Salís de la ducha, te secás a medias y ahí va el aceite." }),
  ]},
  { key: "el_guante", phrase: "Y ahi viene el guante", beats: [
    c("talk", {}),
    r(P("media_algodon_punta_cortada"), { at: "una media de algodon vieja", kicker: "Con la punta cortada = manga perfecta" }),
    r(P("manga_algodon_sol_brazo"), { at: "O una manga de algodon", kicker: "De las que se venden para el sol" }),
    r(P("remera_vieja_manga_larga_dormir"), { at: "O directamente una remera vieja", kicker: "Una que uses solo para dormir" }),
    ak([{ word: "ALGODÓN", sub: "no sintético, no plástico, no film de cocina", tone: "warn", atPhrase: "No sintetico no plastico" }], {}),
    lt("El plástico no respira", { kicker: "Ojo con esto", desc: "Te macera la piel de mal modo. Algodón o nada.", tone: "warn", at: "El plastico no respira" }),
    ge("Guardá esto", [
      "Aceite base: oliva o girasol alto oleico",
      "Macerado tibio: nunca hierve",
      "Piel húmeda: recién salido de la ducha",
      "Manga de algodón: toda la noche",
    ]),
  ]},
  { key: "cuanto_tiempo", phrase: "me pregunto cuanto tiempo", beats: [
    r(P("amanda_manga_algodon_durmiendo"), { at: "lo que dure tu sueno", kicker: "Si te lo sacás dormida, no pasa nada" }),
    ap([
      { card: "Veinte minutos", sub: "ya empieza a servir", atPhrase: "ya empieza a servir" },
      { card: "La noche entera", sub: "servís bastante mejor" }], {}),
    ak([{ word: "TODAS LAS NOCHES", sub: "esto es lo más importante de todo lo que te digo hoy", tone: "teal", atPhrase: "Y hacelo todas las noches" }], {}),
  ]},
  { key: "constancia", phrase: "este remedio no falla porque", beats: [
    mv("Lo probé y no pasó nada", "Lo dejaste antes de que la piel llegara a renovarse", { flipPhrase: "no ve nada y lo abandona" }),
    dg(D("renovacion_capa_arriba"), "La capa de arriba tarda 20-30 días en renovarse"),
    c("bars", { title: "Cuánto tarda en verse", unit: "días", items: [
      { label: "Lo que la gente aguanta", value: 4 },
      { label: "Lo que tarda la piel", value: 30 }] }),
    fc([{ t: "No" }, { t: "juzgues" }, { t: "en" }, { t: "cuatro" }, { t: "noches" }, { t: "un" }, { t: "mes", hl: true }], { tone: "warn", at: "un proceso que tarda un mes" }),
  ]},
  { key: "don_julio", phrase: "dejame contarte del otro paciente", beats: [
    c("talk", {}),
    lt("Don Julio", { kicker: "El paciente que me rompió el esquema", desc: "76 años. Jardinero municipal durante 42.", tone: "teal", at: "porque este me rompio el esquema" }),
    r(P("julio_jardinero_manga_larga"), { at: "y fue jardinero municipal", kicker: "42 años a la intemperie" }),
    r(P("julio_intemperie_frio_viento"), { at: "Frio calor viento lluvia", kicker: "Frío, calor, viento, lluvia" }),
    mv("Toda una vida al sol arruina los brazos", "Julio tiene mejores brazos que Amanda, que vivió bajo techo", { flipPhrase: "tiene mejores brazos que dona Amanda" }),
    r(P("amanda_oficina_escritorio_techo"), { at: "trabajo toda su vida bajo un", kicker: "Empleada administrativa · siempre bajo techo" }),
  ]},
  { key: "manga_larga", phrase: "Pense que me iba a decir", beats: [
    c("quote", { image: I("julio_jardinero_manga_larga"), text: "Doctor, yo nunca usé nada. Yo trabajé *siempre de manga larga*." }),
    r(P("padre_ensena_camisa_sol_campo"), { at: "al sol se le trabaja tapado", kicker: "Mi viejo me enseñó" }),
    ak([{ word: "MANGA LARGA", sub: "cuarenta y dos años tapado, sin saber lo que estaba haciendo", tone: "teal", atPhrase: "Ese hombre sin saberlo hizo" }], {}),
    c("stat", { big: "80%", unit: "del trabajo", label: "Hecho solo por taparse los brazos", tone: "teal" }),
    fc([{ t: "Algo" }, { t: "que" }, { t: "no" }, { t: "se" }, { t: "ve" }, { t: "y" }, { t: "no" }, { t: "quema", hl: true }], { tone: "warn", at: "que ella hizo todos los dias" }),
  ]},
  { key: "aviso_limon", phrase: "Antes el segundo aviso", beats: [
    c("talk", {}),
    ak([{ word: "EL LIMÓN", sub: "la peor idea que le podés meter a esta preparación", tone: "warn", atPhrase: "la peor idea que podes tener" }], {}),
    r(P("limon_exprimido_sol_brazo"), { at: "Limon en la piel jamas", kicker: "Limón en la piel: JAMÁS" }),
    mv("El limón es buenísimo para la piel, lo leí", "Limón en la piel jamás — y menos si después te da el sol", { flipPhrase: "Y menos si despues te da" }),
    r(P("limon_lima_apio_bergamota_mesa"), { at: "el apio la bergamota", kicker: "Todos traen lo mismo" }),
    c("splitlist", { title: "Los que traen furocumarinas", items: ["Limón", "Lima", "Apio", "Bergamota", "Ruda", "Higuera"], palette: "T" }),
  ]},
  { key: "furocumarinas", phrase: "que se llaman furocumarinas", beats: [
    dg(D("furocumarinas_esperan_sol"), "Se quedan quietas en la piel y reaccionan cuando llega el sol"),
    ak([{ word: "NO QUEMAN SOLAS", sub: "esperan quietas a que aparezca la luz del sol", tone: "warn", atPhrase: "no te queman solas" }], {}),
    r(P("mancha_marron_brazo_ampollas"), { at: "Y cuando aparece reaccionan", kicker: "Ampollas primero, mancha después" }),
    c("callout", { image: I("mancha_marron_brazo_ampollas"), figure: "Fitofotodermatitis", caption: "Quemadura con ampollas y una mancha marrón que puede tardar meses en irse." }),
    r(P("barman_exprime_limas_sol"), { at: "los que exprimen limas al sol", kicker: "La quemadura del margarita" }),
    fc([{ t: "Limón" }, { t: "en" }, { t: "la" }, { t: "ensalada" }, { t: "nunca" }, { t: "en" }, { t: "el" }, { t: "brazo", hl: true }], { tone: "teal", at: "Asi que limon en la ensalada" }),
  ]},

  // ══ TRAMO 4 ══════════════════════════════════════════════════════════════
  { key: "esencial_no", phrase: "tampoco le pongas el aceite", beats: [
    c("talk", {}),
    r(P("frasquito_esencial_gotero"), { at: "el concentrado que viene en", kicker: "El frasquito chiquito" }),
    ak([{ word: "PURO NO", sub: "sobre la piel irrita, y en algunas personas quema", tone: "warn", atPhrase: "eso no se aplica puro" }], {}),
    mv("Aceite esencial y macerado son lo mismo", "El esencial es concentrado; el macerado es hoja en aceite común", { flipPhrase: "es la hoja dejando sus" }),
    dg(D("esencial_vs_macerado"), "Esencial concentrado vs macerado suave"),
    r(P("macerado_hoja_aceite_frasco"), { at: "en una cantidad grande de", kicker: "Pocas gotas en mucho aceite base" }),
    lt("La proporción exacta está en la descripción", { kicker: "Importante", desc: "Abrila y anotá las gotas por cantidad de aceite base.", tone: "teal", at: "tambien te la deje anotada" }),
  ]},
  { key: "brazo_no_vende", phrase: "por que nadie te vendio", beats: [
    c("talk", {}),
    ak([{ word: "EL BRAZO NO VENDE", sub: "por eso la industria no lo mira", tone: "warn", atPhrase: "Porque el brazo no vende" }], {}),
    r(P("mostrador_cremas_cara_farmacia"), { at: "invierte casi todo en la", kicker: "Casi todo el dinero va a la cara" }),
    c("splitlist", { title: "La cara se muestra · el brazo se tapa", items: ["La cara se fotografía", "La cara en la videollamada", "En el espejo y en el documento", "El brazo se tapa"], palette: "T" }),
    r(P("saco_tapa_brazo_percha"), { at: "Es mas facil venderte un" }),
    lt("Le pusieron un nombre en inglés: crepey skin", { kicker: "Cuando inventaron el mercado", desc: "Un nombre nuevo para poder cobrarte.", tone: "warn", at: "le pusieron un nombre en" }),
    r(P("pote_crema_lujo_precio"), { at: "Un pote que si lo", kicker: "Dura entre tres y cinco semanas" }),
    ak([{ word: "LA RECOMPRA", sub: "el negocio no es la crema: es que vuelvas a comprarla", tone: "warn", atPhrase: "El negocio es la recompra" }], {}),
    fc([{ t: "Te" }, { t: "venden" }, { t: "una" }, { t: "suscripción", hl: true }, { t: "disfrazada" }, { t: "de" }, { t: "frasco" }], { tone: "warn", at: "una suscripcion disfrazada de frasco" }),
    r(P("atado_romero_mesa_humilde"), { at: "No hay a quien patentar", kicker: "No hay a quién cobrarle" }),
  ]},
  { key: "es_la_edad", phrase: "se lo habia comentado a", beats: [
    r(P("medico_pantalla_sin_mirar"), { at: "sin levantar la vista de", kicker: "Sin despegar la vista de la computadora" }),
    c("quote", { image: I("medico_pantalla_sin_mirar"), text: "Y bueno, señora. *Es la edad.*" }),
    ak([{ word: "ES LA EDAD", sub: "la forma elegante de decir: no tengo tiempo para esto", tone: "warn", atPhrase: "la forma mas elegante que" }], {}),
    c("stat", { big: "12 min", unit: "", label: "El turno que da el sistema", tone: "warn", at: "el sistema te da un" }),
    c("checklist", { title: "Lo que entra en un turno de doce minutos", items: [
      { text: "Revisar una presión", state: "done" },
      { text: "Mirar un análisis", state: "done" },
      { text: "Firmar una receta", state: "done" },
      { text: "Explicarte la barrera cutánea", state: "warn" }], at: "No explicas una barrera cutanea" }),
    fc([{ t: "Y" }, { t: "sí" }, { t: "hay" }, { t: "algo" }, { t: "que" }, { t: "hacer", hl: true }], { tone: "teal", at: "De que no hay nada" }),
  ]},
  { key: "honesto", phrase: "vamos a la parte honesta", beats: [
    c("talk", {}),
    lt("Lo que esto NO hace", { kicker: "La parte honesta", desc: "Si no te digo esto, todo lo anterior no vale nada.", tone: "warn", at: "porque si no te digo" }),
    ak([{ word: "NO BORRA MANCHAS", sub: "el pigmento del sol está acumulado en la profundidad", tone: "warn", atPhrase: "Esto no te va a borrar" }], {}),
    r(P("manchas_solares_dorso_mano"), { at: "Esas manchas marrones planas en", kicker: "Antebrazo y dorso de la mano" }),
    dg(D("pigmento_profundidad"), "Dónde vive la mancha solar"),
    r(P("piel_colgada_brazo_triceps"), { at: "No te va a levantar" }),
    ap([
      { card: "Eso es volumen, no piel", sub: "bajaste muchos kilos o perdiste masa muscular", atPhrase: "O por perdida de masa" },
      { card: "Proteína y pesas livianas", sub: "así se trabaja — y eso es otro video", atPhrase: "Eso se trabaja con proteina" }], {}),
    c("checklist", { title: "Lo que este aceite NO hace", items: [
      { text: "Borrar las manchas del sol", state: "warn" },
      { text: "Levantar la piel colgada", state: "warn" },
      { text: "Borrar estrías ni cicatrices", state: "warn" },
      { text: "Reemplazar al médico", state: "warn" }], at: "No borra estrias ni cicatrices" }),
  ]},
  { key: "alerta_medico", phrase: "Si tienes la piel del", beats: [
    r(P("piel_fina_moreton_antebrazo"), { at: "Que se te hacen moretones", kicker: "Moretones con solo apoyarte" }),
    ak([{ word: "PIEL DE PAPEL", sub: "se rompe con un roce y sangra", tone: "warn", atPhrase: "Esa piel de papel de" }], {}),
    c("checklist", { title: "Puede ser…", items: [
      { text: "Corticoides usados mucho tiempo", state: "warn" },
      { text: "Un tema de plaquetas", state: "warn" },
      { text: "Un tema de coagulación", state: "warn" },
      { text: "Puede ser otra cosa", state: "warn" }], at: "Puede ser el efecto de" }),
    fc([{ t: "Eso" }, { t: "no" }, { t: "es" }, { t: "cosmética" }, { t: "es" }, { t: "un" }, { t: "análisis", hl: true }], { tone: "warn", at: "Eso es un analisis de" }),
    ak([{ word: "PICAZÓN SIN NADA", sub: "sin ronchas, sin sarpullido, y no se calma con nada", tone: "warn", atPhrase: "La picazon fuerte en los" }], {}),
    c("splitlist", { title: "Esa picazón a veces habla de…", items: ["El hígado", "La tiroides", "El riñón"], palette: "T", at: "a veces habla del higado" }),
    lt("Pedí turno. En serio.", { kicker: "Si esa es tu situación", desc: "Eso no se arregla con un aceite.", tone: "warn", at: "Si esa es tu situacion" }),
  ]},
  { key: "contraindicaciones", phrase: "las contraindicaciones del romero", beats: [
    lt("Contraindicaciones: reales y cortas", { kicker: "Anotá esto", desc: "Son pocas, pero van en serio.", tone: "warn" }),
    ap([
      { card: "Embarazo o lactancia", sub: "aceite esencial de romero, no. El macerado suave, consultá igual", atPhrase: "Si estas embarazada o dando" },
      { card: "Epilepsia o convulsiones", sub: "el aceite esencial está desaconsejado: no lo uses", atPhrase: "Si tienes epilepsia o convulsiones" }], {}),
    ak([{ word: "ANTICOAGULANTES", sub: "warfarina o similares: avisale a tu médico antes", tone: "warn", atPhrase: "Antes de sumar romero en cantidad" }], {}),
    r(P("menta_salvia_oregano_manojo"), { at: "Si sos alergico a las", kicker: "La familia de las labiadas" }),
    ak([{ word: "PRUEBA DE PARCHE", sub: "para todo el mundo, sin excepción", tone: "warn", atPhrase: "Para todo el mundo" }], {}),
    r(P("parche_antebrazo_prueba"), { at: "Un poquito en la cara", kicker: "Cara interna del antebrazo" }),
    c("stat", { big: "48 h", unit: "", label: "Esperás cuarenta y ocho horas. No cuarenta y ocho minutos.", tone: "warn" }),
    c("checklist", { title: "Si en esas 48 horas…", items: [
      { text: "Pica", state: "warn" },
      { text: "Se pone rojo", state: "warn" },
      { text: "Arde", state: "warn" },
      { text: "No es para vos, y no pasa nada", state: "done" }], at: "Si se pone rojo" }),
  ]},
  { key: "urea", phrase: "Y una ultima honestidad", beats: [
    c("talk", {}),
    ak([{ word: "UREA AL 10%", sub: "la versión de farmacia: existe y funciona", tone: "teal", atPhrase: "Si quieres una version de" }], {}),
    r(P("pomo_urea_farmacia_mostrador"), { at: "Es lo que yo receto", kicker: "Cuando la piel está muy áspera" }),
    c("checklist", { title: "Urea al diez por ciento", items: [
      { text: "No es cara", state: "done" },
      { text: "Está estudiada", state: "done" },
      { text: "Y funciona", state: "done" }] }),
    fc([{ t: "Prefiero" }, { t: "que" }, { t: "te" }, { t: "mejores" }, { t: "a" }, { t: "que" }, { t: "me" }, { t: "creas", hl: true }], { tone: "teal", at: "Prefiero que te mejores" }),
  ]},
  { key: "el_error", phrase: "El error que hace que la", beats: [
    es("!", "El error que arruina todo lo demás", { tone: "warn", w: 3.8 }),
    r(P("camionero_ventanilla_perfil"), { at: "al camionero de la revista", kicker: "28 años manejando" }),
    c("callout", { image: I("camionero_ventanilla_perfil"), figure: "Media cara de 90", caption: "La otra mitad, intacta. Y nunca se quemó.", at: "Ese hombre no se quemo" }),
    ak([{ word: "NUNCA SINTIÓ NADA", sub: "ni colorado, ni ardor, ni aviso", tone: "warn", atPhrase: "Nunca le ardio la cara" }], {}),
  ]},

  // ══ TRAMO 5 ══════════════════════════════════════════════════════════════
  { key: "error_uva", phrase: "Que es el que te pone", beats: [
    c("talk", {}),
    ak([{ word: "UVB", sub: "el que te pone colorado y te quema", tone: "warn", atPhrase: "Que es el que te pone" }], {}),
    r(P("ventanilla_vidrio_rayos_uva"), { at: "Pero deja pasar la mayor parte", kicker: "El vidrio frena uno y deja pasar el otro" }),
    fc([{ t: "El" }, { t: "UVA" }, { t: "es" }, { t: "el" }, { t: "traicionero", hl: true }], { tone: "warn", at: "Y el UVA es el traicionero" }),
  ]},
  { key: "error_dermis", phrase: "Se mete en la dermis", beats: [
    dg(D("uva_profundidad_dermis"), "El UVB frena en la epidermis; el UVA llega a la dermis"),
    r(P("fibras_colageno_tijera"), { at: "las fibras de colageno y elastina", kicker: "Enzimas que cortan como una tijera" }),
    mv("Si no me quemo, no me hago daño", "El UVA rompe el colágeno sin dolor y sin aviso", { flipPhrase: "sin que sientas absolutamente nada" }),
    fc([{ t: "Sin" }, { t: "dolor" }, { t: "Sin" }, { t: "señal" }, { t: "Sin" }, { t: "aviso", hl: true }], { tone: "warn", at: "Sin dolor sin senal sin aviso" }),
  ]},
  { key: "error_cotidiano", phrase: "Y eso es lo que estas", beats: [
    c("talk", {}),
    r(P("brazo_apoyado_ventanilla_auto"), { at: "El brazo apoyado en la ventanilla", kicker: "Camino al trabajo" }),
    r(P("brazo_marco_ventanilla_colectivo"), { at: "El brazo en el marco de" }),
    r(P("brazo_sol_mediodia_patio"), { at: "El brazo al sol del mediodia" }),
    r(P("colgando_ropa_patio_sol"), { at: "Cuando colgas la ropa en el", kicker: "Los ocho minutos que no cuentan" }),
    r(P("mate_mesa_ventana_manana"), { at: "donde tomas el mate todas las", kicker: "El mate de todas las mañanas" }),
    lt("El UVA entra por el vidrio de tu casa", { kicker: "Adentro", desc: "Auto, colectivo, ventana de la cocina. Todos los días.", tone: "warn" }),
  ]},
  { key: "error_amanda", phrase: "La mujer que nunca trabajo al", beats: [
    c("talk", {}),
    r(P("amanda_joven_auto_ventanilla"), { at: "con el brazo izquierdo apoyado en", kicker: "40 años del mismo lado" }),
    dg(D("amanda_dos_brazos_uva"), "Brazo de la ventanilla vs brazo protegido"),
    r(P("amanda_dos_brazos_espejo"), { at: "comparamos los dos brazos delante del", hold: true }),
    c("splitlist", { title: "Reparás de noche, rompés de mañana", items: ["Ocho horas reparando mientras dormís", "Cuarenta minutos de viaje al trabajo", "Y volvés al punto de partida"], palette: "T", at: "de noche reparando la piel" }),
    ak([{ word: "NUNCA TE QUEMASTE", sub: "por eso jamás sospechaste de esto", tone: "warn", atPhrase: "Y como nunca te quemaste jamas" }], {}),
  ]},
  { key: "error_solucion", phrase: "Y por eso nadie la hace", beats: [
    c("talk", {}),
    r(P("manga_algodon_brazo_manejando"), { at: "Una manga de algodon liviana en", kicker: "Manga liviana cuando manejás" }),
    r(P("protector_solar_brazos_manana"), { at: "O protector solar en los brazos", kicker: "En los BRAZOS, a la mañana" }),
    c("checklist", { title: "La solución de treinta segundos", items: [
      { text: "Manga de algodón liviana al manejar", state: "done" },
      { text: "O protector solar en los brazos, a la mañana", state: "done" },
      { text: "Todos los días, aunque esté nublado", state: "done" }], at: "No solo cuando vas a la" }),
    dg(D("uva_atraviesa_nubes"), "El UVA atraviesa las nubes casi entero"),
    fc([{ t: "Reparar" }, { t: "en" }, { t: "el" }, { t: "mismo" }, { t: "agujero", hl: true }], { tone: "warn", at: "reparar en el mismo agujero" }),
  ]},
  { key: "recap", phrase: "Te hago el resumen", beats: [
    c("talk", {}),
    c("focuscards", { title: "Las 5 cosas de esta noche", items: [
      { image: I("recap_macera_romero"), label: "1 · Macerá el romero en aceite", atPhrase: "Macera el romero en aceite a" },
      { image: I("recap_piel_humeda"), label: "2 · Sobre piel húmeda", atPhrase: "Recien salida de la ducha" },
      { image: I("recap_envuelve_algodon"), label: "3 · Envolvé el brazo con algodón", atPhrase: "Envolve el brazo con algodon" },
      { image: I("recap_prueba_parche"), label: "4 · Prueba de parche · nada de limón", atPhrase: "Y nada de limon ni de" },
      { image: I("recap_tapate_brazos"), label: "5 · Tapate los brazos a la mañana", atPhrase: "Tapate los brazos a la manana" },
    ], at: "Macera el romero en aceite a" }),
    lt("De nada sirve reparar de noche lo que rompés al mediodía", { kicker: "El paso 5 es el que decide", desc: "Manga o protector. Todos los días.", tone: "warn", at: "Porque de nada sirve reparar de" }),
  ]},
  { key: "recap_tiempos", phrase: "semanas para el resto", beats: [
    c("splitlist", { title: "Cuánto tarda de verdad", items: ["3 semanas → la textura", "8 a 12 semanas → el resto", "No cuatro noches"], palette: "T" }),
  ]},
  { key: "guia", phrase: "Todo esto con las cantidades exactas", beats: [
    c("talk", {}),
    r(P("guia_libro_mesa_consultorio"), { at: "Esta en la guia que arme", hold: true }),
    c("chips", { bg: "image", image: I("guia_celular"), imageDarken: 0.62, title: "La Guía Completa de la Salud +60", chips: ["150 remedios con cantidades exactas", "El error que casi todos cometen", "archivos-federer.vercel.app"], at: "Con las cantidades el momento del" }),
    c("splitlist", { title: "Ordenada por lo que te duele", items: ["Circulación", "Huesos", "Sueño", "Piel"], palette: "T", at: "Y esta ordenada por lo que" }),
    r(P("guia_manual_senales_alerta"), { at: "Va con un manual aparte de", kicker: "Manual de señales de alerta" }),
    lt("El hermano de los moretones sin golpe", { kicker: "Va incluido", desc: "Cuándo una señal del cuerpo hay que mostrarla sí o sí.", tone: "warn", at: "cuando hablamos de los moretones sin" }),
  ]},
  { key: "guia_honesto", phrase: "Porque prefiero ser honesto a ganar", beats: [
    c("talk", {}),
    ak([{ word: "NO LA COMPRES", sub: "si estás buscando una pastilla mágica", tone: "warn", atPhrase: "Si vos estas buscando una pastilla" }], {}),
    c("callout", { image: I("cocina_constancia"), figure: "Ahí no hay milagros", caption: "Hay trabajo de cocina y de constancia.", at: "Hay trabajo de cocina y de" }),
    c("checklist", { title: "El riesgo lo pongo yo, no vos", items: [
      { text: "Siete días para pedir la plata de vuelta", state: "done" },
      { text: "Sin explicarme nada", state: "done" },
      { text: "Si no te convence cuando la abras, la devolvés", state: "done" }], at: "para pedir que te devuelvan la" }),
    lt("Está arriba de todo en la descripción", { kicker: "Junto con las cantidades de hoy", desc: "archivos-federer.vercel.app", tone: "teal", at: "Esta en la descripcion" }),
  ]},
  { key: "comentarios", phrase: "Y ahora contame una cosa en", beats: [
    c("talk", {}),
    ak([{ word: "¿QUÉ BRAZO TENÉS PEOR?", sub: "contame en los comentarios, los leo yo", tone: "teal", atPhrase: "Que brazo tenes peor" }], {}),
    ap([
      { card: "Izquierdo", sub: "el de la ventanilla del conductor", atPhrase: "El izquierdo o el derecho" },
      { card: "Derecho", sub: "y decime si manejás o no", atPhrase: "Y decime si manejas" }], {}),
    r(P("camionero_media_cara_envejecida"), { at: "Quiero ver cuantos me confirman lo", kicker: "El camionero de la revista" }),
  ]},
  { key: "teaser", phrase: "la mancha marron en el dorso", beats: [
    c("talk", {}),
    r(P("mancha_marron_dorso_mano"), { at: "Esa que todos llaman mancha de", kicker: "La mancha de la edad" }),
    ak([{ word: "SON DOS", sub: "se parecen muchísimo, y no son lo mismo", tone: "warn", atPhrase: "Porque hay dos tipos" }], {}),
    mv("Toda mancha marrón es de la edad", "Una se aclara con algo de la heladera. La otra hay que mostrarla", { flipPhrase: "La otra hay que mostrarla si" }),
    lt("El detalle exacto del borde que las distingue", { kicker: "En el próximo video", desc: "Te lo voy a enseñar con lupa.", tone: "teal", at: "Y te voy a ensenar el" }),
  ]},
  { key: "cierre_amanda", phrase: "Dona Amanda fue al casamiento de", beats: [
    c("talk", {}),
    r(P("amanda_casamiento_vestido_sin_mangas"), { at: "Con el vestido sin mangas", kicker: "Marzo · el casamiento de la nieta", hold: true }),
    r(P("amanda_brazos_descubiertos_fiesta"), { at: "Y no los va a tener" }),
    ak([{ word: "NO ES MAGIA", sub: "no volvió a tener brazos de 30 años, y no los va a tener", tone: "teal", atPhrase: "Fue porque despues de nueve semanas" }], {}),
    r(P("amanda_espejo_piel_brazo_dedos"), { at: "Se agarro la piel del brazo" }),
    fz(P("amanda_piel_vuelve_a_su_lugar"), { x: 0.5, y: 0.5, label: "Y esa piel volvió a su lugar", zoom: 1.7, tone: "teal", at: "Y esa piel volvio a su" }),
    c("quote", { image: I("mensaje_celular_noche"), text: "Doctor… *me puse el vestido sin mangas.*", at: "Con tres signos de exclamacion" }),
    fc([{ t: "Que" }, { t: "vuelvas" }, { t: "a" }, { t: "levantar" }, { t: "el" }, { t: "brazo", hl: true }], { tone: "teal", at: "Que vuelvas a levantar el brazo" }),
  ]},
  { key: "close", phrase: "Y nos vemos en el proximo", beats: [
    c("nametag", { name: "Dr. Federer", role: "Federer Archivos — salud real después de los 60", image: I("federer_despide") }),
  ]},
];
