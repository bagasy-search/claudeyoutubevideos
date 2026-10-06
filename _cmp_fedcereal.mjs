// _cmp_fedcereal.mjs — COMPONENTES anclados a la FRASE real (como la transcribe Whisper).
// `G(n)` = foto del momento n. Se inyecta desde gen_fedcereal.mjs.
// ⛔ NADA de anclas con números escritos con letra ("señal número uno"): Whisper escribe dígitos
//    y el ancla no matchea. Todas las frases de acá son sin número.
// ⛔ avatarpizarra SOLO en la zona AVATAR (<673.6s); en la zona Fish los labios no sincronizan
//    -> ahí va pizarraexplica (full screen, sin avatar).
export const CMP = (G) => [
// ══ S0 · HOOK ═════════════════════════════════════════════════════════════
{ phrase: "Escuchame bien", kind: "frasecinetica",
  words: [{ t: "NO" }, { t: "TE" }, { t: "DUELE" }, { t: "TE" }, { t: "FALTA" }, { t: "FUERZA", hl: true }], perWord: 14, tone: "teal" },
{ phrase: "La bolsa del mandado", kind: "checklist", title: "Lo que ya estás notando", items: [
  "Te empujás con las manos para salir del sillón",
  "La bolsa la cambiás de mano a mitad de cuadra",
  "El frasco te lo abre otro",
  "Buscás el pasamanos antes de subir el pie",
  "La ropa te queda floja en el brazo",
] },
{ phrase: "Bajás de peso en la balanza", kind: "mitoverdad", image: G("a012"),
  myth: "«La balanza dice que estoy igual»", truth: "Podés perder músculo y ganar grasa a la vez. El número no se mueve; adentro cambió todo.",
  flipPhrase: "Bueno. Eso tiene una explicación" },
{ phrase: "Soy el doctor Federer", kind: "nametag", name: "Dr. Federer", role: "Salud para mayores de 60", image: G("f24") },

// ══ S1 · la promesa ═══════════════════════════════════════════════════════
{ phrase: "Un cereal que en tu casa", kind: "lowerthird", title: "Un cereal que casi nadie tiene", kicker: "TE LO DIGO EN UN RATO",
  desc: "Primero por qué se te va el músculo. Si te doy el nombre ahora, lo vas a preparar mal y lo vas a dejar.", tone: "teal" },

// ══ S2 · Don Aníbal ═══════════════════════════════════════════════════════
{ phrase: "yo levanté paredes enteras", kind: "quote", image: G("a027"),
  text: "Yo levanté paredes enteras. Y no pude levantar veinte kilos de nieta." },
{ phrase: "son los años", kind: "frasecinetica",
  words: [{ t: "SON" }, { t: "LOS" }, { t: "AÑOS" }, { t: "NO", hl: true }, { t: "ALCANZA", hl: true }], perWord: 15, tone: "warn" },
{ phrase: "Desayuno: mate con dos galletitas", kind: "checklist", title: "Un día entero de comida", items: [
  "Mate con dos galletitas de agua",
  "Media mañana: nada",
  "Un plato de fideos con salsa",
  "Mate otra vez, con una tostada",
  "Sopa de sobre y un pedazo de pan",
  "Carne: sólo los domingos",
] },
{ phrase: "Y el hombre no estaba pasando hambre", kind: "callout", image: G("a041"),
  eyebrow: "ESTABA LLENO", figure: "SIN LADRILLOS", caption: "La panza llena no es lo mismo que el material puesto." },

// ══ S3 · qué es el músculo ════════════════════════════════════════════════
{ phrase: "Tu músculo no es un adorno", kind: "pizarraexplica", eyebrow: "PARA QUÉ SIRVE DE VERDAD", title: "Tu músculo hace tres cosas", items: [
  { title: "Es tu motor", sub: "te para de la silla y te sube al colectivo" },
  { title: "Es tu despensa", sub: "de ahí come tu cuerpo cuando te enfermás" },
  { title: "Es tu esponja", sub: "ahí se mete el azúcar de lo que comiste" },
] },
{ phrase: "Cambió el tamaño de la esponja", kind: "ingredientduo", leftImg: G("a051"), rightImg: G("a052") },

// ══ S4 · el mecanismo ═════════════════════════════════════════════════════
{ phrase: "se le pone un nombre", kind: "lowerthird", title: "Sarcopenia", kicker: "CÓMO SE LLAMA",
  desc: "Sarco, carne. Penia, pérdida. Se acelera después de los 60 y casi nadie la nombra.", tone: "warn" },
{ phrase: "Eso tiene nombre y se llama resistencia anabólica", kind: "pizarraexplica", eyebrow: "POR QUÉ NO ALCANZA CON COMER MÁS", title: "El músculo se volvió sordo", items: [
  { title: "A los 25", sub: "comés un huevo y el músculo se prende" },
  { title: "A los 70", sub: "comés lo mismo y no pasa nada" },
  { title: "No es que no quiera", sub: "es que no escucha" },
  { title: "Hay que hablarle fuerte", sub: "en una sola comida, no en migas" },
] },
{ phrase: "Los ladrillos son los aminoácidos", kind: "pizarraexplica", eyebrow: "LA OBRA", title: "Quién es quién adentro tuyo", items: [
  { title: "Los ladrillos", sub: "son los aminoácidos de la proteína" },
  { title: "El capataz", sub: "es uno solo y se llama leucina" },
  { title: "Sin capataz", sub: "los ladrillos quedan apilados en el piso" },
  { title: "A los 75", sub: "el silbato está gastado: hay que mandar más" },
] },
{ phrase: "Es como querer prender un fósforo", kind: "frasecinetica",
  words: [{ t: "DIEZ" }, { t: "VECES" }, { t: "DESPACIO" }, { t: "NO" }, { t: "PRENDE", hl: true }], perWord: 13, tone: "warn" },

// ══ S5 · el agujero de la lisina ══════════════════════════════════════════
{ phrase: "Les falta un aminoácido que se llama lisina", kind: "callout", image: G("a068"),
  eyebrow: "EL LADRILLO QUE FALTA", figure: "LISINA", caption: "Es esencial: tu cuerpo no la fabrica. O la comés, o no la tenés." },
{ phrase: "Trigo, trigo, trigo y trigo", kind: "bars", image: G("a067"), title: "Lisina en el cereal de todos los días", unit: "", bars: [
  { label: "Trigo (pan, galletitas, fideos)", value: 25, tone: "danger", note: "el agujero" },
  { label: "Maíz", value: 28, tone: "danger" },
  { label: "Arroz", value: 38 },
  { label: "Amaranto", value: 100, winner: true, note: "el ladrillo que falta" },
] },

// ══ S6 · la revelación ════════════════════════════════════════════════════
{ phrase: "El cereal se llama amaranto", kind: "guardaesto", title: "AMARANTO", prompt: "Anotá esto", items: [
  "Se vende también como KIWICHA",
  "Semilla entera, no harina",
  "En dietéticas y casas de productos regionales",
] },
{ phrase: "Cortaron los cultivos", kind: "lineatiempo", title: "Quinientos años en el olvido", marks: [
  { label: "Comida de un imperio", sub: "se pagaban tributos con la semilla", image: G("a079") },
  { label: "Prohibido", sub: "cortaron los cultivos y quemaron los campos", image: G("a081"), alert: true },
  { label: "Yuyo del camino", sub: "creció solo al costado de la ruta", image: G("a082") },
  { label: "Comida de astronauta", sub: "estudiado por lo eficiente que es", image: G("a084") },
] },
{ phrase: "es de los poquísimos cereales del planeta", kind: "frasecinetica",
  words: [{ t: "TIENE" }, { t: "LA" }, { t: "LISINA", hl: true }, { t: "QUE" }, { t: "LOS" }, { t: "OTROS" }, { t: "NO" }], perWord: 12, tone: "teal" },

// ══ S7 · los números ══════════════════════════════════════════════════════
{ phrase: "Cien gramos de amaranto crudo", kind: "bars", image: G("a087"), title: "Proteína por cada 100 gramos", unit: "g", bars: [
  { label: "Arroz blanco", value: 7, tone: "danger" },
  { label: "Maíz", value: 9 },
  { label: "Trigo", value: 10, note: "y con el agujero de lisina" },
  { label: "Avena", value: 12 },
  { label: "Amaranto", value: 14, winner: true },
] },
{ phrase: "tienen más calcio que un vaso de leche", kind: "stat", image: G("a091"), value: 100, unit: "g", label: "de amaranto tienen más calcio que un vaso de leche", tone: "teal" },
{ phrase: "Y una última cosa", kind: "checklist", title: "Lo que además trae", items: [
  "Hierro, con la anemia que se ve a esta edad",
  "Calcio, más que un vaso de leche",
  "Magnesio, el que relaja el músculo",
  "Fibra, más que la avena",
  "Cero gluten",
] },

// ══ S8 · las cinco señales (auto-diagnóstico) ═════════════════════════════
{ phrase: "Sentate en una silla común", kind: "process", title: "La prueba de la silla", steps: [
  { title: "Sentate en el borde", desc: "silla sin apoyabrazos, espalda derecha" },
  { title: "Parate sin usar las manos", desc: "sin apoyarte en las rodillas ni en la mesa" },
  { title: "Mirá si te hamacás", desc: "hamacarse para tomar impulso ya es la señal" },
] },
{ phrase: "El apretón de manos", kind: "callout", image: G("a101"),
  eyebrow: "LA MANO ES LA VENTANITA", figure: "EL APRETÓN", caption: "El frasco, la canilla dura, escurrir el trapo: la mano habla de todo el cuerpo." },
{ phrase: "Cuando cruzás una avenida ancha", kind: "lowerthird", title: "¿Te alcanza el semáforo?", kicker: "SEÑAL DE VELOCIDAD",
  desc: "Si tenés que apurar el último tramo, muchas veces no es el semáforo: es la velocidad de marcha.", tone: "warn" },
{ phrase: "Los anillos que te giran solos en el dedo", kind: "mitoverdad", image: G("a108"),
  myth: "«La balanza no se movió, estoy igual»", truth: "Dos kilos menos de músculo y dos más de grasa dan el mismo número. Y no es lo mismo.",
  flipPhrase: "Si perdés dos kilos de músculo" },
{ phrase: "Que hayas empezado a evitar cosas", kind: "frasecinetica",
  words: [{ t: "EL" }, { t: "MIEDO" }, { t: "LLEGA" }, { t: "ANTES" }, { t: "QUE" }, { t: "LA" }, { t: "CAÍDA", hl: true }], perWord: 13, tone: "warn" },
{ phrase: "lo tengo ordenado paso por paso en mi guía", kind: "guidecta", kicker: "PARA TENERLO ESCRITO",
  title: "La guía completa de la salud después de los 60",
  desc: "Las cantidades exactas, las señales para chequearte y la progresión del ejercicio.",
  cover: G("lam5"), qr: "qr_drfederer.png", domain: "archivos-federer.vercel.app",
  scanTitle: "Está en la descripción", scanSub: "primer enlace" },

// ══ S9 · los seis errores ═════════════════════════════════════════════════
{ phrase: "La harina de amaranto se pone rancia", kind: "callout", image: G("a113"),
  eyebrow: "NO LA COMPRES HECHA HARINA", figure: "SEMILLA ENTERA", caption: "La cáscara protege el aceite de adentro. Molé sólo lo de la semana." },
{ phrase: "hay una moda ahora de tirar semillas crudas", kind: "pizarraexplica", eyebrow: "POR QUÉ NO SE COME CRUDO", title: "Lo que hace el ácido fítico", items: [
  { title: "Se pega al hierro", sub: "también al calcio y al zinc" },
  { title: "No los deja pasar", sub: "no llegan a tu sangre" },
  { title: "La ironía", sub: "comés la semilla por eso… y se va al baño" },
  { title: "Se cocina siempre", sub: "o se infla al calor. Crudo no" },
] },
{ phrase: "Poné el amaranto en un colador finito", kind: "process", title: "El paso que casi nadie hace y es gratis", steps: [
  { title: "Colador de té, no el común", desc: "el grano es tan chico que se escapa" },
  { title: "Agua fría un minuto", desc: "moviéndolo con la mano" },
  { title: "Hasta que el agua salga clara", desc: "lo turbio es la saponina, la del gusto amargo" },
] },
{ phrase: "El amaranto no se cocina como el arroz", kind: "lowerthird", title: "Más agua que para el arroz", kicker: "LA PROPORCIÓN EXACTA ESTÁ EN LA DESCRIPCIÓN",
  desc: "Fuego bajo, tapado y sin revolver todo el tiempo. Revolver de más es lo que lo vuelve una goma.", tone: "teal" },
{ phrase: "tostá la semilla seca en la olla", kind: "process", title: "Dos cosas que le cambian el sabor", steps: [
  { title: "Tostala seca un minuto", desc: "sin nada, hasta que huela a nuez" },
  { title: "Cocinala con caldo", desc: "casero, de pollo o verdura, con poca sal" },
  { title: "El que se deja no sirve", desc: "por más lisina que tenga" },
] },
{ phrase: "El amaranto no reemplaza a la carne", kind: "mitoverdad", image: G("a127"),
  myth: "«Con esto ya no necesito carne»", truth: "No la reemplaza. Viene a llenar el hueco donde hoy hay fideos, puré y pan: ahí no hay nada.",
  flipPhrase: "Sirve como refuerzo y sirve como puente" },
{ phrase: "La gente le pone una cucharadita al yogur", kind: "errorstinger", number: "5", eyebrow: "ERROR", title: "Una cucharadita es decorativa" },
{ phrase: "La mayoría de la gente grande hace todo lo contrario", kind: "checklist", title: "El día dado vuelta", items: [
  "Desayuna casi nada",
  "Almuerza poco",
  "Cena la comida más grande del día",
  "Y a la noche el cuerpo ya no construye",
  "Viene de diez o doce horas sin comer… y recibe dos galletitas",
] },
{ phrase: "comer la proteína y no darle al músculo la orden", kind: "guardaesto", title: "EL ERROR QUE ARRUINA TODO", prompt: "No te lo saltees", items: [
  "Comer la proteína y no pedirle nada al músculo",
  "Es comprar los ladrillos y no llamar al albañil",
  "El cuerpo no mantiene lo que no se usa",
] },
{ phrase: "La comida trae el material", kind: "frasecinetica",
  words: [{ t: "LA" }, { t: "COMIDA" }, { t: "TRAE" }, { t: "EL" }, { t: "MATERIAL" }, { t: "EL" }, { t: "MOVIMIENTO" }, { t: "DA" }, { t: "LA" }, { t: "ORDEN", hl: true }], perWord: 11, tone: "teal" },

// ══ S10 · las tres preparaciones ══════════════════════════════════════════
{ phrase: "Ponés una olla o una sartén de fondo grueso", kind: "process", title: "El amaranto inflado", steps: [
  { title: "Olla bien caliente y seca", desc: "sin nada de aceite; si está tibia se quema" },
  { title: "Una cucharada por vez", desc: "y tapá: suena como una lluvia" },
  { title: "Sacalo apenas para el ruido", desc: "a un plato frío, o se pone amargo" },
] },
{ phrase: "Amaranto cocido en caldo o en leche", kind: "recetaescena", title: "La papilla de la mañana", steps: [
  { num: "1", image: G("a154"), title: "Cocinalo despacio", desc: "en caldo o en leche, hasta que quede cremoso" },
  { num: "2", image: G("a155"), title: "El huevo adentro", desc: "batido, con la olla ya fuera del fuego" },
  { num: "3", image: G("a156"), title: "O leche en polvo", desc: "una cucharada colmada, lo más barato" },
  { num: "4", image: G("a157"), title: "Si lo hacés dulce", desc: "yogur natural y nueces picadas" },
] },
{ phrase: "Juntamos el cereal", kind: "pizarraexplica", eyebrow: "POR QUÉ ESTE PLATO SÍ", title: "La jugada completa", items: [
  { title: "El cereal", sub: "pone la lisina que le falta al trigo" },
  { title: "El huevo", sub: "pone la leucina, que es el capataz" },
  { title: "Juntos", sub: "llegan al umbral que despierta al músculo" },
  { title: "Solo, no alcanza", sub: "con el huevo adentro, sí" },
] },
{ phrase: "Esta es para el hombre o la mujer que dice", kind: "checklist", title: "Dónde se esconde", items: [
  "Dos cucharadas a la sopa, veinte minutos antes de apagar",
  "En el relleno de las milanesas de verdura",
  "Mezclado con la harina del pan casero o el budín",
  "En el puré",
  "En la torta de manzana de la tarde",
] },

// ══ S11 · los cuatro compañeros ═══════════════════════════════════════════
{ phrase: "si a mí me obligaran a elegir un solo alimento", kind: "callout", image: G("a162"),
  eyebrow: "SI TUVIERA QUE ELEGIR UNO", figure: "EL HUEVO", caption: "La mejor proteína que existe, la más barata, y lista en tres minutos." },
{ phrase: "Lentejas, garbanzos, porotos", kind: "pizarraexplica", eyebrow: "POR QUÉ EXISTE EN TODAS LAS CULTURAS", title: "El cereal y la legumbre se completan", items: [
  { title: "A la legumbre", sub: "le sobra lisina" },
  { title: "Al cereal", sub: "le sobra el aminoácido que a ella le falta" },
  { title: "Se completan", sub: "arroz con lentejas, porotos con fideos" },
  { title: "En todas las culturas", sub: "nadie se puso de acuerdo: lo descubrieron comiendo" },
] },
{ phrase: "Y no es una metáfora", kind: "lowerthird", title: "Sol en los brazos y en las piernas", kicker: "COMPAÑERO Nº3",
  desc: "A la mañana o a la tardecita. La vitamina D es la que mete el calcio en el hueso y participa en la fuerza.", tone: "teal" },
{ phrase: "El músculo es en su mayor parte agua", kind: "callout", image: G("a169"),
  eyebrow: "CON LOS AÑOS SE PIERDE LA SED", figure: "TOMÁ IGUAL", caption: "El cuerpo deja de avisar. De día aunque no tengas ganas; menos a la tardecita." },

// ══ S12 · el ejercicio ════════════════════════════════════════════════════
{ phrase: "Agarrá una silla firme", kind: "process", title: "Sentarse y pararse", steps: [
  { title: "Sentate en el borde", desc: "pies apoyados, brazos cruzados en el pecho" },
  { title: "Subí sin manos", desc: "empujando con las piernas" },
  { title: "Bajá contando hasta tres", desc: "la bajada es la que más le pide al cuerpo" },
] },
{ phrase: "Empezá con cinco", kind: "checklist", title: "La progresión", items: [
  "Arrancá con cinco",
  "Cuando salgan cómodas, ocho",
  "Después diez",
  "Y después dos series de diez con un minuto en el medio",
  "Enganchalo con algo que ya hacés todos los días",
] },
{ phrase: "Y si no podés pararte sin manos", kind: "lowerthird", title: "Todos empezamos de donde podemos", kicker: "SI NO TE SALE",
  desc: "Almohadón en la silla para estar más alto y una sola mano apoyada. Con las semanas se sacan los dos.", tone: "teal" },

// ══ S13 · las tres preguntas ══════════════════════════════════════════════
{ phrase: "porque el grano se hincha bastante", kind: "callout", image: G("a181"),
  eyebrow: "¿ES CARO?", figure: "RINDE", caption: "Con poca semilla sale un plato grande. Es comida, no un suplemento de gimnasio." },
{ phrase: "El amaranto tiene bastante fibra y bastante proteína", kind: "mitoverdad", image: G("a182"),
  myth: "«Soy diabético, entonces no»", truth: "En general sí, y suele ser mejor opción que el pan blanco. La cantidad tuya la dice tu médico.",
  flipPhrase: "Pero sigue siendo un cereal" },
{ phrase: "Mitad avena, mitad amaranto", kind: "ingredientduo", leftImg: G("a089"), rightImg: G("a184") },

// ══ S14 · el escudo de honestidad ═════════════════════════════════════════
{ phrase: "Nada de esto reemplaza a tu médico", kind: "checklist", title: "Cuándo NO es cuestión de comida", tone: "warn", items: [
  "Si bajás de peso sin proponértelo",
  "Si la debilidad es de un lado solo",
  "Si te empezaste a caer, aunque no te hayas roto nada",
  "Si tenés problemas de riñón, antes de subir la proteína",
  "Si tomás anticoagulantes o tenés alguna condición particular",
] },
{ phrase: "Una caída no es un accidente sin importancia", kind: "frasecinetica",
  words: [{ t: "UNA" }, { t: "CAÍDA" }, { t: "ES" }, { t: "UN" }, { t: "AVISO", hl: true }], perWord: 15, tone: "warn" },

// ══ S15 · los dos grupos ══════════════════════════════════════════════════
{ phrase: "Vos te parás de la silla sin manos", kind: "checklist", title: "Grupo uno: proteger lo que tenés", items: [
  "Te parás sin manos y abrís los frascos",
  "Recuperar cuesta el triple que mantener",
  "Desayuno con proteína",
  "Tus cinco sentadillas de silla",
  "Y seguí con tu vida",
] },
{ phrase: "Vos ya contaste tres", kind: "checklist", title: "Grupo dos: empezar hoy", tone: "warn", items: [
  "Sacá turno con tu médico",
  "Desayuno con proteína desde mañana",
  "Cinco sentadillas de silla por día",
  "No esperes sentir algo en tres días",
  "El músculo responde a cualquier edad",
] },
{ phrase: "La fuerza empieza a cambiar antes que el tamaño", kind: "lineatiempo", title: "Cuánto tarda, sin vender humo", marks: [
  { label: "Dos o tres semanas", sub: "te parás de la silla con menos esfuerzo" },
  { label: "Dos o tres meses", sub: "el músculo que se ve y se toca" },
  { label: "Seis meses o más", sub: "el cambio que te notan los demás" },
] },
{ phrase: "los seis meses van a pasar igual", kind: "frasecinetica",
  words: [{ t: "VAN" }, { t: "A" }, { t: "PASAR" }, { t: "IGUAL", hl: true }], perWord: 16, tone: "teal" },

// ══ S16 · cierre ══════════════════════════════════════════════════════════
{ phrase: "Don Aníbal hizo dos cosas", kind: "checklist", title: "Lo que hizo, y nada más", items: [
  "Cambió el desayuno: papilla con el huevo adentro",
  "Todos los días, sin faltar",
  "Sentadillas de silla mientras se calentaba el agua",
  "Al principio le salían tres, con una mano apoyada",
  "A la tercera semana llamó enojado. Le dije: siga",
] },
{ phrase: "Así que hoy, cuando termine el video", kind: "guardaesto", title: "HACÉ UNA SOLA COSA", prompt: "Hoy", items: [
  "Mañana el desayuno lleva proteína",
  "O cinco veces sentarte y pararte de la silla",
  "Una sola. Y mañana esa misma",
] },
{ phrase: "Todo esto, las cantidades exactas", kind: "guidecta", kicker: "LO QUE VISTE, ESCRITO",
  title: "La guía completa de la salud después de los 60",
  desc: "Las cantidades de cada preparación, las combinaciones y la progresión semana por semana. Y la lista de señales de alerta.",
  cover: G("lam1"), qr: "qr_drfederer.png", domain: "archivos-federer.vercel.app",
  scanTitle: "Está en la descripción", scanSub: "primer enlace" },
];
