// chequea que cada at("frase") de los capítulos exista en words.json (sin renderizar nada)
import fs from "node:fs";
const w = JSON.parse(fs.readFileSync(new URL("./words.json", import.meta.url)));
const n = w.map((x) => x.text.toLowerCase().replace(/[^a-z0-9]/g, ""));
const files = process.argv.slice(2);
for (const f of files) {
  const src = fs.readFileSync(new URL("./" + f, import.meta.url), "utf8");
  for (const m of src.matchAll(/\bat(?:End)?\("([^"]+)"/g)) {
    const q = m[1].toLowerCase().split(/\s+/).map((x) => x.replace(/[^a-z0-9]/g, "")).filter(Boolean);
    const hits = [];
    for (let i = 0; i < n.length; i++) if (q.every((x, j) => n[i + j] === x)) hits.push((w[i].startMs / 1000 + 28.3).toFixed(1));
    if (!hits.length) console.log(f, "FALTA:", m[1]);
    else if (hits.length > 1) console.log(f, "VARIAS:", m[1], hits.join(" "));
  }
}
