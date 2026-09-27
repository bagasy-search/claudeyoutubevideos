// Lámina (ficha con el estilo de la guía) — gpt-image-2 LOW por Batch, /v1/images/generations, 1792x1008.
// uso: node vlog/tfbtanque/lamina.mjs <nombre> [n=1]   → public/img/tfbtanque/<nombre>_<i>.png
import fs from "node:fs";
const env = Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const [, , name = "lamina", N = "1"] = process.argv;
const PROMPT = `A premium printed reference card from a professional do-it-yourself repair guide, photographed flat and filling the whole frame, landscape format. Cream paper (#F1E4C9) with a subtle paper texture, espresso-brown ink (#3A2A1C), rust-red accents (#8B2D22) and gold rules (#B1832F). Elegant large serif headings, clean sans-serif body text, generous margins, perfect hierarchy, thin gold divider lines, small numbered circles in rust red.

TOP BAND, small caps, centred: "LA COLECCIÓN DEL CONSTRUCTOR LIBRE · FICHA DE TALLER"
BIG TITLE in serif: "TANQUE DE PLÁSTICO RAJADO"
Subtitle in italic serif: "Se cierra fundiendo el mismo plástico. Sin pegamento."

LEFT COLUMN, a box titled "ANTES DE EMPEZAR" with four short lines with small check marks:
"Vaciar por debajo de la grieta" / "Secar bien" / "Limpiar con alcohol" / "Raspar la capa gris del sol"

CENTRE, six numbered steps, each with a bold short heading and one short line under it:
1 "IDENTIFICAR" — "Triángulo con 2, 4 o PE: polietileno"
2 "FRENAR LA GRIETA" — "Agujero de 3 mm en cada punta"
3 "ABRIR EN V" — "Hasta la mitad del espesor"
4 "RELLENAR" — "Tira del mismo número, fundida con el borde"
5 "MALLA SOLO AFUERA" — "2 cm más grande por lado, hundida a media altura"
6 "ADENTRO" — "Una capa de plástico limpio, sin malla"

RIGHT SIDE, a clean technical cross-section drawing in brown ink of a black tank wall cut open: a V-shaped groove on the outside filled with melted plastic, a thin metal mesh line embedded halfway inside a raised outer layer with sloped edges, and a thin light layer on the inside marked with a small water-drop icon. Small arrows with labels: "malla", "relleno", "capa interior".

BOTTOM LEFT, small line with a clock icon: "Enfriar 30 min a la sombra, sin agua"
BOTTOM CENTRE, a line with a drop icon: "Prueba: lleno hasta arriba 24 h, papel seco debajo"

BOTTOM RIGHT, a boxed panel with a rust-red border titled "LOS 3 ERRORES", three numbered lines:
"1  Rellenar con otro plástico"
"2  No hacer los agujeritos"
"3  Fundir solo la tira"

Every word in SPANISH spelled EXACTLY as written, no invented words, no extra text anywhere; CRITICAL SPELLING: render every accent and the N-with-tilde exactly: COLECCIÓN, PLÁSTICO, MÁS, CAPA, TALLER, ESPESOR.`;
const OA = "https://api.openai.com/v1", H = { Authorization: "Bearer " + env.OPENAI_API_KEY };
const oa = async (p, o = {}) => { const r = await fetch(OA + p, { ...o, headers: { ...H, ...(o.headers || {}) } }); const t = await r.text(); if (!r.ok) throw new Error(r.status + " " + t.slice(0, 300)); return JSON.parse(t); };
const lines = Array.from({ length: +N }, (_, i) => JSON.stringify({ custom_id: `${name}_${i}`, method: "POST", url: "/v1/images/generations", body: { model: "gpt-image-2", prompt: PROMPT, size: "1792x1008", quality: "low", n: 1 } })).join("\n") + "\n";
const fd = new FormData(); fd.append("purpose", "batch"); fd.append("file", new Blob([lines], { type: "application/jsonl" }), "lam.jsonl");
const file = await oa("/files", { method: "POST", body: fd });
let b = await oa("/batches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input_file_id: file.id, endpoint: "/v1/images/generations", completion_window: "24h" }) });
console.log("batch", b.id);
while (!["completed", "failed", "expired", "cancelled"].includes(b.status)) { await new Promise(r => setTimeout(r, 15000)); b = await oa("/batches/" + b.id); console.log(b.status, JSON.stringify(b.request_counts)); }
let n = 0;
for (const fid of [b.output_file_id, b.error_file_id].filter(Boolean)) {
  const txt = await (await fetch(`${OA}/files/${fid}/content`, { headers: H })).text();
  for (const ln of txt.split("\n").filter(Boolean)) {
    const r = JSON.parse(ln), d = r.response?.body?.data?.[0]?.b64_json;
    if (d) { fs.writeFileSync(`public/img/tfbtanque/${r.custom_id}.png`, Buffer.from(d, "base64")); n++; console.log("OK", r.custom_id, JSON.stringify(r.response.body.usage)); }
    else console.log("✗", r.custom_id, JSON.stringify(r.response?.body?.error || r.error).slice(0, 200));
  }
}
console.log("MEDIDO", n, "/", N);
