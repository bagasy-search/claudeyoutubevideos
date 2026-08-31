// gen_fedcereal.mjs — beatsheet de "¿Más de 60? Este CEREAL Olvidado Reconstruye tu Músculo"
// Canal "Federer Archivos" · kit CLÍNICO _fed6 · card cereal-musculo
//
// ⛔ AVATAR PARCIAL: el creador grabó 0..673.62s de un máster de 2759.43s.
//    En la ZONA FISH los labios NO sincronizan → el avatar va EN BUCLE, MUTEADO y NUNCA a la vista:
//    cada momento se cubre al 100% (clip i2v + clip t2v quieto + foto de cola).
// ⛔ Cada asset está anclado a UNA FRASE VERBATIM del guion: el plano muestra lo que se dice
//    en ESE segundo. Se indexa por momento, nunca por contador corrido.
import fs from "fs";
import { spawnSync } from "child_process";
import { CMP } from "./_cmp_fedcereal.mjs";

const SLUG = "fedcereal";
const VIDEO_END = 2759.43;
const AVATAR_END = 673.62;
const HERO_CAP = 4.2;          // foto en zona avatar
const FISH_PHOTO_CAP = 6.0;    // foto en zona fish (no hay avatar de respaldo)
const ZOOM_OK = 0.055;         // |escala-1| tolerada para reusar un clip t2v

const has = (p) => fs.existsSync("public/" + p);
const probeDur = (p) => {
  if (!fs.existsSync(p)) return 0;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat((r.stdout || "").trim());
  return isFinite(d) ? d : 0;
};

// ── captions (anclaje por frase) ─────────────────────────────────────────────
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
const GUION = fs.readFileSync("GUION_fedcereal.txt", "utf8").replace(/^\uFEFF/, "");
const hintDe = (phrase) => {
  const i = GUION.indexOf(phrase);
  if (i < 0) return null;
  return (i / GUION.length) * VIDEO_END;
};
const findMs = (phrase, after = 0, hint = null) => {
  const toks = norm(phrase || "").split(" ").filter(Boolean);
  if (toks.length < 2) return null;
  // 1) match EXACTO de las primeras 7 palabras
  const p = toks.slice(0, 7);
  const exactos = [];
  for (let i = 0; i <= CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) exactos.push(CW[i].s);
  }
  if (exactos.length) {
    if (hint == null) return exactos[0];
    return exactos.reduce((m, x) => (Math.abs(x - hint) < Math.abs(m - hint) ? x : m), exactos[0]);
  }
  // 2) FALLBACK: Whisper escribe DÍGITOS donde el guion dice la palabra ("setenta y cuatro" -> "74"),
  //    y se come/agrega puntuación. Buscamos la ventana que más palabras del ancla contenga EN ORDEN,
  //    ignorando los tokens numéricos. Sin esto se perdían 49 momentos y 9 componentes.
  const NUM = new Set(["cero","un","uno","una","dos","tres","cuatro","cinco","seis","siete","ocho","nueve",
    "diez","once","doce","trece","catorce","quince","dieciseis","diecisiete","dieciocho","diecinueve",
    "veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa","cien","ciento",
    "cientos","quinientos","mil","y","de","la","el","los","las"]);
  const clave = toks.slice(0, 10).filter((t) => !NUM.has(t) && !/^\d+$/.test(t));
  if (clave.length < 2) return null;
  // ⛔ el arranque puede ser la 1ª, 2ª o 3ª clave (Whisper conjuga distinto: "poné"->"pon"),
  //    y entonces la alineación TIENE que empezar en esa clave, no en la 0: si no, el score da 0.
  let mejor = null, mejorPunt = 0;
  const VENTANA = 150;   // s de tolerancia alrededor de la posición esperada
  for (let i = 0; i < CW.length; i++) {
    if (CW[i].s < after) continue;
    if (hint != null && Math.abs(CW[i].s - hint) > VENTANA) continue;
    for (let c = 0; c < Math.min(3, clave.length); c++) {
      if (CW[i].t !== clave[c]) continue;
      let j = i, k = c, hits = 0;
      const restan = clave.length - c;
      const tope = Math.min(CW.length, i + restan + 10);
      while (j < tope && k < clave.length) {
        if (CW[j].t === clave[k]) { hits++; k++; }
        j++;
      }
      const punt = hits / restan;
      if (punt > mejorPunt) { mejorPunt = punt; mejor = CW[i].s; }
      break;
    }
    if (mejorPunt === 1) break;
  }
  return mejorPunt >= 0.5 ? mejor : null;
};

// ── momentos: a-series (agnes) + f-series (fotos del Dr. Federer, gpt-image) ──
const A = JSON.parse(fs.readFileSync(`_v3/${SLUG}_moments.json`, "utf8").replace(/^﻿/, ""));
const F = fs.existsSync(`_v3/${SLUG}_federer.json`)
  ? JSON.parse(fs.readFileSync(`_v3/${SLUG}_federer.json`, "utf8").replace(/^﻿/, "")) : [];
const ZOOM = fs.existsSync(`_${SLUG}_zoom.json`) ? JSON.parse(fs.readFileSync(`_${SLUG}_zoom.json`, "utf8")) : {};

const crudos = [];
for (const it of A) crudos.push({ n: it.name.replace(`${SLUG}_`, ""), at: it.at, tipo: "a" });
for (const it of F) crudos.push({ n: it.name.replace(`${SLUG}_`, ""), at: it.at, tipo: "f" });

const MOM = [];
const sinAncla = [];
for (const c of crudos) {
  const ms = findMs(c.at, 0, hintDe(c.at));
  if (ms == null) { sinAncla.push(`${c.n} :: ${c.at}`); continue; }
  MOM.push({ ...c, ms });
}
MOM.sort((x, y) => x.ms - y.ms);
// dedup por ms (dos anclas en la misma palabra)
const MOMS = MOM.filter((m, i) => i === 0 || m.ms - MOM[i - 1].ms > 0.4);

const N = MOMS.length;
const nextStart = (i) => (i + 1 < N ? MOMS[i + 1].ms : VIDEO_END);

// rutas de archivo
const fotoDe = (m) => {
  if (m.tipo === "f") return has(`img/${SLUG}_${m.n}.png`) ? `img/${SLUG}_${m.n}.png`
    : has(`img/${SLUG}_${m.n}.jpg`) ? `img/${SLUG}_${m.n}.jpg` : null;
  return has(`img/${SLUG}_${m.n}_p.jpg`) ? `img/${SLUG}_${m.n}_p.jpg`
    : has(`img/${SLUG}_${m.n}_p.png`) ? `img/${SLUG}_${m.n}_p.png` : null;
};
const clipI2V = (m) => (m.tipo === "a" && has(`broll/${SLUG}_${m.n}.mp4`) ? `broll/${SLUG}_${m.n}.mp4` : null);
const clipT2V = (m) => {
  if (m.tipo !== "a") return null;
  const p = `broll_t2v_fc/${SLUG}_${m.n}.mp4`;
  if (!has(p)) return null;
  const z = ZOOM[`${SLUG}_${m.n}`];
  if (z == null || Math.abs(z - 1) > ZOOM_OK) return null;   // ⛔ el que hace zoom NO entra
  return p;
};
// G(n) para los componentes: la foto de ese momento
const G = (n) => {
  if (/^lam/.test(n)) return has(`img/${SLUG}_${n}.jpg`) ? `img/${SLUG}_${n}.jpg` : `img/${SLUG}_${n}.png`;
  if (/^f\d/.test(n)) return has(`img/${SLUG}_${n}.png`) ? `img/${SLUG}_${n}.png` : `img/${SLUG}_${n}.jpg`;
  return has(`img/${SLUG}_${n}_p.jpg`) ? `img/${SLUG}_${n}_p.jpg` : `img/${SLUG}_${n}_p.png`;
};

// ── capa de contenido ────────────────────────────────────────────────────────
const beats = [], BROLL = [], COVER = [];
let nI2V = 0, nT2V = 0, nFoto = 0, nAvatar = 0;

for (let i = 0; i < N; i++) {
  const m = MOMS[i];
  const st = m.ms;
  const slot = +(nextStart(i) - st).toFixed(2);
  const zonaFish = st >= AVATAR_END;
  let t = st, resto = slot;

  // 1) clip i2v (encuadre clavado, animación de la foto exacta del momento)
  const c1 = clipI2V(m);
  if (c1 && resto > 1.0) {
    const real = probeDur("public/" + c1) || 5.04;
    const cov = +Math.max(1.0, Math.min(resto, real - 0.12)).toFixed(2);
    beats.push({ id: m.n, start: +t.toFixed(2), dur: +resto.toFixed(2), cov, key: "s", kind: "raw", src: c1, snd: 1 });
    BROLL.push({ name: m.n, src: c1, start: +t.toFixed(2), dur: cov, cov, snd: 1, query: m.at.slice(0, 70) });
    COVER.push({ start: +t.toFixed(2), cov, kind: "video", src: c1 });
    t = +(t + cov).toFixed(2); resto = +(slot - (t - st)).toFixed(2); nI2V++;
  }

  // 2) segundo plano del MISMO momento: el t2v que NO hace zoom
  const c2 = clipT2V(m);
  if (c2 && resto > 1.6) {
    const real = probeDur("public/" + c2) || 4.04;
    const cov = +Math.max(1.2, Math.min(resto, real - 0.12)).toFixed(2);
    beats.push({ id: m.n + "_v2", start: +t.toFixed(2), dur: +resto.toFixed(2), cov, key: "s", kind: "raw", src: c2, snd: 1 });
    BROLL.push({ name: m.n + "_v2", src: c2, start: +t.toFixed(2), dur: cov, cov, snd: 1, query: m.at.slice(0, 70) });
    COVER.push({ start: +t.toFixed(2), cov, kind: "video", src: c2 });
    t = +(t + cov).toFixed(2); resto = +(slot - (t - st)).toFixed(2); nT2V++;
  }

  // 3) la foto tapa la cola del momento (obligatorio en zona Fish)
  const foto = fotoDe(m);
  if (foto && resto > 0.3) {
    const cap = zonaFish ? FISH_PHOTO_CAP : HERO_CAP;
    let cov = Math.min(resto, cap);
    if (resto - cov < 1.2) cov = resto;             // sin micro-huecos
    cov = +cov.toFixed(2);
    beats.push({ id: m.n + (nI2V || nT2V ? "_t" : ""), start: +t.toFixed(2), dur: +resto.toFixed(2), cov, key: "s", kind: "raw", src: foto });
    COVER.push({ start: +t.toFixed(2), cov, kind: "photo", src: foto });
    t = +(t + cov).toFixed(2); resto = +(slot - (t - st)).toFixed(2); nFoto++;
  }

  // 4) RELLENO: en la zona Fish el avatar NO puede taparlo (labios fuera de sync), así que el
  //    momento se sigue cubriendo alternando su clip y su foto, con Ken-Burns distinto en cada
  //    pasada, hasta que no quede hueco. En la zona avatar el hueco lo respira el presentador.
  if (resto > 0.5) {
    if (zonaFish && (foto || c1)) {
      let fase = 1;
      while (resto > 0.5 && fase < 24) {
        const usarClip = c1 && fase % 2 === 1;
        const src = usarClip ? c1 : foto || c1;
        const tope = usarClip ? 4.8 : FISH_PHOTO_CAP;
        let cov = Math.min(resto, tope);
        if (resto - cov < 1.2) cov = resto;
        cov = +cov.toFixed(2);
        beats.push({ id: `${m.n}_r${fase}`, start: +t.toFixed(2), dur: +resto.toFixed(2), cov, key: "s", kind: "raw", src, kbPhase: fase, snd: usarClip ? 1 : undefined });
        if (usarClip) BROLL.push({ name: `${m.n}_r${fase}`, src, start: +t.toFixed(2), dur: cov, cov, snd: 1, query: m.at.slice(0, 70) });
        COVER.push({ start: +t.toFixed(2), cov, kind: usarClip ? "video" : "photo", src });
        t = +(t + cov).toFixed(2); resto = +(slot - (t - st)).toFixed(2);
        if (usarClip) nI2V++; else nFoto++;
        fase++;
      }
    } else nAvatar++;
  }
}

// ── COMPONENTES anclados a la FRASE real ─────────────────────────────────────
const capOfDur = { avatarpizarra: 9, mitoverdad: 8.5, bars: 8, splitlist: 9, checklist: 10, lowerthird: 6,
  frasecinetica: 5.5, nametag: 6, process: 9, callout: 7, diagram: 10, errorstinger: 2.4, guardaesto: 10,
  freezezoom: 4.5, pizarraexplica: 8.5, guidecta: 11, stat: 7, quote: 8, ingredientduo: 6.5,
  lineatiempo: 11, recetaescena: 14 };

const TODOS = CMP(G);
const missing = [], cmpBeats = [];
for (let k = 0; k < TODOS.length; k++) {
  const spec = TODOS[k];
  const ms = findMs(spec.phrase, 0, hintDe(spec.phrase));
  if (ms == null) { missing.push(spec.phrase); continue; }
  const { phrase, ...rest } = spec;
  cmpBeats.push({ id: `cmp_${k}_${spec.kind}`, start: +ms.toFixed(2), dur: capOfDur[spec.kind] || 6, key: "s", ...rest });
}
for (const b of cmpBeats) {
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
fs.writeFileSync(`public/avatar_clips_${SLUG}.json`, JSON.stringify([], null, 1));

const ALL = [...beats, ...cmpBeats].sort((a, b) => a.start - b.start || (a.kind === "raw" ? -1 : 1));
const U = SLUG.toUpperCase();
fs.writeFileSync(`src/_fed6/VideoEdit/${SLUG}_beats.ts`,
  `// AUTO-GENERADO por gen_${SLUG}.mjs — NO editar a mano.\n` +
  `export const ${U}_BEATS: any[] = ${JSON.stringify(ALL)};\n` +
  `export const ${U}_BROLL: { name: string; src: string; start: number; dur: number; cov: number; snd?: number; query: string }[] = ${JSON.stringify(BROLL)};\n` +
  `export const ${U}_COVER: { start: number; cov: number; kind: string; src: string }[] = ${JSON.stringify(COVER)};\n` +
  `export const AVATAR_END = ${AVATAR_END};\n` +
  `export const VIDEO_END = ${VIDEO_END};\n`);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ video: SLUG, avatar: `${SLUG}_opt.mp4`, theme: "medico", beats: ALL }, null, 1));

// ── QA ───────────────────────────────────────────────────────────────────────
const kinds = {}; cmpBeats.forEach((b) => kinds[b.kind] = (kinds[b.kind] || 0) + 1);
const need = new Set();
ALL.forEach((b) => { for (const k of ["src", "image", "cover", "qr", "leftImage", "rightImage", "leftImg", "rightImg"]) if (b[k]) need.add(b[k]); });
const miss = [...need].filter((p) => !has(p));
console.log(`momentos ${N} (de ${crudos.length} anclas; sin ancla ${sinAncla.length})`);
console.log(`beats ${ALL.length} · clips i2v ${nI2V} · clips t2v quietos ${nT2V} · fotos ${nFoto} · avatar-solo ${nAvatar} · comp ${cmpBeats.length}`);
console.log(`componentes: ${Object.keys(kinds).length} kinds → ${Object.entries(kinds).map(([k, v]) => k + "×" + v).join(", ")}`);

// COBERTURA (aparte del anti-hueco): cuánto del video tiene asset propio
{
  const iv = COVER.map((c) => [c.start, c.start + c.cov]).sort((a, b) => a[0] - b[0]);
  let cub = 0, t = 0;
  for (const [s, e] of iv) { if (e <= t) continue; cub += e - Math.max(s, t); t = Math.max(t, e); }
  const fishIv = iv.filter((x) => x[1] > AVATAR_END).map((x) => [Math.max(x[0], AVATAR_END), x[1]]);
  let cf = 0, tf = AVATAR_END;
  for (const [s, e] of fishIv) { if (e <= tf) continue; cf += e - Math.max(s, tf); tf = Math.max(tf, e); }
  console.log(`COBERTURA total ${(100 * cub / VIDEO_END).toFixed(1)}% · ZONA FISH ${(100 * cf / (VIDEO_END - AVATAR_END)).toFixed(1)}%`);
}

// ── ⛔ COMPUERTA ANTI-HUECO ──────────────────────────────────────────────────
{
  const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
  const capOf = (k) => capOfDur[k] ?? 6;
  const compDur = (b) => {
    const nx = cmpBeats.filter((x) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a, c) => a.start - c.start)[0];
    const room = nx ? nx.start - b.start - 0.1 : b.dur;
    return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
  };
  const cubre = (t) => COVER.some((c) => t >= c.start - 0.02 && t < c.start + c.cov)
    || cmpBeats.some((b) => !OVERLAY.has(b.kind) && t >= b.start && t < b.start + compDur(b));
  const huecos = [];
  for (let t = AVATAR_END; t < VIDEO_END; t += 0.2) {
    if (!cubre(t)) {
      const u = huecos[huecos.length - 1];
      if (u && t - u[1] < 0.35) u[1] = t; else huecos.push([t, t]);
    }
  }
  const grandes = huecos.filter((h) => h[1] - h[0] >= 0.3);
  const total = huecos.reduce((a, h) => a + (h[1] - h[0] + 0.2), 0);
  console.log(`ANTI-HUECO zona Fish: ${huecos.length} huecos (${grandes.length} de >=0.3s) · ${total.toFixed(1)}s`);
  for (const h of grandes.slice(0, 10)) console.log(`   ${h[0].toFixed(2)}s .. ${h[1].toFixed(2)}s`);
  fs.writeFileSync(`_${SLUG}_huecos.json`, JSON.stringify(huecos.map((h) => [+h[0].toFixed(2), +(h[1] + 0.2).toFixed(2)])));
}

console.log(`assets: ${need.size} · FALTAN ${miss.length}${miss.length ? " → " + miss.slice(0, 8).join(" ") : ""}`);
if (missing.length) console.log(`⚠ COMPONENTES SIN ANCLA (${missing.length}):\n   ${missing.join("\n   ")}`);
if (sinAncla.length) console.log(`⚠ MOMENTOS SIN ANCLA (${sinAncla.length}):\n   ${sinAncla.slice(0, 15).join("\n   ")}`);
