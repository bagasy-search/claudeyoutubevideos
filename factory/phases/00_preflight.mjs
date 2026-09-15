// 00_preflight — herramientas, disco, claves, saldo y guion ANTES de gastar un centavo.
import fs from "node:fs";
import { assertMeasured } from "../lib/gate.mjs";
import { diskFreeGB, runpodBalance, toolsPresent, BlockedError } from "../lib/budget.mjs";
import { env } from "../lib/env.mjs";

export default {
  id: "00_preflight",
  deps: [],
  inputs: (ctx) => [ctx.P.spec, ctx.spec.guion, Date.now() / 3600_000 | 0],   // se re-chequea cada hora
  async run({ spec, P, log }) {
    const tools = await toolsPresent();
    const faltanTools = Object.entries(tools).filter(([, v]) => !v).map(([k]) => k);
    if (faltanTools.length) throw new Error(`faltan herramientas: ${faltanTools.join(", ")}`);

    const minC = Number(env("FACTORY_MIN_C_GB") || 1), minD = Number(env("FACTORY_MIN_D_GB") || 3);
    const c = +(await diskFreeGB("C")).toFixed(2), d = +(await diskFreeGB("D")).toFixed(2);
    log(`disco libre C: ${c} GB · D: ${d} GB`);
    if (c < minC || d < minD) throw new BlockedError(`disco lleno (C: ${c} GB < ${minC} o D: ${d} GB < ${minD})`, { c, d });

    if (!fs.existsSync(spec.guion)) throw new Error(`no existe el guion ${spec.guion}`);
    const chars = fs.readFileSync(spec.guion, "utf8").trim().length;
    assertMeasured("guionChars", chars, { min: 1500, log });

    const claves = ["FISH_KEY", "OPENAI_API_KEY"];
    if (!env("AGNES_KEYS") && !env("AGNES_API_KEY")) claves.push("AGNES_KEYS");
    if (spec.modo === "avatar") claves.push("RUNPOD_API_KEY");
    const faltanClaves = claves.filter((k) => !env(k));
    if (faltanClaves.length) throw new BlockedError(`faltan claves en .env: ${faltanClaves.join(", ")}`);

    let runpodUsd = null;
    if (spec.modo === "avatar") {
      if (!fs.existsSync(spec.avatar.face)) throw new Error(`no existe la cara del avatar ${spec.avatar.face}`);
      const b = await runpodBalance();
      if (b.ok) {
        runpodUsd = b.usd;
        log(`RunPod saldo US$ ${b.usd.toFixed(2)}`);
        // un video puede necesitar 2 jobs (cap ~600 s) a US$0,25
        if (b.usd < 0.5) throw new BlockedError(`RunPod sin saldo suficiente (US$ ${b.usd.toFixed(2)} < 0,50 para 2 jobs)`, b);
      } else log(`⚠️ RunPod saldo DESCONOCIDO (${b.motivo}) — el primer 402 dejará la fase en blocked`);
    }
    log("⚠️ OpenAI no expone saldo con una key normal: el primer insufficient_quota deja 40_images en blocked (reanudable)");
    return { tools: Object.keys(tools).length, discoC_GB: c, discoD_GB: d, guionChars: chars, runpodUsd };
  },
};
