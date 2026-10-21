// openai_batch_rapido.mjs — RESCATE SINCRÓNICO de gpt-image-2 para cuando el Batch o agnes no llegan a tiempo (15-oct-2026).
//
// ⛔ Por qué existe: medido el 15-oct (14 h de Batch de la cuenta): un batch libre tarda 1-7 min, pero muchos
//    quedan en 0/N durante HORAS (14 parados a la vez, el más viejo 1h40) y el plan B de agnes estaba en 429/403:
//    se cancelaron 743 imágenes con 0 hechas. El creador pidió (15-oct): "cada video listo en un tope de 2 h, con
//    la misma calidad". Batch sigue siendo el camino normal (mitad de precio); esto sólo hace lo que quedó trabado.
//
//    Mismas palancas que el Batch: gpt-image-2 · quality "low" · 1088x608 · ref = crop de cara 128x192.
//    Precio sincrónico ≈ el doble que Batch, SÓLO para lo trabado: ~US$0,004 con cara / ~US$0,0034 sin cara.
//
//  sincronico(items, outDir, { conc, log })  → { ok, fallidos: [{name, error}] }
//    items = [{ name, prompt, ref? }]  (con ref → /images/edits, sin ref → /images/generations). Saltea lo que ya existe.
//    Respeta 429 (retry-after) y reintenta 3 veces cada imagen. Concurrencia OPENAI_SYNC_CONC (def 6).
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:/Users/bauti/Downloads/video2";
const SIZE = "1088x608", QUALITY = "low", MODEL = "gpt-image-2";
const clave = () => {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  return fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^OPENAI_API_KEY\s*=\s*"?([^"\r\n]+)/m)[1].trim();
};
const dataUri = (p) => `data:${/\.jpe?g$/i.test(p) ? "image/jpeg" : "image/png"};base64,${fs.readFileSync(p).toString("base64")}`;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const LOG = (fs.existsSync("D:/") ? "D:/rtmp" : process.env.TEMP || "/tmp") + "/openai_sync_gasto.jsonl";

export async function sincronico(items, outDir, { conc = +(process.env.OPENAI_SYNC_CONC || 6), log = console.log } = {}) {
  fs.mkdirSync(outDir, { recursive: true });
  const yaEsta = (it) => ["png", "jpg"].some((e) => fs.existsSync(path.join(outDir, `${it.name}.${e}`)));
  const cola = items.filter((it) => !yaEsta(it));
  const fallidos = [];
  let ok = 0, i = 0;
  if (!cola.length) return { ok: 0, fallidos };
  const cache = new Map();
  const uno = async (it) => {
    const refs = it.ref ? [].concat(it.ref) : [];
    const body = { model: MODEL, prompt: it.prompt, size: it.size || SIZE, quality: QUALITY, n: 1 };
    if (refs.length) body.images = refs.map((r) => { if (!cache.has(r)) cache.set(r, dataUri(r)); return { image_url: cache.get(r) }; });
    const url = "https://api.openai.com/v1/images/" + (refs.length ? "edits" : "generations");
    let error = "";
    for (let t = 0; t < 4; t++) {
      try {
        const r = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${clave()}`, "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(240e3) });
        if (r.status === 429 || r.status >= 500) { error = `${r.status}`; await dormir(Math.max(+(r.headers.get("retry-after") || 0) * 1000, 8000 * (t + 1))); continue; }
        const j = await r.json();
        const b64 = j.data?.[0]?.b64_json;
        if (!r.ok || !b64) { error = JSON.stringify(j.error || j).slice(0, 200); break; } // safety/400: no se reintenta igual
        fs.writeFileSync(path.join(outDir, `${it.name}.png`), Buffer.from(b64, "base64"));
        fs.appendFileSync(LOG, JSON.stringify({ t: Date.now(), name: it.name, cara: !!refs.length, usd: refs.length ? 0.0041 : 0.0034 }) + "\n");
        ok++; return;
      } catch (e) { error = e.message; await dormir(5000); }
    }
    fallidos.push({ name: it.name, error }); log(`  ✗ ${it.name} ${error}`);
  };
  log(`  ⚡ RESCATE sincrónico gpt-image-2 low: ${cola.length} imágenes (conc ${conc}) → ${outDir}`);
  await Promise.all(Array.from({ length: Math.min(conc, cola.length) }, async () => { while (i < cola.length) await uno(cola[i++]); }));
  log(`  ⚡ rescate: ${ok}/${cola.length} OK${fallidos.length ? ` · ${fallidos.length} fallidas` : ""}`);
  return { ok, fallidos };
}
