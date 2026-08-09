// merge_plan_lamina15.mjs — junta HOOK + D1..D8 en el plan único y corre las COMPUERTAS.
// Salida: _v3/lamina15_plan.json  (+ reporte por consola; exit 1 si algo bloquea)
import fs from "node:fs";

const rd = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));
const beats = rd("_v3/lamina15_beats.json");
const byName = new Map(beats.map((b) => [b.name, b]));

const parts = ["_v3/lamina15_plan_HOOK.json", ...["D1","D2","D3","D4","D5","D6","D7","D8"].map((d) => `_v3/lamina15_plan_${d}.json`), "_v3/lamina15_plan_GAPS.json"];
let all = [];
for (const f of parts) {
  if (!fs.existsSync(f)) { console.error("FALTA", f); process.exit(1); }
  const arr = rd(f);
  console.log(`${f.padEnd(34)} ${String(arr.length).padStart(4)} momentos`);
  all = all.concat(arr);
}

// ── normalizar el nombre a la convención de los beats (s_01 vs s_001 vs s_1) ──
const norm = (n) => {
  const m = String(n).match(/^s_0*(\d+)(_[a-z])?$/);
  if (!m) return String(n);
  const base = "s_" + String(m[1]).padStart(2, "0");
  return byName.has(base) ? base + (m[2] || "") : String(n);
};
for (const m of all) m.name = norm(m.name);

// ── ordenar por el ms del beat base, y los sufijos detrás de su base ──
const msOf = (n) => {
  const base = n.replace(/_[a-z]$/, "");
  return byName.get(base)?.ms ?? Number.MAX_SAFE_INTEGER;
};
all.sort((a, b) => (msOf(a.name) - msOf(b.name)) || a.name.localeCompare(b.name));

// ═══ COMPUERTAS ═══
let block = 0;
const warn = (s) => console.log("  ⚠ " + s);
const fail = (s) => { console.log("  ⛔ " + s); block++; };

// 1) cobertura: todo beat del cuerpo tiene al menos un momento
const covered = new Set(all.map((m) => m.name.replace(/_[a-z]$/, "")));
const missing = beats.filter((b) => !covered.has(b.name)).map((b) => b.name);
console.log(`\n[cobertura] ${covered.size}/${beats.length} beats cubiertos`);
if (missing.length) fail(`beats SIN plan (${missing.length}): ${missing.slice(0, 25).join(", ")}`);

// 2) pacing
const segs = all.map((m) => Number(m.seg) || 0).filter((s) => s > 0).sort((a, b) => a - b);
const q = (p) => segs[Math.floor(segs.length * p)];
const pctLong = (all.filter((m) => Number(m.seg) >= 5).length / all.length) * 100;
console.log(`[pacing]  mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · p90 ${q(0.9).toFixed(2)}s · max ${segs[segs.length-1].toFixed(1)}s · ≥5s: ${pctLong.toFixed(0)}%`);
if (q(0.5) < 3.2 || q(0.5) > 4.8) warn(`mediana fuera de 3,5-4,5 (${q(0.5).toFixed(2)}s)`);
if (pctLong < 32) fail(`sólo ${pctLong.toFixed(0)}% de planos ≥5s (piso 36-43%) → sucesión pareja, cansa`);
if (q(0.75) <= q(0.5) + 0.3) fail("p75 pegado a la mediana → todo dura lo mismo");
const over = all.filter((m) => Number(m.seg) > 12);
if (over.length) warn(`${over.length} planos >12s: ${over.map((m) => m.name).join(", ")}`);

// 3) componentes: densidad y variedad
const comps = all.filter((m) => m.comp && m.comp.kind);
const kinds = new Map();
for (const c of comps) kinds.set(c.comp.kind, (kinds.get(c.comp.kind) || 0) + 1);
const durTotal = beats[beats.length - 1].ms / 1000 + beats[beats.length - 1].dur;
console.log(`[comp]    ${comps.length} usos (${((comps.length/all.length)*100).toFixed(0)}% de los momentos · ${(comps.length/(durTotal/60)).toFixed(1)}/min) · ${kinds.size} kinds distintos`);
if (kinds.size < 6) fail(`sólo ${kinds.size} kinds distintos (piso 6)`);
console.log("          " + [...kinds.entries()].sort((a,b)=>b[1]-a[1]).map(([k,n])=>`${k}:${n}`).join("  "));

// cola muerta: la 2ª mitad tiene que tener componentes también
const half = durTotal / 2;
const late = comps.filter((c) => msOf(c.name) / 1000 > half).length;
console.log(`[cola]    ${late} componentes en la 2ª mitad (${((late/comps.length)*100).toFixed(0)}%)`);
if (late / comps.length < 0.33) fail("la 2ª mitad quedó vacía de componentes (cola muerta)");

// 4) texto de los componentes: argentinismos, typos de Whisper, nombre del kit en pantalla
const TEXT_KEYS = ["title","label","text","caption","eyebrow","desc","sub","figure","term","def","value"];
const collect = (o, acc = []) => {
  if (o == null) return acc;
  if (typeof o === "string") return acc;
  if (Array.isArray(o)) { o.forEach((x) => collect(x, acc)); return acc; }
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === "string" && TEXT_KEYS.includes(k)) acc.push([k, v]);
    else if (typeof v === "object") collect(v, acc);
  }
  return acc;
};
const BAD_WORDS = ["vos","tenés","podés","mirá","ponele","lavandina","placard","sos","querés","acá","pedas","instadas","fórale","loza"];
const KIND_NAMES = new Set([...kinds.keys()]);
let textIssues = 0;
for (const c of comps) {
  for (const [k, v] of collect(c.comp)) {
    for (const b of BAD_WORDS) {
      if (new RegExp("(^|[^a-záéíóúñ])" + b + "(?![a-záéíóúñ])", "i").test(v)) { warn(`${c.name} ${k}: "${v}"  ← "${b}"`); textIssues++; }
    }
    if (KIND_NAMES.has(v.trim().toLowerCase())) { fail(`${c.name} ${k} imprime el NOMBRE del componente: "${v}"`); }
    if (/^(componente|kind|mostrar|director)\b/i.test(v.trim())) fail(`${c.name} ${k} parece instrucción de dirección: "${v}"`);
  }
}
console.log(`[texto]   ${textIssues} avisos de voz/typo en props de componentes`);

// 5) spoilers de los loops
// ⚠️ La 1ª versión de estas regex daba TODO falsos positivos y me habría hecho
// "arreglar" cosas sanas: "unidad CONDENSAdora" (el aire acondicionado) disparaba
// el loop de la condensación, y "polvo en el aire" (la atmósfera del tapanco, que
// es correcta y está en casi todos los planos de interior) disparaba el del polvo.
// Lo que hay que detectar es el polvo SOBRE LA LÁMINA y la emisividad DEGRADÁNDOSE,
// no la palabra suelta. `except` exime los momentos donde el spoiler es deliberado.
const LEAKS = [
  {
    re: /polvo (sobre|encima|asentado|acumulado)|l[áa]mina (empolvada|opaca|sucia)|emisividad (sube|trepa|de 0,?05 a)|cara brillante hacia arriba/i,
    before: 239, what: "EL POLVO",
    // s_08 es el hook: el loop se PLANTA ahí a propósito, mostrando el síntoma sin el mecanismo
    except: new Set(["s_08"]),
  },
  { re: /\bR-?\s?\d|valor r|FTC|Comisi[óo]n Federal/i, before: 185, what: "VALOR R / FTC", except: new Set() },
  {
    re: /vapor de agua|condensaci[óo]n|se condensa|\bmoho\b|aislante mojado/i,
    before: 264, what: "BARRERA DE VAPOR / MOHO", except: new Set(),
  },
];
const idxOf = (n) => beats.findIndex((b) => b.name === n.replace(/_[a-z]$/, ""));
for (const L of LEAKS) {
  const leaked = all.filter((m) => {
    const i = idxOf(m.name);
    if (i < 0 || i >= L.before || L.except.has(m.name)) return false;
    const hay = JSON.stringify(m.comp || {}) + " " + (m.muestra || "") + " " + (m.prompt || "");
    return L.re.test(hay);
  });
  if (leaked.length) fail(`SPOILER de ${L.what} en: ${leaked.map((m) => m.name).join(", ")}`);
  else console.log(`[loop]    ${L.what}: sin filtración antes del índice ${L.before} ✓`);
}

// 6) queries genéricas
const GEN = /^(casa|calor|verano|techo|hombre trabajando|constructor|herramientas|aire)$/i;
const genQ = all.filter((m) => (m.queries || []).some((q) => GEN.test(String(q).trim())));
if (genQ.length) warn(`${genQ.length} momentos con query genérica: ${genQ.slice(0,8).map((m)=>m.name).join(", ")}`);
const noQ = all.filter((m) => !(m.queries || []).length);
if (noQ.length) fail(`${noQ.length} momentos SIN query: ${noQ.slice(0,10).map((m)=>m.name).join(", ")}`);

fs.writeFileSync("_v3/lamina15_plan.json", JSON.stringify(all, null, 1), "utf8");
console.log(`\n→ _v3/lamina15_plan.json  (${all.length} momentos)`);
console.log(block ? `\n⛔ ${block} COMPUERTA(S) BLOQUEANDO` : "\n✓ compuertas del plan OK");
process.exit(block ? 1 : 0);
