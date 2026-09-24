// falaurel — tráiler del primer minuto: 10 planos de DETALLE (keyframe, 4 s) dedicados, desde las bases de cada escena
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/falaurel/", V = R + "vlog/falaurel/";
const BAY = "dried culinary bay leaves (Laurus nobilis: dry, matte olive-green, elongated oval leaves with slightly wavy edges, like the ones from a supermarket spice bag; only dry leaves, no flowers anywhere)";
const x = s => s.replace(/\{BAY\}/g, BAY);
const sil = V + "tramos/_sil36.wav";
if (!fs.existsSync(sil)) execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "3.6", sil]);
const NF = " No face in frame.";
const T = [
 ["t01", "S1", [], "EXTREME CLOSE-UP of his two HANDS ONLY right in front of the camera, holding one {BAY} by both ends, about to snap it, the kitchen softly visible behind." + NF, "Same close-up: the dry bay leaf snapped in two, tiny dry crumbs falling.", "Slow motion feel: his fingers snap the dry bay leaf in half right in front of the lens, tiny crumbs falling."],
 ["t02", "S1", [], "EXTREME CLOSE-UP of a glass jar with torn {BAY} at the bottom on the marble counter; a thin stream of pale golden oil starts pouring into it from a glass jug." + NF, "Same close-up: the golden oil covers the torn leaves, the leaves lifting and swirling in the oil.", "Slow motion feel: pale golden oil pours over the torn dry bay leaves in the jar, the leaves swirling."],
 ["t03", "S5", [], "EXTREME CLOSE-UP of a closed glass jar of clear golden oil with pale dried bay leaves inside, standing on the bright kitchen window sill, daylight shining through the oil." + NF, "Same close-up: the sunlight a touch brighter, the golden oil glowing, the leaves still.", "The golden jar glows in the window light, tiny reflections moving on the glass."],
 ["t04", "S5", [], "EXTREME CLOSE-UP of his fingers squeezing a white gauze bundle of pale soaked bay leaves above a small funnel in a dark amber glass bottle; golden oil dripping." + NF, "Same close-up: the last golden drops falling from the gauze into the funnel.", "Slow golden drops fall from the squeezed gauze into the amber bottle."],
 ["t05", "S3", [], "EXTREME CLOSE-UP of the inner side of his forearm resting palm-up on a blue checked tablecloth; one golden drop of oil hanging from a fingertip just above the skin." + NF, "Same close-up: the drop has touched the skin and spread into a small glossy circle.", "The golden drop falls onto the inner forearm and is spread in a tiny circle."],
 ["t06", "S4", [], "EXTREME CLOSE-UP of the right side of his face in the bright bathroom: two oily fingertips resting at the corner of his mouth, short beard stubble and pores visible. Only the lower cheek and fingers.", "Same extreme close-up: the fingertips have glided up the cheek to the upper cheekbone near the ear, well below and away from the eye.", "The fingertips glide slowly upward from the corner of the mouth to the temple."],
 ["t07", "S6", ["W"], "The white front door in the hall of the same house, seen from inside, opening: the elderly woman (the second input image: short grey hair, navy-blue cardigan over a white blouse with small printed flowers, 73 years old) stands outside in daylight smiling, holding her handbag.", "Same view: she has stepped inside the hall, waving at the camera with a big warm smile.", "The front door opens and the smiling elderly woman steps into the hall, waving."],
 ["t08", "S13", ["COVER"], "EXTREME CLOSE-UP of the coffee table: the printed guide book whose cover is exactly the second input image lying face up, next to the small dark amber dropper bottle and a small glass jar of {BAY}, soft daylight. No people.", "Same close-up, the camera slightly closer to the guide cover, daylight a touch brighter.", "Slow gentle push toward the guide book on the table, the amber bottle beside it."],
 ["t09", "S7", [], "EXTREME CLOSE-UP of his HANDS ONLY in bright patio sunlight: a line of white sunscreen squeezed along two fingers above the back of the other hand." + NF, "Same close-up: the sunscreen spread over the back of the hand.", "The fingers spread the white sunscreen over the back of the hand in the sun."],
 ["t10", "S2", [], "EXTREME CLOSE-UP looking into the small steel pot on the gas burner: a glass jar of pale golden oil with {BAY} in shallow water, tiny bubbles on the bottom, a small blue flame." + NF, "Same close-up: tiny bubbles rising along the jar, faint wisps of steam.", "Tiny bubbles rise around the jar in the barely simmering water, faint steam."],
];
const anchors = [], clips = []; let n = 0;
for (const [id, S, ex, da, db, a] of T) {
  const A = "K" + (++n), Bk = "K" + (++n);
  const nf = !["t06","t07"].includes(id);
  anchors.push({ id: A, noface: nf, from: [V + S + "/anc/K0.png", ...ex], prompt: x(da) + " Same place, same light and same objects as the first image, but the camera is now VERY CLOSE: this detail fills the whole frame." });
  anchors.push({ id: Bk, noface: nf, from: [A], prompt: x(db) });
  clips.push({ id, a: A, b: Bk, kf: true, audio: sil, text: "", action: x(a) });
}
const plan = { dir: V + "T", face: R + "public/ref_falaurel_facecrop.png", face_gpt: R + "public/ref_falaurel_face.png", k0_from: null, extra: { W: V + "refs/W_elena.png", COVER: R + "public/img/falaurel/portada_piel.jpg" }, lang: "es", anchors, clips, out: V + "T/vlog_T.mp4" };
fs.mkdirSync(V + "T", { recursive: true }); fs.writeFileSync(V + "plan_T.json", JSON.stringify(plan, null, 1)); console.log("T anclas", anchors.length);
