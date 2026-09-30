// Plan agnes 2.5-flash del MINUTO 1 de olcabin (anclas gpt-image-2 + clips hablados `reference`). node vlog/olcabin/mkplan_m1.mjs
// Hablados (6): Ole a cámara en su cabaña. Los detalles de manos sin cara van aparte con agnes v2.0.
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/olcabin/tramos/";
const TIN = "a small old green-painted tin recipe box with a hinged lid";
const POT = "a blue speckled enamel coffee pot";
const anchors = [
  A("K0", ["k0"], `Same cabin, same moment of the day. ${WHO} sits at the rough plank table of ${KIT}. On the table in front of him sit ${TIN}, closed, and his blue enamel mug, and he looks straight at the camera with a welcoming half smile, one hand open toward the empty bench across the table as if inviting the viewer to sit, talking. Medium shot from about one and a half meters, the table edge at the bottom, the stove glowing behind him.`),
  A("K1", ["K0"], "A few seconds later, same place: he pats the bench beside him with one big hand, his other hand resting on the closed tin recipe box, eyebrows raised, warm and amused, mid-sentence."),
  A("K2", ["K0"], `Same cabin, same light. He leans back a little and glances sideways at the tin recipe box on the shelf behind him on the log wall, then back at the camera with a knowing grin, mid-sentence.`),
  A("K3", ["K2"], "Same place a few seconds later: he leans toward the camera over the table with one big finger raised beside his face and a sly narrowed-eyes look, as if about to confess something."),
  A("K4", ["K3"], "Same place a few seconds later: he leans back and taps his own chest with the raised finger, nodding, promising with a small grin."),
  A("K5", ["K4"], `Same place: he lifts ${POT} from the stovetop beside the table and pours dark coffee into his blue enamel mug, steam rising, looking at the camera while he talks.`),
  A("K6", ["K0"], `Same cabin, same light. He stands at the black wood cookstove with ${POT} on it, holding up one brown chicken egg between two fingers close to the camera, eyebrows high, a mock-serious look, mid-sentence.`),
  A("K7", ["K6"], "Same place a few seconds later: he lowers the egg and shrugs with both palms up, a wry smile, the coffee pot steaming on the stove behind him."),
  A("K8", ["K6"], "Same place: he stands at the stove and points down with one finger toward the coffee pot, explaining, his other hand making a slow sinking motion, looking at the camera."),
  A("K9", ["K8"], "Same place a few seconds later: he pinches the air with two fingers as if lifting something small and drags it downward, chin tucked, eyes on the camera, mid-sentence."),
  A("K10", ["K0"], "Same cabin, same light. He sits at the plank table holding the blue enamel mug with both hands close to his chest, steam rising, looking at the camera over the rim, about to sip."),
  A("K11", ["K10"], "Same place a few seconds later: he lowers the mug, shakes his head slowly with a satisfied smile, one eyebrow up, saying he never tastes the egg."),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Well, now. Come sit down, friend.", action: act("He looks at the camera, welcomes the viewer with an open hand toward the bench, then pats the bench beside him.") },
  { id: "m2", a: "K2", b: "K3", audio: T + "m2.wav", text: "And hardly anybody makes them now. One of them has been through a bath of lye. And number one is a bread I can ruin in exactly one way,", action: act("He glances back at the tin box on the shelf, then leans toward the camera with a raised finger and a sly look.") },
  { id: "m3", a: "K4", b: "K5", audio: T + "m3.wav", text: "and I'll show you that way before we're done. Pour yourself a cup of coffee, and let's start at the bottom of the box.", action: act("He taps his chest, promising, then lifts the enamel coffee pot and pours himself a mug of coffee while talking.") },
  { id: "m4", a: "K6", b: "K7", audio: T + "m4.wav", text: "Yes, an egg. In the coffee. The Scandinavians who settled Minnesota and the Dakotas mixed a raw egg into the grounds with a splash of water,", action: act("He holds a brown egg up to the camera with a mock-serious look, then lowers it and shrugs.") },
  { id: "m5", a: "K8", b: "K9", audio: T + "m5.wav", text: "Then a half cup of cold water, and every ground sinks to the bottom like a stone. The egg grabs the bitterness and hauls it down with the grounds.", action: act("He points at the coffee pot, then makes a slow sinking motion with his hand, pinching and dragging something downward.") },
  { id: "m6", a: "K10", b: "K11", audio: T + "m6.wav", text: "It was church basement coffee, smooth as a creek stone, and you never taste the egg. Not one bit.", action: act("He holds the mug in both hands, looks over the rim, lowers it and shakes his head with a satisfied smile.") },
];
fs.mkdirSync(R + "vlog/olcabin/M1", { recursive: true });
fs.writeFileSync(R + "vlog/olcabin/M1/plan.json", JSON.stringify(plan("vlog/olcabin/M1", anchors, clips), null, 1));
console.log("plan M1:", anchors.length, "anclas,", clips.length, "clips");
