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
import { sitiosDeBucle, bloquesGarbled } from "../lib/voz.mjs";
import { assertNoProblems } from "../lib/gate.mjs";

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
    // ⛔ el conteo de n-gramas SOLAPADOS infla 20× un solo tramo repetido (medido: t=1140,6 s daba 20):
    // la compuerta va sobre SITIOS distintos, y cada uno se imprime con su segundo.
    const sitios = sitiosDeBucle(words);
    log(`bucles: palabras guion ${b.palabrasGuion} · asr ${b.palabrasAsr} · inflación ${b.inflacionPct}% · sitios de bucle ${sitios.length} (n-gramas solapados ${b.bucles.length})`);
    for (const s of sitios.slice(0, 5)) log(`   ⛔ t=${s.segundo}s ×${s.veces} :: "${s.texto}"`);
    assertMeasured("ttsBucles", sitios.length, { max: 0, allowZero: true, log });

    // ── salud POR BLOQUE del máster de Fish ────────────────────────────────────────────────
    // fish_factory sólo caza el loop por DURACIÓN; el bloque GARBLED sale con el largo correcto.
    // Acá se atribuyen las palabras del ASR a cada bloque por su ventana de tiempo y se regeneran
    // SÓLO los malos (el proveedor falla al azar: validar el máster entero no converge nunca).
    const manPath = path.join(P.fishDir, "manifest.json");
    if (fs.existsSync(manPath)) {
      const man = JSON.parse(fs.readFileSync(manPath, "utf8"));
      const sal = bloquesGarbled({ words, manifest: man, palabrasGuion: b.palabrasGuion });
      const rondasP = path.join(P.fishDir, "_rondas.json");
      const rondas = fs.existsSync(rondasP) ? JSON.parse(fs.readFileSync(rondasP, "utf8")) : { n: 0 };
      if (sal.malos.length && rondas.n < 3) {
        for (const m of sal.malos) {
          try { fs.unlinkSync(path.join(P.fishDir, `${m.bloque}.wav`)); } catch { /* ya no está */ }
          delete man[m.bloque];
        }
        fs.writeFileSync(manPath, JSON.stringify(man, null, 1));
        for (const f of [P.fishMaster, P.wav, P.wav16k, path.join(P.fishDir, "concat.txt")]) { try { fs.unlinkSync(f); } catch { /* ya no está */ } }
        try { fs.unlinkSync(path.join(P.state, "10_voice.json")); } catch { /* ya no está */ }
        fs.writeFileSync(rondasP, JSON.stringify({ n: rondas.n + 1, ultimos: sal.malos.map((m) => m.bloque) }));
        log(`ronda ${rondas.n + 1}/3: regenero sólo ${sal.malos.map((m) => m.bloque).join(",")} — volvé a correr y 10_voice rehace ESOS bloques`);
      }
      assertNoProblems("bloquesGarbled", sal.malos.map((m) => `${m.bloque} [${m.desde}-${m.hasta}s] ${m.motivos.join(" · ")}`), sal.inspeccionados, { log });
      try { fs.unlinkSync(rondasP); } catch { /* limpio al cerrar */ }
    }
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
