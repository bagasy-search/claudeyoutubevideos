// visual_plan_v4qsqjivs53o.mjs — DETERMINISTIC visual-plan writer for job v4qsqjivs53o.
// "6 Ejercicios ÚNICOS para construir Músculo / Hombres de 40+" — canal Federer Building, kit federer-fluid.
// One Director Pass persisted as data; run once to emit _v3/<slug>_plan.json.
// Mapping mirrors the proven v68a7e4bfb40 plan: component_identifier = component_family = Fed type
// (the gate derives the RENDERED component from component_family by name), layout_family = topic family,
// plus per-component payloads (items / value / step+total / image_b). Mechanics computed so every
// narration_match is a verbatim slice and the mix hits the V3 + Premium gates.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SLUG = "v4qsqjivs53o";
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
// fed = Fed component actually rendered (also written to component_family so the gate recognises it).
// lf  = topic layout family (≥10 distinct, feeds distinct_component_families). Optional payloads per Fed type.
const LF_DESC = {
  headline_number: "cifra grande de apertura: seis ejercicios cubren casi toda la musculatura",
  plan_paper_vs_real: "comparacion papel vs realidad: el programa que luce completo contra el que se sostiene",
  six_pillar_cards: "tarjetas de los seis patrones humanos basicos reveladas una a una",
  muscle_loss_mechanism: "diagrama del musculo que se pierde cuando dejamos de exigirlo",
  chapter_ex1: "capitulo de seccion: Ejercicio 1, sentadilla a la silla",
  squat_muscle_map: "mapa muscular de la sentadilla: cuadriceps y gluteos encendidos",
  squat_steps: "secuencia de la sentadilla a la silla paso a paso",
  chapter_ex2: "capitulo de seccion: Ejercicio 2, bisagra de cadera",
  hinge_steps: "secuencia de la bisagra de cadera: rodillas quietas, cadera atras",
  hinge_substitute_safety: "checklist de sustitucion segura de la bisagra por puente de gluteos",
  chapter_ex3: "capitulo de seccion: Ejercicio 3, flexion inclinada",
  incline_reps_meter: "medidor de repeticiones objetivo para la flexion inclinada",
  incline_difficulty_scale: "escala de dificultad de la flexion segun la altura de la superficie",
  chapter_ex4: "capitulo de seccion: Ejercicio 4, remo con mancuerna",
  row_muscle_map: "mapa muscular del remo: espalda, hombro posterior y codo",
  row_path_steps: "trayectoria del remo: mancuerna al costado del torso con control",
  accessory_cards: "tarjetas de accesorios opcionales: pantorrilla y triceps",
  structure_vs_accessories: "pizarra de la casa: seis pilares estructura, accesorios adornos",
  chapter_ex5: "capitulo de seccion: Ejercicio 5, prensa sobre la cabeza",
  press_muscle_map: "mapa muscular del press: hombros y triceps por encima de la cabeza",
  press_pain_stop: "checklist de senales de alarma al elevar el brazo",
  chapter_ex6: "capitulo de seccion: Ejercicio 6, paseo del granjero",
  carry_timer: "cronometro del paseo del granjero: veinte a cuarenta segundos",
  carry_balance_safety: "checklist de equilibrio antes de caminar cargado",
  dose_meter: "medidor de dosis inicial: dos series por ejercicio, dos veces por semana",
  split_routine: "rutina de dos bloques repartida en la semana",
  progression_ladder: "escalera de progresion: mismo peso hasta el tope del rango",
  one_change_rule: "regla de una sola variable por sesion",
  honest_limits: "checklist de limites honestos del programa de seis",
  sleep_protein_cards: "tarjetas de sueno y proteina que sostienen la recuperacion",
  medical_preclearance: "checklist de senales para pedir orientacion medica antes de empezar",
  breathing_valsalva: "pizarra de la respiracion: exhalar en la parte dificil",
  error_effort_scale: "balanza del error: peso por orgullo o miedo sin medir el esfuerzo",
  reps_in_reserve: "pizarra de repeticiones en reserva: cortar con dos o tres en el tanque",
  reserve_number: "cifra de la zona util entre ambos extremos",
  progress_not_weight: "comparacion de progreso: misma carga, recorrido mas estable",
  notebook_progress: "tarjeta de la libreta que muestra el avance antes que el espejo",
  six_step_plan: "secuencia del plan de seis pasos para la proxima sesion",
  first_weeks_checklist: "checklist de las primeras semanas: dos series, dos veces",
  progress_number: "cifra del tope del rango dejando dos o tres repeticiones",
  channel_identity: "rotulo de identidad del canal Federer Building",
  cta_close: "cierre con invitacion a comentar el ejercicio mas dificil",
};
const HERO_DETAIL = "6-9 capas independientes accionadas por frame: camara, entrada de tarjetas, conectores, reveal de datos, luz y textura; anclado al ms de la narracion.";

const sections = [
  { id: "s01-hook", name: "Hook / la promesa y el error", seed: "Seis ejercicios bien elegidos pueden poner a trabajar",
    objetivo: "Ganar los primeros segundos: seis ejercicios cubren casi todo, y anticipar el error incomodo del final.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer, de pie en un espacio de entrenamiento sobrio, mira a camara y plantea la promesa de solo seis movimientos",
    pprops: "un par de mancuernas y una silla firme a un costado",
    bstock: "hombre maduro entrenando con mancuernas en un gimnasio casero con luz tenue",
    bimg: "seis mancuernas alineadas sobre un piso de madera, look cinematografico oscuro",
    heroes: [
      { fed: "FedStat", lf: "headline_number", seed: "Seis ejercicios bien elegidos pueden poner a trabajar casi toda la musculatura", copy: "Seis ejercicios, casi toda la musculatura", value: "6" },
      { fed: "FedBeforeAfter", lf: "plan_paper_vs_real", seed: "la diferencia entre un programa que luce completo sobre el papel", copy: "Programa completo en papel vs. sostenible", image_b: "un plan realmente sostenible de seis movimientos anotado a mano" },
    ] },
  { id: "s02-porque40", name: "Por que despues de los 40 + seis pilares", seed: "Despues de los cuarenta comienza a ser mas facil perder musculo",
    objetivo: "El musculo se pierde si dejamos de exigirlo; el cuerpo solo necesita seis patrones basicos.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer enumera con la mano los seis patrones basicos del movimiento humano",
    pprops: "sin props, gesto de enumerar los pilares en el aire",
    bstock: "hombre mayor levantandose de una silla y caminando con energia en casa",
    bimg: "seis siluetas de patrones de movimiento sobre fondo oscuro con acento teal",
    heroes: [
      { fed: "FedHero", lf: "six_pillar_cards", seed: "ponerse de pie, inclinar la cadera, empujar, tirar, levantar algo por encima de la cabeza", copy: "Los seis pilares: inclinar, empujar, tirar",
        items: ["Pararse", "Bisagra de cadera", "Empujar", "Tirar", "Press sobre la cabeza", "Acarreo"] },
      { fed: "FedMolecule", lf: "muscle_loss_mechanism", seed: "comienza a ser mas facil perder musculo si dejamos de exigirlo", copy: "Sin exigirlo, el musculo se pierde facil" },
    ] },
  { id: "s03-ex1", name: "Ejercicio 1 · Sentadilla a la silla", seed: "El primer ejercicio es la sentadilla hacia una silla",
    objetivo: "Sentadilla a silla: cuadriceps y gluteos, con la silla como referencia de recorrido.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer demuestra la sentadilla hacia una silla firme, bajando con control y volviendo a ponerse de pie",
    pprops: "una silla firme detras y una mancuerna sostenida frente al pecho",
    bstock: "hombre mayor haciendo sentadillas hacia una silla en su sala",
    bimg: "primer plano de rodillas alineadas con las puntas de los pies en una sentadilla",
    heroes: [
      { fed: "FedChapter", lf: "chapter_ex1", seed: "El primer ejercicio es la sentadilla hacia una silla", copy: "Ejercicio 1: sentadilla hacia la silla" },
      { fed: "FedMolecule", lf: "squat_muscle_map", seed: "Este movimiento desarrolla principalmente los cuadriceps y los gluteos", copy: "Sentadilla: cuadriceps y gluteos" },
      { fed: "FedStep", lf: "squat_steps", seed: "Lleve la cadera atras y flexione las rodillas. Toque la silla con suavidad", copy: "Cadera atras, flexiona rodillas, toca la silla", step: 1, total: 3 },
    ] },
  { id: "s04-ex2", name: "Ejercicio 2 · Bisagra de cadera", seed: "Es la bisagra de cadera, realizada como peso muerto rumano",
    objetivo: "Bisagra de cadera: la cadera viaja atras, no es agacharse; sustitucion segura si duele.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer demuestra la bisagra de cadera llevando el gluteo hacia atras con las mancuernas cerca de los muslos",
    pprops: "dos mancuernas descendiendo cerca de los muslos, una pared de referencia detras",
    bstock: "hombre mayor practicando la bisagra de cadera frente a una pared en casa",
    bimg: "vista lateral de la cadera viajando hacia atras con la espalda en linea neutra",
    heroes: [
      { fed: "FedChapter", lf: "chapter_ex2", seed: "Es la bisagra de cadera, realizada como peso muerto rumano", copy: "Ejercicio 2: bisagra de cadera (peso muerto)" },
      { fed: "FedStep", lf: "hinge_steps", seed: "las rodillas se flexionan un poco, pero la cadera viaja hacia atras", copy: "Rodillas quietas; la cadera viaja hacia atras", step: 1, total: 3 },
      { fed: "FedChecklist", lf: "hinge_substitute_safety", seed: "Puede sustituirse por un puente de gluteos en el suelo", copy: "Sustituye por un puente de gluteos",
        items: ["Si duele o hay cirugia reciente", "Puente de gluteos en el suelo", "Conserva el trabajo de cadera"] },
    ] },
  { id: "s05-ex3", name: "Ejercicio 3 · Flexion inclinada", seed: "El tercer ejercicio es una flexion inclinada",
    objetivo: "Flexion inclinada: pecho, triceps y hombros; la dificultad se ajusta con la altura.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer demuestra una flexion inclinada apoyando las manos en una superficie firme a altura segura",
    pprops: "una mesa firme o barra a altura media como punto de apoyo",
    bstock: "hombre mayor haciendo flexiones inclinadas contra una encimera de cocina",
    bimg: "cuerpo alineado de la cabeza a los talones apoyado en una superficie elevada",
    heroes: [
      { fed: "FedChapter", lf: "chapter_ex3", seed: "El tercer ejercicio es una flexion inclinada", copy: "Ejercicio 3: flexion inclinada" },
      { fed: "FedStat", lf: "incline_reps_meter", seed: "Busque entre ocho y quince repeticiones", copy: "Objetivo: entre ocho y quince repeticiones", value: "8-15" },
      { fed: "FedBeforeAfter", lf: "incline_difficulty_scale", seed: "Cuanto mas alta este la superficie, mas accesible sera", copy: "Superficie mas alta, flexion mas accesible", image_b: "cuerpo mas horizontal, la flexion inclinada mucho mas exigente" },
    ] },
  { id: "s06-ex4", name: "Ejercicio 4 · Remo con mancuerna", seed: "El cuarto ejercicio es el remo con una mancuerna",
    objetivo: "Remo: espalda, hombro posterior y codo (ahi trabaja el biceps); apoyo estable y control.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer demuestra el remo con una mano apoyada en un banco pesado, llevando el codo hacia el bolsillo trasero",
    pprops: "una mancuerna y un banco firme donde apoyar una mano",
    bstock: "hombre mayor haciendo remo con mancuerna apoyado en un banco robusto",
    bimg: "primer plano del codo viajando hacia el costado del torso durante un remo",
    heroes: [
      { fed: "FedChapter", lf: "chapter_ex4", seed: "El cuarto ejercicio es el remo con una mancuerna", copy: "Ejercicio 4: remo con mancuerna" },
      { fed: "FedMolecule", lf: "row_muscle_map", seed: "El remo fortalece la espalda, la parte posterior del hombro y los flexores del codo", copy: "Remo: espalda, hombro posterior y codo" },
      { fed: "FedStep", lf: "row_path_steps", seed: "lleve la mancuerna hacia el costado del torso. Despues bajela con control", copy: "Mancuerna al costado del torso, baja con control", step: 1, total: 3 },
    ] },
  { id: "s07-accesorios", name: "Accesorios vs. estructura", seed: "Aqui es donde muchos programas empiezan a llenarse de adornos",
    objetivo: "El curl y otros accesorios son opcionales: los seis son la estructura de la casa.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer compara con las manos la estructura de una casa y los cuadros que cuelgan de la pared",
    pprops: "sin props, gesto de contraste estructura contra adorno",
    bstock: "hombre mayor haciendo un curl de biceps corto como accesorio final",
    bimg: "estructura de una casa dibujada con cuadros pequenos colgados como adornos",
    heroes: [
      { fed: "FedHero", lf: "accessory_cards", seed: "Lo mismo vale para elevaciones de pantorrilla o extensiones de triceps", copy: "Accesorios: pantorrilla y extensiones de triceps",
        items: ["Curl de biceps", "Elevaciones de pantorrilla", "Extensiones de triceps"] },
      { fed: "FedWhiteboard", lf: "structure_vs_accessories", seed: "Los seis movimientos principales son la estructura de la casa", copy: "Seis movimientos: la estructura de la casa" },
    ] },
  { id: "s08-ex5", name: "Ejercicio 5 · Press sobre la cabeza", seed: "El quinto ejercicio es la prensa con mancuernas por encima de la cabeza",
    objetivo: "Press de hombros: hombros y triceps; es el que mas necesita adaptacion individual.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer demuestra el press de mancuernas sobre la cabeza, sentado con respaldo y costillas tranquilas",
    pprops: "dos mancuernas cerca de los hombros y un banco con respaldo",
    bstock: "hombre mayor haciendo press de hombros con mancuernas sentado con respaldo",
    bimg: "vista frontal de un press de mancuernas sin arquear la espalda, look clinico",
    heroes: [
      { fed: "FedChapter", lf: "chapter_ex5", seed: "El quinto ejercicio es la prensa con mancuernas por encima de la cabeza", copy: "Ejercicio 5: prensa por encima de la cabeza" },
      { fed: "FedMolecule", lf: "press_muscle_map", seed: "Esta prensa trabaja hombros y triceps", copy: "El press trabaja hombros y triceps" },
      { fed: "FedChecklist", lf: "press_pain_stop", seed: "Si elevar el brazo provoca dolor intenso, bloqueo, perdida repentina de fuerza", copy: "Brazo: dolor, bloqueo o perdida de fuerza",
        items: ["Dolor intenso o bloqueo", "Perdida repentina de fuerza", "Dolor que baja por el brazo"] },
    ] },
  { id: "s09-ex6", name: "Ejercicio 6 · Paseo del granjero", seed: "Es el paseo del granjero",
    objetivo: "Paseo del granjero: agarre, antebrazos, tronco y estabilidad; el agarre decide, no la gravedad.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer demuestra el paseo del granjero caminando con una mancuerna en cada mano y la mirada al frente",
    pprops: "dos mancuernas cargadas cerca de los costados del cuerpo",
    bstock: "hombre mayor caminando con una mancuerna en cada mano por un pasillo despejado",
    bimg: "primer plano de dos manos aferrando mancuernas pesadas durante una caminata",
    heroes: [
      { fed: "FedChapter", lf: "chapter_ex6", seed: "Es el paseo del granjero", copy: "El paseo del granjero: mancuerna en cada mano" },
      { fed: "FedStat", lf: "carry_timer", seed: "camine con pasos tranquilos durante veinte a cuarenta segundos", copy: "Camina veinte a cuarenta segundos por serie", value: "20-40 s" },
      { fed: "FedChecklist", lf: "carry_balance_safety", seed: "Si el equilibrio no es confiable, no camine cargado", copy: "Equilibrio no confiable: no camine cargado",
        items: ["Equilibrio no confiable: no caminar", "Sostener quieto junto a una pared", "Empezar con poco peso"] },
    ] },
  { id: "s10-dosis", name: "La dosis: series, frecuencia, bloques", seed: "Puede entrenarlos dos dias por semana",
    objetivo: "Dos o tres dias, comenzar con dos series, o alternar dos bloques en la semana.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer marca en el aire los dos dias de entrenamiento y el dia de recuperacion entre ellos",
    pprops: "un calendario semanal simple como referencia",
    bstock: "hombre mayor anotando su rutina semanal en una libreta sobre la mesa",
    bimg: "calendario semanal con dos dias de entrenamiento y un dia de descanso marcados",
    heroes: [
      { fed: "FedStat", lf: "dose_meter", seed: "Comience con dos series por ejercicio durante las primeras dos o tres semanas", copy: "Empieza con dos series por ejercicio", value: "2 series" },
      { fed: "FedStep", lf: "split_routine", seed: "En el primer dia haga sentadilla, flexion inclinada y remo", copy: "Dia 1: sentadilla, flexion inclinada y remo", step: 1, total: 2 },
    ] },
  { id: "s11-progresion", name: "Progresion + libreta", seed: "La progresion puede seguir una regla muy sencilla",
    objetivo: "Mantener el peso hasta el tope del rango, luego subir; cambiar una sola variable por vez.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer explica la regla de progresion senalando el rango de repeticiones en el aire",
    pprops: "una libreta abierta con series y repeticiones anotadas",
    bstock: "hombre mayor cargando un poco mas de peso en una mancuerna ajustable",
    bimg: "libreta con columnas de ejercicio, peso y repeticiones anotadas a mano",
    heroes: [
      { fed: "FedWhiteboard", lf: "progression_ladder", seed: "Mantenga el mismo peso hasta lograr doce repeticiones en todas las series", copy: "Mismo peso hasta doce repeticiones limpias" },
      { fed: "FedStep", lf: "one_change_rule", seed: "cambie una sola cosa a la vez", copy: "Cambia una sola cosa a la vez", step: 1, total: 4 },
    ] },
  { id: "s12-limites", name: "Limites honestos + sueno y proteina", seed: "Hay otro limite honesto",
    objetivo: "Seis cubren una base, no todos los objetivos; el cuerpo necesita energia y proteina.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer aclara con calma que este plan tiene limites y no reemplaza sueno ni alimentacion",
    pprops: "un plato con alimentos ricos en proteina sobre la mesa",
    bstock: "hombre mayor durmiendo tranquilo y luego desayunando alimentos con proteina",
    bimg: "plato equilibrado con fuentes de proteina junto a un reloj de descanso",
    heroes: [
      { fed: "FedChecklist", lf: "honest_limits", seed: "Seis ejercicios cubren una base extraordinaria, pero no todos los objetivos particulares", copy: "Seis ejercicios: base amplia, no todo objetivo",
        items: ["Objetivos avanzados piden mas volumen", "Condiciones medicas: seleccion distinta", "Cada deporte pide capacidades propias"] },
      { fed: "FedHero", lf: "sleep_protein_cards", seed: "El cuerpo necesita energia y proteina para responder", copy: "El cuerpo necesita energia y proteina",
        items: ["Sueno suficiente", "Proteina en cada comida", "El entrenamiento solo envia la senal"] },
    ] },
  { id: "s13-seguridad", name: "Seguridad: cuando parar", seed: "Antes de iniciar un programa nuevo, busque orientacion medica",
    objetivo: "Senales para pedir orientacion medica y respirar bien: exhalar en la parte dificil.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer, en tono serio, enumera las senales de alarma que obligan a detener la sesion",
    pprops: "sin props, tono grave y directo a camara",
    bstock: "hombre mayor deteniendo su entrenamiento y llevandose la mano al pecho",
    bimg: "iconos de senales de alarma: pecho, mareo y falta de aire sobre fondo oscuro",
    heroes: [
      { fed: "FedChecklist", lf: "medical_preclearance", seed: "busque orientacion medica si tiene dolor o presion en el pecho", copy: "Consulta medica si hay dolor o presion",
        items: ["Dolor o presion en el pecho", "Cirugia o fractura reciente", "Desmayos sin explicacion"] },
      { fed: "FedWhiteboard", lf: "breathing_valsalva", seed: "exhale al superar la parte dificil. Evite contener la respiracion", copy: "Exhale al superar la parte dificil" },
    ] },
  { id: "s14-error", name: "El error prometido", seed: "Y aqui esta el error prometido",
    objetivo: "El error: elegir el peso por orgullo o miedo sin medir el esfuerzo; dejar dos o tres en reserva.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer revela el error senalando la mancuerna demasiado pesada y la demasiado liviana",
    pprops: "una mancuerna muy pesada y una muy liviana sobre la mesa",
    bstock: "hombre mayor balanceando el cuerpo con una mancuerna demasiado pesada",
    bimg: "balanza que enfrenta el orgullo del peso excesivo contra el miedo al esfuerzo",
    heroes: [
      { fed: "FedBeforeAfter", lf: "error_effort_scale", seed: "Es elegir el peso por orgullo o por miedo, sin medir el esfuerzo real", copy: "Peso por orgullo o miedo, sin medir esfuerzo", image_b: "elegir el peso midiendo el esfuerzo real de la serie" },
      { fed: "FedWhiteboard", lf: "reps_in_reserve", seed: "Termine la mayoria de las series cuando crea que todavia podria hacer aproximadamente dos o tres repeticiones", copy: "Corta la serie con dos o tres repeticiones" },
      { fed: "FedStat", lf: "reserve_number", seed: "La zona util suele estar entre ambos extremos", copy: "La zona util esta entre ambos extremos", value: "2-3 RIR" },
    ] },
  { id: "s15-progreso", name: "Progresar no es solo mas peso", seed: "progresar no significa anadir peso en cada sesion",
    objetivo: "La mejora tambien es mismo peso con recorrido mas estable; la libreta lo muestra antes que el espejo.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer muestra que un recorrido mas estable ya es progreso, con la libreta en la mano",
    pprops: "una libreta con el registro de varias sesiones",
    bstock: "hombre mayor repitiendo el mismo peso con una tecnica visiblemente mas firme",
    bimg: "dos repeticiones lado a lado: una temblorosa y otra estable con la misma carga",
    heroes: [
      { fed: "FedBeforeAfter", lf: "progress_not_weight", seed: "A veces la mejora es hacer la misma carga con un recorrido mas estable", copy: "Mejora: misma carga, recorrido mas estable", image_b: "una repeticion adicional sin balancearse, con tecnica mas firme" },
      { fed: "FedHero", lf: "notebook_progress", seed: "La libreta permite verlo antes de que el espejo lo muestre", copy: "La libreta lo muestra antes que el espejo",
        items: ["Ejercicio, peso y repeticiones", "Repeticiones limpias en reserva", "El musculo se construye lento"] },
    ] },
  { id: "s16-plan", name: "Plan de accion + primeras semanas", seed: "Asi que este es su plan de accion",
    objetivo: "El plan de seis pasos y el arranque: dos series de cada uno, dos veces por semana.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer repasa el plan de seis pasos marcando cada movimiento con los dedos",
    pprops: "un checklist impreso con los seis pasos en la mano",
    bstock: "hombre mayor siguiendo una lista de seis ejercicios pegada en la pared",
    bimg: "checklist de seis pasos del plan de entrenamiento marcados en orden",
    heroes: [
      { fed: "FedStep", lf: "six_step_plan", seed: "Elija una variante segura de sentadilla hacia una silla", copy: "Paso 1: sentadilla segura hacia una silla", step: 1, total: 6 },
      { fed: "FedChecklist", lf: "first_weeks_checklist", seed: "haga dos series de cada uno, dos veces por semana", copy: "Dos series de cada uno, dos veces por semana",
        items: ["2 series de cada ejercicio", "2 veces por semana", "Anota peso y repeticiones"] },
      { fed: "FedStat", lf: "progress_number", seed: "Cuando complete el extremo alto del rango dejando dos o tres repeticiones posibles", copy: "Extremo alto del rango: deja dos o tres", value: "8-12" },
    ] },
  { id: "s17-cta", name: "Cierre + CTA", seed: "Guarde este video para tener la secuencia",
    objetivo: "Guardar, suscribirse a Federer Building y comentar cual de los seis movimientos cuesta mas.",
    av: 2, pr: 2, st: 2, im: 1,
    pact: "el Dr. Federer invita a camara a suscribirse y comentar el ejercicio mas dificil",
    pprops: "sin props, gesto calido de invitacion",
    bstock: "hombre mayor guardando el video en el telefono junto a sus mancuernas",
    bimg: "pantalla de canal Federer Building con boton de suscripcion, look sobrio",
    heroes: [
      { fed: "FedLowerThird", lf: "channel_identity", seed: "Suscribase a Federer Building si quiere entrenar con criterios que respetan la edad", copy: "Federer Building: entrena respetando la edad", name: "Federer Building", role: "Entrenamiento con criterio despues de los 40" },
      { fed: "FedCta", lf: "cta_close", seed: "Cuenteme en los comentarios cual de los seis movimientos le cuesta mas", copy: "Comenta cual de los seis movimientos cuesta" },
    ] },
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

let gi = 0, heroSeq = 0;
const idFor = (sec, k) => `${sec.id.split("-")[0]}m${String(k + 1).padStart(2, "0")}`;
const moments = [];

sections.forEach((sec, si) => {
  const a = bounds[si];
  const b = si + 1 < bounds.length ? bounds[si + 1] : N;

  const avatars = Array.from({ length: sec.av }, () => ({ kind: "avatar_full" }));
  const stocks = Array.from({ length: sec.st }, () => ({ kind: "clean_stock" }));
  const presenters = Array.from({ length: sec.pr }, () => ({ kind: "presenter_action" }));
  const images = Array.from({ length: sec.im }, () => ({ kind: "clean_image" }));
  const nh = roundRobin([avatars, presenters, stocks, images]);
  const M = nh.length;
  nh.forEach((m, j) => { m.window = autoWindow(a, b, j, M); });

  const heroObjs = sec.heroes.map((h) => {
    const window = windowFromSeed(h.seed);
    const wWords = (h.copy.match(/[\p{L}\p{N}'-]+/gu) || []).length;
    if (h.copy.length > 72 || wWords > 10) throw new Error(`${sec.id} hero copy too long: "${h.copy}"`);
    const anchorTerms = new Set(meaningful(window));
    const visibleTerms = meaningful(`${h.copy} ${h.sub || ""}`);
    const overlap = visibleTerms.filter((w) => anchorTerms.has(w)).length;
    const required = Math.min(2, visibleTerms.length, anchorTerms.size);
    if (required > 0 && overlap < required) throw new Error(`${sec.id} hero copy not anchored (${overlap}/${required}) copy="${h.copy}" window="${window}"`);
    return { ...h, window };
  });

  const order = [...nh];
  const positions = heroObjs.map((_, k) => Math.round(((k + 1) * nh.length) / (heroObjs.length + 1)));
  positions.forEach((pos, k) => { order.splice(Math.min(order.length, pos + k), 0, heroObjs[k]); });

  order.forEach((m, k) => {
    const id = idFor(sec, k);
    const transition = TRANSITIONS[gi % TRANSITIONS.length];
    gi++;
    if (m.kind === "avatar_full") {
      moments.push({
        id, visual_type: "avatar_full", transition, narration_match: m.window,
        camera: "push-in Ken-Burns lento", dur_s: 5,
        visual: `${sec.name}: avatar full anclado a la narracion`,
        detail: si === 0 && k === 0 ? "frame 0 avatar full ~1.4s antes de cualquier capa encima" : "avatar full continuo, escenas de profundidad debajo",
      });
    } else if (m.kind === "presenter_action") {
      moments.push({
        id, visual_type: "presenter_action", transition, narration_match: m.window, overlay_policy: "none",
        action: sec.pact, location: "espacio de entrenamiento sobrio, look dark-cinematic teal/blanco",
        framing: "plano medio a la altura del pecho", props: sec.pprops, identity_ref: AVATAR_ID, dur_s: 5,
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
      const dl = 6 + (heroSeq % 4);
      heroSeq++;
      const hero = {
        id, visual_type: "hero_component", transition, narration_match: m.window, overlay_policy: "editorial_only",
        component_identifier: m.fed, component_family: m.fed, layout_family: m.lf,
        depth_layers: dl, on_screen_copy: m.copy, ...(m.sub ? { editorial_sub: m.sub } : {}),
        importance: "signature", primary_motion: "entrada lateral en profundidad con paralaje de capas independientes",
        secondary_motion: "revelado de evidencia: tarjetas, conectores y mascaras encadenados",
        micro_motion: "foco, luz y textura respirando sin temblor de camara",
        camera: "empuje lento hacia el eje del componente", entry: "las capas entran desde fuera de cuadro y ganan foco",
        exit: "retroceden y pierden luz antes del corte", dur_s: dl >= 8 ? 7 : 6,
        visual: LF_DESC[m.lf], detail: HERO_DETAIL,
        ...(m.items ? { items: m.items } : {}),
        ...(m.value ? { value: m.value, metric_value: m.value } : {}),
        ...(m.step ? { step: m.step, total: m.total } : {}),
        ...(m.image_b ? { image_a: sec.bimg, image_b: m.image_b, comparison_query_b: m.image_b } : {}),
        ...(m.name ? { name: m.name, role: m.role } : {}),
      };
      moments.push(hero);
    }
  });
});

// ── DIRECTOR DECISION (one pass, topic-specific for THIS video) ──────────────
const director_decision = {
  content_signature: "Fuerza despues de los 40: el argumento es que SEIS patrones humanos basicos -sentadilla, bisagra, empuje, tiron, press y acarreo- construyen musculo por anos con dos o tres sesiones, y que el catalogo infinito de ejercicios y maquinas es el enemigo comercial; el error final no es entrenar liviano ni pesado, sino elegir el peso por orgullo o miedo sin medir el esfuerzo real de la serie.",
  visual_thesis: "Cada afirmacion se vuelve evidencia entrenable y visible -mapas musculares, secuencias de tecnica, medidores de series/repeticiones, escalas de dificultad, checklists de seguridad y balanzas de esfuerzo- sobre un avatar-medico continuo con look dark-cinematic; el presentador DEMUESTRA cada uno de los seis movimientos y el texto solo aparece como rotulo editorial, jamas como subtitulo.",
  pacing_profile: "Ritmo docente y respirado: cortes de 4.5 a 6.5 s, aire de avatar full al abrir cada ejercicio con FedChapter, y una firma hero de 6-9 capas cada 60-90 s en los picos (seis pilares, escalera de progresion, balanza del error, pizarra de repeticiones en reserva).",
  presenter_role: "El Dr. Federer -medico de confianza, tono cercano para hombres maduros- es el ancla humana continua: presenta, DEMUESTRA cada ejercicio (sentadilla a silla, bisagra, flexion, remo, press, paseo del granjero) y sostiene la autoridad; solo FULL, HIDDEN o SPLIT, jamas en recuadro ni PiP.",
  stock_role: "El metraje limpio y las fotos aportan el terreno concreto -gimnasio casero, mancuernas, silla firme, libreta de registro- a pantalla completa y sin overlay, para que la demostracion respire y la evidencia no compita con texto.",
  component_roles: [
    "FedChapter abre cada uno de los seis ejercicios y nunca aparece dentro de un bloque tecnico.",
    "FedMolecule enciende el mapa muscular real de cada ejercicio (cuadriceps/gluteos, cadena posterior, hombros/triceps, agarre y tronco).",
    "FedStep y FedWhiteboard convierten la tecnica y la progresion en secuencias y mecanismos verificables paso a paso.",
    "FedStat vuelve tangibles las cifras defendibles (series, repeticiones, segundos, repeticiones en reserva).",
    "FedChecklist marca los limites de seguridad, las sustituciones y las senales de alarma que obligan a parar.",
    "FedBeforeAfter compara escenarios reales (papel vs sostenible, superficie alta vs baja, orgullo vs medir el esfuerzo).",
  ],
  signature_beats: [
    { narration_match: "ponerse de pie, inclinar la cadera, empujar, tirar, levantar algo por encima de la cabeza", visual_strategy: "FedHero de 6-9 capas: los seis patrones humanos se revelan uno a uno como tarjetas con foto propia, anclados al ms de cada verbo." },
    { narration_match: "Es elegir el peso por orgullo o por miedo, sin medir el esfuerzo real", visual_strategy: "FedBeforeAfter/balanza de 8 capas que inclina entre el peso por orgullo y el peso por miedo, revelando la zona util al medir el esfuerzo." },
    { narration_match: "Mantenga el mismo peso hasta lograr doce repeticiones en todas las series", visual_strategy: "FedWhiteboard escalera de progresion escrita a mano: mismo peso hasta el tope del rango, luego un peldano mas, sincronizado a la narracion." },
    { narration_match: "Los seis movimientos principales son la estructura de la casa", visual_strategy: "FedWhiteboard de la casa: los seis pilares levantan la estructura mientras los accesorios cuelgan como cuadros que no sostienen el techo." },
  ],
  sfx_policy: {
    mode: "restringido y diegetico: solo whooshes suaves en las transiciones hero y un tick sutil al marcar pasos/checklist; jamas musica que tape la voz clinica, sin stingers de alarma.",
    forbidden: ["stingers de suspenso", "whooshes en cada corte", "musica que compita con la voz", "impactos dramaticos sobre advertencias medicas"],
    music: "lecho tonal continuo y bajo que se retira en las frenadas de avatar limpio",
  },
  anti_patterns: [
    "avatar en recuadro/PiP o cornerTR: solo FULL, HIDDEN o SPLIT",
    "subtitulos, karaoke o transcripcion palabra por palabra de la narracion en pantalla",
    "fondo oscurecido + tarjeta redondeada + titulo arriba a la izquierda como plantilla repetida",
    "texto encima del metraje limpio o del presentador por defecto",
    "prometer musculo magico o resultados sin esfuerzo: el metodo es tension, control y recuperacion medibles",
  ],
  avatar_contract: {
    avatar_engine: "avatar_iii",
    voice_engine: "eleven_v3",
    identity_id: AVATAR_ID,
    look_id: LOOK_ID,
    voice_id: VOICE_ID,
    voice_speed: "x1",
    single_studio_request: true,
    framing_rule: "solo FULL / HIDDEN / SPLIT — cero recuadro/PiP",
    voice_policy: "exact",
  },
};

const plan = {
  version: 3,
  kind: "bagasy.visual_plan",
  slug: SLUG,
  title: "6 Ejercicios ÚNICOS que Necesitas para construir Músculos / Hombres de 40 años y más",
  kit: "federer-fluid",
  fps: 30,
  target_moments: moments.length,
  median_cue_seconds: 5,
  director_decision,
  sections: [],
};

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
const heroes = moments.filter((m) => m.visual_type === "hero_component");
const lfs = new Set(heroes.map((m) => m.layout_family));
const fed = {};
for (const m of heroes) fed[m.component_family] = (fed[m.component_family] || 0) + 1;
let maxRun = 0, run = 0, prev = null;
for (const m of heroes) { if (m.component_family === prev) run++; else run = 1; prev = m.component_family; if (run > maxRun) maxRun = run; }
const secWithPresenter = plan.sections.filter((s) => s.moments.some((m) => m.visual_type === "presenter_action")).length;
console.log(`plan -> ${outPath}`);
console.log(`moments: ${total}`);
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(18)} ${v}  ${(100 * v / total).toFixed(1)}%`);
console.log(`clean_media(stock+image): ${(((counts.clean_stock || 0) + (counts.clean_image || 0)) / total * 100).toFixed(1)}%`);
console.log(`hero layout families: ${lfs.size}  | fed types: ${Object.keys(fed).length}  | max consecutive fed: ${maxRun}`);
const domFed = Math.max(...Object.values(fed));
console.log(`fed mix:`, Object.entries(fed).map(([k, v]) => `${k}=${v}`).join(" "), `| dominant ${(100 * domFed / heroes.length).toFixed(1)}%`);
console.log(`sections: ${plan.sections.length}  | sections w/presenter: ${secWithPresenter}`);
