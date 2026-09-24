// match_v3/5_apply_verdicts.mjs — aplica los veredictos del agente VERIFICADOR.
// verdicts.json: { "<beat>": {"ok":true} | {"ok":false,"action":"stock"|"retry","reason":"..."} }
//
// POLÍTICA ESTRICTA (default): un clip sin veredicto se manda a re-verificar/stock —
// en un pipeline que ya mostró 50% de basura, "sin dato" no puede significar "aprobado".
// (--lenient restaura el comportamiento viejo: sin veredicto = se conserva.)
//
// Además:
//   · lee el _stills.json (si se pasa) y rechaza automáticamente los techFail del gate
//   · los APROBADOS suben a _score 0.99 / _verified true (recién ahí stockfallback los respeta)
//   · los REPROBADOS alimentan la BLOCKLIST persistente (ese video no vuelve a ser candidato
//     en ningún video futuro) y salen en formato _needstock listo para stockfallback
//
// Uso: node match_v3/5_apply_verdicts.mjs <matched.json> <verdicts.json> [matchedOut.json] [--stills <_stills.json>] [--lenient]
import fs from "fs";
import { appendBlocklist, vidId } from "./lib.mjs";

const argv = process.argv.slice(2);
const LENIENT = argv.includes("--lenient");
const stillsIdx = argv.indexOf("--stills");
const stillsArg = stillsIdx >= 0 ? argv[stillsIdx + 1] : null;
const pos = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--stills");
const [matchedArg, verdArg, outArg] = pos;
if (!matchedArg || !verdArg) { console.error("Uso: node 5_apply_verdicts.mjs <matched.json> <verdicts.json> [out.json] [--stills _stills.json] [--lenient]"); process.exit(1); }
const out = outArg || matchedArg;
const rd = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));
const clips = rd(matchedArg);
const verdicts = rd(verdArg);
const stills = stillsArg && fs.existsSync(stillsArg) ? rd(stillsArg) : {};

const keep = [], reject = [];
for (const c of clips) {
  const tech = stills[c.name]?.techFail;
  if (tech) { reject.push({ name: c.name, concept: c.concept, query: c.query, dur: c._beatDur || c.dur, action: "stock", reason: `tech: ${tech}`, _url: c.url }); continue; }
  const v = verdicts[c.name];
  if (v && v.ok) { keep.push({ ...c, _score: 0.99, _verified: true }); continue; }
  if (!v) {
    if (LENIENT) { keep.push(c); continue; }
    reject.push({ name: c.name, concept: c.concept, query: c.query, dur: c._beatDur || c.dur, action: "retry", reason: "SIN VEREDICTO (estricto: re-verificar)", _url: c.url });
    continue;
  }
  reject.push({ name: c.name, concept: c.concept, query: c.query, dur: c._beatDur || c.dur, action: v.action || "stock", reason: v.reason || "", _url: c.url });
}
fs.writeFileSync(out, JSON.stringify(keep, null, 2));
const stem = out.replace(/\.json$/, "");
if (reject.length) {
  fs.writeFileSync(`${stem}_reject.json`, JSON.stringify(reject, null, 2));
  // needstock listo para stockfallback/fetch (solo los action:stock; los retry van a otro candidato)
  const toStock = reject.filter((r) => r.action !== "retry").map(({ name, concept, query, dur, reason }) => ({ name, concept, query, dur, why: reason }));
  if (toStock.length) fs.writeFileSync(`${stem}_needstock.json`, JSON.stringify(toStock, null, 2));
  // blocklist: los ids reprobados por CONTENIDO (no por falla técnica de descarga) no vuelven
  const badIds = reject.filter((r) => !/^tech:|^SIN VEREDICTO/.test(r.reason || "")).map((r) => vidId(r._url || "")).filter(Boolean);
  if (badIds.length) { appendBlocklist({ videos: badIds }); console.log(`blocklist += ${badIds.length} videos reprobados`); }
}
const nStock = reject.filter((r) => r.action !== "retry").length;
const nRetry = reject.filter((r) => r.action === "retry").length;
console.log(`aprobados: ${keep.length}/${clips.length} → ${out}${LENIENT ? " (LENIENT)" : ""}`);
console.log(`  reprobados: ${reject.length} (${nStock} a stock, ${nRetry} a re-matchear/re-verificar)${reject.length ? ` → ${stem}_reject.json` : ""}`);
reject.forEach((r) => console.log(`   ✗ ${r.name} [${r.action}] ${r.reason}`));
