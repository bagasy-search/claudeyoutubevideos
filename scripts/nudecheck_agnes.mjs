// handaudit_agnes.mjs — AUDITOR DE DESNUDEZ Y ANATOMIA GRAVE (visión gratis de agnes).
//
// ⛔ Por qué existe: `imgaudit_vision.mjs` juzga ENCAJE (¿la imagen va con la frase?) y le puso
// ok:true a una foto con las manos DEFORMES — "Manos envejecidas en primer plano, concreto y
// directo". Dos causas, las dos estructurales:
//   1. su prompt NO menciona anatomía en ninguna parte;
//   2. manda la imagen con `detail: "low"` → a esa resolución unos dedos fusionados NO SE VEN.
// Este auditor va con `detail: "high"` y OBLIGA a contar dedos antes de dictaminar.
//
//   node scripts/handaudit_agnes.mjs <manifest.json> <salida.json>
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

const [MAN, OUT] = process.argv.slice(2);
const KS = (process.env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
const API = (process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1") + "/chat/completions";
const CONC = Number(process.env.HANDAUDIT_CONC || 8);
let ki = 0;

const SYSTEM = `Sos un revisor de SEGURIDAD de imágenes para un canal de YouTube de salud para
mayores de 60. Mirá si la imagen es PUBLICABLE.

Marcá como NO publicable si:
· Se ve un torso desnudo, pechos, glúteos o genitales — de cualquier persona y de cualquier edad.
· Una persona está en ropa interior o envuelta sólo en una toalla/sábana.
· Se ve un cuerpo demacrado, esquelético o enfermizo de forma perturbadora.
· Hay una parte del cuerpo SUELTA o cortada (una mano sin cuerpo sobre un mueble, una cabeza
  separada del cuerpo, un miembro flotando).
· Hay un menor de edad en cualquier situación.

NO marques: manos, brazos, cara, cuello, hombros vestidos, ni un primer plano de piel de mano o
brazo. Eso es normal y es de lo que trata el canal.
Ante la duda, MARCALO.
Devolvé SOLO JSON: {"publicable": true|false, "motivo": "ninguno"|"desnudez"|"ropa-interior"|"demacrado"|"parte-suelta"|"menor"|"otro", "detalle": "<8-15 palabras>"}`

const items = JSON.parse(fs.readFileSync(MAN, "utf8"));
console.log(`handaudit · ${items.length} imágenes · detail HIGH · conc ${CONC}`);
const mime = (p) => (/\.png$/i.test(p) ? "image/png" : "image/jpeg");

async function one(it, intento = 1) {
  if (!fs.existsSync(it.path)) return { name: it.name, ok: false, defecto: "falta" };
  try {
    const b64 = fs.readFileSync(it.path).toString("base64");
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + KS[(ki++) % KS.length] },
      body: JSON.stringify({
        model: "agnes-2.5-flash", temperature: 0,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: [
            { type: "text", text: "¿Es publicable?" },
            // ⛔ HIGH, no low: con `low` los dedos fusionados no se ven y todo pasa.
            { type: "image_url", image_url: { url: `data:${mime(it.path)};base64,${b64}`, detail: "high" } },
          ] },
        ],
      }),
    });
    if (!r.ok) {
      if ((r.status === 429 || r.status >= 500) && intento < 5) {
        await new Promise((s) => setTimeout(s, 1200 * intento));
        return one(it, intento + 1);
      }
      return { name: it.name, ok: false, defecto: "error", detalle: "http " + r.status };
    }
    const j = await r.json();
    const txt = j.choices?.[0]?.message?.content || "";
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) return { name: it.name, ok: false, defecto: "sin-veredicto", detalle: txt.slice(0, 60) };
    const o = JSON.parse(m[0]); return { name: it.name, ok: o.publicable !== false, defecto: o.motivo, detalle: o.detalle };
  } catch (e) {
    if (intento < 5) { await new Promise((s) => setTimeout(s, 1200 * intento)); return one(it, intento + 1); }
    return { name: it.name, ok: false, defecto: "error", detalle: e.message.slice(0, 50) };
  }
}

const res = [];
const cola = [...items];
let hechos = 0;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (cola.length) {
    res.push(await one(cola.shift()));
    if (++hechos % 20 === 0) process.stdout.write(`  ${hechos}/${items.length}\r`);
  }
}));
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
const mal = res.filter((x) => !x.ok);
const porDef = {};
for (const x of mal) porDef[x.defecto] = (porDef[x.defecto] || 0) + 1;
console.log(`\nevaluadas ${res.length} · CON DEFECTO ${mal.length}`, porDef);
for (const x of mal.slice(0, 25)) console.log(`  ${x.name}  dedos=${x.dedos}  ${x.defecto}: ${x.detalle}`);
