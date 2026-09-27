// tfbpiedra — un plan.json por parte de escena para scripts/agnes_vlog.mjs (anclas siempre; clips con audio si ya hay tramos.json)
// node vlog/tfbpiedra/mkplans.mjs  → plan_SETS.json (ronda 0: fotos base de los lugares) + plan_<parte>.json + plan_T.json
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { TXT } from "./txt.mjs";
import * as A from "./acts.mjs";
const R = "D:/Proyectos/video2-wt/tfbpiedra/", V = R + "vlog/tfbpiedra/";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const FACE = R + "public/ref_tfbpiedra_facebig.png";
const EXTRA = { V: R + "public/ref_vecino.png", VF: R + "public/ref_vecino_face.png", LAM: V + "lamina/lamina_hoja.jpg" };
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a friend with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the cluttered background stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, the side near the opening a little brighter and cooler, the far corners dimmer. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, small blemishes and uneven tone; hair with stray strands; clothes with real creases, dust and wear. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld home video filmed by a friend with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural hands; people move naturally and unposed, nothing staged; no music.";
const VOICE_V = "in Spanish with a neutral Latin American accent, the gruff, amused voice of a 65-year-old man; the man in the olive shirt does NOT speak";
const WHO_V = "the older neighbour with the thick grey moustache and the light-blue checked shirt (the third reference image is his face)";
const S_ = "Same place, same framing and same light: ";
const x = s => s.replace(/^S:\s*/, S_);
const CLOSE = " Same place, same light and same objects as the first image, but the camera is now VERY CLOSE: this detail fills the whole frame. Only hands, forearms and materials, no face in frame.";
const ROPA_CORTA = " He still wears the faded olive-green work shirt with rolled-up sleeves and the worn brown leather apron.";
const SET_IMG = { PATIO: V + "SETS/anc/K0.png", MEZCLA: V + "SETS/anc/K1.png", TALLER: V + "SETS/anc/K2.png" };
const base = (id, dir, k0_from) => ({ dir, face: FACE, k0_from, extra: EXTRA, lang: "es", pronoun: "he", light: LIGHT, look: LOOK, anchors: [], clips: [], out: dir + "/vlog_" + id + ".mp4" });
const save = (id, plan) => { fs.mkdirSync(plan.dir, { recursive: true }); fs.writeFileSync(V + "plan_" + id + ".json", JSON.stringify(plan, null, 1)); };

// tramos (si ya están): un wav por línea de voz, cortado del máster
let wavOf = null;
if (fs.existsSync(V + "tramos.json")) {
  const tr = JSON.parse(fs.readFileSync(V + "tramos.json", "utf8"));
  const voz = TXT.flatMap(s => s.lines.filter(l => !["w", "x"].includes(l[1])));
  if (voz.length !== tr.length) throw new Error(`voz ${voz.length} != tramos ${tr.length}`);
  fs.mkdirSync(V + "tramos", { recursive: true }); wavOf = {};
  voz.forEach((l, i) => { const o = V + "tramos/" + l[0] + ".wav";
    if (!fs.existsSync(o) || fs.statSync(o).mtimeMs < fs.statSync(V + "tramos.json").mtimeMs) ff("-ss", tr[i].s.toFixed(3), "-to", tr[i].e.toFixed(3), "-i", R + "out/tfbpiedra/master_c2.wav", "-ac", "1", "-ar", "44100", o);
    wavOf[l[0]] = o; });
}
const secsOf = t => Math.min(12, Math.max(4, Math.ceil(t.length / 13) + 1));

// ---- ronda 0: fotos base
{ const p = base("SETS", V + "SETS", R + "public/ref_tfbpiedra.png");
  p.anchors = [{ id: "K0", ...A.SETS.PATIO }, { id: "K1", ...A.SETS.MEZCLA }, { id: "K2", ...A.SETS.TALLER }];
  save("SETS", p); console.log("SETS anclas 3"); }

// ---- partes de escena
const LINES = Object.fromEntries(TXT.flatMap(s => s.lines.map(l => [l[0], l])));
const ORDER = TXT.flatMap(s => s.lines.map(l => l[0]));
const tot = { anc: 0, clips: 0, det: 0, w: 0 };
for (const [pid, part] of Object.entries(A.PARTS)) {
  const p = base(pid, V + pid, SET_IMG[part.set]); p.extra = { ...EXTRA, SET: SET_IMG[part.set] }; // la foto base entra como extra (caja 512): más detalle del lugar que la caja 256x144 de k0
  const glove = ["S3b", "S3c", "S4", "S6a", "S6b", "S7"].includes(pid) ? A.GUANTES : "";
  let n = 0, cur = "K0"; const next = () => "K" + (++n);
  p.anchors.push({ id: "K0", from: ["SET"], prompt: x(part.k0) });
  const ids = ORDER.slice(ORDER.indexOf(part.lines[0]), ORDER.indexOf(part.lines[1]) + 1);
  for (const id of ids) {
    const [, k, t] = LINES[id];
    if (k === "lam") continue;
    const a = A.ACTS[id]; if (!a) throw new Error("sin ACTS: " + id);
    if (k === "d") {
      const da = next(), db = next();
      p.anchors.push({ id: da, noface: true, from: [cur], prompt: a.da + CLOSE });
      p.anchors.push({ id: db, noface: true, from: [da], prompt: a.db + " Only hands, forearms and materials, no face in frame." });
      p.clips.push({ id, detail: true, a: da, b: db, audio: wavOf?.[id], text: t, action: a.a });
      tot.det++;
      if (a.e) { const ke = next(); p.anchors.push({ id: ke, from: [cur], prompt: x(a.e) + ROPA_CORTA + glove }); cur = ke; }
    } else if (k === "w") {
      const va = next(), vb = next();
      p.anchors.push({ id: va, noface: true, from: [cur, "V"], prompt: `Same place and same day as the first image, a new camera angle: a MEDIUM SHOT of the older neighbour from about one and a half metres, waist-up, his head and chest filling the upper half of the frame. ${a.va} He is ${A.VECINO}. The man in the olive shirt is out of frame.` });
      p.anchors.push({ id: vb, noface: true, from: [va, "VF"], prompt: a.vb + " Same man, same face as the second image." });
      p.clips.push({ id, solo: true, a: va, b: vb, secs: secsOf(t), line: t, who: WHO_V, voice: VOICE_V, refs: ["VF"], action: a.a });
      tot.w++;
    } else {
      const ke = next();
      p.anchors.push({ id: ke, from: [cur], prompt: x(a.e) + ROPA_CORTA + glove });
      p.clips.push({ id, a: cur, b: ke, audio: wavOf?.[id], text: t, action: a.a });
      cur = ke;
    }
  }
  if (pid === "S3c") { // la hoja real en su mano: la lámina como ref del ancla donde la muestra
    const k = p.anchors.find(q => q.prompt.includes("unfolded cream-coloured printed sheet"));
    if (k && fs.existsSync(EXTRA.LAM)) { k.from.push("LAM"); k.prompt += " The printed sheet he holds is exactly the second input image (the same printed page), seen as a real sheet of paper in his hands."; }
  }
  save(pid, p); tot.anc += p.anchors.length; tot.clips += p.clips.length;
  console.log(pid, "anclas", p.anchors.length, "clips", p.clips.length, wavOf ? "" : "(sin audio todavía)");
}

// ---- T: tráiler + receta (planos dedicados)
{ const p = base("T", V + "T", SET_IMG.PATIO); let n = 0; const next = () => "K" + (++n);
  const P = "SETP", M = "SETM"; p.extra = { ...EXTRA, SETP: SET_IMG.PATIO, SETM: SET_IMG.MEZCLA };
  // cadena de él en la losa a medio lavar (t_01, t_05, t_06, t_07, r_01)
  const H0 = "K0"; p.anchors.push({ id: H0, from: ["SETP"], prompt: `${S_}the same yard; in the middle stands ${A.ST.mitad}. He stands at the near edge of the slab holding the green garden hose with a spray gun in one hand, turned toward the camera, the other hand pointing down at the washed wet pebbles, amazed. ${A.ROPA}${A.GUANTES}` });
  let cur = H0;
  const HT = { t_01: ["He lifts the hose a little and points at the washed pebbles, talking to the camera, amazed.", "S: he stands at the near edge holding the hose, pointing at the wet pebbles with his other hand, looking at the camera, smiling."],
    t_05: ["He counts four steps on his fingers while talking.", "S: he stands at the near edge, the hose hanging from one hand, four fingers of the other hand raised, looking at the camera."],
    t_06: ["He lifts the hose's spray gun up beside his face, serious.", "S: he holds the spray gun up beside his face, serious, looking at the camera."],
    t_07: ["He steps toward the camera, lowering the hose, serious and a little conspiratorial.", "S: he is a step closer to the camera, the hose lowered, looking into the camera, serious."],
    r_01: ["He relaxes and talks to the camera with an open hand.", "S: he stands relaxed, one open hand toward the slab, looking at the camera."] };
  for (const [id, [act, e]] of Object.entries(HT)) { const ke = next(); p.anchors.push({ id: ke, from: [cur], prompt: x(e) + ROPA_CORTA + A.GUANTES }); p.clips.push({ id, a: cur, b: ke, audio: wavOf?.[id], text: LINES[id][2], action: act }); cur = ke; }
  // vecino del gancho
  { const va = next(), vb = next();
    p.anchors.push({ id: va, noface: true, from: [P, "V"], prompt: `Same yard and same day as the first image, a new camera angle: a MEDIUM SHOT of the older neighbour from about one and a half metres, waist-up, his head and chest filling the upper half of the frame, leaning his forearms on top of the low brick wall at the back of the yard, looking down toward the slab with an alarmed frown, one hand raised. The lemon tree and the tin roof behind him. He is ${A.VECINO}. The man in the olive shirt is out of frame.` });
    p.anchors.push({ id: vb, noface: true, from: [va, "VF"], prompt: "Same view: the neighbour leaning over the wall shakes his head, both hands raised, alarmed. Same man, same face as the second image." });
    p.clips.push({ id: "t_w1", solo: true, a: va, b: vb, secs: 5, line: LINES.t_w1[2], who: WHO_V, voice: VOICE_V, refs: ["VF"], action: "The neighbour leans over the wall, alarmed, and shakes his head, raising his hands." }); }
  // detalles dedicados (sin voz propia: suena la voz en off del máster o el foley)
  const D = [
    ["t_agua", P, `CLOSE VIEW, a little from above, of the concrete slab inside the wooden form, covered with smooth grey cement paste; a strong fan of water spray from a garden hose nozzle hits the left side, where the first coloured pebbles start to show.`, `Same view: a wide strip on the left washed clean, densely packed wet glistening ${A.PEBBLES}, the spray moving on over the remaining grey paste on the right.`, "The fan of water spray sweeps across the grey paste from left to right and the wet colourful pebbles appear under it, glistening, splashes flying.", 5],
    ["t_c1", M, `EXTREME CLOSE-UP of the edge of the wooden form: a shovel full of thick wet grey concrete with ${A.PEBBLES} tipping over the gravel.`, "Same close-up: the load has dropped into the form in a heap, pebbles rolling off its sides.", "The shovel tips and the heavy wet concrete full of pebbles drops into the form, pebbles rolling.", 4],
    ["t_c2", P, "EXTREME CLOSE-UP from above of fresh wet grey concrete in the form: the edge of a long straight wooden board resting on it, a ridge of wet concrete in front of it.", "Same close-up: the board has slid along, leaving a flat smooth grey surface behind it.", "The straight board slides across the wet concrete, leaving it flat and smooth.", 4],
    ["t_c3", P, "EXTREME CLOSE-UP of matte grey concrete paste: a soft-bristled brush in a yellow gloved hand resting on it, a thin shower of water falling.", `Same close-up: the brush has swept a patch clean, wet glistening ${A.PEBBLES} revealed.`, "The brush circles under the fine shower and the paste melts away, revealing the colourful pebbles.", 4],
    ["t_c4", P, "EXTREME CLOSE-UP of a yellow gloved fingertip touching a matte grey concrete surface with faint pebble shapes under it.", "Same close-up: the fingertip pressing, a faint shallow print around it, nothing sinking.", "The gloved finger presses into the setting concrete and lifts, leaving only a faint print.", 4],
    ["t_c5", M, `EXTREME CLOSE-UP of two cupped yellow gloved hands full of ${A.PEBBLES}, above the heap of pebbles.`, "Same close-up: the hands open slightly and the pebbles pour back down onto the heap, bouncing.", "The cupped hands open and the colourful pebbles pour down onto the heap, bouncing and clicking.", 4],
    ["t_c7", P, `EXTREME CLOSE-UP, low, at ground level, of a finished exposed-pebble concrete slab set flush in the ground (no wooden boards), its surface wet and glistening, densely packed ${A.PEBBLES}; a black rubber boot lifted just above it.`, "Same close-up: the boot planted flat on the wet pebbles, a little water squeezing out around the sole.", "The rubber boot steps down firmly on the wet pebble surface and grips.", 4],
    ["t_c8", P, `EXTREME CLOSE-UP of the finished slab of dry ${A.PEBBLES}, a thin sheet of water starting to flow over it from one side.`, "Same close-up: the water has spread across the pebbles, the colours deep and glistening.", "A thin sheet of water flows across the dry pebbles and their colours light up as it passes.", 4],
    ["t_c9", P, `Wide view of the same yard from the house side: in the middle is ${A.ST.listo}, wet after watering, glistening, the colours of the pebbles clearly visible; no wooden boards around it; nobody in the yard.`, `Same yard from a step closer and a little lower: ${A.ST.listo}, wet and glistening; nobody in the yard.`, "The camera moves slowly toward the finished glistening pebble slab.", 4],
    ["t_c10", P, "EXTREME CLOSE-UP of soft grey concrete paste with pebbles under it: a stiff brush in a yellow gloved hand pushing hard.", "Same close-up: a pebble has popped out and rolled away, leaving a round empty hole in the soft paste.", "The brush pushes too early: a pebble pops out of the soft paste and rolls away, leaving a hole.", 4],
    ["t_c11", P, "EXTREME CLOSE-UP looking DOWN at the flat horizontal top of the concrete slab lying on the ground inside the wooden form: a hard, dry, pale grey surface; a stiff brush in a yellow gloved hand scrubbing it flat on the ground.", "Same close-up: the brush still scrubbing, the surface still hard and grey, only a little dust, no pebbles showing.", "The brush scrubs hard on the dry grey surface but nothing comes off, only a little dust.", 4],
    // receta (voz del máster encima)
    ["r_02", P, "EXTREME CLOSE-UP inside the wooden form on bare earth: a plastic bucket tipping grey gravel into the form.", "Same close-up: the gravel spread flat and packed inside the form, the square foot of a hand tamper resting on it.", "Gravel pours into the form, is spread and packed flat by the tamper."],
    ["r_03", M, `EXTREME CLOSE-UP of the inside of the red wheelbarrow: sand, grey cement powder and ${A.PEBBLES}, a shovel blade under them.`, "Same close-up: the shovel has turned it over and it is now a thick wet grey concrete mix full of pebbles.", "The shovel turns the sand, cement and pebbles over while water is added, until it is a thick wet mix."],
    ["r_04", P, "EXTREME CLOSE-UP of fresh wet grey concrete in the form with pebbles sticking out, a wooden hand float just above it.", "Same close-up: the float pressed down, the pebbles now just under a thin grey film of paste.", "The wooden float presses the pebbles gently into the fresh concrete."],
    ["r_05", P, "EXTREME CLOSE-UP of the corner of a matte grey concrete slab, a soft brush in a yellow gloved hand at the corner.", "Same close-up: the brush has swept a small patch, the grey paste gone and the coloured pebbles firm and in place.", "The soft brush sweeps the corner, the paste comes off and the pebbles stay firm."],
    ["r_06", P, `View from above of the slab in the form: half grey paste, half washed wet ${A.PEBBLES}, a fine shower of water and a soft brush at the border between them.`, "Same view: the washed part has grown, the brush and shower moving on, grey water running off the edge.", "The fine shower and the soft brush move along and the washed colourful part grows."],
    ["r_07", P, `EXTREME CLOSE-UP of the washed wet ${A.PEBBLES} slab, a hose sprinkling water over it and the edge of a clear plastic sheet above it.`, "Same close-up: the clear plastic sheet lies on the wet pebbles, water drops under it, a brick on its edge.", "Water is sprinkled on the washed slab and a clear plastic sheet is laid over it."],
    ["r_08", P, `EXTREME CLOSE-UP of the dry finished slab of ${A.PEBBLES}, a paint roller with clear sealer resting on it.`, "Same close-up: the roller has passed, the pebbles behind it deeper in colour with a wet look.", "The roller passes a thin clear coat over the pebbles and their colours deepen."],
  ];
  for (const [id, from, da, db, act, secs] of D) {
    const ka = next(), kb = next();
    p.anchors.push({ id: ka, noface: true, from: [from], prompt: da + " Same yard, same day and same light as the first image. Only hands, forearms and materials, no face in frame." });
    p.anchors.push({ id: kb, noface: true, from: [ka], prompt: db + " Only hands, forearms and materials, no face in frame." });
    const c = { id, detail: true, a: ka, b: kb, text: LINES[id]?.[2] || "", action: act };
    if (id.startsWith("r_")) c.audio = wavOf?.[id]; else c.secs = secs;
    p.clips.push(c);
  }
  save("T", p); tot.anc += p.anchors.length; tot.clips += p.clips.length; console.log("T anclas", p.anchors.length, "clips", p.clips.length);
}
console.log("TOTAL", tot);
