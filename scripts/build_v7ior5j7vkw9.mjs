import fs from "node:fs";
import path from "node:path";

const slug = "v7ior5j7vkw9";
const plan = JSON.parse(fs.readFileSync(`_v3/${slug}_plan.json`, "utf8"));
const broll = JSON.parse(fs.readFileSync(`_v3/${slug}_broll_map.json`, "utf8"));
const images = JSON.parse(fs.readFileSync(`_v3/${slug}_image_map.json`, "utf8"));
const brollByBeat = new Map(broll.map((b) => [b.beat, b]));
const imageByBeat = new Map(images.map((b) => [b.beat, b]));
const totalSeconds = 1283.135;
const totalFrames = Math.round(totalSeconds * 30);

const clean = (s) =>
  String(s || "")
    .replace(/\s+/g, " ")
    .replace(/^[,.;:¿?¡!\s]+|[,.;:¿?¡!\s]+$/g, "")
    .trim();

const headlineFor = (phrase, dur) => {
  const words = clean(phrase).split(/\s+/).filter(Boolean);
  const maxWords = Math.max(3, Math.min(8, Math.floor((dur - 0.8) * 2.5)));
  const picked = words.slice(0, maxWords).join(" ");
  return picked.charAt(0).toUpperCase() + picked.slice(1);
};

const itemsFor = (phrase, dur) => {
  const words = clean(phrase).split(/\s+/).filter(Boolean);
  const budget = Math.max(4, Math.min(12, Math.floor((dur - 0.8) * 2.5)));
  const picked = words.slice(0, budget);
  const n = dur >= 5.2 ? 3 : 2;
  const size = Math.ceil(picked.length / n);
  return Array.from({ length: n }, (_, i) =>
    picked.slice(i * size, (i + 1) * size).join(" "),
  ).filter(Boolean);
};

const numFor = (phrase, fallback) => {
  const m = String(phrase).match(/\b(\d+(?:[.,]\d+)?)\b/);
  return m ? Number(m[1].replace(",", ".")) : fallback;
};

const rawMoments = plan.secciones.flatMap((s) =>
  s.momentos.map((m) => ({ ...m, section: s.id })),
);

let clipOrdinal = 0;
const forceAvatarRx =
  /\b(aquí se paga|el error que arruina|preguntarle a las hojas|yo prefiero|te propongo|cuéntame en los comentarios|la gente sencilla|observa el suelo|nos vemos en el galpón)\b/i;
const moments = [];
let lastVisualAsset = `broll/${slug}/d000.mp4`;
let componentOrdinal = 0;

for (let i = 0; i < rawMoments.length; i++) {
  const m = rawMoments[i];
  let src = "";
  if (m.tipo === "clip") {
    const bm = brollByBeat.get(m.name);
    if (!bm) throw new Error(`sin mapa b-roll: ${m.name}`);
    const base = path.basename(bm.file, ".mp4");
    const mp4 = `public/broll/${slug}/${base}.mp4`;
    const jpg = `public/broll/${slug}/${base}.jpg`;
    if (fs.existsSync(mp4)) src = `broll/${slug}/${base}.mp4`;
    else if (fs.existsSync(jpg)) src = `broll/${slug}/${base}.jpg`;
    else throw new Error(`asset b-roll faltante: ${base}`);
    lastVisualAsset = src;
  } else if (m.tipo === "imagen") {
    const im = imageByBeat.get(m.name);
    if (!im) throw new Error(`sin imagen personal: ${m.name}`);
    src = im.file;
    if (!fs.existsSync(`public/${src}`)) throw new Error(`imagen faltante: ${src}`);
    lastVisualAsset = src;
  }

  let avatarFull = false;
  if (i === 0) avatarFull = true;
  if (m.tipo === "clip") {
    avatarFull = clipOrdinal % 2 === 0;
    clipOrdinal++;
  }
  if (m.tipo === "imagen") avatarFull = false;
  if (forceAvatarRx.test(m.dice) && m.tipo !== "imagen") avatarFull = true;
  if (m.ms / 1000 >= 1260 && m.tipo !== "imagen") avatarFull = true;

  const dur = +m.seg;
  const headline = headlineFor(m.dice, dur);
  const items = itemsFor(m.dice, dur);
  const number = numFor(m.dice, (componentOrdinal % 8) + 1);
  if (m.tipo === "componente") componentOrdinal++;
  const needsSupportImage = new Set([
    "PhotoChecklist",
    "ImpactReveal",
    "CalloutMark",
  ]).has(m.kind || "");

  moments.push({
    key: m.name,
    section: m.section,
    start: +(m.ms / 1000).toFixed(3),
    dur,
    tipo: m.tipo,
    kind: m.kind || "",
    src: avatarFull ? "" : src,
    supportImage:
      !avatarFull && m.tipo === "componente" && needsSupportImage
        ? lastVisualAsset
        : "",
    dice: clean(m.dice),
    headline,
    items,
    number,
    avatarFull,
    personal: !!m.personal,
    kitOverlay: "",
  });
}

// Reparte envoltorios del kit de forma uniforme en el metraje real.
// Son 34 planos existentes: no agrega cortes ni inventa material.
const visibleRaw = moments.filter(
  (m) =>
    !m.avatarFull &&
    m.dur >= 2.5 &&
    Math.abs(m.start - 106.84) > 0.01 &&
    (m.tipo === "clip" || m.tipo === "imagen"),
);
const overlayKinds = ["annotated", "callout", "impact"];
const overlayCount = Math.min(34, visibleRaw.length);
for (let k = 0; k < overlayCount; k++) {
  const idx = overlayCount === 1
    ? 0
    : Math.round((k * (visibleRaw.length - 1)) / (overlayCount - 1));
  visibleRaw[idx].kitOverlay = overlayKinds[k % overlayKinds.length];
}

const windows = [];
for (const m of moments) {
  const mode = m.avatarFull ? "full" : "hidden";
  if (!windows.length || windows.at(-1).mode !== mode) {
    windows.push({ start: m.start, mode });
  }
}

const avatarSeconds = moments
  .filter((m) => m.avatarFull)
  .reduce((sum, m) => sum + m.dur, 0);
const componentSeconds = moments
  .filter((m) => !m.avatarFull && m.tipo === "componente")
  .reduce((sum, m) => sum + m.dur, 0);
const brollSeconds = moments
  .filter((m) => !m.avatarFull && m.tipo === "clip")
  .reduce((sum, m) => sum + m.dur, 0);
const imageSeconds = moments
  .filter((m) => !m.avatarFull && m.tipo === "imagen")
  .reduce((sum, m) => sum + m.dur, 0);

const out = `// AUTO-GENERADO por scripts/build_${slug}.mjs — no editar a mano.
export type V7Moment = {
  key: string;
  section: string;
  start: number;
  dur: number;
  tipo: "clip" | "imagen" | "componente";
  kind: string;
  src: string;
  supportImage: string;
  dice: string;
  headline: string;
  items: string[];
  number: number;
  avatarFull: boolean;
  personal: boolean;
  kitOverlay: string;
};

export const TOTAL_SECONDS_V7IOR5J7VKW9 = ${totalSeconds};
export const TOTAL_FRAMES_V7IOR5J7VKW9 = ${totalFrames};
export const AVATAR_WINDOWS_V7IOR5J7VKW9 = ${JSON.stringify(windows, null, 2)} as const;
export const MOMENTS_V7IOR5J7VKW9: V7Moment[] = ${JSON.stringify(moments, null, 2)};
`;

fs.writeFileSync(`src/VideoEdit/v7ior5j7vkw9_data.gen.ts`, out);

const assetEntries = [
  `avatar_${slug}.mp4`,
  `${slug}.wav`,
  ...new Set(
    moments
      .filter((m) => !m.avatarFull)
      .flatMap((m) => [m.src, m.supportImage])
      .filter(Boolean),
  ),
  "sfx",
  "assets",
  "bed",
  "logos",
];
fs.writeFileSync(
  `public/_assets_${slug}.txt`,
  `${assetEntries.join("\n")}\n`,
);

const wordTake = (text, max) =>
  clean(text).split(/\s+/).filter(Boolean).slice(0, max).join(" ");
const componentTag = {
  CrossSection: "CrossSection",
  StatBig: "StatBig",
  ProcessSteps: "ProcessSteps",
  RuleNumberScene: "RuleNumberScene",
  Checklist: "Checklist",
  PhotoChecklist: "PhotoChecklist",
  BarCompare: "BarCompare",
  ReframeList: "ReframeList",
  TextCardReveal: "TextCardReveal",
  OptionCompare: "OptionCompare",
  ImpactReveal: "ImpactReveal",
  KineticQuote: "KineticQuote",
  AgedDoc: "AgedDoc",
  SplitList: "SplitList",
  ChipsCluster: "ChipsCluster",
  CalloutMark: "CalloutMark",
};
const complexKinds = new Set([
  "CrossSection",
  "BarCompare",
  "OptionCompare",
  "PhotoChecklist",
]);
const gateLines = [];
for (const m of moments.filter((x) => !x.avatarFull)) {
  if (m.tipo === "clip" || m.tipo === "imagen") {
    if (m.kitOverlay === "annotated") {
      gateLines.push(
        `  { key: "cue", start: ${m.start}, dur: ${m.dur}, kind: "annotatedimage", src: ${JSON.stringify(m.src)}, props: {"eyebrow":"Prueba","caption":${JSON.stringify(wordTake(m.headline, 2))},"label":"Zona clave"} }, // <AnnotatedImage />`,
      );
    } else if (m.kitOverlay === "callout") {
      gateLines.push(
        `  { key: "cue", start: ${m.start}, dur: ${m.dur}, kind: "calloutmark", src: ${JSON.stringify(m.src)}, props: {"eyebrow":"Observa","figure":"SUELO","caption":${JSON.stringify(wordTake(m.headline, 2))}} }, // <CalloutMark />`,
      );
    } else if (m.kitOverlay === "impact") {
      gateLines.push(
        `  { key: "cue", start: ${m.start}, dur: ${m.dur}, kind: "impactreveal", src: ${JSON.stringify(m.src)}, props: {"setup":"Mira el suelo","impact":${JSON.stringify(wordTake(m.headline, 2))}} }, // <ImpactReveal />`,
      );
    } else {
      gateLines.push(
        `  { key: "cue", start: ${m.start}, dur: ${m.dur}, kind: "raw", src: ${JSON.stringify(m.src)} }, // <RawShot />`,
      );
    }
    continue;
  }
  const fallback = (complexKinds.has(m.kind) && m.dur < 5.35) || m.dur < 3.65;
  const actual = fallback ? "TextCardReveal" : (componentTag[m.kind] || "TextCardReveal");
  const title = wordTake(
    m.headline,
    fallback ? Math.max(1, Math.floor((m.dur - 0.8) * 2.5) - 1) : 2,
  );
  const props = fallback
    ? { eyebrow: "Riego", lines: [title] }
    : actual === "OptionCompare"
      ? { left: ["Error", "Calendario", "Sin medir", "Falla"], right: ["Método", "Suelo", "Mide suelo", "Funciona"] }
      : actual === "CrossSection"
        ? { title, labels: ["Seco", "Raíz", "Drenaje", "Reserva"] }
        : actual === "StatBig"
          ? { value: String(m.number), label: title, caption: "Agua semanal" }
          : actual === "RuleNumberScene"
            ? { label: "Regla", title }
            : actual === "BarCompare"
              ? { eyebrow: "Profundidad", title, bars: ["Superficial 2 cm débil", "Profundo 20 cm estable"] }
              : actual === "ImpactReveal"
                ? { setup: "Daño silencioso", impact: title }
                : actual === "CalloutMark"
                  ? { figure: String(m.number), eyebrow: "Cifra", caption: title }
                  : {
                      title,
                      items: m.items
                        .slice(0, 2)
                        .map((x) => wordTake(x, 1)),
                    };
  gateLines.push(
    `  { key: "cue", start: ${m.start}, dur: ${m.dur}, kind: "${actual.toLowerCase()}", props: ${JSON.stringify(props)} }, // <${actual} />`,
  );
}
const cuesGate = `// MANIFIESTO MECÁNICO para compuertas de densidad/legibilidad.
// La composición real vive en Main_${slug}.tsx; estas líneas reflejan exactamente sus momentos visibles.
export const CUES_GATE_V7IOR5J7VKW9 = [
${gateLines.join("\n")}
] as const;
`;
fs.writeFileSync(`src/VideoEdit/cues_${slug}.gen.tsx`, cuesGate);

const avatarGate = `// AUTO-GENERADO: ventanas full/hidden del avatar.
export const TOTAL_V7IOR5J7VKW9 = ${totalSeconds};
export const AVATAR_V7IOR5J7VKW9 = ${JSON.stringify(windows, null, 2)} as const;
`;
fs.writeFileSync(`src/VideoEdit/avatar_${slug}.gen.ts`, avatarGate);

fs.writeFileSync(
  `_v3/${slug}_build_stats.json`,
  JSON.stringify(
    {
      totalSeconds,
      totalFrames,
      moments: moments.length,
      windows: windows.length,
      avatarSeconds: +avatarSeconds.toFixed(2),
      avatarPercent: +((avatarSeconds / totalSeconds) * 100).toFixed(1),
      componentSeconds: +componentSeconds.toFixed(2),
      brollSeconds: +brollSeconds.toFixed(2),
      imageSeconds: +imageSeconds.toFixed(2),
      renderedComponents: moments.filter(
        (m) => !m.avatarFull && m.tipo === "componente",
      ).length,
      renderedBroll: moments.filter(
        (m) => !m.avatarFull && m.tipo === "clip",
      ).length,
      renderedImages: moments.filter(
        (m) => !m.avatarFull && m.tipo === "imagen",
      ).length,
    },
    null,
    2,
  ),
);

console.log(fs.readFileSync(`_v3/${slug}_build_stats.json`, "utf8"));
