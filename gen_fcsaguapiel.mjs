// gen_fcsaguapiel.mjs — beatsheet/fcsaguapiel.json · Canal "Federer Consejos Salud"
// "Mayores de 60: Agrega ESTO al Agua para Reafirmar la Piel y Borrar las Arrugas". Kit CLÍNICO _fed6.
//
// ⛔ AVATAR PARCIAL: el creador grabó 0..905.877s de un master de 3024.15s.
//    En la ZONA FISH los labios NO sincronizan → el avatar no puede quedar a la vista:
//    cada momento se cubre al 100% (clip + su foto de respaldo en la cola).
//    En la ZONA AVATAR sí se deja respirar al avatar en los huecos.
import fs from "fs";
import { spawnSync } from "child_process";
import { CMP } from "./_cmp_fcsaguapiel.mjs";

const SLUG = "fcsaguapiel";
const VIDEO_END = 3024.15;
const AVATAR_END = 905.877;
const HERO_CAP = 3.6;

const probeDur = (p) => {
  if (!fs.existsSync(p)) return 0;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((r.stdout || "").trim());
  return isFinite(d) ? d : 0;
};
const has = (p) => fs.existsSync("public/" + p);

// ── captions (anclaje por frase) ─────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
const findMs = (phrase, after = 0) => {
  const p = norm(phrase || "").split(" ").filter(Boolean).slice(0, 7);
  if (p.length < 2) return null;
  for (let i = 0; i <= CW.length - p.length; i++) {   // ⛔ <= : con < se pierde el ULTIMO componente
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};

const MOM = JSON.parse(fs.readFileSync(`_${SLUG}_moments.json`, "utf8"));
const DIR = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8").replace(/^﻿/, ""));
const ROUTE = new Map(DIR.map((d) => [d.name, d.route]));
const HEROMAP = JSON.parse(fs.readFileSync(`_${SLUG}_heromap.json`, "utf8"));
const DARK = new Set(JSON.parse(fs.existsSync(`_${SLUG}_dark.json`) ? fs.readFileSync(`_${SLUG}_dark.json`, "utf8") : "[]"));

const N = MOM.length;
const start = MOM.map((m) => m.ms);
const nextStart = (i) => (i + 1 < N ? start[i + 1] : VIDEO_END);

// LAMINAS explicativas (gpt-image-2 low, cero texto) ancladas al momento que EXPLICA eso.
// Tienen prioridad sobre la foto del momento: son el visual correcto para el mecanismo.
const LAMINA = {
  m141: "colchon", m147: "malla", m151: "fibro", m156: "caida",
  m178: "colador", m185: "escala", m190: "crema",
  m206: "digestion", m226: "fragmento", m233: "obra",
  m306: "glicina", m310: "noche",
  m405: "florecer", m423: "trenza", m427: "llave", m430: "escorbuto",
  m504: "sol", m519: "cigarro",
  m552: "glicacion", m557: "hamaca", m567: "tijeras", m569: "recambio",
};
// JPG > PNG: 626 fotos en PNG = 1.198 MB; las mismas en JPG = 46 MB (regla b-roll-en-JPG)
const jpg = (p) => p.replace(/\.png$/i, ".jpg");
const pick = (p) => (has(jpg(p)) ? jpg(p) : has(p) ? p : null);
const lamSrc = (n) => (LAMINA[n] ? pick(`img/lam_${SLUG}_${LAMINA[n]}.png`) : null);

// foto de un momento: lamina > hero mapeada > propia > respaldo del clip
const heroSrc = (n) => (HEROMAP[n] ? pick(`img/${SLUG}_${HEROMAP[n].toLowerCase()}.png`) : null);
const fotoDe = (n) => {
  const l = lamSrc(n); if (l) return l;
  const h = heroSrc(n); if (h) return h;
  return pick(`img/${SLUG}_${n}.png`) || pick(`img/${SLUG}_${n}_bk.png`);
};
const G = (n) => fotoDe(n) || `img/${SLUG}_${n}.png`;

// ── capa de contenido ────────────────────────────────────────────────────────
const beats = [], BROLL = [], COVER = [];
let nClip = 0, nFoto = 0, nHero = 0, nBk = 0, nCola = 0, nAvatar = 0;

for (let i = 0; i < N; i++) {
  const m = MOM[i];
  const st = start[i];
  const slot = +(nextStart(i) - st).toFixed(2);
  const route = ROUTE.get(m.n);
  // el clip de agnes MANDA; si no llego, el de stock (Pexels) cubre el movimiento
  const optA = `broll/opt/${SLUG}_${m.n}.mp4`, optS = `broll/opt/${SLUG}_${m.n}_st.mp4`;
  const clipA = has(optA) ? optA : `broll/${SLUG}_${m.n}.mp4`;
  const clipS = has(optS) ? optS : `broll/${SLUG}_${m.n}_st.mp4`;
  const clip = (has(optA) || has(`broll/${SLUG}_${m.n}.mp4`)) ? clipA : clipS;
  const zonaFish = st >= AVATAR_END;

  if (route === "clip" && has(clip) && !DARK.has(m.n) && !LAMINA[m.n]) {
    const real = probeDur("public/" + clip) || 4.04;
    const cov = +Math.max(0.8, Math.min(slot, real - 0.1)).toFixed(2);
    beats.push({ id: m.n, start: +st.toFixed(2), dur: slot, key: "s", kind: "raw", src: clip });
    BROLL.push({ name: m.n, src: clip, start: +st.toFixed(2), dur: slot, cov, query: m.text.slice(0, 70) });
    COVER.push({ start: +st.toFixed(2), cov, kind: "video", src: clip });
    nClip++;
    // COLA: lo que el clip no llena. En ZONA FISH es obligatorio.
    const resto = +(slot - cov).toFixed(2);
    if (resto > 0.25 && (zonaFish || resto < 1.6)) {
      const src = fotoDe(m.n);
      if (src) {
        const ts = +(st + cov).toFixed(2);
        const covT = +Math.min(resto, HERO_CAP + 2).toFixed(2);
        beats.push({ id: m.n + "_t", start: ts, dur: resto, cov: covT, key: "s", kind: "raw", src });
        COVER.push({ start: ts, cov: covT, kind: "photo", src });
        nCola++;
      }
    }
    continue;
  }

  // momentos "avatar solo": en la zona AVATAR se deja ver al presentador (sin asset)
  if (route === "avatar" && !zonaFish) { nAvatar++; continue; }

  const src = fotoDe(m.n);
  if (!src) { if (!zonaFish) { nAvatar++; continue; } else continue; }
  if (heroSrc(m.n) && src === heroSrc(m.n)) nHero++;
  else if (has(`img/${SLUG}_${m.n}.png`)) nFoto++; else nBk++;

  let cov = zonaFish ? Math.min(slot, 9) : Math.min(slot, HERO_CAP);
  if (!zonaFish && slot - cov > 0.05 && slot - cov < 1.6) cov = slot;   // sin micro-huecos
  cov = +cov.toFixed(2);
  // ⛔ el beat LLEVA su cov: si el Main la recalcula con otra formula quedan huecos de fondo
  beats.push({ id: m.n, start: +st.toFixed(2), dur: slot, cov, key: "s", kind: "raw", src });
  COVER.push({ start: +st.toFixed(2), cov, kind: "photo", src });
}

// ── COMPONENTES anclados a la FRASE real ─────────────────────────────────────
const capOfDur = { avatarpizarra: 9, mitoverdad: 6, bars: 6.5, splitlist: 9, checklist: 9, lowerthird: 6,
  frasecinetica: 5.5, nametag: 6, process: 9, callout: 6, diagram: 10, errorstinger: 2.4, guardaesto: 8,
  freezezoom: 4.5, pizarraexplica: 8.5, relojnoche: 11, whynight: 10, pricewar: 8, ingredientduo: 6.5,
  hourdial: 6, guidecta: 9, stat: 5, raisin: 9,
  malla: 11, carrusel: 13, recetaescena: 14, colador: 10, lineatiempo: 11, pliegue: 9 };

const TODOS = CMP(G);
const missing = [], cmpBeats = [];
for (let k = 0; k < TODOS.length; k++) {
  const spec = TODOS[k];
  const ms = findMs(spec.phrase, 0);
  if (ms == null) { missing.push(spec.phrase); continue; }
  const { phrase, ...rest } = spec;
  cmpBeats.push({ id: `cmp_${k}_${spec.kind}`, start: +ms.toFixed(2), dur: capOfDur[spec.kind] || 6, key: "s", ...rest });
}

const KIT_CLIPS = [];
for (const b of cmpBeats) {
  if (b.kind === "avatarpizarra") {
    let last = 0;
    b.items = (b.items || []).map((it) => {
      let atF = 0;
      if (it.atPhrase) { const ms = findMs(it.atPhrase, b.start - 1); if (ms != null) atF = Math.max(0, Math.round((ms - b.start) * 30)); }
      last = Math.max(last, atF);
      const { atPhrase, ...r } = it; return { ...r, at: atF };
    });
    if (last > 320 || last === 0) { b.items = b.items.map((it, i) => ({ ...it, at: i * 90 })); last = (b.items.length - 1) * 90; }
    b.dur = +(last / 30 + 4.2).toFixed(2);
    KIT_CLIPS.push({ name: b.id, start: +b.start.toFixed(2), dur: +(b.dur + 0.4).toFixed(2) });
  }
  if (b.kind === "mitoverdad" && b.flipPhrase) {
    const ms = findMs(b.flipPhrase, b.start - 1);
    const lastSafe = Math.round(b.dur * 30) - 26;
    let f = ms != null ? Math.round((ms - b.start) * 30) : Math.round(b.dur * 30 * 0.42);
    if (f < 8 || f > lastSafe) f = Math.round(b.dur * 30 * 0.42);
    b.flipAt = f; delete b.flipPhrase;
  }
}
cmpBeats.sort((a, b) => a.start - b.start);
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify(KIT_CLIPS, null, 1));

const ALL = [...beats, ...cmpBeats].sort((a, b) => a.start - b.start || (a.kind === "raw" ? -1 : 1));
const U = SLUG.toUpperCase();
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const ${U}_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const ${U}_BROLL: { name: string; src: string; start: number; dur: number; cov: number; query: string }[] = ${JSON.stringify(BROLL)};\n` +
  `export const ${U}_COVER: { start: number; cov: number; kind: string; src: string }[] = ${JSON.stringify(COVER)};\n` +
  `export const AVATAR_END = ${AVATAR_END};\n` +
  `export const VIDEO_END = ${VIDEO_END};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

// ── QA ───────────────────────────────────────────────────────────────────────
const kinds = {}; cmpBeats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const need = new Set(); ALL.forEach((b) => { if (b.src) need.add(b.src); if (b.image) need.add(b.image); if (b.cover) need.add(b.cover); if (b.qr) need.add(b.qr); if (b.leftImage) need.add(b.leftImage); if (b.rightImage) need.add(b.rightImage); if (b.leftImg) need.add(b.leftImg); if (b.rightImg) need.add(b.rightImg); (b.slides || []).forEach((s) => s.image && need.add(s.image)); });
const miss = [...need].filter((p) => !has(p));
const cov = COVER.filter((c) => c.start + c.cov > AVATAR_END).map((c) => [Math.max(c.start, AVATAR_END), c.start + c.cov]).sort((a, b) => a[0] - b[0]);
let libre = 0, t = AVATAR_END;
for (const [s, e] of cov) { if (s > t) libre += s - t; t = Math.max(t, e); }
if (t < VIDEO_END) libre += VIDEO_END - t;
console.log(`beats ${ALL.length} (clips ${nClip} · colas ${nCola} · fotos ${nFoto} · hero ${nHero} · respaldos ${nBk} · avatar-solo ${nAvatar} · comp ${cmpBeats.length})`);
console.log(`componentes: ${Object.keys(kinds).length} kinds → ${Object.entries(kinds).map(([k, v]) => k + "×" + v).join(", ")}`);
console.log(`ZONA FISH sin cubrir: ${libre.toFixed(1)}s de ${(VIDEO_END - AVATAR_END).toFixed(0)}s (${(100 * libre / (VIDEO_END - AVATAR_END)).toFixed(1)}%)`);

// ── ⛔ COMPUERTA ANTI-HUECO ──────────────────────────────────────────────────
{
  const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
  const NOCAP = new Set(["avatarpizarra"]);
  const capOf = (k) => capOfDur[k] ?? 6;
  const compDur = (b) => {
    if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
    const nx = cmpBeats.filter((x) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a, c) => a.start - c.start)[0];
    const room = nx ? nx.start - b.start - 0.1 : b.dur;
    return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
  };
  const pts = [{ start: 0, mode: "full", pr: 0 }];
  let flip = false;
  for (const c of COVER) {
    const puedeSplit = c.kind === "video" && c.start + c.cov < AVATAR_END;
    pts.push({ start: c.start, mode: puedeSplit && flip ? "halfR" : "hidden", pr: 3 });
    if (puedeSplit) flip = !flip;
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  for (const b of cmpBeats) {
    if (OVERLAY.has(b.kind)) continue;
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + compDur(b)).toFixed(2), mode: "full", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr);
  const win = []; let last = "";
  for (const p of pts) if (p.mode !== last) { win.push({ start: p.start, mode: p.mode }); last = p.mode; }
  const post = win.filter((w) => w.start < 1.4 || w.start >= 7.0);
  post.push({ start: 0, mode: "full" }, { start: 1.4, mode: "hidden" });
  const res = win.filter((w) => w.start < 7.0).pop();
  post.push({ start: 7.0, mode: res && res.start >= 1.4 ? "hidden" : (res?.mode ?? "full") });
  post.sort((a, b) => a.start - b.start);
  const W = []; for (const x of post) if (!W.length || W[W.length - 1].mode !== x.mode) W.push(x);

  const cubre = (t) => COVER.some((c) => t >= c.start - 0.02 && t < c.start + c.cov)
    || cmpBeats.some((b) => !OVERLAY.has(b.kind) && t >= b.start && t < b.start + compDur(b));
  const modo = (t) => { let m = "full"; for (const w of W) { if (w.start <= t) m = w.mode; else break; } return m; };
  const huecos = [];
  for (let t = 0.2; t < VIDEO_END; t += 0.2) {
    if (t < 7.0) continue;
    if (modo(t) !== "full" && !cubre(t)) {
      const u = huecos[huecos.length - 1];
      if (u && t - u[1] < 0.35) u[1] = t; else huecos.push([t, t]);
    }
  }
  const grandes = huecos.filter((h) => h[1] - h[0] >= 0.3);
  const totalH = huecos.reduce((a, h) => a + (h[1] - h[0] + 0.2), 0);
  console.log(`ANTI-HUECO: ${huecos.length} huecos (${grandes.length} de >=0.3s) · ${totalH.toFixed(1)}s totales`);
  for (const h of grandes.slice(0, 12)) console.log(`   ${h[0].toFixed(2)}s .. ${h[1].toFixed(2)}s`);
  fs.writeFileSync(`_${SLUG}_huecos.json`, JSON.stringify(huecos.map((h) => [+h[0].toFixed(2), +(h[1] + 0.2).toFixed(2)])));
}

console.log(`assets: ${need.size} · FALTAN ${miss.length}${miss.length ? " → " + miss.slice(0, 8).join(" ") : ""}`);
if (missing.length) console.log(`⚠ COMPONENTES SIN ANCLA (${missing.length}):\n   ${missing.join("\n   ")}`);
