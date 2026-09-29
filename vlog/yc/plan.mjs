// plan.mjs — arma el plan de __SLUG__ (Yesterday's Classroom #1) para src/yc/YcMain.
// Entradas: D:/rtmp/__SLUG__/{moments,wordms,prompts}.json · archive/catalog.json · now/catalog.json · img/*.png
//           vlog/__SLUG__/cues.json (hoja creativa, anclada por FRASE) · public/broll/__SLUG__/*.mp4 (agnes, si hay)
// Salidas:  public/yc/__SLUG__/*  (assets conformados) · src/yc/plans/__SLUG__.ts · ___SLUG___assets.txt
//           D:/rtmp/__SLUG__/plan_report.json
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const R = "D:/rtmp/__SLUG__/";
const REPO = "C:/Users/bauti/Downloads/video2/";
const PUB = REPO + "public/";
const AS = "yc/__SLUG__/";                 // prefijo de assets dentro de public/
const AUDIO = fs.existsSync("C:/Users/bauti/Downloads/video2/public/__SLUG__.m4a") ? "__SLUG__.m4a" : AS + "__SLUG__.m4a"; // audio en D: (public/yc es junction)
const FPS = 30;
const FF = "ffmpeg";
fs.mkdirSync(PUB + AS, { recursive: true });

const J = (p, d) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : d);
const moments = J(R + "moments.json");
const words = J(R + "wordms.json");
const prompts = J(R + "prompts.json");
const cues = J(REPO + "vlog/__SLUG__/cues.json");
const arch = J(R + "archive/catalog.json", []);
const nowc = J(R + "now/catalog.json", []);
const redib = new Set(J(REPO + "_v3/__SLUG___redibujados.json", []).map(String));
const oscuros = new Set(J(REPO + "_v3/__SLUG___oscuros.json", []).map((x) => (typeof x === "string" ? x : x.file)));
const AUDIO_MS = J(R + "audio_ms.json", { ms: words[words.length - 1].out + 2600 }).ms;

const NUM = { twenty: 20, nineteen: 19, eighteen: 18, seventeen: 17, sixteen: 16, fifteen: 15, fourteen: 14, thirteen: 13, twelve: 12, eleven: 11, ten: 10, nine: 9, eight: 8, seven: 7, six: 6, five: 5, four: 4, three: 3, two: 2, one: 1, "twenty-one": 21, "twenty-two": 22, "twenty-three": 23, "twenty-four": 24, "twenty-five": 25 };
const itemNum = (it) => NUM[it] ?? (it === "hook" ? "hook" : it === "outro" ? "outro" : it);
const fr = (ms) => Math.round((ms / 1000) * FPS);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const W = words.map((w) => norm(w.w));

// ─── assets ────────────────────────────────────────────────────────────────
const run = (args) => { const r = spawnSync(FF, args, { encoding: "utf8" }); if (r.status !== 0) throw new Error("ffmpeg: " + (r.stderr || "").slice(-400)); };
const aiJpg = (i) => {
  const name = `i_${String(i).padStart(3, "0")}.jpg`;
  const out = PUB + AS + name, src = R + `img/yck_${String(i).padStart(3, "0")}.png`;
  if (!fs.existsSync(src)) return null;
  if (!fs.existsSync(out)) run(["-y", "-loglevel", "error", "-i", src, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", out]);
  return AS + name;
};
const agnesClip = (i) => {
  const n = `yck_${String(i).padStart(3, "0")}`;
  const p = PUB + `broll/__SLUG__/${n}.mp4`;
  return fs.existsSync(p) && !redib.has(n) ? `broll/__SLUG__/${n}.mp4` : null;
};
const aiSrc = (i, preferClip = true) => (preferClip && agnesClip(i)) || aiJpg(i);
let archCut = 0;
const archSrc = (shot) => {
  if (shot._out) return shot._out;
  const name = `a_${path.basename(shot.file, ".mp4").replace(/[^A-Za-z0-9]/g, "").slice(0, 24)}_${Math.round(shot.start * 10)}.mp4`; archCut++;
  const len = Math.min(9, shot.end - shot.start);
  const vf = [shot.crop ? `crop=${shot.crop.replace(/^crop=/, "")}` : null, "scale=1920:1080:force_original_aspect_ratio=increase", "crop=1920:1080", "fps=30", "format=yuv420p"].filter(Boolean).join(",");
  if (!fs.existsSync(PUB + AS + name))
    run(["-y", "-loglevel", "error", "-ss", String(shot.start), "-i", shot.file, "-t", String(len), "-an", "-vf", vf, "-c:v", "libx264", "-crf", "21", "-preset", "veryfast", "-r", "30", PUB + AS + name]);
  shot._out = AS + name; shot._len = len;
  return shot._out;
};
const nowSrc = (c) => {
  if (c._out) return c._out;
  const name = "n_" + path.basename(c.file);
  const srcf = path.isAbsolute(c.file) ? c.file : R + "now/" + c.file;
  if (!fs.existsSync(PUB + AS + name)) fs.copyFileSync(srcf, PUB + AS + name);
  c._out = AS + name; return c._out;
};

// ─── pools ─────────────────────────────────────────────────────────────────
const tok = (s) => new Set(String(s).toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2));
const archBy = {};
for (const s of arch) {
  const nm = `a_${path.basename(s.file, ".mp4").replace(/[^A-Za-z0-9]/g, "").slice(0, 24)}_${Math.round(s.start * 10)}.mp4`;
  if (oscuros.has(nm)) continue;
  const k = String(s.item); (archBy[k] = archBy[k] || []).push(s);
}
for (const k in archBy) archBy[k].sort((a, b) => (b.quality ?? 3) - (a.quality ?? 3));
const usedArch = new Set();
const takeArch = (item, k, ctxText) => {
  const pool = archBy[String(item)] || [];
  if (k !== undefined && !Number.isNaN(k)) { for (let j = 0; j < pool.length; j++) { const s = pool[(k + j) % pool.length]; if (!usedArch.has(s)) { usedArch.add(s); return s; } } return null; }
  let s = null, bs = -1;
  const q = ctxText ? tok(ctxText) : null;
  for (const x of pool) {
    if (usedArch.has(x)) continue;
    let sc = (x.quality ?? 3) * 0.5;
    if (q) { const t = tok(x.desc); for (const w of q) if (t.has(w)) sc += 2; }
    if (sc > bs) { bs = sc; s = x; }
  }
  if (s) usedArch.add(s);
  return s || null;
};
const usedNow = new Set();
const takeNow = (query) => {
  const q = tok(query);
  let best = null, bs = 0;
  for (const c of nowc) {
    if (usedNow.has(c) || oscuros.has("n_" + path.basename(c.file))) continue;
    const t = tok(c.query + " " + c.desc); let s = 0; for (const w of q) if (t.has(w)) s++;
    if (c.query === query) s += 5;
    if (s > bs) { bs = s; best = c; }
  }
  if (best && bs >= 2) { usedNow.add(best); return best; }
  return null;
};

// ─── anclas ────────────────────────────────────────────────────────────────
const findPhrase = (phrase, fromIdx = 0) => {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = fromIdx; i <= W.length - p.length; i++) {
    let ok = true; for (let k = 0; k < p.length; k++) if (W[i + k] !== p[k]) { ok = false; break; }
    if (ok) return { i0: i, i1: i + p.length - 1 };
  }
  return null;
};
const momentOfWord = (wi) => moments.find((m) => wi >= m.w0 && wi <= m.w1) ?? moments[moments.length - 1];

const report = { cues: [], missing: [] };
// la imagen existente más cercana a un momento (algunos momentos no tienen foto propia: los tapa el aula 3D)
const nearJpg = (i) => { for (let d = 0; d < moments.length; d++) for (const k of [i + d, i - d]) { if (k < 0 || k >= moments.length) continue; const r = aiJpg(k); if (r) return r; } return null; };
const resolveRef = (ref, ctx) => {
  if (typeof ref !== "string" || !ref.startsWith("@")) return ref;
  const [kind, a, b] = ref.slice(1).split(":");
  const nearI = ctx.moment.i;
  const itemMoments = moments.filter((m) => m.item === ctx.moment.item);
  if (kind === "jpg") return aiJpg(+a) ?? nearJpg(+a);
  if (kind === "img") {
    if (a === "@near") return nearJpg(nearI);
    if (a === "@find") {
      const hit = itemMoments.find((m) => { const p = prompts[m.i]; return (p.subject + " " + p.prompt).toLowerCase().includes(b); });
      if (!hit) report.missing.push(ref);
      return nearJpg(hit ? hit.i : nearI);
    }
    return nearJpg(+a);
  }
  if (kind === "arch") {
    const s = takeArch(a, +b);
    if (s) return archSrc(s);
    report.missing.push(ref);
    const alt = moments.filter((m) => String(itemNum(m.item)) === a && prompts[m.i].era === "then");
    const pick = alt[(+b * 3) % Math.max(1, alt.length)] ?? ctx.moment;
    return aiSrc(pick.i);
  }
  if (kind === "now") {
    const c = takeNow(a);
    if (c) return nowSrc(c);
    report.missing.push(ref);
    const alt = itemMoments.find((m) => prompts[m.i].era === "now") ?? ctx.moment;
    return aiSrc(alt.i, false);
  }
  return ref;
};
const deep = (o, ctx) => Array.isArray(o) ? o.map((x) => deep(x, ctx)) : o && typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, deep(v, ctx)])) : resolveRef(o, ctx);

// ─── examen: el aula 3D se sincroniza sola con la voz (opciones, reloj, revelación) ───
const QS = J(R + "questions.json", []);
const PAUSE_MS = J(R + "pause_ms.json", []);
function examCue(c, a) {
  const find = (pred, from) => { for (let i = from; i < words.length; i++) if (pred(i)) return i; return -1; };
  const isIt = find((i) => W[i] === "is" && W[i + 1] === "it" && W[i + 2] === "a", a.i0);
  const iB = find((i) => W[i] === "b" && /^B,$/.test(words[i].w), isIt + 3);
  const iOr = find((i) => W[i] === "or" && W[i + 1] === "c", iB);
  const iEnd = find((i) => /\?$/.test(words[i].w), iOr + 1);
  const iAns = find((i) => W[i] === "the" && W[i + 1] === "answer" && W[i + 2] === "is", iEnd);
  const iAnsEnd = find((i) => /[.!]$/.test(words[i].w), iAns + 3);
  if ([isIt, iB, iOr, iEnd, iAns, iAnsEnd].some((x) => x < 0)) throw new Error("examen: no encontré la estructura de la pregunta " + c.props.n);
  const q = QS.find((x) => x.n === c.props.n);
  const startMs = words[a.i0].in - 250;
  const endMs = words[iAnsEnd].out + 900;
  const rf = (ms) => Math.max(0, fr(ms) - fr(startMs));
  const pz = PAUSE_MS.find((p) => p.in >= words[iEnd].out - 400 && p.in <= words[iEnd].out + 2500);
  const lines = [
    { text: q.question, from: rf(words[a.i0 + 2].in), to: rf(words[isIt].in - 150), kind: "q" },
    { text: "A. " + q.options.A, from: rf(words[isIt + 2].in), to: rf(words[iB].in - 100), kind: "opt" },
    { text: "B. " + q.options.B, from: rf(words[iB].in), to: rf(words[iOr].in - 100), kind: "opt" },
    { text: "C. " + q.options.C, from: rf(words[iOr + 1].in), to: rf(words[iEnd].out), kind: "opt" },
  ];
  return { startMs, endMs, props: { n: q.n, lines, answer: q.answer, countFrom: pz ? rf(pz.in) : rf(words[iEnd].out + 300), revealAt: rf(words[iAns].in), angle: (q.n - 1) % 4, total: QS.length } };
}
const cards = [], overlays = [];
let ptr = 0;
for (const c of cues) {
  const a = findPhrase(c.at, Math.max(0, ptr - 400)) ?? findPhrase(c.at, 0);
  if (!a) { report.missing.push("ANCLA: " + c.at); continue; }
  ptr = a.i0;
  const moment = momentOfWord(a.i0);
  let startMs = words[a.i0].in - (c.comp === "NumberCard3D" ? 250 : 80);
  let endMs;
  if (c.comp === "ExamRoom3D") {
    const e = examCue(c, a);
    const cue = { from: Math.max(0, fr(e.startMs)), dur: fr(e.endMs) - fr(Math.max(0, e.startMs)), comp: c.comp, props: e.props };
    cards.push(cue); report.cues.push({ comp: c.comp, at: c.at, from: cue.from, dur: cue.dur, moment: moment.i, countFrom: e.props.countFrom, revealAt: e.props.revealAt });
    continue;
  }
  if (c.until) { const u = findPhrase(c.until, a.i0); if (!u) { report.missing.push("UNTIL: " + c.until); continue; } endMs = words[u.i1].out + (c.pad ?? 0.25) * 1000; }
  else endMs = startMs + (c.dur ?? 3) * 1000;
  if (c.comp === "NumberCard3D") endMs = Math.max(endMs, startMs + 4200);
  const cue = { from: Math.max(0, fr(startMs)), dur: Math.max(45, fr(endMs) - fr(startMs)), comp: c.comp, props: deep(c.props, { moment }), after: c.after ? resolveRef(c.after, { moment }) : undefined };
  (c.t === "card" ? cards : overlays).push(cue);
  report.cues.push({ comp: c.comp, at: c.at, from: cue.from, dur: cue.dur, moment: moment.i });
}
// escenas pre-renderizadas con GPU (vlog/__SLUG__/prerender.mjs) → el farm sólo reproduce el clip
const PRE = new Set(["Timeline3D", "ExamRoom3D", "Diorama3D", "Projector3D"]);
for (const c of cards) if (PRE.has(c.comp)) {
  c._orig = { comp: c.comp, props: c.props };
  const f = `${AS}pre_${c.comp}_${c.from}.mp4`;
  if (fs.existsSync(PUB + f)) { c.comp = "Prerendered"; c.props = { src: f }; }
}
// cartas no se pisan: la siguiente manda
cards.sort((x, y) => x.from - y.from);
for (let i = 0; i < cards.length - 1; i++) if (cards[i].from + cards[i].dur > cards[i + 1].from) cards[i].dur = Math.max(20, cards[i + 1].from - cards[i].from);
// ningún overlay invade la tarjeta siguiente (se recorta; si queda muy corto, se descarta)
for (let i = overlays.length - 1; i >= 0; i--) {
  const o = overlays[i];
  const nx = cards.find((c) => c.from > o.from && c.from < o.from + o.dur);
  const dentro = cards.find((c) => c.from <= o.from && c.from + c.dur > o.from + 10);
  if (dentro) { overlays.splice(i, 1); continue; }
  if (nx) { o.dur = nx.from - o.from; if (o.dur < 36) overlays.splice(i, 1); }
}
// fuga de luz al salir de cada número
for (const c of cards.filter((c) => c.comp === "NumberCard3D")) overlays.push({ from: c.from + c.dur - 8, dur: 22, comp: "LightLeak", props: { peak: 0.6 } });

// ─── base ──────────────────────────────────────────────────────────────────
const total = fr(AUDIO_MS);
const beats = [];
const segs = [];
for (let k = 0; k < moments.length; k++) {
  const m = moments[k];
  const a = k === 0 ? 0 : m.ms_in, b = k + 1 < moments.length ? moments[k + 1].ms_in : AUDIO_MS;
  const d = b - a;
  if (d > 5200) { // partir en la frontera de palabra más cercana al medio
    const mid = a + d / 2; let best = m.w0, bd = 1e9;
    for (let wi = m.w0 + 1; wi <= m.w1; wi++) { const dd = Math.abs(words[wi].in - mid); if (dd < bd) { bd = dd; best = wi; } }
    segs.push({ m, a, b: words[best].in, part: 0 }, { m, a: words[best].in, b, part: 1 });
  } else segs.push({ m, a, b, part: 0, solo: true });
}
let lastEra = "then", thenCount = 0, archCount = 0;
for (const s of segs) {
  const p = prompts[s.m.i], it = itemNum(s.m.item);
  const from = fr(s.a), dur = Math.max(1, fr(s.b) - fr(s.a));
  let src = null, start = 0, kb = ["in", "left", "out", "right", "up"][(s.m.i + s.part) % 5], rate = 1;
  if (p.era === "now") {
    const c = takeNow(p.subject + " " + p.prompt.slice(40, 200));
    src = c ? nowSrc(c) : aiSrc(s.m.i);
  } else {
    thenCount++;
    const wantArch = s.part === 1 || (s.solo && p.kind !== "obj" && archCount / thenCount < 0.62);
    const ctx = s.m.text + " " + p.subject;
    const shot = wantArch ? takeArch(it === "hook" || it === "outro" ? "general" : it, undefined, ctx) ?? takeArch("general", undefined, ctx) : null;
    if (shot) { src = archSrc(shot); const need = dur / FPS; if (shot._len < need * 0.55) { src = aiSrc(s.m.i); } else { archCount++; if (shot._len < need) rate = Math.max(0.55, shot._len / need); kb = "in"; } }
    else src = aiSrc(s.m.i);
  }
  if (!src) src = beats.length ? beats[beats.length - 1].src : (aiSrc(prompts.findIndex((x) => x.prompt)) || null); // momento tapado por una tarjeta sin imagen propia
  const tr = p.era !== lastEra ? "dissolve" : undefined;
  lastEra = p.era;
  beats.push({ from, dur, src, start, rate: rate === 1 ? undefined : +rate.toFixed(3), kb, zoom: 1.1, tr });
}
// el beat que sigue a un PrintPush continúa su misma imagen (fundido sin corte)
for (const c of cards.filter((c) => c.comp === "PrintPush" && c.after)) {
  const endF = c.from + c.dur;
  const b = beats.find((x) => x.from <= endF && x.from + x.dur > endF);
  if (b) { const cut = { ...b, from: endF, dur: b.from + b.dur - endF, src: c.after, kb: "in", zoom: 1.08, tr: undefined }; b.dur = endF - b.from; beats.splice(beats.indexOf(b) + 1, 0, cut); }
}
for (const c of [...cards, ...overlays]) delete c.after;
const preJobs = cards.filter((c) => c._orig).map((c) => ({ file: `${AS}pre_${c._orig.comp}_${c.from}.mp4`, comp: c._orig.comp, props: c._orig.props, dur: c.dur }));
for (const c of cards) delete c._orig;
// cobertura por construcción
beats[0].from = 0;
for (let i = 0; i < beats.length - 1; i++) beats[i].dur = beats[i + 1].from - beats[i].from;
beats[beats.length - 1].dur = total - beats[beats.length - 1].from;
const bad = beats.filter((b) => b.dur <= 0);
if (bad.length) throw new Error("beats con dur<=0: " + bad.length);

// ─── largo real de cada clip (el montaje ralentiza para que ninguno se agote antes de su plano) ──
const lens = {};
const allVids = new Set();
const walkV = (o) => { if (typeof o === "string" && /\.mp4$/.test(o)) allVids.add(o); else if (o && typeof o === "object") Object.values(o).forEach(walkV); };
walkV({ beats, cards, overlays });
for (const v of allVids) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + v], { encoding: "utf8" });
  const d = parseFloat(r.stdout); if (!(d > 0)) throw new Error("sin duración: " + v); lens[v] = +d.toFixed(3);
}
// uso de clips para la compuerta de repetición de agnes_qc (dur = segundos de CLIP consumidos)
const usos = [];
for (const b of beats) if (/\.mp4$/.test(b.src)) usos.push({ key: "b" + b.from, src: b.src, dur: Math.min(lens[b.src], (b.dur / FPS) * (b.rate ?? 1)) });
for (const c of [...cards, ...overlays]) { const vs = new Set(); walkV2(c.props, vs); for (const v of vs) usos.push({ key: c.comp + c.from, src: v, dur: Math.min(lens[v], c.dur / FPS) }); }
function walkV2(o, set) { if (typeof o === "string" && /\.mp4$/.test(o)) set.add(o); else if (o && typeof o === "object") Object.values(o).forEach((x) => walkV2(x, set)); }
fs.writeFileSync(REPO + "_v3/__SLUG___cues.json", JSON.stringify(usos, null, 0));

// ─── salida ────────────────────────────────────────────────────────────────
const skip = J(REPO + "_v3/__SLUG___skip.json", {});
const plan = { fps: FPS, total, audio: AUDIO, beats, cards, overlays, lens, skip };
fs.writeFileSync(R + "prerender_jobs.json", JSON.stringify(preJobs.map((j) => ({ ...j, lens })), null, 0));
fs.mkdirSync(REPO + "src/yc/plans", { recursive: true });
fs.writeFileSync(REPO + "src/yc/plans/__SLUG__.ts", "// generado por vlog/__SLUG__/plan.mjs — no editar a mano\nimport type { Plan } from \"../YcMain\";\nexport const PLAN: Plan = " + JSON.stringify(plan) + ";\n");
const assets = new Set([AUDIO, ...Array.from({ length: 8 }, (_, k) => `yc/grain/g${k}.png`)]);
const walk = (o) => { if (typeof o === "string" && /^(yc|broll|img)\//.test(o)) assets.add(o); else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(plan);
for (const a of assets) if (!fs.existsSync(PUB + a)) report.missing.push("ASSET NO EXISTE: " + a);
fs.writeFileSync(REPO + "___SLUG___assets.txt", [...assets].join("\n") + "\n");
const srcKind = (s) => (s.startsWith(AS + "a_") ? "archivo" : s.startsWith(AS + "n_") ? "stock_hoy" : s.startsWith("broll/") ? "ia_animada" : "ia_foto");
const byKind = {}; for (const b of beats) byKind[srcKind(b.src)] = (byKind[srcKind(b.src)] || 0) + b.dur;
report.total = total; report.beats = beats.length; report.cards = cards.length; report.overlays = overlays.length;
report.share = Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, +(v / total * 100).toFixed(1)]));
report.cutsPerMin = +((beats.length + cards.length * 2) / (total / FPS / 60)).toFixed(1);
fs.writeFileSync(R + "plan_report.json", JSON.stringify(report, null, 1));
console.log(JSON.stringify({ total, beats: beats.length, cards: cards.length, overlays: overlays.length, share: report.share, cutsPerMin: report.cutsPerMin, missing: report.missing.length }, null, 1));
if (report.missing.length) console.log("FALTANTES:\n  " + report.missing.slice(0, 40).join("\n  "));
