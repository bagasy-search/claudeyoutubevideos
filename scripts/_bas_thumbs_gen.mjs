// Genera las 9 fotos de miniatura de Bastida con gpt-image-2 /edits en LOW.
// (La Batch API rebota en este org: "organization does not have access" sobre un archivo
//  propio ya procesado, incluso con 1 item. Se va directo; el ahorro real esta en low + ref 768.)
import fs from "node:fs";
import "dotenv/config";

const KEY = process.env.OPENAI_API_KEY;
const OUT = "_basthumbs/raw";
fs.mkdirSync(OUT, { recursive: true });

const items = JSON.parse(fs.readFileSync("_bas_thumbs.json", "utf8"));
const only = process.argv.slice(2);
const todo = items.filter((it) => (!only.length || only.includes(it.name)) && !fs.existsSync(`${OUT}/${it.name}.png`));
console.log(`generando ${todo.length}/${items.length}`);

const gen = async (it) => {
  const fd = new FormData();
  fd.set("model", "gpt-image-2");
  fd.set("prompt", it.prompt);
  fd.set("n", "1");
  fd.set("size", "1792x1008");
  fd.set("quality", "low");
  for (const r of it.ref) fd.append("image[]", new Blob([fs.readFileSync(r)], { type: "image/png" }), "ref.png");
  const res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${KEY}` }, body: fd });
  if (!res.ok) { console.error("✗", it.name, res.status, (await res.text()).slice(0, 200)); return; }
  const d = (await res.json()).data?.[0];
  const buf = d?.b64_json ? Buffer.from(d.b64_json, "base64") : Buffer.from(await (await fetch(d.url)).arrayBuffer());
  fs.writeFileSync(`${OUT}/${it.name}.png`, buf);
  console.log("✓", it.name, Math.round(buf.length / 1024), "KB");
};

await Promise.all(todo.map((it) => gen(it).catch((e) => console.error("✗", it.name, e.message))));
console.log("listo →", OUT);
