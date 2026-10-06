// handaudit_agnes.mjs — AUDITOR DE ANATOMÍA DE MANOS (visión gratis de agnes).
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

const SYSTEM = `Sos un revisor de ANATOMÍA en fotos generadas por IA. Mirá SOLO el cuerpo: manos,
dedos, muñecas y brazos.

⚠️ El fallo MÁS COMÚN no es la cantidad de dedos —es que la mano NO SE CONECTA A NADA:
termina en un MUÑÓN redondeado, en un bulto liso sin muñeca, o se disuelve en la mesa/el fondo.
Una mano con 5 dedos perfectos que sale de un bulto con forma de pan ESTÁ MAL. Miralo primero.

Procedé en este orden, sin saltear:
1. ¿Cómo TERMINA cada mano/brazo?
   · Si sale del cuadro por un BORDE de la foto: BIEN. Eso es un recorte de encuadre, normal
     en un primer plano. NO es un defecto.
   · Si termina DENTRO del cuadro, con fondo alrededor, en un muñón redondeado o un bulto liso
     sin muñeca: MAL. Eso es el defecto.
   Un primer plano del DORSO de la mano donde no se ven las yemas también es NORMAL: no lo
   marques por eso.
2. Contá los dedos que SE VEN. Si el encuadre o un puño tapan algunos, eso NO es defecto:
   sólo marcá si los que se ven están fusionados, deformes o son claramente de más.
3. ¿Hay dedos FUSIONADOS, de más, de menos, o dos manos pegadas en una sola masa?
4. ¿Alguna yema, nudillo o borde se derrite o se funde con el objeto que toca?

No juzgues si la foto viene al tema, ni la luz, ni el encuadre. SOLO la anatomía.
Sé ESTRICTO: ante la duda, MAL. Preferible descartar una foto sana que dejar pasar una deforme.
Devolvé SOLO JSON: {"manos": <n>, "conectadas": true|false, "dedos": "<ej '5 y 5'>", "ok": true|false, "defecto": "ninguno"|"munon"|"fusionados"|"cantidad"|"derretida"|"otro", "detalle": "<8-15 palabras>"}
ok=true SOLO si TODAS las manos salen de una muñeca visible Y tienen 5 dedos separados Y nada se funde.
Si en la foto no hay manos HUMANAS (un guante vacío, un objeto, una foto dentro de la foto),
no es un defecto: devolvé {"manos":0,"dedos":"-","ok":true,"defecto":"ninguno","detalle":"sin manos"}.`;

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
            { type: "text", text: "Contá los dedos de cada mano y dictaminá." },
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
    return { name: it.name, ...JSON.parse(m[0]) };
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
