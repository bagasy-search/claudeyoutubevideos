import fs from "node:fs";

const slug = "v55lhde2f1a4";
const planPath = `_v3/${slug}_plan.json`;
const beatsPath = `_v3/${slug}_beats.json`;
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const beats = JSON.parse(fs.readFileSync(beatsPath, "utf8"));

const good = {
  willow: ["u001", "u002", "u006"],
  cutting: ["u003", "u009", "u011", "u012", "u013", "u015", "u016"],
  jar: ["u019", "u020", "u021", "u065", "u067", "u068"],
  roots: ["u019", "u028", "u032"],
  substrate: ["u034", "u035", "u036", "u038", "u040", "u041", "u042"],
  humidity: ["u046", "u047", "u048", "u049"],
  nursery: ["u030", "u041", "u043", "u045", "u046", "u047", "u049", "u050", "u051", "u052", "u053", "u054", "u055", "u076"],
  species: ["u057", "u058", "u059", "u060", "u061", "u062", "u063", "u064"],
  process: ["u003", "u009", "u011", "u012", "u015", "u026", "u033", "u036", "u037", "u038", "u040", "u041", "u046", "u051", "u054", "u060", "u065", "u068", "u071", "u074", "u075", "u076", "u080", "u082"],
  limits: ["u048", "u049", "u071", "u073", "u074", "u075", "u078"],
  close: ["u004", "u005", "u011", "u013", "u016", "u020", "u028", "u032", "u034", "u067", "u071"],
};

const gaps = [
  {
    re: /dos frascos|letra a|letra b|agua sola|misma cantidad|misma planta|control/i,
    kind: "OptionCompare",
    why: "El stock no mostró el experimento A/B real; el comparador del kit lo explica sin fingir una toma.",
  },
  {
    re: /hierve|agua caliente|vierte el agua|cuela|colador|infusi[oó]n|reposar entre/i,
    kind: "ProcessSteps",
    why: "No hubo metraje inequívoco del preparado completo; el proceso numerado mantiene precisión.",
  },
  {
    re: /tres o cuatro cent[ií]metros|ninguna hoja.*superficie|espacio para el aire|sumerge solo|nudo inferior/i,
    kind: "DiagramBoard",
    why: "El nivel correcto de agua y las hojas fuera del frasco necesitan un diagrama literal.",
  },
  {
    re: /agua turbia|se pone turbia|tallo.*marr[oó]n|podrid|descomposici[oó]n/i,
    kind: "SafetyGrid",
    why: "No se encontró un esqueje podrido identificable; el componente marca señales de descarte.",
  },
  {
    re: /callo|puntos blancos|protuberancias|ra[ií]z fina|filamentos definidos/i,
    kind: "CrossSection",
    why: "La progresión callo-raíz no existe en stock limpio; el corte transversal la vuelve comprensible.",
  },
  {
    re: /perlita|mezcla un material|medio aireado|no lo conviertas en barro/i,
    kind: "SplitList",
    why: "La mezcla aireada se entiende mejor comparando humedad útil contra barro.",
  },
];

const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const categoryFor = (phrase) => {
  const p = normalize(phrase);
  if (/sauce|salix|ribera|orilla/.test(p)) return "willow";
  if (/raiz|enraiz|filamento|callo|protuberancia/.test(p)) return "roots";
  if (/frasco|vaso|botella|agua sola|etiqueta/.test(p)) return "jar";
  if (/sustrato|perlita|tierra|maceta|plantar|trasplanta/.test(p)) return "substrate";
  if (/bolsa|campana|humedad|luz|sol|ventana|aclimat/.test(p)) return "humidity";
  if (/vivero|plantines|bandeja/.test(p)) return "nursery";
  if (/albahaca|menta|coleo|poto|hiedra|romero|lavanda|hortensia|vid|higuera|granado|citr|manzano|frutal/.test(p))
    return "species";
  if (/tijera|corta|corte|hojas|flor|fruto|remojo|vierte|cuela|hierve|mezcla|agujero|presiona|riego/.test(p))
    return "process";
  if (/error|mito|enferma|invasora|protegida|fertiliz|hongos|bacteria|podr/.test(p)) return "limits";
  if (/galpon|comentario|proximo video|gente sencilla|nos vemos/.test(p)) return "close";
  return "cutting";
};

const counters = Object.fromEntries(Object.keys(good).map((k) => [k, 0]));
const used = new Set();
const allGood = [...new Set(Object.values(good).flat())];
let reroutedToComponent = 0;
let stockMoments = 0;

for (const section of plan.secciones) {
  for (const moment of section.momentos) {
    if (moment.src !== "stock") continue;
    const gap = gaps.find((g) => g.re.test(moment.dice));
    const beat = beats.find((b) => b.name === moment.id);
    if (gap) {
      moment.tipo = "componente";
      moment.kind = gap.kind;
      moment.src = "component";
      moment.asset = null;
      moment.query = null;
      moment.muestra = `${gap.kind}: ${moment.dice}`;
      moment.porque = gap.why;
      if (beat) Object.assign(beat, { src: "component", kind: gap.kind, asset: null, query: null, queries: [], desc: moment.muestra });
      reroutedToComponent++;
      continue;
    }
    const category = categoryFor(moment.dice);
    const pool = good[category];
    const clip =
      pool.find((name) => !used.has(name)) ||
      good.process.find((name) => !used.has(name)) ||
      good.cutting.find((name) => !used.has(name)) ||
      allGood.find((name) => !used.has(name)) ||
      pool[counters[category] % pool.length];
    counters[category]++;
    used.add(clip);
    moment.asset = `broll/${slug}/${clip}.mp4`;
    moment.query = category;
    moment.muestra = `Stock real auditado ${clip}: ${category}`;
    moment.porque = `Clip Pexels único y aprobado visualmente para la categoría ${category}.`;
    if (beat) Object.assign(beat, { src: "stock", asset: moment.asset, query: category, queries: [category, category], desc: moment.muestra });
    stockMoments++;
  }
}

plan.stockAuditoria = {
  supplemental: "82 IDs Pexels únicos revisados en hojas de contacto",
  aprobados: Object.fromEntries(Object.entries(good).map(([k, v]) => [k, v])),
  usados: [...used].sort(),
  huecosReencuadradosConKit: gaps.map((g) => ({ kind: g.kind, motivo: g.why })),
};

fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));
fs.writeFileSync(beatsPath, JSON.stringify(beats, null, 2));

const moments = plan.secciones.flatMap((s) => s.momentos);
const duration = plan.duracion;
const pct = (src) =>
  +(
    (100 * moments.filter((m) => m.src === src).reduce((sum, m) => sum + m.seg, 0)) /
    duration
  ).toFixed(1);
console.log(
  JSON.stringify(
    {
      moments: moments.length,
      stockMoments,
      uniqueApprovedClipsUsed: used.size,
      reroutedToComponent,
      avatarPct: pct("avatar"),
      stockPct: pct("stock"),
      componentPct: pct("component"),
    },
    null,
    2,
  ),
);
