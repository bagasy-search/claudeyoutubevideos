// Lista agnes v2.0 (clips mudos 2 s + ralentí) para las tomas `bi` con `anim` que NO tienen stock real. node vlog/lordeviled/mk_i2v.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lordeviled/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/lordeviled_shots.json", "utf8"));
const seen = new Set(), out = [];
for (const s of shots) {
  if (s.kind !== "bi" || !s.anim || seen.has(s.name)) continue; seen.add(s.name);
  if (fs.existsSync(R + `public/broll/lordeviled_st/${s.name}.mp4`) || fs.existsSync(R + `public/broll/lordeviled/${s.name}.mp4`)) continue;
  const gente = /(woman|women|ladies|lady|man's|a man|people|child|hand|thumb|finger|crowd|line of)/i.test(s.prompt);
  out.push({ nombre: s.name, motion: s.anim, ...(gente ? { gente: true } : {}) });
}
fs.writeFileSync(R + "_v3/lordeviled_i2v.json", JSON.stringify(out, null, 1));
console.log(out.length, "clips v2.0 ·", out.filter((x) => x.gente).length, "con gente/manos");
