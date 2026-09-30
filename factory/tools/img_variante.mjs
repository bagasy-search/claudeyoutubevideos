// img_variante.mjs — la MISMA imagen con un cambio (luz, hora del día): /v1/images/edits con la foto
// como entrada, así la composición queda idéntica y se puede fundir una en la otra (día→noche).
//   node factory/tools/img_variante.mjs <entrada.png|jpg> <salida.jpg> "<qué cambia>"
// Una sola imagen, low + 1088x608 (las palancas de gptimg salvo Batch: es UNA y hace falta ya).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { env } from "../lib/env.mjs";

const [src, out, cambio] = process.argv.slice(2);
if (!src || !out || !cambio || !fs.existsSync(src)) { console.error('uso: node factory/tools/img_variante.mjs <entrada> <salida.jpg> "<qué cambia>"'); process.exit(2); }
const prompt = `Keep EXACTLY the same scene, framing, camera position, objects and their positions. Change only this: ${cambio}. ` +
  "Photorealistic smartphone photo, true-to-life colors, sharp focus, no text, no letters, no people.";
const fd = new FormData();
fd.append("model", "gpt-image-2"); fd.append("prompt", prompt); fd.append("quality", "low"); fd.append("size", "1088x608");
fd.append("image[]", new Blob([fs.readFileSync(src)], { type: src.endsWith(".png") ? "image/png" : "image/jpeg" }), path.basename(src));
const r = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${env("OPENAI_API_KEY")}` }, body: fd, signal: AbortSignal.timeout(300_000) });
const j = await r.json();
if (!j.data?.[0]?.b64_json) { console.error("⛔", JSON.stringify(j).slice(0, 400)); process.exit(1); }
const png = out.replace(/\.jpg$/, ".png");
fs.writeFileSync(png, Buffer.from(j.data[0].b64_json, "base64"));
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", png, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "2", out]);
console.log(`✓ ${out} · tokens in ${j.usage?.input_tokens ?? "?"} out ${j.usage?.output_tokens ?? "?"}`);
