// segs.json + escenas.mjs → vlog/furatones5/<escena>/plan.json (uno por escena) + tramos de audio.
// Anclas en ESTRELLA: K0 (= 1er cuadro) sale de la ref; K1..Kn (fin de cada clip) salen todas de K0 (2 rondas de Batch, sin deriva).
// Clip i: a=K(i-1), b=Ki. audio = tramo EXACTO del máster con sala (lo que suena en el armado); gen_audio = el mismo tramo
// CONTINUADO con el máster real hasta el segundo entero T (agnes no queda callado ni repite la frase). overrides trunc = 0 s agregados.
//   node vlog/furatones5/mkvlog.mjs
import fs from "node:fs"; import { execFileSync } from "node:child_process";
import { WHO, LIGHT, LOOK } from "../claudio/lib.mjs";
import { ESC } from "./escenas.mjs";
const R = "D:/Proyectos/video2-wt/furatones5/", D = R + "vlog/furatones5/";
const segs = JSON.parse(fs.readFileSync(D + "segs.json", "utf8"));
const MASTER = R + "public/furatones5.wav";
const TOT = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", MASTER]).toString();
const SAME = " He wears the same light khaki short-sleeve two-pocket work shirt with clear safety glasses pushed up on his forehead the whole time, same curly black-and-gray hair and short gray-black beard, same face as the reference.";
const order = [...new Set(segs.map((s) => s.sc))];
let nA = 0, nC = 0;
for (const sc of order) {
  const E = ESC[sc], my = segs.filter((s) => s.sc === sc), P = D + sc + "/"; fs.mkdirSync(P + "aud", { recursive: true });
  const light = LIGHT.replace("daylight from the window and a warm ceiling bulb", E.light);
  const anchors = [{ id: "K0", from: ["k0"], prompt: `${WHO} ${E.base} Seen from a coworker's handheld camera at eye level.` + SAME }];
  const clips = [], ov = {};
  my.forEach((s, i) => {
    const [act, end] = E.clips[s.id] || (() => { throw new Error("falta dirección de " + s.id); })();
    anchors.push({ id: "K" + (i + 1), from: ["K0"], prompt: `Same place, same people, same light as the first image, a few seconds later. ${end}.` + SAME });
    const au = P + `aud/${s.id}.wav`, ga = P + `aud/${s.id}_gen.wav`;
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.s.toFixed(3), "-to", s.e.toFixed(3), "-i", MASTER, "-ac", "2", "-ar", "48000", au]);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.s.toFixed(3), "-t", String(s.T), "-i", MASTER, "-af", `apad=whole_dur=${s.T}`, "-t", String(s.T), "-ac", "2", "-ar", "48000", ga]);
    clips.push({ id: s.id, a: "K" + i, b: "K" + (i + 1), audio: au, gen_audio: ga, T: s.T, text: s.text,
      action: `Claudio, the man whose face is the third reference image, ${act}. ${E.light}.` + SAME });
    ov[s.id] = { mode: "trunc" };
  });
  const k0 = sc === "lav2" ? D + "lav/anc/K0.png" : R + "public/ref_furatones5.png";
  fs.writeFileSync(P + "plan.json", JSON.stringify({ dir: P, face: R + "public/ref_furatones5_face256.png", k0_from: k0, prev_box: "512x288", pronoun: "he", lang: "es",
    light, look: LOOK, anchors, clips, overrides: ov, out: P + "out.mp4" }, null, 1));
  nA += anchors.length; nC += clips.length;
  console.log(sc.padEnd(7), anchors.length, "anclas ·", clips.length, "clips");
}
console.log("TOTAL", nA, "anclas ·", nC, "clips ·", order.join(","), TOT.toFixed(2), "s");
