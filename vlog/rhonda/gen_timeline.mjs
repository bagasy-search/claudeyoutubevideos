// _v3/<slug>_shots.json → src/<slug>/timeline.gen.ts (cues en CUADROS exactos, fronteras pegadas) para RhMain, con los assets
// REALES en disco: stock real > clip agnes v2.0 (broll/<slug>/) > foto gpt · vl/kf agnes 2.5 (vid/<slug>/) > repuesto (avatar / foto
// base) · camas de stock ÚNICAS (bd_*) bajo los componentes que dejan ver el fondo nítido · SFX del canal · lista de assets del farm.
// SLUG=x node vlog/rhonda/gen_timeline.mjs [--final]     (--final = falla si falta avatar, un asset o queda un repuesto)
import fs from "node:fs"; import { execFileSync } from "node:child_process";
import { R, SLUG, V3, J } from "./env.mjs";
const PUB = R + "public/", FPS = 30, F = (s) => Math.round(s * FPS), FINAL = process.argv.includes("--final");
const { END, shots, vl } = J(V3 + "shots.json");
const avwin = fs.existsSync(V3 + "avwin.json") ? J(V3 + "avwin.json").win : [];
const ACEPT = new Set(fs.existsSync(V3 + "aceptados.json") ? J(V3 + "aceptados.json") : []);
const ex = (p) => fs.existsSync(PUB + p);
const nFr = (p) => { try { const o = execFileSync("ffprobe", ["-v", "error", "-count_packets", "-select_streams", "v", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }); return +(o.match(/\d+/) || [0])[0]; } catch { return 0; } };
const CLIP0 = {}; for (const [k, v] of Object.entries(vl)) CLIP0[k] = Math.max(0, v.s - 0.03);
const AVSRC = `avatar_clips/${SLUG}/reel30.mp4`, AV_READY = ex(AVSRC);
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], foley = [], warn = [], fallback = [];
let lastBed = null;
const avFor = (s0, s1) => avwin.find((w) => s0 >= w.s - 0.15 && s1 <= w.e + 0.2);
const avCue = (c, s) => { const w = avFor(s.start, s.end); if (!w) warn.push(`av sin ventana @${s.start.toFixed(1)}`); c.k = "av"; c.src = AV_READY ? AVSRC : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; };
const imgOf = (n) => (ex(`img/${SLUG}/${n}.jpg`) ? `img/${SLUG}/${n}.jpg` : null);
// camas de stock para componentes con fondo nítido (cada una se usa UNA vez)
const BEDABLE = new Set(["RhCheck", "RhBookPage", "RhQRCard", "RhMeasureCup", "RhTimer30", "RhChapter", "RhColorCode", "RhNeverMix", "RhDoDont", "RhBleachVsRoots"]);
const beds = (fs.existsSync(R + `vlog/${SLUG}/beds.json`) ? J(R + `vlog/${SLUG}/beds.json`) : []).map((b) => `broll/${SLUG}_st/${b.name}.mp4`).filter(ex);
let bi = 0;
shots.forEach((s, i) => {
  const f0 = F(s.start), f1 = i + 1 < shots.length ? F(shots[i + 1].start) : TOTAL;
  const c = { k: s.kind, from: f0, dur: Math.max(1, f1 - f0), seed: (f0 * 2654435761) >>> 0, name: s.name || undefined };
  if (s.kind === "av") avCue(c, s);
  else if (s.kind === "vl") {
    const p = `vid/${SLUG}/${s.name}.mp4`;
    if (ex(p) && !ACEPT.has(s.name)) { c.src = p; c.sf = Math.max(0, F(s.start - CLIP0[s.name])); c.clip25 = 1; }
    else if (avFor(s.start, s.end)) { avCue(c, s); c.fallback = s.name; if (!ACEPT.has(s.name)) fallback.push(s.name); }
    else { c.k = "img"; c.img = imgOf(s.name); fallback.push(s.name); }
  } else if (s.kind === "kf") {
    const p = `vid/${SLUG}/${s.name}.mp4`;
    if (ex(p)) { c.src = p; c.sf = 0; c.clipF = nFr(p); const fo = `vid/${SLUG}/${s.name}_foley.m4a`; if (ex(fo)) foley.push({ from: f0, dur: Math.min(c.dur, c.clipF), src: fo }); }
    else { c.k = "img"; c.img = imgOf(s.name); c.fallback = s.name; if (!ACEPT.has(s.name)) fallback.push(s.name); if (!c.img) warn.push(`sin foto base ${s.name}`); }
  } else if (s.kind === "bi" || s.kind === "rh") {
    const st = `broll/${SLUG}_st/${s.name}.mp4`, ag = `broll/${SLUG}/${s.name}.mp4`;
    c.k = "img"; c.img = imgOf(s.name);
    if (ex(st)) { c.clip = st; c.clipF = nFr(st) - 1; c.real = 1; }
    else if (ex(ag)) { c.clip = ag; c.clipF = nFr(ag) - 1; }
    if (!c.img && !c.clip) warn.push(`falta imagen ${s.name}`);
  } else if (s.kind === "c") {
    c.k = "comp"; c.props = { ...(s.props || {}) };
    if (!c.props.bed && s.name !== "RhPins" && !/3D$|RimJets/.test(s.name)) {
      if (BEDABLE.has(s.name) && bi < beds.length) { c.props.bed = beds[bi++]; c.bedReal = 1; }
      else if (lastBed) c.props.bed = lastBed;
    }
    if (c.props.bed && /\.mp4$/.test(c.props.bed)) c.props.bed += "#" + nFr(c.props.bed);
  }
  if (c.k === "img") lastBed = c.clip && c.real ? c.img || lastBed : c.img || lastBed;
  if (s.ov) ovs.push({ from: f0, dur: c.dur, name: s.ov.c, props: s.ov.props });
  cues.push(c);
});
// ── sonido (sin música: canal EN): whoosh en los cortes del minuto 1, golpe en cada revelación, ding del reloj, foley de producto
const S = (at, file, vol, dur = 45) => { if (fs.existsSync(PUB + "sfx/" + file)) sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol }); else warn.push("sfx falta " + file); };
cues.forEach((c, i) => {
  const t = c.from / FPS, n = c.name || "";
  if (t < 60 && i > 0 && c.k !== "av" && c.k !== "vl") S(t - 0.1, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.2, 20);
  if (c.k !== "comp") return;
  if (n === "RhChapter") { S(t, "smooth_airy_whoosh_m_#2-1780923688387.mp3", 0.28, 40); S(t + 0.3, c.props.alert ? "stinger_hit.mp3" : "impactful_clean_text_#3-1780924163909.mp3", 0.26, 50); }
  if (/3D$/.test(n)) S(t, "section_swell.mp3", 0.22, 90);
  if (n === "RhToiletCutaway3D" && c.props.mode === "flow") { S(t + 0.4, "px_bubble.mp3", 0.3, 120); S(t + c.dur / FPS * 0.5, "px_fizz.mp3", 0.3, 120); }
  if (n === "RhRimJets") S(t + 0.2, c.props.mode === "spray" ? "px_spray.mp3" : c.props.mode === "fizz" ? "px_fizz_alt1.mp3" : "pin_plop.mp3", 0.3, 90);
  if (n === "RhTimer30") { S(t, "digit_tick.mp3", 0.25, 40); S(t + Math.max(0.5, c.dur / FPS - (c.props.fast ? 0.15 : 0.6)), "yc_bell_short.mp3", 0.32, 45); }
  if (n === "RhMeasureCup") S(t + 0.3, "px_bubble_alt1.mp3", 0.28, 60);
  if (n === "RhNeverMix") S(t + c.dur / FPS * 0.42, "yc_stamp.mp3", 0.34, 30);
  if (n === "RhBookPage") { S(t + 0.15, "yc_paper_tear.mp3", 0.22, 25); S(t + 0.8, "yc_stamp.mp3", 0.3, 30); }
  if (n === "RhQRCard" || n === "RhPins") S(t + 0.3, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.28, 20);
  if (n === "RhCheck") S(t + 0.5, "sfx_paper_tick.mp3", 0.25, 30);
  if (n === "RhBleachVsRoots" || n === "RhColorCode") S(t + 0.2, "gentle_papercard_pop_#2-1780923860389.mp3", 0.28, 30);
  if (n === "RhBottle3D") S(t + 0.2, "px_capPop.mp3", 0.28, 30);
  if (n === "RhDoDont") S(t + 0.4, "impacto_hit.mp3", 0.22, 30);
});
for (const o of ovs) S(o.from / FPS + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.25, 20);
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
fs.mkdirSync(R + `src/${SLUG}`, { recursive: true });
fs.writeFileSync(R + `src/${SLUG}/timeline.gen.ts`, `// GENERADO por vlog/rhonda/gen_timeline.mjs (SLUG=${SLUG}) — no editar a mano
export const TOTAL_FRAMES = ${TOTAL};
export const AUDIO = "${SLUG}.m4a";
export const TL: any[] = ${JSON.stringify(cues)};
export const OV: any[] = ${JSON.stringify(ovs)};
export const SFX: any[] = ${JSON.stringify(sfx)};
export const FOLEY: any[] = ${JSON.stringify(foley)};
`);
const refs = new Set([`${SLUG}.m4a`, `ref_${SLUG}.png`]);
const walk = (o) => { if (typeof o === "string") { o = o.replace(/#\d+$/, ""); if (/^(img|broll|vid|sfx|avatar_clips)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx); walk(foley);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + `_${SLUG}_assets.txt`, [...refs].filter((r) => ex(r)).join("\n") + "\n");
console.log("assets al tar:", refs.size - faltan.length, faltan.length ? `· ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 8).join(" ")}` : "");
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
console.log("cues", cues.length, JSON.stringify(cnt), "· overlays", ovs.length, "· sfx", sfx.length, "· foley", foley.length, "· frames", TOTAL, "· avatar", AV_READY ? "LISTO" : "placeholder", "· camas de stock", bi, "/", beds.length);
if (fallback.length) console.log("⚠️ repuestos:", fallback.length, fallback.slice(0, 14).join(" "));
if (warn.length) console.log("⚠️", warn.length, "avisos:", warn.slice(0, 10).join(" · "));
const stockF = cues.filter((c) => c.real).reduce((a, c) => a + Math.min(c.dur, c.clipF), 0), bedF = cues.filter((c) => c.bedReal).reduce((a, c) => a + c.dur, 0);
const av = cues.filter((c) => c.k === "av").reduce((a, c) => a + c.dur, 0);
const agF = cues.filter((c) => c.clip && !c.real).reduce((a, c) => a + Math.min(c.dur, c.clipF), 0) + cues.filter((c) => c.k === "kf" || c.k === "vl").reduce((a, c) => a + c.dur, 0);
console.log(`metraje REAL: ${(100 * (stockF + bedF) / TOTAL).toFixed(1)} % (stock en toma ${(100 * stockF / TOTAL).toFixed(1)} % + camas de stock bajo tarjetas nítidas ${(100 * bedF / TOTAL).toFixed(1)} %) · avatar ${(100 * av / TOTAL).toFixed(1)} % · clips agnes ${(100 * agF / TOTAL).toFixed(1)} %`);
if (FINAL && (faltan.length || warn.length || fallback.filter((n) => !ACEPT.has(n)).length || !AV_READY)) { console.error("⛔ --final: faltan assets/repuestos/avatar"); process.exit(1); }
