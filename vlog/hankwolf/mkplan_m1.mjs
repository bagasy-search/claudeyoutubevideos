// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Earl hablando (ancla→ancla) en su galpón del muelle.
// node vlog/hankwolf/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, SHED } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/hankwolf/";
const T = R + "vlog/hankwolf/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/hankwolf/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/hankwolf_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/hankwolf_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "saturday.")], m2: [st("m2"), endOf(st("m2"), "soap.")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/hankwolf.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/hankwolf/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the shed, the coolers and the boats behind stay fully readable. The only light is what the place really has: overcast Gulf Coast daylight from the open side of the shed plus the fluorescent tubes; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, deep lines and uneven tone; real creases in the denim shirt; wet concrete. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; he moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " He wears the same faded light-blue denim work shirt open over a navy t-shirt, short white hair and white mustache.";
const anchors = [
  A("K0", ["k0"], `Same man, same place. ${WHO} stands in ${SHED}, holding one big raw pink shrimp up between two fingers, looking at the camera and talking like he is telling a story.` + same),
  A("K1", ["K0"], "A few seconds later, same place: he holds the shrimp a little away from his face and makes a sour, disgusted face, lips pulled down, one eyebrow raised." + same),
  A("K2", ["K1"], "Same place a moment later: he drops the shrimp back on the ice and gives the camera a dry, knowing look." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "My neighbor put a plate of shrimp in front of me at his cookout last Saturday.", action: "He holds up a shrimp and tells the story to the camera, then starts to make a sour face." + same },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "these taste like soap.", action: "He makes a sour, disgusted face at the shrimp and drops it back on the ice, then looks at the camera." + same },
];
const plan = { dir: R + "vlog/hankwolf/M1", face: R + "public/ref_hankwolf_facebig.png", k0_from: R + "public/ref_hankwolf.png", pronoun: "he", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/hankwolf/M1/out.mp4" };
fs.writeFileSync(R + "vlog/hankwolf/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
