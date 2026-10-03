// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Hazel hablando (ancla→ancla) en su taller.
// node vlog/hazelsold/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, SHOP } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/hazelsold/";
const T = R + "vlog/hazelsold/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/hazelsold/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/hazelsold_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/hazelsold_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "said.")], m2: [st("m2"), endOf(st("m2"), "off.")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/hazelsold.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/hazelsold/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the workroom background stays fully readable. The only light is the daylight from the tall window on the left plus the ceiling light; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same faded blue denim shirt with rolled-up sleeves, the same thin wire-rimmed reading glasses and small silver drop earrings, grey hair loosely pulled back.";
const anchors = [
  A("K0", ["k0"], `Same workroom, same moment of the day. ${WHO} sits at the worn wooden worktable of ${SHOP}, holding up a strip of masking tape between two fingers toward the camera, with $40 written on it in black marker, one eyebrow raised.` + same),
  A("K1", ["K0"], "A few seconds later, same place: she crumples the strip of masking tape in her hand and gives the camera a firm, no-nonsense look." + same),
  A("K2", ["K1"], "Same place a few seconds later: she sits back with a small knowing smile, hands folded on the table." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Forty dollars. That's what the masking tape said.", action: "She holds up the strip of masking tape and talks to the camera, then starts to crumple it." + same },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "I told her to take the tape off.", action: "She crumples the tape firmly while she talks, then sits back with a knowing smile." + same },
];
const plan = { dir: R + "vlog/hazelsold/M1", face: R + "public/ref_hazelsold_facebig.png", k0_from: R + "public/ref_hazelsold.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/hazelsold/M1/out.mp4" };
fs.writeFileSync(R + "vlog/hazelsold/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
