#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const slug = "v48vr0jexdrms";
const timeline = JSON.parse(
  fs.readFileSync(path.join(".bagasy", `timeline_${slug}.json`), "utf8"),
);
const stock = JSON.parse(
  fs.readFileSync(
    path.join(".bagasy", "operations", "stock-premium.json"),
    "utf8",
  ),
);

const rejected = new Set([
  `${slug}_s03_cistern_m14`,
  `${slug}_s06_springhouse_m02`,
  `${slug}_s06_springhouse_m07`,
  `${slug}_s07_dug_well_m07`,
  `${slug}_s07_dug_well_m08`,
  `${slug}_s09_windmill_m07`,
  `${slug}_s09_windmill_m09`,
  `${slug}_supp_filter`,
  `${slug}_supp_rain_barrel`,
]);
const assets = stock.assets
  .filter((asset) => asset.status === "ready" && !rejected.has(asset.name))
  .map((asset) => ({
    ...asset,
    src: `broll/${slug}/${asset.name}.mp4`,
  }));
const assetByMoment = new Map(
  assets.map((asset) => [asset.moment_id, asset]),
);
const globalPool = assets.filter(
  (asset) => asset.section_id === "supplement",
);
const sectionPools = new Map();
for (const asset of assets) {
  if (asset.section_id === "supplement") continue;
  const pool = sectionPools.get(asset.section_id) ?? [];
  pool.push(asset);
  sectionPools.set(asset.section_id, pool);
}

const supplementalBySection = {
  s00_hook: ["supp_gutter", "supp_tank"],
  s01_principle: ["supp_pipe", "supp_well"],
  s02_roof_catchment: ["supp_gutter", "supp_tank"],
  s03_cistern: ["supp_tank", "supp_pipe"],
  s04_spring_box: ["supp_spring", "supp_pipe"],
  s05_gravity_line: ["supp_pipe", "supp_tank"],
  s06_springhouse: ["supp_spring", "supp_pipe"],
  s07_dug_well: ["supp_well", "supp_pump"],
  s08_hand_pump: ["supp_pump", "supp_well"],
  s09_windmill: ["supp_wind", "supp_tank"],
  s10_ram_pump: ["supp_ram", "supp_spring", "supp_pipe"],
  s11_pond: ["supp_pond", "supp_trough"],
  s12_resilience: ["supp_tank", "supp_pipe", "supp_well"],
  s13_treatment: ["supp_pipe", "supp_spring", "supp_tank"],
  s14_cross_connection: ["supp_trough", "supp_pipe"],
  s15_recap: ["supp_well", "supp_tank", "supp_gutter"],
  s16_close: ["supp_spring", "supp_wind", "supp_pond"],
};
const supplementMap = new Map(
  globalPool.map((asset) => [
    asset.moment_id,
    asset,
  ]),
);
for (const [section, ids] of Object.entries(supplementalBySection)) {
  const pool = sectionPools.get(section) ?? [];
  for (const id of ids) {
    const asset = supplementMap.get(id);
    if (asset) pool.push(asset);
  }
  sectionPools.set(section, pool);
}

const usage = new Map();
const lastBySection = new Map();
const chooseAsset = (scene, ordinal) => {
  const direct = assetByMoment.get(scene.id);
  if (direct) {
    usage.set(direct.name, (usage.get(direct.name) ?? 0) + 1);
    return direct;
  }
  const pool = sectionPools.get(scene.section_id) ?? globalPool;
  if (!pool.length) return assets[ordinal % assets.length];
  const previous = lastBySection.get(scene.section_id);
  const ordered = [...pool].sort((left, right) => {
    const leftCount = usage.get(left.name) ?? 0;
    const rightCount = usage.get(right.name) ?? 0;
    return leftCount - rightCount || left.name.localeCompare(right.name);
  });
  const chosen =
    ordered.find(
      (asset) =>
        asset.name !== previous && (usage.get(asset.name) ?? 0) < 3,
    ) ??
    ordered.find((asset) => asset.name !== previous) ??
    ordered[0];
  usage.set(chosen.name, (usage.get(chosen.name) ?? 0) + 1);
  lastBySection.set(scene.section_id, chosen.name);
  return chosen;
};

const q = (value) => JSON.stringify(value);
const clean = (value) =>
  String(value ?? "")
    .replaceAll("Â·", "·")
    .replaceAll("â‰ˆ", "≈")
    .replaceAll("â‰ ", "≥")
    .replaceAll("â†’", "→")
    .replace(/\s+/g, " ")
    .trim();
const compactTitle = (scene) => {
  const title = clean(scene.layers?.[0]?.title ?? scene.narration);
  const words = title.split(/\s+/).filter(Boolean);
  return words.slice(0, words.length > 5 ? 5 : words.length).join(" ");
};
const metricFor = (scene) => {
  const text = clean(
    `${scene.layers?.[0]?.title ?? ""} ${scene.layers?.[0]?.detail ?? ""}`,
  );
  return (
    text.match(/(?:≈|~)?\d[\d,.]*(?:\s?(?:gal|psi|ft|%|gpm|hours?|days?))?/i)?.[0] ??
    ""
  );
};
const eyebrowFor = (section) =>
  ({
    s00_hook: "THE WATER STACK",
    s01_principle: "THE PRINCIPLE",
    s02_roof_catchment: "SYSTEM 01",
    s03_cistern: "SYSTEM 02",
    s04_spring_box: "SYSTEM 03",
    s05_gravity_line: "SYSTEM 04",
    s06_springhouse: "SYSTEM 05",
    s07_dug_well: "SYSTEM 06",
    s08_hand_pump: "SYSTEM 07",
    s09_windmill: "SYSTEM 08",
    s10_ram_pump: "SYSTEM 09",
    s11_pond: "SYSTEM 10",
    s12_resilience: "RESILIENCE",
    s13_treatment: "SYSTEM 11",
    s14_cross_connection: "THE HIDDEN RISK",
    s15_recap: "FIELD CHECK",
    s16_close: "ONE PROPERTY",
  })[section] ?? "FIELD SYSTEM";
const componentFor = (scene) => {
  const id = String(scene.layers?.[0]?.component ?? "");
  if (/Boundary|Mistake|Hazard|Safe|Risk|ClearIsNotTested/i.test(id)) {
    return "WaterSafetyBoundary_v48vr0jexdrms";
  }
  if (scene.section_id === "s02_roof_catchment") return "RoofYieldScene_v48vr0jexdrms";
  if (scene.section_id === "s03_cistern") return "CisternCutawayScene_v48vr0jexdrms";
  if (scene.section_id === "s04_spring_box") return "SpringBoxScene_v48vr0jexdrms";
  if (scene.section_id === "s05_gravity_line") return "GravityLineScene_v48vr0jexdrms";
  if (scene.section_id === "s06_springhouse") return "SpringhouseCoolingScene_v48vr0jexdrms";
  if (scene.section_id === "s07_dug_well") return "DugWellScene_v48vr0jexdrms";
  if (scene.section_id === "s08_hand_pump") return "HandPumpScene_v48vr0jexdrms";
  if (scene.section_id === "s09_windmill") return "WindmillStorageScene_v48vr0jexdrms";
  if (scene.section_id === "s10_ram_pump") return "RamPumpCycleScene_v48vr0jexdrms";
  if (scene.section_id === "s11_pond") return "PondSpillwayScene_v48vr0jexdrms";
  if (scene.section_id === "s13_treatment") return "TreatmentTrainScene_v48vr0jexdrms";
  if (scene.section_id === "s14_cross_connection") return "BackflowBoundaryScene_v48vr0jexdrms";
  return "PropertyWaterMap_v48vr0jexdrms";
};

const stockComponents = [
  "StockCornerEvidence_v48vr0jexdrms",
  "StockTopRule_v48vr0jexdrms",
  "StockFieldBadge_v48vr0jexdrms",
  "StockLowerEvidence_v48vr0jexdrms",
];
const cues = [];
const report = [];

for (const [ordinal, scene] of timeline.scenes.entries()) {
  if (ordinal === 0) continue;
  const layer = scene.layers?.[0] ?? {};
  const title = compactTitle(scene);
  const metric = metricFor(scene);
  const eyebrow = eyebrowFor(scene.section_id);
  const direct = assetByMoment.has(scene.id);
  const chapter =
    /RuleNumberScene|Checklist/i.test(String(layer.component ?? "")) ||
    /chapter_marker|cta|endcard/i.test(String(layer.visual_type ?? ""));
  const avatarMoment = chapter || (!direct && ordinal % 11 === 0);
  const stockMoment = direct || (!avatarMoment && ordinal % 3 === 1);
  const asset = chooseAsset(scene, ordinal);
  let expression;
  let kind;
  if (avatarMoment) {
    kind = "avatar-note";
    expression = `<AvatarFieldNote_v48vr0jexdrms durationInFrames={d} title=${q(title)}${metric ? ` metric=${q(metric)}` : ""} eyebrow=${q(eyebrow)} />`;
  } else if (stockMoment) {
    kind = "stock";
    const component = stockComponents[ordinal % stockComponents.length];
    expression = `<><${component} durationInFrames={d} src=${q(asset.src)} label=${q(title)} eyebrow=${q(eyebrow)} /><EvidencePulse_v48vr0jexdrms durationInFrames={d} /></>`;
  } else {
    kind = "component";
    const component = componentFor(scene);
    expression = `<${component} durationInFrames={d} title=${q(title)}${metric ? ` metric=${q(metric)}` : ""} src=${q(asset.src)} eyebrow=${q(eyebrow)} />`;
  }
  cues.push(
    `  {key:${q(scene.id)},from:${scene.from},duration:${scene.duration},start:${scene.from / timeline.fps},dur:${scene.duration / timeline.fps},kind:${q(kind)},el:(d)=>(` +
      expression +
      `)},`,
  );
  report.push({
    id: scene.id,
    section: scene.section_id,
    from: scene.from,
    duration: scene.duration,
    kind,
    component: avatarMoment
      ? "AvatarFieldNote_v48vr0jexdrms"
      : stockMoment
        ? stockComponents[ordinal % stockComponents.length]
        : componentFor(scene),
    asset: asset.src,
    title,
  });
}

const cueFile = `import React from "react";
import {
  StockCornerEvidence_v48vr0jexdrms,
  StockTopRule_v48vr0jexdrms,
  StockFieldBadge_v48vr0jexdrms,
  StockLowerEvidence_v48vr0jexdrms,
} from "./scenes/StockShot_v48vr0jexdrms";
import {
  RoofYieldScene_v48vr0jexdrms,
  CisternCutawayScene_v48vr0jexdrms,
  SpringBoxScene_v48vr0jexdrms,
  GravityLineScene_v48vr0jexdrms,
  SpringhouseCoolingScene_v48vr0jexdrms,
  DugWellScene_v48vr0jexdrms,
  HandPumpScene_v48vr0jexdrms,
  WindmillStorageScene_v48vr0jexdrms,
  RamPumpCycleScene_v48vr0jexdrms,
  PondSpillwayScene_v48vr0jexdrms,
  TreatmentTrainScene_v48vr0jexdrms,
  BackflowBoundaryScene_v48vr0jexdrms,
  PropertyWaterMap_v48vr0jexdrms,
  WaterSafetyBoundary_v48vr0jexdrms,
  AvatarFieldNote_v48vr0jexdrms,
  EvidencePulse_v48vr0jexdrms,
} from "./scenes/WaterSystemScenes_v48vr0jexdrms";

export type PremiumCue_v48vr0jexdrms = {
  key: string;
  from: number;
  duration: number;
  start: number;
  dur: number;
  kind: "stock" | "component" | "avatar-note";
  el: (durationInFrames: number) => React.ReactNode;
};

export const PREMIUM_CUES_V48VR0JEXDRMS: PremiumCue_v48vr0jexdrms[] = [
${cues.join("\n")}
];
`;

const mainFile = `import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {Audio, Video} from "@remotion/media";
import {PREMIUM_CUES_V48VR0JEXDRMS} from "./cues_v48vr0jexdrms.gen";

export const TOTAL_FRAMES_V48VR0JEXDRMS = ${timeline.duration_in_frames};

const AvatarBase_v48vr0jexdrms: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(
    frame,
    [0, TOTAL_FRAMES_V48VR0JEXDRMS - 1],
    [1.01, 1.04],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#111914"}}>
      <Video
        src={staticFile("v48vr0jexdrms_opt.mp4")}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: \`translate(\${Math.sin(frame / 700) * 4}px, \${Math.cos(frame / 830) * 3}px) scale(\${scale})\`,
          filter: "saturate(.94) contrast(1.025)",
        }}
      />
      <AbsoluteFill style={{boxShadow: "inset 0 0 110px rgba(8,13,10,.24)"}} />
    </AbsoluteFill>
  );
};

export const BagasyTimeline_v48vr0jexdrms: React.FC = () => (
  <AbsoluteFill style={{background: "#111914"}}>
    <Audio src={staticFile("v48vr0jexdrms.wav")} />
    <AvatarBase_v48vr0jexdrms />
    {PREMIUM_CUES_V48VR0JEXDRMS.map((cue) => (
      <Sequence
        key={cue.key}
        from={cue.from}
        durationInFrames={cue.duration}
        premountFor={30}
      >
        {cue.el(cue.duration)}
      </Sequence>
    ))}
  </AbsoluteFill>
);
`;

fs.writeFileSync(
  path.join("src", "VideoEdit", `cues_${slug}.gen.tsx`),
  cueFile,
);
fs.writeFileSync(
  path.join("src", "VideoEdit", `Main_${slug}.tsx`),
  mainFile,
);

const uniqueAssets = new Set(report.map((row) => row.asset));
const uniqueComponents = new Set(report.map((row) => row.component));
const kinds = report.reduce((counts, row) => {
  counts[row.kind] = (counts[row.kind] ?? 0) + 1;
  return counts;
}, {});
const buildReport = {
  schema: "bagasy.premium_build/v1",
  slug,
  reference_slug: "v0tohhe3cvs6",
  total_frames: timeline.duration_in_frames,
  total_seconds: timeline.duration_in_frames / timeline.fps,
  cues: report.length,
  kinds,
  unique_assets: uniqueAssets.size,
  unique_components: uniqueComponents.size,
  visible_subtitles: false,
  hidden_caption_source: timeline.captions_src,
  rejected_stock: [...rejected],
  asset_usage: Object.fromEntries(
    [...usage.entries()].sort((left, right) => left[0].localeCompare(right[0])),
  ),
  rows: report,
};
fs.writeFileSync(
  path.join("_v3", `${slug}_premium_build_report.json`),
  `${JSON.stringify(buildReport, null, 2)}\n`,
);
console.log(
  JSON.stringify({
    total_frames: buildReport.total_frames,
    total_seconds: buildReport.total_seconds,
    cues: buildReport.cues,
    kinds: buildReport.kinds,
    unique_assets: buildReport.unique_assets,
    unique_components: buildReport.unique_components,
    visible_subtitles: false,
    report: `_v3/${slug}_premium_build_report.json`,
  }),
);
