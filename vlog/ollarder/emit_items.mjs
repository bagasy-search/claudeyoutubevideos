// _v3/ollarder_shots.json → vlog/ollarder/imgs_items.json (gpt-image-2 Batch) + vlog/ollarder/anim_list.json (agnes v2.0, sólo bi con anim)
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/ollarder/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/ollarder_shots.json", "utf8"));
const items = [], anim = [];
for (const s of shots) {
  if (!["bi", "ole"].includes(s.kind)) continue;
  if (!s.prompt) { console.error("sin prompt:", s.name); process.exit(1); }
  items.push(s.kind === "ole" ? { name: s.name, prompt: s.prompt, ref: "public/ref_ollarder_face.png" } : { name: s.name, prompt: s.prompt });
  if (s.kind === "bi" && s.anim) anim.push({ nombre: s.name, motion: s.anim, person: /\b(hand|hands|thumb|finger|fingertip|knuckle|arm|gloved)\b/i.test(s.prompt) });
}
fs.writeFileSync(R + "vlog/ollarder/imgs_items.json", JSON.stringify(items, null, 1));
fs.writeFileSync(R + "vlog/ollarder/anim_list.json", JSON.stringify(anim, null, 1));
console.log("imágenes:", items.length, "(ole:", items.filter((i) => i.ref).length + ")", "· a animar (v2.0):", anim.length);
