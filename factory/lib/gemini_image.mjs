// gemini_image.mjs — motor de imagen ALTERNATIVO (Gemini vía AIHubMix, API compatible OpenAI).
// ⛔ NO es el motor de la casa (§2: gpt-image-2 para TODO). Existe para PRUEBAS de montaje cuando
// OpenAI no está disponible (cuenta desactivada 04-oct-2026). Se activa con FACTORY_IMG_MOTOR=gemini.
// Con presentador: manda la foto del avatar como referencia y pide la escena con ESA persona.
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { env } from "./env.mjs";

const BASE = () => env("GEMINI_IMG_BASE") || env("LLM_BASE") || "https://aihubmix.com/v1";
const KEY = () => env("GEMINI_IMG_KEY") || env("LLM_KEY") || env("AIHUBMIX_KEY");
const MODEL = () => env("GEMINI_IMG_MODEL") || "gemini-3.1-flash-image";

// curl y no fetch: la respuesta trae ~3 MB de base64 y tarda; la clave va por variable de entorno.
function post(body) {
  return new Promise((ok, mal) => {
    const p = spawn("curl", ["-sS", "--fail-with-body", "--max-time", "300", "--variable", "%GI_KEY", "--expand-header", "Authorization: Bearer {{GI_KEY}}",
      "-H", "content-type: application/json", "--data-binary", "@-", `${BASE()}/chat/completions`], { env: { ...process.env, GI_KEY: KEY() } });
    const out = []; let err = "";
    p.stdout.on("data", (d) => out.push(d));
    p.stderr.on("data", (d) => { err += d; });
    p.on("close", (code) => {
      const txt = Buffer.concat(out).toString("utf8");
      if (code !== 0) return mal(new Error(`curl ${code}: ${(err + txt).slice(0, 300)}`));
      try { ok(JSON.parse(txt)); } catch (e) { mal(new Error(`respuesta no JSON: ${txt.slice(0, 200)}`)); }
    });
    p.stdin.end(JSON.stringify(body));
  });
}

export async function geminiImage({ prompt, ref = null, presentadorToken = null, outPng }) {
  const texto = [
    "Generate ONE photorealistic 16:9 landscape photo, like a frame from a real handheld video. No text, no captions, no watermark.",
    ref ? `The man in the reference photo is ${presentadorToken || "the presenter"}: keep his exact face, beard, age and clothes. Scene:` : "Scene:",
    prompt,
  ].join(" ");
  const content = ref
    ? [{ type: "text", text: texto }, { type: "image_url", image_url: { url: `data:image/png;base64,${fs.readFileSync(ref).toString("base64")}` } }]
    : texto;
  let ultimo;
  for (let i = 0; i < 3; i++) {
    try {
      const j = await post({ model: MODEL(), modalities: ["text", "image"], messages: [{ role: "user", content }] });
      const parte = (j.choices?.[0]?.message?.multi_mod_content || []).find((x) => x.inline_data?.data);
      if (!parte) throw new Error(`sin imagen en la respuesta (${String(j.choices?.[0]?.message?.content || "").slice(0, 120)})`);
      fs.mkdirSync(path.dirname(outPng), { recursive: true });
      fs.writeFileSync(outPng, Buffer.from(parte.inline_data.data, "base64"));
      return { ok: true, tokens: j.usage?.completion_tokens || 0 };
    } catch (e) { ultimo = e; await new Promise((s) => setTimeout(s, 3000 * (i + 1))); }
  }
  return { ok: false, error: ultimo?.message };
}
