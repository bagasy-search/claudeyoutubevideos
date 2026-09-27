// lámina tfbpiedra: gpt-image-2 LOW por Batch, 1536x1024 (texto legible a pantalla completa). node lamina.mjs [--fetch]
import { submitBatch, pollBatch, fetchBatch } from "../../../factory/lib/openai_batch.mjs";
import fs from "node:fs";
const OUT = "D:/Proyectos/video2-wt/tfbpiedra/vlog/tfbpiedra/lamina";
const P = `A premium printed reference sheet, landscape, in the exact visual style of a vintage engraved handyman guide: warm cream paper colour #F1E4C9 with a subtle paper texture, dark espresso-brown ink, rust red #8B2D22 accents, antique gold #B1832F thin ornamental rules and small corner flourishes, large elegant serif headings, clean hand-engraved line illustrations with fine cross-hatching. Flat, straight-on, the whole sheet fills the image edge to edge. Generous margins, impeccable hierarchy, everything aligned on a clear grid.
TOP, small caps in gold, centred: "LA COLECCIÓN DEL CONSTRUCTOR LIBRE · FICHA". Below it the big serif title in espresso: "PISO DE PIEDRA LAVADA", and under it in rust italic: "Paso a paso, con manguera y cepillo".
FOUR PANELS in a row, each with a rust numbered circle and a serif heading:
Panel 1 heading "LAS CAPAS": an engraved cross-section of the ground: bottom layer of soil, then a hatched gravel layer labelled "Grava compactada · 10 cm", then a top concrete layer dotted with round pebbles labelled "Concreto con piedra · 8 a 10 cm". A small arrow along the top labelled "Pendiente: 1 cm por metro".
Panel 2 heading "LA MEZCLA": three identical engraved buckets in a row labelled "1 cemento", "2 arena", "3 piedra de río"; below, a small note: "Agua justa: espesa, que no chorree".
Panel 3 heading "LA PRUEBA DEL PUNTO": three small engraved circular vignettes of a brush on a concrete corner, labelled "TEMPRANO · la piedra se mueve", "JUSTO · sale la pasta, la piedra firme" (this one highlighted with a gold ring and a check mark), "TARDE · la pasta no sale". Below: "Se prueba en una esquina, no con el reloj."
Panel 4 heading "EL LAVADO": an engraved hand with a soft brush under a fine shower of water from a hose nozzle, pebbles appearing; notes: "Lluvia fina + cepillo suave" and "Destapar 1/3 de la piedra"; a small line below: "Curado: húmedo y tapado 7 días".
BOTTOM BAND across the full width, rust red heading "LOS 3 ERRORES" with three items separated by gold dots, each with a small rust X: "Lavar antes de tiempo", "Mucha agua en la mezcla", "El agua del lavado al desagüe".
No other text anywhere, no logos, no page numbers, no people's faces. Every word in SPANISH spelled EXACTLY as written, no invented words; CRITICAL SPELLING: render every accent and the N-with-tilde exactly: COLECCIÓN, río, única, Agua, así.`;
const items = [{ name: "lamina_a", prompt: P }, { name: "lamina_b", prompt: P }];
const st = OUT + "/_batch.json";
if (!fs.existsSync(st)) { const r = await submitBatch({ items, outDir: OUT, size: "1536x1024", quality: "low" }); fs.writeFileSync(st, JSON.stringify(r)); console.log("batch", r.batchId); }
const { batchId } = JSON.parse(fs.readFileSync(st, "utf8"));
for (;;) { const b = await pollBatch(batchId); console.log(new Date().toISOString().slice(11, 19), b.status, JSON.stringify(b.request_counts || {})); if (b.status === "completed") break; if (["failed", "expired", "cancelled"].includes(b.status)) throw new Error(b.status); await new Promise(r => setTimeout(r, 20000)); }
await fetchBatch({ batchId, outDir: OUT, onLog: console.log });
console.log("listo");
