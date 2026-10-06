// gate.mjs — compuertas FAIL-CLOSED.
//
// Regla (reference_compuertas_que_avisan_que_no_miran): una compuerta que puede dar "0 problemas" sin
// haber mirado nada es un FALLO. Casos reales: density_gate leyendo frames como segundos, luma=0 por
// leer stdout, `ya estaban N` sin generar, farm "success" con 0 clips.
//
// Toda compuerta: (1) declara la UNIDAD en el nombre (durSec / durFrames / n / pct), (2) imprime SIEMPRE
// cuánto midió y sobre cuánto, (3) tira si la medición es vacía/0/NaN salvo `allowZero` explícito.
export class GateError extends Error {
  constructor(msg, detail) { super(msg); this.name = "GateError"; this.detail = detail; }
}

const vacio = (v) => v === undefined || v === null || (typeof v === "number" && !Number.isFinite(v)) || (Array.isArray(v) && v.length === 0);

/**
 * assertMeasured(nombre, valor, { min, max, total, allowZero, unidad, log })
 * → devuelve el registro { nombre, medido, total, min, max, ok } o TIRA GateError.
 */
export function assertMeasured(nombre, valor, opts = {}) {
  const { min, max, total, allowZero = false, unidad = "", log = console.log } = opts;
  const medido = Array.isArray(valor) ? valor.length : valor;
  const sobre = total !== undefined ? ` sobre ${total}` : "";
  const rango = `${min !== undefined ? `min ${min}` : ""}${min !== undefined && max !== undefined ? " · " : ""}${max !== undefined ? `max ${max}` : ""}`;
  const rec = { nombre, medido, total, min, max, unidad, ok: false };
  if (vacio(valor)) {
    log(`GATE ${nombre}: midió=NADA${sobre} ⛔ (medición vacía: la compuerta no miró)`);
    throw new GateError(`${nombre}: medición vacía — la compuerta no miró nada`, rec);
  }
  if (typeof medido !== "number" || Number.isNaN(medido)) {
    log(`GATE ${nombre}: midió=${String(medido)} ⛔ (no es número)`);
    throw new GateError(`${nombre}: la medición no es un número (${String(medido)})`, rec);
  }
  if (medido === 0 && !allowZero) {
    log(`GATE ${nombre}: midió=0${unidad}${sobre} ⛔ (0 sin allowZero = no miró)`);
    throw new GateError(`${nombre}: midió 0 — sin allowZero eso es no haber mirado`, rec);
  }
  if (total !== undefined && !(total > 0)) {
    log(`GATE ${nombre}: midió=${medido}${unidad} sobre total=${total} ⛔ (total vacío)`);
    throw new GateError(`${nombre}: total=${total}, no hay universo medido`, rec);
  }
  const bajo = min !== undefined && medido < min;
  const alto = max !== undefined && medido > max;
  rec.ok = !bajo && !alto;
  log(`GATE ${nombre}: midió=${medido}${unidad}${sobre}${rango ? ` (${rango})` : ""} ${rec.ok ? "✓" : "⛔"}`);
  if (!rec.ok) throw new GateError(`${nombre}: ${medido}${unidad} fuera de rango (${rango})`, rec);
  return rec;
}

/**
 * Compuerta de CONTEO DE PROBLEMAS: "0 problemas" sólo vale si se inspeccionaron N>0 elementos.
 * assertNoProblems(nombre, problemas[], inspeccionados)
 */
export function assertNoProblems(nombre, problemas, inspeccionados, { log = console.log } = {}) {
  if (!(inspeccionados > 0)) {
    log(`GATE ${nombre}: inspeccionó=0 ⛔ ("0 problemas" sin mirar nada)`);
    throw new GateError(`${nombre}: inspeccionó 0 elementos`, { nombre, inspeccionados });
  }
  const ok = problemas.length === 0;
  log(`GATE ${nombre}: inspeccionó=${inspeccionados} · problemas=${problemas.length} ${ok ? "✓" : "⛔"}`);
  for (const p of problemas.slice(0, 12)) log(`   ⛔ ${p}`);
  if (!ok) throw new GateError(`${nombre}: ${problemas.length} problemas — ${problemas.slice(0, 3).join(" | ")}`, { nombre, inspeccionados, problemas });
  return { nombre, inspeccionados, problemas: 0, ok: true };
}

/** Acumula registros de varias compuertas sin cortar en la primera (para GATES.md). */
export class GateReport {
  constructor() { this.rows = []; }
  check(nombre, fn) {
    try { const r = fn(); this.rows.push({ nombre, ok: true, ...(r || {}) }); return true; }
    catch (e) { this.rows.push({ nombre, ok: false, error: e.message }); return false; }
  }
  get ok() { return this.rows.length > 0 && this.rows.every((r) => r.ok); }
  markdown(titulo = "GATES") {
    const L = [`# ${titulo}`, "", `Resultado: **${this.ok ? "✓ PASA" : "⛔ NO PASA"}** (${this.rows.filter((r) => r.ok).length}/${this.rows.length})`, "", "| Compuerta | Estado | Medido | Detalle |", "|---|---|---|---|"];
    for (const r of this.rows) L.push(`| ${r.nombre} | ${r.ok ? "✓" : "⛔"} | ${r.medido ?? r.inspeccionados ?? ""}${r.total !== undefined ? ` / ${r.total}` : ""} | ${(r.error || "").replace(/\|/g, "/").slice(0, 200)} |`);
    return L.join("\n") + "\n";
  }
}
