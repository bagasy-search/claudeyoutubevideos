// lamina.mjs — la ficha premium (gpt-image-2 LOW por BATCH, /v1/images/generations 1536x1024). n variantes.
// node vlog/tfbpintura/lamina.mjs <n> -> out/tfbpintura/lam/lamina_<i>.png
import fs from "fs";
const env = Object.fromEntries(fs.readFileSync(new URL("../../.env", import.meta.url), "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]));
const OA = "https://api.openai.com/v1", H = { Authorization: "Bearer " + env.OPENAI_API_KEY };
const N = +(process.argv[2] || 2), OUT = "out/tfbpintura/lam/"; fs.mkdirSync(OUT, { recursive: true });
const PROMPT = `A premium printed reference sheet from a home-repair handbook, photographed flat and filling the whole frame, landscape. Thick matte cream paper (#F1E4C9) with a subtle paper texture, dark espresso-brown ink (#2B1D14), rust-red accents (#8B2D22) and old-gold rules (#B1832F). Elegant large serif typography, generous margins, clear hierarchy, like a vintage craftsman's manual page. Small hand-drawn ink illustrations: a grey bucket with milky white liquid, a wide brush, a clear plastic jug, a jar of coarse salt, a pump sprayer.

Layout, top to bottom:
Top small caps line in gold: "LA COLECCIÓN DEL CONSTRUCTOR LIBRE · FICHA DE TALLER"
Big serif title in espresso: "PINTURA DE CAL QUE NO SE CAE"
Subtitle in rust italic: "Cal, cemento blanco, sal y agua"

Left column, heading in rust small caps "MATERIALES (todo con la misma jarra)", then four lines with small bullet icons:
"4 jarras de cal hidratada"
"1 jarra de cemento blanco"
"1 puñado de sal gruesa, disuelta en agua caliente"
"Agua: el doble que de polvo, hasta que quede como leche"

Middle column, heading in rust small caps "PASO A PASO", six numbered lines with large gold numerals:
"1. La noche anterior: remoja la cal y tápala."
"2. El día de pintar: suma la sal disuelta y el cemento."
"3. Cuela por un mosquitero y revuelve seguido."
"4. Pared limpia, mineral y mojada."
"5. Tres o cuatro manos finas y cruzadas."
"6. Curado: rocío de agua dos o tres días."

Right column, a rust-red bordered box with heading in bold rust small caps "LOS 3 ERRORES", three lines each with a small rust X mark:
"Pintar sobre pintura plástica"
"Una sola mano gruesa"
"Sol fuerte o pared seca"

Bottom thin gold rule and a small espresso footer line: "Gafas y guantes: la cal quema. Con cemento, úsala el mismo día."

Every word in SPANISH spelled EXACTLY as written, no invented words, no extra text; CRITICAL SPELLING: render every accent and the N-with-tilde exactly (COLECCIÓN, tápala, día, puñado, mosquitero, rocío, días, plástica).`;
const jsonl = Array.from({ length: N }, (_, i) => JSON.stringify({ custom_id: "lam" + i, method: "POST", url: "/v1/images/generations",
  body: { model: "gpt-image-2", prompt: PROMPT, size: "1536x1024", quality: "low", n: 1 } })).join("\n") + "\n";
const fd = new FormData(); fd.append("purpose", "batch"); fd.append("file", new Blob([jsonl], { type: "application/jsonl" }), "lam.jsonl");
const file = await (await fetch(OA + "/files", { method: "POST", headers: H, body: fd })).json();
let b = await (await fetch(OA + "/batches", { method: "POST", headers: { ...H, "Content-Type": "application/json" }, body: JSON.stringify({ input_file_id: file.id, endpoint: "/v1/images/generations", completion_window: "24h" }) })).json();
console.log("batch", b.id);
while (!["completed", "failed", "expired", "cancelled"].includes(b.status)) { await new Promise(r => setTimeout(r, 20000)); b = await (await fetch(OA + "/batches/" + b.id, { headers: H })).json(); console.log(b.status, JSON.stringify(b.request_counts)); }
if (b.status !== "completed") { console.error("NO MIDIÓ", JSON.stringify(b.errors)); process.exit(2); }
const txt = await (await fetch(`${OA}/files/${b.output_file_id}/content`, { headers: H })).text();
for (const ln of txt.split("\n").filter(Boolean)) {
  const r = JSON.parse(ln), d = r.response?.body?.data?.[0]?.b64_json;
  if (d) { fs.writeFileSync(OUT + "lamina_" + r.custom_id.slice(3) + ".png", Buffer.from(d, "base64")); console.log("OK", r.custom_id, JSON.stringify(r.response.body.usage)); }
  else console.log("FAIL", r.custom_id, JSON.stringify(r.response?.body?.error || r.error).slice(0, 200));
}
