// ── COMPONENTES — la VARA: se busca el componente-ESCENA del kit, no la tarjeta plana ──
const I = (n) => `img/${SLUG}_${n}.png`;
const BL = [
  { img: I("bl_1"), label: "La firmeza de la cara", num: "01" },
  { img: I("bl_2"), label: "El dorso de las manos", num: "02" },
  { img: I("bl_3"), label: "Las articulaciones", num: "03" },
  { img: I("bl_4"), label: "El pelo y las uñas", num: "04" },
  { img: I("bl_5"), label: "Capilares e intestino", num: "05" },
];
const CMP = [
  // HOOK · el precio, cara a cara (componente-ESCENA, no tabla plana)
  { phrase: "de la crema de 400 pesos", kind: "pricewar", leftImage: I("pw_grenetina"), rightImage: I("pw_crema"),
    leftPrice: "$20", rightPrice: "$400", leftLabel: "Grenetina sin sabor del súper", rightLabel: "Crema \"con colágeno\"",
    strike: "/ frasco", verdict: "Y LA CARA NO PUEDE ENTRAR", subtitle: "El mismo colágeno, dos precios" },
  // HOOK · presentación
  { phrase: "soy el dr federer", kind: "lowerthird", title: "Dr. Federer", kicker: "Más salud, más vida", desc: "Piel madura, sin frasquitos caros.", tone: "teal" },
  // PELLIZCO · el mecanismo de la piel → PIZARRA 1 (regla 9: mecanismo = pizarra)
  { phrase: "tu piel no es una hoja de papel", kind: "avatarpizarra", items: [
    { card: "1 · Arriba: la epidermis", sub: "células muertas compactadas — su único trabajo es NO dejar entrar", atPhrase: "arriba esta la epidermis" },
    { card: "2 · Abajo: la dermis", sub: "ahí vive la red de colágeno, tejida como el resorte de un colchón", atPhrase: "y abajo en el segundo piso" },
    { card: "3 · Si el resorte se adelgaza, la piel de arriba SOBRA", sub: "y la piel que sobra se dobla — eso son las arrugas", atPhrase: "cuando esa red se adelgaza" },
  ] },
  // PELLIZCO · el reencuadre
  { phrase: "son las arrugas no son la piel", kind: "mitoverdad",
    myth: "Las arrugas son la piel dañada",
    truth: "Es la piel SOBRANDO, porque el colchón de abajo perdió relleno",
    flipPhrase: "es la piel sobrando" },
  // DALTON · el dato duro
  { phrase: "en dermatologia hay una regla", kind: "callout", figure: "500", eyebrow: "Experimental Dermatology · 2000 · Bos y Meinardi",
    caption: "La regla de los 500 dalton: para atravesar la piel sana, una molécula tiene que pesar menos de eso", medico: true },
  // DALTON · el número que derriba la crema
  { phrase: "300 mil dalton", kind: "bars", title: "Cuánto pesa, y cuánto puede pasar", unit: "dalton", bars: [
    { label: "Límite para atravesar la piel", value: 500, tone: "done", note: "500" },
    { label: "Nicotina (el parche sí pasa)", value: 160, tone: "done", note: "160" },
    { label: "Una molécula de colágeno", value: 300000, tone: "danger", winner: false, note: "300.000 — 600 veces el límite" },
  ] },
  // DALTON · el remate
  { phrase: "es que no cabe", kind: "frasecinetica", words: ["No", "es", "que", "no", "quiera.", "Es", "que", "no", "cabe."], tone: "warn" },
  // DALTON · la letra chiquita
  { phrase: "y atras en letras chiquitas", kind: "freezezoom", image: I("fz_etiqueta"), x: 0.5, y: 0.62, zoom: 2.1, tone: "warn", label: "Adelante: COLÁGENO. Atrás: hidratante." },
  // ENEMIGO · el bote caro es gelatina
  { phrase: "y vendida veinte veces mas cara", kind: "pricewar", leftImage: I("pw_sobre"), rightImage: I("pw_bote"),
    leftPrice: "$20", rightPrice: "$1.000", leftLabel: "Un sobre de grenetina", rightLabel: "Colágeno hidrolizado de farmacia",
    strike: "/ mes", verdict: "MISMO ANIMAL, MISMO ORIGEN", subtitle: "Piel de res y huesos, hervidos" },
  // GRENETINA · el mecanismo del material → PIZARRA 2
  { phrase: "una de cada tres cuentitas", kind: "avatarpizarra", items: [
    { card: "1 · El colágeno es un collar de cuentitas", sub: "y una de cada tres es la MISMA: la glicina", atPhrase: "es la misma se llama glicina" },
    { card: "2 · La grenetina es ese mismo collar, roto", sub: "un tercio de la grenetina es glicina pura", atPhrase: "como un tercio de la grenetina" },
    { card: "3 · Tu fibroblasto rearma TU collar", sub: "con tu diseño — por eso no importa que llegue en pedazos", atPhrase: "agarran esas cuentitas y arman tu collar" },
  ] },
  // Injerto 1 de guía (~30%)
  { phrase: "nadie se queja de que el ladrillo llegue suelto", kind: "lowerthird", title: "Las medidas exactas están en la DESCRIPCIÓN", kicker: "El paso a paso", desc: "Cuánta grenetina, cuánta vitamina C y a qué hora — todo ahí abajo.", tone: "teal" },
  // TRENZA · el remate
  { phrase: "los ladrillos solos no hacen la pared", kind: "frasecinetica", words: ["Los", "ladrillos", "solos", "no", "hacen", "la", "pared."], tone: "warn" },
  // TRENZA · EL MECANISMO CLAVE → PIZARRA 3
  { phrase: "tres de esas cadenas se tienen que trenzar", kind: "avatarpizarra", items: [
    { card: "1 · La cadena nace floja", sub: "un hilo suelto, blandito, inútil", atPhrase: "esa cadena nace floja" },
    { card: "2 · Tres cadenas se trenzan como una cuerda", sub: "esa trenza es toda la fuerza del colágeno", atPhrase: "como una cuerda como una trenza de tres" },
    { card: "3 · La trenza se cierra con vitamina C", sub: "sin ella las enzimas no trabajan y la cadena se tira", atPhrase: "y ese ayudante es la vitamina c" },
  ] },
  // TRENZA · los dos ingredientes como escena con capas
  { phrase: "es un cofactor es una pieza de la maquina", kind: "ingredientduo", leftImg: I("duo_grenetina"), rightImg: I("duo_limon") },
  // ESCORBUTO · el ancla histórica
  { phrase: "en 1747 un medico escoces", kind: "callout", figure: "1747", eyebrow: "James Lind · Marina Británica",
    caption: "El primer ensayo clínico de la historia: 12 marineros, 6 tratamientos. Los de los cítricos se pusieron de pie en 6 días", medico: true },
  // ESCORBUTO · el experimento paso a paso
  { phrase: "agarro 12 marineros enfermos", kind: "process", title: "El experimento de Lind", steps: [
    { title: "12 enfermos", desc: "los separó en parejas, cada una con un tratamiento distinto" },
    { title: "Sidra, vinagre, agua de mar…", desc: "y a una sola pareja, naranjas y limones" },
    { title: "6 días", desc: "los de los cítricos ya estaban de pie. No era una infección: era colágeno sin trenzar" },
  ] },
  // SHAW · el estudio
  { phrase: "ano 2017 revista american", kind: "callout", figure: "2017", eyebrow: "American Journal of Clinical Nutrition · Shaw y Baar",
    caption: "15 g de gelatina con vitamina C, una hora antes de moverse: el marcador de colágeno nuevo se duplicó", medico: true },
  // SHAW · el número
  { phrase: "ese marcador de colageno nuevo se duplico", kind: "bars", title: "Señal de colágeno nuevo en sangre (PINP)", unit: "%", bars: [
    { label: "Placebo", value: 100, tone: "danger", note: "referencia" },
    { label: "Gelatina + vitamina C", value: 200, winner: true, note: "el doble" },
  ] },
  // SHAW · el escudo de honestidad
  { phrase: "y ahora quiero ser muy honesto contigo", kind: "checklist", title: "Qué prueba y qué NO prueba ese estudio", items: [
    { text: "Se hizo en hombres jóvenes y sanos, no en piel de +60", state: "warn" },
    { text: "Midió tendones y ligamentos, no arrugas de la cara", state: "warn" },
    { text: "Midió una señal en sangre, no una foto de antes y después", state: "warn" },
    { text: "Sí prueba el MECANISMO: aminoácidos + vitamina C disparan la fabricación", state: "done" },
  ] },
  // PROKSCH · el estudio de piel, con su conflicto de interés dicho
  { phrase: "hay uno de 2014", kind: "callout", figure: "2014", eyebrow: "Skin Pharmacology and Physiology",
    caption: "Mujeres de 35 a 55, 8 semanas: la elasticidad medida con aparato mejoró. Ojo: lo financió una empresa que vende colágeno", medico: true },
  // EDAD · el dato que da esperanza
  { phrase: "vas perdiendo alrededor de un 1", kind: "callout", figure: "1%", eyebrow: "Pérdida de colágeno por año, desde los 25",
    caption: "Pero el fibroblasto no se murió: sigue vivo a los 70 y a los 80. Está lento y le llega poco material", medico: true },
  // BENEFICIOS · overview con el clímax en el 3
  { phrase: "te voy a dar 5", kind: "splitlist", title: "Un sobre de $20, cinco cosas", items: [
    "1 · La firmeza de la cara — el óvalo y las mejillas",
    "2 · El dorso de las manos — lo que más delata la edad",
    "3 · Las articulaciones — la evidencia más directa ★",
    "4 · El pelo y las uñas — lo primero que se nota",
    "5 · Capilares e intestino — lo que no se ve en el espejo",
  ] },
  // BENEFICIOS 1-5 · escena cinemática que ATERRIZA en el que nombra
  { phrase: "el numero 1 es el mas obvio", kind: "benefitlock", index: 0, cards: BL },
  { phrase: "el numero 2 son las manos", kind: "benefitlock", index: 1, cards: BL },
  { phrase: "las articulaciones y aqui es donde", kind: "benefitlock", index: 2, cards: BL },
  { phrase: "el numero 4 es el pelo y las unas", kind: "benefitlock", index: 3, cards: BL },
  { phrase: "y el numero 5 es el que a mi", kind: "benefitlock", index: 4, cards: BL },
  // Injerto 2 de guía (~65%)
  { phrase: "te las deje todas escritas en la guia", kind: "lowerthird", title: "La hoja para pegar en la cocina", kicker: "Con letra grande", desc: "Cantidades por peso, horarios y la lista de frutas — en la descripción.", tone: "teal" },
  // RECETA · los 4 pasos
  { phrase: "porque son cuatro pasos", kind: "process", title: "Los 4 pasos, y los 4 importan", steps: [
    { title: "1 · Grenetina SIN sabor", desc: "la cajita blanca, sin azúcar ni color ni saborizante" },
    { title: "2 · Una cucharada sopera", desc: "≈10 g en medio vaso de agua tibia — tibia, no hirviendo" },
    { title: "3 · Vitamina C EN LA MISMA TOMA", desc: "medio limón exprimido, una guayaba o media naranja. Junto, no después" },
    { title: "4 · Todos los días", desc: "la constancia le gana al horario perfecto" },
  ] },
  // RECETA · el paso que casi todos se saltan
  { phrase: "sin ese paso 3 los pasos 1 y 2 hacen la mitad", kind: "frasecinetica", words: ["Sin", "cemento,", "los", "ladrillos", "se", "mojan."], tone: "warn" },
  // RECETA · la hora (dial cinemático)
  { phrase: "uno en la noche antes de dormir", kind: "hourdial", hour: 22, big: "10", unit: "PM", label: "De noche el cuerpo repara", tone: "teal" },
  // LÍMITES · la banda de honestidad
  { phrase: "ahora los limites", kind: "checklist", title: "Con honestidad — léelo", items: [
    { text: "Enfermedad renal o proteína controlada: pregúntale a TU médico antes de empezar", state: "danger" },
    { text: "Alergia a la res o al pescado: la grenetina sale de ahí — lee la cajita", state: "danger" },
    { text: "Si tomas medicamento, sepáralo dos horas", state: "warn" },
    { text: "Vegetariano o vegano: no es para ti (es de origen animal)", state: "warn" },
    { text: "Tarda de 8 a 12 semanas. No dos. La gente abandona en la tres", state: "done" },
  ] },
  // LÍMITES · el remate
  { phrase: "8 a 12 semanas no 2", kind: "frasecinetica", words: ["Ocho", "a", "doce", "semanas.", "No", "dos."], tone: "teal" },
  // ERROR · el stinger
  { phrase: "y ahora si el error", kind: "errorstinger", number: "01", title: "Tomarlo con azúcar", tone: "warn", eyebrow: "El error" },
  // ERROR · el gasto de doña Amparo
  { phrase: "como 1200 pesos al mes", kind: "bars", title: "Lo que gastaba al mes", unit: "pesos", bars: [
    { label: "Tres botes de farmacia", value: 1200, tone: "danger", note: "$1.200 — de su pensión" },
    { label: "Grenetina + limón", value: 80, winner: true, note: "$80" },
  ] },
  // ERROR · el mecanismo de la glicación
  { phrase: "es un proceso que se llama glicacion", kind: "process", title: "Qué le hace el azúcar a tu colágeno", steps: [
    { title: "Se pega", desc: "el azúcar alta en sangre se adhiere a las proteínas quietas: colágeno y elastina" },
    { title: "Lo endurece", desc: "la fibra deja de ser un resorte y se vuelve un alambre viejo, rígido y amarillento" },
    { title: "Ya no se recicla", desc: "se llaman AGE — productos finales de glicación avanzada. AGE quiere decir edad" },
  ] },
  // ERROR · el remate
  { phrase: "y ese es el error queridos amigos", kind: "frasecinetica", words: ["Con", "una", "mano", "ladrillos.", "Con", "la", "otra,", "azúcar."], tone: "warn" },
  // SOL · el mito final
  { phrase: "y por que no se parecen en nada", kind: "mitoverdad",
    myth: "La piel envejece por los años",
    truth: "Envejece por el SOL acumulado. Misma edad, mismos genes, distinta piel",
    flipPhrase: "la diferencia entera es el sol" },
  // SOL · qué hacer
  { phrase: "entonces un sombrero", kind: "checklist", title: "Lo que evita que te lo tumben", items: [
    { text: "Sombrero de ala ancha, todos los días", state: "done" },
    { text: "Manga larga cuando el sol pega fuerte", state: "done" },
    { text: "Protector solar en cara, cuello Y MANOS — aunque esté nublado", state: "done" },
  ] },
  // RECAP · para guardar
  { phrase: "vamos a recapitular", kind: "guardaesto", title: "Los 3 pasos", tag: "Dr. Federer", prompt: "Guarda esto", items: [
    "1 · UNA CUCHARADA de grenetina sin sabor en medio vaso de agua tibia, todos los días, de preferencia en la noche.",
    "2 · VITAMINA C en la misma toma — medio limón, una guayaba o media naranja. Siempre juntos.",
    "3 · CERO AZÚCAR en esa toma. Y sombra en la cara durante el día.",
  ] },
  // Injerto 3 de guía
  { phrase: "y una lista de las frutas de temporada del mercado", kind: "lowerthird", title: "La guía completa está en la DESCRIPCIÓN", kicker: "Ahí abajo, la primera", desc: "Cantidades por peso, anticoagulantes y las frutas ordenadas por vitamina C real.", tone: "teal" },
  // CIERRE · marca
  { phrase: "un fuerte abrazo", kind: "nametag", name: "Dr. Federer", role: "Más salud, más vida — cada semana, sencillo y de verdad", image: I("endcard") },
];
