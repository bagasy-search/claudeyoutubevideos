// Plan de clips LTX desde las tomas: vl (hablados, voz exacta) y kf (detalles mudos con foley) → vlog/<slug>/M1/plan.json (anclas para
// `node scripts/agnes_vlog.mjs <plan> anclas`) + tramos de audio estéreo 48 k (a2v exige 2 canales) → vlog/<slug>/ltx/aud/<id>.wav
import fs from "node:fs"; import { execFileSync } from "node:child_process";
import { R, SLUG, V3, J, W } from "./env.mjs";
import { WHO, KIT, LIGHT, LOOK } from "./lib.mjs";
const { shots, vl } = J(V3 + "shots.json"), WM = J(V3 + "wordms.json");
const FACE = "Medium shot from her grandson's handheld camera at eye level, she looks at the camera and talks.";
const D = R + `vlog/${SLUG}/`; fs.mkdirSync(D + "M1", { recursive: true }); fs.mkdirSync(D + "ltx/aud", { recursive: true });
const anchors = [], clips = [], m1 = {}, done = new Set();
for (const s of shots) {
  if (done.has(s.name) || !["vl", "kf"].includes(s.kind)) continue; done.add(s.name);
  if (!s.a) { console.error("⛔ sin ancla (opts.a):", s.name); process.exit(1); }
  if (s.kind === "vl") {
    const v = vl[s.name], a = Math.max(0, v.s - 0.03), e = v.e;
    const text = WM.filter((w) => w.s >= v.s - 0.1 && w.e <= v.e + 0.1).map((w) => w.w).join(" ");
    m1[s.name] = { s: +a.toFixed(3), e: +e.toFixed(3), text };
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", a.toFixed(3), "-to", e.toFixed(3), "-i", R + `public/${SLUG}.wav`, "-ac", "2", "-ar", "48000", D + `ltx/aud/${s.name}.wav`], { windowsHide: true });
    anchors.push({ id: "K" + s.name, from: ["k0"], prompt: `Same kitchen, same light. ${WHO} ${s.a} ${FACE}` });
    clips.push({ id: s.name, a: "K" + s.name, text, action: s.act + " She wears the same lilac cardigan, pearl necklace, light-framed glasses and floral apron with the green trim the whole time." });
  } else {
    anchors.push({ id: "K" + s.name, from: ["k0"], prompt: `Tight close-up of only hands and food, her face is NOT in the frame at all (cropped out above the top edge): ${s.a}` });
    clips.push({ id: s.name, a: "K" + s.name, detail: true, d1: s.d1, d2: s.d2, sound: s.sound });
  }
}
anchors.unshift({ id: "K0", from: ["k0"], prompt: `Same kitchen, same moment of the day. ${WHO} sits at the floury wooden table of ${KIT}, looking at the camera and talking, warm. ${FACE}` });
W(D + "M1/plan.json", { dir: D + "M1", face: R + "public/ref_lor_facecrop.png", k0_from: R + "public/ref_lor.png", pronoun: "she", lang: "en", light: LIGHT, look: LOOK, anchors, clips, out: D + "M1/out.mp4" });
W(V3 + "m1.json", m1);
console.log("plan:", anchors.length, "anclas ·", clips.filter((c) => !c.detail).length, "hablados ·", clips.filter((c) => c.detail).length, "detalles");
