// un plan.json por escena para scripts/agnes_vlog.mjs (anclas ya; los tramos de audio se cortan después con mktramos.mjs)
import fs from "node:fs";
import { SCENES } from "./guion_src.mjs";
const R = "D:/Proyectos/video2-wt/faoliva/", V = R + "vlog/faoliva/";
const FACE = R + "public/ref_faoliva_facecrop.png";
const W = V + "W_rosa.png", COVER = R + "public/img/faoliva/portada_piel.jpg";
const KITCHEN = V + "kitchen_base_1088.png";
const baseFrom = { S1: KITCHEN, S4: KITCHEN, S7: KITCHEN, S9: V + "S6/anc/K0.png", S10: V + "S2/anc/K0.png" };
const PRE = { W: "The elderly woman is exactly the woman in the second input image (her face, short wavy silver-grey hair, thin gold-rimmed glasses, soft coral knitted cardigan over a white blouse, 72 years old). ",
  COVER: "The book is exactly the book of the second input image (its front cover: EL METODO PIEL JOVEN, Dr. Federer). " };
const CPRE = { W: "The elderly woman (the fourth reference image is her face) is in the scene. ", COVER: "The book he holds has exactly the front cover of the fourth reference image. " };
const NIGHT = new Set(["S2", "S10"]);
const NIGHTTXT = " It is night but the room stays BRIGHT: the ceiling light and the bedside lamp are ON, the whole room evenly lit, neutral white balance, nothing dark.";
let tot = { anc: 0, clips: 0 };
for (const s of SCENES) {
  const dir = V + s.id, anchors = [], clips = [];
  let n = 0, cur = "K0";
  anchors.push({ id: "K0", from: ["k0"], prompt: s.k0 + (NIGHT.has(s.id) ? NIGHTTXT : "") });
  const next = () => "K" + (++n);
  for (const l of s.lines) {
    if (l.k === "lam") continue;
    const refs = l.refs || [];
    const pre = refs.map(r => PRE[r]).join(""), cpre = refs.map(r => CPRE[r]).join("");
    const nt = NIGHT.has(s.id) ? NIGHTTXT : "";
    if (l.k === "d") {
      const da = next(), db = next(), ke = next();
      anchors.push({ id: da, from: [cur], prompt: l.da + " Same place, same light and same objects as the first image, now seen in extreme close-up." + nt });
      anchors.push({ id: db, from: [da], prompt: l.db + nt });
      anchors.push({ id: ke, from: [cur, ...refs], prompt: pre + l.e + nt });
      clips.push({ id: l.id, a: da, b: db, kf: true, audio: V + "tramos/" + l.id + ".wav", text: l.t, action: l.a });
      cur = ke;
    } else {
      const ke = next();
      anchors.push({ id: ke, from: [cur, ...refs], prompt: pre + l.e + nt });
      const c = { id: l.id, a: cur, b: ke, text: l.t, action: cpre + l.a };
      if (refs.length) c.refs = refs;
      if (l.k === "w") Object.assign(c, { line: l.t, secs: Math.min(12, Math.max(5, Math.ceil(l.t.length / 13) + 1)), who: "the elderly woman (the fourth reference image is her face)", voice: "in Spanish with a warm Latin American accent, the lively voice of a 72-year-old grandmother; the doctor does NOT speak, he only listens and reacts" });
      else c.audio = V + "tramos/" + l.id + ".wav";
      clips.push(c);
      cur = ke;
    }
  }
  const plan = { dir, face: FACE, face_ref: R + "public/ref_faoliva_face.png", k0_from: baseFrom[s.id] || FACE, extra: { W, COVER }, extra_anc: { W: V + "W_rosa_face.png", COVER: V + "cover_576.jpg" }, lang: "es", anchors, clips, out: dir + "/vlog_" + s.id + ".mp4" };
  fs.mkdirSync(dir + "/anc", { recursive: true });
  fs.writeFileSync(V + "plan_" + s.id + ".json", JSON.stringify(plan, null, 1));
  tot.anc += anchors.length; tot.clips += clips.length;
  console.log(s.id, "anclas", anchors.length, "clips", clips.length);
}
console.log("TOTAL", JSON.stringify(tot));
