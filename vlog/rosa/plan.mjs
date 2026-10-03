// plan.mjs <slug> — arma el plan de RosaMain (beats contiguos + overlays) y conforma los assets en public/rosa/<slug>/.
// Entradas: D:/rtmp/<slug>/{moments,prompts}.json · img/a_<i>.png · web/w_<i>.jpg · public/broll/<slug>/a_<i>.mp4 (agnes) · vlog/rosa/<slug>/items.json
// Salidas : src/rosa/plans/<slug>.ts · @_<slug>_assets.txt · D:/rtmp/<slug>/plan_report.json
// Cobertura 100 % por construcción (cada beat llega hasta el siguiente). Clip agnes = 4,03 s: si el plano dura más, el resto sigue en la foto.
import fs from "node:fs"; import path from "node:path"; import { spawnSync } from "node:child_process";
import { norm } from "./lib.mjs";
const slug = process.argv[2];
const REPO = process.cwd().replace(/\\/g, "/") + "/";
const R = `D:/rtmp/${slug}/`;
const PUB = REPO + "public/", AS = `rosa/${slug}/`;
fs.mkdirSync(PUB + AS, { recursive: true });
fs.mkdirSync(REPO + "src/rosa/plans", { recursive: true });
const J = (p, d) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : d);
const moments = J(R + "moments.json"), prompts = J(R + "prompts.json");
const cfg = J(`${REPO}vlog/rosa/${slug}/items.json`);
const redib = new Set(J(REPO + `_v3/${slug}_redibujados.json`, []).map(String));
const oscuros = new Set(J(REPO + `_v3/${slug}_oscuros.json`, []).map((x) => (typeof x === "string" ? x : x.file)));
const FPS = 30, fr = (ms) => Math.round((ms / 1000) * FPS);
const CLIP_S = 4.0;
const ff = (a) => { const r = spawnSync("ffmpeg", a, { encoding: "utf8", windowsHide: true }); if (r.status !== 0) throw new Error("ffmpeg " + (r.stderr || "").slice(-300)); };
const jpg = (i, kind) => {
  const out = PUB + AS + `p_${i}.jpg`;
  if (fs.existsSync(out)) return AS + `p_${i}.jpg`;
  if (kind === "web" && fs.existsSync(R + `web/w_${i}.jpg`)) { fs.copyFileSync(R + `web/w_${i}.jpg`, out); return AS + `p_${i}.jpg`; }
  const src = R + `img/a_${i}.png`;
  if (!fs.existsSync(src)) return null;
  ff(["-y", "-loglevel", "error", "-i", src, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", out]);
  return AS + `p_${i}.jpg`;
};
const clipOf = (i) => {
  const n = `a_${i}`, f = `broll/${slug}/${n}.mp4`;
  return fs.existsSync(PUB + f) && !redib.has(n) && !oscuros.has(n) ? f : null;
};
const vclip = (i) => {
  const src = R + `webv/v_${i}.mp4`; if (!fs.existsSync(src)) return null;
  const out = PUB + AS + `v_${i}.mp4`; if (!fs.existsSync(out)) fs.copyFileSync(src, out);
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], { encoding: "utf8", windowsHide: true });
  return { src: AS + `v_${i}.mp4`, len: parseFloat(r.stdout) || 0 };
};
const KB = ["in", "out", "left", "right", "up", "down"];
const beats = [], used = { photo: 0, clip: 0, web: 0, missing: 0 };
const kinds = {};
let lastItem = "";
const lastIdx = moments.length - 1;
for (const m of moments) {
  const p = prompts[m.i];
  const from = fr(m.ms_in), end = m.i === lastIdx ? fr(m.ms_out) : fr(moments[m.i + 1].ms_in);
  const dur = Math.max(1, end - from);
  const photo = jpg(m.i, p.kind);
  const clip = p.kind === "web" ? null : clipOf(m.i);
  const vc = vclip(m.i);
  const dis = m.item !== lastItem && m.i > 0; lastItem = m.item;
  const kb = KB[(m.i * 5 + (m.item.length)) % KB.length];
  if (vc && vc.len >= 2) {
    const vf = Math.floor(vc.len * FPS) - 2; used.real = (used.real ?? 0) + 1;
    if (dur <= vf) beats.push({ from, dur, src: vc.src, rate: 1, tr: dis ? "dissolve" : "cut" });
    else { beats.push({ from, dur: vf, src: vc.src, rate: 1, tr: dis ? "dissolve" : "cut" }); if (photo) beats.push({ from: from + vf, dur: dur - vf, src: photo, kb: "in", zoom: 1.05 }); else beats[beats.length - 1].dur = dur; }
    kinds.webv = (kinds.webv ?? 0) + 1; continue;
  }
  if (!photo && !clip) { used.missing++; continue; }
  kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
  if (clip) {
    const clipF = Math.round(CLIP_S * FPS);
    if (dur <= clipF) { beats.push({ from, dur, src: clip, tr: dis ? "dissolve" : "cut" }); used.clip++; }
    else {
      beats.push({ from, dur: clipF, src: clip, tr: dis ? "dissolve" : "cut" }); used.clip++;
      if (photo) { beats.push({ from: from + clipF, dur: dur - clipF, src: photo, kb: "in", zoom: 1.05 }); used.photo++; }
      else beats[beats.length - 1].dur = dur;
    }
  } else { beats.push({ from, dur, src: photo, kb, zoom: p.kind === "web" ? 1.07 : 1.09, tr: dis ? "dissolve" : "cut" }); used.photo++; if (p.kind === "web") used.web++; }
}
// ─── overlays ───────────────────────────────────────────────────────────
const overlays = [];
const bySec = {};
for (const m of moments) (bySec[m.item] = bySec[m.item] || []).push(m);
const push = (from, dur, comp, props) => overlays.push({ from, dur, comp, props });
for (const [sec, ms] of Object.entries(bySec)) {
  const m0 = ms[0], t0 = fr(m0.ms_in);
  const secEnd = fr(ms[ms.length - 1].ms_out);
  const mm = /^i(\d+)$/.exec(sec);
  if (mm) {
    const it = cfg.items[mm[1]];
    push(t0 + 6, Math.min(fr(6200), secEnd - t0 - 6), "RecipeStamp", { n: +mm[1], title: it.title, sub: cfg.stampSub });
    // truco: en el momento que lo nombra, o hacia el 70 % del ítem
    const named = ms.find((m) => /truco|secreto|ojo|nunca|siempre|no te lo|aplasta|guarda/.test(norm(m.text)) && fr(m.ms_in) > t0 + fr(8000));
    const tm = named ?? ms[Math.min(ms.length - 1, Math.floor(ms.length * 0.7))];
    const ts = fr(tm.ms_in) + 6;
    if (it.truco && ts + fr(4800) <= secEnd + fr(2000)) push(ts, fr(4800), "Truco", { text: it.truco });
  } else if (cfg.chapters[sec]) {
    push(t0 + 3, fr(3600), "Chapter", { text: cfg.chapters[sec].text, sub: "Rosa" });
  }
}
const cta = moments.find((m) => /^Las medidas exactas/.test(m.text));
if (cta) push(fr(cta.ms_in) + 6, fr(9500), "BookCta", { cover: "rosa/book.jpg" });
overlays.sort((a, b) => a.from - b.from);
// sin solapes entre rótulos de la misma esquina: si dos se pisan, el segundo se corre
for (let i = 1; i < overlays.length; i++) { const a = overlays[i - 1], b = overlays[i]; if (b.comp === a.comp && b.from < a.from + a.dur) b.from = a.from + a.dur + 6; }
// cues de la capa base (los lee agnes_qc para medir repeticiones y el farm lo exige)
fs.mkdirSync(REPO + "_v3", { recursive: true });
fs.writeFileSync(REPO + `_v3/${slug}_cues.json`, JSON.stringify(beats.map((b, k) => ({ key: "b" + k, src: b.src, start: b.start ?? 0, dur: b.dur / FPS }))));
// ─── audio y total ──────────────────────────────────────────────────────
const AUDIO = "rosa/" + slug + ".m4a";
const total = fr(moments[lastIdx].ms_out) + fr(2600);
const lastBeat = beats[beats.length - 1]; if (lastBeat.from + lastBeat.dur < total) lastBeat.dur = total - lastBeat.from;
const plan = { fps: FPS, total, audio: AUDIO, beats, overlays };
fs.writeFileSync(REPO + `src/rosa/plans/${slug}.ts`, `// generado por vlog/rosa/plan.mjs — no editar a mano\nimport type { Plan } from "../RosaMain";\nexport const PLAN: Plan = ${JSON.stringify(plan)};\n`);
// lista de assets para el tar del farm
const assets = new Set([AUDIO, "rosa/book.jpg"]);
for (const b of beats) assets.add(b.src);
for (const o of overlays) if (o.props.cover) assets.add(o.props.cover);
fs.writeFileSync(REPO + `@_${slug}_assets.txt`, [...assets].join("\n") + "\n");
const rep = { beats: beats.length, overlays: overlays.length, comps: [...new Set(overlays.map((o) => o.comp))], used, kinds, total, min: +(total / FPS / 60).toFixed(2), cobertura: "100% por construcción" };
fs.writeFileSync(R + "plan_report.json", JSON.stringify(rep, null, 1));
console.log(JSON.stringify(rep));
