// Planos DETALLE de comida (sin cara) del VLOG Vaquero: escenas.mjs DET {id: {first, last, prompt}}.
//   SLUG=x node vlog/cv/det.mjs img     → agnes_img_pro (gratis) → vlog/<slug>/det/anc/<id>_a.png, <id>_b.png
//   SLUG=x node vlog/cv/det.mjs clips [ids]  → agnes-video-2.5-flash keyframe a→b, seconds = T del tramo, CON su sonido
//                                        → det/clips/<id>.mp4 + det/state_det.json {id: {file, T}}
import fs from "node:fs"; import path from "node:path"; import { spawnSync } from "node:child_process"; import { pathToFileURL } from "node:url";
import { agnesGenerate } from "../../factory/lib/agnes_pool.mjs";
import { LIGHT, SETS } from "./lib.mjs";
const S = process.env.SLUG, R = `D:/Proyectos/video2-wt/${process.env.WT || S}/`, D = R + `vlog/${S}/`, W = D + "det/";
const { DET } = await import(pathToFileURL(D + "escenas.mjs").href);
const segs = Object.fromEntries(JSON.parse(fs.readFileSync(D + "segs.json", "utf8")).map((s) => [s.id, s]));
const [fase, ids0] = process.argv.slice(2); const ids = ids0 ? ids0.split(",") : Object.keys(DET);
fs.mkdirSync(W + "anc", { recursive: true }); fs.mkdirSync(W + "clips", { recursive: true });
const FOOD = " Real home cooking, not styled food photography: ordinary seasoned black cast iron, a few drips and crumbs, everything in focus, the whitewashed kitchen readable behind. No people visible except at most a hand; any hand is a weathered sun-tanned man's hand with a faded blue denim sleeve rolled to the forearm. " + LIGHT.split(". ").slice(0, 2).join(". ") + ".";
if (fase === "img") {
  // 3 pasos encadenados para que el par a→b sea LA MISMA toma en LA cocina del rancho (sin ref salían cocinas modernas distintas):
  //   1. placas vacías del set (cocina A1 / mesa A3)   2. <id>_a con ref = placa   3. <id>_b con ref = su <id>_a
  const run = (list, tag) => { if (!list.length) return 0; const L = W + `lista_${tag}.json`; fs.writeFileSync(L, JSON.stringify(list, null, 1));
    return spawnSync(process.execPath, [R + "scripts/agnes_img_pro.mjs", L, W + "anc", "--rondas", "3", "--work", W + "_pro_" + tag], { stdio: "inherit", cwd: R }).status; };
  const has = (n) => fs.existsSync(W + "anc/" + n + ".png");
  const PL = { stove: `Close view of an old black cast-iron wood-burning cook stove in ${SETS.A1.split("; ")[0]}: the black stovetop with round iron lids, an empty black cast-iron skillet on it, the whitewashed adobe wall behind darkened with old soot, cast-iron skillets hanging on hooks.`,
    table: `Close view of a long scarred wooden plank table in ${SETS.A3.split("; ")[0]}: worn wooden boards with knife marks, a clay jug and glass jars of dried beans and chiles at the back, a deep window in the thick adobe wall behind.` };
  const plate = (id) => (/plank table/.test(DET[id].first) ? "table" : "stove");
  run(Object.keys(PL).filter((k) => !has("_set_" + k)).map((k) => ({ name: "_set_" + k, prompt: PL[k] + " Empty, nobody in the frame." + FOOD })), "set");
  run(ids.filter((id) => !has(id + "_a") && has("_set_" + plate(id))).map((id) => ({ name: id + "_a", ref_lugar: true, ref: [W + "anc/_set_" + plate(id) + ".png"],
    prompt: DET[id].first + " The same kitchen as the reference image: same stove, same wall, same light." + FOOD })), "a");
  run(ids.filter((id) => DET[id].last && !has(id + "_b") && has(id + "_a")).map((id) => ({ name: id + "_b", ref_lugar: true, ref: [W + "anc/" + id + "_a.png"],
    prompt: "Exactly the same shot as the reference image, same camera position and framing, same pan, same food, same kitchen, a few seconds later. " + DET[id].last + FOOD })), "b");
  console.log("MEDIDO det img:", ids.filter((id) => has(id + "_a") && (!DET[id].last || has(id + "_b"))).length, "/", ids.length, "pares completos (sin last = sólo _a)");
}
if (fase === "clips") {
  const uri = (f) => "data:image/png;base64," + fs.readFileSync(f).toString("base64");
  const SF = W + "state_det.json", st = () => (fs.existsSync(SF) ? JSON.parse(fs.readFileSync(SF, "utf8")) : {});
  await Promise.all(ids.map(async (id, i) => {
    await new Promise((r) => setTimeout(r, i * 3000));
    const T = Math.min(12, Math.max(4, segs[id].T)), out = W + `clips/${id}.mp4`;
    if (fs.existsSync(out)) return;
    const body = { model: "agnes-video-2.5-flash", mode: "keyframe", seconds: String(T), size: "720P", aspect_ratio: "16:9",
      first_frame: uri(W + `anc/${id}_a.png`), ...(fs.existsSync(W + `anc/${id}_b.png`) ? { last_frame: uri(W + `anc/${id}_b.png`) } : {}), // sin _b = sólo primer cuadro (la acción no cambia el plato)
      prompt: `${DET[id].prompt} One continuous close shot, the camera barely moves, real kitchen sound of the cooking only (sizzle, bubbling, utensils), no voices, no music. Starts exactly on the first image${fs.existsSync(W + `anc/${id}_b.png`) ? " and ends exactly on the second image" : ""}.` };
    const r = await agnesGenerate(body, out, { tag: "det " + id });
    if (!r.ok) { console.log(id, "✗", r.error); return; }
    const s = st(); s[id] = { file: `${id}.mp4`, T }; fs.writeFileSync(SF, JSON.stringify(s, null, 1));
    console.log(new Date().toISOString().slice(11, 19), id, "ok", T + "s");
  }));
}
