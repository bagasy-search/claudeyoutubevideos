// gate_intrusos.mjs — ¿agnes METIÓ a alguien que NO estaba en la foto de origen?
//
// Por qué existe: en `friogranero` agnes i2v agregó un hombre con ropa de HOY (polar con cierre,
// campera caqui, camisa a cuadros y jean) dentro de 5 clips de una reconstrucción de 1899. Ninguna
// compuerta lo vio:
//   · el diff de píxeles lo marcó, pero también marca la ventisca legítima -> se descartó como ruido;
//   · `clipaudit_agnes.mjs` lo APROBÓ con objetos 10, porque pregunta "¿está roto / es el mismo?",
//     nunca "¿apareció algo que no estaba?";
//   · densidad, luma, fps, negros y timestamps dan todos verde: cada cuadro por separado está bien.
// La pregunta correcta es COMPARATIVA y hay que hacerla explícita.
//
//   node scripts/gate_intrusos.mjs <clipsDir> <imgDir> <out.json>
// exit 1 si algún clip introduce un sujeto nuevo.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [CLIPS, IMGDIR = "public/img", OUT = "_intrusos.json"] = process.argv.slice(2);
if (!CLIPS) { console.error("uso: node scripts/gate_intrusos.mjs <clipsDir> [imgDir] [out.json]"); process.exit(2); }

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch {}
const KS = (process.env.AGNES_KEYS || env.AGNES_KEYS || env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KS.length) { console.error("faltan AGNES_KEYS"); process.exit(2); }
const BASE = env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const FF = process.env.FFMPEG || "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg";
const TMP = "D:/rtmp/_intrusos"; fs.mkdirSync(TMP, { recursive: true });

const b64 = (f) => fs.readFileSync(f).toString("base64");
const frame = (mp4, t, out) => { execFileSync(FF, ["-v", "error", "-ss", String(t), "-i", mp4, "-frames:v", "1", "-vf", "scale=768:-2", "-y", out]); return out; };

const PREGUNTA =
  "La PRIMERA imagen es el fotograma de origen. La SEGUNDA es un fotograma posterior del mismo plano.\n" +
  "Respondé SOLO con JSON: {\"sujeto_nuevo\":true|false,\"que\":\"...\",\"ropa_moderna\":true|false,\"detalle\":\"...\"}\n" +
  "· sujeto_nuevo = true si en la SEGUNDA hay una persona, un animal o un objeto grande que NO está en la PRIMERA.\n" +
  "  Una persona que ya estaba y se movió NO cuenta. Que la cámara revele algo del borde NO cuenta.\n" +
  "· ropa_moderna = true si alguien viste algo posterior a 1900: cierre o cremallera, polar, campera\n" +
  "  deportiva, jean, camisa a cuadros industrial, zapatillas, puños elásticos, gorra con visera.\n" +
  "No juzgues nitidez, encuadre, color ni texto: sólo si APARECIÓ algo y si la ropa es moderna.";

async function preguntar(a, b, k) {
  const r = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KS[k % KS.length]}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "agnes-2.5-flash",
      messages: [{ role: "user", content: [
        { type: "text", text: PREGUNTA },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64(a)}`, detail: "high" } },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64(b)}`, detail: "high" } },
      ] }],
    }),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${t.slice(0, 140)}`);
  const c = JSON.parse(t).choices?.[0]?.message?.content || "";
  const m = c.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("sin JSON en la respuesta");
  return JSON.parse(m[0]);
}

const clips = fs.readdirSync(CLIPS).filter((f) => f.endsWith(".mp4")).sort();
console.log(`intrusos: midiendo ${clips.length} clips contra su foto de origen en ${IMGDIR}`);
const res = [];
let k = 0;
for (const c of clips) {
  const n = c.replace(/\.mp4$/, "");
  const png = ["png", "jpg", "jpeg"].map((e) => path.join(IMGDIR, `${n}.${e}`)).find((p) => fs.existsSync(p));
  if (!png) { console.log(`  (sin foto de origen, salteo) ${n}`); continue; }
  const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join(CLIPS, c)]).toString().trim());
  const a = frame(path.join(CLIPS, c), 0.05, `${TMP}/a.jpg`);
  const b = frame(path.join(CLIPS, c), Math.max(0.2, dur - 0.15), `${TMP}/b.jpg`);
  let v;
  for (let t = 0; t < 4; t++) {
    try { v = await preguntar(a, b, k++); break; }
    catch (e) { if (t === 3) { console.log(`  ✗ ${n}: ${e.message}`); v = { error: String(e.message) }; } await new Promise((r) => setTimeout(r, 2500)); }
  }
  const mal = v?.sujeto_nuevo === true || v?.ropa_moderna === true;
  res.push({ name: n, ...v, rechazado: mal });
  console.log(`  ${mal ? "⛔" : "ok"} ${n}${mal ? ` :: ${v.que || ""} ${v.detalle || ""}`.slice(0, 130) : ""}`);
}
fs.writeFileSync(OUT, JSON.stringify(res, null, 1), "utf8");
const malos = res.filter((r) => r.rechazado);
console.log(`\nmedidos ${res.length} · rechazados ${malos.length} (${res.length ? Math.round(100 * malos.length / res.length) : 0}%)`);
console.log(`→ ${OUT}`);
if (malos.length) process.exit(1);
