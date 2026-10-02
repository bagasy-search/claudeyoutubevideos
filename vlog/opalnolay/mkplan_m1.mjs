// Plan agnes-video-2.5-flash del MINUTO 1: 4 clips de Opal hablando (ancla→ancla). Sin detalles kf (van por v2.0).
// node vlog/opalnolay/mkplan_m1.mjs → vlog/opalnolay/M1/plan.json  (+ tramos de audio del máster)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { WHO, COOP, YARD } from "./dir_lib.mjs";
const R = "D:/Proyectos/video2-wt/opalnolay/";
const T = R + "vlog/opalnolay/tramos/";
fs.mkdirSync(T, { recursive: true }); fs.mkdirSync(R + "vlog/opalnolay/M1", { recursive: true });
// tramos = [inicio de la toma vl, fin de la frase] (CLIP0 de gen_timeline = inicio)
export const TRAMOS = { m1: [0.0, 4.6], m2: [10.5, 13.64], m3: [19.74, 21.7], m4: [44.1, 47.0] };
for (const [id, [a, b]] of Object.entries(TRAMOS)) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", R + "public/opalnolay.wav", "-ac", "1", "-ar", "44100", T + id + ".wav"]);
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a helper with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the coop or farm yard background stays fully readable. The only light is what the place really has, and each person and animal gets light according to where it stands; correctly exposed, the side near the open door a little brighter and cooler, the far corners dimmer. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, age spots and uneven tone; hair with stray strands; clothes with real creases; feathers with real texture. People are caught mid-action, unposed. Grey October daylight.";
const LOOK = "Ordinary handheld video filmed by a helper with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural older hands; she moves naturally and unposed, nothing staged; no music.";
const A = (id, from, prompt) => ({ id, from, prompt });
const same = " She wears the same navy blue flowered cotton dress with small buttons and the same grey and white pinstriped apron, grey hair pulled back in a loose low bun with stray strands.";
const anchors = [
  A("K0", ["k0"], `Same woman, same morning. ${WHO} stands inside ${COOP}, beside the row of wooden nest boxes where three reddish-brown hens sit on straw. She holds an empty wicker egg basket on her forearm and talks to the camera, one hand open, warm and direct. Medium shot from about one and a half meters, her upper body and the nest boxes in frame.` + same),
  A("K1", ["K0"], "A few seconds later, same place: she tips the wicker basket toward the camera with both hands to show it is almost empty, only two brown eggs in the bottom, eyebrows raised, mouth open mid-word, half amazed and half exasperated." + same),
  A("K2", ["K1"], "Same place a few seconds later: she holds the basket against her hip and gives the camera a dry, knowing look, head tilted, lips pressed, one hand on her hip." + same),
  A("K3", ["K2"], "Same place a few seconds later: she sets the basket on top of the nest boxes and turns back toward the camera, opening one hand, starting to explain with a small patient smile." + same),
  A("K4", ["k0"], `The same image: ${WHO} stands in ${YARD} holding her reddish-brown hen Dottie in her arms against her apron, talking to the camera with a warm smile.` + same),
  A("K5", ["K4"], "A few seconds later, same place: she lifts the red hen a little toward the camera and looks down at it fondly, stroking its back with one hand, still talking." + same),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Nine eggs a day. That's what my twelve hens gave me all summer long.", action: "She talks to the camera with warm, plain authority, small head movements, the empty basket on her arm, and starts to lift the basket toward the camera at the end." + same },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "and I came back with two. Two eggs.", action: "She tips the almost empty basket toward the camera showing the two brown eggs, then pulls it back against her hip, talking to the camera." + same },
  { id: "m3", a: "K2", b: "K3", audio: T + "m3.wav", text: "Well, honey, it wasn't the cold.", action: "She gives the camera a dry, knowing look and shakes her head slightly while she talks." + same },
  { id: "m4", a: "K4", b: "K5", audio: T + "m4.wav", text: "My red hen Dottie, this one right here,", action: "She holds the red hen against her apron and lifts it a little toward the camera while she talks, looking down at it fondly. The hen stays calm." + same },
];
const plan = { dir: R + "vlog/opalnolay/M1", face: R + "public/ref_opalnolay_facebig.png", k0_from: R + "public/ref_opalnolay.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: R + "vlog/opalnolay/M1/out.mp4" };
fs.writeFileSync(R + "vlog/opalnolay/M1/plan.json", JSON.stringify(plan, null, 1));
console.log("anclas", anchors.length, "· clips", clips.length);
