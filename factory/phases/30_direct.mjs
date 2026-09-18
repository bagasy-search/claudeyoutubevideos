// 30_direct — LO CREATIVO. Claude escribe la dirección (dir_*.json) en UNA pasada por tramo, sin subagentes.
// La fase: (a) si no hay dirección, arma DIRECTOR_PROMPT.md con TODO lo necesario y queda `needs`;
// (b) si hay, compone el plan con glosario/lugares/fórmula FIJOS del estilo y aplica las compuertas.
import fs from "node:fs";
import path from "node:path";
import { assertMeasured } from "../lib/gate.mjs";
import { compose } from "../lib/text.mjs";
import { NeedsError } from "../lib/phase.mjs";
import { cargarKit, docKit } from "../lib/kit.mjs";
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
    // La tabla se GENERA del mismo kit.json que después valida el build: así el prompt no puede
    // prometerle al director una prop que el componente no tiene.
    const kit = cargarKit(path.join(ROOT, "factory", "styles", "premium"));
    L.push("## Componentes del kit (`k`) — la edición premium",
      'Un momento puede llevar UN componente: `"k": { "kind": "VsCard", "props": { ... } }`.',
      'Se dibuja sobre ESE momento y dura lo que dura la frase (o `"durS": 6`).',
      "- Los que dicen OVERLAY se dibujan ENCIMA del plano (sirven sobre el avatar). Los demás TAPAN la pantalla:",
      "  nunca los pongas en un momento de avatar, porque cuentan como avatar tapado y la compuerta falla.",
      "- Máximo 12 palabras en UN bloque de texto. Un componente NO es un párrafo: es un remate.",
      "- ⛔ Las props de color (`accent`, `hue`, `impactAccent`, `tone`) son VALORES DEL KIT, no palabras del guion:",
      "  una palabra suelta ahí deja el texto NEGRO sobre el velo, sin error.",
      "- ⛔ No inventes props: las que no están en la firma se ignoran en silencio y el dato no se ve.",
      "- `startAt`/`stagger` NO los pongas: los calcula la fábrica según el hueco real.",
      "- Un componente por momento (dos se pisan). Apuntá a que ~1 de cada 8-10 momentos lleve uno.", "",
      docKit(kit), "");
    L.push("## Metraje REAL de stock (`st`) — opcional por plano",
      'Un plano puede pedir METRAJE REAL de Pexels en vez de imagen IA: `"st": "consulta en INGLÉS"`.',
      "La regla del canal es ≥25 % de metraje real, porque la IA se delata justo en las acciones.", "",
      "⛔ MEDIDO el 17-sep-2026 sobre 61 consultas de fbmarmol: la tasa de acierto fue del 40 %, y el patrón",
      "es NÍTIDO. Pexels tiene mucho material de obra y casi nada de lo demás:",
      "  ✅ ACIERTAN (marcá tranquilo): hormigón y cemento (verter, mezclar, mezcladora), llana/fratás/regla,",
      "     mármol y piedra pulida, fisuras y superficie porosa, pavimento y baldosas, revoque, taladro, obra.",
      "  ⛔ FALLAN casi siempre (NO las marques): metáforas y abstracciones (un reloj, burbujas de gaseosa,",
      "     crema batida, humo, aceite de cocina, pigmento de colores, agua de río), objetos genéricos de casa",
      "     (envases, cinta de embalar, un trapo), y todo lo que diga sólo \"sand\" o \"water\" sin material de obra:",
      "     traen playas, heladerías, tapitas y festivales de colores. Un stock off-topic es PEOR que la imagen IA.", "",
      "- ⛔ NUNCA en un plano con `c:1` ni de avatar: el clip real traería a OTRA persona, que es la falla más grave.",
      "- ⛔ Tampoco en los planos específicos del truco del video: eso no existe en stock.",
      "- Consulta de 3 a 7 palabras, concreta, nombrando el MATERIAL: `pouring wet concrete into a mould`,",
      "  `hand sanding a concrete surface`, `close up of cement powder`. Nunca `construction` ni `DIY` a secas.",
      "- Si dudás, NO marques: el plano se queda con su imagen IA, que es lo seguro.", "");
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
  inputs: ({ P, style }) => [P.frases, P.dirDir, style.lugares, style.presentador, style.formula],
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
    fs.writeFileSync(P.plan, JSON.stringify(r.plan, null, 1));
    return { archivosDireccion: files.length, ...r.medido };
  },
};
