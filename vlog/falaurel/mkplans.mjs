// falaurel — un plan.json por escena para scripts/agnes_vlog.mjs (anclas siempre; clips si ya hay tramos.json)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { TXT } from "./txt.mjs";
import { SETS, ACTS } from "./acts.mjs";
const R = "D:/Proyectos/video2-wt/falaurel/", V = R + "vlog/falaurel/";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const BAY = "dried culinary bay leaves (Laurus nobilis: dry, matte olive-green, elongated oval leaves with slightly wavy edges, like the ones from a supermarket spice bag; only dry leaves, no flowers anywhere)";
const x = s => s.replace(/\{BAY\}/g, BAY).replace(/^S:\s*/, "Same place, same framing and same light: ");
const WHO = " The man is the doctor of the input image (a close-up of his real face): EXACTLY that face — same face shape, eyes, nose, eyebrows, dark curly hair with a little grey, short salt-and-pepper beard, same age (about 40) — do not make him younger or more handsome. He wears blue medical scrubs with short sleeves, a black stethoscope around his neck and a black smartwatch on his left wrist. A casual home video frame, ordinary, candid.";
const HER = "The elderly woman is exactly the woman in the second input image (her face, short soft grey hair, navy-blue knitted cardigan over a white blouse with small printed flowers, small gold earrings, 73 years old, not younger). ";
const COV = "The printed guide book's cover is exactly the second input image (same design, same colors), shown as a real printed book. ";
const FACE = R + "public/ref_falaurel_facecrop.png", FACE_G = R + "public/ref_falaurel_face.png";
const W = V + "refs/W_elena.png", COVER = R + "public/img/falaurel/portada_piel.jpg";
// tramos (si ya están)
let wavOf = null;
if (fs.existsSync(V + "tramos.json")) {
  const tr = JSON.parse(fs.readFileSync(V + "tramos.json", "utf8"));
  const voz = TXT.flatMap(s => s.lines.filter(l => l[1] !== "w"));
  if (voz.length !== tr.length) throw new Error(`voz ${voz.length} != tramos ${tr.length}`);
  fs.mkdirSync(V + "tramos", { recursive: true }); wavOf = {};
  voz.forEach((l, i) => { const o = V + "tramos/" + l[0] + ".wav";
    if (!fs.existsSync(o)) ff("-ss", tr[i].s.toFixed(3), "-to", tr[i].e.toFixed(3), "-i", R + "out/falaurel/master.wav", "-ac", "1", "-ar", "44100", o);
    wavOf[l[0]] = o; });
}
const tot = { anc: 0, clips: 0 };
for (const s of TXT) {
  const set = SETS[s.id], dir = V + s.id, anchors = [], clips = [];
  const k0_from = set.from === "REF" ? R + "public/ref_falaurel.png" : set.from === "FACE" ? null : V + set.from.replace("K0", "") + "/anc/K0.png";
  const k0p = set.from === "FACE" ? "Create a new photo: " + x(set.k0) + WHO : set.cover ? COV + x(set.k0) : x(set.k0);
  anchors.push({ id: "K0", from: set.from === "FACE" ? [] : set.cover ? ["k0", "COVER"] : ["k0"], prompt: k0p });
  let n = 0, cur = "K0"; const next = () => "K" + (++n);
  for (const [id, k, t] of s.lines) {
    if (k === "v" || k === "lam") continue;
    const A = ACTS[id]; if (!A) throw new Error("sin ACTS: " + id);
    const hasW = !!A.W, hasC = !!A.COVER;
    const extraFrom = hasW ? ["W"] : hasC ? ["COVER"] : [];
    const pre = hasW ? HER : hasC ? COV : "";
    if (k === "d") {
      const da = next(), db = next(), ke = next();
      const nf = !A.face; const nfx = t => nf ? t.replace(/s*—?s*ignore the last input image.?/g, "") : t;
      anchors.push({ id: da, noface: nf, from: [cur, ...extraFrom], prompt: pre + nfx(x(A.da)) + " Same place, same light and same objects as the first image, but the camera is now VERY CLOSE: this detail fills the whole frame." });
      anchors.push({ id: db, noface: nf, from: [da], prompt: nfx(x(A.db)) });
      anchors.push({ id: ke, from: [cur, ...extraFrom], prompt: pre + x(A.e) });
      clips.push({ id, a: da, b: db, kf: true, audio: wavOf?.[id], text: t, action: x(A.a) });
      cur = ke;
    } else {
      const ke = next();
      anchors.push({ id: ke, from: [cur, ...extraFrom], prompt: pre + x(A.e) });
      const c = { id, a: cur, b: ke, text: t, action: (hasW ? "The elderly woman (the fourth reference image is her face) is in the scene. " : hasC ? "The printed guide book (the fourth reference image is its cover) is in the scene. " : "") + x(A.a) };
      if (hasW) c.refs = ["W"]; else if (hasC) c.refs = ["COVER"];
      if (k === "w") Object.assign(c, { line: t, secs: Math.min(12, Math.max(4, Math.ceil(t.length / 13) + 1)), who: "the elderly woman (the fourth reference image is her face)", voice: "in Spanish with a warm Mexican accent, the lively voice of a 73-year-old grandmother; the doctor does NOT speak, he only listens and reacts" });
      else c.audio = wavOf?.[id];
      clips.push(c);
      cur = ke;
    }
  }
  const plan = { dir, face: FACE, face_gpt: FACE_G, k0_from, extra: { W, COVER }, lang: "es", anchors, clips, out: dir + "/vlog_" + s.id + ".mp4" };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(V + "plan_" + s.id + ".json", JSON.stringify(plan, null, 1));
  tot.anc += anchors.length; tot.clips += clips.length;
  console.log(s.id, "anclas", anchors.length, "clips", clips.length, wavOf ? "" : "(sin audio todavía)");
}
console.log("TOTAL", tot);
