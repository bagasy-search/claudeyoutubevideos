// Retrato de Claudio el FUMIGADOR para el avatar (RunPod): cara de claudio_hd + vestuario FIJO del canal (camisa caqui de dos
// bolsillos + anteojos de seguridad en la frente), en la cocina de los Ramírez (fondo de toda la serie), frontal, 1536x1024, low + Batch.
import fs from "node:fs";
import { submitBatch, pollBatch, fetchBatch } from "file:///C:/Users/bauti/Downloads/video2/factory/lib/openai_batch.mjs";
const OUT = "D:/Proyectos/video2-wt/fuagua/out/ref";
fs.mkdirSync(OUT, { recursive: true });
const FACE = "C:/Users/bauti/Downloads/plan_red_claudio/claudio_hd.png";
const P = `A frame from a normal home pest-control YouTube video: the man from the reference image (keep his exact face: black curly hair going gray, salt-and-pepper short beard, brown eyes, tanned weathered skin, same age) standing in the kitchen of a modest Latin American family house, chest-up, facing the camera straight on, eyes looking into the lens, mouth closed in a calm friendly expression, about to speak. He wears a light khaki short-sleeve work shirt with two buttoned chest pockets and clear safety glasses pushed up on his forehead above his hair line. Behind him: white wall tiles with a blue-and-white patterned tile strip, a speckled gray granite counter, wooden kitchen cabinets, an older white refrigerator with children's crayon drawings held by magnets, a window over the sink letting in daylight. Bright even daylight on his face, both eyes clearly visible, real skin texture with pores, everything sharp from front to back, nothing blurred out, automatic white balance. Nothing in his hands, no text, no logos, no watermark.`;
const items = ["a", "b", "c"].map((v) => ({ name: `ref_${v}`, prompt: P, ref: [FACE] }));
const st = `${OUT}/_b.json`;
let id = fs.existsSync(st) ? JSON.parse(fs.readFileSync(st)).id : null;
if (!id) { const s = await submitBatch({ items, outDir: OUT, size: "1536x1024", quality: "low" }); id = s.batchId; fs.writeFileSync(st, JSON.stringify({ id })); console.log("→", id); }
for (;;) {
  const p = await pollBatch(id);
  if (p.status === "completed") { const f = await fetchBatch({ batchId: id, outDir: OUT }); console.log("✓", f.ok, f.fail); break; }
  if (["failed", "expired", "cancelled"].includes(p.status)) { console.log("⛔", p.status); break; }
  console.log("…", p.status); await new Promise((r) => setTimeout(r, 20000));
}
