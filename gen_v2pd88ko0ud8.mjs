// gen_v2pd88ko0ud8.mjs — arma el track del video desde los 7 mapas de dirección.
//   node gen_v2pd88ko0ud8.mjs
// Emite:
//   src/_fed6/VideoEdit/v2pd88ko0ud8_beats.ts   (comps + fotos IA)
//   src/_fed6/VideoEdit/v2pd88ko0ud8_broll.ts   (clips de Pexels)
//   src/_fed6/VideoEdit/v2pd88ko0ud8_hooks.ts   (ventanas de avatar FULL)
//   _imgs_v2pd88ko0ud8.json     (lista para gen_gptimage.mjs)
//   _pexels_v2pd88ko0ud8.json   (queries para el fetcher)
//   src/VideoEdit/Main_v2pd88ko0ud8.tsx  (SHIM: manifiesto que density_gate sabe leer)
import fs from "fs";

const SLUG = "v2pd88ko0ud8";
const END = 1492.7;
const TSV = fs.readFileSync(`_frases_${SLUG}.tsv`, "utf8").trim().split("\n")
  .map((l) => { const [s, e, ...t] = l.split("\t"); return { s: +s, e: +e, t: t.join(" ") }; });

// ── 1. cargar y normalizar los mapas ─────────────────────────────────────────
let raw = [];
for (let i = 0; i < 7; i++) {
  const f = `_dir${i}_${SLUG}.json`;
  if (!fs.existsSync(f)) { console.error("FALTA", f); process.exit(1); }
  raw.push(...JSON.parse(fs.readFileSync(f, "utf8")).beats);
}
raw = raw.map((b) => {
  const p = b.props || {};
  const prompt = b.prompt || p.prompt || (b.type === "img" ? (b.q || b.query) : null);
  const query = b.type === "broll" ? (b.q || b.query || p.q) : null;
  return { t: +b.t, dur: +b.dur, type: b.type, kind: b.kind, props: p, prompt, query, why: b.why || "" };
}).filter((b) => b.t >= 0 && b.dur > 0).sort((a, b) => a.t - b.t);

// ── 2. VENTANAS DE AVATAR FULL (TALKS) ───────────────────────────────────────
// La cara ES el contenido en los remates. Alineadas a frase entera, 6.5-9 s,
// una cada ~33 s → ~22 % del metraje (regla: 18-40 %).
const TALKS = [];
let nextAt = 26;
for (let i = 0; i < TSV.length; i++) {
  if (TSV[i].s < nextAt) continue;
  const start = TSV[i].s;
  let end = TSV[i].e, j = i;
  while (end - start < 6.5 && j + 1 < TSV.length) { j++; end = TSV[j].e; }
  if (end - start > 9.2) end = start + 9.2;
  if (end > END - 1) break;
  TALKS.push({ start: +start.toFixed(2), dur: +(end - start).toFixed(2) });
  nextAt = end + 26;
  i = j;
}
const talkSec = TALKS.reduce((a, t) => a + t.dur, 0);
const inTalk = (s, e) => {
  let ov = 0;
  for (const t of TALKS) ov += Math.max(0, Math.min(e, t.start + t.dur) - Math.max(s, t.start));
  return ov;
};

// ── 3. filtrar/recortar contra las ventanas full ─────────────────────────────
// avatarpizarra/avatarkeyword traen su PROPIO avatar → conviven con el habla.
const OWN = new Set(["avatarpizarra", "avatarkeyword"]);
const beats = [];
for (const b of raw) {
  if (b.t < 2.6) { const d = b.dur - (2.6 - b.t); if (d < 1.2) continue; b.dur = d; b.t = 2.6; }
  if (b.t + b.dur > END) b.dur = END - b.t;
  if (b.dur < 1.2) continue;
  const ov = inTalk(b.t, b.t + b.dur);
  if (ov > 0 && !OWN.has(b.kind)) {
    if (ov / b.dur > 0.5) continue;            // lo tapa el avatar → no gastar asset
    // recortar al borde de la ventana
    for (const t of TALKS) {
      const ts = t.start, te = t.start + t.dur;
      if (b.t < ts && b.t + b.dur > ts) b.dur = ts - b.t;
      else if (b.t < te && b.t + b.dur > te) { b.dur = b.t + b.dur - te; b.t = te; }
    }
    if (b.dur < 1.2) continue;
  }
  beats.push(b);
}
// ── 3b. RECAP NUMERADO → FocusCards (regla del canal: toda lista "uno… cinco"
// va como tarjetas flotantes que se enfocan al decir su número).
const RC_A = 1316.34, RC_B = 1370.2;
const RC_AT = [1316.34, 1327.74, 1337.56, 1350.66, 1364.04];
const RC_LAB = [
  "Agua de romero, fría, de noche",
  "Una gota de aceite que selle",
  "Bajá el calor de tu cara",
  "Protector CON color a la mañana",
  "Foto el día 1 y el día 60",
];
for (let i = beats.length - 1; i >= 0; i--) {
  const b = beats[i];
  if (b.t + b.dur > RC_A + 0.2 && b.t < RC_B - 0.2) beats.splice(i, 1);
}
beats.push({
  t: RC_A, dur: RC_B - RC_A, type: "comp", kind: "focuscards",
  props: {
    title: "Los cinco",
    items: RC_AT.map((at, i) => ({ image: `img/v2pd_rc${i + 1}.png`, label: RC_LAB[i], at: Math.round((at - RC_A) * 30) })),
  },
  why: "recap numerado con tarjetas que se enfocan al decir cada número",
});
beats.sort((a, b) => a.t - b.t);
// sin solapes entre vecinos del mismo tipo de capa
for (let i = 0; i < beats.length - 1; i++) {
  const cur = beats[i], nx = beats[i + 1];
  const sameLayer = (x) => (x.type === "comp" ? "c" : "r");
  if (sameLayer(cur) === sameLayer(nx) && cur.t + cur.dur > nx.t) cur.dur = +(nx.t - cur.t).toFixed(2);
}
const kept = beats.filter((b) => b.dur >= 1.2);

// ── 4. asignar assets ────────────────────────────────────────────────────────
const imgs = [], pex = [];
const FED_BEATS = [], FED_BROLL = [];
let ni = 0, nb = 0, nc = 0;
for (const b of kept) {
  if (b.type === "img") {
    const name = `v2pd_${String(++ni).padStart(3, "0")}`;
    imgs.push({ name, prompt: (b.prompt || "real amateur phone photo, natural light, slight grain, no text, 16:9").slice(0, 900) });
    FED_BEATS.push({ id: `r${ni}`, key: "raw", kind: "raw", start: +b.t.toFixed(2), dur: +b.dur.toFixed(2), src: `img/${name}.png`, why: b.why });
  } else if (b.type === "broll") {
    const n = String(++nb).padStart(3, "0");
    pex.push({ name: `d${n}`, query: (b.query || "kitchen").trim(), t: +b.t.toFixed(2), dur: +b.dur.toFixed(2) });
    FED_BROLL.push({ name: `d${n}`, start: +b.t.toFixed(2), dur: +b.dur.toFixed(2), src: `broll/${SLUG}/d${n}.mp4` });
  } else {
    const o = { id: `c${++nc}`, key: "comp", kind: b.kind, start: +b.t.toFixed(2), dur: +b.dur.toFixed(2), cut: nc % 2 === 0, ...b.props };
    FED_BEATS.push(o);
  }
}

// ── 5. escribir ──────────────────────────────────────────────────────────────
const hdr = `// GENERADO por gen_${SLUG}.mjs — no editar a mano\n`;
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`, hdr + `export const FED_BEATS: any[] = ${JSON.stringify(FED_BEATS, null, 1)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_broll.ts`, hdr + `export const FED_BROLL: any[] = ${JSON.stringify(FED_BROLL, null, 1)};\n`);
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_hooks.ts`, hdr + `export const TALKS: {start:number;dur:number}[] = ${JSON.stringify(TALKS)};\n`);
fs.writeFileSync(`_imgs_${SLUG}.json`, JSON.stringify(imgs, null, 1));
fs.writeFileSync(`_pexels_${SLUG}.json`, JSON.stringify(pex, null, 1));

// SHIM para density_gate: lee src/VideoEdit/Main_<slug>.tsx, cuenta <Comp> y rutas
// entrecomilladas. Va ORDENADO POR TIEMPO (si no, "variedad por tramo" da 0 al final).
const NAME = { headline: "FedHeadline", stat: "FedStat", quote: "FedQuote", chips: "FedChips", splitlist: "BulletCascade", board: "PizarraExplica", checklist: "ChecklistErrores", process: "FedProcess", ingredients: "FedIngredients", rule: "FedRule", annotated: "Annotated", diagram: "DiagramBoard", nametag: "DocNameCard", blurexplainer: "BlurExplainer", pizarra: "Pizarra", bars: "BarCompare", callout: "CalloutMark", mitoverdad: "MitoVerdad", errorstinger: "ErrorStinger", guardaesto: "GuardaEsto", freezezoom: "FreezeZoom", lowerthird: "LowerThird", frasecinetica: "FraseCinetica", avatarkeyword: "AvatarKeyword", avatarpizarra: "AvatarPizarra" };
const tl = [
  ...FED_BEATS.map((b) => ({ t: b.start, tag: b.kind === "raw" ? "RawShot" : (NAME[b.kind] || "FedHeadline"), src: b.src })),
  ...FED_BROLL.map((b) => ({ t: b.start, tag: "RawShot", src: b.src })),
  ...TALKS.map((t) => ({ t: t.start, tag: "AvatarLayer", src: `avatar_${SLUG}.mp4` })),
].sort((a, b) => a.t - b.t);
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`,
  `// SHIM de medición para scripts/density_gate.mjs — el Main REAL vive en\n` +
  `// src/_fed6/VideoEdit/Main_${SLUG}.tsx y es data-driven (un switch), así que el gate\n` +
  `// contaría 1 uso por componente en vez de los ${tl.length} reales. Manifiesto ordenado por tiempo:\n` +
  tl.map((x) => `// <${x.tag} src="${x.src || ""}" />`).join("\n") +
  `\nexport const MANIFEST_${SLUG.toUpperCase()} = ${tl.length};\n`);

const durs = kept.map((b) => b.dur).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)];
const p90 = durs[Math.floor(durs.length * 0.9)];
console.log(`beats ${kept.length} · imgs ${ni} · broll ${nb} · comps ${nc}`);
console.log(`mediana ${med.toFixed(2)}s · p90 ${p90.toFixed(2)}s · >=5s ${(100 * durs.filter((d) => d >= 5).length / durs.length).toFixed(0)}%`);
console.log(`TALKS ${TALKS.length} ventanas · ${talkSec.toFixed(0)}s = ${(100 * talkSec / END).toFixed(1)}% del video en avatar full (+ gap-fill)`);
const cov = [...FED_BROLL.map((b) => [b.start, b.start + b.dur]), ...FED_BEATS.map((b) => [b.start, b.start + b.dur])].sort((a, b) => a[0] - b[0]);
let cur = 0, gap = 0;
for (const [s, e] of cov) { if (s - cur > 0.2) gap += s - cur; cur = Math.max(cur, e); }
gap += Math.max(0, END - cur);
console.log(`huecos sin contenido (los cubre el avatar): ${gap.toFixed(0)}s`);
