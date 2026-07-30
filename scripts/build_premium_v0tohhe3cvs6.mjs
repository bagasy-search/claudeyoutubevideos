import fs from "fs";
import path from "path";

const slug = "v0tohhe3cvs6";
const plan = JSON.parse(fs.readFileSync(`_v3/${slug}_plan.json`, "utf8"));
const specsRaw = JSON.parse(
  fs.readFileSync(`_v3/${slug}_component_specs.json`, "utf8"),
);
const specs = new Map(
  (specsRaw.components || specsRaw).map((spec) => [spec.kind, spec]),
);

const read = (file, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

const exists = (file) => fs.existsSync(file) && fs.statSync(file).size > 0;
const publicSrc = (file) =>
  file.replaceAll("\\", "/").replace(/^.*?public\//i, "");
const cleanName = (name) => String(name || "").replace(/\.mp4$/i, "");
const words = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9%$]+/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        !new Set([
          "the",
          "and",
          "for",
          "with",
          "from",
          "that",
          "this",
          "into",
          "over",
          "real",
          "photo",
          "field",
          "farm",
          "shows",
          "show",
          "used",
          "use",
          "while",
          "then",
          "one",
          "two",
          "three",
          "soft",
          "blurred",
          "premium",
        ]).has(word),
    );

const scoreText = (query, candidate) => {
  const queryWords = words(query);
  const candidateWords = new Set(words(candidate));
  let score = 0;
  for (const word of queryWords) {
    if (candidateWords.has(word)) score += /\d|%|\$/.test(word) ? 5 : 2;
  }
  return score;
};

const audits = [
  `_v3/${slug}_stock_audit_001_029.json`,
  `_v3/${slug}_stock_audit_030_079.json`,
  `_v3/${slug}_stock_audit_080_129.json`,
].map((file) => read(file, {}));
const oldPass = new Map();
for (const audit of audits) {
  for (const item of audit.clips || audit.items || audit.results || []) {
    if (String(item.status || item.verdict).toUpperCase() !== "PASS") continue;
    oldPass.set(cleanName(item.name || item.filename), item);
  }
}

const stockMap = read(`_v3/${slug}_stock_map.json`, []);
const oldClips = stockMap
  .filter((item) => oldPass.has(cleanName(item.name)))
  .map((item) => {
    const name = cleanName(item.name);
    const audit = oldPass.get(name);
    const file = `public/broll/${slug}/${name}.mp4`;
    return {
      name,
      file,
      src: publicSrc(file),
      start: Number(item.inicio || 0),
      text: `${item.section} ${item.dice} ${item.muestra} ${item.query}`,
      trim: Number.parseFloat(String(audit.startSuggestion || "0")) || 0,
      source: "pexels-approved-v1",
    };
  })
  .filter((item) => exists(item.file));

const retryCatalog = read(`_v3/${slug}_stock_retry.json`, []);
const retryMeta = new Map(retryCatalog.map((item) => [cleanName(item.name), item]));
const retryAudits = [
  read(`_v3/${slug}_stock_retry_audit_001_036.json`, {}),
  read(`_v3/${slug}_stock_retry_audit_037_072.json`, {}),
];
const retryClips = [];
for (const audit of retryAudits) {
  const list =
    audit.clips || audit.items || audit.results || audit.files || audit.audits || [];
  for (const item of list) {
    if (
      String(item.status || item.verdict || item.result).toUpperCase() !==
      "PASS"
    ) {
      continue;
    }
    const name = cleanName(item.name || item.filename || item.file);
    const meta = retryMeta.get(name) || {};
    const file = `public/broll/${slug}/${name}.mp4`;
    if (!exists(file)) continue;
    const trim =
      Number.parseFloat(
        String(
          item.startSuggestion ||
            item.best_range ||
            item.bestUsableTimeRange ||
            item.best_usable_time_range ||
            "0",
        ),
      ) || 0;
    retryClips.push({
      name,
      file,
      src: publicSrc(file),
      start: null,
      category: meta.category || "",
      text: `${meta.category || ""} ${meta.target_phrase || ""} ${meta.query || ""} ${item.reason || ""}`,
      trim,
      source: "pexels-approved-v2",
    });
  }
}

const allClips = [...oldClips, ...retryClips];
const clipByName = new Map(allClips.map((clip) => [clip.name, clip]));
const sectionClipNames = {
  hook: [
    "v0tohhe3cvs6_stock_001",
    "v0tohhe3cvs6_r2_061",
    "v0tohhe3cvs6_r2_063",
    "v0tohhe3cvs6_r2_069",
    "v0tohhe3cvs6_r2_070",
    "v0tohhe3cvs6_r2_071",
    "v0tohhe3cvs6_r2_072",
  ],
  secret_1_rotation: [
    "v0tohhe3cvs6_stock_001",
    "v0tohhe3cvs6_stock_014",
    "v0tohhe3cvs6_r2_003",
    "v0tohhe3cvs6_r2_004",
    "v0tohhe3cvs6_r2_005",
    "v0tohhe3cvs6_r2_008",
  ],
  secret_2_legume_repair: [
    "v0tohhe3cvs6_stock_014",
    "v0tohhe3cvs6_stock_025",
    "v0tohhe3cvs6_stock_028",
    "v0tohhe3cvs6_r2_003",
    "v0tohhe3cvs6_r2_004",
    "v0tohhe3cvs6_r2_005",
  ],
  secret_3_living_cover: [
    "v0tohhe3cvs6_stock_037",
    "v0tohhe3cvs6_r2_012",
    "v0tohhe3cvs6_r2_014",
  ],
  secret_4_mixed_farm_manure: [
    "v0tohhe3cvs6_stock_046",
    "v0tohhe3cvs6_stock_049",
    "v0tohhe3cvs6_r2_021",
    "v0tohhe3cvs6_r2_030",
  ],
  secret_5_compaction: [
    "v0tohhe3cvs6_stock_028",
    "v0tohhe3cvs6_r2_065",
  ],
  secret_06_contour: [
    "v0tohhe3cvs6_stock_001",
    "v0tohhe3cvs6_stock_072",
    "v0tohhe3cvs6_r2_037",
    "v0tohhe3cvs6_r2_038",
  ],
  secret_07_beneficial_habitat: [
    "v0tohhe3cvs6_stock_073",
    "v0tohhe3cvs6_stock_075",
    "v0tohhe3cvs6_stock_076",
    "v0tohhe3cvs6_stock_078",
    "v0tohhe3cvs6_stock_079",
    "v0tohhe3cvs6_stock_084",
    "v0tohhe3cvs6_r2_041",
    "v0tohhe3cvs6_r2_042",
    "v0tohhe3cvs6_r2_046",
    "v0tohhe3cvs6_r2_048",
    "v0tohhe3cvs6_r2_049",
    "v0tohhe3cvs6_r2_050",
  ],
  secret_08_diversification_succession: [
    "v0tohhe3cvs6_stock_085",
    "v0tohhe3cvs6_stock_086",
    "v0tohhe3cvs6_stock_088",
    "v0tohhe3cvs6_r2_051",
    "v0tohhe3cvs6_r2_052",
  ],
  secret_09_scouting_thresholds: [
    "v0tohhe3cvs6_stock_078",
    "v0tohhe3cvs6_stock_079",
    "v0tohhe3cvs6_stock_084",
    "v0tohhe3cvs6_stock_091",
    "v0tohhe3cvs6_r2_041",
    "v0tohhe3cvs6_r2_046",
    "v0tohhe3cvs6_r2_048",
    "v0tohhe3cvs6_r2_049",
    "v0tohhe3cvs6_r2_050",
  ],
  secret_10_repair_diagnose_safely: [
    "v0tohhe3cvs6_stock_100",
    "v0tohhe3cvs6_stock_101",
    "v0tohhe3cvs6_stock_104",
    "v0tohhe3cvs6_stock_111",
    "v0tohhe3cvs6_r2_057",
    "v0tohhe3cvs6_r2_058",
    "v0tohhe3cvs6_r2_060",
    "v0tohhe3cvs6_r2_069",
  ],
  honest_limits_decision_loop: [
    "v0tohhe3cvs6_stock_113",
    "v0tohhe3cvs6_r2_060",
    "v0tohhe3cvs6_r2_070",
    "v0tohhe3cvs6_r2_071",
    "v0tohhe3cvs6_r2_072",
  ],
  recap_choose_one: [
    "v0tohhe3cvs6_stock_001",
    "v0tohhe3cvs6_stock_038",
    "v0tohhe3cvs6_stock_091",
    "v0tohhe3cvs6_stock_100",
    "v0tohhe3cvs6_r2_012",
    "v0tohhe3cvs6_r2_021",
    "v0tohhe3cvs6_r2_038",
    "v0tohhe3cvs6_r2_042",
    "v0tohhe3cvs6_r2_051",
    "v0tohhe3cvs6_r2_065",
  ],
  cta_plain_almanac: [],
  teaser_hydraulic_ram_closing: ["v0tohhe3cvs6_stock_129"],
};
const clipsForSection = (section) =>
  (sectionClipNames[section] || [])
    .map((name) => clipByName.get(name))
    .filter(Boolean);

const photos = [];
const photoNames = new Set();
const addPhoto = ({filename, dir = "public/real", text = "", source = "web"}) => {
  if (!filename || photoNames.has(filename)) return;
  const file = path.join(dir, filename);
  if (!exists(file)) return;
  photoNames.add(filename);
  photos.push({
    name: filename,
    file,
    src: publicSrc(file),
    text: `${filename} ${text}`,
    source,
  });
};

const approved = read(`public/real/${slug}_approved.json`, {});
for (const filename of approved.approved || []) {
  addPhoto({filename, text: filename, source: "web-approved-v1"});
}

const webLedger = read(`_v3/${slug}_web_photo_ledger.json`, {});
for (const item of webLedger.files || webLedger.items || []) {
  if (String(item.verdict || item.status).toUpperCase() !== "PASS") continue;
  addPhoto({
    filename: item.filename,
    text: `${item.matched_moment_id || ""} ${item.matched_phrase || ""} ${item.reason || ""}`,
    source: "web-curated",
  });
}

const personalAudit = read(`_v3/${slug}_personal_image_audit.json`, {});
for (const item of personalAudit.items || personalAudit.images || []) {
  if (String(item.status || item.verdict).toUpperCase() !== "PASS") continue;
  addPhoto({
    filename: item.filename,
    dir: "public/img",
    text: `${item.recommended_crop_use || ""} ${item.identity_match || ""}`,
    source: "gpt-image-personal",
  });
}

const stillAudit = read(`_v3/${slug}_derived_still_audit.json`, {});
for (const item of stillAudit.items || stillAudit.files || stillAudit.results || []) {
  if (String(item.status || item.verdict).toUpperCase() !== "PASS") continue;
  addPhoto({
    filename: path.basename(item.filename || item.file || ""),
    text: `${item.best_use || item.recommended_use || item.reason || ""}`,
    source: "pexels-derived-still",
  });
}

// These two lower-resolution photographs passed the dedicated component
// background audit for softened use only. They are never presented as sharp
// hero stills: the custom components darken/blur them beneath the information.
addPhoto({
  filename: `${slug}_carrot_roots_soil_macro.png`,
  text: "carrot roots dark soil root resistance nutrient capacity",
  source: "web-special-softened",
});
addPhoto({
  filename: `${slug}_finished_compost_hand.jpg`,
  text: "finished compost hand organic matter compost safety",
  source: "web-special-softened",
});

if (!photos.length) {
  throw new Error("No approved real photos are available.");
}

const photoByName = (filename) =>
  photos.find((photo) => photo.name === filename) || null;
const specialComponentPhoto = (kind) => {
  const forcedName = {
    SoilMetricCards_v0tohhe3cvs6: `${slug}_carrot_roots_soil_macro.png`,
    CompostThermalProtocol_v0tohhe3cvs6: `${slug}_finished_compost_hand.jpg`,
    ContourErosionCompare_v0tohhe3cvs6: `${slug}_contour_farming_hillside.jpg`,
    ScoutingDecisionLoop_v0tohhe3cvs6: `${slug}_beneficial_insect_flower.jpg`,
    PlainAlmanacContents_v0tohhe3cvs6: `${slug}_web_old_barn.jpg`,
    CoverJobSelector_v0tohhe3cvs6: `${slug}_multispecies_cover_crop.jpg`,
    SuccessionRoles_v0tohhe3cvs6: `${slug}_web_elderly_farmyard.jpg`,
    HydraulicInjectionSafety_v0tohhe3cvs6: `${slug}_presenter_pump_workbench.png`,
    ProfessionalOnlyGrid_v0tohhe3cvs6: `${slug}_presenter_pump_workbench.png`,
    HydraulicRamExploded_v0tohhe3cvs6: `${slug}_presenter_pump_workbench.png`,
    RamPumpFailureConditions_v0tohhe3cvs6: `${slug}_presenter_pump_workbench.png`,
    StoredEnergyFiveSources_v0tohhe3cvs6: `${slug}_presenter_pump_workbench.png`,
    TwoFieldNutrientDecision_v0tohhe3cvs6: `${slug}_soil_sampling_probe.png`,
    ThreeDecisionGates_v0tohhe3cvs6: `${slug}_presenter_damage_count.png`,
    ManureRiskFork_v0tohhe3cvs6: `${slug}_finished_compost_hand.jpg`,
    ContourCropStack_v0tohhe3cvs6: `${slug}_contour_farming_hillside.jpg`,
    ActionThreshold_v0tohhe3cvs6: `${slug}_presenter_damage_count.png`,
    LocalThresholdCompare_v0tohhe3cvs6: `${slug}_presenter_damage_count.png`,
    ScoutingFieldCard_v0tohhe3cvs6: `${slug}_presenter_field_notebook.png`,
  }[kind];
  return forcedName ? photoByName(forcedName) : null;
};
const sectionPhotoNames = {
  hook: [
    `${slug}_crop_roots_soil_pit.jpg`,
    `${slug}_horse_plowing_archival.jpg`,
    `${slug}_web_corn_rows.png`,
    `${slug}_web_old_barn.jpg`,
  ],
  secret_1_rotation: [
    `${slug}_crop_roots_soil_pit.jpg`,
    `${slug}_web_corn_rows.png`,
    `${slug}_stock_001_still.jpg`,
    `${slug}_stock_002_still.jpg`,
    `${slug}_stock_014_still.jpg`,
    `${slug}_presenter_cover_crop_roots.png`,
  ],
  secret_2_legume_repair: [
    `${slug}_web_root_nodules_clover.jpg`,
    `${slug}_web_root_nodules_lentil.jpg`,
    `${slug}_stock_025_still.jpg`,
    `${slug}_stock_028_still.jpg`,
    `${slug}_crop_roots_soil_pit.jpg`,
  ],
  secret_3_living_cover: [
    `${slug}_multispecies_cover_crop.jpg`,
    `${slug}_stock_037_still.jpg`,
    `${slug}_presenter_cover_crop_roots.png`,
    `${slug}_web_corn_rows.png`,
  ],
  secret_4_mixed_farm_manure: [
    `${slug}_soil_sampling_probe.png`,
    `${slug}_stock_046_still.jpg`,
    `${slug}_stock_049_still.jpg`,
    `${slug}_finished_compost_hand.jpg`,
    `${slug}_web_old_barn.jpg`,
    `${slug}_web_elderly_farmyard.jpg`,
  ],
  secret_5_compaction: [
    `${slug}_soil_aggregates_hand.jpg`,
    `${slug}_web_soil_aggregate_hand.jpg`,
    `${slug}_web_soil_profile_gravel.jpg`,
    `${slug}_stock_028_still.jpg`,
    `${slug}_web_soil_health_inspection.jpg`,
  ],
  secret_06_contour: [
    `${slug}_contour_farming_hillside.jpg`,
    `${slug}_web_contour_aerial_missouri.jpg`,
    `${slug}_web_contour_field_1974.jpg`,
    `${slug}_stock_072_still.jpg`,
  ],
  secret_07_beneficial_habitat: [
    `${slug}_beneficial_insect_flower.jpg`,
    `${slug}_web_hedgerow_boundary.jpg`,
    `${slug}_web_hedgerow_summer.jpg`,
    `${slug}_stock_073_still.jpg`,
    `${slug}_stock_075_still.jpg`,
    `${slug}_stock_076_still.jpg`,
    `${slug}_stock_078_still.jpg`,
    `${slug}_stock_079_still.jpg`,
  ],
  secret_08_diversification_succession: [
    `${slug}_web_farmers_market.jpeg`,
    `${slug}_web_elderly_farmyard.jpg`,
    `${slug}_web_old_barn.jpg`,
    `${slug}_stock_085_still.jpg`,
    `${slug}_stock_088_still.jpg`,
  ],
  secret_09_scouting_thresholds: [
    `${slug}_presenter_leaf_scout.png`,
    `${slug}_presenter_damage_count.png`,
    `${slug}_presenter_field_notebook.png`,
    `${slug}_stock_078_still.jpg`,
    `${slug}_stock_079_still.jpg`,
    `${slug}_stock_084_still.jpg`,
    `${slug}_stock_091_still.jpg`,
    `${slug}_beneficial_insect_flower.jpg`,
  ],
  secret_10_repair_diagnose_safely: [
    `${slug}_hand_tool_repair.webp`,
    `${slug}_web_elderly_repair.jpg`,
    `${slug}_stock_100_still.jpg`,
    `${slug}_stock_101_still.jpg`,
    `${slug}_stock_104_still.jpg`,
    `${slug}_stock_111_still.jpg`,
    `${slug}_presenter_pump_workbench.png`,
  ],
  honest_limits_decision_loop: [
    `${slug}_web_old_barn.jpg`,
    `${slug}_web_elderly_farmyard.jpg`,
    `${slug}_stock_113_still.jpg`,
    `${slug}_presenter_field_notebook.png`,
  ],
  recap_choose_one: [
    `${slug}_multispecies_cover_crop.jpg`,
    `${slug}_contour_farming_hillside.jpg`,
    `${slug}_beneficial_insect_flower.jpg`,
    `${slug}_hand_tool_repair.webp`,
    `${slug}_soil_sampling_probe.png`,
  ],
  cta_plain_almanac: [`${slug}_web_old_barn.jpg`],
  teaser_hydraulic_ram_closing: [
    `${slug}_presenter_pump_workbench.png`,
    `${slug}_stock_129_still.jpg`,
  ],
};
const photosForSection = (section) =>
  (sectionPhotoNames[section] || [])
    .map((name) => photoByName(name))
    .filter(Boolean);
const forcedMomentAsset = (moment) => {
  const phrase = String(moment.dice || "");
  const forcedName =
    /miracle seed, no secret chemical/i.test(phrase)
      ? "v0tohhe3cvs6_stock_001"
      : /conservation guidance, and published farm studies/i.test(phrase)
        ? `${slug}_web_soil_health_inspection.jpg`
        : /not copying a costume/i.test(phrase)
          ? "v0tohhe3cvs6_r2_063"
          : /different roots, manure used in the system/i.test(phrase)
            ? "v0tohhe3cvs6_r2_061"
          : /bacteria convert nitrogen gas/i.test(phrase)
      ? `${slug}_web_root_nodules_clover.jpg`
      : /crop is not handing free bags of fertilizer/i.test(phrase)
        ? `${slug}_web_root_nodules_lentil.jpg`
      : /correct rhizobia/i.test(phrase)
        ? `${slug}_web_root_nodules_lentil.jpg`
        : /15 days and turned at least five times/i.test(phrase)
          ? `${slug}_finished_compost_hand.jpg`
          : /teach one task at a time/i.test(phrase)
            ? `${slug}_presenter_field_notebook.png`
            : /never work beneath equipment held only by hydraulics/i.test(phrase)
              ? `${slug}_presenter_pump_workbench.png`
              : /number one, rotate functions/i.test(phrase)
                ? "v0tohhe3cvs6_stock_001"
                : /number two, use perennial forage/i.test(phrase)
                  ? "v0tohhe3cvs6_r2_005"
                  : /number three, keep living roots/i.test(phrase)
                    ? "v0tohhe3cvs6_r2_012"
              : null;
  return forcedName
    ? photoByName(forcedName) || clipByName.get(forcedName) || null
    : null;
};
const forcedAvatarMoment = (moment) =>
  /sells that cure again next year/i.test(String(moment.dice || ""));

const chooseBest = (query, pool, used, minimum = 2) => {
  const ranked = pool
    .filter((item) => !used.has(item.name))
    .map((item) => ({
      item,
      score: scoreText(query, item.text),
    }))
    .sort((left, right) => right.score - left.score);
  if (!ranked.length || ranked[0].score < minimum) return null;
  used.add(ranked[0].item.name);
  return ranked[0].item;
};

const choosePhotoBackground = (query) =>
  [...photos]
    .map((item) => ({item, score: scoreText(query, item.text)}))
    .sort((left, right) => right.score - left.score)[0]?.item || photos[0];

const moments = [];
for (const section of plan.secciones || []) {
  for (const moment of section.momentos || []) {
    moments.push({
      ...moment,
      section: section.id,
      inicio: Number(moment.inicio),
      fin: Number(moment.fin),
    });
  }
}
moments.sort((left, right) => left.inicio - right.inicio);

// The director intentionally staged some multi-card components as consecutive
// narration moments. Render them as one continuous premium scene.
const merged = [];
for (const moment of moments) {
  const previous = merged.at(-1);
  if (
    previous &&
    moment.tipo === "componente" &&
    previous.tipo === "componente" &&
    moment.kind === previous.kind &&
    moment.inicio <= previous.fin + 0.16
  ) {
    previous.fin = Math.max(previous.fin, moment.fin);
    previous.dice = `${previous.dice} ${moment.dice}`;
    previous.muestra = `${previous.muestra} ${moment.muestra}`;
    continue;
  }
  merged.push({...moment});
}

// Resolve the single known cross-section overlap around the transition from
// compaction to contour farming. Short fragments created by truncation stay on
// the underlying avatar instead of flashing a sub-second visual.
const timeline = [];
let cursor = 0;
for (const moment of merged) {
  if (moment.fin <= cursor + 0.04) continue;
  const start = Math.max(moment.inicio, cursor);
  const end = moment.fin;
  cursor = Math.max(cursor, end);
  if (end - start < 2.5 && moment.tipo !== "avatar") {
    timeline.push({...moment, inicio: start, fin: end, tipo: "avatar"});
  } else {
    timeline.push({...moment, inicio: start, fin: end});
  }
}

// Absorb adjacent documentary fragments so the second half does not dissolve
// into 2.5-second micro-cuts. Key components and presenter windows remain
// untouched; only neighboring stock/photo beats in the same section merge.
const pacedTimeline = [];
for (const moment of timeline) {
  const previous = pacedTimeline.at(-1);
  const previousDur = previous ? previous.fin - previous.inicio : 0;
  const currentDur = moment.fin - moment.inicio;
  if (
    previous &&
    previous.section === moment.section &&
    previous.tipo !== "avatar" &&
    moment.tipo !== "avatar" &&
    previous.tipo !== "componente" &&
    moment.tipo !== "componente" &&
    moment.inicio <= previous.fin + 0.18 &&
    (previousDur < 3.15 || currentDur < 3.15) &&
    moment.fin - previous.inicio <= 7.2
  ) {
    previous.fin = moment.fin;
    previous.dice = `${previous.dice} ${moment.dice}`;
    previous.muestra = `${previous.muestra} ${moment.muestra}`;
    previous.query = `${previous.query || ""} ${moment.query || ""}`;
    continue;
  }
  pacedTimeline.push({...moment});
}

const usedPhotos = new Set();
const photoUseCount = new Map();
const photoLastStart = new Map();
const clipUseCount = new Map();
const clipLastStart = new Map();
const cueRows = [];
const cueRanges = [];
const reportRows = [];
const selectSectionClip = (moment, query, start) => {
  const pool = clipsForSection(moment.section);
  const exact = pool.find(
    (clip) =>
      clip.start !== null &&
      Math.abs(Number(clip.start) - Number(moment.inicio)) < 2.4 &&
      (clipUseCount.get(clip.name) || 0) < 2,
  );
  if (exact) return exact;
  const available = pool
    .filter(
      (clip) =>
        (clipUseCount.get(clip.name) || 0) < 2 &&
        start - (clipLastStart.get(clip.name) ?? -9999) > 55,
    )
    .map((clip) => ({
      clip,
      score:
        scoreText(query, clip.text) -
        (clipUseCount.get(clip.name) || 0) * 1.5,
    }))
    .sort((left, right) => right.score - left.score);
  return available[0]?.clip || null;
};
const selectSectionPhoto = (moment, query, start) => {
  const personalPool = photos.filter(
    (photo) => photo.source === "gpt-image-personal",
  );
  const pool = [
    ...(moment.personal ? personalPool : []),
    ...photosForSection(moment.section),
  ];
  let chosen = chooseBest(query, pool, usedPhotos, 0);
  if (!chosen) {
    chosen =
      pool
        .filter(
          (photo) =>
            (photoUseCount.get(photo.name) || 0) < 2 &&
            start - (photoLastStart.get(photo.name) ?? -9999) > 55,
        )
        .map((photo) => ({
          photo,
          score:
            scoreText(query, photo.text) -
            (photoUseCount.get(photo.name) || 0),
        }))
        .sort((left, right) => right.score - left.score)[0]?.photo || null;
  }
  if (chosen) {
    photoUseCount.set(chosen.name, (photoUseCount.get(chosen.name) || 0) + 1);
    photoLastStart.set(chosen.name, start);
  }
  return chosen;
};

const q = (value) => JSON.stringify(value);
const headlineSets = {
  hook: [
    "Four Crops, One System",
    "Efficiency Has A Cost",
    "Evidence Before Tradition",
    "The System Pays Itself",
  ],
  secret_1_rotation: [
    "Change Crop Family",
    "Change The Season",
    "Change Root Shape",
    "Break The Pest Calendar",
  ],
  secret_2_legume_repair: [
    "Legumes Repair Soil",
    "Pink Nodules Show Activity",
    "Nitrogen Stays In Tissue",
    "Choose For Your Field",
  ],
  secret_3_living_cover: [
    "Keep A Living Root",
    "Cover Beats Bare Soil",
    "Protect The Surface",
    "Choose By Climate",
  ],
  secret_4_mixed_farm_manure: [
    "Test Before Spreading",
    "Manure Needs Judgment",
    "Track Both Nutrients",
    "Heat And Time Matter",
  ],
  secret_5_compaction: [
    "Wet Soil Says Wait",
    "Every Pass Must Pay",
    "Protect Soil Pores",
    "Use Permanent Lanes",
  ],
  secret_06_contour: [
    "Slow Water Early",
    "Follow The Contour",
    "Protect The Outlet",
    "Test The Same Spots",
  ],
  secret_07_beneficial_habitat: [
    "Habitat Before Pests",
    "Stagger The Bloom",
    "Scout Before Treating",
    "Name The Actual Problem",
  ],
  secret_08_diversification_succession: [
    "Confirm The Buyer",
    "Diversify After Demand",
    "Train The Next Decision",
    "One Buyer, One Risk",
  ],
  secret_09_scouting_thresholds: [
    "Walk Before Spraying",
    "Count Pests And Allies",
    "Use Local Thresholds",
    "Check The Result Again",
  ],
  secret_10_repair_diagnose_safely: [
    "Diagnose Before Replacing",
    "Isolate Stored Energy",
    "Hydraulic Leaks Can Inject",
    "Know When To Stop",
  ],
  honest_limits_decision_loop: [
    "Objects Are Not Outcomes",
    "Savings Require Judgment",
    "Match Method To Place",
  ],
  recap_choose_one: ["Choose One This Weekend", "Ten Methods, One System"],
  cta_plain_almanac: [
    "Ninety Household Methods",
    "A Range, Not A Guarantee",
    "Pay Once, Keep It",
  ],
  teaser_hydraulic_ram_closing: [
    "Four Parts Move Water",
    "Site Geometry Decides",
    "Pressure Can Split Pipe",
  ],
};
const sectionEyebrows = {
  hook: "EVIDENCE",
  secret_1_rotation: "ROTATION",
  secret_2_legume_repair: "LEGUMES",
  secret_3_living_cover: "COVER",
  secret_4_mixed_farm_manure: "MANURE",
  secret_5_compaction: "COMPACTION",
  secret_06_contour: "CONTOUR",
  secret_07_beneficial_habitat: "HABITAT",
  secret_08_diversification_succession: "DIVERSIFY",
  secret_09_scouting_thresholds: "SCOUTING",
  secret_10_repair_diagnose_safely: "REPAIR",
  honest_limits_decision_loop: "LIMITS",
  recap_choose_one: "RECAP",
  cta_plain_almanac: "ALMANAC",
  teaser_hydraulic_ram_closing: "NEXT",
};
let visualOrdinal = 0;
const compactWords = (value, max) =>
  String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .join(" ");
const visibleWordCount = (value) =>
  String(value || "")
    .split(/\s+/)
    .filter((word) => /[a-zA-Z0-9]/.test(word)).length;
const makeStockExpression = (asset, moment, dur, trim = 0) => {
  const ordinal = visualOrdinal++;
  const useContext = ordinal % 20 !== 19;
  const stockTreatments = [
    "StockCornerEvidence",
    "StockTopRule",
    "StockFieldBadge",
    "StockLowerEvidence",
  ];
  const component = useContext
    ? stockTreatments[ordinal % stockTreatments.length]
    : "RawShot";
  const headlines =
    headlineSets[moment.section] || ["Evidence In The Field"];
  // Every curated headline is four words or fewer; four words still fit the
  // 2.5-second floor and avoids visibly chopped phrases such as
  // "Diversify After The".
  const maxHeadlineWords = 4;
  const label = compactWords(
    headlines[ordinal % headlines.length],
    maxHeadlineWords,
  );
  const eyebrow =
    useContext && dur >= 4.25 ? sectionEyebrows[moment.section] : null;
  const layout = ["corner", "rule", "badge", "lower"][ordinal % 4];
  return `<${component} durationInFrames={d} src=${q(asset.src)}${trim ? ` startFromSeconds={${Number(trim).toFixed(2)}}` : ""}${useContext ? ` label=${q(label)}${eyebrow ? ` eyebrow=${q(eyebrow)}` : ""} layout=${q(layout)}` : ""} />`;
};
const compactComponentData = (spec, dur) => {
  // The director chose headline cards, not paragraphs. Keep the actual visible
  // word count inside the 0.8s + words/2.5 reading budget.
  let budget = Math.max(
    4,
    Math.floor((Math.min(8, dur) - 0.8) * 2.5) - 1,
  );
  const title = compactWords(spec.title, Math.min(5, budget));
  budget -= visibleWordCount(title);
  let metric = "";
  if (spec.metric && budget > 0) {
    metric = compactWords(spec.metric, Math.min(2, budget));
    budget -= visibleWordCount(metric);
  }
  const items = [];
  for (const item of spec.items || []) {
    if (budget <= 0) break;
    const label = compactWords(item.label, Math.min(2, budget));
    budget -= visibleWordCount(label);
    let value = "";
    if (item.value && budget > 0) {
      value = compactWords(item.value, Math.min(2, budget));
      budget -= visibleWordCount(value);
    }
    if (label) items.push({label, ...(value ? {value} : {})});
  }
  return {title, metric, items: items.length ? items : [{label: title}]};
};
const essentialComponentData = (kind) =>
  ({
    ManureRiskFork_v0tohhe3cvs6: {
      title: "Fresh Manure",
      items: [{label: "Food safety"}, {label: "Nutrient loss"}],
    },
    TwoFieldNutrientDecision_v0tohhe3cvs6: {
      title: "Opposite Decisions",
      items: [
        {label: "Needs more"},
        {label: "Already high"},
      ],
    },
    ContourCropStack_v0tohhe3cvs6: {
      title: "Less Soil Loss",
      metric: "75%",
      items: [{label: "Contour strips"}],
    },
    WaterClaimCaveat_v0tohhe3cvs6: {
      title: "Soil Controls Water Storage",
      items: [
        {label: "Texture"},
        {label: "Depth"},
        {label: "Density"},
        {label: "Starting moisture"},
      ],
    },
    ActionThreshold_v0tohhe3cvs6: {
      title: "Local Action Threshold",
      items: [{label: "Pests"}, {label: "Allies"}],
    },
    StoredEnergyFiveSources_v0tohhe3cvs6: {
      title: "Isolate Five Energy Sources",
      items: [
        {label: "Electrical"},
        {label: "Hydraulic"},
        {label: "Pneumatic"},
        {label: "Mechanical"},
        {label: "Thermal"},
      ],
    },
    ThreeDecisionGates_v0tohhe3cvs6: {
      title: "Three Decisions Need Proof",
      items: [
        {label: "Buyer first"},
        {label: "Pest count"},
        {label: "Isolate energy"},
      ],
    },
    SuccessionRoles_v0tohhe3cvs6: {
      title: "Succession Is A System",
      items: [
        {label: "Veterinarian"},
        {label: "Grain"},
        {label: "Feed"},
        {label: "Safety"},
      ],
    },
    RhizosphereLens_v0tohhe3cvs6: {
      title: "Life Around Roots",
      metric: "Rhizosphere",
      items: [{label: "Root hairs"}],
    },
    SinglePointRisk_v0tohhe3cvs6: {
      title: "One Weak Link Stops",
      items: [{label: "One crop"}, {label: "One buyer"}],
    },
  })[kind] || null;
const componentPhoto = (spec, moment) =>
  choosePhotoBackground(
    `${spec?.suggested_image_category || ""} ${moment.section} ${moment.dice} ${moment.muestra}`,
  );

for (const [index, moment] of pacedTimeline.entries()) {
  if (moment.tipo === "avatar") continue;
  const start = Number(moment.inicio.toFixed(2));
  const dur = Number((moment.fin - moment.inicio).toFixed(2));
  const key = `${moment.section}_${String(index).padStart(3, "0")}`;
  const query = `${moment.section} ${moment.dice} ${moment.muestra} ${moment.query || ""}`;
  let expression = null;
  let chosen = null;

  if (moment.tipo === "clip") {
    if (forcedAvatarMoment(moment)) {
      reportRows.push({
        key,
        start,
        dur,
        type: moment.tipo,
        fallback: "avatar",
        phrase: moment.dice,
      });
      continue;
    }
    chosen = forcedMomentAsset(moment) || selectSectionClip(moment, query, start);
    if (chosen) {
      if (/\.(mp4|webm|mov)$/i.test(chosen.file || "")) {
        clipUseCount.set(chosen.name, (clipUseCount.get(chosen.name) || 0) + 1);
        clipLastStart.set(chosen.name, start);
      }
      expression = makeStockExpression(
        chosen,
        moment,
        dur,
        Number(chosen.trim || 0),
      );
    } else {
      chosen = selectSectionPhoto(moment, query, start);
      if (chosen) {
        expression = makeStockExpression(chosen, moment, dur);
      }
    }
  }

  if (moment.tipo === "foto_web") {
    chosen = selectSectionPhoto(moment, query, start);
    if (chosen) {
      expression = makeStockExpression(chosen, moment, dur);
    }
  }

  if (moment.tipo === "componente") {
    const spec = specs.get(moment.kind);
    if (!spec) throw new Error(`Missing component spec: ${moment.kind}`);
    const bg =
      specialComponentPhoto(moment.kind) || componentPhoto(spec, moment);
    chosen = bg;
    const props = `durationInFrames={d}`;
    if (moment.kind === "SoilMetricCards_v0tohhe3cvs6") {
      expression = `<SoilMetricCards ${props} image=${q(bg.src)} />`;
    } else if (moment.kind === "CompostThermalProtocol_v0tohhe3cvs6") {
      expression = `<CompostSafetyWindow ${props} image=${q(bg.src)} />`;
    } else if (moment.kind === "ContourErosionCompare_v0tohhe3cvs6") {
      expression = `<ContourRunoffComparison ${props} image=${q(bg.src)} />`;
    } else if (moment.kind === "MoistureRibbonDemo_v0tohhe3cvs6") {
      const crumb = choosePhotoBackground("healthy soil aggregate crumb in hand");
      const ribbon = choosePhotoBackground("wet compacted soil tire rut clay");
      expression = `<WetSoilTrafficTest ${props} crumbImage=${q(crumb.src)} ribbonImage=${q(ribbon.src)} />`;
    } else if (moment.kind === "NoduleNitrogenCutaway_v0tohhe3cvs6") {
      expression = `<NoduleProofMacro ${props} image=${q(bg.src)} />`;
    } else if (moment.kind === "HedgerowReach100m_v0tohhe3cvs6") {
      const insect = choosePhotoBackground("beneficial insect flower macro");
      expression = `<HedgerowReachMap ${props} fieldImage=${q(bg.src)} insectImages={${JSON.stringify([insect.src])}} />`;
    } else if (moment.kind === "ScoutingDecisionLoop_v0tohhe3cvs6") {
      expression = `<MeasuredDecisionLoop ${props} image=${q(bg.src)} />`;
    } else if (moment.kind === "HydraulicInjectionSafety_v0tohhe3cvs6") {
      expression = `<SafetyBoundaryPanel ${props} image=${q(bg.src)} mode="injection" />`;
    } else if (moment.kind === "ProfessionalOnlyGrid_v0tohhe3cvs6") {
      expression = `<SafetyBoundaryPanel ${props} image=${q(bg.src)} mode="boundary" />`;
    } else if (moment.kind === "PlainAlmanacContents_v0tohhe3cvs6") {
      expression = `<PlainAlmanacQuietCTA ${props} image=${q(bg.src)} />`;
    } else if (moment.kind === "HydraulicRamExploded_v0tohhe3cvs6") {
      expression = `<RamPumpExplainer ${props} image=${q(bg.src)} mode="parts" />`;
    } else if (moment.kind === "RamPumpFailureConditions_v0tohhe3cvs6") {
      expression = `<RamPumpExplainer ${props} image=${q(bg.src)} mode="failures" />`;
    } else {
      const data =
        essentialComponentData(moment.kind) || compactComponentData(spec, dur);
      const component = "FarmEvidenceBoard";
      expression = `<${component} ${props} image=${q(bg.src)} title=${q(data.title)}${data.metric ? ` metric=${q(data.metric)}` : ""} variant=${q(spec.variant)} items={${JSON.stringify(data.items)}} />`;
    }
  }

  if (!expression) {
    reportRows.push({
      key,
      start,
      dur,
      type: moment.tipo,
      fallback: "avatar",
      phrase: moment.dice,
    });
    continue;
  }
  cueRows.push(
    `  {key:${q(key)},start:${start},dur:${dur},kind:${q(moment.tipo)},el:(d)=>(` +
      expression +
      `)},`,
  );
  cueRanges.push({start, end: Number((start + dur).toFixed(2))});
  reportRows.push({
    key,
    start,
    dur,
    type: moment.tipo,
    component: moment.kind,
    asset: chosen?.src || null,
    source: chosen?.source || "component",
    phrase: moment.dice,
  });
}

const cuesFile = `import React from "react";
import {
  StockShot_v0tohhe3cvs6 as RawShot,
  StockCornerEvidence_v0tohhe3cvs6 as StockCornerEvidence,
  StockTopRule_v0tohhe3cvs6 as StockTopRule,
  StockFieldBadge_v0tohhe3cvs6 as StockFieldBadge,
  StockLowerEvidence_v0tohhe3cvs6 as StockLowerEvidence,
} from "./scenes/StockShot_v0tohhe3cvs6";
import {
  FarmEvidenceBoard,
} from "./scenes/FarmEvidenceBoard_v0tohhe3cvs6";
import {SoilMetricCards_v0tohhe3cvs6 as SoilMetricCards} from "./scenes/SoilMetricCards_v0tohhe3cvs6";
import {CompostSafetyWindow_v0tohhe3cvs6 as CompostSafetyWindow} from "./scenes/CompostSafetyWindow_v0tohhe3cvs6";
import {ContourRunoffComparison_v0tohhe3cvs6 as ContourRunoffComparison} from "./scenes/ContourRunoffComparison_v0tohhe3cvs6";
import {WetSoilTrafficTest_v0tohhe3cvs6 as WetSoilTrafficTest} from "./scenes/WetSoilTrafficTest_v0tohhe3cvs6";
import {NoduleProofMacro_v0tohhe3cvs6 as NoduleProofMacro} from "./scenes/NoduleProofMacro_v0tohhe3cvs6";
import {HedgerowReachMap_v0tohhe3cvs6 as HedgerowReachMap} from "./scenes/HedgerowReachMap_v0tohhe3cvs6";
import {MeasuredDecisionLoop_v0tohhe3cvs6 as MeasuredDecisionLoop} from "./scenes/MeasuredDecisionLoop_v0tohhe3cvs6";
import {PlainAlmanacQuietCTA_v0tohhe3cvs6 as PlainAlmanacQuietCTA} from "./scenes/PlainAlmanacQuietCTA_v0tohhe3cvs6";
import {SafetyBoundaryPanel_v0tohhe3cvs6 as SafetyBoundaryPanel} from "./scenes/SafetyBoundaryPanel_v0tohhe3cvs6";
import {RamPumpExplainer_v0tohhe3cvs6 as RamPumpExplainer} from "./scenes/RamPumpExplainer_v0tohhe3cvs6";

export type PremiumCue_v0tohhe3cvs6 = {
  key: string;
  start: number;
  dur: number;
  kind: "clip" | "foto_web" | "componente";
  el: (durationInFrames: number) => React.ReactNode;
};

export const PREMIUM_CUES_V0TOHHE3CVS6: PremiumCue_v0tohhe3cvs6[] = [
${cueRows.join("\n")}
];
`;

const mainFile = `import React from "react";
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Video} from "@remotion/media";
import {sec} from "./theme";
import {PREMIUM_CUES_V0TOHHE3CVS6} from "./cues_v0tohhe3cvs6.gen";

export const TOTAL_FRAMES_V0TOHHE3CVS6 = 41814;

const AvatarBase_v0tohhe3cvs6: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, TOTAL_FRAMES_V0TOHHE3CVS6 - 1], [1.012, 1.042], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const driftX = Math.sin(frame / 690) * 5;
  const driftY = Math.cos(frame / 820) * 3;
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#171912"}}>
      <Video
        src={staticFile("avatar_v0tohhe3cvs6.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 50%",
          transform: \`translate(\${driftX}px, \${driftY}px) scale(\${scale})\`,
          filter: "saturate(0.94) contrast(1.025)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 110px rgba(13,12,7,0.2)",
        }}
      />
    </AbsoluteFill>
  );
};

export const MainV0TOHHE3CVS6: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#171912"}}>
    <AvatarBase_v0tohhe3cvs6 />
    {PREMIUM_CUES_V0TOHHE3CVS6.map((cue) => (
      <Sequence
        key={cue.key}
        from={sec(cue.start)}
        durationInFrames={sec(cue.dur)}
        premountFor={30}
      >
        {cue.el(sec(cue.dur))}
      </Sequence>
    ))}
  </AbsoluteFill>
);
`;

fs.writeFileSync(
  `src/VideoEdit/cues_${slug}.gen.tsx`,
  cuesFile,
  "utf8",
);
fs.writeFileSync(`src/VideoEdit/Main_${slug}.tsx`, mainFile, "utf8");

const events = [];
for (const range of cueRanges) {
  events.push({at: range.start, delta: 1});
  events.push({at: range.end, delta: -1});
}
events.sort((left, right) => left.at - right.at || right.delta - left.delta);
const avatarWindows = [{start: 0, mode: "full"}];
let active = 0;
for (let index = 0; index < events.length; ) {
  const at = events[index].at;
  let delta = 0;
  while (index < events.length && Math.abs(events[index].at - at) < 0.001) {
    delta += events[index].delta;
    index++;
  }
  const before = active > 0 ? "hidden" : "full";
  active += delta;
  const after = active > 0 ? "hidden" : "full";
  if (after !== before && at > 0 && at < 1393.8) {
    const last = avatarWindows.at(-1);
    if (last.mode !== after) avatarWindows.push({start: at, mode: after});
  }
}
const avatarFile = `import type {AvatarWindow} from "./scenes/AvatarLayer";
export const TOTAL_V0TOHHE3CVS6 = 1393.8;
export const AVATAR_V0TOHHE3CVS6: AvatarWindow[] = ${JSON.stringify(avatarWindows, null, 2)};
`;
fs.writeFileSync(
  `src/VideoEdit/avatar_${slug}.gen.ts`,
  avatarFile,
  "utf8",
);

const clipSeconds = reportRows
  .filter((row) => row.asset && /\.(mp4|webm|mov)$/i.test(row.asset))
  .reduce((sum, row) => sum + row.dur, 0);
const photoSeconds = reportRows
  .filter(
    (row) =>
      row.asset &&
      !/\.(mp4|webm|mov)$/i.test(row.asset) &&
      row.type !== "componente",
  )
  .reduce((sum, row) => sum + row.dur, 0);
const componentSeconds = reportRows
  .filter((row) => row.type === "componente" && row.asset)
  .reduce((sum, row) => sum + row.dur, 0);
const avatarSeconds = 1393.8 - clipSeconds - photoSeconds - componentSeconds;

const report = {
  slug,
  total_seconds: 1393.8,
  total_frames: 41814,
  cues: cueRows.length,
  assets_available: {
    old_clips: oldClips.length,
    retry_clips: retryClips.length,
    approved_photos: photos.length,
  },
  unique_used: {
    clips: clipUseCount.size,
    photos: usedPhotos.size,
  },
  clip_instances: [...clipUseCount.values()].reduce(
    (sum, count) => sum + count,
    0,
  ),
  screen_seconds: {
    avatar: Number(avatarSeconds.toFixed(2)),
    clip: Number(clipSeconds.toFixed(2)),
    photo: Number(photoSeconds.toFixed(2)),
    component: Number(componentSeconds.toFixed(2)),
  },
  avatar_percent: Number(((avatarSeconds / 1393.8) * 100).toFixed(2)),
  rows: reportRows,
};
fs.writeFileSync(
  `_v3/${slug}_build_report.json`,
  JSON.stringify(report, null, 2),
  "utf8",
);
console.log(JSON.stringify({...report, rows: undefined}, null, 2));
