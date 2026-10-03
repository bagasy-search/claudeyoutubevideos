// lista de imágenes gpt-image-2 (bi sin ref / hz con la cara) desde el DIRECTOR → _v3/hlheater_imgs.json
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/hlheater/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/hlheater_shots.json", "utf8"));
const items = shots.filter((s) => (s.kind === "bi" || s.kind === "hz") && s.prompt).map((s) => ({ name: s.name, prompt: s.prompt, ...(s.kind === "hz" ? { ref: ["public/ref_hlheater_face.png"] } : {}) }));
for (const f of ["./dir_a.mjs", "./dir_b.mjs", "./dir_c.mjs"]) { const { BEDS = [] } = await import(f); for (const b of BEDS) items.push({ name: b.name, prompt: b.p }); }
const out = items.filter((i) => !fs.existsSync(R + `public/img/hlheater/${i.name}.jpg`) && !fs.existsSync(R + `public/img/hlheater/${i.name}.png`));
fs.writeFileSync(R + "_v3/hlheater_imgs.json", JSON.stringify(out, null, 1));
const bad = items.filter((i) => /cinematic|8k|bokeh|golden hour|photorealistic|shallow depth|out of focus/i.test(i.prompt));
console.log("imágenes", items.length, "· con cara", items.filter((i) => i.ref).length, "· faltan", out.length, "· prompts con tokens prohibidos", bad.map((b) => b.name).join(" ") || 0);
