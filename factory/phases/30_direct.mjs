// 30_direct — LO CREATIVO. Claude escribe la dirección (dir_*.json) en UNA pasada por tramo, sin subagentes.
// La fase: (a) si no hay dirección, arma DIRECTOR_PROMPT.md con TODO lo necesario y queda `needs`;
// (b) si hay, compone el plan con glosario/lugares/fórmula FIJOS del estilo y aplica las compuertas.
import fs from "node:fs";
import path from "node:path";
import { assertMeasured } from "../lib/gate.mjs";
import { compose } from "../lib/text.mjs";
import { NeedsError } from "../lib/phase.mjs";

export function directorPrompt({ slug, spec, style, mom, secs }) {
  const L = [];
  L.push(`# DIRECCIÓN — ${slug} (${style.nombre})`, "");
  L.push("Escribí la dirección plano por plano en `dir_A.json`, `dir_B.json`, … (≈60 momentos por archivo) en ESTA carpeta.",
    "UNA pasada por tramo, sin subagentes. Después: `node factory/run.mjs run " + slug + " --from 30_direct`.", "");
  L.push("## Reglas (no negociables)",
    "- Cada plano muestra lo que se dice EN ESE SEGUNDO (la frase del momento), con escena VIVA y ultradetalle.",
    "- Prompt de FOTO real, no de director de fotografía. Nada de fondo desenfocado. No pedir texto.",
    `- \`c: 1\` si aparece el presentador; la escena lo nombra con el token \`${style.presentadorToken}\`. \`c: 0\` si no aparece (y no lo nombra).`,
    "- Movimiento (`mo`) chico y físico. PROHIBIDO pedir respirar/breathing.",
    "- Mencionar un atributo en positivo invoca su cliché: describí objetos por GEOMETRÍA y usá claves de `glosario.json` para lo recurrente.",
    "- Toda frase de más de 7 s lleva un SEGUNDO plano `<n>x` (si no, queda un plano clavado).",
    spec.modo === "avatar" ? "- `p000` es `{\"n\":\"p000\",\"t\":\"avatar\"}` (el video abre con el avatar hablando). Avatar visible ≈25-30 % de los momentos, repartido." : "- Modo narrador: sin planos avatar.",
    "- Encuadres variados: close ≤20 %, wide ≥25 %. Racha máxima del mismo lugar ≤6.", "");
  L.push("## Formato", "```json", JSON.stringify([
    { n: "p000", t: "avatar", m: "presentador a cámara con el objeto en la mano" },
    { n: "p001", c: 1, e: "medium", l: Object.keys(style.lugares || {})[0] || "lugar", m: "qué muestra, en castellano", s: `${style.presentadorToken} crouching next to ... (escena en inglés, viva)`, mo: "his hand turns the object slowly, nothing else moves" },
    { n: "p001x", c: 0, e: "close", l: Object.keys(style.lugares || {})[0] || "lugar", m: "detalle", s: "close view of ...", mo: "a single drop slides down ..." },
  ], null, 1), "```", "");
  L.push(`## Lugares del estilo (\`l\`)`, ...Object.keys(style.lugares || {}).map((k) => `- \`${k}\``), "", "Si hace falta un lugar nuevo, agregalo en `factory/styles/" + spec.canal + ".json` (≥5 objetos concretos del fondo).", "");
  L.push("## Momentos", "| n | sec | dur s | dice |", "|---|---|---|---|");
  for (const m of mom) L.push(`| ${m.name} | ${secs.find((s) => m.i >= s.desde && m.i <= s.hasta)?.nombre || ""} | ${m.dur} | ${m.texto.replace(/\|/g, "/")} |`);
  return L.join("\n") + "\n";
}

export default {
  id: "30_direct",
  deps: ["20_asr"],
  inputs: ({ P, style }) => [P.mom, P.dirDir, style.lugares, style.presentador, style.formula],
  async run({ slug, spec, style, P, log }) {
    const mom = JSON.parse(fs.readFileSync(P.mom, "utf8"));
    const secsFile = path.join(path.dirname(P.mom), "secciones.json");
    const secs = fs.existsSync(secsFile) ? JSON.parse(fs.readFileSync(secsFile, "utf8")) : [];
    fs.mkdirSync(P.dirDir, { recursive: true });
    const files = fs.readdirSync(P.dirDir).filter((f) => /^dir_[A-Z]+\.json$/.test(f)).sort();
    if (!files.length) {
      const pf = path.join(P.dirDir, "DIRECTOR_PROMPT.md");
      fs.writeFileSync(pf, directorPrompt({ slug, spec, style, mom, secs }));
      throw new NeedsError("falta la DIRECCIÓN (lo creativo)", `Leé ${pf} y escribí dir_A.json… en ${P.dirDir}; después: node factory/run.mjs run ${slug} --from 30_direct`);
    }
    const tramos = files.flatMap((f) => JSON.parse(fs.readFileSync(path.join(P.dirDir, f), "utf8").replace(/^﻿/, "")));
    const gf = path.join(P.dirDir, "glosario.json");
    const glosario = fs.existsSync(gf) ? JSON.parse(fs.readFileSync(gf, "utf8")) : {};
    const r = compose({ mom, tramos, style, glosario, secs });
    for (const e of r.errores.slice(0, 20)) log("  ⛔ " + e);
    assertMeasured("direccionErrores", r.errores.length, { max: 0, allowZero: true, log });
    assertMeasured("momentosCubiertos", r.medido.cubiertos, { min: mom.length, total: mom.length, log });
    assertMeasured("frasesLargasSinSegundoPlano", r.sinX.length, { max: 0, allowZero: true, log });
    if (spec.modo === "avatar") {
      const p0 = r.plan.find((p) => p.name === "p000");
      if (p0?.tipo !== "avatar") throw new Error("p000 tiene que ser avatar (apertura con el avatar hablando)");
      assertMeasured("avatarPctMomentos", r.medido.avatarPctMomentos, { min: 10, max: 45, log });
    }
    assertMeasured("rachaMaxLugar", r.medido.rachaMaxLugar, { max: Number(style.rachaMaxLugar || 8), log });
    fs.writeFileSync(P.plan, JSON.stringify(r.plan, null, 1));
    return { archivosDireccion: files.length, ...r.medido };
  },
};
