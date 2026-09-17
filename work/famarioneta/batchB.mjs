import fs from "node:fs";
import { SPEC, ROS, BANO, SALA } from "./spec.mjs";
const BRIGHT = "BRIGHT, correctly exposed photo, big soft DAYLIGHT from a window, white balance NEUTRAL, no amber cast, no grading, no vignette, no film grain, no dark moody look, lifted shadows; brightness from the room lighting, not post-production — do not raise saturation, no glow, no HDR. An ordinary photo, not a film still.";
const CANDID = "Candid photo taken on a modern smartphone, true-to-life colors, sharp focus, deep depth of field with the whole room in focus, nothing blurred out, the background full of ordinary everyday objects that stay readable, realistic, no filter, no ai look. People are 65 to 85 years old, real skin.";
export const FALLBACK = {
  "woman jaw pain touching face": "A woman in her early seventies with short grey hair sitting at her kitchen table, pressing two fingers in front of her ear on the jaw joint with a pained grimace, a cup of tea and a pill organizer on the table, a window with plants behind.",
  "woman rubbing cream on face": "A woman in her late sixties standing at her bathroom mirror rubbing face cream up and down on her cheek with three fingers in a careless back-and-forth motion, an open jar of cream on the sink, toothbrush cup and towel behind.",
  "dentures in glass of water": "A set of upper dentures resting in a clear glass of water on a white bathroom shelf next to a denture brush, a tube of denture cream and a folded hand towel, a tiled wall and a small window behind.",
  "elderly woman talking to dentist": "A woman in her seventies with dentures sitting at her kitchen table holding a hand mirror and gently checking her smile with her tongue behind her teeth, a calendar with an appointment circled on the wall behind her, a glass of water on the table.",
  "woman rubbing face with towel": "A woman in her seventies drying her face at the bathroom sink by rubbing a white towel hard downward over her cheeks, eyes squeezed shut, soap dish and toothbrush cup on the sink, tiled wall.",
  "woman clenching jaw stress": "A woman in her early seventies sitting on her sofa with her teeth visibly clenched, jaw muscles bulging near her ears, lips pressed tight, staring at a TV off frame with a tense face, a crocheted blanket and remote control beside her.",
  "woman massaging face vigorously": "A woman in her late sixties at her bathroom mirror pressing her fingertips hard into her cheeks and rubbing fast, cheeks reddening, an impatient hurried face, a kitchen timer and a jar of cream on the sink.",
  "woman making funny faces in mirror": "A woman in her sixties in her living room imitating a face yoga video on a tablet propped on the table, mouth stretched wide open and cheeks puffed in an exaggerated grimace, laughing eyes, plants and family photos behind.",
  "applying sunscreen on face": "A woman in her early seventies in her bright kitchen by the window applying a small amount of white sunscreen lotion to her cheek with a fingertip, the sunscreen tube on the counter, a straw hat hanging on a hook by the door.",
  "senior woman massaging sore jaw": "A woman in her mid seventies in a floral blouse massaging the sore hinge of her jaw in front of her ear with a worried look, sitting on the edge of her bed, a bedside table with glasses and a lamp, daylight through curtains.",
};
const items = [];
const refR = "public/ref_famarioneta_rosario.png", refD = "public/ref_famarioneta_face.png";
for (const [name, s] of Object.entries(SPEC)) {
  if (s.t === "R") items.push({ name, prompt: `${CANDID} ${s.p} ${BRIGHT}`, ref: refR });
  if (s.t === "P") items.push({ name, prompt: `${CANDID} ${s.p} ${BRIGHT}`, ref: refD });
  if (s.t === "RP") items.push({ name, prompt: `${CANDID} ${s.p} ${BRIGHT}`, ref: [refD, refR] });
  if (s.t === "G") items.push({ name, prompt: `${CANDID} ${s.p} ${BRIGHT}` });
  if (s.t === "S" && FALLBACK[s.q]) items.push({ name, prompt: `${CANDID} ${FALLBACK[s.q]} ${BRIGHT}` });
}
items.push({ name: "despues", ref: "work/famarioneta/ref_antes.png", prompt: `${CANDID} The same tight frontal close-up of the lower half of the face of the same 72-year-old woman as the reference, framed from just under the eyes to the neck, but now her lips are relaxed and softly closed, mouth corners resting level instead of pulled down, jaw loose, the marionette lines still clearly visible but a little softer, same real skin texture, pores and age spots, no makeup, white blouse collar, white tiled bathroom wall behind, even soft window light from the front. ${BRIGHT}` });
items.push({ name: "rosario_dia1", ref: refR, prompt: `${CANDID} Phone selfie at eye level of ${ROS}, standing by the big window of her living room, a serious relaxed face with lips pressed and mouth corners turned down, marionette lines visible, plain daylight, sheer curtains and potted plants behind. ${BRIGHT}` });
items.push({ name: "rosario_sem6", ref: refR, prompt: `${CANDID} Phone selfie at eye level of ${ROS}, same window and same framing, a serious but relaxed face with lips softly closed and the mouth corners resting a little higher, marionette lines still visible, jaw loose, a calmer look, sheer curtains and potted plants behind. ${BRIGHT}` });
fs.writeFileSync("work/famarioneta/batchB.json", JSON.stringify(items, null, 1));
console.log(items.length, "con ref", items.filter((i) => i.ref).length);
