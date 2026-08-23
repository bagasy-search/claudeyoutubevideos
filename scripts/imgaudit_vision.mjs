// imgaudit_vision.mjs — AUDITA imágenes IA con visión (gpt-4o-mini) DESDE UN SCRIPT, fuera del
// contexto del agente. Antes el agente LEÍA las 342 imágenes él mismo → un turno chupaba 16M de
// cache (el 70% del gasto del video). Acá cada imagen se juzga por API y el agente solo lee el JSON
// chico de veredictos. NUNCA metas imágenes en el contexto del agente principal: usá esto.
//
//   node scripts/imgaudit_vision.mjs <manifest.json> [out_verdicts.json]
//   manifest = [{name, path, phrase}]  (los _v3/imgaudit_N.json ya tienen ese formato)
//   Salida  = [{name, ok, issue, reason}]  + resumen por consola (N ok / M a regenerar).
//   Env: OPENAI_API_KEY (de .env). Concurrencia IMGAUDIT_CONC (def 6). Modelo IMGAUDIT_MODEL.
import fs from "fs";
import path from "path";

const [manifestArg, outArg] = process.argv.slice(2);
if (!manifestArg) { console.error("Uso: node scripts/imgaudit_vision.mjs <manifest.json> [out.json]"); process.exit(1); }

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KEY = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
if (!KEY) { console.error("falta OPENAI_API_KEY en .env"); process.exit(1); }
// ⚠ MEDIDO (2026-08-23, 7 imagenes de ground truth + costo real por token):
//   gpt-4o-mini  5/7 aciertos · $0.150 / 328 imgs   ← era el default y es el PEOR de los dos
//   gpt-4.1-mini 6/7 aciertos · $0.079 / 328 imgs   ← mejor Y la mitad de precio
//   gpt-4.1-nano 3/7 aciertos · $0.025              ← aprueba texto quemado y grafiti: INSERVIBLE
// gpt-4o-mini parecia el barato pero le aplica un multiplicador de ~33x a las IMAGENES:
// una imagen en detail:low le cuesta 2872 tokens contra 124 de gpt-4o. El precio por token
// bajo no compensa. detail:"low" se mantiene (en high el mini se va a 14206 tokens).
const MODEL = process.env.IMGAUDIT_MODEL || "gpt-4.1-mini";
const CONC = +(process.env.IMGAUDIT_CONC || 6);

const SYSTEM = `Sos un AUDITOR de imágenes de b-roll para un video documental. Te doy UNA imagen y la FRASE que narra el video en ese momento. Juzgá 3 cosas:
1) ENCAJE: ¿la imagen MUESTRA algo concreto (objeto/acción/lugar) que va con la frase? Una foto de relleno que no tiene que ver = mal.
2) LIMPIA: ¿tiene TEXTO quemado, subtítulos, marca de agua o logo? Eso = mal (el texto lo ponen los componentes, no la foto).
3) NO-GENÉRICA: ¿es una "persona genérica explicando/señalando la nada" sin objeto concreto? Ese es el fallo típico de IA cuando el prompt era abstracto = mal.
Devolvé SOLO JSON: {"ok": true|false, "issue": "ok"|"off-topic"|"texto"|"marca-agua"|"persona-generica"|"fea", "reason": "<8-15 palabras>"}. ok=true SOLO si encaja Y está limpia Y no es persona-genérica de relleno.`;

const manifest = JSON.parse(fs.readFileSync(manifestArg, "utf8"));
const items = (Array.isArray(manifest) ? manifest : []).filter((it) => it && it.name && it.path);
console.log(`imgaudit visión (${MODEL}, conc ${CONC}) · ${items.length} imágenes`);

const mimeOf = (p) => /\.png$/i.test(p) ? "image/png" : /\.webp$/i.test(p) ? "image/webp" : "image/jpeg";

async function audit(it, attempt = 1) {
  const abs = path.isAbsolute(it.path) ? it.path : it.path;
  if (!fs.existsSync(abs)) return { name: it.name, ok: false, issue: "falta", reason: "no existe el archivo" };
  try {
    const b64 = fs.readFileSync(abs).toString("base64");
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL, temperature: 0, max_tokens: 120, response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: [
            { type: "text", text: `FRASE que narra el video acá: "${it.phrase || "(sin frase)"}"` },
            { type: "image_url", image_url: { url: `data:${mimeOf(abs)};base64,${b64}`, detail: "low" } },
          ] },
        ],
      }),
    });
    if (!r.ok) {
      if ((r.status === 429 || r.status >= 500) && attempt < 4) { await new Promise((s) => setTimeout(s, 800 * attempt)); return audit(it, attempt + 1); }
      return { name: it.name, ok: false, issue: "error", reason: `http ${r.status}` };
    }
    const j = await r.json();
    let v; try { v = JSON.parse(j.choices?.[0]?.message?.content || "{}"); } catch { v = {}; }
    return { name: it.name, ok: v.ok === true, issue: v.issue || (v.ok ? "ok" : "fea"), reason: (v.reason || "").slice(0, 120) };
  } catch (e) {
    if (attempt < 4) { await new Promise((s) => setTimeout(s, 800 * attempt)); return audit(it, attempt + 1); }
    return { name: it.name, ok: false, issue: "error", reason: e.message.slice(0, 80) };
  }
}

// pool de concurrencia
const out = [];
let i = 0;
async function worker() { while (i < items.length) { const it = items[i++]; out.push(await audit(it)); } }
await Promise.all(Array.from({ length: Math.min(CONC, items.length) }, worker));
out.sort((a, b) => items.findIndex((x) => x.name === a.name) - items.findIndex((x) => x.name === b.name));

const bad = out.filter((v) => !v.ok);
const dest = outArg || manifestArg.replace(/\.json$/, "_verdicts.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log(`\n${out.length - bad.length} ok / ${bad.length} a regenerar → ${dest}`);
if (bad.length) { console.log("A regenerar:"); bad.slice(0, 40).forEach((v) => console.log(`  · ${v.name} [${v.issue}] ${v.reason}`)); }
