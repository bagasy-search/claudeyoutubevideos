// env.mjs — lee <video2>/.env UNA vez. Nunca claves en el código (había una key de RunPod quemada en
// 12 scripts sueltos, en un repo PÚBLICO).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

let cache = null;
export function loadEnv(file = path.join(ROOT, ".env")) {
  if (cache) return cache;
  cache = {};
  try {
    for (const l of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) cache[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch { /* sin .env: sólo process.env */ }
  return cache;
}

export function env(k, { required = false } = {}) {
  const v = process.env[k] ?? loadEnv()[k];
  if (required && !v) throw new Error(`falta ${k} (en process.env o ${path.join(ROOT, ".env")})`);
  return v;
}

export const _resetEnvCache = () => { cache = null; };
