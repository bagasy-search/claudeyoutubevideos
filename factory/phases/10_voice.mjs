// 10_voice — Fish (bloques ≤1200: con 2500 metió "frase ×4" en tcbriquetas) → loudnorm 2 pasadas −14 LUFS
// → wav máster (D:) + m4a (public) + 16k para el ASR.
import fs from "node:fs";
import path from "node:path";
import { run, durSec } from "../lib/exec.mjs";
import { assertMeasured } from "../lib/gate.mjs";
import { withLease } from "../lib/lease.mjs";
import { ROOT, env } from "../lib/env.mjs";

const lastJson = (s) => JSON.parse([...s.matchAll(/\{[^{}]*\}/g)].pop()[0]);

export async function loudnorm(src, { wav, m4a, wav16k, log }) {
  fs.mkdirSync(path.dirname(wav), { recursive: true });
  const p1 = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { timeoutMs: 30 * 60_000 });
  const m = lastJson(p1.stderr);           // ⛔ loudnorm imprime en STDERR
  const af = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  await run("ffmpeg", ["-v", "error", "-y", "-i", src, "-af", af, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", wav], { timeoutMs: 30 * 60_000 });
  await run("ffmpeg", ["-v", "error", "-y", "-i", wav, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", m4a], { timeoutMs: 30 * 60_000 });
  await run("ffmpeg", ["-v", "error", "-y", "-i", wav, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav16k], { timeoutMs: 30 * 60_000 });
  const p3 = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", wav, "-af", "loudnorm=I=-14:print_format=json", "-f", "null", "-"], { timeoutMs: 30 * 60_000 });
  const lufs = Number(lastJson(p3.stderr).input_i);
  log(`loudnorm: entrada ${m.input_i} LUFS → final ${lufs} LUFS`);
  return lufs;
}

// ⛔⛔ LA IDENTIDAD DE LA VOZ NO ES SU NOMBRE: es la entrada de `fish_voices.json` a la que apunta.
//    Medido 20-sep-2026 en tdcfreno: `claudio_definitiva` se RE-CLONÓ de otra persona sin cambiar de
//    nombre, se corrió `reset 10_voice`, y la fase igual devolvió `fishSec 544.92` — el MISMO número
//    al centésimo que la voz vieja. El id no había cambiado, así que el hash de inputs daba igual, y
//    los b0NN.wav seguían en disco, así que `yaHabia` los dio por buenos: se re-concatenó el máster
//    VIEJO y todas las compuertas dieron verde con la voz equivocada. Se caza con una huella de los
//    refs (ruta + tamaño + mtime): si el clon cambió, cambia el hash Y se rehacen los bloques.
function huellaVoz(vozId) {
  try {
    const reg = JSON.parse(fs.readFileSync(path.join(ROOT, "fish_voices.json"), "utf8"))[vozId];
    if (!reg) return `sin-registro:${vozId}`;
    const refs = reg.refs || [reg];
    return refs.map((r) => {
      const w = path.join(ROOT, r.wav || "");
      const st = fs.existsSync(w) ? fs.statSync(w) : null;
      return `${r.wav}:${st ? st.size : 0}:${st ? Math.round(st.mtimeMs) : 0}`;
    }).join("|");
  } catch { return `ilegible:${vozId}`; }
}

export default {
  id: "10_voice",
  deps: ["00_preflight"],
  inputs: ({ spec, style }) => [spec.guion, spec.voz, style.fish, huellaVoz(spec.voz.id)],
  async run({ spec, style, P, log, slug }) {
    const blockChars = spec.voz.blockChars || style.fish?.blockChars || 1200;
    assertMeasured("fishBlockChars", blockChars, { min: 400, max: 1200, log });
    fs.mkdirSync(P.work, { recursive: true });
    fs.copyFileSync(spec.guion, P.guion);

    // La huella se guarda AL LADO de los bloques: si no coincide con la del registro de hoy, los
    // b0NN.wav son de otra voz y hay que rehacerlos aunque el máster y el manifest estén sanos.
    const huella = huellaVoz(spec.voz.id);
    const selloVoz = path.join(P.fishDir, "voz.json");
    const selloViejo = fs.existsSync(selloVoz) ? JSON.parse(fs.readFileSync(selloVoz, "utf8")).huella : null;
    let yaHabia = false;
    try { yaHabia = (await durSec(P.fishMaster)) > 10 && fs.existsSync(path.join(P.fishDir, "manifest.json")); } catch { /* no hay */ }
    if (yaHabia && selloViejo !== huella) {
      log(`la voz "${spec.voz.id}" cambió de clon desde que se generaron los bloques: se rehace la locución`);
      for (const f of fs.readdirSync(P.fishDir)) fs.rmSync(path.join(P.fishDir, f), { force: true, recursive: true });
      yaHabia = false;
    }
    if (!yaHabia) {
      await withLease("fish", slug, 1, () => run("python", [path.join(ROOT, "fish_factory.py"), "--script", P.guion, "--voice", spec.voz.id, "--out", P.fishDir, "--concurrency", "3", "--block-chars", String(blockChars)],
        { timeoutMs: 4 * 3600_000, cwd: ROOT, env: { PYTHONUTF8: "1", FISH_KEY: env("FISH_KEY") }, onLine: (l) => /bloque|block|master|ERROR|fail/i.test(l) && log(l.slice(0, 160)) }), { log });
    } else log("máster de Fish ya generado (manifest presente y misma voz): no se regenera");
    fs.writeFileSync(selloVoz, JSON.stringify({ voz: spec.voz.id, huella }, null, 1));

    const man = JSON.parse(fs.readFileSync(path.join(P.fishDir, "manifest.json"), "utf8"));
    const bloques = Object.values(man);
    const malos = bloques.filter((b) => b.status !== "ok").length;
    assertMeasured("fishBloquesOk", bloques.length - malos, { min: bloques.length, total: bloques.length, log });
    // COMPUERTA DEL BLOQUE LOOPEADO (18-sep-2026, medida en fboxidoropa). Fish a veces dice el bloque
    // y lo REPITE: b002 salió 148,3 s contra ~74 esperados (2,0×) y b008 129,5 s (1,8×). El ASR
    // después alinea 74 s de texto contra un wav del doble y reporta "oyó el 1 % de sus palabras",
    // que manda a buscar el problema al lado equivocado (se perdieron 3 rondas de regeneración).
    // ⛔ `fishBloquesOk` NO lo ve: un bloque que falla no llega a entrar al manifest, así que la
    //    compuerta cuenta sólo los que SÍ entraron y le dan todos ok. Por eso acá se miden los wav
    //    que hay EN DISCO, no el manifest. Los bloques se parten a ≤1200 chars en límite de frase,
    //    así que duran todos parecido: los sanos midieron 69-81 s (mediana ~75) y los looped 129-148.
    //    El corte en 1,4× la mediana separa limpio. Sólo se marca lo LARGO (el último bloque puede
    //    ser corto y eso es normal). Se cura regenerando ese bloque PARTIDO en dos mitades.
    const wavs = fs.readdirSync(P.fishDir).filter((f) => /^b\d+\.wav$/.test(f)).sort();
    const durs = [];
    for (const f of wavs) { try { durs.push({ f, d: await durSec(path.join(P.fishDir, f)) }); } catch { /* ignoro el ilegible */ } }
    if (durs.length >= 3) {
      const orden = durs.map((x) => x.d).sort((a, b) => a - b);
      const mediana = orden[Math.floor(orden.length / 2)];
      const largos = durs.filter((x) => x.d > 1.4 * mediana);
      for (const x of largos) log(`  ⛔ ${x.f}: ${x.d.toFixed(1)} s = ${(x.d / mediana).toFixed(2)}× la mediana (${mediana.toFixed(1)} s) — Fish lo repitió`);
      log(`  bloques en disco ${durs.length} · mediana ${mediana.toFixed(1)} s · el más largo ${Math.max(...orden).toFixed(1)} s`);
      assertMeasured("fishBloquesLooped", largos.length, { max: 0, allowZero: true, log });
    } else log(`  bloques en disco ${durs.length}: muy pocos para medir la mediana, no mido looped`);
    const fishSec = await durSec(P.fishMaster);
    assertMeasured("fishDurSec", Math.round(fishSec), { min: 60, log });

    const lufs = await loudnorm(P.fishMaster, { wav: P.wav, m4a: P.m4a, wav16k: P.wav16k, log });
    assertMeasured("lufs", Math.abs(lufs + 14), { max: 1, allowZero: true, unidad: " LU de desvío", log });
    const wavSec = await durSec(P.wav);
    return { blockChars, bloques: bloques.length, fishSec: +fishSec.toFixed(2), wavSec: +wavSec.toFixed(2), lufs };
  },
};
