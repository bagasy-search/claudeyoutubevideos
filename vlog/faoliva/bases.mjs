// K0 de los sets NUEVOS desde el recorte de cara + cara de Rosa (una vez). gpt-image-2 LOW.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { SCENES } from "./guion_src.mjs";
const R = "D:/Proyectos/video2-wt/faoliva/", V = R + "vlog/faoliva/";
const env = Object.fromEntries(fs.readFileSync(R + ".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const LIGHT = " BRIGHT, correctly exposed photo, big soft DAYLIGHT from a window, white balance NEUTRAL, no amber cast, no grading, no vignette, no film grain, no dark moody look, lifted shadows; brightness from the room lighting, not post-production — do not raise saturation, no glow, no HDR. An ordinary photo, not a film still. Real skin with visible pores, fine lines and natural texture, not smooth, not plastic, not retouched.";
const NIGHT = " It is night but the room is BRIGHT: the ceiling light and the lamps are ON and light the whole room evenly, correctly exposed, white balance NEUTRAL, no amber cast, no dark moody look, lifted shadows, nothing hidden in shadow. An ordinary photo, not a film still. Real skin with visible pores, fine lines and natural texture, not smooth, not plastic.";
const WHO = " The man is the doctor in the input image (a close-up of his real face): EXACTLY that face — same face shape, eyes, nose, eyebrows, short dark curly hair, short dark beard with some grey, same age (about 40) — do not make him younger or more handsome. He wears blue medical scrubs with short sleeves, a black stethoscope around his neck and a black smartwatch on his left wrist. A casual home video frame, ordinary, candid.";
const FACE = R + "public/ref_faoliva_facecrop.png";
let usage = [];
async function call(url, body, isForm) {
  for (let t = 0; t < 40; t++) {
    const j = await (await fetch(url, { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, ...(isForm ? {} : { "Content-Type": "application/json" }) }, body: isForm ? body() : JSON.stringify(body) })).json().catch(() => ({}));
    if (j?.data?.[0]?.b64_json) { usage.push(j.usage); return { b: j.data[0].b64_json, u: j.usage }; }
    const rl = /rate limit/i.test(JSON.stringify(j));
    console.log(rl ? "rate-limit" : "retry", JSON.stringify(j).slice(0, 200)); await new Promise(r => setTimeout(r, rl ? 25000 : 15000));
    if (!rl && t > 4) break;
  }
  throw new Error("falló");
}
const jobs = [];
const W = V + "W_rosa.png";
if (!fs.existsSync(W)) jobs.push(call("https://api.openai.com/v1/images/generations", { model: "gpt-image-2", quality: "low", size: "1024x1536",
  prompt: "Very realistic ordinary photo. Portrait from the waist up of a 72-year-old Latin American grandmother standing in a bright living room: short wavy silver-grey hair, warm brown eyes behind thin gold-rimmed glasses, natural deep wrinkles on the forehead and around the eyes and mouth, a few age spots on her cheeks, small pearl earrings, a soft coral knitted cardigan over a white blouse, a friendly lively expression mid-sentence, a mischievous smile. Real elderly woman of 72, not a model, not younger." + LIGHT }).then(r => { fs.writeFileSync(W, Buffer.from(r.b, "base64")); console.log("OK W", JSON.stringify(r.u)); }));
const GEN = ["S2", "S3", "S5", "S6", "S8", "S11"];
for (const s of SCENES.filter(s => GEN.includes(s.id))) {
  const out = V + s.id + "/anc/K0.png"; fs.mkdirSync(V + s.id + "/anc", { recursive: true });
  if (fs.existsSync(out)) continue;
  const L = s.id === "S2" ? NIGHT : LIGHT;
  jobs.push(call("https://api.openai.com/v1/images/edits", () => { const fd = new FormData(); fd.append("model", "gpt-image-2"); fd.append("quality", "low"); fd.append("size", "1536x1024");
    fd.append("prompt", "Create a new photo: " + s.k0 + WHO + L); fd.append("image[]", new Blob([fs.readFileSync(FACE)], { type: "image/png" }), "face.png"); return fd; }, true)
    .then(r => { const raw = out.replace(".png", "_raw.png"); fs.writeFileSync(raw, Buffer.from(r.b, "base64")); execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "crop=1536:864:0:24", out]); console.log("OK", s.id, JSON.stringify(r.u)); }));
}
await Promise.all(jobs);
fs.appendFileSync(V + "usage_gptimage.jsonl", usage.map(u => JSON.stringify({ src: "bases", u })).join("\n") + "\n");
