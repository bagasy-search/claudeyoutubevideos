// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Opal hablando en la cocina: el número, los recibos sobre la mesa, la respuesta a Caleb.
// node vlog/opaldozen/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, COOP, BARN, PULLETS, KITCHEN } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/opaldozen/";
const T = R + "vlog/opaldozen/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/opaldozen/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/opaldozen_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/opaldozen_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "cents.")], m2: [st("m2"), endOf(st("m2"), "table")], m3: [st("m3"), endOf(st("m3"), "eggs?")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/opaldozen.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/opaldozen/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the kitchen background stays fully readable. The only light is what the place really has: morning daylight through the kitchen window; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases; feathers with real texture. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same navy blue flowered cotton dress with small buttons and the same grey and white pinstriped apron, grey hair pulled back in a loose low bun with stray strands.";
const TBL = "a worn wooden farmhouse kitchen table with a checked oilcloth covered in a big messy pile of crumpled receipts, an old adding machine with a paper tape and a carton of brown eggs";
const anchors = [
  A("K0", ["k0"], `Same woman, a bright Sunday morning in ${KITCHEN.split(":")[0]}. ${WHO} sits at ${TBL}, holding up one brown egg in her fingers toward the camera, eyebrows raised, a wry knowing face.` + same),
  A("K1", ["K0"], "A few seconds later, same kitchen table: she lowers the egg and taps the adding machine tape with one finger, looking at the camera, dry and amused." + same),
  A("K2", ["K0"], `Same morning, same kitchen: she stands at the table tipping an old shoebox upside down, crumpled receipts pouring out onto the table, looking at the camera.` + same),
  A("K3", ["K2"], "A few seconds later: she sits down at the table among the spilled receipts and picks up a pencil, glancing at the camera." + same),
  A("K4", ["K0"], "Same table a while later: she sits back in her chair with her arms crossed and one eyebrow raised, a dry little smile, looking at the camera as if someone just asked her something silly." + same),
  A("K5", ["K4"], "A few seconds later, same place: she tilts her head and shrugs one shoulder with a patient smile at the camera." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Four dollars and thirty-seven cents.", action: "She holds up the egg and says the number to the camera, then taps the paper tape." + same },
  { id: "m2", a: "K2", b: "K3", audio: T + "m2.wav", text: "and on Sunday I dumped it out on the kitchen table", action: "She tips the shoebox and the receipts pour out onto the table, then sits down." + same },
  { id: "m3", a: "K4", b: "K5", audio: T + "m3.wav", text: "so why don't you just buy eggs?", action: "Arms crossed, she repeats her grandson's question to the camera with a dry smile and a little shrug." + same },
];
const plan = { dir: R + "vlog/opaldozen/M1", face: R + "public/ref_opaldozen_facebig.png", k0_from: R + "public/ref_opaldozen.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/opaldozen/M1/out.mp4" };
fs.writeFileSync(R + "vlog/opaldozen/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
