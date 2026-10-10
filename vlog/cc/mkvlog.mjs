// segs.json (kind vl) + vlog/<slug>/escenas.mjs → vlog/<slug>/<escena>/plan.json (uno por escena) + tramos de audio. CLAUDIO COCINA.
// Anclas en ESTRELLA: K0 = maestra del set (M1-M4, agnes sin gente) + LOOK de Claudio (gpt-image /edits low Batch desde claudio_hd.png)
// [+ don Chuy] + cara 128x192 (la agrega agnes_vlog). K1..Kn (fin de cada clip) salen todas de K0.
// Clip i: a=K(i-1), b=Ki; audio = tramo EXACTO del máster; gen_audio = el mismo tramo CONTINUADO hasta el segundo entero T.
//   SLUG=ccfrijoles node vlog/cc/mkvlog.mjs
import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process"; import { pathToFileURL, fileURLToPath } from "node:url";
import { WHO, SAME, FONDA, SET, LIGHT, LOOK } from "./lib.mjs";
export const LOOK_IMG = "D:/rtmp/cc/masters/out/claudio_look.png";   // look de cocinero elegido (crop de cara = plan_claudio_cocina/face.png)
export const FACE = "C:/Users/bauti/Downloads/plan_claudio_cocina/face_hd.png"; // 420x630 (agnes pide lado ≥256; la 128x192 la rechazaba, 10-oct) de recortada de claudio_hd.png (10-oct)
const CHUY_IMG = "D:/rtmp/cc/masters/out/don_chuy.png";
const S = process.env.SLUG, R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..").replace(/\\/g, "/") + "/", D = R + `vlog/${S}/`;
const { ESC } = await import(pathToFileURL(D + "escenas.mjs").href);
const segs = JSON.parse(fs.readFileSync(D + "segs.json", "utf8")).filter((s) => s.kind === "vl");
const MASTER = R + `public/${S}.wav`;
for (const f of [LOOK_IMG, FACE, CHUY_IMG, MASTER]) if (!fs.existsSync(f)) throw new Error("falta " + f);
const order = [...new Set(segs.map((s) => s.sc))];
let nA = 0, nC = 0;
for (const sc of order) {
  const E = ESC[sc]; if (!E) throw new Error("falta escena " + sc);
  const st = SET[E.set], my = segs.filter((s) => s.sc === sc), P = D + sc + "/"; fs.mkdirSync(P + "aud", { recursive: true });
  const light = LIGHT.replace("morning daylight from the window", E.light);
  const refs = E.chuy ? "The first image is the place; the second image shows Claudio and exactly how he is dressed; the third image is Don Chuy (same face, sombrero, shirt and mustache)." : "The first image is the place; the second image shows Claudio and exactly how he is dressed.";
  const chuy = E.chuy ? " Don Chuy, an old man about 70 with a worn palm-leaf sombrero, a faded blue-and-white plaid shirt and a thick white mustache (the third image), sits at the table." : "";
  const from0 = E.chuy ? ["k0", "look", "chuy"] : ["k0", "look"];
  const anchors = [{ id: "K0", from: from0, prompt: `${refs} In ${FONDA}, ${st.d}. ${WHO} ${E.base}.${chuy} Seen from a kitchen helper's handheld camera at eye level, framed from the knees or waist up, the place exactly as in the first image.` + SAME }];
  const clips = [], ov = {};
  my.forEach((s, i) => {
    const [act, end] = E.clips[s.id] || (() => { throw new Error("falta dirección de " + s.id); })();
    anchors.push({ id: "K" + (i + 1), from: ["K0"], prompt: `Same place, same people, same light, same objects as the first image, a few seconds later. ${end}.` + SAME });
    const au = P + `aud/${s.id}.wav`, ga = P + `aud/${s.id}_gen.wav`;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.s.toFixed(3), "-to", s.e.toFixed(3), "-i", MASTER, "-ac", "2", "-ar", "48000", au]);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.s.toFixed(3), "-t", String(s.T), "-i", MASTER, "-af", `apad=whole_dur=${s.T}`, "-t", String(s.T), "-ac", "2", "-ar", "48000", ga]);
    clips.push({ id: s.id, a: "K" + i, b: "K" + (i + 1), audio: au, gen_audio: ga, T: s.T, text: s.text,
      action: `Claudio, the man whose face is the third reference image, ${act}. ${E.light}.` + SAME });
    ov[s.id] = { mode: "trunc" };
  });
  fs.writeFileSync(P + "plan.json", JSON.stringify({ dir: P, face: FACE, k0_from: st.img, extra: { look: LOOK_IMG, chuy: CHUY_IMG }, prev_box: "512x288", pronoun: "he", lang: "es",
    light, look: LOOK, anchors, clips, overrides: ov, out: P + "out.mp4" }, null, 1));
  nA += anchors.length; nC += clips.length;
  console.log(sc.padEnd(12), E.set, anchors.length, "anclas ·", clips.length, "clips");
}
console.log("TOTAL", nA, "anclas ·", nC, "clips ·", order.length, "escenas");
