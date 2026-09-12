// preflight.mjs — GATE DURO de assets/sanidad ANTES de renderizar (corre tras
// build + beatsheet + gen_deapi/gen_video + preblur). Complementa a varcheck.mjs:
// varcheck mira VARIEDAD de componentes; esto mira que el render NO SE CAIGA.
//
//   node scripts/preflight.mjs <slug>        (lee beatsheet/<slug>.json)
//
// Frena (exit 1) ante los 3 errores que históricamente cuestan re-renders de 1-2 h:
//   1) ASSET FALTANTE — un beat referencia img/vid/real/broll/... que NO está en
//      disco → 404 en pleno render y se cae. (Para vid/ faltante avisa si el still
//      de origen img/<name>.png está o no, para saber si se puede generar.)
//   2) _blur.jpg FALTANTE — toda foto de img/ (salvo dg_*/_avatar_ref) que se use
//      como fondo blureado necesita su hermano <name>_blur.jpg (lo hace preblur.mjs).
//      Si falta, ImageBackdrop pide un archivo inexistente → 404. Fix: node preblur.mjs
//   3) DURACIÓN INVÁLIDA — un beat-cue con dur<=0 o start inválido → la escena dura
//      0 frames y crashea en el frame 0.
//
// Avisos (no frenan): solapes de ventanas, kind desconocido (el beat desaparece del
// render), campo legacy "_dur", avatar faltante.
import fs from "fs";
import path from "path";

const slug = process.argv[2];
if (!slug) { console.error("Uso: node scripts/preflight.mjs <slug>"); process.exit(1); }
const BS = `beatsheet/${slug}.json`;
if (!fs.existsSync(BS)) { console.error("No existe:", BS); process.exit(1); }
const bs = JSON.parse(fs.readFileSync(BS, "utf8").replace(/^﻿/, ""));
const beats = bs.beats || [];

const inPublic = (rel) => fs.existsSync(path.join("public", rel.replace(/^\//, "")));
const ASSET_RE = /^(img|vid|real|broll|assets|avatar_clips)\/.+\.(png|jpe?g|webp|gif|mp4|webm|mov|m4v)$/i;

// kinds que beatsheet.mjs sabe renderizar (si no está acá, el cue sale null → el beat
// no se dibuja). Mantener en sync con el switch de renderEl en beatsheet.mjs.
const KNOWN = new Set([
  "raw", "diagram", "layered", "quote", "chips", "splitlist", "stat", "impact", "journey", "float",
  "headline", "aged", "bars", "cross", "process", "checklist", "rule", "annotated", "callout",
  "infzoom", "teasecards", "half", "top7", "riskclock", "moat", "sizescale", "loctag", "chapter",
  "nametag", "phrasetag", "metertag", "foundertree", "timeline", "stattag", "spreadmap", "costtally",
  "scent", "depthtext", "estateletter", "twomoments", "mistake", "goldvault", "lookback", "tool",
  "deed", "odometer", "signature", "vsmed", "action", "keyphrase", "statpills", "floatprop",
  "diorama", "nextvideo", "talk",
  // capa documental (overlays)
  "doclabel", "placetag", "datestamp", "countrail", "originpips", "sourcechip", "sonarhud",
  // set pieces de imagen/clip
  "expeditionmap", "scalecolossus", "evidenceboard", "loupe", "thennow", "ghost",
  // fichas explicativas
  "focuscard", "termcard", "splitexplain",
  // overlays a medida (OxCards / MaderaCards / MaderaPolish / CementoPolish / ManualCard)
  "oxstat", "oxmethod", "oxrule", "oxclamp", "oxtag", "oxbefore", "oxside", "oxstack", "oxspec", "oxnote", "oxquote", "manualcard",
  "mdgauge", "mdlife", "mdrecipe", "mdpost", "mdchar", "mdrecap", "mdname", "mdnext",
  "mdtwoplanks", "mdsealtrap", "mdrotinside", "mdrulestamp", "mdfungus", "mdslider", "mdkicker", "mdendcard", "mdtrans",
  "cmrecipe", "cmyears", "cmselfheal", "cmcure", "cmerror", "cmname",
  "slcapillary", "slsalt", "slseal", "slbarrier", "sllime", "sltwowalls", "slname",
  "acgauge", "acports", "acoverfill", "acsteps", "accircuit", "acname",
  // otros kinds del switch de beatsheet ausentes del set original
  "ingredients", "numcard", "regrow", "lielist", "gridreveal", "growthtimeline", "kineticline", "blurreveal", "hugel", "olla", "floatcards", "layered",
]);

// deep-walk: junta TODA string que parezca path de asset, sin importar en qué campo
// esté (src, image, slides[].image, waypoints[].image, cards[].src, images[], etc.).
const collectAssets = (node, out) => {
  if (node == null) return;
  if (typeof node === "string") { if (ASSET_RE.test(node)) out.add(node.replace(/^\//, "")); return; }
  if (Array.isArray(node)) { for (const v of node) collectAssets(v, out); return; }
  if (typeof node === "object") { for (const v of Object.values(node)) collectAssets(v, out); }
};

const hard = [];   // frenan (exit 1)
const warn = [];   // avisan

// ── 1) duración / start por beat-cue + kind desconocido + _dur legacy ─────────
beats.forEach((b, i) => {
  const id = b.id || `#${i}`;
  const isCue = b.kind && b.kind !== "talk";
  if ("_dur" in b) warn.push(`${id}: usa "_dur" (legacy); el beatsheet usa "dur"`);
  if (isCue) {
    if (typeof b.dur !== "number" || !(b.dur > 0)) hard.push(`${id} (${b.kind}): dur inválido (${JSON.stringify(b.dur)}) → escena de 0 frames`);
    if (typeof b.start !== "number" || b.start < 0) hard.push(`${id} (${b.kind}): start inválido (${JSON.stringify(b.start)})`);
  }
  if (b.kind && !KNOWN.has(b.kind)) warn.push(`${id}: kind "${b.kind}" desconocido → el beat NO se dibujará (¿typo?)`);
  // src/image que apunta a una carpeta de assets pero SIN extensión → 404 silencioso en el render
  for (const k of ["src", "image", "worldImage", "mapImage"]) {
    const v = b[k];
    if (typeof v === "string" && /^(img|vid|real|broll|assets|avatar_clips)\//i.test(v) && !ASSET_RE.test(v))
      hard.push(`${id}: ${k}="${v}" sin extensión de archivo (¿falta .mp4/.jpg/.png?)`);
  }
});

// ── 2) assets referenciados que no están en disco ────────────────────────────
const refs = new Set();
for (const b of beats) collectAssets(b, refs);
if (bs.avatar && !inPublic(bs.avatar)) warn.push(`avatar faltante: public/${bs.avatar}`);

const missing = [];
for (const r of refs) {
  if (inPublic(r)) continue;
  if (/^vid\//i.test(r)) {
    const stillName = r.replace(/^vid\//i, "").replace(/\.[^.]+$/, "");
    const still = `img/${stillName}.png`;
    missing.push(`${r}  (clip; still de origen ${still} ${inPublic(still) ? "✓ presente → corré gen_video" : "✗ TAMBIÉN falta"})`);
  } else {
    missing.push(r);
  }
}
for (const m of missing) hard.push(`asset faltante: ${m}`);

// ── 3) _blur.jpg de las fotos img/ (las que ImageBackdrop hornea) ─────────────
const needBlur = [...refs].filter((r) => {
  if (!/^img\/.+\.(png|jpe?g)$/i.test(r)) return false;
  const base = r.split("/").pop();
  return !base.startsWith("dg_") && !base.startsWith("_avatar_ref");
});
const blurMissing = needBlur.filter((r) => inPublic(r) && !inPublic(r.replace(/\.(png|jpe?g)$/i, "_blur.jpg")));
if (blurMissing.length) {
  hard.push(`${blurMissing.length} foto(s) img/ sin _blur.jpg → 404 al blurear. Fix: node preblur.mjs`);
  for (const r of blurMissing.slice(0, 8)) hard.push(`    · ${r}`);
  if (blurMissing.length > 8) hard.push(`    · …y ${blurMissing.length - 8} más`);
}

// ── 4) solapes de ventanas (aviso; floats/overlay son intencionales) ──────────
const sorted = beats.filter((b) => b.kind && b.kind !== "talk" && b.kind !== "float" && !b.overlay)
  .sort((a, b) => a.start - b.start);
for (let i = 1; i < sorted.length; i++) {
  const prev = sorted[i - 1], prevEnd = prev.start + prev.dur;
  if (sorted[i].start < prevEnd - 1e-6)
    warn.push(`solapan: ${prev.id} (${prev.start}–${prevEnd.toFixed(1)}) y ${sorted[i].id} (desde ${sorted[i].start})`);
}

// ── reporte ───────────────────────────────────────────────────────────────────
console.log(`\n=== preflight: ${slug} (${beats.length} beats, ${refs.size} assets referenciados) ===`);
if (warn.length) {
  console.log(`\n⚠ ${warn.length} aviso(s):`);
  for (const w of warn) console.log("  · " + w);
}
if (hard.length) {
  console.error(`\n❌ ${hard.length} ERROR(es) que CAEN el render — corregí antes de rendir:`);
  for (const h of hard) console.error("  · " + h);
  console.error("");
  process.exit(1);
}
console.log("\n✅ preflight OK — assets completos, _blur horneado, duraciones válidas. Listo para render.");
