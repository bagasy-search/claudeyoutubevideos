// 15_frases — guion → momentos (una frase = un plano) y secciones, SIN esperar la voz.
// Por qué es una fase aparte (FASE I, 15-sep-2026): la dirección, las imágenes y los clips dependen sólo del
// guion. Separándolo de la transcripción, 30_direct → 40_images → 50_agnes corren EN PARALELO con Fish + ASR;
// el ASR después sólo ancla estos mismos momentos al ms (20_asr) para el avatar y el montaje.
import fs from "node:fs";
import path from "node:path";
import { assertMeasured } from "../lib/gate.mjs";
import { frases, secciones } from "../lib/text.mjs";

export default {
  id: "15_frases",
  deps: ["00_preflight"],
  inputs: ({ spec, style }) => [spec.guion, style.frases, spec.secciones || null],
  async run({ spec, style, P, log }) {
    fs.mkdirSync(path.dirname(P.frases), { recursive: true });
    const mom = frases(fs.readFileSync(spec.guion, "utf8"), style.frases);
    assertMeasured("momentos", mom.length, { min: 20, log });
    fs.writeFileSync(P.frases, JSON.stringify(mom, null, 1));
    const secs = secciones(mom, spec.secciones);
    fs.writeFileSync(path.join(path.dirname(P.frases), "secciones.json"), JSON.stringify(secs, null, 1));
    const durs = mom.map((m) => m.dur).sort((a, b) => a - b);
    return { momentos: mom.length, secciones: secs.length, estimadoMin: +(mom.reduce((a, m) => a + m.dur, 0) / 60).toFixed(1), planoMedianaSec: durs[durs.length >> 1] };
  },
};
