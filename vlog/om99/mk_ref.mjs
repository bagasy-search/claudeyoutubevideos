// Retrato de CLAUDIO OLD MECHANIC para el avatar (RunPod): cara de claudio_hd + vestuario FIJO del canal (camisa azul marino de
// mecánico, mangas arremangadas, trapo rojo), en su taller (fondo de toda la serie), frontal, 1536x1024, low + Batch.
import fs from "node:fs";
import { submitBatch, pollBatch, fetchBatch } from "file:///C:/Users/bauti/Downloads/video2/factory/lib/openai_batch.mjs";
const OUT = "D:/Proyectos/video2-wt/om99/out/ref";
fs.mkdirSync(OUT, { recursive: true });
const FACE = "C:/Users/bauti/Downloads/plan_claudio_mecanico/claudio_hd.png";
const P = `A frame from a normal car-care YouTube video: the man from the reference image (keep his exact face: black curly hair going gray, salt-and-pepper short beard, brown eyes, tanned weathered skin, same age) standing in his small independent auto repair shop, chest-up, facing the camera straight on, eyes looking into the lens, mouth closed in a calm friendly expression, about to speak. He wears a navy blue mechanic's work shirt with the sleeves rolled up to the elbows and a red shop rag hanging over one shoulder, a little black grease on one finger. Behind him: the big roll-up door open to daylight, red rolling tool chests, a two-post lift with a silver sedan raised on it, a pegboard of wrenches, a concrete floor with old oil stains. Bright even daylight on his face, both eyes clearly visible, real skin texture with pores, everything sharp from front to back, nothing blurred out, automatic white balance. Nothing in his hands, no text, no logos, no watermark.`;
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
