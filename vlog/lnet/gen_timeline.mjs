// _v3/<slug>_shots.json + _ovs.json → src/<slug>/timeline.gen.ts para LorMain (red Loretta). Cues en CUADROS exactos, fronteras pegadas.
// Asset por toma: av → reel único RunPod · bi → stock real (broll/<slug>_st) > clip agnes (broll/<slug>) > foto (img/<slug>) ·
// lor/ei → foto · c → componente Lor* (LorPage = página real del libro). SLUG=x node vlog/lnet/gen_timeline.mjs [--final]
import fs from "node:fs"; import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/lnet/", SLUG = process.env.SLUG, V3 = R + "_v3/" + SLUG + "_";
const J = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const PUB = R + "public/", FPS = 30, F = (s) => Math.round(s * FPS), FINAL = process.argv.includes("--final");
const { END, shots } = J(V3 + "shots.json"), OVS = fs.existsSync(V3 + "ovs.json") ? J(V3 + "ovs.json") : [];
const avwin = fs.existsSync(V3 + "avwin.json") ? J(V3 + "avwin.json").win : [];
const ex = (p) => fs.existsSync(PUB + p);
const frames = (p) => { try { return Math.floor(+execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + p], { encoding: "utf8", windowsHide: true }).trim() * FPS) - 1; } catch { return 0; } };
const AVSRC = `avatar_clips/${SLUG}/reel30.mp4`, AV_READY = ex(AVSRC);
const TOTAL = F(END + 0.4);
const cues = [], ovs = [], sfx = [], warn = [];
const avFor = (s0, s1) => avwin.find((w) => s0 >= w.s - 0.15 && s1 <= w.e + 0.2);
const imgOf = (n) => (ex(`img/${SLUG}/${n}.jpg`) ? `img/${SLUG}/${n}.jpg` : null);
shots.forEach((s, i) => {
  const f0 = F(s.start), f1 = i + 1 < shots.length ? F(shots[i + 1].start) : TOTAL;
  const c = { k: s.kind, from: f0, dur: Math.max(1, f1 - f0), seed: (f0 * 2654435761) >>> 0 };
  if (s.kind === "av") { const w = avFor(s.start, s.end); if (!w) warn.push(`av sin ventana @${s.start.toFixed(1)}`); c.src = AV_READY ? AVSRC : null; c.sf = w ? F(s.start - w.ms + w.off + (w.lag || 0)) : 0; }
  else if (s.kind === "bi" || s.kind === "lor" || s.kind === "ei") {
    c.k = s.kind === "ei" ? "snap" : "img"; c.img = imgOf(s.name);
    const st = `broll/${SLUG}_st/${s.name}.mp4`, ag = `broll/${SLUG}/${s.name}.mp4`;
    if (s.kind === "bi" && ex(st)) { c.clip = st; c.clipF = frames(st); c.real = 1; }
    else if (s.kind === "bi" && s.clip && ex(ag)) { c.clip = ag; c.clipF = frames(ag); }
    if (!c.img && !c.clip) warn.push(`falta imagen ${s.name}`);
    if (c.clip && !c.img) c.img = c.clip.replace(/\.mp4$/, "_last.jpg");
  } else if (s.kind === "c") { c.k = "comp"; c.name = s.name; c.props = s.props || {}; if (s.page) c.page = 1; for (const v of Object.values(c.props)) if (typeof v === "string" && /\.(jpg|png)$/.test(v) && !ex(v)) warn.push(`falta ${v}`); }
  cues.push(c);
});
// ⛔ 9-oct: InfiniteTalk (RunPod público) DEGRADA el reel largo (limpio hasta ~180 s, visible 240, feo 280+: libro en mosaico,
// brillo arcoíris en la tartera; medido en fhmice y suhouse). Las ventanas de avatar que pasan AV_MAX_OFF s de reel van con la
// foto del tema más cercana (antes/después) y la voz sigue igual. Default 240 en --final; AV_MAX_OFF=0 lo apaga.
const AVMAX = Number(process.env.AV_MAX_OFF ?? (FINAL ? 240 : 0));
if (AVMAX > 0) {
  const imgAt = (i, dir) => { for (let j = i + dir; j >= 0 && j < cues.length; j += dir) if (cues[j].k === "img" && cues[j].img && !cues[j].clip && !cues[j].avcut) return cues[j].img; return null; };
  let n = 0;
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    if (c.k !== "av" || (c.sf + c.dur) / FPS <= AVMAX) continue;
    const a = imgAt(i, -1) || imgAt(i, 1), b = imgAt(i, 1) || a;
    if (!a) continue;
    n++;
    if (c.dur > 12 * FPS && b !== a) {   // ventana larga: dos fotos (la de antes y la de después)
      const h = Math.round(c.dur / 2), d = { k: "img", img: b, from: c.from + h, dur: c.dur - h, seed: c.seed + 7, avcut: 1 };
      Object.assign(c, { k: "img", img: a, dur: h, avcut: 1 }); delete c.src; delete c.sf;
      cues.splice(i + 1, 0, d); i++;
    } else { Object.assign(c, { k: "img", img: a, avcut: 1 }); delete c.src; delete c.sf; }
  }
  if (n) console.log(`  avatar degradado: ${n} ventanas pasadas los ${AVMAX} s de reel → foto del tema`);
}
for (const o of OVS) { const f0 = F(o.s), f1 = Math.min(TOTAL, F(o.e)); if (f1 - f0 > 20) ovs.push({ from: f0, dur: f1 - f0, name: o.name, props: o.props }); }
const S = (at, file, vol, dur = 45) => sfx.push({ from: Math.max(0, F(at)), dur, src: "sfx/" + file, vol });
cues.forEach((c, i) => {
  const t = c.from / FPS;
  if (t < 60 && i > 0 && c.k !== "av") S(t - 0.12, i % 2 ? "whoosh.mp3" : "sfx_whoosh_soft.mp3", 0.2, 20);
  if (c.k === "comp" && c.name === "LorPage") S(t + 0.05, "lor_paper_pop.mp3", 0.22, 30);
  if (c.k === "comp" && ["LorQR", "LorNext", "LorList", "LorSafeTemps", "LorNeverMix"].includes(c.name)) S(t + 0.1, "lor_whoosh_airy.mp3", 0.25, 40);
  if (c.k === "snap") S(t + 0.15, "lor_paper_pop.mp3", 0.25, 30);
});
for (const o of ovs) if (o.name === "LorCareful" || o.name === "LorMixMini") S(o.from / FPS + 0.2, "floraphonic-minimal-pop-click-ui-1-198301.mp3", 0.22, 20);
const gaps = []; for (let i = 1; i < cues.length; i++) if (cues[i].from !== cues[i - 1].from + cues[i - 1].dur) gaps.push(i);
if (gaps.length) { console.error("⛔ fronteras con hueco/solape:", gaps.slice(0, 10)); process.exit(1); }
fs.mkdirSync(R + `src/${SLUG}`, { recursive: true });
fs.writeFileSync(R + `src/${SLUG}/timeline.gen.ts`, `// GENERADO por vlog/lnet/gen_timeline.mjs (SLUG=${SLUG}) — no editar a mano
export const TOTAL_FRAMES = ${TOTAL};
export const AUDIO = "${SLUG}.m4a";
export const TL: any[] = ${JSON.stringify(cues)};
export const OV: any[] = ${JSON.stringify(ovs)};
export const SFX: any[] = ${JSON.stringify(sfx)};
export const FOLEY: any[] = [];
`);
const refs = new Set([`${SLUG}.m4a`, "ref_lor.png"]);
const walk = (o) => { if (typeof o === "string") { if (/^(img|broll|vid|sfx|avatar_clips|pages|qr|thumbs)\/.+\.(jpg|png|mp4|m4a|mp3|wav)$/.test(o)) refs.add(o); } else if (o && typeof o === "object") Object.values(o).forEach(walk); };
walk(cues); walk(ovs); walk(sfx);
for (const c of cues) if (c.clip && c.clipF < c.dur) refs.add(c.clip.replace(/\.mp4$/, "_last.jpg"));
const faltan = [...refs].filter((r) => !ex(r));
fs.writeFileSync(R + `_${SLUG}_assets.txt`, [...refs].filter((r) => ex(r)).join("\n") + "\n");
fs.writeFileSync(R + `_v3/${SLUG}_cues.json`, JSON.stringify(cues.filter((c) => c.clip).map((c) => ({ key: c.clip, src: c.clip, start: c.from / FPS, dur: Math.min(c.dur, c.clipF || c.dur) / FPS }))));   // la compuerta de repetición de agnes_qc (el resto del plano es el _last.jpg congelado, no un loop)
const cnt = {}; for (const c of cues) cnt[c.k] = (cnt[c.k] || 0) + 1;
const sum = (fn) => cues.filter(fn).reduce((a, c) => a + Math.min(c.dur, c.clipF || c.dur), 0);
const stock = sum((c) => c.real), pages = cues.filter((c) => c.page).reduce((a, c) => a + c.dur, 0), av = cues.filter((c) => c.k === "av").reduce((a, c) => a + c.dur, 0);
console.log(`${SLUG}: cues ${cues.length} ${JSON.stringify(cnt)} · overlays ${ovs.length} · sfx ${sfx.length} · frames ${TOTAL} (${(TOTAL / FPS / 60).toFixed(2)} min) · avatar ${AV_READY ? "LISTO" : "placeholder"} · assets ${refs.size - faltan.length}${faltan.length ? ` · ⛔ FALTAN ${faltan.length}: ${faltan.slice(0, 5).join(" ")}` : ""}`);
console.log(`  metraje REAL: stock ${(100 * stock / TOTAL).toFixed(1)} % + páginas del libro ${(100 * pages / TOTAL).toFixed(1)} % = ${(100 * (stock + pages) / TOTAL).toFixed(1)} % · avatar ${(av / FPS).toFixed(0)} s (${(100 * av / TOTAL).toFixed(1)} %)`);
if (warn.length) console.log("  ⚠️", warn.length, "avisos:", warn.slice(0, 6).join(" · "));
if (FINAL && (faltan.length || warn.length || !AV_READY)) { console.error("⛔ --final: faltan assets/avatar"); process.exit(1); }
