// check_props_mdtank.mjs — COMPUERTA DE CONTRATOS para el kit de Mike Dalton.
//
// `scripts/check_props.mjs` valida el beatsheet del OTRO formato (kinds en minúscula tipo
// `blurexplainer`). Este video usa componentes PascalCase del kit peroxide/premium + los propios
// de `src/mdtank/`, así que la compuerta se hace acá — mismas cuatro preguntas:
//
//   1. ¿está cada prop REQUERIDA (sin `?` en la firma) presente en el beat?
//   2. ¿la FORMA de las props compuestas es la que el componente realmente lee?
//   3. ¿existe EN DISCO toda ruta de asset citada?
//   4. ¿el Main reenvía las props? (el builder hace spread `{...props}`, se verifica en el cues)
//
//   node scripts/check_props_mdtank.mjs      exit 1 = no rendees
import fs from "fs";

const SLUG = "mdtank";
const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
const cues = fs.readFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, "utf8");

// dónde vive cada componente
const WHERE = {
  ChapterTrailCard: "src/peroxide/PeroxideHero.tsx",
  LightTrailCards: "src/peroxide/PeroxideHero.tsx",
  BottleHero: "src/peroxide/PeroxideHero.tsx",
  HookCaption: "src/VideoEdit/kit/premium/text.tsx",
  HighlightSweep: "src/VideoEdit/kit/premium/text.tsx",
  BigStatReveal: "src/VideoEdit/kit/premium/stats.tsx",
  MythTruth: "src/VideoEdit/kit/premium/frame.tsx",
  BulletCascade: "src/VideoEdit/kit/premium/lists.tsx",
  MdGuidePage: "src/mdtank/MdGuidePage.tsx",
  MdQrCta: "src/mdtank/MdQrCta.tsx",
};

// forma esperada de las props compuestas (lo que el componente REALMENTE lee)
const SHAPE = {
  HookCaption: { words: (v) => Array.isArray(v) && v.every((w) => w && typeof w.text === "string") },
  BulletCascade: { bullets: (v) => Array.isArray(v) && v.every((b) => b && typeof b.key === "string") },
  BigStatReveal: { value: (v) => typeof v === "number" },
  ChapterTrailCard: { number: (v) => typeof v === "string" },   // ⛔ number:6 crashea `number.match`
  LightTrailCards: { number: (v) => typeof v === "string" },
};

// props que el componente trae con TEXTO POR DEFECTO de otro video/idioma → hay que pisarlas
const MUST_OVERRIDE = {
  BottleHero: ["eyebrow", "phrase"],
  LightTrailCards: ["eyebrow", "phrase"],
};

const err = [];
const sigCache = {};
function requiredProps(comp) {
  if (sigCache[comp]) return sigCache[comp];
  const file = WHERE[comp];
  if (!file || !fs.existsSync(file)) { err.push(`no encuentro el archivo de ${comp}`); return (sigCache[comp] = []); }
  const src = fs.readFileSync(file, "utf8");
  const i = src.indexOf(`export const ${comp}: React.FC<{`);
  if (i < 0) { err.push(`no encuentro la firma de ${comp} en ${file}`); return (sigCache[comp] = []); }
  const body = src.slice(i, src.indexOf("}>", i));
  const req = [];
  for (const line of body.split("\n").slice(1)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)(\??):/);
    if (m && m[2] !== "?" && m[1] !== "durationInFrames") req.push(m[1]);
  }
  return (sigCache[comp] = req);
}

const isAsset = (v) => typeof v === "string" && /^(img|broll|sfx)\/.+\.(jpg|jpeg|png|mp4|mp3)$/.test(v);

for (const b of plan.beats) {
  if (b.tipo !== "componente") continue;
  const c = b.componente, props = b.props || {};
  // 1. requeridas
  for (const r of requiredProps(c)) if (!(r in props)) err.push(`${c} @${b.ms_in}ms: falta la prop REQUERIDA "${r}"`);
  // 2. forma
  for (const [k, ok] of Object.entries(SHAPE[c] || {})) if (k in props && !ok(props[k])) err.push(`${c} @${b.ms_in}ms: prop "${k}" con la FORMA equivocada → ${JSON.stringify(props[k]).slice(0, 60)}`);
  // 2.bis. defaults en español que hay que pisar
  for (const k of MUST_OVERRIDE[c] || []) if (!(k in props)) err.push(`${c} @${b.ms_in}ms: NO pisa "${k}" → sale el texto por defecto EN ESPAÑOL`);
  // 3. assets en disco
  for (const [k, v] of Object.entries(props)) if (isAsset(v) && !fs.existsSync(`public/${v}`)) err.push(`${c} @${b.ms_in}ms: "${k}" apunta a public/${v} que NO EXISTE`);
  // 4. reenvío: el cues tiene que traer esas props en el spread
  for (const k of Object.keys(props)) {
    const line = cues.split("\n").find((l) => l.includes(`"componente_${b.ms_in}"`));
    if (line && !line.includes(`"${k}"`)) err.push(`${c} @${b.ms_in}ms: el cues NO reenvía "${k}"`);
  }
}

// los clips y sus camas
for (const b of plan.beats) {
  if (b.tipo === "clip" && !fs.existsSync(`public/broll/${b.clip}.mp4`)) err.push(`clip @${b.ms_in}ms: falta public/broll/${b.clip}.mp4`);
}
// toda ruta citada en el cues generado
for (const m of cues.matchAll(/(?:src|img|image)="((?:img|broll|sfx)\/[^"]+)"/g)) {
  if (!fs.existsSync(`public/${m[1]}`)) err.push(`cues: ruta inexistente public/${m[1]}`);
}

const comps = [...new Set(plan.beats.filter((b) => b.tipo === "componente").map((b) => b.componente))];
console.log(`componentes verificados: ${comps.length} (${comps.join(", ")})`);
console.log(`beats de componente: ${plan.beats.filter((b) => b.tipo === "componente").length} · clips: ${plan.beats.filter((b) => b.tipo === "clip").length}`);
if (err.length) { console.log(`\n⛔ ${err.length} problemas:`); [...new Set(err)].slice(0, 25).forEach((e) => console.log("   " + e)); process.exit(1); }
console.log("✅ contratos OK — se puede farmear.");
