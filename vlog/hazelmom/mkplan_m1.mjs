// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Hazel hablando (ancla→ancla) en su taller.
// node vlog/hazelmom/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, SHOP } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/hazelmom/";
const T = R + "vlog/hazelmom/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/hazelmom/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/hazelmom_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/hazelmom_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "down.")], m2: [st("m2"), endOf(st("m2"), "me.")], m3: [st("m3"), endOf(st("m3"), "about.")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/hazelmom.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/hazelmom/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the workroom background stays fully readable. The only light is the daylight from the tall window on the left plus the ceiling light; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same faded blue denim shirt with rolled-up sleeves, the same thin wire-rimmed reading glasses and small silver drop earrings, grey hair loosely pulled back.";
const anchors = [
  A("K0", ["k0"], `Same workroom, same moment of the day. ${WHO} sits at the worn wooden worktable of ${SHOP}, leaning toward the camera with one hand raised flat, palm out, like saying stop, eyes wide behind her glasses, urgent.` + same),
  A("K1", ["K0"], "A few seconds later, same place: she lowers her hand and points at the camera with one finger, a firm, serious look." + same),
  A("K2", ["K1"], "Same place a few seconds later: she sits back with a small knowing smile and lifts her eyebrows, hands folded on the table." + same),
  A("K3", ["K2"], "Same place a few seconds later: she shakes her head slowly with a sad, rueful little smile, one hand on her chest." + same),
  A("K4", ["K3"], "Same place a few seconds later: she looks at the camera warmly, both hands open on the table." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Stop. Put that box down.", action: "She raises her flat palm at the camera like saying stop, then lowers it and points, firm and urgent." + same },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "And I'm going to tell you how that box turned out, because it surprised even me.", action: "She talks to the camera, then sits back with a small knowing smile and raised eyebrows." + same },
  { id: "m3", a: "K3", b: "K4", audio: T + "m3.wav", text: "and I've watched more good things go in a dumpster than I like to think about.", action: "She shakes her head slowly with a rueful smile while she talks, then looks at the camera warmly." + same },
];
const plan = { dir: R + "vlog/hazelmom/M1", face: R + "public/ref_hazelmom_facebig.png", k0_from: R + "public/ref_hazelmom.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/hazelmom/M1/out.mp4" };
fs.writeFileSync(R + "vlog/hazelmom/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
