// tramos → wav + un plan.json por escena para scripts/agnes_vlog.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { SCENES } from "./guion_src.mjs";
const R = "D:/Proyectos/video2-wt/faperejil/", V = R + "vlog/faperejil/";
const tr = JSON.parse(fs.readFileSync(V + "tramos.json", "utf8"));
fs.mkdirSync(V + "tramos", { recursive: true });
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const voz = SCENES.flatMap(s => s.lines.filter(l => l.k !== "w"));
if (voz.length !== tr.length) throw new Error(`voz ${voz.length} != tramos ${tr.length}`);
const wavOf = {};
voz.forEach((l, i) => {
  const o = V + "tramos/" + l.id + ".wav";
  if (l.k === "lam") ff("-i", R + "out/faperejil_lam/master.wav", "-af", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse", "-ac", "1", "-ar", "44100", o);
  else ff("-ss", tr[i].s.toFixed(3), "-to", tr[i].e.toFixed(3), "-i", R + "out/faperejil/master.wav", "-ac", "1", "-ar", "44100", o);
  wavOf[l.id] = o;
});
const FACE = R + "public/ref_faperejil_facecrop.png";
const W = V + "W_carmen.png";
const baseFrom = { S2: R + "public/ref_faperejil.png", S4: R + "public/ref_faperejil.png", S6: R + "public/ref_faperejil.png",
  S7: V + "S3/anc/K0.png", S8: V + "S1/anc/K0.png" };
const HER = "The elderly woman is exactly the woman in the second input image (her face, short soft white-grey hair, lilac knitted cardigan over a white blouse, 70 years old). ";
for (const s of SCENES) {
  const dir = V + s.id, anchors = [], clips = [];
  let n = 0, cur = "K0";
  anchors.push({ id: "K0", from: ["k0"], prompt: s.k0 });
  const next = () => "K" + (++n);
  for (const l of s.lines) {
    if (l.k === "lam") continue;
    const hasW = (l.refs || []).includes("W");
    const fromW = hasW ? [cur, "W"] : [cur];
    const pre = hasW ? HER : "";
    if (l.k === "d") {
      const da = next(), db = next(), ke = next();
      anchors.push({ id: da, from: [cur], prompt: l.da + " Same place, same light and same objects as the first image, now seen in close-up." });
      anchors.push({ id: db, from: [da], prompt: l.db });
      anchors.push({ id: ke, from: fromW, prompt: pre + l.e });
      clips.push({ id: l.id, a: da, b: db, kf: true, audio: wavOf[l.id], text: l.t, action: l.a });
      cur = ke;
    } else {
      const ke = next();
      anchors.push({ id: ke, from: fromW, prompt: pre + l.e });
      const c = { id: l.id, a: cur, b: ke, text: l.t, action: (hasW ? "The elderly woman (fourth reference image is her face) is in the scene. " : "") + l.a };
      if (hasW) c.refs = ["W"];
      if (l.k === "w") Object.assign(c, { line: l.t, secs: Math.min(12, Math.max(4, Math.ceil(l.t.length / 13) + 1)), who: "the elderly woman (the fourth reference image is her face)", voice: "in Spanish with a warm Mexican accent, the lively voice of a 70-year-old grandmother; the doctor does NOT speak, he only listens and reacts" });
      else c.audio = wavOf[l.id];
      clips.push(c);
      cur = ke;
    }
  }
  const plan = { dir, face: FACE, k0_from: baseFrom[s.id] || FACE, extra: { W }, lang: "es", anchors, clips, out: dir + "/vlog_" + s.id + ".mp4" };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(V + "plan_" + s.id + ".json", JSON.stringify(plan, null, 1));
  console.log(s.id, "anclas", anchors.length, "clips", clips.length);
}
