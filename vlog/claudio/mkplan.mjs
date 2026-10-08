// Plan agnes-video-2.5-flash de los clips HABLADOS de Rhonda (kind vl, con SU voz exacta) → vlog/<slug>/M1/plan.json para
// `node scripts/agnes_vlog.mjs <plan> anclas|clips|check|armar` + tramos de audio estéreo 48 k → vlog/<slug>/M1/aud/<id>.wav.
// Los detalles kf NO van acá: van por agnes_i2v (AG_MODEL=agnes-video-2.5-flash) desde su foto base gpt.  SLUG=x node vlog/claudio/mkplan.mjs
import fs from "node:fs"; import { execFileSync } from "node:child_process";
import { R, SLUG, V3, J, W } from "./env.mjs";
import { WHO, BATH, LIGHT, LOOK } from "./lib.mjs";
const { shots, vl } = J(V3 + "shots.json"), WM = J(V3 + "wordms.json");
const FACE = "Medium shot from a coworker's handheld camera at eye level, he looks at the camera and talks.";
const SAME = " He wears the same navy-blue work jacket over a heather-gray t-shirt and the same blue nitrile gloves the whole time, same curly black-and-gray hair and short gray-black beard.";
const D = R + `vlog/${SLUG}/M1/`; fs.mkdirSync(D + "aud", { recursive: true });
const anchors = [], clips = [], m1 = {}, done = new Set();
for (const s of shots) {
  if (s.kind !== "vl" || done.has(s.name)) continue; done.add(s.name);
  if (!s.a) { console.error("⛔ sin ancla (opts.a):", s.name); process.exit(1); }
  const v = vl[s.name], a = Math.max(0, v.s - 0.03), e = v.e;
  const text = WM.filter((w) => w.s >= v.s - 0.1 && w.e <= v.e + 0.1).map((w) => w.w).join(" ");
  m1[s.name] = { s: +a.toFixed(3), e: +e.toFixed(3), text };
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", e.toFixed(3), "-i", R + `public/${SLUG}.wav`, "-ac", "2", "-ar", "48000", D + `aud/${s.name}.wav`], { windowsHide: true });
  const ka = "K" + (anchors.length + 1), kb = "K" + (anchors.length + 2);
  anchors.push({ id: ka, name: s.name, from: ["k0"], prompt: `Same place, same light. ${WHO} ${s.a} ${FACE}` + SAME });
  anchors.push({ id: kb, name: s.name + "_fin", from: [ka], prompt: `A few seconds later, same place, same framing: ${s.b || "he has finished the sentence, same pose, mouth closed, a knowing look at the camera."}` + SAME });
  clips.push({ id: s.name, a: ka, b: kb, audio: D + `aud/${s.name}.wav`, text, action: s.act + SAME });
}
W(D + "plan.json", { dir: D, face: R + `public/ref_${SLUG}_face256.png`, k0_from: R + `public/img/${SLUG}/b_shop.jpg`, pronoun: "he", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: D + "out.mp4" });
W(V3 + "m1.json", m1);
console.log("plan:", anchors.length, "anclas ·", clips.length, "hablados:", clips.map((c) => `${c.id} "${c.text}"`).join(" | "));
