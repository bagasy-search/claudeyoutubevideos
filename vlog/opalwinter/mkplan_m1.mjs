// Plan agnes-video-2.5-flash del MINUTO 1: 2 clips de Opal hablando: en el porche nevado junto al termómetro, y en el gallinero ("Dry and still").
// node vlog/opalwinter/mkplan_m1.mjs → M1/plan.json + M1/clip0.json + tramos (inicio = inicio de la toma vl)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, COOP, BARN, PULLETS, KITCHEN } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/opalwinter/";
const T = R + "vlog/opalwinter/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/opalwinter/M1", { recursive: true });
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/opalwinter_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/opalwinter_wordms.json", "utf8"));
// fin de cada tramo = fin de la última palabra de la frase
const endOf = (t0, word) => { const w = W.find((x) => x.s >= t0 - 0.05 && x.w.toLowerCase().startsWith(word)); return w ? w.e + 0.08 : t0 + 3; };
const st = (id) => shots.find((s) => s.kind === "vl" && s.name === id).start;
const TR = { m1: [st("m1"), endOf(st("m1"), "years")], m2: [st("m2"), endOf(st("m2"), "still.")] };
for (const [id, [a, b]] of Object.entries(TR)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/opalwinter.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
fs.writeFileSync(R + "vlog/opalwinter/M1/clip0.json", JSON.stringify(Object.fromEntries(Object.entries(TR).map(([k, v]) => [k, v[0]]))));
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the background stays fully readable. The only light is what the place really has: a porch light on a snowy night, or cold winter daylight through a frosted coop window; correctly exposed. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases; feathers with real texture. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same navy blue flowered cotton dress with small buttons and the same grey and white pinstriped apron, grey hair pulled back in a loose low bun with stray strands.";
const anchors = [
  A("K0", ["k0"], `Same woman, a freezing clear winter night on the back porch of her farmhouse, deep snow in the yard behind her, a porch light on. ${WHO} stands next to an old round dial thermometer nailed to the porch post, wearing a heavy knit cardigan over her dress and apron, looking at the camera with raised eyebrows, her breath visible.` + same),
  A("K1", ["K0"], "A few seconds later, same porch: she taps the round dial thermometer with one finger and looks back at the camera, serious, breath visible in the cold." + same),
  A("K2", ["K0"], `Same woman, a cold bright winter morning inside her small red wooden chicken coop, frost on the small window, ${"reddish-brown hens"} on a wide wooden roost beside her; she stands with one hand on the roost board, looking at the camera, calm and firm.` + same),
  A("K3", ["K2"], "A few seconds later, same coop: she nods once to the camera with a small knowing smile, one finger raised." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Last January, on the coldest night we've had in years,", action: "On the snowy porch she talks to the camera, then taps the dial thermometer." + same },
  { id: "m2", a: "K2", b: "K3", audio: T + "m2.wav", text: "Dry and still.", action: "In the coop beside the roost she says it firmly to the camera and nods." + same },
];
const plan = { dir: R + "vlog/opalwinter/M1", face: R + "public/ref_opalwinter_facebig.png", k0_from: R + "public/ref_opalwinter.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/opalwinter/M1/out.mp4" };
fs.writeFileSync(R + "vlog/opalwinter/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length, JSON.stringify(TR));
