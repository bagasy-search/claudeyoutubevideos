// Plan agnes 2.5-flash del MINUTO 1 de olpots (anclas gpt-image-2 + clips reference/keyframe). node vlog/olpots/mkplan_m1.mjs
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/olpots/tramos/";
const SHELF = "a rough plank shelf on the log wall behind his right shoulder holding five pots in a row: a black cast iron Dutch oven with a lid, a black cast iron skillet, a tall white speckled enamel stockpot with a blue rim, a shiny stainless steel stockpot with a lid, and a small stainless saucepan with a long black handle";
const anchors = [
  A("K0", ["k0"], `Same cabin, same moment of the day. ${WHO} sits at the rough plank table of ${KIT}, a navy blue speckled enamel mug beside his hand, talking to the camera; behind his right shoulder on the log wall is ${SHELF}. He jerks his thumb over his shoulder toward the shelf, mouth mid-word. Medium shot from about one and a half meters, his upper body, the table edge, the shelf and the snowy window in frame.`),
  A("K1", ["K0"], "A moment later, same place: he has turned his head and shoulders a little toward the shelf of pots behind him, one big hand open toward it, and then glances back at the camera with a fond half smile, mid-word."),
  A("K2", ["K0"], "Same place a few seconds later: he sits back in his chair holding the blue enamel mug in both hands, looking at the camera with a warm, sure little smile, nodding slowly, mid-word."),
  A("K2b", ["K2"], "Same place a moment later: a wider grin now, the mug lifted a little toward the camera as if to say cheers, one white eyebrow raised."),
  A("K3", ["K0"], "Same place: the mug set down, he leans a little toward the camera with a serious face, one index finger raised beside his face, eyes on the camera, mid-word."),
  A("K3b", ["K3"], "Same place a moment later: the finger lowered, he tilts his head with a dry knowing look and slightly raised eyebrows, hand open on the table, mid-word."),
  A("K4", ["K0"], "Same place: he holds up one open hand with the fingers spread as if counting to five, the other hand flat on the table, looking at the camera, mid-word."),
  A("K4b", ["K4"], "Same place a moment later: his open hand folds down one finger at a time, counting, a small nod, the shelf of pots visible behind him."),
  A("K5", ["K0"], "Same place: he leans forward over the plank table with his palm flat on the wood, earnest, eyes on the camera, mid-word."),
  A("K5b", ["K5"], "Same place a moment later: he pats the table twice gently with his flat hand and gives a small firm nod, mouth mid-word."),
  A("K6", ["K0"], "Same place: he shakes his head slowly and waves one hand side to side as if saying no, a dry half smile, mouth mid-word."),
  A("K6b", ["K6"], "Same place a moment later: hand lowered, he shrugs one shoulder with a wry look, eyebrows raised."),
  A("K7", ["K0"], "Same place: he leans back with his arms folded over the apron and nods slowly at the camera, calm and sure, mouth mid-word."),
  A("K7b", ["K7"], "Same place a moment later: he unfolds one hand and points a finger toward the camera as if starting to count, ready to begin, mid-word."),
  A("D1a", ["k0"], `EXTREME CLOSE-UP of an old man's hand in a dark green and black plaid flannel sleeve resting a fingertip on the black iron lid of a cast iron Dutch oven at the left end of a rough plank shelf on a log wall, the other pots in a row to the right, snowy window light. No face anywhere in the frame.`),
  A("D1b", ["D1a"], "Same close view a moment later: the hand has slid along the shelf and now rests flat on the white speckled enamel stockpot, the other pots beyond it."),
  A("D2a", ["k0"], `EXTREME CLOSE-UP on the rough plank table: an old man's hand in a plaid flannel sleeve pushes a navy blue speckled enamel mug across the wood toward the camera, a thin curl of steam from it, the cabin blurred behind. No face anywhere in the frame.`),
  A("D2b", ["D2a"], "Same close view a moment later: the mug has slid closer to the camera edge, the hand lifting away from it, steam curling."),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Well, now. Look at that shelf, friend.", action: act("He talks to his grandson behind the camera, jerks his thumb toward the shelf of pots behind him, turns to it with an open hand, then looks back at the camera fondly.") },
  { id: "m2", a: "K2", b: "K2b", audio: T + "m2.wav", text: "And I'd buy every one of them again tomorrow.", action: act("He sits back holding the enamel mug in both hands, nods slowly with a warm sure smile, then lifts the mug a little with a wider grin.") },
  { id: "m3", a: "K3", b: "K3b", audio: T + "m3.wav", text: "would never buy, not if you handed them to me.", action: act("He sets the mug down, leans toward the camera with a raised finger and a serious face, then lowers the finger with a dry knowing look.") },
  { id: "m4", a: "K4", b: "K4b", audio: T + "m4.wav", text: "So here's the deal. I'll name all five, quick,", action: act("He holds up one open hand counting to five and folds the fingers down one at a time, talking to the camera.") },
  { id: "m5", a: "K5", b: "K5b", audio: T + "m5.wav", text: "What matters is the why, so stay with me,", action: act("He leans forward over the table with his palm flat on the wood, then pats the table twice and gives a small firm nod, talking.") },
  { id: "m6", a: "K6", b: "K6b", audio: T + "m6.wav", text: "I won't name a brand, either.", action: act("He shakes his head slowly and waves a hand side to side no, with a dry half smile, then shrugs one shoulder.") },
  { id: "m7", a: "K7", b: "K7b", audio: T + "m7.wav", text: "that doesn't change. Here's how I judge a pot.", action: act("He leans back with his arms folded and nods slowly at the camera, then unfolds a hand and points a finger toward the camera, about to start counting.") },
  { id: "d_shelf", prompt: "the hand slides slowly along the edge of the shelf, its fingers touching the lid of the Dutch oven and then the enamel stockpot. He stays silent, focused on the pots.", a: "D1a", b: "D1b", detail: true, secs: 4, d1: "a hand rests on a cast iron Dutch oven on a plank shelf", d2: "the hand slides along the shelf onto the enamel stockpot", sound: "fingertips sliding across cold iron and a light tap on an enamel pot" },
  { id: "d_mug", prompt: "the hand pushes the blue enamel mug across the plank table toward the camera and lets go, steam curling. He stays silent.", a: "D2a", b: "D2b", detail: true, secs: 4, d1: "a hand pushes a blue enamel mug across a wooden table", d2: "the mug slides toward the camera and stops", sound: "an enamel mug sliding on rough wood and a soft clunk" },
];
fs.mkdirSync(R + "vlog/olpots/M1", { recursive: true });
fs.writeFileSync(R + "vlog/olpots/M1/plan.json", JSON.stringify(plan("vlog/olpots/M1", anchors, clips), null, 1));
console.log("plan M1:", anchors.length, "anclas,", clips.length, "clips");
