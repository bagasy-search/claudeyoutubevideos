#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const slug = "v55lhde2f1a4";
const fps = 30;
const totalFrames = 35609;
const totalSec = totalFrames / fps;
const planPath = `_v3/${slug}_plan.json`;
const beatsPath = `_v3/${slug}_beats.json`;
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const stockIndex = JSON.parse(
  fs.readFileSync(`public/broll/${slug}/supplemental_index.json`, "utf8"),
);
const clipDur = new Map(
  stockIndex.map((x) => [
    `broll/${slug}/${x.file}`,
    Number(x.durationSec || 10),
  ]),
);

const quotas = {
  hook: 5,
  mecanismo: 4,
  receta: 5,
  prueba_controlada: 4,
  plantado_y_aclimatacion: 4,
  limites_y_ciencia: 3,
  errores_y_cierre: 2,
};

const chooseSpacedUnique = (items, count, used) => {
  const chosen = [];
  for (let slot = 0; slot < count; slot++) {
    const target = ((slot + 0.5) * items.length) / count - 0.5;
    const ranked = items
      .map((m, i) => ({ m, i, d: Math.abs(i - target) }))
      .sort((a, b) => a.d - b.d);
    const pick =
      ranked.find(({ m }) => m.asset && !used.has(m.asset) && !chosen.includes(m)) ??
      ranked.find(({ m }) => !chosen.includes(m));
    if (!pick) continue;
    chosen.push(pick.m);
    if (pick.m.asset) used.add(pick.m.asset);
  }
  return chosen;
};

const keptStock = new Set();
const usedAssets = new Set();
for (const section of plan.secciones) {
  const stock = section.momentos.filter(
    (m) => m.tipo === "clip" && m.src !== "avatar",
  );
  for (const m of chooseSpacedUnique(stock, quotas[section.id] ?? 3, usedAssets)) {
    keptStock.add(m.id);
  }
}

const componentCycle = [
  "KineticHeadline",
  "KineticQuote",
  "TextCardReveal",
  "ProcessSteps",
  "OptionCompare",
  "SplitList",
  "Checklist",
  "RuleNumberScene",
  "CrossSection",
  "BarCompare",
  "StatBig",
  "CalloutMark",
];

let componentIndex = 0;
for (const section of plan.secciones) {
  section.fin = Math.min(section.fin, totalSec);
  for (const m of section.momentos) {
    const start = m.ms / 1000;
    m.seg = +Math.max(0.04, Math.min(m.seg, totalSec - start)).toFixed(2);
    if (m.tipo === "clip" && m.src !== "avatar" && !keptStock.has(m.id)) {
      m.tipo = "componente";
      m.src = null;
      m.asset = null;
      m.query = null;
      m.avatarFull = false;
      m.muestra = "Componente editorial del kit Amish, a pantalla completa";
      m.porque =
        "El modo sin imágenes IA exige resolver este concepto con el kit real y texto breve.";
    }
    if (m.tipo === "componente") {
      let kind = componentCycle[componentIndex % componentCycle.length];
      if (
        m.seg < 4.8 &&
        ["ProcessSteps", "CrossSection", "BarCompare"].includes(kind)
      ) {
        kind = componentIndex % 2 ? "KineticHeadline" : "CalloutMark";
      }
      m.kind = kind;
      componentIndex++;
    }
  }
}
plan.duracion = +totalSec.toFixed(3);
plan.stockAuditoria = {
  ...(plan.stockAuditoria || {}),
  criterioFinal:
    "27 clips reales únicos y espaciados; el resto se resuelve con componentes del kit porque IA está apagada.",
  clipsUsados: [...usedAssets],
  componentes: componentIndex,
};
fs.writeFileSync(planPath, JSON.stringify(plan, null, 2) + "\n", "utf8");

const all = plan.secciones.flatMap((section) =>
  section.momentos
    .filter((m) => m.ms / 1000 < totalSec)
    .map((m) => ({ ...m, section: section.id })),
);

const beatRows = all.map((m) => ({
  name: m.id,
  section: m.section,
  ms: m.ms,
  phrase: m.dice,
  dur: m.seg,
  desc: m.muestra,
  queries: m.query ? [m.query] : [],
  shot: m.src === "avatar" ? "medio" : "full",
  src: m.src,
  query: m.query,
  anchor: "plant cuttings",
  kind: m.kind,
  avatarFull: Boolean(m.src === "avatar"),
  personal: Boolean(m.personal),
  asset: m.asset,
}));
fs.writeFileSync(beatsPath, JSON.stringify(beatRows, null, 2) + "\n", "utf8");

fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(
  `beatsheet/${slug}.json`,
  JSON.stringify(
    {
      slug,
      fps,
      totalFrames,
      totalSec: +totalSec.toFixed(3),
      pacing: {
        targetMedian: "4-4.5s",
        targetLongPct: "36-43%",
        targetP75: ">=5s",
      },
      beats: beatRows,
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

const avatarWindows = [];
let previousMode = null;
for (const m of all) {
  const mode = m.src === "avatar" ? "full" : "hidden";
  if (mode !== previousMode) {
    avatarWindows.push({
      start: +(m.ms / 1000).toFixed(2),
      mode,
    });
    previousMode = mode;
  }
}
const totalConst = "TOTAL_V55LHDE2F1A4";
const avatarSource = `// Generado desde el plan del DIRECTOR. Fuente de verdad para las compuertas.
export const ${totalConst} = ${totalSec.toFixed(6)};
export const AVATAR_WINDOWS_V55LHDE2F1A4 = ${JSON.stringify(avatarWindows, null, 2)} as const;
`;
fs.writeFileSync(
  `src/VideoEdit/avatar_${slug}.gen.ts`,
  avatarSource,
  "utf8",
);

const cleanWords = (text) =>
  text
    .replace(/\[[^\]]+\]/g, "")
    .replace(/[“”"¿?¡!;:()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
const stopTail = new Set([
  "de",
  "del",
  "la",
  "el",
  "y",
  "o",
  "que",
  "con",
  "sin",
  "para",
  "por",
  "un",
  "una",
]);
const headline = (m, reserve = 2) => {
  const max = Math.max(
    3,
    Math.min(4, Math.floor((m.seg - 0.8) * 2.5) - reserve),
  );
  const clause = m.dice.split(/[.,;:]/)[0] || m.dice;
  const words = cleanWords(clause).slice(0, max);
  while (words.length > 3 && stopTail.has(words.at(-1).toLowerCase())) words.pop();
  return words;
};
const q = (s) => JSON.stringify(String(s));
const qSafe = (s) => q(String(s).length < 2 ? `${s}.` : s);
const chunks = (words, count) => {
  const out = [];
  const n = Math.max(1, Math.min(count, words.length));
  for (let i = 0; i < n; i++) {
    const a = Math.floor((i * words.length) / n);
    const b = Math.floor(((i + 1) * words.length) / n);
    out.push(words.slice(a, Math.max(a + 1, b)).join(" "));
  }
  return out.filter(Boolean);
};
const numeric = (text) => {
  const hit = text.match(/\b(\d+(?:[.,]\d+)?)\b/);
  return hit ? Number(hit[1].replace(",", ".")) : 7;
};
const unit = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes("día")) return " días";
  if (lower.includes("hora")) return " h";
  if (lower.includes("centímetro")) return " cm";
  if (lower.includes("litro")) return " L";
  if (lower.includes("taza")) return " tazas";
  return "";
};

const componentJsx = (m, ordinal) => {
  const words = headline(m, 2);
  const title = words.join(" ");
  const short = chunks(words, 3);
  switch (m.kind) {
    case "KineticHeadline":
      return `<KineticHeadline durationInFrames={d} eyebrow="CLAVE" hue="amber" size={82} tokens={[${words
        .map(
          (w, i) =>
            `{t:${qSafe(w.toUpperCase())}${i === words.length - 1 ? ",hl:true" : ""}}`,
        )
        .join(",")}]} />`;
    case "KineticQuote":
      return `<KineticQuote durationInFrames={d} eyebrow="PRINCIPIO" hue="amber" words={parseQuote(${q(
        title,
      )})} />`;
    case "TextCardReveal":
      return `<TextCardReveal durationInFrames={d} lines={[${chunks(
        words,
        2,
      )
        .map(qSafe)
        .join(",")}]} />`;
    case "ProcessSteps":
      return `<ProcessSteps durationInFrames={d} title="MÉTODO" hue="amber" steps={[${chunks(
        headline(m, 4),
        3,
      )
        .map((x) => `{title:${qSafe(x)}}`)
        .join(",")}]} />`;
    case "OptionCompare": {
      const halves = chunks(headline(m, 6), 2);
      return `<OptionCompare durationInFrames={d} left={{tag:"evita",title:${qSafe(
        halves[0] || "Agua sola",
      )},sub:"agua",note:"sola",icon:"warn",accent:"orange"}} right={{tag:"mejor",title:${qSafe(
        halves[1] || "Agua de sauce",
      )},sub:"agua",note:"sauce",icon:"check",accent:"green"}} />`;
    }
    case "SplitList":
      return `<SplitList durationInFrames={d} title="PUNTOS CLAVE" items={[${chunks(
        headline(m, 5),
        3,
      )
        .map(qSafe)
        .join(",")}]} accent="tan" />`;
    case "Checklist":
      return `<Checklist durationInFrames={d} title="CONTROL" hue="amber" items={[${chunks(
        headline(m, 4).slice(0, 3),
        3,
      )
        .map((x) => `{text:${qSafe(x)},state:"done"}`)
        .join(",")}]} />`;
    case "RuleNumberScene":
      return `<RuleNumberScene durationInFrames={d} number=${q(
        String((ordinal % 7) + 1).padStart(2, "0"),
      )} label="REGLA" title=${qSafe(
        headline(m, 4).slice(0, 1).join(" "),
      )} hue="amber" />`;
    case "CrossSection":
      return `<CrossSection durationInFrames={d} eyebrow="CORTE" title=${q(
        headline(m, 8).slice(0, 2).join(" "),
      )} hue="amber" layers={[{label:"Tallo",color:"brown"},{label:"Callo",color:"tan"},{label:"Raíces",color:"green"}]} marker={{label:"nodo",atDepth:58,color:"good"}} />`;
    case "BarCompare":
      return `<BarCompare durationInFrames={d} eyebrow="COMPARA" title=${q(
        headline(m, 8).slice(0, 2).join(" "),
      )} hue="amber" orientation="horizontal" bars={[{label:"Agua",value:1,display:"1×"},{label:"Sauce",value:3,display:"3×",winner:true}]} />`;
    case "StatBig":
      return `<StatBig durationInFrames={d} value={${numeric(m.dice)}}${
        unit(m.dice) ? ` suffix=${q(unit(m.dice))}` : ""
      } eyebrow="NÚMERO" label=${q(
        words.slice(0, 3).join(" "),
      )} hue="amber" />`;
    case "CalloutMark":
    default:
      return `<CalloutMark durationInFrames={d} figure=${q(
        m.dice.match(/\b\d+(?:[.,]\d+)?\b/)?.[0] || "OK",
      )} eyebrow="CLAVE" caption=${q(
        headline(m, 4).slice(0, 2).join(" "),
      )} hue="amber" />`;
  }
};

const cueLines = [];
const assets = new Set([
  `avatar_${slug}.mp4`,
  "assets/ic_warn.svg",
  "assets/ic_check.svg",
]);
let ordinal = 0;
for (const m of all) {
  if (m.src === "avatar") continue;
  const start = +(m.ms / 1000).toFixed(2);
  const dur = +Math.min(m.seg, totalSec - start).toFixed(2);
  if (dur <= 0) continue;
  if (m.tipo === "clip") {
    const src = m.asset;
    assets.add(src);
    cueLines.push(
      `  { key:${q(m.id)}, start:${start}, dur:${dur}, kind:"clip", el:(d) => <RawShot durationInFrames={d} src=${q(
        src,
      )} hue="amber" clipDur={${clipDur.get(src) || 10}} kbPhase={${
        ordinal % 4
      }} /> },`,
    );
  } else {
    cueLines.push(
      `  { key:${q(m.id)}, start:${start}, dur:${dur}, kind:${q(
        m.kind.toLowerCase(),
      )}, el:(d) => ${componentJsx(m, ordinal)} },`,
    );
  }
  ordinal++;
}

const cueSource = `import type { ReactNode } from "react";
import { RawShot } from "./scenes/RawShot";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { OptionCompare } from "./scenes/OptionCompare";
import { SplitList } from "./scenes/SplitList";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { CrossSection } from "./scenes/CrossSection";
import { BarCompare } from "./scenes/BarCompare";
import { StatBig } from "./scenes/StatBig";
import { CalloutMark } from "./scenes/CalloutMark";

export type V55Cue = { key:string; start:number; dur:number; kind:string; el:(durationInFrames:number)=>ReactNode };
export const CUES_V55LHDE2F1A4: V55Cue[] = [
${cueLines.join("\n")}
];

// Manifiesto explícito: lo valida farm.mjs antes de encender runners.
export const ASSET_MANIFEST_V55LHDE2F1A4 = ${JSON.stringify(
  [...assets].map((src) => ({ src })),
  null,
  2,
)} as const;
`;
fs.writeFileSync(
  `src/VideoEdit/cues_${slug}.gen.tsx`,
  cueSource,
  "utf8",
);

const sectionStarts = plan.secciones
  .slice(1)
  .map((s) => +s.inicio.toFixed(2))
  .filter((x) => x < totalSec);
const mainSource = `import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { TechBackground } from "./components/TechBackground";
import { SectionStinger } from "./components/SectionFx";
import { CUES_V55LHDE2F1A4 } from "./cues_${slug}.gen";

export const TOTAL_FRAMES_V55LHDE2F1A4 = ${totalFrames};
const FPS = ${fps};
const SECTION_STARTS = ${JSON.stringify(sectionStarts)} as const;

export const MainV55lhde2f1a4: React.FC = () => {
  const frame = useCurrentFrame();
  const avatarScale = interpolate(frame, [0, TOTAL_FRAMES_V55LHDE2F1A4], [1.0, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{backgroundColor:"#17120d"}}>
      <TechBackground />
      <AbsoluteFill style={{transform:\`scale(\${avatarScale})\`, transformOrigin:"50% 46%"}}>
        <Video
          src={staticFile("avatar_${slug}.mp4")}
          style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"50% 50%"}}
        />
      </AbsoluteFill>
      {CUES_V55LHDE2F1A4.map((cue) => {
        const from = Math.round(cue.start * FPS);
        const durationInFrames = Math.max(1, Math.min(
          Math.round(cue.dur * FPS),
          TOTAL_FRAMES_V55LHDE2F1A4 - from,
        ));
        return (
          <Sequence key={cue.key} from={from} durationInFrames={durationInFrames} premountFor={FPS}>
            {cue.el(durationInFrames)}
          </Sequence>
        );
      })}
      {SECTION_STARTS.map((start) => (
        <Sequence key={start} from={Math.round(start * FPS)} durationInFrames={18}>
          <SectionStinger durationInFrames={18} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
`;
fs.writeFileSync(
  `src/VideoEdit/Main_${slug}.tsx`,
  mainSource,
  "utf8",
);

const indexSource = `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { MainV55lhde2f1a4, TOTAL_FRAMES_V55LHDE2F1A4 } from "./VideoEdit/Main_${slug}";

const V55lhde2f1a4Root: React.FC = () => (
  <Composition
    id="V55LHDE2F1A4"
    component={MainV55lhde2f1a4}
    durationInFrames={TOTAL_FRAMES_V55LHDE2F1A4}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(V55lhde2f1a4Root);
`;
fs.writeFileSync(`src/index_${slug}.tsx`, indexSource, "utf8");

const assetList = [`${slug}.wav`, "sfx", ...assets].sort();
fs.writeFileSync(
  `public/_assets_${slug}.txt`,
  assetList.join("\n") + "\n",
  "utf8",
);

const typeCounts = all.reduce(
  (acc, m) => {
    const key =
      m.src === "avatar"
        ? "avatar"
        : m.tipo === "clip"
          ? "stock"
          : "componente";
    acc[key]++;
    return acc;
  },
  { avatar: 0, stock: 0, componente: 0 },
);
console.log(
  JSON.stringify(
    {
      totalFrames,
      totalSec: +totalSec.toFixed(3),
      cues: cueLines.length,
      assets: assets.size,
      types: typeCounts,
      avatarWindows: avatarWindows.length,
    },
    null,
    2,
  ),
);
