// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Opal hablando (ancla→ancla) en el gallinero con Clover.
// node vlog/opalpred/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, COOP } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/opalpred/";
const T = R + "vlog/opalpred/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/opalpred/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/opalpred_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/opalpred_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "dead.")], m2: [st("m2"), endOf(st("m2"), "gone.")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/opalpred.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/opalpred/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the coop background stays fully readable. The only light is what the place really has in the evening: one warm bulb hanging from a rafter and the last daylight from the open door; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases; feathers with real texture. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same navy blue flowered cotton dress with small buttons and the same grey and white pinstriped apron, grey hair pulled back in a loose low bun with stray strands.";
const anchors = [
  A("K0", ["k0"], `Same woman, early grey morning. ${WHO} stands just inside the open door of ${COOP}, an empty wicker egg basket on her arm, staring toward the back corner of the coop with a stunned, horrified face, one hand over her mouth.` + same),
  A("K1", ["K0"], "A few seconds later, same place: she has knelt down on the straw and holds up a single red feather between her fingers toward the camera, wide-eyed, mouth open in shock." + same),
  A("K2", ["K1"], "Same place a few seconds later: still kneeling, she lowers the feather and looks at the camera with a sad, grim, determined face." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Tuesday morning I opened the coop door, and three of my hens were dead.", action: "She stares at the back corner, stunned, then kneels down and picks up a red feather." + same },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "And Pearl's head was gone.", action: "She holds up the red feather toward the camera, shocked, then lowers it with a grim face." + same },
];
const plan = { dir: R + "vlog/opalpred/M1", face: R + "public/ref_opalpred_facebig.png", k0_from: R + "public/ref_opalpred.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/opalpred/M1/out.mp4" };
fs.writeFileSync(R + "vlog/opalpred/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
