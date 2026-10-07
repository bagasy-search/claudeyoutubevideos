// Retrato de Claudio el Albañil para el avatar (RunPod): cara de claudio_hd + vestuario FIJO del canal (remera naranja + cinta
// métrica), en la casa de Doña Marta (fondo de toda la serie), frontal, 1536x1024, low + Batch. Elegido → public/ref_<slug>.png
import fs from "node:fs";
import { submitBatch, pollBatch, fetchBatch } from "file:///C:/Users/bauti/Downloads/video2/factory/lib/openai_batch.mjs";
const OUT = "D:/Proyectos/video2-wt/almoho/out/ref";
fs.mkdirSync(OUT, { recursive: true });
const FACE = "C:/Users/bauti/Downloads/plan_red_claudio/claudio_hd.png";
const P = `A frame from a normal home-repair YouTube video: the man from the reference image (keep his exact face: black curly hair going gray, salt-and-pepper short beard, brown eyes, tanned weathered skin, same age) standing in the living room of an old modest Latin American house, chest-up, facing the camera straight on, eyes looking into the lens, mouth closed in a calm friendly expression, about to speak. He wears a bright orange crew-neck t-shirt with a little gray cement dust on it and a yellow tape measure clipped to his belt. Behind him: thick plastered walls painted pale mint green, a tall wooden window with white iron bars and a lace curtain letting in daylight, an old dark-wood sideboard with framed family photos. Bright even daylight on his face, both eyes clearly visible, real skin texture with pores, everything sharp from front to back, nothing blurred out, automatic white balance. Nothing in his hands, no text, no logos, no watermark.`;
const items = ["a", "b"].map((v) => ({ name: `ref_${v}`, prompt: P, ref: [FACE] }));
const st = `${OUT}/_b.json`;
let id = fs.existsSync(st) ? JSON.parse(fs.readFileSync(st)).id : null;
if (!id) { const s = await submitBatch({ items, outDir: OUT, size: "1536x1024", quality: "low" }); id = s.batchId; fs.writeFileSync(st, JSON.stringify({ id })); console.log("→", id); }
for (;;) {
  const p = await pollBatch(id);
  if (p.status === "completed") { const f = await fetchBatch({ batchId: id, outDir: OUT }); console.log("✓", f.ok, f.fail); break; }
  if (["failed", "expired", "cancelled"].includes(p.status)) { console.log("⛔", p.status); break; }
  console.log("…", p.status); await new Promise((r) => setTimeout(r, 20000));
}
