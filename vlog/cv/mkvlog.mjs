// segs.json + vlog/<slug>/escenas.mjs → vlog/<slug>/<escena>/plan.json (sólo los clips HABLADOS; STOCK y DET van aparte)
// + tramos de audio. Anclas en ESTRELLA: K0 desde la miniatura del canal (public/ref_cv_k0.png) + set; K1..Kn desde K0.
// Clip i: a=K(i-1), b=Ki (dentro de la escena, saltando los stock/det). audio = tramo EXACTO; gen_audio = continuado hasta T.
//   SLUG=cvporkchops node vlog/cv/mkvlog.mjs
import fs from "node:fs"; import { execFileSync } from "node:child_process"; import { pathToFileURL } from "node:url";
import { WHO, SAME, SETS, LIGHT, LIGHT_DEF, LOOK, RUSTY } from "./lib.mjs";
const S = process.env.SLUG, R = `D:/Proyectos/video2-wt/${process.env.WT || S}/`, D = R + `vlog/${S}/`;
const { ESC, STOCK, DET } = await import(pathToFileURL(D + "escenas.mjs").href);
const segs = JSON.parse(fs.readFileSync(D + "segs.json", "utf8"));
const MASTER = R + `public/${S}.wav`;
const order = [...new Set(segs.map((s) => s.sc))];
let nA = 0, nC = 0; const falta = [];
for (const s of segs) if (!STOCK[s.id] && !DET[s.id] && !(ESC[s.sc] && ESC[s.sc].clips[s.id])) falta.push(s.id);
if (falta.length) throw new Error("falta dirección de " + falta.join(","));
for (const sc of order) {
  const E = ESC[sc], my = segs.filter((s) => s.sc === sc && !STOCK[s.id] && !DET[s.id]);
  if (!my.length) { console.log(sc.padEnd(4), "sin hablados (stock/det)"); continue; }
  const P = D + sc + "/"; fs.mkdirSync(P + "aud", { recursive: true });
  const who2 = E.rusty ? ` ${RUSTY} is in the kitchen too.` : "";
  // E.ref = foto REAL de la comida en public/ (gpt-image dibuja chuletas/carne como hamburguesas redondas si sólo lee texto) + E.refTxt
  const fr = E.ref ? [R + "public/" + E.ref] : [], frT = E.ref ? ` The ${E.refTxt || "food"} look exactly like the food in the second image (same shape, bone, fat edge and color), never round patties or burgers.` : "";
  const anchors = [{ id: "K0", from: ["k0", ...fr], prompt: `${WHO} ${E.base} The place: ${SETS[E.set]}.${who2} Seen from a ranch hand's handheld camera at eye level, a medium shot from the waist up.${frT}` + SAME }];
  const clips = [], ov = {};
  my.forEach((s, i) => {
    const [act, end] = E.clips[s.id];
    anchors.push({ id: "K" + (i + 1), from: ["K0", ...fr], prompt: `Same place, same people, same light as the first image, a few seconds later. ${end}.${frT}` + SAME });
    const au = P + `aud/${s.id}.wav`, ga = P + `aud/${s.id}_gen.wav`;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.s.toFixed(3), "-to", s.e.toFixed(3), "-i", MASTER, "-ac", "2", "-ar", "48000", au]);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.s.toFixed(3), "-t", String(s.T), "-i", MASTER, "-af", `apad=whole_dur=${s.T}`, "-t", String(s.T), "-ac", "2", "-ar", "48000", ga]);
    clips.push({ id: s.id, a: "K" + i, b: "K" + (i + 1), audio: au, gen_audio: ga, T: s.T, text: s.text,
      action: `Claudio, the man whose face is the third reference image, ${act}. ${LIGHT_DEF}.` + SAME });
    ov[s.id] = { mode: "trunc" };
  });
  fs.writeFileSync(P + "plan.json", JSON.stringify({ dir: P, face: R + "public/ref_cv_face_hd2.png", k0_from: R + `public/ref_cv_${E.set}.png`, prev_box: "512x288", pronoun: "he", lang: "en",
    light: LIGHT, look: LOOK, anchors, clips, overrides: ov, out: P + "out.mp4" }, null, 1));
  nA += anchors.length; nC += clips.length;
  console.log(sc.padEnd(4), anchors.length, "anclas ·", clips.length, "clips");
}
const dS = segs.filter((s) => STOCK[s.id]).reduce((a, s) => a + s.d, 0), dD = segs.filter((s) => DET[s.id]).reduce((a, s) => a + s.d, 0), tot = segs.reduce((a, s) => a + s.d, 0);
console.log("TOTAL", nA, "anclas ·", nC, "clips hablados · stock", dS.toFixed(1), "s =", (100 * dS / tot).toFixed(1), "% · det", dD.toFixed(1), "s · total", tot.toFixed(1));
