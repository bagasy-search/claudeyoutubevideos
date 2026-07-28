// normalize_plan_vlhdvm2isyur.mjs — arregla props que el mapeador del kit NO lee.
// Dos bugs reales encontrados al auditar las firmas contra FedererComponents.tsx:
//  1) `stat` → BigStatReveal lee value/prefix/suffix/label(support)/eyebrow. Los beats escritos con
//     big/unit salían con un "0" gigante y sin bajada.
//  2) `rule` → renderFedererComp llama a ChapterTitle SIN pasar `sub`, y ChapterTitle tiene el
//     default "y cómo esquivarlo en 30 segundos" (kit/premium/frame.tsx:62). O sea: ese texto
//     aparecía en pantalla en los 7 beats `rule`, sin que nadie lo escribiera. Los paso a `headline`.
import fs from "fs";

const F = "public/comp_plan_vlhdvm2isyur.json";
const plan = JSON.parse(fs.readFileSync(F, "utf8"));
let fixedStat = 0, fixedRule = 0;

for (const b of plan) {
  if (b.kind === "stat" && b.big !== undefined && b.value === undefined) {
    const m = String(b.big).match(/(\d+(?:[.,]\d+)?)/);
    const num = m ? Number(m[1].replace(",", ".")) : 0;
    const rango = String(b.big).match(/^(\d+)\s*[-–a]\s*(\d+)/);
    b.value = rango ? Number(rango[2]) : num;
    if (rango) b.prefix = `${rango[1]} a `;
    // lo que queda después del número es el sufijo ("meses", "%", "hombres"…)
    const resto = String(b.big).replace(/^[\d\s.,\-–a]+/, "").trim();
    b.suffix = resto ? ` ${resto}` : "";
    if (!b.eyebrow && b.unit) b.eyebrow = String(b.unit).charAt(0).toUpperCase() + String(b.unit).slice(1);
    delete b.big; delete b.unit;
    fixedStat++;
  }
  if (b.kind === "rule") {
    // ChapterTitle mete un `sub` de ejemplo que nadie escribió → lo evito pasando a headline.
    const title = b.title || "";
    b.kind = "headline";
    b.tokens = title.split(/\s+/).map((w, i, a) => (i === a.length - 1 ? { t: w, hl: true } : { t: w }));
    b.eyebrow = b.sub || b.eyebrow || undefined;
    delete b.title; delete b.number; delete b.sub;
    fixedRule++;
  }
}

fs.writeFileSync(F, JSON.stringify(plan, null, 0));
console.log(`normalizados: ${fixedStat} stat (big/unit → value/suffix) · ${fixedRule} rule → headline`);
