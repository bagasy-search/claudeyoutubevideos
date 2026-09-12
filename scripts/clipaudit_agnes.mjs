// clipaudit_agnes.mjs — AUDITOR DE CLIPS con la visión GRATIS de agnes (`agnes-2.5-flash`).
// DOS PASES por clip:
//   A) FRAME  — cada frame contra la referencia: identidad, manos, anatomía, objetos, texto quemado.
//   B) MOVIMIENTO — dos frames del MISMO plano, juntos: ¿algo cambió de forma imposible entre uno y
//      otro? Es el único que caza los defectos que NO existen en un frame suelto (un objeto pesado
//      que se levanta solo, algo que teletransporta, una mano que se funde y se despega).
//
//   node scripts/clipaudit_agnes.mjs <ref.png> <out.json> <clip1.mp4> [clip2.mp4 ...]
//   FRAMES=4 CONC=6 node scripts/clipaudit_agnes.mjs ...
//
// ⛔ NO le agregues un chequeo de TEXTO QUEMADO a este auditor. Medido 25-ago-2026 sobre 50 clips:
// marcó 14 con "texto legible inventado", y al pedirle que TRANSCRIBIERA lo que leía
// (`scripts/textquote_agnes.mjs`) devolvió **0 de 14** con una sola palabra legible. Eran etiquetas
// borrosas de frascos y electrodomésticos. Ese criterio no aporta señal en i2v: sólo manda a
// regenerar clips sanos. (En IMÁGENES fijas sí sirve: ahí el texto sale grande y legible.)
//
// Umbrales a propósito FLOJOS: esto marca ROTURA, no imperfección. Un clip con una mano un poco
// rara a los 4 s se usa igual — se corta en 1,2 s y no se ve.
//
// ⚠️ Dos falsos positivos que ya costaron re-generaciones y están corregidos en los prompts:
//   · plano de MANOS sin cara -> el modelo puntuaba identidad 0-6 "porque no se ve la cara".
//     Ahora: si no hay cara, identity = null y no cuenta.
//   · etiquetas BORROSAS de fondo -> las marcaba como "texto inventado". Ahora solo cuenta el
//     texto/logo LEGIBLE (que es el que de verdad arruina un plano).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [REF, OUTJSON, ...CLIPS] = process.argv.slice(2);
if (!REF || !OUTJSON || !CLIPS.length) {
  console.error("uso: node scripts/clipaudit_agnes.mjs <ref.png> <out.json> <clips...>");
  process.exit(1);
}
const env = {};
for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const KS = (env.AGNES_KEYS || env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
const URL_ = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const MODEL = process.env.AGNES_VISION_MODEL || "agnes-2.5-flash";
const NFR = Number(process.env.FRAMES || 4);
const CONC = Number(process.env.CONC || 6);
const TMP = process.env.CLIPAUDIT_TMP || "_v3/_clipaudit";
fs.mkdirSync(TMP, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uri = (f) => `data:${/\.png$/i.test(f) ? "image/png" : "image/jpeg"};base64,${fs.readFileSync(f).toString("base64")}`;

const P_FRAME = `Image 1 is a REFERENCE photo of a person. Image 2 is one frame from a short video clip.
Judge image 2 as footage, and compare only the PERSON against image 1.
Reply ONLY JSON:
{"face_visible":true|false,"identity":0-10|null,"hands":0-10,"anatomy":0-10,"objects":0-10,"skin_texture":0-10,"broken":true|false,"why":"<short>"}
face_visible = you can actually see enough of his face to judge who he is.
identity = ONLY if face_visible is true (10 = clearly the same man, same face, hairline, grey beard, age). If the face is not visible (close-up of hands, back turned, head out of frame) set identity to null. Never guess identity from clothing.
hands 10 = normal hands, right number of fingers, holding things plausibly; 0 = melted, fused, extra or missing fingers.
anatomy 10 = normal body; 0 = duplicated or impossible limbs, twisted torso, floating parts.
objects 10 = objects look solid and consistent; 0 = an object melts, bends impossibly, or merges with his hands.
skin_texture 10 = real unretouched skin with pores; 0 = plastic or CGI.
broken = the frame is corrupted, smeared, or the subject is an unrecognisable mess.`;

const P_MOTION = `These two images are frames from the SAME continuous shot, about one and a half seconds apart. Image 1 is earlier, image 2 is later. There is no cut between them.
Ask yourself whether the change between them is physically possible in that time, for a real person filmed in one take.
Reply ONLY JSON:
{"impossible_change":true|false,"severity":0-10,"what":"<short: what changed impossibly, or 'nothing'>"}
impossible_change = true if something teleports, appears or vanishes, an object changes shape or size, a heavy object moves in a way a person could not move it, a hand changes its number of fingers, the person's body or face changes structure, or the room itself changes.
severity 10 = ruins the shot, 0 = nothing wrong.
Normal and NOT a problem: the person moving, blinking, turning, liquid pouring or foaming, cloth bending, light flicker, motion blur, small camera noise.`;

const frames = (clip) => {
  const base = path.basename(clip, ".mp4");
  let dur = 5;
  try {
    dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", clip], { encoding: "utf8" }).trim()) || 5;
  } catch { /* default */ }
  const out = [];
  for (let i = 0; i < NFR; i++) {
    const t = +(dur * (0.12 + (0.86 * i) / Math.max(1, NFR - 1))).toFixed(2);
    const f = path.join(TMP, `${base}_t${i}.jpg`);
    if (!fs.existsSync(f)) {
      try { execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", String(t), "-i", clip, "-frames:v", "1", "-vf", "scale=640:-2", f], { stdio: "ignore" }); }
      catch { continue; }
    }
    if (fs.existsSync(f)) out.push({ t, f });
  }
  return out;
};

const free = KS.map(() => 0);
const pickKey = async () => {
  for (;;) {
    const now = Date.now();
    let best = -1, bestT = Infinity;
    for (let i = 0; i < KS.length; i++) if (free[i] < bestT) { bestT = free[i]; best = i; }
    if (bestT <= now) return best;
    await sleep(Math.min(1500, bestT - now));
  }
};

const ask = async (prompt, imgs) => {
  for (let a = 0; a < 12; a++) {
    const ki = await pickKey();
    try {
      const r = await fetch(URL_, {
        method: "POST",
        headers: { Authorization: "Bearer " + KS[ki], "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, temperature: 0, messages: [{ role: "user", content: [
          { type: "text", text: prompt },
          ...imgs.map((f) => ({ type: "image_url", image_url: { url: uri(f) } }))] }] }),
      });
      if (r.status === 429) { free[ki] = Date.now() + 20_000; continue; }
      if (!r.ok) { await sleep(1200 * (a + 1)); continue; }
      const d = await r.json();
      const m = (d.choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
    } catch { await sleep(1200); }
  }
  return null;
};

const results = [];
const cola = [...CLIPS];
let done = 0;
const worker = async () => {
  for (;;) {
    const clip = cola.shift();
    if (!clip) return;
    const name = path.basename(clip, ".mp4");
    const fr = frames(clip);
    const vs = [];
    for (const { t, f } of fr) {
      const v = await ask(P_FRAME, [REF, f]);
      if (v) vs.push({ t, ...v });
    }
    // pase B: movimiento entre dos frames separados del MISMO plano
    let motion = null;
    if (fr.length >= 3) motion = await ask(P_MOTION, [fr[1].f, fr[fr.length - 1].f]);

    if (!vs.length) { results.push({ name, verdict: "unknown", frames: [] }); done++; continue; }
    const mins = (k) => {
      const nums = vs.map((v) => v[k]).filter((x) => typeof x === "number");
      return nums.length ? Math.min(...nums) : null;
    };
    const worst = {
      identity: mins("identity"),                 // null = nunca se le vio la cara: no se juzga
      hands: mins("hands"), anatomy: mins("anatomy"), objects: mins("objects"),
      skin_texture: mins("skin_texture"),
      broken: vs.some((v) => v.broken),
      impossible_change: !!motion?.impossible_change,
      motion_severity: motion?.severity ?? 0,
      motion_what: motion?.what || "",
    };
    const reasons = [];
    if (worst.broken) reasons.push("frame roto");
    if (worst.identity !== null && worst.identity < 6) reasons.push(`identidad ${worst.identity}`);
    if (worst.hands !== null && worst.hands < 5) reasons.push(`manos ${worst.hands}`);
    if (worst.anatomy !== null && worst.anatomy < 5) reasons.push(`anatomía ${worst.anatomy}`);
    if (worst.objects !== null && worst.objects < 5) reasons.push(`objetos ${worst.objects}`);
    if (worst.impossible_change && worst.motion_severity >= 8) reasons.push(`movimiento imposible (${worst.motion_severity})`);
    const peor = vs.slice().sort((a, b) =>
      ((a.hands ?? 10) + (a.anatomy ?? 10) + (a.objects ?? 10)) - ((b.hands ?? 10) + (b.anatomy ?? 10) + (b.objects ?? 10)))[0];
    results.push({ name, verdict: reasons.length ? "redo" : "ok", worst, reasons,
      why: peor?.why || "", motion_what: worst.motion_what, frames: vs });
    done++;
    if (done % 5 === 0) console.log(`  ${done}/${CLIPS.length}`);
  }
};
await Promise.all(Array.from({ length: Math.min(CONC, 8) }, worker));

results.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(OUTJSON, JSON.stringify(results, null, 1));
const redo = results.filter((r) => r.verdict === "redo");
console.log(`\n=== ${results.length} clips · ok ${results.filter((r) => r.verdict === "ok").length} · REDO ${redo.length} · sin veredicto ${results.filter((r) => r.verdict === "unknown").length}`);
for (const r of redo) {
  console.log(`  ⚠ ${r.name}  [${r.reasons.join(", ")}]`);
  if (r.worst.impossible_change) console.log(`      movimiento: ${String(r.motion_what).slice(0, 120)}`);
}
