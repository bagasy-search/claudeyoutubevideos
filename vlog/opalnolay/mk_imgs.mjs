// lista de imágenes gpt-image-2 (bi sin ref / hz con la cara) desde el DIRECTOR → _v3/opalnolay_imgs.json
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/opalnolay/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/opalnolay_shots.json", "utf8"));
const items = shots.filter((s) => (s.kind === "bi" || s.kind === "hz") && s.prompt).map((s) => ({ name: s.name, prompt: s.prompt, ...(s.kind === "hz" ? { ref: ["public/ref_opalnolay_face.png"] } : {}) }));
const { BEDS } = await import("./dir_c.mjs");
for (const b of BEDS) items.push({ name: b.name, prompt: b.p });
const out = items.filter((i) => !fs.existsSync(R + `public/img/opalnolay/${i.name}.jpg`) && !fs.existsSync(R + `public/img/opalnolay/${i.name}.png`));
fs.writeFileSync(R + "_v3/opalnolay_imgs.json", JSON.stringify(out, null, 1));
const bad = items.filter((i) => /cinematic|8k|bokeh|golden hour|photorealistic|shallow depth|out of focus/i.test(i.prompt));
console.log("imágenes", items.length, "· con cara", items.filter((i) => i.ref).length, "· faltan", out.length, "· prompts con tokens prohibidos", bad.map((b) => b.name).join(" ") || 0);
