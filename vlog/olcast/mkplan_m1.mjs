// Plan agnes 2.5-flash de los 5 HABLADOS del minuto 1 de olcast (anclas gpt-image-2 + clips reference ancla→ancla).
// node vlog/olcast/mkplan_m1.mjs
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/olcast/tramos/";
const PAN = "an old rusty cast iron skillet with orange rust flecks on the rim and a dull sticky dark patch in the middle of the cooking surface";
const anchors = [
  A("K0", ["k0"], `Same cabin, same moment of the day. ${WHO} sits at the rough plank table by the snowy window of ${KIT}, a blue enamel mug on the table. He holds up ${PAN} with both hands toward the camera, tilted so its rusty inside faces the lens, looking straight at the camera and talking. Medium shot from about one and a half meters, his upper body, the pan and the table edge in frame, the stove and the bunks behind.`),
  A("K1", ["K0"], "A few seconds later, same place: he has lowered the skillet onto the table in front of him and rubs the sticky dark patch in its middle with his thumb, then looks up at the camera with a wry, knowing half smile, mid-sentence."),
  A("K2", ["K1"], "Same place a few seconds later: he leans back a little with the skillet resting on the table beside the blue mug, one big finger raised beside his face, bushy white eyebrows up, mid-sentence, a promise in his eyes."),
  A("K3", ["K2"], "Same place: he opens one big hand toward the camera, palm up, nodding slowly, the skillet on the table in front of him, an easy reassuring look, mid-sentence."),
  A("K4", ["K3"], `Same place, a little closer: he holds a plain glass bottle of golden cooking oil with a blank label in one hand and pours a thick glossy pool of oil into the middle of ${PAN} on the table, shaking his head slightly with a doubtful look at the camera, mid-sentence.`),
  A("K5", ["K4"], "Same place a few seconds later: he scrapes a sticky black flake off the oily skillet with his thumbnail and holds it up between two fingers toward the camera, grimacing with a dry, disgusted little smile, mid-sentence."),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "See this pan? Rusty as an old gate, sticky in the middle, and I'd bet you have one just like it in a cupboard.", action: act("He holds the rusty skillet up toward the camera and talks, then sets it down on the table and rubs the sticky patch with his thumb.") },
  { id: "m2", a: "K1", b: "K2", audio: T + "m2.wav", text: "Give me the next few minutes, friend, and this pan goes from orange to black glass. No kit, no fancy oil, no store-bought seasoning spray.", action: act("He looks up at the camera and talks, leans back with the skillet beside the mug and raises one finger.") },
  { id: "m3", a: "K2", b: "K3", audio: T + "m3.wav", text: "Just one wipe, and most folks do it backwards. By the end of this video you'll know why your eggs stick,", action: act("He talks with the raised finger, then opens one hand toward the camera, palm up, nodding slowly.") },
  { id: "m4", a: "K3", b: "K4", audio: T + "m4.wav", text: "Well, now, let's start with what the store tells you to do. The store way goes like this. Rub a good coat of oil all over the pan, nice and shiny, stick it in the oven,", action: act("He talks with his open hand, then picks up the bottle of oil and pours a thick pool into the skillet, shaking his head doubtfully.") },
  { id: "m5", a: "K4", b: "K5", audio: T + "m5.wav", text: "and call it seasoned. It looks lovely for about a week. Then it goes tacky. Then it flakes off in little black bits into your cornbread. You scrub it, you do it again,", action: act("He talks over the oily skillet, then scrapes a sticky black flake off with his thumbnail and holds it up to the camera with a grimace.") },
];
fs.mkdirSync(R + "vlog/olcast/M1", { recursive: true });
fs.writeFileSync(R + "vlog/olcast/M1/plan.json", JSON.stringify(plan("vlog/olcast/M1", anchors, clips), null, 1));
console.log("plan M1:", anchors.length, "anclas,", clips.length, "clips");
