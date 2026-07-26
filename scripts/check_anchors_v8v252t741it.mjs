// check_anchors_v8v252t741it.mjs — valida que TODAS las anclas de frase que escribieron los
// directores existan de verdad en los captions. Una frase mal copiada no rompe el build: cae en
// el fallback y el visual aparece en el momento equivocado, en silencio. Esto la caza antes.
//   node scripts/check_anchors_v8v252t741it.mjs [--fix]
// Con --fix, borra del JSON las entradas de b-roll cuya ancla no resuelve (en beats solo avisa).
import fs from "fs";

const SLUG = "v8v252t741it";
const FIX = process.argv.includes("--fix");
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (caps.words || caps).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
const find = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i <= CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};

let totalBad = 0;
// ── B-ROLL ────────────────────────────────────────────────────────────────────
for (const n of [1, 2, 3]) {
  const f = `_broll_seg${n}_${SLUG}.json`;
  if (!fs.existsSync(f)) { console.log(`(falta ${f})`); continue; }
  const arr = JSON.parse(fs.readFileSync(f, "utf8"));
  const bad = arr.filter((b) => find(b.at) == null);
  console.log(`broll seg${n}: ${arr.length} entradas · anclas rotas ${bad.length}`);
  bad.slice(0, 5).forEach((b) => console.log(`   ✗ "${b.at}"`));
  totalBad += bad.length;
  if (FIX && bad.length) {
    const ok = arr.filter((b) => find(b.at) != null);
    fs.writeFileSync(f, JSON.stringify(ok, null, 1));
    console.log(`   → limpiadas, quedan ${ok.length}`);
  }
}
// ── BEATS ─────────────────────────────────────────────────────────────────────
const IMG = new Set(fs.readdirSync("public/img").filter((f) => /\.png$/i.test(f)).map((f) => f.replace(/\.png$/i, "")));
for (const n of [1, 2, 3]) {
  const f = `_beats_seg${n}_${SLUG}.json`;
  if (!fs.existsSync(f)) { console.log(`(falta ${f})`); continue; }
  const secs = JSON.parse(fs.readFileSync(f, "utf8"));
  let badSec = 0, badAt = 0, badImg = new Set(), comps = 0;
  const kinds = {};
  for (const s of secs) {
    if (s.phrase && find(s.phrase) == null) { badSec++; if (badSec <= 4) console.log(`   ✗ sección "${s.phrase}"`); }
    for (const b of s.beats || []) {
      kinds[b.t] = (kinds[b.t] || 0) + 1;
      if (b.t !== "talk" && b.t !== "raw") comps++;
      for (const k of ["at", "flipPhrase"]) if (b[k] && find(b[k]) == null) badAt++;
      for (const it of b.items || []) if (it && it.atPhrase && find(it.atPhrase) == null) badAt++;
      // ojo: en `nametag`, b.name es el nombre de la PERSONA, no un asset
      const asNames = b.t === "nametag" ? [b.image] : [b.name, b.image];
      for (const nm of asNames) if (nm && !IMG.has(String(nm).replace(/^img\//, "").replace(/\.png$/, ""))) badImg.add(nm);
      for (const it of [...(b.items || []), ...(b.steps || [])]) if (it && it.image && !IMG.has(String(it.image).replace(/^img\//, "").replace(/\.png$/, ""))) badImg.add(it.image);
    }
  }
  console.log(`beats seg${n}: ${secs.length} secciones · ${comps} componentes · tipos ${Object.keys(kinds).length}`);
  console.log(`   secciones sin anclar ${badSec} · anclas de beat rotas ${badAt} · imágenes inexistentes ${badImg.size}`);
  if (badImg.size) console.log("   ✗ img:", [...badImg].slice(0, 8).join(" "));
  totalBad += badSec + badAt + badImg.size;
}
console.log(totalBad === 0 ? "\n✓ todas las anclas y assets resuelven" : `\n⚠ ${totalBad} problemas — revisalos antes de generar`);
