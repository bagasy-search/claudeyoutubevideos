// métricas VISIBLES (lo que no tapan los componentes a pantalla completa)
import fs from "fs";
const t = fs.readFileSync("src/rowereddots/cues.gen.ts", "utf8");
const g = (n) => JSON.parse(t.split(`export const ${n}: any[] = `)[1].split(";\n")[0]);
const B = g("BASE"), C = g("COMPS"), T = +t.match(/TOTAL_FRAMES = (\d+)/)[1];
const OV = new Set(["lowerthird", "frasecinetica"]);
const cov = new Uint8Array(T);
C.filter((c) => !OV.has(c.kind)).forEach((c) => { for (let f = c.from; f < c.from + c.dur && f < T; f++) cov[f] = 1; });
let av = 0, st = 0, avc = 0;
B.forEach((b) => { for (let f = b.from; f < b.from + b.dur; f++) { if (cov[f]) { if (b.kind === "avatar") avc++; continue; } if (b.kind === "avatar") av++; if ((b.src || "").includes("/stock/")) st++; } });
console.log(`midió ${B.length} cues · ${C.length} comps · ${T} cuadros`);
console.log(`visible: avatar ${(100 * av / T).toFixed(1)}% · stock real ${(100 * st / T).toFixed(1)}% · comps full ${(100 * cov.reduce((a, b) => a + b, 0) / T).toFixed(1)}% · avatar tapado ${(avc / 30).toFixed(0)}s`);
C.filter((c) => !OV.has(c.kind) && c.dur > 450).forEach((c) => console.log(`  largo: ${c.kind} @${(c.from / 30).toFixed(0)}s ${(c.dur / 30).toFixed(1)}s`));
