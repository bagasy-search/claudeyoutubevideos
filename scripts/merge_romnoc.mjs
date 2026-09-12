// merge_romnoc.mjs — une los 6 planes Haiku (plan_romnoc_1..6.json), ancla cada
// beat al ms de captions_romnoc.json (findMs sobre "at"), ordena, deduplica y
// DENSIFICA (rellena huecos de b-roll >4s con clips on-topic por sección de TIEMPO).
// Escribe public/plan_romnoc.json. Canal Dr. Federer — video ARÁNDANO/OJOS.
import fs from "fs";
const caps = JSON.parse(fs.readFileSync("public/captions_romnoc.json", "utf8"));
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
  const f = `public/plan_romnoc_${i}.json`;
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
  { f: 0.00, pool: ["mature woman looking in mirror worried", "close up melasma dark spots on face", "older woman face wrinkles skin", "applying face cream mirror", "womans face aging skin closeup", "sad woman touching cheek mirror", "bathroom morning light face", "dark age spots on cheek macro"] },
  { f: 0.16, pool: ["cosmetic creams shelf store", "applying anti aging cream face", "irritated red skin closeup", "skin cells microscope", "sun damage skin face", "expensive skincare products", "woman frustrated with cream", "melanin pigment skin illustration"] },
  { f: 0.33, pool: ["fresh rosemary sprig closeup", "rosemary plant herb garden", "blood vessels under skin", "antioxidant herbs macro", "rosemary leaves detail", "skin collagen fibers illustration", "hand holding rosemary", "oxidation apple browning"] },
  { f: 0.50, pool: ["rosemary infused in olive oil jar", "pouring olive oil into jar", "rosemary oil bottle dropper", "macerating herbs in oil dark", "olive oil bottle kitchen", "rosemary sprigs in glass jar", "hands preparing herbal oil", "amber dropper bottle oil"] },
  { f: 0.67, pool: ["woman applying facial oil at night", "dropper oil on fingertips", "gentle face massage skincare night", "woman skincare routine bedtime", "applying oil to cheek spots", "serum drops on face", "nighttime skincare mirror", "clean face before bed"] },
  { f: 0.84, pool: ["mature woman clear glowing skin smiling", "healthy radiant skin face closeup", "confident older woman mirror happy", "even skin tone face beautiful", "woman applying sunscreen face", "glass of water hydration", "happy senior woman skin", "sunlight on healthy face"] },
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

fs.writeFileSync("public/plan_romnoc.json", JSON.stringify(withFill, null, 1));
const kinds = {}; withFill.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const fills = withFill.filter((b) => b._fill).length;
console.log(`FINAL: ${withFill.length} beats (${fills} de relleno) · dur ${VEND.toFixed(0)}s · ~1 cada ${(VEND / withFill.length).toFixed(1)}s`);
console.log("kinds:", JSON.stringify(kinds));
