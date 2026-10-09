// _v3/<slug>_shots.json → src/<slug>/timeline.gen.ts (cues en CUADROS exactos, fronteras pegadas), assets reales en disco
// (stock real > foto gpt; clip LTX > ancla del clip), sonido (sfx/foley) y lista de assets del farm. SLUG=x node vlog/loretta/gen_timeline.mjs [--final]
import fs from "node:fs"; import { execFileSync } from "node:child_process";
import { R, SLUG, V3, J } from "./env.mjs";
const PUB = R + "public/", FPS = 30, F = (s) => Math.round(s * FPS), FINAL = process.argv.includes("--final");
const { END, shots, vl } = J(V3 + "shots.json"), P = J(V3 + "paras.json");
const avwin = fs.existsSync(V3 + "avwin.json") ? J(V3 + "avwin.json").win : [];
const ACEPT = new Set((fs.existsSync(V3 + "aceptados.json") ? J(V3 + "aceptados.json") : [])); // clips rechazados en QC que van con su ancla a propósito
const ex = (p) => fs.existsSync(PUB + p);
const probeDur = (p) => { try { return +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim(); } catch { return 0; } };
const CLIP0 = {}; for (const [k, v] of Object.entries(vl)) CLIP0[k] = Math.max(0, v.s - 0.03);
const AVSRC = `avatar_clips/${SLUG}/reel30.mp4`, AV_READY = ex(AVSRC);
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], foley = [], warn = [], fallback = [];
let lastImg = null;
const avFor = (s0, s1) => avwin.find((w) => s0 >= w.s - 0.15 && s1 <= w.e + 0.2);
const avCue = (c, s) => { const w = avFor(s.start, s.end); if (!w) warn.push(`av sin ventana @${s.start.toFixed(1)}`); c.k = "av"; c.src = AV_READY ? AVSRC : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; };
const imgOf = (n) => (ex(`img/${SLUG}/${n}.jpg`) ? `img/${SLUG}/${n}.jpg` : null);
shots.forEach((s, i) => {
  const f0 = F(s.start), f1 = i + 1 < shots.length ? F(shots[i + 1].start) : TOTAL;
  const c = { k: s.kind, from: f0, dur: Math.max(1, f1 - f0), seed: (f0 * 2654435761) >>> 0 };
  if (s.kind === "av") avCue(c, s);
  else if (s.kind === "kf" && process.env.AGNES_KF) {
    const st = `broll/${SLUG}/K${s.name}.mp4`; c.k = "img"; c.img = imgOf("K" + s.name);
    if (ex(st)) { c.clip = st; c.clipF = Math.floor(probeDur(st) * FPS) - 1; c.real = 1; } else { c.fallback = s.name; if (!ACEPT.has(s.name)) fallback.push(s.name); }
    if (!c.img) warn.push(`sin ancla ${s.name}`);
  } else if (s.kind === "pg") { c.k = "img"; c.img = imgOf(s.name); c.real = 1; if (!c.img) warn.push(`falta página ${s.name}`); }
  else if (s.kind === "vl" || s.kind === "kf") {
    const p = `vid/${SLUG}/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = s.kind === "vl" ? Math.max(0, F(s.start - CLIP0[s.name])) : 0; c.real = 1;
      const fo = `vid/${SLUG}/${s.name}_foley.m4a`; if (s.kind === "kf" && ex(fo)) foley.push({ from: f0, dur: c.dur, src: fo }); }
    else if (s.kind === "vl" && avFor(s.start, s.end)) { avCue(c, s); c.fallback = s.name; if (!ACEPT.has(s.name)) fallback.push(s.name); }
    else { c.k = "img"; c.img = imgOf("K" + s.name); c.fallback = s.name; if (!ACEPT.has(s.name)) fallback.push(s.name); if (!c.img) warn.push(`sin ancla ${s.name}`); }
  } else if (s.kind === "bi" || s.kind === "lor") {
    const st = `broll/${SLUG}_st/${s.name}.mp4`;
    c.k = "img"; c.img = imgOf(s.name);
    if (ex(st)) { c.clip = st; c.clipF = Math.floor(probeDur(st) * FPS) - 1; c.real = 1; }
    if (!c.img && !c.clip) warn.push(`falta imagen ${s.name}`);
  } else if (s.kind === "ei") { c.k = "snap"; c.img = imgOf(s.name); if (!c.img) warn.push(`falta snapshot ${s.name}`); }
  else if (s.kind === "c") { c.k = "comp"; c.name = s.name; c.props = s.props || {}; }
  if (c.k === "comp" && ["LorRecipeCard", "LorTwoCards", "LorTrick", "LorSignUpSheet", "LorYear", "LorSafeTemps", "LorVerse", "LorTwoHourClock"].includes(c.name) && !c.props.bed && lastImg) c.props = { ...c.props, bed: lastImg };
  if ((c.k === "img" || c.k === "snap") && c.img) lastImg = c.img;
  for (const o of [s.ov, ...(s.ovs || [])].filter(Boolean)) ovs.push({ from: f0, dur: c.dur, name: o.c, props: o.props });
  cues.push(c);
});
const S = (at, file, vol, dur = 45) => sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol });
cues.forEach((c, i) => {
  const t = c.from / FPS;
  if (t < 60 && i > 0 && c.k !== "av") S(t - 0.12, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.22, 20);
  if (c.k === "comp" && c.name === "LorStepCount") { S(t, "lor_whoosh_airy.mp3", 0.3, 40); S(t + 0.4, "lor_impact.mp3", 0.3, 60); }
  if (c.k === "comp" && ["LorYear", "LorTrick"].includes(c.name)) S(t + 0.2, "text_slam.mp3", 0.28, 40);
  if (c.k === "comp" && /3D$/.test(c.name)) S(t, "lor_swell.mp3", 0.22, 80);
  if (c.k === "comp" && ["LorThermometer", "LorOvenDial"].includes(c.name)) S(t + 0.1, "digit_tick.mp3", 0.25, 40);
  if (c.k === "snap") S(t + 0.15, "lor_paper_pop.mp3", 0.3, 30);
});
for (const o of ovs) S(o.from / FPS + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.25, 20);
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
const flash = cues.filter((c) => c.dur < 15 && c.from > 60 * FPS); if (flash.length) warn.push(`tomas <0,5 s fuera del min 1: ${flash.length}`);
fs.mkdirSync(R + `src/${SLUG}`, { recursive: true });
fs.writeFileSync(R + `src/${SLUG}/timeline.gen.ts`, `// GENERADO por vlog/loretta/gen_timeline.mjs (SLUG=${SLUG}) — no editar a mano
export const TOTAL_FRAMES = ${TOTAL};
export const AUDIO = "${SLUG}.m4a";
export const TL: any[] = ${JSON.stringify(cues)};
export const OV: any[] = ${JSON.stringify(ovs)};
export const SFX: any[] = ${JSON.stringify(sfx)};
export const FOLEY: any[] = ${JSON.stringify(foley)};
`);
const refs = new Set([`${SLUG}.m4a`, "ref_lor.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + `_${SLUG}_assets.txt`, [...refs].filter((r) => ex(r)).join("\n") + "\n");
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 6).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder");
if (fallback.length) console.log("⚠️ repuestos:", fallback.length, fallback.slice(0, 14).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 8).join(" · "));
const real = cues.filter((c) => c.real).reduce((a, c) => a + Math.min(c.dur, c.clipF || c.dur), 0) + cues.filter((c) => c.k === "snap").reduce((a, c) => a + c.dur, 0);
const av = cues.filter((c) => c.k === "av").reduce((a, c) => a + c.dur, 0);
console.log(`metraje REAL (stock + clips LTX + época): ${(100 * real / TOTAL).toFixed(1)} % · avatar ${(100 * av / TOTAL).toFixed(1)} %`);
if (FINAL && (faltan.length || warn.length || fallback.length || !AV_READY)) { console.error("⛔ --final: faltan assets/repuestos/avatar"); process.exit(1); }
