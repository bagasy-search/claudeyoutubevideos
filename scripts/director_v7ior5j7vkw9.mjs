import fs from "node:fs";

const slug = "v7ior5j7vkw9";
const captions = JSON.parse(
  fs.readFileSync(`public/captions_${slug}.json`, "utf8").replace(/^\uFEFF/, ""),
);
const starts = JSON.parse(fs.readFileSync(`_v3/${slug}_starts.json`, "utf8"));
const totalMs = Math.round((starts.__end || 1283) * 1000);

const sections = [
  {
    id: "hook",
    objetivo:
      "Detener el scroll con el daño silencioso, fijar 5 cm / 15–20 cm / 25 L por m² y abrir el loop de mirar hojas frente a mirar suelo.",
    inicio: 0,
    fin: 45,
  },
  {
    id: "principio_raiz",
    objetivo:
      "Hacer visible la diferencia entre oscurecer la superficie y cargar el perfil, con demostración física y contraste arena/arcilla.",
    inicio: 45,
    fin: 240,
  },
  {
    id: "cantidad_profundidad",
    objetivo:
      "Traducir la pulgada semanal a litros útiles y enseñar riego lento, profundo, a la raíz y en horario correcto.",
    inicio: 240,
    fin: 480,
  },
  {
    id: "calcio_y_fruto",
    objetivo:
      "Explicar podredumbre apical, transporte de calcio, grietas y asfixia radicular sin convertir conceptos abstractos en stock genérico.",
    inicio: 480,
    fin: 720,
  },
  {
    id: "macetas_y_acolchado",
    objetivo:
      "Separar claramente las reglas de maceta y suelo abierto, calibrar el riego y mostrar cómo el acolchado estabiliza la humedad.",
    inicio: 720,
    fin: 930,
  },
  {
    id: "limites_y_error",
    objetivo:
      "Construir confianza con límites honestos, desmontar el mito del calcio y pagar el error mirando hojas de tarde en vez del suelo.",
    inicio: 930,
    fin: 1120,
  },
  {
    id: "recap_y_cierre",
    objetivo:
      "Convertir todo en protocolo accionable, proponer la prueba de siete días y cerrar con identidad y teaser específico.",
    inicio: 1120,
    fin: 1283,
  },
];

const sectionAt = (ms) =>
  sections.find((s) => ms >= s.inicio * 1000 && ms < s.fin * 1000) ??
  sections.at(-1);

// Ritmo deliberadamente irregular: mediana cercana a 4,4 s, 40% de objetivos >=5 s
// y p75 por encima de 5 s. Los cortes caen en puntuación o en una palabra real de Whisper.
const targetPattern = [2.7, 5.4, 3.0, 5.8, 3.2, 5.1, 3.3, 6.1, 3.5, 3.7];
const punct = /[.!?;:]$/;
const moments = [];
let wi = 0;
let pi = 0;

while (wi < captions.length) {
  const startWord = captions[wi];
  const sec = sectionAt(startWord.startMs);
  const secEndMs = sec.fin * 1000;
  const target = targetPattern[pi % targetPattern.length];
  const minMs = target * 0.78 * 1000;
  const targetMs = target * 1000;
  const hardMs = (target + 0.45) * 1000;
  let end = wi;

  while (end < captions.length - 1) {
    const w = captions[end];
    const elapsed = w.endMs - startWord.startMs;
    const atBoundary = captions[end + 1].startMs >= secEndMs;
    if (atBoundary) break;
    if (elapsed >= minMs && punct.test((w.text || "").trim()) && elapsed >= targetMs * 0.86) break;
    if (elapsed >= hardMs) break;
    end++;
  }

  const slice = captions.slice(wi, end + 1);
  const text = slice.map((w) => w.text || "").join("").trim();
  const endMs = Math.min(slice.at(-1).endMs, secEndMs, totalMs);
  if (endMs > startWord.startMs && text) {
    moments.push({
      ms: startWord.startMs,
      endMs,
      section: sec.id,
      dice: text,
    });
  }
  wi = end + 1;
  pi++;
}

for (let i = 0; i < moments.length - 1; i++) {
  moments[i].endMs = moments[i + 1].ms;
}
moments.at(-1).endMs = totalMs;

const personalRx =
  /\b(yo|mi|mis|me|conmigo|te muestro|voy a mostrarte|quiero|prefiero|dejé|te propongo|nos vemos|del galpón)\b/i;
const abstractRx =
  /\b(calcio|fisiológic|transporte|nutrient|oxígeno|equilibrio|fusarium|verticillium|pH|sales|por ciento|litros|centímetros|pulgada|primero|segundo|tercero|cuarto|quinto|sexto|séptimo|octavo)\b/i;
const componentKinds = [
  "CrossSection",
  "StatBig",
  "ProcessSteps",
  "RuleNumberScene",
  "Checklist",
  "BarCompare",
  "ReframeList",
  "TextCardReveal",
  "PhotoChecklist",
  "OptionCompare",
  "ImpactReveal",
  "KineticQuote",
  "AgedDoc",
  "SplitList",
  "ChipsCluster",
  "CalloutMark",
];

const componentFor = (text, index) => {
  const t = text.toLowerCase();
  if (/centímetr|profund|raíz|perfil/.test(t)) return "CrossSection";
  if (/litro|pulgada|metro cuadrado|número/.test(t)) return "StatBig";
  if (/primero|segundo|tercero|cuarto|quinto|sexto|séptimo|octavo/.test(t))
    return "RuleNumberScene";
  if (/calcio|oxígeno|nutrient|fisiológic/.test(t)) return "ProcessSteps";
  if (/arena|arcilla|maceta|bancal|mucho|poco|seco|empapado/.test(t))
    return "OptionCompare";
  if (/protocolo|paso|prueba|haz|revisa|comprueba/.test(t)) return "ProcessSteps";
  if (/error|mito|no es|no puede|límite/.test(t)) return "ReframeList";
  return componentKinds[index % componentKinds.length];
};

const visualFor = (text, type, kind) => {
  const t = text.toLowerCase();
  if (type === "componente") {
    if (kind === "CrossSection")
      return "Corte transversal del suelo mostrando superficie seca, frente húmedo y raíces de tomate a 5 y 20 centímetros.";
    if (kind === "StatBig")
      return "Cifra grande sobre papel envejecido con regla de profundidad y conversión de agua semanal.";
    if (kind === "OptionCompare")
      return "Comparación visual entre riego superficial/profundo o suelo arenoso/arcilloso, según la frase.";
    if (kind === "RuleNumberScene")
      return "Regla numerada de una sola línea, legible y anclada al paso que se está diciendo.";
    if (kind === "ProcessSteps" || kind === "Checklist" || kind === "PhotoChecklist")
      return "Proceso breve con máximo tres titulares y apoyo fotográfico de una tomatera real.";
    if (kind === "ReframeList")
      return "Mito a la izquierda y diagnóstico correcto a la derecha, en titulares cortos.";
    return "Tarjeta documental rústica con un único dato central y textura de papel de galpón.";
  }
  if (type === "imagen") {
    if (/palita|dedo|corte|demostr|prueba/.test(t))
      return "Levi Lapp en su huerta de Lancaster, foto casera real, agachado abriendo la tierra junto a una tomatera con una palita de mano.";
    if (/descripción|guía|galpón/.test(t))
      return "Levi Lapp dentro del galpón de madera sosteniendo una hoja sencilla de guía, foto imperfecta y natural.";
    return "Levi Lapp junto a tomateras reales en un bancal de Lancaster, gesto tranquilo, fotografía doméstica sin aspecto publicitario.";
  }
  if (/mancha|negra|podredumbre|base del tomate/.test(t))
    return "Macro real de tomate con podredumbre apical oscura en el extremo floral, manos de horticultor inspeccionándolo.";
  if (/grieta|rajad/.test(t))
    return "Primer plano real de tomates maduros agrietados todavía en la planta después de lluvia.";
  if (/maceta|recipiente|balde|plato/.test(t))
    return "Manos regando lentamente una tomatera adulta en maceta grande con drenaje visible.";
  if (/acolchado|paja|hojas secas|cobertura/.test(t))
    return "Manos colocando paja limpia alrededor de una tomatera sin tocar el tallo.";
  if (/calor|tarde|marchit|caída|hojas/.test(t))
    return "Tomatera real con hojas decaídas bajo sol fuerte de tarde y recuperación en luz fresca de mañana.";
  if (/arena|arcilla|tierra|suelo|perfil|húmed/.test(t))
    return "Macro de manos comparando tierra arenosa y arcillosa junto a raíces de tomate, humedad visible sin barro.";
  if (/manguera|goteo|regadera|chorro|riega|agua/.test(t))
    return "B-roll real de riego lento dirigido a la base de una tomatera, hojas secas y agua penetrando el suelo.";
  if (/fruto|tomate|cosecha/.test(t))
    return "Macro real de tomates sanos madurando en la planta y manos cosechando con cuidado.";
  if (/vivero|botella|producto|vendedor/.test(t))
    return "Estante real de vivero con productos de jardinería desenfocados mientras una mano elige no comprar.";
  if (/mañana|cinco y las nueve|temprano/.test(t))
    return "Huerta de tomates al amanecer con gotas en el suelo, luz suave y riego por goteo.";
  return "Trabajo real en una huerta de tomates: manos, suelo, raíces y frutos, encuadre específico sin presentador a cámara.";
};

const queryFor = (text) => {
  const t = text.toLowerCase();
  if (/mancha|podredumbre/.test(t))
    return ["tomate podredumbre apical fruto primer plano", "tomates blossom end rot huerta"];
  if (/grieta|rajad/.test(t))
    return ["tomates agrietados planta lluvia", "cosecha tomate rajado huerta"];
  if (/maceta|recipiente|balde/.test(t))
    return ["regar tomate en maceta drenaje", "tomatera contenedor riego profundo"];
  if (/acolchado|paja|cobertura/.test(t))
    return ["acolchado paja tomateras manos", "mulch tomate huerta real"];
  if (/calor|marchit|caída|hojas/.test(t))
    return ["tomatera marchita calor tarde", "hojas tomate estrés calor huerta"];
  if (/arena|arcilla|tierra|suelo/.test(t))
    return ["suelo tomate humedad manos huerta", "tierra raíces tomatera riego"];
  if (/manguera|goteo|regadera|riega|agua/.test(t))
    return ["riego profundo tomate base planta", "goteo tomateras huerta manos"];
  if (/fruto|tomate|cosecha/.test(t))
    return ["tomates maduros planta cosecha manos", "tomatera frutos huerta real"];
  return ["cultivo tomate huerta manos trabajando", "tomateras bancal riego real"];
};

const counts = new Map();
const personalMoments = [];
const topComponents = [];

for (let i = 0; i < moments.length; i++) {
  const m = moments[i];
  const personal = personalRx.test(m.dice);
  const forcedComponent = abstractRx.test(m.dice);
  const componentSlot = i % 5 === 2 || i % 11 === 7;
  let tipo = forcedComponent || componentSlot ? "componente" : "clip";
  if (personal && !forcedComponent && m.ms > 45000 && i % 2 === 0) tipo = "imagen";
  const kind = tipo === "componente" ? componentFor(m.dice, i) : undefined;
  const muestra = visualFor(m.dice, tipo, kind);
  const count = (counts.get(m.section) || 0) + 1;
  counts.set(m.section, count);

  Object.assign(m, {
    name: `${m.section}_${String(count).padStart(3, "0")}`,
    tipo,
    ...(kind ? { kind } : {}),
    seg: +((m.endMs - m.ms) / 1000).toFixed(2),
    muestra,
    porque:
      tipo === "componente"
        ? "La frase contiene una cifra, mecanismo, contraste o regla que necesita leerse y no tiene stock filmable honesto."
        : tipo === "imagen"
          ? "La narración es personal o demostrativa; la toma debe conservar la cara y el mundo visual de Levi."
          : "La acción es concreta y filmable; stock real aporta textura y credibilidad sin inventar una escena personal.",
    personal,
    anchor: "tomate",
    shot: /macro|primer plano|detalle/i.test(muestra)
      ? "detalle"
      : /manos/i.test(muestra)
        ? "manos"
        : "medio",
    src: tipo === "clip" ? "stock" : tipo === "imagen" ? "photo" : "component",
    desc: muestra,
    queries: tipo === "clip" ? queryFor(m.dice) : [],
  });

  if (personal) {
    personalMoments.push({
      name: m.name,
      ms: m.ms,
      dice: m.dice,
      razon: "Primera persona, demostración o presencia editorial explícita de Levi.",
    });
  }
  if (kind) {
    topComponents.push({
      seccion: m.section,
      kind,
      momento: m.dice,
      idea: muestra,
      ms: m.ms,
    });
  }
}

const planSections = sections.map((s) => ({
  ...s,
  momentos: moments
    .filter((m) => m.section === s.id)
    .map(({ endMs, section, ...m }) => m),
}));

const durations = moments.map((m) => m.seg).sort((a, b) => a - b);
const q = (p) => durations[Math.floor((durations.length - 1) * p)];

const plan = {
  slug,
  sujeto: "tomates y el manejo correcto del riego en huerta",
  glosario: {
    Levi:
      "Levi Lapp, joven Amish de Lancaster, barba corta sin bigote, sombrero, tiradores y camisa lisa.",
    huerta:
      "Bancales reales junto a un galpón de madera, tomateras, suelo, paja, regadera y herramientas de mano.",
    regla_visual:
      "Stock real para acciones filmables; imagen gpt-image-2 con referencia solo cuando aparece Levi; componentes para cifras y conceptos abstractos.",
  },
  anchors: ["tomate", "tomatera", "huerta de tomates", "riego de tomates"],
  pace: Object.fromEntries(sections.map((s) => [s.id, "ritmo variado 3,2–6,2 s"])),
  fuentes: Object.fromEntries(
    sections.map((s) => [s.id, s.id === "limites_y_error" ? "mixto" : "stock"]),
  ),
  componentes: topComponents,
  personales: personalMoments,
  escaso: false,
  musica: "calmo rústico, madera y campo, sin energía publicitaria",
  ritmo_medido: {
    momentos: moments.length,
    mediana: q(0.5),
    p75: q(0.75),
    porcentaje_ge_5: +(
      (durations.filter((d) => d >= 5).length / durations.length) *
      100
    ).toFixed(1),
  },
  secciones: planSections,
};

fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${slug}_plan.json`, JSON.stringify(plan, null, 2));
fs.writeFileSync(
  `_v3/${slug}_beats.json`,
  JSON.stringify(
    moments.map((m) => ({
      name: m.name,
      section: m.section,
      ms: m.ms,
      phrase: m.dice,
      dur: m.seg,
      desc: m.desc,
      queries: m.queries,
      anchor: m.anchor,
      shot: m.shot,
      src: m.src === "stock" ? "stock" : m.src,
      tipo: m.tipo,
      kind: m.kind,
      personal: m.personal,
    })),
    null,
    1,
  ),
);

console.log(
  JSON.stringify(
    {
      momentos: moments.length,
      secciones: planSections.map((s) => [s.id, s.momentos.length]),
      personales: personalMoments.length,
      componentes: topComponents.length,
      ritmo: plan.ritmo_medido,
    },
    null,
    2,
  ),
);
