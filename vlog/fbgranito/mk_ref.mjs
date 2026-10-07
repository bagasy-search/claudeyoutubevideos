// Retrato del presentador de El Constructor Libre para el avatar (RunPod): cara de claudio_hd +
// vestuario FIJO del canal (camisa verde oliva + delantal de cuero), frontal, 1536x1024, low + Batch.
import fs from "node:fs";
import { submitBatch, pollBatch, fetchBatch } from "file:///C:/Users/bauti/Downloads/video2/factory/lib/openai_batch.mjs";
const OUT = "D:/Proyectos/video2-wt/fbgranito/out/ref";
fs.mkdirSync(OUT, { recursive: true });
const FACE = "C:/Users/bauti/Downloads/plan_claudio_conserje/avatar/claudio_hd.png";
const ROPA = "C:/Users/bauti/Downloads/manual-reparaciones-caseras/public/img/tomas.jpg";
const P = `A frame from a normal home-workshop YouTube video: the man from the FIRST image (keep his exact face: black curly hair, salt-and-pepper short beard, brown eyes, tanned weathered skin) sitting at a sturdy wooden workbench, chest-up, facing the camera straight on, eyes looking into the lens, mouth closed in a calm friendly expression, about to speak. He wears the clothes of the SECOND image: a worn olive-green work shirt with rolled sleeves and a worn brown leather apron. Behind him a bright tidy masonry workshop: sacks of cement, a trowel and a level hanging on a pegboard, buckets, a window with daylight. Bright even daylight on his face, both eyes clearly visible, real skin texture with pores, everything sharp from front to back, nothing blurred out, automatic white balance. Nothing in his hands, no text, no logos, no watermark.`;
const items = ["a", "b"].map((v) => ({ name: `ref_${v}`, prompt: P, ref: [FACE, ROPA] }));
const st = `${OUT}/_b.json`;
let id = fs.existsSync(st) ? JSON.parse(fs.readFileSync(st)).id : null;
if (!id) { const s = await submitBatch({ items, outDir: OUT, size: "1536x1024", quality: "low" }); id = s.batchId; fs.writeFileSync(st, JSON.stringify({ id })); console.log("→", id); }
for (;;) {
  const p = await pollBatch(id);
  if (p.status === "completed") { const f = await fetchBatch({ batchId: id, outDir: OUT }); console.log("✓", f.ok, f.fail); break; }
  if (["failed", "expired", "cancelled"].includes(p.status)) { console.log("⛔", p.status); break; }
  console.log("…", p.status); await new Promise((r) => setTimeout(r, 20000));
}
