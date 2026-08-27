// build_paredhidro.mjs — "Deja de Tirar Plata: Casi Todos IMPERMEABILIZAN la Pared MAL"
// Canal The Free Builder / El Constructor Libre (ES NEUTRO, avatar Tomás).
//
// AVATAR PARCIAL + BUCLE (horneado en paredhidro_opt.mp4, 2012,7 s):
//   · 0 → 897,95 s   lipsync REAL del creador (su propio audio) → el avatar es FONDO GARANTIZADO.
//   · 898,25 → fin   voz Fish `freebuilder` y el video en BUCLE: la boca NO coincide, así que el
//                    avatar sólo puede asomar en RESPIROS CORTOS de apertura de sección.
//   · costuras del bucle en 898,06 y 1796,13 s → tienen que quedar TAPADAS por b-roll.
//
// Material: 253 clips agnes (51 i2v con la cara de Tomás + 202 t2v) + 253 fotos de respaldo
// + lámina gpt-image-2 + CTA (portada / QR / landing) + 29 componentes del kit premium THEME_EARTH.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "paredhidro";
const FPS = 30;
const tl = JSON.parse(fs.readFileSync("_v3/paredhidro_timeline.json", "utf8"));
const TOTAL = +tl.totalSec.toFixed(2);          // 2012.60
const AVATAR_END = tl.avatarEndMs / 1000;        // 897.95
const COLA = tl.colaOffsetMs / 1000;             // 898.25
const LOOP_SEAMS = [898.06, 1796.13];
const FF = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";

const caps = JSON.parse(fs.readFileSync("public/captions_paredhidro_full.json", "utf8").replace(/^\uFEFF/, ""));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const Wc = [];
for (const c of caps) for (const w of norm(c.text).split(" ").filter(Boolean)) Wc.push({ n: w, ms: c.startMs });
const at = (phrase, maxTok = 8) => {
  for (let tok = maxTok; tok >= 4; tok--) {
    const t = norm(phrase).split(" ").filter(Boolean).slice(0, tok);
    if (t.length < tok) continue;
    for (let i = 0; i <= Wc.length - t.length; i++) {
      let ok = 1;
      for (let j = 0; j < t.length; j++) if (Wc[i + j].n !== t[j]) { ok = 0; break; }
      if (ok) return Wc[i].ms / 1000;
    }
  }
  return null;
};

const mom = JSON.parse(fs.readFileSync("_v3/paredhidro_moments_timed.json", "utf8"));
const RECHAZADOS = new Set(JSON.parse(fs.readFileSync("_v3/paredhidro_clips_rechazados.json", "utf8")));
const durOf = (p) => { try { return +execFileSync(FF, ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", p]).toString().trim(); } catch { return 0; } };

// ── RESPIROS de avatar en el tramo del bucle: aperturas de sección, ≤2,8 s ────────────────────
// (donde un plano breve del presentador se lee como corte de montaje y no como doblaje)
const SECCION_TRAMO2 = [
  "Ahora sí, vamos al líquido",
  "Ahora quiero que prestes muchísima atención",
  "Vamos a preparar la mezcla",
  "Ahora la aplicación, que es donde se gana",
  "Y ahora el caso difícil",
  "Bueno. Llegamos al final",
  "Te resumo el video en cinco frases",
  "Y si esto te sirvió, ya sabes",
];
const AV_SHORT = [];
for (const f of SECCION_TRAMO2) {
  const s = at(f, 7);
  if (s == null) { console.warn("⚠ respiro sin ancla:", f.slice(0, 40)); continue; }
  if (s < COLA) continue;
  AV_SHORT.push([+s.toFixed(2), +(s + 2.6).toFixed(2)]);
}

// ── B-ROLL: clip + foto de respaldo que tapa la cola del momento ──────────────────────────────
// ⛔ PACING: el enemigo es la SUCESIÓN PAREJA, no el plano largo. Un techo fijo de 4,5 s da
// mediana≈p75≈4 s y el creador lo lee como "cambia una por segundo, cansa". La escalera alterna
// planos cortos y planos que respiran para que ~40% queden ≥5 s y el p75 pase de 5.
const LADDER = [2.6, 6.2, 3.4, 8.0, 4.2, 5.4, 2.9, 9.5, 3.8, 6.8];
const rawBeats = [];
const avatarSpans = [];
let nClip = 0, nPhoto = 0, nHero = 0, nPage = 0; const missing = [];

let ladderI = 0;
const pushPhoto = (id, start, dur, src, hold = false) => {
  let t = start, left = dur, k = 0;
  while (left > 0.35) {
    // `hold` = el momento se sostiene entero (es el plano que respira). Sólo se parte si es enorme.
    const want = hold ? Math.min(left, 10.5) : LADDER[ladderI++ % LADDER.length];
    // si lo que queda no llega a otro plano, se lo come éste (no dejar colgajos de 0,4 s)
    const d = +(left - want < 1.6 ? left : want).toFixed(2);
    rawBeats.push({ id: `${id}${k ? "_" + k : ""}`, start: +t.toFixed(2), kind: "raw", src, hue: "amber", darken: 0, dur: d });
    nPhoto++; t += d; left = +(left - d).toFixed(2); k++;
  }
};

// ── TRAMO 1: el avatar tiene lipsync REAL. Darle su parte (el canal lo pide: cuando un momento no
// tiene un clip que aporte, se prefiere al presentador a pantalla completa antes que una foto).
// Se eligen los momentos de INTERPELACIÓN directa — preguntas al espectador, promesas, remates —
// que son justo los que un clip ilustraría con algo genérico.
const esAvatar = (m) => {
  if (m.start >= AVATAR_END) return false;
  const p = m.phrase;
  if (/[¿?]/.test(p)) return true;
  if (/^(Y |Ahora |Pero |Bueno|Vamos|Empecemos|Te voy|Quiero que|Piensa|Mira|Fíjate|Dime|Quédate|Hoy te)/.test(p)) return true;
  return false;
};

for (const m of mom) {
  const { start, dur: slot, tipo, n } = m;
  const nn = String(n).padStart(3, "0");

  // ⛔ CAMA DE FOTO BAJO TODO COMPONENTE: los full-screen del kit dejan ~60px de margen. En el
  // tramo del bucle el avatar está OCULTO, así que sin cama ese marco muestra el fondo plano.
  // Como los momentos `comp` no tienen imagen propia, se usa la del momento anterior que sí tenga.
  if (tipo === "comp") {
    let j = mom.indexOf(m) - 1, bed = null;
    while (j >= 0 && !bed) {
      const b = mom[j], bn = String(b.n).padStart(3, "0");
      for (const cand of [`img/ph_s_${bn}_h.jpg`, `img/ph_s_${bn}.jpg`]) if (fs.existsSync("public/" + cand)) { bed = cand; break; }
      j--;
    }
    if (bed) { pushPhoto(`${SLUG}_bed${n}`, start, slot, bed, true); }
    continue;
  }
  if (esAvatar(m)) { avatarSpans.push([start, +(start + slot).toFixed(2)]); continue; }  // a cámara, sin b-roll
  if (tipo === "lamina") {                               // la lámina se SOSTIENE (no se parte)
    const p = "img/paredhidro_lamina.jpg";
    if (!fs.existsSync("public/" + p)) { missing.push(p); continue; }
    rawBeats.push({ id: `${SLUG}_lam${n}`, start, kind: "raw", src: p, hue: "amber", darken: 0, dur: slot });
    nPage++; continue;
  }
  if (tipo === "cta") {
    const which = n <= 183 ? "portada" : n === 184 ? "qr_land" : "landing";
    const p = `img/paredhidro_${which}.jpg`;
    if (!fs.existsSync("public/" + p)) { missing.push(p); continue; }
    rawBeats.push({ id: `${SLUG}_cta${n}`, start, kind: "raw", src: p, hue: "amber", darken: 0, dur: slot });
    nPage++; continue;
  }

  const base = tipo === "hero" ? `ph_s_${nn}_h` : `ph_s_${nn}`;
  const vid = `broll/${base}.mp4`;
  const img = `img/${base}.jpg`;
  // El AUDITOR de clips (pase de MOVIMIENTO) rechazó éstos: el objeto muta a mitad de toma, la
  // mano se rompe o cambia la escena. No se re-generan una tercera vez: cae la foto de respaldo,
  // que es exactamente para lo que existe. El mp4 queda en disco, no se borra.
  const hasVid = fs.existsSync("public/" + vid) && !RECHAZADOS.has(base);
  const hasImg = fs.existsSync("public/" + img);
  if (!hasVid && !hasImg) { missing.push(vid); continue; }

  // ⛔ Si TODOS los momentos llevan clip, cada uno rinde 4 s de clip + una cola corta: mediana y
  // p75 se pegan y sale el metrónomo. Uno de cada tres momentos lo SOSTIENE la foto entera
  // (6-9 s con el tratamiento de profundidad), que es lo que abre el p75 y deja respirar lo que
  // se está explicando. Los clips que quedan sin usar no se tiran: son la reserva del AUDITOR.
  const soloFoto = hasImg && slot >= 4.6 && (n % 5 === 0 || n % 5 === 3);
  if (hasVid && !soloFoto) {
    const real = Math.max(1.2, durOf("public/" + vid) - 0.08);
    const cov = +Math.min(slot, real).toFixed(2);
    rawBeats.push({ id: `${SLUG}_${nn}`, start, kind: "raw", src: vid, hue: "amber", darken: 0, dur: cov, noSplit: true });
    tipo === "hero" ? nHero++ : nClip++;
    const tail = +(slot - cov).toFixed(2);
    if (tail >= 0.6 && hasImg) pushPhoto(`${SLUG}_${nn}t`, start + cov, tail, img);
  } else {
    pushPhoto(`${SLUG}_${nn}`, start, slot, img, soloFoto);
  }
}

// ── el avatar se queda con los respiros del tramo 2: se le recortan al b-roll ─────────────────
{
  const kept = []; let cut = 0;
  for (const b of rawBeats) {
    const end = +(b.start + b.dur).toFixed(2);
    const w = AV_SHORT.find(([s, e]) => b.start < e && end > s);
    if (!w) { kept.push(b); continue; }
    if (b.start < w[0] && w[0] - b.start >= 1.2) { b.dur = +(w[0] - b.start).toFixed(2); kept.push(b); }
    else if (end > w[1] && end - w[1] >= 1.2) { b.dur = +(end - w[1]).toFixed(2); b.start = w[1]; kept.push(b); }
    else cut++;
  }
  rawBeats.length = 0; rawBeats.push(...kept);
  avatarSpans.push(...AV_SHORT);
  console.log(`respiros de avatar en el bucle: ${AV_SHORT.length} · beats cedidos ${cut}`);
}

console.log(`b-roll: clips ${nClip} · hero ${nHero} · fotos ${nPhoto} · páginas ${nPage} · faltantes ${missing.length}`);
if (missing.length) console.log("  faltan:", missing.slice(0, 8).join(" "), missing.length > 8 ? `… +${missing.length - 8}` : "");

// ── COMPONENTES ───────────────────────────────────────────────────────────────────────────────
const PREMIUM = JSON.parse(fs.readFileSync(`_v3/${SLUG}_comps.json`, "utf8").replace(/^\uFEFF/, ""));
const textOf = (v, out = []) => {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => textOf(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => textOf(x, out));
  return out;
};
// TIEMPO DE LECTURA: el piso sale del TEXTO, no del hueco (entrada + tipeo + car/14 + respiro)
const readSecs = (props) => {
  const strs = textOf(props).filter((s) => s.length > 1 && !s.startsWith("img/"));
  const chars = strs.reduce((a, s) => a + s.length * (s.length < 26 ? 0.75 : 1), 0);
  return { chars: Math.round(chars), min: +(0.8 + chars / 14 + 1.0).toFixed(2) };
};
const compBeats = []; const placed = []; let missAnchor = 0;
for (const p of PREMIUM) {
  const s = at(p.at, p.maxTok);
  if (s == null) { console.warn("⚠ anchor missing:", p.at.slice(0, 55)); missAnchor++; continue; }
  const { chars, min } = readSecs(p.props);
  placed.push({ ...p, start: +s.toFixed(2), need: min, chars });
}
placed.sort((a, b) => a.start - b.start);
let debt = 0; const over = [];
for (let i = 0; i < placed.length; i++) {
  const p = placed[i];
  const room = (placed[i + 1] ? placed[i + 1].start - 0.4 : TOTAL) - p.start;
  const d = +Math.min(Math.max(p.need, 4.0), Math.max(room, 4.0)).toFixed(2);
  if (d + 0.01 < p.need) { debt += +(p.need - d).toFixed(2); over.push(`${p.comp}@${Math.round(p.start)}s -${(p.need - d).toFixed(1)}s`); }
  compBeats.push({ id: `ov_${p.comp.toLowerCase()}_${Math.round(p.start)}`, start: p.start, dur: d, kind: "premium", overlay: true, comp: p.comp, theme: "earth", zone: p.zone, ...p.props });
}
console.log(debt > 0 ? `⚠ DEUDA DE LECTURA: ${debt.toFixed(1)}s · ${over.join(" · ")}` : "lectura: deuda 0");
console.log(`componentes: ${compBeats.length}/${PREMIUM.length} (${new Set(compBeats.map((b) => b.comp)).size} tipos) · anchors perdidos ${missAnchor}`);

// ── ALINEAR AL FRAME (si no, `start` y `dur` se redondean por separado y quedan huecos de 1 frame)
const F = (s) => Math.round(s * FPS);
rawBeats.sort((a, b) => a.start - b.start);
for (let i = 0; i < rawBeats.length; i++) {
  const c = rawBeats[i], sig = rawBeats[i + 1];
  const f0 = F(c.start); let f1 = F(c.start + c.dur);
  if (sig && Math.abs(F(sig.start) - f1) <= 1) f1 = F(sig.start);
  c.start = f0 / FPS; c.dur = Math.max(1, f1 - f0) / FPS;
}

// ── CERRAR MICRO-HUECOS DEL TRAMO 2 ───────────────────────────────────────────────────────────
// En el tramo del bucle el avatar NO puede tapar (boca desincronizada), así que cualquier hueco
// —aunque dure 0,2 s— muestra el fondo plano. Se estira el beat anterior hasta el siguiente.
{
  let cerrados = 0;
  for (let i = 0; i < rawBeats.length - 1; i++) {
    const a = rawBeats[i], b = rawBeats[i + 1];
    const fin = +(a.start + a.dur).toFixed(2);
    const gap = +(b.start - fin).toFixed(2);
    if (gap > 0 && gap < 2.0 && fin >= COLA - 1 && !AV_SHORT.some(([s, e]) => s < b.start && e > fin)) {
      a.dur = +(b.start - a.start).toFixed(2); cerrados++;
    }
  }
  console.log(`micro-huecos del bucle cerrados: ${cerrados}`);
}

// ── VENTANAS DE AVATAR ────────────────────────────────────────────────────────────────────────
// tramo 1: el avatar es el FONDO (base full, el contenido tapa sólo su span real).
// tramo 2: el avatar NO es fondo (boca desincronizada) → sólo los respiros.
const spans = rawBeats.map((b) => [b.start, +(b.start + b.dur).toFixed(2)]);
const covered = (t) => spans.some(([s, e]) => s <= t && e > t);
const inShort = (t) => AV_SHORT.some(([s, e]) => s <= t && e > t);
const STEP = 0.1;
const windows = []; let cur = null;
for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
  const mode = t < AVATAR_END ? (covered(t) ? "hidden" : "full") : (inShort(t) ? "full" : "hidden");
  if (mode !== cur) { windows.push({ start: t, mode }); cur = mode; }
}
if (!windows.length || windows[0].start > 0) windows.unshift({ start: 0, mode: "full" });

// ── COMPUERTAS ────────────────────────────────────────────────────────────────────────────────
let holes = 0, holeT2 = 0;
const gaps = [];
let gs = null;
for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) {
  const w = [...windows].reverse().find((x) => x.start <= t);
  const vacio = !covered(t) && w.mode !== "full";
  if (vacio) { holes++; if (t >= COLA) holeT2++; if (gs == null) gs = t; }
  else if (gs != null) { if (t - gs >= 1.0) gaps.push([gs, +t.toFixed(2)]); gs = null; }
}
if (gs != null) gaps.push([gs, TOTAL]);

const cubierto = (() => { let s = 0; for (let t = 0; t < TOTAL; t = +(t + STEP).toFixed(2)) if (covered(t)) s += STEP; return s; })();
const avSecs = windows.reduce((a, w, i) => a + (w.mode === "full" ? ((windows[i + 1]?.start ?? TOTAL) - w.start) : 0), 0);
console.log(`ventanas ${windows.length} · avatar full ${avSecs.toFixed(0)}s (${(avSecs / TOTAL * 100).toFixed(1)}%)`);
console.log(`COBERTURA b-roll ${(cubierto / TOTAL * 100).toFixed(1)}% · HUECOS ${holes} (tramo2: ${holeT2}) · pozos ≥1s: ${gaps.length}`);
if (gaps.length) console.log("  pozos:", gaps.slice(0, 8).map(([a, b]) => `${a.toFixed(0)}-${b.toFixed(0)}s`).join(" "));
for (const s of LOOP_SEAMS) {
  const hit = rawBeats.some((b) => b.start <= s && b.start + b.dur > s);
  console.log(`costura del bucle ${s}s → ${hit ? "CUBIERTA" : "⛔ DESCUBIERTA (se va a ver el corte)"}`);
}
// cero clips repetidos (pedido explícito del creador)
const srcs = rawBeats.filter((b) => b.src.startsWith("broll/")).map((b) => b.src);
const dup = srcs.filter((s, i) => srcs.indexOf(s) !== i);
console.log(`clips usados ${srcs.length} · REPETIDOS ${dup.length}${dup.length ? " ⛔ " + [...new Set(dup)].slice(0, 5).join(" ") : " ✓"}`);
// pacing
const D = rawBeats.map((b) => b.dur).sort((a, b) => a - b);
const q = (x) => D[Math.floor(D.length * x)];
console.log(`pacing: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · ≥5s ${(rawBeats.filter((b) => b.dur >= 5).length / D.length * 100).toFixed(0)}% · max ${D[D.length - 1].toFixed(1)}s`);

const beats = [...rawBeats, ...compBeats].sort((a, b) => a.start - b.start);
fs.mkdirSync("beatsheet", { recursive: true });
fs.writeFileSync(`beatsheet/${SLUG}.json`, JSON.stringify({ slug: SLUG, total: TOTAL, beats }, null, 1));
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`,
  `// generado por build_${SLUG}.mjs\nexport const TOTAL_PAREDHIDRO = ${TOTAL};\nexport const AVATAR_WINDOWS = ${JSON.stringify(windows)} as const;\n`);
console.log(`→ beatsheet/${SLUG}.json (${beats.length} beats) · src/VideoEdit/avatar_${SLUG}.gen.ts`);
