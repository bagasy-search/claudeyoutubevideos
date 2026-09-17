import fs from "node:fs";
const BRIGHT = "BRIGHT, correctly exposed photo, big soft DAYLIGHT from a window, white balance NEUTRAL, no amber cast, no grading, no vignette, no film grain, no dark moody look, lifted shadows; brightness from the room lighting, not post-production — do not raise saturation, no glow, no HDR. An ordinary photo, not a film still.";
const CANDID = "Candid photo taken on a modern smartphone, true-to-life colors, sharp focus, deep depth of field with the whole room in focus, nothing blurred out, the background full of ordinary everyday objects that stay readable, realistic, no filter, no ai look. People are 65 to 85 years old, real skin.";
const P = {
  m080: "A woman in her late sixties with short grey hair in her bright bathroom gently sliding flat fingertips upward from the corners of her mouth towards her cheekbones, a calm careful face in the mirror, a soap dish, a toothbrush cup and a folded towel on the sink.",
  m082: "A woman in her seventies leaning close to her bathroom mirror, noticing that her cheeks are pink and irritated after rubbing too hard, touching one cheek with a guilty little frown, a jar of cream open on the sink and a towel over her shoulder.",
  m102: "A woman in her early seventies with silver hair bending over a white bathroom sink rinsing her face with cupped hands full of water, sleeves pushed up, a bar of soap and a pink towel next to the tap, a frosted window with daylight.",
  m199: "A woman in her late sixties sitting at her dining table watching a face exercise video on a tablet propped against a fruit bowl, the small screen showing a person pulling an exaggerated grimace, she raises one eyebrow skeptically with a cup of coffee in hand, plants and a wall calendar behind.",
};
const items = Object.entries(P).map(([name, p]) => ({ name, prompt: `${CANDID} ${p} ${BRIGHT}` }));
fs.writeFileSync("work/famarioneta/batchC.json", JSON.stringify(items, null, 1));
