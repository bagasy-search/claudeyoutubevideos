// tfbpiso — un plan.json por escena para scripts/agnes_vlog.mjs (+ BASE = el patio, + T = detalles del tráiler).
// Anclas siempre; audio de los clips si ya existe tramos.json. Uso: node vlog/tfbpiso/mkplans.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { TXT } from "./txt.mjs";
import { SETS, ACTS } from "./acts.mjs";
const R = "D:/Proyectos/video2-wt/tfbpiso/", V = R + "vlog/tfbpiso/";
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a]);
const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a friend with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the cluttered background stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, the side near the opening a little brighter and cooler, the far corners dimmer. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores, small blemishes and uneven tone; hair with stray strands; clothes with real creases, dust and wear. People are caught mid-action, unposed.";
const LOOK = "Ordinary handheld home video filmed by a friend with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural hands; people move naturally and unposed, nothing staged; no music.";
const TOK = {
  PATIO: "The back patio of a modest working-class house in a Latin American town, about five by six metres, open to the sky: whitewashed brick walls with grey damp marks at the base, a concrete laundry sink with a brass tap against the back wall, a clothesline with two faded towels, terracotta pots with red geraniums and a small lemon tree along the right wall, a green-painted metal gate to the side passage on the left, and at the far end a small roofed porch with red floor tiles, a wooden table and two plastic chairs beside the back door of the house.",
  OLD: "The whole floor is old grey cement, worn and stained, with a web of cracks, a few broken loose patches with crumbling edges and a film of grey dust.",
  HALF: "The LEFT half of the floor has been redone: new light-grey cement with fine straight parallel broom grooves, divided by straight joint lines into roughly square panels; the RIGHT half is still the old grey cement, worn, stained and cracked; the border between them runs diagonally across the patio.",
  TOOLS: "Against the right wall: two paper bags of grey cement, a pile of sand on a blue plastic sheet, a metal wheelbarrow, two black plastic buckets, a long aluminium straightedge, a wooden float and a stiff plastic-bristled patio broom with a wooden handle.",
  WHO: "The man is the person of the last input image (a close-up of his real face): EXACTLY that face, same dark curly black hair, same short salt-and-pepper beard, about 50 years old. He wears a faded olive-green work shirt with the sleeves rolled up to the elbows, stained with paint and cement dust, a worn brown leather apron over it, dark work trousers and black rubber boots.",
  GLOVES: "He wears grey rubber work gloves.",
  VEC: "the neighbour, who is exactly the man of the second input image: about 65, heavy-set, bald on top with grey hair on the sides, a thick grey moustache, a faded light-blue checked short-sleeve shirt with a pen in the breast pocket, reading glasses hanging on a cord around his neck, grey trousers and old brown leather shoes",
};
const x = s => s.replace(/\{(\w+)\}/g, (_, k) => { if (!(k in TOK)) throw new Error("token " + k); return TOK[k]; }).replace(/^S:\s*/, "Same place, same framing and same light: ");
const FACE = R + "public/ref_tfbpiso_facebig.png", VFACE = R + "public/ref_vecino_face.png";
const BASEK0 = V + "BASE/anc/K0.png";
// recordatorio de vestuario + luz en CADA ancla del presentador (sin esto, tras volver de un detalle, pierde el delantal
// y la cadena se oscurece: medido en S2/S9 v1)
let SCENE = "";
const WARDF = () => WARD + (FLOOR[SCENE] ? " " + FLOOR[SCENE] : "") + " The camera stays at about the same distance and height as in the first input image: a casual medium shot, the patio around him, not a posed frontal portrait.";
const WARD = " He still wears exactly the same clothes as in the first input image: the worn brown leather apron over the faded olive-green work shirt with rolled-up sleeves, dark work trousers and black rubber boots. Same soft bright overcast daylight as the first input image, the patio well lit.";
const FLOOR = {
  S2: "The LEFT half of the floor is where he works; the rest of the patio floor is the old cracked grey cement.",
  S3: "The floor: the LEFT half is new light-grey cement with fine broom grooves and straight joint lines, the RIGHT half is still old, stained and cracked, the border running diagonally.",
  S3B: "The floor: the LEFT half is new light-grey grooved cement, the RIGHT half is still old and cracked.",
  S4: "The floor: the LEFT half is new light-grey grooved cement, the RIGHT half, where he kneels, is old, stained and cracked with white chalk circles.",
  S6: "The floor: the LEFT half is new light-grey grooved cement, the RIGHT half, where he works, is the old cement being prepared.",
  S7: "The floor: the LEFT half is new light-grey grooved cement, the RIGHT half is the old cement, dark and wet.",
  S8: "The floor: the LEFT half is new light-grey grooved cement, the RIGHT half is where the fresh mortar goes between the battens.",
  S9: "The floor: the LEFT half is new light-grey grooved cement, the RIGHT half is the fresh grey cement being finished.",
  S10: "The floor: the LEFT half is the finished grooved cement, the RIGHT half is covered by the clear plastic sheet held by bricks.",
};
const common = d => ({ dir: V + d, face: FACE, extra: { V: VFACE }, lang: "es", light: LIGHT, look: LOOK });
const VOICE = "in Spanish with a neutral Latin American accent, the gruff, amused voice of a 65-year-old man; the man in the foreground does NOT speak, he only listens";
const secsOf = t => Math.min(12, Math.max(4, Math.ceil(t.length / 13) + 1));
// tramos (si ya están)
let wavOf = null;
if (fs.existsSync(V + "tramos.json")) {
  const tr = JSON.parse(fs.readFileSync(V + "tramos.json", "utf8"));
  const voz = TXT.flatMap(s => s.lines.filter(l => !["w", "k"].includes(l[1])));
  if (voz.length !== tr.length) throw new Error(`voz ${voz.length} != tramos ${tr.length}`);
  fs.mkdirSync(V + "tramos", { recursive: true }); wavOf = {};
  voz.forEach((l, i) => { const o = V + "tramos/" + l[0] + ".wav";
    if (!fs.existsSync(o)) ff("-ss", tr[i].s.toFixed(3), "-to", tr[i].e.toFixed(3), "-i", R + "out/tfbpiso/master.wav", "-ac", "1", "-ar", "44100", o);
    wavOf[l[0]] = o; });
}
const write = (id, plan) => { fs.mkdirSync(plan.dir, { recursive: true }); fs.writeFileSync(V + "plan_" + id + ".json", JSON.stringify(plan, null, 1)); };
// ---- BASE: el patio (una sola ancla) — de acá salen los K0 de todas las escenas (mismo lugar en todo el video)
write("BASE", { ...common("BASE"), anchors: [{ id: "K0", from: [], prompt: "Create a new photo. " + x("{PATIO} {OLD} {TOOLS} {WHO} He stands near the laundry sink holding a stiff patio broom upright, half-turned toward the friend who films, mid-sentence. Wide shot at eye level from about four metres, the whole patio and the porch visible. Soft bright daylight of a high overcast sky over the whole patio.") }], clips: [], out: V + "BASE/x.mp4" });
const tot = { anc: 0, clips: 0, det: 0, w: 0 };
for (const s of TXT) {
  const set = SETS[s.id], dir = V + s.id, anchors = [], clips = []; SCENE = s.id;
  anchors.push({ id: "K0", from: [BASEK0], prompt: "Same patio as the first input image (same walls, laundry sink, gate, plants and porch), a new moment and a new camera position: " + x(set.k0) });
  let n = 0, cur = "K0"; const next = () => "K" + (++n);
  for (const [id, k, t] of s.lines) {
    if (k === "v" || k === "lam") continue;
    const A = ACTS[id]; if (!A) throw new Error("sin ACTS: " + id);
    if (k === "w") {
      const wa = next(), wb = next();
      anchors.push({ id: wa, noface: true, from: [cur, "V"], prompt: "Same place and same light as the first input image. " + x(A.wa) + " The neighbour's face is exactly the face of the second input image." });
      anchors.push({ id: wb, noface: true, from: [wa, "V"], prompt: x(A.wb) + " Same place, same framing, same light, same two men. The neighbour's face is exactly the face of the second input image." });
      clips.push({ id, a: wa, b: wb, line: t, secs: secsOf(t), refs: ["V"], who: "the neighbour standing in front of the camera (the fourth reference image is his face)", voice: VOICE, action: x(A.a) });
      tot.w++; continue;
    }
    if (k === "d" || k === "k") {
      const da = next(), db = next();
      anchors.push({ id: da, noface: true, from: [cur], prompt: x(A.da) + " Same place, same light and same materials as the first input image, but the camera is now VERY CLOSE: this detail fills the whole frame. No face in frame." });
      anchors.push({ id: db, noface: true, from: [da], prompt: x(A.db) + " Same close-up framing and light as the input image. No face in frame." });
      const c = { id, a: da, b: db, detail: true, action: x(A.a) };
      if (k === "d") c.audio = wavOf?.[id]; else c.secs = 5;
      clips.push(c); tot.det++;
      if (A.e) { const ke = next(); anchors.push({ id: ke, from: [cur], prompt: "Back to the normal camera distance of the first input image. " + x(A.e) + WARDF() }); cur = ke; }
      continue;
    }
    const ke = next();
    anchors.push({ id: ke, from: [cur], prompt: x(A.e) + WARDF() });
    clips.push({ id, a: cur, b: ke, text: t, audio: wavOf?.[id], action: x(A.a) });
    cur = ke;
  }
  write(s.id, { ...common(s.id), anchors, clips, out: dir + "/vlog_" + s.id + ".mp4" });
  tot.anc += anchors.length; tot.clips += clips.length;
  console.log(s.id, "anclas", anchors.length, "clips", clips.length, wavOf ? "" : "(sin audio todavía)");
}
// ---- T: detalles del tráiler (keyframe, sin cara salvo el vecino), desde el K0 de la escena donde pasa
const T = [
 ["t01", "S2", [], "EXTREME CLOSE-UP at floor level: the wet stiff plastic bristles of a patio broom resting on fresh smooth grey cement; right beside it, past a straight edge, the old cracked, stained grey cement of the rest of the patio.", "Same close-up: the broom has been pulled across the fresh cement leaving fine straight parallel grooves, the old cracked cement still beside it.", "The wet bristles of the patio broom are pulled slowly across the fresh cement in one pass, drawing fine straight grooves right next to the old cracked floor, the scratch of the bristles."],
 ["t02", "S9", [], "Low view close to the floor looking along the patio: in the foreground fresh matte grey cement, the bristles of a patio broom entering from the right edge; further back the finished grooved half of the floor and the whitewashed wall.", "Same low view: fine parallel broom grooves now cover the fresh cement in the foreground, the broom at the left edge.", "The patio broom sweeps across the fresh cement right in front of the low camera, leaving even grooves."],
 ["t03", "S6", [], "EXTREME CLOSE-UP of a cold chisel held by a gloved hand at an angle on the crumbling edge of a loose patch of old grey cement, a club hammer about to strike.", "Same close-up: grey chips and dust flying, a chunk of old cement breaking off.", "The hammer strikes the chisel hard, grey chips and dust burst off the loose old cement."],
 ["t04", "S6", [], "EXTREME CLOSE-UP of dry light-grey old cement with a crack; a fine spray of water from a garden hose just starting to hit it.", "Same close-up: the cement is dark and soaked, water running into the crack.", "Water spray sweeps over the dry old cement, darkening it as it soaks in."],
 ["t05", "S8", [], "EXTREME CLOSE-UP of the damp dark old floor; a stiff brush loaded with thick grey slurry pressing onto it.", "Same close-up: grey slurry scrubbed into the floor, brush marks, the brush lifting away.", "The stiff brush scrubs thick grey slurry into the damp old cement with hard short strokes."],
 ["t06", "S8", [], "EXTREME CLOSE-UP of the lip of a tipped metal wheelbarrow full of damp grey mortar above fresh slurry on the floor.", "Same close-up: the mortar has slid out in a heap onto the slurry, a shovel blade pushing it.", "Damp grey mortar slides out of the tipped wheelbarrow and lands heavily on the fresh slurry."],
 ["t07", "S8", [], "EXTREME CLOSE-UP of a long aluminium straightedge resting across two wooden battens on a heap of grey mortar, gloved hands on it.", "Same close-up: behind the straightedge the mortar is flat and level with the battens, a roll of excess in front.", "The straightedge saws side to side across the battens and drags the mortar flat."],
 ["t08", "S9", [], "EXTREME CLOSE-UP of a wooden float laid flat on fresh rough grey mortar, a gloved hand on its handle.", "Same close-up: the mortar around the float is smooth and matte.", "The wooden float moves in slow flat circles and the rough mortar closes into a smooth even surface."],
 ["t09", "S9", [], "EXTREME CLOSE-UP of a gloved fingertip just above fresh matte grey cement.", "Same close-up: the fingertip lifted, a small shallow fingerprint left in the cement.", "The fingertip presses lightly into the matte cement and lifts, leaving a shallow print."],
 ["t10", "S9", [], "EXTREME CLOSE-UP of fresh broom-grooved grey cement with an aluminium straightedge across it and a small steel jointing tool set against it.", "Same close-up: a clean deep straight joint groove along the straightedge.", "The jointing tool is pushed along the straightedge cutting a clean straight joint into the fresh cement."],
 ["t11", "S10", [], "EXTREME CLOSE-UP of fresh grooved grey cement with the edge of a large clear plastic sheet being pulled over it by a hand.", "Same close-up: the plastic sheet lies over the cement, fine water droplets under it, a brick on its corner.", "The clear plastic sheet is pulled over the fresh cement and settles, droplets forming under it."],
 ["t12", "S11", [], "Close view at floor level of the finished grooved light-grey cement floor, dry and clean; the rim of a bucket tipping at the top edge.", "Same view: a wave of water spreads over the floor, running along the fine grooves.", "Water pours from the bucket and spreads over the finished floor, running along the fine broom grooves."],
 ["t13", "S1", ["V"], "Close view of {VEC} standing at the open green metal gate of the patio, arms crossed, looking down at the floor with a sceptical frown, mouth closed. The neighbour's face is exactly the face of the second input image.", "Same view: the neighbour shakes his head slowly, lips pressed together, eyebrows raised, still with his arms crossed.", "The neighbour at the gate, arms crossed, slowly shakes his head in silent disbelief, mouth closed."],
 ["t14", "S4", [], "EXTREME CLOSE-UP of the old cracked grey cement floor; a claw hammer head held low just above it.", "Same close-up: the hammer tapping further along, a white chalk circle drawn around a loose patch.", "The hammer taps the old floor spot by spot, then a hand circles a loose patch with white chalk."],
 ["t15", "S7", [], "EXTREME CLOSE-UP of an open paper bag of grey cement tilted over a metal wheelbarrow with sand in it, gloved hands holding the bag.", "Same close-up: grey cement powder pouring onto the sand, a soft puff of cement dust in the air.", "Grey cement powder pours from the bag onto the sand in the wheelbarrow, a soft cloud of dust rising."],
];
const ta = [], tc = []; let n = 0;
for (const [id, S, ex, da, db, a] of T) {
  const A = "K" + (++n), Bk = "K" + (++n), vv = ex.includes("V");
  ta.push({ id: A, noface: true, from: [V + S + "/anc/K0.png", ...ex], prompt: x(da) + " Same place, same light and same materials as the first input image, but the camera is now VERY CLOSE: this detail fills the whole frame." + (vv ? "" : " No face in frame.") });
  ta.push({ id: Bk, noface: true, from: [A, ...ex], prompt: x(db) + " Same framing and light as the first input image." + (vv ? " The neighbour's face is exactly the face of the second input image." : " No face in frame.") });
  tc.push({ id, a: A, b: Bk, detail: true, secs: 4, action: x(a) });
}
write("T", { ...common("T"), anchors: ta, clips: tc, out: V + "T/vlog_T.mp4" });
tot.anc += ta.length + 1; tot.clips += tc.length; tot.det += tc.length;
console.log("TOTAL", tot, "≈ $" + (tot.anc * 0.0035).toFixed(2), "de anclas");
