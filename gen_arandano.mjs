// gen_arandano.mjs — convierte public/plan_arandano.json (6 agentes Haiku + densificado)
// en el beatsheet del video "Arándano/Ojos" (canal Dr. Federer). Reusa la infra Federer/
// Recalentados (renderRecalComp, ScrollDoc, Pizarra, scrim, stat, diagram, RecalRich).
// Look THEME_MEDICO. Slug = arandano.
//   Salidas: src/VideoEdit/arandano_broll.ts  (b-roll CONTIGUO · RawShot)
//            src/VideoEdit/arandano_beats.ts  (componentes · renderRecalComp)
//            src/VideoEdit/arandano_hooks.ts   (scrims + emphasis + endcard)
//            public/broll/stock_arandano.json  (mapa name→query para fetch_pexels)
import fs from "fs";
const plan = JSON.parse(fs.readFileSync("public/plan_arandano.json", "utf8"));
const caps = JSON.parse(fs.readFileSync("public/captions_arandano.json", "utf8"));
// set de imágenes que MUESTRAN al doctor (prompt con ref) → en esas ocultamos el PiP
// del avatar (si no, sale "doble doctor": la foto + el recuadro).
const AVSET = new Set();
for (let i = 1; i <= 4; i++) {
  const f = `public/img/prompts_arandano_${i}.json`;
  if (!fs.existsSync(f)) continue;
  for (const p of JSON.parse(fs.readFileSync(f, "utf8"))) if (p.ref) AVSET.add(p.name);
}
const VEND = (caps[caps.length - 1].endMs / 1000) + 1.5;

plan.sort((a, b) => a.t - b.t);
for (let i = 0; i < plan.length; i++) plan[i].dur = +(((i + 1 < plan.length ? plan[i + 1].t : VEND) - plan[i].t)).toFixed(2);
const brollTimes = plan.filter((b) => b.kind === "broll").map((b) => b.t).sort((a, z) => a - z);
const nextBroll = (t) => { for (const x of brollTimes) if (x > t + 0.1) return x; return VEND; };

const broll = [], comps = [], scrims = [], emphases = [];
let endcardT = null, bn = 0, cn = 0;
const stock = {};

for (const b of plan) {
  const start = +b.t.toFixed(2), dur = Math.max(0.6, b.dur);
  if (b.kind === "broll") {
    const i = bn++;
    const name = `rb${String(i).padStart(3, "0")}`;
    const abr = `abr${String(i).padStart(3, "0")}`;
    const bdur = +(nextBroll(start) - start).toFixed(2);
    // imagen fotorrealista generada (avatar/escena) si existe; si no, stock video.
    if (fs.existsSync(`public/img/${abr}.jpg`)) {
      broll.push({ name, src: `img/${abr}.jpg`, start, dur: bdur, img: true, av: AVSET.has(abr) });
    } else {
      stock[name] = b.query || "close up human eye macro";
      broll.push({ name, src: `broll/${name}.mp4`, start, dur: bdur });
    }
  } else if (b.kind === "scrim") {
    const word = (b.word || "").toUpperCase().trim();
    scrims.push({ start, dur: Math.min(dur, 2.6), word, accent: b.accent === "coral" ? "coral" : "teal" });
  } else if (b.kind === "emphasis") {
    emphases.push({ from: start, to: +(start + Math.min(dur, 3.0)).toFixed(2), text: b.text || "" });
  } else if (b.kind === "endcard") {
    endcardT = start;
  } else {
    const c = { id: `c${cn++}`, kind: b.kind, start, dur, ...b };
    delete c.t; delete c._seg; delete c._fill; delete c.at;
    comps.push(c);
  }
}
if (endcardT == null) endcardT = VEND - 5;

// ── CLUSTER → ScrollDoc (explicaciones técnicas consecutivas = un lienzo continuo) ──
const capsText = (t, win = 2.8, maxWords = 15) => {
  const w = [];
  for (const c of caps) { const s = (c.startMs || 0) / 1000; if (s < t - 0.15) continue; if (s > t + win) break; w.push(c.text); if (w.length >= maxWords) break; }
  return w.join(" ").replace(/\s+/g, " ").trim();
};
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const brollAt = (t) => { let best = broll[0]; for (const b of broll) { if (b.start <= t + 0.01) best = b; else break; } return best ? best.src : undefined; };
const asPanelMedia = (src) => (/\.(jpg|jpeg|png)$/i.test(src || "") ? { poster: src } : { media: src });
const EXPLAIN = new Set(["diagram", "pizarra"]);
const panelsOf = (c) => {
  const out = [];
  if (c.kind === "diagram") {
    out.push({ ...asPanelMedia(brollAt(c.start)), eyebrow: "Mecanismo", heading: c.title || "", body: capsText(c.start) });
  } else {
    const slide = (c.slides || [])[0] || {};
    const steps = slide.steps || slide.items || [];
    if (steps.length >= 2) {
      const per = Math.max(2.4, c.dur / steps.length);
      steps.slice(0, 4).forEach((s, k) => {
        const t = +(c.start + k * per).toFixed(2);
        const head = typeof s === "string" ? s : (s.title || s.text || "");
        out.push({ ...asPanelMedia(brollAt(t)), eyebrow: c.title, heading: head, body: capsText(t, Math.min(per, 3)) });
      });
    } else {
      out.push({ ...asPanelMedia(brollAt(c.start)), eyebrow: c.title, heading: (slide.heading || c.title || ""), body: capsText(c.start) });
    }
  }
  return out;
};
const clusters = []; let cur = null;
for (const c of comps) {
  if (EXPLAIN.has(c.kind) && c.start - (cur ? cur.end : -99) < 8) {
    if (cur) { cur.items.push(c); cur.end = c.start + c.dur; }
    else { cur = { items: [c], start: c.start, end: c.start + c.dur }; clusters.push(cur); }
  } else if (EXPLAIN.has(c.kind)) { cur = { items: [c], start: c.start, end: c.start + c.dur }; clusters.push(cur); }
  else { cur = null; }
}
const boundStarts = [...comps.filter((c) => !EXPLAIN.has(c.kind)).map((c) => c.start), ...emphases.map((e) => e.from), VEND];
const consumed = new Set();
const scrollDocs = [];
for (const cl of clusters) {
  let panels = cl.items.flatMap(panelsOf).filter((p) => p.heading);
  panels = panels.filter((p, i) => i === 0 || norm(p.heading).slice(0, 16) !== norm(panels[i - 1].heading).slice(0, 16));
  if (panels.length > 7) panels = panels.slice(0, 7);
  if (panels.length < 2) continue;
  const nextB = Math.min(...boundStarts.filter((x) => x > cl.start + 0.5));
  const room = nextB - cl.start - 0.3;
  if (room < panels.length * 2.6) continue;
  const dur = Math.min(panels.length * 4.8, room);
  cl.items.forEach((it) => consumed.add(it));
  scrollDocs.push({ id: `sd${scrollDocs.length}`, kind: "scrolldoc", start: cl.start, dur: +dur.toFixed(2), panels });
}
const comps2 = comps.filter((c) => !consumed.has(c)).concat(scrollDocs).sort((a, b) => a.start - b.start);
comps.length = 0; comps.push(...comps2);

// overlays (scrim/emphasis) no deben pisar un scrolldoc fullscreen
const inSD = (t) => scrollDocs.some((s) => t >= s.start - 0.15 && t < s.start + s.dur - 0.15);
{
  const s0 = scrims.length, e0 = emphases.length;
  for (let i = scrims.length - 1; i >= 0; i--) if (inSD(scrims[i].start)) scrims.splice(i, 1);
  for (let i = emphases.length - 1; i >= 0; i--) if (inSD(emphases[i].from)) emphases.splice(i, 1);
  console.log(`overlays filtrados por scrolldoc: scrims ${s0}→${scrims.length} · emphasis ${e0}→${emphases.length}`);
}

// ── escribir TS ───────────────────────────────────────────────────────────────
const wr = (f, name, val, type = "any[]") =>
  fs.writeFileSync(`src/VideoEdit/${f}`, `// AUTO-GENERADO por gen_arandano.mjs\nexport const ${name}: ${type} = ${JSON.stringify(val)};\n`);
wr("arandano_broll.ts", "ARAND_BROLL", broll, "{name:string;src:string;start:number;dur:number;img?:boolean;av?:boolean}[]");
wr("arandano_beats.ts", "ARAND_COMPS", comps);
fs.writeFileSync("src/VideoEdit/arandano_hooks.ts",
  `// AUTO-GENERADO por gen_arandano.mjs — overlays del video Arándano/Ojos.\n` +
  `export const ARAND_SCRIMS: {start:number;dur:number;word:string;accent:string}[] = ${JSON.stringify(scrims)};\n` +
  `export const ARAND_EMPH: {from:number;to:number;text:string}[] = ${JSON.stringify(emphases)};\n` +
  `export const ARAND_ENDCARD = ${endcardT.toFixed(2)};\n` +
  `export const ARAND_END = ${VEND.toFixed(2)};\n`);

fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync("public/broll/stock_arandano.json", JSON.stringify(stock, null, 1));

const kinds = {}; comps.forEach((c) => kinds[c.kind] = (kinds[c.kind] || 0) + 1);
console.log(`b-roll: ${broll.length} · componentes: ${comps.length} · scrims: ${scrims.length} · emphasis: ${emphases.length} · endcard @${endcardT.toFixed(0)}s`);
console.log("comp kinds:", JSON.stringify(kinds));
console.log(`stock a bajar: ${Object.keys(stock).length} · dur ${VEND.toFixed(0)}s`);
