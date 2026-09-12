// visual_plan_v9uz8m1rssch.mjs — DETERMINISTIC visual-plan writer for job v9uz8m1rssch.
// One Director Pass, persisted here as data; run once to emit _v3/<slug>_plan.json.
// The creative judgement (sections, hero ideas, copy, director_decision) lives in this file;
// the mechanics (narration anchoring, type balancing, interleave, transitions) are computed
// so every moment's narration_match is a verbatim slice and the mix hits the V3 + Premium gates.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SLUG = "v9uz8m1rssch";
const AVATAR_ID = "bfab9e26d7664d30b011447ff9e40932";
const LOOK_ID = "87fad00eb96d4415967dbfa7b6050b3f";
const VOICE_ID = "a1dab6b543dd494589903d61526d9966";

const narration = readFileSync(path.join(ROOT, "public", "guiones", `${SLUG}.txt`), "utf8");

// ── tokenization identical to the validators ───────────────────────────────
const norm = (w) => w.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const rawTokens = narration.match(/[\p{L}\p{N}'-]+/gu) || [];
const clean = [];
for (const t of rawTokens) { const n = norm(t); if (n) clean.push({ raw: t, n }); }
const N = clean.length;
const nStr = clean.map((c) => c.n);
const STOPWORDS = new Set("a al algo an and are as at con de del el en es esa ese esta este for from la las lo los of on o para por que se sin sobre the to un una y with".split(" "));
const meaningful = (value) => [...new Set((value.match(/[\p{L}\p{N}'-]+/gu) || []).map(norm).filter((w) => w.length >= 3 && !STOPWORDS.has(w)))];
const seedNorm = (s) => (s.match(/[\p{L}\p{N}'-]+/gu) || []).map(norm).filter(Boolean);

function findSeq(sn) {
  for (let i = 0; i + sn.length <= N; i++) {
    let ok = true;
    for (let k = 0; k < sn.length; k++) if (nStr[i + k] !== sn[k]) { ok = false; break; }
    if (ok) return i;
  }
  return -1;
}
function windowFromSeed(seed, target = 11) {
  const sn = seedNorm(seed);
  const i = findSeq(sn);
  if (i < 0) throw new Error(`hero seed not found verbatim: "${seed}"`);
  let start = i, end = i + sn.length;
  while (end - start < target && end < N) end++;
  while (end - start < 8 && start > 0) start--;
  if (end - start > 18) end = start + 18;
  while (end - start < 6 && end < N) end++;
  while (end - start < 6 && start > 0) start--;
  return clean.slice(start, end).map((c) => c.raw).join(" ");
}
function boundaryIndex(seed) {
  const i = findSeq(seedNorm(seed));
  if (i < 0) throw new Error(`boundary seed not found verbatim: "${seed}"`);
  return i;
}
function autoWindow(a, b, j, M) {
  const range = b - a;
  const WIN = Math.min(12, Math.max(6, range));
  if (range <= WIN) {
    const end = Math.min(N, a + Math.max(6, Math.min(18, range)));
    return clean.slice(a, end).map((c) => c.raw).join(" ");
  }
  const span = range - WIN;
  const frac = M <= 1 ? 0.5 : j / (M - 1);
  let s = Math.max(a, Math.min(a + Math.round(frac * span), b - WIN));
  return clean.slice(s, s + WIN).map((c) => c.raw).join(" ");
}

// ── DIRECTOR PASS: sections + topic-specific hero ideas ─────────────────────
const FAMILY_DESC = {
  contrast_split: "comparacion a dos columnas con divisor animado: freno silencioso vs beneficio real",
  body_signal_grid: "cuadricula de senales corporales cuyos iconos se encienden al nombrarlos",
  loop_cycle: "diagrama circular del ciclo que se retroalimenta noche tras noche",
  daily_timeline: "linea de tiempo del dia con marcadores de ingesta que aparecen en orden",
  mechanism_diagram: "diagrama de mecanismo con flujo, nodos y capas conectadas",
  comparison_scale: "balanza comparativa que inclina entre dos escenarios opuestos",
  cause_chain: "cadena causal de eslabones que avanzan uno a uno hasta el desenlace",
  dose_meter: "medidor de dosis con vaso y rango moderado marcado sobre una escala",
  urine_color_scale: "escala de color de orina en degrade calibrado con marcador movil",
  safety_boundary: "panel de limite de seguridad con banda roja de alerta y umbral",
  anatomy_callout: "ilustracion anatomica con llamadas rotuladas y ampliacion de zona",
  myth_vs_fact: "tarjeta de mito tachada que gira en 3D hacia la verdad clinica",
  med_interaction_panel: "panel de medicamentos con flechas de efecto sobre deseo y funcion",
  checklist_plan: "checklist de pasos numerados que se marcan al ritmo de la narracion",
};
const HERO_DETAIL = "6-9 capas independientes accionadas por frame: camara, entrada de tarjetas, conectores, reveal de datos, luz y textura; anclado al ms de la narracion.";

const sections = [
  {
    id: "s01-hook", name: "Hook / la contradiccion", seed: "Un vaso de agua tomado en el momento correcto",
    objetivo: "Ganar los primeros segundos con la paradoja: el agua puede quitar un freno, pero el exceso nocturno sabotea.",
    av: 2, pr: 1, st: 1, im: 0,
    pact: "el Dr. Federer sostiene un vaso de agua a media luz y mira a camara planteando la paradoja",
    pprops: "vaso de vidrio con agua, escritorio clinico",
    bstock: "vaso de agua servido en primer plano sobre mesada, luz teal", bimg: "",
    heroes: [
      { fam: "contrast_split", dl: 8, seed: "retirar uno de los frenos mas silenciosos de la respuesta sexual", copy: "El freno silencioso de la respuesta sexual" },
    ],
  },
  {
    id: "s02-noes", name: "Que NO es el agua + deshidratacion con la edad", seed: "El agua no funciona como una pastilla",
    objetivo: "Bajar la promesa: el agua corrige deshidratacion leve, no es afrodisiaco ni sube testosterona.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer niega con la mano el mito de la pastilla magica y explica la correccion de la deshidratacion",
    pprops: "pastillero descartado sobre el escritorio",
    bstock: "hombre mayor con leve cansancio se frota la sien junto a una ventana", bimg: "vaso de agua junto a una pastilla azul tachada, estilo clinico",
    heroes: [
      { fam: "body_signal_grid", dl: 7, seed: "una deshidratacion leve que estaba sumando cansancio, dolor de cabeza, mareo", copy: "Deshidratacion leve suma cansancio y mareo" },
      { fam: "contrast_split", dl: 7, seed: "El cuerpo puede necesitar liquido antes de que la boca lo pida", copy: "El cuerpo pide liquido antes que la boca" },
    ],
  },
  {
    id: "s03-nocturno", name: "El habito nocturno + hoja de ruta", seed: "Muchos hombres intentan arreglarlo tomando dos",
    objetivo: "Mostrar el error de compensar de noche y prometer el mapa: deseo, ereccion e hidratacion.",
    av: 2, pr: 1, st: 2, im: 1,
    pact: "el Dr. Federer cuenta con los dedos las tres cosas que va a separar en el video",
    pprops: "sin props, gesto de enumerar",
    bstock: "hombre mayor se levanta de la cama de noche hacia el bano", bimg: "tres vasos enormes de agua alineados sobre una mesa de noche",
    heroes: [
      { fam: "loop_cycle", dl: 8, seed: "tomando dos o tres vasos enormes por la noche. Se levantan a orinar", copy: "Dos o tres vasos enormes de noche" },
      { fam: "daily_timeline", dl: 6, seed: "separar tres cosas que suelen mezclarse: deseo, ereccion e hidratacion", copy: "Separamos deseo, ereccion e hidratacion" },
    ],
  },
  {
    id: "s04-libido", name: "Libido vs ereccion", seed: "Libido y ereccion no son sinonimos",
    objetivo: "Diferenciar deseo (cerebro y emociones) de ereccion (respuesta vascular y nerviosa).",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer separa con las manos dos conceptos mientras los define",
    pprops: "pizarra clinica al fondo",
    bstock: "pareja madura conversando tranquila en un sillon", bimg: "cerebro y sistema vascular ilustrados lado a lado, look teal",
    heroes: [
      { fam: "mechanism_diagram", dl: 8, seed: "La ereccion es una respuesta vascular y nerviosa. Necesita excitacion", copy: "La ereccion: respuesta vascular y nerviosa" },
      { fam: "comparison_scale", dl: 7, seed: "Libido y ereccion no son sinonimos", copy: "Libido y ereccion no son lo mismo" },
      { fam: "cause_chain", dl: 7, seed: "influyen el cerebro, las emociones, la relacion de pareja, el descanso, el estres", copy: "Deseo: cerebro, emociones, pareja y estres" },
    ],
  },
  {
    id: "s05-terreno", name: "Donde entra el agua / corregir no es estimular / manguera", seed: "En el terreno que sostiene todo eso",
    objetivo: "El agua sostiene el terreno (circulacion, energia, presion); corregir una carencia no es agregar estimulante.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer usa la analogia de la manguera con las manos para explicar bomba, tuberia y volumen",
    pprops: "manguera de jardin como prop didactico",
    bstock: "agua corriendo por una manguera al aire libre en camara lenta", bimg: "esquema de manguera con bomba y tuberia comparado con corazon y vasos",
    heroes: [
      { fam: "mechanism_diagram", dl: 9, seed: "el corazon participa como bomba. Los vasos son las tuberias", copy: "Corazon bomba, vasos tuberia, sangre volumen" },
      { fam: "contrast_split", dl: 7, seed: "corregir una carencia no equivale a agregar un estimulante", copy: "Corregir carencia no es agregar estimulante" },
      { fam: "dose_meter", dl: 7, seed: "Con el agua, muchisimo puede ser peligroso. El objetivo no es inundar", copy: "Con el agua, muchisimo puede ser peligroso" },
    ],
  },
  {
    id: "s06-senales", name: "Senales y color de orina", seed: "La primera regla practica es no esperar siempre",
    objetivo: "Ensenar a leer el conjunto de senales y el color de orina, con el limite de cuando consultar.",
    av: 2, pr: 1, st: 2, im: 2,
    pact: "el Dr. Federer enumera las senales de deshidratacion senalando una lista imaginaria",
    pprops: "sin props",
    bstock: "hombre mayor bebe un vaso de agua junto a la cocina por la manana", bimg: "escala de color de orina de amarillo claro a oscuro sobre fondo neutro",
    heroes: [
      { fam: "body_signal_grid", dl: 8, seed: "Boca seca. Orina oscura. Menor frecuencia al orinar. Dolor de cabeza", copy: "Senales: boca seca, orina oscura, cansancio" },
      { fam: "urine_color_scale", dl: 9, seed: "un amarillo claro es compatible con una hidratacion razonable", copy: "Amarillo claro: hidratacion razonable" },
      { fam: "safety_boundary", dl: 8, seed: "Si la orina se vuelve roja, color te, muy turbia", copy: "Orina roja o turbia: evaluacion medica" },
    ],
  },
  {
    id: "s07-metodo", name: "El metodo: distribucion matutina + cafe", seed: "el metodo. No empieza calculando una cifra perfecta",
    objetivo: "Instalar la distribucion: vaso moderado temprano, media manana; el cafe cuenta pero con matices.",
    av: 3, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer marca en el aire la primera ventana del dia al levantarse",
    pprops: "taza de cafe y vaso de agua sobre la mesa",
    bstock: "taza de cafe humeante junto a un vaso de agua al amanecer", bimg: "linea de tiempo del dia con vasos de agua distribuidos por la manana",
    heroes: [
      { fam: "daily_timeline", dl: 9, seed: "Durante los primeros treinta a sesenta minutos despues de levantarse", copy: "Primeros 30-60 minutos tras levantarse" },
      { fam: "dose_meter", dl: 7, seed: "puede tomar un vaso moderado. Aproximadamente entre doscientos cincuenta", copy: "Un vaso moderado, repartido sin apuro" },
      { fam: "cause_chain", dl: 7, seed: "cambia la estrategia completa: mas temprano, menos atracon nocturno", copy: "Mas temprano, menos atracon nocturno" },
    ],
  },
  {
    id: "s08-prostata", name: "Prostata, vejiga, punto medio, comida", seed: "la prostata puede crecer y dificultar la salida",
    objetivo: "Explicar prostata y vejiga tras los sesenta y el punto medio: cantidades moderadas y repartidas.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer explica con calma el crecimiento prostatico y por que no sirve beber litros de golpe",
    pprops: "modelo anatomico pequeno en el escritorio",
    bstock: "hombre mayor camina hacia el bano de dia con gesto de urgencia", bimg: "ilustracion de vejiga y prostata con llamadas rotuladas, look teal",
    heroes: [
      { fam: "anatomy_callout", dl: 9, seed: "la prostata puede crecer y dificultar la salida de la orina", copy: "La prostata crece y dificulta la orina" },
      { fam: "cause_chain", dl: 7, seed: "puede concentrar la orina y favorecer el estrenimiento", copy: "Orina concentrada y estrenimiento" },
      { fam: "dose_meter", dl: 7, seed: "El punto medio es el secreto. Cantidades moderadas. Repartidas", copy: "El punto medio: cantidades moderadas, repartidas" },
    ],
  },
  {
    id: "s09-intimidad", name: "Mejor momento para la intimidad", seed: "cual es el mejor momento si usted espera tener intimidad",
    objetivo: "Llegar hidratado desde la manana; preparacion no es atracon ni vaciar una botella justo antes.",
    av: 2, pr: 1, st: 2, im: 1,
    pact: "el Dr. Federer aconseja cuidar el agua desde temprano si se espera una noche especial",
    pprops: "reloj de pared visible",
    bstock: "pareja madura comparte una cena tranquila con luz calida", bimg: "botella de agua tachada junto a un reloj marcando la tarde",
    heroes: [
      { fam: "daily_timeline", dl: 8, seed: "Llegar hidratado es mejor que intentar hidratarse cinco minutos antes", copy: "Llegar hidratado, no beber cinco minutos antes" },
      { fam: "safety_boundary", dl: 7, seed: "Evite vaciar una botella entera justo antes", copy: "No vacie una botella entera justo antes" },
    ],
  },
  {
    id: "s10-alcohol", name: "El alcohol", seed: "otro enemigo que mucha gente confunde con relajacion",
    objetivo: "Desarmar el mito del alcohol como facilitador: deshidrata, fragmenta el sueno y empeora la respuesta.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer contrasta una copa social con el efecto real sobre la ereccion y el sueno",
    pprops: "copa de vino junto a un vaso de agua",
    bstock: "copa de vino servida en penumbra sobre una mesa", bimg: "copa de alcohol y gota de deshidratacion enfrentadas, estilo clinico",
    heroes: [
      { fam: "myth_vs_fact", dl: 8, seed: "El hombre toma alcohol para sentirse mas dispuesto, pero puede terminar somnoliento", copy: "Alcohol para animarse: termina somnoliento" },
      { fam: "cause_chain", dl: 7, seed: "Alternar con agua puede reducir la velocidad a la que bebe", copy: "Alternar con agua reduce la velocidad al beber" },
    ],
  },
  {
    id: "s11-indirecto", name: "Vinculo indirecto + persistencia + medicamentos", seed: "La relacion entre agua y libido suele ser indirecta",
    objetivo: "Pagar el lazo: la mejora es indirecta (menos fatiga); si el deseo cae por semanas, mirar mas lejos y revisar medicamentos.",
    av: 2, pr: 1, st: 2, im: 1,
    pact: "el Dr. Federer aclara que el agua no eleva hormonas y que ciertos medicamentos afectan el deseo",
    pprops: "caja de medicamentos generica sobre el escritorio",
    bstock: "hombre mayor con mas energia camina al aire libre por la manana", bimg: "panel de tipos de medicamentos con flechas hacia deseo y funcion sexual",
    heroes: [
      { fam: "cause_chain", dl: 7, seed: "Al hidratarse mejor, un hombre puede sentirse menos fatigado", copy: "Hidratarse mejor: menos fatiga y mas energia" },
      { fam: "med_interaction_panel", dl: 8, seed: "Algunos antidepresivos pueden afectar el deseo o el orgasmo", copy: "Antidepresivos pueden afectar deseo y orgasmo" },
    ],
  },
  {
    id: "s12-litros", name: "Cuantos litros + limites medicos + hiponatremia", seed: "cuantos litros hay que tomar",
    objetivo: "No hay cifra universal; ocho vasos es engano; en cardiopatia o renal el exceso dana; diluir el sodio es urgencia.",
    av: 3, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer desmonta la regla de los ocho vasos y advierte sobre el exceso de agua",
    pprops: "ocho vasos alineados como referencia",
    bstock: "persona corpulenta trabaja bajo el sol frente a persona sedentaria en interior", bimg: "ocho vasos de agua alineados con un signo de interrogacion encima",
    heroes: [
      { fam: "comparison_scale", dl: 8, seed: "Una persona grande que trabaja bajo el sol no necesita lo mismo", copy: "Persona grande al sol vs pequena sedentaria" },
      { fam: "myth_vs_fact", dl: 7, seed: "Convertirlas en una orden rigida de ocho vasos para todos es enganoso", copy: "Ocho vasos para todos: regla enganosa" },
      { fam: "safety_boundary", dl: 9, seed: "Beber demasiada agua en poco tiempo puede diluir el sodio de la sangre", copy: "Demasiada agua diluye el sodio en sangre" },
    ],
  },
  {
    id: "s13-demo", name: "Demostracion visible + registro 7 dias + nocturia", seed: "Ahora hagamos una demostracion visible",
    objetivo: "La botella a la vista como referencia; registrar energia, despertares y sueno; la nocturia no siempre es la prostata.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer propone dejar una jarra visible y anotar el patron durante siete dias",
    pprops: "jarra graduada con marcas de horario",
    bstock: "jarra de agua con marcas junto a una libreta de anotaciones", bimg: "diagrama de liquido en las piernas que regresa a la vejiga al acostarse",
    heroes: [
      { fam: "daily_timeline", dl: 7, seed: "coloque una botella o jarra con una cantidad conocida en un lugar facil de ver", copy: "Una botella o jarra a la vista" },
      { fam: "checklist_plan", dl: 8, seed: "Durante siete dias anote tres cosas. Su energia al final de la tarde", copy: "Siete dias: anota energia, orina y sueno" },
      { fam: "cause_chain", dl: 8, seed: "al acostarse, ese liquido regresa a la circulacion y termina en la vejiga", copy: "Liquido de las piernas regresa a la vejiga" },
    ],
  },
  {
    id: "s14-sueno", name: "Sueno + sal", seed: "eso nos lleva al sueno",
    objetivo: "El sueno es el puente entre hidratacion y libido; desplazar liquido temprano; la cena salada dispara la cadena.",
    av: 2, pr: 1, st: 2, im: 1,
    pact: "el Dr. Federer explica como una cena salada arranca la cadena de sal, sed y sueno roto",
    pprops: "salero sobre la mesa de la cena",
    bstock: "plato de cena salada servido de noche en penumbra", bimg: "cadena visual sal, sed, agua, vejiga llena y sueno fragmentado",
    heroes: [
      { fam: "mechanism_diagram", dl: 8, seed: "sueno, quiza el puente mas importante entre hidratacion y libido", copy: "El sueno: puente entre hidratacion y libido" },
      { fam: "cause_chain", dl: 8, seed: "mucha sal, mucha sed, mucha agua, vejiga llena y sueno fragmentado", copy: "Sal, sed, agua, vejiga llena, mal sueno" },
    ],
  },
  {
    id: "s15-ejercicio", name: "Ejercicio + mitos del agua", seed: "Ahora hablemos del ejercicio",
    objetivo: "El ejercicio pesa mas que cualquier vaso; el agua acompana. Caer los mitos: temperatura, limon, sal, deportivas, alcalina.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer desmiente uno por uno los mitos del agua especial mientras camina un paso",
    pprops: "botellas de agua alcalina y con limon como props a descartar",
    bstock: "hombre mayor hace una caminata tranquila por un parque", bimg: "tarjetas de mitos del agua tachadas: alcalina, limon, sal, deportiva",
    heroes: [
      { fam: "myth_vs_fact", dl: 7, seed: "Ninguna temperatura especial activa la prostata o enciende la libido", copy: "Ninguna temperatura enciende la libido" },
      { fam: "comparison_scale", dl: 7, seed: "probablemente aporte mas a su bienestar sexual que obsesionarse con una marca de agua alcalina", copy: "Una caminata supera al agua alcalina" },
      { fam: "myth_vs_fact", dl: 8, seed: "Si alguien promete elevar la testosterona cambiando su pH con agua", copy: "Nadie eleva testosterona cambiando el pH" },
    ],
  },
  {
    id: "s16-vascular", name: "Advertencia vascular + deseo y psicologia", seed: "Una dificultad erectil nueva o progresiva",
    objetivo: "La disfuncion nueva puede avisar riesgo vascular; el deseo cae por agotamiento y ansiedad, no solo por falta de amor.",
    av: 2, pr: 1, st: 2, im: 1,
    pact: "el Dr. Federer advierte, serio, que una ereccion que falla puede ser una senal cardiovascular",
    pprops: "sin props, tono grave",
    bstock: "hombre mayor pensativo mira por la ventana al atardecer", bimg: "arterias del pene y del corazon comparadas por tamano, look clinico",
    heroes: [
      { fam: "safety_boundary", dl: 9, seed: "los problemas de ereccion aparecen antes de que se diagnostique una enfermedad cardiovascular", copy: "La ereccion puede avisar riesgo cardiovascular" },
      { fam: "mechanism_diagram", dl: 7, seed: "Vigila la ereccion en vez de sentir. Se preocupa. La adrenalina sube", copy: "Vigilar la ereccion: sube la adrenalina" },
    ],
  },
  {
    id: "s17-error", name: "El error prometido + la botella", seed: "Llegamos al error prometido",
    objetivo: "Revelar el error: beber poco todo el dia y pagar la deuda en la cena; la costumbre inocente de la botella junto a la cama.",
    av: 2, pr: 1, st: 1, im: 1,
    pact: "el Dr. Federer revela el error nocturno completo y la botella junto a la cama",
    pprops: "botella grande sobre la mesa de luz",
    bstock: "botella grande de agua junto a la cama en la penumbra nocturna", bimg: "ciclo nocturno: vejiga llena, despertar, beber por rutina, repetir",
    heroes: [
      { fam: "loop_cycle", dl: 9, seed: "pasar casi todo el dia bebiendo poco y pagar esa deuda durante la cena", copy: "Beber poco todo el dia, pagar en la cena" },
      { fam: "cause_chain", dl: 8, seed: "se acuesta con la vejiga llena, se levanta dos o tres veces y pierde sueno", copy: "Vejiga llena: se levanta y pierde sueno" },
    ],
  },
  {
    id: "s18-plan", name: "Plan de 7 dias + resumen + CTA", seed: "Vamos a convertirlo en un plan para los proximos siete dias",
    objetivo: "Bajar el plan de ocho pasos, el resumen honesto y la CTA de comentarios, suscripcion y compartir.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer resume el plan de siete dias e invita a comentar y compartir",
    pprops: "checklist impreso en la mano",
    bstock: "hombre mayor anota su registro de agua en una libreta por la manana", bimg: "checklist de ocho pasos del plan de hidratacion marcados en orden",
    heroes: [
      { fam: "checklist_plan", dl: 9, seed: "Distribuya cantidades pequenas o moderadas durante la manana y la tarde", copy: "Reparte cantidades moderadas: manana y tarde" },
      { fam: "safety_boundary", dl: 8, seed: "No use alcohol como estimulante sexual. Puede producir exactamente el efecto contrario", copy: "No uses alcohol como estimulante sexual" },
      { fam: "dose_meter", dl: 7, seed: "El agua puede quitar un freno cuando faltaba. No es afrodisiaca", copy: "El agua quita un freno: no es afrodisiaca" },
    ],
  },
];

// ── mechanics: boundaries, interleave, transitions ──────────────────────────
const bounds = sections.map((s) => boundaryIndex(s.seed));
for (let i = 1; i < bounds.length; i++) if (bounds[i] <= bounds[i - 1]) throw new Error(`section boundaries not ascending at ${sections[i].id}`);

const TRANSITIONS = ["none", "whip", "lift", "none", "iris", "fold", "none", "whip", "iris", "lift"];
const roundRobin = (pools) => {
  const out = [], copies = pools.map((p) => [...p]);
  let more = true;
  while (more) {
    more = false;
    for (const p of copies) if (p.length) { out.push(p.shift()); more = true; }
  }
  return out;
};

let gi = 0;
const idFor = (sec, k) => `${sec.id.split("-")[0]}m${String(k + 1).padStart(2, "0")}`;
const moments = [];

sections.forEach((sec, si) => {
  const a = bounds[si];
  const b = si + 1 < bounds.length ? bounds[si + 1] : N;

  const avatars = Array.from({ length: sec.av }, () => ({ kind: "avatar_full" }));
  const stocks = Array.from({ length: sec.st }, () => ({ kind: "clean_stock" }));
  const presenters = Array.from({ length: sec.pr }, () => ({ kind: "presenter_action" }));
  const images = Array.from({ length: sec.im }, () => ({ kind: "clean_image" }));
  const nh = roundRobin([avatars, stocks, presenters, images]);
  const M = nh.length;
  nh.forEach((m, j) => { m.window = autoWindow(a, b, j, M); });

  const heroObjs = sec.heroes.map((h) => {
    const window = windowFromSeed(h.seed);
    // guardrails mirroring the validators so a bad hand-authored copy fails here, not downstream
    const wWords = (h.copy.match(/[\p{L}\p{N}'-]+/gu) || []).length;
    if (h.copy.length > 72 || wWords > 10) throw new Error(`${sec.id} hero copy too long: "${h.copy}"`);
    const anchorTerms = new Set(meaningful(window));
    const visibleTerms = meaningful(`${h.copy} ${h.sub || ""}`);
    const overlap = visibleTerms.filter((w) => anchorTerms.has(w)).length;
    const required = Math.min(2, visibleTerms.length, anchorTerms.size);
    if (required > 0 && overlap < required) throw new Error(`${sec.id} hero copy not anchored (${overlap}/${required}) copy="${h.copy}" window="${window}"`);
    return { ...h, window };
  });

  // insert heroes into interior gaps so no two heroes are adjacent and the section starts/ends clean
  const order = [...nh];
  const positions = heroObjs.map((_, k) => Math.round(((k + 1) * nh.length) / (heroObjs.length + 1)));
  positions.forEach((pos, k) => { order.splice(Math.min(order.length - 0, pos + k), 0, heroObjs[k]); });

  order.forEach((m, k) => {
    const id = idFor(sec, k);
    const transition = TRANSITIONS[gi % TRANSITIONS.length];
    gi++;
    if (m.kind === "avatar_full") {
      moments.push({
        id, visual_type: "avatar_full", transition, narration_match: m.window,
        camera: "push-in Ken-Burns lento", dur_s: 5,
        visual: sec.pact ? `${sec.name}: avatar full anclado a la narracion` : sec.name,
        detail: si === 0 && k === 0 ? "frame 0 avatar full ~1.4s, luego AvatarScrimText sobre avatar oscurecido durante el scrim" : "avatar full, capa densa de b-roll debajo",
      });
    } else if (m.kind === "presenter_action") {
      moments.push({
        id, visual_type: "presenter_action", transition, narration_match: m.window, overlay_policy: "none",
        action: sec.pact, location: "consultorio clinico teal/blanco", framing: "plano medio a la altura del pecho",
        props: sec.pprops, identity_ref: AVATAR_ID, dur_s: 5,
        visual: sec.pact, detail: "presentador realizando la accion narrada, sin texto encima",
      });
    } else if (m.kind === "clean_stock") {
      moments.push({
        id, visual_type: "clean_stock", transition, narration_match: m.window, overlay_policy: "none",
        source: "pexels", dur_s: 5, visual: sec.bstock, detail: "metraje limpio a pantalla completa, sin overlay",
      });
    } else if (m.kind === "clean_image") {
      moments.push({
        id, visual_type: "clean_image", transition, narration_match: m.window, overlay_policy: "none",
        source: "gptimage", dur_s: 3.6, visual: sec.bimg, detail: "foto/ilustracion limpia a pantalla completa, sin overlay",
      });
    } else {
      moments.push({
        id, visual_type: "hero_component", transition, narration_match: m.window, overlay_policy: "editorial_only",
        layout_family: m.fam, component_family: m.fam, component_identifier: m.fam,
        depth_layers: m.dl, on_screen_copy: m.copy, ...(m.sub ? { editorial_sub: m.sub } : {}),
        importance: "high", primary_motion: "reveal por capas con parallax", camera: "encuadre fijo con drift sutil",
        entry: "lift/iris segun transicion", exit: "corte limpio", dur_s: m.dl >= 8 ? 7 : 6,
        visual: FAMILY_DESC[m.fam], detail: HERO_DETAIL,
      });
    }
  });
});

// ── DIRECTOR DECISION (one pass, topic-specific) ────────────────────────────
const director_decision = {
  content_signature: "Agua e intimidad despues de los 60: el argumento es que el AGUA no es afrodisiaco sino terreno; corrige una deshidratacion leve que restaba energia, pero el verdadero enemigo es la MALA DISTRIBUCION -beber poco de dia y saldar la deuda en la cena- que rompe el sueno y hunde la libido.",
  visual_thesis: "Cada afirmacion se convierte en evidencia clinica visible -diagramas de mecanismo, escalas de dosis y color, cadenas causales y limites de seguridad- sobre un avatar-medico continuo con look clinico teal/blanco; el texto solo aparece como rotulo editorial, nunca como subtitulo de la narracion.",
  pacing_profile: "Ritmo docente y respirado: cortes de 4.5 a 6.5 s, aire de avatar full entre bloques, y una firma hero de 6-9 capas cada 60-90 s en los picos (manguera, escala de orina, cadena de la sal, ciclo nocturno).",
  presenter_role: "El Dr. Federer -medico general, tono cercano de confianza- es el ancla humana continua: presenta, demuestra la accion narrada (vaso, manguera, jarra graduada) y sostiene la autoridad; solo FULL, HIDDEN o SPLIT, jamas en recuadro ni PiP.",
  stock_role: "El metraje limpio y las fotos aportan el terreno concreto -vasos, cocina de la manana, cena salada, botella junto a la cama, caminata- a pantalla completa y sin overlay, para que la evidencia respire y no compita con texto.",
  component_roles: [
    "mechanism_diagram y anatomy_callout: explicar el mecanismo vascular/nervioso y prostata-vejiga que sostiene la ereccion",
    "dose_meter y daily_timeline: volver tangible la distribucion del agua y las cantidades moderadas por franja horaria",
    "urine_color_scale y body_signal_grid: convertir las senales del cuerpo en una lectura calibrada y observable",
    "cause_chain y loop_cycle: mostrar la trampa nocturna como una cadena y un ciclo que se retroalimentan",
    "safety_boundary y med_interaction_panel: marcar los limites medicos, las urgencias y el efecto de los medicamentos",
    "myth_vs_fact y comparison_scale: derribar los mitos del agua especial y comparar escenarios reales",
  ],
  signature_beats: [
    { narration_match: "el corazon participa como bomba. Los vasos son las tuberias", visual_strategy: "mechanism_diagram de 9 capas: manguera real que se transforma en corazon-bomba, vasos-tuberia y sangre-volumen, con flujo animado hasta el extremo." },
    { narration_match: "mucha sal, mucha sed, mucha agua, vejiga llena y sueno fragmentado", visual_strategy: "cause_chain de eslabones que se encadenan uno a uno hasta la vejiga llena y el sueno roto, sincronizada al ms de cada palabra." },
    { narration_match: "pasar casi todo el dia bebiendo poco y pagar esa deuda durante la cena", visual_strategy: "loop_cycle nocturno de 9 capas: el dia de deficit gira hacia la cena, la vejiga llena y los despertares, cerrando el ciclo que se repite." },
    { narration_match: "un amarillo claro es compatible con una hidratacion razonable", visual_strategy: "urine_color_scale calibrada con marcador movil que se detiene en el amarillo claro y contrasta transparente vs oscuro." },
  ],
  sfx_policy: {
    mode: "restringido y diegetico: solo whooshes suaves en las transiciones hero y un tick sutil al marcar pasos/checklist; jamas musica que tape la voz clinica, sin stingers de alarma.",
    strategy: "sonido al servicio de la claridad, no del susto",
  },
  anti_patterns: [
    "avatar en recuadro/PiP o cornerTR: solo FULL, HIDDEN o SPLIT halfR",
    "subtitulos, karaoke o transcripcion palabra por palabra de la narracion en pantalla",
    "fondo oscurecido + tarjeta redondeada + titulo arriba a la izquierda como plantilla repetida",
    "texto encima del metraje limpio o del presentador por defecto",
    "rotar la autoridad a urologo/especialista: el presentador es medico general y el villano es comercial, no medico",
  ],
  avatar_contract: {
    avatar_engine: "avatar_iii",
    voice_engine: "eleven_v3",
    identity_id: AVATAR_ID,
    look_id: LOOK_ID,
    voice_id: VOICE_ID,
    framing_rule: "solo FULL / HIDDEN / SPLIT halfR — cero recuadro/PiP",
    voice_policy: "exact",
  },
};

const plan = {
  version: 3,
  kind: "bagasy.visual_plan",
  slug: SLUG,
  title: "Un Urologo Revela Como Beber Agua para Mejorar tu Libido Despues de los 60",
  kit: "federer-video",
  fps: 30,
  target_moments: moments.length,
  median_cue_seconds: 5,
  director_decision,
  sections: sections.map((sec, si) => ({
    id: sec.id,
    name: sec.name,
    objetivo: sec.objetivo,
    moments: moments.filter((m) => m.id.startsWith(sec.id.split("-")[0] + "m")),
  })),
};

// sanity: rebuild section->moments mapping deterministically (ids are s01m.. etc)
const bySection = new Map(sections.map((s) => [s.id.split("-")[0], []]));
for (const m of moments) bySection.get(m.id.slice(0, 3)).push(m);
plan.sections = sections.map((sec) => ({
  id: sec.id, name: sec.name, objetivo: sec.objetivo,
  moments: bySection.get(sec.id.split("-")[0]),
}));

mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
const outPath = path.join(ROOT, "_v3", `${SLUG}_plan.json`);
writeFileSync(outPath, JSON.stringify(plan, null, 2));

// ── compact local report (mirrors gate metrics) ─────────────────────────────
const counts = {};
for (const m of moments) counts[m.visual_type] = (counts[m.visual_type] || 0) + 1;
const total = moments.length;
const fams = new Set(moments.filter((m) => m.visual_type === "hero_component").map((m) => m.layout_family));
const secWithPresenter = new Set(plan.sections.filter((s) => s.moments.some((m) => m.visual_type === "presenter_action")).map((s) => s.id));
console.log(`plan -> ${outPath}`);
console.log(`moments: ${total}`);
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(18)} ${v}  ${(100 * v / total).toFixed(1)}%`);
console.log(`clean_media(stock+image): ${(((counts.clean_stock || 0) + (counts.clean_image || 0)) / total * 100).toFixed(1)}%`);
console.log(`hero families: ${fams.size}  | sections: ${plan.sections.length}  | sections w/presenter: ${secWithPresenter.size}`);
