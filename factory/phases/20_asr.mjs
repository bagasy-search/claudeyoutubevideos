// 20_asr — Modal (default, medido más preciso) → respaldo OpenAI whisper-1 con chunk 600 FIJO en código
// (el arg posicional mal pasado dio 5 s y Whisper inventó frases en tcbriquetas) → detector de bucles del
// TTS → momentos → alineación global → secciones.
import fs from "node:fs";
import path from "node:path";
import { run } from "../lib/exec.mjs";
import { assertMeasured } from "../lib/gate.mjs";
import { withLease } from "../lib/lease.mjs";
import { ROOT } from "../lib/env.mjs";
import { detectarBucles } from "../lib/text.mjs";

export default {
  id: "20_asr",
  deps: ["10_voice", "15_frases"],
  inputs: ({ P }) => [P.wav, P.guion, P.frases],
  async run({ slug, spec, style, P, log }) {
    fs.mkdirSync(path.dirname(P.frases), { recursive: true });
    let motor = "modal";
    const tmp16k = path.join(ROOT, "public", `${slug}_16k.wav`);      // modal_whisper.py lo busca ahí
    try {
      fs.copyFileSync(P.wav16k, tmp16k);
      await withLease("modal", slug, 1, () => run("python", ["-m", "modal", "run", "modal_whisper.py", "--slug", slug, "--lang", spec.idioma, "--model", "medium"],
        { timeoutMs: 45 * 60_000, cwd: ROOT, env: { PYTHONUTF8: "1" }, expect: /✓\s*\d+\s*palabras/ }), { log });
    } catch (e) {
      log(`⚠️ Modal falló (${e.message.split("\n")[0].slice(0, 160)}) → respaldo OpenAI whisper-1`);
      motor = "openai";
      await run("node", ["scripts/asr_openai.mjs", P.wav16k, path.join(P.work, "plan", "asr_openai.json"), "600", spec.idioma, slug], { timeoutMs: 90 * 60_000, cwd: ROOT });
    } finally { try { fs.unlinkSync(tmp16k); } catch { /* C: se libera */ } }

    const caps = JSON.parse(fs.readFileSync(P.captions, "utf8"));
    const words = Array.isArray(caps) ? caps : caps.words || [];
    assertMeasured("asrPalabras", words.length, { min: 200, log });

    const guion = fs.readFileSync(P.guion, "utf8");
    const b = detectarBucles(guion, words.map((w) => w.text).join(" "));
    log(`bucles: palabras guion ${b.palabrasGuion} · asr ${b.palabrasAsr} · inflación ${b.inflacionPct}% · n-gramas repetidos ${b.bucles.length}`);
    for (const x of b.bucles.slice(0, 5)) log(`   ⛔ "${x.ngrama}" ×${x.asr} (guion ×${x.guion})`);
    assertMeasured("ttsBucles", b.bucles.length, { max: 0, allowZero: true, log });
    assertMeasured("asrInflacionPct", Math.max(0, b.inflacionPct), { max: 8, allowZero: true, log });

    // los momentos ya los armó 15_frases (la dirección trabaja sobre ellos en paralelo): acá sólo se anclan al ms
    const r = await run("python", [path.join(ROOT, "factory", "py", "align.py"), P.captions, P.frases, P.mom], { timeoutMs: 20 * 60_000, env: { PYTHONUTF8: "1" } });
    const al = JSON.parse(r.stdout.trim().split("\n").pop());
    assertMeasured("anclajeExactoPct", al.anclajeExactoPct, { min: 90, log });
    assertMeasured("alineacionDesorden", al.desorden, { max: 0, allowZero: true, log });
    assertMeasured("planoMaxSec", al.planoMaxSec, { max: 20, log });

    return { motor, palabras: words.length, inflacionPct: b.inflacionPct, ...al };
  },
};
