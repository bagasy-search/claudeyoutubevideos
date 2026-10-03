// Plan agnes-video-2.5-flash del MINUTO 1: 3 clips de Opal hablando (ancla→ancla) en el gallinero con Clover.
// node vlog/opalmolt/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, COOP } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/opalmolt/";
const T = R + "vlog/opalmolt/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/opalmolt/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/opalmolt_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/opalmolt_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "dottie")], m2: [st("m2"), endOf(st("m2"), "bugs")], m3: [st("m3"), endOf(st("m3"), "both")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/opalmolt.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/opalmolt/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the coop background stays fully readable. The only light is what the place really has in the evening: one warm bulb hanging from a rafter and the last daylight from the open door; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases; feathers with real texture. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same navy blue flowered cotton dress with small buttons and the same grey and white pinstriped apron, grey hair pulled back in a loose low bun with stray strands.";
const HEN = "a reddish-brown hen with a bright red comb whose back end below the tail is bare, ragged pink skin showing";
const anchors = [
  A("K0", ["k0"], `Same woman, evening. ${WHO} stands inside ${COOP} by the roost bars, a warm bulb glowing above, holding ${HEN} in her arms against her apron, talking to the camera with a gentle worried look.` + same),
  A("K1", ["K0"], "A few seconds later, same place: she turns the hen slightly so its bare back end faces the camera and points at the bare skin with one finger, eyebrows raised, mouth open mid-question." + same),
  A("K2", ["K1"], "Same place a few seconds later: she holds the hen close again and looks at the camera with a dry, knowing half smile, one eyebrow raised." + same),
  A("K3", ["K2"], "Same place a few seconds later: she nods slowly at the camera, holding up two fingers of her free hand, the hen calm against her apron." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "This is Clover. She's one of my red girls, a year younger than Dottie,", action: "She holds the red hen against her apron and talks to the camera warmly, then starts to turn the hen to show its bare back end." + same },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "Is she molting, or has she got bugs?", action: "She points at the hen's bare skin and asks the camera, then pulls the hen close again." + same },
  { id: "m3", a: "K2", b: "K3", audio: T + "m3.wav", text: "because it wasn't what I thought. It was both.", action: "She gives the camera a knowing look and holds up two fingers while she talks, the hen calm in her arms." + same },
];
const plan = { dir: R + "vlog/opalmolt/M1", face: R + "public/ref_opalmolt_facebig.png", k0_from: R + "public/ref_opalmolt.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/opalmolt/M1/out.mp4" };
fs.writeFileSync(R + "vlog/opalmolt/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
