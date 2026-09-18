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
  // 45_stock va ANTES: deja el metraje real en brollDir y `falta()` ya no manda esos planos a agnes
  // (sale más real y más barato). Cuando el estilo no es premium, 45_stock queda `skipped`, que para
  // el runner cuenta como hecha.
  deps: ["45_stock"],
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
      // `agnes_i2v.mjs` sale con 1 si falló ALGÚN clip, aunque hayan salido 305 de 307. Con el exit
      // mandando, la fase moría antes de llegar al QC y sin medir nada — cuando la que decide es la
      // compuerta `clipsHechosPct` (min 90), que cuenta archivos REALES en disco. El exit code es un
      // dato, no el veredicto: se registra y se sigue, y si de verdad faltan clips la compuerta frena.
      const rI2v = await withLease("agnes", slug, units, () => run("node", ["scripts/agnes_i2v.mjs", lista, slug, P.imgDir, P.brollDir],
        { cwd: ROOT, timeoutMs: 8 * 3600_000, allowFail: true, onLine: (l) => /✗|⛔|error|429|listo|===/i.test(l) && log(l.slice(0, 160)) }), { log });
      if (rI2v.code !== 0) log(`agnes_i2v salió con ${rI2v.code} (algún clip falló): decide la compuerta, no el exit`);
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
    // El QC sale con 1 cuando encuentra clips para rehacer: eso es un RESULTADO, no una falla del
    // proceso. Con el exit mandando, la fase moria antes de que `cuenta()` mirara el reporte y sin
    // imprimir un numero (medido en cmeamazon: 310/310 clips en disco y la fase en `failed`).
    // Si el QC se rompio de verdad, el reporte queda viejo o incompleto y las compuertas de abajo
    // (`clipsAprobados`, y el NeedsError de la revision a ojo) frenan igual. Decide la medicion.
    const qc = async (args = []) => {
      const r = await run("node", ["scripts/agnes_qc.mjs", slug, ...args], { cwd: ROOT, timeoutMs: 3 * 3600_000, allowFail: true, env: { QC_IMGDIR: P.imgDir, QC_CLIPDIR: P.brollDir } });
      if (r.code !== 0) log(`agnes_qc salió con ${r.code} (hay clips para rehacer): decide la compuerta, no el exit`);
      return r;
    };
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
