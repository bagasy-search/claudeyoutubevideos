// wordms_dale3.mjs — alinea canales/dale3_GUION.txt contra public/captions_dale3.json (Fish ASR)
// y emite _v3/dale3_wordms.json = [{w, off, t}] con el ms exacto de cada palabra DEL GUION.
//
// El ASR escribe numeros en cifras ("25", "22nd", "1970") y el guion en letras. Sin normalizar,
// la alineacion se rompe en cada numero y la compuerta de "frases comidas" da falsos positivos.
//
//   node scripts/wordms_dale3.mjs [slug]
import fs from "node:fs";

const SLUG = process.argv[2] || "dale3";

const UNITS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven",
  "twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
const ORD = { one:"first", two:"second", three:"third", five:"fifth", eight:"eighth", nine:"ninth", twelve:"twelfth" };

// 0..9999 -> palabras sueltas. Los anios se leen por pares (1970 = nineteen seventy).
function numWords(n, year = false) {
  if (year && n >= 1100 && n <= 1999 && n % 100 !== 0) return [...numWords(Math.floor(n / 100)), ...numWords(n % 100)];
  const out = [];
  if (n >= 1000) { out.push(...numWords(Math.floor(n / 1000)), "thousand"); n %= 1000; }
  if (n >= 100) { out.push(...numWords(Math.floor(n / 100)), "hundred"); n %= 100; }
  if (n >= 20) { out.push(TENS[Math.floor(n / 10)]); n %= 10; if (n) out.push(UNITS[n]); return out; }
  if (n > 0 || !out.length) out.push(UNITS[n]);
  return out;
}
function ordWords(n) {
  const w = numWords(n);
  const last = w[w.length - 1];
  if (ORD[last]) w[w.length - 1] = ORD[last];
  else if (/y$/.test(last)) w[w.length - 1] = last.slice(0, -1) + "ieth";
  else w[w.length - 1] = last + "th";
  return w;
}

// token -> 1..n palabras normalizadas
function norm(tok) {
  let t = tok.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9'$]/g, "");
  if (!t) return [];
  if (/^\$[0-9]+$/.test(t)) return [...numWords(+t.slice(1)), "dollars"];
  const om = t.match(/^([0-9]+)(st|nd|rd|th)$/);
  if (om) return ordWords(+om[1]);
  if (/^[0-9]+$/.test(t)) return numWords(+t, t.length === 4);
  return [t.replace(/'s$/, "s").replace(/'/g, "")];
}

const capsRaw = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8").replace(/^﻿/, ""));
// ASR: cada caption es una palabra con startMs
const asr = [];
for (const c of capsRaw) {
  for (const w of norm(String(c.text || "").trim())) asr.push({ w, t: (c.startMs || 0) / 1000 });
}

const guionRaw = fs.readFileSync(`canales/${SLUG}_GUION.txt`, "utf8").replace(/\r/g, "");
// offset de caracter de cada token del guion (lo necesita el generador de momentos)
const gTok = [];
{
  const re = /\S+/g; let m;
  while ((m = re.exec(guionRaw))) gTok.push({ raw: m[0], off: m.index });
}
const guion = [];
for (const g of gTok) for (const w of norm(g.raw)) guion.push({ w, off: g.off, raw: g.raw });

// ── alineacion PATIENCE + LIS (recursiva) ───────────────────────────────────────────────────────
// El greedy con ventana se descarrila: un match fuerte lejano hace saltar el cursor del ASR y todo
// lo que sigue queda sin ancla (medido: 21% de anclaje). Con anclas UNICAS-EN-EL-TRAMO el orden se
// respeta por construccion y no hay forma de saltar hacia atras.
const out = new Array(guion.length).fill(null);
const exactMask = new Array(guion.length).fill(false);

function ancoras(g0, g1, a0, a1) {
  // palabras que aparecen EXACTAMENTE UNA VEZ en los dos tramos
  const cg = new Map(), ca = new Map();
  for (let i = g0; i < g1; i++) cg.set(guion[i].w, (cg.get(guion[i].w) || 0) + 1);
  for (let k = a0; k < a1; k++) ca.set(asr[k].w, (ca.get(asr[k].w) || 0) + 1);
  const posA = new Map();
  for (let k = a0; k < a1; k++) if (ca.get(asr[k].w) === 1) posA.set(asr[k].w, k);
  const pares = [];
  for (let i = g0; i < g1; i++) {
    if (cg.get(guion[i].w) !== 1) continue;
    const k = posA.get(guion[i].w);
    if (k !== undefined) pares.push([i, k]);
  }
  // LIS sobre k (los i ya vienen crecientes)
  const tails = [], idx = [], prev = new Array(pares.length).fill(-1);
  for (let n = 0; n < pares.length; n++) {
    const k = pares[n][1];
    let lo = 0, hi = tails.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < k) lo = mid + 1; else hi = mid; }
    tails[lo] = k; idx[lo] = n; prev[n] = lo > 0 ? idx[lo - 1] : -1;
  }
  const lis = [];
  for (let n = idx.length ? idx[idx.length - 1] : -1; n >= 0; n = prev[n]) lis.push(pares[n]);
  return lis.reverse();
}

function alinear(g0, g1, a0, a1, prof) {
  if (g0 >= g1 || a0 >= a1) return;
  const anc = prof < 8 ? ancoras(g0, g1, a0, a1) : [];
  if (!anc.length) {
    // tramo corto sin anclas unicas: greedy estricto hacia adelante, sin saltos
    let k = a0;
    for (let i = g0; i < g1 && k < a1; i++) {
      for (let j = k; j < Math.min(a1, k + 12); j++) {
        if (asr[j].w === guion[i].w) { out[i] = asr[j].t; exactMask[i] = true; k = j + 1; break; }
      }
    }
    return;
  }
  let pg = g0, pa = a0;
  for (const [i, k] of anc) {
    alinear(pg, i, pa, k, prof + 1);
    out[i] = asr[k].t; exactMask[i] = true;
    pg = i + 1; pa = k + 1;
  }
  alinear(pg, g1, pa, a1, prof + 1);
}
alinear(0, guion.length, 0, asr.length, 0);
const hits = exactMask.filter(Boolean).length;

// interpolar los huecos
let lastT = 0;
for (let i = 0; i < out.length; i++) {
  if (out[i] != null) { lastT = out[i]; continue; }
  let j = i; while (j < out.length && out[j] == null) j++;
  const nextT = j < out.length ? out[j] : lastT + 0.4 * (j - i);
  for (let k = i; k < j; k++) out[k] = lastT + (nextT - lastT) * ((k - i + 1) / (j - i + 1));
  i = j - 1;
}
for (let i = 1; i < out.length; i++) if (out[i] < out[i - 1]) out[i] = out[i - 1];

const wordms = guion.map((g, i) => ({ w: g.w, off: g.off, t: +out[i].toFixed(2) }));
fs.writeFileSync(`_v3/${SLUG}_wordms.json`, JSON.stringify(wordms));

const pct = (100 * hits / guion.length).toFixed(1);
console.log(`guion ${guion.length} palabras · ASR ${asr.length} · anclado exacto ${hits} (${pct}%)`);

// ── COMPUERTA: tramos de 5+ palabras del guion sin ancla = posible frase comida ──────────────────
// ⚠️ DA FALSOS POSITIVOS (medido en dale2): el ASR se come palabras al cruzar fronteras de bloque.
//    Antes de regenerar nada, cortar el MASTER en el rango exacto y transcribir SOLO eso.
const runs = [];
{
  let run = null;
  for (let i = 0; i < guion.length; i++) {
    if (!exactMask[i]) { if (!run) run = { i, n: 0 }; run.n++; }
    else if (run) { if (run.n >= 5) runs.push(run); run = null; }
  }
  if (run && run.n >= 5) runs.push(run);
}
if (!runs.length) console.log("compuerta ASR ✓ 0 tramos de 5+ palabras sin ancla");
else {
  console.log(`⚠️ ${runs.length} tramos de 5+ palabras sin ancla (REVISAR a mano, suele ser el ASR):`);
  for (const r of runs.slice(0, 15)) {
    const txt = guion.slice(r.i, r.i + r.n).map((x) => x.w).join(" ");
    console.log(`   t≈${wordms[r.i].t.toFixed(1)}s · ${r.n} palabras · "${txt.slice(0, 90)}"`);
  }
}
