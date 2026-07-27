// gen_v8v252t7cjxe.mjs — beatsheet del video "Cardiólogo Advierte: Millones Hacen ESTO Cada Mañana"
// (Canal Federer Archivos). Avatar v8v252t7cjxe_opt.mp4 (~27.1min). Anclaje por FRASE a
// captions_v8v252t7cjxe.json. Look CLÍNICO teal. Imágenes gpt-image-2: p_v8v252t7cjxe_*.png +
// dg_v8v252t7cjxe_*.png. Kit _fed6 COMPLETO. Estructura NOVELA (don Héctor, 73, ex chofer):
// cold-open shock → la ventana 6-12 → historia → las 3 capas → el ESTO (levantarse de golpe) →
// los 90 segundos → doña Nélida + test casero → 3 trampas → límites honestos → el ERROR del que
// se cuida (caminar en ayunas antes de las 8) → recap FocusCards. 3 injertos guía.
import fs from "fs";
const SLUG = "v8v252t7cjxe";

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
  errorstinger: 1.3, mitoverdad: 2.2, frasecinetica: 1.6, avatarkeyword: 2.6, avatarpizarra: 3.4, lowerthird: 1.6, guardaesto: 3.0, freezezoom: 1.6, relojriesgo: 2.4, escalones: 3.0, focuscards: 3.0, looplock: 1.6 };

const P = (n) => `p_${SLUG}_${n}`;   // foto hero
const D = (n) => `dg_${SLUG}_${n}`;  // diagrama

const SECTIONS = [
  // ░░ COLD-OPEN — los 10 segundos que le exigen más que dos pisos ░░
  { key: "hook", phrase: null, start: 2.2, beats: [
    c("talk", {}),
    r(P("despertador_415"), { at: "de tu manana le exigen", kicker: "Los primeros 10 segundos" }),
    r(P("levantarse_golpe"), { at: "y vos los haces dormido", hold: true }),
  ]},
  { key: "hook", phrase: "estoy hablando de un movimiento", beats: [
    ak([{ word: "UN SOLO MOVIMIENTO", sub: "entre que suena el despertador y tus pies tocan el piso", tone: "teal", atPhrase: "estoy hablando de un movimiento" }], {}),
    r(P("pies_piso_frio"), { at: "tus dos pies tocan el piso" }),
  ]},
  { key: "hook", phrase: "escuchame el numero porque", beats: [
    c("looplock", { title: "Y hay un error PEOR", sub: "el que hacen justo los que se cuidan — te lo digo al final", at: "escuchame el numero porque" }),
  ]},
  { key: "hook", phrase: "los infartos no se reparten", beats: [
    c("relojriesgo", { title: "Cuándo ocurren los infartos", stat: "3×", statUnit: "más entre las 6 y las 12", note: "El pico matutino", source: "NEJM 1985 · estudio MILIS", tone: "warn" }),
  ]},
  { key: "hook", phrase: "y con los accidentes cerebrovasculares", beats: [
    dg(D("ventana_riesgo"), "La ventana de las 6 a las 12"),
    c("stat", { big: "49%", unit: "más ACV", label: "entre las 6 de la mañana y el mediodía · metaanálisis en Stroke, 1998, 11.800 casos", tone: "warn" }),
  ]},
  { key: "hook", phrase: "y aca esta lo que a mi", beats: [
    c("talk", {}),
    mv("Al corazón hay que cuidarlo de noche", "El momento más exigente del día es levantarse", { flipPhrase: "le tiene miedo a levantarse" }),
  ]},
  { key: "hook", phrase: "hoy te voy a contar exactamente", beats: [
    c("chips", { bg: "image", image: `img/${P("despertador_415")}.png`, imageDarken: 0.62, title: "Lo que pasa en tus primeros 10 segundos", chips: ["Por qué tu sangre a las 7 no es la misma", "Qué es ese ESTO que hacen millones", "Y los 90 segundos que lo arreglan"] }),
  ]},
  { key: "hook", phrase: "quedate conmigo para el final", beats: [
    lt("90 segundos nuevos, mañana a la mañana", { kicker: "Lo que te llevás", desc: "No cuestan un peso. No te sacan tiempo. Sin comprar nada, sin pedir turno.", tone: "teal", at: "sin comprar nada" }),
  ]},

  // ░░ DON HÉCTOR — la novela ░░
  { key: "story", phrase: "yo tengo una consulta", beats: [
    c("talk", {}),
    r(P("hector_retrato"), { at: "se te quedan pegados", kicker: "Don Héctor, 73" }),
  ]},
  { key: "story", phrase: "manejo colectivos", beats: [
    r(P("hector_volante"), { at: "manejo colectivos", kicker: "31 años al volante" }),
    r(P("persiana_amanecer"), { at: "donde ya no hay asfalto" }),
  ]},
  { key: "story", phrase: "nunca en su vida uso", beats: [
    c("quote", { image: `img/${P("hector_retrato")}.png`, text: "Decía que la música era *para los que dudan*." }),
    r(P("despertador_415"), { at: "sonaba el timbre del reloj" }),
  ]},
  { key: "story", phrase: "hasta el 14 de junio", beats: [
    es("!", "El 14 de junio", { tone: "warn", w: 3.4 }),
    r(P("mano_marco_puerta"), { at: "se agarro del marco" }),
  ]},
  { key: "story", phrase: "se le fue el mundo", beats: [
    fc([{ t: "Se" }, { t: "me" }, { t: "fue" }, { t: "el" }, { t: "mundo", hl: true }], { tone: "warn", at: "se le fue el mundo" }),
    r(P("hector_piso_pasillo"), { at: "se sento en el piso", hold: true }),
  ]},
  { key: "story", phrase: "porque le dio verguenza", beats: [
    r(P("pareja_dormida"), { at: "la mujer dormia" }),
    ak([{ word: "LE DIO VERGÜENZA", sub: "73 años, y no llamó a nadie", tone: "warn", atPhrase: "porque le dio verguenza" }], {}),
  ]},
  { key: "story", phrase: "eso paso tres veces mas", beats: [
    r(P("comoda_golpe"), { at: "el borde de la comoda" }),
    r(P("mate_madrugada"), { at: "se hizo el mate" }),
  ]},
  { key: "story", phrase: "yo esa frase la escucho", beats: [
    c("talk", {}),
    r(P("medico_apurado"), { at: "es lo que se dice cuando", kicker: "«Y bueno, es la edad»" }),
    lt("«Es la edad» no es un diagnóstico", { kicker: "El enemigo", desc: "Es la manera elegante de decir: no tengo doce minutos para vos.", tone: "warn", at: "no tengo doce minutos" }),
  ]},
  { key: "story", phrase: "a don hector no le pasaba", beats: [
    r(P("turno_papel"), { at: "volvio a levantarse igual" }),
    ak([{ word: "NO ERA LA EDAD", sub: "era física común — la que estudiaste y te olvidaste", tone: "teal", atPhrase: "le pasaba fisica" }], {}),
  ]},

  // ░░ EL PRINCIPIO — tu sangre a las 7 no es la misma ░░
  { key: "principio", phrase: "tu sangre a las 7", beats: [
    c("talk", {}),
    fc([{ t: "Tu" }, { t: "sangre" }, { t: "a" }, { t: "las" }, { t: "siete", hl: true }, { t: "es" }, { t: "otra" }], { tone: "teal", at: "tu sangre a las 7" }),
  ]},
  { key: "principio", phrase: "mientras dormis respiras", beats: [
    r(P("vidrio_vaho"), { at: "sale vapor de agua" }),
    dg(D("perdida_agua"), "Medio litro que se va durmiendo"),
  ]},
  { key: "principio", phrase: "entre las dos cosas", beats: [
    c("stat", { big: "500 ml", unit: "de agua por noche", label: "respirando y transpirando, sin que nadie los reponga. Te despertás con menos agua que cuando te acostaste.", tone: "teal" }),
    r(P("sabana_arrugada"), { at: "y no lo repone nadie" }),
  ]},
  { key: "principio", phrase: "la sangre queda un poco", beats: [
    dg(D("sangre_espesa"), "Hemoconcentración matutina"),
    ak([{ word: "SANGRE MÁS ESPESA", sub: "el corazón tiene que empujar más fuerte para mover lo mismo", tone: "warn", atPhrase: "un poco mas espesa" }], {}),
  ]},
  { key: "principio", phrase: "segunda capa a la manana", beats: [
    c("talk", {}),
    es("02", "Las plaquetas", { w: 3.4 }),
    c("callout", { image: `img/${P("manos_frias_frazada")}.png`, figure: "Segunda capa", caption: "Las plaquetas son las que forman los coágulos. Su momento de mayor tendencia a agruparse es la mañana." }),
  ]},
  { key: "principio", phrase: "tercera capa el cortisol", beats: [
    c("talk", {}),
    es("03", "El cortisol", { w: 3.4 }),
    dg(D("cortisol_curva"), "El pico de despertar"),
  ]},
  { key: "principio", phrase: "sube alrededor de un", beats: [
    c("stat", { big: "+50%", unit: "en media hora", label: "la respuesta de despertar del cortisol: sube la presión y va con adrenalina, que acelera el pulso.", tone: "warn" }),
    dg(D("tres_capas"), "Las tres capas, en la misma media hora"),
    ap([
      { card: "Sangre más espesa", atPhrase: "el cortisol sube la presion" },
      { card: "Plaquetas más pegajosas", atPhrase: "y va acompanado de adrenalina" },
      { card: "Cortisol y adrenalina", sub: "presión arriba, pulso acelerado", atPhrase: "acelera el pulso y contrae" },
    ], {}),
  ]},
  // EL "POR QUÉ FUNCIONA" — las tres capas apiladas.
  // ⛔ NO se usa FedWhiteboard acá: ese componente monta un <AvatarPip> FIJO en la esquina
  // inferior derecha (src/FedWhiteboard.tsx:931) y este canal tiene prohibido el recuadro/PiP
  // (feedback del creador en los videos 4 y 6, repetido 3 veces en la memoria del canal).
  // Se cubre con la pizarra data-driven del propio kit _fed6, que es full-screen y sin PiP.
  { key: "principio", phrase: "ahora suma las tres", beats: [
    ap([
      { card: "1 · Sangre más espesa", sub: "perdiste medio litro durmiendo", atPhrase: "bien sangre mas espesa plaquetas" },
      { card: "2 · Plaquetas más pegajosas", sub: "su momento de mayor tendencia a agruparse", atPhrase: "pegajosas y una descarga" },
      { card: "3 · Cortisol y adrenalina", sub: "presión arriba, pulso acelerado", atPhrase: "te sube la presion y" },
    ], {}),
    c("board", { eyebrow: "Las tres capas", title: "El pico matutino", items: [{ title: "Caen en la MISMA media hora" }, { title: "Todos los días de tu vida" }, { title: "Le pasa a todo el mundo", sub: "a vos, a mí, al de 20 y al de 80" }, { title: "La diferencia es qué le hacés vos arriba" }] }),
  ]},
  { key: "principio", phrase: "y no es una rareza le pasa", beats: [
    ak([{ word: "EL PICO MATUTINO", sub: "le pasa a todo el mundo — la diferencia es qué le hacés vos arriba", tone: "teal", atPhrase: "y no es una rareza le pasa" }], {}),
  ]},

  // ░░ EL "ESTO" — levantarse de golpe ░░
  { key: "eleto", phrase: "y aca llegamos aca esta", beats: [
    c("talk", {}),
    es("01", "Levantarte de golpe", { tone: "warn", w: 4.0 }),
  ]},
  { key: "eleto", phrase: "pasar de acostado a parado", beats: [
    r(P("levantarse_golpe"), { at: "pasar de acostado a parado", hold: true }),
    fc([{ t: "Menos" }, { t: "de" }, { t: "tres" }, { t: "segundos", hl: true }], { tone: "warn", at: "en menos de 3 segundos" }),
  ]},
  { key: "eleto", phrase: "dejame que te muestre", beats: [
    mv("Levantarse rápido es energía", "Es la cosa más exigente que le pedís al corazón en todo el día", { flipPhrase: "si es una pavada" }),
  ]},
  { key: "eleto", phrase: "cuando estas acostado tu sangre", beats: [
    dg(D("gravedad_piernas"), "Acostado la gravedad no elige; de pie sí"),
  ]},
  { key: "eleto", phrase: "en el momento en que te pones", beats: [
    c("stat", { big: "800 ml", unit: "a las piernas", label: "entre 500 y 800 ml de sangre se te van a las piernas y al abdomen en los primeros segundos de estar parado.", tone: "warn" }),
    r(P("pantorrilla_musculo"), { at: "se te van a las piernas" }),
  ]},
  { key: "eleto", phrase: "esa sangre mientras esta", beats: [
    ak([{ word: "NO ESTÁ EN EL CORAZÓN", sub: "y si no está en el corazón, no está subiendo al cerebro", tone: "warn", atPhrase: "no esta en el corazon" }], {}),
  ]},
  { key: "eleto", phrase: "se llaman varo receptores", beats: [
    dg(D("barorreceptores"), "Los sensores de presión"),
    c("board", { title: "Qué hacen en menos de un segundo", items: [{ title: "Detectan la caída de presión" }, { title: "Contraen las arterias de las piernas" }, { title: "Aceleran el pulso" }] }),
  ]},
  { key: "eleto", phrase: "y sobre todo despues de los 70", beats: [
    c("talk", {}),
    c("cross", { title: "El mismo sistema, veinte años después", left: { title: "A los 30", items: ["Responde en menos de un latido", "No lo notás jamás"] }, right: { title: "Después de los 70", items: ["Sensores más lentos", "Arterias más rígidas", "El corazón no acelera igual"] } }),
  ]},
  { key: "eleto", phrase: "eso es la hipotension ortostatica", beats: [
    ak([{ word: "HIPOTENSIÓN ORTOSTÁTICA", sub: "el nombre de eso que te pasa al pararte", tone: "warn", atPhrase: "eso es la hipotension ortostatica" }], {}),
    c("stat", { big: "1 de 5", unit: "mayores de 65", label: "la tiene, según los estudios de población grandes. Contá cinco cabezas canosas en una mesa de domingo.", tone: "warn" }),
    r(P("mesa_familiar"), { at: "una mesa familiar de domingo" }),
  ]},
  { key: "eleto", phrase: "y que se siente", beats: [
    r(P("vision_oscura"), { at: "se te va la vista", hold: true }),
    r(P("rodillas_flojas"), { at: "se te aflojan las piernas" }),
  ]},
  { key: "eleto", phrase: "pero muchas veces no se siente", beats: [
    lt("Y muchas veces no se siente NADA", { kicker: "El problema grande", desc: "Podés caer 20 o 25 milímetros al pararte y solo sentirte «medio ido». Se lo achacás al sueño.", tone: "warn", at: "no sentir absolutamente nada" }),
  ]},
  { key: "eleto", phrase: "ahora agarrar todo lo que", beats: [
    c("board", { eyebrow: "Todo junto, en la misma escena", title: "Lo que le pedís al cuerpo", items: [{ title: "Sangre espesa" }, { title: "Plaquetas pegajosas" }, { title: "Cortisol y adrenalina disparados" }, { title: "Medio litro contra la gravedad", sub: "en un segundo y medio" }, { title: "Con sensores que ya no son los de antes" }] }),
  ]},

  // ░░ LOS 90 SEGUNDOS ░░
  { key: "solucion", phrase: "y ahora si la buena noticia", beats: [
    c("talk", {}),
    r(P("federer_explica_escritorio"), { at: "vine a que manana lo hagas" }),
  ]},
  { key: "solucion", phrase: "la solucion son 90 segundos", beats: [
    c("escalones", { title: "La regla de los 90 segundos", items: [
      { n: "1", title: "Acostado, ojos abiertos", secs: "30 s", atPhrase: "primer escalon" },
      { n: "2", title: "Sentado al borde de la cama", secs: "60 s", atPhrase: "segundo escalon" },
      { n: "3", title: "Recién ahí te parás", secs: "agarrado de algo", atPhrase: "tercer escalon" },
    ], at: "la solucion son 90 segundos" }),
  ]},
  { key: "solucion", phrase: "primer escalon", beats: [
    r(P("sabana_arrugada"), { at: "te quedas acostado" }),
  ]},
  { key: "solucion", phrase: "segundo escalon", beats: [
    r(P("sentado_borde_cama"), { at: "te sentas en el borde", hold: true }),
    r(P("reloj_60seg"), { at: "mira el reloj de la mesa" }),
  ]},
  { key: "solucion", phrase: "sentado en el borde de la cama estas", beats: [
    dg(D("noventa_segundos"), "Los tres escalones"),
  ]},
  { key: "solucion", phrase: "tercer escalon", beats: [
    r(P("agarrado_mueble"), { at: "lo das agarrado de algo", hold: true }),
    fc([{ t: "No" }, { t: "porque" }, { t: "seas" }, { t: "un" }, { t: "inválido" }, { t: "porque" }, { t: "sos" }, { t: "inteligente", hl: true }], { tone: "teal", at: "porque sos inteligente" }),
  ]},
  { key: "solucion", phrase: "la primera son los tobillos", beats: [
    c("talk", {}),
    es("01", "Los tobillos", { w: 3.4 }),
    r(P("tobillos_bombeo"), { at: "subis y bajas las puntas", hold: true }),
  ]},
  { key: "solucion", phrase: "por que porque los musculos", beats: [
    dg(D("bomba_pantorrilla"), "El segundo corazón"),
    ak([{ word: "EL SEGUNDO CORAZÓN", sub: "el gemelo aprieta las venas y empuja la sangre hacia arriba", tone: "teal", atPhrase: "se les dice el segundo corazon" }], {}),
  ]},
  { key: "solucion", phrase: "20 bombeos antes de", beats: [
    c("board", { title: "Veinte bombeos, 15 segundos", items: [{ title: "Llegás a la vertical con las piernas cebadas" }, { title: "La sangre subiendo, no esperando" }, { title: "No cuesta nada" }] }),
  ]},
  { key: "solucion", phrase: "la segunda cosa es el vaso", beats: [
    c("talk", {}),
    es("02", "El vaso de agua", { w: 3.4 }),
    r(P("federer_vaso_agua"), { at: "tiene que ser agua" }),
  ]},
  { key: "solucion", phrase: "el truco que le cambia", beats: [
    mv("El vaso de agua lo tomo en la cocina", "Para llegar a la cocina te tenés que parar — y pararte es lo que estamos protegiendo", { flipPhrase: "te tienes que parar" }),
  ]},
  { key: "solucion", phrase: "deja el vaso lleno", beats: [
    r(P("vaso_mesaluz"), { at: "en la mesa de luz la noche", hold: true }),
    ge("Guardá esto", [
      { text: "El vaso servido en la mesa de luz, la noche anterior", image: `img/${P("vaso_mesaluz")}.png` },
      { text: "Te lo tomás sentado, antes de apoyar los pies", image: `img/${P("sentado_borde_cama")}.png` },
      { text: "Agua primero. Café después.", image: `img/${P("cafe_manana")}.png` },
    ], { tag: "90 segundos" }),
  ]},
  { key: "solucion", phrase: "un vaso 250", beats: [
    c("stat", { big: "250 ml", unit: "sentado", label: "no te rehidrata entero, pero le da volumen al sistema justo cuando más lo necesita.", tone: "teal" }),
  ]},

  // ░░ DOÑA NÉLIDA + el test casero ░░
  { key: "nelida", phrase: "ahora yo se lo que estas pensando", beats: [
    c("talk", {}),
    c("quote", { image: `img/${P("nelida_retrato")}.png`, text: "Doctor, *yo no me mareo nunca*. Yo me levanto y salgo disparando." }),
  ]},
  { key: "nelida", phrase: "dona nelida me dijo exactamente", beats: [
    r(P("nelida_jardin"), { at: "jardin impecable", kicker: "Doña Nélida, 79" }),
    r(P("nelida_retrato"), { at: "yo me levanto y salgo" }),
  ]},
  { key: "nelida", phrase: "la prueba es asi", beats: [
    dg(D("test_ortostatico"), "El test de casa: acostado y al minuto de pie"),
    r(P("tensiometro_brazo"), { at: "un tensiometro de esos" }),
  ]},
  { key: "nelida", phrase: "si la de arriba la sistolica", beats: [
    c("bars", { title: "Cuánto tiene que bajar para que cuente", unit: "mmHg", items: [
      { label: "La de arriba (sistólica)", value: 20 },
      { label: "La de abajo (diastólica)", value: 10 },
      { label: "Doña Nélida bajó", value: 28 } ] }),
    r(P("anotar_cuaderno"), { at: "y anotas" }),
  ]},
  { key: "nelida", phrase: "28 y ella no sentia", beats: [
    fz(P("tensiometro_brazo"), { x: 0.5, y: 0.45, label: "28 puntos abajo — y no sentía nada", zoom: 1.5, tone: "warn", at: "y ella no sentia nada" }),
  ]},
  { key: "nelida", phrase: "y si no tenes tensiometro", beats: [
    c("checklist", { title: "Las señales, sin aparato", items: [
      { text: "Se te oscurece un instante la visión desde los costados", state: "warn" },
      { text: "Un zumbido corto en los oídos", state: "warn" },
      { text: "Dolor en nuca y hombros «como una percha», parado", state: "warn" },
      { text: "Piernas flojas los primeros pasos, y después andás bien", state: "warn" } ] }),
  ]},
  { key: "nelida", phrase: "si dijiste que si a alguna", beats: [
    lt("Si dijiste que sí a una sola, es para vos", { kicker: "Y es para hoy", desc: "La regla de los 90 segundos no le hace mal a nadie y a vos te saca un pico diario.", tone: "teal", at: "es para vos y es para hoy" }),
  ]},

  // ░░ LAS 3 TRAMPAS ░░
  { key: "trampa1", phrase: "trampa numero 1", beats: [
    c("talk", {}),
    es("01", "La ducha caliente de entrada", { tone: "warn", w: 3.6 }),
    r(P("ducha_vapor"), { at: "la ducha caliente de entrada", hold: true }),
  ]},
  { key: "trampa1", phrase: "el agua caliente dilata", beats: [
    dg(D("ducha_caliente"), "El calor dilata y la presión baja"),
    r(P("azulejos_mojados"), { at: "sobre azulejos mojados" }),
  ]},
  { key: "trampa1", phrase: "te pido tres cosas", beats: [
    c("process", { title: "La ducha, bien hecha", eyebrow: "Tres cosas, ninguna cuesta nada", steps: [
      { title: "No primero", desc: "que no sea lo primero al levantarte", image: `img/${P("ducha_vapor")}.png` },
      { title: "Tibia", desc: "no hirviendo", image: `img/${P("azulejos_mojados")}.png` },
      { title: "Sentate", desc: "en el borde, antes de que decida el cuerpo", image: `img/${P("borde_banera")}.png` } ] }),
  ]},
  { key: "trampa2", phrase: "trampa numero 2", beats: [
    c("talk", {}),
    es("02", "El baño", { tone: "warn", w: 3.6 }),
    r(P("bano_puerta"), { at: "esto nadie lo habla" }),
  ]},
  { key: "trampa2", phrase: "cuando pujas fuerte", beats: [
    dg(D("valsalva"), "Pujar: la presión se frena y después rebota"),
    ak([{ word: "NO PUJES", sub: "el rebote de presión, a esa hora, es de los grandes", tone: "warn", atPhrase: "la presion rebota para arriba" }], {}),
  ]},
  { key: "trampa2", phrase: "la solucion nada heroico", beats: [
    c("checklist", { title: "Sin nada heroico", items: [
      { text: "Tomá el agua y moveté un poco antes", state: "done" },
      { text: "No vayas al baño a los dos minutos de despertarte", state: "done" },
      { text: "Si no sale, esperá. No pujes.", state: "done" },
      { text: "Si estás constipado siempre, eso se trata", state: "done" } ] }),
  ]},
  { key: "trampa3", phrase: "trampa numero 3", beats: [
    c("talk", {}),
    es("03", "El café en ayunas", { tone: "warn", w: 3.6 }),
    r(P("cafe_manana"), { at: "el cafe en ayunas apenas" }),
  ]},
  { key: "trampa3", phrase: "yo tomo mate", beats: [
    r(P("mate_madrugada"), { at: "yo tomo mate" }),
    mv("El café de la mañana es el problema", "El problema no es el café: es CUÁNDO", { flipPhrase: "lo que te digo es cuando" }),
  ]},
  { key: "trampa3", phrase: "la cafeina sube la presion", beats: [
    dg(D("cafeina_presion"), "Cinco milímetros, por tres horas"),
    c("stat", { big: "5 mmHg", unit: "hasta 3 horas", label: "poco… salvo que se los sumes al pico de cortisol que ya te subió la presión sin permiso.", tone: "warn" }),
  ]},
  { key: "trampa3", phrase: "entonces agua primero cafe", beats: [
    ak([{ word: "AGUA PRIMERO, CAFÉ DESPUÉS", sub: "diez o quince minutos de diferencia y ya cambia la escena", tone: "teal", atPhrase: "agua primero cafe despues" }], {}),
  ]},
  { key: "trampa3", phrase: "mira la sal escondida", beats: [
    r(P("fiambre_pan"), { at: "el queso duro el pan" }),
    c("callout", { image: `img/${P("fiambre_pan")}.png`, figure: "El que nadie sospecha", caption: "El pan de panadería: en muchas casas es la principal fuente de sal del día." }),
  ]},
  { key: "guia", phrase: "todas las cantidades exactas", beats: [
    r(P("guia_celular"), { at: "la guia gratuita del canal", hold: true }),
    c("chips", { bg: "image", image: `img/${P("guia_celular")}.png`, imageDarken: 0.62, title: "Te lo dejé anotado en la descripción", chips: ["El paso a paso de los 90 segundos", "La planilla de presión acostado y parado", "Abrí la descripción, está arriba de todo"] }),
  ]},

  // ░░ LÍMITES HONESTOS ░░
  { key: "honesto", phrase: "ahora dejame ser honesto", beats: [
    c("talk", {}),
    c("checklist", { title: "Con toda honestidad", items: [
      { text: "Esto NO cura la hipertensión", state: "done" },
      { text: "Si tomás medicación, la seguís tomando igual", state: "done" },
      { text: "90 segundos no te arreglan una arteria", state: "done" } ] }),
  ]},
  { key: "honesto", phrase: "esto tampoco te va a evitar", beats: [
    ak([{ word: "PREVENCIÓN DE LA ABURRIDA", sub: "te saca un pico de exigencia innecesario, todos los días, durante años", tone: "teal", atPhrase: "es prevencion de la aburrida" }], {}),
  ]},
  { key: "honesto", phrase: "y no todo mareo es del corazon", beats: [
    c("board", { title: "No todo mareo es del corazón", items: [{ title: "Vértigo del oído: lo arregla un kinesiólogo en 10 minutos" }, { title: "Azúcar baja" }, { title: "Anemia" }] }),
    lt("Miralo, no lo adivines", { kicker: "El consejo", desc: "Nunca sumes ni saques medicación por tu cuenta. Eso pasa por tu médico.", tone: "warn", at: "que lo mires no que lo adivines" }),
  ]},
  { key: "alarma", phrase: "y ahora lo que si es urgente", beats: [
    c("talk", {}),
    es("!", "Esto es una emergencia", { tone: "warn", w: 4.0 }),
    dg(D("senales_alarma"), "Las señales que no se esperan"),
  ]},
  { key: "alarma", phrase: "si ese dolor se te va al brazo", beats: [
    r(P("dolor_pecho"), { at: "opresion en el medio del pecho", hold: true }),
    c("checklist", { title: "Llamá al 107 AHORA", items: [
      { text: "Dolor u opresión en el medio del pecho, más de unos minutos", state: "warn" },
      { text: "Se va al brazo izquierdo, mandíbula, cuello o espalda", state: "warn" },
      { text: "Falta de aire que no tenías · sudor frío sin motivo", state: "warn" },
      { text: "Se afloja media cara, un brazo o una pierna · se traba el habla", state: "warn" } ] }),
  ]},
  { key: "alarma", phrase: "eso no es la manana", beats: [
    fc([{ t: "Eso" }, { t: "no" }, { t: "es" }, { t: "la" }, { t: "edad" }, { t: "es" }, { t: "una" }, { t: "emergencia", hl: true }], { tone: "warn", at: "eso no es la manana" }),
    r(P("telefono_emergencia"), { at: "se llama al 107 ahora" }),
  ]},
  { key: "alarma", phrase: "el infarto muchas veces no se", beats: [
    r(P("mujer_cansancio"), { at: "un cansancio extremo y raro", hold: true }),
    lt("En las mujeres casi nunca es el dolor de película", { kicker: "Si sos mujer, anotá esto", desc: "Cansancio extremo y raro, náuseas, dolor de mandíbula o de espalda alta. Se subdiagnostica muchísimo.", tone: "warn", at: "si sos mujer esto anotalo" }),
  ]},

  // ░░ EL ERROR — pago del loop ░░
  { key: "error", phrase: "y ahora si el error", beats: [
    c("talk", {}),
    es("!", "El error del que SÍ se cuida", { tone: "warn", w: 4.2 }),
  ]},
  { key: "error", phrase: "te dieron el diagnostico", beats: [
    r(P("federer_toma_presion"), { at: "presion alta o de colesterol" }),
    r(P("zapatillas_puerta"), { at: "zapatillas y a la calle" }),
  ]},
  { key: "error", phrase: "y ahi esta el problema", beats: [
    r(P("caminata_frio_amanecer"), { at: "el esfuerzo fisico mas grande", hold: true }),
    ak([{ word: "CAMINAR EN AYUNAS ANTES DE LAS 8", sub: "el esfuerzo más grande del día, dentro de la ventana del triple de infartos", tone: "warn", atPhrase: "donde se concentra el triple" }], {}),
  ]},
  { key: "error", phrase: "sangre espesa por la noche", beats: [
    c("board", { eyebrow: "Antes de las 8, en ayunas", title: "Todo lo que apilás en esa caminata", items: [{ title: "Sangre espesa", sub: "no tomaste agua" }, { title: "Plaquetas en su punto más pegajoso" }, { title: "Cortisol y adrenalina en el pico" }, { title: "El estómago vacío" }, { title: "Y el frío, que contrae más las arterias" }] }),
  ]},
  { key: "error", phrase: "y hay una vuelta de tuerca", beats: [
    r(P("pastillero_semanal"), { at: "las pastillas para la presion" }),
    c("callout", { image: `img/${P("pastilla_agua")}.png`, figure: "La vuelta de tuerca", caption: "Salen a caminar ANTES de tomarla, «para tomarla con el desayuno cuando vuelvo». Caminan con la del día anterior ya gastada." }),
  ]},
  { key: "error", phrase: "don ector hacia eso", beats: [
    r(P("caminata_frio_amanecer"), { at: "ocho cuadras hasta el kiosco" }),
  ]},
  { key: "error", phrase: "ahora escuchame bien lo que", beats: [
    c("talk", {}),
    mv("Entonces no camines a la mañana", "Caminar es de lo mejor que podés hacer: lo que hay que correr es el HORARIO", { flipPhrase: "que la corras de horario" }),
  ]},
  { key: "error", phrase: "te estoy diciendo que la corras", beats: [
    dg(D("horario_caminata"), "Corré la caminata de horario"),
    r(P("caminata_sol_9am"), { at: "camina a media manana", hold: true }),
  ]},
  { key: "error", phrase: "y si no podes si tu vida", beats: [
    ge("Si tiene que ser temprano", [
      { text: "Los 90 segundos para levantarte", image: `img/${P("sentado_borde_cama")}.png` },
      { text: "El vaso de agua sentado, y la pastilla si te toca", image: `img/${P("pastilla_agua")}.png` },
      { text: "Los primeros 10 minutos de caminata, de paseo", image: `img/${P("caminata_sol_9am")}.png` },
    ], { tag: "Sin arrancar en cuarta" }),
  ]},

  // ░░ RESOLUCIÓN — don Héctor ░░
  { key: "cierre", phrase: "don hector hoy se levanta", beats: [
    c("talk", {}),
    r(P("hector_bien_cocina"), { at: "tiene el vaso en la mesa", kicker: "Don Héctor, hoy" }),
    r(P("caminata_sol_9am"), { at: "cuando ya hay sol" }),
  ]},
  { key: "cierre", phrase: "no se cayo nunca mas", beats: [
    c("quote", { image: `img/${P("hector_bien_cocina")}.png`, text: "Yo pensé que se me estaba terminando la cuerda. *Y era que me levantaba mal.*" }),
  ]},

  // ░░ RECAP — FocusCards 5 ░░
  { key: "recap", phrase: "vamos al repaso", beats: [
    c("talk", {}),
    c("focuscards", { title: "Las 5 cosas, mañana a la mañana", items: [
      { image: `img/${P("sentado_borde_cama")}.png`, label: "1 · 90 segundos", atPhrase: "190 segundos 30 acostado" },
      { image: `img/${P("vaso_mesaluz")}.png`, label: "2 · El vaso de agua", atPhrase: "2 el vaso de agua" },
      { image: `img/${P("tobillos_bombeo")}.png`, label: "3 · Los tobillos", atPhrase: "3 los tobillos 20 bombeos" },
      { image: `img/${P("ducha_vapor")}.png`, label: "4 · Ducha tibia", atPhrase: "4 la ducha tibia" },
      { image: `img/${P("caminata_sol_9am")}.png`, label: "5 · Caminata 9 am", atPhrase: "5 la caminata despues de" },
    ], at: "vamos al repaso" }),
  ]},
  { key: "recap", phrase: "ninguna te saca tiempo real", beats: [
    fc([{ t: "Ninguna" }, { t: "cuesta" }, { t: "plata", hl: true }], { tone: "teal", at: "ninguna cuesta plata" }),
  ]},

  // ░░ CARNADA + GUÍA + TEASER ░░
  { key: "recap", phrase: "ahora te pido algo", beats: [
    c("talk", {}),
    lt("Escribime a qué hora te levantás", { kicker: "En los comentarios", desc: "Nada más que la hora. Si alguna vez se te oscureció la vista al pararte, agregale un sí.", tone: "teal", at: "escribime en los comentarios" }),
  ]},
  { key: "recap", phrase: "y si conoces a alguien", beats: [
    r(P("vaso_mesaluz"), { at: "tenga el vaso en la mesa", hold: true }),
  ]},
  { key: "recap", phrase: "la guia con el paso a paso", beats: [
    c("chips", { bg: "image", image: `img/${P("guia_celular")}.png`, imageDarken: 0.62, title: "Todo esto, en la descripción", chips: ["El paso a paso de los 90 segundos", "La planilla de presión de una semana", "Abrila: está arriba de todo"] }),
  ]},
  { key: "teaser", phrase: "el proximo video ya lo tengo", beats: [
    r(P("pastilla_agua"), { at: "tomar la pastilla de la presion" }),
    lt("Próximo: ¿la pastilla de la presión, de mañana o de noche?", { kicker: "No te lo pierdas", desc: "Hay un debate abierto con estudios grandes en las dos veredas. Te cuento qué dice cada lado.", tone: "teal", at: "un debate abierto" }),
  ]},
  { key: "close", phrase: "cuidate el corazon a la manana", beats: [
    c("talk", {}),
    fc([{ t: "A" }, { t: "la" }, { t: "mañana" }, { t: "es" }, { t: "cuando" }, { t: "está" }, { t: "más" }, { t: "solo", hl: true }], { tone: "teal", at: "que a la manana es cuando" }),
    c("nametag", { name: "Dr. Federer", role: "Federer Archivos — salud real después de los 60", image: `img/${P("federer_despide")}.png` }),
  ]},
];

// ── SECCIONES EXTRA ───────────────────────────────────────────────────────────
// Densificación de los tramos que el gate marcó pelados (min 11 al 27). Van APARTE porque
// SECTIONS se ancla con un cursor que avanza (para poder repetir una frase en dos momentos),
// y estas llegan fuera de orden. Se anclan por PRIMERA ocurrencia global y después se mezclan
// cronológicamente con las principales. Priorizan overlays (lowerthird/frasecinetica), que van
// ENCIMA del b-roll y no le roban el ritmo a la capa de tomas.
const EXTRA = [
  // ░░ 11:00–16:00 — los 90 segundos, los tobillos, el vaso y el test de doña Nélida ░░
  { key: "eleto", phrase: "resuelva en un segundo y medio", beats: [
    lt("Un segundo y medio", { kicker: "Lo que le pedís al cuerpo", desc: "Ese es todo el tiempo que le das al sistema circulatorio para resolverlo. Y se lo pedís todas las mañanas.", tone: "warn" }),
    fc([{ t: "Medio" }, { t: "litro" }, { t: "en" }, { t: "un" }, { t: "segundo" }, { t: "y" }, { t: "medio", hl: true }], { tone: "warn", at: "mover medio litro de sangre" }),
    ak([{ word: "CON SENSORES DE OTRA ÉPOCA", sub: "y esto lo hacés todas las mañanas, sin enterarte", tone: "warn", atPhrase: "no agarre la gravedad con sensores" }], {}),
  ]},
  { key: "solucion", phrase: "se llama en la jerga levantada", beats: [
    lt("Levantada escalonada", { kicker: "Así se llama en la jerga", desc: "Yo le digo la regla de los 90 segundos. Se la enseño a mis pacientes desde hace años.", tone: "teal" }),
    fc([{ t: "No" }, { t: "es" }, { t: "una" }, { t: "técnica" }, { t: "es" }, { t: "un" }, { t: "orden", hl: true }], { tone: "teal", at: "yo le dijo la regla de" }),
    c("board", { title: "Lo que NO es", items: [{ title: "No es una técnica rara" }, { title: "No es un ejercicio" }, { title: "No hay que comprar nada" }] }),
  ]},
  { key: "solucion", phrase: "y ahi te quedas 60 segundos", beats: [
    lt("60 segundos. Contalos.", { kicker: "Escalón 2", desc: "Sentado en el borde de la cama. Mirá el reloj de la mesa de luz, no lo calcules de cabeza.", tone: "teal" }),
    c("stat", { big: "60 s", unit: "sentado en el borde", label: "Es el escalón que más se saltea. Sin contar, casi nadie llega ni a veinte.", tone: "teal" }),
    fc([{ t: "Sin" }, { t: "contar" }, { t: "vas" }, { t: "a" }, { t: "hacer" }, { t: "diez", hl: true }], { tone: "teal", at: "porque te aseguro que sin contar" }),
  ]},
  { key: "solucion", phrase: "eso es todo 90 segundos", beats: [
    lt("Eso es todo: 90 segundos", { kicker: "Los tres escalones", desc: "Treinta acostado, sesenta sentado, y el primer paso agarrado de algo.", tone: "teal" }),
    c("checklist", { title: "Mientras estás sentado, dos cosas", items: [
      { text: "Los tobillos: 20 bombeos, despacio", state: "done" },
      { text: "El vaso de agua, antes de apoyar los pies", state: "done" } ] }),
    fc([{ t: "Las" }, { t: "dos" }, { t: "multiplican" }, { t: "el" }, { t: "efecto", hl: true }], { tone: "teal", at: "hay dos cosas que quiero" }),
  ]},
  { key: "solucion", phrase: "las venas de las piernas tienen", beats: [
    lt("Válvulas de una sola dirección", { kicker: "Por qué funciona", desc: "Las venas de las piernas solo dejan pasar la sangre para arriba. El gemelo es el que aprieta.", tone: "teal" }),
    c("callout", { image: `img/${P("pantorrilla_musculo")}.png`, figure: "El gemelo", caption: "Cuando se contrae, aprieta esas venas y empuja la sangre contra la gravedad, hacia el corazón." }),
    fc([{ t: "Aprieta" }, { t: "y" }, { t: "empuja" }, { t: "hacia" }, { t: "arriba", hl: true }], { tone: "teal", at: "venas y empuja la sangre" }),
    c("board", { title: "No es una metáfora poética", items: [{ title: "Válvulas de una sola dirección" }, { title: "El músculo hace de bomba" }, { title: "La sangre sube contra la gravedad" }] }),
  ]},
  { key: "solucion", phrase: "con la sangre subiendo en vez", beats: [
    fc([{ t: "Subiendo" }, { t: "no" }, { t: "esperando", hl: true }], { tone: "teal" }),
    lt("Quince segundos, y no te cuesta nada", { kicker: "Lo que rinde", desc: "Llegás a la vertical con las piernas ya cebadas. De lo más efectivo que conozco.", tone: "teal", at: "es gratis toma 15 segundos" }),
  ]},
  { key: "solucion", phrase: "no te va a rehidratar entero", beats: [
    lt("No es magia", { kicker: "Seamos claros", desc: "Un vaso no te rehidrata entero. Le da al sistema un poco más de volumen justo cuando más lo necesita.", tone: "teal" }),
    mv("Un vaso de agua no cambia nada", "No te rehidrata entero, pero le da volumen al sistema justo en el peor momento del día", { flipPhrase: "pero le da al sistema un" }),
    fc([{ t: "Volumen" }, { t: "cuando" }, { t: "más" }, { t: "lo" }, { t: "necesita", hl: true }], { tone: "teal", at: "en el momento en que mas" }),
  ]},
  { key: "solucion", phrase: "el simple acto de tomar agua", beats: [
    lt("El agua fría dispara un reflejo", { kicker: "Y hay algo más", desc: "Sube un poquito la presión. En hipotensión ortostática ese efecto está medido y se usa a propósito.", tone: "teal" }),
    c("chips", { bg: "image", image: `img/${P("vaso_mesaluz")}.png`, imageDarken: 0.62, title: "El vaso, bien usado", chips: ["Servido la noche anterior, en la mesa de luz", "Fría, no tibia", "Sentado, antes de apoyar los pies"] }),
    ak([{ word: "ESTÁ MEDIDO", sub: "no es una creencia: se usa a propósito en gente con hipotensión ortostática", tone: "teal", atPhrase: "y se usa a proposito" }], {}),
  ]},
  { key: "nelida", phrase: "le ensene una prueba que puedes", beats: [
    lt("Una prueba que podés hacer hoy, en tu casa", { kicker: "Doña Nélida, 79", desc: "Con un tensiómetro de brazo. Si no tenés, más adelante te digo cómo darte cuenta igual.", tone: "teal" }),
    es("!", "El test casero de presión", { w: 3.2 }),
    c("callout", { image: `img/${P("tensiometro_brazo")}.png`, figure: "De brazo", caption: "Los de muñeca son menos confiables para esto. Si no tenés uno, hay señales que te lo dicen igual.", at: "esos de brazos si no" }),
  ]},
  { key: "nelida", phrase: "eso tiene nombre y apellido", beats: [
    lt("20 arriba, o 10 abajo", { kicker: "Los números del test", desc: "Si al minuto exacto de pararte te bajó eso, tiene nombre y apellido: hipotensión ortostática.", tone: "warn" }),
    c("board", { title: "Cómo se toma", items: [{ title: "Acostado 5 minutos, tranquilo y sin hablar" }, { title: "Parado, al minuto exacto" }, { title: "Anotás las dos y mirás la diferencia" }] }),
    fc([{ t: "Aunque" }, { t: "no" }, { t: "sientas" }, { t: "nada", hl: true }], { tone: "warn", at: "no sientas absolutamente nada dona" }),
  ]},

  // ░░ 16:00–22:00 — señales sin aparato ░░
  { key: "nelida", phrase: "te aparece un dolor raro", beats: [
    fc([{ t: "Como" }, { t: "una" }, { t: "percha" }, { t: "en" }, { t: "los" }, { t: "hombros", hl: true }], { tone: "teal" }),
    lt("Parado duele, sentado se va", { kicker: "El que casi nadie relaciona", desc: "Ese dolor de nuca y hombros aparece de pie y se afloja apenas te sentás. Es de los más ignorados.", tone: "teal", at: "ese ultimo es un clasico" }),
    ak([{ word: "Y DESPUÉS ANDÁS PERFECTO", sub: "por eso lo dejás pasar: dura los primeros pasos y se acomoda solo", tone: "teal", atPhrase: "te dan las piernas flojas" }], {}),
  ]},
  { key: "trampas", phrase: "y ya que estamos en", beats: [
    lt("Ahora vienen los 10 minutos siguientes", { kicker: "Lo que sigue", desc: "Tres trampas más. Todas de la mañana. Todas evitables sin comprar nada.", tone: "teal" }),
    c("chips", { bg: "image", image: `img/${P("cafe_manana")}.png`, imageDarken: 0.62, title: "Las tres trampas que vienen", chips: ["La ducha caliente de entrada", "El baño y el pujo", "El café en ayunas"], at: "en los 10 minutos siguientes" }),
  ]},
  { key: "trampa1", phrase: "esa dilatacion baja la presion", beats: [
    lt("Salís colorado porque la sangre se fue a la piel", { kicker: "Lo que hace el agua caliente", desc: "El calor dilata las arterias de la piel. La sangre se va a la superficie y la presión general baja.", tone: "warn" }),
    mv("Una ducha bien caliente te termina de despertar", "A esa hora te apila una caída de presión arriba de la otra", { at: "si venis de levantarte de golpe", flipPhrase: "estas apilando una caida sobre" }),
    fc([{ t: "Parado" }, { t: "sobre" }, { t: "azulejos" }, { t: "mojados" }, { t: "solo", hl: true }], { tone: "warn", at: "parado sobre azulejos mojados" }),
  ]},
  { key: "trampa1", phrase: "que el agua sea tibia", beats: [
    fc([{ t: "Tibia" }, { t: "no" }, { t: "hirviendo", hl: true }], { tone: "teal" }),
    c("callout", { image: `img/${P("borde_banera")}.png`, figure: "Si te sentís raro", caption: "Sentate en el borde de la bañera antes de que el cuerpo decida por vos. Sentarse a tiempo es lo que evita la caída.", at: "y que si te sentis raro" }),
  ]},
  { key: "trampa2", phrase: "cerras la glotis y apretas", beats: [
    fc([{ t: "Cerrás" }, { t: "la" }, { t: "glotis" }, { t: "y" }, { t: "apretás", hl: true }], { tone: "warn" }),
    lt("La presión del pecho se dispara y el retorno se frena", { kicker: "Maniobra de Valsalva", desc: "Mientras pujás, al corazón le llega menos sangre. Y cuando por fin soltás el aire, la presión rebota de golpe.", tone: "warn", at: "la presion adentro del pecho" }),
    ak([{ word: "UN PICO DE LOS GRANDES", sub: "a esa hora, en alguien de más de 60, ese rebote no es un detalle", tone: "warn", atPhrase: "ese rebote a esa hora" }], {}),
  ]},
  { key: "trampa2", phrase: "y sobre todo no pujes", beats: [
    fc([{ t: "Si" }, { t: "no" }, { t: "sale" }, { t: "esperá", hl: true }], { tone: "teal" }),
    es("!", "La constipación crónica se trata", { w: 3.4, at: "si estas constipado de manera cronica" }),
  ]},
  { key: "trampa3", phrase: "y ese efecto dura hasta 3", beats: [
    c("board", { title: "Cuánto te sube la cafeína", items: [{ title: "5 mmHg la de arriba" }, { title: "3 mmHg la de abajo" }, { title: "Y el efecto dura hasta 3 horas" }] }),
    fc([{ t: "Si" }, { t: "no" }, { t: "tomás" }, { t: "todos" }, { t: "los" }, { t: "días", hl: true }], { tone: "teal", at: "en gente que no toma todos" }),
    lt("Solos no son nada; encima del cortisol sí", { kicker: "Por eso importa la hora", desc: "Cinco milímetros no mueven la aguja. Salvo que se los sumes a una presión que ya subió sola.", tone: "warn", at: "salvo si se lo sumas al" }),
  ]},
  { key: "honesto", phrase: "esto que te conte no cura", beats: [
    fc([{ t: "Esto" }, { t: "no" }, { t: "cura" }, { t: "la" }, { t: "hipertensión", hl: true }], { tone: "teal" }),
    lt("La medicación se sigue tomando igual", { kicker: "Sin vueltas", desc: "Exactamente como te la indicaron. Y de esto se habla con tu médico, no con un video.", tone: "warn", at: "no la cura si tomas medicacion" }),
    ak([{ word: "HABLALO CON TU MÉDICO", sub: "nunca sumes ni saques nada por tu cuenta, ni por lo que diga un video", tone: "teal", atPhrase: "exactamente como te lo he indicado" }], {}),
  ]},
  { key: "honesto", phrase: "lo que hacen es sacarte", beats: [
    fc([{ t: "Un" }, { t: "pico" }, { t: "de" }, { t: "exigencia" }, { t: "menos", hl: true }], { tone: "teal" }),
    lt("Todos los días, durante años", { kicker: "Eso es lo que hace", desc: "No te arregla una arteria. Te saca una exigencia innecesaria, todas las mañanas, sin que lo notes.", tone: "teal", at: "exigencia innecesario todos los dias" }),
  ]},
  { key: "honesto", phrase: "hay mareos por azucar baja", beats: [
    fc([{ t: "No" }, { t: "todo" }, { t: "mareo" }, { t: "es" }, { t: "del" }, { t: "corazón", hl: true }], { tone: "teal" }),
    lt("Oído, azúcar baja, anemia", { kicker: "Las otras causas", desc: "El vértigo posicional lo resuelve un kinesiólogo en diez minutos. Por eso se mira, no se adivina.", tone: "teal", at: "hay mareos por anemia" }),
  ]},
  { key: "alarma", phrase: "si te sale un sudor frio", beats: [
    c("callout", { image: `img/${P("sudor_frio")}.png`, figure: "Sudor frío sin motivo", caption: "Junto con falta de aire que antes no tenías. No es calor, no es nervios: es una señal." }),
    lt("Media cara, un brazo o una pierna de un lado", { kicker: "Señal de ACV", desc: "Se afloja o se duerme. Se traba el habla o no entendés lo que te dicen. Es ahora.", tone: "warn", at: "se te afloja media cara" }),
  ]},
  { key: "alarma", phrase: "no en un rato no cuando", beats: [
    fc([{ t: "Ahora" }, { t: "no" }, { t: "en" }, { t: "un" }, { t: "rato", hl: true }], { tone: "warn" }),
    c("checklist", { title: "Llamar y que no sea nada es el mejor final", items: [
      { text: "Ahora. No en un rato.", state: "warn" },
      { text: "No «cuando termine el video»", state: "warn" },
      { text: "No «esperá que me baño»", state: "warn" } ], at: "no espera que me bano" }),
  ]},
  { key: "error", phrase: "camina 40 minutos todos los dias", beats: [
    lt("Le pasa a la gente que hace todo bien", { kicker: "El error del que se cuida", desc: "Le dieron el diagnóstico, le dieron la indicación clara, y la cumplió sin fallar un día.", tone: "teal" }),
    fc([{ t: "Y" }, { t: "vos" }, { t: "dijiste" }, { t: "listo", hl: true }], { tone: "teal", at: "y vos que sos de los" }),
    c("stat", { big: "6:30", unit: "de la mañana, en ayunas", label: "lo pusiste primero, antes que todo, como se pone lo importante. Zapatillas y a la calle, justo en la franja de más riesgo.", tone: "warn", at: "y como sos una persona ordenada" }),
  ]},

  // ░░ 22:00–27:08 — el error, el recap y el cierre ░░
  { key: "error", phrase: "estomago vacio le pedis al", beats: [
    fc([{ t: "Cuarenta" }, { t: "minutos" }, { t: "a" }, { t: "paso" }, { t: "rápido", hl: true }], { tone: "warn" }),
    c("stat", { big: "40 min", unit: "de trabajo, en ayunas", label: "el esfuerzo más grande del día, con el estómago vacío y adentro de la franja de las 6 a las 12.", tone: "warn", at: "40 minutos de trabajo a" }),
    lt("Y encima, con frío", { kicker: "La última capa", desc: "El frío contrae las arterias todavía más. Es el peor combo del día, repetido todas las mañanas.", tone: "warn", at: "muchas veces con frio que" }),
  ]},
  { key: "error", phrase: "se toman a la manana", beats: [
    es("!", "Y encima, sin la pastilla", { tone: "warn", w: 3.4 }),
    c("callout", { image: `img/${P("pastillero_semanal")}.png`, figure: "«La tomo cuando vuelvo»", caption: "La mayoría de las pastillas de la presión se toman a la mañana. Muchos salen a caminar ANTES, para tomarla con el desayuno.", at: "antes de tomarla para aprovechar" }),
    fc([{ t: "El" }, { t: "momento" }, { t: "más" }, { t: "expuesto" }, { t: "del" }, { t: "día", hl: true }], { tone: "warn", at: "caminan en el momento mas" }),
    lt("Con la protección de ayer ya gastada", { kicker: "Cuando menos cubierto estás", desc: "La hora de mayor exigencia del día, justo cuando la pastilla anterior terminó de hacer efecto.", tone: "warn", at: "la pastilla del dia anterior" }),
  ]},
  { key: "error", phrase: "que dejes de caminar caminar", beats: [
    lt("Nadie te dijo que dejes de caminar", { kicker: "Que quede clarísimo", desc: "Caminar es de las mejores cosas que podés hacer por tu corazón. Punto. No hay discusión.", tone: "teal" }),
    ak([{ word: "CAMINAR ES DE LO MEJOR", sub: "el problema nunca fue caminar — es la hora", tone: "teal", atPhrase: "es de las mejores cosas" }], {}),
    fc([{ t: "El" }, { t: "sedentarismo" }, { t: "hace" }, { t: "más" }, { t: "daño", hl: true }], { tone: "warn", at: "no hay discusion el sedentarismo" }),
  ]},
  { key: "error", phrase: "ya desayunaste ya tomaste agua", beats: [
    c("checklist", { title: "A media mañana ya tenés todo a favor", items: [
      { text: "Ya desayunaste", state: "done" },
      { text: "Ya tomaste agua", state: "done" },
      { text: "Ya tomaste la medicación, si la tomás", state: "done" },
      { text: "Y el pico hormonal ya pasó", state: "done" } ] }),
    lt("Después de las 9, o a la tarde", { kicker: "Corré el horario, no el hábito", desc: "El pico de cortisol y adrenalina ya pasó. El cuerpo llega a la caminata despierto y cargado.", tone: "teal", at: "y el pico hormonal paso" }),
    fc([{ t: "Mismo" }, { t: "ejercicio" }, { t: "mismo" }, { t: "beneficio" }, { t: "sin" }, { t: "la" }, { t: "ventana", hl: true }], { tone: "teal", at: "mismo beneficio sin la ventana" }),
  ]},
  { key: "error", phrase: "algo chiquito en el estomago", beats: [
    lt("Si tu vida es a las 7, hacelo así", { kicker: "Sin arrancar en cuarta", desc: "Los 90 segundos para levantarte, el vaso de agua sentado, la pastilla si te toca y algo chiquito en el estómago.", tone: "teal" }),
    c("board", { title: "Los primeros 10 minutos, de paseo", items: [{ title: "Bien lentos, como mirando vidrieras" }, { title: "Que el cuerpo entre en temperatura" }, { title: "Recién después apurás el paso" }] , at: "primeros 10 minutos de caminata" }),
    ak([{ word: "NO ARRANQUES EN CUARTA", sub: "con el motor frío no anda bien ni un auto", tone: "teal", atPhrase: "no es dejar de caminar" }], {}),
  ]},
  { key: "recap", phrase: "servido la noche anterior y", beats: [
    c("callout", { image: `img/${P("vaso_mesaluz")}.png`, figure: "2 · El vaso de agua", caption: "Servido en la mesa de luz la noche anterior. Te lo tomás sentado, antes de apoyar los pies en el piso." }),
    fc([{ t: "Agua" }, { t: "primero" }, { t: "café" }, { t: "después", hl: true }], { tone: "teal", at: "agua primero cafe despues" }),
    lt("Veinte bombeos con las puntas de los pies", { kicker: "3 · Los tobillos", desc: "Sentado en el borde de la cama, antes de pararte. Es tu segundo corazón: usalo.", tone: "teal", at: "con las puntas de los pies" }),
  ]},
  { key: "recap", phrase: "y nunca lo primero y", beats: [
    c("checklist", { title: "4 · La ducha y el baño", items: [
      { text: "Tibia, nunca hirviendo", state: "done" },
      { text: "Y nunca lo primero al levantarte", state: "done" },
      { text: "En el baño, no pujes. Si no sale, esperá.", state: "done" } ] }),
    ak([{ word: "DESPUÉS DE LAS 9, NUNCA ANTES DE LAS 8", sub: "y si tiene que ser temprano, los primeros 10 minutos de paseo", tone: "teal", atPhrase: "antes de las 8 y" }], {}),
  ]},
  { key: "recap", phrase: "nada mas que la hora", beats: [
    lt("Escribime nada más que la hora", { kicker: "En los comentarios", desc: "A qué hora te levantás. Nada más. Los leo todos los días, uno por uno.", tone: "teal" }),
    fc([{ t: "¿Ese" }, { t: "segundito" }, { t: "de" }, { t: "vista" }, { t: "oscura?" }, { t: "agregale" }, { t: "un" }, { t: "sí", hl: true }], { tone: "warn", at: "oscura al pararte agregale un" }),
  ]},
  { key: "recap", phrase: "no se lo mandes para", beats: [
    lt("No se lo mandes para que aprenda", { kicker: "Si conocés a alguien que vive solo", desc: "Mandáselo para que esta noche deje el vaso servido en la mesa de luz. Con eso alcanza.", tone: "teal" }),
    fc([{ t: "Esta" }, { t: "noche" }, { t: "el" }, { t: "vaso" }, { t: "servido", hl: true }], { tone: "teal", at: "mandarselo para que tenga" }),
  ]},
  { key: "teaser", phrase: "si a mucha gente le", beats: [
    lt("Hay estudios grandes en las dos veredas", { kicker: "El debate abierto", desc: "A mucha gente le funciona mejor de noche que a la mañana. Te voy a contar qué dice cada lado.", tone: "teal" }),
    fc([{ t: "¿De" }, { t: "mañana" }, { t: "o" }, { t: "de" }, { t: "noche?", hl: true }], { tone: "teal", at: "te voy a contar que" }),
    c("chips", { bg: "image", image: `img/${P("federer_despide")}.png`, imageDarken: 0.62, title: "Si tomás una pastilla para la presión, ese video es para vos", chips: ["Qué dice cada lado del debate", "Qué le pregunto yo a mis pacientes", "Cómo decidimos el horario"], at: "pregunto yo a mis pacientes" }),
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
const VIDEO_END = (CW[CW.length - 1]?.s || 1628) + 2;

let cursorSec = 0;
const missing = [];
for (const sec of SECTIONS) {
  if (sec.start != null) { cursorSec = sec.start; continue; }
  const ms = findMs(sec.phrase, cursorSec + 1);
  if (ms == null) missing.push(sec.phrase);
  sec.start = ms != null ? ms : cursorSec + 5;
  cursorSec = sec.start;
}
// EXTRA: se anclan por PRIMERA ocurrencia global (no comparten el cursor) y se mezclan.
// Las que no anclan se descartan en silencio — mejor perder un cartel que ponerlo fuera de tiempo.
let nExtra = 0;
for (const sec of EXTRA) {
  const ms = findMs(sec.phrase, 0);
  if (ms == null) { missing.push(`[extra] ${sec.phrase}`); continue; }
  sec.start = ms;
  SECTIONS.push(sec);
  nExtra++;
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
  if (beat.kind === "focuscards" || beat.kind === "escalones") {
    let last = 0;
    beat.items = (beat.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, beat.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - beat.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...rest } = it; return { ...rest, at: atF };
    });
    // si las anclas se fueron muy lejos (frase repetida), repartir parejo
    if (last > 420) { const GAP = 80; beat.items = beat.items.map((it, i) => ({ ...it, at: i * GAP })); last = (beat.items.length - 1) * GAP; }
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
const COMPK = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "callout", "bars", "diagram", "rule", "nametag", "board", "annotated", "cross", "process", "lowerthird", "guardaesto", "errorstinger", "mitoverdad", "frasecinetica", "freezezoom", "relojriesgo", "looplock"]);
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
beats.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (Array.isArray(b.slides)) b.slides.forEach((s) => s.image && need.add(s.image)); if (Array.isArray(b.items)) b.items.forEach((it) => it && it.image && need.add(it.image)); });
const miss = [...need].filter((p) => !fs.existsSync("public/" + p));
if (missing.length) console.log(`⚠ frases no ancladas (${missing.length}):`, missing);
const dur = beats[beats.length - 1].start + beats[beats.length - 1].dur;
const kinds = {}; beats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const raw = beats.filter((b) => b.kind === "raw").length;
console.log(`beats: ${beats.length} · raw: ${raw} (${(100*raw/beats.length).toFixed(0)}%) · diagramas: ${kinds.diagram||0} · dur: ${dur.toFixed(0)}s (${(dur/60).toFixed(1)}min)`);
console.log("kinds:", JSON.stringify(kinds));
console.log(`assets referenciados: ${need.size} · faltantes: ${miss.length}`);
if (miss.length) console.log("FALTAN:", miss.slice(0, 12).join(" "));
