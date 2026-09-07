// _v3/fedvet4_comps.mjs — la lista de COMPONENTES de fedvet4, separada del generador para poder
// verificar los anclajes sola. La importa gen_fedvet4_plan.mjs.
//
// ⛔⛔ EL CTA Y TODA TARJETA QUE NO DIBUJE SU PROPIO FONDO COMPLETO VA EN `overlay: true`.
//    Como cue base queda sola sobre el fondo de marca = pantalla negra (pasó en dale1).
// ⛔ `RayCta` NO tiene prop `bed`: nunca le pases cama de foto.
// ⛔ TODA prop de texto va EXPLÍCITA. `src/fedvet/BigStat.tsx` trae un default de fedvet2
//    ("...cuando el perro se estira") que en este video sería texto ajeno en pantalla.

const DOM = "drfederer.com/veterinario";

/** sello con el número de la señal — listicle: uno en CADA ítem. Componente PROPIO del canal
 *  (`src/fedvet/VetSenal.tsx`): ficha de la libreta del veterinario, con el título escribiéndose
 *  letra por letra. Antes era un `StatBug` genérico y se leía como el bug de cualquier canal.
 *  ⛔ overlay SIEMPRE: no dibuja fondo completo. */
const sello = (frag, n, titulo) => ({
  frag, comp: "VetSenal", overlay: true,
  props: { n: String(n), title: titulo, tone: n === 8 ? "danger" : "brass" },
});

export const COMPS = [
  // ── HOOK ─────────────────────────────────────────────────────────────────────────────────────
  { frag: "Uno parecía desamor y era dolor", comp: "SplitVs",
    props: { leftLabel: "TOBÍAS · 12 AÑOS · CASA DE DOÑA AMPARO", leftImage: "img/fedvet4_004.jpg", rightImage: "img/fedvet4_007.jpg",
      leftValue: "PARECÍA DESAMOR, ERA DOLOR",
      rightLabel: "EL PERRO DE DON ERNESTO · MISMA CUADRA", rightValue: "PARECÍA AMOR, ERA UNA ENFERMEDAD",
      verdict: "Once días de diferencia. Los dos dueños dijeron la misma frase." } },
  { frag: "Son el cuerpo. Te lo voy a demostrar", comp: "BigStat",
    props: { value: "7 DE 10", unit: "NO SON DESAMOR",
      caption: "Son el cuerpo: el oído, las patas, la vista, la boca, la cabeza. Te lo demuestro señal por señal.",
      tone: "brass" } },

  // ── SEÑAL 1 ──────────────────────────────────────────────────────────────────────────────────
  sello("Y un día llegas, abres, y él está echado en su rincón", 1, "YA NO CORRE A RECIBIRTE"),
  { frag: "Un perro pierde audición por los agudos primero", comp: "MythTruth",
    props: { kicker: "LO QUE CREES QUE SIGNIFICA",
      myth: "Ya no le emociona verte llegar.",
      truth: "No te oye llegar. La audición se pierde por los agudos primero, y tu llave, el timbre y el chirrido del portón son agudos. Para él tú no vienes llegando: tú apareces." } },
  { frag: "Mira cómo se pone de pie cuando decide hacerlo", comp: "RayChecklist",
    props: { kicker: "MÍRALO UNA SOLA VEZ Y YA LO SABES", title: "Cómo se pone de pie", items: [
      { text: "Necesita dos o tres intentos" },
      { text: "Levanta la parte de adelante y arrastra la de atrás" },
      { text: "Busca una pared para apoyarse" },
      { text: "En el suelo liso patina y en la alfombra no" }] } },

  // ── SEÑAL 2 ──────────────────────────────────────────────────────────────────────────────────
  sello("Ibas a la cocina, él iba a la cocina", 2, "YA NO TE SIGUE POR LA CASA"),
  { frag: "es levantarse y sentarse veinte o treinta veces", comp: "BigStat",
    props: { value: "20 A 30", unit: "VECES AL DÍA SE LEVANTA PARA SEGUIRTE",
      caption: "No es una caminata: es el ejercicio más caro que hace en el día, y cada vez la paga una articulación que ya no está entera.",
      tone: "brass" } },
  { frag: "Si te sigue a la habitación con alfombra", comp: "SplitVs",
    props: { leftLabel: "DEJÓ DE SEGUIRTE A TODAS PARTES", leftImage: "img/fedvet4_065.jpg", rightImage: "img/fedvet4_070.jpg",
      leftValue: "AHÍ SÍ HAY QUE MIRAR",
      rightLabel: "SOLO A LOS SITIOS DE SUELO LISO", rightValue: "ESO NO ES DESAMOR, ES FÍSICA",
      verdict: "La misma conducta, y dos cosas completamente distintas." } },
  { frag: "No hubo terapia ni collar", comp: "PullQuote",
    props: { quote: "No hubo terapia ni collar. Hubo goma.",
      attrib: "Labradora cruzada de 11 años. Tres alfombras de baño de las baratas, y a la semana volvió a la cocina." } },

  // ── SEÑAL 3 ──────────────────────────────────────────────────────────────────────────────────
  sello("O se levanta y se va a echar dos metros más allá", 3, "SE APARTA CUANDO LO ACARICIAS"),
  { frag: "Los perros llevan años pidiéndote que pares", comp: "WorstSpots",
    props: { kicker: "LAS FRASES QUE LLEVA AÑOS DICIÉNDOTE", title: "El idioma de «espera, ahora no»", spots: [
      { label: "Bosteza sin tener sueño" },
      { label: "Se sacude el lomo estando seco" },
      { label: "Gira la cabeza y aparta la mirada" },
      { label: "Levanta una pata delantera y la deja en el aire" }] } },
  { frag: "Se llama la prueba del consentimiento", comp: "ProcessChips",
    props: { kicker: "LA MANO ABIERTA CERCA DEL HOMBRO, SIN TOCAR", title: "La prueba del consentimiento", steps: [
      { title: "Uno" }, { title: "Dos" }, { title: "Tres" },
      { title: "¿Acerca la cabeza? Tienes permiso" }] } },

  // ── SEÑAL 4 ──────────────────────────────────────────────────────────────────────────────────
  sello("Ahora te mira un segundo y aparta la vista", 4, "YA NO TE MIRA A LOS OJOS"),
  { frag: "La pregunta no es si están turbios", comp: "SplitVs",
    props: { leftLabel: "LOS DOS OJOS TURBIOS POR IGUAL", leftImage: "img/fedvet4_111.jpg", rightImage: "img/fedvet4_114.jpg",
      leftValue: "ESO ES LA EDAD",
      rightLabel: "UN OJO SOLO, DE UN DÍA PARA EL OTRO", rightValue: "ESO SE MIRA HOY",
      verdict: "Más grande, rojo, o cerrado a medias: eso no espera a la semana que viene." } },

  // ── CTA 1 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "Buscas \"se aparta cuando lo acaricio\"", comp: "RayCta", overlay: true,
    props: { eyebrow: "Federer Veterinario", title: "El Método del Perro Mayor",
      sub: "Tres guías y las hojas para imprimir, ordenadas por lo que ves con tus ojos.",
      domain: DOM, showQr: false } },

  // ── SEÑAL 5 ──────────────────────────────────────────────────────────────────────────────────
  sello("Te mira y se queda. O ni te mira", 5, "NO VIENE CUANDO LO LLAMAS"),
  { frag: "aparece lo que yo llamo la llamada quemada", comp: "MythTruth",
    props: { kicker: "LA LLAMADA QUEMADA",
      myth: "Se volvió desobediente contigo.",
      truth: "Aprendió. Si tu voz predice siete de cada diez veces las uñas, el baño o el auto, tu perro no dejó de quererte: aprendió bien la lección que le estabas enseñando sin querer." } },
  { frag: "su nombre no se usa nunca para nada malo", comp: "RouteFlow",
    props: { kicker: "DOS SEMANAS, SIN UNA SOLA EXCEPCIÓN", title: "Cómo se despinta el nombre", steps: [
      { label: "Su nombre nunca para nada malo" },
      { label: "Uñas o baño: vas tú, en silencio" },
      { label: "El nombre solo para comida, salida y caricia" },
      { label: "A las dos semanas la palabra vale otra vez" }] } },

  // ── SEÑAL 6 ──────────────────────────────────────────────────────────────────────────────────
  sello("Y de repente se acuesta al lado de tu marido", 6, "AHORA PREFIERE A OTRO DE LA CASA"),
  { frag: "Eligen a quien es más previsible", comp: "PullQuote",
    props: { quote: "Los perros mayores no eligen a quien más los quiere. Eligen a quien es más previsible.",
      attrib: "— Dr. Federer · Federer Veterinario" } },
  { frag: "quédate con un trabajo", comp: "CheckCard",
    props: { kicker: "UNO SOLO, PERO SIEMPRE TUYO", title: "El trabajo que te devuelve el perro", items: [
      { text: "La comida de la mañana, o la salida de la tarde, o el cepillado" },
      { text: "Siempre a la misma hora" },
      { text: "Empezando con la misma frase" },
      { text: "Terminando igual. Dos semanas y vuelve a esperarte" }] } },

  // ── SEÑAL 7 ──────────────────────────────────────────────────────────────────────────────────
  sello("Le sacas el juguete de siempre y se queda echado", 7, "YA NO QUIERE JUGAR"),
  { frag: "Mira el borde donde el diente se junta con la encía", comp: "RayChecklist",
    props: { kicker: "LEVÁNTALE EL LABIO, SIN ABRIRLE LA BOCA", title: "Lo que se ve desde afuera", items: [
      { text: "Una línea roja donde el diente se junta con la encía" },
      { text: "Sarro marrón" },
      { text: "Aliento con olor dulzón que se te queda pegado" },
      { text: "Y la respuesta no es «ya está viejo»" }] } },
  { frag: "Había perdido las ganas de que le doliera", comp: "PullQuote",
    props: { quote: "No había perdido las ganas de jugar contigo. Había perdido las ganas de que le doliera.",
      attrib: "Prueba con algo blando y sin peso, y con perseguir en vez de morder." } },

  // ── SEÑAL 8 ──────────────────────────────────────────────────────────────────────────────────
  sello("Me lo dicen así: doctor, me gruñó a mí", 8, "TE GRUÑE CUANDO LO TOCAS"),
  { frag: "Un gruñido es un aviso, y un aviso es un regalo", comp: "MythTruth",
    props: { kicker: "LA MÁS GENEROSA DE LAS DIEZ",
      myth: "Me gruñó a mí. Se volvió en mi contra.",
      truth: "Tiene una mandíbula que podía hacerte daño de verdad y eligió no usarla. Gastó su única forma de decir «ahí me duele» en un ruido que no te lastima." } },
  { frag: "no lo castigues por gruñir", comp: "BigStat",
    props: { value: "NUNCA", unit: "CASTIGUES UN GRUÑIDO",
      caption: "Un perro al que se le castiga el gruñido no deja de tener dolor: deja de avisar. Y pasa del silencio a la mordida sin escalón intermedio.",
      tone: "danger" } },

  // ── CTA 2 ────────────────────────────────────────────────────────────────────────────────────
  { frag: "para llegar a la consulta con algo concreto en la mano", comp: "RayCta", overlay: true,
    props: { eyebrow: "Hoja para imprimir", title: "El mapa del cuerpo",
      sub: "La recorres, marcas dónde reacciona, anotas la fecha. Con el resto de las hojas.",
      domain: DOM, showQr: false } },

  // ── SEÑAL 9 ──────────────────────────────────────────────────────────────────────────────────
  sello("No es que no te oiga: aunque te vea", 9, "SE QUEDA MIRANDO LA PARED"),
  { frag: "Las señales que hay que mirar son cinco", comp: "CheckCard",
    props: { kicker: "TRES O MÁS DE ESTAS CINCO = CONSULTA PRONTO", title: "Disfunción cognitiva", items: [
      { text: "Se queda parado como perdido, sobre todo en las esquinas" },
      { text: "Se le da vuelta el día: duerme de día y camina de noche" },
      { text: "Deja de saludar, y no solo a ti: a todo el mundo" },
      { text: "Se le olvida pedir para salir, y aparecen accidentes en casa" },
      { text: "Se pone a mirar fijo la pared o el techo, sin nada ahí" }] } },
  { frag: "Le está costando encontrarte", comp: "PullQuote",
    props: { quote: "Un perro con esto no dejó de quererte. Le está costando encontrarte.",
      attrib: "Es una diferencia enorme, y no siempre se ve desde afuera." } },

  // ── SEÑAL 10 ─────────────────────────────────────────────────────────────────────────────────
  sello("Ya no se acerca. Se va solo", 10, "SE VA SOLO Y NO TE BUSCA"),
  { frag: "te las doy en orden de probabilidad", comp: "RouteFlow",
    props: { kicker: "DE LA MÁS COMÚN A LA MÁS SERIA", title: "Por qué se va solo", steps: [
      { label: "El calor: busca la baldosa fría y dura, no lo blando" },
      { label: "El ruido: nietos, televisión, gente que entra y sale" },
      { label: "El malestar de fondo: el que se siente mal se retira" }] } },
  { frag: "Lo importante es lo que cambió", comp: "PullQuote",
    props: { quote: "Lo importante nunca es lo que tu perro hace. Lo importante es lo que cambió, y hace cuánto cambió.",
      attrib: "La única regla que hay que llevarse de este video." } },

  // ── EL GIRO ──────────────────────────────────────────────────────────────────────────────────
  { frag: "Esas tres son justamente las tres que se arreglan", comp: "CheckCard",
    props: { kicker: "SIN MEDICACIÓN, SIN DINERO, SIN COMPRAR NADA", title: "Las tres que sí se arreglan", items: [
      { text: "Se aparta cuando lo acaricias · tres segundos de mano quieta" },
      { text: "No viene cuando lo llamas · dos semanas sin usar su nombre para nada malo" },
      { text: "Prefiere a otro de la casa · un trabajo tuyo, siempre a la misma hora" }] } },

  // ── QUÉ HACER ESTA SEMANA ────────────────────────────────────────────────────────────────────
  { frag: "No son tres tareas: son tres papeles", comp: "ProcessChips",
    props: { kicker: "PARA LOS PRÓXIMOS SIETE DÍAS", title: "Tres papeles", steps: [
      { title: "La lista de lo que cambió" },
      { title: "El mapa del cuerpo" },
      { title: "La prueba de los tres segundos" }] } },

  // ── CIERRE Y CTA 3 ───────────────────────────────────────────────────────────────────────────
  { frag: "Se mide en lo que le cuesta hacerlo", comp: "PullQuote",
    props: { quote: "El amor de un perro viejo no se mide en lo que hace. Se mide en lo que le cuesta hacerlo, y aun así lo hace.",
      attrib: "— Dr. Federer · Federer Veterinario" } },
  { frag: "En pantalla te dejo el código", comp: "RayCta", overlay: true,
    props: { eyebrow: "Federer Veterinario", title: "El Método del Perro Mayor",
      sub: "Tres guías y las hojas para imprimir. Qué hacer en casa, qué no hacer nunca, y cuándo llamar.",
      domain: DOM, qr: "med/fedvet4_qr.png", showQr: true } },
];
