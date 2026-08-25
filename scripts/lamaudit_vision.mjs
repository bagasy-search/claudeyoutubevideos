// lamaudit_vision.mjs — auditor de LAMINAS (paginas de guia con TEXTO HORNEADO).
//
// Por que existe: los otros dos auditores no sirven aca.
//   · imgaudit_vision  marca "texto" como FALLA  → en una lamina el texto es el producto.
//   · textaudit_vision solo pregunta SI HAY texto → en una lamina siempre hay.
// Lo unico que importa en una lamina es si las palabras estan BIEN ESCRITAS y si dicen lo que
// pediste. gpt-image-2 escribe bien pero inventa letras cuando el bloque es largo.
//
//   node scripts/lamaudit_vision.mjs <manifest.json> <out.json>
//   manifest = [{name, path, expect}]   expect = el texto que DEBERIA decir
//   salida   = [{name, ok, misspelled:[], missing:[], reason}]
import fs from "fs";

const [manifestArg, outArg] = process.argv.slice(2);
if (!manifestArg || !outArg) { console.error("Uso: node scripts/lamaudit_vision.mjs <manifest.json> <out.json>"); process.exit(1); }

const env = {};
try {
  for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const ENGINE = (process.env.AUDIT_ENGINE || "agnes").toLowerCase();
const AGNES_KS = (env.AGNES_KEYS || process.env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
const KEY = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
const MODEL = process.env.LAMAUDIT_MODEL || (ENGINE === "agnes" ? "agnes-2.5-flash" : "gpt-4.1-mini");
const API = ENGINE === "agnes"
  ? (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions"
  : "https://api.openai.com/v1/chat/completions";
if (ENGINE === "agnes" && !AGNES_KS.length) { console.error("faltan AGNES_KEYS"); process.exit(1); }
if (ENGINE === "openai" && !KEY) { console.error("falta OPENAI_API_KEY"); process.exit(1); }
let ki = 0;

const SYSTEM = `You proofread a printed page. You will get ONE image of a guide page and the text it is SUPPOSED to contain.
Read every word visible in the image, carefully, letter by letter.
Report ONLY real defects:
- "misspelled": a word rendered with wrong/extra/missing letters, or letters that are not a real word (gibberish).
- "missing": a whole line or label from the expected text that is not on the page at all.
Do NOT report differences in line breaks, capitalisation, punctuation, font, layout, colour or wording order. Small rewordings are fine.
Return ONLY JSON: {"ok": true|false, "misspelled": ["<word as printed>"], "missing": ["<expected line>"], "reason": "<8-15 words>"}.
ok=true if every visible word is correctly spelled and readable.`;

const manifest = JSON.parse(fs.readFileSync(manifestArg, "utf8").replace(/^﻿/, ""));
const items = manifest.filter((it) => it && it.name && it.path);
console.log(`lamaudit · ${ENGINE} (${MODEL}) · ${items.length} laminas`);

const mimeOf = (p) => /\.png$/i.test(p) ? "image/png" : /\.webp$/i.test(p) ? "image/webp" : "image/jpeg";

async function audit(it, attempt = 1) {
  if (!fs.existsSync(it.path)) return { name: it.name, ok: false, misspelled: [], missing: [], reason: "no existe el archivo" };
  try {
    const b64 = fs.readFileSync(it.path).toString("base64");
    const auth = ENGINE === "agnes" ? AGNES_KS[(ki++) % AGNES_KS.length] : KEY;
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: [
            { type: "text", text: `EXPECTED TEXT ON THE PAGE:\n${it.expect || "(not given)"}` },
            { type: "image_url", image_url: { url: `data:${mimeOf(it.path)};base64,${b64}`, detail: "high" } },
          ] },
        ],
        temperature: 0,
      }),
    });
    if (!r.ok) {
      if ((r.status === 429 || r.status >= 500) && attempt < 6) { await new Promise((s) => setTimeout(s, 4000 * attempt)); return audit(it, attempt + 1); }
      return { name: it.name, ok: false, misspelled: [], missing: [], reason: `http ${r.status}` };
    }
    const j = await r.json();
    const raw = j?.choices?.[0]?.message?.content || "";
    const m = raw.match(/\{[\s\S]*\}/);
    const v = m ? JSON.parse(m[0]) : {};
    return { name: it.name, ok: !!v.ok, misspelled: v.misspelled || [], missing: v.missing || [], reason: v.reason || "" };
  } catch (e) {
    if (attempt < 6) { await new Promise((s) => setTimeout(s, 4000 * attempt)); return audit(it, attempt + 1); }
    return { name: it.name, ok: false, misspelled: [], missing: [], reason: String(e).slice(0, 60) };
  }
}

const out = [];
const CONC = 6;
let idx = 0;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (idx < items.length) {
    const it = items[idx++];
    const v = await audit(it);
    out.push(v);
    console.log(`${v.ok ? "OK " : "MAL"} ${v.name} ${v.ok ? "" : JSON.stringify({ mis: v.misspelled, miss: v.missing, why: v.reason })}`);
  }
}));
fs.writeFileSync(outArg, JSON.stringify(out, null, 1));
console.log(`\n=== ${out.filter((x) => x.ok).length}/${out.length} limpias -> ${outArg} ===`);
