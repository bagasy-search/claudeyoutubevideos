// merge_arandano.mjs — une los 6 planes Haiku (plan_arandano_1..6.json), ancla cada
// beat al ms de captions_arandano.json (findMs sobre "at"), ordena, deduplica y
// DENSIFICA (rellena huecos de b-roll >4s con clips on-topic por sección de TIEMPO).
// Escribe public/plan_arandano.json. Canal Dr. Federer — video ARÁNDANO/OJOS.
import fs from "fs";
const caps = JSON.parse(fs.readFileSync("public/captions_arandano.json", "utf8"));
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const W = caps.map((c) => ({ t: norm(c.text), s: (c.startMs || 0) / 1000 }));
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 7);
  if (p.length < 2) return null;
  for (let i = 0; i < W.length - p.length; i++) {
    if (W[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (W[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return W[i].s;
  }
  return null;
};
const VEND = W[W.length - 1].s + 1.5;

// 1) cargar los 6 planes
let raw = [];
for (let i = 1; i <= 6; i++) {
  const f = `public/plan_arandano_${i}.json`;
  if (!fs.existsSync(f)) { console.log(`⚠ falta ${f}`); continue; }
  let txt = fs.readFileSync(f, "utf8").trim().replace(/^```json|^```|```$/gm, "");
  try { const arr = JSON.parse(txt); raw.push(...arr.map((b) => ({ ...b, _seg: i }))); }
  catch (e) { console.log(`✗ ${f} JSON inválido: ${e.message}`); }
}
console.log(`beats crudos: ${raw.length}`);

// 2) anclar cada uno a su ms
let cursor = 0, anchored = [], miss = 0;
for (const b of raw) {
  const t = findMs(b.at || "", Math.max(0, cursor - 2));
  if (t == null) { miss++; continue; }
  cursor = t;
  anchored.push({ ...b, t });
}
anchored.sort((a, b) => a.t - b.t);
// dedupe: beats a <1.2s → quedarse con el NO-broll (más "inteligente")
const dd = [];
for (const b of anchored) {
  const prev = dd[dd.length - 1];
  if (prev && b.t - prev.t < 1.2) {
    if (prev.kind === "broll" && b.kind !== "broll") dd[dd.length - 1] = b;
    continue;
  }
  dd.push(b);
}
console.log(`anclados: ${anchored.length} (no ancló: ${miss}) · tras dedupe: ${dd.length}`);

// 3) densificar con RELLENO TEMÁTICO por sección de TIEMPO (fracción del total)
const SEC = [
  { f: 0.00, pool: ["close up human eye macro", "senior reading newspaper glasses", "elderly person tired eyes", "fresh blueberries bowl closeup", "older man driving at night", "blueberries falling slow motion", "optometrist eye exam", "person rubbing tired eyes"] },
  { f: 0.16, pool: ["retina eye anatomy animation", "blood vessels microscope flow", "human eye cross section", "blueberries antioxidants macro", "light receptors retina", "dark blue berries closeup", "eye at night dim light", "cells illustration blue"] },
  { f: 0.33, pool: ["night driving headlights glare", "dry eyes computer screen strain", "macula eye center vision", "reading fine print difficulty", "eye doctor retina scan", "blueberries handful closeup", "senior recognizing face smile", "screen blue light eyes"] },
  { f: 0.50, pool: ["blueberries in yogurt bowl", "lutein leafy greens eye", "macula protection shield light", "blueberries fresh harvest", "eye vitamins carotenoids", "handful blueberries palm hand", "retina health closeup eye", "frozen blueberries bowl"] },
  { f: 0.67, pool: ["eating blueberries at night bedside", "greek yogurt with berries nuts", "kiwi fruit sliced green", "papaya slices orange fruit", "walnuts seeds healthy fat", "handful blueberries palm", "person eating fruit habit", "blueberries fridge container"] },
  { f: 0.84, pool: ["senior reading clearly happy", "older person driving night confident", "drinking glass of water", "person sleeping restful", "blueberries bowl on table", "elderly couple smiling outdoors", "bright clear eyes closeup", "healthy fruit breakfast"] },
];
const poolFor = (t) => { const fr = t / VEND; let s = SEC[0]; for (const x of SEC) if (fr >= x.f) s = x; return s.pool; };
const STEP = 3.0;
const ctr = {};
const withFill = [];
for (let i = 0; i < dd.length; i++) {
  withFill.push(dd[i]);
  const next = i + 1 < dd.length ? dd[i + 1].t : VEND;
  const holds = ["pizarra", "diagram", "checklist", "emphasis", "process", "steps"].includes(dd[i].kind);
  const startFill = dd[i].t + (holds ? 8 : STEP);
  for (let t = startFill; t < next - 1.5; t += STEP) {
    const pool = poolFor(t); const k = pool.join("|"); ctr[k] = (ctr[k] || 0);
    withFill.push({ kind: "broll", at: null, t: +t.toFixed(2), query: pool[ctr[k]++ % pool.length], _fill: true });
  }
}
withFill.sort((a, b) => a.t - b.t);

fs.writeFileSync("public/plan_arandano.json", JSON.stringify(withFill, null, 1));
const kinds = {}; withFill.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const fills = withFill.filter((b) => b._fill).length;
console.log(`FINAL: ${withFill.length} beats (${fills} de relleno) · dur ${VEND.toFixed(0)}s · ~1 cada ${(VEND / withFill.length).toFixed(1)}s`);
console.log("kinds:", JSON.stringify(kinds));
