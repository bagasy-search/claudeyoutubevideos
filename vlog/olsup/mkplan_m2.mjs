// Plan agnes 2.5-flash del CIERRE (m6) (anclas gpt-image-2 + clips reference hablados + detalles keyframe con foley). node vlog/olsup/mkplan_m1.mjs
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/olsup/tramos/";
const anchors = [
  A("K0", ["k0"], `Same cabin, same moment. ${WHO} sits at the worn wooden table of ${KIT}. He holds the blue enamel mug in one hand and looks warmly straight at the camera, about to talk, a soft tired-but-content smile. Medium shot from about one and a half meters, the black Dutch oven on the table and the stove glowing behind him.`),
  A("K1", ["K0"], "A few seconds later, same place: he leans forward a little toward the camera with a kind, direct look and raises the blue enamel mug slightly as if toasting the viewer, mid-sentence."),
  A("K2", ["K1"], "Same place a few seconds later: he sits back with a warm crinkled-eyes smile and gives a small friendly nod, the mug lowered to the table, one hand open toward the camera."),
];
const clips = [
  { id: "m6", a: "K1", b: "K2", audio: T + "m6.wav", text: "So try one of these this week.", action: act("He talks warmly to the camera, raises the mug slightly like a toast, then sits back with a small friendly nod.") },
];
fs.mkdirSync(R + "vlog/olsup/M2", { recursive: true });
fs.writeFileSync(R + "vlog/olsup/M2/plan.json", JSON.stringify(plan("vlog/olsup/M2", anchors, clips), null, 1));
console.log("plan M2:", anchors.length, "anclas,", clips.length, "clips");
