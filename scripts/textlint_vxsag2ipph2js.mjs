// textlint_vxsag2ipph2js.mjs — revisa TODOS los strings del beatsheet antes de rendear.
// El AUDITOR de la cuadrícula mira imágenes, no ortografía: los typos y el voseo se cuelan al render.
import fs from "node:fs";

const SLUG = "vxsag2ipph2js";
const bs = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8"));
const strings = [];
const walk = (v, path) => {
  if (typeof v === "string") strings.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) {
    if (["id", "kind", "src", "hue", "accent", "color", "state", "palette", "orientation", "position", "impactAccent"].includes(k)) continue;
    walk(x, `${path}.${k}`);
  }
};
for (const b of bs.beats) walk(b, b.id);

// \b de JS NO funciona con vocales acentuadas → borde a mano
const w = (s) => new RegExp(`(^|[^a-záéíóúñü])${s}(?![a-záéíóúñü])`, "i");
const VOSEO = ["vos", "tenés", "podés", "querés", "sabés", "mirá", "poné", "sacá", "agarrá", "fijate", "ponele",
  "dale", "lavandina", "placard", "caño", "pileta", "vereda", "laburo", "che", "acordate", "andá", "tirá", "dejá",
  "probá", "usá", "guardá", "cerrá", "cortá", "lavá", "tapá", "meté", "checá", "revisá", "buscá", "acá"];
// palabras que casi siempre se escriben SIN tilde por error
const SINTILDE = ["mas caro", "aqui", "asi ", "tambien", "despues", "numero", "ademas", "esta hecho", "vas a ver",
  "electronica", "metalica", "plastico", "milimetros", "camion", "botellon", "linterna de emergencia"];

let bad = 0;
for (const [path, s] of strings) {
  for (const v of VOSEO) if (w(v).test(s)) { console.log(`VOSEO   ${path}: "${s}"  ← ${v}`); bad++; break; }
  for (const t of ["asi", "aqui", "tambien", "despues", "numero", "ademas", "electronica", "metalica", "plastico", "milimetros", "mas"]) {
    if (w(t).test(s)) { console.log(`TILDE?  ${path}: "${s}"  ← ${t}`); bad++; break; }
  }
  if (/\$\s*\d|\d+\s*(usd|dólares? de la guía)/i.test(s) && /guía|manual|link/i.test(s)) { console.log(`PRECIO  ${path}: "${s}"`); bad++; }
  if (/https?:|vercel\.app|\.com/i.test(s)) { console.log(`URL     ${path}: "${s}"`); bad++; }
}
console.log(bad ? `✖ ${bad} strings a revisar (de ${strings.length})` : `✓ ${strings.length} strings limpios`);
