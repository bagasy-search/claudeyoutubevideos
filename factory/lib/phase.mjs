// phase.mjs — contrato de fase + errores de control de flujo.
//
// Una fase es { id, deps, applies?(ctx), inputs(ctx) → [...], run(ctx) → medido }.
//   · tira NeedsError   → espera algo creativo/humano (queda `needs`, con instrucciones exactas)
//   · tira BlockedError → falta plata/disco/cupo (queda `blocked`, reanudable)
//   · cualquier otra    → `failed`
export { BlockedError } from "./budget.mjs";

export class NeedsError extends Error {
  constructor(motivo, instrucciones) { super(motivo); this.name = "NeedsError"; this.instrucciones = instrucciones; }
}

export const logger = (slug, fase) => (...a) => console.log(`[${new Date().toTimeString().slice(0, 8)}] ${slug}·${fase}`, ...a);

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Pool de concurrencia simple. */
export async function pool(items, n, fn) {
  const out = new Array(items.length);
  let k = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (k < items.length) { const i = k++; out[i] = await fn(items[i], i); }
  }));
  return out;
}
