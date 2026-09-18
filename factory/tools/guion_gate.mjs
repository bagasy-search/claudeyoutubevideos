// guion_gate.mjs — COMPUERTA DEL GUION, antes de gastar un centavo en voz/imágenes.
// Mide lo que el creador prohibió expresamente y lo que rompe el clon de voz.
//   node factory/tools/guion_gate.mjs <slug|ruta.txt> [--canal <estilo>]
//
// Exit 0 = limpio (puede haber AVISOS) · 1 = FALLAS duras · 2 = NO MIDIÓ.
// ⛔ Regla de la casa: una compuerta que dice "0 sin mirar" es un FALLO. Ésta imprime SIEMPRE
//    cuánto midió por patrón, aunque el veredicto sea verde.
// ⛔ Y la lección de la 1ª versión de este archivo: un detector con falsos positivos es PEOR que
//    ninguno, porque manda a reescribir texto sano. Marcaba `más`, `estás` y `después` como voseo
//    (son neutro perfecto: "vos estás" y "tú estás" se escriben igual) y cazaba `pasá` adentro de
//    "pasándole" porque en JS `\b` NO funciona pegado a una vocal acentuada — hay que usar
//    lookarounds de \p{L} con la bandera /u. Por eso las formas voseantes van por LISTA CERRADA.
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/env.mjs";
import { loadStyle, loadSpec } from "../lib/spec.mjs";
import { VOSEO_VERBO, VOSEO_IMPER, REGIONAL, SIN_TILDE } from "../lib/dialecto.mjs";

const PAL = (arr) => new RegExp(`(?<!\\p{L})(?:${arr.join("|")})(?!\\p{L})`, "giu");

// FALLAS duras vs AVISOS que necesitan ojo humano (una palabra sola no dice el contexto).
const COMERCIAL = [
  { re: PAL(["gratis", "gratuito", "gratuita", "sin cargo", "de regalo"]), què: "dice GRATIS", duro: false,
    nota: "revisá el contexto: si habla de la GUÍA es falla; si habla de otra cosa (p.ej. 'la paciencia es gratis') no lo es" },
  { re: /(?<!\p{L})\$\s?\d+|(?<!\p{L})\d+\s?(?:d[óo]lares|USD)(?!\p{L})/giu, què: "dice un PRECIO en voz alta", duro: false,
    nota: "el bonus se LLAMA 'El Taller de $50': eso es su nombre, no el precio del producto. Cualquier otra cifra sí es falla" },
  { re: PAL(["punto com", "doble ve", "hache te te pe", "arroba", "guion bajo"]), què: "deletrea un LINK en voz alta", duro: true },
];

function main() {
  const arg = process.argv[2];
  if (!arg) { console.error("uso: node factory/tools/guion_gate.mjs <slug|ruta.txt> [--canal <estilo>]"); process.exit(2); }
  const iC = process.argv.indexOf("--canal");
  let canal = iC > 0 ? process.argv[iC + 1] : null;
  let file = arg;
  if (!arg.endsWith(".txt")) {
    try { const spec = loadSpec(arg); file = spec.guion; canal = canal || spec.canal; }
    catch { file = path.join(ROOT, `GUION_${arg}.txt`); }
  }
  if (!fs.existsSync(file)) { console.error(`✗ NO MIDIÓ: no existe ${file}`); process.exit(2); }
  const txt = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
  if (txt.trim().length < 500) { console.error(`✗ NO MIDIÓ: ${file} tiene ${txt.length} chars`); process.exit(2); }

  let style = null;
  if (canal) { try { style = loadStyle(canal); } catch { console.error(`✗ NO MIDIÓ: no existe el estilo ${canal}`); process.exit(2); } }

  const frases = txt.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
  const fallas = [], avisos = [];
  const linea = (i) => txt.slice(0, i).split(/\n/).length;
  const ctx = (i, n = 50) => "…" + txt.slice(Math.max(0, i - 14), i + n).replace(/\s+/g, " ") + "…";

  const cps = style?.fish?.cps || 15;
  console.log(`guion ${path.basename(file)} · ${txt.length} chars · ${frases.length} bloques` +
    (style ? ` · ${canal} (${cps} cps → ~${(txt.length / cps / 60).toFixed(1)} min)` : ""));

  const medir = (re, què, dest, nota) => {
    const hits = [...txt.matchAll(re)];
    console.log(`  ${què.padEnd(34, ".")} ${hits.length}`);
    for (const m of hits.slice(0, 8)) dest.push(`línea ${linea(m.index)}: ${què} "${m[0].trim()}" ${ctx(m.index)}`);
    if (hits.length > 8) dest.push(`  …y ${hits.length - 8} más de "${què}"`);
    if (hits.length && nota) dest.push(`  ↳ ${nota}`);
    return hits.length;
  };

  if (/NEUTRO/i.test(style?.dialecto || "")) {
    medir(VOSEO_VERBO, "voseo (verbo)", fallas);
    medir(VOSEO_IMPER, "voseo (imperativo)", fallas);
    medir(REGIONAL, "palabra muy regional", fallas);
    medir(SIN_TILDE, "palabra sin tilde", avisos, "en el guion no se ve, pero si esa frase termina en un componente sí");
  } else console.log("  dialecto.......................... (el estilo no lo pide neutro)");

  for (const c of COMERCIAL) medir(c.re, c.què, c.duro ? fallas : avisos, c.nota);
  medir(/(?<!\p{L})(?:Bauti|Bautista|Morán|Moran)(?!\p{L})/gu, "nombre personal del creador", fallas);

  if (style?.cta?.regex) {
    const re = new RegExp(style.cta.regex, "m");
    const ok = frases.some((f) => re.test(f));
    console.log(`  ancla del CTA de cierre........... ${ok ? "✓" : "✗"}`);
    if (!ok) fallas.push(`ninguna frase EMPIEZA con /${style.cta.regex}/: el CTA de cierre no se va a poder anclar`);
  }

  console.log(`\n${fallas.length ? "✗" : "✓"} ${fallas.length} fallas · ${avisos.length ? avisos.filter((a) => !a.startsWith("  ")).length : 0} avisos para mirar`);
  for (const p of fallas.slice(0, 30)) console.log(`  ✗ ${p}`);
  if (fallas.length > 30) console.log(`  …y ${fallas.length - 30} fallas más`);
  for (const p of avisos.slice(0, 20)) console.log(`  ⚠ ${p}`);
  process.exit(fallas.length ? 1 : 0);
}

main();
