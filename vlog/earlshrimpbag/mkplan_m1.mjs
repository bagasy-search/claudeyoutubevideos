// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Earl hablando (ancla→ancla) en su galpón del muelle.
// node vlog/earlshrimpbag/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, SHED } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/earlshrimpbag/";
const T = R + "vlog/earlshrimpbag/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/earlshrimpbag/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/earlshrimpbag_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/earlshrimpbag_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "biloxi")], m2: [st("m2"), endOf(st("m2"), "raised")], m3: [st("m3"), endOf(st("m3"), "think")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/earlshrimpbag.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/earlshrimpbag/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the shed, the coolers and the boats behind stay fully readable. The only light is what the place really has: overcast Gulf Coast daylight from the open side of the shed plus the fluorescent tubes; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, deep lines and uneven tone; real creases in the denim shirt; wet concrete. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; he moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " He wears the same faded light-blue denim work shirt open over a navy t-shirt, short white hair and white mustache.";
const anchors = [
  A("K0", ["k0"], `Same man, same place, same moment. ${WHO} stands in ${SHED}. He holds up a plastic bag of frozen shrimp toward the camera in one hand, the front of the bag printed in big red and blue letters GULF STYLE SHRIMP, and talks to the camera, serious and direct. Medium shot, his upper body, the coolers and the boats behind.` + same),
  A("K1", ["K0"], "A few seconds later, same place: he has turned the bag around so its back faces the camera and taps a small printed line near the bottom of the bag with his index finger, eyebrows raised, looking straight at the camera." + same),
  A("K2", ["K1"], "Same place a few seconds later: he lowers the bag a little and gives the camera a dry, knowing look, slowly shaking his head." + same),
  A("K3", ["K2"], "Same place a few seconds later: the bag is gone; he holds up a flat frosty frozen block of shrimp in both hands toward the camera with a small sly smile, as if about to tell a secret." + same),
  A("K4", ["K3"], "Same place a few seconds later: he holds the frozen block against his chest with one arm and raises one finger, half smiling, talking to the camera." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Thirty-one years I ran a shrimp boat out of Biloxi.", action: "He talks to the camera with slow, plain Southern authority, holding the bag of shrimp up, and starts to turn the bag around at the end." + same },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "Product of India. Farm raised.", action: "He taps the small printed line on the back of the bag twice and lowers it, talking to the camera, unimpressed." + same },
  { id: "m3", a: "K3", b: "K4", audio: T + "m3.wav", text: "And I'll show you the shrimp I take home to my own kitchen. It's not what you'd think.", action: "He holds up the frozen block of shrimp toward the camera and raises a finger with a sly half smile while he talks." + same },
];
const plan = { dir: R + "vlog/earlshrimpbag/M1", face: R + "public/ref_earlshrimpbag_facebig.png", k0_from: R + "public/ref_earlshrimpbag.png", pronoun: "he", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/earlshrimpbag/M1/out.mp4" };
fs.writeFileSync(R + "vlog/earlshrimpbag/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
