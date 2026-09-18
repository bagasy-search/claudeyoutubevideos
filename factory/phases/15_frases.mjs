// 15_frases — guion → momentos (una frase = un plano) y secciones, SIN esperar la voz.
// Por qué es una fase aparte (FASE I, 15-sep-2026): la dirección, las imágenes y los clips dependen sólo del
// guion. Separándolo de la transcripción, 30_direct → 40_images → 50_agnes corren EN PARALELO con Fish + ASR;
// el ASR después sólo ancla estos mismos momentos al ms (20_asr) para el avatar y el montaje.
import fs from "node:fs";
import path from "node:path";
import { assertMeasured, assertNoProblems } from "../lib/gate.mjs";
import { frases, secciones } from "../lib/text.mjs";
import { medirDialecto } from "../lib/dialecto.mjs";

export default {
  id: "15_frases",
  deps: ["00_preflight"],
  inputs: ({ spec, style }) => [spec.guion, style.frases, spec.secciones || null, style.dialecto || null],
  async run({ spec, style, P, log }) {
    fs.mkdirSync(path.dirname(P.frases), { recursive: true });
    const guion = fs.readFileSync(spec.guion, "utf8");

    // ── COMPUERTA DE DIALECTO, antes de gastar un centavo en voz/imágenes ──────
    // El clon de voz del canal está entrenado en UN dialecto. Si el guion va en otro, el clon deriva
    // y la locución sale plana. Corre acá porque 15_frases es la primera fase que LEE el guion.
    const D = medirDialecto(guion, style);
    if (!D.pide) log(`dialecto: el estilo no lo pide neutro (midió ${D.palabras} palabras igual)`);
    else {
      log(`dialecto NEUTRO sobre ${D.palabras} palabras · voseo(verbo)=${D.medido.voseoVerbo} · voseo(imper)=${D.medido.voseoImperativo} · regionalismos=${D.medido.regionalismos} · sin tilde=${D.medido.sinTilde}`);
      for (const a of D.avisos.slice(0, 6)) log(`   ⚠ ${a}`);
      assertMeasured("dialectoPalabrasMedidas", D.palabras, { min: 100, log });
      assertNoProblems("dialecto", D.fallas, D.palabras, { log });
    }

    const mom = frases(guion, style.frases);
    assertMeasured("momentos", mom.length, { min: 20, log });
    fs.writeFileSync(P.frases, JSON.stringify(mom, null, 1));
    const secs = secciones(mom, spec.secciones);
    fs.writeFileSync(path.join(path.dirname(P.frases), "secciones.json"), JSON.stringify(secs, null, 1));
    const durs = mom.map((m) => m.dur).sort((a, b) => a - b);
    return { momentos: mom.length, secciones: secs.length, estimadoMin: +(mom.reduce((a, m) => a + m.dur, 0) / 60).toFixed(1), planoMedianaSec: durs[durs.length >> 1], ...D.medido };
  },
};
