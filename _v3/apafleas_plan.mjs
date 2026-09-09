// apafleas_plan.mjs — DIRECTOR (4 pasadas) + wordms del MASTER -> _v3/apafleas_plan.json
//
// ⛔ ANCLAJE: cada unidad se ubica por su rango de PALABRAS en el guion y lee su ms del mapa
//    global (_v3/apafleas_wordms.json). Nunca por matematica ni por busqueda frase-por-frase.
// ⛔ El asset se indexa por el INDICE DEL MOMENTO, jamas por un contador corrido.
// ⛔ Alineacion por FRAME: la duracion se deriva del FRAME FINAL, no del largo.
// ⛔ DIFERENCIA CON apayellow: aca el avatar NO es el piso del video. Existe SOLO en las 24
//    ventanas full-frame (k:"A"); el resto del metraje lo tiene que cubrir el b-roll al 100%.
import fs from "node:fs";

const SLUG = "apafleas", FPS = 30;
const OVERLAY = new Set(["CornerLabel"]);
const passes = [];
for (const n of [1, 2, 3, 4]) passes.push((await import(`./${SLUG}_dir_${n}.mjs`)).default);
const units = passes.flat();

const wordms = JSON.parse(fs.readFileSync(`_v3/${SLUG}_wordms.json`, "utf8"));
const sents = JSON.parse(fs.readFileSync(`_v3/${SLUG}_sents.json`, "utf8"));
const guion = fs.readFileSync(`GUION_${SLUG}.txt`, "utf8");

const toks = [...guion.matchAll(/\S+/g)].map((m) => m[0]);
let cur = 0;
const rango = {};
for (const s of sents) {
  const n = s.t.match(/\S+/g).length;
  rango[s.i] = [cur, cur + n - 1];
  cur += n;
}
if (cur !== toks.length) console.log(`⚠️ tokens del guion ${toks.length} vs sumados por unidad ${cur}`);
console.log(`MEDIDO: ${units.length} unidades · ${toks.length} palabras · mapa de ms con ${wordms.length} entradas`);

const msDe = (i) => wordms[Math.min(i, wordms.length - 1)].ms;

const palabrasDe = (p) => {
  const out = [];
  for (const k of ["value", "label", "sub", "title", "body", "text", "quote", "source", "unit"]) if (p[k]) out.push(String(p[k]));
  if (Array.isArray(p.items)) out.push(p.items.map((x) => (typeof x === "string" ? x : x.text || "")).join(" "));
  if (Array.isArray(p.steps)) out.push(p.steps.map((x) => x.text || x.title || "").join(" "));
  if (Array.isArray(p.rows)) out.push(p.rows.map((x) => `${x.label} ${x.value}`).join(" "));
  return out.join(" ").split(/\s+/).filter(Boolean).length;
};
const pisoLectura = (s) => {
  const w = palabrasDe(s.props || {});
  const base = OVERLAY.has(s.comp) ? 2.0 : 2.8;
  return base + 0.28 * Math.max(0, w - 3);
};

let beats = [];
const overlays = [];
let ajustados = 0;
for (const u of units) {
  const [a, b] = rango[u.u];
  const t0 = msDe(a);
  const t1 = u.u + 1 < sents.length ? msDe(rango[u.u + 1][0]) : msDe(b) + 800;
  const span = Math.max(400, t1 - t0);

  const base = u.s.filter((s) => !(s.k === "C" && OVERLAY.has(s.comp)));
  const ovs = u.s.filter((s) => s.k === "C" && OVERLAY.has(s.comp));
  for (const o of ovs) {
    const dur = Math.max(pisoLectura(o), o.sec) * 1000;
    overlays.push({ ms_in: Math.round(t0), ms_out: Math.round(t0 + dur), componente: o.comp, props: o.props });
  }
  if (!base.length) continue;

  const total = base.reduce((x, s) => x + s.sec, 0);
  const cuota = base.map((s) => (s.sec / total) * span);
  for (let i = 0; i < base.length; i++) {
    if (base[i].k !== "C") continue;
    const piso = pisoLectura(base[i]) * 1000;
    if (cuota[i] < piso && span > piso) {
      const falta = Math.min(piso, span * 0.9) - cuota[i];
      cuota[i] += falta; ajustados++;
      const otros = base.map((_, j) => j).filter((j) => j !== i && base[j].k !== "C");
      const pool = otros.reduce((x, j) => x + cuota[j], 0);
      if (pool > falta) for (const j of otros) cuota[j] -= falta * (cuota[j] / pool);
    }
  }

  let acc = t0;
  base.forEach((s, i) => {
    const ms_in = Math.round(acc);
    const ms_out = Math.round(i === base.length - 1 ? t1 : acc + cuota[i]);
    acc += cuota[i];
    if (s.k === "A") beats.push({ tipo: "avatar", ms_in, ms_out, u: u.u, n: s.n });
    else if (s.k === "C") beats.push({ tipo: "componente", ms_in, ms_out, componente: s.comp, props: s.props, u: u.u, n: s.n });
    else beats.push({ tipo: "imagen", ms_in, ms_out, imagen: s.n, u: u.u, n: s.n });
  });
}
beats.sort((x, y) => x.ms_in - y.ms_in);
console.log(`beats ${beats.length} (avatar ${beats.filter((b) => b.tipo === "avatar").length}) · overlays ${overlays.length} · componentes con piso corregido ${ajustados}`);

// ── SOSTENER planos: el metronomo es ESTRUCTURAL. En unidades explicativas se saca el ultimo
//    plano no-componente y los que quedan se estiran. El HOOK (u<=14) queda con cortes cortos.
//    ⛔ Nunca se toca un beat de AVATAR: su duracion es la de su clip real.
{
  const UMBRAL = Number(process.env.UMBRAL || 8.5);
  const TECHO = Number(process.env.TECHO || 9.5);
  const porU = {};
  for (const b of beats) (porU[b.u] = porU[b.u] || []).push(b);
  const sacar = new Set();
  for (const [uu, g] of Object.entries(porU)) {
    if (Number(uu) <= 14) continue;
    if (g.some((b) => b.tipo === "avatar")) continue;
    const span = (g[g.length - 1].ms_out - g[0].ms_in) / 1000;
    if (span < UMBRAL) continue;
    const noComp = g.filter((b) => b.tipo !== "componente");
    if (noComp.length < 2) continue;
    const victima = noComp[noComp.length - 1];
    const quedan = g.filter((b) => b !== victima);
    const gana = (victima.ms_out - victima.ms_in) / quedan.length;
    if (quedan.some((b) => (b.ms_out - b.ms_in + gana) / 1000 > TECHO)) continue;
    sacar.add(victima);
  }
  for (const [, g] of Object.entries(porU)) {
    const quedan = g.filter((b) => !sacar.has(b));
    if (quedan.length === g.length || !quedan.length) continue;
    const t0 = g[0].ms_in, t1 = g[g.length - 1].ms_out;
    const tot = quedan.reduce((a, b) => a + (b.ms_out - b.ms_in), 0);
    let acc = t0;
    quedan.forEach((b, i) => {
      const w = (b.ms_out - b.ms_in) / tot;
      b.ms_in = Math.round(acc);
      b.ms_out = Math.round(i === quedan.length - 1 ? t1 : acc + w * (t1 - t0));
      acc = b.ms_out;
    });
  }
  const antes = beats.length;
  beats = beats.filter((b) => !sacar.has(b));
  beats.sort((x, y) => x.ms_in - y.ms_in);
  console.log(`planos sostenidos: ${antes - beats.length} sacados -> ${beats.length} beats`);
}

// ── CERRAR HUECOS: una unidad cuyo unico plano es un OVERLAY no empuja ningun beat y deja el
//    fondo a la vista (u101 dejaba 1,77 s). El plano anterior se estira hasta el siguiente.
{
  let cerrados = 0, ms = 0;
  for (let i = 1; i < beats.length; i++) {
    const d = beats[i].ms_in - beats[i - 1].ms_out;
    if (d > 0) { beats[i - 1].ms_out = beats[i].ms_in; cerrados++; ms += d; }
  }
  console.log(`huecos cerrados estirando el plano previo: ${cerrados} (${ms} ms)`);
}

// ── ALINEACION POR FRAME
const F = (ms) => Math.round((ms / 1000) * FPS);
for (let i = 0; i < beats.length; i++) {
  const f0 = F(beats[i].ms_in);
  let f1 = F(beats[i].ms_out);
  const sig = i + 1 < beats.length ? F(beats[i + 1].ms_in) : f1;
  if (i + 1 < beats.length) {
    if (f1 > sig) f1 = sig;
    if (Math.abs(sig - f1) <= 1) f1 = sig;
  }
  if (f1 <= f0) f1 = f0 + 1;
  beats[i].ms_in = Math.round((f0 / FPS) * 1000);
  beats[i].ms_out = Math.round((f1 / FPS) * 1000);
}

// ── COMPUERTA DE CONTINUIDAD: ningun hueco entre beats (el avatar NO es el piso aca)
let huecos = 0, solapes = 0, peor = 0;
for (let i = 1; i < beats.length; i++) {
  const d = beats[i].ms_in - beats[i - 1].ms_out;
  if (d > 0) { huecos++; peor = Math.max(peor, d); }
  if (d < 0) solapes++;
}
console.log(`continuidad: ${huecos} huecos (peor ${peor} ms) · ${solapes} solapes`);

const durs = beats.filter((b) => b.tipo !== "avatar").map((b) => (b.ms_out - b.ms_in) / 1000).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
const pct5 = 100 * durs.filter((x) => x >= 5).length / durs.length;
console.log(`pacing (sin avatar): mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · p90 ${q(0.9).toFixed(2)}s · >=5s ${pct5.toFixed(0)}% · max ${durs[durs.length - 1].toFixed(1)}s`);

const avS = beats.filter((b) => b.tipo === "avatar").reduce((a, b) => a + (b.ms_out - b.ms_in), 0) / 1000;
const totalMs = Math.max(...beats.map((b) => b.ms_out), ...overlays.map((o) => o.ms_out));
console.log(`avatar en pantalla: ${avS.toFixed(1)}s = ${(100 * avS / (totalMs / 1000)).toFixed(1)}% del video`);
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify({ beats, overlays, totalMs }, null, 0));
console.log(`-> _v3/${SLUG}_plan.json · totalMs ${totalMs} (${(totalMs / 60000).toFixed(2)} min)`);
