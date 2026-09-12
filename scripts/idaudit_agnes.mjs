// idaudit_agnes.mjs — TRUCO 1: agnes como EVALUADOR de identidad (gratis, reemplaza vision paga).
// Compara el frame original del avatar contra frames del video generado y devuelve scores 0-10.
//
//   node scripts/idaudit_agnes.mjs <ref.png> <frame1.jpg> [frame2.jpg ...]
import fs from "fs";
import path from "path";

const [REF, ...FRAMES] = process.argv.slice(2);
const env = {};
for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const KS = (env.AGNES_KEYS || "").split(",").map(s => s.trim()).filter(Boolean);
const URL_ = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const MODEL = process.env.AGNES_VISION_MODEL || "agnes-2.5-flash";
const uri = f => `data:${/\.png$/i.test(f) ? "image/png" : "image/jpeg"};base64,${fs.readFileSync(f).toString("base64")}`;

const PROMPT = `Image 1 is the ORIGINAL reference of a person. Image 2 is a frame from a video generated from it.
Compare identity, facial geometry, skin texture, clothing and background.
Reply ONLY JSON: {"identity":0-10,"facial_geometry":0-10,"skin_texture":0-10,"clothing":0-10,"background_same":true|false,"scene_cut":true|false,"deformed_hands":true|false,"burned_text":true|false,"why":"<short>"}
identity 10 = same person, 0 = different person. skin_texture 10 = unretouched real skin with pores, 0 = plastic/CGI.
background_same = the room and objects behind are the SAME place as image 1.
scene_cut = the frame shows a clearly different shot/scene than image 1.`;

let ki = 0;
for (const f of FRAMES) {
  let got = null;
  for (let a = 0; a < 4 && !got; a++) {
    const r = await fetch(URL_, {
      method: "POST",
      headers: { Authorization: "Bearer " + KS[(ki++) % KS.length], "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, temperature: 0, messages: [{ role: "user", content: [
        { type: "text", text: PROMPT },
        { type: "image_url", image_url: { url: uri(REF) } },
        { type: "image_url", image_url: { url: uri(f) } }] }] }),
    });
    if (!r.ok) { await new Promise(s => setTimeout(s, 1500 * (a + 1))); continue; }
    const d = await r.json();
    const m = (d.choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (m) got = JSON.parse(m[0]);
  }
  console.log(path.basename(f).padEnd(12), got ? JSON.stringify(got) : "ERROR");
}
