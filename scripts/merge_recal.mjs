// merge_recal.mjs — une los 6 planes Haiku (plan_recal_1..6.json), ancla cada beat
// al ms de captions_recalentados.json (findMs sobre "at"), ordena, deduplica y
// DENSIFICA (rellena huecos de b-roll >4s con clips on-topic). Escribe el plan
// final public/plan_recal.json + reporte.
import fs from "fs";
const caps = JSON.parse(fs.readFileSync("public/captions_recalentados.json", "utf8"));
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
  const f = `public/plan_recal_${i}.json`;
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

// 3) densificar con RELLENO TEMÁTICO por sección (matchea el alimento en pantalla)
const secAt = (ph) => findMs(ph, 0) ?? 1e9;
const SEC = [
  { t: 0, pool: ["doctor in white coat explaining", "reheating leftovers in microwave", "open refrigerator with food containers", "family eating dinner table", "meal prep containers fridge", "hand pressing microwave button", "steam rising hot food", "person cooking kitchen"] },
  { t: secAt("primero la oxidacion") - 2, pool: ["molecular structure blue animation", "dna double helix rotating", "cancer cells under microscope", "chemical reaction laboratory", "scientist looking microscope", "human cells illustration", "food oxidation browning", "microscope lab research"] },
  { t: secAt("el arroz") - 2, pool: ["cooked white rice bowl", "reheating rice in microwave", "rice grains close up", "bacteria under microscope", "rice cooking pot steam", "leftover rice container fridge"] },
  { t: secAt("el pollo") - 2, pool: ["cooked chicken breast plate", "reheating chicken microwave", "raw chicken meat", "grilled chicken protein meal", "dna strand binding molecule", "chicken leftovers container"] },
  { t: secAt("la espinaca") - 2, pool: ["fresh spinach leaves close", "cooked spinach pan", "leafy green vegetables", "salad bowl greens", "spinach in refrigerator", "green vegetables cutting board"] },
  { t: secAt("los huevos") - 2, pool: ["boiled eggs peeled", "scrambled eggs pan", "egg yolk close up", "cracking egg into bowl", "eggs breakfast plate", "reheating eggs microwave"] },
  { t: secAt("juntemos todo") - 2, pool: ["doctor talking to camera", "healthy meal fresh food", "family cooking together kitchen", "person sharing phone", "fresh vegetables market", "clean healthy plate food"] },
];
const poolFor = (t) => { let s = SEC[0]; for (const x of SEC) if (t >= x.t) s = x; return s.pool; };
const MAXGAP = 4.0, STEP = 3.0;
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

fs.writeFileSync("public/plan_recal.json", JSON.stringify(withFill, null, 1));
const kinds = {}; withFill.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const fills = withFill.filter((b) => b._fill).length;
console.log(`FINAL: ${withFill.length} beats (${fills} de relleno) · dur ${VEND.toFixed(0)}s · ~1 cada ${(VEND / withFill.length).toFixed(1)}s`);
console.log("kinds:", JSON.stringify(kinds));
