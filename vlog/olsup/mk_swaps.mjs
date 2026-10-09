// st sin stock aceptable → imagen gpt (swap): prompt armado desde la consulta. node vlog/olsup/mk_swaps.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olsup/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olsup_shots.json", "utf8"));
const SW = fs.existsSync(R + "_v3/olsup_swap.json") ? JSON.parse(fs.readFileSync(R + "_v3/olsup_swap.json", "utf8")) : {};
const TAIL = " One ordinary frame from a normal handheld video shot at eye level with a phone, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no labels, no logos. The scene is set in the 1920s: everyone wears old wool, flannel and canvas clothing, no jeans, no t-shirts, no baseball caps; no modern appliances, no electric or glass-top stove, no vehicles, no plastic, nothing modern anywhere; only cast iron, enamel, wood and tin.";
let n = 0;
for (const s of shots) {
  if (s.kind !== "st" && s.kind !== "swap") continue;
  if (fs.existsSync(R + `public/broll/olsup_st30/${s.name}.mp4`)) continue;
  if (SW[s.name]) continue;
  SW[s.name] = `Close-up food photograph in a 1920s log camp cook shack: ${s.q}. The food and the cookware fill most of the frame, seen at table height from slightly above; at most a pair of weathered hands or forearms in a wool sleeve are visible, no faces and no other people. Cast iron, enamelware and rough wood, flour dust, steam where the food is hot, warm lantern or window light, a little of the log wall behind.` + TAIL; n++;
}
fs.writeFileSync(R + "_v3/olsup_swap.json", JSON.stringify(SW, null, 1));
console.log("swaps nuevos:", n, "total", Object.keys(SW).length);
