// Valida que cada `at` de los dir_*.mjs exista (palabras consecutivas) en su párrafo del guion filmado. node vlog/lorham/check_at.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lorham/";
const lines = fs.readFileSync(R + "guiones/lorham_filmado.txt", "utf8").split("\n").filter(Boolean);
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const P = lines.map((l) => norm(l.replace(/\[[^\]]*\]/g, " ")).map((w) => w.replace(/ /g, "")));
let bad = 0, n = 0; const names = {};
for (const f of ["dir_a", "dir_b", "dir_c", "dir_d"]) {
  if (!fs.existsSync(R + `vlog/lorham/${f}.mjs`)) continue;
  const { SHOTS } = await import(`file:///${R}vlog/lorham/${f}.mjs`);
  for (const s of SHOTS) {
    n++; if (s.p >= P.length) { console.log("párrafo fuera de rango", s.p); bad++; continue; }
    if (s.at) { const q = norm(s.at); let ok = false; for (let i = 0; i + q.length <= P[s.p].length && !ok; i++) ok = q.every((t, k) => P[s.p][i + k] === t); if (!ok) { console.log(`p${s.p} no encuentro "${s.at}" [${s.name}]`); bad++; } }
    if (["bi", "ei", "lor"].includes(s.kind)) { if (!s.prompt) { console.log("sin prompt", s.name); bad++; } if (names[s.name]) { console.log("nombre repetido", s.name); bad++; } names[s.name] = 1; }
  }
}
console.log("tomas", n, "· problemas", bad);
