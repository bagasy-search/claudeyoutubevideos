import fs from "node:fs";

const slug = "v7ior5j7vkw9";
const dataPath = `src/VideoEdit/${slug}_data.gen.ts`;
const cuesPath = `src/VideoEdit/cues_${slug}.gen.tsx`;
const avatarPath = `src/VideoEdit/avatar_${slug}.gen.ts`;
let source = fs.readFileSync(dataPath, "utf8");
const marker = "export const MOMENTS_V7IOR5J7VKW9: V7Moment[] = ";
const jsonStart = source.indexOf(marker) + marker.length;
const jsonEnd = source.indexOf(";", jsonStart);
if (jsonStart < marker.length || jsonEnd < 0) throw new Error("no pude leer MOMENTS");
const moments = JSON.parse(source.slice(jsonStart, jsonEnd));
const FORCE_AVATAR_KEYS = new Set([
  "principio_raiz_008",
  "cantidad_profundidad_001",
  "cantidad_profundidad_033",
  "calcio_y_fruto_017",
  "limites_y_error_024",
  "macetas_y_acolchado_017",
  "recap_y_cierre_001",
]);

const meaningFor = (phrase) => {
  const p = String(phrase || "").toLowerCase();
  const measurement = String(phrase || "").match(
    /\b(\d+(?:[.,]\d+)?)\s*(litros?|l\b|milímetros?|mm\b|centímetros?|cm\b|metros?|m²|por ciento|%|días?|horas?|veces?)?/i,
  );
  let title = "Regla práctica";
  let items = ["Mide primero", "Cambia poco", "Observa respuesta"];
  let topic = "RIEGO";
  let setup = "Riego irregular";
  if (/pudrici|apical|calcio/.test(p)) {
    title = "Calcio disponible"; items = ["Riego estable", "Raíz activa", "Fruto firme"];
    topic = "CALCIO"; setup = "Riego inestable";
  } else if (/griet|rajadur|partid/.test(p)) {
    title = "Evita grietas"; items = ["Humedad pareja", "Cambio lento", "Fruto firme"];
    topic = "GRIETAS"; setup = "Cambios bruscos";
  } else if (/maceta|contenedor/.test(p)) {
    title = "Maceta vigilada"; items = ["Control diario", "Drenaje libre", "Riego lento"];
    topic = "MACETA"; setup = "Poca reserva";
  } else if (/acolchado|paja|mulch|cobertura/.test(p)) {
    title = "Suelo cubierto"; items = ["Menos calor", "Más reserva", "Raíz fresca"];
    topic = "ACOLCHADO"; setup = "Suelo desnudo";
  } else if (/drenaje|agujero|escurr/.test(p)) {
    title = "Drenaje libre"; items = ["Salida abierta", "Sin charcos", "Raíz sana"];
    topic = "DRENAJE"; setup = "Agua estancada";
  } else if (/marchit|amarill|enfermedad|no cura|trastorno|l[ií]mite|aerosol/.test(p)) {
    title = "Límite honesto"; items = ["No cura", "Diagnóstico primero", "Observa cambios"];
    topic = "LÍMITE"; setup = "No todo es riego";
  } else if (/hoja|follaje|salpic|hongo/.test(p)) {
    title = "Riega abajo"; items = ["Hoja seca", "Suelo húmedo", "Menos hongos"];
    topic = "HOJAS"; setup = "Agua en hojas";
  } else if (/ra[ií]z/.test(p)) {
    title = "Raíz profunda"; items = ["Agua abajo", "Reserva estable", "Planta fuerte"];
    topic = "RAÍZ"; setup = "Riego superficial";
  } else if (/calendario|martes|jueves|frecuencia/.test(p)) {
    title = "Sin calendario"; items = ["Mide suelo", "Observa clima", "Decide después"];
    topic = "CALENDARIO"; setup = "Rutina ciega";
  } else if (/lluvia|mil[ií]metro|litro|cantidad|cent[ií]metro/.test(p)) {
    title = "Agua medida"; items = ["Cuenta lluvia", "Mide volumen", "Ajusta despacio"];
    topic = "AGUA"; setup = "Cantidad medida";
  } else if (/calor|viento|evapora|sequ[ií]a/.test(p)) {
    title = "Pierde agua"; items = ["Calor alto", "Viento seco", "Revisa suelo"];
    topic = "CLIMA"; setup = "Pérdida rápida";
  } else if (/suelo|tierra|dedo|humedad/.test(p)) {
    title = "Mira suelo"; items = ["Cinco centímetros", "Tacto fresco", "Decide después"];
    topic = "SUELO"; setup = "Humedad real";
  } else if (/fruto|tomate|cosecha|flor/.test(p)) {
    title = "Fruto sano"; items = ["Riego parejo", "Raíz activa", "Cosecha firme"];
    topic = "FRUTO"; setup = "Estrés hídrico";
  } else if (/riego|regar|agua|manguera|goteo/.test(p)) {
    title = "Riego profundo"; items = ["Flujo lento", "Agua abajo", "Pausa útil"];
  }
  const figure = measurement
    ? `${measurement[1]}${measurement[2] ? ` ${measurement[2]}` : ""}`.trim()
    : topic;
  return { title, items, topic, setup, figure };
};

const kindFor = (m, ordinal) => {
  const p = String(m.dice || "").toLowerCase();
  const planned = m.kind || "";
  const choose = (allowed, fallback) => allowed.includes(planned) ? planned : fallback;
  const measured = /\b\d+(?:[.,]\d+)?\s*(?:litros?|l\b|milímetros?|mm\b|centímetros?|cm\b|metros?|m²|por ciento|%|días?|horas?|veces?)/i.test(m.dice);
  if (/abuelo|amos|cuaderno|antes se hac[ií]a|generaciones/.test(p)) return choose(["AgedDoc", "KineticQuote"], "AgedDoc");
  if (/calendario|martes|jueves/.test(p)) return choose(["OptionCompare", "SplitList", "ReframeList"], "OptionCompare");
  if (/(?:15|20|5|2)\s*(?:cent[ií]metros?|cm)|profundidad/.test(p)) return choose(["CrossSection", "BarCompare", "CalloutMark"], ordinal % 2 ? "BarCompare" : "CrossSection");
  if (/ra[ií]z|capa superficial|debajo del suelo/.test(p)) return choose(["CrossSection", "BarCompare"], "CrossSection");
  if (measured) return choose(["StatBig", "CalloutMark", "RuleNumberScene"], ordinal % 2 ? "CalloutMark" : "StatBig");
  if (/l[ií]mite|no cura|enfermedad|trastorno|marchita|amarillea/.test(p)) return choose(["ReframeList", "SplitList"], "ReframeList");
  if (/primero|despu[eé]s|luego|paso|protocolo|haz esto|prueba/.test(p)) return choose(["ProcessSteps", "Checklist"], ordinal % 2 ? "Checklist" : "ProcessSteps");
  if (/señal|observa|revisa|comprueba|toca|dedo/.test(p)) return choose(["Checklist", "ChipsCluster"], ordinal % 2 ? "ChipsCluster" : "Checklist");
  if (/en cambio|mientras|pero|no .* sino|diferencia|compar/.test(p)) return choose(["SplitList", "ReframeList"], "SplitList");
  if (/arruina|daño|pudrici|griet|pierde|fracasa|problema/.test(p)) return choose(["ImpactReveal", "KineticQuote", "TextCardReveal"], m.supportImage ? "ImpactReveal" : "KineticQuote");
  if (/recuerda|quédate|regla|nunca|siempre/.test(p)) return choose(["KineticQuote", "TextCardReveal"], "KineticQuote");
  if (/tres|cuatro|cinco|opciones|factores/.test(p)) return choose(["ChipsCluster", "Checklist", "ProcessSteps"], "ChipsCluster");
  return "TextCardReveal";
};

let componentOrdinal = 0;
let lastVisual = "";
for (const m of moments) {
  if (m.src) lastVisual = m.src;
  const meaning = meaningFor(m.dice);
  Object.assign(m, meaning);
  const number = String(m.dice || "").match(/\b(\d+(?:[.,]\d+)?)\b/);
  m.number = number ? Number(number[1].replace(",", ".")) : 0;
  if (m.tipo === "componente") {
    m.kind = kindFor(m, componentOrdinal++);
    if (["ImpactReveal", "CalloutMark", "PhotoChecklist"].includes(m.kind) && !m.supportImage) {
      m.supportImage = lastVisual;
    }
  }
}

for (const m of moments) {
  if (FORCE_AVATAR_KEYS.has(m.key)) m.avatarFull = true;
}

const visibleRaw = moments.filter((m) => !m.avatarFull && m.kitOverlay);
for (const m of visibleRaw) {
  const p = String(m.dice || "").toLowerCase();
  m.kitOverlay = m.figure !== m.topic
    ? "callout"
    : /arruina|daño|pudrici|griet|pierde|marchit|enfermedad|problema/.test(p)
      ? "impact"
      : "annotated";
}

source = source.slice(0, jsonStart) + JSON.stringify(moments, null, 2) + source.slice(jsonEnd);
const avatarWindows = [];
for (const m of moments) {
  const mode = m.avatarFull ? "full" : "hidden";
  if (avatarWindows.at(-1)?.mode !== mode) avatarWindows.push({ start: m.start, mode });
}
const avatarMarker = "export const AVATAR_WINDOWS_V7IOR5J7VKW9 = ";
const avatarStart = source.indexOf(avatarMarker) + avatarMarker.length;
const avatarEnd = source.indexOf(" as const;", avatarStart);
if (avatarStart < avatarMarker.length || avatarEnd < 0) throw new Error("no pude leer AVATAR_WINDOWS");
source =
  source.slice(0, avatarStart) +
  JSON.stringify(avatarWindows, null, 2) +
  source.slice(avatarEnd);
if (!source.includes("  topic: string;")) {
  source = source.replace(
    /  kitOverlay: string;\r?\n/,
    "  kitOverlay: string;\n  topic: string;\n  setup: string;\n  figure: string;\n",
  );
}
fs.writeFileSync(dataPath, source);
fs.writeFileSync(
  avatarPath,
  `// AUTO-GENERADO: ventanas full/hidden del avatar.\nexport const TOTAL_V7IOR5J7VKW9 = 1283.135;\nexport const AVATAR_V7IOR5J7VKW9 = ${JSON.stringify(avatarWindows, null, 2)} as const;\n`,
);

const wordTake = (text, max) => String(text || "").split(/\s+/).filter(Boolean).slice(0, max).join(" ");
const tags = new Set(["CrossSection", "StatBig", "ProcessSteps", "RuleNumberScene", "Checklist", "BarCompare", "ReframeList", "TextCardReveal", "OptionCompare", "ImpactReveal", "KineticQuote", "AgedDoc", "SplitList", "ChipsCluster", "CalloutMark"]);
const complex = new Set(["CrossSection", "BarCompare", "OptionCompare"]);
const lines = [];
for (const m of moments.filter((x) => !x.avatarFull)) {
  if (m.tipo !== "componente") {
    if (m.kitOverlay === "annotated") {
      lines.push(`  { key:"cue", start:${m.start}, dur:${m.dur}, kind:"annotatedimage", src:${JSON.stringify(m.src)}, props:${JSON.stringify({ eyebrow: "Prueba", caption: m.headline, label: m.topic })} }, // <AnnotatedImage />`);
    } else if (m.kitOverlay === "callout") {
      lines.push(`  { key:"cue", start:${m.start}, dur:${m.dur}, kind:"calloutmark", src:${JSON.stringify(m.src)}, props:${JSON.stringify({ eyebrow: "Dato", figure: m.figure, caption: m.headline })} }, // <CalloutMark />`);
    } else if (m.kitOverlay === "impact") {
      lines.push(`  { key:"cue", start:${m.start}, dur:${m.dur}, kind:"impactreveal", src:${JSON.stringify(m.src)}, props:${JSON.stringify({ setup: m.setup, impact: m.headline })} }, // <ImpactReveal />`);
    } else {
      lines.push(`  { key:"cue", start:${m.start}, dur:${m.dur}, kind:"raw", src:${JSON.stringify(m.src)} }, // <RawShot />`);
    }
    continue;
  }
  const micro = m.dur < 2.5;
  const fallback = (complex.has(m.kind) && m.dur < 5.35) || m.dur < 3.65;
  const actual = fallback || !tags.has(m.kind) ? "TextCardReveal" : m.kind;
  const title = wordTake(m.headline, 2);
  let props = micro
    ? { lines: [m.topic] }
    : fallback
      ? { eyebrow: "Riego", lines: [title] }
      : { title, items: m.items.slice(0, 2).map((x) => wordTake(x, m.dur >= 4 ? 2 : 1)) };
  if (actual === "OptionCompare") props = { left: ["Error", "Calendario", "Sin medir", "Falla"], right: ["Método", "Suelo", "Mide suelo", "Funciona"] };
  else if (actual === "CrossSection") props = { title, labels: ["Seco", "Raíz", "Drenaje", "Reserva"] };
  else if (actual === "StatBig") props = { value: String(m.number), label: title, caption: "Agua medida" };
  else if (actual === "RuleNumberScene") props = { label: "Regla", title };
  else if (actual === "BarCompare") props = { eyebrow: "Profundidad", title, bars: ["Superficial 2 cm", "Profundo 20 cm"] };
  else if (actual === "ImpactReveal") props = { setup: m.setup, impact: title };
  else if (actual === "CalloutMark") props = { figure: m.figure, eyebrow: "Cifra", caption: title };
  lines.push(`  { key:"cue", start:${m.start}, dur:${m.dur}, kind:"${actual.toLowerCase()}", props:${JSON.stringify(props)} }, // <${actual} />`);
}
fs.writeFileSync(
  cuesPath,
  `// AUTO-GENERADO: componentes elegidos por significado, no por cuota.\nexport const CUES_GATE_V7IOR5J7VKW9 = [\n${lines.join("\n")}\n] as const;\n`,
);

const counts = Object.fromEntries(
  [...new Set(moments.filter((m) => !m.avatarFull && m.tipo === "componente").map((m) => m.kind))]
    .sort()
    .map((kind) => [kind, moments.filter((m) => !m.avatarFull && m.tipo === "componente" && m.kind === kind).length]),
);
console.log(JSON.stringify({ components: counts, overlays: moments.filter((m) => m.kitOverlay).map((m) => ({ start: m.start, kind: m.kitOverlay, topic: m.topic, says: m.dice })) }, null, 2));
