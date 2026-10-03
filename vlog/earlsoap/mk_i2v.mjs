// lista agnes v2.0 i2v (2 s ralentí → 4,03 s) para cada foto b-roll SIN Hazel del DIRECTOR → _v3/earlsoap_i2v.json
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/earlsoap/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/earlsoap_shots.json", "utf8"));
const only = process.argv.slice(2);
const L = shots.filter((s) => s.kind === "bi" && s.anim && (!only.length || only.includes(s.name)))
  .filter((s) => only.length || !fs.existsSync(R + `public/broll/earlsoap/${s.name}.mp4`))
  .map((s) => ({ nombre: s.name, motion: s.anim, gente: /\b(hand|hands|finger|fingers|man|men|woman|dealer|dealers|people|couple|volunteer|sister|brother|watchmaker|he|she|his|her)\b/i.test(s.prompt.split(" One ordinary frame")[0] + " " + s.anim) }));
fs.writeFileSync(R + "_v3/earlsoap_i2v.json", JSON.stringify(L, null, 1));
console.log("clips i2v", L.length, "· con gente", L.filter((x) => x.gente).length);
