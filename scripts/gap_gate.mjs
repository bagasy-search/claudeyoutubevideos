// gap_gate.mjs — COMPUERTA ANTI-HUECO / ANTI-NEGRO (video-pipeline §2, regla 2).
//   node scripts/gap_gate.mjs <slug>
//
// Simula el timeline cada 0.2s reproduciendo el buildWindows REAL del Main y exige
// CERO instantes con el avatar no-full y sin contenido encima. Eso es exactamente lo que
// se ve como PANTALLA NEGRA.
//
// Por que existe: `blackdetect` sobre el mp4 tambien lo caza, pero recien DESPUES de 30 min
// de farm. Medido en grcoffee: 3.57s de negro entre 6.8s y 10.38s porque el bloque del HOOK
// "retomaba" su propio hidden en vez de preguntar si habia contenido, y el 1er clip arrancaba
// recien en 10.38s. Este gate lo hubiera dicho en 2 segundos.
//
// ⚠ La simulacion tiene que reproducir el buildWindows REAL, colapso por prioridad incluido.
// Una simulacion que EXCLUYA los overlay de "lo que oculta" da 0 huecos y MIENTE.
import { readFileSync, existsSync } from "node:fs";

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/gap_gate.mjs <slug>"); process.exit(1); }

const beatsPath = [`src/_fed6/VideoEdit/${slug}_beats.ts`, `src/VideoEdit/cues_${slug}.gen.tsx`]
  .find((p) => existsSync(p));
const mainPath = [`src/_fed6/VideoEdit/Main_${slug}.tsx`, `src/VideoEdit/Main_${slug}.tsx`]
  .find((p) => existsSync(p));
if (!beatsPath || !mainPath) { console.error("✗ no encontre beats o Main"); process.exit(1); }

const bs = readFileSync(beatsPath, "utf8");
const grab = (re) => { const m = bs.match(re); return m ? JSON.parse(m[1]) : []; };
const BEATS = grab(/[A-Z_]+_BEATS[^=]*=\s*(\[[\s\S]*?\]);/);
const COVER = grab(/[A-Z_]+_COVER[^=]*=\s*(\[[\s\S]*?\]);/);
const END = +(bs.match(/VIDEO_END\s*=\s*([\d.]+)/) || [])[1] || 0;

const mainSrc = readFileSync(mainPath, "utf8");
// los conjuntos REALES del Main (no se asumen: se leen)
const setOf = (name) => {
  const m = mainSrc.match(new RegExp(`const ${name} = new Set\\(\\[([\\s\\S]*?)\\]\\)`));
  return new Set(m ? [...m[1].matchAll(/"([a-z0-9_]+)"/g)].map((x) => x[1]) : []);
};
const OVERLAY = setOf("OVERLAY");
const NEWFULL = setOf("NEWFULL");
const capOf = (k) => {
  const m = mainSrc.match(new RegExp(`k === "${k}" \\? ([\\d.]+)`));
  return m ? +m[1] : 6;
};
const isComp = (k) => k !== "raw";
const comps = BEATS.filter((b) => b && isComp(b.kind));
const compDur = (b) => {
  const next = comps.filter((x) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a, c) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// contenido = COVER (b-roll / fotos) + componentes que NO son overlay (esos tapan la pantalla)
const spans = [];
for (const c of COVER) spans.push([c.start, c.start + c.cov]);
for (const b of comps) if (!OVERLAY.has(b.kind)) spans.push([b.start, b.start + compDur(b)]);
spans.sort((a, b) => a[0] - b[0]);
const cubierto = (t) => spans.some(([s, e]) => t >= s - 0.05 && t < e - 0.05);

// ── VENTANAS DEL AVATAR: hay que reproducir el buildWindows REAL ──────────────────────────
// Un hueco de CONTENIDO no es un problema: el avatar es el fondo garantizado y vuelve a full.
// El problema es el instante con el avatar NO-FULL **y** sin contenido: ESO es pantalla negra.
// (Sin esta parte el gate marcaba 157 huecos y 355s cuando blackdetect encontraba UNO solo.)
const hookEnd = +(mainSrc.match(/HOOK_END\s*=\s*([\d.]+)/) || [])[1] || 0;
const hookIni = 1.4;
const pts = [{ start: 0, mode: "full", pr: 0 }];
for (const c of COVER) {
  pts.push({ start: c.start, mode: "hidden", pr: 3 });
  pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
}
for (const b of comps) {
  if (OVERLAY.has(b.kind)) continue;              // los overlay NO ocultan al avatar
  const d = compDur(b);
  pts.push({ start: b.start, mode: "hidden", pr: 4 });
  pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });
}
pts.sort((a, b) => a.start - b.start || a.pr - b.pr);   // pr ASCENDENTE: a igual ms gana el mayor
const coll = [];
let last = "";
for (const p of pts) if (p.mode !== last) { coll.push({ start: p.start, mode: p.mode }); last = p.mode; }
// bloque del HOOK: hay que emular LA VARIANTE QUE EL MAIN USA DE VERDAD, no la que uno quisiera.
// (1er intento de este gate: hardcodeé acá la versión ARREGLADA, así que simulaba siempre un Main
//  sano y no podía cazar el bug ni reintroduciéndolo a propósito. Un gate que no falla nunca no es
//  un gate.) Se lee la expresión real del push de HOOK_END y se distinguen las dos formas:
//   · "retoma" la ventana previa  -> hereda el hidden del propio hook aunque no haya contenido
//   · consulta si HAY contenido    -> vuelve a full y no puede quedar negro
const hookExpr = (mainSrc.match(/start:\s*HOOK_END,\s*mode:\s*([^}]+)\}/) || [])[1] || "";
const hookRetoma = /resume/.test(hookExpr);
const hookConsultaContenido = /hayContenido|cubierto|COVER/.test(hookExpr);
if (!hookRetoma && !hookConsultaContenido)
  console.log("   ⚠ no pude leer la lógica del HOOK — se asume el peor caso (hereda el hidden)");
const post = coll.filter((w) => w.start < hookIni || w.start >= hookEnd);
post.push({ start: 0, mode: "full" }, { start: hookIni, mode: "hidden" });
post.push({
  start: hookEnd,
  mode: hookConsultaContenido
    ? (cubierto(hookEnd) ? "hidden" : "full")            // variante SANA
    : "hidden",                                          // variante que hereda el hidden del hook
});
post.sort((a, b) => a.start - b.start);
const wins = [];
for (const x of post) if (!wins.length || wins[wins.length - 1].mode !== x.mode) wins.push(x);
const modoEn = (t) => { let m = "full"; for (const w of wins) { if (w.start <= t) m = w.mode; else break; } return m; };

const huecos = [];
let ini = null;
for (let t = 0; t < END; t = +(t + 0.2).toFixed(2)) {
  const enHook = t >= hookIni && t < hookEnd;      // ahí lo tapa el AvatarScrimText
  const vacio = !cubierto(t) && !enHook && modoEn(t) !== "full";
  if (vacio && ini === null) ini = t;
  if (!vacio && ini !== null) { if (t - ini >= 0.4) huecos.push([ini, t]); ini = null; }
}
if (ini !== null && END - ini >= 0.5) huecos.push([ini, END]);

console.log(`── HUECOS · ${slug} · ${END}s · ${spans.length} tramos de contenido`);
console.log(`   OVERLAY (no tapan): ${[...OVERLAY].join(", ") || "—"}`);
if (!huecos.length) { console.log("✅ cero instantes con el avatar no-full y sin contenido — no puede haber pantalla negra"); process.exit(0); }
const total = huecos.reduce((a, [s, e]) => a + (e - s), 0);
for (const [s, e] of huecos.slice(0, 15)) console.log(`  ⛔ ${s.toFixed(1)}s → ${e.toFixed(1)}s  (${(e - s).toFixed(1)}s sin nada)`);
if (huecos.length > 15) console.log(`  … y ${huecos.length - 15} más`);
console.log(`\n⛔ ${huecos.length} hueco(s), ${total.toFixed(1)}s en total. Avatar NO-full y sin contenido = PANTALLA NEGRA.`);
process.exit(1);
