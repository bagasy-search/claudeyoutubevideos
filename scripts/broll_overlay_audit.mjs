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

// ⛔ POLITICA (validada por el creador, general para TODO video): el texto INVENTADO / ILEGIBLE que
// generan los modelos de imagen (etiquetas de productos, carteles, letreros de fondo, numeros en una
// caja) es IRRELEVANTE y NO se reporta — los canales mas virales estan llenos de imagenes con texto
// ilegible y no molesta a nadie. Lo UNICO que importa acustar acá es la MARCA DE AGUA / logo SOBREPUESTO
// tipo banco de stock (Shutterstock, iStock, Getty, Dreamstime, Alamy, Adobe Stock, un @usuario, un URL),
// que delata footage robado y sí obliga a re-generar. Para las LAMINAS EXPLICATIVAS con texto horneado
// (gpt-image: diagramas dg_*, tarjetas con titulo/pasos) el texto SÍ tiene que ser correcto, pero eso lo
// audita otro pase (imgaudit sobre esos assets puntuales), NO este.
const SYSTEM = `Sos un control de calidad de fotogramas de video para B-ROLL.
Mira SOLO si el fotograma tiene GRAFICOS O TEXTO SOBREPUESTOS por una emisora o editor, es decir
cualquier cosa que NO estaba en la escena filmada: zocalo o placa de noticiero (barra de color con
titular), logo o mosca de canal en una esquina, ticker, nombre de periodista o de lugar, reloj o
temperatura de la emisora, marca de agua, URL, @usuario, subtitulos quemados, flechas o circulos
rojos de edicion, o un recuadro de "EN VIVO".
NO cuentan como falla, porque son parte de la escena real filmada: el sello de fecha y hora que
graba la propia camara de seguridad, carteles de la calle, patentes, marcas de productos, numeros
de casa, letreros de negocios, texto en ropa. Eso es mundo real y esta perfecto.
Respondes SOLO JSON: {"has_text": true|false, "what": "<que viste, 6 palabras>"}
has_text=true SOLO si hay grafico o texto AGREGADO por una emisora o editor.`;

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
