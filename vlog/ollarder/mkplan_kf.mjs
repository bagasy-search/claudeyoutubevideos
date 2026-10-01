// Detalles agnes 2.5-flash keyframe CON SONIDO (foley real): jarra que revienta, sierra en la res congelada, sal sobre el cerdo.
import fs from "node:fs";
import { R, A, plan } from "./lib.mjs";
const anchors = [
  A("D1a", ["k0"], "Nobody in frame. Close view of a glass jar on a snowy log cabin windowsill, its frozen contents pushing up under the metal lid in a gray ice dome, frost feathers on the glass, bright snowy daylight through the window."),
  A("D1b", ["D1a"], "Same close view a few seconds later: a jagged crack runs down the glass and a plug of gray ice has pushed the lid up and out, small ice shards on the sill."),
  A("D2a", ["k0"], "An old hand holds a bone saw whose teeth just touch a hard frozen block of dark red beef on a wooden bench in a cold plank shed, white frost on the meat, a lantern glow at the edge, sleeve only."),
  A("D2b", ["D2a"], "Same close view a few seconds later: the saw has cut halfway through the frozen block and fine white frost dust lies on the bench around the cut."),
  A("D3a", ["k0"], "An old hand holds a fistful of coarse white salt just above a thick slab of pork on a wooden board in a log storeroom, sleeve only, lantern glow at the edge."),
  A("D3b", ["D3a"], "Same close view a few seconds later: the salt has fallen and covers the pork slab in white crystals, a few grains rolling off the board edge."),
];
const clips = [
  { id: "d_jar", prompt: "the frozen contents push the jar lid up and the glass cracks with a sharp snap while a plug of gray ice rises. Nobody is in the frame and nobody speaks.", a: "D1a", b: "D1b", detail: true, secs: 4, d1: "a jar of frozen contents with an ice dome under its lid", d2: "the glass cracks and a plug of ice pushes the lid up", sound: "a sharp crack of glass and small ticks of ice" },
  { id: "d_saw", prompt: "the old hand saws back and forth through the frozen beef and white frost dust puffs up from the cut. He stays silent, focused on his hands.", a: "D2a", b: "D2b", detail: true, secs: 4, d1: "a bone saw touches a frozen block of beef", d2: "the saw cuts halfway through and frost dust spreads", sound: "the rasp of a saw through frozen meat and the crunch of frost" },
  { id: "d_salt", prompt: "the old hand lets the coarse salt rain down over the pork slab until it is covered in white crystals. He stays silent, focused on his hands.", a: "D3a", b: "D3b", detail: true, secs: 4, d1: "a fistful of coarse salt above a slab of pork", d2: "the salt covers the pork", sound: "coarse salt pattering softly onto the meat" },
];
fs.mkdirSync(R + "vlog/ollarder/Mkf", { recursive: true });
fs.writeFileSync(R + "vlog/ollarder/Mkf/plan.json", JSON.stringify(plan("vlog/ollarder/Mkf", anchors, clips), null, 1));
console.log("plan Mkf:", anchors.length, "anclas,", clips.length, "clips");
