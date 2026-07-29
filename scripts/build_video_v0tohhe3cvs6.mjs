import fs from "node:fs";
import { execFileSync } from "node:child_process";

const slug = "v0tohhe3cvs6";
const plan = JSON.parse(fs.readFileSync(`_v3/${slug}_plan.json`, "utf8"));
const stock = JSON.parse(
  fs.readFileSync(`_v3/${slug}_stock_index.json`, "utf8"),
);
const stockDuration = new Map(stock.map((item) => [item.name, item.duration]));
const webSelectionPath = `_v3/${slug}_web_selection.json`;
const webSelection = fs.existsSync(webSelectionPath)
  ? new Map(
      JSON.parse(fs.readFileSync(webSelectionPath, "utf8")).map((item) => [
        item.key,
        item.file,
      ]),
    )
  : new Map();
const componentOverride = new Set([
  "d007",
  "d014",
  "d015",
  "d017",
  "d018",
  "d022",
  "d023",
  "d030",
  "d032",
  "d034",
  "d035",
  "d036",
  "d039",
  "d041",
  "d044",
  "d047",
  "d051",
]);
const stockOverlay = new Set([
  "d001",
  "d002",
  "d004",
  "d008",
  "d009",
  "d010",
  "d011",
  "d016",
]);
const hiddenAvatarStarts = new Set([711.22, 952.26, 1073.22]);
const q = (value) => JSON.stringify(String(value));
const qs = (value) =>
  `'${String(value).replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
const round = (value) => +Number(value).toFixed(2);

let totalSeconds = 1432.96;
try {
  totalSeconds = +execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=nw=1:nk=1",
      `public/avatar_${slug}.mp4`,
    ],
    { encoding: "utf8" },
  ).trim();
} catch {
  // The exact known duration above is a safe fallback.
}
totalSeconds = round(totalSeconds);

const original = plan.secciones.flatMap((section) =>
  section.momentos.map((moment) => ({ ...moment, section: section.id })),
);

// Slow, varied Amish pacing: merge exactly twenty adjacent short information
// cards. This raises the share of shots >=5s without stretching every cue.
const merged = [];
let merges = 0;
for (const section of plan.secciones) {
  for (let index = 0; index < section.momentos.length; index++) {
    const first = { ...section.momentos[index], section: section.id };
    const second = section.momentos[index + 1];
    const canMerge =
      merges < 20 &&
      second &&
      first.tipo === "componente" &&
      second.tipo === "componente" &&
      !/avatar/i.test(first.kind) &&
      !/avatar/i.test(second.kind) &&
      !first.obligado &&
      !second.obligado &&
      first.seg < 5 &&
      second.seg < 5 &&
      first.seg + second.seg <= 8.8;
    if (canMerge) {
      merged.push({
        ...first,
        dice: `${first.dice} ${second.dice}`,
        muestra: `${first.muestra} ${second.muestra}`,
        seg: round(first.seg + second.seg),
        fin: second.fin,
        porque: `${first.porque} ${second.porque}`,
      });
      index++;
      merges++;
    } else {
      merged.push(first);
    }
  }
}
if (merges !== 20) throw new Error(`Expected 20 pacing merges, got ${merges}`);

const compactWords = (value, max = 9) =>
  String(value)
    .replace(/[“”"*_]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, max)
    .join(" ");

const quoted = (moment) => {
  const matches = [
    ...String(moment.muestra).matchAll(/[“"]([^”"]{2,})[”"]/g),
  ].map((match) => compactWords(match[1], 8));
  if (matches.length) return matches.slice(0, 3);
  return [compactWords(moment.dice, 8)];
};

const clauses = (moment) => {
  const fromQuotes = quoted(moment);
  if (fromQuotes.length >= 2) return fromQuotes.slice(0, 3);
  const words = compactWords(moment.dice, 12).split(" ");
  const size = Math.max(2, Math.ceil(words.length / 3));
  const chunks = [];
  for (let index = 0; index < words.length; index += size) {
    chunks.push(words.slice(index, index + size).join(" "));
  }
  return chunks.slice(0, 3).filter(Boolean);
};

const firstNumber = (moment) => {
  const match = `${moment.muestra} ${moment.dice}`.match(
    /(?:\$)?\b(\d[\d,]*(?:\.\d+)?)\s*(%|°F|days?|years?|hours?)?/i,
  );
  if (!match) return { value: 10, suffix: "" };
  const value = Math.max(0, Math.min(1000000, +match[1].replace(/,/g, "")));
  const unit = match[2] || "";
  return { value, suffix: unit === "%" ? "%" : "" };
};

const secretNumber = (moment) => {
  const match = `${moment.muestra} ${moment.dice}`.match(
    /(?:SECRET|Secret)\s*(?:#|NO\.?\s*)?(\d{1,2})/,
  );
  if (match) return match[1].padStart(2, "0");
  const word = String(moment.dice)
    .toLowerCase()
    .match(/\bnumber\s+(one|two|three|four|five|six|seven|eight|nine|ten)\b/)?.[1];
  const words = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };
  return word ? String(words[word]).padStart(2, "0") : "";
};

const specialTitle = (moment) => {
  const dice = String(moment.dice).toLowerCase();
  if (dice.includes("sells that cure again")) return "BREAK IT. PAY AGAIN.";
  if (dice.includes("carry pathogens")) return "PATHOGEN PATHWAYS";
  if (dice.includes("warm-looking pile")) return "LOOKS AREN'T PROOF";
  if (dice.includes("hay, or permanent vegetation")) return "CONTOUR BANDS";
  if (dice.includes("at least 100 meters")) return "HEDGEROW REACH";
  if (dice.includes("one person carry")) return "SPREAD THE DECISIONS";
  if (dice.includes("scouting can reduce")) return "SCOUT BEFORE TREATING";
  const recap = [
    ["number one", "ROTATE LONGER"],
    ["number two", "KEEP LIVING ROOTS"],
    ["number three", "LET LEGUMES FIX NITROGEN"],
    ["number four", "COMPOST MANURE SAFELY"],
    ["number five", "CONTROL FIELD TRAFFIC"],
    ["number six", "FARM ON CONTOUR"],
    ["number seven", "BUILD HEDGEROW HABITAT"],
    ["number eight", "DIVERSIFY THE FARM"],
    ["number nine", "SCOUT BEFORE SPRAYING"],
    ["number ten", "REPAIR BEFORE REPLACING"],
  ].find(([needle]) => dice.includes(needle));
  return recap?.[1] || "";
};

const specialKind = (moment) => {
  const dice = String(moment.dice).toLowerCase();
  if (dice.includes("sells that cure again")) return "textcard";
  if (dice.includes("carry pathogens")) return "checklist";
  if (dice.includes("warm-looking pile")) return "textcard";
  if (dice.includes("hay, or permanent vegetation")) return "checklist";
  if (dice.includes("at least 100 meters")) return "stat";
  if (dice.includes("one person carry")) return "textcard";
  if (dice.includes("scouting can reduce")) return "textcard";
  if (/\bnumber\s+(one|two|three|four|five|six|seven|eight|nine|ten)\b/.test(dice)) {
    return "rule";
  }
  return "";
};

const specialPreRoll = (moment) => {
  const dice = String(moment.dice).toLowerCase();
  if (dice.includes("sells that cure again")) return 2.2;
  if (dice.includes("carry pathogens")) return 1.6;
  if (dice.includes("warm-looking pile")) return 2.0;
  if (dice.includes("at least 100 meters")) return 1.6;
  return 0;
};

const componentKind = (planned, index) => {
  const map = {
    AgedDoc: "ageddoc",
    ProcessSteps: "process",
    BarCompare: "bars",
    CostCumulative: "bars",
    StatBig: "stat",
    CrossSection: "crosssection",
    SelectiveCompare: "option",
    OptionCompare: "option",
    Checklist: "checklist",
    SafetyGrid: "checklist",
    RuleNumberScene: "rule",
    SectionStinger: "rule",
    KineticHeadline: "quote",
    CinematicWrap: "quote",
    ImpactReveal: "callout",
    TextCardReveal: "textcard",
    ChipsCluster: "chips",
    SplitList: "split",
    ReframeList: "reframe",
    DiagramBoard: "process",
    ValueJourney: "process",
    JourneyCanvas: "process",
    ThreeMethods: "process",
    ReframedVideo: "callout",
    NextVideoEndcard: "textcard",
    RamPumpCycle: "process",
  };
  const fallbacks = [
    "ageddoc",
    "process",
    "bars",
    "crosssection",
    "option",
    "checklist",
    "quote",
    "callout",
    "textcard",
    "chips",
    "reframe",
    "rule",
  ];
  return map[planned] || fallbacks[index % fallbacks.length];
};

const renderComponent = (moment, kind) => {
  const lines = clauses(moment);
  const title = compactWords(
    specialTitle(moment) || quoted(moment)[0] || moment.dice,
    kind === "quote" && moment.seg < 3 ? 2 : 3,
  );
  const micro = lines
    .map((line) => compactWords(line, 1))
    .filter(Boolean)
    .slice(0, 3);
  while (micro.length < 3) micro.push(["BUILD", "KEEP", "GAIN"][micro.length]);
  const diceLower = String(moment.dice).toLowerCase();
  if (diceLower.includes("carry pathogens")) {
    micro.splice(0, micro.length, "MANURE", "PRODUCE", "WATER");
  }
  if (diceLower.includes("hay, or permanent vegetation")) {
    micro.splice(0, micro.length, "CROPS", "HAY", "PERMANENT GRASS");
  }
  const num = firstNumber(moment);
  const secret = secretNumber(moment);
  const eyebrow = secret ? `SECRET ${secret}` : "FIELD";
  switch (kind) {
    case "ageddoc":
      return `<AgedDoc durationInFrames={d} eyebrow=${q(
        eyebrow,
      )} heading=${q(title)} hue="amber" accent="accent" lines={[${lines
        .slice(0, 2)
        .map((line, index) => `{text:${q(compactWords(line, 1))}${index === 1 ? ",mark:true" : ""}}`)
        .join(",")}]} />`;
    case "process":
      return `<ProcessSteps durationInFrames={d} eyebrow=${q(
        eyebrow,
      )} title=${q(title)} orientation="horizontal" hue="amber" accent="accent" steps={[${micro
        .slice(0, 3)
        .map((line) => `{title:${q(line)}}`)
        .join(",")}]} />`;
    case "bars":
      return `<BarCompare durationInFrames={d} eyebrow=${q(
        eyebrow,
      )} title=${q(title)} orientation="horizontal" hue="amber" bars={[{label:${q(
        micro[0],
      )},value:42,display:${q("COST")},tone:"danger"},{label:${q(
        micro[1],
      )},value:86,display:${q("GAIN")},tone:"good",winner:true}]} />`;
    case "stat":
      if (diceLower.includes("at least 100 meters")) {
        return `<StatBig durationInFrames={d} to={100} suffix=" m" label="FROM HEDGEROWS" icon="growth" accent="amber" hue="amber" />`;
      }
      return `<StatBig durationInFrames={d} to={${num.value}} suffix=${q(
        num.suffix,
      )} label=${q(title)} icon="growth" accent="amber" hue="amber" />`;
    case "crosssection":
      return `<CrossSection durationInFrames={d} eyebrow=${q(
        eyebrow,
      )} title=${q(title)} hue="amber" layers={[{label:${qs(
        micro[0],
      )},color:${qs("rgba(169,132,78,0.75)")},weight:0.75},{label:${qs(
        micro[1],
      )},color:${qs("rgba(110,88,55,0.85)")},weight:1},{label:${qs(
        micro[2],
      )},color:${qs("rgba(82,112,105,0.65)")},weight:1.1}]} marker={{label:${qs("roots")},atDepth:0.54,color:${qs("amber")}}} />`;
    case "option":
      return `<OptionCompare durationInFrames={d} left={{tag:"INPUT",title:"BUY",sub:"again",note:"recurring",icon:"bills",accent:"#A9634B"}} right={{tag:"PLAIN",title:${q(
        compactWords(title, 1),
      )},sub:"build",note:"compounding",icon:"growth",accent:"#9B8A52"}} />`;
    case "checklist":
      return `<Checklist durationInFrames={d} eyebrow=${q(
        eyebrow,
      )} title=${q(title)} hue="amber" items={[${micro
        .slice(0, 3)
        .map(
          (line, index) =>
            `{text:${qs(line)},state:${index === 2 ? "'doing'" : "'done'"}}`,
        )
        .join(",")}]} />`;
    case "rule":
      return `<RuleNumberScene durationInFrames={d} number=${q(
        secret || "•",
      )} label=${q(secret ? "SECRET" : "RULE")} title=${q(
        title,
      )} hue="amber" />`;
    case "quote":
      return `<KineticQuote durationInFrames={d} eyebrow=${q(
        eyebrow,
      )} words={parseQuote(${q(title)})} accent="accent" hue="amber" />`;
    case "textcard":
      if (specialTitle(moment)) {
        const lines = diceLower.includes("sells that cure again")
          ? ["BREAK IT.", "PAY AGAIN."]
          : [title];
        return `<TextCardReveal durationInFrames={d} eyebrow=${q(
          eyebrow,
        )} lines={[${lines.map(q).join(",")}]} accent="#C2A56B" />`;
      }
      return `<TextCardReveal durationInFrames={d} eyebrow=${q(
        eyebrow,
      )} lines={[${lines
        .slice(0, 2)
        .map((line) => q(compactWords(line, 2)))
        .join(",")}]} accent="#C2A56B" />`;
    case "chips":
      return `<ChipsCluster durationInFrames={d} title=${q(
        title,
      )} chips={[${lines
        .slice(0, 3)
        .map((line) => q(compactWords(line, 1).toUpperCase()))
        .join(",")}]} hue="amber" />`;
    case "split":
      return `<SplitList durationInFrames={d} title=${q(
        title,
      )} items={[${lines
        .slice(0, 3)
        .map((line) => q(compactWords(line, 1)))
        .join(",")}]} accent="#C2A56B" />`;
    case "reframe":
      return `<ReframeList durationInFrames={d} eyebrow=${q(
        eyebrow,
      )} title=${q(title)} accent="#C2A56B" items={[${lines
        .slice(0, 3)
        .map(
          (line) => `{text:${q(compactWords(line, 1))},icon:"check"}`,
        )
        .join(",")}]} />`;
    default:
      return `<CalloutMark durationInFrames={d} figure=${q(
        secret ? `#${+secret}` : num.suffix ? `${num.value}${num.suffix}` : "WHY",
      )} eyebrow=${q(eyebrow)} caption=${q(title)} accent="accent" hue="amber" />`;
  }
};

const avatarWindows = [];
let priorMode = null;
for (const moment of original) {
  const mode =
    /avatar/i.test(moment.kind) && !hiddenAvatarStarts.has(round(moment.inicio))
      ? "full"
      : "hidden";
  if (mode !== priorMode) {
    avatarWindows.push({ start: round(moment.inicio), mode });
    priorMode = mode;
  }
}
if (avatarWindows[0]?.start !== 0 || avatarWindows[0]?.mode !== "full") {
  throw new Error("The video must open with the full-screen avatar");
}

let clipIndex = 0;
const cueLines = [];
let cueIndex = 0;
for (const moment of merged) {
  const replacedAvatar =
    /avatar/i.test(moment.kind) &&
    hiddenAvatarStarts.has(round(moment.inicio));
  if (/avatar/i.test(moment.kind) && !replacedAvatar) continue;
  cueIndex++;
  const key = `m${String(cueIndex).padStart(3, "0")}`;
  const preRoll = specialPreRoll(moment);
  const start = round(Math.max(0, moment.inicio - preRoll));
  const dur = round(moment.seg + preRoll);
  if (moment.tipo === "clip") {
    clipIndex++;
    const name = `d${String(clipIndex).padStart(3, "0")}`;
    if (componentOverride.has(name)) {
      const overrideKinds = ["process", "crosssection", "checklist", "quote", "ageddoc"];
      const kind =
        dur < 4.4 ? "quote" : overrideKinds[clipIndex % overrideKinds.length];
      cueLines.push(
        `  { key: ${q(key)}, start: ${start}, dur: ${dur}, kind: ${q(
          kind,
        )}, el: (d) => ${renderComponent(moment, kind)} },`,
      );
      continue;
    }
    const webFile = webSelection.get(name);
    if (webFile) {
      cueLines.push(
        `  { key: ${q(key)}, start: ${start}, dur: ${dur}, kind: "raw", el: (d) => <RawShot durationInFrames={d} src=${q(
          `img/${webFile}`,
        )} hue="amber" darken={0.04} kbPhase={${clipIndex % 7}} kbBoost={1.15} /> },`,
      );
      continue;
    }
    const clipDur = round(stockDuration.get(name) || 12);
    if (stockOverlay.has(name)) {
      cueLines.push(
        `  { key: ${q(key)}, start: ${start}, dur: ${dur}, kind: "callout", el: (d) => <CalloutMark durationInFrames={d} image=${q(
          `broll/${slug}/${name}.mp4`,
        )} figure="FIELD" eyebrow="REAL" caption=${q(
          compactWords(moment.dice, 1),
        )} accent="accent" hue="amber" /> },`,
      );
      continue;
    }
    cueLines.push(
      `  { key: ${q(key)}, start: ${start}, dur: ${dur}, kind: "raw", el: (d) => <RawShot durationInFrames={d} src=${q(
        `broll/${slug}/${name}.mp4`,
      )} hue="amber" darken={0.04} clipDur={${clipDur}} kbPhase={${
        clipIndex % 7
      }} /> },`,
    );
    continue;
  }
  const kind =
    specialKind(moment) ||
    (dur < 4.4 ? "quote" : componentKind(moment.kind, cueIndex));
  cueLines.push(
    `  { key: ${q(key)}, start: ${start}, dur: ${dur}, kind: ${q(
      kind,
    )}, el: (d) => ${renderComponent(moment, kind)} },`,
  );
}
if (clipIndex !== 52) throw new Error(`Expected 52 clips, got ${clipIndex}`);

const cueSource = `import React from "react";
import { RawShot } from "./scenes/RawShot";
import { AgedDoc } from "./scenes/AgedDoc";
import { ProcessSteps } from "./scenes/ProcessSteps";
import { BarCompare } from "./scenes/BarCompare";
import { StatBig } from "./scenes/DataViz";
import { CrossSection } from "./scenes/CrossSection";
import { OptionCompare } from "./scenes/OptionCompare";
import { Checklist } from "./scenes/Checklist";
import { RuleNumberScene } from "./scenes/RuleNumberScene";
import { KineticQuote, parseQuote } from "./scenes/KineticQuote";
import { TextCardReveal } from "./scenes/TextCardReveal";
import { ChipsCluster, ReframeList } from "./scenes/ReframeContent";
import { SplitList } from "./scenes/SplitList";
import { CalloutMark } from "./scenes/CalloutMark";

export const TOTAL_V0TOHHE3CVS6 = ${totalSeconds};
export type CueV0TOHHE3CVS6 = { key: string; start: number; dur: number; kind: string; el: (durationInFrames: number) => React.ReactNode };
export const CUES_V0TOHHE3CVS6: CueV0TOHHE3CVS6[] = [
${cueLines.join("\n")}
];
`;

const avatarSource = `import type { AvatarWindow } from "./scenes/AvatarLayer";
export const TOTAL_V0TOHHE3CVS6 = ${totalSeconds};
export const AVATAR_V0TOHHE3CVS6: AvatarWindow[] = ${JSON.stringify(
  avatarWindows,
  null,
  2,
)};
`;

const totalFrames = Math.round(totalSeconds * 30);
const mainSource = `import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { COLORS, sec } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { SfxCue, POPS } from "./components/Sfx";
import { AVATAR_V0TOHHE3CVS6 } from "./avatar_${slug}.gen";
import { CUES_V0TOHHE3CVS6 } from "./cues_${slug}.gen";

export const TOTAL_FRAMES_V0TOHHE3CVS6 = ${totalFrames};

const AvatarCameraV0TOHHE3CVS6: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = interpolate(frame, [90, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftX = Math.sin(frame / 520) * 7 * camera;
  const driftY = Math.cos(frame / 690) * 4 * camera;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "72% 18%", transform: \`translate(\${driftX}px, \${driftY}px) scale(\${1 + camera * 0.045})\` }}>
        <AvatarLayer src="${slug}_opt.mp4" wav="${slug}.wav" windows={AVATAR_V0TOHHE3CVS6} accent="#C2A56B" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MainV0TOHHE3CVS6: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <TechBackground glowX={48} glowY={42} hue="cold" drift={0.35} />
    <AvatarCameraV0TOHHE3CVS6 />
    {CUES_V0TOHHE3CVS6.map((cue) => (
      <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)} premountFor={30}>
        {cue.el(sec(cue.dur))}
      </Sequence>
    ))}
    {CUES_V0TOHHE3CVS6.map((cue, index) =>
      cue.kind !== "raw" && index % 6 === 0 ? (
        <SfxCue key={"sfx-" + cue.key} at={sec(cue.start)} src={POPS[index % POPS.length]} volume={0.08} />
      ) : null,
    )}
  </AbsoluteFill>
);
`;

const entrySource = `import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainV0TOHHE3CVS6, TOTAL_FRAMES_V0TOHHE3CVS6 } from "./VideoEdit/Main_${slug}";

const RootV0TOHHE3CVS6 = () => (
  <Composition
    id="V0TOHHE3CVS6"
    component={MainV0TOHHE3CVS6}
    durationInFrames={TOTAL_FRAMES_V0TOHHE3CVS6}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RootV0TOHHE3CVS6);
`;

fs.writeFileSync(`src/VideoEdit/cues_${slug}.gen.tsx`, cueSource, "utf8");
fs.writeFileSync(`src/VideoEdit/avatar_${slug}.gen.ts`, avatarSource, "utf8");
fs.writeFileSync(`src/VideoEdit/Main_${slug}.tsx`, mainSource, "utf8");
fs.writeFileSync(`src/index_${slug}.tsx`, entrySource, "utf8");
const farmAssets = [
  `${slug}_opt.mp4`,
  `${slug}.wav`,
  "sfx",
  "assets",
  ...new Set(
    [...cueSource.matchAll(/(?:src|image)=("([^"]+)")/g)]
      .map((match) => match[2])
      .filter((asset) => /^(?:img|broll|vid|real)\//.test(asset)),
  ),
].sort();
fs.writeFileSync(
  `public/farm_assets_${slug}.txt`,
  `${farmAssets.join("\n")}\n`,
  "utf8",
);

const durations = merged.map((moment) => moment.seg).sort((a, b) => a - b);
const long = durations.filter((duration) => duration >= 5).length;
console.log(
  JSON.stringify({
    totalSeconds,
    totalFrames,
    cues: cueLines.length,
    clips: clipIndex,
    farmAssets: farmAssets.length,
    avatarWindows: avatarWindows.length,
    merges,
    shots: durations.length,
    median: durations[Math.floor(durations.length / 2)],
    p75: durations[Math.floor(durations.length * 0.75)],
    longPct: round((100 * long) / durations.length),
  }),
);
