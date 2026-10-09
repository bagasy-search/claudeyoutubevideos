// EL EDITOR (juez de visión gratis agnes-3.0-flash) sobre los cuadros fijos de cada componente del video.
//   node vlog/fab/editor_juez.mjs <lista.json> <dirCuadros>   → <dir>/juez.json { ov03a: {ok, fallas, motivo} } · exit 1 si hay defectos
//   lista = [{ name, c, props }]  (props = los textos que DEBERÍAN leerse, para saber si algo quedó cortado o tapado)
// Mira lo que un editor humano mira en un gráfico: textos cortados, encimados, ilegibles, cosas fuera de cuadro, fotos vacías
// o que no muestran lo que dice su pie. Ante la duda NO rechaza por gusto: sólo defectos que se ven.
import fs from "node:fs";
import path from "node:path";

const [LIST, DIR] = process.argv.slice(2);
const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch { }
const KEYS = (process.env.AGNES_KEYS || env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KEYS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(2); }
const API = (process.env.AGNES_BASE_URL || env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1").replace(/\/$/, "") + "/chat/completions";
const MODEL = process.env.GATE_MODEL || "agnes-3.0-flash";

const CHECKS = {
  texto_cortado: "A word or label is CUT OFF: part of its letters is hidden by the edge of the picture or by the edge of the card/box it sits in (e.g. 'garantía 7 dí'). Text that is complete but small is NOT this defect.",
  texto_encimado: "Two pieces of text overlap each other, or a text sits on top of another graphic element so that it cannot be read cleanly.",
  ilegible: "An important text cannot be read: too small, or almost the same color as what is behind it.",
  fuera_de_cuadro: "An important graphic element (a card, photo, sign, map, ticket) is partly OUTSIDE the picture so a meaningful part of it is missing. Background video at the edges does not count.",
  foto_vacia: "A photo frame (polaroid) is empty, plain gray or black, or shows an error instead of a picture.",
  no_coincide: "A photo clearly shows something different from what its handwritten caption says (for example the caption says 'lemon with cloves' and the photo shows a trash bag).",
};
const Q = (it) => `You are a senior video editor checking ONE frame of an animated graphic that sits over a video.
These are the texts the graphic is supposed to show (for reference): ${JSON.stringify(it.props).slice(0, 1500)}
Some elements may still be animating in (half transparent or not yet visible): that is fine, do NOT count it.
A play button drawn over a video thumbnail, tape strips, stamps and check marks are part of the design: they are NOT defects.
Inspect the frame region by region and answer each check with true (defect clearly visible) or false.
${Object.entries(CHECKS).map(([k, v]) => `- ${k}: ${v}`).join("\n")}
Reply ONLY with JSON: {${Object.keys(CHECKS).map((k) => `"${k}": true|false`).join(", ")}, "motivo": "<one short sentence about the worst problem, or empty>"}`;

const uri = (f) => "data:image/png;base64," + fs.readFileSync(f).toString("base64");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ki = Math.floor(Math.random() * 1000);
const T0 = Date.now(), TOPE = 20 * 60_000;   // agnes saturado (429 en todas las claves): a los 20 min lo que falta pasa con aviso
async function pedir(img, texto) {
  if (Date.now() - T0 > TOPE) return { _error: "tope de 20 min (agnes saturado)" };
  for (let intento = 0; intento < 9; intento++) {
    const key = KEYS[(ki++) % KEYS.length];
    try {
      const r = await fetch(API, {
        method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" }, signal: AbortSignal.timeout(120_000),
        body: JSON.stringify({ model: MODEL, temperature: 0, messages: [{ role: "user", content: [{ type: "text", text: texto }, { type: "image_url", image_url: { url: uri(img) } }] }] }),
      });
      const txt = await r.text();
      if (!r.ok) throw new Error(`${r.status} ${txt.slice(0, 120)}`);
      const m = (JSON.parse(txt).choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/);
      if (!m) throw new Error("sin JSON");
      return JSON.parse(m[0]);
    } catch (e) {
      if (intento === 8 || Date.now() - T0 > TOPE) return { _error: String(e.message).slice(0, 140) };
      await sleep((/429/.test(String(e.message)) ? 12000 : 3000) * (intento + 1));
    }
  }
}
const si = (v) => v === true || v === "true";
const items = JSON.parse(fs.readFileSync(LIST, "utf8"));
const res = {};
const cola = [...items];
await Promise.all(Array.from({ length: Math.min(4, cola.length) }, async () => {
  while (cola.length) {
    const it = cola.shift(), img = path.join(DIR, it.name + ".png");
    // dos opiniones: un defecto cuenta sólo si lo marcan las DOS (el juez a veces inventa; un defecto real se repite)
    const [a, b] = await Promise.all([pedir(img, Q(it)), pedir(img, Q(it))]);
    if (a._error && b._error) { res[it.name] = { ok: true, fallas: [], motivo: "sin respuesta del juez: " + a._error }; continue; }
    const x = a._error ? b : a, y = b._error ? a : b;
    const fallas = Object.keys(CHECKS).filter((k) => si(x[k]) && si(y[k]));
    res[it.name] = { ok: !fallas.length, fallas, motivo: fallas.length ? (x.motivo || y.motivo || "") : "" };
    console.log(`${fallas.length ? "✗" : "✓"} ${it.name} ${it.c}${fallas.length ? "  [" + fallas.join(",") + "] " + res[it.name].motivo : ""}`);
  }
}));
fs.writeFileSync(path.join(DIR, "juez.json"), JSON.stringify(res, null, 1));
const malas = Object.values(res).filter((r) => !r.ok).length;
console.log(`EDITOR: ${Object.keys(res).length} cuadros · ${malas} con defectos`);
process.exit(malas ? 1 : 0);
