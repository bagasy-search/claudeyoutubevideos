import fs from "node:fs";
import { SCENES } from "./guion_src.mjs";
let full = "", voz = [], ids = new Set(), n = { h: 0, d: 0, w: 0, lam: 0 }, lens = [];
for (const s of SCENES) {
  full += `\n## ${s.id} — ${s.lugar}\n`;
  for (const l of s.lines) {
    if (ids.has(l.id)) throw new Error("id dup " + l.id); ids.add(l.id); n[l.k]++;
    if (l.k === "w") { full += `[${s.id} · ${s.lugar} · ROSA habla (audio propio agnes) · ${l.a}]\nROSA: ${l.t}\n`; continue; }
    if (l.k === "lam") { full += `[LÁMINA a pantalla completa, zoom punto por punto, la voz sigue]\n${l.t}\n`; voz.push(l.t); continue; }
    full += `[${s.id} · ${s.lugar} · ${l.k === "d" ? "DETALLE (manos, voz encima): " : ""}${l.a}]\n${l.t}\n`;
    voz.push(l.t); lens.push([l.id, l.t.length]);
  }
}
fs.writeFileSync("guion_faoliva.txt", full.trimStart().replace(/\r/g, ""));
fs.writeFileSync("guion_voz.txt", voz.join("\n") + "\n");
console.log("voz chars", voz.join(" ").length, "lineas voz", voz.length, JSON.stringify(n), "rosa chars", SCENES.flatMap(s=>s.lines).filter(l=>l.k==="w").reduce((a,l)=>a+l.t.length,0));
console.log(">140:", lens.filter(x => x[1] > 140).map(x => x.join(":")).join(" "), "| <60:", lens.filter(x => x[1] < 60).map(x => x.join(":")).join(" "));
