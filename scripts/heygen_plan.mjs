#!/usr/bin/env node
// Deterministic plan for the HeyGen MCP direct-avatar route.
// Each <=3000-character scene becomes one create_video_from_avatar request.
// This route is intentionally used because the Studio endpoint persisted Voice Engine=Auto
// even when eleven_v3 was present in the submitted scene payload.

import { readFileSync } from "node:fs";

const MODEL = "eleven_v3";
const MAX_CHARS = 3000;
const CHARS_PER_MINUTE = 876;

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const file = args.find((value, index) => !value.startsWith("--") && !args[index - 1]?.startsWith("--"));
const look = arg("look");
const voice = arg("voice");
const json = args.includes("--json");

if (!file) {
  console.error("uso: node scripts/heygen_plan.mjs <guion.txt> --look <LOOK_ID> --voice <VOICE_ID> [--json]");
  process.exit(2);
}

const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "").trim();
const paragraphs = text.split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
const scenes = [];
let current = "";

for (const paragraph of paragraphs) {
  const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
  if (candidate.length <= MAX_CHARS) {
    current = candidate;
  } else {
    if (current) scenes.push(current);
    current = paragraph;
  }
}
if (current) scenes.push(current);

const errors = [];
if (!look) errors.push("falta --look");
if (!voice) errors.push("falta --voice");
if (!scenes.length) errors.push("el guion está vacío");

scenes.forEach((scene, index) => {
  const label = `escena ${index + 1}`;
  if (scene.length > MAX_CHARS) errors.push(`${label}: ${scene.length} caracteres; el máximo V3 es ${MAX_CHARS}`);
  const opens = (scene.match(/\[/g) || []).length;
  const closes = (scene.match(/\]/g) || []).length;
  if (opens !== closes) errors.push(`${label}: tags [] sin balancear`);
  if (/\[(pausa|pause)\]/i.test(scene)) errors.push(`${label}: [pausa]/[pause] no está permitido`);
  for (const match of scene.matchAll(/\[([^\]]+)\]/g)) {
    if (!/^(sighs|clears throat)$/i.test(match[1].trim())) {
      errors.push(`${label}: tag no permitido [${match[1]}]`);
    }
  }
});

const baseTitle = file.split(/[\\/]/).pop().replace(/\.txt$/i, "");
const parts = scenes.map((script, index) => ({
  index: index + 1,
  idempotency_key: `${baseTitle}:heygen-direct-v3:${String(index + 1).padStart(2, "0")}`,
  payload: {
    title: `${baseTitle} (${index + 1}/${scenes.length})`,
    avatarId: look,
    voiceId: voice,
    script,
    engine: { type: "avatar_iii" },
    voiceSettings: {
      speed: 1.0,
      engine_settings: { engine_type: "elevenlabs", model: MODEL },
    },
    aspectRatio: "16:9",
    resolution: "1080p",
    outputFormat: "mp4",
    caption: { enabled: false },
  },
}));

if (errors.length) {
  console.error(`NO SE PUEDE MANDAR:\n${errors.map((error) => ` · ${error}`).join("\n")}`);
  process.exit(1);
}

if (json) {
  console.log(JSON.stringify({
    route: "mcp__heygen__create_video_from_avatar",
    voice_model: MODEL,
    effective_voice_gate: "required",
    scenes: parts.length,
    paid_requests: parts.length,
    parts,
  }, null, 2));
  process.exit(0);
}

const chars = scenes.reduce((sum, scene) => sum + scene.length, 0);
console.log(`guion ${chars.toLocaleString("es-AR")} caracteres · ${MODEL}`);
console.log(`escenas ${scenes.length} · máximo ${Math.max(...scenes.map((scene) => scene.length))} caracteres`);
console.log(`duración estimada ${(chars / CHARS_PER_MINUTE).toFixed(1)} minutos a velocidad 1.0`);
console.log(`solicitudes MCP pagas ${scenes.length} (una por escena; ruta directa V3)`);
console.log("OK: --json genera los payloads exactos para create_video_from_avatar.");
