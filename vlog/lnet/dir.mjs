// DIRECTOR automático de la red Loretta: guiones/<slug>_filmado.txt ([SEC | v1 ;; v2 ...] texto) + tiempos reales (paras/wordms)
// → _v3/<slug>_shots.json (mismo esquema que vlog/loretta/timeline.mjs) + _v3/<slug>_ovs.json (overlays con tiempo)
// + listas: _v3/<slug>_lor.json (gpt con cara) · _v3/<slug>_agn.json (agnes sin cara) · _v3/<slug>_i2v.json (clips agnes).
//   SLUG=x node vlog/lnet/dir.mjs
// Visuales: av · pg N [t|m|b] · lor <escena> · bi <escena> · cl <escena> >> <movimiento> · st <búsqueda> >> <escena>
//           ei <año> >> <escena> · card <título> >> l1 / l2 · temps · mix · qr · next      overlays: +name +care <txt> +mix +ask <txt> +sub
// Reglas: corte 40 ms antes de la palabra · planos 5-15 s (min 1: desde 3,5 s) · avatar total ≤ AV_MAX (560 s) conservando
// gancho, CTAs, aperturas de capítulo y cierre · plano fijo >16 s se parte con una foto de Loretta del pozo genérico.
import fs from "node:fs";
import { CANAL, VIDEO } from "./canales.mjs";
import { POOL } from "./pool.mjs";
const R = "D:/Proyectos/video2-wt/lnet/", SLUG = process.env.SLUG; if (!SLUG) { console.error("falta SLUG"); process.exit(1); }
const V3 = R + "_v3/" + SLUG + "_", J = (f) => JSON.parse(fs.readFileSync(f, "utf8")), WR = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 1));
const V = VIDEO[SLUG], C = CANAL[V.ch], CARDS = J(R + "_v3/lnet_cards.json");
const P = J(V3 + "paras.json"), W = J(V3 + "wordms.json"), END = W[W.length - 1].e + 0.6;
const AV_MAX = +process.env.AV_MAX || 560;
const WHO = "Loretta, an 81-year-old woman with short curly white hair, thin wire-rimmed glasses, a small pearl necklace, a lilac cardigan over a lilac blouse and a faded floral apron with a green trim, old hands with age spots";
const KIT = "in her 1950s white farmhouse kitchen with a white enamel stove, yellow checked curtains, a small wooden cross on the wall and a floury wooden table";
const TAIL = " One ordinary frame from a normal home video shot at eye level with a consumer camera, casual slightly imperfect framing. Almost everything in focus, the background readable with ordinary everyday objects. Only the light the place really has, correctly exposed, true-to-life colors, real materials with wear and use. No text, no letters, no labels, no logos.";
const LORP = (sc) => { let s = sc.replace(/^Loretta\b/, WHO); if (!/kitchen|bathroom|laundry|porch|church|garden|yard|pew|hallway|bedroom|closet|living room|farmhouse|stove|sink|table/i.test(s)) s += " " + KIT; return s + " Her face is the face of the reference image: same face, same age, same glasses, not younger, not prettier." + TAIL; };
const AGN = (sc) => sc.replace(/\.?\s*$/, ".") + " Everything in the picture is in focus. No text, no letters, no labels, no logos anywhere.";
const EIP = (y, sc) => `A faded color family snapshot taken around ${y} in small-town rural Iowa: ${sc.replace(/\.?\s*$/, "")}. Ordinary Midwestern people caught mid-action, nobody posing, the room around them readable. Faded warm colors of an old print. No text, no letters, no signs, no logos.`;
const SUB = { ck: "81 · church supper cook · Iowa", fo: "81 · cooking for one · Iowa", cl: "81 · church lady · Iowa", fh: "81 · Iowa farm wife", su: "81 · 60 years in the same pew" }[V.ch];
const wstart = W.map((w) => w.s);
const snap = (x, lo, hi) => { let b = null; for (const s of wstart) { if (s <= lo + 0.3 || s >= hi - 0.3) continue; if (b === null || Math.abs(s - x) < Math.abs(b - x)) b = s; } return b === null ? x : b - 0.04; };
const shots = [], ovs = [], warn = [];
let gi = 0; const gen0 = () => { const g = POOL[V.ch][gi % POOL[V.ch].length]; gi++; return { kind: "lor", name: `g${String(gi).padStart(2, "0")}`, prompt: LORP(g), gen: 1 }; };
// relleno: la página REAL del capítulo en curso (zona rotando, máx. 3 usos por página y nunca la misma zona dos veces) → si no, foto genérica
const chap = []; { let c = 0; P.forEach((p, i) => { if (p.sec.includes("@")) c = i; chap[i] = c; }); }
const pgOf = (i) => { const m = /\bpg (\d+)/; for (let j = i; j >= Math.max(0, chap[i] - 12); j--) { const x = (P[j].act || "").match(m); if (x) return +x[1]; } for (let j = i + 1; j < P.length && chap[j] === chap[i]; j++) { const x = (P[j].act || "").match(m); if (x) return +x[1]; } return null; };
const pgUse = {}; let fi = 0;
const gen = (pi) => {
  const n = pi == null ? null : pgOf(pi); if (process.env.DBG) console.log("gen", pi, n, JSON.stringify(pgUse[n] || []));
  if (n) { const used = (pgUse[n] ||= []); const f = ["t", "m", "b", ""].find((z) => !used.includes(z)); if (f !== undefined && used.length < 4) { used.push(f); fi++; return { kind: "c", name: "LorPage", nm: "f" + fi, props: { src: `pages/${C.bk}/p${n}.jpg`, page: n, tag: C.tag, focus: f, seed: 900 + fi }, page: 1 }; } }
  return gen0();
};

const parseV = (tok, pi, k) => {
  const t = tok.trim(), name = `${pi.toString().padStart(3, "0")}_${k}`;
  const [kind, ...rest] = t.split(/\s+/); const arg = rest.join(" ");
  if (kind === "av") return { kind: "av", name: "" };
  if (kind === "pg") { const [n, f] = arg.split(/\s+/); return { kind: "c", name: "LorPage", nm: "p" + name, props: { src: `pages/${C.bk}/p${n}.jpg`, page: +n, tag: C.tag, focus: f || "", seed: pi * 7 + k }, page: 1 }; }
  if (kind === "lor") return { kind: "lor", name: "l" + name, prompt: LORP(arg) };
  if (kind === "bi") return { kind: "bi", name: "b" + name, prompt: AGN(arg) };
  if (kind === "cl") { const [sc, mo] = arg.split(">>").map((x) => x.trim()); return { kind: "cl", name: "c" + name, prompt: AGN(sc), motion: mo || "a small slow natural movement", person: /hand|loretta|woman|man\b|people|lady|ladies|farmer|child|girl|boy|finger/i.test(sc) }; }
  if (kind === "st") { const [q, sc] = arg.split(">>").map((x) => x.trim()); return { kind: "bi", name: "s" + name, q, prompt: AGN(sc || q) }; }
  if (kind === "ei") { const [y, sc] = arg.split(">>").map((x) => x.trim()); return { kind: "ei", name: "e" + name, prompt: EIP(y, sc) }; }
  if (kind === "card") { const [ti, ls] = arg.split(">>").map((x) => x.trim()); return { kind: "c", name: "LorList", props: { title: ti, lines: (ls || "").split(" / ").map((x) => x.trim()).filter(Boolean), seed: pi } }; }
  if (kind === "temps") return { kind: "c", name: "LorSafeTemps", props: {} };
  if (kind === "mix") return { kind: "c", name: "LorNeverMix", props: {} };
  if (kind === "qr") return { kind: "c", name: "LorQR", props: { qr: `qr/${SLUG}.png`, cover: `pages/${C.bk}/p1.jpg`, book: C.book }, qr: 1 };
  if (kind === "next") { const nx = CARDS[V.next], nt = CARDS[V.net]; return { kind: "c", name: "LorNext", props: { next: { title: nx.title, thumb: `thumbs/${V.next}.jpg` }, net: { title: nt.title, thumb: `thumbs/${V.net}.jpg`, channel: CANAL[VIDEO[V.net].ch].name } } }; }
  warn.push(`p${pi} visual desconocido: ${t.slice(0, 40)}`); return null;
};

const keepAv = (p, i) => i === 0 || /^(CTA|RECAP|NEXT|END|HOOK)/.test(p.sec) || p.sec.includes("@");
P.forEach((p, i) => {
  const s0 = i === 0 ? 0 : p.s - 0.04, s1 = i + 1 < P.length ? P[i + 1].s - 0.04 : END;
  const toks = p.act.split(";;").map((x) => x.trim()).filter(Boolean);
  const vis = [];
  toks.forEach((t, k) => {
    const [base, ...ovl] = t.split(/\s\+(?=[a-z])/);
    for (const o of ovl) {
      const [on, ...ot] = o.split(/\s+/); const txt = ot.join(" ");
      if (on === "name") ovs.push({ s: s0 + 0.3, e: Math.min(s1, s0 + 6.5), name: "LorNameTag", props: { name: "Loretta", sub: SUB } });
      else if (on === "care") ovs.push({ s: s0 + 0.4, e: Math.max(s1 - 0.1, s0 + 6), name: "LorCareful", props: { text: txt } });
      else if (on === "mix") ovs.push({ s: s0 + 0.3, e: Math.max(s1 - 0.1, s0 + 6), name: "LorMixMini", props: {} });
      else if (on === "ask") ovs.push({ s: s0 + 1, e: s1 - 0.2, name: "LorAsk", props: { text: txt, sub: "Tell me in the comments" } });
      else if (on === "sub") ovs.push({ s: s0 + 0.5, e: s1, name: "LorSubscribe", props: { text: "Subscribe", sub: C.full } });
    }
    const v = parseV(base, i, k); if (v) vis.push(v);
  });
  if (!vis.length) vis.push({ kind: "av", name: "" });
  if (i === 0 && vis[0].kind !== "av") { vis.unshift({ kind: "av", name: "" }); warn.push("p0 sin av al inicio: agregado"); }
  const L = s1 - s0, MIN = s0 < 60 ? 3.5 : 5;
  // pesos: el avatar pesa menos en párrafos mixtos; qr pide 9 s
  let list = vis.slice();
  while (list.length > 1 && L / list.length < MIN) list.pop();
  const wgt = list.map((v) => (v.kind === "av" && list.length > 1 ? 0.65 : 1));
  const tot = wgt.reduce((a, b) => a + b, 0);
  let t = s0;
  list.forEach((v, k) => {
    let e = k === list.length - 1 ? s1 : snap(t + (L * wgt[k]) / tot, t + MIN * 0.8, s1 - MIN * 0.8);
    shots.push({ ...v, p: i, sec: p.sec, start: +t.toFixed(3), end: +e.toFixed(3), keep: keepAv(p, i) });
    t = e;
  });
});
// QR: al menos 9 s en pantalla (se come el comienzo del plano siguiente)
for (let i = 0; i < shots.length; i++) if (shots[i].qr && shots[i].end - shots[i].start < 9) {
  const want = shots[i].start + 9; let j = i + 1;
  while (j < shots.length && shots[j].end <= want + 3) { shots.splice(j, 1); }
  shots[i].end = want; if (shots[j]) shots[j].start = want;
}
console.log('  avatar inicial', shots.filter((s) => s.kind === 'av').reduce((a, s) => a + s.end - s.start, 0).toFixed(0), 's');
const avSum = () => shots.filter((s) => s.kind === "av").reduce((a, s) => a + s.end - s.start, 0);
// tope de avatar: primero se cae el avatar de párrafos mixtos no prioritarios (el más largo primero), después los av solos se parten
let guard = 0;
while (avSum() > AV_MAX && guard++ < 400) {
  const mixed = shots.map((s, i) => [s, i]).filter(([s, i]) => s.kind === "av" && !s.keep && shots.some((o, j) => j !== i && o.p === s.p)).sort((a, b) => (b[0].end - b[0].start) - (a[0].end - a[0].start));
  if (mixed.length) { const [s, i] = mixed[0]; const nb = shots[i + 1] && shots[i + 1].p === s.p ? shots[i + 1] : shots[i - 1]; if (nb === shots[i + 1]) nb.start = s.start; else nb.end = s.end; shots.splice(i, 1); continue; }
  const solo = shots.map((s, i) => [s, i]).filter(([s]) => s.kind === "av" && !s.keep && !s.cut).sort((a, b) => (b[0].end - b[0].start) - (a[0].end - a[0].start));
  const cand = solo.length ? solo : shots.map((s, i) => [s, i]).filter(([s]) => s.kind === "av" && s.p > 0 && !s.cut && s.end - s.start > 8).sort((a, b) => (b[0].end - b[0].start) - (a[0].end - a[0].start));
  if (!cand.length) break;
  const [s, i] = cand[0]; const d = s.end - s.start;
  if (d < 6) { shots.splice(i, 1, { ...gen(s.p), p: s.p, sec: s.sec, start: s.start, end: s.end }); continue; }
  const exc = avSum() - AV_MAX, keepD = Math.max(3.2, Math.min(d * 0.6, d - exc - 0.5));
  const cut = snap(s.start + keepD, s.start + 3, s.end - 4);
  s.cut = 1; shots.splice(i + 1, 0, { ...gen(s.p), p: s.p, sec: s.sec, start: +cut.toFixed(3), end: s.end }); s.end = +cut.toFixed(3);
}
// planos largos: avatar >18 s o foto/página >16 s → se parten con una foto de Loretta del pozo (componentes y qr quedan)
for (let i = 0; i < shots.length; i++) {
  const s = shots[i], d = s.end - s.start, lim = s.kind === "av" ? 22 : 16;
  if (d <= lim || (s.kind === "c" && s.name !== "LorPage")) continue;
  const cut = snap(s.start + d / 2, s.start + 6, s.end - 6);
  shots.splice(i + 1, 0, { ...gen(s.p), p: s.p, sec: s.sec, start: +cut.toFixed(3), end: s.end }); s.end = +cut.toFixed(3);
}
shots[0].start = 0;
shots.forEach((s, i) => { s.end = i + 1 < shots.length ? shots[i + 1].start : END; s.dur = +(s.end - s.start).toFixed(3); if (s.nm) { s.name = "LorPage"; } });
// salida en el esquema de timeline.mjs
const out = shots.map((s) => {
  const o = { kind: s.kind === "cl" ? "bi" : s.kind, name: s.kind === "c" ? s.name : s.name, p: s.p, start: s.start, end: s.end, dur: s.dur };
  if (s.kind === "c") o.props = s.props; if (s.prompt) o.prompt = s.prompt; if (s.q) o.q = s.q; if (s.kind === "cl") { o.clip = 1; o.motion = s.motion; o.person = s.person; }
  if (s.page) o.page = 1; if (s.gen) o.gen = 1; return o;
});
WR(V3 + "shots.json", { END, shots: out, vl: {} });
WR(V3 + "ovs.json", ovs.map((o) => ({ ...o, s: +o.s.toFixed(3), e: +Math.min(o.e, END).toFixed(3) })));
const lor = [], agn = [], i2v = [], seen = new Set();
for (const s of out) {
  if (!s.prompt || seen.has(s.name)) continue; seen.add(s.name);
  if (s.kind === "lor") lor.push({ name: s.name, prompt: s.prompt, ref: "public/ref_lor_face.png" });
  else agn.push({ name: s.name, prompt: s.prompt });
  if (s.clip) i2v.push({ nombre: s.name, motion: s.motion, ...(s.person ? { person: true } : {}) });
}
WR(V3 + "lor.json", lor); WR(V3 + "agn.json", agn); WR(V3 + "i2v.json", i2v);
// reporte
const by = {}; for (const s of out) { const k = s.page ? "pagina" : s.kind === "c" ? "comp" : s.clip ? "clip" : s.q ? "stock" : s.gen ? "lor_gen" : s.kind; by[k] = (by[k] || 0) + s.dur; }
console.log(`${SLUG}: tomas ${out.length} · dur ${END.toFixed(1)} s · avatar ${avSum().toFixed(1)} s (tope ${AV_MAX})`);
console.log("  " + Object.entries(by).map(([k, v]) => `${k} ${v.toFixed(0)}s ${(100 * v / END).toFixed(1)}%`).join(" · "));
const m1 = out.filter((s) => s.start < 60); const lg = out.filter((s) => s.dur > 18 && s.kind !== "c");
console.log(`  min 1: ${m1.length - 1} cortes · planos >18 s fuera de componentes: ${lg.length} · media ${(END / out.length).toFixed(1)} s · gpt cara ${lor.length} · agnes ${agn.length} · clips ${i2v.length} · stock ${out.filter((s) => s.q).length} · overlays ${ovs.length}`);
if (warn.length) console.log("  ⚠️ " + warn.join(" | "));
