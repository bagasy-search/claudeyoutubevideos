// Plan agnes 2.5-flash de los 4 HABLADOS encadenados del minuto 1 de ollarder (anclas gpt-image-2 + clips reference ancla→ancla).
// Tramos de audio (contiguos, 7-10 s, cortados en el máster): A 0-10.04 · B 10.04-20.34 · C 20.34-28.44 · D 28.44-36.30
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/ollarder/tramos/";
const W = JSON.parse(fs.readFileSync(R + "_v3/ollarder_wordms.json", "utf8"));
const words = (s, e) => W.filter((w) => w.s >= s - 0.01 && w.e <= e + 0.05).map((w) => w.w.replace(/\[[^\]]+\]/g, "")).join(" ").replace(/\s+/g, " ").trim();
const anchors = [
  A("K0", ["k0"], `Same storeroom, same moment of the day. ${WHO} sits behind the rough plank table in ${KIT}, a blue enamel mug and a few potatoes on the table, looking straight at the camera and talking, one open hand raised. Medium shot from about one and a half meters, his upper body and the table edge in frame, the wall of barrels, burlap sacks and crates behind him.`),
  A("K1", ["K0"], "A few seconds later, same place: he turns his head a little and jerks his thumb back over his shoulder toward the wall of barrels, sacks and crates behind him, then looks back at the camera with a wry, slightly amazed expression, mid-sentence."),
  A("K2", ["K1"], "Same place a few seconds later: he leans back a little and taps one finger against his own temple with a knowing little grin, white eyebrows up, mid-sentence, the barrels and sacks behind him."),
  A("K3", ["K2"], "Same place: he raises one big finger beside his face with a wry, conspiratorial half smile and a lifted eyebrow, as if promising a secret, mid-sentence."),
  A("K4", ["K3"], "Same place, a few seconds later: he holds both open hands out in front of him, palms up, as if weighing two things, with a thoughtful tilt of his head and eyebrows raised, mid-sentence, a blue enamel mug on the table."),
];
const spans = { m1: [0, 10.04], m2: [10.04, 20.34], m4: [20.34, 28.44], m5: [28.44, 36.30] };
const actions = {
  m1: "He talks to the camera, jerks his thumb back toward the wall of barrels and sacks behind him, then looks back with a wry, amazed expression.",
  m2: "He talks, leans back and taps his temple with one finger with a knowing grin.",
  m4: "He talks with a raised finger and a conspiratorial half smile, as if promising a secret.",
  m5: "He talks, then holds both open hands out palms up as if weighing two things, head tilted thoughtfully.",
};
const pairs = { m1: ["K0", "K1"], m2: ["K1", "K2"], m4: ["K2", "K3"], m5: ["K3", "K4"] };
const clips = Object.entries(spans).map(([id, [s, e]]) => ({ id, a: pairs[id][0], b: pairs[id][1], audio: T + id + ".wav", text: words(s, e), action: act(actions[id]) }));
fs.mkdirSync(R + "vlog/ollarder/M1", { recursive: true });
fs.writeFileSync(R + "vlog/ollarder/M1/plan.json", JSON.stringify(plan("vlog/ollarder/M1", anchors, clips), null, 1));
console.log("plan M1:", anchors.length, "anclas,", clips.length, "clips"); for (const c of clips) console.log(" ", c.id, c.text.slice(0, 90));
