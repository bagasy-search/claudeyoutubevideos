// agnes_image.mjs — imágenes SIN PERSONAS con agnes-image-2.5-flash (gratis), respaldo de gpt-image cuando OpenAI
// no está disponible. GENÉRICO (nada por slug). ⛔ No sirve para elenco ni para nada que necesite referencia:
// agnes-image ignora la imagen de referencia y el encuadre pedido en anclas con personas.
//
//   node scripts/agnes_image.mjs <items.json> <outDir> [conc=6]
//   items = [{ "name": "wall_1", "prompt": "..." }]     → <outDir>/<name>.png + <outDir>/_manifest.json (motor: agnes-image)
//
// Reanudable (salta las que existen). Reintenta 3 veces rotando claves. Sale 2 si falta alguna (no midió todo).
import fs from "node:fs";
import path from "node:path";

const [LIST, OUT, CONC0] = process.argv.slice(2);
if (!LIST || !OUT) { console.error("uso: node scripts/agnes_image.mjs <items.json> <outDir> [conc=6]"); process.exit(1); }
const CONC = +(CONC0 || 6);
const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KS = (process.env.AGNES_KEYS || env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
const B = process.env.AGNES_BASE_URL || env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const MODEL = process.env.AGNES_IMG_MODEL || "agnes-image-2.5-flash";
fs.mkdirSync(OUT, { recursive: true });
const MAN = path.join(OUT, "_manifest.json");
const man = fs.existsSync(MAN) ? JSON.parse(fs.readFileSync(MAN, "utf8")) : {};
const items = JSON.parse(fs.readFileSync(LIST, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let kc = Math.floor(Math.random() * KS.length);

async function one(it) {
  const dst = path.join(OUT, it.name + ".png");
  if (fs.existsSync(dst)) return true;
  for (let a = 0; a < 4; a++) {
    const k = KS[kc++ % KS.length];
    try {
      const r = await fetch(B + "/images/generations", { method: "POST", signal: AbortSignal.timeout(180000),
        headers: { Authorization: "Bearer " + k, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt: it.prompt, size: it.size || "1792x1024", n: 1 }) });
      const t = await r.text(); let j = {}; try { j = JSON.parse(t); } catch {}
      const d = j.data?.[0];
      let buf = null;
      if (d?.b64_json) buf = Buffer.from(d.b64_json, "base64");
      else if (d?.url) buf = Buffer.from(await (await fetch(d.url, { signal: AbortSignal.timeout(120000) })).arrayBuffer());
      if (buf && buf.length > 20000) {
        fs.writeFileSync(dst, buf);
        man[it.name] = { motor: MODEL, prompt: it.prompt, at: new Date().toISOString() };
        fs.writeFileSync(MAN, JSON.stringify(man, null, 1));
        console.log("ok", it.name); return true;
      }
      console.log("x", it.name, t.slice(0, 140)); await sleep(/rate|429/i.test(t) ? 45000 : 5000);
    } catch (e) { console.log("x", it.name, String(e.message).slice(0, 100)); await sleep(5000); }
  }
  return false;
}
const cola = [...items];
await Promise.all(Array.from({ length: CONC }, async () => { while (cola.length) await one(cola.shift()); }));
const hechas = items.filter((it) => fs.existsSync(path.join(OUT, it.name + ".png"))).length;
console.log(`MEDIDO: ${hechas}/${items.length} en ${OUT} (motor ${MODEL})`);
process.exit(hechas === items.length ? 0 : 2);
