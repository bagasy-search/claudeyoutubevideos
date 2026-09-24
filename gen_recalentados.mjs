// gen_recalentados.mjs — convierte el plan visual (public/plan_recal.json, hecho por
// los 6 agentes Haiku + densificado) en el beatsheet del video "Recalentados" (canal
// Federer Salud). Reusa la infra de Federer (Pizarra, EmphasisMoment, scrim, stat,
// checklist, diagramas, endcard). Look THEME_MEDICO.
//   Salidas: src/VideoEdit/recalentados_broll.ts   (b-roll denso · RawShot)
//            src/VideoEdit/recalentados_beats.ts   (componentes · renderRecalComp)
//            src/VideoEdit/recalentados_hooks.ts    (scrims + emphasis + endcard overlays)
//            public/broll/stock_recal.json          (mapa name→query para fetch_pexels)
import fs from "fs";
const plan = JSON.parse(fs.readFileSync("public/plan_recal.json", "utf8"));
const caps = JSON.parse(fs.readFileSync("public/captions_recalentados.json", "utf8"));
const VEND = (caps[caps.length - 1].endMs / 1000) + 1.5;

plan.sort((a, b) => a.t - b.t);
// dur de componentes/scrims = hasta el próximo beat; el B-ROLL se hace CONTIGUO
// aparte (cada clip hasta el próximo clip de b-roll) = cama de fondo sin huecos.
for (let i = 0; i < plan.length; i++) plan[i].dur = +(((i + 1 < plan.length ? plan[i + 1].t : VEND) - plan[i].t)).toFixed(2);
const brollTimes = plan.filter((b) => b.kind === "broll").map((b) => b.t).sort((a, z) => a - z);
const nextBroll = (t) => { for (const x of brollTimes) if (x > t + 0.1) return x; return VEND; };

const broll = [], comps = [], scrims = [], emphases = [], foods = [];
let endcardT = null, bn = 0, cn = 0;
const stock = {};
const FOOD_IDX = { ARROZ: 0, POLLO: 1, ESPINACA: 2, HUEVOS: 3 };
const foodSeen = new Set();

for (const b of plan) {
  const start = +b.t.toFixed(2), dur = Math.max(0.6, b.dur);
  if (b.kind === "broll") {
    const name = `rb${String(bn++).padStart(3, "0")}`;
    stock[name] = b.query || "healthy food kitchen";
    const bdur = +(nextBroll(start) - start).toFixed(2); // contiguo hasta el próximo clip
    broll.push({ name, src: `broll/${name}.mp4`, start, dur: bdur });
  } else if (b.kind === "scrim") {
    const word = (b.word || "").toUpperCase().trim();
    // revelación de alimento → FoodLockReveal (candados zigzag), no un scrim
    if (word in FOOD_IDX && !foodSeen.has(word)) {
      foodSeen.add(word);
      foods.push({ start: +(start - 0.3).toFixed(2), dur: 5.5, index: FOOD_IDX[word] });
    } else {
      scrims.push({ start, dur: Math.min(dur, 2.6), word, accent: b.accent === "coral" ? "coral" : "teal" });
    }
  } else if (b.kind === "emphasis") {
    emphases.push({ from: start, to: +(start + Math.min(dur, 3.0)).toFixed(2), text: b.text || "" });
  } else if (b.kind === "endcard") {
    endcardT = start;
  } else {
    // componente (stat/headline/pizarra/diagram/checklist/…) → capa de componentes
    const c = { id: `c${cn++}`, kind: b.kind, start, dur, ...b };
    delete c.t; delete c._seg; delete c._fill; delete c.at;
    comps.push(c);
  }
}
if (endcardT == null) endcardT = VEND - 5;

// asegurar los 4 reveals de alimentos (inyectar los que no vinieron de un scrim)
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = caps.map((c) => ({ t: norm(c.text), s: (c.startMs || 0) / 1000 }));
const findMs = (ph, after = 0) => { const p = norm(ph).split(" "); for (let i = 0; i < CW.length - p.length; i++) { if (CW[i].s < after) continue; let ok = 1; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = 0; break; } if (ok) return CW[i].s; } return null; };
const FOODPH = { 0: "el arroz", 1: "el pollo", 2: "la espinaca", 3: "los huevos" };
for (const i of [0, 1, 2, 3]) {
  if (foods.some((f) => f.index === i)) continue;
  const t = findMs(FOODPH[i], i === 0 ? 380 : 0); // arroz: buscar tras el intro
  if (t) foods.push({ start: +(t - 0.3).toFixed(2), dur: 5.5, index: i });
}
foods.sort((a, b) => a.start - b.start);

// ── CLUSTER → ScrollDoc ─────────────────────────────────────────────────────
// Problema que resolvemos: cada componente hacía su "fin" y aparecía otro (sensación
// entrecortada). Ahora las explicaciones TÉCNICAS (diagram/pizarra consecutivos) se
// funden en UN lienzo continuo que scrollea (ScrollDoc): imagen a un lado + texto que
// se escribe al otro, se baja sin cortes, aparece otra imagen y sigue. Cada placa se
// ancla a los CAPTIONS reales para que el texto tipeado sincronice con la narración.
const capsText = (t, win = 2.8, maxWords = 15) => {
  const w = [];
  for (const c of caps) { const s = (c.startMs || 0) / 1000; if (s < t - 0.15) continue; if (s > t + win) break; w.push(c.text); if (w.length >= maxWords) break; }
  return w.join(" ").replace(/\s+/g, " ").trim();
};
const brollAt = (t) => { let best = broll[0]; for (const b of broll) { if (b.start <= t + 0.01) best = b; else break; } return best ? best.src : undefined; };
const EXPLAIN = new Set(["diagram", "pizarra"]);
const panelsOf = (c) => {
  const out = [];
  if (c.kind === "diagram") {
    out.push({ media: brollAt(c.start), eyebrow: "Mecanismo", heading: c.title || "", body: capsText(c.start) });
  } else {
    const slide = (c.slides || [])[0] || {};
    const steps = slide.steps || slide.items || [];
    if (steps.length >= 2) {
      const per = Math.max(2.4, c.dur / steps.length);
      steps.slice(0, 4).forEach((s, k) => {
        const t = +(c.start + k * per).toFixed(2);
        const head = typeof s === "string" ? s : (s.title || s.text || "");
        out.push({ media: brollAt(t), eyebrow: c.title, heading: head, body: capsText(t, Math.min(per, 3)) });
      });
    } else {
      out.push({ media: brollAt(c.start), eyebrow: c.title, heading: (slide.heading || c.title || ""), body: capsText(c.start) });
    }
  }
  return out;
};
// runs de comps explicativos consecutivos (sin otro comp en medio, gap < 8s)
const clusters = []; let cur = null;
for (const c of comps) {
  if (EXPLAIN.has(c.kind) && c.start - (cur ? cur.end : -99) < 8) {
    if (cur) { cur.items.push(c); cur.end = c.start + c.dur; }
    else { cur = { items: [c], start: c.start, end: c.start + c.dur }; clusters.push(cur); }
  } else if (EXPLAIN.has(c.kind)) { cur = { items: [c], start: c.start, end: c.start + c.dur }; clusters.push(cur); }
  else { cur = null; }
}
// límites para dar aire sin pisar el próximo comp/food/emphasis
const boundStarts = [...comps.filter((c) => !EXPLAIN.has(c.kind)).map((c) => c.start), ...foods.map((f) => f.start), ...emphases.map((e) => e.from), VEND];
const consumed = new Set();
const scrollDocs = [];
for (const cl of clusters) {
  let panels = cl.items.flatMap(panelsOf).filter((p) => p.heading);
  // quitar placas con heading casi repetido y capar a 7 (evita spans eternos/redundantes)
  panels = panels.filter((p, i) => i === 0 || norm(p.heading).slice(0, 16) !== norm(panels[i - 1].heading).slice(0, 16));
  if (panels.length > 7) panels = panels.slice(0, 7);
  if (panels.length < 2) continue; // 1 sola placa → no vale la pena, dejar el comp original
  const nextB = Math.min(...boundStarts.filter((x) => x > cl.start + 0.5));
  const room = nextB - cl.start - 0.3;
  if (room < panels.length * 2.6) continue; // sin espacio para respirar → dejar original
  const dur = Math.min(panels.length * 4.8, room);
  cl.items.forEach((it) => consumed.add(it));
  scrollDocs.push({ id: `sd${scrollDocs.length}`, kind: "scrolldoc", start: cl.start, dur: +dur.toFixed(2), panels });
}
const comps2 = comps.filter((c) => !consumed.has(c)).concat(scrollDocs).sort((a, b) => a.start - b.start);
comps.length = 0; comps.push(...comps2);

// un ScrollDoc es un lienzo fullscreen: los overlays (scrim palabra, emphasis) NO deben
// dispararse encima. Quitar los que caen dentro de un span de scrolldoc.
const inSD = (t) => scrollDocs.some((s) => t >= s.start - 0.15 && t < s.start + s.dur - 0.15);
{
  const s0 = scrims.length, e0 = emphases.length;
  for (let i = scrims.length - 1; i >= 0; i--) if (inSD(scrims[i].start)) scrims.splice(i, 1);
  for (let i = emphases.length - 1; i >= 0; i--) if (inSD(emphases[i].from)) emphases.splice(i, 1);
  console.log(`overlays filtrados por scrolldoc: scrims ${s0}→${scrims.length} · emphasis ${e0}→${emphases.length}`);
}

// ── escribir TS ───────────────────────────────────────────────────────────────
const wr = (f, name, val, type = "any[]") =>
  fs.writeFileSync(`src/VideoEdit/${f}`, `// AUTO-GENERADO por gen_recalentados.mjs\nexport const ${name}: ${type} = ${JSON.stringify(val)};\n`);
wr("recalentados_broll.ts", "RECAL_BROLL", broll, "{name:string;src:string;start:number;dur:number}[]");
wr("recalentados_beats.ts", "RECAL_COMPS", comps);
fs.writeFileSync("src/VideoEdit/recalentados_hooks.ts",
  `// AUTO-GENERADO por gen_recalentados.mjs — overlays del video Recalentados.\n` +
  `export const RECAL_SCRIMS: {start:number;dur:number;word:string;accent:string}[] = ${JSON.stringify(scrims)};\n` +
  `export const RECAL_EMPH: {from:number;to:number;text:string}[] = ${JSON.stringify(emphases)};\n` +
  `export const RECAL_FOODS: {start:number;dur:number;index:number}[] = ${JSON.stringify(foods)};\n` +
  `export const RECAL_ENDCARD = ${endcardT.toFixed(2)};\n` +
  `export const RECAL_END = ${VEND.toFixed(2)};\n`);

// stock map (solo los usados)
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/stock_recal.json", JSON.stringify(stock, null, 1));

const kinds = {}; comps.forEach((c) => kinds[c.kind] = (kinds[c.kind] || 0) + 1);
console.log(`b-roll: ${broll.length} · componentes: ${comps.length} · scrims: ${scrims.length} · emphasis: ${emphases.length} · endcard @${endcardT.toFixed(0)}s`);
console.log("comp kinds:", JSON.stringify(kinds));
console.log(`stock a bajar: ${Object.keys(stock).length} · dur ${VEND.toFixed(0)}s`);
