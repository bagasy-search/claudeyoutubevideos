// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Hazel hablando (ancla→ancla) en su taller.
// node vlog/hazelcrystal/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, SHOP } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/hazelcrystal/";
const T = R + "vlog/hazelcrystal/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/hazelcrystal/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/hazelcrystal_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/hazelcrystal_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "sticker")], m2: [st("m2"), endOf(st("m2"), "me.")], m3: [st("m3"), endOf(st("m3"), "auction")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/hazelcrystal.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/hazelcrystal/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the workroom background stays fully readable. The only light is the daylight from the tall window on the left plus the ceiling light; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same faded blue denim shirt with rolled-up sleeves, the same thin wire-rimmed reading glasses and small silver drop earrings, grey hair loosely pulled back.";
const BOWL = "a heavy round sparkling cut glass bowl deeply cut with stars and diamonds, a small round white $5 price sticker on its rim";
const anchors = [
  A("K0", ["k0"], `Same workroom, same moment of the day. ${WHO} sits at the worn wooden worktable of ${SHOP}. She holds up ${BOWL} in both hands toward the camera and talks to the camera, eyebrows raised, warm and direct. Medium shot, her upper body and the table in frame.` + same),
  A("K1", ["K0"], `A few seconds later, same place: she holds the cut glass bowl in one hand and has just run her other thumb along its sharp rim; she shakes that thumb in the air with a wince and a dry little laugh, looking at the camera.` + same),
  A("K2", ["K1"], "Same place a few seconds later: she holds the cut glass bowl up beside her face and gives the camera a knowing look over the top of her glasses." + same),
  A("K3", ["K2"], "Same place a few seconds later: she sets the cut glass bowl down on the worktable in front of the camera and leans in over it on her forearms, a conspiratorial half smile." + same),
  A("K4", ["K3"], "Same place a few seconds later: still leaning over the bowl, she raises one finger and opens her eyes wide, about to say a number." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Five dollars. That's what was written on the little sticker.", action: "She holds the cut glass bowl up toward the camera and taps the little price sticker on its rim while she talks." + same },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "I ran my thumb along the edge, and it bit me.", action: "She runs her thumb along the sharp rim of the bowl, winces and shakes her thumb, then gives a dry little smile, talking to the camera." + same },
  { id: "m3", a: "K3", b: "K4", audio: T + "m3.wav", text: "A name. That bowl went to auction", action: "She leans over the bowl on the table and raises one finger, eyes widening, talking to the camera as if sharing a secret." + same },
];
const plan = { dir: R + "vlog/hazelcrystal/M1", face: R + "public/ref_hazelcrystal_facebig.png", k0_from: R + "public/ref_hazelcrystal.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/hazelcrystal/M1/out.mp4" };
fs.writeFileSync(R + "vlog/hazelcrystal/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
