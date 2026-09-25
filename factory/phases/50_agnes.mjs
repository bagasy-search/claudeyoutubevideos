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

// AMBIENTE SONORO del clip (sólo con un modelo de agnes con audio: `overrides.agnesModelo`). Sale del
// LUGAR y de la luz del plano (el prompt ya dice si es de noche o de temporal): nada de voces.
const AMB = {
  taller_a: "a garage: faint electrical hum, a car passing on the street outside, the tick of cooling metal",
  taller_b: "a garage: faint electrical hum of a battery charger, distant traffic",
  banco: "a garage workbench: faint hum, small clicks of tools on wood, distant traffic",
  patio: "a small backyard: birds, a light breeze in the plants, distant neighbourhood traffic",
  techo: "an open rooftop: wind, distant city traffic, a dog barking far away",
  medidor: "a narrow passage: faint electrical buzz, distant street",
  ferreteria: "a small hardware store: quiet room tone, distant street traffic through the open door",
  tienda: "a small shop: quiet room tone, a fan humming, distant street",
  cocina: "a home kitchen: the soft hum of a refrigerator, a clock ticking",
  living: "a quiet living room: soft room tone, a fan humming, distant street",
  entrada: "a driveway at dusk: crickets starting, a distant car",
  cuarto: "a quiet bedroom: soft room tone, a distant dog",
  calle: "a residential street: distant traffic, a dog barking far away",
};
function sonidoDe(p, style) {
  const pr = p.prompt || "";
  if (style.formulas?.gris && pr.includes(style.formulas.gris.slice(0, 40))) return "steady rain falling, water running from gutters, distant thunder";
  if (style.formulas?.noche && pr.includes(style.formulas.noche.slice(0, 40))) return "a quiet night during a power cut: crickets outside, very faint wind, total silence of appliances";
  return AMB[p.lugar] || "quiet realistic room tone";
}

export default {
  id: "50_agnes",
  // 45_stock va ANTES: deja el metraje real en brollDir y `falta()` ya no manda esos planos a agnes
  // (sale más real y más barato). Cuando el estilo no es premium, 45_stock queda `skipped`, que para
  // el runner cuenta como hecha.
  deps: ["45_stock"],
  inputs: ({ P }) => [P.plan, P.imgDir, P.brollDir, path.join(ROOT, "_v3", `${P.slug}_agnes_qc.json`)],
  async run({ slug, P, spec, style, log }) {
    const plan = JSON.parse(fs.readFileSync(P.plan, "utf8")).filter((p) => p.tipo === "imagen" && !p.quieto);   // `quieto` = foto con Ken-Burns, no va a agnes
    const i2v = plan.map((p) => ({ nombre: p.name, person: p.motor === "gpt" || !!p.gente, pres: p.motor === "gpt", gente: !!p.gente,
      change: "The scene stays exactly as it is. No cut, no new place, no camera move.", motion: p.motion,
      ...(style.agnesModelo ? { sonido: sonidoDe(p, style) } : {}) }));
    if (!i2v.length) { log("0 planos animados (el director los marco todos quietos): agnes no corre"); return { planos: 0, clips: 0, aprobados: 0 }; }
    const sinMotion = i2v.filter((x) => !x.motion).map((x) => x.nombre);
    assertMeasured("i2vSinMovimiento", sinMotion.length, { max: 0, allowZero: true, log });
    fs.mkdirSync(P.listas, { recursive: true });
    const lista = path.join(P.listas, "i2v.json");
    fs.writeFileSync(lista, JSON.stringify(i2v, null, 1));
    // agnes_qc / agnes_qc_gate (compartidos) leen el registro de clips de acá
    fs.mkdirSync(path.join(ROOT, "_v3"), { recursive: true });
    fs.writeFileSync(path.join(ROOT, "_v3", `${slug}_i2v.json`), JSON.stringify(i2v, null, 1));
    fs.mkdirSync(P.brollDir, { recursive: true });

    // Los que el QC a ojo pasó a FOTO QUIETA (`removed`: reincidieron o terminan en negro) no faltan:
    // regenerarlos acá deshacía la decisión de la revisión y volvía a gastar cola (cmenino, 22 planos).
    let removidos = new Set();
    try { const q = JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${slug}_agnes_qc.json`), "utf8")).clips || {}; removidos = new Set(Object.keys(q).filter((n) => q[n].removed)); } catch {}
    if (removidos.size) log(`${removidos.size} planos pasados a foto quieta por el QC a ojo (no se regeneran)`);
    const falta = () => i2v.filter((x) => !removidos.has(x.nombre) && !fs.existsSync(path.join(P.brollDir, `${x.nombre}.mp4`)));
    // ⭐ MEZCLA POR PLANO (25-sep-2026, regla del creador): `overrides.agnesFlash = {"p104": "sonido", …}`
    //    manda SÓLO esos planos a agnes-video-2.5-flash (gratis, AUDIO nativo, hasta 12 s) y el resto
    //    a v2.0 (~7 clips/min). Todo flash son ~6 h por video (la cola gratis de flash rinde ~0,7/min).
    //    Los de flash corren ANTES (en paralelo sería competir por la misma cuenta) y quedan en brollDir:
    //    la corrida v2.0 los saltea porque ya existen. La duración = la del momento (4-12 s).
    const flashSel = spec.overrides?.agnesFlash || {};
    const flashNames = Object.keys(flashSel).filter((n) => i2v.some((x) => x.nombre === n));
    if (!style.agnesModelo && flashNames.length) {
      const durDe = (n) => { try { const m = JSON.parse(fs.readFileSync(P.mom, "utf8")).find((mm) => mm.name === n.replace(/x$/, "")); return m ? (m.end - m.start || m.dur) : 6; } catch { return 6; } };
      const fl = i2v.filter((x) => flashNames.includes(x.nombre) && !fs.existsSync(path.join(P.brollDir, `${x.nombre}.mp4`)))
        .map((x) => ({ ...x, sonido: flashSel[x.nombre], secs: Math.ceil(durDe(x.nombre) + 0.5) }));
      if (fl.length) {
        const listaF = path.join(P.listas, "i2v_flash.json");
        fs.writeFileSync(listaF, JSON.stringify(fl, null, 1));
        log(`flash con sonido: ${fl.length} planos (${fl.map((x) => `${x.nombre}:${x.secs}s`).join(" ")})`);
        const rF = await withLease("agnes", slug, CAPACIDAD.agnes(), () => run("node", ["scripts/agnes_i2v.mjs", listaF, slug, P.imgDir, P.brollDir],
          { cwd: ROOT, timeoutMs: 8 * 3600_000, allowFail: true, env: { AG_MODEL: "agnes-video-2.5-flash" }, onLine: (l) => /✗|⛔|error|429|listo|===|voz/i.test(l) && log(l.slice(0, 160)) }), { log });
        if (rF.code !== 0) log(`agnes flash salió con ${rF.code}: los que falten van por v2.0 (mudos)`);
      }
    }
    if (falta().length) {
      const units = CAPACIDAD.agnes();
      // `agnes_i2v.mjs` sale con 1 si falló ALGÚN clip, aunque hayan salido 305 de 307. Con el exit
      // mandando, la fase moría antes de llegar al QC y sin medir nada — cuando la que decide es la
      // compuerta `clipsHechosPct` (min 90), que cuenta archivos REALES en disco. El exit code es un
      // dato, no el veredicto: se registra y se sigue, y si de verdad faltan clips la compuerta frena.
      const rI2v = await withLease("agnes", slug, units, () => run("node", ["scripts/agnes_i2v.mjs", lista, slug, P.imgDir, P.brollDir],
        { cwd: ROOT, timeoutMs: 8 * 3600_000, allowFail: true, env: style.agnesModelo ? { AG_MODEL: style.agnesModelo } : undefined, onLine: (l) => /✗|⛔|error|429|listo|===/i.test(l) && log(l.slice(0, 160)) }), { log });
      if (rI2v.code !== 0) log(`agnes_i2v salió con ${rI2v.code} (algún clip falló): decide la compuerta, no el exit`);
    }
    const hechos = i2v.length - falta().length;
    log(`clips ${hechos}/${i2v.length} (throughput de referencia ≈7 clips/min)`);
    assertMeasured("clipsHechosPct", Math.round((100 * hechos) / i2v.length), { min: 90, log });

    const qcFile = path.join(ROOT, "_v3", `${slug}_agnes_qc.json`);
    const leer = () => (fs.existsSync(qcFile) ? JSON.parse(fs.readFileSync(qcFile, "utf8")).clips || {} : {});
    // ⛔ Un plano cuyo mp4 en disco es METRAJE REAL no lo anima agnes aunque esté en la lista de i2v
    //    (45_stock corre ANTES y deja el clip de Pexels en su lugar). Sin esta resta, el QC de agnes
    //    nunca le va a poner sello — porque no lo revisa — y la fase queda pidiendo para siempre una
    //    "revisión a ojo" de 33 clips que no son de agnes (medido en fbdeterg, 18-sep-2026).
    let realStock = new Set();
    try { realStock = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, "_v3", `${slug}_stock.json`), "utf8")))); } catch {}
    const cuenta = () => {
      const c = leer();
      const nombres = i2v.map((x) => x.nombre).filter((n) => !realStock.has(n) && fs.existsSync(path.join(P.brollDir, `${n}.mp4`)));
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
