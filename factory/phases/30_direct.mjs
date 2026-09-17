// 30_direct — LO CREATIVO. Claude escribe la dirección (dir_*.json) en UNA pasada por tramo, sin subagentes.
// La fase: (a) si no hay dirección, arma DIRECTOR_PROMPT.md con TODO lo necesario y queda `needs`;
// (b) si hay, compone el plan con glosario/lugares/fórmula FIJOS del estilo y aplica las compuertas.
import fs from "node:fs";
import path from "node:path";
import { assertMeasured, assertNoProblems } from "../lib/gate.mjs";
import { compose } from "../lib/text.mjs";
import { NeedsError } from "../lib/phase.mjs";
import { cargarKit, LECTURA, validarComp, ajustarComp } from "../lib/kit.mjs";
import { ROOT } from "../lib/env.mjs";

export function directorPrompt({ slug, spec, style, mom, secs }) {
  const L = [];
  L.push(`# DIRECCIÓN — ${slug} (${style.nombre})`, "");
  L.push("Escribí la dirección plano por plano en `dir_A.json`, `dir_B.json`, … (≈60 momentos por archivo) en ESTA carpeta.",
    "UNA pasada por tramo, sin subagentes. Después: `node factory/run.mjs run " + slug + " --from 30_direct`.", "");
  L.push("## Reglas (no negociables)",
    "- Cada plano muestra lo que se dice EN ESE SEGUNDO (la frase del momento), con escena VIVA y ultradetalle.",
    "- Prompt de FOTO real, no de director de fotografía. Nada de fondo desenfocado. No pedir texto.",
    `- \`c: 1\` si aparece el presentador; la escena lo nombra con el token \`${style.presentadorToken}\`. \`c: 0\` si no aparece (y no lo nombra).`,
    "- Movimiento (`mo`): CUANTO MÁS SIMPLE, MEJOR. agnes no razona: si le pedís una acción con varios",
    "  pasos o que algo \"siga\" pasando, la inventa mal — y sale un objeto moviéndose solo, derritiéndose,",
    "  multiplicándose o desapareciendo. MEDIDO (17-sep, cmeamazon): 14 planos con movimiento continuo",
    "  dieron 36 % de defecto duro contra 23 % del resto del video. Regla: UNA sola cosa se mueve, POCO,",
    "  y es la que una mano ya está tocando. Si no hay nada que pueda moverse creíble, pedí un acercamiento",
    "  lento de cámara al objeto, que es inerte y no da lugar a que invente.",
    "  ⛔ PROHIBIDO en `mo`: que algo se caiga, aparezca, desaparezca, se multiplique, se derrame, se",
    "  desenrolle, pase páginas solo, \"siga\" o \"siga y siga\" haciendo algo, o respirar/breathing.",
    "- Mencionar un atributo en positivo invoca su cliché: describí objetos por GEOMETRÍA y usá claves de `glosario.json` para lo recurrente.",
    "- Toda frase de más de 7 s lleva un SEGUNDO plano `<n>x` (si no, queda un plano clavado).",
    spec.modo === "avatar" ? "- `p000` es `{\"n\":\"p000\",\"t\":\"avatar\"}` (el video abre con el avatar hablando). Avatar visible ≈25-30 % de los momentos, repartido." : "- Modo narrador: sin planos avatar.",
    "- Encuadres variados: close ≤20 %, wide ≥25 %. Racha máxima del mismo lugar ≤6.", "");
  L.push("## Formato", "```json", JSON.stringify([
    { n: "p000", t: "avatar", m: "presentador a cámara con el objeto en la mano" },
    { n: "p001", c: 1, e: "medium", l: Object.keys(style.lugares || {})[0] || "lugar", m: "qué muestra, en castellano", s: `${style.presentadorToken} crouching next to ... (escena en inglés, viva)`, mo: "his hand turns the object slowly, nothing else moves" },
    { n: "p001x", c: 0, e: "close", l: Object.keys(style.lugares || {})[0] || "lugar", m: "detalle", s: "close view of ...", mo: "a single drop slides down ..." },
  ], null, 1), "```", "");
  if (style.guia?.temas?.length) {
    L.push("## La guía del canal (lo que el CTA puede prometer)",
      "Sólo se promete lo que ESTÁ en la guía. Si el guion menciona un remedio/receta que no está en esta lista, NO lo vendas como parte de la guía (caso castorglove: el ricino no estaba).",
      ...style.guia.temas.map((t) => `- ${t}`), style.guia.landing ? `Landing: ${style.guia.landing}` : "", "");
  }
  if ((style.montaje || "vlog-crudo") === "premium") {
    const kit = cargarKit(path.join(ROOT, "factory", "styles", "premium"));
    // el `|` de los enums parte la tabla markdown en la que el director lee las firmas
    const esc = (t) => t.replaceAll("|", "\\|");
    const firma = (d) => [
      ...Object.entries(d.req || {}).map(([k, t]) => `${k}: ${esc(t)}`),
      ...Object.entries(d.opt || {}).filter(([k]) => !["startAt", "stagger", "perWord"].includes(k)).map(([k, t]) => `${k}?: ${esc(t)}`),
    ].join(", ");
    L.push("## Componentes del kit (`k`) — la edición premium",
      "Un momento puede llevar UN componente: `\"k\": { \"kind\": \"VsCard\", \"props\": { ... } }`.",
      "Se dibuja sobre ESE momento y dura lo que dura la frase (o `\"durS\": 6`).",
      "- Los que dicen OVERLAY se dibujan ENCIMA del plano (sirven sobre el avatar). Los demás TAPAN la pantalla:",
      "  nunca los pongas en un momento de avatar, porque cuentan como avatar tapado y la compuerta falla.",
      `- Máximo ${LECTURA.maxPalabras} palabras de texto visible por componente, y tiene que haber tiempo de leerlo`,
      `  (~${LECTURA.palabrasPorSeg} palabras/s + ${LECTURA.colchonSeg}s). Un componente NO es un párrafo: es un remate.`,
      "- ⛔ Las props de color (`accent`, `hue`, `impactAccent`, `tone`) son VALORES DEL KIT, no palabras del guion:",
      "  una palabra suelta ahí deja el texto NEGRO sobre el velo, sin error.",
      "- ⛔ No inventes props: las que no están en la firma se ignoran en silencio y el dato no se ve.",
      "- `startAt`/`stagger` NO los pongas: los calcula la fábrica según el hueco real.",
      "- Un componente por momento (dos se pisan). Apuntá a que ~1 de cada 8-10 momentos lleve uno.",
      "",
      "| kind | | props |", "|---|---|---|",
      ...Object.entries(kit.kinds).map(([k, d]) => `| \`${k}\` | ${d.overlay ? "OVERLAY" : "tapa" } | ${firma(d)} |`),
      "",
      "Tipos de los arrays: " + Object.entries(kit.tipos).map(([n, t]) =>
        `\`${n}\` {${[...Object.entries(t.req || {}).map(([k, v]) => `${k}: ${esc(v)}`), ...Object.entries(t.opt || {}).map(([k, v]) => `${k}?: ${esc(v)}`)].join(", ")}}`).join(" · "),
      "");
  }
  L.push(`## Lugares del estilo (\`l\`)`, ...Object.keys(style.lugares || {}).map((k) => `- \`${k}\``), "", "Si hace falta un lugar nuevo, agregalo en `factory/styles/" + spec.canal + ".json` (≥5 objetos concretos del fondo).", "");
  L.push("## Momentos", "| n | sec | dur s | dice |", "|---|---|---|---|");
  for (const m of mom) L.push(`| ${m.name} | ${secs.find((s) => m.i >= s.desde && m.i <= s.hasta)?.nombre || ""} | ${m.dur} | ${m.texto.replace(/\|/g, "/")} |`);
  return L.join("\n") + "\n";
}

export default {
  id: "30_direct",
  // sobre los momentos ESTIMADOS del guion (15_frases): no espera la voz ni el ASR (mismos nombres pNNN)
  deps: ["15_frases"],
  // ⛔ el contrato del kit y las reglas de dialecto son ENTRADA: si cambian, la dirección se revalida.
  //   (Sin esto, endurecer una compuerta no rehace las direcciones ya compuestas: quedan "frescas".)
  inputs: ({ P, style }) => [P.frases, P.dirDir, style.lugares, style.presentador, style.formula, style.dialecto,
    ...((style.montaje || "vlog-crudo") === "premium"
      ? ["kit.json", "../../lib/kit.mjs", "../../lib/dialecto.mjs"].map((f) => path.join(ROOT, "factory", "styles", "premium", f))
      : [])],
  async run({ slug, spec, style, P, log }) {
    const mom = JSON.parse(fs.readFileSync(P.frases, "utf8"));
    const secsFile = path.join(path.dirname(P.frases), "secciones.json");
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

    // ⛔ Los COMPONENTES se validan ACÁ, no en 60_build: en el build ya se pagaron las imágenes, los
    //    clips y el avatar, y un texto sin tilde o una prop inventada obliga a rehacer el montaje.
    //    Acá todavía no se gastó un peso. (La duración definitiva la ajusta el build sobre el hueco REAL.)
    if ((style.montaje || "vlog-crudo") === "premium") {
      const kit = cargarKit(path.join(ROOT, "factory", "styles", "premium"));
      const momBy = new Map(mom.map((m) => [m.name, m]));
      const probComp = [];
      for (const p of r.plan) {
        if (!p.comp) continue;
        const dónde = `${p.name}/${p.comp.kind}`;
        const malas = validarComp(kit, p.comp.kind, p.comp.props, dónde);
        if (malas.length) { probComp.push(...malas); continue; }
        if (!kit.kinds[p.comp.kind].overlay && p.tipo === "avatar") probComp.push(`${dónde}: TAPA la pantalla sobre un momento de AVATAR (usá uno OVERLAY o movelo)`);
        // sólo lo que NO depende del hueco: texto, tildes, largo. El tiempo lo resuelve el build.
        const aj = ajustarComp(kit, p.comp.kind, p.comp.props, Math.round((momBy.get(p.name)?.dur || 5) * 30), 30);
        probComp.push(...aj.problemas.filter((x) => !/no se alcanza a leer|no entran/.test(x)).map((x) => `${p.name}: ${x}`));
      }
      assertNoProblems("contratoComponentes", probComp, r.plan.filter((p) => p.comp).length, { log });
      log(`  componentes................ ${r.medido.comps} (1 cada ${Math.round(mom.length / Math.max(1, r.medido.comps))} momentos)`);
    }

    fs.writeFileSync(P.plan, JSON.stringify(r.plan, null, 1));
    return { archivosDireccion: files.length, ...r.medido };
  },
};
