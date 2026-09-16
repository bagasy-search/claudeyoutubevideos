// 50_agnes — clips i2v por el camino ÚNICO (scripts/agnes_i2v.mjs, ralentí 60→30) + control único
// (scripts/agnes_qc.mjs). La decisión de calidad es a OJO sobre la hoja (medido: el juez automático no
// decide): la fase deja `needs` con la hoja y el comando exacto, y re-corrida retoma sin regenerar.
import fs from "node:fs";
import path from "node:path";
import { run } from "../lib/exec.mjs";
import { assertMeasured } from "../lib/gate.mjs";
import { withLease, CAPACIDAD } from "../lib/lease.mjs";
import { NeedsError } from "../lib/phase.mjs";
import { ROOT } from "../lib/env.mjs";

export default {
  id: "50_agnes",
  deps: ["40_images"],
  inputs: ({ P }) => [P.plan, P.imgDir, P.brollDir, path.join(ROOT, "_v3", `${P.slug}_agnes_qc.json`)],
  async run({ slug, P, log }) {
    const plan = JSON.parse(fs.readFileSync(P.plan, "utf8")).filter((p) => p.tipo === "imagen");
    const i2v = plan.map((p) => ({ nombre: p.name, person: p.motor === "gpt" || !!p.gente, pres: p.motor === "gpt", gente: !!p.gente,
      change: "The scene stays exactly as it is. No cut, no new place, no camera move.", motion: p.motion }));
    const sinMotion = i2v.filter((x) => !x.motion).map((x) => x.nombre);
    assertMeasured("i2vSinMovimiento", sinMotion.length, { max: 0, allowZero: true, log });
    fs.mkdirSync(P.listas, { recursive: true });
    const lista = path.join(P.listas, "i2v.json");
    fs.writeFileSync(lista, JSON.stringify(i2v, null, 1));
    // agnes_qc / agnes_qc_gate (compartidos) leen el registro de clips de acá
    fs.mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
    fs.writeFileSync(path.join(ROOT, "_v3", `${slug}_i2v.json`), JSON.stringify(i2v, null, 1));
    fs.mkdirSync(P.brollDir, { recursive: true });

    const falta = () => i2v.filter((x) => !fs.existsSync(path.join(P.brollDir, `${x.nombre}.mp4`)));
    if (falta().length) {
      const units = CAPACIDAD.agnes();
      await withLease("agnes", slug, units, () => run("node", ["scripts/agnes_i2v.mjs", lista, slug, P.imgDir, P.brollDir],
        { cwd: ROOT, timeoutMs: 8 * 3600_000, onLine: (l) => /✗|⛔|error|429|listo|===/i.test(l) && log(l.slice(0, 160)) }), { log });
    }
    const hechos = i2v.length - falta().length;
    log(`clips ${hechos}/${i2v.length} (throughput de referencia ≈7 clips/min)`);
    assertMeasured("clipsHechosPct", Math.round((100 * hechos) / i2v.length), { min: 90, log });

    const qcFile = path.join(ROOT, "_v3", `${slug}_agnes_qc.json`);
    const leer = () => (fs.existsSync(qcFile) ? JSON.parse(fs.readFileSync(qcFile, "utf8")).clips || {} : {});
    const cuenta = () => {
      const c = leer();
      const nombres = i2v.map((x) => x.nombre).filter((n) => fs.existsSync(path.join(P.brollDir, `${n}.mp4`)));
      const st = { total: nombres.length, pendientes: 0, rechazados: 0, ok: 0 };
      for (const n of nombres) { const r = c[n]; if (!r || !r.revisado) st.pendientes++; else if (!r.ok || r.removed) st.rechazados++; else st.ok++; }
      return st;
    };
    const qc = (args = []) => run("node", ["scripts/agnes_qc.mjs", slug, ...args], { cwd: ROOT, timeoutMs: 3 * 3600_000, env: { QC_IMGDIR: P.imgDir, QC_CLIPDIR: P.brollDir } });
    let st = cuenta();
    if (st.rechazados) { log(`${st.rechazados} rechazados → --fix`); await qc(["--fix"]); st = cuenta(); }
    if (st.pendientes) {
      await qc();
      st = cuenta();
      if (st.pendientes) {
        throw new NeedsError(`${st.pendientes} clips de agnes esperan la revisión A OJO`,
          `Mirá las hojas en D:/rtmp/${slug}_agnesqc_hojas y registrá: node scripts/agnes_qc.mjs ${slug} --revision "ninguno"  (o "p015:motivo;p079:motivo"); después: node factory/run.mjs run ${slug} --from 50_agnes`);
      }
    }
    assertMeasured("clipsAprobados", st.ok, { min: st.total, total: st.total, log });
    return { planos: i2v.length, clips: hechos, aprobados: st.ok };
  },
};
