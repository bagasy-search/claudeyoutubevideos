// gen_v0w7c4w70kfg.mjs — DIRECTOR + montaje: convierte las captions de Whisper +
// _dir/anchors_all.json en src/VideoEdit/cues_v0w7c4w70kfg.gen.tsx (lo que lee el render).
//
// Reglas del canal aplicadas acá:
//  · avatar FULL o visual FULL, nunca PiP/split → los cues tapan la pantalla, los huecos son avatar
//  · el video ABRE con avatar full (primer cue recién a los ~3.6s)
//  · cada corte cae en un LÍMITE DE FRASE de Whisper (sync milimétrico)
//  · ningún clip ni imagen se repite (pool global de una sola pasada)
//  · ritmo VARIADO: mediana 3,5-4,5s y ~1 de cada 5 tomas ≥5s (no todo igual de largo)
//  · la mitad de los cortes va SECO; la otra rota entre whip/lift/iris/fold
import fs from "fs";

const SLUG = "v0w7c4w70kfg";
const FPS = 30;
const W = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));

/* ─────────────────────────── frases (sync milimétrico) ─────────────────── */
const SENTS = [];
{
  const MINB = 1.9, MAXB = 3.0;
  let cur = null;
  for (const w of W) {
    if (!cur) cur = { s: w.startMs / 1000, e: w.endMs / 1000, txt: "" };
    cur.txt += w.text;
    cur.e = w.endMs / 1000;
    const len = cur.e - cur.s;
    const punct = /[.?!:;,]["»]?$/.test(w.text.trim());
    if ((len >= MINB && punct) || len >= MAXB) { SENTS.push(cur); cur = null; }
  }
  if (cur) SENTS.push(cur);
}
const END = SENTS[SENTS.length - 1].e;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/* ─────────────────────────────── assets ────────────────────────────────── */
const IMGDIR = `public/img/${SLUG}`;
const EXT = {};
for (const f of fs.readdirSync(IMGDIR)) {
  const m = f.match(/^(.+)\.(png|jpg|jpeg|webp)$/i);
  if (m && fs.statSync(`${IMGDIR}/${f}`).size > 10000) EXT[m[1]] = m[2].toLowerCase();
}
const IMGS = Object.keys(EXT);
const CLIPDIR = `public/broll/${SLUG}`;
const CLIPS = fs.existsSync(CLIPDIR)
  ? fs.readdirSync(CLIPDIR).filter((f) => f.endsWith(".mp4") && fs.statSync(`${CLIPDIR}/${f}`).size > 20000).map((f) => f.replace(/\.mp4$/, ""))
  : [];
const FETCHED = fs.existsSync("_dir/_fetched.json") ? JSON.parse(fs.readFileSync("_dir/_fetched.json", "utf8")) : {};

const usedImg = new Set(), usedClip = new Set();
const img = (n) => `staticFile('img/${SLUG}/${n}.${EXT[n] || "png"}')`;
const clip = (n) => `staticFile('broll/${SLUG}/${n}.mp4')`;

/* ── secciones: pools temáticos por tiempo (prefijos de imagen + secciones de clip) ── */
const SECTIONS = [
  { at: 0,      ip: ["hk_", "ol_"],          cs: ["hook"] },
  { at: 135,    ip: ["dr_", "hk_"],          cs: ["hook"] },
  { at: 208,    ip: ["pe_", "fi_"],          cs: ["fisica"] },
  { at: 300,    ip: ["fi_"],                 cs: ["fisica"] },
  { at: 415,    ip: ["fi_", "ac_"],          cs: ["fisica"] },
  { at: 470,    ip: ["pe_"],                 cs: ["peroxido"] },
  { at: 540,    ip: ["ti_", "ol_"],          cs: ["peroxido"] },
  { at: 600,    ip: ["ac_"],                 cs: ["aceite", "peroxido"] },
  { at: 700,    ip: ["ac_", "ci_"],          cs: ["aceite"] },
  { at: 800,    ip: ["ac_", "ci_"],          cs: ["aceite", "emilio"] },
  { at: 855,    ip: ["em_"],                 cs: ["emilio"] },
  { at: 900,    ip: ["li_"],                 cs: ["emilio"] },
  { at: 1000,   ip: ["re_", "em_"],          cs: ["emilio", "cobre"] },
  { at: 1060,   ip: ["em_", "co_"],          cs: ["cobre"] },
  { at: 1180,   ip: ["co_", "al_"],          cs: ["cobre"] },
  { at: 1245,   ip: ["al_"],                 cs: ["cierre", "cobre"] },
  { at: 1285,   ip: ["re_"],                 cs: ["cierre"] },
  { at: 1400,   ip: ["ol_", "re_"],          cs: ["cierre"] },
];
const secAt = (t) => { let s = SECTIONS[0]; for (const x of SECTIONS) if (t >= x.at) s = x; return s; };

const nextImg = (sec) => {
  for (const p of sec.ip) { const c = IMGS.find((n) => n.startsWith(p) && !usedImg.has(n)); if (c) { usedImg.add(c); return c; } }
  const c = IMGS.find((n) => !usedImg.has(n)); if (c) { usedImg.add(c); return c; } return null;
};
const nextClip = (sec) => {
  for (const s of sec.cs) {
    const c = CLIPS.find((n) => !usedClip.has(n) && FETCHED[n] && FETCHED[n].sec === s);
    if (c) { usedClip.add(c); return c; }
  }
  const c = CLIPS.find((n) => !usedClip.has(n)); if (c) { usedClip.add(c); return c; } return null;
};

/* ── tratamiento del corte ────────────────────────────────────────────────
 * El creador: "usás siempre la misma transición y cansa; a veces simplemente
 * es sin transición". Entonces: la mitad SECO, la otra rotando las 4 variantes.
 * El corte seco se logra en el Main: la escena se monta con su shell YA
 * asentado (Sequence from={-WHIP} + totalF más largo). Entra y sale seca. */
const WHIP = 12;
const VARIANTES = ["whip", "lift", "iris", "fold"];
const PATRON_TOMA = [null, null, 0, null, 1, null, 2, null];
let vi = 0;
const nextVar = () => VARIANTES[(vi = (vi + 1) % VARIANTES.length)];

/* ─────────────────────── anclas: escenas del kit ───────────────────────── */
const F = (d) => Math.round(d * FPS);
const RAWA = JSON.parse(fs.readFileSync("_dir/anchors_all.json", "utf8"));

// resuelve IMG:nombre → staticFile(...). Si la imagen no existe en disco, cae a
// la más cercana del mismo prefijo (evita el 404 que mata el chunk entero).
const missing = [];
const resolveImgs = (jsx) =>
  jsx.replace(/IMG:([a-z0-9_]+)/gi, (_m, name) => {
    if (EXT[name]) { usedImg.add(name); return img(name); }
    const pref = name.slice(0, 3);
    const alt = IMGS.find((n) => n.startsWith(pref) && !usedImg.has(n)) || IMGS.find((n) => n.startsWith(pref)) || IMGS[0];
    missing.push(`${name} -> ${alt}`);
    if (alt) usedImg.add(alt);
    return alt ? img(alt) : "undefined";
  });

const A = RAWA.map((a) => ({ phrase: norm(a.phrase), dur: a.dur, jsx: resolveImgs(a.jsx) }));

/* ─── ubicar cada ancla en el STREAM DE PALABRAS y llevarlo al beat que lo contiene ── */
const TOK = [], TOKMS = [];
for (const w of W) { const n = norm(w.text); if (n) for (const t of n.split(" ")) { TOK.push(t); TOKMS.push(w.startMs / 1000); } }
const TOKSTR = " " + TOK.join(" ") + " ";
const beatOfSec = (t) => { let k = 0; for (let i = 0; i < SENTS.length; i++) if (SENTS[i].s <= t + 0.001) k = i; return k; };
const findSec = (phrase) => {
  const at = TOKSTR.indexOf(" " + phrase + " ");
  if (at < 0) return null;
  const pre = TOKSTR.slice(1, at + 1).trim();
  const idx = pre ? pre.split(" ").length : 0;
  return TOKMS[Math.min(idx, TOKMS.length - 1)];
};
const anchorAt = new Map();
let lastEnd = -1, skipped = 0;
const placed = [];
for (const a of A) {
  const sec = findSec(a.phrase);
  if (sec == null) { console.warn("ancla sin frase:", a.phrase.slice(0, 40)); skipped++; continue; }
  placed.push({ ...a, sec });
}
placed.sort((x, y) => x.sec - y.sec);
for (const a of placed) {
  // el solape se mide con la duración REAL que va a tener la escena (ya acotada),
  // no con la que pidió el director: con la vieja se descartaban 13 anclas de más.
  const esFocusA = /FedFocusCards/.test(a.jsx);
  const esGrandeA = /FedPaper|FedOilBars|FedTrial|FedB6Trap|FedLabRange|FedCohort/.test(a.jsx);
  const durReal = esFocusA ? a.dur : Math.min(a.dur, esGrandeA ? 8.5 : 4.4);
  if (a.sec < lastEnd - 0.2) { skipped++; continue; }        // se pisaba con la anterior
  const bi = beatOfSec(a.sec);
  if (anchorAt.has(bi)) { skipped++; continue; }
  anchorAt.set(bi, a);
  lastEnd = a.sec + durReal;
}

/* ────────────────────────────── montaje ────────────────────────────────── */
const AVATAR_OPEN = 3.6;   // el video ABRE con avatar full (frames 0-108)
const RUN_TARGET = 17;     // seg de visual entre ventana y ventana de avatar
const WIN_MIN = 7.0;       // largo mínimo de cada ventana de avatar (5-8s, no 2s)

const vestir = (nodeStr, treat) => {
  if (!/totalF=\{/.test(nodeStr)) return { node: nodeStr, cut: false };
  if (treat === null) return { node: nodeStr.replace(/totalF=\{(\d+)\}/, (_m, n) => `totalF={${+n + 2 * WHIP}}`), cut: true };
  return { node: nodeStr.replace(/^<([A-Za-z0-9]+)/, (_m, c) => `<${c} variant="${treat}"`), cut: false };
};

// RITMO VARIADO: la toma agrupa 1 o 2 beats según un patrón, para que la mediana
// caiga en 3,5-4,5s y ~1 de cada 5 pase de 5s. Antes salía todo de 3,00s exactos
// y el creador lo describió como "cambia una por segundo, cansa".
const PATRON_LARGO = [2, 1, 2, 2, 1, 2, 1, 2, 2, 1];
let pl = 0;

const raw = [];
let i = 0;
while (i < SENTS.length && SENTS[i].s < AVATAR_OPEN) i++;
const nextAnchorIdx = (from) => { for (let k = from; k < SENTS.length; k++) if (anchorAt.has(k)) return k; return SENTS.length; };

while (i < SENTS.length) {
  const a = anchorAt.get(i);
  if (a) {
    const start = SENTS[i].s;
    // TOPE por escena: sin esto los componentes (5-11s) dominaban la mediana y daba
    // 6,1s, lejos del ritmo pedido (3,5-4,5s). FedFocusCards se exceptúa: su
    // animación de enfoque necesita el tramo completo o se ve sólo el primer trazo.
    // Escenas GRANDES (un paper, una comparativa de barras, un remache): tienen
    // animación propia y necesitan su tramo. El resto son escenas de densidad y
    // van cortas, para que la mediana caiga en los 3,5-4,5s que pide el canal.
    const esFocus = /FedFocusCards/.test(a.jsx);
    const esGrande = /FedPaper|FedOilBars|FedTrial|FedB6Trap|FedLabRange|FedCohort/.test(a.jsx);
    const objetivo = esFocus ? a.dur : Math.min(a.dur, esGrande ? 8.5 : 4.4);
    // Se corta en el límite de frase MÁS CERCANO al objetivo, no en el primero que
    // lo supera: los beats de Whisper son de ~2,8s, así que "el primero que pasa"
    // siempre redondeaba para arriba (objetivo 3,6 → escena de 5,6) y los
    // componentes se comían el metraje entero (163 escenas, sólo 45 clips en pantalla).
    let j = i, acc = 0, mejor = null;
    while (j < SENTS.length) {
      acc = SENTS[j].e - start;
      j++;
      if (mejor === null || Math.abs(acc - objetivo) < Math.abs(mejor.acc - objetivo)) mejor = { acc, j };
      if (acc > objetivo * 1.6) break;
    }
    const dur = mejor ? mejor.acc : objetivo;
    j = mejor ? mejor.j : i + 1;
    const treatC = (raw.filter((x) => x.tag === "comp").length % 4 === 3) ? null : nextVar();
    const vc = vestir(a.jsx.replace(/\{D\}/g, `{${F(dur)}}`), treatC);
    raw.push({ start, dur, node: vc.node, cut: vc.cut, tag: "comp" });
    i = j; continue;
  }
  const stop = nextAnchorIdx(i);
  const start = SENTS[i].s;
  const want = PATRON_LARGO[pl++ % PATRON_LARGO.length];
  const j = Math.min(i + want, stop, SENTS.length);
  if (j <= i) { i++; continue; }
  const dur = SENTS[j - 1].e - start;
  if (dur < 1.0) { i = j; continue; }
  raw.push({ start, dur, tag: "shot", sec: secAt(start) });
  i = j;
}

// VENTANAS DE AVATAR: se abren SACANDO tomas (nunca componentes) cada RUN_TARGET seg.
// Al sacarlas, el hueco lo llena el avatar full (el Main lo tiene persistente abajo).
const keep = [];
let since = 0, cutting = false, cutAcc = 0, avatarSec = AVATAR_OPEN;
for (const c of raw) {
  if (cutting) {
    if (c.tag === "shot" && cutAcc < WIN_MIN) { cutAcc += c.dur; avatarSec += c.dur; continue; }
    cutting = false; since = 0; cutAcc = 0;
  }
  if (since >= RUN_TARGET && c.tag === "shot") { cutting = true; cutAcc = c.dur; avatarSec += c.dur; continue; }
  keep.push(c); since += c.dur;
}

// recién ahora se consumen los assets (así ninguno se "gasta" en una toma borrada)
const cues = [];
for (const c of keep) {
  if (c.tag === "comp") { cues.push(c); continue; }
  const k = cues.length;
  const cl = (k % 3 !== 2) ? nextClip(c.sec) : null;
  let node;
  if (cl) {
    node = `<FedFullShot totalF={${F(c.dur)}} src={${clip(cl)}} video ken="${["in", "left", "out", "right"][k % 4]}" accent={ACC} mood="${["warmdark", "cool", "science", "gold"][k % 4]}" />`;
  } else {
    const im = nextImg(c.sec);
    if (im) node = `<FedFullShot totalF={${F(c.dur)}} src={${img(im)}} ken="${["in", "out", "left", "in"][k % 4]}" accent={ACC} mood="${["warmdark", "gold", "cool", "science"][k % 4]}" />`;
    else { const cl2 = nextClip(c.sec); if (!cl2) { avatarSec += c.dur; continue; } node = `<FedFullShot totalF={${F(c.dur)}} src={${clip(cl2)}} video ken="in" accent={ACC} mood="warmdark" />`; }
  }
  const pt = PATRON_TOMA[k % PATRON_TOMA.length];
  const v = vestir(node, pt === null ? null : VARIANTES[pt]);
  cues.push({ ...c, node: v.node, cut: v.cut });
}

/* ───────────────────────────── salida .tsx ─────────────────────────────── */
// Los 5 puntos del recap: MISMO array en las 6 instancias de FedFocusCards
// (una con focus -1 y una por número). Las imágenes tienen que existir.
const pick = (n, pref) => (EXT[n] ? n : IMGS.find((x) => x.startsWith(pref)) || IMGS[0]);
const RECAP5 = `[
  {n:1,label:'La prueba del papel negro',sub:'Un pelo blanco, hoja oscura atrás, la cámara del celular',image:${img(pick("re_papel_negro", "re_"))}},
  {n:2,label:'El aceite tibio, 2 veces por semana',sub:'De raíz a punta, 40 minutos. Coco, romero y pigmento suave',image:${img(pick("re_aceite_tibio", "ac_"))}},
  {n:3,label:'Tres minutos de masaje',sub:'Con la yema, nunca con la uña. Hasta sentir calorcito',image:${img(pick("re_masaje_yema", "ci_"))}},
  {n:4,label:'Cobre en el plato',sub:'Hígado, sésamo, nueces, cacao amargo. Es comida, no suplemento',image:${img(pick("re_cobre_plato", "co_"))}},
  {n:5,label:'Revisá el frasco de la mesita',sub:'Zinc solo, en dosis alta, por años. Esa charla es con tu médico',image:${img(pick("re_frasco_mesita", "co_"))}}
]`;

const body = cues.map((c) => `  {start: ${c.start.toFixed(2)}, dur: ${c.dur.toFixed(2)}${c.cut ? ", cut: true" : ""}, node: (\n    ${c.node}\n  )},`).join("\n");

// MANIFIESTO para density_gate: el gate lee el JSX y cuenta 1 uso por componente
// (acá cada uno se instancia decenas de veces vía este array). Va ORDENADO POR
// TIEMPO: sin ordenar, la "variedad por tramo" da 0 en los últimos bloques.
const manifest = cues.map((c) => {
  const tag = (c.node.match(/^<([A-Za-z0-9]+)/) || [])[1] || "FedFullShot";
  const src = (c.node.match(/staticFile\('([^']+)'\)/) || [])[1] || "";
  return `  <${tag}/> ${c.start.toFixed(1)}s ${src ? `"${src}"` : ""}`;
}).join("\n");

// IMPORTS: sólo los componentes REALMENTE instanciados. Importar de más deja
// warnings TS6133 ("declarado pero nunca usado") que ensucian el typecheck del farm.
const usados = new Set(cues.map((c) => (c.node.match(/^<([A-Za-z0-9]+)/) || [])[1]).filter(Boolean));
const DEL_KIT = ["FedBeforeAfter","FedChapter","FedChecklist","FedCta","FedFullShot","FedHero","FedLowerThird","FedMolecule","FedQuote","FedStat","FedStep"];
const DEL_FLUID = ["FedBlacklist","FedBrickWall","FedCohort","FedLabelScan","FedOilBars","FedPaper","FedRivet","FedRoutineRing","FedSeal","FedSplitFace","FedTrial"];
const DEL_VUCM = ["FedB6Trap","FedFocusCards","FedLabRange","FedTwoPaths"];
const impKit = DEL_KIT.filter((n) => usados.has(n)).map((n) => n + ", ").join("");
const fl = DEL_FLUID.filter((n) => usados.has(n));
const vu = DEL_VUCM.filter((n) => usados.has(n));
const impFluid = fl.length ? `import {${fl.join(", ")}} from '../scenes/federer-fluid';
` : "";
const impVucm = vu.length ? `import {${vu.join(", ")}} from '../scenes/vucm3bvd869j';
` : "";

const out = `/* GENERADO por scripts/gen_${SLUG}.mjs — NO editar a mano (se regenera).
 * ${cues.length} cues · ${IMGS.length} imágenes · ${CLIPS.length} clips disponibles
 * Cada corte cae en un límite de frase de Whisper. Los huecos = avatar FULL. */
import React from 'react';
import {staticFile} from 'remotion';
import {${impKit}TEAL, COOL_BLUE} from '../FedererKit';
${impFluid}${impVucm}

const ACC = '#E9B44C';
const TEALC = TEAL;
const COOLC = COOL_BLUE;
const ALERT = '#D9705B';

const RECAP5 = ${RECAP5};

export type Cue = {start: number; dur: number; cut?: boolean; node: React.ReactNode};

export const CUES: Cue[] = [
${body}
];

export const TOTAL_${SLUG.toUpperCase()} = ${Math.max(END, 1454.72).toFixed(2)};
`;
fs.mkdirSync("src/VideoEdit", { recursive: true });
fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, out);
fs.writeFileSync(`src/VideoEdit/_manifest_${SLUG}.txt`, manifest);

const visual = cues.reduce((a, c) => a + c.dur, 0);
const durs = cues.map((c) => c.dur).sort((a, b) => a - b);
const med = durs[Math.floor(durs.length / 2)];
const p90 = durs[Math.floor(durs.length * 0.9)];
const largas = cues.filter((c) => c.dur >= 5).length;
console.log(`cues: ${cues.length}  ·  componentes: ${cues.filter((c) => c.tag === "comp").length}  ·  tomas: ${cues.filter((c) => c.tag === "shot").length}`);
console.log(`anclas colocadas ${anchorAt.size}/${RAWA.length} (descartadas ${skipped} por pisarse)`);
console.log(`imgs usadas ${usedImg.size}/${IMGS.length} · clips usados ${usedClip.size}/${CLIPS.length}`);
console.log(`visual ${visual.toFixed(0)}s / ${END.toFixed(0)}s  →  AVATAR FULL ${(100 - (100 * visual) / END).toFixed(0)}%`);
console.log(`ritmo: mediana ${med.toFixed(2)}s · p90 ${p90.toFixed(2)}s · ${((100 * largas) / cues.length).toFixed(0)}% de tomas >=5s`);
console.log(`cortes SECOS ${cues.filter((c) => c.cut).length}/${cues.length}`);
if (missing.length) console.log(`imgs faltantes remapeadas (${missing.length}): ${missing.slice(0, 6).join(", ")}`);
