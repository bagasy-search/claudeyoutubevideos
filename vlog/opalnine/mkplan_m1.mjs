// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Opal hablando (ancla→ancla): la caja con las 4 pollitas, la jaula, el estornudo.
// node vlog/opalnine/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, COOP, BARN, PULLETS } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/opalnine/";
const T = R + "vlog/opalnine/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/opalnine/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/opalnine_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/opalnine_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "box.")], m2: [st("m2"), endOf(st("m2"), "flock.")], m3: [st("m3"), endOf(st("m3"), "sneezed.")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/opalnine.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/opalnine/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the farm and barn background stays fully readable. The only light is what the place really has: morning daylight outdoors, or daylight through the gaps of the barn boards and the open barn door; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases; feathers with real texture. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same navy blue flowered cotton dress with small buttons and the same grey and white pinstriped apron, grey hair pulled back in a loose low bun with stray strands.";
const anchors = [
  A("K0", ["k0"], `Same woman, a sunny autumn morning. ${WHO} stands in the gravel driveway of her farm in front of a dusty pickup truck, holding an open brown cardboard box with air holes against her apron, ${PULLETS} peeking out of it, and she looks at the camera with a pleased, warm face.` + same),
  A("K1", ["K0"], "A few seconds later, same driveway: she tilts the open box toward the camera so the pullets show, smiling, eyebrows raised." + same),
  A("K2", ["K0"], `A minute later, same morning, inside the old wooden barn: she stands next to an old black wire dog crate on the straw with ${PULLETS} inside, one hand on top of the crate, looking at the camera, firm and serious, shaking her head no.` + same),
  A("K3", ["K2"], "A few seconds later, same place by the crate: she points one finger at the pullets in the crate, still firm and serious." + same),
  A("K4", ["K3"], `Same barn a few seconds later: she crouches down beside the wire crate and looks in at the pullets with a worried face, one hand raised near her mouth.` + same),
  A("K5", ["K4"], "Same place a moment later: still crouching by the crate, she turns her face to the camera with raised eyebrows, worried and knowing." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Saturday morning my neighbor pulled into the drive with four young hens in a cardboard box.", action: "She holds the cardboard box with the pullets and talks to the camera warmly, glancing down at the pullets in the box." + same },
  { id: "m2", a: "K2", b: "K3", audio: T + "m2.wav", text: "And I did not put them in with my flock.", action: "Standing by the wire crate, she shakes her head firmly and says it straight to the camera." + same },
  { id: "m3", a: "K4", b: "K5", audio: T + "m3.wav", text: "one of those four little girls sneezed.", action: "Crouched by the crate she looks in at the pullets, then turns to the camera worried." + same },
];
const plan = { dir: R + "vlog/opalnine/M1", face: R + "public/ref_opalnine_facebig.png", k0_from: R + "public/ref_opalnine.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/opalnine/M1/out.mp4" };
fs.writeFileSync(R + "vlog/opalnine/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
