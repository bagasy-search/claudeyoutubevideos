// 40_images — gpt-image-2 por Batch (con cara → /edits con la ref; sin cara → /generations).
// Los batch ids se PERSISTEN: un corte no vuelve a pagar un batch ya enviado.
import fs from "node:fs";
import path from "node:path";
import { run } from "../lib/exec.mjs";
import { assertMeasured } from "../lib/gate.mjs";
import { withLease } from "../lib/lease.mjs";
import { submitBatch, pollBatch, fetchBatch } from "../lib/openai_batch.mjs";
import { pool, sleep } from "../lib/phase.mjs";

export default {
  id: "40_images",
  deps: ["30_direct"],
  inputs: ({ P, style, spec }) => [P.plan, style.imagen, spec.avatar?.ref || spec.avatar?.face || null],
  // Cuenta los jpg que el plan exige. Devuelve null si está completa, o el texto del faltante.
  verify: ({ P }) => {
    const plan = JSON.parse(fs.readFileSync(P.plan, "utf8"));
    const quiere = plan.filter((p) => p.tipo !== "avatar").length;
    const hay = fs.existsSync(P.imgDir) ? fs.readdirSync(P.imgDir).filter((f) => f.endsWith(".jpg")).length : 0;
    return hay >= quiere ? null : `${hay} jpg de ${quiere}`;
  },
  async run({ slug, spec, style, P, log }) {
    const plan = JSON.parse(fs.readFileSync(P.plan, "utf8")).filter((p) => p.tipo === "imagen");
    assertMeasured("planosImagen", plan.length, { min: 1, log });
    const motorSin = style.imagen?.motorSinCara || "gptsin";
    if (motorSin !== "gptsin") throw new Error(`motor sin cara "${motorSin}" todavía no está en la fábrica (sólo gptsin). Ver PLAN_FABRICA §7.`);
    const ref = spec.avatar?.ref || spec.avatar?.face;
    const conCara = plan.filter((p) => p.motor === "gpt");
    if (conCara.length && !(ref && fs.existsSync(ref))) throw new Error(`${conCara.length} planos con presentador y no hay ref de cara (spec.avatar.ref/face)`);
    const listas = {
      edits: conCara.map((p) => ({ name: p.name, prompt: p.prompt, ref })),
      gens: plan.filter((p) => p.motor !== "gpt").map((p) => ({ name: p.name, prompt: p.prompt })),
    };
    fs.mkdirSync(P.listas, { recursive: true });
    fs.mkdirSync(P.imgDir, { recursive: true });
    const bfile = path.join(P.listas, "batches.json");
    const batches = fs.existsSync(bfile) ? JSON.parse(fs.readFileSync(bfile, "utf8")) : {};
    const faltaJpg = (it) => !fs.existsSync(path.join(P.imgDir, `${it.name}.jpg`));
    const size = style.imagen?.size || "1088x608", quality = style.imagen?.quality || "low";

    await withLease("openai_batch", slug, 1, async () => {
      for (const [k, items] of Object.entries(listas)) {
        const pend = items.filter(faltaJpg);
        if (!pend.length) continue;
        if (!batches[k] || batches[k].fetched) {
          const s = await submitBatch({ items: pend, outDir: P.pngDir, size, quality });
          if (s.batchId) { batches[k] = { id: s.batchId, n: s.n, ts: Date.now() }; fs.writeFileSync(bfile, JSON.stringify(batches, null, 1)); log(`batch ${k}: ${s.batchId} (${s.n} imágenes)`); }
        }
        if (!batches[k]) continue;
        for (;;) {
          const st = await pollBatch(batches[k].id);
          log(`batch ${k} ${st.status} ${JSON.stringify(st.counts)}`);
          if (st.status === "completed") break;
          if (["failed", "expired", "cancelled"].includes(st.status)) { delete batches[k]; fs.writeFileSync(bfile, JSON.stringify(batches, null, 1)); throw new Error(`batch ${k} ${st.status}: ${JSON.stringify(st.errors || {}).slice(0, 200)}`); }
          await sleep(90_000);
        }
        const f = await fetchBatch({ batchId: batches[k].id, outDir: P.pngDir, onLog: log });
        log(`batch ${k}: ok ${f.ok} · fail ${f.fail}`);
        batches[k].fetched = true; fs.writeFileSync(bfile, JSON.stringify(batches, null, 1));
      }
    }, { log });

    // png → jpg 1920x1080 (el build y agnes leen jpg; JPG no PNG: reference_broll_jpg_no_png)
    const todos = [...listas.edits, ...listas.gens];
    await pool(todos.filter(faltaJpg), 6, async (it) => {
      const png = path.join(P.pngDir, `${it.name}.png`);
      if (!fs.existsSync(png)) return;
      await run("ffmpeg", ["-v", "error", "-y", "-i", png, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "2", path.join(P.imgDir, `${it.name}.jpg`)], { timeoutMs: 120_000 });
    });
    const hechas = todos.filter((it) => !faltaJpg(it)).length;
    const faltan = todos.filter(faltaJpg).map((i) => i.name);
    if (faltan.length) log(`faltan: ${faltan.slice(0, 20).join(", ")} (re-correr la fase las vuelve a pedir)`);
    assertMeasured("imagenesHechas", hechas, { min: todos.length, total: todos.length, log });
    return { planos: todos.length, conCara: listas.edits.length, sinCara: listas.gens.length, hechas, usdEstimado: +(listas.edits.length * 0.00207 + listas.gens.length * 0.00169).toFixed(2) };
  },
};
