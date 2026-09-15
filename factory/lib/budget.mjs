// budget.mjs — plata y disco ANTES de arrancar una fase paga, no a mitad.
//
// Medido: castorglove y facrema81 murieron con `insufficient_quota` a mitad de las imágenes; fcscanas
// arrancó con saldo negativo en Vast; C: y D: al 100 % en 5 videos.
// Lo que se puede consultar por API se consulta; lo que NO (OpenAI no expone saldo con una key normal)
// se marca "desconocido" a la vista y la fase trata el primer `insufficient_quota` como BLOCKED
// (estado recuperable), nunca como un crash que deja todo a medias.
import fs from "node:fs";
import { env } from "./env.mjs";
import { run } from "./exec.mjs";

export async function diskFreeGB(letterOrPath) {
  const p = letterOrPath.length === 1 ? `${letterOrPath}:/` : letterOrPath;
  const st = await fs.promises.statfs(p);
  return (st.bavail * st.bsize) / 1024 ** 3;
}

export async function runpodBalance({ fetchImpl = fetch } = {}) {
  const key = env("RUNPOD_API_KEY");
  if (!key) return { ok: false, motivo: "falta RUNPOD_API_KEY en .env" };
  try {
    const r = await fetchImpl("https://api.runpod.io/graphql", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ query: "query { myself { clientBalance } }" }), signal: AbortSignal.timeout(20_000),
    });
    const j = await r.json();
    const b = j?.data?.myself?.clientBalance;
    return typeof b === "number" ? { ok: true, usd: b } : { ok: false, motivo: `respuesta sin saldo: ${JSON.stringify(j).slice(0, 160)}` };
  } catch (e) { return { ok: false, motivo: e.message }; }
}

export async function fishCredit({ fetchImpl = fetch } = {}) {
  const key = env("FISH_KEY");
  if (!key) return { ok: false, motivo: "falta FISH_KEY" };
  try {
    const r = await fetchImpl("https://api.fish.audio/wallet/self/api-credit", { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(20_000) });
    if (!r.ok) return { ok: false, motivo: `HTTP ${r.status}` };
    const j = await r.json();
    return { ok: true, credit: Number(j.credit ?? j.balance ?? NaN), raw: j };
  } catch (e) { return { ok: false, motivo: e.message }; }
}

export const esSinCredito = (txt) => /insufficient_quota|billing_hard_limit_reached|exceeded your current quota|402 Payment Required|insufficient balance/i.test(txt || "");

export class BlockedError extends Error {
  constructor(motivo, detalle) { super(motivo); this.name = "BlockedError"; this.detalle = detalle; }
}

/** Chequeo de herramientas locales que toda fase asume. */
export async function toolsPresent(tools = ["ffmpeg", "ffprobe", "gh", "node", "python"]) {
  const out = {};
  for (const t of tools) {
    try { await run(t, [t === "python" ? "--version" : t === "gh" ? "--version" : t === "node" ? "-v" : "-version"], { timeoutMs: 20_000 }); out[t] = true; }
    catch { out[t] = false; }
  }
  return out;
}
