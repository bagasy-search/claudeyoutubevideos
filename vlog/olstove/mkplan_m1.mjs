// Plan agnes 2.5-flash del MINUTO 1 de olstove: anclas gpt-image-2 (Ole en su cabaña, junto a la estufa) + 7 hablados `reference` + 3 detalles v2.0.
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/olstove/tramos/";
const STOVE = "the black cast iron wood cookstove with its stovepipe going up through the ceiling and a small firebox door with a glowing orange fire behind the mica window";
const anchors = [
  A("K0", ["k0"], `Same cabin, same moment of the day. ${WHO} stands next to ${STOVE} in ${KIT}. One hand rests on the firebox door handle and the other hand is open, waving the viewer in toward the room, he looks at the camera and talks, mouth mid-word. Medium shot from about one and a half meters, the stove and its pipe at the right of the frame, the snowy window at the left, the plank table at the bottom edge.`),
  A("K1", ["K0"], "A second later, same place: he jerks his thumb back over his shoulder at the cabin door behind him, then looks at the camera again with a small welcoming smile, mouth mid-word."),
  A("K2", ["K0"], "Same place, a few seconds later: he pats the flat iron top of the stove with his open palm like it is an old friend, a dry little grin under the white beard, eyebrows raised, looking at the camera."),
  A("K3", ["K2"], "Same place a moment later: he leans a bit toward the camera with the hand still resting on the stove top and a sly, amused grin, as if telling the funniest part of a joke."),
  A("K4", ["K0"], "Same place: he holds up one finger toward the camera with a serious, knowing look, the other hand on his apron, mid-sentence, the stove glowing behind him."),
  A("K5", ["K4"], "Same place a moment later: he opens both hands palms up toward the camera in a small honest shrug, head tilted, mouth mid-word."),
  A("K6", ["K0"], "Same place: he points straight up at the black stovepipe that rises from the stove to the log ceiling, his head tilted back a little to look along it, the other hand on his hip, mouth mid-word."),
  A("K7", ["K6"], "Same place a moment later: he lowers the pointing hand, looks back at the camera and shakes his head slowly with a wry, 'people never learn' expression, mouth mid-word."),
  A("K8", ["K0"], "Same place: he holds up a single wooden kitchen match between his thumb and forefinger at chest height toward the camera, eyebrows raised, a mock-serious expression, the cold stove door still closed behind him."),
  A("K9", ["K8"], "Same place a moment later: he lowers the match and puts a small box of wooden matches on the shelf beside the stove, then looks back at the camera, mouth mid-word."),
  A("K10", ["K2"], "Same place: he pats the side of the stove gently twice with his flat hand and nods at it fondly, then looks at the camera, mouth mid-word."),
  A("K11", ["K10"], "Same place a moment later: he gives the camera a small nod with a serious, kind look, one hand still resting on the warm iron, mouth mid-word."),
  A("K12", ["K0"], "Same place: he stands calm and steady with one hand raised, palm open, in front of his chest as if explaining something invisible, brow slightly furrowed, looking at the camera, mouth mid-word."),
  A("K13", ["K12"], "Same place a moment later: he taps two fingers against his own temple and squints, showing a mild headache, and then opens his hand toward the camera, mouth mid-word."),
  A("K14", ["K0"], "Same cabin, a little later: he sits on a wooden bench beside the black wood stove with an open worn cloth-bound cookbook notebook on his knee and a stubby pencil in his hand, looking at the camera and talking, mouth mid-word, the stove glowing beside him."),
  A("K15", ["K14"], "Same place a moment later: he lifts the open notebook toward the camera with one hand, a proud little smile, the pencil behind his ear, mouth mid-word."),
  A("K16", ["K0"], "Same place: he stands with one hand on the round damper handle of the stovepipe and shakes his head slowly with a rueful, self-mocking expression, remembering his own young mistake, mouth mid-word."),
  A("K17", ["K16"], "Same place a moment later: he lets go of the damper handle and holds up one finger toward the camera with a wry half-smile, mouth mid-word."),
  A("K18", ["K0"], "Same cabin: he sits at the rough plank table by the snowy window with a blue enamel mug in front of him, both forearms on the table, warm and friendly, talking to the camera like to a friend, mouth mid-word."),
  A("K19", ["K18"], "Same place a moment later: he raises the blue enamel mug a little toward the camera with a kind smile and a nod, as if saying goodbye, mouth mid-word."),
  A("D1a", ["k0"], "A different place: the same log cabin, close view of a rough wooden floor next to the black cast iron stove: a big pile of dry split logs and a smaller pile of thin kindling sticks lie on the floor, nobody in frame, no person, no face. Warm glow from the stove door on the right."),
  A("D1b", ["D1a"], "Same close view a few seconds later: two weathered old hands in the sleeves of a dark green plaid flannel shirt lay a big dry split log on the bottom of the stack inside the open stove firebox and a second one beside it, no face visible anywhere."),
  A("D2a", ["k0"], "A different place: extreme close-up of an old man's hand in a dark green plaid flannel sleeve resting on a small round black iron handle on a black stovepipe, the pipe rising out of frame, weathered log wall behind, no face, no person visible."),
  A("D2b", ["D2a"], "Same extreme close-up a few seconds later: the old hand has turned the round black iron handle on the stovepipe a quarter turn, the slot in it now vertical, no face visible."),
  A("D3a", ["k0"], "A different place: close view of a small white plastic carbon monoxide alarm mounted high on a weathered log wall of a cabin next to a wooden beam, a steady green light on its face, the alarm has no writing, no label and no text anywhere on it, just a plain blank white plastic case with a round button; nobody in frame, no person, no face."),
  A("D3b", ["D3a"], "Same close view a few seconds later: a finger presses the round test button in the middle of the white alarm, its green light now flashing, the cabin log wall behind it, no face visible."),
];
const clips = [
  { id: "m1", a: "K0", b: "K1", audio: T + "m1.wav", text: "Well, now, friend, come on in and shut that door behind you.", action: act("He waves the viewer in with his open hand and then jerks a thumb back at the cabin door, welcoming.") },
  { id: "m2", a: "K2", b: "K3", audio: T + "m2.wav", text: "The stove's the only thing in this camp kitchen that never asks for a raise.", action: act("He pats the iron stove top with his palm and leans toward the camera with a sly grin.") },
  { id: "m3", a: "K4", b: "K5", audio: T + "m3.wav", text: "And I'm going to show you the trick. It's not magic,", action: act("He holds up one finger, serious, then opens both hands in an honest shrug.") },
  { id: "m4", a: "K6", b: "K7", audio: T + "m4.wav", text: "And one little handle on the pipe that people either never touch or turn the wrong way.", action: act("He points up along the stovepipe and then shakes his head slowly at the camera.") },
  { id: "m5", a: "K8", b: "K9", audio: T + "m5.wav", text: "But before I strike a single match, four things,", action: act("He holds up a wooden match between two fingers and then puts the box of matches on the shelf.") },
  { id: "m6", a: "K10", b: "K11", audio: T + "m6.wav", text: "Because a stove is a good friend only when you treat it right.", action: act("He pats the side of the stove fondly and then nods at the camera, kind and serious.") },
  { id: "m7", a: "K12", b: "K13", audio: T + "m7.wav", text: "You can't see that gas or smell it, and it gives you a headache and dizziness and you never figure out why.", action: act("He explains with an open hand, then taps two fingers to his temple with a squint.") },
  { id: "m8", a: "K14", b: "K15", audio: T + "m8.wav", text: "Quick word, friend, while I've got you. Everything I cook on this stove, I've been writing down:", action: act("He talks to the camera while he writes in the notebook, then lifts the notebook toward the camera with a proud smile.") },
  { id: "m9", a: "K16", b: "K17", audio: T + "m9.wav", text: "Here is the mistake I made when I was young. I closed it right down to make the wood last all night.", action: act("He shakes his head ruefully with a hand on the damper handle, then lets go and raises a finger with a wry smile.") },
  { id: "m10", a: "K18", b: "K19", audio: T + "m10.wav", text: "Tell me in the comments: what do you burn in your stove, and how do you know it's dry? I read every one. Now put another split on. Not too many, mind you. And I'll see you in the next one.", action: act("He talks to the camera from the table, then raises the mug with a kind smile and a goodbye nod.") },
  { id: "d_stack", prompt: "two old hands lay dry split logs into the stove firebox, one big split and then the next beside it. He stays silent, focused on his hands.", a: "D1a", b: "D1b", detail: true, secs: 4, d1: "a pile of dry split logs beside a cast iron stove", d2: "hands lay big split logs in the stove" },
  { id: "d_damper", prompt: "an old hand turns the round iron handle on the stovepipe a quarter turn. He stays silent, focused on his hands.", a: "D2a", b: "D2b", detail: true, secs: 4, d1: "a hand on a stovepipe damper handle", d2: "the handle turned a quarter turn" },
  { id: "d_alarm", prompt: "a finger presses the test button on the white carbon monoxide alarm and its green light starts flashing while it gives a short loud beep. Nobody speaks.", a: "D3a", b: "D3b", detail: true, secs: 4, d1: "a carbon monoxide alarm on a log wall", d2: "a finger presses its test button" },
];
fs.mkdirSync(R + "vlog/olstove/M1", { recursive: true });
fs.writeFileSync(R + "vlog/olstove/M1/plan.json", JSON.stringify(plan("vlog/olstove/M1", anchors, clips), null, 1));
console.log("plan M1:", anchors.length, "anclas,", clips.length, "clips");
