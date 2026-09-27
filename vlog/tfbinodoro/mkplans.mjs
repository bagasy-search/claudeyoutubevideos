// tfbinodoro — un plan.json por escena para scripts/agnes_vlog.mjs (+ plan_T de los detalles del tráiler).
// Anclas siempre; `audio` de cada clip si ya existe tramos.json. uso: node vlog/tfbinodoro/mkplans.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { TXT } from "./txt.mjs";
import { SETS, ACTS, T, G, B, ME, CUT, W, LOOKG, LOOKB } from "./acts.mjs";
const R = "D:/Proyectos/video2-wt/tfbinodoro/", V = R + "vlog/tfbinodoro/", OUT = R + "out/vlog/";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const FACE = R + "public/ref_tfbinodoro_face.png", WFACE = R + "public/ref_vecino_face.png", REF = R + "public/ref_tfbinodoro.png";
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a friend with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the cluttered background stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, the side near the opening a little brighter and cooler, the far corners dimmer. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, small blemishes and uneven tone; hair with stray strands; clothes with real creases, dust and wear. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld home video filmed by a friend with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural hands; people move naturally and unposed, nothing staged; no music.";
const WARD = " He keeps exactly the same clothes: the faded olive-green work shirt with rolled sleeves and the worn brown leather apron.";
const WA = W.replace("the fourth/last-but-one input image", "the second input image (his face)");   // en anclas: [prev, W, cara]
const WC = W.replace("the fourth/last-but-one input image", "the fourth reference image (his face)"); // en clips: [Ka, Kb, cara, W]
const x = (s, w = WA) => s.replace(/\{G\}/g, G).replace(/\{B\}/g, B).replace(/\{ME\}/g, ME).replace(/\{CUT\}/g, CUT).replace(/\{LOOKG\}/g, LOOKG).replace(/\{LOOKB\}/g, LOOKB)
  .replace(W, w).replace(/^S:\s*/, "Same place, same framing and same light, a few seconds later: ");
const hasW = s => s.includes(W);
// tramos (si ya están)
let wavOf = null;
if (fs.existsSync(V + "tramos.json")) {
  const tr = JSON.parse(fs.readFileSync(V + "tramos.json", "utf8"));
  const voz = TXT.flatMap(s => s.lines.filter(l => l[1] !== "w"));
  if (voz.length !== tr.length) throw new Error(`voz ${voz.length} != tramos ${tr.length}`);
  fs.mkdirSync(V + "tramos", { recursive: true }); wavOf = {};
  voz.forEach((l, i) => { const o = V + "tramos/" + l[0] + ".wav";
    if (!fs.existsSync(o) || process.env.RETRAMOS) ff("-ss", tr[i].s.toFixed(3), "-to", tr[i].e.toFixed(3), "-i", R + "out/tfbinodoro/master_c.wav", "-ac", "1", "-ar", "44100", o);
    wavOf[l[0]] = o; });
}
const tot = { anc: 0, clips: 0, kf: 0, w: 0 };
const VEC = "the neighbour (the fourth reference image is his face), in Spanish with a neutral Latin American accent, the gruff, amused voice of a 65-year-old man; the presenter does NOT speak";
for (const s of TXT) {
  const set = SETS[s.id], dir = OUT + s.id, anchors = [], clips = [];
  anchors.push({ id: "K0", from: ["k0"], prompt: set.k0 });
  let n = 0, cur = "K0"; const next = () => "K" + (++n);
  for (const [id, k, t] of s.lines) {
    if (k === "v" || k === "lam") continue;
    const A = ACTS[id]; if (!A) throw new Error("sin ACTS: " + id);
    if (A.cut) { const kc = next(); const w = hasW(A.cut); anchors.push({ id: kc, from: w ? ["K0", "W"] : ["K0"], prompt: "Same place and same light as the first image, but a different camera angle: " + x(A.cut) + (w ? "" : WARD) }); cur = kc; }
    const W_ = hasW(A.cut || "") || k === "w";
    if (k === "d") {
      const base = A.k0 ? "K0" : cur, da = next(), db = next(), ke = next();
      anchors.push({ id: da, from: [base], prompt: x(A.da) + " Same place, same light and same objects as the first image, but the camera is now VERY CLOSE: this detail fills the whole frame." });
      anchors.push({ id: db, from: [da], prompt: x(A.db) });
      anchors.push({ id: ke, from: [base], prompt: x(A.e) + WARD });
      clips.push({ id, a: da, b: db, kf: true, detail: true, audio: wavOf?.[id], text: t, action: x(A.a, WC) });
      tot.kf++; cur = ke;
    } else {
      const ke = next();
      anchors.push({ id: ke, from: W_ ? [cur, "W"] : [cur], prompt: x(A.e) + (W_ ? " The neighbour is exactly the man of the second input image (his face)." : WARD) });
      const c = { id, a: cur, b: ke, text: t, action: x(A.a, WC) };
      if (W_) c.refs = ["W"];
      if (k === "w") { Object.assign(c, { line: t, secs: Math.min(12, Math.max(4, Math.ceil(t.length / 12) + 1)), who: "the neighbour (the fourth reference image is his face)", voice: VEC }); tot.w++; }
      else c.audio = wavOf?.[id];
      clips.push(c); cur = ke;
    }
  }
  const plan = { dir, face: FACE, k0_from: REF, extra: { W: WFACE }, lang: "es", light: LIGHT, look: LOOK, anchors, clips, out: dir + "/vlog_" + s.id + ".mp4" };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(V + "plan_" + s.id + ".json", JSON.stringify(plan, null, 1));
  tot.anc += anchors.length; tot.clips += clips.length;
  console.log(s.id, "anclas", anchors.length, "clips", clips.length, wavOf ? "" : "(sin audio todavía)");
}
// T: detalles del tráiler (keyframe sin habla, con foley). da sale del K0 de su escena (S1 garaje / S2 baño).
{
  const dir = OUT + "T", anchors = [], clips = [];
  for (const [id, A] of Object.entries(T)) {
    const i = anchors.length; const da = "K" + (i + 1), db = "K" + (i + 2);
    anchors.push({ id: da, from: [A.base + "K0"], prompt: x(A.da) + " Same place, same light and same objects as the first image, but the camera is now VERY CLOSE: this detail fills the whole frame." });
    anchors.push({ id: db, from: [da], prompt: x(A.db) });
    clips.push({ id, a: da, b: db, kf: true, detail: true, secs: 4, action: x(A.a) });
  }
  const plan = { dir, face: FACE, k0_from: REF, extra: { W: WFACE, S1K0: OUT + "S1/anc/K0.png", S2K0: OUT + "S2/anc/K0.png" }, lang: "es", light: LIGHT, look: LOOK, anchors, clips, out: dir + "/vlog_T.mp4" };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(V + "plan_T.json", JSON.stringify(plan, null, 1));
  tot.anc += anchors.length; tot.clips += clips.length; tot.kf += clips.length;
  console.log("T anclas", anchors.length, "clips", clips.length);
}
console.log("TOTAL", tot, "≈ US$", (tot.anc * 0.0035).toFixed(2), "de anclas");
