// Plan visual determinista — slug testo6
// "Los UNICOS 6 Ejercicios para Aumentar la Testosterona / Hombres de 40+" · kit federer-fluid
// Un solo Director Pass; este script materializa esa decision (secciones + heroes) sin reabrir direccion.
import {readFileSync, writeFileSync, mkdirSync} from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SLUG = "testo6";
const JOB_ID = 0;
const TARGET_MOMENTS = 215;

const AVATAR_ID = "template:FedererBuildingYT";
const LOOK_ID = "template:FedererBuildingYT";
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

// ── Secciones: rango de parrafos, consultas de stock (ingles, Pexels-findable) y
// acciones del presentador (Federer demostrando en casa). Metadatos internos, nunca texto en pantalla.
const SECTIONS = [
  {id: "s01-hook", title: "Apertura", paras: [1, 4],
    stock: ["older man standing up slowly from a chair at home", "bottle of testosterone supplement capsules on a shelf", "senior man doing a bodyweight squat in a living room", "tired older man sitting on the edge of a bed at dawn", "alarm clock showing five hours on a nightstand", "older man carrying grocery bags up a staircase"],
    presenter: [
      {action: "se levanta de una silla firme sin usar las manos, con control", location: "sala de estar de su casa", framing: "plano entero lateral", props: ["silla firme"]},
      {action: "aparta con la mano un frasco de capsulas sobre la mesa, gesto de descarte", location: "mesa de comedor", framing: "plano medio, manos en cuadro", props: ["frasco de capsulas"]},
      {action: "senala un reloj sobre la mesa de luz mientras habla del sueno", location: "dormitorio", framing: "plano medio corto", props: ["reloj despertador"]}]},
  {id: "s02-historia", title: "La prueba: Anibal", paras: [5, 6],
    stock: ["older man looking tired at himself in a bathroom mirror", "two older men shaking hands firmly close up", "blood test tube on a clinic desk close up", "older man smiling relaxed in a living room", "doctor talking with an older male patient in an office", "warm sunlight through a window onto a wooden table"],
    presenter: [
      {action: "escucha con atencion sentado frente a su escritorio, manos entrelazadas", location: "consultorio de madera", framing: "plano medio", props: ["escritorio"]},
      {action: "da la mano con firmeza a alguien fuera de cuadro y sonrie", location: "consultorio", framing: "plano medio corto", props: []}]},
  {id: "s03-sentadilla", title: "Ejercicio uno: la sentadilla", paras: [7, 7],
    stock: ["senior man doing a squat holding a chair for balance", "leg and thigh muscles anatomy illustration dark background", "older man sitting down and standing up from a chair", "person hugging a weight plate against the chest", "close up of knees bending during a home squat", "glute muscles medical illustration dark background"],
    presenter: [
      {action: "baja en sentadilla junto a una silla, espalda recta, y vuelve a subir", location: "sala de estar", framing: "plano entero lateral", props: ["silla"]},
      {action: "abraza contra el pecho un objeto con peso y hace una sentadilla lenta", location: "sala de estar", framing: "plano entero", props: ["objeto con peso"]}]},
  {id: "s04-bisagra", title: "Ejercicio dos: la bisagra de cadera", paras: [8, 9],
    stock: ["man hinging at the hips beside a plain wall", "person picking up a bag from the floor with a straight back", "posterior chain back muscles anatomy illustration dark", "spine and lower back medical illustration dark background", "older man lifting a water jug from the ground", "suitcase being lifted with good posture"],
    presenter: [
      {action: "lleva la cadera hacia atras como para tocar la pared, espalda derecha", location: "pasillo de la casa", framing: "plano entero lateral", props: ["pared"]},
      {action: "levanta del piso un bidon doblando la cadera, no la espalda", location: "sala de estar", framing: "plano entero", props: ["bidon de agua"]}]},
  {id: "s05-empuje", title: "Ejercicio tres: el empuje", paras: [10, 10],
    stock: ["older man pressing a light object overhead at home", "person placing a box on a high shelf", "shoulder and arm muscles anatomy illustration dark background", "grandfather lifting a grandchild onto his shoulders", "two water bottles pressed overhead indoors", "overhead luggage compartment being loaded on a plane"],
    presenter: [
      {action: "empuja dos botellas de agua por encima de la cabeza, brazos estirados", location: "sala de estar", framing: "plano medio", props: ["botellas de agua"]},
      {action: "guarda una caja en un estante alto estirando los brazos", location: "cocina", framing: "plano entero", props: ["caja", "estante"]}]},
  {id: "s06-tiron", title: "Ejercicio cuatro: el tiron", paras: [11, 12],
    stock: ["senior man rowing with a resistance band indoors", "upper back and shoulder blades anatomy illustration dark", "older man hunched over a phone on a sofa", "resistance band anchored to a door frame", "person pulling a towel wrapped around a door handle", "older man standing up straight with an open chest at home"],
    presenter: [
      {action: "tira de una banda elastica anclada a la puerta juntando los omoplatos", location: "pasillo de la casa", framing: "plano medio", props: ["banda elastica", "puerta"]},
      {action: "junta los omoplatos hacia atras y abre el pecho, corrigiendo la postura", location: "sala de estar", framing: "plano medio corto", props: []}]},
  {id: "s07-sprint", title: "Ejercicio cinco: los sprints", paras: [13, 13],
    stock: ["older man walking briskly on a park path", "man sprinting on an empty street at sunrise", "stationary bicycle in a bright living room", "stopwatch showing twenty seconds close up", "senior man breathing calmly after light exercise on a bench", "gentle uphill road in a residential neighbourhood"],
    presenter: [
      {action: "pedalea con fuerza en una bicicleta fija veinte segundos y luego afloja", location: "sala de estar", framing: "plano medio", props: ["bicicleta fija"]},
      {action: "levanta la palma en gesto de pare, hablando de la advertencia del corazon", location: "consultorio", framing: "plano medio corto", props: []}]},
  {id: "s08-mecanismo", title: "Mecanismo: la grasa abdominal", paras: [14, 14],
    stock: ["abdomen and belly fat medical illustration dark background", "hormone molecule illustration on a dark background", "measuring the waist with a tape measure at home", "muscle tissue burning energy illustration dark background", "older man with a slimmer waist standing at home", "a snowball rolling downhill in winter"],
    presenter: [
      {action: "se toca la cintura y explica con las manos el circulo de la grasa", location: "consultorio", framing: "plano medio", props: []}]},
  {id: "s09-acarreo", title: "Ejercicio seis: el acarreo", paras: [15, 16],
    stock: ["two heavy shopping bags standing on a kitchen floor", "man walking down a hallway carrying two containers", "hand gripping a bag handle close up", "grip strength dynamometer being squeezed", "carrying groceries from a car to a house", "forearm and hand muscles anatomy illustration dark background"],
    presenter: [
      {action: "camina por el pasillo cargando dos bolsas pesadas, tronco firme", location: "pasillo de la casa", framing: "plano entero", props: ["dos bolsas pesadas"]},
      {action: "aprieta la mano de alguien mostrando fuerza de agarre, sonriendo", location: "consultorio", framing: "plano medio corto", props: []}]},
  {id: "s10-error", title: "El error del 90%", paras: [17, 18],
    stock: ["exhausted man sitting on the floor after training", "alarm clock showing five hours of sleep", "stress hormone cortisol illustration dark background", "wall calendar with too many training marks in a row", "man rubbing a sore shoulder at home", "older man sleeping peacefully in a dark bedroom"],
    presenter: [
      {action: "niega con la cabeza mostrando el error de entrenar agotado todos los dias", location: "consultorio", framing: "plano medio corto", props: []},
      {action: "marca tres dias no seguidos en un calendario de pared con una lapicera", location: "cocina", framing: "plano medio, calendario en cuadro", props: ["calendario", "lapicera"]}]},
  {id: "s11-enemigo", title: "El enemigo y los limites", paras: [19, 20],
    stock: ["shelf full of supplement jars and powders in a shop", "gel and pills advertised in a pharmacy window", "empty medical consultation room with a chair", "blood test report with hormone values on a desk", "pharmacist explaining a medicine to an older patient", "hand dropping coins into a jar month after month"],
    presenter: [
      {action: "deja un frasco de suplemento sobre la mesa y aprieta el puno mostrando el antebrazo", location: "consultorio", framing: "plano medio", props: ["frasco de suplemento"]},
      {action: "sostiene una hoja de analisis de sangre y la senala con calma", location: "consultorio", framing: "plano medio, hoja en cuadro", props: ["hoja de analisis"]}]},
  {id: "s12-cierre", title: "Repaso y cierre", paras: [21, 24],
    stock: ["weekly planner page with a simple training grid", "living room set up with a chair a band and a backpack", "smartphone showing a comments section on screen", "older man writing in a notebook by a window", "old photograph of a strong elderly man carrying firewood", "sunlit tidy living room with training equipment"],
    presenter: [
      {action: "escribe en una libreta una rutina simple, tranquilo junto a la ventana", location: "escritorio junto a la ventana", framing: "plano medio", props: ["libreta", "lapicera"]},
      {action: "senala hacia abajo indicando la descripcion, invitando con calma", location: "consultorio", framing: "plano medio corto", props: []}]},
];

// ── Carrusel 3D de los 6 ejercicios (FedOilCarousel, el "vara" aprobado): anillo de tarjetas
// flotantes que gira y ATERRIZA/DESBLOQUEA la que el avatar nombra en ese beat (focus 0..5).
const CARDS = [
  {index: "01", name: "Sentadilla", image: "img/testo6_presenter_011.png"},
  {index: "02", name: "Bisagra de cadera", image: "img/testo6_presenter_015.png"},
  {index: "03", name: "Empuje sobre la cabeza", image: "img/testo6_presenter_017.png"},
  {index: "04", name: "El tiron", image: "img/testo6_presenter_020.png"},
  {index: "05", name: "Sprints", image: "img/testo6_presenter_024.png"},
  {index: "06", name: "El acarreo", image: "img/testo6_presenter_034.png"},
];

// ── Heroes (Director Pass): un explainer por parrafo clave. `para` fija el tramo hablado.
// copy <= 10 palabras y <= 72 chars; copy+sub deben compartir >= 2 terminos con el parrafo.
const HEROES = [
  {para: 2, fed: "FedStat", lf: "yearly-decline", value: "1", suffix: "%", copy: "Un uno por ciento menos cada ano", sub: "La testosterona cae despacio despues de los treinta",
    visual: "Una linea que desciende lenta y constante ano tras ano", detail: "Caida gradual, no un derrumbe"},
  {para: 3, fed: "FedStep", lf: "intention-vs-habit", step: 1, total: 1, copy: "Con intencion, no por obligacion", sub: "Entender el porque es la mitad del remedio",
    visual: "Un mismo gesto hecho con desgano y luego con foco", detail: "El porque cambia como se hace"},
  {para: 4, fed: "FedStat", lf: "sleep-shock", value: "15", suffix: "%", copy: "Dormir cinco horas baja la testosterona", sub: "Hasta un quince por ciento en una sola semana",
    visual: "Un reloj marca cinco horas y una barra hormonal se hunde", detail: "Dato de un estudio serio, verificable"},
  {para: 5, fed: "FedQuote", lf: "patient-quote", attributed: true, author: "Anibal, 63 anos", role: "Volvio a los cuatro meses",
    copy: "Me siento un fantasma de lo que era", sub: "Cuatro meses despues, la mano firme otra vez",
    visual: "Tarjeta clara con la frase y el presentador asomando en penumbra", detail: "Prueba humana despues del tema"},
  {para: 7, fed: "FedOilCarousel", lf: "reveal-1", cards: CARDS, focus: 0, intro: true, copy: "Ejercicio uno: la sentadilla", sub: "El musculo mas grande manda: piernas y gluteos",
    visual: "El anillo de los seis ejercicios se arma y aterriza en la sentadilla", detail: "Desbloqueo del ejercicio uno"},
  {para: 8, fed: "FedOilCarousel", lf: "reveal-2", cards: CARDS, focus: 1, intro: false, copy: "Ejercicio dos: la bisagra de cadera", sub: "Toda la cadena de atras y un cinturon natural",
    visual: "El anillo gira y desbloquea la bisagra de cadera", detail: "Desbloqueo del ejercicio dos"},
  {para: 9, fed: "FedHero", lf: "tease-four", copy: "Ya llegamos: el cuarto le devuelve los hombros", sub: "Los hombros de cuando tenia treinta",
    visual: "Un hilo de luz que adelanta el proximo movimiento", detail: "Tease del ejercicio cuatro"},
  {para: 10, fed: "FedOilCarousel", lf: "reveal-3", cards: CARDS, focus: 2, intro: false, copy: "Ejercicio tres: el empuje", sub: "No es de musculo, es de dignidad",
    visual: "El anillo gira y desbloquea el empuje sobre la cabeza", detail: "Desbloqueo del ejercicio tres"},
  {para: 11, fed: "FedOilCarousel", lf: "reveal-4", cards: CARDS, focus: 3, intro: false, copy: "Ejercicio cuatro: el tiron", sub: "Pararse derecho y abrir el pecho",
    visual: "El anillo gira y desbloquea el tiron", detail: "Desbloqueo del ejercicio cuatro"},
  {para: 12, fed: "FedChecklist", lf: "real-life-moves", copy: "Cuatro movimientos de la vida real", sub: "Ninguno es un ejercicio de espejo",
    items: ["Agacharse", "Levantar del piso", "Poner arriba", "Tirar hacia usted"],
    visual: "Cuatro iconos de gestos cotidianos encendiendose en orden", detail: "Sintesis de los primeros cuatro"},
  {para: 13, fed: "FedOilCarousel", lf: "reveal-5", cards: CARDS, focus: 4, intro: false, copy: "Ejercicio cinco: los sprints", sub: "Corto y feroz: diez minutos, no cuarenta",
    visual: "El anillo gira y desbloquea los sprints", detail: "Desbloqueo del ejercicio cinco"},
  {para: 14, fed: "FedMolecule", lf: "aromatase-mechanism", copy: "La panza convierte testosterona en estrogeno", sub: "Rompa la bola de nieve con musculo y esfuerzo",
    nodes: ["Grasa abdominal", "Convierte a estrogeno", "Menos testosterona", "El musculo lo revierte"],
    visual: "La grasa como fabrica que drena la hormona y el musculo que la recupera", detail: "Mecanismo clave del bloque"},
  {para: 15, fed: "FedOilCarousel", lf: "reveal-6", cards: CARDS, focus: 5, intro: false, copy: "Ejercicio seis: el acarreo", sub: "La fuerza de agarre predice su salud",
    visual: "El anillo gira y desbloquea el acarreo, el ultimo", detail: "Desbloqueo del ejercicio seis"},
  {para: 16, fed: "FedLowerThird", lf: "honest-turn", copy: "Ahora, la parte incomoda pero honesta", sub: "El medico que prometio decir la verdad",
    visual: "Rotulo sobrio que marca el giro del guion", detail: "Transicion al error"},
  {para: 17, fed: "FedMolecule", lf: "cortisol-seesaw", copy: "Cortisol contra testosterona: un subibaja", sub: "El estres y el poco sueno ganan la pulseada",
    nodes: ["Estres cronico", "Poco sueno", "Sube el cortisol", "Baja la testosterona"],
    visual: "Un subibaja donde una hormona sube mientras la otra baja", detail: "Mecanismo del error"},
  {para: 18, fed: "FedStat", lf: "three-days", value: "3", copy: "Tres dias a la semana alcanzan", sub: "La testosterona se fabrica de noche, al descansar",
    visual: "Una semana con tres dias marcados y descanso entre medio", detail: "La dosis real de entrenamiento"},
  {para: 19, fed: "FedQuote", lf: "enemy-quote", attributed: true, author: "Dr. Federer", role: "El argumento del canal",
    copy: "El musculo es suyo; el frasco es una cuota", sub: "Nadie se hace rico con que usted descanse",
    visual: "Comparacion entre un frasco que se vacia y un musculo que queda", detail: "El porque nadie te lo vende"},
  {para: 20, fed: "FedLowerThird", lf: "medical-stance", copy: "Esto no reemplaza a un medico", sub: "Cansancio o animo bajo: hagase un analisis",
    visual: "Rotulo claro con la salvedad medica y la puerta de una consulta", detail: "Limite honesto"},
  {para: 21, fed: "FedChecklist", lf: "recap", copy: "El repaso: los seis, en orden", sub: "Entrene fuerte, descanse en serio, duerma",
    items: ["Sentadilla y bisagra", "Empuje y tiron", "Sprint y acarreo", "Tres dias, mucho descanso"],
    visual: "Seis lineas que se encienden una a una y una regla de oro debajo", detail: "Recap accionable"},
  {para: 23, fed: "FedCta", lf: "closing-cta", copy: "La rutina completa esta en la descripcion", sub: "Semana por semana, lista para imprimir",
    visual: "Cierre sobrio con la silla y la banda listas, sin precio ni enlace", detail: "CTA sin precio ni enlace hablado"},
  {para: 24, fed: "FedQuote", lf: "closing-identity", attributed: true, author: "Dr. Federer", role: "Cierre del canal",
    copy: "Los hombres de antes envejecieron fuertes", sub: "Estos movimientos vivian en su dia a dia",
    visual: "Foto antigua de un hombre mayor fuerte y la sala en penumbra", detail: "Cierre de identidad"},
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
      if (!win || win.hit < 2) throw new Error(`${id}: solapamiento ${win ? win.hit : 0} con el guion (parrafo ${p.n}) copy="${hero.copy}"`);
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
        ...(hero.nodes ? {nodes: hero.nodes} : {}),
        ...(hero.value ? {value: hero.value, metric_value: hero.value} : {}),
        ...(hero.suffix ? {suffix: hero.suffix} : {}),
        ...(hero.step ? {step: hero.step, total: hero.total} : {}),
        ...(hero.attributed ? {attributed: true, author: hero.author, role: hero.role} : {}),
        ...(hero.cards ? {cards: hero.cards, focus: hero.focus, intro: hero.intro} : {}),
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

// Cobertura de presentador: toda seccion con al menos una accion de la identidad.
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

const director_decision = {
  content_signature: "Seis ejercicios caseros para hombres de mas de cuarenta donde el valor no esta en el movimiento de gimnasio sino en el musculo grande, la tecnica y el descanso; el video niega desde la primera frase la promesa del frasco y la sustituye por capacidad medible, y despues invierte su premisa: entrenar todos los dias durmiendo cinco horas convierte la rutina en otra fuente de agotamiento. El dato del sueno abierto en el hook es el hilo que sostiene la retencion hasta el pago final del error.",
  visual_thesis: "Cada afirmacion se resuelve con el objeto real de la casa que la voz nombra -la silla, la pared, el bidon, la banda, las dos bolsas- o con las manos del presentador ejecutando ese gesto exacto. El texto solo aparece cuando hay una cifra, un limite de seguridad o una ruta causal que la imagen no puede decir sola: uno por ciento por ano, quince por ciento por dormir poco, tres dias por semana. Prohibido el stock de gimnasio con torsos musculosos porque empujaria justo la promesa que el guion desmonta.",
  pacing_profile: "Seis capitulos de ejercicio con tres bloques de contexto medico intercalados. El hook cierra rapido en el dato del sueno; cada ejercicio abre con FedChapter o un FedHero y baja a mediana cercana a cinco segundos entre presentador, stock limpio y montaje tecnico. La pizarra de la aromatasa entra una vez, en el mecanismo de la grasa. Dos frenadas de avatar limpio marcan los giros: la revelacion del error y el cierre de identidad.",
  presenter_role: "La identidad demuestra, no ilustra: se levanta de la silla sin manos, lleva la cadera a la pared, tira de la banda buscando grietas, empuja las botellas sobre la cabeza, camina cargando dos bolsas y aprieta la mano mostrando agarre. Toda seccion tiene un gesto fisico suyo en sala, pasillo, cocina o consultorio de casa, porque un video sobre entrenar despues de los cuarenta pide credibilidad domestica y no un gimnasio de estudio.",
  stock_role: "El stock aporta el objeto y el contexto clinico verificables a pantalla completa y sin rotulo: la silla contra la pared, la banda en macro, el tensiometro, el reloj que marca cinco horas, la estanteria de frascos que el guion desmonta. Nunca lleva texto encima; cuando hay que explicar entra un componente y el stock se retira.",
  forbidden: "Texto sobre stock o sobre el presentador por defecto; rotulos que repiten la frase que la voz acaba de decir en lugar de aportar dosis, limite o comparacion; stock de gimnasio con fisicoculturistas; decir precio o enlace en voz alta.",
  captions_visible: false,
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
  title: "Los UNICOS 6 Ejercicios para Aumentar la Testosterona / Hombres de 40 y mas",
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
