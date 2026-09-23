// K0 de los sets NUEVOS (patio, baño, living) desde el recorte de cara + cara de Carmen (una vez)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { SCENES } from "./guion_src.mjs";
const R = "D:/Proyectos/video2-wt/faperejil/", V = R + "vlog/faperejil/";
const env = Object.fromEntries(fs.readFileSync(R + ".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const LIGHT = " BRIGHT, correctly exposed photo, big soft DAYLIGHT from a window, white balance NEUTRAL, no amber cast, no grading, no vignette, no film grain, no dark moody look, lifted shadows; brightness from the room lighting, not post-production — do not raise saturation, no glow, no HDR. An ordinary photo, not a film still. Real skin with visible pores, fine lines and natural texture, not smooth, not plastic, not retouched.";
const WHO = " The man is the doctor in the input image (a close-up of his real face): EXACTLY that face — same face shape, eyes, nose, eyebrows, short dark curly hair, short dark beard, same age (about 40) — do not make him younger or more handsome. He wears blue medical scrubs with the short sleeves, a black stethoscope around his neck and a black smartwatch on his left wrist. A casual home video frame, ordinary, candid.";
const FACE = R + "public/ref_faperejil_facecrop.png";
async function call(url, body, isForm) {
  for (let t = 0; t < 4; t++) {
    const j = await (await fetch(url, { method: "POST", headers: { Authorization: "Bearer " + env.OPENAI_API_KEY, ...(isForm ? {} : { "Content-Type": "application/json" }) }, body: isForm ? body() : JSON.stringify(body) })).json().catch(() => ({}));
    if (j?.data?.[0]?.b64_json) return { b: j.data[0].b64_json, u: j.usage };
    console.log("retry", JSON.stringify(j).slice(0, 200)); await new Promise(r => setTimeout(r, 15000));
  }
  throw new Error("falló");
}
const jobs = [];
const W = V + "W_carmen.png";
if (!fs.existsSync(W)) jobs.push(call("https://api.openai.com/v1/images/generations", { model: "gpt-image-2", quality: "low", size: "1024x1536",
  prompt: "Very realistic ordinary photo. Portrait from the waist up of a 70-year-old Latin American grandmother standing in a bright home kitchen: short soft white-grey hair, warm brown eyes, natural deep wrinkles on the forehead and around the eyes, a few age spots on her cheeks, small gold earrings, a lilac knitted cardigan over a white blouse, a friendly lively expression mid-sentence. Real elderly woman of 70, not a model, not younger." + LIGHT }).then(r => { fs.writeFileSync(W, Buffer.from(r.b, "base64")); console.log("OK W", JSON.stringify(r.u)); }));
for (const s of SCENES.filter(s => ["S1", "S3", "S5"].includes(s.id))) {
  const out = V + s.id + "/anc/K0.png"; fs.mkdirSync(V + s.id + "/anc", { recursive: true });
  if (fs.existsSync(out)) continue;
  jobs.push(call("https://api.openai.com/v1/images/edits", () => { const fd = new FormData(); fd.append("model", "gpt-image-2"); fd.append("quality", "low"); fd.append("size", "1536x1024");
    fd.append("prompt", "Create a new photo: " + s.k0 + WHO + LIGHT); fd.append("image[]", new Blob([fs.readFileSync(FACE)], { type: "image/png" }), "face.png"); return fd; }, true)
    .then(r => { const raw = out.replace(".png", "_raw.png"); fs.writeFileSync(raw, Buffer.from(r.b, "base64")); execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "crop=1536:864:0:24", out]); console.log("OK", s.id, JSON.stringify(r.u)); }));
}
await Promise.all(jobs);
