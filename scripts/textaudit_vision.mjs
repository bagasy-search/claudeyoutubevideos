// textaudit_vision.mjs — segunda pasada ENFOCADA: la unica pregunta es si el frame tiene
// LETRAS, PALABRAS, NUMEROS INVENTADOS o MARCA DE AGUA. Fuera del contexto del agente.
//
// Por que existe: el auditor general (imgaudit_vision.mjs) juzga muchas cosas a la vez y el
// "off-topic" le come la atencion (medido en grvaseline: 282 off-topic falsos de 459, y solo
// 2 "texto" encontrados — uno de los cuales el ojo humano confirmo, mas otro que se le paso).
// El texto quemado es LA falla que obliga a re-rendear, asi que se pregunta sola.
//
//   node scripts/textaudit_vision.mjs <manifest.json> <out.json>
//   manifest = [{name, path}]   salida = [{name, has_text, what}]
import fs from "fs";

const [manifestArg, outArg] = process.argv.slice(2);
const env = {};
try {
  for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}
// MOTOR: agnes (GRATIS) por defecto; AUDIT_ENGINE=openai vuelve a gpt-4.1-mini (pago).
// Medido 23-ago-2026 (60 frames de grvaseline): 95% de acuerdo con gpt-4.1-mini, y de los 3
// desacuerdos 2 eran falsos positivos de gpt. Ver skill `agnes-broll` §4.
const ENGINE = (process.env.AUDIT_ENGINE || "agnes").toLowerCase();
const AGNES_KS = (env.AGNES_KEYS || process.env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
const KEY = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
const MODEL = process.env.IMGAUDIT_MODEL || (ENGINE === "agnes" ? "agnes-2.5-flash" : "gpt-4.1-mini");
const CONC = +(process.env.IMGAUDIT_CONC || (ENGINE === "agnes" ? 10 : 12));
const API = ENGINE === "agnes"
  ? (env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions"
  : "https://api.openai.com/v1/chat/completions";
let ki = 0;

const SYSTEM = `Sos un control de calidad de fotogramas para video. Mira SOLO una cosa: si en la
imagen hay LETRAS, PALABRAS, NUMEROS, logos o marca de agua VISIBLES.
Responde JSON: {"has_text": true|false, "what": "<que dice o donde esta, muy corto>"}
Reglas:
- Cuenta como texto: cualquier palabra o letra legible o SEMI-legible, texto borroneado que
  claramente pretende ser texto, digitos en un reloj o pantalla, un logo de marca, una firma.
- NO cuenta: dibujos, simbolos sin letras, texturas.
- Ante la duda de si eso es texto, responde true. Es preferible revisar de mas.`;

const items = JSON.parse(fs.readFileSync(manifestArg, "utf8").replace(/^﻿/, ""));
const out = [];
let done = 0;

async function one(it) {
  let b64;
  try { b64 = fs.readFileSync(it.path).toString("base64"); }
  catch { return { name: it.name, has_text: false, what: "sin archivo" }; }
  for (let a = 0; a < 3; a++) {
    try {
      const auth = ENGINE === "agnes" ? AGNES_KS[(ki++) % AGNES_KS.length] : KEY;
      const r = await fetch(API, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL, temperature: 0,
          // agnes RAZONA antes del JSON: response_format lo trunca.
          ...(ENGINE === "agnes" ? {} : { response_format: { type: "json_object" } }),
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: [{ type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}`, detail: "low" } }] },
          ],
        }),
      });
      if (!r.ok) { await new Promise((s) => setTimeout(s, 1500 * (a + 1))); continue; }
      const d = await r.json();
      // agnes devuelve el JSON DESPUES del razonamiento -> recortarlo.
      const content = d.choices?.[0]?.message?.content || "";
      const j = JSON.parse((content.match(/\{[\s\S]*\}/) || ["{}"])[0]);
      return { name: it.name, has_text: !!j.has_text, what: j.what || "" };
    } catch { await new Promise((s) => setTimeout(s, 1500 * (a + 1))); }
  }
  return { name: it.name, has_text: false, what: "error" };
}

const queue = [...items];
await Promise.all(Array.from({ length: CONC }, async () => {
  while (queue.length) {
    const it = queue.shift();
    out.push(await one(it));
    if (++done % 50 === 0) process.stdout.write(`  ${done}/${items.length}\n`);
  }
}));

const hits = out.filter((x) => x.has_text);
fs.writeFileSync(outArg, JSON.stringify(out, null, 1));
console.log(`\ncon TEXTO: ${hits.length}/${out.length}`);
for (const h of hits) console.log(`  ${h.name}  ${h.what.slice(0, 70)}`);
