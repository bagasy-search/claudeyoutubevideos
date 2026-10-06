// plan.mjs — arma el plan de ahnight (Ancient Humans, piloto) para src/ah/AhMain.
// Entradas: D:/rtmp/ahnight/{moments,wordms,prompts_all}.json · img/ah_<i>_<part>.png · footage/catalog.json
//           vlog/ahnight/cues.json (hoja creativa anclada por FRASE) · public/broll/ahnight/*.mp4 (agnes)
//           _v3/ahnight_{redibujados,oscuros,rechazados}.json (compuertas) · D:/rtmp/ahnight/audio_ms.json
// Salidas:  public/ah/ahnight/* (assets conformados) · src/ah/plans/ahnight.ts · _ahnight_assets.txt · D:/rtmp/ahnight/plan_report.json
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SLUG = "ahnight";
const R = "D:/rtmp/ahnight/";
const REPO = "D:/Proyectos/video2-wt/ahnight/";
const PUB = REPO + "public/";
const AS = "ah/ahnight/";
const FPS = 30;
fs.mkdirSync(PUB + AS, { recursive: true });

const J = (p, d) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : d);
const moments = J(R + "moments.json");
const words = J(R + "wordms.json");
const PR = J(R + "prompts_all.json", []);
const prompt = (i, part = 0) => PR.find((p) => p.i === i && (p.part ?? 0) === part) ?? PR.find((p) => p.i === i);
const cues = J(REPO + "vlog/ahnight/cues.json");
const cat = J(R + "footage/catalog.json", []);
const redib = new Set(J(REPO + `_v3/${SLUG}_redibujados.json`, []).map(String));
const rechaz = new Set(J(REPO + `_v3/${SLUG}_rechazados.json`, []).map(String));
const oscuros = new Set(J(REPO + `_v3/${SLUG}_oscuros.json`, []).map((x) => (typeof x === "string" ? x : x.file)));
const CFG = J(R + "plan_cfg.json", { realRatio: 0.34 });
const AUDIO_MS = J(R + "audio_ms.json", { ms: words[words.length - 1].out + 2600 }).ms;
const AUDIO = `${AS}${SLUG}.m4a`;
const LUMA = J(R + "img_luma.json", {});

const fr = (ms) => Math.round((ms / 1000) * FPS);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const W = words.map((w) => norm(w.w));
const run = (args) => { const r = spawnSync("ffmpeg", args, { encoding: "utf8" }); if (r.status !== 0) throw new Error("ffmpeg: " + (r.stderr || "").slice(-400)); };
const report = { cues: [], missing: [] };

// ─── assets IA ─────────────────────────────────────────────────────────────
const aiName = (i, part) => `ah_${String(i).padStart(3, "0")}_${part}`;
const aiJpg = (i, part = 0) => {
  const n = aiName(i, part), out = PUB + AS + n + ".jpg", src = R + `img/${n}.png`;
  if (!fs.existsSync(src)) return part ? aiJpg(i, 0) : null;
  if (!fs.existsSync(out)) run(["-y", "-loglevel", "error", "-i", src, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", out]);
  return AS + n + ".jpg";
};
const agnesClip = (i, part = 0) => {
  const n = aiName(i, part), p = PUB + `broll/${SLUG}/${n}.mp4`;
  return fs.existsSync(p) && !redib.has(n) && !rechaz.has(n) && !oscuros.has(n + ".mp4") ? `broll/${SLUG}/${n}.mp4` : null;
};
const usedClip = new Set();
const aiSrc = (i, part = 0) => { const c = agnesClip(i, part); if (c && !usedClip.has(c)) { usedClip.add(c); return c; } return aiJpg(i, part); };
const nearJpg = (i, part = 0) => { for (let d = 0; d < moments.length; d++) for (const k of [i + d, i - d]) { if (k < 0 || k >= moments.length) continue; const r = aiJpg(k, d ? 0 : part); if (r) return r; } return null; };

// ─── imágenes v2 (gpt-image Batch o agnes-image sin personas) ─────────────────
const v2Src = (n, allowClip = false) => {
  const clip = `broll/${SLUG}/v2_${n}.mp4`;
  if (allowClip && fs.existsSync(PUB + clip) && !redib.has("v2_" + n) && !rechaz.has("v2_" + n) && !usedClip.has(clip)) { usedClip.add(clip); return clip; }
  const src = [R + `v2img/gpt/${n}.png`, R + `v2img/${n}.png`].find((f) => fs.existsSync(f));
  if (!src) { report.missing.push("V2 " + n); return null; }
  const out = `${AS}v2_${n}.jpg`;
  if (!fs.existsSync(PUB + out)) run(["-y", "-loglevel", "error", "-i", src, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", PUB + out]);
  return out;
};
const BASE = J(REPO + "vlog/ahnight/base_v2.json", {});
// ─── metraje real ──────────────────────────────────────────────────────────
const tok = (s) => new Set(String(s).toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2));
const STOP = new Set(["the", "and", "that", "this", "with", "from", "they", "their", "there", "then", "what", "when", "into", "over", "just", "like", "about", "were", "have", "has", "had", "was", "are", "for", "you", "your", "his", "her", "its", "but", "not", "all", "one", "two", "out", "get", "got", "who", "how", "more", "than", "some", "very", "been", "would", "could", "every", "each", "back", "down", "here", "where", "night", "people", "because", "thing", "things", "time", "only", "most", "around", "after", "before", "still", "long", "even", "know"]);
const fname = (c) => (c.type === "photo" ? "p_" : "r_") + path.basename(c.file).replace(/[^A-Za-z0-9._-]/g, "");
// fuera: agujas de ACERO (anacronismo), foto con lente de turista al borde, Tierra CG (no es metraje real)
const EXCL = /px_30024912|wm_bordercave.jpg|px_6654775|px_4456102|px_6654782|px_1851190|wm_hadza_fire|px_30100854|px_30100897|px_33404877|px_16565510|px_31385059|px_39156853|px_16952132|px_30216880|px_37266588|px_37549649/; // + leones de zoo de día, búhos de día, pollos al spiedo
const usable = cat.filter((c) => fs.existsSync(c.file) && !oscuros.has(fname(c)) && !EXCL.test(c.file) && !/\b(sea|ocean|coast|coastline|waves|beach|palm|tropical)\b/i.test(c.desc));
const usedFoot = new Set();
const footSrc = (c) => {
  const n = fname(c);
  if (!fs.existsSync(PUB + AS + n)) {
    if (c.type === "photo") run(["-y", "-loglevel", "error", "-i", c.file, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", PUB + AS + n.replace(/\.\w+$/, ".jpg")]);
    else fs.copyFileSync(c.file, PUB + AS + n);
  }
  return AS + (c.type === "photo" ? n.replace(/\.\w+$/, ".jpg") : n);
};
const footLen = (c) => (c.type === "photo" ? 99 : (c.end ?? 5) - (c.start ?? 0));
const tagsOf = (c) => new Set((c.tags || []).map((t) => String(t).toLowerCase()));
// mejor clip real para un contexto: palabras en común con desc+tags+chapter_hint; `need` = palabras mínimas
const takeFoot = (ctx, need = 2, opts = {}) => {
  const q = [...tok(ctx)].filter((w) => !STOP.has(w));
  let best = null, bs = 0;
  for (const c of usable) {
    if (usedFoot.has(c)) continue;
    const tg = tagsOf(c);
    if (opts.modern !== undefined && tg.has("modern") !== opts.modern) continue;
    if (opts.tag && !tg.has(opts.tag)) continue;
    // la noche es noche: metraje de DÍA (o de amanecer) sólo en el alba y en lo moderno; fotos de sitios/objetos siempre
    if (opts.chapter && c.type !== "photo" && !tg.has("modern")) {
      const alba = /^(c9|c10|outro)$/.test(opts.chapter);
      if (tg.has("day") && !alba) continue;
      if ((tg.has("dawn") || tg.has("sunrise")) && !alba) continue;
    }
    const t = tok(c.desc + " " + [...tg].join(" ") + " " + (c.chapter_hint || ""));
    let h = 0; for (const w of q) if (t.has(w) || t.has(w.replace(/s$/, ""))) h++;
    const sc = h * 2 + (c.quality ?? 3) * 0.3;
    if (h >= need && sc > bs) { bs = sc; best = c; }
  }
  if (best) usedFoot.add(best);
  return best;
};
const byTag = (tag, ctx = "") => takeFoot(tag + " " + ctx, 0, { tag });

// ─── anclas por frase ──────────────────────────────────────────────────────
const findPhrase = (phrase, fromIdx = 0) => {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = fromIdx; i <= W.length - p.length; i++) {
    let ok = true; for (let k = 0; k < p.length; k++) if (W[i + k] !== p[k]) { ok = false; break; }
    if (ok) return { i0: i, i1: i + p.length - 1 };
  }
  return null;
};
const momentOfWord = (wi) => moments.find((m) => wi >= m.w0 && wi <= m.w1) ?? moments[moments.length - 1];
const resolveRef = (ref, ctx) => {
  if (typeof ref !== "string" || !ref.startsWith("@")) return ref;
  const [kind, a] = ref.slice(1).split(":");
  const mi = ctx.moment.i;
  if (kind === "v2") return v2Src(a, !ctx.comp || /^(Shot|MatchCut|FlashSeq)$/.test(ctx.comp));
  if (kind === "dots") return J(R + a + ".json", []);
  if (kind === "file") { const c = cat.find((x) => x.file.includes(a)); if (c) { usedFoot.add(c); return footSrc(c); } report.missing.push("FILE " + a); return nearJpg(mi); }
  if (kind === "jpg") { const [ii, pp] = a.split("_"); return aiJpg(+ii, +(pp || 0)) ?? nearJpg(+ii); }
  if (kind === "img") return nearJpg(mi + (ctx.k = (ctx.k ?? -1) + 1));
  if (kind === "foot") { const c = takeFoot(a + " " + ctx.moment.text, 0, { tag: a, chapter: ctx.moment.item }); if (c) return footSrc(c); report.missing.push("FOOT " + a); return nearJpg(mi); }
  if (kind === "now") {
    const c = takeFoot(a + " " + ctx.moment.text, 1, { modern: true }) ?? byTag("modern", a);
    if (c) return footSrc(c);
    report.missing.push("NOW " + a);
    // la foto IA "now" más cercana
    for (let d = 0; d < 40; d++) for (const k of [mi + d, mi - d]) { const p = PR.find((x) => x.i === k && x.kind === "now"); if (p) return aiJpg(k, p.part ?? 0); }
    return nearJpg(mi);
  }
  return ref;
};
const deep = (o, ctx) => Array.isArray(o) ? o.map((x) => deep(x, ctx)) : o && typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, deep(v, ctx)])) : resolveRef(o, ctx);

const cards = [], overlays = [];
let ptr = 0;
for (const c of cues) {
  const a = findPhrase(c.at, Math.max(0, ptr - 30)) ?? findPhrase(c.at, 0);
  if (!a) { report.missing.push("ANCLA: " + c.at); continue; }
  ptr = a.i0;
  const moment = momentOfWord(a.i0);
  const startMs = words[a.i0].in - 80;
  let endMs;
  if (c.until) { const u = findPhrase(c.until, a.i0); if (!u) { report.missing.push("UNTIL: " + c.until); continue; } endMs = words[u.i1].out + (c.pad ?? 0.25) * 1000; }
  else endMs = startMs + (c.dur ?? 3) * 1000;
  if (c.mindur) endMs = Math.max(endMs, startMs + c.mindur * 1000);
  // limpio > denso: ninguna tarjeta tapa el metraje más de lo que tarda en leerse
  const MAXC = { SentinelRing: 9.5, MoonTally: 8.5, TalkBars: 8, SleepBars: 8.5, Globe3D: 9.5, Recap: 14, Shot: 4.5, Flash: 1 };
  if (c.t === "card") endMs = Math.min(endMs, startMs + (c.max ?? MAXC[c.comp] ?? 6.8) * 1000);
  const minF = /^(Shot|Flash|FlashSeq)$/.test(c.comp) ? 8 : 45;
  const cue = { from: Math.max(0, fr(startMs)), dur: Math.max(minF, fr(endMs) - fr(startMs)), comp: c.comp, props: deep(c.props, { moment, comp: c.comp }) };
  for (const [k, m] of Object.entries(c.marks ?? {})) {
    const h = findPhrase(m, a.i0);
    if (!h) { report.missing.push("MARK " + k + ": " + m); continue; }
    cue.props[k] = Math.max(0, fr(words[h.i0].in) - cue.from);
  }
  (c.t === "card" ? cards : overlays).push(cue);
  report.cues.push({ comp: c.comp, at: c.at, from: cue.from, dur: cue.dur, moment: moment.i, p: cue.props });
}
// 3D pesado → pre-render local con GPU
const PRE = new Set(["Globe3D"]);
for (const c of cards) if (PRE.has(c.comp)) {
  c._orig = { comp: c.comp, props: c.props };
  const f = `${AS}pre_${c.comp}_${c.from}.mp4`;
  if (fs.existsSync(PUB + f)) { c.comp = "Prerendered"; c.props = { src: f }; }
}
cards.sort((x, y) => x.from - y.from);
for (let i = 0; i < cards.length - 1; i++) if (cards[i].from + cards[i].dur > cards[i + 1].from) cards[i].dur = Math.max(20, cards[i + 1].from - cards[i].from);
// overlays: nunca dentro de una tarjeta; se recortan contra la siguiente
for (let i = overlays.length - 1; i >= 0; i--) {
  const o = overlays[i];
  const dentro = cards.find((c) => c.from <= o.from && c.from + c.dur > o.from + 10);
  if (dentro) { report.missing.push("overlay dentro de tarjeta, corrido: " + o.comp); o.from = dentro.from + dentro.dur + 6; }
  const nx = cards.find((c) => c.from > o.from && c.from < o.from + o.dur);
  if (nx) { o.dur = nx.from - o.from; if (o.dur < 45) { overlays.splice(i, 1); report.missing.push("overlay descartado (sin lugar): " + o.comp); } }
}
// brasas: transición firmada de cada capítulo del reloj
if (CFG.v1) for (const c of cards.filter((c) => c.comp === "NightClock")) overlays.push({ from: Math.max(0, c.from - 16), dur: 40, comp: "Embers", props: { peak: 0.9 } });

// ─── reloj chico de esquina: entre capítulos ───────────────────────────────
const clocks = cards.filter((c) => c.comp === "NightClock");
const clock = [];
const total = fr(AUDIO_MS);
clocks.forEach((c, k) => {
  const from = c.from + c.dur, to = k + 1 < clocks.length ? clocks[k + 1].from : total;
  if (CFG.v1 && to - from > 60) clock.push({ from, dur: to - from, time: c.props.time, label: c.props.title });
});

// ─── base ──────────────────────────────────────────────────────────────────
const segs = [];
for (let k = 0; k < moments.length; k++) {
  const m = moments[k];
  const a = k === 0 ? 0 : m.ms_in, b = k + 1 < moments.length ? moments[k + 1].ms_in : AUDIO_MS;
  const d = b - a;
  if (d > 5200) {
    const mid = a + d / 2; let best = m.w0, bd = 1e9;
    for (let wi = m.w0 + 1; wi <= m.w1; wi++) { const dd = Math.abs(words[wi].in - mid); if (dd < bd) { bd = dd; best = wi; } }
    segs.push({ m, a, b: words[best].in, part: 0 }, { m, a: words[best].in, b, part: 1 });
  } else segs.push({ m, a, b, part: 0 });
}
const insideCard = (f0, f1) => cards.some((c) => f0 >= c.from && f1 <= c.from + c.dur);
const beats = [];
let realF = 0, allF = 0;
const kbs = ["in", "left", "out", "right", "up"];
for (const s of segs) {
  const from = fr(s.a), dur = Math.max(1, fr(s.b) - fr(s.a));
  const p = prompt(s.m.i, s.part) ?? {};
  const covered = insideCard(from, from + dur);
  let src = null, rate, kb = kbs[(s.m.i + s.part) % 5], real = false;
  const ctx = s.m.text + " " + (p.subject || "");
  // metraje real: por contexto (>=2 palabras) o, si vamos cortos de proporción, con 1 palabra en planos sin elenco
  const forced = BASE[`${s.m.i}_${s.part}`] ?? (s.part === 1 ? undefined : undefined);
  if (forced) { src = resolveRef(forced, { moment: s.m }); real = /\/(r|p)_/.test(src || ""); }
  if (!src && !covered) {
    const wantReal = realF / Math.max(1, allF) < (CFG.realRatio ?? 0.34);
    const castShot = (p.cast || []).length > 0;
    // el elenco es la identidad del canal: un plano con elenco sólo cede a metraje real si éste nombra 3+ cosas de la frase
    const o = { modern: false, chapter: s.m.item };  // v2: nada de stock moderno genérico en la base
    // metraje MODERNO sólo cuando la frase le habla al espectador de hoy (no para "now" de laboratorio/excavación)
    const hoy = /\b(you|your|phone|screen|grandpa|alarm|teenage|scroll|remote|today)\b/i.test(s.m.text);
    const c = (o.modern && !hoy) ? null : (takeFoot(ctx, castShot ? 3 : 2, o) ?? (wantReal && !castShot ? takeFoot(ctx, 1, o) : null));
    if (c) {
      const need = dur / FPS, len = footLen(c);
      if (len >= need * 0.55) { src = footSrc(c); real = true; if (c.type !== "photo" && len < need) rate = Math.max(0.55, len / need); kb = c.type === "photo" ? kb : "in"; }
      else usedFoot.delete(c);
    }
  }
  // v2: las fotos IA "now" (laboratorios, cocinas, gente random) no van: el "YOU" es un solo personaje (base_v2)
  if (!src && p.kind === "now") { const c = takeFoot(ctx, 1, { modern: false, chapter: s.m.item }); if (c) { src = footSrc(c); real = true; } }
  if (!src && p.kind === "now") { for (let d = 1; d < 12 && !src; d++) for (const k of [s.m.i - d, s.m.i + d]) { const q = PR.find((x) => x.i === k && x.kind === "cast"); if (q && !src) src = aiJpg(k, q.part ?? 0); } }
  if (!src) src = aiSrc(s.m.i, s.part) ?? nearJpg(s.m.i);
  if (!covered) { allF += dur; if (real) realF += dur; }
  // noche ≠ negro: una foto/clip IA oscura se levanta (luma media medida del png original)
  let filter;
  const mImg = src.match(/(ah_\d{3}_\d)\.(jpg|mp4)$/);
  if (mImg && LUMA[mImg[1]] !== undefined && LUMA[mImg[1]] < 50) filter = `brightness(${Math.min(1.45, 58 / Math.max(20, LUMA[mImg[1]])).toFixed(2)})`;
  beats.push({ from, dur, src, filter, rate: rate ? +rate.toFixed(3) : undefined, kb, zoom: 1.1, _real: real });
}
beats[0].from = 0;
for (let i = 0; i < beats.length - 1; i++) beats[i].dur = beats[i + 1].from - beats[i].from;
beats[beats.length - 1].dur = total - beats[beats.length - 1].from;
if (beats.some((b) => b.dur <= 0)) throw new Error("beats con dur<=0");
// ningún clip repetido en dos planos
const seen = new Map();
for (const b of beats) if (/\.mp4$/.test(b.src)) { if (seen.has(b.src)) report.missing.push("CLIP REPETIDO " + b.src); seen.set(b.src, 1); }

const preJobs = cards.filter((c) => c._orig).map((c) => ({ file: `${AS}pre_${c._orig.comp}_${c.from}.mp4`, comp: c._orig.comp, props: c._orig.props, dur: c.dur }));
for (const c of cards) delete c._orig;

// ─── largos reales ─────────────────────────────────────────────────────────
const lens = {};
const allVids = new Set();
const walkV = (o) => { if (typeof o === "string" && /\.mp4$/.test(o)) allVids.add(o); else if (o && typeof o === "object") Object.values(o).forEach(walkV); };
walkV({ beats, cards, overlays });
for (const v of allVids) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + v], { encoding: "utf8" });
  const d = parseFloat(r.stdout); if (!(d > 0)) throw new Error("sin duración: " + v); lens[v] = +d.toFixed(3);
}
const usos = [];
for (const b of beats) if (/\.mp4$/.test(b.src)) usos.push({ key: "b" + b.from, src: b.src, dur: Math.min(lens[b.src], (b.dur / FPS) * (b.rate ?? 1)) });
fs.writeFileSync(REPO + `_v3/${SLUG}_cues.json`, JSON.stringify(usos));

// ─── proporciones (sobre lo que se VE: base libre de tarjetas + camas reales de tarjetas) ─────
const visible = (b) => { let v = b.dur; for (const c of cards) { const x0 = Math.max(b.from, c.from), x1 = Math.min(b.from + b.dur, c.from + c.dur); if (x1 > x0) v -= x1 - x0; } return Math.max(0, v); };
let vis = 0, visReal = 0, visClip = 0;
for (const b of beats) { const v = visible(b); vis += v; if (b._real) visReal += v; else if (b.src.startsWith("broll/")) visClip += v; }
let cardF = 0, cardReal = 0;
for (const c of cards) { cardF += c.dur; const s = JSON.stringify(c.props); if (s.includes(AS + "r_") || s.includes(AS + "p_")) cardReal += c.dur; }
for (const b of beats) delete b._real;

// transiciones sin corte (agnes keyframe): D:/rtmp/ahnight/trans/montaje.json [{id, from, dur}] + trans/<id>.mp4 que pasaron la compuerta
const TRD = CFG.transDir ?? "trans2";
const TRM = J(R + TRD + "/montaje.json", []), TRR = J(R + TRD + "/_report.json", []);
const trans = [];
for (const t of TRM) {
  const ok = TRR.find((r) => r.id === t.id && r.ok) && !(t.rechazada);
  const f = R + `${TRD}/${t.id}.mp4`;
  if (!ok || !fs.existsSync(f)) { report.missing.push("TRANSICIÓN sin usar: " + t.id); continue; }
  const dst = `${AS}tr_${t.id}.mp4`; fs.copyFileSync(f, PUB + dst);
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + dst], { encoding: "utf8" }); lens[dst] = +parseFloat(r.stdout).toFixed(3);
  trans.push({ from: t.from, dur: t.dur, src: dst });
}
const plan = { fps: FPS, total, audio: AUDIO, beats, cards, overlays, clock, trans, lens, skip: J(REPO + `_v3/${SLUG}_skip.json`, {}) };
fs.writeFileSync(R + "prerender_jobs.json", JSON.stringify(preJobs.map((j) => ({ ...j, lens })), null, 0));
fs.mkdirSync(REPO + "src/ah/plans", { recursive: true });
fs.writeFileSync(REPO + `src/ah/plans/${SLUG}.ts`, `// generado por vlog/ahnight/plan.mjs — no editar a mano\nimport type { Plan } from "../AhMain";\nexport const PLAN: Plan = ` + JSON.stringify(plan) + ";\n");
const assets = new Set([AUDIO, ...Array.from({ length: 8 }, (_, k) => `yc/grain/g${k}.png`), "ah/geo/bm4k.jpg", "ah/geo/night4k.jpg"]);
const walk = (o) => { if (typeof o === "string" && /^(ah|broll|img|yc)\//.test(o)) assets.add(o); else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(plan);
for (const a of assets) if (!fs.existsSync(PUB + a)) report.missing.push("ASSET NO EXISTE: " + a);
fs.writeFileSync(REPO + `_${SLUG}_assets.txt`, [...assets].join("\n") + "\n");
report.total = total; report.beats = beats.length; report.cards = cards.length; report.overlays = overlays.length;
report.share = { real_visible: +(100 * (visReal + cardReal) / total).toFixed(1), real_base: +(100 * visReal / Math.max(1, vis)).toFixed(1), agnes_visible: +(100 * visClip / total).toFixed(1), cards: +(100 * cardF / total).toFixed(1) };
report.cutsPerMin = +((beats.length + cards.length * 2) / (total / FPS / 60)).toFixed(1);
fs.writeFileSync(R + "plan_report.json", JSON.stringify(report, null, 1));
console.log(JSON.stringify({ total, beats: beats.length, cards: cards.length, overlays: overlays.length, clock: clock.length, share: report.share, cutsPerMin: report.cutsPerMin, missing: report.missing.length }, null, 1));
if (report.missing.length) console.log("FALTANTES:\n  " + report.missing.slice(0, 40).join("\n  "));
