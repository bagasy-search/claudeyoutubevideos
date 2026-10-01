// Planes agnes 2.5-flash de los hablados sueltos (m6-m9). Cada uno es su escena con la foto base de Ole (plate).
import fs from "node:fs";
import { R, WHO, KIT, A, act, plan } from "./lib.mjs";
const T = R + "vlog/ollarder/tramos/";
const W = JSON.parse(fs.readFileSync(R + "_v3/ollarder_wordms.json", "utf8"));
const words = (s, e) => W.filter((w) => w.s >= s - 0.01 && w.e <= e + 0.05).map((w) => w.w.replace(/\[[^\]]+\]/g, "")).join(" ").replace(/\s+/g, " ").trim();
const SH = JSON.parse(fs.readFileSync(R + "_v3/ollarder_shots.json", "utf8")).vl;
const S = [
  { id: "m6", a: "Same storeroom, a bit later: he leans forward over the plank table toward the camera with one finger wagging, talking seriously, the barrels and crates behind him.", b: "Same place a few seconds later: he turns to the snowy window on his left and gestures toward it with an open hand, then looks back at the camera, mid-sentence.", action: "He leans in wagging a finger and talks seriously, then gestures toward the snowy window with an open hand and glances back at the camera." },
  { id: "m7", a: "Same storeroom, a bit later: he sits back with a pleased, sly smile and one hand raised as if saying wait for it, a few potatoes on the table in front of him.", b: "Same place a few seconds later: he holds up a shiny red apple in one hand and sets it down right next to a potato on the plank table with the other hand, looking at the camera with a conspiratorial grin, mid-sentence.", action: "He talks with a sly smile and a raised hand, then lifts a red apple and sets it down beside a potato on the table with a conspiratorial grin." },
  { id: "m8", a: "Same storeroom, a bit later: he holds up one finger at the camera, counting, a plain look of friendly teaching, the potatoes and mug on the table, mid-sentence.", b: "Same place a few seconds later: he taps a potato on the table with one finger and looks up at the camera with raised eyebrows, mid-sentence.", action: "He counts on one finger while he talks, then taps a potato on the table and looks up with raised eyebrows." },
  { id: "m9", a: "Same storeroom, evening warmth, a bit later: he leans in toward the camera with his hands clasped on the plank table, a warm curious smile, the lantern glowing behind him.", b: "Same place a few seconds later: he opens one hand toward the camera, palm up, eyebrows raised with a warm inviting smile, mid-sentence.", action: "He leans in with clasped hands and a warm curious smile, then opens one hand toward the camera, inviting an answer." },
];
for (const s of S) {
  const sp = SH[s.id]; if (!sp) { console.error("sin span para", s.id); process.exit(1); }
  const [s0, e0] = [sp.s, sp.e];
  const clip = { id: s.id, a: "K0", b: "K1", audio: T + s.id + ".wav", text: words(s0, e0), action: act(s.action) };
  const p = plan("vlog/ollarder/M2" + s.id, [A("K0", ["k0"], s.a + ` ${WHO} sits behind the rough plank table in ${KIT}.`), A("K1", ["K0"], s.b)], [clip]);
  fs.mkdirSync(R + "vlog/ollarder/M2" + s.id, { recursive: true });
  fs.writeFileSync(R + "vlog/ollarder/M2" + s.id + "/plan.json", JSON.stringify(p, null, 1));
  console.log(s.id, (e0 - s0).toFixed(2), "s ·", clip.text.slice(0, 80));
}
