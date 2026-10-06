// Plan visual determinista — job 72 / slug v68a7e4bfb40
// "7 Ejercicios que Reactivan tu Testosterona Después de los 40" · kit federer-fluid
// Un solo Director Pass; este script materializa esa decisión sin reabrir dirección.
import {readFileSync, writeFileSync, mkdirSync} from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = "v68a7e4bfb40";
const JOB_ID = 72;
const TARGET_MOMENTS = 172;

const AVATAR_ID = "bfab9e26d7664d30b011447ff9e40932";
const LOOK_ID = "87fad00eb96d4415967dbfa7b6050b3f";
const VOICE_ID = "a1dab6b543dd494589903d61526d9966";

const wordsOf = (v) => String(v || "").match(/[\p{L}\p{N}'-]+/gu) || [];
const STOP = new Set("a al algo an and are as at con de del el en es esa ese esta este for from la las lo los of on o para por que se sin sobre the to un una y with".split(" "));
const norm = (v) => wordsOf(String(v || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase())
  .map((w) => w.replace(/[^a-z0-9]/g, "")).filter(Boolean);
const meaningful = (v) => [...new Set(norm(v).filter((w) => w.length >= 3 && !STOP.has(w)))];

const narrationPath = path.join(ROOT, "public", "guiones", `${SLUG}.txt`);
const narrationRaw = readFileSync(narrationPath, "utf8").replace(/^﻿/, "");
const NARRATION_NORM = norm(narrationRaw).join(" ");
const PARAS = narrationRaw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  .map((text, i) => ({n: i + 1, text, tokens: wordsOf(text).filter((t) => norm(t).length)}));

// ── Secciones: rango de párrafos, consultas de stock (inglés, indexado real) y
// acciones del presentador aprobado. Metadatos internos, nunca texto en pantalla.
const SECTIONS = [
  {id: "s01-apertura", title: "Apertura", paras: [1, 4],
    stock: ["older man standing up from a sturdy chair in living room", "bottle of testosterone booster capsules on pharmacy shelf", "senior man doing bodyweight squat at home daylight", "kitchen timer and notebook on table close up", "tired older man sitting on edge of bed at dawn", "man carrying two grocery bags up a staircase"],
    presenter: [
      {action: "se levanta de una silla firme sin usar las manos y vuelve a sentarse despacio", location: "sala de estar de casa", framing: "plano entero lateral", props: ["silla firme"]},
      {action: "aparta un frasco de cápsulas y apoya la mano sobre el respaldo de la silla", location: "sala de estar", framing: "plano medio, manos en cuadro", props: ["frasco de cápsulas", "silla"]},
      {action: "levanta dos dedos y luego señala un reloj de cocina sobre la mesa", location: "mesa de comedor", framing: "plano medio corto", props: ["reloj de cocina"]}]},
  {id: "s02-que-significa", title: "Qué significa reactivar", paras: [5, 7],
    stock: ["man measuring his waist with a tape measure at home", "empty whisky glass beside bed at night", "morning blood draw at clinic phlebotomy close up", "laboratory report with hormone values on desk", "older man asleep with bedside lamp still on", "doctor talking with older male patient in office"],
    presenter: [
      {action: "se mide la cintura con una cinta métrica y mira el número", location: "dormitorio de casa", framing: "plano medio", props: ["cinta métrica"]},
      {action: "sostiene una hoja de resultados de laboratorio y señala una línea con el dedo", location: "escritorio de madera", framing: "plano medio, hoja en cuadro", props: ["hoja de laboratorio"]},
      {action: "abre una persiana dejando entrar la luz de la mañana junto al tubo de análisis", location: "cocina doméstica", framing: "plano medio corto", props: ["persiana", "tubo de análisis"]}]},
  {id: "s03-por-que-musculo", title: "Por qué el músculo manda", paras: [8, 11],
    stock: ["muscle fiber medical illustration on dark background", "older man climbing stairs holding handrail", "senior man lifting a box from the floor", "hand gripping a shopping bag handle close up", "glucose meter reading on kitchen table", "row of empty supplement jars on a shelf"],
    presenter: [
      {action: "empuja con ambas manos contra una pared manteniendo la espalda recta", location: "pasillo de la casa", framing: "plano entero lateral", props: ["pared"]},
      {action: "levanta una caja del suelo doblando cadera y rodillas y la apoya en la mesa", location: "sala de estar", framing: "plano entero", props: ["caja de cartón"]},
      {action: "deja un frasco de cápsulas vacío sobre la mesa y aprieta el puño mostrando el antebrazo", location: "mesa de comedor", framing: "plano medio corto", props: ["frasco vacío"]}]},
  {id: "s04-silla", title: "Ejercicio uno: la silla", paras: [12, 19],
    stock: ["sturdy wooden chair against a wall in living room", "older man sitting down slowly onto a chair", "senior man crossing arms over chest while standing up", "light backpack held against the chest of an older man", "notebook page with handwritten repetition counts", "close up of a knee joint anatomy illustration dark"],
    presenter: [
      {action: "se sienta cerca del borde de una silla apoyada contra la pared y separa los pies", location: "sala de estar", framing: "plano entero lateral", props: ["silla firme"]},
      {action: "baja hacia la silla contando tres segundos y frena el peso con los muslos", location: "sala de estar", framing: "plano entero lateral", props: ["silla"]},
      {action: "cruza los brazos sobre el pecho y se levanta sin ayuda de las manos", location: "sala de estar", framing: "plano medio, torso y silla en cuadro", props: ["silla"]},
      {action: "anota con lapicera el número de repeticiones en un cuaderno junto a la silla", location: "mesa de comedor", framing: "plano medio, cuaderno en cuadro", props: ["cuaderno", "lapicera"]}]},
  {id: "s05-bisagra", title: "Ejercicio dos: bisagra de cadera", paras: [20, 27],
    stock: ["man hinging at the hips beside a plain wall", "backpack filled with books on the floor", "person picking up a shopping bag from the ground", "moving a heavy potted plant in a garden", "spine anatomy illustration on dark background", "suitcase being lifted onto a bed"],
    presenter: [
      {action: "lleva la cadera hacia atrás hasta tocar la pared con los glúteos y vuelve a erguirse", location: "pasillo de la casa", framing: "plano entero lateral", props: ["pared"]},
      {action: "sostiene una mochila con ambas manos y la deja bajar cerca de las piernas", location: "sala de estar", framing: "plano entero lateral", props: ["mochila con libros"]},
      {action: "guarda dos libros dentro de una mochila y cierra el cierre", location: "mesa de comedor", framing: "primer plano de manos y mochila", props: ["mochila", "libros"]}]},
  {id: "s06-flexion", title: "Ejercicio tres: flexión inclinada", paras: [28, 33],
    stock: ["man doing a wall push up in a hallway", "hands placed on a kitchen countertop edge", "push up against a low sturdy bench indoors", "older man pushing open a heavy door", "senior couple walking on a park path", "elbow and shoulder joint anatomy illustration dark"],
    presenter: [
      {action: "apoya las manos en la encimera algo más abiertas que los hombros y acerca el pecho", location: "cocina doméstica", framing: "plano entero lateral", props: ["encimera firme"]},
      {action: "aleja los pies un paso de la pared para aumentar la dificultad de la flexión", location: "pasillo de la casa", framing: "plano entero lateral", props: ["pared"]},
      {action: "empuja una puerta pesada con la palma abierta y la sostiene", location: "entrada de la casa", framing: "plano medio", props: ["puerta"]}]},
  {id: "s07-remo", title: "Ejercicio cuatro: remo con banda", paras: [34, 38],
    stock: ["resistance band anchored to a door frame", "cracked worn elastic band close up macro", "senior man rowing with an elastic band indoors", "shoulder blades and upper back anatomy illustration dark", "older man hunched over a phone on the sofa", "coloured resistance bands rolled on a table"],
    presenter: [
      {action: "revisa una banda elástica estirándola frente a la luz para buscar grietas", location: "sala de estar", framing: "primer plano de manos y banda", props: ["banda elástica"]},
      {action: "fija la banda a un punto sólido y retrocede hasta sentir tensión suave", location: "sala de estar", framing: "plano entero", props: ["banda elástica", "anclaje"]},
      {action: "lleva los codos hacia atrás acercando las manos a las costillas y regresa despacio", location: "sala de estar", framing: "plano medio", props: ["banda elástica"]}]},
  {id: "s08-hormonas-publicidad", title: "Hormonas, publicidad y medicina", paras: [39, 42],
    stock: ["advertisement of a muscular young man in a shop window", "jar of herbal blend capsules on a counter", "pharmacist explaining a medicine interaction to an older patient", "prescription pad and pen on a doctor desk", "blister packs of medication on a bedside table", "medical consultation room with empty chair"],
    presenter: [
      {action: "toma un frasco de mezcla de hierbas, lo gira y lo deja fuera de cuadro", location: "mesa de comedor", framing: "plano medio corto", props: ["frasco de hierbas"]},
      {action: "apoya la palma sobre la mesa y niega con la cabeza ante una publicidad impresa", location: "escritorio de madera", framing: "plano medio", props: ["folleto publicitario"]},
      {action: "señala una hoja de indicaciones médicas apoyada junto a un pastillero", location: "escritorio de madera", framing: "plano medio, hoja en cuadro", props: ["hoja médica", "pastillero"]}]},
  {id: "s09-escalon", title: "Ejercicio cinco: el escalón", paras: [43, 48],
    stock: ["first step of a staircase with a wooden handrail", "older man stepping up onto a low step at home", "hand holding a stair handrail close up", "passenger stepping into a city bus", "uneven pavement kerb on a street", "knee alignment biomechanics illustration dark background"],
    presenter: [
      {action: "coloca un pie completo sobre el primer escalón y sube empujando con esa pierna", location: "escalera de la casa", framing: "plano entero lateral", props: ["escalón", "baranda"]},
      {action: "baja del escalón de forma controlada sujetándose apenas de la baranda", location: "escalera de la casa", framing: "plano entero", props: ["baranda"]},
      {action: "suelta poco a poco la baranda y mantiene el equilibrio sobre el escalón", location: "escalera de la casa", framing: "plano medio", props: ["baranda"]}]},
  {id: "s10-granjero", title: "Ejercicio seis: paseo cargado", paras: [49, 53],
    stock: ["two heavy shopping bags standing on a kitchen floor", "man walking down a hallway carrying two containers", "hand opening a tight jar lid close up", "grip strength dynamometer being squeezed", "carrying groceries from car to house", "hand holding a hammer and tools on a workbench"],
    presenter: [
      {action: "toma dos bolsas resistentes de peso parecido y camina por un pasillo despejado", location: "pasillo de la casa", framing: "plano entero", props: ["dos bolsas cargadas"]},
      {action: "abre un frasco de tapa dura con la mano y lo apoya en la mesada", location: "cocina doméstica", framing: "primer plano de manos y frasco", props: ["frasco"]},
      {action: "baja el peso de una bolsa al notar que el torso se inclina", location: "pasillo de la casa", framing: "plano medio", props: ["bolsa cargada"]}]},
  {id: "s11-progresion", title: "El principio de progresión", paras: [54, 55],
    stock: ["stack of books beside a backpack on the floor", "stopwatch held in hand close up", "notebook with a simple weekly training grid", "single book being added onto a small pile", "hands adjusting the foot position on a floor mat", "sunlit living room with training equipment tidy"],
    presenter: [
      {action: "añade un solo libro a la mochila y vuelve a cerrarla", location: "sala de estar", framing: "primer plano de manos y mochila", props: ["mochila", "libro"]},
      {action: "marca con lapicera una repetición más en la grilla del cuaderno", location: "mesa de comedor", framing: "plano medio, cuaderno en cuadro", props: ["cuaderno", "lapicera"]},
      {action: "mueve los pies cinco centímetros y comprueba la nueva inclinación", location: "pasillo de la casa", framing: "plano entero lateral", props: ["pared"]}]},
  {id: "s12-intervalos", title: "Ejercicio siete: intervalos", paras: [56, 59],
    stock: ["older man walking briskly on a park path", "stationary bicycle in a bright living room", "gentle uphill road in a residential neighbourhood", "stopwatch showing thirty seconds close up", "older man breathing calmly after light exercise", "quiet street at sunrise with long shadows"],
    presenter: [
      {action: "camina a paso vivo por una vereda despejada mirando hacia delante", location: "vereda del barrio", framing: "plano entero lateral en travelling", props: []},
      {action: "pedalea en una bicicleta fija y afloja el ritmo mirando el reloj", location: "sala de estar", framing: "plano medio", props: ["bicicleta fija", "reloj"]},
      {action: "levanta la mano abierta señalando siete con los dedos mientras camina despacio", location: "vereda del barrio", framing: "plano medio corto", props: []}]},
  {id: "s13-intervalos-seguridad", title: "Intervalos: límites de seguridad", paras: [60, 63],
    stock: ["heart and lungs medical illustration on dark background", "older man holding his chest sitting on a bench", "blood pressure monitor on a kitchen table", "glucose test strip and lancet on a table", "cardiology consultation with an older patient", "medication box with heart rate warning label"],
    presenter: [
      {action: "se detiene de golpe, apoya la mano en el pecho y se sienta en un banco", location: "plaza del barrio", framing: "plano medio", props: ["banco"]},
      {action: "coloca un tensiómetro en el brazo y observa la lectura", location: "mesa de comedor", framing: "plano medio, brazo y aparato en cuadro", props: ["tensiómetro"]},
      {action: "levanta la palma en gesto de alto frente a un cronómetro que corre", location: "sala de estar", framing: "plano medio corto", props: ["cronómetro"]}]},
  {id: "s14-armar-semana", title: "Armar la semana", paras: [64, 68],
    stock: ["paper wall calendar with two days circled", "living room set up with chair band and backpack", "hand writing on a weekly planner page", "older man resting between sets sitting calmly", "exhaling breath fogging a cold window", "kitchen table with water glass and notebook"],
    presenter: [
      {action: "marca con lapicera dos días no consecutivos en un calendario de pared", location: "cocina doméstica", framing: "plano medio, calendario en cuadro", props: ["calendario", "lapicera"]},
      {action: "ordena en el suelo la silla, la banda y la mochila antes de empezar", location: "sala de estar", framing: "plano entero", props: ["silla", "banda", "mochila"]},
      {action: "exhala de forma marcada durante el esfuerzo y luego inhala al regresar", location: "sala de estar", framing: "plano medio corto", props: []}]},
  {id: "s15-error", title: "El error incómodo", paras: [69, 72],
    stock: ["empty plate and clock showing late night", "alarm clock showing five hours of sleep", "exhausted man sitting on the floor after training", "untouched sneakers by the door gathering dust", "calendar with too many training marks in a row", "man rubbing a sore shoulder at home"],
    presenter: [
      {action: "aparta un plato casi vacío y señala el reloj que marca la madrugada", location: "cocina doméstica", framing: "plano medio", props: ["plato", "reloj"]},
      {action: "se sienta agotado en el borde de la cama con las zapatillas todavía puestas", location: "dormitorio", framing: "plano medio", props: ["zapatillas"]},
      {action: "tacha con lapicera dos sesiones seguidas del calendario y deja un día libre", location: "cocina doméstica", framing: "plano medio, calendario en cuadro", props: ["calendario", "lapicera"]}]},
  {id: "s16-recuperacion", title: "Recuperación real", paras: [73, 77],
    stock: ["bedroom with curtains drawn for regular sleep schedule", "plate with balanced protein and vegetables", "kidney anatomy medical illustration dark background", "man snoring in bed at night", "sleep study sensors attached to a patient", "wine glass and bottle on a kitchen counter at night"],
    presenter: [
      {action: "sirve una porción de proteína y verduras en un plato y lo apoya en la mesa", location: "cocina doméstica", framing: "plano medio", props: ["plato", "proteína", "verduras"]},
      {action: "ajusta un despertador y apaga la luz del velador a la misma hora", location: "dormitorio", framing: "plano medio corto", props: ["despertador", "velador"]},
      {action: "aparta una copa de vino de la mesada y acerca un vaso de agua", location: "cocina doméstica", framing: "plano medio, manos en cuadro", props: ["copa de vino", "vaso de agua"]}]},
  {id: "s17-limites", title: "Lo que la rutina no promete", paras: [78, 79],
    stock: ["pituitary gland medical illustration on dark background", "cpap machine on a bedside table", "older man carrying groceries into the kitchen easily", "backpack being lifted with one hand", "step of a staircase seen from below", "medical file folder on a desk"],
    presenter: [
      {action: "levanta la mochila con una mano y muestra que se siente más liviana", location: "sala de estar", framing: "plano medio", props: ["mochila"]},
      {action: "apoya una carpeta médica sobre la mesa y la deja abierta", location: "escritorio de madera", framing: "plano medio, carpeta en cuadro", props: ["carpeta médica"]},
      {action: "sube el primer escalón sin apoyarse y se detiene con gesto sereno", location: "escalera de la casa", framing: "plano entero", props: ["escalón"]}]},
  {id: "s18-cierre", title: "Accionable y cierre", paras: [80, 88],
    stock: ["handwritten training log on a kitchen table", "chair band and backpack ready side by side", "smartphone showing a comments section on screen", "older man writing in a notebook by a window", "sunlit living room with a chair and a rolled mat", "wall and chair prepared for a balance test"],
    presenter: [
      {action: "escribe tres datos en una libreta: repeticiones, resistencia y sensación", location: "mesa de comedor", framing: "plano medio, libreta en cuadro", props: ["libreta", "lapicera"]},
      {action: "prepara sobre el suelo la silla, la mochila liviana y la banda en buen estado", location: "sala de estar", framing: "plano entero", props: ["silla", "mochila", "banda"]},
      {action: "apoya las manos en el respaldo de la silla y mira a cámara con gesto sereno", location: "sala de estar", framing: "plano medio corto", props: ["silla"]}]},
];

// ── Los 42 explainers del Director Pass. `para` fija el tramo hablado;
// `copy`/`sub` son texto final en pantalla; `visual`/`detail` son metadatos.
const HEROES = [
  {para: 3, fed: "FedStat", lf: "dose-two-sessions", value: "2", copy: "Dos sesiones de fuerza por semana cambian su capacidad", sub: "Veinte a cuarenta minutos por sesión alcanzan",
    visual: "Semana en siete columnas donde dos se elevan con una marca de fuerza y una barra de capacidad sube detrás", detail: "Cifra grande con la semana en profundidad, sin tarjeta genérica"},
  {para: 4, fed: "FedChecklist", lf: "promise-ledger", copy: "La trampa: menos energía, peor sueño y más dolor", sub: "Al final, el error y la prueba de cuarenta y ocho horas",
    items: ["Menos energía", "Peor sueño", "Más dolor", "Rutina abandonada"],
    visual: "Cuatro pesos que hunden lentamente una barra mientras al fondo espera un reloj de cuarenta y ocho horas", detail: "Promesa abierta que el video paga antes del cierre"},
  {para: 5, fed: "FedMolecule", lf: "multifactor-decline", copy: "La edad no actúa sola sobre sus niveles", sub: "Grasa abdominal, inactividad, sueño, alcohol y medicamentos",
    visual: "Una línea descendente central con cinco entradas laterales que empujan la pendiente, cada una con su propia luz", detail: "Mecanismo multifactorial, nunca una sola causa"},
  {para: 6, fed: "FedChecklist", lf: "differential-symptoms", copy: "Sentirse cansado no demuestra que exista testosterona baja", sub: "Deseo, ánimo, concentración y fuerza tienen otras causas",
    items: ["Pérdida de deseo sexual", "Ánimo deprimido", "Dificultad para concentrarse", "Reducción de fuerza"],
    visual: "Un síntoma central del que se abren cuatro rutas causales hacia atrás, todas encendidas a la vez", detail: "Diagnóstico diferencial, no autodiagnóstico"},
  {para: 7, fed: "FedStep", lf: "diagnostic-protocol", copy: "Normalmente se mide por la mañana y se confirma", sub: "Síntomas compatibles más análisis en condiciones apropiadas",
    step: 1, total: 2,
    visual: "Tubo de extracción con luz de mañana temprana y una segunda extracción que confirma la primera cifra", detail: "Protocolo clínico, dos tiempos"},
  {para: 8, fed: "FedMolecule", lf: "tension-order", copy: "El músculo es un tejido activo que recibe una orden", sub: "Conserve esta fuerza porque todavía la necesitamos",
    visual: "Fibra muscular que recibe tensión desde una carga y responde encendiendo una señal que viaja hacia el fondo", detail: "Mecanismo de señal mecánica, sin promesa hormonal"},
  {para: 10, fed: "FedBeforeAfter", lf: "capsule-vs-capacity", copy: "Una cápsula se termina; una capacidad se queda", sub: "Mientras usted siga utilizándola",
    image_b: "older man carrying two heavy shopping bags with steady posture",
    visual: "A la izquierda frascos que se vacían y se reemplazan; a la derecha la misma persona sosteniendo la carga sin ayuda", detail: "Comparación real del argumento central del video"},
  {para: 11, fed: "FedWhiteboard", lf: "transient-vs-basal", copy: "Una sesión genera cambios transitorios, no un aumento permanente", sub: "El beneficio confiable está en la suma",
    visual: "Pizarra escrita a mano con un pico que sube y vuelve a bajar, y debajo una línea base que apenas se mueve", detail: "Mecanismo dibujado paso a paso, estilo explicativo"},
  {para: 12, fed: "FedChapter", lf: "exercise-one-open", copy: "Ejercicio uno: levantarse de una silla", sub: "Parece demasiado sencillo y casi todos lo subestiman",
    visual: "La silla entra desde fuera de cuadro y queda contra la pared mientras el fondo se oscurece en capas", detail: "Bisagra de capítulo, sin número sobreimpreso en la silla"},
  {para: 13, fed: "FedStep", lf: "chair-setup", copy: "Silla firme contra la pared y pies al ancho", sub: "Incline el torso y empuje el suelo hasta quedar de pie",
    step: 1, total: 3,
    visual: "Vista lateral con la silla, la pared y la separación de los pies marcada por una guía que aparece y se retira", detail: "Montaje técnico, medidas visuales no numéricas"},
  {para: 15, fed: "FedBeforeAfter", lf: "drop-vs-control", copy: "Dejarse caer contra bajar tardando tres segundos", sub: "En la segunda, los muslos deben frenar su peso",
    image_b: "older man lowering slowly onto a chair with controlled posture",
    visual: "Dos descensos idénticos en paralelo; uno colapsa de golpe y el otro se frena con tensión visible en los muslos", detail: "Prueba física del guion, comparación literal"},
  {para: 19, fed: "FedChecklist", lf: "joint-alarm", copy: "Dolor agudo en rodilla, cadera o espalda: deténgase", sub: "Un pinchazo articular no es falta de carácter",
    items: ["Pinchazo articular", "Bloqueo de la articulación", "Dolor que aumenta con cada repetición", "Dolor en la espalda"],
    visual: "Frontera de seguridad que se ilumina sobre la articulación y detiene el movimiento antes de completar la repetición", detail: "Límite duro, tono sobrio"},
  {para: 20, fed: "FedChapter", lf: "exercise-two-open", copy: "Ejercicio dos: la bisagra de cadera", sub: "Glúteos, parte posterior de los muslos y espalda",
    visual: "El torso entra en plano lateral y la cadera viaja hacia atrás mientras se encienden las tres zonas implicadas", detail: "Apertura del segundo movimiento"},
  {para: 22, fed: "FedStep", lf: "wall-hinge-drill", copy: "Cadera hacia atrás hasta tocar la pared con los glúteos", sub: "De pie a unos veinte centímetros, mirando en dirección contraria",
    step: 2, total: 3,
    visual: "Pared como referencia fija y la cadera que la alcanza; el torso se inclina como una pieza firme, no se redondea", detail: "Ejercicio guiado por un objeto real"},
  {para: 18, fed: "FedStat", lf: "four-week-retest", value: "4", copy: "Repita la prueba dentro de cuatro semanas", sub: "Misma silla: más repeticiones o menos ayuda",
    visual: "Dos columnas de repeticiones separadas por cuatro semanas, con la misma silla como referencia fija en el fondo", detail: "Medida de progreso propia, no comparada con nadie"},
  {para: 23, fed: "FedStat", lf: "load-lever", value: "2-3", copy: "Empiece con dos o tres libros en la mochila", sub: "El peso debe permanecer cerca del cuerpo",
    visual: "Mochila con dos libros junto al cuerpo y la misma carga alejada, donde la palanca sobre la espalda crece visiblemente", detail: "Carga inicial y por qué la distancia importa"},
  {para: 27, fed: "FedChecklist", lf: "spine-boundary", copy: "Osteoporosis o fracturas vertebrales: adaptación profesional primero", sub: "No copie la carga de otra persona",
    items: ["Osteoporosis diagnosticada", "Fracturas vertebrales", "Dolor que baja por una pierna", "Cirugía reciente"],
    visual: "Columna en corte con una carga que se detiene antes de entrar mientras una ficha clínica se superpone", detail: "Frontera médica, sin dramatismo gráfico"},
  {para: 28, fed: "FedChapter", lf: "exercise-three-open", copy: "Ejercicio tres: la flexión contra una pared", sub: "Devuelve fuerza de empuje",
    visual: "Las manos entran a cuadro y se apoyan en la superficie mientras el cuerpo se alinea en profundidad", detail: "Apertura del tercer movimiento"},
  {para: 30, fed: "FedStep", lf: "incline-dial", copy: "La inclinación es su regulador de dificultad", sub: "Pared, encimera firme y superficies más bajas",
    step: 2, total: 3,
    visual: "Tres alturas de apoyo escalonadas en profundidad; la mano sube o baja de superficie y el esfuerzo cambia con ella", detail: "Regulador continuo, nadie empieza en el suelo"},
  {para: 33, fed: "FedBeforeAfter", lf: "walk-vs-strength", copy: "Caminar y entrenar fuerza no compiten: se completan", sub: "La caminata puede no conservar la fuerza del torso",
    image_b: "older man performing an incline push up against a kitchen counter",
    visual: "Camino de caminata a la izquierda y empuje contra superficie a la derecha; las dos imágenes convergen en vez de excluirse", detail: "Responde la objeción literal del guion"},
  {para: 34, fed: "FedChapter", lf: "exercise-four-open", copy: "Ejercicio cuatro: el remo con banda elástica", sub: "Es el compañero del empuje",
    visual: "La banda entra desde fuera de cuadro y se tensa mientras el fondo de empuje retrocede a segundo plano", detail: "Apertura del cuarto movimiento"},
  {para: 35, fed: "FedChecklist", lf: "band-safety-check", copy: "Antes de tirar, revise el material de la banda", sub: "Una banda que se rompe puede golpearle la cara",
    items: ["Grietas en el material", "Zonas blanquecinas", "Banda reseca", "Anclaje poco sólido"],
    visual: "Banda a contraluz donde se marcan las zonas gastadas y el anclaje se comprueba antes del primer tirón", detail: "Seguridad del equipo, previa al ejercicio"},
  {para: 39, fed: "FedMolecule", lf: "training-signal-inputs", copy: "El cuerpo entiende tensión, alimento, descanso y repetición", sub: "No entiende etiquetas para hombres",
    visual: "Cuatro entradas que convergen en una señal de entrenamiento; una etiqueta comercial intenta entrar y no encaja", detail: "Mecanismo que desmonta el marketing"},
  {para: 41, fed: "FedQuote", lf: "principle-quote", attributed: true, author: "Federer Building", role: "Principio del canal",
    copy: "Natural tampoco significa automáticamente eficaz o seguro", sub: "Algunos suplementos pueden interactuar con medicamentos",
    visual: "Tarjeta clara sobre fondo desaturado con el presentador asomando detrás del borde superior", detail: "Cita atribuida al propio canal, sin credenciales inventadas"},
  {para: 42, fed: "FedLowerThird", lf: "medical-stance", copy: "La testosterona indicada requiere valorar y hacer seguimiento", sub: "Puede reducir la producción de espermatozoides",
    visual: "Rótulo inferior sobrio sobre el presentador con una hoja de indicaciones desenfocada detrás", detail: "Postura médica del canal"},
  {para: 43, fed: "FedChapter", lf: "exercise-five-open", copy: "Ejercicio cinco: el ascenso a un escalón bajo", sub: "Revela diferencias entre ambas piernas",
    visual: "El escalón y la baranda entran en profundidad mientras una pierna queda iluminada y la otra en sombra", detail: "Apertura del quinto movimiento"},
  {para: 47, fed: "FedStep", lf: "one-variable-rule", copy: "Cambie una variable por vez", sub: "Repeticiones, después menos ayuda, después carga liviana",
    step: 3, total: 3,
    visual: "Tres diales alineados donde solo uno gira por semana y los otros dos quedan fijos y apagados", detail: "Progresión controlada, decisión medible"},
  {para: 49, fed: "FedChapter", lf: "exercise-six-open", copy: "Ejercicio seis: cargar peso mientras camina", sub: "Algunos lo llaman paseo del granjero",
    visual: "Dos cargas entran a los lados del cuadro y el pasillo se abre hacia el fondo", detail: "Apertura del sexto movimiento"},
  {para: 52, fed: "FedHero", lf: "grip-stakes", copy: "El agarre decide abrir un frasco o sostener herramientas", sub: "Una mano débil vuelve pesada una tarea pequeña",
    visual: "Tres gestos cotidianos encadenados en profundidad: la tapa que cede, la herramienta sostenida y las bolsas que llegan enteras", detail: "Consecuencia funcional del agarre, sin gimnasio"},
  {para: 54, fed: "FedWhiteboard", lf: "progression-principle", copy: "Ligeramente más difícil que aquello ya acostumbrado", sub: "Esa palabra protege sus articulaciones",
    visual: "Pizarra a mano con una rampa suave dibujada paso a paso frente a un salto brusco que se tacha", detail: "Principio que une los seis movimientos"},
  {para: 56, fed: "FedChapter", lf: "exercise-seven-open", copy: "Ejercicio siete: intervalos breves de esfuerzo", sub: "También es el que peor se utiliza",
    visual: "Una línea de ritmo entra plana y se quiebra en picos cortos mientras el fondo cambia de calma a esfuerzo", detail: "Apertura del séptimo movimiento"},
  {para: 57, fed: "FedStat", lf: "intensity-target", value: "7/10", copy: "Busque una intensidad de siete sobre diez", sub: "Acelere entre veinte y treinta segundos, no al máximo",
    visual: "Escala de esfuerzo de uno a diez con la marca detenida en siete y el extremo superior apagado", detail: "Dosis de intensidad, no examen de valentía"},
  {para: 61, fed: "FedChecklist", lf: "cardiac-stop", copy: "No realice intervalos intensos con dolor de pecho", sub: "Deténgase y busque evaluación médica",
    items: ["Dolor de pecho", "Falta de aire desproporcionada", "Mareos o desmayos", "Palpitaciones nuevas"],
    visual: "Cuatro señales que encienden un límite tenue y detienen el cronómetro del intervalo", detail: "Contraindicación dura de esta sección"},
  {para: 63, fed: "FedBeforeAfter", lf: "more-is-not-double", copy: "Cuarenta segundos no serán el doble de buenos", sub: "Peor técnica, peor sueño y una semana sin moverse",
    image_b: "exhausted older man sitting on the floor after overtraining",
    visual: "Dos intervalos iguales en duración aparente; el segundo se degrada en técnica y arrastra una semana vacía detrás", detail: "Desmonta la aritmética ingenua del esfuerzo"},
  {para: 65, fed: "FedStat", lf: "weekly-frame", value: "2", copy: "Dos días no consecutivos: por ejemplo martes y viernes", sub: "Los intervalos pueden ocupar un tercer día",
    visual: "Calendario semanal donde dos días se elevan separados y un tercero aparece atenuado como opcional", detail: "Estructura de la semana, decisión concreta"},
  {para: 66, fed: "FedWhiteboard", lf: "reps-in-reserve", copy: "Termine cada serie pudiendo hacer dos o tres más", sub: "Si podría hacer diez más, falta desafío",
    visual: "Pizarra a mano con una serie dibujada y dos repeticiones guardadas al final, marcadas en un margen", detail: "Regla de selección de resistencia, dibujada"},
  {para: 69, fed: "FedMolecule", lf: "adaptation-window", copy: "El entrenamiento inicia la señal; la adaptación ocurre después", sub: "El músculo no se construye durante el esfuerzo",
    visual: "Señal que se dispara en el esfuerzo y una ventana posterior donde la fibra se reconstruye con el descanso", detail: "Mecanismo clave del bloque final"},
  {para: 70, fed: "FedChapter", lf: "error-reveal", copy: "El error: entrenar con hambre y durmiendo cinco horas", sub: "Repitiendo sesiones duras todos los días",
    visual: "Las tres carencias entran apiladas sobre la misma persona hasta hundir la escena, sin nada que salga", detail: "Pago de la promesa del inicio"},
  {para: 72, fed: "FedChecklist", lf: "forty-eight-hour-test", copy: "La prueba de cuarenta y ocho horas es sencilla", sub: "Observe los dos días posteriores al entrenamiento",
    items: ["Rendimiento que cae en cada sesión", "Duerme peor", "Dolor articular", "Pierde las ganas de entrenar"],
    visual: "Dos días en una línea temporal donde cuatro indicadores se leen uno a uno tras la sesión", detail: "Herramienta prometida en el hook"},
  {para: 73, fed: "FedStep", lf: "deload-recipe", copy: "Reduzca el volumen y deje un día entre sesiones", sub: "Horarios regulares de sueño y energía suficiente",
    step: 2, total: 2,
    visual: "Barra de volumen que baja un tramo y un día vacío que se abre entre dos sesiones", detail: "Solución barata, decisión medible"},
  {para: 75, fed: "FedBeforeAfter", lf: "gradual-vs-crash", copy: "Reducir grasa gradualmente mientras conserva fuerza", sub: "Una dieta extrema sacrifica músculo y recuperación",
    image_b: "balanced plate with protein and vegetables on a kitchen table",
    visual: "Dos descensos de grasa en paralelo: uno arrastra la fuerza hacia abajo y el otro la mantiene estable", detail: "Comparación de estrategia, no de estética"},
  {para: 76, fed: "FedChecklist", lf: "sleep-apnea-flag", copy: "Ronquidos intensos o pausas respiratorias: pida evaluación", sub: "Ningún ejercicio compensa una respiración interrumpida",
    items: ["Ronquidos intensos", "Pausas respiratorias observadas", "Dolor de cabeza al despertar", "Quedarse dormido durante el día"],
    visual: "Trazado respiratorio nocturno que se corta una y otra vez mientras el resto de la escena queda en silencio", detail: "Derivación clínica, no consejo casero"},
  {para: 79, fed: "FedHero", lf: "observable-vitality", copy: "La mochila más liviana y el escalón sin intimidar", sub: "Esa es vitalidad observable",
    visual: "Tres pruebas cotidianas que entran encadenadas en profundidad: la silla, la mochila y el escalón, cada una resuelta", detail: "Pago concreto, sin cifra de laboratorio"},
  {para: 81, fed: "FedStep", lf: "week-one-plan", copy: "Silla, bisagra, flexión inclinada, remo y escalón", sub: "Cierre con dos paseos cargados de veinte segundos",
    step: 1, total: 2,
    visual: "Cinco estaciones que se ordenan en el suelo de la sala y dos paseos cargados cierran el recorrido", detail: "Recap accionable de la semana"},
  {para: 83, fed: "FedChecklist", lf: "red-flags-stop", copy: "Dolor de pecho, desmayo o debilidad repentina: deténgase", sub: "Esos síntomas no son una prueba de voluntad",
    items: ["Dolor de pecho", "Desmayo", "Falta de aire inusual", "Debilidad repentina"],
    visual: "Cuatro señales de alarma que detienen la escena en seco y abren paso a la puerta de una consulta", detail: "Frontera final de seguridad"},
  {para: 86, fed: "FedCta", lf: "closing-invite", copy: "Suscríbase a Federer Building para la próxima rutina", sub: "Comparta el video con quien cree que entrenar arriesga rodillas",
    visual: "Cierre sobrio donde la silla y la mochila quedan preparadas y el nombre del canal aparece sin estridencia", detail: "Sin precio ni enlace hablado"},
  {para: 88, fed: "FedQuote", lf: "closing-principle", attributed: true, author: "Federer Building", role: "Cierre del canal",
    copy: "Darle al cuerpo de hoy una razón para seguir fuerte", sub: "Dos días, siete movimientos, progresión pequeña",
    visual: "Tarjeta clara final con el presentador asomando y la sala ordenada detrás en penumbra", detail: "Cita atribuida al canal, cierre del argumento"},
];

// ── Ensamblado determinista ────────────────────────────────────────────────
const PATTERN = ["avatar","clean","presenter","clean","avatar","clean","presenter","clean","avatar","clean","presenter","clean","avatar","clean","presenter","clean","avatar","clean","presenter","clean","avatar","presenter","avatar"];
const TRANS = ["none","whip","lift","none","iris","fold","none","whip","none","lift","iris","none","fold","whip","none","iris","lift","fold","whip","iris"];

const heroByPara = new Map(HEROES.map((h) => [h.para, h]));
const paraSection = new Map();
for (const s of SECTIONS) for (let p = s.paras[0]; p <= s.paras[1]; p++) paraSection.set(p, s);
for (const h of HEROES) if (!paraSection.has(h.para)) throw new Error(`hero para ${h.para} fuera de secciones`);
console.error(`parrafos: ${PARAS.length}`);

const totalTokens = PARAS.reduce((n, p) => n + p.tokens.length, 0);
for (const p of PARAS) {
  p.slots = Math.max(1, Math.round((p.tokens.length / totalTokens) * TARGET_MOMENTS));
  if (heroByPara.has(p.n)) p.slots = Math.max(2, p.slots);
}

const windowText = (tokens, a, b) => tokens.slice(a, b).join(" ");
const bestWindow = (tokens, terms, near) => {
  let best = null;
  for (let len = 6; len <= 18; len++) {
    for (let a = 0; a + len <= tokens.length; a++) {
      const set = new Set(norm(windowText(tokens, a, a + len)).filter((w) => w.length >= 3 && !STOP.has(w)));
      let hit = 0;
      for (const t of terms) if (set.has(t)) hit++;
      const dist = Math.abs(a - near);
      if (!best || hit > best.hit || (hit === best.hit && (len < best.len || (len === best.len && dist < best.dist)))) {
        best = {hit, len, dist, a, text: windowText(tokens, a, a + len)};
      }
    }
  }
  return best;
};

let patternCursor = 0, transCursor = 0, momentSeq = 0;
const sectionMoments = new Map(SECTIONS.map((s) => [s.id, []]));
const stockCursor = new Map(), presenterCursor = new Map();

const assertAnchor = (id, text) => {
  const n = norm(text);
  if (n.length < 6 || n.length > 18) throw new Error(`${id}: anchor de ${n.length} palabras`);
  if (!NARRATION_NORM.includes(n.join(" "))) throw new Error(`${id}: anchor no textual -> ${text}`);
  return text;
};

for (const p of PARAS) {
  const section = paraSection.get(p.n);
  if (!section) throw new Error(`parrafo ${p.n} sin seccion`);
  const k = p.slots;
  const bounds = [];
  for (let i = 0; i < k; i++) bounds.push([Math.floor((i * p.tokens.length) / k), Math.floor(((i + 1) * p.tokens.length) / k)]);
  const hero = heroByPara.get(p.n);
  const heroSlot = hero ? Math.min(1, k - 1) : -1;
  for (let i = 0; i < k; i++) {
    momentSeq += 1;
    const id = `${section.id}-m${String(momentSeq).padStart(3, "0")}`;
    const transition = TRANS[transCursor++ % TRANS.length];
    const base = {id, section_id: section.id, transition};
    if (i === heroSlot) {
      const terms = meaningful(`${hero.copy} ${hero.sub}`);
      const win = bestWindow(p.tokens, terms, bounds[i][0]);
      if (!win || win.hit < 2) throw new Error(`${id}: solapamiento ${win ? win.hit : 0} con el guion (parrafo ${p.n})`);
      sectionMoments.get(section.id).push({
        ...base,
        type: "hero_component", visual_type: "hero_component",
        narration_match: assertAnchor(id, win.text),
        overlay_policy: "editorial_only",
        component_identifier: hero.fed, component_family: hero.fed, layout_family: hero.lf,
        on_screen_copy: hero.copy, editorial_sub: hero.sub,
        depth_layers: 6 + (momentSeq % 4), importance: "signature",
        primary_motion: "entrada lateral en profundidad con paralaje de capas independientes",
        secondary_motion: "revelado de evidencia: tarjetas, conectores y mascaras encadenados",
        micro_motion: "foco, luz y textura respirando sin temblor de camara",
        camera: "empuje lento hacia el eje del diagrama",
        entry: "las capas entran desde fuera de cuadro y ganan foco",
        exit: "retroceden y pierden luz antes del corte",
        ...(hero.items ? {items: hero.items} : {}),
        ...(hero.value ? {value: hero.value, metric_value: hero.value} : {}),
        ...(hero.step ? {step: hero.step, total: hero.total} : {}),
        ...(hero.attributed ? {attributed: true, author: hero.author, role: hero.role} : {}),
        ...(hero.image_b ? {image_b: hero.image_b, comparison_query_b: hero.image_b} : {}),
        visual: hero.visual, detail: hero.detail,
      });
      continue;
    }
    let [a, b] = bounds[i];
    while (b - a < 6 && b < p.tokens.length) b++;
    while (b - a < 6 && a > 0) a--;
    if (b - a > 18) b = a + 18;
    const anchor = assertAnchor(id, windowText(p.tokens, a, b));
    const kind = PATTERN[patternCursor++ % PATTERN.length];
    if (kind === "avatar") {
      sectionMoments.get(section.id).push({
        ...base, type: "avatar", visual_type: "avatar_full", narration_match: anchor, overlay_policy: "none",
        visual: "presentador a cuadro completo, sin sobreimpresos, aire para que la frase respire",
        detail: "ancla humana continua del video",
      });
    } else if (kind === "presenter") {
      const c = presenterCursor.get(section.id) || 0;
      presenterCursor.set(section.id, c + 1);
      const act = section.presenter[c % section.presenter.length];
      sectionMoments.get(section.id).push({
        ...base, type: "presenter_action", visual_type: "presenter_action", narration_match: anchor, overlay_policy: "none",
        presenter_action: {...act, identity_reference: {avatar_id: AVATAR_ID, look_id: LOOK_ID}},
        action: act.action, location: act.location, framing: act.framing,
        visual: `identidad aprobada: ${act.action}`, detail: `${act.location} · ${act.framing}`,
      });
    } else {
      const c = stockCursor.get(section.id) || 0;
      stockCursor.set(section.id, c + 1);
      sectionMoments.get(section.id).push({
        ...base, type: "clean_stock", visual_type: "clean_stock", narration_match: anchor, overlay_policy: "none",
        asset_query: section.stock[c % section.stock.length],
        visual: "medio limpio a pantalla completa, sin tarjeta ni rotulo",
        detail: "evidencia real del gesto, del objeto o del limite narrado",
      });
    }
  }
}

// Cobertura de presentador: toda seccion con accion de la identidad aprobada.
for (const s of SECTIONS) {
  const list = sectionMoments.get(s.id);
  if (list.some((m) => m.type === "presenter_action")) continue;
  const target = list.find((m) => m.type === "clean_stock") || list.find((m) => m.type === "avatar");
  if (!target) throw new Error(`seccion ${s.id} sin hueco para presentador`);
  const act = s.presenter[0];
  delete target.asset_query;
  Object.assign(target, {
    type: "presenter_action", visual_type: "presenter_action", overlay_policy: "none",
    presenter_action: {...act, identity_reference: {avatar_id: AVATAR_ID, look_id: LOOK_ID}},
    action: act.action, location: act.location, framing: act.framing,
    visual: `identidad aprobada: ${act.action}`, detail: `${act.location} · ${act.framing}`,
  });
}

// ── Director Pass (una sola decision, propia de este video) ────────────────
const director_decision = {
  content_signature: "Siete ejercicios caseros para hombres de mas de cuarenta donde el valor no esta en el movimiento sino en la dosis, la tecnica y el limite; el video niega desde la primera frase que una sentadilla rejuvenezca hormonas y sustituye la promesa del frasco por capacidades medibles, y despues invierte su propia premisa: hacer los siete con hambre, cinco horas de sueno y sesiones diarias convierte la rutina en otra fuente de agotamiento. La prueba de cuarenta y ocho horas es el hilo que sostiene la retencion desde el hook hasta el pago final.",
  visual_thesis: "Cada afirmacion se resuelve con el objeto real de la casa que la voz nombra -la silla, la pared, la mochila con dos libros, la banda, el escalon, las dos bolsas- o con las manos del presentador ejecutando ese gesto exacto. El texto aparece solo cuando hay una dosis, un techo de seguridad o una ruta causal que la imagen no puede decir sola: siete sobre diez de intensidad, dos dias no consecutivos, dos repeticiones guardadas en reserva. La camara mide en vez de decorar: caida libre contra tres segundos de descenso, cadera que alcanza la pared, un solo dial que gira por semana.",
  pacing_profile: "Siete capitulos de ejercicio con tres bloques de contexto medico intercalados: el hook cierra en cuatro momentos rapidos, cada ejercicio abre con FedChapter y baja a mediana cercana a cinco segundos entre montaje tecnico, presentador y stock limpio, y un explainer de seis a nueve capas entra cada sesenta a noventa segundos. Dos frenadas largas de avatar limpio marcan los giros del guion: la objecion de quien ya camina todos los dias y la revelacion del error incomodo, donde la voz necesita silencio visual.",
  presenter_role: "La identidad aprobada demuestra, no ilustra: se levanta de la silla sin manos, toca la pared con los gluteos, revisa la banda a contraluz buscando grietas, sube el escalon soltando la baranda, camina cargando dos bolsas y baja el peso cuando el torso se inclina. Toda seccion tiene al menos un gesto fisico suyo en sala, pasillo, cocina o escalera de casa, porque un video sobre entrenar despues de los sesenta pide credibilidad domestica y no un gimnasio de estudio.",
  stock_role: "El stock aporta el objeto y el contexto clinico verificables a pantalla completa y sin rotulo: la silla contra la pared, la banda gastada en macro, la baranda de la escalera, el tensiometro, el trazado de una noche interrumpida. Nunca lleva texto encima ni sustituye una explicacion; cuando hay que explicar entra un componente y el stock se retira. Queda prohibido el stock de gimnasio con torsos musculosos porque empujaria justo la promesa de potenciador que el guion desmonta.",
  component_roles: [
    "FedChapter marca las siete bisagras de ejercicio mas la revelacion del error, y nunca aparece dentro de un bloque tecnico.",
    "FedStep traduce cantidad en gesto repetible: montaje de la silla, cadera contra la pared, una sola variable por vez, cinco estaciones de la primera semana y la receta de descarga.",
    "FedChecklist sostiene todas las fronteras de seguridad del video -alarma articular, columna, banda gastada, contraindicacion cardiaca, apnea, senales de alarma finales- y nunca se usa como lista decorativa.",
    "FedMolecule y FedWhiteboard reparten el mecanismo: la molecula dibuja lo que el cuerpo hace con la tension y la ventana de adaptacion, y la pizarra explica a mano lo contraintuitivo -pico transitorio contra linea base, progresion ligera, repeticiones en reserva-.",
    "FedBeforeAfter existe solo donde hay dos ejecuciones realmente distintas: caer contra frenar, caminar contra entrenar fuerza, veinte contra cuarenta segundos, capsula contra capacidad, deficit gradual contra dieta extrema.",
    "FedStat guarda las tres cifras defendibles del guion: dos sesiones semanales, siete sobre diez de intensidad y dos dias no consecutivos; FedQuote sostiene los dos principios atribuidos al canal y FedCta cierra sin precio ni enlace hablado.",
  ],
  signature_beats: [
    {narration_match: "Complete una repetición dejándose caer sobre la silla", visual_strategy: "Dos descensos identicos en paralelo con la misma silla: uno colapsa de golpe y el otro se frena a lo largo de tres segundos con la tension visible en los muslos; el movimiento primario es la caida comparada, no una tarjeta de titulo."},
    {narration_match: "Busque una intensidad de siete sobre diez", visual_strategy: "Escala de esfuerzo de uno a diez construida en capas donde la marca sube y se detiene en siete mientras el extremo superior queda apagado; la respiracion aumenta pero el control permanece, y el cronometro de veinte a treinta segundos corre detras."},
    {narration_match: "El músculo no se construye durante el esfuerzo", visual_strategy: "La senal se dispara durante la carga y despues se abre una ventana posterior donde la fibra se reconstruye con el descanso; es el climax argumental del video y precede directamente a la revelacion del error incomodo."},
    {narration_match: "intentar compensar años de inactividad entrenando con hambre", visual_strategy: "Las tres carencias -hambre, cinco horas de sueno y sesiones diarias- entran apiladas sobre la misma persona hasta hundir la escena, y nada sale para dejar lugar; acumulacion vertical en profundidad, sin placa de titulo."},
  ],
  sfx_policy: {
    mode: "restringido y diegetico: el sonido real del gesto -la silla que apoya, la banda que se tensa, el paso sobre el escalon- y un pulso grave muy bajo al entrar cada explainer de firma",
    forbidden: ["stingers de suspenso", "whooshes en cada corte", "musica que compita con la voz", "impactos dramaticos sobre advertencias medicas"],
    music: "lecho tonal continuo y bajo que se retira por completo en las dos frenadas de avatar limpio",
  },
  anti_patterns: [
    "Fondo oscurecido con tarjeta redondeada y titular generico repetido como respuesta universal; si el beat no necesita evidencia textual va medio limpio a pantalla completa.",
    "Subtitulos, karaoke o transcripcion palabra por palabra en pantalla; los tiempos de caption existen solo como datos ocultos de alineacion.",
    "Texto sobre stock o sobre el presentador por defecto, y rotulos que repiten la frase que la voz acaba de decir en lugar de aportar dosis, limite o comparacion.",
    "Stock de gimnasio comercial, torsos musculosos, mancuernas heroicas o frascos de potenciador filmados con luz aspiracional: contradicen la tesis del guion.",
    "Componentes decorativos sin funcion, alias que renombran la misma geometria y mas de dos usos consecutivos de la misma familia Federer.",
  ],
  avatar_contract: {
    avatar_engine: "avatar_iii",
    voice_engine: "eleven_v3",
    identity_id: AVATAR_ID,
    look_id: LOOK_ID,
    voice_id: VOICE_ID,
    voice_speed: "x1",
    single_studio_request: true,
    captions_visible: false,
  },
};

const sections = SECTIONS.map((s) => ({id: s.id, title: s.title, moments: sectionMoments.get(s.id)}));
const all = sections.flatMap((s) => s.moments);
for (const m of all) {
  if (m.type !== "hero_component") continue;
  const w = wordsOf(m.on_screen_copy).length;
  if (w > 10 || m.on_screen_copy.length > 72) throw new Error(`${m.id}: copy ${w}w/${m.on_screen_copy.length}c -> ${m.on_screen_copy}`);
}

const plan = {
  version: 3,
  kind: "bagasy.visual_plan",
  job_id: JOB_ID,
  slug: SLUG,
  language: "es",
  title: "7 Ejercicios que Reactivan tu Testosterona Despues de los 40",
  kit: "federer-fluid",
  architecture: "avatar persistente continuo con escenas de profundidad encima",
  captions_policy: {visible_subtitles: false, usage: "hidden_alignment_only"},
  director_decision,
  asset_requirements: {
    presenter_identity: {avatar_id: AVATAR_ID, look_id: LOOK_ID, voice_id: VOICE_ID, reference: `public/presenter_identity_${SLUG}.png`},
    stock_policy: {full_frame: true, overlay: "none", burned_in_text_allowed: false},
  },
  sections,
};

mkdirSync(path.join(ROOT, "_v3"), {recursive: true});
writeFileSync(path.join(ROOT, "_v3", `${SLUG}_plan.json`), `${JSON.stringify(plan, null, 2)}\n`, "utf8");

const by = (t) => all.filter((m) => m.type === t).length;
const heroes = all.filter((m) => m.type === "hero_component");
const feds = new Map();
for (const h of heroes) feds.set(h.component_identifier, (feds.get(h.component_identifier) || 0) + 1);
const trans = new Map();
for (const m of all) trans.set(m.transition, (trans.get(m.transition) || 0) + 1);
console.log(JSON.stringify({
  moments: all.length,
  sections: sections.length,
  ratios: {avatar: +(by("avatar") / all.length).toFixed(3), presenter: +(by("presenter_action") / all.length).toFixed(3), clean: +(by("clean_stock") / all.length).toFixed(3), hero: +(heroes.length / all.length).toFixed(3)},
  fed_types: feds.size,
  fed_counts: Object.fromEntries(feds),
  fed_max_share: +(Math.max(...feds.values()) / heroes.length).toFixed(3),
  layout_families: new Set(heroes.map((h) => h.layout_family)).size,
  transitions: Object.fromEntries(trans),
  clean_cut: +((trans.get("none") || 0) / all.length).toFixed(3),
  presenter_sections: new Set(all.filter((m) => m.type === "presenter_action").map((m) => m.section_id)).size,
}, null, 1));
