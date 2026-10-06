// ocr_vision.mjs — transcribe VERBATIM todo el texto visible de una imagen (para verificar
// que la LÁMINA de conversión salió con el español correcto, sin meter la imagen en el contexto
// del agente). Motor agnes (gratis) igual que imgaudit_vision.
//   node scripts/ocr_vision.mjs <img1> [img2 ...]
import fs from "fs";

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KS = (env.AGNES_KEYS || process.env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }
const API = (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const mimeOf = (p) => /\.png$/i.test(p) ? "image/png" : /\.webp$/i.test(p) ? "image/webp" : "image/jpeg";

const SYSTEM = `Transcribí VERBATIM todo el texto visible en la imagen, respetando la ortografía EXACTA que ves (si dice "PUNTO DE ROCIO" sin tilde, escribilo sin tilde; si una palabra está mal escrita o es gibberish, copiala tal cual). Agrupá por zona. Devolvé SOLO JSON: {"zonas":[{"donde":"arriba izquierda|centro|derecha|abajo|...","texto":"..."}],"gibberish":true|false,"idioma":"es|en|mixto"}.`;

let ki = 0;
for (const p of process.argv.slice(2)) {
  if (!fs.existsSync(p)) { console.log(p, "→ NO EXISTE"); continue; }
  const b64 = fs.readFileSync(p).toString("base64");
  const r = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KS[(ki++) % KS.length]}` },
    body: JSON.stringify({
      model: process.env.IMGAUDIT_MODEL || "agnes-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: [{ type: "image_url", image_url: { url: `data:${mimeOf(p)};base64,${b64}`, detail: "high" } }] },
      ],
      temperature: 0,
    }),
  });
  const j = await r.json().catch(() => null);
  const txt = j?.choices?.[0]?.message?.content || JSON.stringify(j).slice(0, 300);
  console.log("=== " + p + " ===");
  console.log(txt.replace(/^```json\s*|\s*```$/g, ""));
}
