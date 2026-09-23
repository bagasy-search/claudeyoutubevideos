import fs from "node:fs";
import { SCENES } from "./guion_src.mjs";
let full = "", voz = [];
for (const s of SCENES) {
  full += `\n## ${s.id} — ${s.lugar}\n`;
  for (const l of s.lines) {
    if (l.k === "w") { full += `[${s.id} · ${s.lugar} · CARMEN habla (audio propio agnes) · ${l.a}]\nCARMEN: ${l.t}\n`; continue; }
    if (l.k === "lam") { full += `[LÁMINA a pantalla completa, zoom punto por punto, la voz sigue]\n${l.t}\n`; voz.push(l.t); continue; }
    full += `[${s.id} · ${s.lugar} · ${l.k === "d" ? "DETALLE (manos, voz encima): " : ""}${l.a}]\n${l.t}\n`;
    voz.push(l.t);
  }
}
fs.writeFileSync("guion_faperejil.txt", full.trimStart().replace(/\r/g, ""));
fs.writeFileSync("guion_voz.txt", voz.join("\n") + "\n");
console.log("voz chars", voz.join(" ").length, "lineas", voz.length);
